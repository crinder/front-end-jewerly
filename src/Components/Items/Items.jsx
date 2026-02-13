import React, { useState, useEffect } from 'react'
import { apis } from '../Utils/Util';
import { useNavigate } from 'react-router-dom';
import Message from '../Utils/Message';
import { Paginator } from 'primereact/paginator';
import { Trash } from 'lucide-react';
import { Dialog } from 'primereact/dialog';

const Items = () => {

    const [items, setItems] = useState([]);
    const [selectedItem, setSelectedItem] = useState([]);
    const [itemsD, setItemsD] = useState([]);
    const navigate = useNavigate();
    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('success');
    const [messageTitle, setMessageTitle] = useState('');
    const [showMessage, setShowMessage] = useState(false);
    const [visible, setVisible] = useState(false);

    const onPageChange = (event) => {
        setFirst(event.first);
        setRows(event.rows);
    };

    useEffect(() => {
        const getItems = async () => {
            try {
                const data = await apis.getItems({ first: first, rows: rows });

                const itemsF = data.items.filter(item => item.active === 'ACT');
                setItems(itemsF);
                setSelectedItem(data.items);
                setTotalPages(data.total);
                setMessage('Items obtenidos exitosamente');
                setMessageType('success');
                setMessageTitle('Items obtenidos');
                setShowMessage(true);
            } catch (error) {
                setShowMessage(true);
                setMessage(error.message);
                setMessageType('error');
                setMessageTitle('Error al obtener items');
            }
        }

        getItems();
    }, []);

    const handleUpdateItem = (id, field, value) => {
        setSelectedItem(prevItems => {
            return prevItems.map(item => {
                if (item._id === id) {
                    return { ...item, [field]: value };
                }
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

        try {
            const response = await apis.updateItem(data);
            setShowMessage(true);
            setMessage('Items actualizados exitosamente');
            setMessageType('success');
            setMessageTitle('Items actualizados');
        } catch (error) {
            setShowMessage(true);
            setMessage(error.message);
            setMessageType('error');
            setMessageTitle('Error al actualizar items');
        }

    };

    const handleRemove = (index) => {
        setItemsD(index);
        setVisible(true);
    };

    const handleRemoveItems = async () => {

        try {
            const response = await apis.deleteItem(itemsD);
            setShowMessage(true);
            setMessage('Items eliminados exitosamente');
            setMessageType('success');
            setMessageTitle('Items eliminados');
        } catch (error) {
            setShowMessage(true);
            setMessage(error.message);
            setMessageType('error');
            setMessageTitle('Error al eliminar items');
        }

        setVisible(false);

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
                                </div>

                                <button
                                    onClick={() => handleRemove(item._id)}
                                    className="text-red-400 hover:text-red-600 p-2"
                                >
                                    <Trash size={16} />
                                </button>
                            </div>
                        ))}
                    </div>


                    <Dialog header="Eliminar items" visible={visible} style={{ width: '50vw' }} onHide={() => { if (!visible) return; setVisible(false); }}>
                        <div className='flex flex-col items-center justify-center gap-2'>
                            <p>¿Estás seguro que deseas eliminar los items seleccionados?</p>
                            <div className="flex justify-center gap-2">
                                <button className="w-full py-3 rounded-xl bg-pink-500 text-white font-semibold" onClick={() => handleRemoveItems()}>
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    </Dialog>

                    <Paginator first={first} rows={rows} totalRecords={totalPages} rowsPerPageOptions={[10, 20, 30]} onPageChange={onPageChange} />

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
            {showMessage &&
                <div className="fixed top-4 right-0 left-0 sm:left-auto sm:right-4 z-[9999] px-4 sm:px-0 flex flex-col items-center sm:items-end gap-3">
                    <Message
                        type={messageType}
                        title={messageTitle}
                        message={message}
                        onClose={() => setShowMessage(false)}
                    />
                </div>
            }
        </div>
    )
}

export default Items