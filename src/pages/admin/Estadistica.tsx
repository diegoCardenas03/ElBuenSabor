import { AdminHeader } from "../../components/admin/AdminHeader";
import { useState } from "react";
import { PiMicrosoftExcelLogo } from "react-icons/pi";

const comidasEjemplo = [
  "Pizza Margarita",
  "Empanadas de Carne",
  "Hamburguesa Completa",
  "Milanesa Napolitana",
  "Ensalada César"
];

const Estadistica = () => {
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");

  return (
    <>
      <AdminHeader text="Estadísticas" />
      <main className="flex flex-col items-center w-full m-auto pt-10 min-h-screen pb-20 bg-primary font-primary">
        <div className="flex justify-center gap-4 mb-4 w-4/5">
          <div>
            <label className="block text-sm font-medium">Desde</label>
            <input
              type="date"
              value={fechaDesde}
              onChange={e => setFechaDesde(e.target.value)}
              className="border rounded px-2 py-1 bg-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Hasta</label>
            <input
              type="date"
              value={fechaHasta}
              onChange={e => setFechaHasta(e.target.value)}
              className="border rounded px-2 py-1 bg-white"
            />
          </div>
          <button className="cursor-pointer bg-tertiary hover:bg-[#ff9c3ac2] text-dark font-black px-4 py-2 rounded shadow flex items-center">
            <span className="ml-2 mr-4">Exportar a excel</span>
            <PiMicrosoftExcelLogo size={25} />
          </button>
        </div>

        <div className="flex items-center py-2 rounded-lg w-full px-20 ">
          {/* COMIDAS MAS PEDIDAS */}
          <div className="flex flex-col items-center w-4/10 bg-white px-2 py-3 shadow-lg rounded-2xl">
            <h4 className="text-secondary font-black text-md">Top 5</h4>
            <span className="text-secondary font-black text-md mb-2">Comidas más Pedidas</span>
            <ol className="w-full flex flex-col gap-2 list-decimal list-inside marker:text-tertiary">
              {comidasEjemplo.map((comida, idx) => (
                <li key={idx} className="border border-tertiary pl-3">
                  {comida}
                </li>
              ))}
            </ol>
            <button className="cursor-pointer font-semibold bg-tertiary mt-5 rounded-2xl px-4 py-1 ">Ver más</button>
          </div>
          <div className="flex w-3/5 ">
            {/* Aquí puedes agregar otros datos estadísticos */}
            <div className="flex flex-col items-center w-full justify-between gap-5">
              <div className="flex items-center justify-around w-full">
                <div className="h-40 shadow-md gap-4 w-40 bg-white flex flex-col items-center justify-center rounded-3xl px-3">
                  <span className="text-lg text-secondary font-bold">Pedidos</span>
                  <h3 className="font-bold px-2 text-4xl">$150</h3>
                </div>
                <div className="h-40 shadow-md gap-4 w-40 bg-white flex flex-col items-center justify-center rounded-3xl px-3">
                  <span className="text-lg text-secondary font-bold">Ganancias</span>
                  <h3 className="font-bold text-3xl">$120000</h3>
                </div>
              </div>
              <div className="h-30 flex flex-col items-center justify-center bg-white shadow-md w-85">
                <h3 className="text-lg text-secondary font-bold">Ingresos y Egresos</h3>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export { Estadistica };
