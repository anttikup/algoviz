import { makeId } from '../id';

export function makeArrayClass(events) {
    return class MyArray {
        id;
        items;

        constructor(...params) {
            let size;
            let options;
            this.items = [];
            if ( typeof params[0] === 'number' ) {
                size = params[0];
                options = params[1];
            } else if ( typeof params[0] === 'object' ) {
                options = params[0];
            }

            this.id = makeId();
            console.info("Created array,", this.id);
            events.push({ event: 'create', type: 'array', componentId: this.id, size, color: options?.color });

            let self = this;

            return new Proxy(this, {
                get(target, prop) {
                    if ( Number(prop) == prop && !(prop in target) ) {
                        const val = self.items[prop]
                        /* events.push({
                         *     event: 'getitem',
                         *     componentId: self.id,
                         *     index: Number(prop),
                         *     value: val,
                         *     id: Number(prop)
                         * }); */
                        return val;
                    }
                    return target[prop];
                },
                set(target, prop, val) {
                    if ( Number(prop) == prop ) {
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


    };
}

export default function Array({ items, color }) {
    console.log("items:", items);
    const filledItems = [];
    for ( let i = 0; i < items.length; i++ ) {
        filledItems[i] = items[i] ?? " ";
    }
    return (
        <table className="array" style={{ backgroundColor: color }}>
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
    );
};
