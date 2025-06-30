import { initMercadoPago } from '@mercadopago/sdk-react';
import { useState } from 'react';
import { PedidoDTO } from '../../types/Pedido/PedidoDTO';
import PreferenceMP from '../../types/PreferenceMP';
import { createPreferenceMP } from './mpService';
import { useAppSelector } from '../../hooks/redux';
import mpIcon from '../../assets/icons/mpIcon.svg'
import Swal from 'sweetalert2';

type Props = {
    pedido: PedidoDTO;
};

function CheckoutMP({ pedido }: Props) {
    const [idPreference, setIdPreference] = useState<string>('');
    const carrito = useAppSelector((state) => state.carrito.items);

    const getPreferenceMP = async () => {
        if (carrito.length > 0) {
            try {
                // console.log('Pedido enviado a Mercado Pago:', pedido);
                const response: PreferenceMP = await createPreferenceMP(pedido);
                // console.log('Preference id: ' + response.id);
                if (response) {
                    setIdPreference(response.id);
                    localStorage.setItem("pedidoMP", JSON.stringify(pedido));
                    window.location.href = `https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=${response.id}`;
                }
            } catch (error) {
                console.error('Error al crear la preferencia de Mercado Pago:', error);
                Swal.fire({
                    position: "center",
                    icon: "error",
                    text: "Hubo un error al procesar el pago con Mercado Pago.",
                    showConfirmButton: false,
                    timer: 1500,
                    width: "20em"
                });
            }
        }
    };

    initMercadoPago('APP_USR-55939980-abc7-4474-a8c8-bceca4959144', { locale: 'es-AR' });

    return (
        <>
            <button onClick={getPreferenceMP} className="flex justify-center items-center bg-[#00AFF0] text-white rounded-full w-100 md:w-80 h-10 text-[18px] hover:scale-102 transition-transform duration-200 cursor-pointer" disabled={carrito.length === 0}>
                Pagar
                <img src={mpIcon} alt="" className='w-8 ml-3' />
            </button>
        </>
    );
}

export default CheckoutMP;