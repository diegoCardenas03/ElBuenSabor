import { useEffect, useState, ChangeEvent } from "react";
import { AdminHeader } from "../../components/admin/AdminHeader";
import { PiMicrosoftExcelLogo } from "react-icons/pi";
import * as ExcelJS from "exceljs/dist/exceljs.min.js";
import { saveAs } from "file-saver";

// Tipo para Producto o Insumo
type ProductoOInsumo = {
  denominacion: string;
  id: number;
};

type ProductoRanking = {
  denominacion: string;
  cantidadCompras: number;
  importeTotal: number;
};

type PedidoResponseDTO = {
  detallePedidos: {
    cantidad: number;
    producto?: ProductoOInsumo | null;
    insumo?: ProductoOInsumo | null;
    subTotal: number;
    promocion?: any; // Para promociones de cualquier estructura
  }[];
  fecha: string;
  totalVenta: number;
};

const ProductosEstadistica = () => {
  const [fechaDesde, setFechaDesde] = useState<string>("");
  const [fechaHasta, setFechaHasta] = useState<string>("");
  const [productos, setProductos] = useState<ProductoRanking[]>([]);
  const [insumos, setInsumos] = useState<ProductoRanking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Paginación
  const [paginaProductos, setPaginaProductos] = useState<number>(1);
  const [paginaInsumos, setPaginaInsumos] = useState<number>(1);
  const filasPorPagina = 10;

  useEffect(() => {
    const fetchProductos = async () => {
      setLoading(true);
      try {
        let url = "http://localhost:8080/api/pedidos/estado?estado=ENTREGADO";
        const resp = await fetch(url);
        if (!resp.ok) throw new Error("Error al consultar pedidos entregados");
        const pedidos: PedidoResponseDTO[] = await resp.json();

        // LOG: pedidos completos
        // console.log("Pedidos recibidos:", JSON.parse(JSON.stringify(pedidos)));

        // Filtra por fecha si corresponde
        let pedidosFiltrados = pedidos;
        if (fechaDesde) pedidosFiltrados = pedidosFiltrados.filter(p => p.fecha >= fechaDesde);
        if (fechaHasta) pedidosFiltrados = pedidosFiltrados.filter(p => p.fecha <= fechaHasta);

        // console.log("Pedidos filtrados:", pedidosFiltrados);

        // Acumula compras por producto (elaborados) y por insumo (no elaborable/bebidas)
        const productosMap: Record<string, ProductoRanking> = {};
        const insumosMap: Record<string, ProductoRanking> = {};

        pedidosFiltrados.forEach((pedido, pedidoIdx) => {
          // console.log(`Analizando pedido #${pedidoIdx} con fecha ${pedido.fecha}:`, pedido);
          pedido.detallePedidos.forEach((detalle, detalleIdx) => {
            // console.log(`  Detalle #${detalleIdx}:`, detalle);

            if (detalle.producto) {
              // console.log("    Es producto directo:", detalle.producto);
              const key = detalle.producto.denominacion;
              if (!productosMap[key]) {
                productosMap[key] = {
                  denominacion: detalle.producto.denominacion,
                  cantidadCompras: 0,
                  importeTotal: 0,
                };
              }
              productosMap[key].cantidadCompras += detalle.cantidad;
              productosMap[key].importeTotal += Number(detalle.subTotal) || 0;
              // console.log("    Producto agregado/sumado:", productosMap[key]);
            } else if (detalle.insumo) {
              // console.log("    Es insumo directo:", detalle.insumo);
              const key = detalle.insumo.denominacion;
              if (!insumosMap[key]) {
                insumosMap[key] = {
                  denominacion: detalle.insumo.denominacion,
                  cantidadCompras: 0,
                  importeTotal: 0,
                };
              }
              insumosMap[key].cantidadCompras += detalle.cantidad;
              insumosMap[key].importeTotal += Number(detalle.subTotal) || 0;
              // console.log("    Insumo agregado/sumado:", insumosMap[key]);
            }
            // LOG: Detalle de promoción (sea cual sea la estructura)
            if (detalle.promocion) {
              // console.log("    Detalle de promoción encontrado:", detalle.promocion);
              // AJUSTE: ahora usamos detallePromociones (plural) según tu JSON
              if (detalle.promocion.detallePromociones) {
                // console.log("    detallePromociones en promo:", detalle.promocion.detallePromociones);
                detalle.promocion.detallePromociones.forEach((dp, idxPromo) => {
                  // console.log(`      Item en promo #${idxPromo}:`, dp);
                  // Sumar productos
                  if (dp.producto) {
                    const key = dp.producto.denominacion;
                    if (!productosMap[key]) {
                      productosMap[key] = {
                        denominacion: dp.producto.denominacion,
                        cantidadCompras: 0,
                        importeTotal: 0,
                      };
                    }
                    productosMap[key].cantidadCompras += detalle.cantidad * dp.cantidad;
                    // El importeTotal no se suma porque en promos no se reparte el subtotal individual
                    // console.log("      Producto agregado/sumado por promo:", productosMap[key]);
                  }
                  // Sumar insumos
                  if (dp.insumo) {
                    const key = dp.insumo.denominacion;
                    if (!insumosMap[key]) {
                      insumosMap[key] = {
                        denominacion: dp.insumo.denominacion,
                        cantidadCompras: 0,
                        importeTotal: 0,
                      };
                    }
                    insumosMap[key].cantidadCompras += detalle.cantidad * dp.cantidad;
                    // console.log("      Insumo agregado/sumado por promo:", insumosMap[key]);
                  }
                });
              }
            }
          });
        });

        // console.log("ProductosMap final:", productosMap);
        // console.log("InsumosMap final:", insumosMap);

        // Convierte los maps a arrays y ordena por cantidad/compras descendente
        const productosArray = Object.values(productosMap).sort((a, b) => b.cantidadCompras - a.cantidadCompras);
        const insumosArray = Object.values(insumosMap).sort((a, b) => b.cantidadCompras - a.cantidadCompras);

        // console.log("Productos ordenados finales:", productosArray);
        // console.log("Insumos ordenados finales:", insumosArray);

        setProductos(productosArray);
        setInsumos(insumosArray);
      } catch (e) {
        // console.log("Error en fetchProductos:", e);
        setProductos([]);
        setInsumos([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProductos();
  }, [fechaDesde, fechaHasta]);

  // Lógica paginación
  const totalPaginasProductos = Math.max(1, Math.ceil(productos.length / filasPorPagina));
  const productosPagina = productos.slice((paginaProductos - 1) * filasPorPagina, paginaProductos * filasPorPagina);

  const totalPaginasInsumos = Math.max(1, Math.ceil(insumos.length / filasPorPagina));
  const insumosPagina = insumos.slice((paginaInsumos - 1) * filasPorPagina, paginaInsumos * filasPorPagina);

  const handleAnteriorProductos = () => {
    if (paginaProductos > 1) setPaginaProductos(paginaProductos - 1);
  };

  const handleSiguienteProductos = () => {
    if (paginaProductos < totalPaginasProductos) setPaginaProductos(paginaProductos + 1);
  };

  const handleAnteriorInsumos = () => {
    if (paginaInsumos > 1) setPaginaInsumos(paginaInsumos - 1);
  };

  const handleSiguienteInsumos = () => {
    if (paginaInsumos < totalPaginasInsumos) setPaginaInsumos(paginaInsumos + 1);
  };

  const handleFechaDesde = (e: ChangeEvent<HTMLInputElement>) => {
    setFechaDesde(e.target.value);
    setPaginaProductos(1);
    setPaginaInsumos(1);
  };
  const handleFechaHasta = (e: ChangeEvent<HTMLInputElement>) => {
    setFechaHasta(e.target.value);
    setPaginaProductos(1);
    setPaginaInsumos(1);
  };

  // --- EXPORTAR EXCEL FUNCIONAL ---
  const handleExportar = async () => {
    let periodo = "";
    if (!fechaDesde && !fechaHasta) {
      const hoy = new Date();
      const y = hoy.getFullYear();
      const m = (hoy.getMonth() + 1).toString().padStart(2, "0");
      periodo = `${m}/${y}`;
    } else {
      periodo = `${fechaDesde || "Inicio"} a ${fechaHasta || "Hoy"}`;
    }

    const wb = new ExcelJS.Workbook();

    // Ranking Productos
    const wsProductos = wb.addWorksheet("Ranking Productos");
    const headerProd = ["Orden", "Nombre", "Cantidad de compras", "Importe Total"];
    wsProductos.addRow(headerProd);
    productos.forEach((p, idx) => {
      wsProductos.addRow([
        idx + 1,
        p.denominacion,
        p.cantidadCompras,
        p.importeTotal
      ]);
    });

    // Estilos Productos
    wsProductos.getRow(1).eachCell(cell => {
      cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4373B9' }};
      cell.alignment = { vertical: "middle", horizontal: "center" };
      cell.border = { bottom: {style: 'thin'} };
    });
    wsProductos.columns = [
      { width: 10 },
      { width: 35 },
      { width: 22 },
      { width: 22 },
    ];
    wsProductos.getColumn(4).numFmt = '"$"#,##0.00;[Red]\\-"$"#,##0.00';

    // Ranking Insumos
    const wsInsumos = wb.addWorksheet("Ranking Bebidas");
    const headerInsumos = ["Orden", "Nombre", "Cantidad de compras", "Importe Total"];
    wsInsumos.addRow(headerInsumos);
    insumos.forEach((i, idx) => {
      wsInsumos.addRow([
        idx + 1,
        i.denominacion,
        i.cantidadCompras,
        i.importeTotal
      ]);
    });

    // Fondo igual que productos para uniformidad
    wsInsumos.getRow(1).eachCell(cell => {
      cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4373B9' }};
      cell.alignment = { vertical: "middle", horizontal: "center" };
      cell.border = { bottom: {style: 'thin'} };
    });
    wsInsumos.columns = [
      { width: 10 },
      { width: 35 },
      { width: 22 },
      { width: 22 },
    ];
    wsInsumos.getColumn(4).numFmt = '"$"#,##0.00;[Red]\\-"$"#,##0.00';

    // Agregar hoja de periodo/filtros
    const wsInfo = wb.addWorksheet("Filtro");
    wsInfo.addRow(["Período", periodo]);
    wsInfo.getRow(1).eachCell(cell => {
      cell.font = { bold: true };
      cell.alignment = { vertical: "middle", horizontal: "left" };
    });
    wsInfo.columns = [{ width: 14 }, { width: 35 }];

    // Descargar
    const buffer = await wb.xlsx.writeBuffer();
    saveAs(new Blob([buffer], { type: "application/octet-stream" }), `ranking_productos_insumos_${periodo.replace(/\//g,"-")}.xlsx`);
  };

  return (
    <>
      <AdminHeader text="Estadísticas" />
      <main className="flex flex-col items-center w-full m-auto pt-10 min-h-screen pb-20 bg-[#fff3e3] font-primary">
        {/* Filtros + Exportar */}
        <div className="flex items-center gap-4 mb-5 w-full max-w-2xl">
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={fechaDesde}
              onChange={handleFechaDesde}
              className="border rounded px-2 py-1 bg-white"
              placeholder="dd/mm/aaaa"
            />
            <span className="mx-1 text-gray-700 font-bold">al</span>
            <input
              type="date"
              value={fechaHasta}
              onChange={handleFechaHasta}
              className="border rounded px-2 py-1 bg-white"
              placeholder="dd/mm/aaaa"
            />
          </div>
          <button
            className="cursor-pointer ml-auto flex items-center gap-2 bg-[#ff9c3a] hover:bg-[#ff9c3ac2] text-dark font-black px-4 py-2 rounded-lg shadow"
            onClick={handleExportar}
          >
            <span>Exportar</span>
            <PiMicrosoftExcelLogo size={24} />
          </button>
        </div>

        {/* Tabla de Productos */}
        <div className="bg-white w-full max-w-4xl rounded-2xl shadow-md p-5 mb-8">
          <div className="flex justify-center mb-2">
            <div className="px-5 py-1 rounded-t-2xl bg-[#fff3e3] border-b-2 border-[#ff9c3a] font-bold text-[#d61c1c] text-lg">
              Ranking Productos Elaborados
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left rounded-2xl table-fixed">
              <thead>
                <tr className="text-[#d61c1c] font-bold border-b border-gray-300">
                  <th className="py-2 px-3 min-w-[160px]">Nombre</th>
                  <th className="py-2 px-3 text-center min-w-[160px]">Cantidad de compras</th>
                  <th className="py-2 px-3 text-center min-w-[160px]">Importe Total</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={3} className="text-center text-gray-400 py-6">
                      Cargando...
                    </td>
                  </tr>
                ) : productosPagina.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="text-center text-gray-400 py-6">
                      Sin datos
                    </td>
                  </tr>
                ) : (
                  productosPagina.map((producto, idx) => (
                    <tr key={idx} className="border-b last:border-b-0 hover:bg-gray-50">
                      <td className="py-2 px-3 min-w-[160px]">{producto.denominacion}</td>
                      <td className="py-2 px-3 text-center min-w-[160px]">{producto.cantidadCompras}</td>
                      <td className="py-2 px-3 text-center min-w-[160px]">
                        {producto.importeTotal.toLocaleString("es-AR", {
                          style: "currency",
                          currency: "ARS",
                          maximumFractionDigits: 0,
                        })}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {/* Paginación */}
          <div className="flex items-center justify-end mt-4 gap-2">
            <span className="text-xs text-gray-500">
              ({paginaProductos} <span className="text-[#d61c1c] font-bold">/</span> {totalPaginasProductos})
            </span>
            <button
              className={`w-7 h-7 rounded-full font-bold border border-gray-300 text-[#d61c1c] disabled:opacity-40`}
              onClick={handleAnteriorProductos}
              disabled={paginaProductos === 1}
            >{"<"}</button>
            <button
              className={`w-7 h-7 rounded-full font-bold border border-gray-300 text-[#d61c1c] disabled:opacity-40`}
              onClick={handleSiguienteProductos}
              disabled={paginaProductos === totalPaginasProductos}
            >{">"}</button>
          </div>
        </div>

        {/* Tabla de Insumos/Bebidas */}
        <div className="bg-white w-full max-w-4xl rounded-2xl shadow-md p-5">
          <div className="flex justify-center mb-2">
            <div className="px-5 py-1 rounded-t-2xl bg-[#fff3e3] border-b-2 border-[#ff9c3a] font-bold text-[#d61c1c] text-lg">
              Ranking de Bebidas Vendidas
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left rounded-2xl table-fixed">
              <thead>
                <tr className="text-[#d61c1c] font-bold border-b border-gray-300">
                  <th className="py-2 px-3 min-w-[160px]">Nombre</th>
                  <th className="py-2 px-3 text-center min-w-[160px]">Cantidad de compras</th>
                  <th className="py-2 px-3 text-center min-w-[160px]">Importe Total</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={3} className="text-center text-gray-400 py-6">
                      Cargando...
                    </td>
                  </tr>
                ) : insumosPagina.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="text-center text-gray-400 py-6">
                      Sin datos
                    </td>
                  </tr>
                ) : (
                  insumosPagina.map((insumo, idx) => (
                    <tr key={idx} className="border-b last:border-b-0 hover:bg-gray-50">
                      <td className="py-2 px-3 min-w-[160px]">{insumo.denominacion}</td>
                      <td className="py-2 px-3 text-center min-w-[160px]">{insumo.cantidadCompras}</td>
                      <td className="py-2 px-3 text-center min-w-[160px]">
                        {insumo.importeTotal.toLocaleString("es-AR", {
                          style: "currency",
                          currency: "ARS",
                          maximumFractionDigits: 0,
                        })}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {/* Paginación */}
          <div className="flex items-center justify-end mt-4 gap-2">
            <span className="text-xs text-gray-500">
              ({paginaInsumos} <span className="text-[#d61c1c] font-bold">/</span> {totalPaginasInsumos})
            </span>
            <button
              className={`w-7 h-7 rounded-full font-bold border border-gray-300 text-[#d61c1c] disabled:opacity-40`}
              onClick={handleAnteriorInsumos}
              disabled={paginaInsumos === 1}
            >{"<"}</button>
            <button
              className={`w-7 h-7 rounded-full font-bold border border-gray-300 text-[#d61c1c] disabled:opacity-40`}
              onClick={handleSiguienteInsumos}
              disabled={paginaInsumos === totalPaginasInsumos}
            >{">"}</button>
          </div>
        </div>
      </main>
    </>
  );
};

export default ProductosEstadistica;