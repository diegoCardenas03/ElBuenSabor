import { useEffect } from "react";
import { useAppDispatch } from "../hooks/redux";
import { vaciarCarrito } from "../hooks/redux/slices/CarritoReducer";
import { useNavigate } from "react-router-dom";
import pizzaImg from '../assets/pizza-roja.png';
import Swal from "sweetalert2";

function SuccessMP() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const pedido = JSON.parse(localStorage.getItem("pedidoMP") as string);
        const params = new URLSearchParams(window.location.search);
        const status = params.get("status");
        if (status === "approved" && pedido) {
            dispatch(vaciarCarrito());
            setTimeout(() => {
                localStorage.removeItem("pedidoMP");
                navigate('/');
            }, 3000);
        } else {
            Swal.fire({
                position: "center",
                icon: "error",
                text: "Error al registrar el pedido.",
                showConfirmButton: false,
                timer: 1500,
                width: "20em"
            });
        }
    }, []);

    return <div className="flex flex-col justify-center items-center font-tertiary text-4xl w-screen h-screen bg-primary text-secondary">
        <img src={pizzaImg} alt="Imagen pizza" />
        <h1>¡Pago exitoso!</h1>
    </div>;
}

export default SuccessMP;
