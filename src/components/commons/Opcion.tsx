interface OpcionProps {
  texto: string;
  onClick?: () => void;
  ancho?: string;
  alto?: string;
  colorFondo?: string;
  colorTexto?: string;
  rounded?: string;
  fontWeight?: string;
  className?: string;
  estaActiva?: boolean;
  fontSize?: string;
}

const Opcion: React.FC<OpcionProps> = ({
  texto,
  onClick,
  ancho = 'w-40',
  alto = 'h-10',
  colorFondo = 'bg-transparent',
  colorTexto = 'text-tertiary',
  rounded = 'rounded-3xl',
  className = '',
  estaActiva = false,
  fontWeight = 'font-bold',
  fontSize = 'text-base'
}) => {
  return (
    <button
      onClick={onClick}
      className={`
        transition duration-300 cursor-pointer ease-in-out
        ${fontSize} ${fontWeight} ${ancho} ${alto} 
        ${colorTexto} ${rounded}
        ${estaActiva 
          ? 'bg-white shadow-md border-transparent' 
          : `${colorFondo} border border-gray-300 hover:bg-white hover:shadow-md`}
        ${className}
      `}
    >
      {texto}
    </button>
  );
};

export default Opcion;