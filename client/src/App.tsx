import React, { type FunctionComponent } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Cars from './views/Cars'
import 'react-toastify/dist/ReactToastify.css'
import { ToastContainer } from 'react-toastify'
import Companies from './views/Companies'
import Customers from './views/Customers'

const App: FunctionComponent = () => {
  return (
        <>
            <ToastContainer
                position="top-right"
                theme={'dark'}
                pauseOnFocusLoss
                limit={3}
                pauseOnHover
                autoClose={5000}
                newestOnTop
                closeOnClick
                draggable
            />
            <BrowserRouter>
                <Routes>
                    <Route path="/cars" element={<Cars/>}/>
                    <Route path="/companies" element={<Companies/>}/>
                    <Route path="/customers" element={<Customers />}/>
                </Routes>
            </BrowserRouter>
        </>
  )
}

export default App
