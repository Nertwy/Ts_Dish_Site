import foodFull from "./FoodFull.json";
import { FoodAll, Ingredient, Recipe } from "../../../interfaces/FoodsAll";
import ingredients from "./IngridienceFile.json";
import fs from "fs";
import { db } from "../database";
import food from "./FoodDB.json";
function fetchRecipes(): Recipe[] {
  let recipes: Recipe[] = [];
  ingredients.recipes.forEach((el) => {
    let recipe: Recipe = { id: [], step: [] };
    el.forEach((el) => {
      recipe?.step.push(el.description!);
      recipe?.id.push(parseInt(el.id));
    });
    recipes.push(recipe);
  });
  return recipes;
}
function ReworkData() {
  let food: FoodAll[] = [];
  let ing: Ingredient[] = [];
  let recipes = fetchRecipes();
  foodFull.forEach((el, index) => {
    el.node.composition.forEach((el, index) => {
      ing.push({
        amount: el.amount,
        id: parseInt(el.ingredient.id),
        name: el.ingredient.name,
        measureUnit: el.measureUnit.name
      });
    });
    food.push({
      name: el.node.name,
      id: index,
      cuisine: el.node.cuisine.name,
      slug: el.node.slug,
      url: el.node.imageUrl,
      Ingridiences: ing,
      recipes: recipes[index]
    });
    ing = [];
  });

  fs.writeFile("FoodDB.json", JSON.stringify(food), (err) => console.log(err));
}
//ReworkData();
async function firebaseLoadData() {
  let dishesDb = db.doc("Dishes/DishesForServer");
  dishesDb.set({
    food
  });
  // console.log(food);
}
// firebaseLoadData();

async function firebaseAddLikes() {}
