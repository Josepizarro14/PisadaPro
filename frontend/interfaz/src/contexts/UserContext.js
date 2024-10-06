import React, { createContext, useState, useContext } from 'react';

// Crear el contexto
const UserContext = createContext();

// Hook personalizado para acceder al contexto
export const useUser = () => useContext(UserContext);

// Componente proveedor del contexto
export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const updateUser = (userData) => {
        setUser(userData);
    };

    const logout = () => {
        setUser(null); // Limpia el estado del usuario
    };

    return (
        <UserContext.Provider value={{ user, updateUser, logout }}>
            {children}
        </UserContext.Provider>
    );
};


