import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import AuthContext from './Contexts/login';
import Routes from './pages/routes';
import './App.css';

export default function App() {
  return (
    <AuthContext>
      <BrowserRouter>
        <Routes />
        <ToastContainer autoClose={3000} />
      </BrowserRouter>
    </AuthContext>
  );
}