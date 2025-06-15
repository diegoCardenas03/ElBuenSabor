import { use, useEffect, useState } from "react";
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
import { Rol } from "../../types/enums/Rol";
import { BiSolidPencil } from "react-icons/bi";

type FiltroState = {
    estado: "TODOS" | "ACTIVO" | "INACTIVO";
    rol: "TODOS" | "ADMINISTRADOR" | "CAJERO" | "COCINERO" | "DELIVERY";
    searchTerm: string;
};

const Empleados = () => {
    const [loading, setLoading] = useState<Boolean>(false);
    const [modalFilters, setModalFilters] = useState<Boolean>(false);
    const [filtros, setFiltros] = useState<FiltroState>({ estado: "TODOS", rol: "TODOS", searchTerm: "" });
    const [filtroSeleccionado, setFiltroSeleccionado] = useState<FiltroState>({ estado: "TODOS", rol: "TODOS", searchTerm: "" });
    const resetFiltros = () => { setFiltros({ estado: "TODOS", rol: "TODOS", searchTerm: "" }); setFiltroSeleccionado({ estado: "TODOS", rol: "TODOS", searchTerm: "" }); };
    const empleadosService = new EmpleadosService();
    const dispatch = useAppDispatch();
    const [mostrarModal, setMostrarModal] = useState<boolean>(false);
    const [modoEditar, setModoEditar] = useState<boolean>(false);
    const [empleadoEditando, setEmpleadoEditando] = useState<{
        id: number;
        nombreCompleto: string;
        telefono: string;
        usuario: {
            email: string;
            contraseña: string;
            rol: Rol;
        };
        domicilio: {
            calle: string;
            numero: number;
            localidad: string;
            codigoPostal: number;
        };
    }>({
        id: 0,
        nombreCompleto: "",
        telefono: "",
        usuario: {
            email: "",
            contraseña: "",
            rol: Rol.ADMIN || "",
        },
        domicilio: {
            calle: "",
            numero: 0,
            localidad: "",
            codigoPostal: 0,
        }
    });

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
        },
        {
            label: "Activo",
            key: "activo",
            render: (empleado: EmpleadoResponseDTO) => (
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
            render: (empleado: EmpleadoResponseDTO) => (
                <button
                    className='rounded cursor-pointer hover:transform hover:scale-111 transition-all duration-300 ease-in-out'
                    onClick={() => {
                        setEmpleadoEditando({
                            id: empleado.id,
                            nombreCompleto: empleado.nombreCompleto,
                            telefono: empleado.telefono,
                            usuario: {
                                email: empleado.usuario.email,
                                contraseña: "",
                                rol: empleado.usuario.rol,
                            },
                            domicilio: {
                                calle: empleado.domicilio.calle,
                                numero: empleado.domicilio.numero,
                                localidad: empleado.domicilio.localidad,
                                codigoPostal: empleado.domicilio.codigoPostal,
                            }
                        });
                        setMostrarModal(true);
                        setModoEditar(true);
                        setMostrarModal(true);
                    }}
                >
                    <BiSolidPencil size={20} />
                </button>
            ),
        },
    ]

    const filtrarEmpleado = (empleado: EmpleadoResponseDTO[]): EmpleadoResponseDTO[] => {
        let empleadoFiltrados = empleado;

        if (filtros.estado === "ACTIVO") {
            empleadoFiltrados = empleadoFiltrados.filter(c => c.activo === true);
        } else if (filtros.estado === "INACTIVO") {
            empleadoFiltrados = empleadoFiltrados.filter(c => c.activo === false);
        }

        if (filtros.rol === "ADMINISTRADOR") {
            empleadoFiltrados = empleadoFiltrados.filter(c => c.usuario.rol === Rol.ADMIN);
        } else if (filtros.rol === "CAJERO") {
            empleadoFiltrados = empleadoFiltrados.filter(c => c.usuario.rol === Rol.CAJERO);
        } else if (filtros.rol === "COCINERO") {
            empleadoFiltrados = empleadoFiltrados.filter(c => c.usuario.rol === Rol.COCINERO);
        } else if (filtros.rol === "DELIVERY") {
            empleadoFiltrados = empleadoFiltrados.filter(c => c.usuario.rol === Rol.DELIVERY);
        }

        if (filtros.searchTerm.trim() !== "") {
            empleadoFiltrados = empleadoFiltrados.filter(c =>
                c.nombreCompleto.toLowerCase().includes(filtros.searchTerm.trim().toLowerCase()) ||
                c.usuario.email.toLowerCase().includes(filtros.searchTerm.trim().toLowerCase()) ||
                c.telefono.includes(filtros.searchTerm.trim())
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
                rol: e.usuario.rol,
                domicilio: e.domicilio,
            }));
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

    const handleGuardar = async () => {
        try {
            if (!empleadoEditando) {
                console.error("No hay datos de empleado para guardar.");
                return;
            }
            if (modoEditar && empleadoEditando?.id) {
                await empleadosService.put(empleadoEditando.id, empleadoEditando);
            } else {
                await empleadosService.post(empleadoEditando);
            }
            setMostrarModal(false);
            setModoEditar(false);
            getEmpleados();
        } catch (error: any) {
            console.error("Error al guardar empleados", error);
        }
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
                        onClick={() => setMostrarModal(true)}
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

            {mostrarModal && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-primary p-6 rounded-lg shadow-lg w-[350px] md:w-[450px] relative flex flex-col justify-center items-center">
                        <button
                            className="cursor-pointer absolute top-2 right-2 text-gray-500 hover:text-gray-800"
                            onClick={() => {
                                setMostrarModal(false);
                                setEmpleadoEditando({
                                    id: 0,
                                    nombreCompleto: "",
                                    telefono: "",
                                    usuario: {
                                        email: "",
                                        contraseña: "",
                                        rol: Rol.ADMIN || "",
                                    },
                                    domicilio: {
                                        calle: "",
                                        numero: 0,
                                        localidad: "",
                                        codigoPostal: 0,
                                    }
                                })
                            }}
                        >
                            ✕
                        </button>
                        <h2 className="items-center text-secondary font-primary font-bold pb-4 text-[20px]">
                            {modoEditar ? 'Editar dirección' : 'Agregar nueva dirección'}
                        </h2>

                        <input
                            type="text"
                            placeholder="Nombre"
                            className="bg-white w-sm border-none rounded-[50px] p-2 mb-4"
                            value={empleadoEditando.nombreCompleto}
                            onChange={e => setEmpleadoEditando({ ...empleadoEditando, nombreCompleto: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Teléfono"
                            className="bg-white w-sm border-none rounded-[50px] p-2 mb-4"
                            value={empleadoEditando.telefono}
                            onChange={e => setEmpleadoEditando({ ...empleadoEditando, telefono: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Email"
                            className="bg-white w-sm border-none rounded-[50px] p-2 mb-4"
                            value={empleadoEditando.usuario.email}
                            onChange={e => setEmpleadoEditando({ ...empleadoEditando, usuario: { ...empleadoEditando.usuario, email: e.target.value } })}
                        />
                        <select
                            className="bg-white w-sm border-none rounded-[50px] p-2 mb-4"
                            value={modoEditar ? empleadoEditando.usuario.rol : ""}
                            onChange={e =>
                                setEmpleadoEditando({
                                    ...empleadoEditando,
                                    usuario: { ...empleadoEditando.usuario, rol: e.target.value as Rol }
                                })
                            }
                        >
                            <option value="">Seleccione un rol</option>
                            <option value="ADMIN">Administrador</option>
                            <option value="COCINERO">Cocinero</option>
                            <option value="DELIVERY">Delivery</option>
                            <option value="CAJERO">Cajero</option>
                        </select>

                        <div>
                            <p className="pl-2">Domicilio:</p>
                            <div className="grid grid-cols-2 gap-1">
                                <input
                                    type="text"
                                    placeholder="Calle"
                                    className="bg-white w-[100%] border-none rounded-[50px] p-2 mb-4"
                                    value={empleadoEditando.domicilio.calle}
                                    onChange={e => setEmpleadoEditando({ ...empleadoEditando, domicilio: { ...empleadoEditando.domicilio, calle: e.target.value } })}
                                />
                                <input
                                    type="number"
                                    placeholder="Numero"
                                    className="bg-white w-[100%] border-none rounded-[50px] p-2 mb-4"
                                    value={empleadoEditando.domicilio.numero === 0 ? "" : empleadoEditando.domicilio.numero}
                                    onChange={e => setEmpleadoEditando({ ...empleadoEditando, domicilio: { ...empleadoEditando.domicilio, numero: e.target.value === "" ? 0 : parseInt(e.target.value, 10), } })}
                                />
                                <input
                                    type="text"
                                    placeholder="Localidad"
                                    className="bg-white w-[100%] border-none rounded-[50px] p-2 mb-4"
                                    value={empleadoEditando.domicilio.localidad}
                                    onChange={e => setEmpleadoEditando({ ...empleadoEditando, domicilio: { ...empleadoEditando.domicilio, localidad: e.target.value } })}
                                />
                                <input
                                    type="number"
                                    placeholder="Codigo postal"
                                    className="bg-white w-[100%] border-none rounded-[50px] p-2 mb-4"
                                    value={empleadoEditando.domicilio.codigoPostal === 0 ? "" : empleadoEditando.domicilio.codigoPostal}
                                    onChange={e => setEmpleadoEditando({ ...empleadoEditando, domicilio: { ...empleadoEditando.domicilio, codigoPostal: e.target.value === "" ? 0 : parseInt(e.target.value, 10), } })}
                                />
                            </div>
                        </div>
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
                            className={`px-4 py-1 rounded-full transition-all duration-200 w-[50%] mx-auto ${filtroSeleccionado.estado === "TODOS" && filtroSeleccionado.rol === "TODOS" ? "bg-secondary text-white" : ""}`}
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

                        <h2 className='text-secondary text-base font-bold text-center mb-1'>Rol</h2>
                        <div className='flex justify-around gap-2 mb-2'>
                            <button
                                onClick={() => setFiltroSeleccionado(prev => ({ ...prev, rol: "ADMINISTRADOR" }))}
                                className={`px-4 py-1 rounded-full transition-all duration-200 w-[40%] mx-auto ${filtroSeleccionado.rol === "ADMINISTRADOR" ? "bg-secondary text-white" : ""}`}
                            >
                                Administrador
                            </button>
                            <button
                                onClick={() => setFiltroSeleccionado(prev => ({ ...prev, rol: "CAJERO" }))}
                                className={`px-4 py-1 rounded-full transition-all duration-200 w-[30%] mx-auto ${filtroSeleccionado.rol === "CAJERO" ? "bg-secondary text-white" : ""}`}
                            >
                                Cajero
                            </button>
                        </div>
                        <div className='flex justify-around gap-2 mb-2'>
                            <button
                                onClick={() => setFiltroSeleccionado(prev => ({ ...prev, rol: "COCINERO" }))}
                                className={`px-4 py-1 rounded-full transition-all duration-200 w-[30%] mx-auto ${filtroSeleccionado.rol === "COCINERO" ? "bg-secondary text-white" : ""}`}
                            >
                                Cocinero
                            </button>
                            <button
                                onClick={() => setFiltroSeleccionado(prev => ({ ...prev, rol: "DELIVERY" }))}
                                className={`px-4 py-1 rounded-full transition-all duration-200 w-[30%] mx-auto ${filtroSeleccionado.rol === "DELIVERY" ? "bg-secondary text-white" : ""}`}
                            >
                                Delivery
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

export default Empleados