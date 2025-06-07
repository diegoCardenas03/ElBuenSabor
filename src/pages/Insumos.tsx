import { FaSlidersH } from "react-icons/fa";
import TablaInsumos from "../components/TablaInsumos";
const Insumos = () => {
    const insumos = [
        {
            nombre: "Harina",
            precio: "$1.00",
            cantidad: 50,
            unidad: "kg",
            categoria: "Secos",
            stockMin: 10,
            paraPreparacion: true,
            activo: true,
        },
        {
            nombre: "Tomate",
            precio: "$0.50",
            cantidad: 20,
            unidad: "kg",
            categoria: "Frescos",
            stockMin: 5,
            paraPreparacion: true,
            activo: true,
        },
        {
            nombre: "Tomate",
            precio: "$0.50",
            cantidad: 19,
            unidad: "kg",
            categoria: "Frescos",
            stockMin: 20,
            paraPreparacion: true,
            activo: false,
        },
    ];
  return (
    <div className="min-h-screen bg-[#FFF4E0] relative overflow-hidden font-sans">
        <div>
            <input type="text" placeholder="Buscar insumo..." className="rounded-full bg-white font-primary" />
            <button className="bg-[#BD1E22] text-white px-4 py-2 rounded-full ml-2 font-primary"><FaSlidersH /></button>
            <button className="text-[#BD1E22] underline font-primary">Borrar filtros</button>
        </div>
        <div>
            <button className="bg-[#BD1E22] text-white rounded-full font-primary">+ Crear insumo</button>
        </div>
        <TablaInsumos insumos={insumos} />
    </div>

);
}
export default Insumos;