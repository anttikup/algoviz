import React from 'react';

// eslint-disable-next-line no-multi-str
const initialText = "\
vars.sum = 0; \n\
const q = new Queue({ name: 'q' }); \n\
const vec = new Vector([8, 3, 9, 2, 3, 4, 5, 20], { name: 'vec' }); \n\
const st = new Stack({ name: 'st' }); \n\
const dic = new Dict({ name: 'dic' }); \n\
const hp = new Heap({ name: 'hp' }); \n\
\n\
dic['x'] = 9; \n\
dic['y'] = 'banana'; \n\
\n\
q.enqueue(3); \n\
q.enqueue(6); \n\
q.enqueue(4); \n\
q.enqueue(1); \n\
\n\
st.push(vec[q.dequeue()]); \n\
st.push(vec[q.dequeue()]); \n\
st.push(vec[q.dequeue()]); \n\
st.push(vec[q.dequeue()]); \n\
\n\
for ( vars.i = 0; vars.i < vec.length; vars.i++ ) { \n\
   hp.insert(vec[vars.i]); \n\
} \n\
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
