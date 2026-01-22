
import { configureStore } from "@reduxjs/toolkit";
import expenseReducer from "./expenseSlice";

const store = configureStore({
    reducer: {
        expenseData: expenseReducer,
    },
})

export default store;