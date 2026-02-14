import React, { useEffect, useState } from 'react'
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Accordion, AccordionTab } from 'primereact/accordion';
import { apis } from '../Utils/Util';
import Crear from './Crear';
import { useNavigate } from 'react-router-dom';
import { Gift, Edit, Trash } from 'lucide-react';
import Message from '../Utils/Message';
import { Dialog } from 'primereact/dialog';

const Plan = () => {

    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [visible, setVisible] = useState(false);
    const [eliminarPlan, setEliminarPlan] = useState(false);
    const [idPlan, setIdPlan] = useState(null);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('success');
    const [messageTitle, setMessageTitle] = useState('');
    const [showMessage, setShowMessage] = useState(false);

    const { data, isLoading } = useQuery({
        queryKey: ['planes'],
        queryFn: () => apis.getPlans(),
        staleTime: 1000 * 60 * 10,
        gcTime: 1000 * 60 * 60,
        refetctOnWindowsFocus: true,
        retry: 2,
        networkMode: 'offlineFirst',
        onError: (error) => {
            setShowMessage(true);
            setMessage(error.message);
            setMessageType('error');
            setMessageTitle('Error al buscar planes');
        }
    });

    const editarPlan = (dataPlan) => {
        setSelectedPlan(dataPlan);
        setVisible(true);
    }

    const crearPlan = () => {
        setSelectedPlan(null);
        setVisible(true);
    }

    const confirm = (id) => {
        setIdPlan(id);
        setEliminarPlan(true);
    }

    const deletePlan = (id) => {
        apis.deletePlan(id);
        queryClient.invalidateQueries(['planes']);
        setEliminarPlan(false);
    }

    return (
        <div className="min-h-screen bg-pink-50 p-4">
            <div className="flex items-center justify-center">
                <div className="w-full max-w-sm bg-white rounded-3xl shadow-xl p-6 text-center">
                    <h1 className="text-2xl font-bold text-pink-600 mb-5">🎀 Planes</h1>

                    <Accordion multiple activeIndex={[0]}>
                        {data?.planOptions && data.planOptions.map((plan, i) => {
                            return (
                                <AccordionTab header={plan.name} key={i}>
                                    <div className='flex justify-end items-end gap-3 mb-5'>
                                        <p className="m-0">
                                        </p>
                                        <span>
                                            <Gift className='text-pink-500' size={24} onClick={() => navigate(`/app-jewerly/items-plan/${plan._id}`)} />
                                        </span>

                                        <span>
                                            <Edit className='text-pink-500' size={24} onClick={() => editarPlan(plan)} />
                                        </span>

                                        <span>
                                            <Trash className='text-pink-500' size={24} onClick={() => confirm(plan._id)} />
                                        </span>

                                    </div>

                                    <p className="m-0 grid grid-cols-2 gap-2">
                                        {plan.options.map((option, i) => {
                                            return (
                                                <div key={i} className="flex flex-col justify-between items-center gap-2">
                                                    <span className="font-bold">Precio: {option.price}</span>
                                                    <span>Turnos: {option.turns}</span>
                                                </div>
                                            )
                                        })}
                                    </p>
                                </AccordionTab>
                            )
                        })

                        }
                    </Accordion>

                    <Dialog header="Eliminar plan" visible={eliminarPlan} style={{ width: '50vw' }} onHide={() => setEliminarPlan(false)}>
                        <div className='flex flex-col items-center justify-center gap-2'>
                            <p>¿Estás seguro que deseas eliminar el plan seleccionado?</p>
                            <div className="flex justify-center gap-2">
                                <button className="w-full py-3 p-3 rounded-xl bg-pink-500 text-white font-semibold" onClick={() => deletePlan(idPlan)}>
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    </Dialog>

                    <div className='flex justify-center mt-4'>
                        <button className="w-full py-3 rounded-xl bg-pink-500 text-white font-semibold" onClick={() => crearPlan()}>
                            Crear nuevo plan
                        </button>
                    </div>

                    <Crear visible={visible} setVisible={setVisible} planData={selectedPlan} />

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

export default Plan