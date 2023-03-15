import { createSlice, PayloadAction } from "@reduxjs/toolkit";
interface User {
    name: string,
    email: string,
    logged: boolean,
    accessToken: string
}
const initialState: User = {
    accessToken: "",
    email: "",
    logged: false,
    name: ""

}

export const UserSlice = createSlice({
    initialState,
    name: "user",
    reducers: {
        login: (state) => {
            state.logged = true
        },
        logout: (state) => {
            state.logged = false
            state.accessToken = ""
        },
        setToken: (state, action: PayloadAction<string>) => {
            state.accessToken = action.payload
        },
        reset: (state) => {
            state.accessToken = ""
            state.email = ""
            state.logged = false
            state.name = ""
        }

    }
})
export const { login, logout, setToken, reset } = UserSlice.actions
export default UserSlice.reducer