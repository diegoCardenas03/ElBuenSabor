import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import interceptorApiClient from "../../interceptors/Axios.interceptor";
import { useAuthHandler } from "../../hooks/useAuthHandler";
import { Loader } from "../commons/Loader";

interface ModalUserExtraDataProps {
  clienteId: number;
  onComplete: () => void;
}

export const ModalUserExtraData: React.FC<ModalUserExtraDataProps> = ({
  clienteId,
  onComplete,
}) => {
  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState("");
  const [nombre, setNombre] = useState(""); // ✅ VACÍO POR DEFECTO
  const [loading, setLoading] = useState(false);
  const [clienteData, setClienteData] = useState<any>(null);

  // ✅ Importar función para completar sessionStorage
  const { completeSessionData } = useAuthHandler();

  // Obtener datos actuales del cliente
  useEffect(() => {
    const fetchClienteData = async () => {
      try {
        const response = await interceptorApiClient.get(`/api/clientes/${clienteId}`);
        setClienteData(response.data);

        // Pre-llenar campos si ya existen
        if (response.data.telefono) setTelefono(response.data.telefono);
        if (response.data.direccion) setDireccion(response.data.direccion);

        // ✅ MODIFICADO: NO pre-llenar el nombre, dejarlo vacío
        // Solo si por alguna razón ya tiene nombre completo lo mostramos
        if (response.data.nombreCompleto && response.data.nombreCompleto !== response.data.usuario?.email) {
          setNombre(response.data.nombreCompleto);
        }
        // Si no hay nombre o es igual al email, lo dejamos vacío para que el usuario escriba su nombre real
      } catch (error) {
        console.error("Error obteniendo datos del cliente:", error);
      }
    };

    fetchClienteData();
  }, [clienteId]);

  // Obtener id del rol auth0
  const obtenerIdRolAuth0Cliente = async () => {
    const rolName = sessionStorage.getItem('user_role');
    console.log('Rol name: ' + rolName);
    try {
      const response = await interceptorApiClient.get(`/api/admin/roles/nombre/${rolName}`);
      return response.data.auth0RolId as string;
    } catch (error) {
      console.log(`Error en obtenerIdRolAuth0: ${error}`);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!clienteData) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudieron cargar los datos del cliente.",
      });
      return;
    }

    // ✅ VALIDAR que el nombre no esté vacío
    if (!nombre.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Nombre requerido",
        text: "Por favor, ingresa tu nombre completo.",
      });
      return;
    }

    setLoading(true);

    try {
      const auth0RolId = await obtenerIdRolAuth0Cliente();

      if (!auth0RolId) {
        throw new Error("No se pudo obtener el rol del usuario");
      }

      // ✅ Detectar si es usuario de Google para evitar campos no permitidos
      const isGoogleUser = clienteData.usuario?.connection === "google-oauth2";

      const usuarioDTO: any = {
        email: clienteData.usuario?.email || sessionStorage.getItem('user_email'),
        nombreCompleto: nombre.trim(), // ✅ Usar el nombre del formulario y hacer trim
        roles: [auth0RolId]
      };

      // Solo agregar connection para usuarios no sociales
      if (!isGoogleUser) {
        usuarioDTO.connection = "Username-Password-Authentication";
      }

      // Construir el clienteDTO
      const clienteDTO = {
        nombreCompleto: nombre.trim(), // ✅ Usar el nombre del formulario con trim
        telefono,
        usuario: usuarioDTO
      };

      console.log("Enviando clienteDTO:", clienteDTO);

      const response = await interceptorApiClient.put(`/api/clientes/update/${clienteId}`, clienteDTO);

      // ✅ NUEVO: Completar datos de sessionStorage usando la función del hook
      await completeSessionData({
        nombreCompleto: nombre.trim(),
        telefono: telefono
      });

      console.log("[ModalExtraData] Datos actualizados y sessionStorage completado");

      Swal.fire({
        icon: "success",
        title: "¡Datos guardados!",
        text: "Tus datos fueron registrados correctamente.",
        timer: 1800,
        showConfirmButton: false,
      });

      onComplete();
    } catch (error: any) {
      console.error("Error actualizando cliente:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error?.response?.data?.message || "No se pudo guardar la información.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!clienteData) {
    return (
      <div className="fixed inset-0 z-30 flex items-center justify-center bg-primary">

        <Loader message="Cargando datos..." />

      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-30 flex items-center rounded-xl justify-center bg-primary">
      <section className="py-5 px-6 rounded-xl w-72 sm:w-96 bg-primary m-auto font-primary shadow-xl/30">
        <h2 className="text-lg font-extrabold mb-4 text-center text-secondary">¡Bienvenido!</h2>
        <p className="mb-4 text-tertiary text-center">
          Por favor, completa tus datos para continuar.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Nombre completo"
            className="mb-4 border-b border-secondary outline-none bg-transparent"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
          <input
            type="tel"
            placeholder="Teléfono"
            className="mb-4 border-b border-secondary outline-none bg-transparent"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Dirección"
            className="mb-4 border-b border-secondary outline-none bg-transparent"
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
            required
          />
          <button
            type="submit"
            className="bg-orange-400 hover:bg-orange-500 text-white px-4 py-2 rounded font-semibold mt-2 cursor-pointer"
            disabled={loading}
          >
            {loading ? <Loader message="Guardando..." /> : "Guardar y continuar"}
          </button>
        </form>
      </section>
    </div>
  );
};

export default ModalUserExtraData;