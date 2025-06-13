import { Estado } from "../types/enums/Estado";

export const TabsPedidos = ({
  estadoActual,
  setEstadoActual,
  estadosTabs,
}: {
  estadoActual: Estado;
  setEstadoActual: (estado: Estado) => void;
  estadosTabs: { label: string; value: Estado }[];
}) => {
  return (
    <div className="flex gap-6 mb-4">
      {estadosTabs.map((estado) => (
        <button
          key={estado.value}
          onClick={() => setEstadoActual(estado.value)}
          className={`text-lg font-semibold pb-1 border-b-2 transition-colors duration-200
            ${estado.value === estadoActual ? "border-red-600 text-red-600" : "border-transparent text-gray-600 hover:text-red-600"}`}
        >
          {estado.label}
        </button>
      ))}
    </div>
  );
};