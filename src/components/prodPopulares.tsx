import { ProductCards } from "../features/products/ProductCards";
import { products } from "../utils/products/productsData.ts"; // Cambiado a "products"

const ProdPopulares = () => {
    return (
        <div className="flex flex-col items-center justify-center mt-10 mb-10">
            <ProductCards showBadges products={products.slice(0, 4)} /> {/* Cambiado a "products" */}
        </div>
    );
};

export default ProdPopulares;