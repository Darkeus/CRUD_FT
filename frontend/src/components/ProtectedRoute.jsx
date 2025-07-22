import  { Navigate, Outlet } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import api from '../api';
import { ACCESS_TOKEN,REFRESH_TOKEN } from '../constants';
import React,{useState,useEffect} from 'react';

function ProtectedRoute({children}) {
    const [isAuthorized, setIsAuthorized] = useState(false);

    const refreshAccessToken = async () => {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN);
        useEffect(() => {
            auth().catch(()=>isAuthorized(false));
        }, []);
        try{
            const response = await api.post('/token/refresh/', {
                refresh: refreshToken
            });

            if(response.status === 200) {
                localStorage.setItem(ACCESS_TOKEN, response.data.access);
                setIsAuthorized(true);
            }else{
                localStorage.removeItem(ACCESS_TOKEN);
                localStorage.removeItem(REFRESH_TOKEN);
                setIsAuthorized(false);
            }
        }catch (error) {
            console.error("Error refreshing access token:", error);
            localStorage.removeItem(ACCESS_TOKEN);
            localStorage.removeItem(REFRESH_TOKEN);
            setIsAuthorized(false);
            return;
        }
    }
    const auth = async () => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (!token) {
            setIsAuthorized(false);
            return;
        }
        const decodedToken = jwtDecode(token);
        const tokenExpiration = decodedToken.exp;
        const currentTime = Date.now() / 1000;
        if (tokenExpiration < currentTime){
            await refreshAccessToken();
        }else {
            setIsAuthorized(true);
        }
    }
    if(isAuthorized===null) {
        return <div>Loading...</div>;
    }

    return isAuthorized ? children ? children : <Outlet /> : <Navigate to="/login" />;
}

export default ProtectedRoute;