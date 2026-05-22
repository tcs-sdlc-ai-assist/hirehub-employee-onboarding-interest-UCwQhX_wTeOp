import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import LandingPage from './components/LandingPage';
import InterestForm from './components/InterestForm';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/apply" element={<InterestForm />} />
          <Route path="/admin" element={<ProtectedRoute />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;