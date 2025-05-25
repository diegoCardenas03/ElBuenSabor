import React, { useEffect, useState } from 'react'
import imgDireccion from '../assets/icons/imgdireccion.png';
import { useLocation } from 'react-router-dom';
import { Direccion, direccion } from '../pages/misDirecciones';
import { FaMoneyBillAlt, FaAngleRight  } from "react-icons/fa";
import { Header } from '../components/commons/Header';

type MetodoPago = 'efectivo' | 'mercadoPago';

const DetalleCompra = () => {
    const [direcciones, setDirecciones] = useState<Direccion[]>([]);
    const [mostrarDirecciones, setMostrarDirecciones] = useState<boolean>(false);
    const [direccionState, setDireccionState] = useState({ seleccionada: '', temporal: '' });
    const [agregarComentario, setAgregarComentario] = useState<boolean>(false);
    const [comentarioState, setComentarioState] = useState({ actual: '', temporal: '' });
    const [metodoPago, setMetodoPago] = useState<MetodoPago>('efectivo');
    const location = useLocation();
    const { direccion: direccionDesdeState, tipoEntrega, subTotal, envio, total } = location.state || {};
    const [tipoEntregaState, setTipoEntregaState] = useState(tipoEntrega === 'delivery' ? true : false);


    useEffect(() => {
        const direcciones = direccion();
        setDirecciones(direcciones);
    }, []);

    const formatearDireccion = (d?: Direccion) => d ? `${d.calle} ${d.numero}, ${d.localidad}, ${d.codigoPostal}` : '';

    const tarifaServicio = 150; // Suponiendo una tarifa de servicio fija


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        if (name === 'direccion') {
            setDireccionState(prev => ({ ...prev, temporal: value }));
        } else if (name === 'comentario') {
            setComentarioState(prev => ({ ...prev, temporal: value }));
        }
    };

    const handleSubmit = (name: 'direccion' | 'comentario') => {
        if (name === 'direccion') {
            setDireccionState(prev => ({ ...prev, seleccionada: prev.temporal }));
            setMostrarDirecciones(false);
        } else if (name === 'comentario') {
            setComentarioState(prev => ({ ...prev, actual: prev.temporal }));
            setAgregarComentario(false);
        }
    }

    return (
        <>
            <Header backgroundColor='bg-primary'/>
            <div className='bg-primary h-[100%] py-8 px-10 pt-10'>
                <div className='lg:flex justify-between'>
                    <div>
                        {tipoEntregaState ? (
                            <div>
                                <h1 className='font-tertiary text-secondary text-[20px] sm:text-[30px] pl-5 pb-5'>ENTREGA A DOMICILIO</h1>
                                <div className="bg-white rounded-lg p-5 lg:w-[700px] shadow-md">
                                    <div className='flex items-center justify-between pb-4'>
                                        <div className="flex items-center">
                                            <img src={imgDireccion} alt="Dirección" className="w-20 h-20 mr-4" />
                                            <p className="font-bold text-[16px]">
                                                {formatearDireccion(direcciones.find(d => d.id === direccionState.seleccionada)!)
                                                    || formatearDireccion(direccionDesdeState)
                                                    || 'Seleccione una dirección'}
                                            </p>
                                        </div>
                                        <FaAngleRight stroke='2' className="text-gray-600 cursor-pointer" onClick={() => setMostrarDirecciones(true)} />
                                    </div>

                                    <div className="border-b border-gray-300 mb-4"></div>

                                    <div className="flex items-center justify-between pb-4">
                                        <p className={`${!comentarioState.actual ? 'font-bold' : 'text-gray-500'} text-[16px] pl-2`}>
                                            {comentarioState.actual || "Agregar comentario"}
                                        </p>
                                        <FaAngleRight stroke='2' className="text-gray-600 cursor-pointer" onClick={() => setAgregarComentario(true)} />
                                    </div>

                                    <div className="border-b border-gray-300 mb-4"></div>

                                    <div className="flex items-center justify-between">
                                        <p className="font-bold text-[16px] pl-2">Delivery</p>
                                        <p className="text-gray-500 pr-10">5-10 min</p>
                                    </div>
                                </div>
                            </div>

                        ) : (
                            <div>
                                <h1 className='font-tertiary text-secondary text-[20px] sm:text-[30px] pl-5 pb-5'>RETIRO EN TIENDA</h1>
                                <div className="bg-white rounded-lg p-5 lg:w-[700px] shadow-md">
                                    <div className='flex items-center justify-between pb-4'>
                                        <div className="flex items-center">
                                            <img src={imgDireccion} alt="Dirección" className="w-20 h-20 mr-4" />
                                            <p className="font-bold text-[16px]">
                                                {"Dirección de la tienda"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="border-b border-gray-300 mb-4"></div>

                                    <div className="flex items-center justify-between pb-4">
                                        <p className={`${!comentarioState.actual ? 'font-bold' : 'text-gray-500'} text-[16px] pl-2`}>
                                            {comentarioState.actual || "Agregar comentario"}
                                        </p>
                                        <FaAngleRight stroke='2' className="text-gray-600 cursor-pointer" onClick={() => setAgregarComentario(true)} />
                                    </div>

                                    <div className="border-b border-gray-300 mb-4"></div>

                                    <div className="flex items-center justify-between">
                                        <p className="font-bold text-[16px] pl-2">En tienda</p>
                                        <p className="text-gray-500 pr-10">5 min</p>
                                    </div>
                                </div>
                            </div>

                        )}


                        <div className='pt-10'>
                            <h1 className='font-tertiary text-secondary text-[20px] sm:text-[30px] pl-5 pb-5'>MEDIOS DE PAGO</h1>
                            <div className="bg-white rounded-lg p-5 lg:w-[700px] shadow-md">
                                <label className='flex items-center'>
                                    <input
                                        type='radio'
                                        name='metodoPago'
                                        value='efectivo'
                                        checked={metodoPago === 'efectivo'}
                                        onChange={() => setMetodoPago('efectivo')}
                                        className='accent-red-800 mr-3 cursor-pointer'
                                    />
                                    <p className='font-bold'>Efectivo</p>
                                    <FaMoneyBillAlt  stroke='2' className='ml-2'/>
                                </label>

                                <div className="border-b border-gray-300 mb-4 mt-4"></div>

                                <label className='flex items-center'>
                                    <input
                                        type='radio'
                                        name='metodoPago'
                                        value='mercadoPago'
                                        checked={metodoPago === 'mercadoPago'}
                                        onChange={() => setMetodoPago('mercadoPago')}
                                        className='accent-red-800 mr-3 cursor-pointer'
                                    />
                                    <p className='font-bold'>Mercado Pago</p>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="text-left lg:text-center ">
                        <h1 className="font-tertiary text-secondary text-[20px] sm:text-[30px] mb-5 pt-10 pl-5 lg:pt-0">RESUMEN</h1>

                        <div className="bg-white shadow-md rounded-lg p-6 lg:w-[480px] lg:h-[300px] flex flex-col justify-between">
                            <div>
                                <div className="flex justify-between mb-3">
                                    <p>Productos</p>
                                    <p>${subTotal}</p>
                                </div>
                                {tipoEntregaState && (
                                    <div className="flex justify-between mb-3">
                                        <p>Envío</p>
                                        <p>${envio}</p>
                                    </div>
                                )}
                                <div className="flex justify-between mb-3">
                                    <p>Tarifa de servicio</p>
                                    <p>${tarifaServicio}</p>
                                </div>
                            </div>
                            <div>
                                <div className="border-t border-gray-300 my-2"></div>
                                <div className="flex justify-between font-bold text-[16px]">
                                    <p>Total</p>
                                    <p>${total + tarifaServicio}</p>
                                </div>
                            </div>
                        </div>
                        <div className='pt-10 text-center md:pt-20'>
                            <button className='bg-tertiary rounded-full w-75 h-10 text-[18px] md:w-80 hover:scale-102 transition-transform duration-200 cursor-pointer'>Pedir</button>
                        </div>
                    </div>
                </div>

            </div>


            {mostrarDirecciones && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-primary p-6 rounded-lg shadow-lg w-[350px] md:w-[450px] relative ">
                        <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-800" onClick={() => { setMostrarDirecciones(false); setDireccionState({ ...direccionState, temporal: direccionState.seleccionada }); }}>
                            ✕
                        </button>
                        <h2 className="text-secondary font-primary font-bold pb-8 pl-5 text-[20px]">¿Donde querés recibir tu pedido?</h2>

                        <ul className="space-y-2">
                            {direcciones.map(dir => (
                                <label key={dir.id} className='flex items-center cursor-pointer pl-8'>
                                    <input
                                        type='radio'
                                        name='direccion'
                                        value={dir.id}
                                        checked={direccionState.temporal === dir.id || direccionDesdeState?.id === dir.id} 
                                        onChange={handleChange}
                                        className='accent-red-800 mr-3'
                                    />
                                    {formatearDireccion(dir)}
                                </label>
                            ))}
                        </ul>
                        <div className="pt-8 flex justify-center">
                            <button className='bg-tertiary rounded-full px-5 py-1 hover:scale-102 transition-transform duration-200'
                                onClick={() => handleSubmit('direccion')}>
                                Continuar
                            </button>
                        </div>

                    </div>
                </div>
            )}

            {agregarComentario && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-primary p-6 rounded-lg shadow-lg w-[350px] md:w-[450px] relative">
                        <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 cursor-pointer" onClick={() => { setAgregarComentario(false); setComentarioState({ ...comentarioState, temporal: comentarioState.actual }); }}>
                            ✕
                        </button>
                        <h2 className="text-secondary font-primary font-bold pb-8 pl-5 text-[20px]">¿Qué comentario querés agregar?</h2>

                        <textarea
                            className='bg-white w-full h-24 border-none rounded-lg p-4'
                            name='comentario'
                            value={comentarioState.temporal}
                            onChange={handleChange}
                            placeholder='Escribí tu comentario...'
                        />
                        <div className="pt-8 flex justify-center">
                            <button className='bg-tertiary rounded-full px-5 py-1 hover:scale-102 transition-transform duration-200 cursor-pointer'
                                onClick={() => handleSubmit('comentario')}>
                                Continuar
                            </button>
                        </div>

                    </div>
                </div>
            )}
        </>
    );
}

export default DetalleCompra;