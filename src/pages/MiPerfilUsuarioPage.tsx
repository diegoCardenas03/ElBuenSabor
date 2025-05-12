import React from "react";
import { useForm } from "react-hook-form";
import { MiPerfilUsuarioLayout } from "../layouts/MiPerfilUsuarioLayout";
import usuarioImg from "../assets/img/usuarioLogeado.jpg";
import { FaEye, FaEyeSlash, FaPen } from "react-icons/fa";

type PerfilForm = {
  nombre: string;
  telefono: string;
  password: string;
  repeatPassword: string;
};

export const MiPerfilUsuarioPage: React.FC = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = React.useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<PerfilForm>({
    defaultValues: {
      nombre: "nOOO La Politzia noOooo",
      telefono: "+5492614360505",
      password: "queso",
      repeatPassword: "queso",
    }
  });

  const email = "tengo3prop@gmail.com";

  const onSubmit = (data: PerfilForm) => {
    // Aquí tu lógica de guardado
    console.log(data);
  };

  return (
    <MiPerfilUsuarioLayout>
      <div className="w-full max-w-2xl flex flex-col md:flex-row items-start justify-center gap-8 relative">
        <button className="absolute top-0 right-0 bg-[#d32f2f] hover:bg-[#962020] text-white px-4 py-2 rounded-full font-semibold text-sm cursor-pointer">
          Historial Pedidos
        </button>
        <div className="flex-shrink-0 flex flex-col items-center w-full md:w-auto pt-8">
          <img src={usuarioImg} alt="Usuario" className="w-32 h-32 rounded-full object-cover mb-2" />
        </div>
        <form
          className="flex-1 w-full flex flex-col gap-2 mt-2 md:mt-0 pt-8"
          onSubmit={handleSubmit(onSubmit)}
        >
          <label className="font-semibold text-base mb-1">
            Nombre
            <div className="flex items-center">
              <input
                className="w-full border-b border-black bg-transparent font-bold outline-none py-1"
                {...register("nombre", { required: true })}
                type="text"
              />
              <FaPen className="ml-2 text-[#222] cursor-pointer w-4 h-4" />
            </div>
            {errors.nombre && <span className="text-xs text-red-500">Este campo es requerido</span>}
          </label>
          <label className="font-semibold text-base mb-1">
            Teléfono
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
          <label className="font-semibold text-base mb-1">
            Email
            <div className="flex items-center">
              <input
                className="w-full border-b border-black font-normal outline-none py-1 cursor-not-allowed"
                value={email}
                type="email"
                disabled
                readOnly
              />
            </div>
          </label>
          <label className="font-semibold text-base mb-1 mt-2">
            Contraseña
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
            <span className="text-xs text-gray-500">
              Debe contener un mínimo de 8 caracteres, una letra mayúscula, una minúscula y un símbolo
            </span>
            {errors.password && (
              <span className="block text-xs text-red-500 mt-1">
                {errors.password.message || "Contraseña inválida"}
              </span>
            )}
          </label>
          <label className="font-semibold text-base mb-1">
            Repetir contraseña
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
            <span className="text-xs text-gray-500">
              Debe contener un mínimo de 8 caracteres, una letra mayúscula, una minúscula y un símbolo
            </span>
            {errors.repeatPassword && (
              <span className="block text-xs text-red-500 mt-1">
                {errors.repeatPassword.message}
              </span>
            )}
          </label>
          <a
            href="/MisDirecciones"
            className="text-[#d32f2f] font-semibold text-sm mt-2 hover:underline"
          >
            Editar mis direcciones &gt;
          </a>
          <button
            type="submit"
            className="mx-auto mt-6 bg-[#FF9D3A] hover:bg-[#e68a1f] text-black font-bold py-2 px-8 rounded-full text-base shadow cursor-pointer"
          >
            Guardar Cambios
          </button>
        </form>
      </div>
    </MiPerfilUsuarioLayout>
  );
};

export default MiPerfilUsuarioPage;