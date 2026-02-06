import React, { useEffect, useState } from 'react'
import { useUser } from '../Context/useUser';
import { apis } from '../Utils/Util';
import { Gift } from 'lucide-react';
import { Dialog } from 'primereact/dialog';


const Juego = () => {

    const { sessionId, idPlanSelected, turnsUsed, setTurnsUsed, totalTurns, setTotalTurns } = useUser();

    const [selectedOption, setSelectedOption] = useState(null);
    const [spinning, setSpinning] = useState(false);
    const [current, setCurrent] = useState(null);
    const [history, setHistory] = useState([]);
    const [items, setItems] = useState([]);
    const [visible, setVisible] = useState(false);

    const spin = async () => {
        if (spinning || turnsUsed >= totalTurns) return;

        setSpinning(true);

        const shuffleInterval = setInterval(() => {
            const randomItem = items[Math.floor(Math.random() * items.length)];
            setCurrent(randomItem);
        }, 100);

        try {
            const response = await apis.turnPlay(sessionId);
            let itemG = response.item._id;
            let currentTurns = response.turnsUsed;

            setTimeout(() => {
                clearInterval(shuffleInterval);
                const winningItem = items.find(i => i.id === itemG);
                console.log(winningItem)

                setCurrent(winningItem);
                setSpinning(false);
                setTurnsUsed(currentTurns);
                setHistory(prev => [winningItem, ...prev]);
            }, 1500);

        } catch (error) {
            clearInterval(shuffleInterval);
            setSpinning(false);
            console.error("Error al jugar:", error);
        }
    };

    useEffect(() => {

        const getPlanId = async () => {
            const data = await apis.getPlanId(idPlanSelected);

            const itemMap = data.planOption.availableItems.map(item => {
                return {
                    id: item.item._id,
                    name: item.item.name,
                    url: apis.getItemImage(item.item.url)
                }
            });

            if (itemMap.length > 0) {
                setCurrent(itemMap[0]);
            }

            setItems(itemMap);
        }

        getPlanId();


    }, []);

    useEffect(() => {
        console.log(items);
    }, [items]);


    const modal = () => {

        return (
            <div className="card flex justify-content-center">
                <Dialog header="Posibles premios" visible={visible} style={{ width: '50vw' }} onHide={() => { if (!visible) return; setVisible(false); }}>
                    <ul className='grid grid-cols-2 gap-2'>
                        {items.map((item, i) => (
                            <li key={i} className="flex justify-between items-center gap-2 bg-pink-50 px-3 py-1 rounded-lg">
                                <img src={item.url} alt={item.name} className="w-20 h-20 object-contain" />
                                <span>{item.name}</span>
                            </li>
                        ))}
                    </ul>
                </Dialog>
            </div>
        )

    }

    return (
        <div className="flex justify-center flex-col items-center gap-6">
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

            <div className='flex justify-center items-center gap-8 w-full '>
                <button
                    onClick={() => spin()}
                    disabled={spinning || turnsUsed >= totalTurns}
                    className="w-full py-3 rounded-xl bg-pink-500 text-white font-semibold disabled:opacity-40"
                >
                    {spinning ? "Girando..." : "Girar 🎰"}
                </button>
                <span onClick={() => setVisible(true)}><Gift /></span>
            </div>

            {modal()}

            <div className="flex justify-between gap-10 text-sm  text-gray-600">
                <span><span className='text-black font-bold'>Turnos:</span> {turnsUsed}/{totalTurns}</span>
                <span><span className='text-black font-bold'>Gastado:</span> ${selectedOption ? selectedOption.price : 0}</span>
            </div>

            <div className="mt-4 text-left mb-4 flex flex-col items-center justify-center gap-4">
                <h3 className="font-semibold text-xl mb-2 text-black ">🎁 Premios</h3>
                <ul className="space-y-1 text-sm grid grid-cols-2 gap-2">
                    {history.map((p, i) => (
                        <li key={i} className="flex justify-between items-center gap-2 mb-4 bg-pink-50 px-3 py-1 rounded-lg">
                            <img src={p.url} alt={p.name} className="w-20 h-20 object-contain" />
                            <span>{p.name}</span>
                        </li>
                    ))}
                    {!history.length && <li className="text-gray-400">Aún no hay premios</li>}
                </ul>
            </div>

        </div>
    )
}

export default Juego