import { useEffect } from "react";

import { Client } from "@stomp/stompjs";
import { InsumoResponseDTO } from "../types/Insumo/InsumoResponseDTO";

const WS_URL = "https://42f2-38-51-31-203.ngrok-free.app/ws";
type Callback = (insumo: InsumoResponseDTO) => void;

export function useInsumoSocket(onInsumoActualizado: Callback) {
  useEffect(() => {
    const stompClient = new Client({
      webSocketFactory: () => new WebSocket(WS_URL),
      onConnect: () => {
        console.log("📡 Conectado a WebSocket (Insumos)");
        stompClient.subscribe("/topic/insumos", (message) => {
          const insumo = JSON.parse(message.body);
          console.log("📬 Insumo actualizado:", insumo);
          onInsumoActualizado(insumo);
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