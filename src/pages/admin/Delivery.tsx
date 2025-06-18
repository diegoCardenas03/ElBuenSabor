import { useEffect, useState } from "react";
import { AdminHeader } from "../../components/admin/AdminHeader";
import { Rol } from '../../types/enums/Rol';
import { TfiAngleUp } from "react-icons/tfi";

const Delivery = () => {
  const [opcionPrincipal, setOpcionPrincipal] = useState<"Retirar" | "Curso">("Retirar");
  const [pedidos, setPedidos] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [desplegableAbierto, setDesplegableAbierto] = useState<{ [key: number]: boolean }>({});

  const elegirOpcionPrincipal = (opcion: "Retirar" | "Curso") => {
    setOpcionPrincipal(opcion);
  };

  const toggleDesplegable = (id: number) => {
    setDesplegableAbierto(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // FUNCIÓN para cambiar el estado del pedido
  const actualizarEstadoPedido = async (pedidoId: number, nuevoEstado: string) => {
    setLoading(true);
    setError(null);
    try {
      const resp = await fetch(
        `http://localhost:8080/api/pedidos/actualizar-estado/${pedidoId}?estado=${nuevoEstado}`,
        { method: "PUT" }
      );
      if (!resp.ok) throw new Error("No se pudo actualizar el estado");
      // Esperamos que el backend actualice correctamente el pedido, así que recargamos la lista
      await fetchPedidos();
    } catch (err) {
      setError("Error al actualizar el estado del pedido");
    } finally {
      setLoading(false);
    }
  };

  // Extraemos fetchPedidos para poder usarlo en otros lados
  const fetchPedidos = async () => {
    setLoading(true);
    setError(null);
    try {
      let url = '';
      if (opcionPrincipal === "Retirar") {
        url = 'http://localhost:8080/api/pedidos/estado?estado=TERMINADO';
      } else {
        url = 'http://localhost:8080/api/pedidos/estado?estado=EN_CAMINO';
      }
      const resp = await fetch(url);
      const data = await resp.json();
      setPedidos(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("Error al cargar los pedidos");
      setPedidos([]);
    } finally {
      setLoading(false);
    }
  };

  // useEffect para cargar pedidos cuando cambia la opción principal
  useEffect(() => {
    fetchPedidos();
    // eslint-disable-next-line
  }, [opcionPrincipal]);

  return (
    <>
      <AdminHeader rol={Rol.ADMIN} text="Delivery" />
      <main className="flex flex-col items-center w-full m-auto pt-10 min-h-screen pb-20 bg-primary font-primary">
        <div className='flex justify-around w-4/5 gap-5 mb-10'>
          <button className={`text-tertiary font-bold text-lg cursor-pointer w-[200px] py-2 rounded-4xl ${opcionPrincipal === "Retirar" ? 'bg-white shadow-lg' : ''}`} onClick={() => elegirOpcionPrincipal("Retirar")} > Retirar </button>
          <button className={`text-tertiary font-bold text-lg cursor-pointer w-[200px] py-2 rounded-4xl ${opcionPrincipal === "Curso" ? 'bg-white shadow-lg' : ''}`} onClick={() => elegirOpcionPrincipal("Curso")} > En Curso </button>
        </div>
        <div className="w-4/5 ">
          {loading && <p>Cargando Pedidos...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {!loading && !error && (
            <ul className="w-full flex flex-col items-center gap-10">
              {Array.isArray(pedidos) && pedidos.length === 0 && <li>No hay pedidos.</li>}
              {Array.isArray(pedidos) && pedidos.map((pedido) => (
                <li key={pedido.id} className="bg-white w-full flex flex-col items-center rounded-3xl py-5">
                  <p className="center font-tertiary text-xl px-2 text-secondary">Orden #{pedido.codigo ?? pedido.id}</p>
                  <div className="flex justify-around w-full items-center">
                    <p>
                      <strong>Hora de pedido:</strong>{" "}
                      {pedido.fecha && pedido.hora
                        ? new Date(`${pedido.fecha}T${pedido.hora}`).toLocaleTimeString()
                        : "--"}
                    </p>
                    <button className="ml-2" onClick={() => toggleDesplegable(pedido.id)} aria-label="Mostrar detalles">
                      <TfiAngleUp className={`transition-transform duration-200 ${desplegableAbierto[pedido.id] ? "rotate-180" : ""}`} size={24} />
                    </button>
                  </div>
                  <hr className="w-60 mb-4" />
                  {desplegableAbierto[pedido.id] && (
                    <div className="w-full px-3 flex flex-col gap-2 py-3 mt-1">
                      <p><strong>Cliente:</strong> {pedido.cliente?.nombreCompleto ?? "Sin datos"}</p>
                      <p><strong>Teléfono:</strong> {pedido.cliente?.telefono ?? "Sin datos"}</p>
                      <p><strong>Detalles:</strong> {pedido.estado}</p>
                      {Array.isArray(pedido.detallePedidos) && pedido.detallePedidos.map((detalle: any, i: number) => (
                        <div key={i} className=" ml-4 flex items-center gap-2">
                          <span>{detalle.cantidad}x</span>
                          <strong>{detalle.producto ? detalle.producto.denominacion : "Sin producto"}</strong>
                        </div>
                      ))}
                      <p><strong>Dirección:</strong> {pedido.domicilio ? `${pedido.domicilio.calle} ${pedido.domicilio.numero}, ${pedido.domicilio.localidad}` : "Sin datos"}</p>
                    </div>
                  )}
                  {opcionPrincipal === "Retirar" ? (
                    <button
                      className="self-end mr-2 w-30 font-medium py-1 bg-secondary rounded-2xl text-white cursor-pointer transition-colors hover:bg-red-500"
                      onClick={() => actualizarEstadoPedido(pedido.id, "EN_CAMINO")}
                    >
                      Tomar Pedido
                    </button>
                  ) : (
                    <button
                      className="self-end mr-2 w-30 font-medium py-1 bg-secondary rounded-2xl text-white cursor-pointer transition-colors hover:bg-red-500"
                      onClick={() => actualizarEstadoPedido(pedido.id, "ENTREGADO")}
                    >
                      Entregado
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </>
  );
};

export default Delivery;