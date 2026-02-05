import React, { useState } from 'react'
import { useUser } from '../Context/useUser';
import { apis } from '../Utils/Util';

const Juego = () => {

    const { sessionId, setSessionId, turnsUsed, setTurnsUsed, totalTurns, setTotalTurns } = useUser();

    const [selectedOption, setSelectedOption] = useState(null);
    const [spinning, setSpinning] = useState(false);
    const [current, setCurrent] = useState(null);
    const [history, setHistory] = useState([]);

    const spin = () => {

         const data = apis.turnPlay(sessionId);
          console.log(data);

        /*setInterval(() => {

            const data = apis.turnPlay(sessionId);
            console.log(data.items);
            
        }, 2000);*/
    };

    const addItem = e => {
        e.preventDefault();
        const form = e.target;
        const newItem = {
            id: Date.now(),
            name: form.name.value,
            emoji: form.emoji.value,
            category: form.category.value
        };
        setItems(prev => [...prev, newItem]);
        form.reset();
    };


    return (
        <div className="flex justify-center flex-col items-center">
            <div className="w-40 h-40 mx-auto mb-4 rounded-2xl border-4 border-pink-300 flex flex-col items-center justify-center bg-pink-100">
                <div className={spinning ? "animate-spin" : ""}>
                    <span className="text-5xl">{current?.emoji || "❔"}</span>
                </div>
                <p className="text-xs mt-2 text-gray-600">{current?.name || ""}</p>
            </div>

            <button
                onClick={ () => spin()}
                disabled={spinning || turnsUsed >= totalTurns}
                className="w-full py-3 rounded-xl bg-pink-500 text-white font-semibold disabled:opacity-40"
            >
                {spinning ? "Girando..." : "Girar 🎰"}
            </button>

            <div className="flex justify-between text-sm mt-4 text-gray-600">
                <span>Turnos: {turnsUsed}/{totalTurns}</span>
                <span>Gastado: ${selectedOption ? selectedOption.price : 0}</span>
            </div>

            <div className="mt-4 text-left">
                <h3 className="font-semibold text-sm mb-2">🎁 Premios</h3>
                <ul className="space-y-1 text-sm">
                    {history.map((p, i) => (
                        <li key={i} className="flex justify-between bg-pink-50 px-3 py-1 rounded-lg">
                            <span>{p.name}</span>
                            <span>{p.emoji}</span>
                        </li>
                    ))}
                    {!history.length && <li className="text-gray-400">Aún no hay premios</li>}
                </ul>
            </div>

        </div>
    )
}

export default Juego