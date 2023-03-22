import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Dish } from "../../../interfaces/Ingridient";
interface ClientLikedDish {
    dish_id: number,
}
interface DishState {
    dishes: Dish[];
    loading: boolean,
    likedDishes: ClientLikedDish[]
}
const initialState: DishState = {
    dishes: [],
    loading: true,
    likedDishes: []
}

export const CardListSclice = createSlice({
    initialState,
    name: "list",
    reducers: {
        resetDishes: (state) => {
            state = {
                dishes: [],
                likedDishes: [],
                loading: true
            }
        },
        removeHeartsActive:(state)=>{
            state.dishes.forEach((val)=>val.like = false)
        },
        pushLikedDishes: (state, action: PayloadAction<ClientLikedDish[]>) => {
            state.likedDishes = action.payload
        },
        addDishToList: (state, action: PayloadAction<Dish>) => {
            state.dishes.push(action.payload)
            state.loading = false
        },
        modifyDishLike: (state, action: PayloadAction<number>) => {
            const index = state.dishes.findIndex((val) => {
                return val.id === action.payload
            })
            if (index === -1) return;
            state.dishes[index].like = !state.dishes[index].like
        }
    }
})
export const { addDishToList, modifyDishLike, pushLikedDishes, resetDishes,removeHeartsActive } = CardListSclice.actions
export default CardListSclice.reducer