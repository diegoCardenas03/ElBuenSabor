import { useEffect, useState } from 'react'
import Pizza from '../assets/img/pizzaBanco.png'
import { FaPen, FaTrashAlt, FaMapMarkerAlt   } from "react-icons/fa";
import { Header } from '../components/Header';

export type Direccion = {
    id: string;
    calle: string;
    numero: string;
    localidad: string;
    codigoPostal: string;
};

export const direccion = (): Direccion[] => {
    return [
        { id: '1', calle: 'Av. San Martin', numero: '123', localidad: 'Ciudad', codigoPostal: '1000' },
        { id: '2', calle: 'Calle Falsa', numero: '456', localidad: 'Godoy Cruz', codigoPostal: '2000' },
        { id: '3', calle: 'Calle San Juan', numero: '436', localidad: 'Ciudad', codigoPostal: '3000' }
    ];
};

const MisDirecciones = () => {
    const [direcciones, setDirecciones] = useState<Direccion[]>([]);
    const [mostrarModal, setMostrarModal] = useState<boolean>(false);
    const [direccionNueva, setDireccionNueva] = useState({calle: '', numero: '', localidad: '', codigoPostal: ''});
    const {calle, numero, localidad, codigoPostal} = direccionNueva;
    const [modoEditar, setModoEditar] = useState<boolean>(false);
    const [direccionEditando, setDireccionEditando] = useState<Direccion | null>(null);

    
    useEffect(() => {
        const direcciones = direccion();
        setDirecciones(direcciones);
    }, []);

    const formatearDireccion = (d: Direccion) => `${d.calle} ${d.numero}, ${d.localidad}, ${d.codigoPostal}`;

    return (
        <>
            <Header backgroundColor='bg-primary'/>
            <div className="bg-primary flex flex-col justify-center align-center">
                <h1 className="font-tertiary pt-10 text-[40px] flex justify-center">Mis Direcciones</h1>

                <div className='flex justify-center pt-8 pb-12'>
                    <button className="cursor-pointer bg-tertiary rounded-full text-md max-w-sm px-5 py-1 hover:scale-102 transition-transform duration-200"
                        onClick={() => setMostrarModal(true)}>
                        Agregar Direccion
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 mt-10 justify-center place-items-center sm:px-10 lg:px-40">
                    {direcciones.map((d) => (
                        <div className="shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 bg-secondary rounded-lg shadow-lg p-4 w-[335px]" key={d.id}>
                            <div className='flex text-primary '>
                                <FaMapMarkerAlt stroke='2'className='relative top-[3px] w-5 h-5 mt-2' />
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
                                    onClick={() => {
                                        const nuevas = direcciones.filter(d => d.id !== d.id);
                                        setDirecciones(nuevas);
                                    }}
                                    className="flex items-center cursor-pointer flex bg-primary px-4 py-2 rounded-full mt-2 hover:scale-102 transition-transform duration-200">
                                    Eliminar
                                    <FaTrashAlt  stroke='2' width={20} height={20} className="relative left-[5px]" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div>
                    {mostrarModal && (
                        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
                            <div className="bg-white p-6 rounded-lg shadow-lg w-[350px] md:w-[450px] relative">
                                <button
                                    className="cursor-pointer absolute top-2 right-2 text-gray-500 hover:text-gray-800"
                                    onClick={() => {
                                        setMostrarModal(false);
                                        setModoEditar(false);
                                        setDireccionEditando(null);
                                        setDireccionNueva({calle: '', numero: '', localidad: '', codigoPostal: ''});
                                    }}
                                >
                                    ✕
                                </button>
                                <h2 className="text-secondary font-primary font-bold pb-4 text-[20px]">
                                    {modoEditar ? 'Editar dirección' : 'Agregar nueva dirección'}
                                </h2>
                                <input
                                    type="text"
                                    className="w-full border border-gray-300 rounded-lg p-3 mb-4"
                                    placeholder="Calle"
                                    value={calle}
                                    onChange={(e) => setDireccionNueva({ ...direccionNueva, calle: e.target.value })}
                                />
                                <input
                                    type="text"
                                    className="w-full border border-gray-300 rounded-lg p-3 mb-4"
                                    placeholder="Número"
                                    value={numero}
                                    onChange={(e) => setDireccionNueva({ ...direccionNueva, numero: e.target.value })}
                                />
                                <input
                                    type="text"
                                    className="w-full border border-gray-300 rounded-lg p-3 mb-4"
                                    placeholder="Localidad"
                                    value={localidad}
                                    onChange={(e) => setDireccionNueva({ ...direccionNueva, localidad: e.target.value })}
                                />
                                <input
                                    type="text"
                                    className="w-full border border-gray-300 rounded-lg p-3 mb-4"
                                    placeholder="Codigo Postal"
                                    value={codigoPostal}
                                    onChange={(e) => setDireccionNueva({ ...direccionNueva, codigoPostal: e.target.value })}
                                />
                                <div className="flex justify-center items-center space-x-4">
                                    <button
                                        className="cursor-pointer bg-tertiary px-5 py-2 rounded-full hover:scale-102 transition-transform duration-200"
                                        onClick={() => {
                                            if (modoEditar && direccionEditando) {
                                                const nuevasDirecciones = direcciones.map(d => d.id === direccionEditando.id ? { ...direccionEditando, ...direccionNueva } : d);
                                                setDirecciones(nuevasDirecciones);
                                            } else {
                                                const nuevaDireccion = { id: Math.random().toString(), ...direccionNueva };
                                                setDirecciones([...direcciones, nuevaDireccion]);
                                            }
                                            setMostrarModal(false);
                                            setModoEditar(false);
                                            setDireccionEditando(null);
                                            setDireccionNueva({calle: '', numero: '', localidad: '', codigoPostal: ''});
                                        }}
                                    >
                                        Guardar
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex justify-center items-center pt-10">
                    <img src={Pizza} alt="pizza" className="w-[45%] h-[45%]" />
                </div>
            </div>
        </>
    );
}

export default MisDirecciones;