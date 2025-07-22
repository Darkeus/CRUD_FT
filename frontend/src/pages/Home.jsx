import { useState, useEffect, useRef } from 'react';
import api from '../api';
import Campain from '../components/Campain';
import CampainForm from '../components/CampainForm';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';

function Home() {
    const [campains, setCampains] = useState([]);
    const [emeraldFunds, setEmeraldFunds] = useState(1000); //Tymczasowa zmienna do przechowywania funduszy !!!Zmienić!!!
    const [isFormVisible, setIsFormVisible] = useState(false);
    const formRef = useRef(null);

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

    const subtractFunds = (amount) => {
        setEmeraldFunds(prevFunds => prevFunds - amount);
        console.log(`Subtracting ${amount}`);
    };

    return (
        <div>
            <h1>Campaigns</h1>
            <div className="campains-list">
                {campains.map(campain => (
                    <Campain key={campain.id} data={campain} setCampains={setCampains} campains={campains} />
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
                        emeraldFunds={1000}
                        subtractFunds={subtractFunds}
                        refresh={getCampains}
                    />
                </div>
)}
        </div>
    );
}

export default Home;