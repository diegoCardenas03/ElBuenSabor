import React, { useEffect, useState } from 'react'
import { PedidoResponseDTO } from '../types/Pedido/PedidoResponseDTO';
import { Estado } from '../types/enums/Estado';


const PedidosCocinero: React.FC = () => {
    const [pedidos, setPedidos] = useState<PedidoResponseDTO[]>([]);
    const [enPreparacion, setEnPreparacion] = useState<PedidoResponseDTO[]>([]);
    const [comandas, setComandas] = useState<PedidoResponseDTO[]>([]);
    const [modalDetallePedido, setModalDetallePedido] = useState<Boolean>(false)
    const [pedidoSeleccionado, setPedidoSeleccionado] = useState<PedidoResponseDTO | null>(null);

    const obtenerPedidos = async () => {
        try {
            const res = await fetch("http://localhost:8080/api/pedidos");
            const data = await res.json();
            setPedidos(data);
            setComandas(data.filter((pedido: PedidoResponseDTO) => pedido.estado === Estado.SOLICITADO));
            setEnPreparacion(data.filter((pedido: PedidoResponseDTO) => pedido.estado === Estado.EN_PREPARACION));
        } catch (error) {
            console.error("Error al traer productos", error);
        }
    };

    useEffect(() => {
        obtenerPedidos();
    }, []);

    const mostrarNumeroPedido = (codigo: string) => {
        const partes = codigo.split("-");
        return partes[partes.length - 1];
    };

    const cambiarEstadoPedido = (pedido: PedidoResponseDTO) => {
        let nuevoEstado: PedidoResponseDTO['estado'];

        if (pedido.estado === Estado.SOLICITADO) {
            nuevoEstado = Estado.EN_PREPARACION
        } else if (pedido.estado === Estado.EN_PREPARACION) {
            nuevoEstado = Estado.TERMINADO
        } else return;

        const pedidoActualizado: PedidoResponseDTO = { ...pedido, estado: nuevoEstado };

        setComandas(prev => prev.filter(p => p.id !== pedido.id));
        setEnPreparacion(prev => prev.filter(p => p.id !== pedido.id));

        if (nuevoEstado === Estado.EN_PREPARACION) {
            setEnPreparacion(prev => [...prev, pedidoActualizado]);
        }

        setPedidoSeleccionado(null);
        setModalDetallePedido(false);
    };

    return (
        <>
            <div className='bg-secondary h-[15vh] flex items-center justify-center'>
                <p className='text-primary text-[40px] font-tertiary'>Pedidos</p>
            </div>
            <div className='bg-primary h-screen flex items-center justify-around'>
                <div className='bg-white w-[40%] max-h-[80vh] h-[80vh] rounded-2xl shadow-md flex flex-col '>
                    <div className='flex flex-col items-center justify-center mt-5 mb-3'>
                        <h2 className='text-tertiary font-tertiary text-[25px] mb-4'>Comandas</h2>
                        <div className='flex items-center justify-between w-full px-4 mb-2'>
                            <h3 className='font-primary pl-3'>N° Orden</h3>
                            <h3 className='font-primary pr-13'>Hora</h3>
                        </div>
                    </div>
                    <div className='flex flex-col justify-center overflow-y-auto'>
                        {comandas.length === 0 ? (
                            <p className='text-primary font-tertiary text-[20px] text-center'>No hay comandas</p>
                        ) : (
                            <div className='flex flex-col items-center'>
                                {comandas.map((pedidos, index) => (
                                    <div key={pedidos.id} >
                                        <button
                                            className={`w-lg rounded-2xl flex items-center justify-between px-4 mb-2 ${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}`}
                                            onClick={() => {
                                                setPedidoSeleccionado(pedidos);
                                                setModalDetallePedido(true);
                                            }}>
                                            <p className='text-black font-primary text-[20px]'>{mostrarNumeroPedido(pedidos.codigo)}</p>
                                            <p className='text-black font-primary text-[20px]'>{pedidos.hora}</p>
                                        </button>
                                    </div>

                                ))}
                            </div>
                        )}
                    </div>
                </div>
                <div className='bg-white w-[40%] max-h-[80vh] h-[80vh] rounded-2xl shadow-md flex flex-col'>
                    <div className='flex flex-col items-center justify-center mt-5 mb-3'>
                        <h2 className='text-tertiary font-tertiary text-[25px] mb-4'>En preparacion</h2>
                        <div className='flex items-center justify-between w-full px-4 mb-2'>
                            <h3 className='font-primary pl-3'>N° Orden</h3>
                            <h3 className='font-primary pr-13'>Hora</h3>
                        </div>
                    </div>
                    <div className='flex flex-col items-center justify-center overflow-y-auto'>
                        {enPreparacion.length === 0 ? (
                            <p className='text-primary font-tertiary text-[20px] text-center'>No hay pedidos en preparacion</p>
                        ) : (
                            <div className='flex flex-col items-center'>
                                {enPreparacion.map((pedidos, index) => (
                                    <div key={pedidos.id} >
                                        <button
                                            className={`w-lg rounded-2xl flex items-center justify-between px-4 mb-2 ${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}`}
                                            onClick={() => {
                                                setPedidoSeleccionado(pedidos);
                                                setModalDetallePedido(true);
                                            }}>
                                            <p className='text-black font-primary text-[20px]'>{mostrarNumeroPedido(pedidos.codigo)}</p>
                                            <p className='text-black font-primary text-[20px]'>{pedidos.hora}</p>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {modalDetallePedido && pedidoSeleccionado && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-primary p-6 rounded-lg shadow-lg w-[350px] md:w-[450px] relative ">
                        <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-800" onClick={() => setModalDetallePedido(false)}>
                            ✕
                        </button>
                        <h2 className="text-secondary font-primary font-bold pb-8 text-[20px] flex justify-center items-center">Orden N° {mostrarNumeroPedido(pedidoSeleccionado.codigo)}</h2>
                        
                            <p><b>Hora:</b> {pedidoSeleccionado.hora}</p>
                            <p><b>Estado:</b> {pedidoSeleccionado.estado}</p>
                            <div className="max-h-[50vh] overflow-y-auto">
                                {pedidoSeleccionado.detallePedidos.map((detalle, idx) => (
                                <React.Fragment key={idx}>
                                        {detalle.producto && (
                                            <div className="mt-2 p-2 bg-white rounded">
                                                <p><b>Cantidad:</b> {detalle.cantidad}</p>
                                                <p><b>Producto:</b> {detalle.producto.denominacion}</p>
                                            </div>
                                        )}
                                        {detalle.insumo && detalle.insumo.esParaElaborar == false && (
                                            <div className="mt-2 p-2 bg-white rounded">
                                                <p><b>Cantidad:</b> {detalle.cantidad}</p>
                                                <p><b>Insumo:</b> {detalle.insumo.denominacion}</p>
                                            </div>
                                        )}
                                </React.Fragment>
                            ))}
                        </div>
                        {pedidoSeleccionado.estado !== Estado.TERMINADO && (
                            <button
                                onClick={() => cambiarEstadoPedido(pedidoSeleccionado)}
                                className="mt-5 bg-secondary hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-full w-full"
                            >
                                {pedidoSeleccionado.estado === Estado.SOLICITADO ? 'Preparar' : 'Completado'}
                            </button>
                        )}

                    </div>
                </div>
            )}
        </>
    )
}

export default PedidosCocinero;
