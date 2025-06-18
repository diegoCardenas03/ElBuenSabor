import { useEffect, useState } from "react";
import { PromocionService } from "../services/PromocionService";
import { PromocionResponseDTO } from "../types/Promocion/PromocionResponseDTO";

export const usePromocionesPopulares = () => {
  const [promociones, setPromociones] = useState<PromocionResponseDTO[]>([]);

  useEffect(() => {
    const promocionService = new PromocionService();
    promocionService.getAll().then((data) => {
      setPromociones(data.slice(0, 4)); // Solo las primeras 4
    });
  }, []);

  return promociones;
};
