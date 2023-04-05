export default function Floating({ items, color }) {
    return (
        <>
            { items.map(item => (
                <div key={item.id} className="floating">
                    {item}
                </div>
            )) }
        </>
    );
};
