import { useEffect, useState } from "react";
import { PromocionService } from "../services/PromocionService";
import { PromocionResponseDTO } from "../types/Promocion/PromocionResponseDTO";

export const usePromocionesPopulares = () => {
  const [promociones, setPromociones] = useState<PromocionResponseDTO[]>([]);

  useEffect(() => {
    const promocionService = new PromocionService();
    promocionService.getAll().then((data) => {
      const activas = data.filter((promo: PromocionResponseDTO) => promo.activo);
      setPromociones(activas.slice(0, 4)); // Solo las primeras 4
    });
  }, []);

  return promociones;
}
