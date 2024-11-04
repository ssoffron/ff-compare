// menuData.js

export const brands = ["McDonald's", 'Burger King', "Wendy's", 'Taco Bell'];

export const menuItems = [
  { id: 1, brand: "McDonald's", item: 'Big Mac', calories: 540, fat: 29, protein: 25, carbs: 45 },
  { id: 2, brand: 'Burger King', item: 'Whopper', calories: 660, fat: 40, protein: 28, carbs: 49 },
  {
    id: 3,
    brand: "Wendy's",
    item: "Dave's Single",
    calories: 570,
    fat: 34,
    protein: 30,
    carbs: 40,
  },
  { id: 4, brand: 'Taco Bell', item: 'Crunchy Taco', calories: 170, fat: 9, protein: 8, carbs: 13 },
  // Add more menu items here
];

export const mcdonalds: Menu[] = [
  {
    id: '1',
    name: 'Big Mac',
    amount: 214,
    calories: 540,
    carbohydrates: 45,
    sugar: 9,
    protein: 25,
    fat: 29,
    saturatedFat: 10,
    sodium: 940,
  },
];

type Menu = MenuInfo & NutritionalFacts;

type MenuInfo = {
  id: string;
  name: string;
};

// https://m.cafe.daum.net/buyginseng2001/Mb7B/38?q=D_DCD9RS8sKUw0&
type NutritionalFacts = {
  amount: number; // 중량
  calories: number; // 열량
  carbohydrates: number; // 탄수화물
  sugar: number; // 당
  protein: number; // 단백질
  fat: number; // 지방
  saturatedFat: number; // 포화지방
  sodium: number; // 나트륨
};
