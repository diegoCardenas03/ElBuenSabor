import React from "react";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";

interface MiPerfilUsuarioLayoutProps {
  children: React.ReactNode;
}

export const MiPerfilUsuarioLayout: React.FC<MiPerfilUsuarioLayoutProps> = ({ children }) => {
  return (
    <div className="bg-[#FFF4E0] min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center py-8">
        <h1 className="font-tertiary text-4xl font-bowlby-one-sc text-center mb-6 mt-2">MI PERFIL</h1>
        {children}
      </main>
      <Footer />
    </div>
  );
};