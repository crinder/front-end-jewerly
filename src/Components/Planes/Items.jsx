import React, { useState } from 'react'
import Dropzone from '../Utils/Dropzone'

const Items = ({ idPlan }) => {

    const [preview, setPreview] = useState([]);

    const handleFilesSelected = (files) => {
        const newItems = files.map(file => ({
            id: Date.now().toString(36),
            file: file,
            url: URL.createObjectURL(file)
        }));
        setPreview(prevItems => [...prevItems, ...newItems]);
    };


    return (
        <div className="min-h-screen bg-pink-50 p-4">
            <div className="flex items-center justify-center">
                <div className="w-full max-w-sm bg-white rounded-3xl shadow-xl p-6 text-center">
                    <h1 className="text-2xl font-bold text-pink-600 mb-1">🎀 Cargar items </h1>


                    <Dropzone onFileSelected={handleFilesSelected} />

                    <div className='slider__content'>
                        {preview && preview.map((item, index) => (
                            <div key={item.id} className='slider__dnd'>

                                <div className='preview__dnd-img'>
                                    <img src={item.url} alt="Card" className='game__card-img-img slider__dnd-img' />
                                </div>

                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Items