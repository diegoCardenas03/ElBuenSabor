import { FaPencilAlt, FaAngleUp } from "react-icons/fa";
import { RubroInsumoDTO } from '../../types/RubroInsumo/RubroInsumoDTO';
import { RubroProductoDTO } from '../../types/RubroProducto/RubroProductoDTO';
import Switch from '@mui/material/Switch';
import { styled } from '@mui/material/styles';

type RubroInsumo = RubroInsumoDTO & {
  id: number;
  subRubros: RubroInsumo[];
  tipo: "Insumo";
};
type RubroProducto = RubroProductoDTO & {
  id: number;
  tipo: "Producto";
};
type Rubro = RubroInsumo | RubroProducto;

interface CategoriasListaProps {
  opcionFiltrar: "Insumo" | "Producto" | "";
  filteredInsumos: RubroInsumo[];
  filteredProductos: RubroProducto[];
  abiertos: { [id: number]: boolean };
  toggleAbierto: (id: number) => void;
  handleEditar: (rubro: Rubro) => void;
  handleActivarDesactivar: (rubro: Rubro) => void;
}

// Switch personalizado verde para activo, gris para desactivo
const GreenGraySwitch = styled(Switch)(({ theme }) => ({
  '& .MuiSwitch-switchBase.Mui-checked': {
    color: '#22c55e', // verde-500 tailwind
    '&:hover': {
      backgroundColor: 'rgba(34,197,94,0.08)',
    },
  },
  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
    backgroundColor: '#22c55e', // verde-500 tailwind
  },
  '& .MuiSwitch-switchBase': {
    color: '#a3a3a3', // gris-400 tailwind
    '&:hover': {
      backgroundColor: 'rgba(163,163,163,0.08)',
    },
  },
  '& .MuiSwitch-track': {
    backgroundColor: '#a3a3a3', // gris-400 tailwind
  },
}));

const CategoriasLista = ({
  opcionFiltrar,
  filteredInsumos,
  filteredProductos,
  abiertos,
  toggleAbierto,
  handleEditar,
  handleActivarDesactivar,
}: CategoriasListaProps) => {

  const RubroItem = ({
    rubro,
    nivel = 0,
    abierto,
    onToggle,
  }: { rubro: Rubro; nivel?: number; abierto?: boolean; onToggle?: () => void; }) => (
    <div className="w-full">
      <div className="flex items-center h-10">
        <div
          className={`w-1/2 pl-10 flex items-center gap-5 ${!rubro.activo ? "text-gray-400 italic" : ""}`}
          style={{ marginLeft: `${rubro.tipo === "Insumo" ? nivel * 20 : 0}px` }}
        >
          <p className="underline">{rubro.denominacion}</p>
          {!rubro.activo && (
            <span className="ml-2 text-xs bg-gray-200 px-2 rounded">Desactivado</span>
          )}
        </div>
        <div className="flex justify-end w-full pr-10 gap-5 items-center">
          <GreenGraySwitch
            checked={!!rubro.activo}
            onChange={() => handleActivarDesactivar(rubro)}
            inputProps={{ 'aria-label': 'switch activar/desactivar' }}
          />
          {rubro.activo && (
            <FaPencilAlt className="cursor-pointer hover:text-tertiary" onClick={() => handleEditar(rubro)} />
          )}
          {rubro.tipo === "Insumo" && (rubro as RubroInsumo).subRubros.length > 0 && (
            <FaAngleUp onClick={onToggle} className={`cursor-pointer h-5 ${abierto ? "" : "rotate-180"}`} />
          )}
        </div>
      </div>
      {rubro.tipo === "Insumo" && abierto && (
        <div className="ml-5">
          {(rubro as RubroInsumo).subRubros.map((subrubro) => (
            <RubroItem
              key={subrubro.id}
              rubro={subrubro}
              nivel={nivel + 1}
              abierto={abiertos[subrubro.id]}
              onToggle={() => toggleAbierto(subrubro.id)}
            />
          ))}
        </div>
      )}
    </div>
  );

  return (
    <ul className='w-8/10'>
      {opcionFiltrar === "Insumo" && filteredInsumos.map((rubro) => (
        <li className='border-b-1 mt-2 underline-offset-6 font-semibold text-md' key={rubro.id}>
          <RubroItem rubro={rubro} abierto={abiertos[rubro.id]} onToggle={() => toggleAbierto(rubro.id)} />
        </li>
      ))}
      {opcionFiltrar === "Producto" && filteredProductos.map((rubro) => (
        <li className='border-b-1 mt-2 underline-offset-6 font-semibold text-md' key={rubro.id}>
          <RubroItem rubro={rubro} />
        </li>
      ))}
    </ul>
  );
};

export default CategoriasLista;