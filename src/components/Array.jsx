import { makeId } from '../id';
import { isNumericString, isNumber, readParams } from './util';


export function makeArrayClass(events) {
    return class MyArray {
        id;
        items;

        constructor(p1, p2, p3) { // ...params doesn't work here for some reason
            const params = [p1, p2, p3];
            const { size, options, items } = readParams(params, { size: 0, options: {}, items: [] });
            this.items = items ?? [];

            this.id = makeId();
            console.info("Created array,", this.id);
            events.push({
                event: 'create',
                type: 'array',
                componentId: this.id,
                size,
                items: [ ...items ],
                color: options?.color,
                name: options?.name
            });

            return new Proxy(this, {
                get(target, prop) {
                    if ( prop === 'items' ) {
                        return undefined;
                    }
                    if ( isNumber(prop) ) {
                        return target.items[prop]
                    }
                    return target.items[prop];
                },
                set(target, prop, val) {
                    if ( isNumber(prop) || isNumericString(prop) ) {
                        target.items[Number(prop)] = val;
                        events.push({
                            event: 'setitem',
                            componentId: target.id,
                            index: Number(prop),
                            value: val,
                            id: Number(prop)
                        });

                        return true;
                    }

                    return false;
                }
            });
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
