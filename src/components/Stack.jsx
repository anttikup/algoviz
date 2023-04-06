import { makeId } from '../id';
import { readParams } from './util';

export function makeStackClass(events) {
    return class Stack {
        id;
        items;
        constructor(p1, p2, p3) {
            const params = [p1, p2, p3];
            const { options, items } = readParams(params, { options: {}, items: [] });

            this.id = makeId();
            console.info("Created stack,", this.id);
            events.push({
                event: 'create',
                type: 'stack',
                componentId: this.id,
                items: [ ...items ],
                color: options?.color,
                name: options?.name
            });
            this.items = [ ...items ];
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
