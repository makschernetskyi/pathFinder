import react from "react";

export class Canvas{
	static exists: Boolean = false;
	static instance: any = null;
	element: HTMLCanvasElement | undefined;
	width: number | undefined;
	ctx: any;

	constructor(element: HTMLCanvasElement, width: number) {
		if(Canvas.exists){
			return Canvas.instance
		}
		Canvas.exists = true;
		Canvas.instance = this;
		this.element = element;
		this.width = width
		this.ctx = element.getContext('2d')

	}

	drawGrid(step:number){
		const ctx = this.ctx
		const side:number = this.width || 0
		for(let i = step; i<side; i+=step){
			ctx.beginPath()
			ctx.moveTo(i,0)
			ctx.lineTo(i,side)
			ctx.stroke()
			ctx.closePath()
		}
		for(let i = step; i<side; i+=step){
			ctx.beginPath()
			ctx.moveTo(0,i)
			ctx.lineTo(side,i)
			ctx.stroke()
			ctx.closePath()
		}

	}
	fillCell(x:number,y:number,step:number,color:string = '#000000'){
		const ctx = this.ctx;
		ctx.fillStyle = color
		ctx.fillRect(x*step, y*step, step, step);
		ctx.fillStyle = '';
	}

	renderFromField(field: number[][], step: number){
		const ctx = this.ctx;
		const side: number = this.width || 0
		ctx.clearRect(0,0,side,side)
		for(let i:number=0, max_i:number =field.length; i<max_i; i++){
			for(let j:number=0, max_j:number =field[0].length; j<max_j; j++){
				if(field[i][j]===1){
					this.fillCell(i,j,step, '#000000')
				}else if(field[i][j]===2){
					this.fillCell(i,j,step, '#00ff00')
				}else if(field[i][j]===3){
					this.fillCell(i,j,step, '#ff0000')
				}
			}
		}
		this.drawGrid(step)
	}
}

export function getMousePos(canvas: HTMLElement, event: react.MouseEvent): {x: number, y: number} {
	const rect : DOMRect = canvas.getBoundingClientRect();
	return {
		x: event.clientX - rect.left,
		y: event.clientY - rect.top
	};
}

export function getRealMousePos(canvas: HTMLElement, event: react.MouseEvent, canvasWidth: number): {x: number, y: number}{
	const mousePos: {x: number, y: number} = getMousePos(canvas, event);
	const clientWidth = canvas.getBoundingClientRect().width
	return {
		x: mousePos.x*canvasWidth/clientWidth,
		y: mousePos.y*canvasWidth/clientWidth,
	};
}