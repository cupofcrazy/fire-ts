import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import styled from 'styled-components'
import { AuthProvider, RequireAuth } from '../contexts/AuthContext';
import { Header } from './layout/Header'

// Pages Imports
import Home from '../pages/Home'
import Info from '../pages/Information'
import Login from '../pages/Login'
import NotFound from '../pages/NotFound'
import Protected from '../pages/Protected'
import Pin from '../pages/Pin';
import Profile from '../pages/Profile';
import { ToastProvider } from '../contexts/ToastContext';

function App() {
  return (
    <AppContainer id="app">
      <Router>
      <ToastProvider>
        <AuthProvider>
          <Header />
          <Routes>
            <Route path={'/'} element={<Home />} />
            <Route path={'/pin/:id'} element={<Pin />} />
            <Route path={'/information'} element={<Info />} />
            <Route path={'/auth'} element={<Login />} />
            <Route path={'/profile'} element={<RequireAuth><Profile /></RequireAuth>} />
            <Route path={'/protected'} element={<RequireAuth><Protected /></RequireAuth>} />
            <Route path={'*'} element={<NotFound />} />
          </Routes>
        </AuthProvider>
        </ToastProvider>
      </Router>
    </AppContainer>
  )
}

export default App


const AppContainer = styled.div`
  padding: 4rem 1rem;
`
