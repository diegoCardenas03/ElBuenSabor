import { AdminHeader } from "../../components/admin/AdminHeader";
import { useState } from "react";
import { PiMicrosoftExcelLogo } from "react-icons/pi";
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
            <span className="text-secondary font-black text-md mb-2">Comidas mas Pedidos</span>
            <ol className="w-full flex flex-col gap-2 list-decimal list-inside marker:text-tertiary">
              <li className="border border-tertiary pl-3">Pizza Margarita</li>
              <li className="border border-tertiary pl-3">Pizza Margarita</li>
              <li className="border border-tertiary pl-3">Pizza Margarita</li>
              <li className="border border-tertiary pl-3">Pizza Margarita</li>
              <li className="border border-tertiary pl-3">Pizza Margarita</li>
            </ol>

            <button className="cursor-pointer font-semibold bg-tertiary mt-5 rounded-2xl px-4 py-1 ">Ver mas</button>
          </div>

          <div className="flex w-3/5 bg-white">

          </div>



        </div>
      </main>
    </>
  );
}
export { Estadistica };