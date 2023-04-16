import react, {MouseEventHandler, useEffect, useRef, useState} from 'react';
import styles from './App.module.sass';
import {Canvas, getRealMousePos} from "./canvasTools";
import {changeMarkupMode, fillFieldCell, getSolution} from "../redux/AppSlice";
import axios, {CancelTokenSource} from "axios";
import {RootState} from "../redux/store";
import {useAppDispatch, useAppSelector} from "../hooks";
import {useDispatch} from "react-redux";



export const App = () =>{
	//type of dispatch needs to be changed!!!
	const dispatch = useDispatch<any>();
	const {field} = useAppSelector((state:RootState)=>state.App)
	const canvasRef: react.MutableRefObject<any> = useRef();
	const [canvas, setCanvas]: Array<Canvas|any> = useState();

	const canvasWidth: number = 1000
	const step: number = canvasWidth/10

	const handleCanvasClick: MouseEventHandler = (event: react.MouseEvent): void =>{
		const canvasElement: HTMLElement = canvasRef.current;
		const drawingMode: string = 'start'
		const mouse = getRealMousePos(canvasElement, event, canvasWidth);
		const field_coords : {x: number, y: number } = {x: Math.floor(mouse.x/step), y: Math.floor(mouse.y/step)}
		dispatch(fillFieldCell(field_coords))
		canvas.renderFromField(field, step)
		//canvas.fillCell(Math.floor(mouse.x/step), Math.floor(mouse.y/step), step)

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
		const source: CancelTokenSource = axios.CancelToken.source()
		const data: {field: number[][], source: CancelTokenSource} = {field: field, source: source};
		dispatch(getSolution(data));
	}

	useEffect(() => {
		if(canvasRef.current) {
			setCanvas(new Canvas(canvasRef.current, 1000))
		}
		if(canvas){
			console.log(canvas)
			canvas.drawGrid(100)
		}
	}, [canvasRef.current]);

	useEffect(() => {
		if(canvas)
			canvas.renderFromField(field, step)
	}, [field]);

	return (
		<>
			<canvas ref={canvasRef} className={styles.Canvas} width="1000" height="1000" onClick={handleCanvasClick}/>
			<div className={styles.modeBtns}>
				<button className={styles.modebtn} onClick={handleStartBtnClick}>set start</button>
				<button className={styles.modebtn} onClick={handleEndBtnClick}>set end</button>
				<button className={styles.modebtn} onClick={handleObstacleBtnClick}>set obstacles</button>
			</div>
			<button className={styles.findBtn} onClick={handleSolveClick}>
				find!
			</button>
		</>
	)
}

