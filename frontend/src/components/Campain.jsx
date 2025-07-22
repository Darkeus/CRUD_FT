import React from 'react';
import api from '../api';
import '../styles/Campain.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

function Campain({ data, setCampains, campains }) {
    const deleteCampain = (id) => {
        api.delete(`/api/campains/${id}/`)
            .then(response => {
                console.log("Campain deleted successfully:", response.data);
                setCampains(campains.filter(campain => campain.id !== id));
            })
            .catch(error => {
                console.error("Error deleting campain:", error);
            });
    }

    return (
        <div className="campain-container">
            <h2>{data.name}</h2>
            <p><strong>Keywords:</strong> {data.keywords}</p>
            <p><strong>Bid Amount:</strong> {data.bidAmount}</p>
            <p><strong>Campaign Fund:</strong> {data.founds}</p>
            <p><strong>Status:</strong> {data.status ? 'Active' : 'Inactive'}</p>
            <p><strong>Town:</strong> {data.town}</p>
            <p><strong>Radius:</strong> {data.radius} km</p>
            <FontAwesomeIcon icon={faTrash} className="delete-icon" onClick={() => deleteCampain(data.id)} />
        </div>
    );
}

export default Campain;