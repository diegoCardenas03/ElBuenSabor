import { useEffect, useState } from "react";
import { AdminHeader } from "../../components/admin/AdminHeader"
import { Rol } from '../../types/enums/Rol'
import pedidosRetirar from './pedidosRetirar.json'; // importa tu json local
import { TfiAngleUp } from "react-icons/tfi";

// Simulación de pedidos en curso
const pedidosCursoInicial = [
  {
    "id": 3,
    "tipoEnvio": "DELIVERY",
    "formaPago": "MERCADO_PAGO",
    "comentario": "HOLA",
    "clienteId": 1,
    "domicilioId": 1,
    "fechaHora": "2025-06-12T21:15:00Z",
    "estado": "En Curso",
    "detallePedidos": [
      {
        "cantidad": 4,
        "productoId": "Papas Chicas con Queos"
      }
    ]
  }
];

const Delivery = () => {
  const [opcionPrincipal, setOpcionPrincipal] = useState<string>("Retirar");
  const [pedidosRetiro, setPedidosRetiro] = useState<any[]>(pedidosRetirar);
  const [pedidosCurso, setPedidosCurso] = useState<any[]>(pedidosCursoInicial);
  const [pedidos, setPedidos] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [desplegableAbierto, setDesplegableAbierto] = useState<{ [key: number]: boolean }>({})

  const elegirOpcionPrincipal = (opcion: string) => {
    setOpcionPrincipal(opcion);
  }

  // Cambia el estado del desplegable para el pedido seleccionado
  const toggleDesplegable = (id: number) => {
    setDesplegableAbierto(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  }

  // Cambia el estado del pedido a "En Curso" y lo mueve a la lista de En Curso
  const tomarPedido = (id: number) => {
    const pedidoTomado = pedidosRetiro.find(p => p.id === id);
    if (!pedidoTomado) return;
    const pedidoActualizado = { ...pedidoTomado, estado: "En Curso" };

    setPedidosRetiro(prev => prev.filter(p => p.id !== id));
    setPedidosCurso(prev => [...prev, pedidoActualizado]);

    // Si está viendo "Retirar", actualizar la lista visible
    if (opcionPrincipal === "Retirar") {
      setPedidos(prev => prev.filter(p => p.id !== id));
    }
  };

  useEffect(() => {
    setLoading(true);
    setError(null);
    try {
      if (opcionPrincipal === "Retirar") {
        setPedidos(pedidosRetiro);
      } else {
        setPedidos(pedidosCurso);
      }
    } catch (err) {
      setError("Error al cargar los pedidos");
    } finally {
      setLoading(false);
    }
  }, [opcionPrincipal, pedidosRetiro, pedidosCurso]);

  return (
    <>
      <AdminHeader rol={Rol.ADMIN} text="Delivery" />

      <main className="flex flex-col items-center w-full m-auto pt-10 min-h-screen pb-20 bg-primary font-primary">
        <div className='flex justify-around w-4/5 gap-5 mb-10'>
          <button className={`text-tertiary font-bold text-lg cursor-pointer w-[200px] py-2 rounded-4xl ${opcionPrincipal === "Retirar"
            ? 'bg-white shadow-lg'
            : ''
            }`} onClick={() => elegirOpcionPrincipal("Retirar")}>Retirar</button>

          <button className={`text-tertiary font-bold text-lg cursor-pointer w-[200px] py-2 rounded-4xl ${opcionPrincipal === "Curso"
            ? 'bg-white shadow-lg'
            : ''
            }`} onClick={() => elegirOpcionPrincipal("Curso")}>En Curso</button>
        </div>

        <div className="w-4/5 ">
          {loading && <p>Cargando Pedidos...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {!loading && !error && (
            <ul className="w-full flex flex-col items-center gap-10">
              {pedidos.length === 0 && <li>No hay pedidos.</li>}
              {pedidos.map((pedido) => (
                <li key={pedido.id} className="bg-white w-full flex flex-col items-center rounded-3xl py-5">
                  <p className="center font-tertiary text-xl text-secondary">Orden #{pedido.id}</p>
                  <div className="flex justify-around w-full items-center">
                    <p>
                      <strong>Hora de pedido:</strong>{" "}
                      {pedido.fechaHora
                        ? new Date(pedido.fechaHora).toLocaleTimeString()
                        : pedido.fecha
                          ? new Date(pedido.fecha).toLocaleTimeString()
                          : "--"}
                    </p>
                    <button className="ml-2" onClick={() => toggleDesplegable(pedido.id)} aria-label="Mostrar detalles">
                      <TfiAngleUp className={`transition-transform duration-200 ${desplegableAbierto[pedido.id] ? "rotate-180" : ""}`} size={24} />
                    </button>
                  </div>
                  <hr className="w-60 mb-4" />
                  {/* Desplegable */}
                  {desplegableAbierto[pedido.id] && (
                    <div className="w-full px-3 flex flex-col gap-2 py-3 mt-1">
                      <p><strong>Cliente:</strong> {pedido.clienteId}</p>
                      <p><strong>Teléfono:</strong> {pedido.telefono}</p>
                      <p><strong>Detalles:</strong> {pedido.estado}</p>
                      {Array.isArray(pedido.detallePedidos) && pedido.detallePedidos.map((detalle: any, i: number) => (
                        <div key={i} className=" ml-4 flex items-center gap-2">
                          <span>{detalle.cantidad}x</span>
                          <strong>{detalle.productoId}</strong>
                        </div>
                      ))}
                      <p><strong>Dirección:</strong> {pedido.domicilioId ?? "Sin datos"}</p>
                    </div>
                  )}
                  {opcionPrincipal === "Retirar" ? (
                    <button className="self-end mr-2 w-30 font-medium py-1 bg-secondary rounded-2xl text-white" onClick={() => tomarPedido(pedido.id)} > Tomar Pedido </button>
                  ):(
                    <button className="self-end mr-2 w-30 font-medium py-1 bg-secondary rounded-2xl text-white" > Entregado </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </>
  )
}

export default Delivery