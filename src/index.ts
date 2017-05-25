import { Bootstrapper } from './core/bootstrapper';
import { resolve } from 'path';

let b = new Bootstrapper();
b.initialize(resolve(__dirname, './config.json'))
	.then(() => b.start());