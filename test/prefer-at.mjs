import outdent from 'outdent';
import {getTester} from './utils/test.mjs';

const {test} = getTester(import.meta);


test.snapshot({
	valid: [
		'array.at(-1)',
		'array.at(1)',
		'array[0]',
		'array.foo',
		'array[-1]',
		'array[array.length + 1]',
		'array[array.length - 0]',
		'array[-10 + array.length]',
		'array[array.length - 1n]',
		'array[+array.length - 1]',
		'array[array.length - -1]',
		'array[array.length - foo]',
		'array[array.length + -10]',
		'const OFFSET = -1; array[array.length + OFFSET];'
	],
	invalid: [
		'array[array.length - 1]',
		'array[array.length - 10]',
		'array[ /**/ (( /**/ (( /**/ array.length /**/ )) /**/ - /**/ (( /**/ 10 /**/ )) /**/ )) /**/ ]',
		'const OFFSET = 1; array[array.length - OFFSET];',
		// 'array.at(array.length - 1)'
	]
});
