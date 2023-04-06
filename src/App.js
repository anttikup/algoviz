import { useEffect, useState, useRef, useReducer } from 'react';

import Controls from './components/Controls';
import Editor from './components/Editor';

import ArrayComponent, { makeArrayClass } from './components/Array';
import GlobalsComponent, { makeGlobalsClass } from './components/Globals';
import HeapComponent, { makeHeapClass } from './components/Heap';
import ObjectComponent, { makeObjectClass } from './components/Object';
import QueueComponent, { makeQueueClass } from './components/Queue';
import StackComponent, { makeStackClass } from './components/Stack';


import './App.css';

function Component({ data }) {
    switch ( data.type ) {
        case 'stack':
            return (<StackComponent name={data.name} items={data.items} color={data.color} />);
        case 'queue':
            return (<QueueComponent name={data.name} items={data.items} limbo={data.limbo} color={data.color} />);
        case 'heap':
            return (<HeapComponent name={data.name} items={data.items} color={data.color} />);
        case 'array':
            return (<ArrayComponent name={data.name} items={data.items} color={data.color} />);
        case 'object':
            return (<ObjectComponent name={data.name} items={data.items} color={data.color} />);
        case 'globals':
            return (<GlobalsComponent name={data.name} items={data.items} color={data.color} />);
        default:
            new Error(`Unknown type: ${data.type}`);
    }

    return null;
}

const reducer = (state, action) => {
    if ( action ) {
        switch ( action.event ) {
            case 'clear':
                return {};

            case 'create': {
                return {
                    ...state,
                    [action.componentId]: {
                        type: action.type,
                        items: action.items ?? [], // Items is cloned when action is created.
                        color: action.color,
                        size: action.size,
                        name: action.name
                    }
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
            case 'pop': {
                const items = state[action.componentId].items;
                return {
                    ...state,
                    [action.componentId]: {
                        ...state[action.componentId],
                        limbo: items[items.length - 1],
                        items: items.slice(0, items.length - 1)
                    }
                }
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
            case 'dequeue': {
                const items = state[action.componentId].items;
                return {
                    ...state,
                    [action.componentId]: {
                        ...state[action.componentId],
                        limbo: items[0],
                        items: items.slice(1)
                    }
                }
            }
            case 'insert': {
                const sortedItems = [
                    ...state[action.componentId].items,
                    action.value
                ];
                sortedItems.sort(action.comparator);

                return {
                    ...state,
                    [action.componentId]: {
                        ...state[action.componentId],
                        items: sortedItems
                    }
                }
            }
            case 'extract': {
                const items = state[action.componentId].items;
                return {
                    ...state,
                    [action.componentId]: {
                        ...state[action.componentId],
                        items: items.slice(1)
                    }
                }
            }
            case 'getitem': {
                return state;
            }

            case 'getprop': {
                return state;
            }

            case 'setitem': {
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
            }
            case 'setprop': {
                const obj = state[action.componentId].items;
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

    useEffect(() => {
        setTimeout(() => {
            for ( const key of Object.keys(state) ) {
                const comp = state[key];
                if ( comp.limbo ) {
                    state[key] = {
                        ...state[key],
                        limbo: undefined
                    };
                }
            }
        }, 1000);

    });



    const runCode = () => {
        console.info("Run code");
        if ( !editorRef.current ) {
            return;
        }

        const code = editorRef.current.value;
        const curEvents = [];
        {
            /* eslint-disable no-unused-vars */
            const Stack = makeStackClass(curEvents);
            const Queue = makeQueueClass(curEvents);
            const Heap = makeHeapClass(curEvents);
            const Array = makeArrayClass(curEvents);
            const Object = makeObjectClass(curEvents);
            const Globals = makeGlobalsClass(curEvents);
            const vars = new Globals({ name: 'vars' });

            // eslint-disable-next-line no-eval
            eval(code);
        }

        dispatch({ event: 'clear' });
        setPos(0);
        setEvents(curEvents);
    };


    const step = () => {
        if ( pos >= events.length ) {
            throw new Error("No more events");
        }
        const event = events[pos];
        dispatch(event);
        setPos(pos + 1);
    };

    const keys = Object.keys(state);
    const globals = keys.filter(key => state[key].type === 'globals');
    const others = keys.filter(key => state[key].type !== 'globals');
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
            <div className="bottom-section">
                <div className="code-group">
                    <Controls run={runCode} stepForward={step} position={pos} numSteps={events.length} />
                    <Editor ref={editorRef} />
                </div>
                <div className="help">
                    <div className="help-content">
                        <h3>Help</h3>
                        <p>
                            You can write almost any code in the code editor.
                        </p>
                        <p>
                            Use the following components in your code to display them.
                        </p>
                        <h4>Components</h4>

                        <h5>Array</h5>
                        <code>
                            const arr = new Array();<br/>
                            arr[5] = 3;<br/>
                            stack.push(arr[1] + arr[5]);<br/>
                            arr.length;<br/>
                        </code>
                        <h6>Constructor</h6>
                        <p>
                            Parameters: options (object), initial items (array), size (integer). The parameters can be in any order.
                        </p>
                        <h6>Push</h6>
                        <p>
                            Add a value.
                        </p>
                        <h6>Pop</h6>
                        <p>
                            Get a value.
                        </p>
                        <h6>Length</h6>
                        <p>
                            Number of items
                        </p>

                        <h5>Heap</h5>
                        <code>
                            const heap = new Heap();<br/>
                            heap.insert(3);<br/>
                            heap.extract();<br/>
                            heap.length;<br/>
                        </code>
                        <h6>Constructor</h6>
                        <p>
                            Parameters: options (object), initial items (array), comparator (function <code>(a, b) => ()</code>).
                                                                                                        Parameters can be in any order.
                        </p>
                        <h6>Insert</h6>
                        <p>
                            Add a value.
                        </p>
                        <h6>Extract</h6>
                        <p>
                            Get a value.
                        </p>
                        <h6>Length</h6>
                        <p>
                            Number of items
                        </p>

                        <h5>Queue</h5>
                        <code>
                            const q = new Queue();<br/>
                            q.enqueue(3);<br/>
                            q.dequeue();<br/>
                            q.length;<br/>
                        </code>
                        <h6>Constructor</h6>
                        <p>
                            Parameters: options (object), initial items (array). The parameters can be in any order.
                        </p>
                        <h6>Enqueue</h6>
                        <p>
                            Add a value.
                        </p>
                        <h6>Dequeue</h6>
                        <p>
                            Get a value.
                        </p>
                        <h6>Length</h6>
                        <p>
                            Number of items
                        </p>

                        <h5>Stack</h5>
                        <code>
                            const st = new Stack();<br/>
                            st.push(3);<br/>
                            st.pop();<br/>
                            st.length;<br/>
                        </code>
                        <h6>Constructor</h6>
                        <p>
                            Parameters: options (object), initial items (array). The parameters can be in any order.
                        </p>
                        <h6>Push</h6>
                        <p>
                            Add a value.
                        </p>
                        <h6>Pop</h6>
                        <p>
                            Get a value.
                        </p>
                        <h6>Length</h6>
                        <p>
                            Number of items
                        </p>

                        <h5>vars</h5>
                        <p>
                            Variables set into the <tt>vars</tt> object are displayed at the top.
                        </p>
                        <code>
                            vars.x = 3;<br/>
                            st.push(vars.x);
                        </code>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
