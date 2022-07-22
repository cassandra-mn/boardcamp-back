import chalk from 'chalk';
import app from './app.js';

app.listen(4000, () => {
    console.log(chalk.green.bold('Servidor no ar'));
})