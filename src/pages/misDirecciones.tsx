import { useEffect, useState } from 'react'
import Pizza from '../assets/img/pizzaBanco.png'
import { FaPen, FaTrashAlt, FaMapMarkerAlt } from "react-icons/fa";
import { Header } from '../components/commons/Header';
import { Footer } from '../components/commons/Footer';
import { DomicilioDTO } from '../types/Domicilio/DomicilioDTO';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { crearDireccion, editarDireccion, eliminarDireccion, fetchDirecciones } from '../hooks/redux/slices/DomicilioReducer';
import { DomicilioResponseDTO } from '../types/Domicilio/DomicilioResponseDTO';
import { useEventCallback } from '@mui/material';

const MisDirecciones = () => {
    const [mostrarModal, setMostrarModal] = useState<boolean>(false);
    const [direccionNueva, setDireccionNueva] = useState({ calle: "", numero: 0, localidad: '', codigoPostal: 0 });
    const { calle, numero, localidad, codigoPostal } = direccionNueva;
    const [modoEditar, setModoEditar] = useState<boolean>(false);
    const [direccionEditando, setDireccionEditando] = useState<DomicilioDTO | null>(null);
    const cerrarModal = () => {
        setMostrarModal(false);
        setModoEditar(false);
        setDireccionEditando(null);
        setDireccionNueva({ calle: "", numero: 0, localidad: '', codigoPostal: 0 });
    }

    const dispatch = useAppDispatch();
    const direcciones = useAppSelector((state) => state.domicilio.direcciones);

    useEffect(() => {
        dispatch(fetchDirecciones())
    }, [dispatch])


    const handleEliminar = async (id: number) => {
        const result = await dispatch(eliminarDireccion(id));
        if (eliminarDireccion.fulfilled.match(result)) {
            console.log("Dirección eliminada correctamente");
        } else {
            console.error("Error al eliminar dirección", result.payload);
        }
    };

    const handleGuardar = async () => {
        try {
            if (modoEditar && direccionEditando?.id) {
                const res = await dispatch(editarDireccion({ id: direccionEditando.id, data: direccionNueva }));
                if (editarDireccion.fulfilled.match(res)) {
                    cerrarModal();
                }
            } else {
                const res = await dispatch(crearDireccion(direccionNueva));
                if (crearDireccion.fulfilled.match(res)) {
                    cerrarModal();
                }
            }
        } catch (error) {
            console.error("Error al guardar dirección", error);
        }
    };

    const formatearDireccion = (d: DomicilioResponseDTO) => `${d.calle} ${d.numero}, ${d.localidad}, ${d.codigoPostal}`;

    return (
        <>
            <Header backgroundColor='bg-primary' />
            <div className="bg-primary flex flex-col justify-center align-center">
                <h1 className="font-tertiary pt-10 text-[40px] flex justify-center">Mis Direcciones</h1>

                <div className='flex justify-center pt-8 pb-12'>
                    <button className="cursor-pointer bg-tertiary rounded-full text-md max-w-sm px-5 py-1 hover:scale-102 transition-transform duration-200"
                        onClick={() => setMostrarModal(true)}>
                        Agregar Direccion
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 mt-10 justify-center place-items-center sm:px-5 lg:px-25">
                    {direcciones.map((d: DomicilioResponseDTO) => (
                        <div className="shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 bg-secondary rounded-lg shadow-lg p-4 w-[335px]" key={d.id}>
                            <div className='flex text-primary '>
                                <FaMapMarkerAlt stroke='2' className='relative top-[3px] w-5 h-5 mt-2' />
                                <h2 className="text-primary text-xl font-semibold pt-1 pb-3 pl-1">{formatearDireccion(d)}</h2>
                            </div>
                            <p className="text-primary pb-3 pl-3">{formatearDireccion(d)}</p>
                            <div className='flex justify-around '>
                                <button
                                    onClick={() => {
                                        setDireccionNueva({
                                            calle: d.calle,
                                            numero: d.numero,
                                            localidad: d.localidad,
                                            codigoPostal: d.codigoPostal
                                        });
                                        setDireccionEditando(d);
                                        setModoEditar(true);
                                        setMostrarModal(true);
                                    }}
                                    className="flex items-center cursor-pointer flex bg-primary px-4 py-2 rounded-full mt-2 hover:scale-102 transition-transform duration-200">
                                    Editar
                                    <FaPen stroke='2' width={20} height={20} className="relative left-[5px]" />
                                </button>
                                <button
                                    onClick={() => handleEliminar(d.id)}
                                    className="flex items-center cursor-pointer flex bg-primary px-4 py-2 rounded-full mt-2 hover:scale-102 transition-transform duration-200">
                                    Eliminar
                                    <FaTrashAlt stroke='2' width={20} height={20} className="relative left-[5px]" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div>
                    {mostrarModal && (
                        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
                            <div className="bg-primary p-6 rounded-lg shadow-lg w-[350px] md:w-[450px] relative flex flex-col justify-center items-center">
                                <button
                                    className="cursor-pointer absolute top-2 right-2 text-gray-500 hover:text-gray-800"
                                    onClick={() => {
                                        setMostrarModal(false);
                                        setModoEditar(false);
                                        setDireccionEditando(null);
                                        setDireccionNueva({ calle: "", numero: 0, localidad: "", codigoPostal: 0 });
                                    }}
                                >
                                    ✕
                                </button>
                                <h2 className="items-center text-secondary font-primary font-bold pb-4 text-[20px]">
                                    {modoEditar ? 'Editar dirección' : 'Agregar nueva dirección'}
                                </h2>
                                <input
                                    type="text"
                                    className="bg-white w-sm border-none rounded-[50px] p-2 mb-4"
                                    placeholder="Calle"
                                    value={calle}
                                    onChange={(e) => setDireccionNueva({ ...direccionNueva, calle: e.target.value })}
                                />
                                <input
                                    type="number"
                                    className="bg-white w-sm border-none rounded-[50px] p-2 mb-4"
                                    placeholder="Número"
                                    value={numero === 0 ? "" : numero}
                                    onChange={(e) => setDireccionNueva({ ...direccionNueva, numero: e.target.value === "" ? 0 : parseInt(e.target.value, 10),})}
                                />
                                <input
                                    type="text"
                                    className="bg-white w-sm border-none rounded-[50px] p-2 mb-4"
                                    placeholder="Localidad"
                                    value={localidad}
                                    onChange={(e) => setDireccionNueva({ ...direccionNueva, localidad: e.target.value })}
                                />
                                <input
                                    type="number"
                                    className="bg-white w-sm border-none rounded-[50px] p-2 mb-4"
                                    placeholder="Codigo Postal"
                                    value={codigoPostal === 0 ? "" : codigoPostal}
                                    onChange={(e) => setDireccionNueva({ ...direccionNueva, codigoPostal: e.target.value === "" ? 0 : parseInt(e.target.value, 10),})}
                                />
                                <div className="flex justify-center items-center space-x-4">
                                    <button
                                        className="cursor-pointer bg-tertiary px-5 py-2 rounded-full hover:scale-102 transition-transform duration-200"
                                        onClick={handleGuardar}>
                                        Guardar
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex justify-center items-center pt-10">
                    <img src={Pizza} alt="pizza" className="w-[35%] h-[35%]" />
                </div>
            </div>
            <Footer />
        </>
    );
}

export default MisDirecciones;