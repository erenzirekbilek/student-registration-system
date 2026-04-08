import { configureStore } from "@reduxjs/toolkit";
import userApi from "./userAPI"; // userApi'yi default olarak içe aktarın

export const store = configureStore({
    reducer : {
        [userApi.reducerPath] : userApi.reducer
    },
    middleware : (getDefaultMiddleware) => 
        getDefaultMiddleware().concat(userApi.middleware)
});
