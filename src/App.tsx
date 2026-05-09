import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BlockMath, InlineMath } from 'react-katex';
import { 
  Search, 
  BookOpen, 
  TrendingUp, 
  PieChart, 
  ChevronLeft, 
  Info,
  HelpCircle,
  ArrowRightLeft,
  Calculator,
  FileText,
  Menu,
  X,
  Calendar,
  Lightbulb,
  Coins,
  ArrowUpDown,
  GraduationCap,
  BarChart3,
  LayoutDashboard
} from 'lucide-react';
import { JOURNAL_ENTRIES, THEORY_GUIDES, SUBJECTS, SubjectId, JournalEntry, TheoryGuide } from './types';
import { cn } from './lib/utils';
import { CATEGORY_LABELS, SUBJECT_CATEGORIES } from './constants';

export default function App() {
  const [selectedSubjectId, setSelectedSubjectId] = useState<SubjectId>('accounting');
  const [activeTab, setActiveTab] = useState<'journal' | 'theory'>('journal');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'title' | 'category'>('title');
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [selectedGuide, setSelectedGuide] = useState<TheoryGuide | null>(null);
  const [currentPageIdx, setCurrentPageIdx] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const selectedSubject = useMemo(() => 
    SUBJECTS.find(s => s.id === selectedSubjectId) || SUBJECTS[0], 
    [selectedSubjectId]
  );

  const filteredEntries = useMemo(() => {
    const filtered = JOURNAL_ENTRIES.filter(entry => {
      const matchesSubject = entry.subjectId === selectedSubjectId;
      const matchesSearch = entry.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           entry.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || entry.category === selectedCategory;
      return matchesSubject && matchesSearch && matchesCategory;
    });

    return [...filtered].sort((a, b) => {
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title, 'he');
      }
      return a.category.localeCompare(b.category, 'he');
    });
  }, [selectedSubjectId, searchTerm, selectedCategory, sortBy]);

  const filteredGuides = useMemo(() => {
    return THEORY_GUIDES.filter(guide => {
      const matchesSubject = guide.subjectId === selectedSubjectId;
      const matchesSearch = guide.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           guide.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || guide.category === selectedCategory;
      return matchesSubject && matchesSearch && matchesCategory;
    });
  }, [selectedSubjectId, searchTerm, selectedCategory]);

  const handleSubjectChange = (id: SubjectId) => {
    setSelectedSubjectId(id);
    setSelectedCategory('all');
    setSelectedEntry(null);
    setSelectedGuide(null);
    setSearchTerm('');
    // If subject changes, default to theory if journal is empty (like for statistics)
    const hasJournal = JOURNAL_ENTRIES.some(e => e.subjectId === id);
    if (!hasJournal) setActiveTab('theory');
    else setActiveTab('journal');
  };

  const getIcon = (name: string, size = 20) => {
    switch(name) {
      case 'Calculator': return <Calculator size={size} />;
      case 'BarChart3': return <BarChart3 size={size} />;
      default: return <BookOpen size={size} />;
    }
  };

  return (
    <div className="min-h-screen font-sans selection:bg-blue-100 dark bg-[#0a0a0a] text-gray-100 text-right" dir="rtl">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#141414] border-b border-gray-800 px-4 py-3 md:px-8 flex flex-col md:flex-row md:items-center justify-between shadow-sm gap-4">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-gray-800 rounded-lg lg:hidden"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div className="bg-blue-600 p-2 rounded-lg text-white">
            {getIcon(selectedSubject.icon, 24)}
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center">
              חשבונ<span className="text-blue-500">Ai</span>
            </h1>
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">{selectedSubject.name}</p>
          </div>
        </div>

        {/* Custom Tab Switcher */}
        <div className="bg-gray-950 p-1 rounded-xl border border-gray-800 flex items-center">
          {SUBJECTS.find(s => s.id === selectedSubjectId)?.id === 'accounting' && (
            <button 
              onClick={() => { setActiveTab('journal'); setSelectedGuide(null); }}
              className={cn(
                "px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2",
                activeTab === 'journal' ? "bg-blue-600 text-white shadow-lg" : "text-gray-400 hover:text-white"
              )}
            >
              <BookOpen size={14} />
              פקודות יומן
            </button>
          )}
          <button 
            onClick={() => { setActiveTab('theory'); setSelectedEntry(null); }}
            className={cn(
              "px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2",
              activeTab === 'theory' ? "bg-green-600 text-white shadow-lg" : "text-gray-400 hover:text-white"
            )}
          >
            <GraduationCap size={14} />
            תרגילים
          </button>
        </div>

        <div className="flex items-center gap-4 md:gap-6">
          <nav className="hidden md:flex items-center gap-2 overflow-x-auto pb-1 max-w-[400px]">
            {SUBJECT_CATEGORIES[selectedSubjectId].map((cat) => (
              <button 
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id as any)}
                className={cn(
                  "px-3 py-1.5 text-xs font-bold rounded-full transition-all whitespace-nowrap",
                  selectedCategory === cat.id 
                    ? "bg-blue-600 text-white shadow-md" 
                    : "text-gray-400 hover:bg-gray-800"
                )}
              >
                {cat.label}
              </button>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-2 border-r border-gray-800 pr-4 mr-2">
            <ArrowUpDown size={14} className="text-gray-400" />
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">מיין לפי:</span>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-xs font-bold focus:outline-none text-white cursor-pointer hover:text-blue-600 transition-colors appearance-none"
            >
              <option value="title" className="bg-[#141414]">שם</option>
              <option value="category" className="bg-[#141414]">קטגוריה</option>
            </select>
          </div>
        </div>
      </header>

      <main className="flex">
        {/* Subject Sidebar */}
        <aside className={cn(
          "fixed inset-y-0 right-0 z-40 w-64 bg-[#0d0d0d] border-l border-gray-800 lg:relative lg:translate-x-0 transition-transform duration-300 transform",
          isSidebarOpen ? "translate-x-0" : "translate-x-full"
        )}>
          <div className="p-6">
            <h2 className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] mb-6">המקצועות שלי</h2>
            <div className="space-y-2">
              {SUBJECTS.map((subject) => (
                <button
                  key={subject.id}
                  onClick={() => {
                    handleSubjectChange(subject.id);
                    setIsSidebarOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 p-3 rounded-xl transition-all group",
                    selectedSubjectId === subject.id 
                      ? "bg-blue-600/10 text-blue-500 border border-blue-600/20" 
                      : "text-gray-400 hover:bg-gray-800 hover:text-gray-200"
                  )}
                >
                  <div className={cn(
                    "p-2 rounded-lg transition-colors",
                    selectedSubjectId === subject.id ? "bg-blue-600 text-white" : "bg-gray-800 group-hover:bg-gray-700"
                  )}>
                    {getIcon(subject.icon, 18)}
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-sm">{subject.name}</div>
                    <div className="text-[10px] opacity-60 line-clamp-1">{subject.description}</div>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-12 pt-12 border-t border-gray-800/50 text-right" dir="rtl">
              <h2 className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] mb-4">כלים מהירים</h2>
              <div className="space-y-4">
                {selectedSubjectId === 'statistics' ? (
                  <>
                    <a 
                      href="https://normal-calcc.vercel.app/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="block p-4 bg-gray-900/50 rounded-2xl hover:bg-gray-800 transition-all border border-transparent hover:border-blue-500/30 group"
                    >
                      <div className="flex items-center gap-2 mb-2 text-blue-500">
                        <Calculator size={16} />
                        <span className="text-xs font-bold">מחשבון התפלגות נורמלית</span>
                      </div>
                      <p className="text-[10px] text-gray-400 group-hover:text-gray-300">חישוב מהיר של הסתברויות, ציוני תקן ואחוזונים במערכת מתקדמת.</p>
                    </a>
                    <button 
                      onClick={() => {
                        const formulaSheet = THEORY_GUIDES.find(g => g.id === 'stats-formula-sheet');
                        if (formulaSheet) {
                          setSelectedSubjectId('statistics');
                          setActiveTab('theory');
                          setSelectedGuide(formulaSheet);
                          setCurrentPageIdx(0);
                          setIsSidebarOpen(false);
                        }
                      }}
                      className="w-full text-right p-4 bg-gray-900/50 rounded-2xl hover:bg-gray-800 transition-all border border-transparent hover:border-green-500/30 group"
                    >
                      <div className="flex items-center gap-2 mb-2 text-green-500">
                        <FileText size={16} />
                        <span className="text-xs font-bold">דף נוסחאות סטטיסטיקה</span>
                      </div>
                      <p className="text-[10px] text-gray-400 group-hover:text-gray-300">כל הנוסחאות שצריך במקום אחד - ממוצע, שונות, טעויות תקן ועוד.</p>
                    </button>
                    <button 
                      onClick={() => {
                        const pearsonGuide = THEORY_GUIDES.find(g => g.id === 'pearson-correlation');
                        if (pearsonGuide) {
                          setSelectedSubjectId('statistics');
                          setActiveTab('theory');
                          setSelectedGuide(pearsonGuide);
                          setCurrentPageIdx(0);
                          setIsSidebarOpen(false);
                        }
                      }}
                      className="w-full text-right p-4 bg-gray-900/50 rounded-2xl hover:bg-gray-800 transition-all border border-transparent hover:border-purple-500/30 group"
                    >
                      <div className="flex items-center gap-2 mb-2 text-purple-500">
                        <TrendingUp size={16} />
                        <span className="text-xs font-bold">מקדם מתאם פירסון</span>
                      </div>
                      <p className="text-[10px] text-gray-400 group-hover:text-gray-300">למידה על קשר בין משתנים, שונות משותפת ותרגול מעשי.</p>
                    </button>
                  </>
                ) : (
                  <>
                    <button 
                      onClick={() => {
                        const equityGuide = THEORY_GUIDES.find(g => g.id === 'equity-method-guide');
                        if (equityGuide) {
                          setSelectedSubjectId('accounting');
                          setActiveTab('theory');
                          setSelectedGuide(equityGuide);
                          setIsSidebarOpen(false);
                        }
                      }}
                      className="w-full text-right p-4 bg-gray-900/50 rounded-2xl hover:bg-gray-800 transition-all border border-transparent hover:border-blue-500/30 group"
                    >
                      <div className="flex items-center gap-2 mb-2 text-blue-500">
                        <PieChart size={16} />
                        <span className="text-xs font-bold">מדריך שווי מאזני</span>
                      </div>
                      <p className="text-[10px] text-gray-400 group-hover:text-gray-300">הסבר מפורט על שיטת האקוויטי, כולל דוגמה מלאה של אלעד ויעל.</p>
                    </button>
                    <button 
                      onClick={() => {
                        const bondsGuide = THEORY_GUIDES.find(g => g.id === 'bonds-guide');
                        if (bondsGuide) {
                          setSelectedSubjectId('accounting');
                          setActiveTab('theory');
                          setSelectedGuide(bondsGuide);
                          setIsSidebarOpen(false);
                        }
                      }}
                      className="w-full text-right p-4 bg-gray-900/50 rounded-2xl hover:bg-gray-800 transition-all border border-transparent hover:border-orange-500/30 group"
                    >
                      <div className="flex items-center gap-2 mb-2 text-orange-500">
                        <Coins size={16} />
                        <span className="text-xs font-bold">חישוב אג"ח</span>
                      </div>
                      <p className="text-[10px] text-gray-400 group-hover:text-gray-300">טיפול בפרמיה וניכיון, רישום פקודות יומן והצגה במאזן.</p>
                    </button>
                  </>
                )}
                <div className="p-4 bg-gray-900/50 rounded-2xl opacity-50 cursor-not-allowed text-right" dir="rtl">
                  <LayoutDashboard size={16} className="text-orange-500 mb-2" />
                  <p className="text-[10px] text-gray-400">מעקב אחר התקדמות למידה (בקרוב)</p>
                </div>
              </div>
            </div>
          </div>
        </aside>

        <div className="flex-1 max-w-7xl mx-auto p-4 md:p-8">
          {/* Quick Tips Section - Subject Specific */}
          {selectedSubjectId === 'accounting' && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
              <div className="bg-white dark:bg-[#141414] p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm h-full">
                <h4 className="font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2 text-xs">
                  <TrendingUp size={14} className="text-blue-600" />
                  דוח על השינויים בהון העצמי
                </h4>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-tight">
                  הדוח מרכז את כל התנועות בסעיפי ההון במהלך התקופה. הוא מקשר בין יתרת הפתיחה ליתרת הסגירה וכולל רווח כולל, הנפקות ודיווידנדים.
                </p>
              </div>
              <div className="bg-white dark:bg-[#141414] p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm h-full">
                <h4 className="font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2 text-xs">
                  <Info size={14} className="text-blue-600" />
                  כלל אצבע: ערך נקוב
                </h4>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-tight">
                  זכרו: חשבון "הון מניות" תמיד נרשם לפי הערך הנקוב. כל הפרש בין התמורה לערך הנקוב הולך ל"פרמיה על מניות".
                </p>
              </div>
              <div className="bg-white dark:bg-[#141414] p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm h-full">
                <h4 className="font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2 text-xs">
                  <Coins size={14} className="text-blue-600" />
                  הלוואות (ריבית לשלם)
                </h4>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-tight">
                  בסוף שנה יש להכיר בהוצאות ריבית שנצמחו כנגד <span className="underline">הוצאות לשלם</span>. פירעון הריבית סוגר את ההתחייבות.
                </p>
              </div>
              <div className="bg-white dark:bg-[#141414] p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm h-full">
                <h4 className="font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2 text-xs">
                  <PieChart size={14} className="text-blue-600" />
                  שיטת השווי המאזני
                </h4>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-tight">
                  החזקה מעל 20%. רווחי המוחזקת מגדילים את ההשקעה, והפסדים או דיווידנדים מקטינים אותה.
                </p>
              </div>
            </div>
          )}

          {selectedSubjectId === 'statistics' && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
              <div className="bg-white dark:bg-[#141414] p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm h-full">
                <h4 className="font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2 text-xs">
                  <BarChart3 size={14} className="text-orange-600" />
                  סטטיסטיקה תיאורית
                </h4>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-tight">
                  מידע על התפלגות, מדדי מרכז (ממוצע, חציון, שכיח) ומדדי פיזור (טווח, שונות, סטיית תקן).
                </p>
              </div>
              <div className="bg-white dark:bg-[#141414] p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm h-full">
                <h4 className="font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2 text-xs">
                  <Info size={14} className="text-orange-600" />
                  התפלגות נורמלית
                </h4>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-tight">
                  צורת הפעמון הידועה. 68% מהנתונים בטווח סטיית תקן אחת מהממוצע, 95% בטווח שתי סטיות תקן.
                </p>
              </div>
              <div className="bg-white dark:bg-[#141414] p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm h-full">
                <h4 className="font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2 text-xs">
                  <HelpCircle size={14} className="text-orange-600" />
                  הסתברות
                </h4>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-tight">
                  מדידת הסיכוי להתרחשות אירוע. חוקי הסתברות, הסתברות מותנית ומשפט בייס.
                </p>
              </div>
            </div>
          )}

        <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar / List */}
        <aside className={cn(
          "md:w-80 shrink-0 space-y-6 transition-all duration-300",
          isSidebarOpen ? "fixed inset-0 z-40 bg-white dark:bg-[#0a0a0a] p-4 md:relative md:bg-transparent md:p-0" : "hidden md:block"
        )}>
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder={activeTab === 'journal' ? "חפש פקודת יומן..." : "חפש תרגיל..."}
              className="w-full bg-white dark:bg-[#141414] border border-gray-200 dark:border-gray-800 rounded-xl py-3 pr-10 pl-4 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm dark:text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="space-y-2 overflow-y-auto max-h-[calc(100vh-250px)] pr-1">
            {activeTab === 'journal' ? (
              filteredEntries.map((entry) => (
                <motion.button
                  layoutId={entry.id}
                  key={entry.id}
                  onClick={() => {
                    setSelectedEntry(entry);
                    setIsSidebarOpen(false);
                  }}
                  className={cn(
                    "w-full text-right p-4 rounded-xl border transition-all flex flex-col gap-1 group",
                    selectedEntry?.id === entry.id 
                      ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200 dark:shadow-none" 
                      : "bg-white dark:bg-[#141414] border-gray-200 dark:border-gray-800 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md text-gray-900 dark:text-gray-100"
                  )}
                >
                  <div className="flex items-center justify-between">
                      <span className={cn(
                        "text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md",
                        selectedEntry?.id === entry.id ? "bg-blue-500 text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
                      )}>
                        {CATEGORY_LABELS[entry.category] || entry.category}
                      </span>
                    <ChevronLeft size={16} className={cn(
                      "transition-transform",
                      selectedEntry?.id === entry.id ? "text-white" : "text-gray-300 group-hover:text-blue-500"
                    )} />
                  </div>
                  <h3 className="font-bold text-lg leading-tight">{entry.title}</h3>
                  <p className={cn(
                    "text-sm line-clamp-1",
                    selectedEntry?.id === entry.id ? "text-blue-100" : "text-gray-500 dark:text-gray-400"
                  )}>
                    {entry.description}
                  </p>
                </motion.button>
              ))
            ) : (
              filteredGuides.map((guide) => (
                <motion.button
                  layoutId={guide.id}
                  key={guide.id}
                  onClick={() => {
                    setSelectedGuide(guide);
                    setCurrentPageIdx(0);
                    setIsSidebarOpen(false);
                  }}
                  className={cn(
                    "w-full text-right p-4 rounded-xl border transition-all flex flex-col gap-1 group",
                    selectedGuide?.id === guide.id 
                      ? "bg-green-600 border-green-600 text-white shadow-lg shadow-green-200 dark:shadow-none" 
                      : "bg-white dark:bg-[#141414] border-gray-200 dark:border-gray-800 hover:border-green-300 dark:hover:border-green-700 hover:shadow-md text-gray-900 dark:text-gray-100"
                  )}
                >
                  <div className="flex items-center justify-between">
                      <span className={cn(
                        "text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md",
                        selectedGuide?.id === guide.id ? "bg-green-500 text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
                      )}>
                        {CATEGORY_LABELS[guide.category] || guide.category}
                      </span>
                    <ChevronLeft size={16} className={cn(
                      "transition-transform",
                      selectedGuide?.id === guide.id ? "text-white" : "text-gray-300 group-hover:text-green-500"
                    )} />
                  </div>
                  <h3 className="font-bold text-lg leading-tight">{guide.title}</h3>
                  <p className={cn(
                    "text-sm line-clamp-1",
                    selectedGuide?.id === guide.id ? "text-green-100" : "text-gray-500 dark:text-gray-400"
                  )}>
                    {guide.description}
                  </p>
                </motion.button>
              ))
            )}
            {((activeTab === 'journal' && filteredEntries.length === 0) || (activeTab === 'theory' && filteredGuides.length === 0)) && (
              <div className="text-center py-12 text-gray-400">
                <Search size={48} className="mx-auto mb-4 opacity-20" />
                <p>לא נמצאו תוצאות לחיפוש שלך</p>
              </div>
            )}
          </div>
        </aside>

        {/* Content Area */}
        <section className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            {activeTab === 'journal' && selectedEntry ? (
              <motion.div
                key={selectedEntry.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white dark:bg-[#141414] rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden"
              >
                <div className="p-6 md:p-10 border-b border-gray-100 dark:border-gray-800 bg-gradient-to-br from-white to-gray-50 dark:from-[#141414] dark:to-[#1a1a1a]">
                  <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-4">
                    <BookOpen size={20} />
                    <span className="text-xs font-bold uppercase tracking-widest">פירוט פקודת יומן</span>
                  </div>
                  <h2 className="text-3xl font-black tracking-tight mb-4 dark:text-white">{selectedEntry.title}</h2>
                  <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl">
                    {selectedEntry.description}
                  </p>
                </div>

                <div className="p-6 md:p-10 space-y-12">
                  {/* Journal Entry Table */}
                  <div>
                    <div className="flex items-center gap-2 mb-6">
                      <ArrowRightLeft size={18} className="text-gray-400" />
                      <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest">הרישום החשבונאי</h4>
                    </div>
                    
                    <div className="border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
                      <table className="w-full text-right border-collapse font-accounting">
                        <thead>
                          <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-800">
                            <th className="p-4 font-bold text-sm text-gray-500 dark:text-gray-400">חשבון</th>
                            <th className="p-4 font-bold text-sm text-gray-500 dark:text-gray-400 w-32">חובה (Debit)</th>
                            <th className="p-4 font-bold text-sm text-gray-500 dark:text-gray-400 w-32">זכות (Credit)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedEntry.entries.map((row, idx) => (
                            <tr key={idx} className="border-b border-gray-100 dark:border-gray-800 last:border-0 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors">
                              <td className="p-4 font-medium text-gray-900 dark:text-gray-100">
                                {row.account}
                                {row.note && <span className="block text-xs text-gray-400 mt-1 font-normal italic">{row.note}</span>}
                              </td>
                              <td className="p-4 text-red-600 dark:text-red-400 font-bold">{row.debit || '-'}</td>
                              <td className="p-4 text-green-600 dark:text-green-400 font-bold">{row.credit || '-'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Examples Section */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Coins size={18} className="text-gray-400" />
                      <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest">איך זה נכתב בתרגיל</h4>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-4">
                      {selectedEntry.examples.map((example, idx) => (
                        <div key={idx} className="bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 hover:border-blue-200 dark:hover:border-blue-700 transition-all group">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-black text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded-md">דוגמה {idx + 1}</span>
                          </div>
                          <p className="text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                            {example.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-800 flex justify-end">
                  <button 
                    onClick={() => setSelectedEntry(null)}
                    className="text-sm font-bold text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors flex items-center gap-2"
                  >
                    סגור פירוט
                    <X size={16} />
                  </button>
                </div>
              </motion.div>
            ) : activeTab === 'theory' && selectedGuide ? (
              <motion.div
                key={selectedGuide.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={cn(
                  "rounded-3xl p-8 relative shadow-2xl overflow-hidden min-h-[600px]",
                  selectedSubjectId === 'statistics' 
                    ? "bg-white dark:bg-[#0c0c0c] border border-gray-200 dark:border-gray-800" 
                    : "bg-[#0e2a22] border-[12px] border-[#3d2b1f]"
                )}
                style={selectedSubjectId === 'accounting' ? { boxShadow: 'inset 0 0 100px rgba(0,0,0,0.5), 0 25px 50px -12px rgba(0,0,0,0.5)' } : {}}
              >
                {/* Chalkboard Texture - Only for Accounting */}
                {selectedSubjectId === 'accounting' && (
                  <div className="absolute inset-0 pointer-events-none opacity-20" 
                    style={{ 
                      backgroundImage: 'radial-gradient(circle, #ffffff 0.5px, transparent 0.5px)', 
                      backgroundSize: '40px 40px',
                      filter: 'contrast(150%) brightness(150%)'
                    }} 
                  />
                )}
                
                <div className="relative z-10 font-sans">
                  {selectedSubjectId === 'statistics' ? (
                    /* STATISTICS MODERN LAYOUT */
                    <div className="max-w-4xl mx-auto space-y-12 pb-20 text-right">
                      <div className="text-center mb-16">
                        <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">
                          {selectedGuide.title}
                        </h2>
                        <div className="h-1.5 w-24 bg-blue-600 mx-auto rounded-full mb-6" />
                        <p className="text-gray-500 dark:text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
                          {selectedGuide.description}
                        </p>
                      </div>

                      {selectedGuide.introduction && (
                        <section className="relative">
                          <div className="absolute -right-4 top-0 bottom-0 w-1 bg-blue-600/20 rounded-full" />
                          <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed font-light italic pr-6">
                            {selectedGuide.introduction}
                          </p>
                        </section>
                      )}

                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                        <div className="lg:col-span-8 space-y-10">
                          {selectedGuide.pages ? (
                            /* PAGINATED CONTENT */
                            <div className="space-y-10">
                              <div className="flex items-center gap-4 mb-8 overflow-x-auto pb-4 scrollbar-hide">
                                {selectedGuide.pages.map((page, pIdx) => (
                                  <button
                                    key={pIdx}
                                    onClick={() => {
                                      setCurrentPageIdx(pIdx);
                                      window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }}
                                    className={cn(
                                      "px-6 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all",
                                      currentPageIdx === pIdx 
                                        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30" 
                                        : "bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700"
                                    )}
                                  >
                                    {page.title}
                                  </button>
                                ))}
                              </div>

                              <motion.div
                                key={currentPageIdx}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="space-y-10"
                              >
                                {selectedGuide.pages[currentPageIdx].blocks.map((block, bIdx) => (
                                  <div 
                                    key={bIdx}
                                    className={cn(
                                      "rounded-2xl transition-all",
                                      selectedGuide.category === 'formulas' ? "p-6" : "p-8",
                                      block.type === 'definition' ? "bg-blue-50 dark:bg-blue-900/10 border-r-4 border-blue-600" :
                                      block.type === 'example' ? "bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800" :
                                      "bg-transparent"
                                    )}
                                  >
                                    {block.title && (
                                      <h4 className={cn(
                                        "font-bold mb-4 text-xl",
                                        block.type === 'definition' ? "text-blue-700 dark:text-blue-400" : "text-gray-900 dark:text-white"
                                      )}>
                                        {block.title}
                                      </h4>
                                    )}
                                    
                                    <div className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                                      {Array.isArray(block.content) ? (
                                        <ul className="space-y-3 mt-4">
                                          {block.content.map((item, iIdx) => (
                                            <li key={iIdx} className="flex items-center gap-3">
                                              <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                                              {item}
                                            </li>
                                          ))}
                                        </ul>
                                      ) : block.content}
                                    </div>

                                    {block.formula && (
                                      <div className="mt-4 p-6 bg-gray-50/50 dark:bg-black/40 rounded-xl border border-gray-100 dark:border-gray-800 text-center text-blue-600 dark:text-blue-400 shadow-inner overflow-x-auto ltr" dir="ltr">
                                        <BlockMath math={block.formula} />
                                      </div>
                                    )}

                                    {block.legend && (
                                      <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 border-t border-gray-100 dark:border-gray-800/50 pt-4">
                                        {block.legend.map((item, lIdx) => (
                                          <div key={lIdx} className="flex items-baseline gap-2">
                                            <span className="font-mono text-sm text-blue-600 dark:text-blue-400 font-bold shrink-0" dir="ltr">
                                              <InlineMath math={item.symbol} />
                                            </span>
                                            <span className="text-[11px] text-gray-500 dark:text-gray-400 border-r border-gray-200 dark:border-gray-800 pr-2">
                                              {item.description}
                                            </span>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                ))}

                                <div className="pt-10 flex justify-between items-center border-t border-gray-100 dark:border-gray-800">
                                  <button
                                    disabled={currentPageIdx === 0}
                                    onClick={() => {
                                      setCurrentPageIdx(prev => prev - 1);
                                      window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }}
                                    className="px-6 py-2 rounded-xl border border-gray-200 dark:border-gray-700 disabled:opacity-30 text-sm font-bold"
                                  >
                                    עמוד קודם
                                  </button>
                                  <div className="text-sm text-gray-400 font-mono">
                                    {currentPageIdx + 1} / {selectedGuide.pages.length}
                                  </div>
                                  <button
                                    disabled={currentPageIdx === selectedGuide.pages.length - 1}
                                    onClick={() => {
                                      setCurrentPageIdx(prev => prev + 1);
                                      window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }}
                                    className="px-6 py-2 rounded-xl bg-blue-600 text-white disabled:opacity-30 text-sm font-bold"
                                  >
                                    עמוד הבא
                                  </button>
                                </div>
                              </motion.div>
                            </div>
                          ) : (
                            /* NON-PAGINATED CONTENT */
                            selectedGuide.blocks?.map((block, bIdx) => (
                              <motion.div 
                                key={bIdx}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: bIdx * 0.1 }}
                                className={cn(
                                  "rounded-2xl transition-all text-right",
                                  selectedGuide.category === 'formulas' ? "p-6" : "p-8",
                                  block.type === 'definition' ? "bg-blue-50 dark:bg-blue-900/10 border-r-4 border-blue-600" :
                                  block.type === 'example' ? "bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800" :
                                  "bg-transparent"
                                )}
                              >
                                {block.title && (
                                  <h4 className={cn(
                                    "font-bold mb-4 text-xl",
                                    block.type === 'definition' ? "text-blue-700 dark:text-blue-400" : "text-gray-900 dark:text-white"
                                  )}>
                                    {block.title}
                                  </h4>
                                )}
                                
                                <div className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                                  {Array.isArray(block.content) ? (
                                    <ul className="space-y-3 mt-4">
                                      {block.content.map((item, iIdx) => (
                                        <li key={iIdx} className="flex items-center gap-3">
                                          <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                                          {item}
                                        </li>
                                      ))}
                                    </ul>
                                  ) : block.content}
                                </div>

                                {block.formula && (
                                  <div className="mt-4 p-6 bg-gray-50/50 dark:bg-black/40 rounded-xl border border-gray-100 dark:border-gray-800 text-center text-blue-600 dark:text-blue-400 shadow-inner overflow-x-auto" dir="ltr">
                                    <BlockMath math={block.formula} />
                                  </div>
                                )}

                                {block.legend && (
                                  <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 border-t border-gray-100 dark:border-gray-800/50 pt-4">
                                    {block.legend.map((item, lIdx) => (
                                      <div key={lIdx} className="flex items-baseline gap-2">
                                        <span className="font-mono text-sm text-blue-600 dark:text-blue-400 font-bold shrink-0" dir="ltr">
                                          <InlineMath math={item.symbol} />
                                        </span>
                                        <span className="text-[11px] text-gray-500 dark:text-gray-400 border-r border-gray-200 dark:border-gray-800 pr-2">
                                          {item.description}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </motion.div>
                            ))
                          )}
                        </div>

                        <div className="lg:col-span-4 space-y-6">
                          <div className="sticky top-8">
                            <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4 px-2">מושגי מפתח</h5>
                            <div className="space-y-3">
                              {selectedGuide.concepts?.map((concept, idx) => (
                                <div key={idx} className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-100 dark:border-gray-800 text-right">
                                  <div className="font-bold text-sm text-blue-600 dark:text-blue-400 mb-1">{concept.term}</div>
                                  <div className="text-[10px] text-gray-500 leading-relaxed">{concept.definition}</div>
                                </div>
                              ))}
                            </div>
                            
                            <div className="mt-8 p-6 bg-blue-600 rounded-2xl text-white shadow-lg shadow-blue-600/20 text-right">
                              <Lightbulb className="mb-3 opacity-60" size={24} />
                              <h6 className="font-bold text-sm mb-2">טיפ למבחן</h6>
                              <p className="text-xs opacity-90 leading-relaxed">בסטטיסטיקה תמיד תתחילו באפיון סוג המשתנה. זה יקבע באיזה מבחן או נוסחה תשתמשו.</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* ACCOUNTING CHALKBOARD LAYOUT (Original) */
                    <>
                      <div className="border-b-2 border-dashed border-white/20 pb-8 mb-10 text-center">
                        <h2 className="text-3xl font-extrabold text-white mb-3" style={{ textShadow: '2px 2px 0px rgba(0,0,0,0.5)' }}>
                          {selectedGuide.title}
                        </h2>
                        <p className="text-green-300/60 text-sm italic select-none">מתודולוגיית פתרון לפי שלבים</p>
                      </div>

                      {selectedGuide.introduction && (
                        <div className="mb-8 bg-white/5 p-6 rounded-2xl border border-white/10 shadow-inner">
                          <div className="flex items-center gap-2 mb-3 text-blue-400">
                            <Info size={20} />
                            <span className="font-bold text-sm uppercase tracking-wider">רקע תיאורטי:</span>
                          </div>
                          <p className="text-gray-200 text-lg leading-relaxed font-medium">
                            {selectedGuide.introduction}
                          </p>
                        </div>
                      )}

                      {selectedGuide.concepts && (
                        <div className="mb-12 grid grid-cols-1 md:grid-cols-2 gap-4">
                          {selectedGuide.concepts.map((concept, idx) => (
                            <div key={idx} className="bg-white/10 p-5 rounded-2xl border border-white/10 hover:bg-white/20 transition-all group/concept">
                              <h5 className="text-yellow-400 font-bold text-sm mb-2 flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
                                {concept.term}
                              </h5>
                              <p className="text-gray-300 text-xs leading-relaxed opacity-80 group-hover/concept:opacity-100 transition-opacity">
                                {concept.definition}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}

                      {selectedGuide.question && (
                        <div className="mb-12 bg-yellow-500/5 p-8 rounded-3xl border-2 border-dashed border-yellow-500/20">
                          <div className="flex items-center gap-3 mb-4 text-yellow-500">
                            <HelpCircle size={24} />
                            <h3 className="text-xl font-bold">השאלה:</h3>
                          </div>
                          <p className="text-gray-200 text-lg leading-relaxed italic">
                            "{selectedGuide.question}"
                          </p>
                        </div>
                      )}

                      {selectedGuide.steps && (
                        <div className="space-y-12">
                          {selectedGuide.steps.map((step, idx) => (
                            <motion.div 
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.1 }}
                              key={idx} 
                              className="relative pr-12 text-right"
                            >
                              <div className="absolute right-0 top-0 w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-lg font-bold text-white border border-white/20 shadow-inner">
                                {idx + 1}
                              </div>
                              <h4 className="text-2xl font-bold text-yellow-200 mb-4">{step.title}</h4>
                              <p className="text-gray-300 text-sm mb-6 leading-relaxed bg-white/5 p-4 rounded-xl border border-white/5">
                                {step.explanation}
                              </p>
                              
                              {step.rows && (
                                <div className="bg-[#051510] p-8 rounded-3xl border-2 border-white/10 shadow-2xl max-w-2xl">
                                   <div className="space-y-3">
                                     {step.rows.map((row, rIdx) => (
                                       <div key={rIdx} className={cn(
                                         "flex items-center justify-between gap-8 py-2 transition-colors",
                                         row.isTotal ? "mt-4 pt-4 border-t-2 border-white/40 font-bold text-white text-xl" : "text-gray-300 text-lg border-b border-white/5 last:border-b-0"
                                       )}>
                                         <div className="flex items-center gap-2 group/tooltip relative">
                                           <span className="text-right">{row.label}</span>
                                           {row.tooltip && (
                                             <div className="relative inline-block cursor-help">
                                               <Info size={16} className="text-blue-400 opacity-40 group-hover/tooltip:opacity-100 transition-opacity" />
                                               <div className="absolute bottom-full mb-3 right-0 w-72 p-4 bg-[#1a1a1a] text-white text-sm font-normal rounded-2xl border border-gray-700 opacity-0 group-hover/tooltip:opacity-100 transition-all scale-95 group-hover/tooltip:scale-100 pointer-events-none z-50 shadow-2xl backdrop-blur-md">
                                                 <div className="flex items-start gap-2">
                                                   <HelpCircle size={16} className="text-yellow-400 shrink-0 mt-0.5" />
                                                   <p>{row.tooltip}</p>
                                                 </div>
                                                 <div className="absolute top-full right-4 w-3 h-3 bg-[#1a1a1a] border-b border-r border-gray-700 rotate-45 -mt-1.5" />
                                               </div>
                                             </div>
                                           )}
                                         </div>
                                         <div className={cn(
                                           "font-mono tabular-nums min-w-[120px] text-left",
                                           row.isLoss || row.isNegative || row.amount.includes('(') ? "text-red-400" : row.isTotal ? "text-green-400" : "text-blue-300"
                                         )}>
                                           {row.isNegative ? `(${row.amount})` : row.amount}
                                           {row.isTotal && (
                                             <div className={cn(
                                               "h-0.5 w-full mt-0.5 rounded-full",
                                               row.isLoss ? "bg-red-400/50" : "bg-green-400/50"
                                             )} />
                                           )}
                                         </div>
                                       </div>
                                     ))}
                                   </div>
                                </div>
                              )}

                              {(step.formula || step.calculation) && !step.rows && (
                                <div className="grid grid-cols-1 gap-4 mr-2">
                                  {step.formula && (
                                    <div className="bg-black/40 p-5 rounded-2xl border-2 border-dashed border-green-500/30" dir="ltr">
                                      <span className="text-[10px] text-green-400 block mb-3 uppercase font-bold tracking-[0.2em] opacity-80" dir="rtl">נוסחה להצבה:</span>
                                      <div className="text-blue-300 text-lg md:text-xl block text-center font-bold tracking-tight overflow-x-auto">
                                        <BlockMath math={step.formula} />
                                      </div>
                                    </div>
                                  )}
                                  {step.calculation && (
                                    <div className="bg-white/5 p-5 rounded-2xl border border-white/10 italic text-right">
                                      <span className="text-[10px] text-gray-500 block mb-2 uppercase font-bold" dir="rtl">חישובי עזר ודוגמה:</span>
                                      <p className="text-gray-200 text-sm leading-relaxed">{step.calculation}</p>
                                    </div>
                                  )}
                                </div>
                              )}
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </>
                  )}

                   {selectedSubjectId === 'accounting' && (
                    <div className="mt-16 p-8 bg-yellow-900/10 border-2 border-yellow-600/20 rounded-3xl backdrop-blur-sm">
                      <div className="flex items-center gap-3 mb-6 text-yellow-500">
                        <Calculator size={24} />
                        <span className="font-bold uppercase tracking-[0.3em] text-xs">דגשים חשובים ללוח</span>
                      </div>
                      <ul className="text-sm text-yellow-100/60 space-y-4 list-none pr-2">
                        <li className="flex gap-3">
                          <span className="text-yellow-600 font-black">★</span>
                          <span>שימו לב לתאריכים: חלק ברווח ופחת הפרש מקורי מחושבים יחסית לתקופת ההחזקה בשנה.</span>
                        </li>
                        <li className="flex gap-3">
                          <span className="text-yellow-600 font-black">★</span>
                          <span>דיווידנד אינו הכנסה: בשיטת השווי המאזני, קבלת מזומן מהמוחזקה היא החזר השקעה ומקטינה את ערך הנכס במאזן.</span>
                        </li>
                        <li className="flex gap-3">
                          <span className="text-yellow-600 font-black">★</span>
                          <span>מוניטין: היתרה שלא יוחסה לנכסים ספציפיים ב-PPA היא מוניטין, ובדרך כלל לא מופחתת (אלא נבחנת לירידת ערך).</span>
                        </li>
                        <li className="flex gap-3 mt-4 border-t border-yellow-600/10 pt-4">
                          <span className="text-red-500 font-black">⚠</span>
                          <span className="text-red-200">אובדן השפעה מהותית: אם לאחר מכירה אחוז האחזקה יורד מתחת ל-20% (למשל מ-35% ל-14%), מפסיקים להשתמש בשיטת השווי המאזני ולא יירשמו יותר רווחי אקוויטי.</span>
                        </li>
                      </ul>
                    </div>
                  )}

                  <div className="mt-12 flex justify-center">
                    <button 
                      onClick={() => setSelectedGuide(null)}
                      className={cn(
                        "px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-all",
                        selectedSubjectId === 'statistics' 
                          ? "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700" 
                          : "bg-white/10 hover:bg-white/20 text-white border border-white/20"
                      )}
                    >
                      חזור לרשימה
                    </button>
                  </div>
                </div>

                {/* Chalk Dust Effect - Only for Accounting */}
                {selectedSubjectId === 'accounting' && (
                  <div className="absolute bottom-4 right-8 text-white/5 font-mono text-8xl select-none rotate-12 pointer-events-none">
                    אקוויטי
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-[600px] flex flex-col items-center justify-center text-center p-8 bg-white dark:bg-[#141414] rounded-3xl border border-gray-200 dark:border-gray-800 border-dashed"
              >
                <div className={cn(
                  "p-8 rounded-full mb-6",
                  activeTab === 'journal' ? "bg-blue-50 dark:bg-blue-900/20" : "bg-green-50 dark:bg-green-900/20"
                )}>
                  {activeTab === 'journal' ? (
                    <BookOpen size={64} className="text-blue-500 opacity-80" />
                  ) : (
                    <GraduationCap size={64} className="text-green-500 opacity-80" />
                  )}
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {activeTab === 'journal' ? 'בחר פקודת יומן מהרשימה' : 'בחר תרגיל מהרשימה'}
                </h2>
                <p className="text-gray-500 dark:text-gray-400 max-w-xs">
                  לחץ על אחד האירועים בצד ימין כדי לראות את {activeTab === 'journal' ? 'הרישום החשבונאי המלא' : 'שלבי הפתרון והנוסחאות'}.
                </p>
                
                <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
                  {selectedSubjectId === 'accounting' ? (
                    <>
                      <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl text-right transition-all hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer" onClick={() => { setActiveTab('journal'); setSelectedCategory('equity'); }}>
                        <TrendingUp className="text-blue-500 mb-2" size={24} />
                        <h4 className="font-bold text-sm dark:text-gray-200">הון עצמי</h4>
                        <p className="text-[10px] text-gray-400">מניות ודיווידנדים</p>
                      </div>
                      <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl text-right transition-all hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer" onClick={() => { setActiveTab('journal'); setSelectedCategory('loans'); }}>
                        <Coins className="text-green-500 mb-2" size={24} />
                        <h4 className="font-bold text-sm dark:text-gray-200">הלוואות</h4>
                        <p className="text-[10px] text-gray-400">ריבית והוצאות לשלם</p>
                      </div>
                      <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl text-right transition-all hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer" onClick={() => { setActiveTab('theory'); setSelectedCategory('equity-method'); }}>
                        <PieChart className="text-purple-500 mb-2" size={24} />
                        <h4 className="font-bold text-sm dark:text-gray-200">תרגיל אקוויטי</h4>
                        <p className="text-[10px] text-gray-400">שווי מאזני צעד-אחר-צעד</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl text-right transition-all hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer" onClick={() => { setSelectedCategory('descriptive'); }}>
                        <BarChart3 className="text-orange-500 mb-2" size={24} />
                        <h4 className="font-bold text-sm dark:text-gray-200">תיאורית</h4>
                        <p className="text-[10px] text-gray-400">ממוצע, שונות וסטיות</p>
                      </div>
                      <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl text-right transition-all hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer" onClick={() => { setSelectedCategory('probability'); }}>
                        <HelpCircle className="text-blue-500 mb-2" size={24} />
                        <h4 className="font-bold text-sm dark:text-gray-200">הסתברות</h4>
                        <p className="text-[10px] text-gray-400">מותנית, בייס וקומבינטוריקה</p>
                      </div>
                      <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl text-right transition-all hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer" onClick={() => { setSelectedCategory('inference'); }}>
                        <Info className="text-green-500 mb-2" size={24} />
                        <h4 className="font-bold text-sm dark:text-gray-200">הסקה</h4>
                        <p className="text-[10px] text-gray-400">התפלגות נורמלית ו-CLT</p>
                      </div>
                    </>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </div>
    </div>
  </main>

      {/* Copyright Footer */}
      <div className="max-w-7xl mx-auto p-8 border-t border-gray-200 dark:border-gray-800 text-center text-gray-400 dark:text-gray-500 text-sm font-medium">
        כל הזכויות שמורות לרוברט תיגר, האקדמית תל אביב-יפו. &copy; {new Date().getFullYear()}
      </div>
    </div>
  );
}
