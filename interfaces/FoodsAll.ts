interface Measures {
  id: number;
  name: string;
}
export interface Ingredient {
  id: number;
  amount: number;
  name: string;
  measureUnit: string;
}

export interface FoodAll {
  id: number;
  name?: string;
  cuisine: string;
  url: string;
  Ingridiences: Ingredient[];
  slug: string;
  transport?: Function;
  recipes?: Recipe;
}
export interface Recipe {
  step: string[];
  id: number[];
}
