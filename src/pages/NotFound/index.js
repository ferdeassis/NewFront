import { Link } from "react-router-dom"

export default function NotFound() {
    return (
        <div className="forms">
            <h1>Pagina não encontrada</h1>
            <div>
                <Link to="/"><button onClick>Voltar</button></Link>
            </div>
        </div>
    )
}