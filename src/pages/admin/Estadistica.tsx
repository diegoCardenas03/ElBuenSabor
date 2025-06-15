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
        <div className="w-4/5 bg-white p-5 rounded-lg shadow-lg">
          <div className="flex justify-center gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium">Desde</label>
              <input
                type="date"
                value={fechaDesde}
                onChange={e => setFechaDesde(e.target.value)}
                className="border rounded px-2 py-1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Hasta</label>
              <input
                type="date"
                value={fechaHasta}
                onChange={e => setFechaHasta(e.target.value)}
                className="border rounded px-2 py-1"
              />
            </div>

          </div>
              <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded shadow flex items-center">
                <PiMicrosoftExcelLogo />
                <span className="ml-2">Exportar a excel</span>     
                </button>
        </div>
      </main>
    </>
  );
}
export { Estadistica };