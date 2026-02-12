import { useState, useRef, useEffect } from "react";
import { Stepper } from 'primereact/stepper';
import { StepperPanel } from 'primereact/stepperpanel';
import { Button } from 'primereact/button';
import Planes from "./Planes";
import Juego from "./Juego";
import { useUser } from '../Context/useUser';
import { apis } from '../Utils/Util';
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";


export default function Principal() {
  const { sessionId, setSessionId, setTurnsUsed, setTotalTurns, idPlanSelected, setIdPlanSelected, idOptionSelected, setIdOptionSelected, setHistorySave, name } = useUser();
  const stepperRef = useRef(null);
  const queryClient = useQueryClient();

  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [indexActive, setIndexActive] = useState(() => {

    const saveIndex = localStorage.getItem('jewerly-indexActive', 0);
    return saveIndex ? parseInt(saveIndex, 10) : 0;

  });

  const [sessionSave, setSessionSave] = useState(() => {
    const idSave = localStorage.getItem('jewerly-sessionId');
    return idSave ? idSave : null;
  });


  const { data: sesionMap, isLoading: isSesionLoading } = useQuery({
    queryKey: ['sesion', sessionSave],
    queryFn: () => apis.getSesion(sessionSave),
    staleTime: 1000 * 60 * 10,
    enabled: !!sessionSave,
    refetctOnWindowsFocus: true,
    retry: 2,
    select: (data) => data?.sesion
  });

  useEffect(() => {

    if (sesionMap && sesionMap._id) {

      setIdPlanSelected(sesionMap.planSnapshot.planId);
      setIdOptionSelected(sesionMap.planSnapshot.optionId);
      setTurnsUsed(sesionMap.turnsUsed);
      setTotalTurns(sesionMap.planSnapshot.turns);
      setSessionId(sesionMap._id);
      setSessionSave(sesionMap._id);
      setHistorySave(sesionMap.prizes);
      const savedStep = localStorage.getItem('jewerly-indexActive');

      if (savedStep && stepperRef.current) {
        const stepIndex = parseInt(savedStep, 10);
        setIndexActive(stepIndex);
        stepperRef.current.nextCallback();
      }
    }
  }, [sesionMap]);


  const { mutate, isPending: isRequestPending } = useMutation({
    //useMutation se usa para POST, PUT, DELETE, useQuery para GET
    mutationFn: (dataSesion) => apis.createSession(dataSesion),
    onSuccess: (data) => {
      //Invalido la query para actualizar los datos
      queryClient.invalidateQueries(['sesion', data.session._id]);
      setSessionId(data.session._id);
      setTurnsUsed(data.session.turnsUsed);
      setTotalTurns(data.session.planSnapshot.turns);

      localStorage.setItem('jewerly-indexActive', data.session.step);
      localStorage.setItem('jewerly-sessionId', data.session._id);
      setSessionSave(data.session._id);
      queryClient.setQueryData(['sesion', data.session._id], data);

      if (stepperRef.current) {
        stepperRef.current.nextCallback();
      }
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const nextStep = async () => {
    const nextIdx = indexActive + 1;
    setIndexActive(nextIdx);

    const data = {
      planId: idPlanSelected,
      optionId: idOptionSelected,
      step: nextIdx,
      name: name
    }

    mutate(data);

  }

  const prevStep = () => {
    const prevIdx = indexActive - 1;
    setIndexActive(prevIdx);
    localStorage.setItem('jewerly-indexActive', prevIdx);

    if (stepperRef.current) {
      stepperRef.current.prevCallback();
    }
  }

  return (
    <div className="min-h-screen bg-pink-50 p-4">
      <div className="flex items-center justify-center">
        <div className="w-full max-w-xl bg-white rounded-3xl shadow-xl p-6 text-center">
          <h1 className="text-2xl font-bold text-pink-600 mb-1">🎀 Slot de Bisutería</h1>
          <p className="text-sm text-gray-500 mb-4">
            Selecciona un plan para jugar
          </p>

          <div className="card flex justify-content-center">
            <Stepper ref={stepperRef} style={{ flexBasis: '50rem' }}>
              <StepperPanel header="Turnos">
                <div className="flex flex-column justify-center h-12rem">
                  <Planes />
                </div>
                <div className="flex pt-4 justify-content-between">
                  <Button label="Next" icon="pi pi-arrow-right" iconPos="right" disabled={!idPlanSelected || !idOptionSelected} onClick={() => nextStep()} />
                </div>
              </StepperPanel>
              <StepperPanel header="Juego">
                <div className="flex flex-column justify-center h-12rem">
                  <Juego />
                </div>
                <div className="flex  justify-center h-12rem">
                  <Button label="Back" severity="secondary" icon="pi pi-arrow-left" onClick={() => prevStep()} />
                </div>
              </StepperPanel>
            </Stepper>
          </div>

        </div>
      </div>

    </div>
  );
}
