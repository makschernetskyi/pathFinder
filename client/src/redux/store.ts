import { configureStore } from "@reduxjs/toolkit"
import thunkMiddleware from 'redux-thunk';
import {Reducer, Store} from 'redux';
import {AppReducer} from "./AppSlice";

type RootReducer = {
	App: Reducer
}

const rootReducer: RootReducer = {
	App: AppReducer
}

const store: Store = configureStore({
	reducer: rootReducer,
	middleware: getDefaultMiddleware =>
		getDefaultMiddleware()
		.prepend(
			thunkMiddleware
		).concat()
})


export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch

export {store};

