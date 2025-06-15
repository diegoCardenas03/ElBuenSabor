import { useEffect } from "react";
import  SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { PedidoResponseDTO } from "../types/Pedido/PedidoResponseDTO";

const WS_URL = "https://6428-38-51-31-203.ngrok-free.app/ws"; 
type Callback = (pedido: PedidoResponseDTO) => void;

export function usePedidosSocket(onPedidoActualizado: Callback) {
  useEffect(() => {
    const stompClient = new Client({
      webSocketFactory: () => new SockJS(WS_URL) as any,
      onConnect: () => {
        console.log("📡 Conectado a WebSocket");
        stompClient.subscribe("/topic/pedidos", (message) => {
          const pedido = JSON.parse(message.body);
          console.log("📬 Pedido actualizado:", pedido);
          onPedidoActualizado(pedido);
        });
      },
      debug: () => {},
      reconnectDelay: 5000,
    });
    stompClient.activate();
    return () => {
      stompClient.deactivate();
    };
    // eslint-disable-next-line
  }, []);
}