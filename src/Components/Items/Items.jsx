import React, { useState, useEffect } from 'react'
import { apis } from '../Utils/Util';
import { useNavigate } from 'react-router-dom';

const Items = () => {

    const [items, setItems] = useState([]);
    const [selectedItem, setSelectedItem] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const getItems = async () => {
            const data = await apis.getItems();
            console.log(data.items);
            setItems(data.items);
            setSelectedItem(data.items);
        }

        getItems();
    }, []);

    const handleUpdateItem = (id, field, value) => {
    setSelectedItem(prevItems => {
        // .map crea un nuevo array automáticamente (mantiene la inmutabilidad)
        return prevItems.map(item => {
            if (item._id === id) {
                // Si es el ID que buscamos, devolvemos una copia con el cambio
                return { ...item, [field]: value };
            }
            // Si no es, lo devolvemos tal cual
            return item;
        });
    });
};

    const updateItems = async () => {

        const data = new FormData();

        const propiedades = selectedItem.map((item) => ({
            id: item._id,
            name: item.name,
            category: item.category
        }));

        data.append('itemsData', JSON.stringify(propiedades));


        const response = await apis.updateItem(data);

    };

    return (
        <div className="min-h-screen bg-pink-50 p-4">
            <div className="flex items-center justify-center">
                <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl p-8">
                    <h1 className="text-2xl font-bold text-pink-600 mb-6 text-center">🎀 Tu Inventario</h1>

                    <div className="hidden md:flex gap-4 px-4 mb-2 text-sm font-bold text-gray-500">
                        <div className="w-20">Vista</div>
                        <div className="flex-1">Nombre del producto</div>
                        <div className="w-48">Categoría</div>
                    </div>

                    <div className="space-y-3 max-h-125 overflow-y-auto pr-2">
                        {items && items.map((item, index) => (
                            <div key={item._id} className="flex flex-col md:flex-row gap-4 items-center bg-pink-50 p-4 rounded-2xl border border-pink-100 shadow-sm">

                                <div className="w-20 h-20 shrink-0">
                                    <img src={apis.getItemImage(item.url)} alt="preview"
                                        className="w-full h-full object-cover rounded-lg shadow-inner" />
                                </div>

                                <div className="flex-1 w-full">
                                    <input
                                        type="text"
                                        placeholder="Nombre (ej: Anillo Mariposa)"
                                        className="w-full border-none rounded-xl px-4 py-2 focus:ring-2 focus:ring-pink-300 outline-none"
                                        defaultValue={item.name || ''}
                                        onChange={(e) => handleUpdateItem(item._id, 'name', e.target.value)}
                                    />
                                </div>

                                <div className="flex-1 w-full">
                                    <input
                                        type="text"
                                        placeholder="disponible"
                                        className="w-full border-none rounded-xl px-4 py-2 focus:ring-2 focus:ring-pink-300 outline-none"
                                        value={item.stock || ''}
                                        onChange={(e) => handleUpdateItem(item._id, 'stock', e.target.value)}
                                    />
                                </div>

                                <div className="w-full md:w-48">
                                    <select
                                        className="w-full border-none rounded-xl px-4 py-2 focus:ring-2 focus:ring-pink-300 outline-none bg-white"
                                        value={item.category || ''}

                                    >
                                        <option value="">Elegir categoría...</option>
                                        <option value="anillos">Anillos</option>
                                        <option value="collares">Collares</option>
                                        <option value="pulseras">Pulseras</option>
                                    </select>
                                    <button
                                        type="button"
                                        title="Copiar categoría a los de abajo"

                                        className="bg-pink-100 text-pink-600 px-3 rounded-xl hover:bg-pink-200 transition-colors"
                                    >
                                        buton
                                    </button>
                                </div>

                                {/* Botón para descartar 
                                        <button
                                            onClick={() => handleRemove(index)}
                                            className="text-red-400 hover:text-red-600 p-2"
                                        >
                                            <i className="pi pi-times-circle"></i>
                                        </button>*/}
                            </div>
                        ))}
                    </div>

                    <div className='flex justify-center mt-8'>
                        <button
                            className="w-full max-w-md py-4 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-400 text-white font-bold shadow-lg hover:scale-105 transition-transform"
                            onClick={() => updateItems()}
                        >
                            Actualizar items
                        </button>
                    </div>

                    <div className='flex justify-center mt-8'>
                        <button
                            className="w-full max-w-md py-4 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-400 text-white font-bold shadow-lg hover:scale-105 transition-transform"
                            onClick={() => navigate('/app-jewerly/items-upload')}
                        >
                            Crear nuevos item
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Items