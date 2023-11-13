import React, { type FunctionComponent } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Cars from './views/Cars'
import 'react-toastify/dist/ReactToastify.css'
import { ToastContainer } from 'react-toastify'
import Companies from './views/Companies'
import Customers from './views/Customers'
import DashboardLayout from './layouts/DashboardLayout'
import Home from './views/Home'
import Rentals from './views/Rentals'

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
                    {/* Redirect all other traffic back to home */}
                    <Route path="*" element={<Home/>}/>
                    <Route path="/" element={<Home/>} />
                    <Route path="/dashboard" element={<DashboardLayout/>}>
                        <Route index path="cars" element={<Cars/>}/>
                        <Route path="companies" element={<Companies/>}/>
                        <Route path="customers" element={<Customers />}/>
                        <Route path="rentals" element={<Rentals />}/>
                    </Route>
                </Routes>
            </BrowserRouter>
        </>
  )
}

export default App
