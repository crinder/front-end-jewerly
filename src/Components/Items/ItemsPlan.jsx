import React, { useState, useEffect } from 'react'
import { apis } from '../Utils/Util';
import { useParams } from 'react-router-dom';

const ItemsPlan = () => {

    const [items, setItems] = useState([]);
    const { id } = useParams();
    const [selectedItems, setSelectedItems] = useState([]);

    const toggleItem = (id) => {
        setSelectedItems(prev => {
            const exists = prev.find(item => item.id === id);

            if (exists) {
                return prev.filter(item => item.id !== id);
            }

            return [...prev, { id, chance: 15 }];
        });
    };

    const updateChance = (id, value) => {
        setSelectedItems(prev =>
            prev.map(item =>
                item.id === id
                    ? { ...item, chance: Number(value) }
                    : item
            )
        );
    };

    const updateItems = async () => {

        let data = {
                availableItems: selectedItems.map((item) => ({
                    item: item.id,
                    chance: item.chance
                }))
            }

        const response = await apis.updatePlan(id, data);
    };

    useEffect(() => {

        const param = {
            planId: id
        }

        const getItems = async () => {
            const data = await apis.getItems(param);
            setItems(data.items);

            const newItems = data.items.filter(item => item.exists).map(item => {

                if(item.exists){
                    return {
                        id: item._id,
                        exists: item.exists,
                        chance: item.chance 
                    }
                }
            });

            console.log(newItems);

            setSelectedItems(newItems);
        }

        getItems();
    }, [id]);

    return (
        <div className="min-h-screen bg-pink-50 p-4">
            <div className="flex items-center justify-center">
                <div className="w-full max-w-xl bg-white rounded-3xl shadow-xl p-6 text-center">
                    <h1 className="text-2xl font-bold text-pink-600 mb-1">🎀Asociar articulos al plan</h1>

                    <div className="hidden md:flex gap-4 px-4 mb-2 text-sm font-bold text-gray-500">
                        <div className="w-20">Vista</div>
                        <div className="flex-1">Nombre del producto</div>
                        <div className="w-48">% premio</div>
                    </div>

                    <div className="space-y-3 max-h-125 overflow-y-auto pr-2">
                        {items.map(item => {
                            const selected = selectedItems.find(i => i.id === item._id);
                            let isSelected = Boolean(selected);
                            let porcentaje = selected?.chance ?? "";
                            
                            console.log(selected);

                            return (
                                <div key={item._id}
                                     onClick={() => toggleItem(item._id)}
                                     className={`relative flex flex-col gap-4 p-4 rounded-2xl border cursor-pointer
                                ${isSelected ? 'bg-pink-100 border-pink-400 shadow-md' : 'bg-pink-50 border-pink-100'}

                                `}>

                                    <div className="flex justify-between items-center">

                                        {isSelected && (
                                            <div className="absolute top-3 right-3 bg-pink-500 text-white w-6 h-6 rounded-full flex items-center justify-center">
                                                ✓
                                            </div>
                                        )}

                                        <div className="w-20 h-20 shrink-0">
                                            <img
                                                src={apis.getItemImage(item.url)}
                                                alt="preview"
                                                className="w-full h-full object-cover rounded-lg shadow-inner"
                                            />
                                        </div>

                                        <div className="font-medium">{item.name}</div>

                                        <input
                                            type="number"
                                            placeholder="% chance"
                                            disabled={!isSelected}
                                            value={porcentaje}
                                            onClick={(e) => e.stopPropagation()}
                                            onChange={(e) => updateChance(item._id, e.target.value)}
                                            className="w-1/2 border rounded-lg px-2 py-1"
                                        />
                                    </div>
                                </div>
                            );
                        })}

                        <div className="flex justify-center mt-8">
                            <button
                                className="w-full max-w-md py-4 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-400 text-white font-bold shadow-lg hover:scale-105 transition-transform"
                                onClick={() => updateItems()}
                            >
                                Actualizar items
                            </button>
                        </div>

                    </div>

                </div>
            </div>
        </div>
    )
}

export default ItemsPlan