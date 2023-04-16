import { createAsyncThunk, AsyncThunk, createSlice, Slice, ActionReducerMapBuilder, Reducer} from "@reduxjs/toolkit";
import axios, {CancelTokenSource} from "axios";


export interface AppState {
	mode: string,
	field: Array<Array<number>>,
	error: string,
	status: string
}

type FillFieldCellAction = {
	type: string,
	payload: {
		x: number,
		y: number
	}
}

type ChangeMarkupModeAction = {
	type: string,
	payload:{
		mode: string
	}
}


export const getSolution = createAsyncThunk(
	'app/getSolution',
	async (data: {field: number[][], source: CancelTokenSource }, {rejectWithValue})=>{
		try{
			console.log('requested')
			return 'data';
		}catch(err){
			return rejectWithValue(err)
		}
	}
)





const initialState: AppState = {
	mode: 'start',
	field: [...Array(10)].map(elem=>[...Array(10)].map(elem=>0)),
	error: '',
	status: ''
}


const AppSlice: Slice = createSlice({
	name: "app",
	initialState,
	reducers: {
		fillFieldCell(state: AppState, action:FillFieldCellAction): AppState{
			const {x,y} = action.payload;
			if(state.mode === 'start'){
				fillStartCell(state.field,x,y)
			}else if(state.mode === 'end'){
				fillEndCell(state.field,x,y)
			}
			else if(state.mode === 'obstacle'){
				fillObstacleCell(state.field,x,y)
			}
			return state
		},
		changeMarkupMode(state: AppState, action:ChangeMarkupModeAction): AppState{
			state.mode = action.payload.mode
			return state
		}
	},
	extraReducers: (builder:ActionReducerMapBuilder<AppState>): void => {
		builder
			.addCase(getSolution.pending,(state,action)=>{

			})
			.addCase(getSolution.fulfilled,(state,action)=>{

			})
			.addCase(getSolution.rejected,(state,action)=>{

			})
	}
})

function fillStartCell(field: number[][], x: number, y: number): number[][]{
	for(let i:number=0, max_i:number =field.length; i<max_i; i++){
		for(let j:number=0, max_j:number =field[0].length; j<max_j; j++){
			if(field[i][j]===2){
				field[i][j]=0
			}
		}
	}
	field[x][y] = 2
	return field
}
function fillEndCell(field: number[][], x: number, y: number): number[][]{
	for(let i:number=0, max_i:number =field.length; i<max_i; i++){
		for(let j:number=0, max_j:number =field[0].length; j<max_j; j++){
			if(field[i][j]===3){
				field[i][j]=0
			}
		}
	}
	field[x][y] = 3
	return field
}

function fillObstacleCell(field: number[][], x: number, y: number): number[][]{
	field[x][y] = 1
	return field
}

export const AppReducer: Reducer = AppSlice.reducer;
export const {fillFieldCell, changeMarkupMode} = AppSlice.actions