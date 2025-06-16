import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { MiPerfilUsuarioLayout } from "../layouts/MiPerfilUsuarioLayout";
import usuarioImg from "../assets/img/usuarioLogeado.jpg";
import { FaEye, FaEyeSlash, FaPen } from "react-icons/fa";
import { useAuth0 } from "@auth0/auth0-react";

type PerfilForm = {
  nombre: string;
  telefono: string;
  password: string;
  repeatPassword: string;
};

export const MiPerfilUsuarioPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);

  // ✅ CAMBIO: Obtener datos del usuario desde Auth0
  const { user, isAuthenticated } = useAuth0();

  const { register, handleSubmit, watch, formState: { errors, isDirty }, setValue } = useForm<PerfilForm>({
    defaultValues: {
      nombre: "",
      telefono: "",
      password: "",
      repeatPassword: "",
    }
  });

   // ✅ CAMBIO: Usar datos reales del usuario
  const nombreUsuario = user?.name || user?.nickname || user?.given_name || "Usuario";
  const emailUsuario = user?.email || "Sin email";
  const fotoUsuario = user?.picture || usuarioImg;
  const telefonoUsuario = user?.phone_number || "";

  // ✅ NUEVO: Cargar datos del usuario al montar el componente
  useEffect(() => {
    if (isAuthenticated && user) {
      setValue("nombre", nombreUsuario);
      setValue("telefono", telefonoUsuario);
    }
  }, [isAuthenticated, user, setValue, nombreUsuario, telefonoUsuario]);

  const onSubmit = (data: PerfilForm) => {
    console.log("Datos del perfil a guardar:", data);
    // Aquí implementarías la lógica para actualizar el perfil
  };


  return (
    <MiPerfilUsuarioLayout>
      <div className="w-full max-w-2xl flex flex-col md:flex-row items-start justify-center gap-8 relative px-2">
        <button className="absolute top-2 right-2 bg-[#d32f2f] hover:bg-[#962020] text-white px-4 py-2 rounded-full font-semibold text-sm cursor-pointer">
          Historial Pedidos
        </button>
        <div className="flex-shrink-0 flex flex-col items-center w-full md:w-auto pt-8">
         {/* ✅ CAMBIO: Usar foto real del usuario */}
          <img 
            src={fotoUsuario} 
            alt="Usuario" 
            className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover mb-2" 
          />
        </div>
        <form className="flex-1 w-full max-w-xs sm:max-w-md md:max-w-lg flex flex-col gap-2 mt-2 md:mt-0 pt-8 mx-auto" onSubmit={handleSubmit(onSubmit)} >
          <label className="font-semibold text-base mb-1">Nombre
            <div className="flex items-center">
              <input className="w-full border-b border-black bg-transparent font-bold outline-none py-1"
                {...register("nombre", { required: true })}
                type="text"
              />
              <FaPen className="ml-2 text-[#222] cursor-pointer w-4 h-4" />
            </div>
            {errors.nombre && <span className="text-xs text-red-500">Este campo es requerido</span>}
          </label>
          <label className="font-semibold text-base mb-1">Teléfono
            <div className="flex items-center">
              <input
                className="w-full border-b border-black bg-transparent font-bold outline-none py-1"
                {...register("telefono", { required: true })}
                type="text"
              />
              <FaPen className="ml-2 text-[#222] cursor-pointer w-4 h-4" />
            </div>
            {errors.telefono && <span className="text-xs text-red-500">Este campo es requerido</span>}
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
          <label className="font-semibold text-base mb-1 mt-2">Contraseña
            <div className="flex items-center">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full border-b border-black bg-transparent font-bold outline-none py-1"
                {...register("password", {
                  required: true,
                  minLength: 8,
                  validate: value =>
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
          </label>
          <label className="font-semibold text-base mb-1">Repetir contraseña
            <div className="flex items-center">
              <input
                type={showRepeatPassword ? "text" : "password"}
                className="w-full border-b border-black bg-transparent font-bold outline-none py-1"
                {...register("repeatPassword", {
                  required: true,
                  validate: value => value === watch("password") || "Las contraseñas no coinciden"
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
          </label>
          <a href="/MisDirecciones" className="text-[#d32f2f] font-semibold text-sm mt-2 hover:underline" >Editar mis direcciones &gt;</a>
          <button
            type="submit"
            className="w-full sm:w-auto mx-auto mt-6 bg-[#FF9D3A] hover:bg-[#e68a1f] text-black font-bold py-2 px-8 rounded-full text-base shadow cursor-pointer
              disabled:bg-[#FFD59E] disabled:hover:bg-[#FFD59E] disabled:text-black disabled:cursor-not-allowed disabled:opacity-100"
            disabled={!isDirty}
          >Guardar Cambios
          </button>
        </form>
      </div>
    </MiPerfilUsuarioLayout>
  );
};

export default MiPerfilUsuarioPage;