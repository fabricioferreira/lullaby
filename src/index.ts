import { Bootstrapper } from './core/bootstrapper';
import { resolve, dirname } from 'path';

let b = new Bootstrapper();

let configPath = resolve(__dirname, './config.json');

b.initialize(configPath)
	.then(() => b.start());