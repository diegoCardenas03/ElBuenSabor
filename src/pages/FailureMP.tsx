import { useNavigate } from "react-router-dom";
import pizzaEnojada from '../assets/img/pizzaEnojo.webp'

function FailureMP() {
    const navigate = useNavigate();

    setTimeout(() => {
        navigate('/');
    }, 3000);

    return <div className="flex flex-col justify-center items-center font-tertiary text-4xl w-screen h-screen bg-primary text-secondary">
        <img src={pizzaEnojada} alt="Pizza enojada" />
        <h1>Error al generar el pago</h1>
    </div>;
}

export default FailureMP;