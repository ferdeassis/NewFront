export default function PropostaCpf(props) {

    const { data } = props;
    const proposta = data;
    const dtSit = new Date(proposta && proposta.dt_Situacao);
    const sitDateFormat = `${dtSit.getMonth() + 1}/${dtSit.getDate()}/${dtSit.getFullYear()}`;

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
                <tr>
                    <td>
                        {proposta && proposta.cpf}
                    </td>
                    <td>
                        {proposta && proposta.nome}
                    </td>
                    <td>
                        {proposta && proposta.proposta}
                    </td>
                    <td>
                        {proposta && proposta.descricao}
                    </td>
                    <td>
                        {proposta && proposta.vlr_Solicitado}
                    </td>
                    <td>
                        {proposta && proposta.prazo}
                    </td>
                    <td>
                        {proposta && proposta.vlr_Financiado}
                    </td>
                    <td>
                        {proposta && proposta.sitDescricao}
                    </td>
                    <td>
                        {proposta && proposta.observacao}
                    </td>
                    <td>
                        {sitDateFormat}
                    </td>
                    <td>
                        {proposta && proposta.usuario}
                    </td>
                </tr>
            </tbody>
        </table>
    );

}