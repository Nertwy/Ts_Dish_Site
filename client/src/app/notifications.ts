import { createSlice } from '@reduxjs/toolkit';

const initialState: any = [];

const notificationSlice = createSlice({
    name: 'notifications',
    initialState,
    reducers: {
        addNotification: (state, action) => {
            state.push(action.payload);
        },
        removeNotification: (state, action) => {
            const index = state.findIndex((n: any) => n.id === action.payload);
            if (index !== -1) {
                state.splice(index, 1);
            }
        },
    },
});

export const { addNotification, removeNotification } = notificationSlice.actions;

export default notificationSlice.reducer;