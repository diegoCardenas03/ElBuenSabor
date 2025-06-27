import { useEffect, useState } from "react";
import { AdminHeader } from "../../components/admin/AdminHeader";
import { TfiAngleUp } from "react-icons/tfi";
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const markerIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconSize: [25,41],
  iconAnchor: [12,41],
});

const Delivery = () => {
  const [opcionPrincipal, setOpcionPrincipal] = useState<"Retirar"|"Curso">("Retirar");
  const [pedidos, setPedidos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [desplegableAbierto, setDesplegableAbierto] = useState<{[key:number]:boolean}>({});

  const elegirOpcionPrincipal = (op: "Retirar"|"Curso") => {
    setOpcionPrincipal(op);
  };
  const toggleDesplegable = (id:number) => {
    setDesplegableAbierto(prev => ({...prev,[id]:!prev[id]}));
  };

  const fetchPedidos = async () => {
    setLoading(true); setError(null);
    try {
      const estado = opcionPrincipal==="Retirar"?"TERMINADO":"EN_CAMINO";
      const resp = await fetch(`http://localhost:8080/api/pedidos/estado?estado=${estado}`);
      const data = await resp.json();
      setPedidos(Array.isArray(data) ? data : []);
    } catch {
      setError("Error al cargar los pedidos");
      setPedidos([]);
    } finally { setLoading(false); }
  };

  const actualizarEstadoPedido = async (pedidoId:number, nuevoEstado:string) => {
    setLoading(true); setError(null);
    try {
      const resp = await fetch(`http://localhost:8080/api/pedidos/actualizar-estado/${pedidoId}?estado=${nuevoEstado}`, { method: 'PUT' });
      if (!resp.ok) throw new Error();
      await fetchPedidos();
    } catch {
      setError("Error al actualizar estado");
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchPedidos(); }, [opcionPrincipal]);

  return (
    <>
      <AdminHeader text="Delivery" />
      <main className="flex flex-col items-center w-full m-auto pt-10 min-h-screen pb-20 bg-primary font-primary">
        <div className="flex justify-around w-4/5 gap-5 mb-10">
          <button onClick={() => elegirOpcionPrincipal("Retirar")}
                  className={`text-tertiary font-bold text-lg w-[200px] py-2 rounded-4xl ${opcionPrincipal==="Retirar"?"bg-white shadow-lg":""}`}>
            Retirar
          </button>
          <button onClick={() => elegirOpcionPrincipal("Curso")}
                  className={`text-tertiary font-bold text-lg w-[200px] py-2 rounded-4xl ${opcionPrincipal==="Curso"?"bg-white shadow-lg":""}`}>
            En Curso
          </button>
        </div>
        <div className="w-4/5">
          {loading && <p>Cargando Pedidos...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {!loading && !error && (
            <ul className="w-full flex flex-col items-center gap-10">
              {pedidos.length===0 ? <li>No hay pedidos.</li> : pedidos.map(pedido => (
                <li key={pedido.id} className="bg-white w-full flex flex-col items-center rounded-3xl py-5">
                  <p className="font-tertiary text-xl text-secondary">Orden #{pedido.codigo||pedido.id}</p>
                  <div className="flex justify-around w-full items-center">
                    <p>
                      <strong>Hora de pedido:</strong> {pedido.fecha&&pedido.hora ? new Date(`${pedido.fecha}T${pedido.hora}`).toLocaleTimeString() : "--"}
                    </p>
                    <button onClick={() => toggleDesplegable(pedido.id)}>
                      <TfiAngleUp className={`transition-transform duration-200 ${desplegableAbierto[pedido.id]?"rotate-180":""}`} size={24}/>
                    </button>
                  </div>
                  <hr className="w-60 mb-4" />

                  {desplegableAbierto[pedido.id] && (
                    <div className="w-full px-3 flex flex-col gap-2 py-3 mt-1">
                      <p><strong>Cliente:</strong> {pedido.cliente?.nombreCompleto||"Sin datos"}</p>
                      <p><strong>Teléfono:</strong> {pedido.cliente?.telefono||"Sin datos"}</p>
                      <p><strong>Estado:</strong> {pedido.estado}</p>
                      {Array.isArray(pedido.detallePedidos) && pedido.detallePedidos.map((d:any,i:number)=>(
                        <div key={i} className="ml-4 flex items-center gap-2">
                          <span>{d.cantidad}x</span><strong>{d.producto?.denominacion||"Sin producto"}</strong>
                        </div>
                      ))}
                      <p><strong>Dirección:</strong> {pedido.domicilio ? `${pedido.domicilio.calle} ${pedido.domicilio.numero}, ${pedido.domicilio.localidad}` : "Sin datos"}</p>
                      {pedido.domicilio?.latitud && pedido.domicilio?.longitud && (
                        <MapContainer
                          center={[pedido.domicilio.latitud, pedido.domicilio.longitud]}
                          zoom={15}
                          scrollWheelZoom={false}
                          dragging={false}
                          style={{height:'200px',width:'100%',borderRadius:'10px',marginTop:'0.5rem'}}
                        >
                          <TileLayer
                            attribution='&copy; OpenStreetMap contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                          />
                          <Marker position={[pedido.domicilio.latitud, pedido.domicilio.longitud]} icon={markerIcon}/>
                        </MapContainer>
                      )}
                    </div>
                  )}

                  {opcionPrincipal==="Retirar" ? (
                    <button className="self-end mr-2 w-30 font-medium py-1 bg-secondary text-white rounded-2xl hover:bg-red-500"
                            onClick={() => actualizarEstadoPedido(pedido.id, "EN_CAMINO")}>
                      Tomar Pedido
                    </button>
                  ) : (
                    <button className="self-end mr-2 w-30 font-medium py-1 bg-secondary text-white rounded-2xl hover:bg-red-500"
                            onClick={() => actualizarEstadoPedido(pedido.id, "TERMINADO")}>
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
