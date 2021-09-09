import { useState, createContext, useEffect } from "react";
import { toast } from 'react-toastify';
import api from "../Services/Api";
import jwt_decode from "jwt-decode";

export const AuthContext = createContext({});

function AuthProvider({ children }) {

    const [token, setToken] = useState('');
    const [loadingAuth, setLoadingAuth] = useState(false);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState()

    useEffect(() => {
        function loadStorage() {
            const storegeToken = localStorage.getItem('Token');
            if (storegeToken) {
                const { exp } = jwt_decode(storegeToken);
                const expiredTime = (exp * 1000) - 60000;
                if (Date.now() >= expiredTime) {
                    localStorage.clear();
                    setToken(null);
                    setLoadingAuth(true);
                    setLoading(false);
                }
                setToken(storegeToken);
                setLoading(false);
            }
            setLoading(false);
        }
        loadStorage();
    }, [])

    async function signIn(usuario, senha) {
        setLoadingAuth(true);
        const credentials = {
            usuario: usuario,
            senha: senha
        }

        try {
            const { data } = await api.post('login', credentials);
            await saveToken(data, usuario);
            setLoadingAuth(false);
            setToken(data);
            setUser(usuario);
        } catch (error) {
            toast.error(error?.response?.data);
        }
    }

    async function saveToken(token, user) {
        await localStorage.setItem('Token', token);
        await localStorage.setItem('User', user);
    }

    async function signOut() {
        localStorage.removeItem('Token');
        setToken(null);
        setLoadingAuth(true);
        setLoading(false);
    }

    return (
        <AuthContext.Provider value={{ signed: !!token, Token: token, loading, signIn, signOut }}>
            {children}
        </AuthContext.Provider >
    );
}

export default AuthProvider;