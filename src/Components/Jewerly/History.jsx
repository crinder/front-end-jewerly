import React, { useState } from 'react'
import { apis } from '../Utils/Util';
import { useQuery } from "@tanstack/react-query";
import { Gift } from 'lucide-react';
import Modal from '../Utils/Modal';
import { Paginator } from 'primereact/paginator';
        

const History = () => {

    const [visible, setVisible] = useState(false);
    const [items, setItems] = useState([]);
    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(10);

    const { data, isLoading } = useQuery({
        queryKey: ['sesionHistory', first, rows],
        queryFn: () => apis.getAllSesions(first, rows),
        staleTime: 1000 * 60 * 10,
        gcTime: 1000 * 60 * 60,
        refetctOnWindowsFocus: true,
        placeholderData: (previousData) => previousData,
        retry: 2,
        networkMode: 'offlineFirst'
    });

    const clickGift = (items) => {
        setItems(items.map(item => ({
            id: item.itemId,
            name: item.name,
            url: apis.getItemImage(item.imageUrl)
        })));
        setVisible(true);
    }

    const onPageChange = (event) => {
        setFirst(event.first);
        setRows(event.rows);
    };
    
    return (
        <div className="min-h-screen bg-pink-50 p-4">
            <div className="flex items-center justify-center">
                <div className="w-full max-w-sm bg-white rounded-3xl shadow-xl p-6 text-center">
                    <h1 className="text-2xl font-bold text-pink-600 mb-5">🎀 Historial</h1>
                    {data && data.sesions?.map(sesion => {
                        return (
                            <div key={sesion._id} className="flex flex-col items-center justify-center gap-4 bg-pink-50 p-4 rounded-2xl border border-pink-100 shadow-sm m-5">
                                <div className="flex flex-col items-start gap-2">
                                    <span className="text-sm text-pink-500">Nombre: <span className="font-bold text-gray-700">{sesion.name}</span></span>
                                    <span className="text-sm text-pink-500">Turnos: <span className="font-bold text-gray-700">{sesion.turnsUsed}/{sesion.planSnapshot.turns}</span></span>
                                    <span className="text-sm text-pink-500">Plan seleccionado: <span className="font-bold text-gray-700">{sesion.planSnapshot.planName}</span></span>
                                    <span className="text-sm text-pink-500">Precio: <span className="font-bold text-gray-700">{sesion.planSnapshot.price}$</span></span>
                                    <span className="text-sm text-pink-500 flex gap-3" onClick={() => clickGift(sesion.prizes)}>Premios ganados:<Gift className="text-pink-500" size={24} /></span>
                                </div>
                            </div>
                        )
                    })}
                    <Modal visible={visible} setVisible={setVisible} itemMap={items} />
                    <Paginator first={first} rows={rows} totalRecords={data?.totalSessions || 0} rowsPerPageOptions={[5, 10, 20, 30]} onPageChange={onPageChange} />
                </div>
            </div>
        </div>
    )
}

export default History