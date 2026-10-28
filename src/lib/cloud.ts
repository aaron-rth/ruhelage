// Optionales Konto (Supabase): Anmeldung per E-Mail, Fortschritt zwischen Geräten synchronisieren.
// Ohne Konto bleibt alles wie bisher lokal. Die Bibliothek wird erst geladen, wenn sie gebraucht wird.
import type { SupabaseClient } from '@supabase/supabase-js';
import { create } from 'zustand';
import { datenAus, migriere, SCHEMA_VERSION, useStore } from '../store/store';
import { useLaufend, type LaufendDaten } from '../store/laufend';
import { fuehreLaufendZusammen, fuehreZusammen } from './zusammenfuehren';

// Öffentliche Werte – dürfen im Code stehen. Den Schutz übernehmen die Regeln in supabase/schema.sql.
const URL = 'https://raplowjyzrqpostibikb.supabase.co';
const KEY = 'sb_publishable_TtkOMN83nArXQdbzDPzeHA_NGMpTGZr';
const SPEICHER_KEY = 'sb-raplowjyzrqpostibikb-auth-token';

interface KontoStand {
  email: string | null;
  /** 'aus' = nicht angemeldet, 'sync' = synchronisiert gerade, 'offline' = angemeldet, aber keine Verbindung */
  status: 'aus' | 'an' | 'sync' | 'offline' | 'fehler';
  zuletzt: number | null;
  fehler: string | null;
}

export const useKonto = create<KontoStand>()(() => ({ email: null, status: 'aus', zuletzt: null, fehler: null }));

let client: Promise<SupabaseClient> | null = null;

function sb(): Promise<SupabaseClient> {
  client ??= import('@supabase/supabase-js').then(({ createClient }) =>
    createClient(URL, KEY, { auth: { flowType: 'pkce', persistSession: true, detectSessionInUrl: true, autoRefreshToken: true } }),
  );
  return client;
}

let beobachtet = false;
function beobachte(s: SupabaseClient) {
  if (beobachtet) return;
  beobachtet = true;
  s.auth.onAuthStateChange((ereignis, session) => {
    if (!session && ereignis !== 'SIGNED_OUT') return; // z. B. fehlgeschlagene Erneuerung offline: Sitzung bleibt
    const alt = useKonto.getState().status;
    useKonto.setState({ email: session?.user.email ?? null, status: session ? (alt === 'sync' || alt === 'offline' ? alt : 'an') : 'aus' });
    // nicht direkt im Callback weitere Supabase-Aufrufe starten
    if (session) window.setTimeout(() => void synchronisiere(), 0);
  });
}

/** Beim Start nur laden, wenn es eine Sitzung gibt oder gerade ein Anmeldelink geöffnet wurde. */
export async function kontoStarten() {
  let hatSitzung = false;
  try {
    hatSitzung = !!localStorage.getItem(SPEICHER_KEY);
  } catch {
    /* kein Speicher */
  }
  const ausLink = new URLSearchParams(location.search).has('code');
  if (!hatSitzung && !ausLink) return;
  const s = await sb();
  beobachte(s);
  const { data } = await s.auth.getSession();
  if (ausLink) history.replaceState(null, '', location.pathname + location.hash);
  if (data.session) {
    useKonto.setState({ email: data.session.user.email ?? null, status: 'an' });
    void synchronisiere();
  }
}

export async function codeSenden(email: string): Promise<string | null> {
  const s = await sb();
  beobachte(s);
  const { error } = await s.auth.signInWithOtp({ email, options: { emailRedirectTo: location.origin + location.pathname, shouldCreateUser: true } });
  return error ? fehlerText(error.message) : null;
}

export async function codePruefen(email: string, code: string): Promise<string | null> {
  const s = await sb();
  const { error } = await s.auth.verifyOtp({ email, token: code.trim(), type: 'email' });
  if (error) return fehlerText(error.message);
  beobachte(s);
  const { data } = await s.auth.getSession();
  useKonto.setState({ email: data.session?.user.email ?? email, status: 'an' });
  void synchronisiere();
  return null;
}

export async function abmelden() {
  const s = await sb();
  await synchronisiere();
  await s.auth.signOut();
  useKonto.setState({ email: null, status: 'aus', zuletzt: null });
}

/** Löscht den Fortschritt in der Cloud (lokal bleibt alles) und meldet ab. */
export async function cloudLoeschen(): Promise<string | null> {
  const s = await sb();
  const { data } = await s.auth.getUser();
  if (!data.user) return 'Nicht angemeldet.';
  const { error } = await s.from('fortschritt').delete().eq('user_id', data.user.id);
  if (error) return fehlerText(error.message);
  await s.auth.signOut();
  useKonto.setState({ email: null, status: 'aus', zuletzt: null });
  return null;
}

/**
 * Was bedeutet ein Fehler beim Synchronisieren? Nur eine wirklich ungültige Sitzung meldet ab –
 * fehlende Verbindung ist ein Synchronisierungsproblem, kein Abmelden.
 */
export function syncFehlerArt(e: { message?: string; status?: number; name?: string } | null | undefined, online: boolean): 'offline' | 'abgemeldet' | 'fehler' {
  const m = `${e?.name ?? ''} ${e?.message ?? ''}`;
  if (!online || /fetch|network|load failed|timeout|offline/i.test(m) || e?.status === 0) return 'offline';
  if (e?.status === 401 || e?.status === 403 || /session.*missing|invalid.*(jwt|token)|refresh token|jwt expired/i.test(m)) return 'abgemeldet';
  return 'fehler';
}

let laeuft = false;

/** Cloud holen, mit dem Gerät zusammenführen, Ergebnis lokal übernehmen und hochladen. */
export async function synchronisiere(): Promise<void> {
  if (laeuft || useKonto.getState().status === 'aus') return;
  if (!navigator.onLine) {
    useKonto.setState({ status: 'offline', fehler: null });
    return;
  }
  laeuft = true;
  useKonto.setState({ status: 'sync', fehler: null });
  try {
    const s = await sb();
    // Sitzung lokal lesen (kein Netz nötig) – getUser() würde offline „kein Benutzer“ liefern
    const { data: sitz } = await s.auth.getSession();
    const uid = sitz.session?.user.id;
    if (!uid) {
      useKonto.setState({ status: 'aus', email: null });
      return;
    }
    const { data, error } = await s.from('fortschritt').select('daten').eq('user_id', uid).maybeSingle();
    if (error) throw error;
    // In der Cloud liegt der Lernfortschritt plus „laufend“ (Angefangenes) in einem Objekt
    const roh = (data?.daten ?? null) as (Record<string, unknown> & { laufend?: LaufendDaten }) | null;
    const { laufend: cloudLaufend, ...cloudRest } = roh ?? {};
    const cloud = roh ? migriere(cloudRest, SCHEMA_VERSION) : null;

    const lokal = datenAus(useStore.getState());
    const zusammen = cloud ? fuehreZusammen(lokal, cloud) : lokal;
    const neu = JSON.stringify(zusammen);
    if (neu !== JSON.stringify(lokal)) useStore.getState().importiere(zusammen);

    const l = useLaufend.getState();
    const lokalLaufend: LaufendDaten = { merk: l.merk, aktuell: l.aktuell, weg: l.weg ?? {} };
    const laufend = cloudLaufend ? fuehreLaufendZusammen(lokalLaufend, cloudLaufend) : lokalLaufend;
    const neuLaufend = JSON.stringify(laufend);
    if (neuLaufend !== JSON.stringify(lokalLaufend)) useLaufend.setState(laufend);

    if (!cloud || neu !== JSON.stringify(cloud) || neuLaufend !== JSON.stringify(cloudLaufend ?? null)) {
      const { error: e2 } = await s.from('fortschritt').upsert({ user_id: uid, daten: { ...zusammen, laufend }, aktualisiert: new Date().toISOString() });
      if (e2) throw e2;
    }
    useKonto.setState({ status: 'an', zuletzt: Date.now() });
  } catch (e) {
    const err = e as { message?: string; status?: number; name?: string; code?: string };
    const art = syncFehlerArt({ ...err, status: err.status ?? (err.code === 'PGRST301' ? 401 : undefined) }, navigator.onLine);
    if (art === 'offline') useKonto.setState({ status: 'offline', fehler: null });
    else if (art === 'abgemeldet') useKonto.setState({ status: 'fehler', fehler: 'Deine Anmeldung ist abgelaufen. Bitte melde dich neu an.' });
    else useKonto.setState({ status: 'fehler', fehler: fehlerText(err.message ?? String(e)) });
  } finally {
    laeuft = false;
  }
}

let geplant: number | null = null;

/** Nach Änderungen: höchstens alle 30 s synchronisieren, beim Verlassen der App sofort. */
export function syncPlanen() {
  if (useKonto.getState().status === 'aus' || !navigator.onLine || geplant !== null) return;
  geplant = window.setTimeout(() => {
    geplant = null;
    void synchronisiere();
  }, 30_000);
}

/** Sobald die Verbindung zurück ist, wieder abgleichen. */
export function beiOnline() {
  if (useKonto.getState().status === 'offline') syncSofort();
}

export function syncSofort() {
  if (geplant !== null) {
    window.clearTimeout(geplant);
    geplant = null;
  }
  void synchronisiere();
}

function fehlerText(m: string): string {
  if (/rate limit|too many/i.test(m)) return 'Zu viele Anfragen – bitte warte ein paar Minuten und versuch es dann nochmal.';
  if (/expired|invalid/i.test(m)) return 'Der Code ist falsch oder abgelaufen. Fordere einen neuen an.';
  if (/fetch|network/i.test(m)) return 'Keine Verbindung zum Server – bitte später nochmal versuchen.';
  return m;
}
