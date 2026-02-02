import React, { useEffect, useState } from 'react'
import { Accordion, AccordionTab } from 'primereact/accordion';
import { apis } from '../Utils/Util';
import Crear from './Crear';
import { useNavigate } from 'react-router-dom';
import { Gift } from 'lucide-react';

const Plan = () => {

    const [plans, setPlans] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const getPlans = async () => {
            const data = await apis.getPlans();
            console.log(data.planOptions);
            setPlans(data.planOptions);
        }

        getPlans();
    }, []);

    return (
        <div className="min-h-screen bg-pink-50 p-4">
            <div className="flex items-center justify-center">
                <div className="w-full max-w-sm bg-white rounded-3xl shadow-xl p-6 text-center">
                    <h1 className="text-2xl font-bold text-pink-600 mb-1">🎀 Planes</h1>

                    <Accordion multiple activeIndex={[0]}>
                        {plans && plans.map((plan, i) => {
                            return (
                                <AccordionTab header={plan.name} key={i}>
                                    <div className='flex  justify-between items-center'>
                                        <p className="m-0">
                                            {plan.description}
                                        </p>
                                        <span>
                                            <Gift size={24} onClick={() => navigate(`/app-jewerly/planes/${plan._id}`)}/>
                                        </span>
                                        
                                    </div>

                                    <p className="m-0">
                                        {plan.options.map((option, i) => {
                                            return (
                                                <div key={i} className="flex flex-col items-center justify-center">
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

                    <Crear />

                </div>
            </div>
        </div>
    )
}

export default Plan