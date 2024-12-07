import React from 'react'
import {createRoot} from 'react-dom/client'
import {HashRouter, Routes, Route} from 'react-router-dom'
import './style.css'
import { PasswortList } from './components/passwortList'
import { Unlock } from './components/unlock'

const container = document.getElementById('root')

const root = createRoot(container!)

root.render(
    <React.StrictMode>
        <HashRouter basename={"/"}>
            <Routes>
                <Route path="/" element={<Unlock />} />
                <Route path="/unlock" element={<Unlock />} />
                <Route path="/passwords" element={<PasswortList />} />
            </Routes>
        </HashRouter>
    </React.StrictMode>
)
