


export function BFS(field: number[][]): typeof field {

	const width: number = field.length
	const end: number = width**2
	const start: number = 0

	let start_coordinates: number[] = [0, 0]

	for (let i: number = 0; i < width; i++) {
		for (let j: number = 0; j < width; j++) {
			if (field[i][j] == start) {
				start_coordinates[0] = i;
				start_coordinates[1] = j;
				break;
			}
		}
	}

	const toExplore: number[][] = [start_coordinates];

	while (toExplore.length) {
		const [x, y] = toExplore[0];
		toExplore.shift();

		if (isOnField(width, x + 1, y)) {
			if (field[x + 1][y] === end) {
				return field;
			}
			if (field[x + 1][y] === -1) {
				field[x + 1][y] = field[x][y] + 1;
				toExplore.push([x + 1, y]);
			}
		}
		if (isOnField(width, x - 1, y)) {
			if (field[x - 1][y] === end) {
				return field;
			}
			if (field[x - 1][y] === -1) {
				field[x - 1][y] = field[x][y] + 1;
				toExplore.push([x - 1, y]);
			}
		}
		if (isOnField(width, x, y + 1)) {
			if (field[x][y + 1] === end) {
				return field;
			}
			if (field[x][y + 1] === -1) {
				field[x][y + 1] = field[x][y] + 1;
				toExplore.push([x, y + 1]);
			}
		}
		if (isOnField(width, x, y - 1)) {
			if (field[x][y - 1] === end) {
				return field;
			}
			if (field[x][y - 1] === -1) {
				field[x][y - 1] = field[x][y] + 1;
				toExplore.push([x, y - 1]);
			}
		}

	}

	function isOnField(width: number, x: number, y: number): boolean {
		return x >= 0 && y >= 0 && x < width && y < width
	}


	return field
}

export function constructPath(field: number[][]): [number, number][] {
	const path: [number, number][] = [];
	const width = field.length
	const end = width**2
	let end_coordinates: [number, number] = [0, 0]

	for (let i: number = 0; i < width; i++) {
		for (let j: number = 0; j < width; j++) {
			if (field[i][j] === end) {
				end_coordinates[0] = i;
				end_coordinates[1] = j;
				break;
			}
		}
	}

	let nextCell: [number, number] = [end_coordinates[0], end_coordinates[1]]
	path.push(nextCell)

	while (field[nextCell[0]][nextCell[1]]) {

		const Neighbours = []

		if (isOnField(width, ...getNeighbour(nextCell, 1, 0))) {
			Neighbours.push(getNeighbour(nextCell, 1, 0))
		}
		if (isOnField(width, ...getNeighbour(nextCell, -1, 0))) {
			Neighbours.push(getNeighbour(nextCell, -1, 0))
		}
		if (isOnField(width, ...getNeighbour(nextCell, 0, 1))) {
			Neighbours.push(getNeighbour(nextCell, 0, 1))
		}
		if (isOnField(width, ...getNeighbour(nextCell, 0, -1))) {
			Neighbours.push(getNeighbour(nextCell, 0, -1))
		}


		const minNeighbour = getMinNeighbour(Neighbours, field)
		console.log(minNeighbour)
		if(field[nextCell[0]][nextCell[1]] <= field[minNeighbour[0]][minNeighbour[1]]){
			return []
		}
		nextCell = [minNeighbour[0], minNeighbour[1]];

		path.push(nextCell)

	}



	function getMinNeighbour(cells: [number, number][], field: number[][]): [number, number] {

		const minNeighbour: [number, number] = cells.find(cell => field[cell[0]][cell[1]] >= 0) || cells[0]

		cells.forEach((cell: number[]) => {
			const cellVal: number = field[cell[0]][cell[1]];
			const minNeighbourVal: number = field[minNeighbour[0]][minNeighbour[1]];
			if (cellVal >= 0 && cellVal < minNeighbourVal) {
				minNeighbour[0] = cell[0]
				minNeighbour[1] = cell[1]
			}
		})

		return minNeighbour
	}
	function getNeighbour(cell: [number, number], x_step: number, y_step: number): [number, number] {
		return [cell[0] + x_step, cell[1] + y_step]
	}
	function isOnField(width: number, x: number, y: number): boolean {
		return x >= 0 && y >= 0 && x < width && y < width
	}



	return path
}
