import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { ClientDish, Dish, Ingredient, Recipe } from "../../../interfaces/Ingridient"
import { slugify } from "transliteration"
interface FormData {
    dish: ClientDish
}
const initialState: FormData = {
    dish: {
        like: false,
        cuisine: "",
        name: "",
        slug: "",
        ingredients: [{ id: -1, amount: 0, measureUnit: "", name: "" }],
        recipes: { id: 0, step: [""] }
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
        handleRecipeChange: (state, payload: PayloadAction<string[]>) => {
           state.dish.recipes.step = payload.payload
           return state
        },
        handleNameChange: (state, payload: PayloadAction<string>) => {
            state.dish.name = payload.payload
        },
        setSlug: (state, payload: PayloadAction<string>) => {
            state.dish.slug = payload.payload
        }
    }
})
export const { changeCuisine, handleIngChange, handleRecipeChange, handleNameChange, setSlug } = addDishSlice.actions
export default addDishSlice.reducer