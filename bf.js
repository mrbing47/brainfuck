const chalk = require("chalk");
const index = chalk.bold.blue;
const error = chalk.bold.red;

const throwError = (str, ix, message) => {
	// The number of char preceding and succeeding the error point of the program for better information in ERROR.
	const err_length = 3;
	const err1 = str.substring(ix - err_length, ix);
	const err2 = str.substring(ix + 1, ix + 1 + err_length);
	const err_txt = message + "\nAt Index " + index(ix) + " : " + err1 + error(str[ix]) + err2;
	throw new Error(err_txt);
};

class Stack {
	#stack;

	constructor() {
		this.#stack = [];
	}

	push(item) {
		this.#stack.push(item);
	}

	pop() {
		if (this.#stack.length == 0) throw new Error("Stack is empty");
		return this.#stack.pop();
	}

	isEmpty() {
		return this.#stack.length === 0;
	}

	length() {
		return this.#stack.length;
	}

	getStack() {
		return [...this.#stack];
	}
}

/*
    str: String = The Brainfuck code.
    input: String (OPTIONAL) = The input for the code to take.
    init: Array (OPTIONAL) = The value of initial bits of the tap.
    size: Integer (OPTIONAL) = The size of the tape.
    wrap: Boolean (OPTIONAL) = Whether to wrap the tap in circular manner or not.    
*/

function brainfuck(str = "", { input = "", init = [], size = 256, wrap = false } = {}) {
	const tape = [...init, ...Array(size - init.length).fill(0)];
	const brackets = new Stack();
	let tpointer = 0;
	let ipointer = 0;

	let ix = 0;
	let failState = 0;
	let isLoopFail = false;
	while (ix < str.length && ix >= 0) {
		if (isLoopFail) {
			if (str[ix] === "[") {
				brackets.push(ix);
			}
			if (str[ix] === "]") {
				brackets.pop();
				if (brackets.length() === failState) isLoopFail = false;
			}
			ix++;
			continue;
		}
		switch (str[ix]) {
			case ">":
				if (tpointer < tape.length - 1) tpointer++;
				else {
					if (!wrap) throwError(str, ix, "Tape length Exceeded.");
					else tpointer = 0;
				}
				break;
			case "<":
				if (tpointer > 0) tpointer--;
				else {
					if (!wrap) throwError(str, ix, "Tape length Subceeded.");
					else tpointer = tape.length - 1;
				}
				break;
			case "+":
				if (tape[tpointer] < 127) tape[tpointer]++;
				else tape[tpointer] = -128;
				break;
			case "-":
				if (tape[tpointer] > -128) tape[tpointer]--;
				else tape[tpointer] = 127;
				break;
			case ".":
				process.stdout.write(String.fromCharCode(tape[tpointer]));
				break;
			case ",":
				if (ipointer < input.length) tape[tpointer] = input[ipointer++].charCodeAt(0);
				else throwError(str, ix, "No Input Character.");

				break;
			case "[":
				if (tape[tpointer] === 0) {
					isLoopFail = true;
					failState = brackets.length();
				}
				brackets.push(ix);
				break;
			case "]":
				if (!brackets.isEmpty()) {
					const temp = brackets.pop() - 1;
					if (tape[tpointer] !== 0) ix = temp;
				} else {
					throwError(str, ix, "No Matching Bracket Found.");
				}

				break;
		}
		ix++;
	}
	return tape;
}

// Here are some examples of the Brainfuck programs.
brainfuck("[[]++++++++++++++++.]");
console.log();
brainfuck("+++++++++++++++++++++++++++++++++++.>[-]<[->+<]>---.>[-]<[->+<]>+++.");
console.log();
brainfuck(",.>,.>,.", { input: "hey", size: 4 });
console.log();
brainfuck("++++++++++[>+++++++>++++++++>+++<<<-]>+.--..++++++.>+++.>++.<<-----.>----.+++.>.<<+.--..++++++.>+.");
console.log();
brainfuck(
	"++++++++[>++++[>++>+++>+++>+<<<<-]>+>+>->>+[<]<-]>>.>---.+++++++..+++.>>.<-.<.+++.------.--------.>>+.>++.",
	{
		size: 7,
	}
);
