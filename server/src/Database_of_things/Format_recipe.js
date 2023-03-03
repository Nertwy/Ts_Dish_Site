"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const FoodFull_json_1 = __importDefault(require("./FoodFull.json"));
const IngridienceFile_json_1 = __importDefault(require("./IngridienceFile.json"));
const fs_1 = __importDefault(require("fs"));
const database_1 = require("../database");
const FoodDB_json_1 = __importDefault(require("./FoodDB.json"));
function fetchRecipes() {
    let recipes = [];
    IngridienceFile_json_1.default.recipes.forEach((el) => {
        let recipe = { id: [], step: [] };
        el.forEach((el) => {
            recipe === null || recipe === void 0 ? void 0 : recipe.step.push(el.description);
            recipe === null || recipe === void 0 ? void 0 : recipe.id.push(parseInt(el.id));
        });
        recipes.push(recipe);
    });
    return recipes;
}
function ReworkData() {
    let food = [];
    let ing = [];
    let recipes = fetchRecipes();
    FoodFull_json_1.default.forEach((el, index) => {
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
    fs_1.default.writeFile("FoodDB.json", JSON.stringify(food), (err) => console.log(err));
}
//ReworkData();
function firebaseLoadData() {
    return __awaiter(this, void 0, void 0, function* () {
        let dishesDb = database_1.db.doc("Dishes/DishesForServer");
        dishesDb.set({
            food: FoodDB_json_1.default
        });
        // console.log(food);
    });
}
// firebaseLoadData();
function firebaseAddLikes() {
    return __awaiter(this, void 0, void 0, function* () { });
}
