import { AuthContext } from '../../Contexts/login';
import { useState, useContext } from 'react';
import { toast } from 'react-toastify';
import './style.css';

export default function Login() {

    const [login, setLogin] = useState('admin');
    const [senha, setSenha] = useState('admin');

    const { signIn } = useContext(AuthContext);

    const onSubmit = async e => {
        e.preventDefault();
        if (!login || !senha) {
            toast.error('Usuário e senha são obrigatórios.')
        } else {
            signIn(login, senha);
        }
    }

    return (

        <div className="forms">
            <h2>
                Informe usuário e senha
            </h2>
            <form onSubmit={onSubmit}>
                <table className="mainTable">
                    <tr>
                        <td>
                            <label>Usuário:</label>
                        </td>
                        <td>
                            <input type="text" name="login" value={login} onClick={(l) => setLogin('')} onChange={(l) => setLogin(l.target.value)} />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <label>Senha:</label>
                        </td>
                        <td>
                            <input type="password" name="password" value={senha} onClick={(s) => setSenha('')} onChange={(s) => setSenha(s.target.value)} />
                        </td>
                    </tr>
                    <tr>
                        <td colSpan="2">
                            <button type="submit">Entrar</button>
                        </td>
                    </tr>
                </table>
            </form>
        </div>
    );
}
