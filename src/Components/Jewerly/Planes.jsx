import React, { useState, useEffect } from 'react'
import { useQuery } from "@tanstack/react-query";
import { Accordion, AccordionTab } from 'primereact/accordion';
import { apis } from '../Utils/Util';
import { useUser } from '../Context/useUser';

const Planes = () => {

  const [selectedOption, setSelectedOption] = useState(null);
  const { setIdOptionSelected, setIdPlanSelected } = useUser();

   const { data, isLoading } = useQuery({
    queryKey: ['planes'],
    queryFn: () => apis.getPlans(),
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 60,
    refetctOnWindowsFocus: true,
    retry: 2,
    networkMode: 'offlineFirst'
  });

  const handleSelect = (planName, optionIndex, idPlan, idOption) => {
    setSelectedOption({ planName, optionIndex });
    setIdPlanSelected(idPlan);
    setIdOptionSelected(idOption);
  };

  return (
    <div className="mb-4 space-y-3">
      <Accordion multiple activeIndex={[0]}>
        {data?.planOptions && data.planOptions.map((plan, key) => {
          return (
            <AccordionTab header={plan.name} key={key}>
              <div className="grid grid-cols-1 gap-2">
                {plan.options.map((option, i) => {
                  const isSelected = selectedOption?.planName === plan.name && selectedOption?.optionIndex === i;
                  return (
                    <div
                      key={i}
                      onClick={() => handleSelect(plan.name, i, plan._id, option._id)}
                      className={`flex items-start justify-start m-1 gap-3 p-3 cursor-pointer transition-all rounded-2xl
                      ${isSelected
                          ? 'bg-pink-500 text-white shadow-inner scale-100'
                          : 'hover:bg-pink-100 hover:scale-105 bg-white text-gray-700 shadow-sm'
                        }`}
                    >
                      <strong className="font-bold">Precio: ${option.price}</strong>
                      <strong>Turnos: {option.turns}</strong>
                      {isSelected && <span className="ml-auto">✓</span>}
                    </div>
                  )
                })}
              </div>

            </AccordionTab>
          )
        })}
      </Accordion>
    </div>
  )
}

export default Planes

