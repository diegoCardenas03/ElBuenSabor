import { initMercadoPago } from '@mercadopago/sdk-react';
import { useState } from 'react';
import { PedidoDTO } from '../../types/Pedido/PedidoDTO';
import PreferenceMP from '../../types/PreferenceMP';
import { createPreferenceMP } from './mpService';
import { useAppSelector } from '../../hooks/redux';
import mpIcon from '../../assets/icons/mpIcon.svg'

type Props = {
    pedido: PedidoDTO;
};

function CheckoutMP({ pedido }: Props) {
    const [idPreference, setIdPreference] = useState<string>('');
    const carrito = useAppSelector((state) => state.carrito.items);

    const getPreferenceMP = async () => {
        if (carrito.length > 0) {
            try {
                console.log('Pedido enviado a Mercado Pago:', pedido);
                const response: PreferenceMP = await createPreferenceMP(pedido);
                console.log('Preference id: ' + response.id);
                if (response) {
                    setIdPreference(response.id);
                    localStorage.setItem("pedidoMP", JSON.stringify(pedido));
                    window.location.href = `https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=${response.id}`;
                }
            } catch (error) {
                console.error('Error al crear la preferencia de Mercado Pago:', error);
                alert('Hubo un error al procesar el pago con Mercado Pago.');
            }
        } else {
            alert('Agregue al menos un instrumento al carrito');
        }
    };

    initMercadoPago('APP_USR-55939980-abc7-4474-a8c8-bceca4959144', { locale: 'es-AR' });

    return (
        <>
            <div className='flex justify-center items-center'>
                <button onClick={getPreferenceMP} className="flex justify-center items-center bg-[#00AFF0] text-white rounded-full w-100 h-10 text-[18px] md:w-80 hover:scale-102 transition-transform duration-200 cursor-pointer" disabled={carrito.length === 0}>
                    Pagar
                    <img src={mpIcon} alt="" className='w-8 ml-3' />
                </button>
            </div>
        </>
    );
}

export default CheckoutMP;