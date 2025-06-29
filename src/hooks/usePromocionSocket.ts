import { useEffect } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { PromocionResponseDTO } from "../types/Promocion/PromocionResponseDTO";

const WS_URL = "https://42f2-38-51-31-203.ngrok-free.app/ws";
type Callback = (promocion: PromocionResponseDTO) => void;

export function usePromocionSocket(onPromocionActualizado: Callback) {
  useEffect(() => {
    const stompClient = new Client({
      webSocketFactory: () => new WebSocket(WS_URL),
      onConnect: () => {
        console.log("📡 Conectado a WebSocket (Promociones)");
        stompClient.subscribe("/topic/promociones", (message) => {
          const promocion = JSON.parse(message.body);
          console.log("📬 Promoción actualizada:", promocion);
          onPromocionActualizado(promocion);
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