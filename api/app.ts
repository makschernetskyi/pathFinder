import express, {Express, Request, Response} from "express";
import cors from "cors";
import logger from 'morgan'
import bodyParser from "body-parser";
export const app: Express = express();

app.use(bodyParser())
app.use(cors());
app.use(express.json())
app.use(logger('dev'))


//API
const API_URL_PREFIX : string = '/api/v0'

app.post(API_URL_PREFIX + '/path', (req: Request, res: Response) => {
    console.log(req.body.field)
    res.send('Express + TypeScript Server');
});


app.get('/', (req: Request, res: Response) => {
    res.send('Express + TypeScript Server');
});

