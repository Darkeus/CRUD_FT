import React, { createContext, useState, useContext } from 'react';

const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
    const [alert, setAlert] = useState({ type: '', text: '', visible: false });

    const showAlert = (type, text) => {
        setAlert({ type, text, visible: true });
        setTimeout(() => setAlert({ ...alert, visible: false }), 3000);
    };

    return (
        <AlertContext.Provider value={{ alert, showAlert }}>
            {children}
        </AlertContext.Provider>
    );
};

export const useAlert = () => useContext(AlertContext);