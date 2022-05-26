import express, {json} from 'express';
import chalk from 'chalk';
import cors from 'cors';

import router from './routes/index.js';

const app = express();

app.use(cors());
app.use(json());

app.use(router);

app.listen(4000, () => {
    console.log(chalk.green.bold('Servidor no ar'));
})