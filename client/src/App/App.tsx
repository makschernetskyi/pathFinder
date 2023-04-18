import react, {MouseEventHandler, useEffect, useRef, useState} from 'react';
import styles from './App.module.sass';
import {Canvas, getRealMousePos} from "./canvasTools";
import {changeMarkupMode, clearField, fillFieldCell, getSolution} from "../redux/AppSlice";
import axios, {CancelTokenSource} from "axios";
import {RootState} from "../redux/store";
import {useDispatch, useSelector} from "../hooks";



export const App: react.FC = () =>{

	const dispatch = useDispatch();
	const {field, status, error} = useSelector((state:RootState)=>state.App)
	const canvasRef: react.MutableRefObject<any> = useRef();
	const [canvas, setCanvas]: Array<Canvas|any> = useState();
	const [readonly, setReadonly]: [boolean,any] = useState(false);
	const source: CancelTokenSource = axios.CancelToken.source()

	const canvasWidth: number = 1000
	const fieldWidth : number = 10
	const step: number = canvasWidth/fieldWidth

	const handleCanvasClick: MouseEventHandler = (event: react.MouseEvent): void =>{

		if(readonly) return

		const canvasElement: HTMLElement = canvasRef.current;
		const mouse = getRealMousePos(canvasElement, event, canvasWidth);
		const field_coords : {x: number, y: number } = {x: Math.floor(mouse.x/step), y: Math.floor(mouse.y/step)}
		dispatch(fillFieldCell(field_coords))
		canvas.renderFromField(field, step)

	}

	const handleStartBtnClick = (): void =>{
		dispatch(changeMarkupMode({mode:'start'}))
	}
	const handleEndBtnClick = (): void =>{
		dispatch(changeMarkupMode({mode:'end'}))
	}
	const handleObstacleBtnClick = (): void =>{
		dispatch(changeMarkupMode({mode:'obstacle'}))
	}

	const handleSolveClick = ():void=>{
		const data: {field: number[][], source: CancelTokenSource} = {field: field, source: source};
		dispatch(getSolution(data));
	}

	const handleClearClick = ()=>{
		dispatch(clearField({}))
		setReadonly(false)
	}

	useEffect(() => {
		if(canvasRef.current) {
			setCanvas(new Canvas(canvasRef.current, 1000))
		}
		if(canvas){
			canvas.drawGrid(100)
		}
	}, [canvasRef.current]);

	useEffect(() => {
		if(canvas)
			canvas.renderFromField(field, step)
	}, [field]);

	useEffect(() => {
		if(status === 'resolved'){
			canvas.renderPathFromField(field, step, true)
			setReadonly(true)
		}
	}, [status]);

	useEffect(() => {
		if(error){
			alert(error)
		}
	}, [error]);

	useEffect(() => {
		return () => {
			source.cancel()
		};
	}, []);


	return (
		<>
			<canvas ref={canvasRef} className={styles.Canvas} width="1000" height="1000" onClick={handleCanvasClick}/>
			<div className={styles.modeBtns}>
				<button className={styles.modebtn} onClick={handleStartBtnClick}>set start</button>
				<button className={styles.modebtn} onClick={handleEndBtnClick}>set end</button>
				<button className={styles.modebtn} onClick={handleObstacleBtnClick}>set obstacles</button>
			</div>
			<button className={styles.clearBtn} onClick={handleClearClick}>
				clear
			</button>
			<button className={styles.findBtn} onClick={handleSolveClick}>
				find!
			</button>
		</>
	)
}

