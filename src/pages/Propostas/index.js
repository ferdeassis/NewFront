import { AuthContext } from '../../Contexts/login';
import { useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../Services/Api';
import './style.css';
import * as yup from 'yup'
import { cpfMask } from '../../Services/maskCpfCep';
import { Clean } from '../../Services/maskCpfCep';
import { cepMask } from '../../Services/maskCpfCep';
import { useHistory } from 'react-router-dom';

export default function Propostas() {
    useEffect(() => {
        dadosConveniadas();
        dadosSituacao();
    }, []);

    //Seta os dados pessoais do cliente
    const { signOut } = useContext(AuthContext);
    const [cpf, setCpf] = useState();
    const [nome, setNome] = useState();
    const [dtNascimento, setDtNascimento] = useState();
    const [genero, setGenero] = useState('M');
    const [vlrSalario, setVlrSalario] = useState();
    const [cep, setCep] = useState();
    const [logradouro, setLogradouro] = useState();
    const [numResidencia, setNumResidencia] = useState();
    const [bairro, setBairro] = useState();
    const [cidade, setCidade] = useState();
    //Seta os dados da proposta do cliente
    const [proposta, setProposta] = useState();
    const [conveniada, setConveniada] = useState([]);
    const [vlrSolicitado, setVlrSolicitado] = useState();
    const [vlrFinanciado, setVlrFinanciado] = useState();
    const [prazo, setPrazo] = useState();
    const [situacao, setSituacao] = useState([]);
    const [observacao, setObservacao] = useState();
    const [usuario, setUsuario] = useState();
    const [convenioSelect, setConvenioSelect] = useState('000020');
    const [situacaoSelect, setSituacaoSelect] = useState('PE');
    const [dtSituacao, setDtSituacao] = useState();


    const onSubmit = async e => {
        e.preventDefault();

        if (dtNascimento != null) {
            const dtN = new Date(dtNascimento);
            const today = new Date();
            const age = today.getFullYear() - dtN.getUTCFullYear();
            const month = dtN.getMonth() - today.getMonth();
            const day = (dtN.getDate() + 1) - today.getDate();
            if (age <= 18 && (month < 0 || day < 0)) {
                return toast.error("Cliente menor que 18 anos")
            }
        } else {
            toast.error("Data de nascimento não informada")
        }

        const dadosCadastro = {
            cpf: Clean(cpf),
            nome: nome,
            dt_Nascimento: dtNascimento,
            genero: genero,
            vlr_Salario: parseFloat(vlrSalario),
            logradouro: logradouro,
            numero_Residencia: numResidencia,
            bairro: bairro,
            cidade: cidade,
            cep: Clean(cep),
            usuario_Atualizacao: "SISTEMA"
        }

        const dadosPropostas = {
            proposta: Number(proposta),
            cpf: Clean(cpf),
            conveniada: convenioSelect,
            vlr_Solicitado: parseFloat(vlrSolicitado),
            prazo: Number(prazo),
            vlr_Financiado: parseFloat(vlrFinanciado),
            situacao: 'AG',
            //observacao: observacao,
            usuario: localStorage.getItem('User'),
            usuario_Atualizacao: 'SISTEMA'
        }

        //#region Cadastro e Update
        const propostasSchema = yup.object().shape({
            cpf: yup.string().required('CPF inválido').matches(/^[0-9]+$/, "Cpf deve conter apenas números"),
            nome: yup.string().required('Nome inválido'),
            dt_Nascimento: yup.date().required("Data de nascimento inválida"),
            vlr_Salario: yup.number().required("Salário inválido").positive(),
            logradouro: yup.string().required("Logradouro inválido"),
            numero_Residencia: yup.string().required("Número residência inválido"),
            bairro: yup.string().required("Bairro inválido"),
            cidade: yup.string().required("Cidade inválida"),
            cep: yup.string().required("Cep inválido"),
        })
        //Verifica se cliente existe
        //se existir faz um put senão add

        const { data } = await api.get(`cliente/${Clean(cpf)}`);
        if (!data) {
            try {
                const validacoes = await propostasSchema.validate(dadosCadastro, { abortEarly: false });
                if (validacoes) {
                    try {
                        const { data } = await api.post('cliente', dadosCadastro);
                    } catch (error) {
                        toast.error(error);
                    }
                }
            } catch (error) {
                error?.errors.forEach(erro => toast.error(erro));
            }
        } else {
            const { data } = await api.put('cliente', dadosCadastro);
            const { data: propostaInfo } = await api.get(`proposta/${Clean(cpf)}`);
            if (!propostaInfo) {
                try {

                    const { data } = await api.post('proposta', dadosPropostas);
                    const ultima = {
                        ultima_proposta: Number(proposta)
                    }
                    const { data: ultimaProposta } = await api.put('parametro', { ultima_proposta: Number(proposta), usuario_atualizacao: 'SISTEMA' });
                    toast.success('Proposta cadastrada com sucesso')
                } catch (error) {
                    toast.error(error);
                }
            } else {
                const { data } = await api.put('proposta', dadosPropostas);
                toast.success("Dados alterados com sucesso")
            }
        }
    }
    //#endregion

    const dadosConveniadas = async e => {
        const { data } = await api.get("conveniada");
        setConveniada(data);
    }

    const dadosSituacao = async e => {
        const { data } = await api.get("situacao");
        setSituacao(data);
    }

    const pesquisarCliente = async e => {
        if (cpf == null) {
            toast.error("Cpf inválido")
        } else {
            const cleanCpf = Clean(cpf);
            const { data } = await api.get(`cliente/${cleanCpf}`);
            if (data) {
                const d = new Date(data.dt_Nascimento);
                setNome(data.nome);
                setDtNascimento(d.toISOString().split('T')[0]);
                setGenero(data.genero);
                setVlrSalario(data.vlr_Salario);
                setCep(cepMask(data.cep));
                setLogradouro(data.logradouro);
                setNumResidencia(data.numero_Residencia);
                setBairro(data.bairro);
                setCidade(data.cidade);
            } else {
                return toast.error("Cpf não encontrado");
            }
            const { data: dataProposta } = await api.get(`proposta/${cleanCpf}`);
            const ds = new Date(dataProposta.dt_Situacao)
            setProposta(dataProposta.proposta);
            setVlrSolicitado(dataProposta.vlr_Solicitado);
            setVlrFinanciado(dataProposta.vlr_Financiado);
            setConvenioSelect(dataProposta.conveniada);
            setPrazo(dataProposta.prazo);
            setSituacaoSelect(dataProposta.situacao);
            setObservacao(dataProposta.observacao);
            setUsuario(dataProposta.usuario);
            setDtSituacao(ds.toISOString().split('T')[0]);
        }
    }

    const pesquisarCep = async e => {
        if (cep == null) {
            toast.error('Cpf não encontrado')
        } else {
            try {
                const { data } = await api.get(`cep/${cep}`);
                if (data) {
                    setLogradouro(data.logradouro);
                    setBairro(data.bairro);
                    setCidade(data.localidade);
                }
            } catch (error) {
                toast.error(error?.response?.data);
            }
        }
    }

    const simularProposta = async e => {
        if (vlrSolicitado == null) {
            toast.error("Valor Solicitado inválido")
        } else if (prazo == null) {
            toast.error("Prazo inválido")
        } else {
            const { data } = await api.get('parametro')

            if (proposta === data.ultima_Proposta) {
                const juros = Number(data.juro_Composto / 100);
                //const soli = vlrSolicitado.replace(/,/g, ".");
                const vlrF = vlrSolicitado * Math.pow(1 + Number(juros), Number(prazo));
                const valorJuros = Number(vlrF);
                setVlrFinanciado(parseFloat(valorJuros).toFixed(2));
            } else {
                setProposta(Number(data.ultima_Proposta) + 1);
                const juros = Number(data.juro_Composto / 100);
                const soli = vlrSolicitado.replace(/,/g, ".");
                const vlrF = soli * Math.pow(1 + Number(juros), Number(prazo));
                const valorJuros = Number(vlrF);
                setVlrFinanciado(parseFloat(valorJuros).toFixed(2));
            }
        }
    }

    const history = useHistory();

    return (
        <div className="forms">
            <h2 className="title-proposta">
                Propostas
            </h2>
            <form onSubmit={onSubmit}>
                <div className="logout">
                    <button type="button" className="consultar" onClick={() => history.push('/Consultas')} >Consultar Propostas</button>
                    <button className="sair" onClick={signOut}>Sair</button>
                </div>
                <table className="mainTable">
                    <tbody>
                        <td>
                            <label>CPF:</label>
                        </td>
                        <td>
                            <input type="text" name="cpf" value={cpf} onChange={(cpf) => setCpf(cpfMask(cpf.target.value))} min="11" maxLength="14" />
                        </td>
                        <td>
                            <label>Nome:</label>
                        </td>
                        <td>
                            <input type="text" name="nome" value={nome} onChange={(nome) => setNome(nome.target.value)} />
                        </td>
                    </tbody>

                    <tbody>
                        <td>
                            <label>Data de Nascimento</label>
                        </td>
                        <td>
                            <input type="date" name="dtNascimento" value={dtNascimento} onChange={(dtNascimento => setDtNascimento(dtNascimento.target.value))} />
                        </td>
                        <td>
                            <label>Gênero:</label>
                        </td>
                        <td>
                            <select name="genero" value={genero} onChange={(genero) => setGenero(genero.target.value)} >
                                <option value="M" selected >Masculino</option>
                                <option value="F">Feminino</option>
                            </select>
                        </td>
                    </tbody>
                    <tbody>
                        <td>
                            <label>Salário:</label>
                        </td>
                        <td>
                            <input type="text" name="salario" value={vlrSalario} onChange={(vlrSalario) => setVlrSalario(vlrSalario.target.value)} placeholder='0.00' />
                        </td>
                    </tbody>
                    <tbody>
                        <td colSpan='4'>
                            <button type="button" onClick={pesquisarCliente} name="pCliente" >Pesquisar Cliente</button>
                        </td>
                    </tbody>


                    <br />

                    <tbody>
                        <td>
                            <label>CEP:</label>
                        </td>
                        <td>
                            <input type="text" name="cep" value={cep} onChange={(cep) => setCep(cepMask(cep.target.value))} />
                        </td>
                        <td>
                            <label>Logradouro:</label>
                        </td>
                        <td>
                            <input type="text" name="logradouro" value={logradouro} disabled="disabled" />
                        </td>
                    </tbody>
                    <tbody>
                        <td>
                            <label>Bairro</label>
                        </td>
                        <td>
                            <input type="text" name="bairro" value={bairro} disabled="disabled" />
                        </td>
                        <td>
                            <label>Cidade:</label>
                        </td>
                        <td>
                            <input type="text" name="cidade" value={cidade} disabled="disabled" />
                        </td>
                    </tbody>

                    <tbody>
                        <td>
                            <label>Número:</label>
                        </td>
                        <td>
                            <input type="text" name="numResidencia" value={numResidencia} onChange={(numResidencia) => setNumResidencia(numResidencia.target.value)} />
                        </td>
                    </tbody>
                    <tbody>
                        <td>
                            <button type="button" onClick={pesquisarCep}>Pesquisar Cep</button>
                        </td>
                    </tbody>

                    <br />

                    <tr>
                        <td>
                            <label>Proposta</label>
                        </td>
                        <td>
                            <input type="text" value={proposta} disabled="disabled" />
                        </td>
                        <td>
                            <label>Valor Solicitado:</label>
                        </td>
                        <td>
                            <input type="text" value={vlrSolicitado} onChange={(solicitado) => setVlrSolicitado(solicitado.target.value)} placeholder='0.00' />
                        </td>
                    </tr>
                    <tbody>
                        <td>
                            <label>Valor Financiado:</label>
                        </td>
                        <td>
                            <input type="text" value={vlrFinanciado} disabled="disabled" placeholder='0.00' />
                        </td>
                        <td>
                            <label>Convenio:</label>
                        </td>
                        <td>
                            <select name="convenio" value={convenioSelect} onChange={(conv) => setConvenioSelect(conv.target.value)}>
                                {conveniada.map((option, index) => (
                                    <option key={option.conveniada} selected={index === option.conveniada} value={option.conveniada}>{option.descricao}</option>
                                ))}
                            </select>
                        </td>
                    </tbody>

                    <tbody>
                        <td>
                            <label>Situação:</label>
                        </td>
                        <td>
                            <select name="situacao" value={situacaoSelect} disabled="disable" >
                                {situacao.map((option, index) => (
                                    <option key={option.tipoSituacao} selected={index === option.tipoSituacao} value={option.tipoSituacao}>{option.descricao}</option>
                                ))}
                            </select>
                        </td>
                        <td>
                            <label>Prazo</label>
                        </td>
                        <td>
                            <input type="number" value={prazo} min="1" max="99" onChange={(p) => setPrazo(p.target.value)} />
                        </td>
                    </tbody>
                    <tbody>
                        <td>
                            <label>Data Situação</label>
                        </td>
                        <td >
                            <input type="date" name="dtSituacao" value={dtSituacao} disabled="disable" />
                        </td>
                    </tbody>
                    <tbody>
                        <td>
                            <label>Observação</label>
                        </td>
                        <td colSpan="3">
                            <textarea value={observacao} disabled="disabled" ></textarea>
                        </td>
                    </tbody>
                    <tbody>
                        <td colSpan='2'>
                            <button type="submit" >Cadastar Proposta</button>
                        </td>
                        <td colSpan='2'>
                            <button type="button" onClick={simularProposta}>Simular Proposta</button>
                        </td>
                    </tbody>
                </table>
            </form>
        </div >
    );
}
