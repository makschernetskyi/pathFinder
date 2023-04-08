import { configureStore } from "@reduxjs/toolkit"
import {Reducer, Store} from 'redux';
import {AppReducer} from "./AppSlice";

type RootReducer = {
	App: Reducer
}

const rootReducer: RootReducer = {
	App: AppReducer
}

const store: Store = configureStore({
	reducer: rootReducer
})

export {store};