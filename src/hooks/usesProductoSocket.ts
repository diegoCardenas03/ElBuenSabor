import { useEffect } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { ProductoResponseDTO } from "../types/Producto/ProductoResponseDTO";

const WS_URL = "https://42f2-38-51-31-203.ngrok-free.app/ws";
type Callback = (producto: ProductoResponseDTO) => void;

export function useProductoSocket(onProductoActualizado: Callback) {
  useEffect(() => {
    const stompClient = new Client({
      webSocketFactory: () => new WebSocket(WS_URL),
      onConnect: () => {
        console.log("📡 Conectado a WebSocket (Productos)");
        stompClient.subscribe("/topic/productos", (message) => {
          const producto = JSON.parse(message.body);
          console.log("📬 Producto actualizado:", producto);
          onProductoActualizado(producto);
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