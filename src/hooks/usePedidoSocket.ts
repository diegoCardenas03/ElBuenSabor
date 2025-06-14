import { useEffect } from "react";
import  SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { PedidoResponseDTO } from "../types/Pedido/PedidoResponseDTO";

const WS_URL = "http://localhost:8080/ws-pedidos"; // Cambia si tu backend está en otra URL

type Callback = (pedido: PedidoResponseDTO) => void;

export function usePedidosSocket(onPedidoActualizado: Callback) {
  useEffect(() => {
    const stompClient = new Client({
      webSocketFactory: () => new SockJS(WS_URL) as any,
      onConnect: () => {
        stompClient.subscribe("/topic/pedidos", (message) => {
          const pedido = JSON.parse(message.body);
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