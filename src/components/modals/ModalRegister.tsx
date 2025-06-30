// import { useEffect, useState, FormEvent, ChangeEvent } from "react";
// import iconFacebook from '../../assets/icons/facebook.svg';
// import iconGoogle from '../../assets/icons/iconGoogle.svg';
// import { FaEye, FaEyeSlash } from "react-icons/fa";
// import { useAuthHandler } from "../../hooks/useAuthHandler";
// import { useAuth0 } from "@auth0/auth0-react";
// import { Loader } from "../commons/Loader";
// import Swal from 'sweetalert2';

// interface ModalRegisterProps {
//   onClose?: () => void;
//   onSwitchToLogin?: () => void;
// }

// type RegisterFormData = {
//   nombreCompleto: string;
//   telefono: string;
//   email: string;
//   password: string;
//   confirmPassword: string;
// };

// const ModalRegister: React.FC<ModalRegisterProps> = ({ onClose, onSwitchToLogin }) => {
//   const [formData, setFormData] = useState<RegisterFormData>({
//     nombreCompleto: '',
//     telefono: '',
//     email: '',
//     password: '',
//     confirmPassword: ''
//   });

//   const [verContrasenia, setVerContrasenia] = useState<boolean>(false);
//   const [verConfirmContrasenia, setVerConfirmContrasenia] = useState<boolean>(false);
//   const [isGoogleLoading, setIsGoogleLoading] = useState<boolean>(false);
//   const [isTraditionalLoading, setIsTraditionalLoading] = useState<boolean>(false);

//   const { loginWithPopup, isAuthenticated } = useAuth0();
  
//   // ✅ USAR FUNCIONES CENTRALIZADAS
//   const { authStatus, registerTraditional } = useAuthHandler();

//   useEffect(() => {
//     if (isAuthenticated && authStatus === 'completed') {
//       onClose?.();
//     }
//   }, [isAuthenticated, authStatus, onClose]);

//   const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const verPassword = (): void => {
//     setVerContrasenia(!verContrasenia);
//   };

//   const verConfirmPassword = (): void => {
//     setVerConfirmContrasenia(!verConfirmContrasenia);
//   };

//   // ✅ REGISTRO TRADICIONAL SIMPLIFICADO
//   const handleTraditionalRegister = async (e: FormEvent) => {
//     e.preventDefault();

//     // Validaciones
//     if (formData.password !== formData.confirmPassword) {
//       Swal.fire('Error', 'Las contraseñas no coinciden', 'error');
//       return;
//     }

//     if (formData.password.length < 6) {
//       Swal.fire('Error', 'La contraseña debe tener al menos 6 caracteres', 'error');
//       return;
//     }

//     setIsTraditionalLoading(true);

//     try {
//       // ✅ USAR FUNCIÓN CENTRALIZADA
//       const result = await registerTraditional({
//         nombreCompleto: formData.nombreCompleto,
//         telefono: formData.telefono,
//         email: formData.email,
//         password: formData.password
//       });

//       Swal.fire({
//         icon: 'success',
//         title: '¡Registro y login exitoso!',
//         text: `¡Bienvenido ${formData.nombreCompleto}!`,
//         timer: 2000,
//         showConfirmButton: false
//       });

//       onClose?.();

//     } catch (error: any) {
//       console.error('Error en registro:', error);
//       Swal.fire({
//         icon: 'error',
//         title: 'Error en el registro',
//         text: error?.response?.data?.message || 'No se pudo crear la cuenta. Intenta nuevamente.'
//       });
//     } finally {
//       setIsTraditionalLoading(false);
//     }
//   };

//   // Registro con Google
//   const handleGoogleLogin = async () => {
//     setIsGoogleLoading(true);
//     try {
//       await loginWithPopup({
//         authorizationParams: {
//           connection: 'google-oauth2',
//           prompt: 'select_account'
//         }
//       });
//     } catch (error) {
//       console.error('Error en login con Google:', error);
//     } finally {
//       setIsGoogleLoading(false);
//     }
//   };

//   return (
//     <>
//       <section className="py-3 pb-0 rounded-xl w-60 h-90 bg-primary m-auto sm:w-80 sm:px-2 sm:py-5 font-primary md:w-90 md:h-100">
//         <div className="flex justify-between items-center mb-3">
//           <div>
//             <h2 className="text-2xl font-extrabold text-secondary sm:text-3xl">Registrate</h2>
//             <p className="text-tertiary">¡Vamos y crea una cuenta!</p>
//           </div>
//         </div>

//         <form onSubmit={handleTraditionalRegister} className="flex flex-col">
//           <label className="text-secondary text-xs">Nombre Completo</label>
//           <input
//             type="text"
//             name="nombreCompleto"
//             value={formData.nombreCompleto}
//             onChange={handleInputChange}
//             placeholder="Nombre Completo..."
//             className="mb-4 border-b border-secondary outline-none bg-transparent"
//             required
//           />

//           <label className="text-secondary text-xs">Teléfono</label>
//           <input
//             type="tel"
//             name="telefono"
//             value={formData.telefono}
//             onChange={handleInputChange}
//             placeholder="Teléfono..."
//             className="mb-4 border-b border-secondary outline-none bg-transparent"
//             required
//           />

//           <label className="text-secondary text-xs">Email</label>
//           <input
//             type="email"
//             name="email"
//             value={formData.email}
//             onChange={handleInputChange}
//             placeholder="Correo..."
//             className="mb-4 border-b border-secondary outline-none bg-transparent"
//             required
//           />

//           <label className="text-secondary text-xs">Contraseña</label>
//           <div className="relative mb-4">
//             <input
//               type={verContrasenia ? "text" : "password"}
//               name="password"
//               value={formData.password}
//               onChange={handleInputChange}
//               placeholder="Contraseña..."
//               className="w-full border-b border-secondary outline-none bg-transparent pr-10"
//               required
//             />
//             <div className='absolute top-1/2 right-2 transform -translate-y-1/2 cursor-pointer'>
//               {verContrasenia ? (
//                 <FaEye className="text-secondary" onClick={verPassword} />
//               ) : (
//                 <FaEyeSlash className='text-secondary' onClick={verPassword} />
//               )}
//             </div>
//           </div>

//           <label className="text-secondary text-xs">Repetir Contraseña</label>
//           <div className="relative mb-4">
//             <input
//               type={verConfirmContrasenia ? "text" : "password"}
//               name="confirmPassword"
//               value={formData.confirmPassword}
//               onChange={handleInputChange}
//               placeholder="Repetir Contraseña..."
//               className="w-full border-b border-secondary outline-none bg-transparent pr-10"
//               required
//             />
//             <div className='absolute top-1/2 right-2 transform -translate-y-1/2 cursor-pointer'>
//               {verConfirmContrasenia ? (
//                 <FaEye className="text-secondary" onClick={verConfirmPassword} />
//               ) : (
//                 <FaEyeSlash className='text-secondary' onClick={verConfirmPassword} />
//               )}
//             </div>
//           </div>

//           <button
//             type="submit"
//             disabled={isTraditionalLoading}
//             className="mx-auto mb-2 cursor-pointer bg-secondary text-white w-50 h-10 rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50"
//           >
//             {isTraditionalLoading ? <Loader /> : 'Registrarse'}
//           </button>
//         </form>

//         <p className="font-tertiary text-center text-3xl mb-2">O</p>

//         {/* Contenedor para centrar los botones */}
//         <div className="flex flex-col gap-2 items-center">
//           {/* Botón Facebook */}
//           <button className="cursor-pointer flex items-center justify-center gap-2 bg-[#1877F2] hover:bg-[#166FE5] text-white font-medium py-1 px-3 w-full max-w-xs rounded-md shadow-md">
//             <img src={iconFacebook} alt="Facebook" className="w-4 h-4" />
//             Registrarse con Facebook
//           </button>

//           {/* Botón Google */}
//           <button
//             type="button"
//             onClick={handleGoogleLogin}
//             disabled={isGoogleLoading || authStatus === 'checking'}
//             className="cursor-pointer flex items-center justify-center gap-2 border border-gray-300 bg-white hover:bg-gray-100 text-gray-600 font-medium py-1 px-3 w-full max-w-xs rounded-md shadow-md"
//           >
//             <img src={iconGoogle} alt="Google" className="w-4 h-4" />
//             {isGoogleLoading || authStatus === 'checking' ? <Loader /> : 'Registrarse con Google'}
//           </button>
//         </div>

//         <p onClick={onSwitchToLogin} className='mt-4 text-secondary text-xs text-center cursor-pointer hover:underline pb-5'>
//           ¿Ya tenés cuenta? Iniciá sesión
//         </p>
//       </section>
//     </>
//   );
// };

// export default ModalRegister;