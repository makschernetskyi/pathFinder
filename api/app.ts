import express, {Express, Request, Response} from "express";
import cors from "cors";
import logger from 'morgan'
export const app: Express = express();


app.use(cors());
app.use(express.json())
app.use(logger('dev'))


app.get('/', (req: Request, res: Response) => {
    res.send('Express + TypeScript Server');
});

