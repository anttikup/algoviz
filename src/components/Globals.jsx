import { makeId } from '../id';

export function makeGlobalsClass(events) {
    return class MyGlobals {
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
            console.info("Created globals,", this.id);
            events.push({
                event: 'create',
                type: 'globals',
                componentId: this.id,
                size,
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

export default function GlobalsComponent({ items, color }) {
    const sortedItems = [];
    const keys = Object.keys(items);
    keys.sort();

    for ( let i = 0; i < keys.length; i++ ) {
        const key = keys[i];
        sortedItems[i] = { key, value: items[key] ?? " " };
    }

    return (
        <div className="globals" style={{ backgroundColor: color }}>
        { sortedItems.map(({ key, value }) => (
            <span key={key}>
                <span className="globals-name">
                    {key} =
                </span>
                {' '}
                <span className="item globals-item">
                    {value}
                </span>
            </span>
        )) }
                </div>
    );
};
