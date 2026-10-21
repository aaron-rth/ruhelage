// Optionales Konto (Supabase): Anmeldung per E-Mail, Fortschritt zwischen Geräten synchronisieren.
// Ohne Konto bleibt alles wie bisher lokal. Die Bibliothek wird erst geladen, wenn sie gebraucht wird.
import type { SupabaseClient } from '@supabase/supabase-js';
import { create } from 'zustand';
import { datenAus, migriere, SCHEMA_VERSION, useStore } from '../store/store';
import { fuehreZusammen } from './zusammenfuehren';

// Öffentliche Werte – dürfen im Code stehen. Den Schutz übernehmen die Regeln in supabase/schema.sql.
const URL = 'https://raplowjyzrqpostibikb.supabase.co';
const KEY = 'sb_publishable_TtkOMN83nArXQdbzDPzeHA_NGMpTGZr';
const SPEICHER_KEY = 'sb-raplowjyzrqpostibikb-auth-token';

interface KontoStand {
  email: string | null;
  /** 'aus' = nicht angemeldet, 'sync' = synchronisiert gerade */
  status: 'aus' | 'an' | 'sync' | 'fehler';
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
  s.auth.onAuthStateChange((_e, session) => {
    useKonto.setState({ email: session?.user.email ?? null, status: session ? (useKonto.getState().status === 'sync' ? 'sync' : 'an') : 'aus' });
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

let laeuft = false;

/** Cloud holen, mit dem Gerät zusammenführen, Ergebnis lokal übernehmen und hochladen. */
export async function synchronisiere(): Promise<void> {
  if (laeuft || useKonto.getState().status === 'aus') return;
  laeuft = true;
  useKonto.setState({ status: 'sync', fehler: null });
  try {
    const s = await sb();
    const { data: u } = await s.auth.getUser();
    if (!u.user) {
      useKonto.setState({ status: 'aus', email: null });
      return;
    }
    const { data, error } = await s.from('fortschritt').select('daten').eq('user_id', u.user.id).maybeSingle();
    if (error) throw error;
    const lokal = datenAus(useStore.getState());
    const zusammen = data ? fuehreZusammen(lokal, migriere(data.daten, SCHEMA_VERSION)) : lokal;
    const neu = JSON.stringify(zusammen);
    if (neu !== JSON.stringify(lokal)) useStore.getState().importiere(zusammen);
    if (!data || neu !== JSON.stringify(migriere(data.daten, SCHEMA_VERSION))) {
      const { error: e2 } = await s.from('fortschritt').upsert({ user_id: u.user.id, daten: zusammen, aktualisiert: new Date().toISOString() });
      if (e2) throw e2;
    }
    useKonto.setState({ status: 'an', zuletzt: Date.now() });
  } catch (e) {
    useKonto.setState({ status: 'fehler', fehler: fehlerText(e instanceof Error ? e.message : String(e)) });
  } finally {
    laeuft = false;
  }
}

let geplant: number | null = null;

/** Nach Änderungen: höchstens alle 30 s synchronisieren, beim Verlassen der App sofort. */
export function syncPlanen() {
  if (useKonto.getState().status === 'aus' || geplant !== null) return;
  geplant = window.setTimeout(() => {
    geplant = null;
    void synchronisiere();
  }, 30_000);
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
