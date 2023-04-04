import { useState, useRef } from 'react';

import StackElem, { makeStackClass } from './components/Stack';
import QueueElem, { makeQueueClass } from './components/Queue';
import ArrayElem, { makeArrayClass } from './components/Array';
import Editor from './components/Editor';
import './App.css';

function Component({ data }) {
    switch ( data.type ) {
        case 'stack':
            return (<StackElem items={data.items} color={data.color} />);
        case 'queue':
            return (<QueueElem items={data.items} color={data.color} />);
        case 'array':
            return (<ArrayElem items={data.items} color={data.color} />);
    }

    return null;
}

function App() {
    const [events, setEvents] = useState([]);
    const [components, setComponents] = useState({});
    const [pos, setPos] = useState(0);
    const editorRef = useRef();

    const runCode = () => {
        if ( !editorRef.current ) {
            return;
        }

        const code = editorRef.current.value;
        const curEvents = [];
        const Stack = makeStackClass(curEvents);
        const Queue = makeQueueClass(curEvents);
        const Array = makeArrayClass(curEvents);

        eval(code);

        setEvents(curEvents);
        setPos(0);
        setComponents({});
    };

    const runEvents = pos => {
        const components = {};

        for ( const event of events.slice(0, pos) ) {
            console.log("vent:", event);
            switch ( event.event ) {
                case 'create':
                    components[event.componentId] = {
                        type: event.type,
                        items: [],
                        color: event.color,
                        size: event.size
                    };
                    break;
                case 'push':
                    components[event.componentId].items.push(event.value);
                    break;
                case 'pop':
                    components[event.componentId].items.pop();
                    break;
                case 'enqueue':
                    components[event.componentId].items.push(event.value);
                    break;
                case 'dequeue':
                    components[event.componentId].items.shift();
                    break;
                case 'getitem':
                    break;
                case 'setitem':
                    components[event.componentId].items[event.index] = event.value;
                    break;
            }
        }
        return components;
    };

    const step = () => {
        const components = runEvents(pos + 1);
        setComponents(components);
        setPos(pos + 1);
    };

    return (
        <div className="App">
            <header>Hello</header>
            <div className="main">
                {
                    Object.keys(components).map(id => (<Component key={id} data={components[id]} />))
                }
            </div>
            <div className="controls">
                <Editor ref={editorRef} />
                <br/>
                <button onClick={runCode}>Run</button>
                <button onClick={step} disabled={pos === events.length}>Step</button> <span>{pos + 1}/{events.length + 1}</span>
            </div>
        </div>
    );
}

export default App;
