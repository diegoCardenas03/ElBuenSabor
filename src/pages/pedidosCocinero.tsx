import React, { useState } from 'react'
import { PedidoResponseDTO } from '../types/Pedido/PedidoResponseDTO';
import { Estado } from '../types/enums/Estado';


const PedidosCocinero: React.FC = () => {
    // const [pedidos, setPedidos] = useState<any[]>([]);
    const [enPreparacion, setEnPreparacion] = useState<any[]>([]);
    const [comandas, setComandas] = useState<any[]>([]);
    const [modalDetallePedido, setModalDetallePedido] = useState<Boolean>(false)
    const [pedidoSeleccionado, setPedidoSeleccionado] = useState<any>(null);

    // Simulación de datos
    // useEffect(() => {
    //     const pedidosSimulados: PedidoResponseDTO[] = [
    //         {
    //             id: 1, fecha: "10-03-2000", hora: "12:50hs", codigoOrden: "001", estado: Estado.PENDIENTE, horaEstimadaFin: "13:30", tipoEnvio: TipoEnvio.RETIRO_LOCAL, totalVenta: 300, totalCosto: 150, formaPago: FormaPago.EFECTIVO, detallePedido:
    //                 [{
    //                     producto: [{
    //                         denominacion: "Pizza Musarela",
    //                         descripcion: "descripcion",
    //                         tiempoEstimadoPreparacion: 40,
    //                         precioVenta: 300,
    //                         urlImagen: "https://media.istockphoto.com/id/2170408203/es/foto/pizza-with-prosciutto-cotto-ham-and-mushrooms.jpg?s=1024x1024&w=is&k=20&c=c0KSm2vrbx9aYibYuicD1uXA-uHpXzUImhlRqD_3rXs=",
    //                         activo: true,
    //                         rubro: [{ denominacion: "queso", activo: true }],
    //                         detalleProductos: [{
    //                             cantidad: 2
    //                         }]
    //                     }], cantidad: 2
    //                 }]
    //         },
    //         {
    //             id: 2, fecha: "12-06-2000", hora: "13:40hs", codigoOrden: "002", estado: Estado.EN_PREPARACION, horaEstimadaFin: "14:00", tipoEnvio: TipoEnvio.DELIVERY, totalVenta: 400, totalCosto: 150, formaPago: FormaPago.MERCADO_PAGO, detallePedido:
    //                 [{
    //                     producto: [{
    //                         denominacion: "Pizza 2",
    //                         descripcion: "descripcion 2",
    //                         tiempoEstimadoPreparacion: 20,
    //                         precioVenta: 500,
    //                         urlImagen: "https://media.istockphoto.com/id/2170408203/es/foto/pizza-with-prosciutto-cotto-ham-and-mushrooms.jpg?s=1024x1024&w=is&k=20&c=c0KSm2vrbx9aYibYuicD1uXA-uHpXzUImhlRqD_3rXs=",
    //                         activo: true,
    //                         rubro: [{ denominacion: "queso", activo: true }],
    //                         detalleProductos: [{
    //                             cantidad: 1
    //                         }]
    //                     }], cantidad: 1
    //                 }]
    //         },
    //         {
    //             id: 3, fecha: "01-10-2000", hora: "13:30hs", codigoOrden: "003", estado: Estado.PENDIENTE, horaEstimadaFin: "14:20", tipoEnvio: TipoEnvio.DELIVERY, totalVenta: 450, totalCosto: 150, formaPago: FormaPago.MERCADO_PAGO, detallePedido:
    //                 [{
    //                     producto: [{
    //                         denominacion: "Pizza 3",
    //                         descripcion: "descripcion 3",
    //                         tiempoEstimadoPreparacion: 50,
    //                         precioVenta: 350,
    //                         urlImagen: "https://media.istockphoto.com/id/2170408203/es/foto/pizza-with-prosciutto-cotto-ham-and-mushrooms.jpg?s=1024x1024&w=is&k=20&c=c0KSm2vrbx9aYibYuicD1uXA-uHpXzUImhlRqD_3rXs=",
    //                         activo: true,
    //                         rubro: [{ denominacion: "queso", activo: true }],
    //                         detalleProductos: [{
    //                             cantidad: 3
    //                         }]
    //                     }], cantidad: 3
    //                 }]
    //         },
    //     ];

    //     setPedidos(pedidosSimulados);
    //     setComandas(pedidosSimulados.filter(pedido => pedido.estado === Estado.PENDIENTE));
    //     setEnPreparacion(pedidosSimulados.filter(pedido => pedido.estado === Estado.EN_PREPARACION));
    // }, []);

    const cambiarEstadoPedido = (pedido: PedidoResponseDTO) => {
        let nuevoEstado: PedidoResponseDTO['estado'];

        if (pedido.estado === Estado.PENDIENTE) {
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
                <div className='bg-white w-[40%] h-[80vh] rounded-2xl shadow-md flex flex-col '>
                    <div className='flex flex-col items-center justify-center mt-5 mb-3'>
                        <h2 className='text-tertiary font-tertiary text-[25px] mb-4'>Comandas</h2>
                        <div className='flex items-center justify-between w-full px-4 mb-2'>
                            <h3 className='font-primary pl-3'>N° Orden</h3>
                            <h3 className='font-primary pr-13'>Hora</h3>
                        </div>
                    </div>
                    <div className='flex flex-col items-center justify-center'>
                        {comandas.length === 0 ? (
                            <p className='text-primary font-tertiary text-[20px]'>No hay comandas</p>
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
                                            <p className='text-black font-primary text-[20px]'>{pedidos.codigoOrden}</p>
                                            <p className='text-black font-primary text-[20px]'>{pedidos.hora}</p>
                                        </button>
                                    </div>

                                ))}
                            </div>
                        )}
                    </div>
                </div>
                <div className='bg-white w-[40%] h-[80vh] rounded-2xl shadow-md flex flex-col '>
                    <div className='flex flex-col items-center justify-center mt-5 mb-3'>
                        <h2 className='text-tertiary font-tertiary text-[25px] mb-4'>En preparacion</h2>
                        <div className='flex items-center justify-between w-full px-4 mb-2'>
                            <h3 className='font-primary pl-3'>N° Orden</h3>
                            <h3 className='font-primary pr-13'>Hora</h3>

                        </div>
                    </div>
                    <div className='flex flex-col items-center justify-center'>
                        {enPreparacion.length === 0 ? (
                            <p className='text-primary font-tertiary text-[20px]'>No hay pedidos en preparacion</p>
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
                                            <p className='text-black font-primary text-[20px]'>{pedidos.codigoOrden}</p>
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
                        <h2 className="text-secondary font-primary font-bold pb-8 text-[20px] flex justify-center items-center">Orden N° {pedidoSeleccionado.codigoOrden}</h2>
                        <div>
                            <p><b>Hora:</b> {pedidoSeleccionado.hora}</p>
                            <p><b>Estado:</b> {pedidoSeleccionado.estado}</p>
                            {pedidoSeleccionado.detallePedido.map((detalle: any, idx: number) =>
                                detalle.producto.map((producto: any, j: number) => (
                                    <div key={`${idx}-${j}`} className="mt-2 p-2 bg-white rounded">
                                        <p><b>Producto:</b> {producto.denominacion}</p>
                                        <p><b>Precio Unitario:</b> {producto.precioVenta}</p>
                                        <p><b>Activo:</b> {producto.activo ? 'Sí' : 'No'}</p>
                                    </div>
                                ),
                                detalle.insumo.map((insumo: any, i: number) => (
                                    <div key={`${idx}-${i}`} className="mt-2 p-2 bg-white rounded">
                                        <p><b>Insumo:</b> {insumo.denominacion}</p>
                                        <p><b>Precio Unitario:</b> {insumo.precioVenta}</p>
                                        <p><b>Activo:</b> {insumo.activo ? 'Sí' : 'No'}</p>
                                    </div>
                                ))
                            ))}
                        </div>
                        {pedidoSeleccionado.estado !== Estado.TERMINADO && (
                            <button
                                onClick={() => cambiarEstadoPedido(pedidoSeleccionado)}
                                className="mt-5 bg-secondary hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-full w-full"
                            >
                                {pedidoSeleccionado.estado === Estado.PENDIENTE ? 'Preparar' : 'Completado'}
                            </button>
                        )}

                    </div>
                </div>
            )}
        </>
    )
}

export default PedidosCocinero;
