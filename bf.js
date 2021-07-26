const chalk = require("chalk");
const index = chalk.bold.blue;
const error = chalk.bold.red;

// The number of char preceding and succeeding the error point of the program for better information in ERROR.
const err_length = 5;

class Stack {
	constructor() {
		this.stack = [];
	}

	push(item) {
		this.stack.push(item);
	}

	pop() {
		if (this.stack.length == 0) return "Underflow";
		return this.stack.pop();
	}

	isEmpty() {
		return this.stack.length === 0 ? true : false;
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
	let isLoopFail = false;
	while (ix < str.length && ix >= 0) {
		if (isLoopFail) {
			ix++;
			if (str[ix - 1] === "]") isLoopFail = false;
			else continue;
		}
		switch (str[ix]) {
			case ">":
				if (tpointer < tape.length - 1) tpointer++;
				else {
					if (!wrap) {
						const err1 = str.substring(ix - err_length, ix);
						const err2 = str.substring(ix + 1, ix + err_length);
						throw new Error(
							"Tape length exceeded at index " + index(ix) + " : " + err1 + error(str[ix]) + err2
						);
					} else tpointer = 0;
				}
				break;
			case "<":
				if (tpointer > 0) tpointer--;
				else {
					if (!wrap) {
						const err1 = str.substring(ix - err_length, ix);
						const err2 = str.substring(ix + 1, ix + err_length);
						throw new Error(
							"Tape length subceeded at index " + index(ix) + " : " + err1 + error(str[ix]) + err2
						);
					} else tpointer = tape.length - 1;
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
				else {
					const err1 = str.substring(ix - err_length, ix);
					const err2 = str.substring(ix + 1, ix + err_length);
					throw new Error("No input char at index " + index(ix) + " : " + err1 + error(str[ix]) + err2);
				}
				break;
			case "[":
				if (tape[tpointer] === 0) isLoopFail = true;
				else brackets.push(ix);
				break;
			case "]":
				const temp = brackets.pop() - 1;
				if (tape[tpointer] !== 0) ix = temp;
				break;
		}
		ix++;
	}
	return tape;
}

brainfuck("+++++++++++++++++++++++++++++++++++.>[-]<[->+<]>---.>[-]<[->+<]>+++.");
console.log();
brainfuck(",.>,.>,.", { input: "hey", size: 4 });
console.log();
brainfuck("++++++++++[>+++++++>++++++++>+++<<<-]>+.--..++++++.>+++.>++.<<-----.>----.+++.>.<<+.--..++++++.>+.");
console.log();
brainfuck("++++++++[>++++[>++>+++>+++>+<<<<-]>+>+>->>+[<]<-]>>.>---.+++++++..+++.>>.<-.<.+++.------.--------.>>+.>++.", {
	size: 7,
});
