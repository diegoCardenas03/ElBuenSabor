import { Footer } from "../components/commons/Footer";
import { Header } from "../components/commons/Header";

interface MiPerfilUsuarioLayoutProps {
  children: React.ReactNode;
}

export const MiPerfilUsuarioLayout: React.FC<MiPerfilUsuarioLayoutProps> = ({ children }) => {
  return (
    <div className="bg-[#FFF4E0] min-h-screen flex flex-col relative">
      <Header />
      <main className="pt-20 flex-1 flex flex-col items-center justify-center py-8">
        <h1 className="font-tertiary text-4xl font-bowlby-one-sc text-center mb-6 mt-2">MI PERFIL</h1>
        <div className="w-full flex flex-col items-center">
        {children}
        </div>
      </main>
      {/* Imagen pizza más abajo, alineada con el botón */}
      <img
        src={"src/assets/pizza-roja.png"}
        alt="Pizza"
        className="hidden md:block absolute right-2 md:right-8 top-[80%] md:top-[68%] w-28 md:w-48 h-auto pointer-events-none select-none"
        style={{ zIndex: 1 }}
      />
      <Footer />
    </div>
  );
};