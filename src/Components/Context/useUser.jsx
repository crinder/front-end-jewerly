import React, { createContext, useContext, useEffect, useState } from 'react'
import { apis } from '../Utils/Util';

const Context = createContext();

export const AuthProvider = ({ children }) => {

    const [token, setToken] = useState(false);
    const [loading, setLoading] = useState(true);
    const [userOff, setUserOff] = useState(false);
    const [sessionId, setSessionId] = useState(false);
    const [turnsUsed, setTurnsUsed] = useState(0);
    const [totalTurns, setTotalTurns] = useState(0);
    const [idPlanSelected, setIdPlanSelected] = useState(false);
    const [idOptionSelected, setIdOptionSelected] = useState(false);
    const [historySave, setHistorySave] = useState([]);

    const checkAuth = async () => {

        const data = await apis.checkAuth(token);

        if (data.status == 'success') {

            setToken(data.token);
            setLoading(false);
            
        } else {

            setLoading(false);
            setToken(false);
        }
    }

     useEffect(() => {
        if (!token && !userOff) {
            checkAuth();
        }
    }, [token]);

    useEffect(() => {
        setTimeout(() => {
            checkAuth();
        }, 10 * 60 * 100);
    }, []);


    return (
        <Context.Provider value={{
            sessionId, setSessionId,
            turnsUsed, setTurnsUsed,
            totalTurns, setTotalTurns,
            idPlanSelected, setIdPlanSelected,
            idOptionSelected, setIdOptionSelected,
            historySave, setHistorySave
        }}>
            {children}
        </Context.Provider>
    )
}

export const useUser = () => useContext(Context);