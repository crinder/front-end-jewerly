import React, { useState } from 'react';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog } from 'primereact/dialog';
import { Trash, SquarePlus } from 'lucide-react';
import { apis } from '../Utils/Util';

const Crear = () => {

    const queryClient = useQueryClient();
    
    const [visible, setVisible] = useState(false);
    const [opciones, setOpciones] = useState([{ turnos: '', precio: '' }]);

    const { mutate, isLoading } = useMutation({
        //useMutation se usa para POST, PUT, DELETE, useQuery para GET
        mutationFn: (nuevoPlan) => apis.savePlan(nuevoPlan),
        onSuccess: (data) => {
            //Invalido la query para actualizar los datos
            queryClient.invalidateQueries(['planes']);
            setVisible(false);
            console.log(data);
        },
        onError: (error) => {
            console.log(error);
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
            <div className='flex justify-center mt-4'>
                <button className="w-full py-3 rounded-xl bg-pink-500 text-white font-semibold" onClick={() => setVisible(true)}>
                    Crear nuevo plan
                </button>
            </div>

            <Dialog header="Nuevo Plan de Premios" visible={visible} style={{ width: '90vw', maxWidth: '500px' }} onHide={() => setVisible(false)}>
                <form onSubmit={guardarPlanes} className="space-y-4 mb-4">
                    <div className="space-y-2">
                        <input name="code" placeholder="Código plan" className="w-full border rounded-xl px-3 py-2" required />
                        <input name="name" placeholder="Nombre del plan" className="w-full border rounded-xl px-3 py-2" required />
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
                        Guardar Plan Completo
                    </button>
                </form>
            </Dialog>
        </div>
    );
};

export default Crear;