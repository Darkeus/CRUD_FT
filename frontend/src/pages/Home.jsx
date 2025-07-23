import { useState, useEffect, useRef } from 'react';
import api from '../api';
import Campain from '../components/Campain';
import CampainForm from '../components/CampainForm';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import '../styles/Home.css';

function Home({ emeraldFunds, fechData }) {
    const [campains, setCampains] = useState([]);
    // const [emeraldFunds, setEmeraldFunds] = useState(1000); //Tymczasowa zmienna do przechowywania funduszy 
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [editingCampain, setEditingCampain] = useState(null);

    useEffect(() => {
        getCampains();
    }, []);

    const getCampains = () => {
        api.get('/api/campains/')
            .then(response => {
                setCampains(response.data);
                console.log("Campains fetched successfully:", response.data);
            })
            .catch(error => {
                console.error("Error fetching campains:", error);
            });
    }

    const toggleFormVisibility = () => {
        setIsFormVisible(!isFormVisible);
    };

    const refresh=()=>{
        getCampains();
        fechData(); 
    }

    return (
        <div id='home'>
            <h1>Campaigns</h1>
            <div className="campains-list">
                {campains.map(campain => (
                    campain.id===editingCampain?<CampainForm emeraldFunds={emeraldFunds} subtractFunds={subtractFunds} refresh={refresh} data={campain} setEditingCampain={setEditingCampain} />: <Campain key={campain.id} data={campain} setCampains={setCampains} campains={campains} setEditingCampain={setEditingCampain}/>
                ))}
            </div>

            <button onClick={toggleFormVisibility}>
                {isFormVisible ? (
                    <>
                        <FontAwesomeIcon icon={faMinus} /> Hide Form
                    </>
                ) : (
                    <>
                        <FontAwesomeIcon icon={faPlus} /> Add Campaign
                    </>
                )}
            </button>

            {isFormVisible && (
                <div className="campain-form-wrapper">
                    <CampainForm
                        emeraldFunds={emeraldFunds}
                        subtractFunds={subtractFunds}
                        refresh={getCampains}
                    />
                </div>
)}
        </div>
    );
}

export default Home;