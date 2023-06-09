import { makeId } from '../id';
import { readParams } from './util';


export function makeQueueClass(events) {
    return class Queue {
        id;
        items;
        constructor(p1, p2, p3) {
            const params = [p1, p2, p3];
            const { options, items } = readParams(params, { options: {}, items: [] });

            this.id = makeId();
            console.info("Created queue,", this.id);
            events.push({
                event: 'create',
                type: 'queue',
                componentId: this.id,
                items: [ ...items ],
                color: options?.color,
                name: options?.name
            });
            this.items = [ ...items ];
        }

        enqueue(val) {
            this.items.push(val);
            events.push({
                event: 'enqueue',
                componentId: this.id,
                value: val,
            });
        }

        dequeue() {
            const val = this.items.shift();
            events.push({
                event: 'dequeue',
                componentId: this.id,
                value: val,
            });
            return val;
        }

        front() {
            return this.items[0];
        }

        back() {
            return this.items[this.items.length - 1];
        }

        get length() {
            return this.items.length;
        }

    };
}

export default function Queue({ name, items, limbo, color }) {
    return (
        <div className="queue" style={{ backgroundColor: color }}>
            <h2>{ name }</h2>
            <div>
                {
                    items.map((item, index) => (
                        <div key={`${index}-${item}`} className="item queue-item">
                            {item}
                        </div>
                    ))
                }
            </div>
        </div>
    );
};
