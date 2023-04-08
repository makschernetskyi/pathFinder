import debug_lib, {Debugger} from 'debug'

import {app} from "../app";

const debug : Debugger = debug_lib('api:server');

const port: number = 3000

app.listen(port,(): void =>{
    debug(`listenning on ${port}...`)
})