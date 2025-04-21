import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { Navbar } from '../../components/Navbar';

describe('Navbar', () => {
  const defaultProps = {
    open: true,
    onClose: vi.fn(),
    usuarioLogeado: true,
    nombreUsuario: 'Usuario Test',
  };

  test('no renderiza si el usuario no está logeado', () => {
    render(<Navbar {...defaultProps} usuarioLogeado={false} />);
    expect(screen.queryByText(/Usuario Test/i)).not.toBeInTheDocument();
  });

  test('muestra el nombre de usuario y los links principales', () => {
    render(<Navbar {...defaultProps} />);
    expect(screen.getByText(/Usuario Test/i)).toBeInTheDocument();
    expect(screen.getByText(/Mi Perfil/i)).toBeInTheDocument();
    expect(screen.getByText(/Mis Ordenes/i)).toBeInTheDocument();
    expect(screen.getByText(/Mis Direcciones/i)).toBeInTheDocument();
    expect(screen.getByText(/Menu/i)).toBeInTheDocument();
    expect(screen.getByText(/Contactanos/i)).toBeInTheDocument();
    expect(screen.getByText(/Cerrar Sesion/i)).toBeInTheDocument();
  });

  test('llama a onClose al hacer click en el icono de cerrar', () => {
    render(<Navbar {...defaultProps} />);
    const closeBtn = screen.getByAltText(/cerrar navbar/i);
    fireEvent.click(closeBtn);
    expect(defaultProps.onClose).toHaveBeenCalled();
  });
});