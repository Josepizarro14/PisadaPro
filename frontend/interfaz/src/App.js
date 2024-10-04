import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import About from './components/About';
import Register from './components/Register';
import Login from './components/Login';
import Admin from './components/Admin';
import CreateClient from './components/CreateClient';
import EditClient from './components/EditClient';
import EditProfile from './components/EditProfile';
import Logout from './components/Logout';
import Navbar from './components/Navbar'; // Asegúrate de que la ruta sea correcta
import Footer from './components/Footer'; // Asegúrate de que la ruta sea correcta

function App() {
    return (
        <Router>
            <Navbar />
            <div className="container mt-4">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/admin" element={<Admin />} />
                    <Route path="/create_client" element={<CreateClient />} />
                    <Route path="/edit_client/:email" element={<EditClient />} />
                    <Route path="/edit_profile" element={<EditProfile />} />
                    <Route path="/logout" element={<Logout />} />
                </Routes>
            </div>
            <Footer />
        </Router>
    );
}

export default App;
