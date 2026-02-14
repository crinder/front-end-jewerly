import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog } from 'primereact/dialog';
import { Trash, SquarePlus } from 'lucide-react';
import { apis } from '../Utils/Util';
import Message from '../Utils/Message';

const Crear = ({ planData = null, visible, setVisible }) => {

    const queryClient = useQueryClient();
    const [form, setForm] = useState({ code: '', name: '' });
    const [opciones, setOpciones] = useState([{ turnos: '', precio: '' }]);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('success');
    const [messageTitle, setMessageTitle] = useState('');
    const [showMessage, setShowMessage] = useState(false);

    const { mutate, isLoading } = useMutation({
        //useMutation se usa para POST, PUT, DELETE, useQuery para GET
        mutationFn: (nuevoPlan) => {
            return planData ? apis.updatePlan(planData._id, nuevoPlan) : apis.savePlan(nuevoPlan);
        },
        onSuccess: (data) => {
            //Invalido la query para actualizar los datos
            queryClient.invalidateQueries(['planes']);
            setVisible(false);
            setMessage(planData ? 'Plan actualizado exitosamente' : 'Plan creado exitosamente');
            setMessageType('success');
            setMessageTitle('Plan creado');
            setShowMessage(true);
        },
        onError: (error) => {
            setShowMessage(true);
            setMessage(error.message);
            setMessageType('error');
            setMessageTitle('Error al crear planes');
        },
    });


    const agregarOpcion = () => {
        setOpciones([...opciones, { turnos: '', precio: '' }]);
    };

    const eliminarOpcion = (index) => {
        const nuevasOpciones = opciones.filter((_, i) => i !== index);
        setOpciones(nuevasOpciones);
    };

    const OpcionChange = (index, e) => {
        const { name, value } = e.target;
        const nuevasOpciones = [...opciones];
        nuevasOpciones[index][name] = value;
        setOpciones(nuevasOpciones);
    };

    useEffect(() => {
        if (planData && visible) {
            setForm({
                code: planData.code || '',
                name: planData.name || ''
            });

            if (planData.options) {
                setOpciones(planData.options.map(opt => ({
                    turnos: opt.turns,
                    precio: opt.price
                })));
            }
        } else if (!visible) {
            setForm({ code: '', name: '' });
            setOpciones([{ turnos: '', precio: '' }]);
        }
    }, [planData, visible]);

    const guardarPlanes = (e) => {
        e.preventDefault();

        // RECORDATORIO PASAR A UN HOOK MANUAL
        const data = {
            code: e.target.code.value,
            name: e.target.name.value,
            options: opciones.map((opcion) => {
                return {
                    price: opcion.precio,
                    turns: opcion.turnos
                }
            })
        };

        mutate(data);
    };

    return (
        <div>
            <Dialog header="Nuevo Plan de Premios" visible={visible} style={{ width: '90vw', maxWidth: '500px' }} onHide={() => setVisible(false)}>
                <form onSubmit={guardarPlanes} className="space-y-4 mb-4">
                    <div className="space-y-2">
                        <input
                            name="code"
                            placeholder="Código plan"
                            className="w-full border rounded-xl px-3 py-2"
                            value={form.code}
                            onChange={(e) => setForm({ ...form, code: e.target.value })}
                            required />
                        <input
                            name="name"
                            placeholder="Nombre del plan"
                            className="w-full border rounded-xl px-3 py-2"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            required />
                    </div>

                    <hr />

                    <div className="flex justify-between items-center">
                        <span className="font-bold text-gray-700">Configurar Turnos</span>
                        <button type="button" onClick={agregarOpcion} >
                            <SquarePlus size={16} />
                        </button>
                    </div>

                    <div className="max-h-60 overflow-y-auto space-y-3">
                        {opciones.map((opcion, index) => (
                            <div key={index} className="flex gap-2 items-center bg-gray-50 p-2 rounded-lg border">
                                <input
                                    type="number"
                                    name="turnos"
                                    placeholder="Cant. Turnos"
                                    value={opcion.turnos}
                                    onChange={(e) => OpcionChange(index, e)}
                                    className="w-1/2 border rounded-lg px-2 py-1"
                                    required
                                />
                                <input
                                    type="number"
                                    name="precio"
                                    placeholder="Precio $"
                                    value={opcion.precio}
                                    onChange={(e) => OpcionChange(index, e)}
                                    className="w-1/2 border rounded-lg px-2 py-1"
                                    required
                                />
                                {opciones.length > 1 && (
                                    <button type="button" onClick={() => eliminarOpcion(index)} className="text-red-500 px-2">
                                        <Trash size={16} />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>

                    <button type="submit" className="w-full bg-pink-500 text-white py-3 rounded-xl font-bold mt-4 shadow-lg">
                       {planData ? 'Actualizar Plan' : 'Guardar Plan Completo'}
                    </button>
                </form>
            </Dialog>
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
    );
};

export default Crear;