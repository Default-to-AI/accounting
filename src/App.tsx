import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  BookOpen, 
  TrendingUp, 
  PieChart, 
  ChevronLeft, 
  Info,
  ArrowRightLeft,
  Calculator,
  FileText,
  Menu,
  X,
  Calendar,
  Coins,
  ArrowUpDown
} from 'lucide-react';
import { JOURNAL_ENTRIES, JournalEntry } from './types';
import { cn } from './lib/utils';

export default function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'equity' | 'securities' | 'options' | 'dividend' | 'shares'>('all');
  const [sortBy, setSortBy] = useState<'title' | 'category'>('title');
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const filteredEntries = useMemo(() => {
    const filtered = JOURNAL_ENTRIES.filter(entry => {
      const matchesSearch = entry.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           entry.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || entry.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    return [...filtered].sort((a, b) => {
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title, 'he');
      }
      return a.category.localeCompare(b.category, 'he');
    });
  }, [searchTerm, selectedCategory, sortBy]);

  return (
    <div className="min-h-screen font-sans selection:bg-blue-100 dark bg-[#0a0a0a] text-gray-100" dir="rtl">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#141414] border-b border-gray-800 px-4 py-3 md:px-8 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-gray-800 rounded-lg md:hidden"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div className="bg-blue-600 p-2 rounded-lg text-white">
            <Calculator size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">צ'יט שיט לפקודות יומן</h1>
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">חשבונאות: הון עצמי וניירות ערך</p>
          </div>
        </div>

        <div className="flex items-center gap-4 md:gap-6">
          <nav className="hidden md:flex items-center gap-2">
            {[
              { id: 'all', label: 'הכל' },
              { id: 'shares', label: 'מניות' },
              { id: 'dividend', label: 'דיווידנד' },
              { id: 'options', label: 'אופציות' },
              { id: 'equity', label: 'הון עצמי' },
              { id: 'securities', label: 'ניירות ערך' },
            ].map((cat) => (
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

      <main className="max-w-7xl mx-auto p-4 md:p-8">
        {/* Quick Tips Section - Moved from Footer */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white dark:bg-[#141414] p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
            <h4 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2 text-sm">
              <TrendingUp size={16} className="text-blue-600" />
              דוח על השינויים בהון העצמי
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              הדוח מרכז את כל התנועות בסעיפי ההון במהלך התקופה. הוא מקשר בין יתרת הפתיחה ליתרת הסגירה וכולל רווח כולל, הנפקות, דיווידנדים ומימושי אופציות.
            </p>
          </div>
          <div className="bg-white dark:bg-[#141414] p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
            <h4 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2 text-sm">
              <Info size={16} className="text-blue-600" />
              כלל אצבע: ערך נקוב
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              זכרו: חשבון "הון מניות" תמיד נרשם לפי הערך הנקוב של המניות שהונפקו. כל הפרש בין התמורה לערך הנקוב הולך ל"פרמיה על מניות".
            </p>
          </div>
          <div className="bg-white dark:bg-[#141414] p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
            <h4 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2 text-sm">
              <ArrowRightLeft size={16} className="text-blue-600" />
              ניירות ערך סחירים
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              ניירות ערך המוחזקים למסחר נמדדים בדרך כלל בשווי הוגן דרך רווח והפסד. המשמעות היא שכל שינוי בשווי השוק בסוף שנה נרשם כרווח או הפסד "על הנייר".
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Sidebar / List */}
        <aside className={cn(
          "md:col-span-4 space-y-6 transition-all duration-300",
          isSidebarOpen ? "fixed inset-0 z-40 bg-white dark:bg-[#0a0a0a] p-4 md:relative md:bg-transparent md:p-0" : "hidden md:block"
        )}>
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="חפש פקודת יומן..."
              className="w-full bg-white dark:bg-[#141414] border border-gray-200 dark:border-gray-800 rounded-xl py-3 pr-10 pl-4 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm dark:text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="space-y-2 overflow-y-auto max-h-[calc(100vh-250px)] pr-1">
            {filteredEntries.map((entry) => (
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
                    {entry.category === 'equity' ? 'הון עצמי' : 
                     entry.category === 'securities' ? 'ניירות ערך' :
                     entry.category === 'shares' ? 'מניות' :
                     entry.category === 'dividend' ? 'דיווידנד' : 'אופציות'}
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
            ))}
            {filteredEntries.length === 0 && (
              <div className="text-center py-12 text-gray-400">
                <Search size={48} className="mx-auto mb-4 opacity-20" />
                <p>לא נמצאו תוצאות לחיפוש שלך</p>
              </div>
            )}
          </div>
        </aside>

        {/* Content Area */}
        <section className="md:col-span-8">
          <AnimatePresence mode="wait">
            {selectedEntry ? (
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
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-[600px] flex flex-col items-center justify-center text-center p-8 bg-white dark:bg-[#141414] rounded-3xl border border-gray-200 dark:border-gray-800 border-dashed"
              >
                <div className="bg-gray-50 dark:bg-gray-900/50 p-8 rounded-full mb-6">
                  <FileText size={64} className="text-gray-200 dark:text-gray-700" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">בחר פקודת יומן מהרשימה</h2>
                <p className="text-gray-500 dark:text-gray-400 max-w-xs">
                  לחץ על אחד האירועים בצד ימין כדי לראות את הרישום החשבונאי המלא, דוגמאות מספריות והסברים נוספים.
                </p>
                
                <div className="mt-12 grid grid-cols-2 gap-4 w-full max-w-md">
                  <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl text-right">
                    <TrendingUp className="text-blue-500 mb-2" size={24} />
                    <h4 className="font-bold text-sm dark:text-gray-200">הון עצמי</h4>
                    <p className="text-xs text-gray-400">מניות, דיווידנדים, אופציות וקרנות</p>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl text-right">
                    <PieChart className="text-purple-500 mb-2" size={24} />
                    <h4 className="font-bold text-sm dark:text-gray-200">ניירות ערך</h4>
                    <p className="text-xs text-gray-400">השקעות סחירות, הערכות שווי ומימוש</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </div>
    </main>

      {/* Copyright Footer */}
      <div className="max-w-7xl mx-auto p-8 border-t border-gray-200 dark:border-gray-800 text-center text-gray-400 dark:text-gray-500 text-sm font-medium">
        כל הזכויות שמורות לרוברט תיגר, האקדמית תל אביב-יפו. &copy; {new Date().getFullYear()}
      </div>
    </div>
  );
}
