import { React, useEffect, useState } from 'react'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import { Dashboard, Login, Register, Home } from './routes'

export const Router = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const checkLogin = () => {
    return setIsLoggedIn(!!localStorage.getItem('jwt'))
  }

  useEffect(() => {
    checkLogin()
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        {
          isLoggedIn === false
          ? (
            <>
              <Route
              path='/login'
              element={
                <Login setIsLoggedIn={setIsLoggedIn} checkLogin={checkLogin} />
                }
              />
              <Route path='/register' element={<Register setIsLoggedIn={setIsLoggedIn} checkLogin={checkLogin} /> } />
              <Route path='/' element={<Home setIsLoggedIn={setIsLoggedIn} checkLogin={checkLogin}/>} />
            </>
            )
          : (
            <>
            <Route
              path='/login'
              element={
                <Navigate to='/dashboard' replace checkLogin={checkLogin} />
                }
              />
            <Route path='/dashboard' element={<Dashboard checkLogin={checkLogin} /> } />
            </>
            )
          }
      </Routes>
    </BrowserRouter>
  )
}
