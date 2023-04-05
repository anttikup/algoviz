import { useState, useRef, useReducer } from 'react';

import FloatingElem from './components/Floating';
import StackElem, { makeStackClass } from './components/Stack';
import QueueElem, { makeQueueClass } from './components/Queue';
import ArrayElem, { makeArrayClass } from './components/Array';
import ObjectElem, { makeObjectClass } from './components/Object';
import GlobalsElem, { makeGlobalsClass } from './components/Globals';
import Editor from './components/Editor';
import './App.css';

function Component({ data }) {
    console.info("Render:", data);
    switch ( data.type ) {
        case 'stack':
            return (<StackElem name={data.name} items={data.items} color={data.color} />);
        case 'queue':
            return (<QueueElem name={data.name} items={data.items} color={data.color} />);
        case 'array':
            return (<ArrayElem name={data.name} items={data.items} color={data.color} />);
        case 'object':
            return (<ObjectElem name={data.name} items={data.items} color={data.color} />);
        case 'globals':
            return (<GlobalsElem name={data.name} items={data.items} color={data.color} />);
    }

    return null;
}

const reducer = (state, action) => {
    console.log("Event:", action.event, "\n state:", JSON.stringify(state));

    if ( action ) {
        switch ( action.event ) {
            case 'clear':
                console.log("newstate:", {});
                return {};

            case 'create':
                return {
                    ...state,
                    [action.componentId]: {
                        type: action.type,
                        items: action.items ?? [],
                        color: action.color,
                        size: action.size,
                        name: action.name
                    }
                }
            case 'push':
                return {
                    ...state,
                    [action.componentId]: {
                        ...state[action.componentId],
                        items: [
                            ...state[action.componentId].items,
                            action.value
                        ]
                    }
                }
                break;
            case 'pop': {
                const items = state[action.componentId].items;
                return {
                    ...state,
                    [action.componentId]: {
                        ...state[action.componentId],
                        items: state[action.componentId].items.slice(0, items.length - 1)
                    }
                }
                break;
            }
            case 'enqueue':
                return {
                    ...state,
                    [action.componentId]: {
                        ...state[action.componentId],
                        items: [
                            ...state[action.componentId].items,
                            action.value
                        ]
                    }
                }
                break;
            case 'dequeue':
                return {
                    ...state,
                    [action.componentId]: {
                        ...state[action.componentId],
                        items: state[action.componentId].items.slice(1)
                    }
                }

            case 'getitem':
            case 'getprop':
                return { ...state };

            case 'setitem':
                const items = state[action.componentId].items;
                return {
                    ...state,
                    [action.componentId]: {
                        ...state[action.componentId],
                        items: items.map(
                            (item, index) => index === action.index
                                           ? action.value
                                           : item
                        )
                    }
                };

            case 'setprop': {
                const obj = state[action.componentId].items;
                console.log("set prop:", action.prop);
                return {
                    ...state,
                    [action.componentId]: {
                        ...state[action.componentId],
                        items: {
                            ...obj,
                            [action.prop]: action.value

                        }
                    }
                }
            }
            default:
                throw new Error(`Unknown action: ${action.event}`);
        }
    }
};


function App() {
    const [events, setEvents] = useState([]);
    const [state, dispatch] = useReducer(reducer, {});
    const [pos, setPos] = useState(0);
    const editorRef = useRef();

    const runCode = () => {
        console.info("Run code");
        if ( !editorRef.current ) {
            return;
        }

        const code = editorRef.current.value;
        const curEvents = [];
        const Stack = makeStackClass(curEvents);
        const Queue = makeQueueClass(curEvents);
        const Array = makeArrayClass(curEvents);
        const Object = makeObjectClass(curEvents);
        const Globals = makeGlobalsClass(curEvents);
        const vars = new Globals({ color: 'chartreuse', name: 'vars' });

        eval(code);

        dispatch({ event: 'clear' });
        setPos(0);
        setEvents(curEvents);
    };


    const step = () => {
        if ( pos >= events.length ) {
            throw new Error("No more events");
        }
        console.info("Step", pos);
        const event = events[pos];
        console.log("Cur:", event);
        dispatch(event);
        setPos(pos + 1);
    };

    const keys = Object.keys(state);
    const globals = keys.filter(key => state[key].type === 'globals');
    const others = keys.filter(key => state[key].type !== 'globals');
    console.log("  ", globals, others);
    return (
            <div className="App">
                <header>Hello</header>
                <div className="main">
                    <div className="globals-bar">
                        {
                            globals.map(id => (<Component key={id} data={state[id]} />))
                        }
                    </div>
                    <div className="blocks-section">
                        <div className="blocks">
                            {
                                others.map(id => (<Component key={id} data={state[id]} />))
                            }
                        </div>
                    </div>
                </div>
                <div className="controls">
                    <Editor ref={editorRef} />
                    <br/>
                    <button onClick={runCode}>Run</button>
                    <button onClick={step} disabled={pos === events.length}>Step</button>
                    {' '}
                    <span>{pos + 1}/{events.length + 1}</span>
                </div>

            </div>

    );
}

export default App;
