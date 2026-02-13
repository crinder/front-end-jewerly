import { useState, useRef, useEffect } from "react";
import { Stepper } from 'primereact/stepper';
import { StepperPanel } from 'primereact/stepperpanel';
import { Button } from 'primereact/button';
import Planes from "./Planes";
import Juego from "./Juego";
import { useUser } from '../Context/useUser';
import { apis } from '../Utils/Util';
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import Message from '../Utils/Message';


export default function Principal() {
  const { sessionSave, setSessionSave, setSessionId, turnsUsed, setTurnsUsed, setTotalTurns, idPlanSelected, setIdPlanSelected, idOptionSelected, setIdOptionSelected, setHistorySave, name, setCancel, cancel } = useUser();
  const stepperRef = useRef(null);
  const queryClient = useQueryClient();
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');
  const [messageTitle, setMessageTitle] = useState('');


  const [indexActive, setIndexActive] = useState(() => {

    const saveIndex = localStorage.getItem('jewerly-indexActive', 0);
    return saveIndex ? parseInt(saveIndex, 10) : 0;

  });



  const { data: sesionMap, isLoading: isSesionLoading } = useQuery({
    queryKey: ['sesion', sessionSave],
    queryFn: () => apis.getSesion(sessionSave),
    staleTime: 1000 * 60 * 10,
    enabled: !!sessionSave,
    refetctOnWindowsFocus: true,
    retry: 2,
    select: (data) => data?.sesion,
    onError: (error) => {
      setShowMessage(true);
      setMessage(error.message);
      setMessageType('error');
      setMessageTitle('Error al buscar sesion');
    }
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
      setShowMessage(true);
      setMessage(error.message);
      setMessageType('error');
      setMessageTitle('Error creando sesión');
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

  useEffect(() => {
    if (cancel) {
      setCancel(false);
      prevStep();
    }
  }, [cancel]);

  return (
    <div className="min-h-screen bg-pink-50 p-4">
      <div className="flex items-center justify-center">
        <div className="w-full max-w-xl bg-white rounded-3xl shadow-xl p-6 text-center">
          <h1 className="text-2xl font-bold text-pink-600 mb-1">🎀 Slot de Bisutería</h1>
          <p className="text-sm text-gray-500 mb-4">
            Selecciona un plan para jugar
          </p>

          <div className="card flex justify-content-center mb-5">
            <Stepper ref={stepperRef} style={{ flexBasis: '50rem' }}>
              <StepperPanel header="Turnos">
                <div className="flex flex-column justify-center h-12rem">
                  <Planes />
                </div>
                <div className="flex pt-4 justify-center">
                  <Button className="!bg-pink-500 !border-pink-500 !shadow-lg hover:!scale-105 !transition-transform" label="Siguiente" icon="pi pi-arrow-right" iconPos="right" disabled={!idPlanSelected || !idOptionSelected} onClick={() => nextStep()} />
                </div>
              </StepperPanel>
              <StepperPanel header="Juego" className="!bg-pink-500 !border-pink-500 !shadow-lg">
                <div className="flex flex-column justify-center h-12rem">
                  <Juego />
                </div>
                <div className="flex  justify-center h-12rem">
                  {turnsUsed == 0 &&
                    <Button className="!bg-pink-500 !border-pink-500 !shadow-lg hover:!scale-105 !transition-transform" label="Reiniciar" severity="secondary" icon="pi pi-arrow-left" onClick={() => prevStep()} />
                  }

                </div>
              </StepperPanel>
            </Stepper>
          </div>

          {showMessage &&
            <div className="fixed top-4 right-0 left-0 sm:left-auto sm:right-4 z-[9999] px-4 sm:px-0 flex flex-col items-center sm:items-end gap-3">
              <Message
                type= {messageType}
                title= {messageTitle}
                message= {message}
                onClose={() => setShowMessage(false)}
              />
            </div>
          }

        </div>
      </div>
    </div>
  );
}
