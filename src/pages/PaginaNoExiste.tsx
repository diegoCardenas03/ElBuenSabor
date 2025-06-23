import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/el_buen_sabor_logo.png";

export const PaginaNoExiste = () => {
    const navigate = useNavigate();
    return (
        <div
            className="min-h-screen flex flex-col"
            style={{ backgroundColor: "var(--color-primary)" }}
        >
            {/* Header solo con el logo */}
            <header className="w-full flex justify-center items-center py-4">
                <img src={logo} alt="Logo El Buen Sabor" className="h-20 w-auto" />
            </header>

            {/* Contenido principal */}
            <main className="flex flex-1 flex-col items-center ">
                <div className="flex flex-col items-center mt-30 ">
                    <h1 className="text-3xl font-bold mb-8 text-gray-800 text-center">
                        Página no encontrada
                    </h1>
                    <Link to="/">
                        <button
                            className="px-6 py-3 rounded-3xl text-black text-[1em] font-semibold shadow cursor-pointer"
                            style={{ backgroundColor: "var(--color-tertiary)" }}
                            onClick={() => navigate('/')}
                        >
                            Volver a la página principal
                        </button>
                    </Link>
                </div>
            </main>
        </div>
    );
};