import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { AdminHeader } from "../../components/admin/AdminHeader";
import { PiMicrosoftExcelLogo } from "react-icons/pi";
import ExcelJS from "exceljs/dist/exceljs.min.js";
import { saveAs } from "file-saver";

// --- Tipos ---
type ProductoPedido = {
  nombre: string;
  cantidad: number;
  precio: number;
  detallePromo?: { nombre: string; cantidad: number }[];
};

type PedidoCliente = {
  id: number;
  fecha: string;
  hora?: string;
  numeroPedido: string;
  importeTotal: number;
  estado?: string;
  tipoEnvio?: string;
  formaPago?: string;
  direccionEntrega?: string;
  productos?: ProductoPedido[];
  costoEnvio?: number;
};

// --- Utilidades ---
const PEDIDOS_POR_PAGINA = 10;
const API_BASE = "http://localhost:8080";

const parseDateTime = (fecha: string, hora?: string) => {
  return new Date(`${fecha}T${hora ?? "00:00:00"}`);
};

function formatFecha(fecha: string) {
  const [y, m, d] = fecha.split("-");
  return `${d}/${m}/${y}`;
}

function formatPrecio(n: number) {
  return n?.toLocaleString("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 2 });
}

// --- Modal para un solo pedido (detalle individual) ---
type PedidoDetalleModalProps = {
  pedido: PedidoCliente;
  onClose: () => void;
};
const PedidoDetalleModal = ({ pedido, onClose }: PedidoDetalleModalProps) => {
  const subtotalProductos = (pedido.productos || []).reduce((acc, prod) => acc + (prod.precio || 0), 0);

  const puedeDescargarFactura = pedido.estado === "TERMINADO" || pedido.estado === "ENTREGADO";

  const handleDescargarFactura = async () => {
    if (!puedeDescargarFactura) {
      alert("La factura estará disponible cuando el pedido esté TERMINADO.");
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/api/facturas/pdf/${pedido.id}`);
      if (!res.ok) {
        alert("No se pudo descargar la factura.");
        return;
      }
      const blob = await res.blob();
      saveAs(blob, `factura_pedido_${pedido.numeroPedido}.pdf`);
    } catch (err) {
      alert("Error al descargar la factura.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-20 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-lg p-6 min-w-[320px] max-w-md relative" onClick={e => e.stopPropagation()}>
        <button className="absolute top-3 right-3 text-xl text-gray-400 hover:text-tertiary" onClick={onClose}>
          &times;
        </button>
        <h2 className="text-xl font-bold mb-4 text-secondary">Detalle del Pedido</h2>
        <div className="mb-2"><b>Fecha:</b> {pedido.fecha}</div>
        {pedido.hora && <div className="mb-2"><b>Hora:</b> {pedido.hora}</div>}
        <div className="mb-2"><b>N° Pedido:</b> {pedido.numeroPedido}</div>
        <div className="mb-2"><b>Importe Total:</b> {formatPrecio(pedido.importeTotal)}</div>
        {pedido.estado && <div className="mb-2"><b>Estado:</b> {pedido.estado}</div>}
        {pedido.direccionEntrega && <div className="mb-2"><b>Dirección de Entrega:</b> {pedido.direccionEntrega}</div>}
        <div className="mb-2"><b>Productos:</b></div>
        <ul className="list-disc ml-5 mt-1">
          {(pedido.productos || []).map((prod, i) =>
            prod.detallePromo ? (
              <li key={i} style={{ marginBottom: 8 }}>
                <span>
                  <b>{prod.nombre}</b> (x{prod.cantidad}) - {formatPrecio(prod.precio)}
                </span>
                <ul className="ml-4 mt-1 list-circle text-gray-700">
                  {prod.detallePromo.map((item, idx) => (
                    <li key={idx}>
                      {item.nombre} x{item.cantidad}
                    </li>
                  ))}
                </ul>
              </li>
            ) : (
              <li key={i}>
                {prod.nombre} x{prod.cantidad} - {formatPrecio(prod.precio)}
              </li>
            )
          )}
        </ul>
        <div className="mt-3 border-t pt-2 text-sm text-gray-600">
          <div><b>Subtotal productos:</b> {formatPrecio(subtotalProductos)}</div>
          {pedido.costoEnvio ? <div><b>Costo de envío:</b> {formatPrecio(pedido.costoEnvio)}</div> : null}
          <div><b>Total del pedido:</b> {formatPrecio(pedido.importeTotal)}</div>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleDescargarFactura}
            disabled={!puedeDescargarFactura}
            className={`bg-secondary hover:bg-secondary/80 text-white font-bold rounded-lg px-4 py-2 shadow ${!puedeDescargarFactura ? "opacity-50 cursor-not-allowed" : ""}`}
            title={!puedeDescargarFactura ? "La factura estará disponible cuando el pedido esté TERMINADO." : "Descargar factura"}
          >
            Descargar Factura
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Página principal ---
const ClientesEstadisticas = () => {
  const { clienteId } = useParams<{ clienteId: string }>();
  const [paginaActual, setPaginaActual] = useState(1);
  const [pedidos, setPedidos] = useState<PedidoCliente[]>([]);
  const [clienteNombre, setClienteNombre] = useState<string>("");
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState<PedidoCliente | null>(null);

  const [fechaDesde, setFechaDesde] = useState<string>("");
  const [fechaHasta, setFechaHasta] = useState<string>("");

  useEffect(() => {
    if (!clienteId) return;
    fetch(`${API_BASE}/api/clientes/${clienteId}`)
      .then(async res => {
        const text = await res.text();
        try {
          const json = JSON.parse(text);
          setClienteNombre(json.nombreCompleto || json.nombre || "");
        } catch {
          setClienteNombre("");
        }
      })
      .catch(() => setClienteNombre(""));

    let pedidosUrl = `${API_BASE}/api/pedidos/cliente/${clienteId}`;
    const params: string[] = [];
    if (fechaDesde) params.push(`fechaDesde=${fechaDesde}`);
    if (fechaHasta) params.push(`fechaHasta=${fechaHasta}`);
    if (params.length > 0) pedidosUrl += "?" + params.join("&");

    fetch(pedidosUrl)
      .then(async res => {
        const text = await res.text();
        try {
          const data = JSON.parse(text);
          if (!Array.isArray(data)) { setPedidos([]); return; }
          let mapped: PedidoCliente[] = data
            .filter((pedido: any) => pedido.estado === "ENTREGADO") // SOLO pedidos ENTREGADO
            .map((pedido: any) => {
              const productos: ProductoPedido[] = [];
              if (Array.isArray(pedido.detallePedidos)) {
                pedido.detallePedidos.forEach((detalle: any) => {
                  if (detalle.producto) {
                    productos.push({
                      nombre: detalle.producto.denominacion,
                      cantidad: detalle.cantidad,
                      precio: detalle.subTotal ?? (detalle.cantidad * (detalle.producto?.precioVenta || 0)),
                    });
                  } else if (detalle.insumo) {
                    productos.push({
                      nombre: detalle.insumo.denominacion,
                      cantidad: detalle.cantidad,
                      precio: detalle.subTotal ?? (detalle.cantidad * (detalle.insumo?.precioVenta || 0)),
                    });
                  } else if (detalle.promocion && detalle.promocion.detallePromociones) {
                    const detallePromo = detalle.promocion.detallePromociones.map((dp: any) =>
                      dp.producto
                        ? { nombre: dp.producto.denominacion, cantidad: detalle.cantidad * dp.cantidad }
                        : dp.insumo
                        ? { nombre: dp.insumo.denominacion, cantidad: detalle.cantidad * dp.cantidad }
                        : { nombre: "Producto/insumo desconocido", cantidad: detalle.cantidad }
                    );
                    productos.push({
                      nombre: detalle.promocion.denominacion,
                      cantidad: detalle.cantidad,
                      precio: detalle.subTotal ?? 0,
                      detallePromo,
                    });
                  } else {
                    productos.push({
                      nombre: "Producto/insumo desconocido",
                      cantidad: detalle.cantidad,
                      precio: detalle.subTotal ?? 0,
                    });
                  }
                });
              }
              return {
                id: pedido.id,
                fecha: pedido.fecha,
                hora: pedido.hora,
                numeroPedido: pedido.codigo,
                importeTotal: pedido.totalVenta,
                estado: pedido.estado,
                tipoEnvio: pedido.tipoEnvio,
                formaPago: pedido.formaPago,
                direccionEntrega: pedido.domicilio
                  ? `${pedido.domicilio.calle} ${pedido.domicilio.numero}, ${pedido.domicilio.localidad}`
                  : "",
                costoEnvio: pedido.costoEnvio,
                productos
              };
            });

          if (fechaDesde) mapped = mapped.filter(p => p.fecha >= fechaDesde);
          if (fechaHasta) mapped = mapped.filter(p => p.fecha <= fechaHasta);

          mapped.sort((a, b) => {
            const dateA = parseDateTime(a.fecha, a.hora);
            const dateB = parseDateTime(b.fecha, b.hora);
            return dateB.getTime() - dateA.getTime();
          });

          setPedidos(mapped);
        } catch {
          setPedidos([]);
        }
      })
      .catch(() => setPedidos([]));

    setPaginaActual(1);
  }, [clienteId, fechaDesde, fechaHasta]);

  const totalPaginas = Math.ceil((pedidos.length || 0) / PEDIDOS_POR_PAGINA);
  const pedidosAMostrar = pedidos.slice(
    (paginaActual - 1) * PEDIDOS_POR_PAGINA,
    paginaActual * PEDIDOS_POR_PAGINA
  );

  const irPaginaAnterior = () => setPaginaActual(Math.max(1, paginaActual - 1));
  const irPaginaSiguiente = () => setPaginaActual(Math.min(totalPaginas, paginaActual + 1));

  // --- EXPORTAR EXCEL ---
  const handleExportarExcel = async () => {
    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet("Pedidos del cliente");

    const encabezado = [
      "N° Pedido", "Fecha", "Hora", "Estado", "Forma de Pago",
      "Tipo Envío", "Dirección Entrega", "Costo Envío", "Importe Total", "Productos"
    ];
    ws.addRow(encabezado);

    ws.getRow(1).eachCell(cell => {
      cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4373B9' } };
      cell.alignment = { vertical: "middle", horizontal: "center" };
      cell.border = { bottom: { style: 'thin' } };
    });

    ws.columns = [
      { width: 14 }, { width: 12 }, { width: 8 }, { width: 14 }, { width: 18 },
      { width: 14 }, { width: 30 }, { width: 12 }, { width: 16, style: { numFmt: '"$"#,##0.00;[Red]\\-"$"#,##0.00' } }, { width: 40 }
    ];

    pedidos.forEach(pedido => {
      const productosStr = (pedido.productos || [])
        .map(p =>
          p.detallePromo
            ? `${p.nombre} (x${p.cantidad}) - ${formatPrecio(p.precio)} [${p.detallePromo.map(x => `${x.nombre} x${x.cantidad}`).join(", ")}]`
            : `${p.nombre} (x${p.cantidad}) - ${formatPrecio(p.precio)}`
        ).join("; ");
      ws.addRow([
        pedido.numeroPedido,
        pedido.fecha,
        pedido.hora || "",
        pedido.estado || "",
        pedido.formaPago || "",
        pedido.tipoEnvio || "",
        pedido.direccionEntrega || "",
        pedido.costoEnvio ?? "",
        pedido.importeTotal,
        productosStr
      ]);
    });

    ws.getColumn(8).numFmt = '"$"#,##0.00;[Red]\\-"$"#,##0.00';
    ws.getColumn(9).numFmt = '"$"#,##0.00;[Red]\\-"$"#,##0.00';

    if (clienteNombre) {
      const wsInfo = wb.addWorksheet("Info cliente");
      wsInfo.addRow(["Cliente", clienteNombre]);
      wsInfo.getRow(1).eachCell(cell => {
        cell.font = { bold: true };
        cell.alignment = { vertical: "middle", horizontal: "left" };
      });
      wsInfo.columns = [{ width: 12 }, { width: 35 }];
    }

    const buffer = await wb.xlsx.writeBuffer();
    saveAs(new Blob([buffer], { type: "application/octet-stream" }), `pedidos_cliente_${clienteNombre || clienteId}.xlsx`);
  };

  return (
    <div className="min-h-screen bg-primary pb-10">
      <AdminHeader text="Estadísticas" />
      <div className="w-full flex flex-col items-center mt-8">
        <div className="bg-white w-full md:w-4/5 rounded-2xl shadow-md p-5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-3">
            <span className="text-tertiary font-black text-lg text-center flex-1">
              Pedidos de <b>{clienteNombre || clienteId}</b>
            </span>
            <div className="flex items-center gap-2">
              <input
                type="date"
                className="border rounded-lg px-4 py-2 text-sm bg-white"
                placeholder="dd/mm/aaaa"
                style={{ minWidth: 140 }}
                value={fechaDesde}
                onChange={e => setFechaDesde(e.target.value)}
                max={fechaHasta || undefined}
              />
              <span>al</span>
              <input
                type="date"
                className="border rounded-lg px-4 py-2 text-sm bg-white"
                placeholder="dd/mm/aaaa"
                style={{ minWidth: 140 }}
                value={fechaHasta}
                onChange={e => setFechaHasta(e.target.value)}
                min={fechaDesde || undefined}
              />
              <button
                className="cursor-pointer ml-3 flex items-center gap-2 bg-[#ff9c3a] hover:bg-[#ff9c3ac2] text-dark font-black px-4 py-2 rounded-lg shadow"
                onClick={handleExportarExcel}
              >
                <span>Exportar</span>
                <PiMicrosoftExcelLogo size={24} />
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left rounded-2xl">
              <thead>
                <tr className="text-tertiary font-bold border-b">
                  <th className="py-2 px-3">Fecha</th>
                  <th className="py-2 px-3">N° Pedido</th>
                  <th className="py-2 px-3">Envío</th>
                  <th className="py-2 px-3">Importe Total</th>
                  <th className="py-2 px-3">F. Pago</th>
                  <th className="py-2 px-3 text-center"></th>
                </tr>
              </thead>
              <tbody>
                {pedidosAMostrar.length > 0 ? pedidosAMostrar.map((pedido, idx) => (
                  <tr
                    key={pedido.id ?? pedido.numeroPedido + "_" + idx}
                    className="border-b last:border-b-0 hover:bg-gray-50"
                  >
                    <td className="py-2 px-3">{formatFecha(pedido.fecha)} {pedido.hora ? <span className="text-xs text-gray-500">{pedido.hora}</span> : ""}</td>
                    <td className="py-2 px-3">#{pedido.numeroPedido}</td>
                    <td className="py-2 px-3">{pedido.tipoEnvio ?? "—"}</td>
                    <td className="py-2 px-3">
                      {formatPrecio(pedido.importeTotal)}
                    </td>
                    <td className="py-2 px-3">{pedido.formaPago ?? "—"}</td>
                    <td className="py-2 px-3 text-center">
                      <button
                        className="bg-tertiary hover:bg-[#ff9c3ac2] text-dark font-bold rounded-2xl px-4 py-1"
                        onClick={() => setPedidoSeleccionado(pedido)}
                      >
                        Detalle
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={6} className="text-center text-gray-400 py-4">
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
                className="cursor-pointer px-3 py-1 rounded text-white font-medium bg-secondary disabled:opacity-50 transition duration-150 hover:scale-105"
              >
                Anterior
              </button>
              <span>
                Página {paginaActual} de {totalPaginas}
              </span>
              <button
                onClick={irPaginaSiguiente}
                disabled={paginaActual === totalPaginas}
                className="cursor-pointer px-3 py-1 rounded text-white font-medium bg-secondary disabled:opacity-50 transition duration-150 hover:scale-105"
              >
                Siguiente
              </button>
            </div>
          )}
        </div>
        {pedidoSeleccionado && (
          <PedidoDetalleModal
            pedido={pedidoSeleccionado}
            onClose={() => setPedidoSeleccionado(null)}
          />
        )}
      </div>
    </div>
  );
};

export default ClientesEstadisticas;