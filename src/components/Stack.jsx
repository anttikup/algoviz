import { makeId } from '../id';

export function makeStackClass(events) {
    return class Stack {
        id;
        items;
        constructor(options) {
            this.id = makeId();
            this.items = [];
            console.info("Created stack,", this.id);
            events.push({
                event: 'create',
                type: 'stack',
                componentId: this.id,
                color: options?.color,
                name: options?.name
            });
        }

        push(val) {
            this.items.push(val);
            events.push({
                event: 'push',
                componentId: this.id,
                value: val
            });
        }

        pop() {
            const val = this.items.pop();
            events.push({
                event: 'pop',
                componentId: this.id,
                value: val
            });
            return val;
        }

        peek() {
            return this.items[this.items.length - 1];
        }

        get length() {
            return this.items.length;
        }
    };
}

export default function Stack({ name, items, color }) {
    return (
        <div className="stack" style={{ backgroundColor: color }}>
            <h2>{ name }</h2>
            <div>
                {
                    items.map((item, index) => (
                        <div key={`${index}-${item}`} className="item stack-item">
                            {item}
                        </div>
                    ))
                }
            </div>
        </div>
    );
};
