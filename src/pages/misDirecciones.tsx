import { useEffect, useState } from 'react';
import Pizza from '../assets/img/pizzaBanco.png';
import { FaPen, FaTrashAlt, FaMapMarkerAlt } from "react-icons/fa";
import { Header } from '../components/commons/Header';
import { Footer } from '../components/commons/Footer';
import { DomicilioDTO } from '../types/Domicilio/DomicilioDTO';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { crearDireccion, editarDireccion, eliminarDireccion, fetchDirecciones } from '../hooks/redux/slices/DomicilioReducer';
import { DomicilioResponseDTO } from '../types/Domicilio/DomicilioResponseDTO';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Swal from 'sweetalert2';

const markerIcon = new L.Icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

function LocationSelector({ onChange }: { onChange: (coords: { lat: number, lng: number }) => void }) {
    useMapEvents({
        click(e) {
            onChange(e.latlng);
        },
    });
    return null;
}

const MisDirecciones = () => {
    const [mostrarModal, setMostrarModal] = useState<boolean>(false);
    const [modoEditar, setModoEditar] = useState<boolean>(false);
    const [direccionEditando, setDireccionEditando] = useState<DomicilioDTO | null>(null);

    const [direccionNueva, setDireccionNueva] = useState<DomicilioDTO>({
        calle: "",
        numero: 0,
        localidad: '',
        codigoPostal: 0,
        latitud: -34.6,
        longitud: -58.4,
    });

    const { calle, numero, localidad, codigoPostal } = direccionNueva;

    const cerrarModal = () => {
        setMostrarModal(false);
        setModoEditar(false);
        setDireccionEditando(null);
        setDireccionNueva({
            calle: "", numero: 0, localidad: '', codigoPostal: 0,
            latitud: -34.6, longitud: -58.4
        });
    }

    const dispatch = useAppDispatch();
    const direcciones = useAppSelector((state) => state.domicilio.direcciones);

    useEffect(() => {
        dispatch(fetchDirecciones());
    }, [dispatch]);

    const handleEliminar = async (id: number) => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: "No podrás deshacer esta acción",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (!result.isConfirmed) return;

        const eliminarResult = await dispatch(eliminarDireccion(id));
        if (!eliminarDireccion.fulfilled.match(eliminarResult)) {
            console.error("Error al eliminar dirección", eliminarResult.payload);
        }
    };

    const handleGuardar = async () => {
        try {
            if (modoEditar && direccionEditando?.id) {
                const res = await dispatch(editarDireccion({ id: direccionEditando.id, data: direccionNueva }));
                if (editarDireccion.fulfilled.match(res)) cerrarModal();
            } else {
                const res = await dispatch(crearDireccion(direccionNueva));
                if (crearDireccion.fulfilled.match(res)) cerrarModal();
            }
        } catch (error) {
            console.error("Error al guardar dirección", error);
        }
    };

    const formatearDireccion = (d: DomicilioResponseDTO) => `${d.calle} ${d.numero}, ${d.localidad}, ${d.codigoPostal}`;

    async function reverseGeocode(lat: number, lon: number) {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`
        );
        if (!response.ok) return null;
        return await response.json();
    }

    async function geocodeDireccion({ calle, numero, localidad, codigoPostal }: DomicilioDTO) {
        const direccion = `${calle} ${numero}, ${localidad}, ${codigoPostal}`;
        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(direccion)}`
        );
        const data = await response.json();
        if (data && data.length > 0) {
            return {
                lat: parseFloat(data[0].lat),
                lng: parseFloat(data[0].lon),
            };
        }
        return null;
    }

    return (
        <>
            <Header />
            <div className="pt-20 bg-primary flex flex-col justify-center align-center">
                <h1 className="font-tertiary pt-10 text-[40px] flex justify-center">Mis Direcciones</h1>

                <div className='flex justify-center pt-8 pb-12'>
                    <button className="cursor-pointer bg-tertiary rounded-full text-md max-w-sm px-5 py-1 hover:scale-102 transition-transform duration-200"
                        onClick={() => setMostrarModal(true)}>
                        Agregar Dirección
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 mt-10 justify-center place-items-center sm:px-5 lg:px-25">
                    {direcciones.map((d: DomicilioResponseDTO) => (
                        <div className="hover:shadow-lg hover:-translate-y-1 transition-all duration-300 bg-secondary rounded-lg shadow-lg p-4 w-[335px] h-[350px] flex flex-col justify-center" key={d.id}>
                            <div className='flex text-primary'>
                                <FaMapMarkerAlt className='relative top-[3px] w-5 h-5 mt-2' />
                                <h2 className="text-primary text-xl font-semibold pt-1 pb-3 pl-1">{formatearDireccion(d)}</h2>
                            </div>
                            <p className="text-primary pb-3 pl-3">{formatearDireccion(d)}</p>
                            <MapContainer
                                center={[d.latitud, d.longitud]}
                                zoom={15}
                                scrollWheelZoom={false}
                                dragging={false}
                                style={{ height: "200px", width: "100%", borderRadius: "10px", marginBottom: "1rem" }}
                            >
                                <TileLayer
                                    attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />
                                <Marker position={[d.latitud, d.longitud]} icon={markerIcon} />
                            </MapContainer>
                            <div className='flex justify-around'>
                                <button
                                    onClick={() => {
                                        setDireccionNueva({
                                            calle: d.calle,
                                            numero: d.numero,
                                            localidad: d.localidad,
                                            codigoPostal: d.codigoPostal,
                                            latitud: d.latitud,
                                            longitud: d.longitud
                                        });
                                        setDireccionEditando(d);
                                        setModoEditar(true);
                                        setMostrarModal(true);
                                    }}
                                    className="flex items-center cursor-pointer bg-primary px-4 py-2 rounded-full mt-2 hover:scale-102 transition-transform duration-200">
                                    Editar <FaPen className="ml-2" />
                                </button>
                                <button
                                    onClick={() => handleEliminar(d.id)}
                                    className="flex items-center cursor-pointer bg-primary px-4 py-2 rounded-full mt-2 hover:scale-102 transition-transform duration-200">
                                    Eliminar <FaTrashAlt className="ml-2" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {mostrarModal && (
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[9999]">
                        <div className="bg-primary p-6 rounded-lg shadow-lg w-[350px] md:w-[450px] relative flex flex-col justify-center items-center">
                            <button
                                className="cursor-pointer absolute top-2 right-2 text-gray-500 hover:text-gray-800"
                                onClick={cerrarModal}>
                                ✕
                            </button>
                            <h2 className="text-secondary font-primary font-bold pb-4 text-[20px]">
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
                                onChange={(e) => setDireccionNueva({ ...direccionNueva, numero: e.target.value === "" ? 0 : parseInt(e.target.value, 10) })}
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
                                placeholder="Código Postal"
                                value={codigoPostal === 0 ? "" : codigoPostal}
                                onChange={(e) => setDireccionNueva({ ...direccionNueva, codigoPostal: e.target.value === "" ? 0 : parseInt(e.target.value, 10) })}
                            />

                            <button
                                className="bg-secondary px-3 py-1 rounded-full mb-4 text-white"
                                onClick={async () => {
                                    const coords = await geocodeDireccion(direccionNueva);
                                    if (coords) {
                                        setDireccionNueva(prev => ({
                                            ...prev,
                                            latitud: coords.lat,
                                            longitud: coords.lng,
                                        }));
                                    } else {
                                        Swal.fire("No se encontró la dirección", "Verifica los datos ingresados.", "warning");
                                    }
                                }}
                            >
                                Buscar en el mapa
                            </button>

                            {/* Mapa para elegir ubicación */}
                            <MapContainer
                                center={[direccionNueva.latitud, direccionNueva.longitud]}
                                zoom={13}
                                style={{ height: "200px", width: "100%", marginBottom: "1rem", borderRadius: "10px" }}
                            >
                                <TileLayer
                                    attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />
                                <LocationSelector
                                    onChange={async ({ lat, lng }) => {
                                        setDireccionNueva((prev) => ({ ...prev, latitud: lat, longitud: lng }));
                                        const data = await reverseGeocode(lat, lng);
                                        if (data && data.address) {
                                            setDireccionNueva((prev) => ({
                                                ...prev,
                                                calle: data.address.road || prev.calle,
                                                numero: data.address.house_number ? parseInt(data.address.house_number, 10) : prev.numero,
                                                localidad: data.address.city || data.address.town || data.address.village || prev.localidad,
                                                codigoPostal: data.address.postcode ? parseInt(data.address.postcode, 10) : prev.codigoPostal,
                                            }));
                                        }
                                    }}
                                />
                                <Marker
                                    position={[direccionNueva.latitud, direccionNueva.longitud]}
                                    icon={markerIcon}
                                />
                            </MapContainer>

                            <div className="flex justify-center items-center space-x-4">
                                <button
                                    className="cursor-pointer bg-tertiary px-5 py-1 rounded-full hover:scale-102 transition-transform duration-200"
                                    onClick={handleGuardar}>
                                    Guardar
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex justify-center items-center pt-10">
                    <img src={Pizza} alt="pizza" className="w-[35%] h-[35%]" />
                </div>
            </div>
            <Footer />
        </>
    );
};

export default MisDirecciones;
