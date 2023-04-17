import { ThunkDispatch } from 'redux-thunk';
import type { RootState, AppDispatch } from './redux/store'
import { Action } from 'redux';
import {
	useDispatch as useReactReduxDispatch,
	useSelector as useReactReduxSelector,
	TypedUseSelectorHook,
} from 'react-redux';



export type TypedDispatch = ThunkDispatch<RootState, unknown, Action>;

export interface TypedUseDispatchHook<TState> {
	(): TState;
}

export const useSelector: TypedUseSelectorHook<RootState> = useReactReduxSelector;
export const useDispatch: TypedUseDispatchHook<TypedDispatch> = useReactReduxDispatch;

