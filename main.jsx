import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  BookOpen, GraduationCap, Users, School, Search, Download, UploadCloud,
  Coins, Sparkles, Trophy, ArrowRight, Menu, X, Moon, Sun, ChevronDown,
  MessageCircle, ShieldCheck, FileText, Heart, Bell, CheckCircle2, Send,
  Bookmark, BookMarked, ChartNoAxesCombined, CalendarDays, UserRound,
  Mail, LockKeyhole, Plus, CircleHelp, ExternalLink, Stars, Compass
} from 'lucide-react';
import badge from '../assets/gaceb-badge.png';
import './styles.css';

const seedResources = [
  { id: 1, title: 'Senior Four Mathematics Revision Pack', level: 'O-Level', category: 'Sciences', subject: 'Mathematics', type: 'Revision Pack', size: '2.4 MB', downloads: 1240, premium: false, author: 'GACEB Scholar Team' },
  { id: 2, title: 'Biology: Ecology & Environment Notes', level: 'O-Level', category: 'Sciences', subject: 'Biology', type: 'Notes', size: '1.8 MB', downloads: 864, premium: false, author: 'Student Contributor' },
  { id: 3, title: 'UACE Physics Practice Questions', level: 'A-Level', category: 'Sciences', subject: 'Physics', type: 'Exercises', size: '3.1 MB', downloads: 632, premium: true, author: 'Teacher Contributor' },
  { id: 4, title: 'History of East Africa Study Notes', level: 'A-Level', category: 'Arts', subject: 'History', type: 'Notes', size: '1.2 MB', downloads: 578, premium: false, author: 'Student Contributor' },
  { id: 5, title: 'Geography Mapwork Practice', level: 'O-Level', category: 'Humanities', subject: 'Geography', type: 'Exercises', size: '4.0 MB', downloads: 491, premium: true, author: 'Teacher Contributor' },
  { id: 6, title: 'Chemistry Calculations Made Clear', level: 'A-Level', category: 'Sciences', subject: 'Chemistry', type: 'Revision Pack', size: '2.7 MB', downloads: 455, premium: false, author: 'GACEB Scholar Team' }
];

function App() {
  const [page, setPage] = useState('Home');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const [query, setQuery] = useState('');
  const [level, setLevel] = useState('All');
  const [category, setCategory] = useState('All');
  const [showUpload, setShowUpload] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState('Create account');
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [assistantText, setAssistantText] = useState('');
  const [assistantMessages, setAssistantMessages] = useState([{ from: 'gauge', text: 'Hello, Scholar! 👋 I’m Gauge Assistant. Ask me about resources, study planning, or how to earn coins.' }]);
  const [resources, setResources] = useState(seedResources);
  const [coins, setCoins] = useState(25);
  const [toast, setToast] = useState('');
  const [saved, setSaved] = useState([]);
  const [uploadForm, setUploadForm] = useState({ title: '', level: 'O-Level', category: 'Sciences', subject: 'Mathematics', type: 'Notes', file: null });
  const [authForm, setAuthForm] = useState({ name: '', email: '', role: 'Student', school: '' });
  const [signedIn, setSignedIn] = useState(false);
  const [theme, setTheme] = useState('gold');

  const navItems = ['Home', 'Resources', 'Schools', 'Funding', 'About GACEB'];
  const notify = (msg) => { setToast(msg); window.setTimeout(() => setToast(''), 3000); };
  const go = (p) => { setPage(p); setMobileOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  const filteredResources = useMemo(() => resources.filter(r =>
    (level === 'All' || r.level === level) &&
    (category === 'All' || r.category === category) &&
    `${r.title} ${r.subject} ${r.type} ${r.level}`.toLowerCase().includes(query.toLowerCase())
  ), [resources, level, category, query]);

  const openProtected = (callback) => {
    if (!signedIn) { setAuthMode('Create account'); setShowAuth(true); notify('Create an account to access your Scholar workspace.'); }
    else callback?.();
  };

  const submitAuth = (e) => {
    e.preventDefault();
    if (!authForm.email.trim()) return;
    setSignedIn(true);
    setShowAuth(false);
    notify(`Welcome to GACEB Scholar${authForm.name ? ', ' + authForm.name.split(' ')[0] : ''}!`);
    if (authForm.role === 'Teacher') setPage('Teacher dashboard');
    else setPage('Student dashboard');
  };

  const submitUpload = (e) => {
    e.preventDefault();
    if (!signedIn) { setShowUpload(false); setShowAuth(true); notify('Create an account before uploading a PDF.'); return; }
    if (!uploadForm.title.trim() || !uploadForm.file) { notify('Add a title and choose a PDF file first.'); return; }
    if (uploadForm.file.type !== 'application/pdf' && !uploadForm.file.name.toLowerCase().endsWith('.pdf')) { notify('Please select a PDF file.'); return; }
    const newResource = { id: Date.now(), title: uploadForm.title, level: uploadForm.level, category: uploadForm.category, subject: uploadForm.subject, type: uploadForm.type, size: `${(uploadForm.file.size / 1024 / 1024).toFixed(1)} MB`, downloads: 0, premium: false, author: authForm.name || 'You', pending: true, fileName: uploadForm.file.name };
    setResources(prev => [newResource, ...prev]);
    setShowUpload(false);
    setUploadForm({ title: '', level: 'O-Level', category: 'Sciences', subject: 'Mathematics', type: 'Notes', file: null });
    notify('PDF submitted for review. You’ll earn 5 coins when it is approved.');
  };

  const sendAssistant = (e) => {
    e.preventDefault();
    const q = assistantText.trim();
    if (!q) return;
    const answer = /coin|invite|upload/i.test(q)
      ? 'You earn 5 coins for every PDF upload approved by the GACEB Scholar review team, and 5 coins for each successful invite. Coins can unlock eligible premium learning resources. Please share only material you created or have permission to distribute.'
      : /resource|paper|notes|download/i.test(q)
      ? 'Open Resources and filter by O-Level or A-Level, then choose the category and subject. Create an account to use member features and download protected materials.'
      : /study|revision|plan/i.test(q)
      ? 'Try a focused study block: choose one topic, review your notes, answer practice questions, then mark what you need to revisit. Use the resource filters to find materials for your level.'
      : 'I can help you navigate O-Level and A-Level resources, plan revision, understand the coin system, and get started with GACEB Scholar. What subject are you working on?';
    setAssistantMessages(prev => [...prev, { from: 'user', text: q }, { from: 'gauge', text: answer }]);
    setAssistantText('');
  };

  const downloadResource = (r) => {
    if (r.pending) { notify('This PDF is waiting for approval before it can be downloaded.'); return; }
    if (r.premium && !signedIn) { setShowAuth(true); notify('Create an account to access premium resources.'); return; }
    if (r.premium && coins < 10) { notify('This premium resource costs 10 coins in this demo.'); return; }
    if (r.premium) setCoins(c => c - 10);
    if (r.fileUrl) {
      const a = document.createElement('a'); a.href = r.fileUrl; a.download = r.fileName || 'gaceb-resource.pdf'; a.click();
    } else notify('Sample resource preview: connect approved PDF storage to enable real downloads.');
  };

  const toggleSaved = (id) => setSaved(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  return (
    <div className={`app ${dark ? 'dark' : ''} theme-${theme}`}>
      <div className="announcement"><Sparkles size={14} /> Uganda’s learning community for ambitious O-Level & A-Level scholars <span>•</span> <button onClick={() => go('Resources')}>Explore resources <ArrowRight size={13}/></button></div>
      <header className="topbar">
        <button className="brand" onClick={() => go('Home')} aria-label="GACEB Scholar home">
          <span className="brand-mark"><img src={badge} alt="GACEB badge" /></span>
          <span className="brand-copy"><strong>GACEB <em>Scholar</em></strong><small>LEARN · SHARE · RISE</small></span>
        </button>
        <nav className="desktop-nav">
          {navItems.map(item => <button key={item} className={page === item ? 'active' : ''} onClick={() => go(item)}>{item}</button>)}
        </nav>
        <div className="top-actions">
          <button className="icon-btn theme-toggle" onClick={() => setDark(!dark)} aria-label="Toggle dark mode">{dark ? <Sun size={18}/> : <Moon size={18}/>}</button>
          <button className="coin-pill" onClick={() => openProtected(() => go('Rewards'))}><Coins size={17}/><b>{coins}</b><span>coins</span></button>
          {signedIn ? <button className="profile-button" onClick={() => go(authForm.role === 'Teacher' ? 'Teacher dashboard' : 'Student dashboard')}><span className="avatar">{(authForm.name || 'S').slice(0,1).toUpperCase()}</span><span>{authForm.name || 'My account'}</span><ChevronDown size={15}/></button> : <button className="btn btn-primary top-join" onClick={() => { setAuthMode('Create account'); setShowAuth(true); }}>Join free <ArrowRight size={16}/></button>}
          <button className="icon-btn mobile-menu" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Open menu">{mobileOpen ? <X/> : <Menu/>}</button>
        </div>
      </header>

      {mobileOpen && <div className="mobile-nav">{navItems.map(item => <button key={item} onClick={() => go(item)}>{item}<ArrowRight size={16}/></button>)}<button onClick={() => go('Rewards')}>Rewards<Coins size={16}/></button><button onClick={() => { setShowAuth(true); setMobileOpen(false); }}>Create account<Users size={16}/></button></div>}

      <main>
        {page === 'Home' && <Home go={go} openAuth={() => setShowAuth(true)} openUpload={() => setShowUpload(true)} resources={resources} />}
        {page === 'Resources' && <section className="page-wrap resources-page">
          <div className="page-heading"><div><span className="eyebrow"><BookOpen size={14}/> THE RESOURCE LIBRARY</span><h1>Learn something.<br/><span>Unlock your potential.</span></h1><p>Find notes, practice questions and revision packs made for Uganda’s O-Level and A-Level curriculum.</p></div><button className="btn btn-primary" onClick={() => setShowUpload(true)}><UploadCloud size={17}/> Upload a PDF <span className="reward-mini">+5 coins*</span></button></div>
          <div className="searchbar"><Search size={19}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search subjects, notes, past papers..." /><kbd>⌕</kbd></div>
          <div className="filter-row"><div className="filter-tabs">{['All', 'O-Level', 'A-Level'].map(x => <button className={level === x ? 'selected' : ''} onClick={() => { setLevel(x); setCategory('All'); }} key={x}>{x}</button>)}</div><select value={category} onChange={e => setCategory(e.target.value)} aria-label="Category"><option value="All">All categories</option><option>Sciences</option><option>Arts</option><option>Humanities</option></select><span className="result-count">{filteredResources.length} resources</span></div>
          <div className="level-feature-grid">
            <button className={`level-feature ${level === 'A-Level' ? 'chosen' : ''}`} onClick={() => { setLevel('A-Level'); setCategory('All'); }}><span className="level-icon purple"><GraduationCap/></span><span><b>A-Level</b><small>Advanced learning · S5–S6</small></span><ArrowRight size={19}/></button>
            <button className={`level-feature ${level === 'O-Level' ? 'chosen' : ''}`} onClick={() => { setLevel('O-Level'); setCategory('All'); }}><span className="level-icon green"><BookMarked/></span><span><b>O-Level</b><small>Foundational learning · S1–S4</small></span><ArrowRight size={19}/></button>
          </div>
          <div className="category-row"><button className={category === 'Sciences' ? 'category-chip chosen' : 'category-chip'} onClick={() => setCategory(category === 'Sciences' ? 'All' : 'Sciences')}><span>⚗</span> Sciences</button><button className={category === 'Arts' ? 'category-chip chosen' : 'category-chip'} onClick={() => setCategory(category === 'Arts' ? 'All' : 'Arts')}><span>✦</span> A-Level Arts</button><button className={category === 'Humanities' ? 'category-chip chosen' : 'category-chip'} onClick={() => setCategory(category === 'Humanities' ? 'All' : 'Humanities')}><span>◈</span> O-Level Humanities</button></div>
          <div className="section-title"><div><h2>{level === 'All' ? 'Explore resources' : `${level} resources`}</h2><p>Community-shared materials, organised for your revision.</p></div><button className="text-link" onClick={() => { setLevel('All'); setCategory('All'); setQuery(''); }}>Clear filters <ArrowRight size={15}/></button></div>
          <div className="resource-grid">{filteredResources.map(r => <ResourceCard key={r.id} resource={r} saved={saved.includes(r.id)} onSave={() => toggleSaved(r.id)} onDownload={() => downloadResource(r)} />)}</div>
          {!filteredResources.length && <div className="empty-state"><Search size={30}/><h3>No matching resources yet</h3><p>Try another search or clear your filters.</p><button className="btn btn-outline" onClick={() => { setQuery(''); setLevel('All'); setCategory('All'); }}>Reset filters</button></div>}
          <div className="upload-banner"><div className="upload-illustration"><UploadCloud size={35}/><span>PDF</span></div><div><span className="eyebrow">SHARE KNOWLEDGE, EARN REWARDS</span><h3>Your notes could help someone pass.</h3><p>Upload your original or authorised PDF study materials. Every approved upload earns <b>5 coins</b>.</p></div><button className="btn btn-light" onClick={() => setShowUpload(true)}>Contribute <ArrowRight size={16}/></button></div>
          <p className="fine-print">*Coins are awarded only after approval. This starter demo uses sample resources; real secure uploads and downloadable files require a connected backend.</p>
        </section>}
        {page === 'Funding' && <FundingPage notify={notify} /> }
        {page === 'About GACEB' && <AboutPage />}
        {page === 'Schools' && <SchoolsPage openAuth={() => setShowAuth(true)} />}
        {page === 'Student dashboard' && <Dashboard role="Student" name={authForm.name} coins={coins} go={go} openUpload={() => setShowUpload(true)} resources={resources} />}
        {page === 'Teacher dashboard' && <Dashboard role="Teacher" name={authForm.name} coins={coins} go={go} openUpload={() => setShowUpload(true)} resources={resources} />}
        {page === 'Rewards' && <RewardsPage coins={coins} openAuth={() => setShowAuth(true)} notify={notify} />}
      </main>

      <footer className="footer"><div className="footer-main"><div className="footer-brand"><img src={badge} alt="GACEB badge"/><div><b>GACEB Scholar</b><small>Learn · Share · Rise</small></div></div><p>Built to help Uganda’s learners discover resources, support one another, and reach higher.</p><div className="footer-links">{['Resources', 'Schools', 'Funding', 'About GACEB'].map(x => <button key={x} onClick={() => go(x)}>{x}</button>)}</div></div><div className="footer-bottom"><span>© 2025–2026 GACEB Scholar</span><span>Made for learners in Uganda <Heart size={13} fill="currentColor"/></span><button onClick={() => setAssistantOpen(true)}><MessageCircle size={14}/> Ask Gauge Assistant</button></div></footer>

      <a className="gaceb-donate-float" href="YOUR-DONATION-LINK" target="_blank" rel="noopener noreferrer" aria-label="Donate to GACEB">
        <span className="gaceb-heart" aria-hidden="true">♥</span>
        <span>Donate to GACEB</span>
        <span className="gaceb-arrow" aria-hidden="true">↗</span>
      </a>

      <button className={`assistant-fab ${assistantOpen ? 'opened' : ''}`} onClick={() => setAssistantOpen(!assistantOpen)} aria-label="Open Gauge Assistant">{assistantOpen ? <X size={22}/> : <><span className="assistant-spark"><Sparkles size={14}/></span><MessageCircle size={23}/></>}</button>
      {assistantOpen && <aside className="assistant-panel"><div className="assistant-head"><span className="assistant-avatar"><Sparkles size={19}/></span><div><b>Gauge Assistant</b><small><i/> Your learning companion</small></div><button onClick={() => setAssistantOpen(false)} aria-label="Close assistant"><X size={17}/></button></div><div className="assistant-welcome"><span className="eyebrow">GAUGE AI · HERE TO HELP</span><h3>What are we learning today?</h3><p>Ask about resources, revision tips, or Scholar coins.</p><div className="quick-questions">{['How do I earn coins?', 'Find revision resources', 'Help me plan revision'] .map(q => <button key={q} onClick={() => { setAssistantText(q); setTimeout(() => document.getElementById('assistant-form')?.requestSubmit(), 0); }}>{q}<ArrowRight size={13}/></button>)}</div></div><div className="chat-messages">{assistantMessages.map((m,i) => <div key={i} className={`chat-bubble ${m.from}`}>{m.text}</div>)}</div><form id="assistant-form" className="assistant-input" onSubmit={sendAssistant}><input value={assistantText} onChange={e => setAssistantText(e.target.value)} placeholder="Ask Gauge Assistant..." /><button aria-label="Send message"><Send size={17}/></button></form><div className="assistant-disclaimer">Gauge Assistant preview · answers may need checking.</div></aside>}

      {showAuth && <Modal title={authMode === 'Create account' ? 'Join the Scholar community' : 'Welcome back'} subtitle="Create your account to save resources, upload PDFs, and earn coins." onClose={() => setShowAuth(false)}><form className="modal-form" onSubmit={submitAuth}>{authMode === 'Create account' && <label>Full name<input required value={authForm.name} onChange={e => setAuthForm({...authForm, name:e.target.value})} placeholder="Your name"/></label>}<label>Email address<input required type="email" value={authForm.email} onChange={e => setAuthForm({...authForm, email:e.target.value})} placeholder="you@example.com"/></label><label>I am joining as<select value={authForm.role} onChange={e => setAuthForm({...authForm, role:e.target.value})}><option>Student</option><option>Teacher</option><option>School administrator</option></select></label><label>School (optional)<input value={authForm.school} onChange={e => setAuthForm({...authForm, school:e.target.value})} placeholder="Enter your school name"/></label><button className="btn btn-primary full-width" type="submit">{authMode === 'Create account' ? 'Create account' : 'Sign in'} <ArrowRight size={16}/></button><p className="modal-note"><ShieldCheck size={14}/> Demo form only. Connect authentication before publishing.</p><button className="switch-auth" type="button" onClick={() => setAuthMode(authMode === 'Create account' ? 'Sign in' : 'Create account')}>{authMode === 'Create account' ? 'Already have an account? Sign in' : 'New here? Create an account'}</button></form></Modal>}

      {showUpload && <Modal title="Share a learning resource" subtitle="Help another scholar learn. Approved uploads earn 5 coins." onClose={() => setShowUpload(false)}><form className="modal-form" onSubmit={submitUpload}><label>Resource title<input required value={uploadForm.title} onChange={e => setUploadForm({...uploadForm,title:e.target.value})} placeholder="e.g. S4 Biology revision notes"/></label><div className="form-two"><label>Level<select value={uploadForm.level} onChange={e => setUploadForm({...uploadForm,level:e.target.value,category:e.target.value==='A-Level'?'Sciences':'Sciences'})}><option>O-Level</option><option>A-Level</option></select></label><label>Category<select value={uploadForm.category} onChange={e => setUploadForm({...uploadForm,category:e.target.value})}>{(uploadForm.level === 'A-Level' ? ['Sciences','Arts'] : ['Sciences','Humanities']).map(x => <option key={x}>{x}</option>)}</select></label></div><div className="form-two"><label>Subject<input required value={uploadForm.subject} onChange={e => setUploadForm({...uploadForm,subject:e.target.value})} placeholder="Mathematics"/></label><label>Resource type<select value={uploadForm.type} onChange={e => setUploadForm({...uploadForm,type:e.target.value})}>{['Notes','Past Papers','Solutions','Exercises','Revision Pack','Other'].map(x => <option key={x}>{x}</option>)}</select></label></div><label className="file-drop"><UploadCloud size={25}/><b>{uploadForm.file ? uploadForm.file.name : 'Choose a PDF to upload'}</b><small>PDF files only · Share material you have permission to distribute</small><input type="file" accept="application/pdf,.pdf" onChange={e => setUploadForm({...uploadForm,file:e.target.files?.[0] || null})}/></label><div className="coin-explainer"><Coins size={18}/><span><b>+5 coins after approval</b><small>Our review team checks quality, duplicates and permissions first.</small></span></div><button className="btn btn-primary full-width" type="submit">Submit for review <ArrowRight size={16}/></button><p className="modal-note">Demo limitation: this adds the PDF to this page session only. Connect Supabase Storage and a review workflow for persistent uploads/downloads.</p></form></Modal>}
      {toast && <div className="toast"><CheckCircle2 size={17}/>{toast}</div>}
    </div>
  );
}

function Home({go, openAuth, openUpload, resources}) {
  return <><section className="hero page-wrap"><div className="hero-copy"><div className="hero-badge"><span className="pulse-dot"/> THE FUTURE OF SHARED LEARNING</div><h1>Your ambition.<br/>Your community.<br/><span>Your breakthrough.</span></h1><p className="hero-desc">A brighter way to prepare for exams. Discover resources aligned with Uganda’s curriculum, share what you know, and grow together with GACEB Scholar.</p><div className="hero-actions"><button className="btn btn-primary btn-large" onClick={openAuth}>Start learning free <ArrowRight size={17}/></button><button className="btn btn-outline btn-large" onClick={() => go('Resources')}><BookOpen size={17}/> Explore resources</button></div><div className="hero-proof"><div className="avatar-stack"><span>G</span><span>S</span><span>+</span></div><div><b>A community that learns together</b><small>For students, teachers & schools</small></div><span className="proof-star"><Stars size={18}/></span></div></div><div className="hero-art"><div className="hero-glow"/><div className="hero-card card-main"><div className="card-topline"><span className="live-label"><i/> SCHOLAR SPACE</span><span className="dots">•••</span></div><div className="hero-badge-large"><img src={badge} alt="GACEB badge"/></div><div className="hero-card-title"><span className="eyebrow">YOUR NEXT CHAPTER</span><h3>Small steps.<br/><em>Remarkable results.</em></h3><p>Learn with purpose. Rise with confidence.</p></div><div className="progress-row"><span>Weekly learning goal</span><b>72%</b></div><div className="progress-track"><span/></div></div><div className="floating-card float-coins"><span className="float-icon"><Coins size={21}/></span><div><b>+5 coins</b><small>Per approved PDF</small></div><Sparkles size={16} className="float-spark"/></div><div className="floating-card float-book"><span className="book-icon"><BookOpen size={21}/></span><div><b>Study smarter</b><small>Find your next resource</small></div><ArrowRight size={16}/></div><div className="orbit orbit-one"/><div className="orbit orbit-two"/></div></section>
  <section className="stats-strip page-wrap"><div><span className="stat-icon"><BookOpen size={19}/></span><b>One library</b><small>Notes, practice & revision</small></div><div><span className="stat-icon"><Users size={19}/></span><b>One community</b><small>Students, teachers & schools</small></div><div><span className="stat-icon"><Coins size={19}/></span><b>Earn as you share</b><small>5 coins per approved upload</small></div><div><span className="stat-icon"><ShieldCheck size={19}/></span><b>Quality-minded</b><small>Reviewed contributions</small></div></section>
  <section className="page-wrap home-resources"><div className="section-title"><div><span className="eyebrow">YOUR STUDY JOURNEY STARTS HERE</span><h2>Find your next breakthrough.</h2><p>Choose your level and start exploring the materials you need.</p></div><button className="text-link" onClick={() => go('Resources')}>Browse library <ArrowRight size={15}/></button></div><div className="home-level-grid"><button className="home-level alevel" onClick={() => go('Resources')}><div className="level-top"><span className="level-icon purple"><GraduationCap/></span><span className="mini-arrow"><ArrowRight size={17}/></span></div><span className="eyebrow">SENIOR FIVE & SIX</span><h3>A-Level</h3><p>Go deeper with advanced subject resources for your next step.</p><div className="home-tags"><span>Sciences</span><span>Arts</span></div></button><button className="home-level olevel" onClick={() => go('Resources')}><div className="level-top"><span className="level-icon green"><BookMarked/></span><span className="mini-arrow"><ArrowRight size={17}/></span></div><span className="eyebrow">SENIOR ONE TO FOUR</span><h3>O-Level</h3><p>Build strong foundations with notes, practice and revision.</p><div className="home-tags"><span>Sciences</span><span>Humanities</span></div></button></div></section>
  <section className="community-cta page-wrap"><div className="cta-orb"><Sparkles size={30}/></div><div><span className="eyebrow">YOUR KNOWLEDGE HAS VALUE</span><h2>Share a page. Shape a future.</h2><p>Upload helpful PDFs, invite a friend, and earn 5 coins for each approved contribution or successful invite.</p></div><button className="btn btn-light" onClick={openUpload}>Share a resource <UploadCloud size={17}/></button></section>
  <section className="page-wrap home-values"><div><span className="eyebrow">BUILT FOR UGANDAN LEARNERS</span><h2>More than a library.<br/><span>A place to rise.</span></h2><p>GACEB Scholar brings learning materials, community support and recognition into one welcoming space.</p><button className="btn btn-outline" onClick={() => go('About GACEB')}>Our story <ArrowRight size={16}/></button></div><div className="value-list"><div><span><Compass size={20}/></span><div><b>Find your direction</b><p>Browse by level, subject and resource type.</p></div></div><div><span><Trophy size={20}/></span><div><b>Celebrate progress</b><p>Earn coins, track contributions and aim higher.</p></div></div><div><span><Users size={20}/></span><div><b>Grow together</b><p>Connect students, teachers and schools around learning.</p></div></div></div></section></>;
}

function ResourceCard({resource:r, saved, onSave, onDownload}) {
  return <article className={`resource-card ${r.pending ? 'pending-card' : ''}`}><div className={`resource-cover cover-${r.category.toLowerCase()}`}><span className="file-type"><FileText size={13}/> PDF</span><span className="cover-graphic"><BookOpen size={34}/></span><span className="cover-level">{r.level}</span></div><div className="resource-info"><div className="resource-meta"><span>{r.category}</span><span>·</span><span>{r.subject}</span>{r.pending && <span className="pending-label">Pending review</span>}</div><h3>{r.title}</h3><p>By {r.author}</p><div className="resource-foot"><span><FileText size={13}/> {r.type}</span><span>{r.size}</span></div><div className="resource-actions"><button className="download-btn" onClick={onDownload}><Download size={15}/>{r.pending ? 'In review' : r.premium ? 'Unlock · 10 coins' : 'Download'}</button><button className={`save-btn ${saved ? 'saved' : ''}`} onClick={onSave} aria-label="Save resource"><Bookmark size={16} fill={saved ? 'currentColor' : 'none'}/></button></div></div></article>;
}

function AboutPage() {
  return <section className="page-wrap about-page"><div className="about-hero"><span className="eyebrow"><Heart size={14}/> OUR STORY · EST. 2025</span><h1>Potential is everywhere.<br/><span>Opportunity should be, too.</span></h1><p>GACEB began in 2025 with a simple belief: talent is everywhere, and with encouragement, knowledge and the right opportunities, potential can become achievement.</p><div className="about-badge"><img src={badge} alt="Original GACEB badge"/><div><b>GACEB Scholar</b><small>Gau​​ge-Caliper Examination Board</small></div></div></div><div className="about-story-grid"><article className="story-card story-main"><span className="story-icon"><Sparkles/></span><span className="eyebrow">WHY WE STARTED</span><h2>Inspired by people with potential.</h2><p>GACEB was inspired by the many people we met who had the ability to do remarkable things, but needed encouragement, recognition and a fair chance to shine. We started in 2025 to celebrate effort, honour dedication, and help learners and educators move forward together.</p><p>GACEB Scholar carries that vision into learning: a place where students can find useful study materials, teachers can share knowledge, and schools can become part of a supportive academic community.</p></article><article className="story-card"><span className="story-icon gold"><Trophy/></span><span className="eyebrow">RECOGNISING EXCELLENCE</span><h2>Appreciation that means something.</h2><p>The certificates of appreciation shown here represent our gratitude to outstanding teachers. Great educators do more than teach a subject — they build confidence, open doors and inspire the next generation.</p><div className="appreciation-note"><ShieldCheck size={18}/><span><b>Recognising the people who make a difference.</b><small>Celebrating dedication, service and impact.</small></span></div></article></div><div className="leadership-section"><div className="section-title"><div><span className="eyebrow">THE PEOPLE BEHIND THE VISION</span><h2>Leadership with purpose.</h2><p>Built on ambition, friendship and a belief in people.</p></div></div><div className="leaders-grid"><article className="leader-card"><div className="leader-photo real-photo-placeholder"><UserRound size={38}/><span>ADD YOUR ORIGINAL PHOTO</span></div><div className="leader-info"><span className="eyebrow">FOUNDER & CEO</span><h3>Sr. Gauge</h3><p>As CEO of GACEB, Sr. Gauge leads the vision of recognising potential and creating better opportunities for learners and educators. The goal is simple: build something that helps people rise.</p><span className="leader-tag"><Stars size={13}/> Vision · Service · Excellence</span></div></article><article className="leader-card"><div className="leader-photo friend-photo-placeholder"><Users size={38}/><span>FRIEND & SUPPORTER</span></div><div className="leader-info"><span className="eyebrow">FRIEND OF GACEB</span><h3>Sr. Calliper</h3><p>A friend and supporter of the GACEB journey. The story reflects the value of collaboration — meaningful progress often starts when people believe in one another.</p><span className="leader-tag"><Heart size={13}/> Friendship · Collaboration</span></div></article></div><p className="photo-reminder"><CircleHelp size={15}/> Your original photos have not been altered. Add the supplied photos to the <code>public/images/</code> folder and update the photo paths in <code>src/main.jsx</code> to display them here.</p></div><div className="about-values"><div><BookOpen/><b>Knowledge</b><span>Learning that can be shared.</span></div><div><Heart/><b>Recognition</b><span>Appreciating effort and service.</span></div><div><Users/><b>Community</b><span>Growing stronger together.</span></div><div><Trophy/><b>Excellence</b><span>Making room for potential.</span></div></div></section>;
}

function SchoolsPage({openAuth}) {
  return <section className="page-wrap schools-page"><div className="page-heading"><div><span className="eyebrow"><School size={14}/> OUR SCHOOL COMMUNITY</span><h1>Great schools.<br/><span>Greater possibilities.</span></h1><p>Bring students and teachers together in one learning community.</p></div><button className="btn btn-primary" onClick={openAuth}><Plus size={17}/> Join as a school</button></div><div className="school-steps">{[{n:'01',title:'Create an account',text:'Students, teachers and school representatives register with their role.'},{n:'02',title:'Find your school',text:'Search for your school or request that it be added to the directory.'},{n:'03',title:'Learn together',text:'Share resources, discover materials and build a stronger school community.'}].map(x=><article key={x.n}><span>{x.n}</span><h3>{x.title}</h3><p>{x.text}</p></article>)}</div><div className="school-empty"><span className="school-empty-icon"><School size={30}/></span><h2>Your school directory starts here.</h2><p>School listings will appear when schools register and are verified by the GACEB Scholar team.</p><button className="btn btn-outline" onClick={openAuth}>Register to get started <ArrowRight size={16}/></button></div></section>;
}

function Dashboard({role,name,coins,go,openUpload,resources}) {
  return <section className="page-wrap dashboard-page"><div className="dashboard-welcome"><div><span className="eyebrow"><Sparkles size={14}/> YOUR SCHOLAR SPACE</span><h1>Welcome back{name ? `, ${name.split(' ')[0]}` : ''}.</h1><p>Your next breakthrough starts with one small step.</p></div><div className="dashboard-date"><CalendarDays size={17}/> Keep showing up</div></div><div className="dashboard-stats"><div><span className="stat-icon"><Coins/></span><small>Coin balance</small><b>{coins}</b><button onClick={() => go('Rewards')}>View rewards <ArrowRight size={13}/></button></div><div><span className="stat-icon"><BookOpen/></span><small>Library resources</small><b>{resources.filter(r=>!r.pending).length}</b><button onClick={() => go('Resources')}>Browse library <ArrowRight size={13}/></button></div><div><span className="stat-icon"><UploadCloud/></span><small>My contributions</small><b>{resources.filter(r=>r.author === (name || 'You')).length}</b><button onClick={openUpload}>Upload PDF <ArrowRight size={13}/></button></div></div><div className="dashboard-content-grid"><div className="dashboard-panel"><div className="section-title"><div><h2>Quick actions</h2><p>Everything you need to keep moving.</p></div></div><div className="quick-action-grid"><button onClick={() => go('Resources')}><BookOpen/><b>Find resources</b><small>Notes & practice</small></button><button onClick={openUpload}><UploadCloud/><b>Share a PDF</b><small>Earn 5 coins when approved</small></button><button onClick={() => go('Rewards')}><Trophy/><b>Rewards shop</b><small>Use your coins</small></button><button onClick={() => go('Schools')}><School/><b>My school</b><small>Connect with your school</small></button></div></div><div className="dashboard-panel coin-panel"><span className="coin-big"><Coins size={26}/></span><span className="eyebrow">YOUR NEXT REWARD</span><h3>Knowledge pays forward.</h3><p>Upload a useful PDF or invite a friend. Each approved upload and successful invite earns 5 coins.</p><button className="btn btn-primary" onClick={openUpload}>Earn coins <ArrowRight size={15}/></button></div></div><div className="dashboard-panel"><div className="section-title"><div><h2>Recently added resources</h2><p>Fresh materials to support your learning.</p></div><button className="text-link" onClick={() => go('Resources')}>View all <ArrowRight size={15}/></button></div><div className="dashboard-resource-list">{resources.filter(r=>!r.pending).slice(0,3).map(r=><div key={r.id}><span className="resource-list-icon"><FileText/></span><div><b>{r.title}</b><small>{r.level} · {r.subject}</small></div><button onClick={() => go('Resources')}><ArrowRight size={16}/></button></div>)}</div></div><p className="fine-print">This is a front-end demo. Account details and progress are not securely stored between visits until a backend is connected.</p></section>;
}

function FundingPage({notify}) {
  const plans = [
    { name: 'Premium Weekly', price: 'UGX 10,000', period: 'per week', featured: false, tag: 'Flexible access', desc: 'A short-term pass for focused revision and exam preparation.', benefits: ['Access to eligible premium resources', 'Premium past-paper and revision collections', 'Support the GACEB Scholar community'] },
    { name: 'Premium Monthly', price: 'UGX 30,000', period: 'per month', featured: true, tag: 'Best for regular study', desc: 'More time to build a steady learning routine and prepare with confidence.', benefits: ['All weekly premium benefits', 'A full month of premium access', 'Ideal for ongoing revision and practice'] }
  ];
  return <section className="page-wrap funding-page">
    <div className="funding-hero"><span className="eyebrow"><Heart size={14}/> SUPPORT YOUR SCHOLAR JOURNEY</span><h1>Go further with <span>Premium.</span></h1><p>Choose a membership that fits your learning schedule. Your subscription helps support GACEB Scholar and its growing community of Ugandan students, teachers and schools.</p></div>
    <div className="membership-grid">{plans.map(plan => <article key={plan.name} className={`membership-card ${plan.featured ? 'featured' : ''}`}>
      <span className="membership-ribbon">{plan.featured ? <><Stars size={14}/> {plan.tag}</> : <><CalendarDays size={14}/> {plan.tag}</>}</span>
      <h2>{plan.name}</h2><p>{plan.desc}</p><div className="membership-price"><strong>{plan.price}</strong><span>{plan.period}</span></div>
      <ul className="membership-benefits">{plan.benefits.map(item => <li key={item}><CheckCircle2 size={17}/>{item}</li>)}</ul>
      <button className={`btn ${plan.featured ? 'btn-primary' : 'btn-outline'} full-width`} onClick={() => notify('Membership payments are not connected yet. Set up a payment provider before accepting subscriptions.')}>Choose {plan.name} <ArrowRight size={16}/></button>
    </article>)}</div>
    <div className="funding-note"><strong><ShieldCheck size={16} style={{display:'inline',verticalAlign:'-3px',marginRight:7}}/>Transparent membership notice:</strong> Prices are shown in Ugandan shillings (UGX). This starter website does not yet collect payments or activate subscriptions. Connect a payment provider and server-side subscription verification before launching paid membership.</div>
    <div className="funding-cta"><h3>Not ready for Premium?</h3><p>You can still explore the community, share approved learning materials and earn 5 coins for each approved PDF upload and each successful invite.</p></div>
  </section>;
}

function RewardsPage({coins,openAuth,notify}) {
  const rewards = [{name:'Premium revision pack',cost:10,icon:BookOpen,desc:'Unlock a selected premium study pack.'},{name:'Past-paper collection',cost:20,icon:FileText,desc:'Access an eligible premium collection.'},{name:'Scholar spotlight',cost:50,icon:Stars,desc:'A profile highlight for community contributors.'}];
  return <section className="page-wrap rewards-page"><div className="rewards-hero"><span className="eyebrow"><Trophy size={14}/> THE SCHOLAR REWARDS CLUB</span><h1>Good learning.<br/><span>Good things follow.</span></h1><p>Share knowledge, invite your friends, and turn your effort into learning rewards.</p><div className="balance-card"><span className="balance-icon"><Coins size={27}/></span><div><small>YOUR COIN BALANCE</small><b>{coins} <em>coins</em></b></div><span className="balance-spark"><Sparkles/></span></div></div><div className="earn-grid"><article><span><UploadCloud/></span><b>Share a PDF</b><strong>+5 coins</strong><p>Earn when your learning resource is reviewed and approved.</p></article><article><span><Users/></span><b>Invite a friend</b><strong>+5 coins</strong><p>Earn when an invited learner successfully joins the community.</p></article><article><span><ChartNoAxesCombined/></span><b>Keep contributing</b><strong>Grow together</strong><p>Help make the resource library more useful for everyone.</p></article></div><div className="section-title"><div><h2>Rewards to work towards</h2><p>Example reward prices — final prices can be configured by GACEB administrators.</p></div></div><div className="reward-shop">{rewards.map(r=><article key={r.name}><span className="reward-shop-icon"><r.icon/></span><div><b>{r.name}</b><p>{r.desc}</p></div><div className="reward-price"><span><Coins size={15}/>{r.cost}</span><button onClick={() => notify(coins>=r.cost ? 'Reward redemption needs a connected backend.' : 'Keep contributing to earn more coins.')}>Redeem</button></div></article>)}</div><div className="reward-rules"><ShieldCheck size={20}/><div><b>Fair rewards, trusted community.</b><p>Uploads earn coins only after approval. Invite rewards should be issued once per verified new member, with anti-spam and duplicate-account checks. Coins and redemptions must be validated securely on the server.</p></div></div></section>;
}

function Modal({title,subtitle,onClose,children}) {
  return <div className="modal-backdrop" onMouseDown={e => { if(e.target===e.currentTarget) onClose(); }}><section className="modal" role="dialog" aria-modal="true"><button className="modal-close" onClick={onClose} aria-label="Close"><X size={19}/></button><div className="modal-logo"><img src={badge} alt="GACEB badge"/></div><h2>{title}</h2><p className="modal-subtitle">{subtitle}</p>{children}</section></div>;
}

createRoot(document.getElementById('root')).render(<App />);