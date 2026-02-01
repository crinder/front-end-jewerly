import React from 'react'
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Navigate } from 'react-router-dom';
import AnimatedPage from '../Utils/Animated';
import PrincipalGeneral from '../General/PrincipalGeneral';
import Principal from '../jewerly/Principal';
import Login from '../Admin/Login';
import Plan from '../Jewerly/Plan';
import Items from '../Planes/Items';
import Protected from './Protected';


const Routing = () => {
    const location = useLocation();

    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>

                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/login" element={<AnimatedPage><Login /></AnimatedPage>} />

                <Route element={<Protected isAuthenticated={true} />}>
                    <Route path='/app-jewerly/*' element={<PrincipalGeneral />}>
                        <Route index element={<Navigate to="home" replace />} />
                        <Route path="home" element={<AnimatedPage><Principal /></AnimatedPage>} />
                        <Route path="planes" element={<AnimatedPage><Plan /></AnimatedPage>} />
                        <Route path="planes/:id" element={<AnimatedPage><Items /></AnimatedPage>} />
                    </Route>
                </Route>

                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </AnimatePresence>
    );
}

export default Routing