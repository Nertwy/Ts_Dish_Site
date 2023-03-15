import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Dish } from "../../../interfaces/Ingridient";

interface DishState {
    dishes: Dish[];
    loading: boolean
}
const initialState: DishState = {
    dishes: [],
    loading: true

}

export const CardListSclice = createSlice({
    initialState,
    name: "list",
    reducers: {
        addDishToList: (state, action: PayloadAction<Dish>) => {
            state.dishes.push(action.payload)
            state.loading = false
        },
        modifyDishLike: (state, action: PayloadAction<number>) => {
            state.dishes[action.payload].like = !state.dishes[action.payload].like
        }
    }
})
export const { addDishToList, modifyDishLike } = CardListSclice.actions
export default CardListSclice.reducer