import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { Dish, Ingredient, Recipe } from "../../../interfaces/Ingridient"
interface FormData {
    dish: Dish
}
const initialState: FormData = {
    dish: {
        cuisine: "",
        name: "",
        slug: "",
        recipes: {
            id: [],
            step: [""]
        },
        ingredients: [{ id: -1, amount: 0, measureUnit: "", name: "" }],

    }
}
const addDishSlice = createSlice({
    initialState,
    name: "addDish",
    reducers: {
        changeCuisine: (state, payload: PayloadAction<string>) => {
            state.dish.cuisine = payload.payload
        },
        handleIngChange: (state, payload: PayloadAction<Ingredient[]>) => {
            state.dish.ingredients = payload.payload
        },
        handleRecipeChange: (state, payload: PayloadAction<Recipe>) => {
            state.dish.recipes = payload.payload
        },
        handleNameChange:(state,payload:PayloadAction<string>)=>{
            state.dish.name = payload.payload
        }
    }
})
export const { changeCuisine,handleIngChange,handleRecipeChange,handleNameChange } = addDishSlice.actions
export default addDishSlice.reducer