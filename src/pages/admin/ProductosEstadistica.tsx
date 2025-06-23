import { useEffect, useState, ChangeEvent } from "react";
import { AdminHeader } from "../../components/admin/AdminHeader";
import { PiMicrosoftExcelLogo } from "react-icons/pi";

// El tipo puede ser así, adaptalo si tu DTO es distinto
type ProductoRanking = {
  denominacion: string;
  cantidadCompras: number;
  importeTotal: number;
};

type PedidoResponseDTO = {
  detallePedidos: {
    cantidad: number;
    producto: {
      denominacion: string;
      id: number;
      // ...otros campos si quieres
    };
    subtotal: number;
  }[];
  fecha: string;
  totalVenta: number;
  // ...otros campos
};

const ProductosEstadistica = () => {
  const [fechaDesde, setFechaDesde] = useState<string>("");
  const [fechaHasta, setFechaHasta] = useState<string>("");
  const [productos, setProductos] = useState<ProductoRanking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Paginación
  const [pagina, setPagina] = useState<number>(1);
  const filasPorPagina = 10;

  useEffect(() => {
    const fetchProductos = async () => {
      setLoading(true);
      try {
        let url = "http://localhost:8080/api/pedidos/estado?estado=ENTREGADO";
        const resp = await fetch(url);
        if (!resp.ok) throw new Error("Error al consultar pedidos entregados");
        const pedidos: PedidoResponseDTO[] = await resp.json();

        // Filtra por fecha si corresponde
        let pedidosFiltrados = pedidos;
        if (fechaDesde) pedidosFiltrados = pedidosFiltrados.filter(p => p.fecha >= fechaDesde);
        if (fechaHasta) pedidosFiltrados = pedidosFiltrados.filter(p => p.fecha <= fechaHasta);

        // Acumula compras por producto
        const productosMap: Record<string, ProductoRanking> = {};
        pedidosFiltrados.forEach(pedido => {
          pedido.detallePedidos.forEach(detalle => {
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
          });
        });

        // Convierte el map a array y ordena por cantidad/compras
        const productosArray = Object.values(productosMap).sort((a, b) => b.cantidadCompras - a.cantidadCompras);

        setProductos(productosArray);
      } catch (e) {
        setProductos([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProductos();
  }, [fechaDesde, fechaHasta]);

  // Lógica paginación
  const totalPaginas = Math.max(1, Math.ceil(productos.length / filasPorPagina));
  const productosPagina = productos.slice((pagina - 1) * filasPorPagina, pagina * filasPorPagina);

  const handleAnterior = () => {
    if (pagina > 1) setPagina(pagina - 1);
  };

  const handleSiguiente = () => {
    if (pagina < totalPaginas) setPagina(pagina + 1);
  };

  const handleFechaDesde = (e: ChangeEvent<HTMLInputElement>) => {
    setFechaDesde(e.target.value);
    setPagina(1);
  };
  const handleFechaHasta = (e: ChangeEvent<HTMLInputElement>) => {
    setFechaHasta(e.target.value);
    setPagina(1);
  };

  return (
    <>
      <AdminHeader showBackButton text="Estadísticas" />
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
          <button className="cursor-pointer ml-auto flex items-center gap-2 bg-[#ff9c3a] hover:bg-[#ff9c3ac2] text-dark font-black px-4 py-2 rounded-lg shadow">
            <span>Exportar</span>
            <PiMicrosoftExcelLogo size={24} />
          </button>
        </div>

        {/* Tabla de ranking */}
        <div className="bg-white w-full max-w-4xl rounded-2xl shadow-md p-5">
          {/* Título */}
          <div className="flex justify-center mb-2">
            <div className="px-5 py-1 rounded-t-2xl bg-[#fff3e3] border-b-2 border-[#ff9c3a] font-bold text-[#d61c1c] text-lg">
              Ranking Productos Cocina
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left rounded-2xl">
              <thead>
                <tr className="text-[#d61c1c] font-bold border-b border-gray-300">
                  <th className="py-2 px-3">Nombre</th>
                  <th className="py-2 px-3 text-center">Cantidad de compras</th>
                  <th className="py-2 px-3 text-center">Importe Total</th>
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
                      <td className="py-2 px-3">{producto.denominacion}</td>
                      <td className="py-2 px-3 text-center">{producto.cantidadCompras}</td>
                      <td className="py-2 px-3 text-center">
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
              ({pagina} <span className="text-[#d61c1c] font-bold">/</span> {totalPaginas})
            </span>
            <button
              className={`w-7 h-7 rounded-full font-bold border border-gray-300 text-[#d61c1c] disabled:opacity-40`}
              onClick={handleAnterior}
              disabled={pagina === 1}
            >{"<"}</button>
            <button
              className={`w-7 h-7 rounded-full font-bold border border-gray-300 text-[#d61c1c] disabled:opacity-40`}
              onClick={handleSiguiente}
              disabled={pagina === totalPaginas}
            >{">"}</button>
          </div>
        </div>
      </main>
    </>
  );
};

export default ProductosEstadistica;