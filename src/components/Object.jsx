import { makeId } from '../id';

export function makeObjectClass(events) {
    return class MyObject {
        id;
        items;

        constructor(...params) {
            let options;
            this.items = [];
            if ( typeof params[0] === 'number' ) {
                options = params[1];
            } else if ( typeof params[0] === 'object' ) {
                options = params[0];
            }

            this.id = makeId();
            console.info("Created object,", this.id);
            events.push({
                event: 'create',
                type: 'object',
                componentId: this.id,
                items: {},
                color: options?.color,
                name: options?.name
            });

            let self = this;

            return new Proxy(this, {
                get(target, prop) {
                    if ( String(prop) === prop && !(prop in target) ) {
                        const val = self.items[prop]
                        /* events.push({
                         *     event: 'getprop',
                         *     componentId: self.id,
                         *     prop: prop,
                         *     value: val,
                         *     id: prop
                         * }); */
                        return val;
                    }
                    return target[prop];
                },
                set(target, prop, val) {
                    if ( String(prop) === prop ) {
                        self.items[prop] = val;
                        events.push({
                            event: 'setprop',
                            componentId: self.id,
                            prop: prop,
                            value: val,
                            id: prop
                        });
                    }
                    target[prop] = val;
                    return true;
                }
            });
        }


    };
}

export default function ObjectComponent({ name, items, color }) {
    const sortedItems = [];
    const keys = Object.keys(items);
    keys.sort();

    console.log("items:", items);
    for ( let i = 0; i < keys.length; i++ ) {
        const key = keys[i];
        sortedItems[i] = { key, value: items[key] ?? " " };
    }

    return (
        <div className="object" style={{ backgroundColor: color }}>
        <h2>{ name }</h2>
        <table>
        <tbody>
        { sortedItems.map(({ key, value }) => (
            <tr key={key} className="item object-item">
                <td className="object-index">
                    {key}
                </td>
                <td className="object-value">
                    {value}
                </td>
            </tr>
        )) }
        </tbody>
            </table>
                </div>
    );
};
