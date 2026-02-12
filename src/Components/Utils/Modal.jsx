import React from 'react'
import { Dialog } from 'primereact/dialog';

const Modal = ({ visible, setVisible, itemMap }) => {
    return (
        <Dialog header="Posibles premios" visible={visible} style={{ width: '50vw' }} onHide={() => { if (!visible) return; setVisible(false); }}>
            <ul className='grid grid-cols-2 gap-2'>
                {itemMap.map((item, i) => (
                    <li key={i} className="flex justify-between items-center gap-2 bg-pink-50 px-3 py-1 rounded-lg">
                        <img src={item.url} alt={item.name} className="w-20 h-20 object-contain" />
                        <span>{item.name}</span>
                    </li>
                ))}
            </ul>
        </Dialog>
    )
}

export default Modal