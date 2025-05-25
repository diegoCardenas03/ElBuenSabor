import React from "react";
import { FaEye } from "react-icons/fa";
import { IoPencilSharp } from "react-icons/io5";
type Insumo = {
  nombre: string;
  precio: string;
  cantidad: number;
  unidad: string;
  categoria: string;
  stockMin: number;
  paraPreparacion: boolean;
  activo: boolean;
};

interface TablaInsumosProps {
  insumos: Insumo[];
}

const TablaInsumos: React.FC<TablaInsumosProps> = ({ insumos }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2 border-b text-left">Nombre</th>
            <th className="px-4 py-2 border-b text-left">Precio</th>
            <th className="px-4 py-2 border-b text-left">Cantidad</th>
            <th className="px-4 py-2 border-b text-left">Unidad de Medida</th>
            <th className="px-4 py-2 border-b text-left">Categoría</th>
            <th className="px-4 py-2 border-b text-left">StockMin</th>
            <th className="px-4 py-2 border-b text-left">Para preparación</th>
            <th className="px-4 py-2 border-b text-left">Activo</th>
            <th className="px-4 py-2 border-b text-left">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {insumos.map((insumo, index) => (
            <tr
              key={index}
              className={
                insumo.cantidad < insumo.stockMin ? "bg-red-300" : "bg-white"
              }
            >
              <td className="px-4 py-2 border-b underline cursor-pointer">
                {insumo.nombre}
              </td>
              <td className="px-4 py-2 border-b">{insumo.precio}</td>
              <td className="px-4 py-2 border-b">{insumo.cantidad}</td>
              <td className="px-4 py-2 border-b">{insumo.unidad}</td>
              <td className="px-4 py-2 border-b">{insumo.categoria}</td>
              <td className="px-4 py-2 border-b">{insumo.stockMin}</td>
              <td className="px-4 py-2 border-b">
                {insumo.paraPreparacion ? "sí" : "no"}
              </td>
              <td className="px-4 py-2 border-b">
                <input type="checkbox" checked={insumo.activo} readOnly />
              </td>
              <td className="px-4 py-2 border-b flex gap-2">
                <button><FaEye /></button>
                <button><IoPencilSharp /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TablaInsumos;
