import React, { useEffect } from 'react'
import {createRoot} from 'react-dom/client'
import { HashRouter, Routes, Route } from 'react-router-dom'
import './style.css'
import './components/components.css'
import './pages/pages.css'
import { Unlock } from './pages/unlock'
import { MainPage } from './pages/mainpage'
import 'primereact/resources/themes/bootstrap4-dark-blue/theme.css'

/**
 * @author Spooner8 and SyntaxWizardBB - 2024
 * 
 * @description
 * This is the main entry point for the frontend application.
 * It is responsible for rendering the application and routing.
 * It creates a root element and renders the main application component inside it.
 * 
 * @returns {JSX.Element} The main application component.
 */
const App = (): JSX.Element => {
    useEffect(() => {
        // Prevent mouse navigation (back and forward)
        const preventNavigation = (event: PopStateEvent) => {
            event.preventDefault();
            window.history.pushState(null, "", window.location.href);
        };

        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            event.preventDefault();
            event.returnValue = ""; // Chrome requires returnValue to be set
        };

        const preventKeyNavigation = (event: KeyboardEvent) => {
            if ((event.altKey && event.key === "ArrowLeft") || (event.altKey && event.key === "ArrowRight")) {
                event.preventDefault();
            }
        };

        window.history.pushState(null, "", window.location.href);
        window.addEventListener("popstate", preventNavigation);
        window.addEventListener("beforeunload", handleBeforeUnload);
        window.addEventListener("keydown", preventKeyNavigation);

        return () => {
            window.removeEventListener("popstate", preventNavigation);
            window.removeEventListener("beforeunload", handleBeforeUnload);
            window.removeEventListener("keydown", preventKeyNavigation);
        };
        
    }, []);

    return (
        <HashRouter basename={"/"}>
            <Routes>
                <Route path="/" element={<Unlock />} />
                <Route path="/mainpage" element={<MainPage />} />
            </Routes>
        </HashRouter>
    );
};

const container = document.getElementById('root')
const root = createRoot(container!)

root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
