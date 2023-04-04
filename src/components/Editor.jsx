import React from 'react';

const Editor = React.forwardRef(({ forwardRef }, ref) => {
    return (
        <textarea ref={ref} className="editor">
        </textarea>
    );
});

export default Editor;
