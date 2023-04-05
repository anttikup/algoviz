import { makeId } from '../id';

function isArray(obj) {
    return typeof obj === "object" && obj.length !== undefined;
}

export function makeArrayClass(events) {
    return class MyArray {
        id;
        items;

        constructor(p1, p2, p3) { // ...params doesn't work here for some reason
            const params = [p1, p2, p3];
            const {
                size,
                options,
                items
            } = this.readParams(params);
            this.items = items ?? [];

            this.id = makeId();
            console.info("Created array,", this.id);
            events.push({
                event: 'create',
                type: 'array',
                componentId: this.id,
                size,
                items,
                color: options?.color,
                name: options?.name
            });

            let self = this;

            return new Proxy(this, {
                get(target, prop) {
                    if ( Number(prop) === prop && !(prop in target) ) {
                        return self.items[prop]
                    }
                    return target[prop];
                },
                set(target, prop, val) {
                    if ( Number(prop) === prop ) {
                        self.items[prop] = val;
                        events.push({
                            event: 'setitem',
                            componentId: self.id,
                            index: Number(prop),
                            value: val,
                            id: Number(prop)
                        });
                    }
                    target[prop] = val;
                    return true;
                }
            });
        }

        readParams(params) {
            console.log("hello:", params);
            const parsed = {
                size: 0,
                items: [],
                options: {}
            };
            console.log("hello:", params);
            while ( params.length > 0 ) {
                const param = params.shift();
                console.log("param:", param);
                if ( typeof param === 'number' ) {
                    parsed.size = param;
                } else if ( isArray(param) ) {
                    parsed.items = param;
                } else if ( typeof param === 'object' ) {
                    parsed.options = param;
                }
            }

            console.log("Parsed:", parsed);
            return parsed;
        }

    };
}

export default function Array({ name, items, color }) {
    const filledItems = [];
    items = items ?? [];
    for ( let i = 0; i < items.length; i++ ) {
        filledItems[i] = items[i] ?? " ";
    }
    return (
        <div className="array" style={{ backgroundColor: color }}>
            <h2>{ name }</h2>
            <table>
                <tbody>
                    {
                        filledItems.map((item, index) => (
                            <tr key={index} className="item array-item">
                                <td className="array-index">
                                    {index}
                                </td>
                                <td className="array-value">
                                    {item}
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    );
};
