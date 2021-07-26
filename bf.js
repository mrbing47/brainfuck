const chalk = require("chalk");
const index = chalk.bold.blue;
const error = chalk.bold.red;

function brainfuck(str = "", input = "") {
	const tape = [...Array(1024).fill(0)];
	const brackets = [];
	let tpointer = 0;
	let ipointer = 0;

	let ix = 0;
	let isIncrement = true;
	while (ix < str.length && ix >= 0) {
		if (!isIncrement) {
			ix--;
			continue;
		}
		switch (str[ix]) {
			case ">":
				if (tpointer < tape.length - 1) tpointer++;
				else {
					const err = str.substring(ix - 3, ix + 3);
					throw new Error("Tape length exceeded at index" + index(ix) + ": " + error(err));
				}
				break;
			case "<":
				if (tpointer > 0) tpointer--;
				else {
					const err = str.substring(ix - 3, ix + 3);
					throw new Error("Tape length subceeded at index" + index(ix) + ": " + error(err));
				}
				break;
			case "+":
				if (tape[tpointer] < 255) tape[tpointer]++;
				else tape[tpointer] = 0;
				break;
			case "-":
				if (tape[tpointer] > 0) tape[tpointer]--;
				else tape[tpointer] = 255;
				break;
			case ".":
				process.stdout.write(String.fromCharCode(tape[tpointer]));
				break;
			case ",":
				if (ipointer < input.length) tape[tpointer] = input[ipointer++].charCodeAt(0);
				else {
					const err = str.substring(ix - 3, ix + 3);
					throw new Error("No input char at index" + index(ix) + ": " + error(err));
				}
		}
		ix++;
	}
}

brainfuck("+++++++++++++++++++++++++++++++++++.>++++++++++++++++++++++++++++++++.<.");
