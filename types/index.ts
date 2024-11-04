export interface NutritionalInfo {
  calories: number;
  protein: {
    value: number;
    unit: string;
    dailyValue: string;
  };
  sodium: {
    value: number;
    unit: string;
    dailyValue: string;
  };
  sugar?: number | { value: number; unit: string };
  saturatedFat: {
    value: number;
    unit: string;
    dailyValue: string;
  };
  weight?: number | { value: number; unit: string };
}

export interface Burger {
  name: string | { ko: string; en: string };
  nutritionalInfo: NutritionalInfo;
  brand?: string;
}
