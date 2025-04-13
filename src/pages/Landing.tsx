import React from "react";
import pizza from "../assets/img/pizza-landing.png";
import BuenSaborLogo from "../assets/img/BuenSaborLogo.png";

const Landing = () => {
  return (
    <div className="min-h-screen bg-[#FFF4E0] relative overflow-hidden font-sans">
      {/* Círculo rojo de fondo */}
<div className="absolute bg-[#BD1E22] w-[1500px] h-[1500px] rounded-full top-[-700px] right-[-500px] z-0"></div>


      {/* Contenido principal en capa superior */}
      <div className="relative z-10">
        {/* Header */}
        <header className="flex justify-between items-center p-6">
          <div>
            <img src={BuenSaborLogo} alt="Logo" className="w-16" />
          </div>
          <div className="flex items-center gap-4 text-[#FFF4E0] font-bold text-sm">
            <span>GERONIMO</span>
            <span className="text-xl">|</span>
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1 5h12l-1-5M9 21a2 2 0 100-4 2 2 0 000 4zm8 0a2 2 0 100-4 2 2 0 000 4z"
              />
            </svg>
          </div>
        </header>

        {/* Main */}
        <main className="flex flex-col md:flex-row items-center justify-start px-6 md:px-16 pt-4 pb-8">

          {/* Imagen pizza */}
          <div className="w-full md:w-1/2 flex justify-center">
            <img src={pizza} alt="Pizza" className="w-[30vh] md:w-[80vh]" />
          </div>

          {/* Texto derecho */}
          <div className="w-full md:w-1/2 flex flex-col items-start -translate-y-6 md:-translate-y-40 gap-4 md:gap-6 pl-4 md:pl-40">
          <h1 className="text-[#FF9D3A] text-[60px] md:text-[150px] font-(family-name:--font-tertiary) leading-none uppercase">
              El Buen <br /> Sabor
            </h1>

            {/* Botón */}
            <div className="mt-6 self-center">
              <button className="bg-[#FFF4E0] text-black px-15 py-2 font-(family-name:--font-primary) rounded-full font-semibold shadow hover:scale-105 transition text-lg">
               Ver el menú completo
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Landing;
