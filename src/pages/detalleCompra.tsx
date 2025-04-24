import React from 'react'
import { useState } from 'react';
import imgDireccion from '../assets/icons/imgdireccion.png';
import { IconChevronCompactRight } from '@tabler/icons-react';
import { IconCashBanknote } from '@tabler/icons-react';

const DetalleCompra = () => {
    const [mostrarDirecciones, setMostrarDirecciones] = useState(false);
    const [agregarComentario, setAgregarComentario] = useState(false);

    return (
        <div className='bg-primary h-[100%] py-8 px-10'>
            <div className='lg:flex justify-between'>
                <div>
                    <h1 className='font-tertiary text-secondary text-[20px] sm:text-[30px] pl-5 pb-5'>DETALLE ENTREGA</h1>
                    <div className="bg-white rounded-lg p-5 lg:w-[700px] shadow-md">
                        <div className='flex items-center justify-between pb-4'>
                            <div className="flex items-center">
                                <img src={imgDireccion} alt="Dirección" className="w-20 h-20 mr-4" />
                                <p className="font-bold text-[16px]">Dirección</p>
                            </div>
                            <IconChevronCompactRight stroke={2} className="text-gray-600" onClick={() => setMostrarDirecciones(true)}/>
                            {mostrarDirecciones && (
                                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
                                    <div className="bg-white p-6 rounded-lg shadow-lg w-[350px] md:w-[450px] relative">
                                        <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-800" onClick={() => setMostrarDirecciones(false)}>
                                            ✕
                                        </button>
                                        <h2 className="text-secondary font-primary font-bold pb-8 pl-5 text-[20px]">¿Donde querés recibir tu pedido?</h2>

                                        <ul className="space-y-2">
                                            <div className='flex'>
                                                <input type="radio" name="direccion" className="relative right-[-20px] accent-red-800 ..." />
                                                <li className="pl-10">Av. San Martin 123</li>
                                            </div>
                                            <div className="border-b border-gray-300 mb-4"></div>
                                            <div className='flex'>
                                                <input type="radio" name="direccion" className="relative right-[-20px] accent-red-800 ..." />
                                                <li className="pl-10">Calle Falsa 456</li>
                                            </div>
                                            <div className="border-b border-gray-300 mb-4"></div>
                                            <div className='flex'>
                                                <input type="radio" name="direccion" className="relative right-[-20px] accent-red-800 ..." />
                                                <li className="pl-10">Calle San Juan 436</li>
                                            </div>
                                        </ul>
                                        <div className="pt-8 flex justify-center">
                                            <button className='bg-tertiary rounded-full px-5 py-1 hover:scale-102 transition-transform duration-200' onClick={() => setMostrarDirecciones(false)}>Continuar</button>
                                        </div>

                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="border-b border-gray-300 mb-4"></div>

                        <div className="flex items-center justify-between pb-4">
                            <p className="font-bold text-[16px] pl-2">Agregar comentario</p>
                            <IconChevronCompactRight stroke={2} className="text-gray-600" onClick={() => setAgregarComentario(true)}/>
                            {agregarComentario && (
                                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
                                    <div className="bg-white p-6 rounded-lg shadow-lg w-[350px] md:w-[450px] relative">
                                        <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-800" onClick={() => setAgregarComentario(false)}>
                                            ✕
                                        </button>
                                        <h2 className="text-secondary font-primary font-bold pb-8 pl-5 text-[20px]">¿Qué comentario querés agregar?</h2>

                                        <textarea className="w-full h-24 border border-gray-300 rounded-lg p-4" placeholder="Escribe tu comentario aquí..."></textarea>
                                        <div className="pt-8 flex justify-center">
                                            <button className='bg-tertiary rounded-full px-5 py-1 hover:scale-102 transition-transform duration-200' onClick={() => setAgregarComentario(false)}>Continuar</button>
                                        </div>

                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="border-b border-gray-300 mb-4"></div>

                        <div className="flex items-center justify-between">
                            <p className="font-bold text-[16px] pl-2">Delivery</p>
                            <p className="text-gray-500 pr-10">5-10 min</p>
                        </div>
                    </div>
                    <div className='pt-10'>
                        <h1 className='font-tertiary text-secondary text-[20px] sm:text-[30px] pl-5 pb-5'>MEDIOS DE PAGO</h1>
                        <div className="bg-white rounded-lg p-5 lg:w-[700px] shadow-md">
                            <div className='flex'>
                                <input type="radio" name="metodoPago" className="relative right-[-20px] accent-red-800 ..." />
                                <p className='pl-8 font-bold text-[16px]'>Efectivo</p>
                                <IconCashBanknote stroke={2} className='ml-2'/>
                            </div>
                            <div className="border-b border-gray-300 my-4"></div>
                            <div className='flex'>
                                <input type="radio" name="metodoPago" className="relative right-[-20px] top-1 mb-5 accent-red-800 ..." />
                                <p className='pl-8 font-bold text-[16px]'>Mercado Pago</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="text-left lg:text-center ">
                    <h1 className="font-tertiary text-secondary text-[20px] sm:text-[30px] mb-5 pt-10 pl-5 lg:pt-0">RESUMEN</h1>

                    <div className="bg-white shadow-md rounded-lg p-6 lg:w-[480px] lg:h-[300px] flex flex-col justify-between">
                        <div>
                            <div className="flex justify-between mb-3">
                                <p>Productos</p>
                                <p>$10000</p>
                            </div>
                            <div className="flex justify-between mb-3">
                                <p>Envío</p>
                                <p>$400</p>
                            </div>
                            <div className="flex justify-between mb-3">
                                <p>Tarifa de servicio</p>
                                <p>$150</p>
                            </div>
                        </div>
                        <div>
                            <div className="border-t border-gray-300 my-2"></div>
                            <div className="flex justify-between font-bold text-[16px]">
                                <p>Total</p>
                                <p>$10550</p>
                            </div>
                        </div>
                    </div>
                    <div className='pt-10 text-center md:pt-20'>
                        <button className='bg-tertiary rounded-full w-75 h-10 text-[18px] md:w-80 hover:scale-102 transition-transform duration-200'>Pedir</button>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default DetalleCompra;