const input = new Queue("1 * 2 + 3 = 5".split(' '), { name: 'input' });

const priorities = new Dict({
    '=': 1,
    '+': 3,
    '-': 3,
    '*': 5,
    '/': 5,
    '^': 7,
    '-': 7,

}, { name: 'operators' });

const stack = new Stack([], { name: 'stack' });

const output = new Queue({ name: 'output' });

while ( input.length > 0 ) {
    const token = input.dequeue();
    if ( priorities[token] ) {
        log(token, "is an operator");
        log("priority:", priorities[token], "top:", stack.peek(), priorities[stack.peek()]);
        while ( stack.length > 0 && priorities[token] < priorities[stack.peek()] ) {
            output.enqueue(stack.pop());
        }
        stack.push(token);
    } else {
        log(token, "is a value");
        output.enqueue(token);
    }
}


while ( stack.length > 0 ) {
    output.enqueue(stack.pop());
}
