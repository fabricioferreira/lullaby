import { IProvider } from '../db/provider';

export class ProviderFactory {
	public constructor() { }

	public createProvider(type: string): Promise<IProvider> {
		return null;
	}
}