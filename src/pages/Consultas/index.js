import { AuthContext } from '../../Contexts/login';
import { useCallback, useContext, useEffect, useState } from 'react';
import api from '../../Services/Api';
import { Clean } from '../../Services/maskCpfCep';
import { cpfMask } from '../../Services/maskCpfCep';
import './style.css';
import ListaUsuario from './ListaUsuario';
import PropostaCpf from './PropostaCpf';
import { useHistory } from 'react-router-dom';

export default function Consultas() {

    const { signOut } = useContext(AuthContext);
    const [usuario, setUsuario] = useState(null);
    const [cpf, setCpf] = useState(null);
    const [propostas, setPropostas] = useState([]);
    const [proposta, setProposta] = useState(null);
    const history = useHistory();

    useEffect(() => {
        setUsuario(localStorage.getItem('User'));
    });

    const loadPropostasUsuario = useCallback(async () => {
        const { data } = await api.get(`consultaproposta/${usuario}`);
        setPropostas(data);
    }, [usuario]);

    const loadPropostasCPF = useCallback(async () => {
        const { data } = await api.get(`proposta/ ${Clean(cpf)}`);
        setProposta(data);
    }, [cpf]);

    const onSubmit = async e => {
        e.preventDefault();

        if (!cpf) {
            await loadPropostasUsuario();
            return;
        }

        loadPropostasCPF();
    }

    return (
        <div className="forms">
            <h2 className="title-proposta">Consulta Propostas</h2>
            <form onSubmit={onSubmit}>
                <div className="logout">
                    <button type="button" className="consultar" onClick={() => history.push('/Propostas')}>Propostas</button>
                    <button className="sair" onClick={signOut}>Sair</button>
                </div>
                <table className="mainTable">
                    <tr>
                        <div className="consultaDiv">
                            Consultar CPF: <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
                            <input type="text" name="cpf" min="11" max="11" value={cpf} onBlur={(e) => setCpf(cpfMask(e.target.value))} onChange={(e) => setCpf(cpfMask(e.target.value))} />
                            <button className="consultarBtn" type="submit" >Consultar</button>
                        </div>
                    </tr>
                    <tr>
                        <td colSpan="30" className="consultaLabel">
                            {!cpf ? (<ListaUsuario data={propostas} />) : (<PropostaCpf data={proposta} />)}
                        </td>
                    </tr>
                </table>
            </form>
        </div >

    );
}