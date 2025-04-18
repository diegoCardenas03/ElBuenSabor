import React from 'react';

interface BotonProps {
  texto: string;
  onClick?: () => void;
  ancho?: string;
  alto?: string;
  colorFondo?: string;
  colorTexto?: string;
  rounded?: string;
  className?: string;
}

const Confirmar: React.FC<BotonProps> = ({
  texto,
  onClick,
  ancho = 'w-40',
  alto = 'h-10',
  colorFondo = 'bg-red-700',
  colorTexto = 'text-white',
  rounded = 'rounded-md',
  className = ''
}) => {
  return (
    <button
      onClick={onClick}
      className={`${ancho} ${alto} ${colorFondo} ${colorTexto} ${rounded} font-normal shadow-sm hover:brightness-110 transition-all ${className}`}
    >
      {texto}
    </button>
  );
};

export default Confirmar;
