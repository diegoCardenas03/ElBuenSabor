import { ChangeEvent } from "react";
import { FiSearch } from "react-icons/fi";
import { Link } from "react-router-dom"; // <-- IMPORTANTE

export type ClienteTabla = {
  nombre: string;
  cantidad: number;
  importe: number;
};

type ClientesTableProps = {
  clientes: ClienteTabla[];
  filtroNombre: string;
  setFiltroNombre: (v: string) => void;
  criterioOrden: "importe" | "cantidad";
  setCriterioOrden: (v: "importe" | "cantidad") => void;
  paginaActual: number;
  setPaginaActual: (v: number) => void;
  clientesPorPagina?: number;
};

export const ClientesTable = ({
  clientes,
  filtroNombre,
  setFiltroNombre,
  criterioOrden,
  setCriterioOrden,
  paginaActual,
  setPaginaActual,
  clientesPorPagina = 10,
}: ClientesTableProps) => {
  // Filtrado
  const clientesFiltrados = clientes.filter((cliente) =>
    cliente.nombre.toLowerCase().includes(filtroNombre.toLowerCase())
  );
  // Paginación
  const totalPaginas = Math.ceil(clientesFiltrados.length / clientesPorPagina);
  const clientesAMostrar = clientesFiltrados.slice(
    (paginaActual - 1) * clientesPorPagina,
    paginaActual * clientesPorPagina
  );

  const irPaginaAnterior = () => setPaginaActual(Math.max(1, paginaActual - 1));
  const irPaginaSiguiente = () => setPaginaActual(Math.min(totalPaginas, paginaActual + 1));

  return (
    <div className="bg-white w-full md:w-4/5 rounded-2xl shadow-md p-5">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-3">
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Ingrese el nombre"
            value={filtroNombre}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setFiltroNombre(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm bg-white"
          />
          <FiSearch className="text-gray-400" size={18} />
        </div>
        <span className="text-secondary font-black text-lg text-center flex-1">
          Clientes
        </span>
        {/* Select para elegir criterio de orden */}
        <div className="flex items-center gap-2">
          <label className="font-medium text-sm">Ordenar por:</label>
          <select
            value={criterioOrden}
            onChange={e => setCriterioOrden(e.target.value as "importe" | "cantidad")}
            className="border rounded px-2 py-1 bg-white text-sm"
          >
            <option value="importe">Importe Total</option>
            <option value="cantidad">Cantidad de Pedidos</option>
          </select>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left rounded-2xl">
          <thead>
            <tr className="text-secondary font-bold border-b">
              <th className="py-2 px-3">Nombre</th>
              <th className="py-2 px-3 text-center">Cantidad de pedidos</th>
              <th className="py-2 px-3 text-center">Importe Total</th>
              <th className="py-2 px-3 text-center"></th>
            </tr>
          </thead>
          <tbody>
            {clientesAMostrar.map((cliente, idx) => (
              <tr
                key={cliente.nombre + idx}
                className="border-b last:border-b-0 hover:bg-gray-50"
              >
                <td className="py-2 px-3">{cliente.nombre}</td>
                <td className="py-2 px-3 text-center">{cliente.cantidad}</td>
                <td className="py-2 px-3 text-center">
                  {cliente.importe.toLocaleString("es-AR", {
                    style: "currency",
                    currency: "ARS",
                    maximumFractionDigits: 0,
                  })}
                </td>
                <td className="py-2 px-3 text-center">
                  <Link to="/admin/ClientesEstadistica">
                    <button className="bg-tertiary cursor hover:bg-[#ff9c3ac2] text-dark font-bold rounded-2xl px-4 py-1">
                      Pedidos
                    </button>
                  </Link>
                </td>
              </tr>
            ))}
            {clientesAMostrar.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center text-gray-400 py-4">
                  No se encontraron resultados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Paginación */}
      {totalPaginas > 1 && (
        <div className="flex justify-center items-center gap-4 mt-4">
          <button
            onClick={irPaginaAnterior}
            disabled={paginaActual === 1}
            className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
          >
            Anterior
          </button>
          <span>
            Página {paginaActual} de {totalPaginas}
          </span>
          <button
            onClick={irPaginaSiguiente}
            disabled={paginaActual === totalPaginas}
            className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
};