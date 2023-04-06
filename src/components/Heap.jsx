import { makeId } from '../id';
import { readParams } from './util';

function minSort(a, b) {
    return a - b;
}

function maxSort(a, b) {
    return b - a;
}

export function makeHeapClass(events) {
    return class Heap {
        id;
        items;
        constructor(p1, p2, p3) {
            const params = [p1, p2, p3];
            const { options, items, func: comparator, string: compStr } =
                readParams(params, { options: {}, items: [], func: null, string: "min" });

            this.id = makeId();

            if ( compStr && comparator ) {
                throw new Error("Can't give both comparator function or 'min'/'max'");
            }

            if ( compStr === "min" ) {
                this.comparator = minSort;
            } else if ( compStr === "max" ) {
                this.comparator = maxSort;
            } else {
                this.comparator = comparator;
            }

            items.sort(this.comparator);
            this.items = items;

            console.info("Created heap,", this.id);
            events.push({
                event: 'create',
                type: 'heap',
                componentId: this.id,
                items: [ ...items ],
                color: options?.color,
                name: options?.name
            });
        }

        insert(val) {
            this.items.push(val);
            this.items.sort(this.comparator);
            events.push({
                event: 'insert',
                componentId: this.id,
                value: val,
                comparator: this.comparator
            });
        }

        extract() {
            const val = this.items.shift();
            events.push({
                event: 'extract',
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

export default function Heap({ name, items, color }) {
    return (
        <div className="heap" style={{backgroundColor: color }}>
            <h2>{ name }</h2>
            <div>
                {
                    items.map((item, index) => (
                        <div key={`${index}-${item}`} className="item heap-item">
                            {item}
                        </div>
                    ))
                }
            </div>
        </div>
    );
};
