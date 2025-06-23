import { useState, useEffect, ChangeEvent } from "react";
import { AdminHeader } from "../../components/admin/AdminHeader";
import { PiMicrosoftExcelLogo } from "react-icons/pi";
import { FiSearch } from "react-icons/fi";
import { Link } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// IMPORTA TUS DTOs
import { PedidoResponseDTO } from "../../types/Pedido/PedidoResponseDTO";
import { ProductoResponseDTO } from "../../types/Producto/ProductoResponseDTO";

// Puedes definir el tipo para la tabla de clientes
type ClienteTabla = {
  nombre: string;
  cantidad: number;
  importe: number;
};

// Si tienes un DTO para ingresos/egresos mensual, impórtalo aquí.
// Si no, define uno simple:
type IngresosEgresosMensualDTO = {
  mes: string; // formato "YYYY-MM"
  ingresos: number;
  egresos: number;
};

type IngresosEgresosData = {
  ingresos: number;
  egresos: number;
  gananciaTotal?: number;
};

const Estadistica = () => {
  const [fechaDesde, setFechaDesde] = useState<string>("");
  const [fechaHasta, setFechaHasta] = useState<string>("");
  const [topProductos, setTopProductos] = useState<ProductoResponseDTO[]>([]);
  const [pedidos, setPedidos] = useState<number>(0);
  const [ganancias, setGanancias] = useState<number>(0);
  const [ingresosEgresos, setIngresosEgresos] = useState<string>("");
  const [ingresosEgresosData, setIngresosEgresosData] = useState<IngresosEgresosData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingTopProductos, setLoadingTopProductos] = useState<boolean>(true);

  // Tabla de clientes con cantidad de pedidos e importe total
  const [clientes, setClientes] = useState<ClienteTabla[]>([]);
  const [filtroNombre, setFiltroNombre] = useState<string>("");

  // Estado para evolución mensual
  const [evolucionIE, setEvolucionIE] = useState<IngresosEgresosMensualDTO[]>([]);
  const [loadingEvolucionIE, setLoadingEvolucionIE] = useState<boolean>(true);

  // Filtrado de la tabla de clientes
  const clientesFiltrados = clientes.filter((cliente) =>
    cliente.nombre.toLowerCase().includes(filtroNombre.toLowerCase())
  );

  useEffect(() => {
    const fetchEstadisticas = async () => {
      setLoading(true);
      try {
        const pedidosResponse = await fetch(
          "http://localhost:8080/api/pedidos/estado?estado=ENTREGADO"
        );
        if (!pedidosResponse.ok)
          throw new Error("Error al consultar pedidos entregados");
        const pedidosData: PedidoResponseDTO[] = await pedidosResponse.json();

        let pedidosFiltrados = pedidosData;
        if (fechaDesde) {
          pedidosFiltrados = pedidosFiltrados.filter(
            (pedido) => pedido.fecha >= fechaDesde
          );
        }
        if (fechaHasta) {
          pedidosFiltrados = pedidosFiltrados.filter(
            (pedido) => pedido.fecha <= fechaHasta
          );
        }

        setPedidos(pedidosFiltrados.length);

        const totalGanancias = pedidosFiltrados.reduce(
          (acum: number, pedido: PedidoResponseDTO) => acum + (pedido.totalVenta || 0),
          0
        );
        setGanancias(totalGanancias);

        // Agrupar pedidos por cliente para la tabla
        // Si el cliente puede ser null, revisa antes de usar
        const clientesMap: Record<string, { cantidad: number; importe: number }> = {};
        pedidosFiltrados.forEach((pedido) => {
          const nombre = pedido.cliente?.nombreCompleto || "Sin nombre";
          if (!clientesMap[nombre]) {
            clientesMap[nombre] = { cantidad: 0, importe: 0 };
          }
          clientesMap[nombre].cantidad += 1;
          clientesMap[nombre].importe += pedido.totalVenta || 0;
        });
        // Ordena por importe descendente y toma los top 5
        const clientesTabla = Object.entries(clientesMap)
          .map(([nombre, datos]) => ({
            nombre,
            cantidad: datos.cantidad,
            importe: datos.importe,
          }))
          .sort((a, b) => b.importe - a.importe)
          .slice(0, 5);

        setClientes(clientesTabla);

        let urlIE = "http://localhost:8080/api/estadisticas/ingresos-egresos";
        if (fechaDesde) urlIE += `?fechaDesde=${fechaDesde}`;
        if (fechaHasta)
          urlIE += (fechaDesde ? `&` : `?`) + `fechaHasta=${fechaHasta}`;
        const respIE = await fetch(urlIE);
        if (!respIE.ok)
          throw new Error("Error al consultar ingresos y egresos");
        const datosIE: IngresosEgresosData = await respIE.json();
        setIngresosEgresos(
          `Ingresos: $${Number(datosIE.ingresos).toLocaleString("es-AR", {
            maximumFractionDigits: 0,
          }) ?? 0}, ` +
          `Egresos: $${Number(datosIE.egresos).toLocaleString("es-AR", {
            maximumFractionDigits: 0,
          }) ?? 0}`
        );
        setIngresosEgresosData(datosIE);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    const fetchTopProductos = async () => {
      setLoadingTopProductos(true);
      try {
        let url = `http://localhost:8080/api/estadisticas/top-ventas/productos?limite=5`;
        if (fechaDesde) url += `&fechaDesde=${fechaDesde}`;
        if (fechaHasta) url += `&fechaHasta=${fechaHasta}`;
        const resp = await fetch(url);
        if (!resp.ok)
          throw new Error("Error al consultar productos más vendidos");
        const productos: ProductoResponseDTO[] = await resp.json();
        setTopProductos(productos || []);
      } catch (error) {
        setTopProductos([]);
        console.error(error);
      } finally {
        setLoadingTopProductos(false);
      }
    };

    const fetchEvolucionIE = async () => {
      setLoadingEvolucionIE(true);
      try {
        let url = `http://localhost:8080/api/estadisticas/evolucion-ingresos-egresos-mensual`;
        if (fechaDesde) url += `?fechaDesde=${fechaDesde}`;
        if (fechaHasta) url += (fechaDesde ? `&` : `?`) + `fechaHasta=${fechaHasta}`;
        const resp = await fetch(url);
        if (!resp.ok) throw new Error("Error al consultar evolución ingresos/egresos");
        const data: IngresosEgresosMensualDTO[] = await resp.json();
        setEvolucionIE(data || []);
      } catch (e) {
        setEvolucionIE([]);
      } finally {
        setLoadingEvolucionIE(false);
      }
    };

    fetchEstadisticas();
    fetchTopProductos();
    fetchEvolucionIE();
  }, [fechaDesde, fechaHasta]);

  const ingresos = Number(ingresosEgresosData?.ingresos ?? 0);
  const egresos = Number(ingresosEgresosData?.egresos ?? 0);
  const ganancia = Number(ingresosEgresosData?.gananciaTotal ?? 0);

  const ingresosEgresosChartData = ingresosEgresosData
    ? [
      { nombre: "Ingresos", Monto: ingresos },
      { nombre: "Egresos", Monto: egresos },
      { nombre: "Ganancia", Monto: ganancia },
    ]
    : [];

  const noData = ingresos === 0 && egresos === 0 && ganancia === 0;

  return (
    <>
      <AdminHeader text="Estadísticas" />
      <main className="flex flex-col items-center w-full m-auto pt-10 min-h-screen pb-20 bg-primary font-primary">
        {/* Filtros */}
        <div className="flex justify-center gap-4 mb-4 w-4/5">
          <div>
            <label className="block text-sm font-medium">Desde</label>
            <input
              type="date"
              value={fechaDesde}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setFechaDesde(e.target.value)}
              className="border rounded px-2 py-1 bg-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Hasta</label>
            <input
              type="date"
              value={fechaHasta}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setFechaHasta(e.target.value)}
              className="border rounded px-2 py-1 bg-white"
            />
          </div>
          <button className="cursor-pointer bg-tertiary hover:bg-[#ff9c3ac2] text-dark font-black px-4 py-2 rounded shadow flex items-center">
            <span className="ml-2 mr-4">Exportar a excel</span>
            <PiMicrosoftExcelLogo size={25} />
          </button>
        </div>

        {/* Contenedor principal: Top 5 a la izquierda, KPIs + gráfico a la derecha */}
        <div className="flex flex-col md:flex-row w-full px-2 md:px-20 gap-6 items-start">
          {/* Izquierda: Top 5 productos */}
          <div className="flex flex-col items-center w-full md:w-1/3 bg-white px-2 py-4 md:px-4 md:py-5 shadow-lg rounded-2xl max-w-xs mx-auto">
            <h4 className="text-secondary font-black text-md">Top 5</h4>
            <span className="text-secondary font-black text-md mb-2">
              Productos más Comprados
            </span>
            <div className="w-full flex flex-col gap-2 mt-2">
              {loadingTopProductos ? (
                <div className="text-gray-400 px-4 py-2">Cargando...</div>
              ) : topProductos.length > 0 ? (
                topProductos.map((producto, idx) => (
                  <div key={producto.id} className="flex items-center justify-between border border-tertiary rounded-lg px-2 py-2" >
                    <span className="text-lg font-bold text-tertiary w-5 text-center">
                      {idx + 1}
                    </span>
                    <span className="flex-1 text-left ml-2 truncate">
                      {producto.denominacion}
                    </span>
                    <span className="text-xs text-gray-500 ml-2">
                      {(producto as any).cantidadVendidos ? (producto as any).cantidadVendidos + " ventas" : ""}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-gray-400 px-4 py-2">Sin datos</div>
              )}
            </div>
            <Link to="/admin/ProductosEstadistica" className="cursor-pointer font-semibold bg-tertiary mt-5 rounded-2xl px-4 py-1 " >
              Ver más
            </Link>
          </div>

          {/* Derecha: KPIs y gráfico (apilados verticalmente) */}
          <div className="flex flex-col w-full md:w-2/3 gap-5">
            {/* KPIs arriba */}
            <div className="flex flex-col md:flex-row items-center justify-around w-full gap-4">
              <div className="h-40 shadow-md gap-4 w-40 bg-white flex flex-col items-center justify-center rounded-3xl px-3">
                <span className="text-lg text-secondary font-bold">Pedidos</span>
                <h3 className="font-bold px-2 text-4xl">
                  {loading ? "..." : pedidos}
                </h3>
                <span className="font-bold px-2 text-md">CONCRETADOS</span>
              </div>
              <div className="h-40 shadow-md gap-4 w-40 bg-white flex flex-col items-center justify-center rounded-3xl px-3">
                <span className="text-lg text-secondary font-bold">Ganancias</span>
                <h3 className="font-bold text-3xl">
                  {loading
                    ? "..."
                    : `$${ganancias.toLocaleString("es-AR", {
                      minimumFractionDigits: 2,
                    })}`}
                </h3>
              </div>
            </div>
            {/* Gráfico de evolución mensual */}
            <div className="w-full bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-secondary font-bold text-lg mb-3 text-center">
                Ingresos y egresos por mes
              </h3>
              <div style={{ width: "100%", height: 220 }}>
                {loadingEvolucionIE ? (
                  <div className="text-gray-400 text-center pt-10">Cargando...</div>
                ) : evolucionIE.length === 0 ? (
                  <div className="text-gray-400 text-center pt-10">Sin datos para mostrar</div>
                ) : (
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart
                      data={evolucionIE}
                      margin={{ top: 20, right: 30, left: 10, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="mes" />
                      <YAxis />
                      <Tooltip formatter={value => `$${Number(value).toLocaleString("es-AR")}`} />
                      <Legend />
                      <Bar dataKey="egresos" stackId="a" fill="#c0392b" name="Egreso" />
                      <Bar dataKey="ingresos" stackId="a" fill="#ff9c3a" name="Ingreso" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* TABLA DE CLIENTES CON MÁS PEDIDOS */}
        <div className="w-full flex flex-col items-center mt-8">
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
                Clientes con más pedidos
              </span>
              <button className="bg-tertiary text-dark font-semibold px-4 py-2 rounded-lg shadow hover:bg-[#ff9c3ac2] min-w-[120px] mt-2 md:mt-0">
                Ver todos
              </button>
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
                  {clientesFiltrados.map((cliente, idx) => (
                    <tr
                      key={cliente.nombre + idx}
                      className="border-b last:border-b-0 hover:bg-gray-50"
                    >
                      <td className="py-2 px-3">{cliente.nombre}</td>
                      <td className="py-2 px-3 text-center">
                        {cliente.cantidad}
                      </td>
                      <td className="py-2 px-3 text-center">
                        {cliente.importe.toLocaleString("es-AR", {
                          style: "currency",
                          currency: "ARS",
                          maximumFractionDigits: 0,
                        })}
                      </td>
                      <td className="py-2 px-3 text-center">
                        <button className="bg-tertiary hover:bg-[#ff9c3ac2] text-dark font-bold rounded-2xl px-4 py-1">
                          Pedidos
                        </button>
                      </td>
                    </tr>
                  ))}
                  {clientesFiltrados.length === 0 && (
                    <tr>
                      <td colSpan={4} className="text-center text-gray-400 py-4">
                        No se encontraron resultados
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export { Estadistica };