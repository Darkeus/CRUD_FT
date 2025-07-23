import React, { useState, useEffect } from 'react';
import '../styles/CampainForm.css';
import api from '../api';
import { useAlert } from './AlertContext';

function CampainForm({ emeraldFunds, refresh, data=null, setEditingCampain=null }) {
    const { showAlert } = useAlert();
    const [towns, setTowns] = useState([
        "Warszawa",
        "Kraków",
        "Gdańsk",
        "Wrocław",
        "Poznań",
        "Łódź",
        "Szczecin",
        "Bydgoszcz",
        "Lublin",
        "Katowice"
    ]);
    const [formData, setFormData] = useState(data ||{
        name: '',
        keywords: '',
        bidAmount: '',
        founds: '',
        status: true,
        town: '',
        radius: '',
    });
    const [keywordSuggestions, setKeywordSuggestions] = useState([]);
    const [allKeywords, setAllKeywords] = useState([
        "moda",
        "restauracja",
        "kawiarnia",
        "sport",
        "muzyka",
        "film",
        "książki",
        "podróże",
        "technologia",
        "zdrowie"
    ]); 
    //Powinno być używane zamiast stałej listy, ale nie implementowałem tego w backendzie, więc jest jak jest
    // useEffect(() => {
        
    //     const fetchTowns = async () => {
    //         const response = await fetch('/api/towns'); 
    //         const data = await response.json();
    //         setTowns(data);
    //     };

        
    //     const fetchKeywords = async () => {
    //         const response = await fetch('/api/keywords'); 
    //         const data = await response.json();
    //         setAllKeywords(data);
    //     };

    //     fetchTowns();
    //     fetchKeywords();
    // }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: type === 'checkbox' ? checked : value
        }));

        if (name === 'keywords') {
            const filteredSuggestions = allKeywords.filter(keyword =>
                keyword.toLowerCase().startsWith(value.toLowerCase())
            );
            setKeywordSuggestions(filteredSuggestions);
        }
    };

    const handleSuggestionClick = (suggestion) => {
        setFormData(prevFormData => ({
            ...prevFormData,
            keywords: suggestion
        }));
        setKeywordSuggestions([]);  
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (parseFloat(formData.founds) > emeraldFunds) {
            showAlert('error','Insufficient funds!');
            return;
        }

        try {
            if(data){
                api.put(`/api/campains/${data.id}/`, formData)
                .then(response => {
                    if (response.status === 200 && setEditingCampain) {
                        
                    setEditingCampain(null);
                    console.log("Editing campaign set to null");
                    refresh()
                }
                    })}
            else{
            api.post('/api/campains/', formData)
            .then(response => {
                if (response.status === 201) {
                subtractFunds(parseFloat(formData.founds));  
                showAlert('info','Campaign created successfully!');
                setFormData({
                    name: '',
                    keywords: '',
                    bidAmount: '',
                    founds: '',
                    status: true,
                    town: '',
                    radius: '',
                });
                
                
                refresh();
            } else {
                showAlert('error','Failed to create campaign.');
            }})}
        } catch (error) {
            console.error('Error:', error);
            showAlert('error','An error occurred.');
        }
    };

    const subtractFunds = async (amount) => {
        try {
            const response = await api.post('/api/subtract-funds/', { amount });
            refresh(); 
            showAlert('info', `Funds subtracted successfully! New balance: $${response.data.emeraldFunds}`);
        } catch (error) {
            console.error('Error subtracting funds:', error);
            showAlert('error', 'Failed to subtract funds.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="name">Campaign Name:</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}                   
                    required
                />
            </div>

            <div>
                <label htmlFor="keywords">Keywords:</label>
                <input
                    type="text"
                    id="keywords"
                    name="keywords"
                    value={formData.keywords}
                    onChange={handleChange}
                    required
                    autoComplete="off" 
                />
                {keywordSuggestions.length > 0 && (
                    <ul>
                        {keywordSuggestions.map((suggestion, index) => (
                            <li key={index} onClick={() => handleSuggestionClick(suggestion)}>
                                {suggestion}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <div>
                <label htmlFor="bidAmount">Bid Amount:</label>
                <input
                    type="number"
                    id="bidAmount"
                    name="bidAmount"
                    value={formData.bidAmount}
                    onChange={handleChange}
                    min="0.01"
                    step="0.01"
                    required
                />
            </div>

            <div>
                <label htmlFor="founds">Campaign Fund:</label>
                <input
                    type="number"
                    id="founds"
                    name="founds"
                    value={formData.founds}
                    onChange={handleChange}
                    min="0.01"
                    step="0.01"
                    required
                    {...data ? { readOnly: true } : {}} //Nie wiedziałem co zrobić przy zmianie funduszy więc wyłączyłem możliwość edycji funduszy przy edycji kampanii
                />
                <p>Emerald Funds: {emeraldFunds}</p>
            </div>

            <div>
    <div>
    <div className="status-container">
        
        <input
            type="checkbox"
            id="status"
            name="status"
            checked={formData.status}
            onChange={handleChange}
        />
        <label htmlFor="status">Active?</label>
    </div>
</div>
</div>

            <div>
                <label htmlFor="town">Town:</label>
                <select id="town" name="town" value={formData.town} onChange={handleChange} required>
                    <option value="">Select a town</option>
                    {towns.map((town,index) => (
                        <option key={town+index} value={town}>{town}</option>
                    ))}
                </select>
            </div>

            <div>
                <label htmlFor="radius">Radius (km):</label>
                <input
                    type="number"
                    id="radius"
                    name="radius"
                    value={formData.radius}
                    onChange={handleChange}
                    min="1"
                    required
                />
            </div>

            <button type="submit">Submit</button>
        </form>
    );
}

export default CampainForm;