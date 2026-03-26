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
  Coins
} from 'lucide-react';
import { JOURNAL_ENTRIES, JournalEntry } from './types';
import { cn } from './lib/utils';

export default function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'equity' | 'securities'>('all');
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const filteredEntries = useMemo(() => {
    return JOURNAL_ENTRIES.filter(entry => {
      const matchesSearch = entry.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           entry.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || entry.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  return (
    <div className="min-h-screen bg-[#f5f5f5] text-[#1a1a1a] font-sans selection:bg-blue-100" dir="rtl">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 px-4 py-3 md:px-8 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg md:hidden"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div className="bg-blue-600 p-2 rounded-lg text-white">
            <Calculator size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">מדריך חשבונאות</h1>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">הון עצמי וניירות ערך</p>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-6">
          <nav className="flex items-center gap-4">
            <button 
              onClick={() => setSelectedCategory('all')}
              className={cn(
                "px-3 py-1.5 text-sm font-medium rounded-full transition-colors",
                selectedCategory === 'all' ? "bg-blue-50 text-blue-600" : "text-gray-500 hover:text-gray-900"
              )}
            >
              הכל
            </button>
            <button 
              onClick={() => setSelectedCategory('equity')}
              className={cn(
                "px-3 py-1.5 text-sm font-medium rounded-full transition-colors",
                selectedCategory === 'equity' ? "bg-blue-50 text-blue-600" : "text-gray-500 hover:text-gray-900"
              )}
            >
              הון עצמי
            </button>
            <button 
              onClick={() => setSelectedCategory('securities')}
              className={cn(
                "px-3 py-1.5 text-sm font-medium rounded-full transition-colors",
                selectedCategory === 'securities' ? "bg-blue-50 text-blue-600" : "text-gray-500 hover:text-gray-900"
              )}
            >
              ניירות ערך
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 md:p-8 grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Sidebar / List */}
        <aside className={cn(
          "md:col-span-4 space-y-6 transition-all duration-300",
          isSidebarOpen ? "fixed inset-0 z-40 bg-white p-4 md:relative md:bg-transparent md:p-0" : "hidden md:block"
        )}>
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="חפש פקודת יומן..."
              className="w-full bg-white border border-gray-200 rounded-xl py-3 pr-10 pl-4 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
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
                    ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200" 
                    : "bg-white border-gray-200 hover:border-blue-300 hover:shadow-md text-gray-900"
                )}
              >
                <div className="flex items-center justify-between">
                  <span className={cn(
                    "text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md",
                    selectedEntry?.id === entry.id ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-500"
                  )}>
                    {entry.category === 'equity' ? 'הון עצמי' : 'ניירות ערך'}
                  </span>
                  <ChevronLeft size={16} className={cn(
                    "transition-transform",
                    selectedEntry?.id === entry.id ? "text-white" : "text-gray-300 group-hover:text-blue-500"
                  )} />
                </div>
                <h3 className="font-bold text-lg leading-tight">{entry.title}</h3>
                <p className={cn(
                  "text-sm line-clamp-1",
                  selectedEntry?.id === entry.id ? "text-blue-100" : "text-gray-500"
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
                className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden"
              >
                <div className="p-6 md:p-10 border-b border-gray-100 bg-gradient-to-br from-white to-gray-50">
                  <div className="flex items-center gap-2 text-blue-600 mb-4">
                    <BookOpen size={20} />
                    <span className="text-xs font-bold uppercase tracking-widest">פירוט פקודת יומן</span>
                  </div>
                  <h2 className="text-3xl font-black tracking-tight mb-4">{selectedEntry.title}</h2>
                  <p className="text-lg text-gray-600 leading-relaxed max-w-2xl">
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
                    
                    <div className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                      <table className="w-full text-right border-collapse font-accounting">
                        <thead>
                          <tr className="bg-gray-50 border-b border-gray-200">
                            <th className="p-4 font-bold text-sm text-gray-500">חשבון</th>
                            <th className="p-4 font-bold text-sm text-gray-500 w-32">חובה (Debit)</th>
                            <th className="p-4 font-bold text-sm text-gray-500 w-32">זכות (Credit)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedEntry.entries.map((row, idx) => (
                            <tr key={idx} className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors">
                              <td className="p-4 font-medium text-gray-900">
                                {row.account}
                                {row.note && <span className="block text-xs text-gray-400 mt-1 font-normal italic">{row.note}</span>}
                              </td>
                              <td className="p-4 text-blue-600 font-bold">{row.debit || '-'}</td>
                              <td className="p-4 text-red-600 font-bold">{row.credit || '-'}</td>
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
                        <div key={idx} className="bg-gray-50 border border-gray-100 rounded-2xl p-5 hover:border-blue-200 transition-all group">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-black text-blue-600 bg-blue-50 px-2 py-1 rounded-md">דוגמה {idx + 1}</span>
                          </div>
                          <p className="text-gray-700 leading-relaxed font-medium">
                            {example.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end">
                  <button 
                    onClick={() => setSelectedEntry(null)}
                    className="text-sm font-bold text-gray-400 hover:text-gray-900 transition-colors flex items-center gap-2"
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
                className="h-[600px] flex flex-col items-center justify-center text-center p-8 bg-white rounded-3xl border border-gray-200 border-dashed"
              >
                <div className="bg-gray-50 p-8 rounded-full mb-6">
                  <FileText size={64} className="text-gray-200" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">בחר פקודת יומן מהרשימה</h2>
                <p className="text-gray-500 max-w-xs">
                  לחץ על אחד האירועים בצד ימין כדי לראות את הרישום החשבונאי המלא, דוגמאות מספריות והסברים נוספים.
                </p>
                
                <div className="mt-12 grid grid-cols-2 gap-4 w-full max-w-md">
                  <div className="p-4 bg-gray-50 rounded-2xl text-right">
                    <TrendingUp className="text-blue-500 mb-2" size={24} />
                    <h4 className="font-bold text-sm">הון עצמי</h4>
                    <p className="text-xs text-gray-400">מניות, דיווידנדים, אופציות וקרנות</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-2xl text-right">
                    <PieChart className="text-purple-500 mb-2" size={24} />
                    <h4 className="font-bold text-sm">ניירות ערך</h4>
                    <p className="text-xs text-gray-400">השקעות סחירות, הערכות שווי ומימוש</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </main>

      {/* Footer / Quick Tips */}
      <footer className="max-w-7xl mx-auto p-8 border-t border-gray-200 mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-gray-500">
        <div>
          <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp size={18} className="text-blue-600" />
            דוח על השינויים בהון העצמי
          </h4>
          <p className="text-sm leading-relaxed">
            הדוח מרכז את כל התנועות בסעיפי ההון במהלך התקופה. הוא מקשר בין יתרת הפתיחה ליתרת הסגירה וכולל רווח כולל, הנפקות, דיווידנדים ומימושי אופציות.
          </p>
        </div>
        <div>
          <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Info size={18} className="text-blue-600" />
            כלל אצבע: ערך נקוב
          </h4>
          <p className="text-sm leading-relaxed">
            זכרו: חשבון "הון מניות" תמיד נרשם לפי הערך הנקוב של המניות שהונפקו. כל הפרש בין התמורה לערך הנקוב הולך ל"פרמיה על מניות".
          </p>
        </div>
        <div>
          <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <ArrowRightLeft size={18} className="text-blue-600" />
            ניירות ערך סחירים
          </h4>
          <p className="text-sm leading-relaxed">
            ניירות ערך המוחזקים למסחר נמדדים בדרך כלל בשווי הוגן דרך רווח והפסד. המשמעות היא שכל שינוי בשווי השוק בסוף שנה נרשם כרווח או הפסד "על הנייר".
          </p>
        </div>
      </footer>
    </div>
  );
}
