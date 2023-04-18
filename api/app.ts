import express, {Express, Request, Response} from "express";
import cors from "cors";
import logger from 'morgan'
import bodyParser from "body-parser";
import {BFS, constructPath} from "./findPathBFS";
export const app: Express = express();

app.use(bodyParser())
app.use(cors());
app.use(express.json())
app.use(logger('dev'))


//API
const API_URL_PREFIX : string = '/api/v0'

app.post(API_URL_PREFIX + '/path', (req: Request, res: Response) => {
    const path:[number, number][] = constructPath(BFS(req.body.field))
    // console.log(req.body.field)
    res.send({
        path: path
    });
});


app.get('/', (req: Request, res: Response) => {
    res.send('Express + TypeScript Server');
});

