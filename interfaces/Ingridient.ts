export interface Ingredient {
  amount: number;
  id: number;
  name: string;
  measureUnit: string;
}

export interface Recipe {
  id: number;
  step: string[];
}

export interface ClientDish {
  name: string,
  slug: string,
  cuisine: string,
  ingredients: Ingredient[]
  recipes: Recipe
  like: boolean
}
export interface Dish {
  name: string;
  id?: number;
  cuisine: string;
  slug: string;
  url?: string;
  like?: boolean;
  ingredients: Ingredient[];
  recipes: Recipe;
  transport?: Function;
  likes?:number;
}
export interface LoginInterface {
  token: string,
  success: boolean,
  likes: DishLikes[] | null
}
export interface DishLikes {
  id: number
  user_id: number,
  dish_id: number
}
// class DishClass implements Dish {
//   name: string;
//   id: number;
//   cuisine: string;
//   slug: string;
//   url: string;
//   ingredients: Ingredient[];
//   recipes: Recipe;
//   constructor(
//     name: string,
//     id: number,
//     cuisine: string,
//     slug: string,
//     url: string,
//     ingredients: Ingredient[],
//     recipes: Recipe
//   ) {
//     this.name = name;
//     this.id = id;
//     this.cuisine = cuisine;
//     this.slug = slug;
//     this.url = url;
//     this.ingredients = ingredients;
//     this.recipes = recipes;
//   }
// }