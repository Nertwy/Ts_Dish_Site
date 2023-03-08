export interface Ingredient {
  amount: number;
  id: number;
  name: string;
  measureUnit: string;
}

export interface Recipe {
  id: number[];
  step: (string | null)[];
}

export interface Dish {
  name: string;
  id: number;
  cuisine: string;
  slug: string;
  url: string;
  ingredients: Ingredient[];
  recipes?: Recipe;
  transport?: Function
}

class DishClass implements Dish {
  name: string;
  id: number;
  cuisine: string;
  slug: string;
  url: string;
  ingredients: Ingredient[];
  recipes: Recipe;

  constructor(
    name: string,
    id: number,
    cuisine: string,
    slug: string,
    url: string,
    ingredients: Ingredient[],
    recipes: Recipe
  ) {
    this.name = name;
    this.id = id;
    this.cuisine = cuisine;
    this.slug = slug;
    this.url = url;
    this.ingredients = ingredients;
    this.recipes = recipes;
  }
}