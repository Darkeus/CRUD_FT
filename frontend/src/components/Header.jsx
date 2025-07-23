import React, { useState, useEffect } from 'react';
import '../styles/Header.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useAlert } from './AlertContext';

function Header({ username, onAddFunds, emeraldFunds, fechData }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();
    const { showAlert } = useAlert();

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleAddFunds = async () => {
        try {
            const response = await api.post('/api/add-funds/');
            fechData(); 
            showAlert('info',`Funds added successfully! New balance: $${response.data.emeraldFunds}`);
        } catch (error) {
            console.error('Error adding funds:', error);
            showAlert('error','Failed to add funds.');
        }
    };

    useEffect(() => {
        fechData();
    }, []);

    return (
        <header className="header">
            <div className="logo">CRUD</div>
            <div className="user-menu">
                <div className="user-info" onClick={toggleMenu}>
                    {username} (${emeraldFunds}) <FontAwesomeIcon icon={faCaretDown} />
                </div>
                {isMenuOpen && (
                    <div className="dropdown-menu">
                        <button onClick={handleAddFunds}>Add Funds</button>
                        <button onClick={() => navigate('/logout')}>Logout</button>
                    </div>
                )}
            </div>
        </header>
    );
}

export default Header;