import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { AdminHeader } from "../../components/admin/AdminHeader";

// Tipo de pedido: ajusta los campos según tu backend
type PedidoCliente = {
  id: string | number;
  fecha: string;
  numeroPedido: string | number;
  importeTotal: number;
  estado?: string;
  direccionEntrega?: string;
  productos?: { nombre: string; cantidad: number; precio: number }[];
};

const PEDIDOS_POR_PAGINA = 10;

// Temporal: datos de ejemplo. Luego cambia por fetch real.
const pedidosEjemplo: PedidoCliente[] = [
  {
    id: 1,
    fecha: "2025-06-01",
    numeroPedido: "1001",
    importeTotal: 165000,
    estado: "Entregado",
    direccionEntrega: "Av. Principal 123",
    productos: [
      { nombre: "Producto A", cantidad: 2, precio: 50000 },
      { nombre: "Producto B", cantidad: 1, precio: 65000 },
    ],
  },
  {
    id: 2,
    fecha: "2025-06-05",
    numeroPedido: "1002",
    importeTotal: 80000,
    estado: "Entregado",
    direccionEntrega: "Av. Principal 123",
    productos: [
      { nombre: "Producto C", cantidad: 1, precio: 80000 },
    ],
  },
  // ...más pedidos
];

const ClientesEstadisticas = () => {
  const { clienteNombre } = useParams();
  const [paginaActual, setPaginaActual] = useState(1);
  const [pedidos, setPedidos] = useState<PedidoCliente[]>([]);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState<PedidoCliente | null>(null);

  useEffect(() => {
    // Aquí deberías hacer un fetch real usando clienteNombre
    // Por ejemplo:
    // fetch(`/api/pedidos/por-cliente?nombre=${encodeURIComponent(clienteNombre || "")}`)
    //   .then(res => res.json()).then(data => setPedidos(data));
    setPedidos(pedidosEjemplo); // Simulación para pruebas
  }, [clienteNombre]);

  const totalPaginas = Math.ceil(pedidos.length / PEDIDOS_POR_PAGINA);
  const pedidosAMostrar = pedidos.slice(
    (paginaActual - 1) * PEDIDOS_POR_PAGINA,
    paginaActual * PEDIDOS_POR_PAGINA
  );

  const irPaginaAnterior = () => setPaginaActual(Math.max(1, paginaActual - 1));
  const irPaginaSiguiente = () => setPaginaActual(Math.min(totalPaginas, paginaActual + 1));

  return (
    <div className="min-h-screen bg-primary pb-10">
      <AdminHeader showBackButton text="Estadísticas" />
      <div className="w-full flex flex-col items-center mt-8">
        <div className="bg-white w-full md:w-4/5 rounded-2xl shadow-md p-5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-3">
            <span className="text-tertiary font-black text-lg text-center flex-1">
              Pedidos de <b>{clienteNombre}</b>
            </span>
            <div className="flex items-center gap-2">
              <input
                type="date"
                className="border rounded-lg px-4 py-2 text-sm bg-white"
                placeholder="dd/mm/aaaa"
                style={{ minWidth: 140 }}
              />
              <span>al</span>
              <input
                type="date"
                className="border rounded-lg px-4 py-2 text-sm bg-white"
                placeholder="dd/mm/aaaa"
                style={{ minWidth: 140 }}
              />
            </div>
            <button
              className="bg-tertiary text-dark font-bold px-4 py-2 rounded-full shadow flex items-center gap-2"
              style={{ minWidth: 120 }}
            >
              Exportar
              <img src="https://cdn-icons-png.flaticon.com/512/732/732220.png" alt="Excel" width={22} />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left rounded-2xl">
              <thead>
                <tr className="text-tertiary font-bold border-b">
                  <th className="py-2 px-3">Fecha</th>
                  <th className="py-2 px-3">N° Pedido</th>
                  <th className="py-2 px-3 text-center">Importe Total</th>
                  <th className="py-2 px-3 text-center"></th>
                </tr>
              </thead>
              <tbody>
                {pedidosAMostrar.map((pedido, idx) => (
                  <tr
                    key={pedido.id ?? pedido.numeroPedido + "_" + idx}
                    className="border-b last:border-b-0 hover:bg-gray-50"
                  >
                    <td className="py-2 px-3">{pedido.fecha}</td>
                    <td className="py-2 px-3">{pedido.numeroPedido}</td>
                    <td className="py-2 px-3 text-center">
                      {pedido.importeTotal.toLocaleString("es-AR", {
                        style: "currency",
                        currency: "ARS",
                        maximumFractionDigits: 0,
                      })}
                    </td>
                    <td className="py-2 px-3 text-center">
                      <button
                        className="bg-tertiary hover:bg-[#ff9c3ac2] text-dark font-bold rounded-2xl px-4 py-1"
                        onClick={() => setPedidoSeleccionado(pedido)}
                      >
                        Detalle
                      </button>
                    </td>
                  </tr>
                ))}
                {pedidosAMostrar.length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-center text-gray-400 py-4">
                      No se encontraron pedidos
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
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
          {pedidoSeleccionado && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-20 backdrop-blur-sm"
              onClick={() => setPedidoSeleccionado(null)}
            >
              <div
                className="bg-white rounded-2xl shadow-lg p-6 min-w-[320px] max-w-md relative"
                onClick={e => e.stopPropagation()}
              >
                <button
                  className="absolute top-3 right-3 text-xl text-gray-400 hover:text-tertiary"
                  onClick={() => setPedidoSeleccionado(null)}
                >
                  &times;
                </button>
                <h2 className="text-xl font-bold mb-4 text-tertiary">
                  Detalle del Pedido
                </h2>
                <div className="mb-2"><b>Fecha:</b> {pedidoSeleccionado.fecha}</div>
                <div className="mb-2"><b>N° Pedido:</b> {pedidoSeleccionado.numeroPedido}</div>
                <div className="mb-2"><b>Importe Total:</b> {pedidoSeleccionado.importeTotal.toLocaleString("es-AR", { style: "currency", currency: "ARS" })}</div>
                {pedidoSeleccionado.estado && (
                  <div className="mb-2"><b>Estado:</b> {pedidoSeleccionado.estado}</div>
                )}
                {pedidoSeleccionado.direccionEntrega && (
                  <div className="mb-2"><b>Dirección de Entrega:</b> {pedidoSeleccionado.direccionEntrega}</div>
                )}
                {pedidoSeleccionado.productos && pedidoSeleccionado.productos.length > 0 && (
                  <div className="mb-2">
                    <b>Productos:</b>
                    <ul className="list-disc ml-5 mt-1">
                      {pedidoSeleccionado.productos.map((prod, i) => (
                        <li key={i}>
                          {prod.nombre} x{prod.cantidad} - {prod.precio.toLocaleString("es-AR", { style: "currency", currency: "ARS" })}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientesEstadisticas;