import { SubjectId, Category } from './types';

export const CATEGORY_LABELS: Record<Category, string> = {
  equity: 'הון עצמי',
  securities: 'ניירות ערך',
  options: 'אופציות',
  dividend: 'דיווידנד',
  shares: 'מניות',
  loans: 'הלוואות',
  'equity-method': 'שווי מאזני',
  bonds: 'אג"ח',
  descriptive: 'סטטיסטיקה תיאורית',
  probability: 'הסתברות',
  inference: 'הסקה סטטיסטית',
  formulas: 'דף נוסחאות'
};

export const SUBJECT_CATEGORIES: Record<SubjectId, { id: Category; label: string }[]> = {
  accounting: [
    { id: 'all' as any, label: 'הכל' },
    { id: 'shares', label: 'מניות' },
    { id: 'dividend', label: 'דיווידנד' },
    { id: 'options', label: 'אופציות' },
    { id: 'equity', label: 'הון עצמי' },
    { id: 'securities', label: 'ניירות ערך' },
    { id: 'loans', label: 'הלוואות' },
    { id: 'bonds', label: 'אג"ח' },
    { id: 'equity-method', label: 'שווי מאזני' },
  ],
  statistics: [
    { id: 'all' as any, label: 'הכל' },
    { id: 'descriptive', label: 'תיאורית' },
    { id: 'probability', label: 'הסתברות' },
    { id: 'inference', label: 'הסקה' },
    { id: 'formulas', label: 'נוסחאות' },
  ]
};
