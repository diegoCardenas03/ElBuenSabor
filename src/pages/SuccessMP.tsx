import { useEffect } from "react";
import { PedidosService } from "../services/PedidosService";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { vaciarCarrito } from "../hooks/redux/slices/CarritoReducer";
import { useNavigate } from "react-router-dom";
import pizzaImg from '../assets/pizza-roja.png';

function SuccessMP() {
    const pedidoService = new PedidosService();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const pedido = JSON.parse(localStorage.getItem("pedidoMP") as string);
        const params = new URLSearchParams(window.location.search);
        const status = params.get("status");
        if (status === "approved" && pedido) {
            localStorage.removeItem("pedidoMP");
                dispatch(vaciarCarrito());
                setTimeout(() => {
                    navigate('/');
                }, 3000);
        }
    }, []);

    return <div className="flex flex-col justify-center items-center font-tertiary text-4xl w-screen h-screen bg-primary text-secondary">
        <img src={pizzaImg} alt="Imagen pizza" />
        <h1>¡Pago exitoso!</h1>
    </div>;
}

export default SuccessMP;
