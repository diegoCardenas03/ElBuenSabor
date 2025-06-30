import React, { useEffect, useState } from 'react'
import { PedidoResponseDTO } from '../types/Pedido/PedidoResponseDTO';
import { Estado } from '../types/enums/Estado';
import { TablePagination } from '@mui/material';
import { AdminHeader } from '../components/admin/AdminHeader';
import { PedidosService } from '../services/PedidosService';
import { getEstadoTexto } from '../utils/PedidoUtils';
import { useAppDispatch } from '../hooks/redux';
import { updateEstadoPedidoThunk } from '../hooks/redux/slices/PedidoReducer';

const PedidosCocinero: React.FC = () => {
    const [pedidos, setPedidos] = useState<PedidoResponseDTO[]>([]);
    const [enPreparacion, setEnPreparacion] = useState<PedidoResponseDTO[]>([]);
    const [comandas, setComandas] = useState<PedidoResponseDTO[]>([]);
    const [modalDetallePedido, setModalDetallePedido] = useState<Boolean>(false)
    const [pedidoSeleccionado, setPedidoSeleccionado] = useState<PedidoResponseDTO | null>(null);
    const [pageComandas, setPageComandas] = useState(0);
    const [rowsPerPageComandas, setRowsPerPageComandas] = useState(10);
    const [pagePreparacion, setPagePreparacion] = useState(0);
    const [rowsPerPagePreparacion, setRowsPerPagePreparacion] = useState(10);
    const pedidosService = new PedidosService();
    const dispatch = useAppDispatch();

    const handleChangePageComandas = (_: unknown, newPage: number) => {
        setPageComandas(newPage);
    };
    const handleChangeRowsPerPageComandas = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setRowsPerPageComandas(+event.target.value);
        setPageComandas(0);
    };

    // Funciones para En Preparacion
    const handleChangePagePreparacion = (_: unknown, newPage: number) => {
        setPagePreparacion(newPage);
    };
    const handleChangeRowsPerPagePreparacion = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setRowsPerPagePreparacion(+event.target.value);
        setPagePreparacion(0);
    };

    const obtenerPedidos = async () => {
        try {
            const data = await pedidosService.getAll();
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

    const cambiarEstadoPedido = async (pedido: PedidoResponseDTO) => {
        try {
            let nuevoEstado = pedido.estado;
            if (pedido.estado === Estado.SOLICITADO) {
                nuevoEstado = Estado.EN_PREPARACION;
            } else if (pedido.estado === Estado.EN_PREPARACION) {
                nuevoEstado = Estado.TERMINADO;
            } else {
                return;
            }

            await dispatch(updateEstadoPedidoThunk({pedidoId: pedido.id, nuevoEstado: nuevoEstado}));

            obtenerPedidos();
            setPedidoSeleccionado(null);
            setModalDetallePedido(false);


        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            <AdminHeader text="Pedidos" />
            <div className='bg-primary h-screen flex items-center justify-around'>
                <div className='bg-white w-[40%] h-[80vh] rounded-2xl shadow-md flex flex-col '>
                    <div className='flex flex-col items-center justify-center mt-5 mb-3'>
                        <h2 className='text-tertiary font-tertiary text-[25px] mb-4'>Comandas</h2>
                        <div className='flex items-center justify-between w-full px-4 mb-2'>
                            <h3 className='font-primary pl-3'>N° Orden</h3>
                            <h3 className='font-primary pr-13'>Hora</h3>
                        </div>
                    </div>
                    <div className='flex-1 justify-center overflow-auto'>
                        {comandas.length === 0 ? (
                            <p className='text-primary font-tertiary text-[20px] text-center'>No hay comandas</p>
                        ) : (
                            <div className='flex flex-col items-center'>
                                {comandas
                                    .slice(pageComandas * rowsPerPageComandas, pageComandas * rowsPerPageComandas + rowsPerPageComandas)
                                    .map((pedidos, index) => (
                                        <div key={pedidos.id} >
                                            <button
                                                className={`cursor-pointer w-lg rounded-2xl flex items-center justify-between px-4 mb-2 ${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}`}
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
                    <TablePagination
                        rowsPerPageOptions={[10, 25, 100]}
                        component="div"
                        count={comandas.length}
                        rowsPerPage={rowsPerPageComandas}
                        page={pageComandas}
                        onPageChange={handleChangePageComandas}
                        onRowsPerPageChange={handleChangeRowsPerPageComandas}
                    />
                </div>
                <div className='bg-white w-[40%] h-[80vh] rounded-2xl shadow-md flex flex-col'>
                    <div className='flex flex-col items-center justify-center mt-5 mb-3'>
                        <h2 className='text-tertiary font-tertiary text-[25px] mb-4'>En preparacion</h2>
                        <div className='flex items-center justify-between w-full px-4 mb-2'>
                            <h3 className='font-primary pl-3'>N° Orden</h3>
                            <h3 className='font-primary pr-13'>Hora</h3>
                        </div>
                    </div>
                    <div className='flex-1 items-center justify-center overflow-auto'>
                        {enPreparacion.length === 0 ? (
                            <p className='text-primary font-tertiary text-[20px] text-center'>No hay pedidos en preparacion</p>
                        ) : (
                            <div className='flex flex-col items-center'>
                                {enPreparacion
                                    .slice(pagePreparacion * rowsPerPagePreparacion, pagePreparacion * rowsPerPagePreparacion + rowsPerPagePreparacion)
                                    .map((pedidos, index) => (
                                        <div key={pedidos.id} >
                                            <button
                                                className={`cursor-pointer w-lg rounded-2xl flex items-center justify-between px-4 mb-2 ${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}`}
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
                    <TablePagination
                        rowsPerPageOptions={[10, 25, 100]}
                        component="div"
                        count={enPreparacion.length}
                        rowsPerPage={rowsPerPagePreparacion}
                        page={pagePreparacion}
                        onPageChange={handleChangePagePreparacion}
                        onRowsPerPageChange={handleChangeRowsPerPagePreparacion}
                    />
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
                        <p><b>Estado:</b> {getEstadoTexto(pedidoSeleccionado.estado)}</p>
                        <div className="max-h-[50vh] overflow-y-auto">
                            {pedidoSeleccionado.detallePedidos.map((detalle, idx) => (
                                <React.Fragment key={idx}>
                                    {detalle.producto && (
                                        <div className="mt-2 p-2 bg-white rounded">
                                            <p><b>Cantidad:</b> {detalle.cantidad}</p>
                                            <p><b>Producto:</b> {detalle.producto.denominacion}</p>
                                            <p><b>Receta:</b>
                                              {detalle.producto.detalleProductos.map((dp, index) => (
                                                <span key={index}>
                                                  {dp.insumo.denominacion} x{dp.cantidad} ({dp.insumo.unidadMedida})
                                                  {index < index - 1 ? ', ' : ''} 
                                                </span>
                                              ))}</p>
                                        </div>
                                    )}
                                    {detalle.insumo && detalle.insumo.esParaElaborar == false && (
                                        <div className="mt-2 p-2 bg-white rounded">
                                            <p><b>Cantidad:</b> {detalle.cantidad}</p>
                                            <p><b>Insumo:</b> {detalle.insumo.denominacion}</p>
                                        </div>
                                    )}
                                    {detalle.promocion && (
                                        <div className="mt-2 p-2 bg-white rounded">
                                            <p><b>Cantidad:</b> {detalle.cantidad}</p>
                                            <p><b>Promocion:</b> {detalle.promocion.denominacion}</p>
                                            <p><b>Productos incluidos:</b></p>
                                            <ul className="list-disc pl-5">
                                                {Array.isArray(detalle.promocion.detallePromociones) &&
                                                    detalle.promocion.detallePromociones.map((dp, index) => (
                                                        <li key={index}>
                                                            {dp.producto
                                                                ? dp.producto.denominacion
                                                                : dp.insumo
                                                                    ? dp.insumo.denominacion
                                                                    : "Ítem desconocido"}
                                                            {dp.cantidad ? ` x${dp.cantidad}` : ""}
                                                        </li>
                                                    ))}
                                            </ul>
                                            <p><b>Receta:</b>
                                              {detalle.promocion.detallePromociones.map((dp, index) =>
                                                dp.producto && Array.isArray(dp.producto.detalleProductos)
                                                  ? dp.producto.detalleProductos.map((detalleProd, idx) => (
                                                      <span key={idx}>
                                                        {detalleProd.insumo.denominacion} x{detalleProd.cantidad} ({detalleProd.insumo.unidadMedida})
                                                        {idx < dp.producto.detalleProductos.length - 1 ? ', ' : ''}
                                                      </span>
                                                    ))
                                                  : dp.insumo
                                                    ? `${dp.insumo.denominacion} x${dp.cantidad} (${dp.insumo.unidadMedida})`
                                                    : "Ítem desconocido"
                                              )}
                                            </p>
                                        </div>
                                    )}
                                </React.Fragment>
                            ))}
                        </div>
                        {pedidoSeleccionado.estado !== Estado.TERMINADO && (
                            <div className='flex justify-center items-center'>
                                <button
                                    onClick={() => cambiarEstadoPedido(pedidoSeleccionado)}
                                    className="cursor-pointer mt-5 bg-secondary text-white font-bold py-2 px-4 rounded-full w-[50%] hover:bg-yellow-600 hover:scale-105 transition-transform"
                                >
                                    {pedidoSeleccionado.estado === Estado.SOLICITADO ? 'Preparar' : 'Completado'}
                                </button>
                            </div>

                        )}

                    </div>
                </div>
            )}
        </>
    )
}

export default PedidosCocinero;
