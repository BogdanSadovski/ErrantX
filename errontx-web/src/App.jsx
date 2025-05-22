import { useState } from 'react'
import { DatePicker } from 'antd';
import './App.css'
import { Layout } from 'antd';
import { calc } from 'antd/es/theme/internal';
import AppHeader from './components/layout/AppHeader';
import AppSider from './components/layout/AppSider';
import AppContent from './components/layout/AppContent';
import { CryptoContextProvider } from './context/crypto-context';
import AppLayout from './components/layout/AppLayout'; 
import LoginPage from './pages/LoginPage';
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage';
import AnalyticsPage from './pages/AnalyticsPage';
import TaxesPage from './pages/TaxesPage';
import InfoPage from './pages/InfoPage';
import FreeMoneyPage from './pages/FreeMoneyPage';
import PortfolioAnalysis from './pages/PortfolioAnalysis';





function App() {
  const [count, setCount] = useState(0)

  return (
    
<BrowserRouter>
      <CryptoContextProvider>
        <Routes>
        <Route path="/login" element={<LoginPage/>}/>
        <Route path="/register" element={<RegisterPage/>}/>
        <Route path="/analytics" element={<AnalyticsPage/>}/>
        <Route path="/taxes" element={<TaxesPage/>}/>
        <Route path="/info" element={<InfoPage/>}/>
        <Route path="/free-money" element={<FreeMoneyPage/>}/>
        <Route path="/portfolio-analysis" element={<PortfolioAnalysis/>}/>
        <Route path="" element={<AppLayout />}/>
        </Routes>
      </CryptoContextProvider>
    </BrowserRouter>
  )
}

export default App
