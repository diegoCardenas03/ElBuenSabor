import { useState } from "react";
import { useForm } from "react-hook-form";
import { AdminHeader } from "../components/admin/AdminHeader";
import usuarioImg from "../assets/img/usuarioLogeado.jpg";
import { FaEye, FaEyeSlash, FaPen } from "react-icons/fa";

type PerfilEmpleadoForm = {
  nombre: string;
  telefono: string;
  password: string;
  repeatPassword: string;
};

export const MiPerfilEmpleadoPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);

  const { register, handleSubmit, watch, formState: { errors, isDirty } } = useForm<PerfilEmpleadoForm>({
    defaultValues: {
      nombre: "Geronimo Benavides",
      telefono: "+5492614360505",
      password: "password123",
      repeatPassword: "password123",
    }
  });

  const email = "tengo3prop@gmail.com";

  const onSubmit = (data: PerfilEmpleadoForm) => {
    console.log(data);
  };

  return (
    <>
      <AdminHeader text="MI PERFIL"/>
      
      {/* Fondo y contenedor principal */}
      <div className="min-h-screen bg-[#FDF5E6] flex justify-center items-start pt-8 px-4">
        <div className="w-full max-w-4xl flex flex-col md:flex-row items-start justify-center gap-8 relative">
          {/* Imagen de perfil a la izquierda */}
          <div className="flex-shrink-0 flex flex-col items-center w-full md:w-auto pt-8">
            <img 
              src={usuarioImg} 
              alt="Empleado" 
              className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover mb-2"
            />
          </div>

          {/* Formulario más ancho */}
          <form 
            onSubmit={handleSubmit(onSubmit)} 
            className="flex-1 w-full max-w-xs sm:max-w-md md:max-w-lg flex flex-col gap-2 mt-2 md:mt-0 pt-8 mx-auto"
          >
            {/* Nombre */}
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

            {/* Teléfono */}
            <label className="font-semibold text-base mb-1">Teléfono*
              <div className="flex items-center">
                <input
                  type="text"
                  className="w-full border-b border-black bg-transparent font-bold outline-none py-1"
                  {...register("telefono", { required: "Este campo es requerido" })}
                />
                <FaPen className="ml-2 text-[#222] cursor-pointer w-4 h-4" />
              </div>
              {errors.telefono && (
                <span className="text-xs text-red-500">{errors.telefono.message}</span>
              )}
            </label>

            {/* Email */}
            <label className="font-semibold text-base mb-1">Email*
              <div className="flex items-center">
                <input
                  type="email"
                  value={email}
                  className="w-full border-b border-black font-normal outline-none py-1 cursor-not-allowed"
                  disabled
                  readOnly
                />
              </div>
            </label>

            {/* Contraseña */}
            <label className="font-semibold text-base mb-1 mt-2">Contraseña*
              <div className="flex items-center">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full border-b border-black bg-transparent font-bold outline-none py-1"
                  {...register("password", {
                    required: "Este campo es requerido",
                    minLength: {
                      value: 8,
                      message: "Mínimo 8 caracteres"
                    },
                    validate: value =>
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

            {/* Repetir contraseña */}
            <label className="font-semibold text-base mb-1">Repetir contraseña*
              <div className="flex items-center">
                <input
                  type={showRepeatPassword ? "text" : "password"}
                  className="w-full border-b border-black bg-transparent font-bold outline-none py-1"
                  {...register("repeatPassword", {
                    required: "Este campo es requerido",
                    validate: value => value === watch("password") || "Las contraseñas no coinciden"
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

            {/* Botón Guardar */}
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