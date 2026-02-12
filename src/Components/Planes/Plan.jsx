import React, { useEffect, useState } from 'react'
import { useQuery } from "@tanstack/react-query";
import { Accordion, AccordionTab } from 'primereact/accordion';
import { apis } from '../Utils/Util';
import Crear from './Crear';
import { useNavigate } from 'react-router-dom';
import { Gift } from 'lucide-react';

const Plan = () => {

    const navigate = useNavigate();

    const { data, isLoading } = useQuery({
        queryKey: ['planes'],
        queryFn: () => apis.getPlans(),
        staleTime: 1000 * 60 * 10,
        gcTime: 1000 * 60 * 60,
        refetctOnWindowsFocus: true,
        retry: 2,
        networkMode: 'offlineFirst'
    });

    return (
        <div className="min-h-screen bg-pink-50 p-4">
            <div className="flex items-center justify-center">
                <div className="w-full max-w-sm bg-white rounded-3xl shadow-xl p-6 text-center">
                    <h1 className="text-2xl font-bold text-pink-600 mb-5">🎀 Planes</h1>

                    <Accordion multiple activeIndex={[0]}>
                        {data?.planOptions && data.planOptions.map((plan, i) => {
                            return (
                                <AccordionTab header={plan.name} key={i}>
                                    <div className='flex justify-between items-center'>
                                        <p className="m-0">
                                        </p>
                                        <span>
                                            <Gift className='text-pink-500' size={24} onClick={() => navigate(`/app-jewerly/items-plan/${plan._id}`)} />
                                        </span>

                                    </div>

                                    <p className="m-0 grid grid-cols-2 gap-2">
                                        {plan.options.map((option, i) => {
                                            return (
                                                <div key={i} className="lex justify-between items-center gap-2 flex flex-col">
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