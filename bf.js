function brainfuck(str) {
	const tape = [...Array(1024).fill(0)];
	const brackets = [];
	let pointer = 0;

	let ix = 0;
	let isIncrement = true;
	while (ix < str.length && ix >= 0) {
		if (!isIncrement) {
			ix--;
			continue;
		}
		switch (str[ix]) {
			case ">":
				if (pointer < tape.length) pointer++;
				break;
		}
		ix++;
	}
}

brainfuck("hello");
