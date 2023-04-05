import React from 'react';

// eslint-disable-next-line no-multi-str
const initialText = "\
vars.sum = 0;\n\
const q = new Queue({ name: 'q', color: 'pink' }); \n\
const arr = new Array([8, 3, 9, 2, 3, 4, 5, 20], { name: 'arr', color: 'bisque' });\n\
const st = new Stack({ name: 'st', color: 'aquamarine' }); \n\
const obj = new Object({ name: 'obj', color: 'darkorange' }); \n\
\n\
obj.x = 9; \n\
obj.y = 'banana'; \n\
\n\
q.enqueue(3); \n\
q.enqueue(6); \n\
q.enqueue(4); \n\
q.enqueue(1); \n\
\n\
st.push(arr[q.dequeue()]); \n\
st.push(arr[q.dequeue()]);\n\
st.push(arr[q.dequeue()]); \n\
st.push(arr[q.dequeue()]); \n\
\n\
while ( st.length > 0 ) {\n\
   vars.sum += st.pop();\n\
}\n\
";

const Editor = React.forwardRef(({ forwardRef }, ref) => {
    return (
        <textarea ref={ref} className="editor" defaultValue={initialText}>
        </textarea>
    );
});

export default Editor;
