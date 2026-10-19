import React, { useCallback, useEffect, useState } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { HeartPulse, Users, UserRound, Plus, Link2, LogOut, ShieldCheck, ArrowRight, LoaderCircle } from 'lucide-react';
import { isSupabaseConfigured, supabase } from './supabaseClient';

type Elder = { id: string; display_name: string; invite_code: string; relationship?: string };
type LinkRow = { elder_id: string; relationship: string | null; elders: Elder | Elder[] | null };

export const AuthGate: React.FC<{ children: (user: User, activeElder: Elder) => React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);
  const [lang, setLang] = useState<'hi' | 'en'>('hi');
  const [elders, setElders] = useState<Elder[]>([]);
  const [activeId, setActiveId] = useState('');
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [showAdd, setShowAdd] = useState(false);
  const [showLink, setShowLink] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [elderName, setElderName] = useState('');
  const [invite, setInvite] = useState('');
  const [relationship, setRelationship] = useState('');
  const [createdCode, setCreatedCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const hi = lang === 'hi';
  const tr = (en: string, hindi: string) => hi ? hindi : en;

  useEffect(() => {
    if (!supabase) { setReady(true); return; }
    supabase.auth.getSession().then(({ data }) => { setSession(data.session); setReady(true); });
    const { data } = supabase.auth.onAuthStateChange((_event, next) => setSession(next));
    return () => data.subscription.unsubscribe();
  }, []);

  const loadElders = useCallback(async (uid: string) => {
    if (!supabase) return;
    const [owned, linked] = await Promise.all([
      supabase.from('elders').select('id,display_name,invite_code').eq('owner_user_id', uid),
      supabase.from('caregiver_elder_links').select('elder_id,relationship,elders(id,display_name,invite_code)').eq('caregiver_user_id', uid)
    ]);
    if (owned.error) throw owned.error;
    if (linked.error) throw linked.error;
    const all = new Map<string, Elder>();
    (owned.data ?? []).forEach((e: Elder) => all.set(e.id, e));
    ((linked.data ?? []) as LinkRow[]).forEach(row => {
      const e = Array.isArray(row.elders) ? row.elders[0] : row.elders;
      if (e) all.set(e.id, { ...e, relationship: row.relationship ?? undefined });
    });
    setElders([...all.values()]);
    setActiveId(current => all.has(current) ? current : ([...all.keys()][0] ?? ''));
  }, []);

  useEffect(() => {
    if (!session?.user) { setElders([]); setActiveId(''); return; }
    loadElders(session.user.id).catch(e => setError(e.message));
  }, [session?.user?.id, loadElders]);

  const auth = async (event: React.FormEvent) => {
    event.preventDefault(); if (!supabase) return;
    setBusy(true); setError(''); setNotice('');
    try {
      if (mode === 'signin') {
        const { error: e } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
        if (e) throw e;
      } else {
        const { data, error: e } = await supabase.auth.signUp({ email: email.trim(), password, options: { data: { full_name: fullName.trim() } } });
        if (e) throw e;
        if (!data.session) setNotice(tr('Check your email to verify your account, then sign in.', 'ईमेल सत्यापन लिंक के लिए अपना इनबॉक्स देखें, फिर साइन इन करें।'));
      }
    } catch (e) { setError(e instanceof Error ? e.message : tr('Authentication failed.', 'प्रमाणीकरण विफल हुआ।')); }
    finally { setBusy(false); }
  };

  const addElder = async (event: React.FormEvent) => {
    event.preventDefault(); if (!supabase || !session) return;
    setBusy(true); setError(''); setNotice('');
    try {
      const { data, error: e } = await supabase.from('elders').insert({ display_name: elderName.trim(), owner_user_id: session.user.id }).select('id,display_name,invite_code').single();
      if (e) throw e;
      const { error: linkError } = await supabase.from('caregiver_elder_links').insert({ elder_id: data.id, caregiver_user_id: session.user.id, relationship: 'Owner' });
      if (linkError) throw linkError;
      setCreatedCode(data.invite_code); setElderName(''); setShowAdd(false);
      await loadElders(session.user.id);
      setNotice(tr('Elder profile created. Save and share the invitation code privately:', 'बुज़ुर्ग की प्रोफ़ाइल बन गई। आमंत्रण कोड सुरक्षित रूप से साझा करें:'));
    } catch (e) { setError(e instanceof Error ? e.message : tr('Could not create profile.', 'प्रोफ़ाइल नहीं बन सकी।')); }
    finally { setBusy(false); }
  };

  const linkElder = async (event: React.FormEvent) => {
    event.preventDefault(); if (!supabase || !session) return;
    setBusy(true); setError(''); setNotice('');
    try {
      const { error: e } = await supabase.rpc('link_elder_by_invite', { p_invite_code: invite.trim().toUpperCase(), p_relationship: relationship.trim() || 'Caregiver' });
      if (e) throw e;
      setInvite(''); setRelationship(''); setShowLink(false); await loadElders(session.user.id);
      setNotice(tr('Elder linked to your account.', 'बुज़ुर्ग की प्रोफ़ाइल आपके खाते से जुड़ गई।'));
    } catch (e) { setError(e instanceof Error ? e.message : tr('Could not link profile.', 'प्रोफ़ाइल नहीं जुड़ सकी।')); }
    finally { setBusy(false); }
  };

  const shell = 'w-full rounded-2xl border-2 border-slate-200 px-4 py-3 text-lg text-[#10243A] focus:border-teal-600';
  if (!ready) return <div className="grid min-h-screen place-items-center bg-[#081526] text-white"><LoaderCircle className="animate-spin"/></div>;
  if (!isSupabaseConfigured || !supabase) return <div className="grid min-h-screen place-items-center bg-[#081526] p-5"><div className="w-full max-w-xl rounded-3xl bg-white p-7"><HeartPulse size={42} className="text-teal-700"/><h1 className="mt-3 text-2xl font-extrabold">Dawai Saathi</h1><h2 className="mt-5 text-xl font-bold">{tr('Database setup required','डेटाबेस सेटअप आवश्यक है')}</h2><p className="mt-2 leading-relaxed">{tr('Create a Supabase project, run supabase-schema.sql in its SQL Editor, and set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file. Never use the service_role key in the browser.','Supabase प्रोजेक्ट बनाएँ, SQL Editor में supabase-schema.sql चलाएँ और .env में VITE_SUPABASE_URL तथा VITE_SUPABASE_ANON_KEY जोड़ें। ब्राउज़र में service_role key न डालें।')}</p><button onClick={() => setLang(hi ? 'en' : 'hi')} className="mt-4 rounded-xl border px-4 py-3 font-bold">{hi ? 'English' : 'हिन्दी'}</button></div></div>;

  if (!session) return <div className="grid min-h-screen place-items-center bg-[#081526] p-4"><div className="w-full max-w-md overflow-hidden rounded-[28px] bg-white shadow-2xl"><div className="bg-gradient-to-br from-[#10243A] to-[#155E75] p-7 text-white"><div className="flex items-center justify-between"><HeartPulse size={40} className="text-teal-300"/><button onClick={() => setLang(hi ? 'en' : 'hi')} className="rounded-xl border border-white/30 px-3 py-2 font-bold">{hi ? 'EN' : 'हिं'}</button></div><h1 className="mt-4 text-3xl font-extrabold">Dawai Saathi</h1><p className="mt-1 text-teal-100">{tr('Medicine reminders, with family by your side','दवा याद रहे, परिवार साथ रहे')}</p><h2 className="mt-6 text-xl font-bold">{tr('Connect securely with your family','परिवार के साथ सुरक्षित जुड़ें')}</h2><p className="mt-2">{tr('One caregiver can manage two or more elder profiles.','एक केयरगिवर दो या अधिक बुज़ुर्गों की देखभाल कर सकता है।')}</p></div><form onSubmit={auth} className="space-y-4 p-6">{mode === 'signup' && <div><label htmlFor="ds-name" className="mb-1 block font-bold">{tr('Your name','आपका नाम')}</label><input id="ds-name" className={shell} value={fullName} onChange={e=>setFullName(e.target.value)} required autoComplete="name"/></div>}<div><label htmlFor="ds-email" className="mb-1 block font-bold">{tr('Email address','ईमेल')}</label><input id="ds-email" type="email" className={shell} value={email} onChange={e=>setEmail(e.target.value)} required autoComplete="email"/></div><div><label htmlFor="ds-password" className="mb-1 block font-bold">{tr('Password','पासवर्ड')}</label><input id="ds-password" type="password" minLength={6} className={shell} value={password} onChange={e=>setPassword(e.target.value)} required autoComplete={mode==='signin'?'current-password':'new-password'}/></div>{error && <p role="alert" className="rounded-xl bg-rose-50 p-3 text-rose-900">{error}</p>}{notice && <p role="status" className="rounded-xl bg-teal-50 p-3 text-teal-900">{notice}</p>}<button disabled={busy} className="flex min-h-[56px] w-full items-center justify-center gap-2 rounded-xl bg-[#087E8B] px-4 py-3 text-lg font-extrabold text-white disabled:opacity-60">{busy ? <LoaderCircle className="animate-spin"/> : <ArrowRight/>}{mode==='signin'?tr('Sign in','साइन इन करें'):tr('Create account','खाता बनाएँ')}</button><button type="button" onClick={()=>{setMode(mode==='signin'?'signup':'signin');setError('');setNotice('');}} className="w-full rounded-xl border-2 border-slate-200 px-4 py-3 font-bold">{mode==='signin'?tr('New here? Create an account','नए हैं? खाता बनाएँ'):tr('Already have an account? Sign in','पहले से खाता है? साइन इन करें')}</button></form><div className="flex items-center justify-center gap-2 border-t bg-slate-50 p-4 text-sm font-semibold text-slate-600"><ShieldCheck size={18} className="text-teal-700"/>{tr('Private account access','निजी और सुरक्षित खाता')}</div></div></div>;

  const active = elders.find(e => e.id === activeId);
  return <div className="min-h-screen bg-[#081526] p-4 py-6 text-[#10243A] sm:p-6"><div className="mx-auto max-w-4xl"><header className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-3xl bg-[#10243A] p-5 text-white shadow-xl"><div><p className="text-sm text-teal-200">{session.user.email}</p><h1 className="text-2xl font-extrabold">{tr('People in your care','जिनकी आप देखभाल करते हैं')}</h1><p className="text-blue-100">{tr('Select a profile, or link another elder.','प्रोफ़ाइल चुनें या एक और बुज़ुर्ग जोड़ें।')}</p></div><button onClick={() => supabase.auth.signOut()} className="flex min-h-[48px] items-center gap-2 rounded-xl border border-white/30 px-4 py-2 font-bold"><LogOut size={18}/>{tr('Sign out','साइन आउट')}</button></header><div className="mb-5 flex flex-wrap gap-3"><button onClick={()=>{setShowAdd(v=>!v);setShowLink(false);setError('');}} className="flex min-h-[52px] items-center gap-2 rounded-xl bg-teal-300 px-4 py-3 font-extrabold text-[#10243A]"><Plus/>{tr('Add an elder','बुज़ुर्ग जोड़ें')}</button><button onClick={()=>{setShowLink(v=>!v);setShowAdd(false);setError('');}} className="flex min-h-[52px] items-center gap-2 rounded-xl border-2 border-[#52718F] bg-[#18334F] px-4 py-3 font-bold text-white"><Link2/>{tr('Link with invitation code','कोड से जोड़ें')}</button></div>{showAdd && <form onSubmit={addElder} className="mb-5 rounded-2xl bg-white p-5 shadow-lg"><label htmlFor="ds-elder-name" className="mb-2 block font-bold">{tr('Elder’s full name','बुज़ुर्ग का पूरा नाम')}</label><input id="ds-elder-name" className={shell} value={elderName} onChange={e=>setElderName(e.target.value)} required/><button disabled={busy} className="mt-3 min-h-[52px] rounded-xl bg-[#087E8B] px-5 py-3 font-extrabold text-white">{busy?tr('Saving…','सेव हो रहा है…'):tr('Create profile','प्रोफ़ाइल बनाएँ')}</button></form>}{showLink && <form onSubmit={linkElder} className="mb-5 grid gap-3 rounded-2xl bg-white p-5 shadow-lg sm:grid-cols-2"><div><label htmlFor="ds-invite" className="mb-2 block font-bold">{tr('Invitation code','आमंत्रण कोड')}</label><input id="ds-invite" className={shell+' uppercase'} value={invite} onChange={e=>setInvite(e.target.value)} required/></div><div><label htmlFor="ds-relation" className="mb-2 block font-bold">{tr('Relationship','रिश्ता')}</label><input id="ds-relation" className={shell} value={relationship} onChange={e=>setRelationship(e.target.value)} placeholder={tr('Daughter, son, caregiver','बेटी, बेटा, देखभालकर्ता')}/></div><button disabled={busy} className="min-h-[52px] rounded-xl bg-[#087E8B] px-5 py-3 font-extrabold text-white sm:col-span-2">{busy?tr('Linking…','जुड़ रहा है…'):tr('Link elder','बुज़ुर्ग जोड़ें')}</button></form>}{error && <p role="alert" className="mb-4 rounded-xl bg-rose-50 p-4 text-rose-900">{error}</p>}{notice && <p role="status" className="mb-4 rounded-xl bg-teal-50 p-4 text-teal-900">{notice} {createdCode && <strong className="ml-2 select-all rounded bg-white px-2 py-1 font-mono tracking-widest">{createdCode}</strong>}</p>}<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{elders.map(e=><button key={e.id} onClick={()=>setActiveId(e.id)} className={`min-h-[190px] rounded-2xl border-2 p-5 text-left shadow-lg transition hover:-translate-y-0.5 ${activeId===e.id?'border-teal-300 bg-[#18334F] text-white':'border-slate-200 bg-white text-[#10243A]'}`}><div className="flex items-start justify-between"><span className={`grid h-12 w-12 place-items-center rounded-2xl ${activeId===e.id?'bg-teal-300 text-[#10243A]':'bg-teal-50 text-teal-800'}`}><UserRound size={25}/></span>{activeId===e.id&&<span className="rounded-full bg-teal-300 px-3 py-1 text-sm font-extrabold text-[#10243A]">{tr('Selected','चुना गया')}</span>}</div><h2 className="mt-4 text-xl font-extrabold">{e.display_name}</h2><p className={`mt-1 text-sm ${activeId===e.id?'text-blue-100':'text-slate-600'}`}>{e.relationship || tr('Your elder profile','आपकी बुज़ुर्ग प्रोफ़ाइल')}</p><span className="mt-4 inline-flex items-center gap-2 font-bold">{tr('Open profile','प्रोफ़ाइल खोलें')}<ArrowRight size={18}/></span></button>)}</div>{elders.length===0&&<div className="rounded-2xl border-2 border-dashed border-[#52718F] bg-[#10243A] p-8 text-center text-white"><Users size={40} className="mx-auto text-teal-300"/><p className="mt-3 text-lg font-bold">{tr('No profiles linked yet. Create one or use an invitation code.','अभी कोई प्रोफ़ाइल नहीं जुड़ी है। एक बनाएँ या आमंत्रण कोड इस्तेमाल करें।')}</p></div>}<div className="mt-5 flex items-center gap-3 rounded-2xl border border-[#294966] bg-[#10243A] p-4 text-white"><ShieldCheck className="shrink-0 text-teal-300"/><div><p className="font-bold">{tr('Private account access','निजी और सुरक्षित खाता')}</p><p className="text-sm text-blue-100">{tr('Only elders linked to your account appear here. A caregiver can link multiple elders.','यहाँ केवल आपके खाते से जुड़े बुज़ुर्ग दिखते हैं। एक केयरगिवर कई बुज़ुर्गों से जुड़ सकता है।')}</p></div></div>{active && <div className="mt-4 rounded-xl bg-teal-50 p-3 text-sm text-teal-900">{tr('Selected profile:','चुनी गई प्रोफ़ाइल:')} <strong>{active.display_name}</strong></div>}</div></div>;
};
