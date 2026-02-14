import React, { useState } from 'react'
import Dropzone from '../Utils/Dropzone';
import { apis } from '../Utils/Util';
import Message from '../Utils/Message';
import { useNavigate } from 'react-router-dom';
import imageCompression from 'browser-image-compression';

const Upload = () => {

    const [preview, setPreview] = useState([]);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('success');
    const [messageTitle, setMessageTitle] = useState('');
    const [showMessage, setShowMessage] = useState(false);
    const [uploading, setUploading] = useState(false);
    const navigate = useNavigate();


    const handleFilesSelected = (files) => {
        const newItems = files.map(file => ({
            id: Date.now().toString(36),
            file: file,
            url: URL.createObjectURL(file)
        }));
        setPreview(prevItems => [...prevItems, ...newItems]);
    };

    const handleFillDown = (index, field) => {
        const valueToCopy = preview[index][field];
        if (!valueToCopy) return;

        const updatedPreviews = preview.map((item, i) => {
            if (i > index) {
                return { ...item, [field]: valueToCopy };
            }
            return item;
        });

        setPreview(updatedPreviews);
    };

    const handleUpdateItem = (index, field, value) => {
        const updatedPreviews = [...preview];

        updatedPreviews[index] = {
            ...updatedPreviews[index],
            [field]: value
        };

        setPreview(updatedPreviews);
    };

    const uploadItems = async () => {
        setUploading(true);
        const data = new FormData();

        const files = preview.map(item => item.file);

        const options = {
            maxSizeMB: 1,
            maxWidthOrHeight: 1200,
            useWebWorker: true
        };

        try {
            const compressedFiles = await Promise.all(
                files.map(file => imageCompression(file, options))
            );

            compressedFiles.forEach((compressedFile) => {
                data.append('images', compressedFile);
            });

            const propiedades = preview.map((item) => ({
                id: item.id,
                name: item.name,
                category: item.category
            }));

            data.append('itemsData', JSON.stringify(propiedades));
            const response = await apis.uploadItem(data);

            setMessageType('success');
            setMessageTitle('¡Éxito!');
            setMessage('Items subidos exitosamente');
            setShowMessage(true);

            setTimeout(() => {
                setShowMessage(false);
                navigate('/app-jewerly/items');
            }, 2000);

        } catch (error) {
            setMessageType('error');
            setMessageTitle('Error al subir items');
            setMessage(error.response?.data?.message || error.message);
            setShowMessage(true);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="min-h-screen bg-pink-50 p-4">
            <div className="flex items-center justify-center">
                <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl p-8">
                    <h1 className="text-2xl font-bold text-pink-600 mb-6 text-center">🎀 Cargar Inventario</h1>

                    <Dropzone onFileSelected={handleFilesSelected} />

                    {preview && preview.length > 0 && (
                        <div className="mt-8">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-semibold text-gray-700">Detalles de los items</h2>
                                <span className="text-sm text-pink-500">{preview.length} archivos seleccionados</span>
                            </div>

                            <div className="hidden md:flex gap-4 px-4 mb-2 text-sm font-bold text-gray-500">
                                <div className="w-20">Vista</div>
                                <div className="flex-1">Nombre del producto</div>
                                <div className="w-48">Categoría</div>
                            </div>

                            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                                {preview.map((item, index) => (
                                    <div key={item.id} className="flex flex-col md:flex-row gap-4 items-center bg-pink-50 p-4 rounded-2xl border border-pink-100 shadow-sm">

                                        <div className="w-20 h-20 flex-shrink-0">
                                            <img src={item.url} alt="preview" className="w-full h-full object-cover rounded-lg shadow-inner" />
                                        </div>

                                        <div className="flex-1 w-full">
                                            <input
                                                type="text"
                                                placeholder="Nombre (ej: Anillo Mariposa)"
                                                className="w-full border-none rounded-xl px-4 py-2 focus:ring-2 focus:ring-pink-300 outline-none"
                                                value={item.name || ''}
                                                onChange={(e) => handleUpdateItem(index, 'name', e.target.value)}
                                            />
                                        </div>

                                        <div className="flex-1 w-full">
                                            <input
                                                type="text"
                                                placeholder="disponible"
                                                className="w-full border-none rounded-xl px-4 py-2 focus:ring-2 focus:ring-pink-300 outline-none"
                                                value={item.stock || ''}
                                                onChange={(e) => handleUpdateItem(index, 'stock', e.target.value)}
                                            />
                                        </div>

                                        <div className="w-full md:w-48 flex justify-center gap-2">
                                            <select
                                                className="w-full border-none rounded-xl px-4 py-2 focus:ring-2 focus:ring-pink-300 outline-none bg-white"
                                                value={item.category || ''}
                                                onChange={(e) => handleUpdateItem(index, 'category', e.target.value)}
                                            >
                                                <option value="">Elegir categoría...</option>
                                                <option value="anillos">Anillos</option>
                                                <option value="collares">Collares</option>
                                                <option value="pulseras">Pulseras</option>
                                            </select>
                                            <button
                                                type="button"
                                                title="Copiar categoría a los de abajo"
                                                onClick={() => handleFillDown(index, 'categoria')}
                                                className="bg-pink-100 text-pink-600 px-3 rounded-xl hover:bg-pink-200 transition-colors"
                                            >
                                                Replicar
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
                                    className={`w-full max-w-md py-4 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-400 text-white font-bold shadow-lg hover:scale-105 transition-transform ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    disabled={uploading}
                                    onClick={uploadItems}
                                >
                                    Subir {preview.length} items al inventario
                                </button>
                            </div>
                        </div>
                    )}
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

export default Upload