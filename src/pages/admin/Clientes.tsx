import { useEffect, useState } from "react";
import { AdminHeader } from "../../components/admin/AdminHeader"
import { CircularProgress, Switch } from "@mui/material";
import { TableGeneric } from "../../components/TableGeneric";
import { ClienteResponseDTO } from "../../types/Cliente/ClienteResponseDTO";
import { IoFilterSharp } from "react-icons/io5";
import { FaSearch } from "react-icons/fa";
import { ClientesService } from "../../services/ClienteService";
import { useAppDispatch } from "../../hooks/redux";
import { setDataTable } from "../../hooks/redux/slices/TableReducer";
import Swal from "sweetalert2";

type FiltroState = {
    estado: "TODOS" | "ACTIVO" | "INACTIVO";
    searchTerm: string;
};

const Clientes = () => {
    const [loading, setLoading] = useState<Boolean>(false);
    const [modalFilters, setModalFilters] = useState<Boolean>(false);
    const [filtros, setFiltros] = useState<FiltroState>({ estado: "TODOS", searchTerm: "", });
    const [filtroSeleccionado, setFiltroSeleccionado] = useState<FiltroState>({ estado: "TODOS", searchTerm: "", });
    const resetFiltros = () => { setFiltros({ estado: "TODOS", searchTerm: "" }); setFiltroSeleccionado({ estado: "TODOS", searchTerm: "" }); };
    const clientesService = new ClientesService();
    const dispatch = useAppDispatch();

    const ColumnsTableClientes = [
        {
            label: "Nombre",
            key: "nombreCompleto",
        },
        {
            label: "Telefono",
            key: "telefono",
        },
        {
            label: "Email",
            key: "email",
        },
        {
            label: "Rol",
            key: "rol",
        },
        {
            label: "Activo",
            key: "activo",
            render: (cliente: ClienteResponseDTO) => (
                <Switch
                    checked={cliente.activo}
                    onChange={async () => {
                        try {
                            await clientesService.updateEstado(cliente.id)
                            getClientes();
                        } catch (error) {
                            Swal.fire(
                                error instanceof Error ? error.message : String(error),
                                "No se pudo actualizar el estado",
                                "error"
                            );
                        }
                    }}
                    color="primary"
                />
            ),
        },
    ]

    const filtrarClientes = (cliente: ClienteResponseDTO[]): ClienteResponseDTO[] => {
        let clienteFiltrados = cliente;

        if (filtros.estado === "ACTIVO") {
            clienteFiltrados = clienteFiltrados.filter(c => c.activo === true);
        } else if (filtros.estado === "INACTIVO") {
            clienteFiltrados = clienteFiltrados.filter(c => c.activo === false);
        }

        if (filtros.searchTerm.trim() !== "") {
            clienteFiltrados = clienteFiltrados.filter(c =>
                c.nombreCompleto.toLowerCase().includes(filtros.searchTerm.trim().toLowerCase()) ||
                c.usuario.email.toLowerCase().includes(filtros.searchTerm.trim().toLowerCase()) ||
                c.telefono.includes(filtros.searchTerm.trim())
            );
        }

        return clienteFiltrados;
    };

    const getClientes = async () => {
        try {
            const clienteData = await clientesService.getAll();
            const clientesDTO = clienteData.map((c) => ({
                id: c.id,
                nombreCompleto: c.nombreCompleto,
                telefono: c.telefono,
                activo: c.activo,
                usuario: c.usuario,
                email: c.usuario.email,
                rol: c.usuario.rol,
                detalleDomicilios: c.detalleDomicilios,
            }));
            const clientesFiltrados = filtrarClientes(clientesDTO);
            dispatch(setDataTable(clientesFiltrados));
        } catch (error) {
            console.error("Error al obtener clientes", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setLoading(true);
        getClientes();
    }, [filtros]);

    return (
        <>
            <AdminHeader text="Clientes" />
            <div className='w-full h-screen bg-primary pb-10 pt-5'>
                <div className='flex flex-col md:flex-row justify-center items-center mt-5 mb-5'>
                    <div className='flex items-center mt-4 mb-2 lg:pl-5 sm:w-[60%] lg:w-[70%] gap-10'>
                        <div className='sm:w-[60%] lg:w-[40%] pr-10px relative'>
                            <input
                                type="search"
                                name="search"
                                placeholder="Buscar por nombre, email o telefono..."
                                className="w-full p-2 border border-gray-500 rounded-full bg-white"
                                value={filtros.searchTerm}
                                onChange={(e) => setFiltros(prev => ({ ...prev, searchTerm: e.target.value }))}
                            />
                            <FaSearch className="absolute right-4 top-1/3 text-gray-600" />
                        </div>
                        <div className='flex gap-2'>
                            <button
                                className='bg-secondary p-1 rounded-full text-white cursor-pointer hover:bg-secondary hover:transform hover:scale-111 transition-all duration-300 ease-in-out'
                                onClick={() => {
                                    setModalFilters(true)
                                }}>

                                <IoFilterSharp size={23} color='white' />
                            </button>
                            <button
                                className='hidden md:inline text-secondary hover:underline cursor-pointer '
                                onClick={() => {
                                    resetFiltros();
                                    setModalFilters(false);
                                }}>
                                Borrar Filtros
                            </button>
                        </div>
                    </div>
                </div>
                {loading ? (
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            flexDirection: "column",
                            width: "100%",
                            gap: "2vh",
                            height: "100%",
                        }}
                    >
                        <CircularProgress color="secondary" />
                        <h2>Cargando...</h2>
                    </div>
                ) : (
                    <TableGeneric<ClienteResponseDTO>
                        columns={ColumnsTableClientes}
                        setOpenModal={setModalFilters}
                        handleDelete={() => { }}
                    />
                )}
                <div>
                </div>
            </div>
        
            {modalFilters && (
                <div className='fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50'>
                    <div className='relative bg-white p-5 rounded-[20px] shadow-lg w-[90%] sm:w-[65%] lg:w-[30%] flex flex-col'>
                        <button
                            className="absolute top-2 right-3 cursor-pointer font-bold text-gray-500 hover:text-gray-800"
                            onClick={() => {
                                resetFiltros()
                                setModalFilters(false);
                            }}
                        >
                            ✕
                        </button>


                        <h2 className='text-secondary text-base font-bold text-center mb-1'>Filtros</h2>
                        <button
                            onClick={() => setFiltroSeleccionado(prev => ({ ...prev, estado: "TODOS" }))}
                            className={`px-4 py-1 rounded-full transition-all duration-200 w-[50%] mx-auto ${filtroSeleccionado.estado === "TODOS" ? "bg-secondary text-white" : ""}`}
                        >
                            Todos los clientes
                        </button>


                        <div className="border-b border-gray-300 mt-2 mb-2"></div>

                        <h2 className='text-secondary text-base font-bold text-center mb-1'>Estado</h2>
                        <div className='flex justify-around gap-2 mb-2'>
                            <button
                                onClick={() => setFiltroSeleccionado(prev => ({ ...prev, estado: "ACTIVO" }))}
                                className={`px-4 py-1 rounded-full transition-all duration-200 w-[30%] mx-auto ${filtroSeleccionado.estado === "ACTIVO" ? "bg-secondary text-white" : ""}`}
                            >
                                Activo
                            </button>
                            <button
                                onClick={() => setFiltroSeleccionado(prev => ({ ...prev, estado: "INACTIVO" }))}
                                className={`px-4 py-1 rounded-full transition-all duration-200 w-[30%] mx-auto ${filtroSeleccionado.estado === "INACTIVO" ? "bg-secondary text-white" : ""}`}
                            >
                                Inactivo
                            </button>
                        </div>

                        <div className="border-b border-gray-300 mt-2 mb-2"></div>
                        <button
                            className='bg-tertiary text-white mt-2 px-2 py-1 rounded-full w-[30%] mx-auto hover:bg-tertiary/80 transition-all duration-300 ease-in-out'
                            onClick={() => {
                                setFiltros(filtroSeleccionado);
                                setModalFilters(false);
                            }}
                        >
                            Aplicar
                        </button>

                        <button
                            className='inline text-secondary mt-2 px-2 py-1 rounded-full w-[30%] mx-auto cursor-pointer hover:underline transition-all duration-300 ease-in-out'
                            onClick={() => resetFiltros()}
                        >
                            Borrar filtros
                        </button>

                    </div>
                </div>
            )}
        </>
    )
}

export default Clientes