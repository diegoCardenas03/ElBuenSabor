import { useState, useEffect, ChangeEvent } from "react";
import { AdminHeader } from "../../components/admin/AdminHeader";
import { PiMicrosoftExcelLogo } from "react-icons/pi";
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
import { PedidoResponseDTO } from "../../types/Pedido/PedidoResponseDTO";
import { ProductoResponseDTO } from "../../types/Producto/ProductoResponseDTO";
import { ClientesTable, ClienteTabla } from "../../components/admin/ClientesTable";
import React from "react";
import ExcelJS from "exceljs/dist/exceljs.min.js";
import { saveAs } from "file-saver";

class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean, error?: any}> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return <div style={{color: "red", padding: 24}}>Error: {this.state.error?.message || "Ocurrió un error"}</div>
    }
    return this.props.children;
  }
}

type IngresosEgresosMensualDTO = {
  ingresos: number;
  fecha: string; // "2025-06-01"
  egresos: number;
  ganancias: number;
};

type IngresosEgresosData = {
  ingresos: number;
  egresos: number;
  ganancias: number;
};

const CLIENTES_POR_PAGINA = 10;

const Estadistica = () => {
  const [fechaDesde, setFechaDesde] = useState<string>("");
  const [fechaHasta, setFechaHasta] = useState<string>("");
  const [topProductos, setTopProductos] = useState<ProductoResponseDTO[]>([]);
  const [pedidos, setPedidos] = useState<number>(0);
  const [ganancias, setGanancias] = useState<number>(0);
  const [ingresosEgresosData, setIngresosEgresosData] = useState<IngresosEgresosData>({ingresos: 0, egresos: 0, ganancias: 0});
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingTopProductos, setLoadingTopProductos] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Tabla de clientes con cantidad de pedidos e importe total
  const [clientes, setClientes] = useState<ClienteTabla[]>([]);
  const [filtroNombre, setFiltroNombre] = useState<string>("");
  const [criterioOrden, setCriterioOrden] = useState<"importe" | "cantidad">("importe");
  const [paginaActual, setPaginaActual] = useState<number>(1);

  const [evolucionIE, setEvolucionIE] = useState<IngresosEgresosMensualDTO[]>([]);
  const [loadingEvolucionIE, setLoadingEvolucionIE] = useState<boolean>(true);
  const [errorEvolucionIE, setErrorEvolucionIE] = useState<string | null>(null);

  useEffect(() => {
    let cancelado = false;
    const fetchEstadisticas = async () => {
      setLoading(true);
      setError(null);
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
            (pedido) => pedido.fecha && pedido.fecha >= fechaDesde
          );
        }
        if (fechaHasta) {
          pedidosFiltrados = pedidosFiltrados.filter(
            (pedido) => pedido.fecha && pedido.fecha <= fechaHasta
          );
        }

        setPedidos(pedidosFiltrados.length);

        const totalGanancias = pedidosFiltrados.reduce(
          (acum: number, pedido: PedidoResponseDTO) => acum + (pedido.totalVenta || 0),
          0
        );
        setGanancias(totalGanancias);

        // Agrupar pedidos por cliente para la tabla - USANDO ID
        const clientesMap: Record<number, { nombre: string; cantidad: number; importe: number }> = {};
        pedidosFiltrados.forEach((pedido) => {
          const id = pedido.cliente?.id;
          const nombre = pedido.cliente?.nombreCompleto || "Sin nombre";
          if (!id) return;
          if (!clientesMap[id]) {
            clientesMap[id] = { nombre, cantidad: 0, importe: 0 };
          }
          clientesMap[id].cantidad += 1;
          clientesMap[id].importe += pedido.totalVenta || 0;
        });

        const clientesTabla = Object.entries(clientesMap)
          .map(([id, datos]) => ({
            id: Number(id),
            nombre: datos.nombre,
            cantidad: datos.cantidad,
            importe: datos.importe,
          }))
          .sort((a, b) =>
            criterioOrden === "importe"
              ? b.importe - a.importe
              : b.cantidad - a.cantidad
          );
        setClientes(clientesTabla);

        // Para mostrar totales en los KPIs (usamos el primer elemento, ya que tu endpoint da solo uno o por mes)
        let urlIE = "http://localhost:8080/api/estadisticas/ingresos-egresos";
        if (fechaDesde) urlIE += `?fechaDesde=${fechaDesde}`;
        if (fechaHasta)
          urlIE += (fechaDesde ? `&` : `?`) + `fechaHasta=${fechaHasta}`;
        const respIE = await fetch(urlIE);
        if (!respIE.ok)
          throw new Error("Error al consultar ingresos y egresos");
        const datosIE: IngresosEgresosMensualDTO[] = await respIE.json();
        // Sumar todos los ingresos, egresos, ganancias si hay más de un mes
        let ingresos = 0, egresos = 0, ganancias = 0;
        if (Array.isArray(datosIE)) {
          for (const item of datosIE) {
            ingresos += Number(item.ingresos) || 0;
            egresos += Number(item.egresos) || 0;
            ganancias += Number(item.ganancias) || 0;
          }
        }
        if (!cancelado) {
          setIngresosEgresosData({ingresos, egresos, ganancias});
        }
      } catch (error: any) {
        setError("No se pudieron cargar los datos de la estadística general.");
        setPedidos(0);
        setGanancias(0);
        setClientes([]);
        setIngresosEgresosData({ ingresos: 0, egresos: 0, ganancias: 0 });
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
      } finally {
        setLoadingTopProductos(false);
      }
    };

    const fetchEvolucionIE = async () => {
      setLoadingEvolucionIE(true);
      setErrorEvolucionIE(null);
      try {
        let url = "http://localhost:8080/api/estadisticas/ingresos-egresos";
        if (fechaDesde) url += `?fechaDesde=${fechaDesde}`;
        if (fechaHasta) url += (fechaDesde ? `&` : `?`) + `fechaHasta=${fechaHasta}`;
        const resp = await fetch(url);
        if (!resp.ok) throw new Error("Error al consultar evolución ingresos/egresos");
        const data: IngresosEgresosMensualDTO[] = await resp.json();
        setEvolucionIE(Array.isArray(data) ? data : []);
      } catch (e) {
        setEvolucionIE([]);
        setErrorEvolucionIE("No se pudo cargar la evolución de ingresos y egresos.");
      } finally {
        setLoadingEvolucionIE(false);
      }
    };

    fetchEstadisticas();
    fetchTopProductos();
    fetchEvolucionIE();
    setPaginaActual(1);
    return () => { cancelado = true; };
  }, [fechaDesde, fechaHasta, criterioOrden]);

  useEffect(() => { setPaginaActual(1); }, [filtroNombre]);

  const ingresos = Number(ingresosEgresosData?.ingresos ?? 0);
  const egresos = Number(ingresosEgresosData?.egresos ?? 0);
  const ganancia = Number(ingresosEgresosData?.ganancias ?? 0);

  // --- EXPORTAR A EXCEL CON ESTILO ---
  const handleExportExcel = async () => {
    let periodo = "Mes actual";
    let desde = fechaDesde;
    let hasta = fechaHasta;
    if (!desde && !hasta) {
      const hoy = new Date();
      const y = hoy.getFullYear();
      const m = (hoy.getMonth() + 1).toString().padStart(2, "0");
      desde = `${y}-${m}-01`;
      const lastDay = new Date(y, hoy.getMonth() + 1, 0).getDate();
      hasta = `${y}-${m}-${lastDay}`;
      periodo = `${m}/${y}`;
    } else {
      periodo = `${desde || "Inicio"} a ${hasta || "Hoy"}`;
    }

    // --- RESUMEN ---
    const resumenRows = [
      ["Periodo", "Ingresos", "Egresos", "Ganancias", "Cantidad de Pedidos"],
      [periodo, ingresos, egresos, ganancia, pedidos]
    ];

    // --- EVOLUCION ---
    const detalleEvolucionRows = [
      ["Mes", "Ingresos", "Egresos", "Ganancias"],
      ...evolucionIE.map(item => [
        item.fecha ? item.fecha.slice(0, 7) : "",
        item.ingresos,
        item.egresos,
        item.ganancias
      ])
    ];

    const wb = new ExcelJS.Workbook();

    // Hoja Resumen
    const wsResumen = wb.addWorksheet("Resumen");
    resumenRows.forEach(row => wsResumen.addRow(row));
    wsResumen.getRow(1).eachCell(cell => {
      cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4373B9' }};
      cell.alignment = { vertical: "middle", horizontal: "center" };
      cell.border = { bottom: {style: 'thin'} };
    });
    wsResumen.columns = [
      { width: 18 },
      { width: 12, style: { numFmt: '"$"#,##0.00;[Red]\\-"$"#,##0.00' }},
      { width: 12, style: { numFmt: '"$"#,##0.00;[Red]\\-"$"#,##0.00' }},
      { width: 12, style: { numFmt: '"$"#,##0.00;[Red]\\-"$"#,##0.00' }},
      { width: 20 }
    ];

    // Hoja Evolución mensual
    if (evolucionIE.length > 0) {
      const wsEvol = wb.addWorksheet("Evolucion mensual");
      detalleEvolucionRows.forEach(row => wsEvol.addRow(row));
      wsEvol.getRow(1).eachCell(cell => {
        cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4373B9' }};
        cell.alignment = { vertical: "middle", horizontal: "center" };
        cell.border = { bottom: {style: 'thin'} };
      });
      wsEvol.columns = [
        { width: 10 },
        { width: 12, style: { numFmt: '"$"#,##0.00;[Red]\\-"$"#,##0.00' }},
        { width: 12, style: { numFmt: '"$"#,##0.00;[Red]\\-"$"#,##0.00' }},
        { width: 12, style: { numFmt: '"$"#,##0.00;[Red]\\-"$"#,##0.00' }},
      ];
    }

    // Descargar
    const buffer = await wb.xlsx.writeBuffer();
    saveAs(new Blob([buffer], { type: "application/octet-stream" }), `estadisticas_${periodo.replace(/\//g,"-")}.xlsx`);
  };
  // --- FIN EXPORTAR A EXCEL ---

  return (
    <>
      <AdminHeader text="Estadísticas" />
      <main className="flex flex-col items-center w-full m-auto pt-10 min-h-screen pb-20" style={{ backgroundColor: "#fff3e3" }}>
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
          <button
            className="cursor-pointer bg-tertiary hover:bg-[#ff9c3ac2] text-dark font-black px-4 py-2 rounded shadow flex items-center"
            onClick={handleExportExcel}
          >
            <span className="ml-2 mr-4">Exportar a excel</span>
            <PiMicrosoftExcelLogo size={25} />
          </button>
        </div>

        {error && (
          <div className="text-red-600 font-bold my-4">{error}</div>
        )}

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
              <div className="h-40 shadow-md gap-4 w-auto bg-white flex flex-col items-center justify-center rounded-3xl px-3">
                <span className="text-lg text-secondary font-bold">Ganancias</span>
                <h3 className="font-bold text-3xl">
                  {loading
                    ? "..."
                    : `$${ganancia.toLocaleString("es-AR", {
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
                ) : errorEvolucionIE ? (
                  <div className="text-red-600 text-center pt-10">{errorEvolucionIE}</div>
                ) : evolucionIE.length === 0 ? (
                  <div className="text-gray-400 text-center pt-10">Sin datos para mostrar</div>
                ) : (
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart
                      data={evolucionIE.map((item) => ({
                        ...item,
                        mes: typeof item.fecha === "string" && item.fecha.length >= 7
                          ? item.fecha.slice(0, 7)
                          : "Sin fecha",
                      }))}
                      margin={{ top: 20, right: 30, left: 10, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="mes"
                        tickFormatter={(mes) => {
                          if (!mes || typeof mes !== "string") return mes;
                          const [year, month] = mes.split("-");
                          const meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
                          const idx = parseInt(month, 10) - 1;
                          return `${meses[idx] ?? month} ${year}`;
                        }}
                      />
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
          <ClientesTable
            clientes={clientes}
            filtroNombre={filtroNombre}
            setFiltroNombre={setFiltroNombre}
            criterioOrden={criterioOrden}
            setCriterioOrden={setCriterioOrden}
            paginaActual={paginaActual}
            setPaginaActual={setPaginaActual}
            clientesPorPagina={CLIENTES_POR_PAGINA}
          />
        </div>
      </main>
    </>
  );
};

// Exportar la página envuelta en el ErrorBoundary para atrapar cualquier error de render
export default function EstadisticaWithBoundary() {
  return (
    <ErrorBoundary>
      <Estadistica />
    </ErrorBoundary>
  );
}