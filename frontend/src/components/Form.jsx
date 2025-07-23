import {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../constants';
import '../styles/Form.css';
import { useAlert } from './AlertContext';

function Form({route,method}){
    const { showAlert } = useAlert();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [Loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await api.post(route, {
                username,
                password
            });

            if (method === 'login' ) {
                localStorage.setItem(ACCESS_TOKEN, response.data.access);
                localStorage.setItem(REFRESH_TOKEN, response.data.refresh);
                navigate('/');
            } else if (method === 'register' ) {
                navigate('/login');
            }
            
        } catch (error) {
            console.error("Error during form submission:", error);
            showAlert('error','An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    }
    return <form className='form-container' onSubmit={handleSubmit}>
        <h1>{method.charAt(0).toUpperCase() + method.slice(1)}</h1>
        <input
            className='form-input'
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            required
        />
         <input
            className='form-input'
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
        />
        <button className='form-button' type="submit" disabled={Loading}>
            {Loading ? 'Loading...' : method.charAt(0).toUpperCase() + method.slice(1)}
        </button>
        {method==="login"&&<button className="form-button" onClick={() => navigate('/register')}>Register</button>}
    </form>;
}

export default Form;