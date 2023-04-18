import {
	createAsyncThunk,
	AsyncThunk,
	createSlice,
	Slice,
	ActionReducerMapBuilder,
	Reducer,
	PayloadAction
} from "@reduxjs/toolkit";
import axios, {CancelTokenSource, AxiosResponse} from "axios";


const API_URL_PREFIX : string = 'http://localhost:3000/api/v0'

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

type ClearAction = {
	type: string,
	payload: {}
}


export const getSolution = createAsyncThunk(
	'app/getSolution',
	async (data: {field: number[][], source: CancelTokenSource }, {rejectWithValue})=>{
		try{
			if(! isFieldValid(data.field) ){
				return rejectWithValue('invalid field, start or end missing.')
			}
			const requestData: string =  JSON.stringify({field: data.field})
			console.log(data.field)
			const response : AxiosResponse = await axios({
				url: API_URL_PREFIX + '/path',
				method: 'post',
				headers: { "Content-Type": "application/json" },
				data: requestData,
				cancelToken: data.source.token
			}).catch(error=>{
				throw new Error(error)
			})

			console.log(response.data)
			if(!response.data.path.length){
				return rejectWithValue('path is impossible')
			}
			return response.data;
		}catch(err){
			let msg = ''
			if ( err instanceof Error ){
				msg = err.message
			}
			return rejectWithValue(msg)
		}
	}
)





const initialState: AppState = {
	mode: 'start',
	field: [...Array(10)].map(elem=>[...Array(10)].map(elem=>-1)),
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
		},
		clearField(state : AppState, action : ClearAction){
			state.field = initialState.field;
			return state
		}
	},
	extraReducers: (builder:ActionReducerMapBuilder<AppState>): void => {
		builder
			.addCase(getSolution.pending,(state,action)=>{
				state.status = 'pending'
				state.error = ''
			})
			.addCase(getSolution.fulfilled,(state,action)=>{
				state.status = 'resolved'
				const path: number[][] = action.payload.path;
				path.pop()
				path.shift()
				path.forEach(cell=>{
					state.field[cell[0]][cell[1]] = -3
				})
			})
			.addCase(getSolution.rejected,(state,action : PayloadAction<any, string>)=>{
				state.status = 'rejected'
				state.error = action.payload
				console.error(action.payload)
			})
	}
})

function fillStartCell(field: number[][], x: number, y: number): number[][]{
	const startMarker : number = 0

	for(let i:number=0, max_i:number =field.length; i<max_i; i++){
		for(let j:number=0, max_j:number =field[0].length; j<max_j; j++){
			if(field[i][j]===startMarker){
				field[i][j]=-1
			}
		}
	}
	field[x][y] = startMarker
	return field
}
function fillEndCell(field: number[][], x: number, y: number): number[][]{

	const endMarker = field.length**2

	for(let i:number=0, max_i:number =field.length; i<max_i; i++){
		for(let j:number=0, max_j:number =field[0].length; j<max_j; j++){
			if(field[i][j]===endMarker){
				field[i][j]=-1
			}
		}
	}
	field[x][y] = endMarker
	return field
}

function fillObstacleCell(field: number[][], x: number, y: number): number[][]{
	field[x][y] = -2
	return field
}

function isFieldValid(field: number[][]) : boolean {
	const endMarker = field.length**2
	const startMarker : number = 0
	let isStart : boolean = false
	let isEnd : boolean = false

	for(let i:number=0, max_i:number =field.length; i<max_i; i++){
		for(let j:number=0, max_j:number =field[0].length; j<max_j; j++){
			if(field[i][j]===endMarker){
				isEnd = true
			}
		}
	}

	for(let i:number=0, max_i:number =field.length; i<max_i; i++){
		for(let j:number=0, max_j:number =field[0].length; j<max_j; j++){
			if(field[i][j]===startMarker){
				isStart = true
			}
		}
	}

	return isStart && isEnd;
}

export const AppReducer: Reducer = AppSlice.reducer;
export const {fillFieldCell, changeMarkupMode, clearField} = AppSlice.actions