import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import AdminPage from './pages/AdminPage';
import UnauthorizedPage from './pages/UnauthorizedPage';

import './App.css'

function App() {
 return (
  <BrowserRouter>
  <Navbar />
  <Routes>
    <Route path='/' element= {<HomePage />} />
    <Route path='/login' element= {<LoginPage />} />
    <Route path='/unauthorized' element= {<UnauthorizedPage />} />
    <Route element={<ProtectedRoute />}>
        <Route path='/dashboard' element= {<DashboardPage />} />
</Route>
    <Route element={<ProtectedRoute allowedRoles={['admin']}/>}>
    <Route path='/admin' element= {<AdminPage />} /></Route>
    <Route path='*' element= {<Navigate to={'/'} replace />} />
  </Routes>
  </BrowserRouter>
 )
}

export default App
