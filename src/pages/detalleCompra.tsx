import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { FaAngleRight } from "react-icons/fa";
import { Header } from '../components/commons/Header';
import { Footer } from '../components/commons/Footer';
import { DomicilioDTO } from '../types/Domicilio/DomicilioDTO';
import { FormaPago } from '../types/enums/FormaPago';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { setComentario, setDireccion, setMetodoPago, vaciarCarrito } from '../hooks/redux/slices/CarritoReducer';
import { TipoEnvio } from '../types/enums/TipoEnvio';
import { cerrarCarrito } from '../hooks/redux/slices/AbrirCarritoReducer';
import CheckoutMP from '../services/mercadoPago/CheckoutMP';
import { PedidoDTO } from '../types/Pedido/PedidoDTO';
import { DetallePedidoDTO } from '../types/DetallePedido/DetallePedidoDTO';
import { isInsumo, isProducto } from '../types/ProductoUnificado/ProductoUnificado';
import { TbCash } from "react-icons/tb";
import Swal from 'sweetalert2';
import { isPromocion } from '../utils/isPromocion';
import { enviarPedidoThunk } from '../hooks/redux/slices/PedidoReducer';
import { MapContainer, Marker, TileLayer } from 'react-leaflet';
import { markerIcon } from './misDirecciones';
import { formatearDireccion, truncar } from '../utils/Utils';
import { fetchDirecciones } from '../hooks/redux/slices/DomicilioReducer';

const DetalleCompra = () => {
    const dispatch = useAppDispatch();
    const carrito = useAppSelector((state) => state.carrito.items);
    const direcciones = useAppSelector((state) => state.domicilio.direcciones);
    const tipoEntrega = useAppSelector((state) => state.carrito.tipoEntrega);
    const direccionSeleccionada = useAppSelector((state) => state.carrito.direccion);
    const comentario = useAppSelector((state) => state.carrito.comentario);
    const metodoPago = useAppSelector((state) => state.carrito.metodoPago);
    const [direccionTemporal, setDireccionTemporal] = useState<DomicilioDTO | null>(direccionSeleccionada ?? null);
    const [tipoEntregaState, setTipoEntregaState] = useState<boolean>(tipoEntrega === 'DELIVERY' ? true : false);
    const [comentarioState, setComentarioState] = useState({ actual: comentario || '', temporal: comentario || '' });
    const [mostrarDirecciones, setMostrarDirecciones] = useState<boolean>(false);
    const [agregarComentario, setAgregarComentario] = useState<boolean>(false);
    const carritoAbierto = useAppSelector(state => state.carritoUI.abierto);
    const navigate = useNavigate();
    const location = useLocation();
    const { subTotal, envio, total } = location.state || {};

    useEffect(() => {
        if (carritoAbierto) dispatch(cerrarCarrito());
        if (tipoEntregaState) {
            dispatch(setMetodoPago(FormaPago.MERCADO_PAGO));
        }
        dispatch(fetchDirecciones());
    }, [tipoEntregaState, dispatch, direcciones, carritoAbierto]);

    const handleDireccionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const temporal = direcciones.find(dir => dir.id === parseInt(e.target.value));
        if (temporal) {
            setDireccionTemporal(temporal);
        }
    };

    const handleComentarioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { value } = e.target;
        setComentarioState(prev => ({ ...prev, temporal: value }));
    };
    const handleDireccionSubmit = () => {
        dispatch(setDireccion(direccionTemporal));
        setMostrarDirecciones(false);
    };

    const handleComentarioSubmit = () => {
        setComentarioState(prev => {
            dispatch(setComentario(prev.temporal));
            return { ...prev, actual: prev.temporal };
        });
        setAgregarComentario(false);
    };

    const validaciones = (): boolean => {
        if (!tipoEntrega) {
            Swal.fire({
                position: "center",
                icon: "error",
                text: "Elige donde quieres recibir el pedido",
                showConfirmButton: false,
                timer: 1500,
                width: "20em"
            });
            return false;
        }
        if (!metodoPago) {
            Swal.fire({
                position: "center",
                icon: "error",
                text: "Elige un método de pago",
                showConfirmButton: false,
                timer: 1500,
                width: "20em"
            });
            return false;
        }
        if (tipoEntrega === TipoEnvio.DELIVERY && !direccionSeleccionada) {
            Swal.fire({
                position: "center",
                icon: "error",
                text: "Selecciona una dirección",
                showConfirmButton: false,
                timer: 1500,
                width: "20em"
            });
            return false;
        }
        if (carrito.length === 0) {
            Swal.fire({
                position: "center",
                icon: "error",
                text: "El carrito está vacío",
                showConfirmButton: false,
                timer: 1500,
                width: "20em"
            });
            return false;
        }
        return true;
    };

    const pedidoArmado = (): PedidoDTO => {
        const detallePedidos: DetallePedidoDTO[] = carrito.map(({ item, cant }) => {
            if (isPromocion(item)) {
                return { cantidad: cant, promocionId: item.id };
            }
            if (isProducto(item)) {
                return { cantidad: cant, productoId: item.id };
            }
            if (isInsumo(item)) {
                return { cantidad: cant, insumoId: item.id };
            }
            throw new Error("Ítem desconocido en el carrito");
        });
        return {
            tipoEnvio: tipoEntrega!,
            formaPago: metodoPago!,
            clienteId: Number(sessionStorage.getItem('user_id_db')),
            domicilioId: tipoEntrega === TipoEnvio.DELIVERY ? direccionSeleccionada!.id : undefined,
            comentario: comentario || "",
            detallePedidos,
        };
    };

    const handlePedir = async () => {
        if (!validaciones()) return;

        const pedido = pedidoArmado();
        try {
            await dispatch(enviarPedidoThunk(pedido)).unwrap();

            Swal.fire({
                position: "center",
                icon: "success",
                text: "Pedido realizado con exito",
                showConfirmButton: false,
                timer: 1000,
                width: "20em"
            })
            dispatch(vaciarCarrito());
            navigate('/');
        } catch (error) {
            Swal.fire({
                position: "center",
                icon: "error",
                text: "Error al realizar el pedido",
                showConfirmButton: false,
                timer: 1500,
                width: "20em"
            });
        }
    };

    return (
        <>
            <Header />
            <div className='bg-primary h-[100%] py-5 px-10 pt-25 '>
                <div className='lg:flex justify-between'>
                    <div>
                        <div>
                            <h1 className='font-tertiary text-secondary text-[20px] sm:text-[30px] pl-5 pb-5'>{tipoEntrega === TipoEnvio.RETIRO_LOCAL ? 'RETIRO EN TIENDA' : 'ENTREGA A DOMICILIO'}</h1>
                            <div className="bg-white rounded-lg p-5 lg:w-[700px] shadow-md">
                                {tipoEntrega === TipoEnvio.RETIRO_LOCAL ? (
                                    <div className='flex items-center pb-4'>
                                        <MapContainer
                                            center={[-32.8969915, -68.8536561]}
                                            zoom={15}
                                            scrollWheelZoom={false}
                                            dragging={false}
                                            style={{ height: "100px", width: "200px", borderRadius: "10px" }}
                                        >
                                            <TileLayer
                                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                            />

                                            <Marker position={[-32.8969915, -68.8536561]} icon={markerIcon} />
                                        </MapContainer>
                                        <p className="font-bold text-[16px] pl-3 md:pl-8">
                                            Cnel Rodríguez 273, M5500 Mendoza
                                        </p>
                                    </div>
                                ) : (
                                    <div className='flex items-center justify-between pb-4'>
                                        {direccionSeleccionada &&
                                            <div className="flex items-center">
                                                <MapContainer
                                                    center={[Number(direccionSeleccionada?.latitud), Number(direccionSeleccionada?.longitud)]}
                                                    zoom={15}
                                                    scrollWheelZoom={false}
                                                    dragging={false}
                                                    style={{ height: "100px", width: "200px", borderRadius: "10px" }}
                                                >
                                                    <TileLayer
                                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                                    />

                                                    <Marker position={[Number(direccionSeleccionada?.latitud), Number(direccionSeleccionada?.longitud)]} icon={markerIcon} />
                                                </MapContainer>
                                                <p className="font-bold text-[15px] pl-3 md:pl-5">
                                                    {formatearDireccion(direcciones.find(d => d.id === direccionSeleccionada?.id)!)
                                                        || formatearDireccion(direccionSeleccionada)
                                                        || 'Seleccione una dirección'}
                                                </p>
                                            </div>
                                        }
                                        <FaAngleRight stroke='2' className="text-gray-600 cursor-pointer" onClick={() => setMostrarDirecciones(true)} />
                                    </div>

                                )}

                                <div className="border-b border-gray-300 mb-4"></div>

                                <div className="flex items-center justify-between">
                                    <p className={`${!comentarioState.actual ? 'font-bold' : 'text-gray-500'} text-[16px] pl-2`}>
                                        {truncar(comentarioState.actual) || "Agregar comentario"}
                                    </p>
                                    <FaAngleRight stroke='2' className="text-gray-600 cursor-pointer" onClick={() => setAgregarComentario(true)} />
                                </div>
                            </div>
                        </div>

                        <div className='pt-10'>
                            <h1 className='font-tertiary text-secondary text-[20px] sm:text-[30px] pl-5 pb-5'>MEDIOS DE PAGO</h1>
                            <div className="bg-white rounded-lg p-5 lg:w-[700px] shadow-md">
                                {tipoEntrega === TipoEnvio.RETIRO_LOCAL && (
                                    <div>
                                        <label className='flex items-center'>
                                            <input
                                                type='radio'
                                                name='metodoPago'
                                                value='efectivo'
                                                checked={metodoPago === 'EFECTIVO'}
                                                onChange={() => dispatch(setMetodoPago(FormaPago.EFECTIVO))}
                                                className='accent-red-800 mr-3 cursor-pointer'
                                            />
                                            <p className='font-bold'>Efectivo</p>
                                        </label>

                                        <div className="border-b border-gray-300 mb-4 mt-4"></div>

                                    </div>
                                )}
                                <label className='flex items-center'>
                                    <input
                                        type='radio'
                                        name='metodoPago'
                                        value='mercadoPago'
                                        checked={metodoPago === 'MERCADO_PAGO'}
                                        onChange={() => dispatch(setMetodoPago(FormaPago.MERCADO_PAGO))}
                                        className='accent-red-800 mr-3 cursor-pointer'
                                    />
                                    <p className='font-bold'>Mercado Pago</p>

                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="text-left lg:text-center ">
                        <h1 className="font-tertiary text-secondary text-[20px] sm:text-[30px] mb-5 pt-10 pl-5 lg:pt-0">RESUMEN</h1>

                        <div className="bg-white shadow-md rounded-lg p-6 lg:w-[480px] lg:h-[230px] flex flex-col justify-between">
                            <div>
                                <div className="flex justify-between mb-3">
                                    <p>Productos</p>
                                    <p>${subTotal} </p>
                                </div>
                                {tipoEntrega === TipoEnvio.DELIVERY && (
                                    <div className="flex justify-between">
                                        <p>Envío</p>
                                        <p>${envio}</p>
                                    </div>
                                )}
                            </div>
                            <div>
                                <div className="border-t border-gray-300 my-2"></div>
                                <div className="flex justify-between font-bold text-[16px]">
                                    <p>Total</p>
                                    <p>${total}</p>
                                </div>
                            </div>
                        </div>
                        <div className='flex justify-center items-center pt-10 text-center md:pt-20'>
                            {metodoPago === "EFECTIVO" && (
                                <button
                                    className='flex justify-center items-center bg-tertiary rounded-full w-100 h-10 text-[18px] md:w-80 hover:scale-102 transition-transform duration-200 cursor-pointer'
                                    onClick={handlePedir}
                                >
                                    Pagar
                                    <TbCash className='ml-3 text-[1.75rem]' />
                                </button>
                            )}

                            {metodoPago === 'MERCADO_PAGO' && validaciones() && (
                                <CheckoutMP pedido={pedidoArmado()} />
                            )}
                        </div>
                    </div>
                </div>

            </div>


            {mostrarDirecciones && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[9999]">
                    <div className="bg-primary p-6 rounded-lg shadow-lg w-[350px] md:w-[500px] relative ">
                        <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-800" onClick={() => { setMostrarDirecciones(false); setDireccionTemporal(direccionSeleccionada ?? null); }}>
                            ✕
                        </button>

                        <h2 className="text-secondary font-primary font-bold pb-8 text-[20px] text-center">¿Donde querés recibir tu pedido?</h2>

                        <ul className="space-y-2">
                            {direcciones.map(dir => (
                                <label key={dir.id} className='flex items-center cursor-pointer pl-2'>
                                    <input
                                        type='radio'
                                        name='direccion'
                                        value={dir.id}
                                        checked={direccionTemporal?.id === dir.id}
                                        onChange={handleDireccionChange}
                                        className='accent-red-800 mr-3'
                                    />
                                    {formatearDireccion(dir)}
                                </label>
                            ))}
                        </ul>
                        <div className="pt-8 flex justify-center">
                            <button className='bg-tertiary rounded-full px-5 py-1 hover:scale-102 transition-transform duration-200'
                                onClick={() => handleDireccionSubmit()}>
                                Continuar
                            </button>
                        </div>

                    </div>
                </div>
            )}

            {agregarComentario && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[9999]">
                    <div className="bg-primary p-6 rounded-lg shadow-lg w-[350px] md:w-[450px] relative">
                        <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 cursor-pointer" onClick={() => { setAgregarComentario(false); setComentarioState({ ...comentarioState, temporal: comentarioState.actual }); }}>
                            ✕
                        </button>
                        <h2 className="text-secondary font-primary font-bold pb-8 text-[20px] text-center">¿Qué comentario querés agregar?</h2>

                        <textarea
                            className='bg-white w-full h-24 border-none rounded-lg p-4'
                            name='comentario'
                            value={comentarioState.temporal}
                            onChange={handleComentarioChange}
                            placeholder='Escribí tu comentario...'
                        />
                        <div className="pt-8 flex justify-center">
                            <button className='bg-tertiary rounded-full px-5 py-1 hover:scale-102 transition-transform duration-200 cursor-pointer'
                                onClick={() => handleComentarioSubmit()}>
                                Continuar
                            </button>
                        </div>

                    </div>
                </div>
            )}
            <Footer />
        </>
    );
}

export default DetalleCompra;