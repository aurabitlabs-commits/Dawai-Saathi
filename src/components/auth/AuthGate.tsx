import React, { useCallback, useEffect, useState } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { HeartPulse, Users, UserRound, Plus, Link2, LogOut, ShieldCheck, ArrowRight, LoaderCircle, AlertCircle } from 'lucide-react';
import { isSupabaseConfigured, supabase } from '../../lib/supabase';

type Elder = { id: string; display_name: string; relationship?: string; invite_code?: string };
type LinkRow = { elder_id: string; relationship: string | null; elders: Elder | Elder[] | null };

const copy = {
  hi: {
    tagline: 'दवा याद रहे, परिवार साथ रहे', welcome: 'परिवार के साथ सुरक्षित जुड़ें', subtitle: 'साइन इन करें या अपना खाता बनाएँ। एक केयरगिवर कई बुज़ुर्गों की देखभाल कर सकता है।',
    email: 'ईमेल', password: 'पासवर्ड', name: 'आपका नाम', signIn: 'साइन इन करें', signUp: 'खाता बनाएँ', switch: 'पहले से खाता है? साइन इन करें', new: 'नए हैं? खाता बनाएँ',
    elders: 'जिनकी आप देखभाल करते हैं', eldersSub: 'किसी बुज़ुर्ग को चुनें या एक और जोड़ें।', add: 'बुज़ुर्ग जोड़ें', elderName: 'बुज़ुर्ग का पूरा नाम', create: 'प्रोफ़ाइल बनाएँ', invite: 'जुड़ने का कोड', link: 'कोड से जोड़ें', cancel: 'रद्द करें', signOut: 'साइन आउट', select: 'खोलें', owner: 'आपकी प्रोफ़ाइल', loading: 'लोड हो रहा है…', noElders: 'अभी कोई प्रोफ़ाइल नहीं जुड़ी है। एक बनाएँ या आमंत्रण कोड इस्तेमाल करें।',
    setup: 'डेटाबेस सेटअप आवश्यक है', setupText: 'Supabase प्रोजेक्ट बनाएँ, SQL Editor में supabase/schema.sql चलाएँ और .env में VITE_SUPABASE_URL तथा VITE_SUPABASE_ANON_KEY जोड़ें।', demo: 'डेमो मोड में लॉगिन या डेटा सेव नहीं होगा।',
    authError: 'प्रमाणीकरण पूरा नहीं हो सका। विवरण जाँचें और फिर प्रयास करें।', createSuccess: 'प्रोफ़ाइल बन गई। इस कोड को सुरक्षित रूप से साझा करें:', linked: 'बुज़ुर्ग सफलतापूर्वक जुड़ गए।', codeRequired: 'कृपया आमंत्रण कोड भरें।', nameRequired: 'कृपया नाम भरें।', passwordHint: 'कम से कम 6 अक्षर', relation: 'रिश्ता (जैसे बेटी, बेटा, देखभालकर्ता)', security: 'निजी और सुरक्षित', securityText: 'केवल आपके खाते से जुड़े बुज़ुर्ग ही यहाँ दिखाई देते हैं।'
  },
  en: {
    tagline: 'Medicine reminders, with family by your side', welcome: 'Connect securely with your family', subtitle: 'Sign in or create an account. One caregiver can look after multiple elders.',
    email: 'Email address', password: 'Password', name: 'Your name', signIn: 'Sign in', signUp: 'Create account', switch: 'Already have an account? Sign in', new: 'New here? Create an account',
    elders: 'People in your care', eldersSub: 'Choose an elder or add another person you care for.', add: 'Add an elder', elderName: 'Elder’s full name', create: 'Create profile', invite: 'Invitation code', link: 'Link with code', cancel: 'Cancel', signOut: 'Sign out', select: 'Open profile', owner: 'Your profile', loading: 'Loading…', noElders: 'No elder profiles linked yet. Create one or use an invitation code.',
    setup: 'Database setup required', setupText: 'Create a Supabase project, run supabase/schema.sql in SQL Editor, and add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env.', demo: 'Login and cloud storage are unavailable until configured.',
    authError: 'Authentication failed. Check your details and try again.', createSuccess: 'Profile created. Share this code privately:', codeRequired: 'Please enter an invitation code.', nameRequired: 'Please enter a name.', passwordHint: 'At least 6 characters', relation: 'Relationship (e.g. daughter, son, caregiver)', security: 'Private and secure', securityText: 'Only elders linked to your account are shown here.'
  }
};

export const AuthGate: React.FC<{ children: (user: User, activeElder: Elder) => React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [language, setLanguage] = useState<'hi' | 'en'>('hi');
  const [elders, setElders] = useState<Elder[]>([]);
  const [activeId, setActiveId] = useState('');
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [showAdd, setShowAdd] = useState(false);
  const [showLink, setShowLink] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [elderName, setElderName] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [relationship, setRelationship] = useState('');
  const [createdCode, setCreatedCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const t = copy[language];

  useEffect(() => {
    if (!supabase) { setAuthReady(true); return; }
    supabase.auth.getSession().then(({ data }) => { setSession(data.session); setAuthReady(true); });
    const { data } = supabase.auth.onAuthStateChange((_event, next) => setSession(next));
    return () => data.subscription.unsubscribe();
  }, []);

  const loadElders = useCallback(async (userId: string) => {
    if (!supabase) return;
    const { data: owned, error: ownedError } = await supabase.from('elders').select('id, display_name, invite_code').eq('owner_user_id', userId);
    if (ownedError) throw ownedError;
    const { data: links, error: linksError } = await supabase.from('caregiver_elder_links').select('elder_id, relationship, elders(id, display_name, invite_code)').eq('caregiver_user_id', userId);
    if (linksError) throw linksError;
    const merged = new Map<string, Elder>();
    (owned ?? []).forEach((e: Elder) => merged.set(e.id, e));
    ((links ?? []) as LinkRow[]).forEach((row) => {
      const elder = Array.isArray(row.elders) ? row.elders[0] : row.elders;
      if (elder) merged.set(elder.id, { ...elder, relationship: row.relationship ?? undefined });
    });
    setElders(Array.from(merged.values()));
    setActiveId(current => merged.has(current) ? current : (merged.values().next().value?.id ?? ''));
  }, []);

  useEffect(() => {
    if (!session?.user) { setElders([]); setActiveId(''); return; }
    loadElders(session.user.id).catch(e => setError(e.message || t.authError));
  }, [session?.user?.id, loadElders, t.authError]);

  const submitAuth = async (event: React.FormEvent) => {
    event.preventDefault(); setBusy(true); setError(''); setNotice('');
    try {
      if (!supabase) throw new Error(t.setupText);
      if (mode === 'signin') {
        const { error: e } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
        if (e) throw e;
      } else {
        if (password.length < 6) throw new Error(t.passwordHint);
        const { data, error: e } = await supabase.auth.signUp({ email: email.trim(), password, options: { data: { full_name: fullName.trim() } } });
        if (e) throw e;
        if (!data.session) setNotice(language === 'hi' ? 'ईमेल सत्यापन लिंक के लिए अपना इनबॉक्स देखें, फिर साइन इन करें।' : 'Check your email for a verification link, then sign in.');
      }
    } catch (e) { setError(e instanceof Error ? e.message : t.authError); }
    finally { setBusy(false); }
  };

  const createElder = async (event: React.FormEvent) => {
    event.preventDefault(); if (!session || !supabase) return;
    if (!elderName.trim()) { setError(t.nameRequired); return; }
    setBusy(true); setError(''); setNotice('');
    try {
      const { data, error: e } = await supabase.from('elders').insert({ display_name: elderName.trim(), owner_user_id: session.user.id }).select('id, display_name, invite_code').single();
      if (e) throw e;
      const { error: linkError } = await supabase.from('caregiver_elder_links').insert({ elder_id: data.id, caregiver_user_id: session.user.id, relationship: 'Owner' });
      if (linkError) throw linkError;
      setCreatedCode(data.invite_code); setElderName(''); setShowAdd(false); await loadElders(session.user.id);
      setNotice(t.createSuccess);
    } catch (e) { setError(e instanceof Error ? e.message : t.authError); }
    finally { setBusy(false); }
  };

  const linkElder = async (event: React.FormEvent) => {
    event.preventDefault(); if (!supabase) return;
    if (!inviteCode.trim()) { setError(t.codeRequired); return; }
    setBusy(true); setError(''); setNotice('');
    try {
      const { error: e } = await supabase.rpc('link_elder_by_invite', { p_invite_code: inviteCode.trim().toUpperCase(), p_relationship: relationship.trim() || 'Caregiver' });
      if (e) throw e;
      setInviteCode(''); setRelationship(''); setShowLink(false);
      if (session) await loadElders(session.user.id);
      setNotice(t.linked);
    } catch (e) { setError(e instanceof Error ? e.message : t.authError); }
    finally { setBusy(false); }
  };

  if (!authReady) return <div className="min-h-screen grid place-items-center bg-[#081526] text-white"><LoaderCircle className="animate-spin" /> {t.loading}</div>;
  if (!isSupabaseConfigured || !supabase) return <div className="min-h-screen bg-[#081526] p-5 grid place-items-center text-[#10243A]"><div className="w-full max-w-xl rounded-3xl bg-white p-7 shadow-2xl"><div className="flex items-center gap-3"><HeartPulse className="h-10 w-10 text-teal-700"/><div><h1 className="text-2xl font-extrabold">Dawai Saathi</h1><p className="text-slate-600">{t.tagline}</p></div></div><div className="mt-6 rounded-2xl border border-amber-300 bg-amber-50 p-4"><h2 className="font-bold text-lg">{t.setup}</h2><p className="mt-2">{t.setupText}</p><p className="mt-2 text-sm text-slate-600">{t.demo}</p></div><button onClick={() => setLanguage(language === 'hi' ? 'en' : 'hi')} className="mt-4 rounded-xl border border-slate-300 px-4 py-3 font-bold">{language === 'hi' ? 'English' : 'हिन्दी'}</button></div></div>;

  if (!session) return <div className="min-h-screen bg-[#081526] px-4 py-8 grid place-items-center"><div className="w-full max-w-md overflow-hidden rounded-[28px] bg-white shadow-2xl"><div className="bg-gradient-to-br from-[#10243A] to-[#155E75] p-7 text-white"><div className="flex items-center justify-between"><div className="flex items-center gap-3"><div className="grid h-12 w-12 place-items-center rounded-2xl bg-teal-300 text-[#10243A]"><HeartPulse size={28}/></div><div><p className="text-2xl font-extrabold">Dawai Saathi</p><p className="text-sm text-teal-100">{t.tagline}</p></div></div><button onClick={() => setLanguage(language === 'hi' ? 'en' : 'hi')} className="rounded-xl border border-white/30 px-3 py-2 font-bold">{language === 'hi' ? 'EN' : 'हिं'}</button></div><h1 className="mt-7 text-2xl font-extrabold">{t.welcome}</h1><p className="mt-2 leading-relaxed text-blue-50">{t.subtitle}</p></div><form onSubmit={submitAuth} className="space-y-4 p-6"><div>{mode === 'signup' && <label className="mb-1 block font-bold" htmlFor="fullName">{t.name}</label>}{mode === 'signup' && <input id="fullName" required value={fullName} onChange={e => setFullName(e.target.value)} className="w-full rounded-xl border-2 border-slate-300 px-4 py-3 text-lg" autoComplete="name"/>}<label className="mb-1 block font-bold" htmlFor="email">{t.email}</label><input id="email" required type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full rounded-xl border-2 border-slate-300 px-4 py-3 text-lg" autoComplete="email"/><label className="mb-1 block font-bold" htmlFor="password">{t.password}</label><input id="password" required type="password" minLength={6} value={password} onChange={e => setPassword(e.target.value)} className="w-full rounded-xl border-2 border-slate-300 px-4 py-3 text-lg" autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}/></div>{error && <p role="alert" className="rounded-xl bg-rose-50 p-3 text-rose-900">{error}</p>}{notice && <p role="status" className="rounded-xl bg-teal-50 p-3 text-teal-900">{notice}</p>}<button disabled={busy} className="flex min-h-[56px] w-full items-center justify-center gap-2 rounded-xl bg-[#087E8B] px-4 py-3 text-lg font-extrabold text-white disabled:opacity-60">{busy ? <LoaderCircle className="animate-spin"/> : <ArrowRight/>}{mode === 'signin' ? t.signIn : t.signUp}</button><button type="button" onClick={() => {setMode(mode === 'signin' ? 'signup' : 'signin');setError('');setNotice('');}} className="w-full rounded-xl border-2 border-slate-200 px-4 py-3 font-bold text-[#10243A]">{mode === 'signin' ? t.new : t.switch}</button></form><div className="flex items-center justify-center gap-2 border-t bg-slate-50 p-4 text-sm font-semibold text-slate-600"><ShieldCheck size={18} className="text-teal-700"/>{t.security}</div></div></div>;

  const activeElder = elders.find(e => e.id === activeId);
  return <div className="min-h-screen bg-[#081526] px-4 py-6 text-[#10243A]"><div className="mx-auto max-w-3xl"><header className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-[#10243A] p-5 text-white"><div><p className="text-sm text-teal-200">{t.owner}: {session.user.email}</p><h1 className="text-2xl font-extrabold">{t.elders}</h1><p className="text-blue-100">{t.eldersSub}</p></div><button onClick={() => supabase.auth.signOut()} className="flex min-h-[48px] items-center gap-2 rounded-xl border border-white/30 px-4 py-2 font-bold"><LogOut size={18}/>{t.signOut}</button></header><div className="mb-5 flex flex-wrap gap-3"><button onClick={() => {setShowAdd(v => !v);setShowLink(false);setError('');}} className="flex min-h-[52px] items-center gap-2 rounded-xl bg-teal-300 px-4 py-3 font-extrabold text-[#10243A]"><Plus/>{t.add}</button><button onClick={() => {setShowLink(v => !v);setShowAdd(false);setError('');}} className="flex min-h-[52px] items-center gap-2 rounded-xl border-2 border-[#52718F] bg-[#18334F] px-4 py-3 font-bold text-white"><Link2/>{t.link}</button></div>{showAdd && <form onSubmit={createElder} className="mb-5 rounded-2xl bg-white p-5 shadow-lg"><label className="mb-2 block font-bold" htmlFor="elderName">{t.elderName}</label><input id="elderName" value={elderName} onChange={e => setElderName(e.target.value)} className="w-full rounded-xl border-2 border-slate-300 px-4 py-3 text-lg" required/><button disabled={busy} className="mt-3 min-h-[52px] rounded-xl bg-[#087E8B] px-5 py-3 font-extrabold text-white">{busy ? t.loading : t.create}</button></form>}{showLink && <form onSubmit={linkElder} className="mb-5 grid gap-3 rounded-2xl bg-white p-5 shadow-lg sm:grid-cols-2"><div><label className="mb-2 block font-bold" htmlFor="inviteCode">{t.invite}</label><input id="inviteCode" value={inviteCode} onChange={e => setInviteCode(e.target.value)} className="w-full rounded-xl border-2 border-slate-300 px-4 py-3 text-lg uppercase" required/></div><div><label className="mb-2 block font-bold" htmlFor="relationship">{t.relation}</label><input id="relationship" value={relationship} onChange={e => setRelationship(e.target.value)} className="w-full rounded-xl border-2 border-slate-300 px-4 py-3 text-lg"/></div><button disabled={busy} className="min-h-[52px] rounded-xl bg-[#087E8B] px-5 py-3 font-extrabold text-white sm:col-span-2">{busy ? t.loading : t.link}</button></form>}{error && <p role="alert" className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-4 text-rose-900">{error}</p>}{notice && <p role="status" className="mb-4 rounded-xl border border-teal-200 bg-teal-50 p-4 text-teal-900">{notice} {createdCode && <strong className="ml-1 select-all rounded bg-white px-2 py-1 font-mono tracking-widest">{createdCode}</strong>}</p>}<div className="grid gap-4 sm:grid-cols-2">{elders.map((elder, index) => <button key={elder.id} onClick={() => setActiveId(elder.id)} className={`rounded-2xl border-2 p-5 text-left shadow-lg transition hover:-translate-y-0.5 ${activeId === elder.id ? 'border-teal-300 bg-[#18334F] text-white' : 'border-slate-200 bg-white text-[#10243A]'}`}><div className="flex items-start justify-between"><div className={`grid h-12 w-12 place-items-center rounded-2xl ${activeId === elder.id ? 'bg-teal-300 text-[#10243A]' : 'bg-teal-50 text-teal-800'}`}><UserRound size={25}/></div>{activeId === elder.id && <span className="rounded-full bg-teal-300 px-3 py-1 text-sm font-extrabold text-[#10243A]">Selected</span>}</div><h2 className="mt-4 text-xl font-extrabold">{elder.display_name}</h2><p className={`mt-1 text-sm ${activeId === elder.id ? 'text-blue-100' : 'text-slate-600'}`}>{elder.relationship || t.owner}</p><span className="mt-4 inline-flex items-center gap-2 font-bold">{t.select}<ArrowRight size={18}/></span></button>)}</div>{elders.length === 0 && <div className="rounded-2xl border-2 border-dashed border-[#52718F] bg-[#10243A] p-8 text-center text-white"><Users size={40} className="mx-auto text-teal-300"/><p className="mt-3 text-lg font-bold">{t.noElders}</p></div>}<div className="mt-5 flex items-center gap-3 rounded-2xl border border-[#294966] bg-[#10243A] p-4 text-white"><ShieldCheck className="shrink-0 text-teal-300"/><div><p className="font-bold">{t.security}</p><p className="text-sm text-blue-100">{t.securityText}</p></div></div>{activeElder && <div className="mt-4 rounded-xl bg-teal-50 p-3 text-sm text-teal-900">Selected: <strong>{activeElder.display_name}</strong> — connected to this account.</div>}</div></div>;
};
