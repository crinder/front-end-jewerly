import React, { useMemo, useState, useEffect } from 'react'
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { useUser } from '../Context/useUser';
import { apis } from '../Utils/Util';
import { Gift } from 'lucide-react';
import Random from './Random';
import Modal from '../Utils/Modal';


const Juego = () => {

    console.log('renderiza el componente juego');

    const { sessionId, idPlanSelected, turnsUsed, setTurnsUsed, totalTurns, setTotalTurns, historySave } = useUser();

    const [selectedOption, setSelectedOption] = useState(null);
    const [spinning, setSpinning] = useState(false);
    const [visible, setVisible] = useState(false);
    const queryClient = useQueryClient();
    const [winningItem, setWinningItem] = useState(null);

    console.log('idPlanSelected...', idPlanSelected);

    const { data: itemMap = [], isLoading } = useQuery({
        queryKey: ['planesId', idPlanSelected],
        queryFn: () => apis.getPlanId(idPlanSelected),
        staleTime: 1000 * 60 * 10,
        gcTime: 1000 * 60 * 60,
        refetctOnWindowsFocus: true,
        retry: 2,
        networkMode: 'offlineFirst',
        select: (data) => data?.planOption?.availableItems.map(item => ({
            id: item.item._id,
            name: item.item.name,
            url: apis.getItemImage(item.item.url)
        })) || [],
    });

    const history = useMemo(() => {
        const counts = {};

        // cuántas veces aparece cada ID en el historial
        historySave.forEach(h => {
            counts[h.itemId] = (counts[h.itemId] || 0) + 1;
        });

        return itemMap
            .filter(i => counts[i.id]).map(i => ({...i,quantity: counts[i.id]}));
    }, [itemMap, historySave]);

    const spin = async () => {
        if (spinning || turnsUsed >= totalTurns) return;

        setSpinning(true);
        setWinningItem(null);

        try {
            const response = await apis.turnPlay(sessionId);
            let itemG = response.item._id;
            let currentTurns = response.turnsUsed;
            let nturnos = response.nturnos;

            if (nturnos) {
                localStorage.removeItem('jewerly-sessionId');
                localStorage.removeItem('jewerly-indexActive');
            }

            queryClient.invalidateQueries(['sesion', sessionId]);

            setTimeout(() => {
                setWinningItem(itemMap.find(i => i.id === itemG));
                setSpinning(false);
                setTurnsUsed(currentTurns);
            }, 1500);

        } catch (error) {
            setSpinning(false);
            console.error("Error al jugar:", error);
        }
    };

    // elimino la definición de modal para que react no cree esta definicion en cada renderizado
    // me llevo el cuadro random a otro componente para evitar todo el render en este componente

    return (
        <div className="flex justify-center flex-col items-center gap-6">

            <Random spinning={spinning} itemsAvailable={itemMap} winningItem={winningItem} />

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

            <Modal visible={visible} setVisible={setVisible} itemMap={itemMap} />

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
                            <span>{p.quantity}</span>
                        </li>
                    ))}
                    {!history.length && <li className="text-gray-400">Aún no hay premios</li>}
                </ul>
            </div>

        </div>
    )
}

export default Juego