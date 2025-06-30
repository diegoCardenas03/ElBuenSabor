import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { MiPerfilUsuarioLayout } from "../layouts/MiPerfilUsuarioLayout";
import usuarioImg from "../assets/img/usuarioLogeado.jpg";
import { FaEye, FaEyeSlash, FaPen } from "react-icons/fa";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import Swal from "sweetalert2";
import { ClienteDTO } from "../types/Cliente/ClienteDTO";
import { ClienteResponseDTO } from "../types/Cliente/ClienteResponseDTO";

type PerfilForm = {
  nombre: string;
  telefono: string;
  password: string;
  repeatPassword: string;
};

export const MiPerfilUsuarioPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const [clienteResponseDto, setClienteResponseDto] = useState<ClienteResponseDTO | null>(null);
  const { user, isAuthenticated } = useAuth0();
  const isGoogleAccount = user?.sub?.startsWith('google');




  // Datos iniciales para comparar cambios
  const initialValues = useRef<PerfilForm>({
    nombre: "",
    telefono: "",
    password: "",
    repeatPassword: "",
  });

  const { register, handleSubmit, watch, formState: { errors }, setValue, reset } = useForm<PerfilForm>({
    defaultValues: {
      nombre: "",
      telefono: "",
      password: "",
      repeatPassword: "",
    }
  });

  const nombreUsuario = sessionStorage.getItem('user_name') || "";
  const emailUsuario = user?.email || "Sin email";
  const fotoUsuario = user?.picture || usuarioImg;
  const telefonoUsuario = sessionStorage.getItem('user_telefono') || user?.phone_number || "";


  // Cargar datos del usuario al montar el componente
  useEffect(() => {
    if (isAuthenticated && user) {
      setValue("nombre", nombreUsuario);
      setValue("telefono", telefonoUsuario);
      setValue("password", "");
      setValue("repeatPassword", "");
      // Guardar valores iniciales para detectar cambios
      initialValues.current = {
        nombre: nombreUsuario,
        telefono: telefonoUsuario,
        password: "",
        repeatPassword: "",
      };
      reset({
        nombre: nombreUsuario,
        telefono: telefonoUsuario,
        password: "",
        repeatPassword: "",
      });
    }

    const obtenerCliente = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_SERVER_URL}/api/clientes/email/${user?.email}`, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("auth_token")}`,
          },
        });
        if (response) {
          setClienteResponseDto(response.data);
          setValue("telefono", response.data.telefono);
        }
      } catch (error) {
        // console.log(`Error en obtenerIdRolAuth0: ${error}`);
        Swal.fire({
          title: "¡Error!",
          text: "No se pudo obtener la información del cliente.",
          icon: "error",
          confirmButtonText: "Aceptar",
        });
      }
    }
    obtenerCliente();
  }, [isAuthenticated, user, setValue, nombreUsuario, telefonoUsuario, reset]);

  // Detectar si hay cambios en cualquier campo
  const nombre = watch("nombre");
  const telefono = watch("telefono");
  const password = watch("password");
  const repeatPassword = watch("repeatPassword");

  const isDirty =
    nombre !== initialValues.current.nombre ||
    telefono !== initialValues.current.telefono ||
    password.length > 0 ||
    repeatPassword.length > 0;

  //Obtener id del rol auth0

  const obtenerIdRolAuth0Cliente = async () => {
    const rolName = sessionStorage.getItem('user_role');
    // console.log('Rol name: ' + rolName);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_SERVER_URL}/api/admin/roles/nombre/${rolName}`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("auth_token")}`,
        },
      });
      return response.data.auth0RolId as string;
    } catch (error) {
      // console.log(`Error en obtenerIdRolAuth0: ${error}`);
      Swal.fire({
        title: "¡Error!",
        text: "No se pudo obtener el ID del rol.",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
    }
  }


  // Guardar cambios
  const onSubmit = async (data: PerfilForm) => {
    try {
      const auth0RolId = await obtenerIdRolAuth0Cliente();
      // Construir el objeto ClienteDTO

      const clienteDTO: ClienteDTO = {
        nombreCompleto: data.nombre,
        telefono: data.telefono,
        usuario: {
          email: emailUsuario,
          nombreCompleto: data.nombre,
          contrasenia: data.password.length > 0 ? data.password : undefined,
          roles: [auth0RolId!]
        }
      };

      await axios.put(
        `${import.meta.env.VITE_API_SERVER_URL}/api/clientes/update/auth0Id/${user?.sub}`,
        clienteDTO,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("auth_token")}`,
          },
        }
      );

      // Actualizar sessionStorage si cambió el nombre
      if (data.nombre !== initialValues.current.nombre) {
        sessionStorage.setItem("user_name", data.nombre);
      }
      // Actualizar teléfono si lo guardas en sessionStorage
      if (data.telefono !== initialValues.current.telefono) {
        sessionStorage.setItem("user_telefono", data.telefono);
      }

      // Resetear valores iniciales y limpiar campos de contraseña
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
        text: "Datos actualizados correctamente!.",
        icon: "success",
        confirmButtonText: "Aceptar",
      });
    } catch (error) {
      alert("Error al actualizar los datos");
    }
  };

  return (
    <MiPerfilUsuarioLayout>
      <div className="w-full max-w-2xl flex flex-col md:flex-row items-start justify-center gap-8 relative px-2">
        <button className="absolute top-2 right-2 bg-[#d32f2f] hover:bg-[#962020] text-white px-4 py-2 rounded-full font-semibold text-sm cursor-pointer">
          Historial Pedidos
        </button>
        <div className="flex-shrink-0 flex flex-col items-center w-full md:w-auto pt-8">
          <img
            src={fotoUsuario}
            alt="Usuario"
            className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover mb-2"
          />
        </div>
        <form className="flex-1 w-full max-w-xs sm:max-w-md md:max-w-lg flex flex-col gap-2 mt-2 md:mt-0 pt-8 mx-auto" onSubmit={handleSubmit(onSubmit)} >

          {!isGoogleAccount ? (<label className="font-semibold text-base mb-1">Nombre
            <div className="flex items-center">
              <input className="w-full border-b border-black bg-transparent font-bold outline-none py-1"
                {...register("nombre", { required: true })}
                type="text"
                disabled={isGoogleAccount}
              />
              <FaPen className="ml-2 text-[#222] cursor-pointer w-4 h-4" />
            </div>
            {errors.nombre && <span className="text-xs text-red-500">Este campo es requerido</span>}
          </label>) : (<label className="font-semibold text-base mb-1">Nombre
            <div className="flex items-center">
              <input className="w-full border-b border-black bg-transparent font-normal outline-none py-1 cursor-not-allowed"
                {...register("nombre", { required: true })}
                type="text"
                disabled={isGoogleAccount}
                readOnly
              />
            </div>
            {errors.nombre && <span className="text-xs text-red-500">Este campo es requerido</span>}
          </label>)}

          <label className="font-semibold text-base mb-1">Teléfono
            <div className="flex items-center">
              <input
                className="w-full border-b border-black bg-transparent font-bold outline-none py-1"
                placeholder="Por ejemplo: 2616589865"
                {...register("telefono", {
                  required: true,
                  minLength: {
                    value: 10,
                    message: "El teléfono debe tener 10 caracteres"
                  },
                  maxLength: {
                    value: 10,
                    message: "El teléfono no puede tener más de 10 caracteres"
                  }
                })}
                type="text"
              />
              <FaPen className="ml-2 text-[#222] cursor-pointer w-4 h-4" />
            </div>
             <span className="text-xs text-gray-500">Debe contener al menos 10 caracteres</span>
            {errors.telefono && <div> <span className="text-xs text-red-500">Número inválido</span> </div>}
          </label>

          <label className="font-semibold text-base mb-1">Email
            <div className="flex items-center">
              <input
                className="w-full border-b border-black font-normal outline-none py-1 cursor-not-allowed"
                value={emailUsuario}
                type="email"
                disabled
                readOnly
              />
            </div>
          </label>

          {!isGoogleAccount && (<label className="font-semibold text-base mb-1 mt-2">Contraseña
            <div className="flex items-center">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full border-b border-black bg-transparent font-bold outline-none py-1"
                placeholder="********"
                {...register("password", {
                  minLength: {
                    value: 8,
                    message: "Debe tener al menos 8 caracteres"
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
                onClick={() => setShowPassword((v) => !v)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
              <FaPen className="ml-2 text-[#222] cursor-pointer w-4 h-4" />
            </div>
            <span className="text-xs text-gray-500">Debe contener un mínimo de 8 caracteres, una letra mayúscula, una minúscula y un símbolo</span>
            {errors.password && (
              <span className="block text-xs text-red-500 mt-1">
                {errors.password.message || "Contraseña inválida"}
              </span>
            )}
          </label>)}

          {!isGoogleAccount && (<label className="font-semibold text-base mb-1">Repetir contraseña
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
                onClick={() => setShowRepeatPassword((v) => !v)}
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
          </label>)}


          <a href="/MisDirecciones" className="text-[#d32f2f] font-semibold text-sm mt-2 hover:underline" >Editar mis direcciones &gt;</a>
          <button
            type="submit"
            className="w-full sm:w-auto mx-auto mt-6 bg-[#FF9D3A] hover:bg-[#e68a1f] text-black font-bold py-2 px-8 rounded-full text-base shadow cursor-pointer
              disabled:bg-[#FFD59E] disabled:hover:bg-[#FFD59E] disabled:text-black disabled:cursor-not-allowed disabled:opacity-100"
            disabled={!isDirty || !!errors.telefono}
          >Guardar Cambios
          </button>
        </form>
      </div>
    </MiPerfilUsuarioLayout>
  );
};

export default MiPerfilUsuarioPage;