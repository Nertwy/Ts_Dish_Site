import {Ingredient} from '../../../interfaces/FoodsAll'
export interface FoodFromClient{
    name:string,
    steps:string[],
    cuisine:string,
    ingredients:Ingredient
}