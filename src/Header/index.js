import logo from '../images/logo.png';
import './style.css';

export default function Header() {
    return (
        <div>
            <header>
                <img src={logo} alt="Bem Promotora logo" />
            </header>
        </div>
    );
}