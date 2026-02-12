import React,{useEffect, useState } from 'react'

const Random = ({ spinning, itemsAvailable, winningItem }) => {

    const [current, setCurrent] = useState(null);

    useEffect(() => {
        let interval;

        if (spinning) {
            interval = setInterval(() => {
                if (itemsAvailable?.length > 0) {
                    const random = itemsAvailable[Math.floor(Math.random() * itemsAvailable.length)];
                    setCurrent(random);
                }
            }, 100);
        } else {
            setCurrent(winningItem);
            clearInterval(interval);
        }

        return () => clearInterval(interval);
    }, [spinning, winningItem, itemsAvailable]);

    return (
        <div className="w-40 h-40 mx-auto mb-4 rounded-2xl border-4 border-pink-300 flex flex-col items-center justify-center bg-pink-100">
            <div className={spinning ? "animate-spin rounded-2xl" : " rounded-2xl"}>
                {current?.url ? (
                    <img src={current.url} alt={current.name} className="w-25 h-25  rounded-xl" />
                ) : (
                    <span className="text-5xl">{current?.emoji || "❔"}</span>
                )}
            </div>
            <p className="text-sm mt-2 text-pink-500">{current?.name || ""}</p>
        </div>
    )
}

export default React.memo(Random)