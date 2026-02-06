import { useState, useRef } from "react";
import { Stepper } from 'primereact/stepper';
import { StepperPanel } from 'primereact/stepperpanel';
import { Button } from 'primereact/button';
import Planes from "./Planes";
import Juego from "./Juego";
import { useUser } from '../Context/useUser';
import { apis } from '../Utils/Util';


export default function Principal() {
  const { session, setSession, sessionId, setSessionId, turnsUsed, setTurnsUsed, totalTurns, setTotalTurns, idPlanSelected, setIdPlanSelected, idOptionSelected, setIdOptionSelected } = useUser();
  const stepperRef = useRef(null);

  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);

  const nextStep = async () => {
    const data = {
      planId: idPlanSelected,
      optionId: idOptionSelected
    }
    const response = await apis.createSession(data);
    setSessionId(response.session._id);
    setTurnsUsed(response.session.turnsUsed);
    setTotalTurns(response.session.planSnapshot.turns);

    if (stepperRef.current) {
        stepperRef.current.nextCallback();
    }
  }


  return (
    <div className="min-h-screen bg-pink-50 p-4">
      <div className="flex items-center justify-center">
        <div className="w-full max-w-xl bg-white rounded-3xl shadow-xl p-6 text-center">
          <h1 className="text-2xl font-bold text-pink-600 mb-1">🎀 Slot de Bisutería</h1>
          <p className="text-sm text-gray-500 mb-4">
            {selectedPlan && selectedOption
              ? `Plan activo: ${selectedPlan.name} – ${selectedOption.turns} turnos / $${selectedOption.price}`
              : "Selecciona un plan para jugar"}
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
                  <Button label="Back" severity="secondary" icon="pi pi-arrow-left" onClick={() => stepperRef.current.prevCallback()} />
                </div>
              </StepperPanel>
            </Stepper>
          </div>

        </div>
      </div>

    </div>
  );
}
