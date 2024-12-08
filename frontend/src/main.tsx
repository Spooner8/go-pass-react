import React from 'react'
import {createRoot} from 'react-dom/client'
import { HashRouter, Routes, Route } from 'react-router-dom'
import './style.css'
import './components/components.css'
import './pages/pages.css'
import { Unlock } from './pages/unlock'
import { MainPage } from './pages/mainpage'

const container = document.getElementById('root')

const root = createRoot(container!)

root.render(
    <React.StrictMode>
        <HashRouter basename={"/"}>
            <Routes>
                <Route path="/" element={<Unlock />} />
                <Route path="/mainpage" element={<MainPage />} />
            </Routes>
        </HashRouter>
    </React.StrictMode>
)
