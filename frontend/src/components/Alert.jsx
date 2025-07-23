import React from 'react';
import { useAlert } from './AlertContext';
import '../styles/Alert.css';

function Alert() {
    const { alert } = useAlert();

    if (!alert.visible) return null;

    return (
        <div className={`alert alert-${alert.type}`}>
            {alert.text}
        </div>
    );
}

export default Alert;