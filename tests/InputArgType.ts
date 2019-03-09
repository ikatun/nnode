import { readFileSync } from 'fs';

export class InputArgType {

}


export interface ISomething<T> {
  value: number;
  something: T;
}

console.log('readFileSync', readFileSync);
