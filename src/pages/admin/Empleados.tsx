import { useEffect, useState } from "react";
import { AdminHeader } from "../../components/admin/AdminHeader"
import { CircularProgress, Switch } from "@mui/material";
import { TableGeneric } from "../../components/TableGeneric";
import { IoFilterSharp } from "react-icons/io5";
import { FaSearch } from "react-icons/fa";
import { useAppDispatch } from "../../hooks/redux";
import { setDataTable } from "../../hooks/redux/slices/TableReducer";
import Swal from "sweetalert2";
import { EmpleadoResponseDTO } from "../../types/Empleado/EmpleadoResponseDTO";
import { EmpleadosService } from "../../services/EmpleadosService";
import { BiSolidPencil } from "react-icons/bi";
import { ModalEmpleado } from "../../components/modals/ModalEmpleado";
// import { useAuth0 } from "@auth0/auth0-react";

type FiltroState = {
    estado: "TODOS" | "ACTIVO" | "INACTIVO";
    rol: "TODOS" | string;
    searchTerm: string;
};

const Empleados = () => {
    const [empleados, setEmpleados] = useState<EmpleadoResponseDTO[]>([]);
    const [loading, setLoading] = useState<Boolean>(false);
    const [modalFilters, setModalFilters] = useState<Boolean>(false);
    const [filtros, setFiltros] = useState<FiltroState>({ estado: "TODOS", rol: "TODOS", searchTerm: "" });
    const [filtroSeleccionado, setFiltroSeleccionado] = useState<FiltroState>({ estado: "TODOS", rol: "TODOS", searchTerm: "" });
    const resetFiltros = () => { setFiltros({ estado: "TODOS", rol: "TODOS", searchTerm: "" }); setFiltroSeleccionado({ estado: "TODOS", rol: "TODOS", searchTerm: "" }); };
    const empleadosService = new EmpleadosService();
    const dispatch = useAppDispatch();
    const rolesUnicos: string[] = Array.from(
        new Set(
            empleados.flatMap(e => e.usuario.roles?.map(r => r.nombre)),
        )
    );
    const [openModalEmpleado, setOpenModalEmpleado] = useState(false);
    const [empleadoEditar, setEmpleadoEditar] = useState<EmpleadoResponseDTO | null>(null);
    const usuarioActualEmail = sessionStorage.getItem('user_email');



    const ColumnsTableEmpleados = [
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
            render: (empleado: EmpleadoResponseDTO) => empleado.usuario.roles?.map(r => r.nombre).join(', ')
        },
        {
            label: "Activo",
            key: "activo",
            render: (empleado: EmpleadoResponseDTO) =>
                empleado.usuario.email === usuarioActualEmail ? (
                    <span className="text-gray-400">No disponible</span>
                ) : (
                    <Switch
                    
                        checked={empleado.activo}
                        onChange={async () => {
                            try {
                                await empleadosService.updateEstado(empleado.id)
                                getEmpleados();
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
        {
            label: "",
            key: "",
            render: (empleado: EmpleadoResponseDTO) =>
                empleado.usuario.email === usuarioActualEmail ? null : (
                    <button
                        className='rounded cursor-pointer hover:transform hover:scale-111 transition-all duration-300 ease-in-out'
                        onClick={() => handleOpenEditarEmpleado(empleado)}
                    >
                        <BiSolidPencil size={20} />
                    </button>
                ),
        },
    ]

    const filtrarEmpleado = (empleado: EmpleadoResponseDTO[]): EmpleadoResponseDTO[] => {
        let empleadoFiltrados = empleado;

        if (filtros.estado === "ACTIVO") {
            empleadoFiltrados = empleadoFiltrados.filter(e => e.activo === true);
        } else if (filtros.estado === "INACTIVO") {
            empleadoFiltrados = empleadoFiltrados.filter(e => e.activo === false);
        }

        if (filtros.rol !== "TODOS") {
            empleadoFiltrados = empleadoFiltrados.filter(e => e.usuario.roles.some(r => r.nombre === filtros.rol));
        }

        if (filtros.searchTerm.trim() !== "") {
            empleadoFiltrados = empleadoFiltrados.filter(e =>
                e.nombreCompleto.toLowerCase().includes(filtros.searchTerm.trim().toLowerCase()) ||
                e.usuario.email.toLowerCase().includes(filtros.searchTerm.trim().toLowerCase()) ||
                e.telefono.includes(filtros.searchTerm.trim())
            );
        }

 

        return empleadoFiltrados;
    };

    const getEmpleados = async () => {
        try {
            const empleadoData = await empleadosService.getAll();
            const empleadosDTO = empleadoData.map((e) => ({
                id: e.id,
                nombreCompleto: e.nombreCompleto,
                telefono: e.telefono,
                activo: e.activo,
                usuario: e.usuario,
                email: e.usuario.email,
                rol: e.usuario.roles,
                domicilio: e.domicilio,
            }));
            setEmpleados(empleadoData);
            const empleadosFiltrados = filtrarEmpleado(empleadosDTO);
            dispatch(setDataTable(empleadosFiltrados));
        } catch (error) {
            console.error("Error al obtener empleados", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setLoading(true);
        getEmpleados();
    }, [filtros]);

    const handleOpenCrearEmpleado = () => {
        setEmpleadoEditar(null); // Para crear, no hay empleado seleccionado
        setOpenModalEmpleado(true);
    };

    const handleOpenEditarEmpleado = (empleado: EmpleadoResponseDTO) => {
        setEmpleadoEditar(empleado);
        setOpenModalEmpleado(true);
    };

    return (
        <>
            <AdminHeader text="Empleados" />
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
                    <button
                        className="rounded-3xl bg-secondary text-white px-4 py-2 font-primary font-semibold shadow hover:scale-105 transition text-lg cursor-pointer"
                        onClick={handleOpenCrearEmpleado}

                    >
                        + Agregar Empleado
                    </button>
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
                    <TableGeneric<EmpleadoResponseDTO>
                        columns={ColumnsTableEmpleados}
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
                            onClick={() => setFiltroSeleccionado(prev => ({ ...prev, estado: "TODOS", rol: "TODOS" }))}
                            className={`px-4 py-1 rounded-full transition-all duration-200 w-[55%] mx-auto ${filtroSeleccionado.estado === "TODOS" && filtroSeleccionado.rol === "TODOS" ? "bg-secondary text-white" : ""}`}
                        >
                            Todos los empleados
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

                        <h2 className='text-secondary text-base font-bold text-center mb-1'>Rol</h2>
                        <div className='flex flex-wrap gap-3 mb-2 justify-center'>
                            {rolesUnicos.map((rol) => (
                                <button
                                    key={rol}
                                    onClick={() => setFiltroSeleccionado(prev => ({ ...prev, rol }))}
                                    className={`px-4 py-1 rounded-full ... ${filtroSeleccionado.rol === rol ? "bg-secondary text-white" : ""}`}
                                >
                                    {rol.charAt(0) + rol.slice(1).toLowerCase()}
                                </button>
                            ))}
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

            <ModalEmpleado
                open={openModalEmpleado}
                onClose={() => setOpenModalEmpleado(false)}
                getEmpleados={getEmpleados}
                empleado={empleadoEditar}
            />
        </>
    )
}

export default Empleados