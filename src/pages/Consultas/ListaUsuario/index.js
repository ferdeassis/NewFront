export default function ListaUsuario(props) {

    const { data } = props;
    const propostas = data;

    return (
        <table className="consultaPropostas">
            <thead>
                <tr>
                    <th>
                        CPF
                    </th>
                    <th>
                        Nome
                    </th>
                    <th>
                        Proposta
                    </th>
                    <th>
                        Conveniada
                    </th>
                    <th>
                        Valor Solicitado
                    </th>
                    <th>
                        Prazo
                    </th>
                    <th>
                        Valor Financiado
                    </th>
                    <th>
                        Situação
                    </th>
                    <th>
                        Observação
                    </th>
                    <th>
                        Data Situação
                    </th>
                    <th>
                        Usuário
                    </th>
                </tr>
            </thead>
            <tbody>
                {propostas && propostas.map(proposta => {
                    const dtSit = new Date(proposta.dt_Situacao);
                    const sitDateFormat = `${dtSit.getMonth() + 1}/${dtSit.getDate()}/${dtSit.getFullYear()}`;
                    return (
                        <tr>
                            <td>
                                {proposta.cpf}
                            </td>
                            <td>
                                {proposta.nome}
                            </td>
                            <td>
                                {proposta.proposta}
                            </td>
                            <td>
                                {proposta.descricao}
                            </td>
                            <td>
                                {proposta.vlr_Solicitado}
                            </td>
                            <td>
                                {proposta.prazo}
                            </td>
                            <td>
                                {proposta.vlr_Financiado}
                            </td>
                            <td>
                                {proposta.sitDescricao}
                            </td>
                            <td>
                                {proposta.observacao}
                            </td>
                            <td>
                                {sitDateFormat}
                            </td>
                            <td>
                                {proposta.usuario}
                            </td>
                        </tr>)
                })}
            </tbody>

        </table>
    )
}