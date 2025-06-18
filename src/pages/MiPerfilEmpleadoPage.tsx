import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { AdminHeader } from "../components/admin/AdminHeader";
import usuarioImg from "../assets/img/usuarioLogeado.jpg";
import { FaEye, FaEyeSlash, FaPen } from "react-icons/fa";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import Swal from "sweetalert2";

type PerfilEmpleadoForm = {
  nombre: string;
  telefono: string;
  password: string;
  repeatPassword: string;
};

export const MiPerfilEmpleadoPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const { user, isAuthenticated } = useAuth0();

  // Valores iniciales para comparar cambios
  const initialValues = useRef<PerfilEmpleadoForm>({
    nombre: "",
    telefono: "",
    password: "",
    repeatPassword: "",
  });

  // Obtener datos del usuario logueado
  const nombreEmpleado = sessionStorage.getItem('user_name') || "";
  const emailEmpleado = user?.email || "Sin email";
  const fotoEmpleado = user?.picture || usuarioImg;
  const telefonoEmpleado = sessionStorage.getItem('user_telefono') || user?.phone_number || "";

  const { register, handleSubmit, watch, formState: { errors }, setValue, reset } = useForm<PerfilEmpleadoForm>({
    defaultValues: {
      nombre: "",
      telefono: "",
      password: "",
      repeatPassword: "",
    }
  });

  // Cargar datos al montar
  useEffect(() => {
    if (isAuthenticated && user) {
      setValue("nombre", nombreEmpleado);
      setValue("telefono", telefonoEmpleado);
      setValue("password", "");
      setValue("repeatPassword", "");
      initialValues.current = {
        nombre: nombreEmpleado,
        telefono: telefonoEmpleado,
        password: "",
        repeatPassword: "",
      };
      reset({
        nombre: nombreEmpleado,
        telefono: telefonoEmpleado,
        password: "",
        repeatPassword: "",
      });
    }
  }, [isAuthenticated, user, setValue, nombreEmpleado, telefonoEmpleado, reset]);

  // Detectar cambios
  const nombre = watch("nombre");
  const telefono = watch("telefono");
  const password = watch("password");
  const repeatPassword = watch("repeatPassword");

  const isDirty =
    nombre !== initialValues.current.nombre ||
    telefono !== initialValues.current.telefono ||
    password.length > 0 ||
    repeatPassword.length > 0;

  // Guardar cambios (ajusta según tu backend)
  const onSubmit = async (data: PerfilEmpleadoForm) => {
    try {
      // Aquí deberías armar el DTO y hacer el request a tu backend
      // Ejemplo:
      /*
      await axios.put(
        `${import.meta.env.VITE_API_SERVER_URL}/api/empleados/update/${empleadoId}`,
        { ... },
        { headers: { Authorization: `Bearer ${sessionStorage.getItem("auth_token")}` } }
      );
      */
      // Actualizar sessionStorage si cambió el nombre o teléfono
      if (data.nombre !== initialValues.current.nombre) {
        sessionStorage.setItem("user_name", data.nombre);
      }
      if (data.telefono !== initialValues.current.telefono) {
        sessionStorage.setItem("user_telefono", data.telefono);
      }
      initialValues.current = {
        nombre: data.nombre,
        telefono: data.telefono,
        password: "",
        repeatPassword: "",
      };
      reset({
        nombre: data.nombre,
        telefono: data.telefono,
        password: "",
        repeatPassword: "",
      });
      Swal.fire({
        title: "¡Éxito!",
        text: "Datos actualizados correctamente.",
        icon: "success",
        confirmButtonText: "Aceptar",
      });
    } catch (error) {
      alert("Error al actualizar los datos");
    }
  };

  return (
    <>
      <AdminHeader text="MI PERFIL"/>
      <div className="min-h-screen bg-[#FDF5E6] flex justify-center items-start pt-8 px-4">
        <div className="w-full max-w-4xl flex flex-col md:flex-row items-start justify-center gap-8 relative">
          <div className="flex-shrink-0 flex flex-col items-center w-full md:w-auto pt-8">
            <img 
              src={fotoEmpleado} 
              alt="Empleado" 
              className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover mb-2"
            />
          </div>
          <form 
            onSubmit={handleSubmit(onSubmit)} 
            className="flex-1 w-full max-w-xs sm:max-w-md md:max-w-lg flex flex-col gap-2 mt-2 md:mt-0 pt-8 mx-auto"
          >
            <label className="font-semibold text-base mb-1">Nombre*
              <div className="flex items-center">
                <input
                  type="text"
                  className="w-full border-b border-black bg-transparent font-bold outline-none py-1"
                  {...register("nombre", { required: "Este campo es requerido" })}
                />
                <FaPen className="ml-2 text-[#222] cursor-pointer w-4 h-4" />
              </div>
              {errors.nombre && (
                <span className="text-xs text-red-500">{errors.nombre.message}</span>
              )}
            </label>
            <label className="font-semibold text-base mb-1">Teléfono*
              <div className="flex items-center">
                <input
                  type="text"
                  className="w-full border-b border-black bg-transparent font-bold outline-none py-1"
                  placeholder="2658579568"
                  {...register("telefono", { required: "Este campo es requerido" })}
                />
                <FaPen className="ml-2 text-[#222] cursor-pointer w-4 h-4" />
              </div>
              {errors.telefono && (
                <span className="text-xs text-red-500">{errors.telefono.message}</span>
              )}
            </label>
            <label className="font-semibold text-base mb-1">Email*
              <div className="flex items-center">
                <input
                  type="email"
                  value={emailEmpleado}
                  className="w-full border-b border-black font-normal outline-none py-1 cursor-not-allowed"
                  disabled
                  readOnly
                />
              </div>
            </label>
            <label className="font-semibold text-base mb-1 mt-2">Contraseña*
              <div className="flex items-center">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full border-b border-black bg-transparent font-bold outline-none py-1"
                  placeholder="********"
                  {...register("password", {
                    minLength: {
                      value: 8,
                      message: "Mínimo 8 caracteres"
                    },
                    validate: value =>
                      value.length === 0 ||
                      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/.test(value) ||
                      "Debe contener una mayúscula, una minúscula, un número y un símbolo"
                  })}
                />
                <button
                  type="button"
                  className="ml-2 text-[#222] cursor-pointer"
                  tabIndex={-1}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
                <FaPen className="ml-2 text-[#222] cursor-pointer w-4 h-4" />
              </div>
              <span className="text-xs text-gray-500">Debe contener un mínimo de 8 caracteres, una letra mayúscula, una minúscula y un símbolo</span>
              {errors.password && (
                <span className="block text-xs text-red-500 mt-1">
                  {errors.password.message}
                </span>
              )}
            </label>
            <label className="font-semibold text-base mb-1">Repetir contraseña*
              <div className="flex items-center">
                <input
                  type={showRepeatPassword ? "text" : "password"}
                  className="w-full border-b border-black bg-transparent font-bold outline-none py-1"
                  placeholder="********"
                  {...register("repeatPassword", {
                    validate: value =>
                      password.length === 0 || value === password || "Las contraseñas no coinciden"
                  })}
                />
                <button
                  type="button"
                  className="ml-2 text-[#222] cursor-pointer"
                  tabIndex={-1}
                  onClick={() => setShowRepeatPassword(!showRepeatPassword)}
                >
                  {showRepeatPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
                <FaPen className="ml-2 text-[#222] cursor-pointer w-4 h-4" />
              </div>
              <span className="text-xs text-gray-500">Debe contener un mínimo de 8 caracteres, una letra mayúscula, una minúscula y un símbolo</span>
              {errors.repeatPassword && (
                <span className="block text-xs text-red-500 mt-1">
                  {errors.repeatPassword.message}
                </span>
              )}
            </label>
            <button
              type="submit"
              className="w-full sm:w-auto mx-auto mt-6 bg-[#FF9D3A] hover:bg-[#e68a1f] text-black font-bold py-2 px-8 rounded-full text-base shadow cursor-pointer
                disabled:bg-[#FFD59E] disabled:hover:bg-[#FFD59E] disabled:text-black disabled:cursor-not-allowed disabled:opacity-100"
              disabled={!isDirty}
            >
              Guardar Cambios
            </button>
          </form>
        </div>
      </div>
    </>
  );
};