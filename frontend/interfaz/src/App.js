// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';  // Importar el componente Footer
import Home from './pages/Home';
import Login from './pages/Login';
import About from './pages/About';  
import Contact from './pages/Contact'; 
import Register from './components/Register'; 
import AdminPanel from './pages/AdminPanel'; // Importamos el nuevo componente
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import UpdateAccount from './components/UpdateAccount';

function App() {
    return (
        <Router>
            <div className="d-flex flex-column min-vh-100">
                <Navbar />
                <div className="flex-fill"> {/* Este div permite que el contenido crezca */}
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/admin-panel" element={<AdminPanel />} />
                        <Route path="/update-account" element={<UpdateAccount />} />
                        {/* Agrega más rutas aquí */}
                    </Routes>
                </div>
                <Footer />
            </div>
        </Router>
    );
}

export default App;
