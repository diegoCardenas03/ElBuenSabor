import { usePromocionesPopulares } from "../hooks/usePromocionesPopulares"
import { ProductCards } from "../features/products/ProductCards";

const PromocionesPopulares = () => {
  const promociones = usePromocionesPopulares();

  return <ProductCards products={promociones} />;
};

export default PromocionesPopulares;
