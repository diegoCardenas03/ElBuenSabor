import { PedidoDTO } from "../../types/Pedido/PedidoDTO";
import PreferenceMP from "../../types/PreferenceMP";

export async function createPreferenceMP(pedido?: PedidoDTO) {
  const urlServer = "http://localhost:8080/api/mercado-pago/create-preference";
  const method: string = "POST";
  const response = await fetch(urlServer, {
    method: method,
    body: JSON.stringify(pedido),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const preferenceMP = await response.json() as PreferenceMP;
  // console.log("PreferenceMP recibido:", preferenceMP);
  return preferenceMP;
}  