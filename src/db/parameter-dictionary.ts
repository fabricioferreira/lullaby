import * as _ from 'lodash';

export class ParameterDictionary {
	private _keys: Array<string> = [];
	private _values: Array<any> = [];

	public constructor() { }

	public Push(key: string, value: any): void {
		if (this._keys.find(k => k === key))
			throw 'This key already exists.';

		if (_.isNil(value))
			throw 'Cannot insert a null/empty value in the dictionary.'

		this._keys.push(key);
		this._values.push(value);
	}

	public Pop(key: string): any {
		let index = this._keys.indexOf(key);

		if (index === -1) return null;

		return this._values[index];
	}

	public get Length(): number {
		return this._keys.length;
	}
}