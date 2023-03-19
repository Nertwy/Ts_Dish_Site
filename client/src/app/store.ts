import { configureStore, createSlice } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import counterReducer from '../features/counter/CounterSlice'
import addDishSlice from "./addDishSlice";
import CardListSclice from "./CardListSlice";
import UserSlice from "./UserSlice";
interface ThemeState {
  darkMode: boolean
}
const initialState: ThemeState = {
  darkMode: false
}
const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleDarkMode: (state) => {
      state.darkMode = !(state.darkMode)
      const html = document.getElementById("root")
      if (state.darkMode) {
        html?.classList.add("dark")
      } else {
        html?.classList.remove("dark")
      }
    }
  }
})
export const { toggleDarkMode } = themeSlice.actions
export const store = configureStore({
  reducer: {
    counter: counterReducer,
    list: CardListSclice,
    theme: themeSlice.reducer,
    user: UserSlice,
    addDish:addDishSlice,
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector