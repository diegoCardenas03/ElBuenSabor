import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Footer } from '../../components/Footer';

describe('Footer', () => {
  test('renderiza la dirección', () => {
    render(<Footer />);
    expect(screen.getByText(/Av Belgrano 671, Mendoza, Argentina/i)).toBeInTheDocument();
  });

  test('renderiza el texto de copyright', () => {
    render(<Footer />);
    expect(screen.getByText(/El buen sabor. ©Designed byteam/i)).toBeInTheDocument();
  });

  test('renderiza los iconos de redes sociales', () => {
    render(<Footer />);
    expect(screen.getByAltText(/Icono Instagram/i)).toBeInTheDocument();
    expect(screen.getByAltText(/Icono Twitter/i)).toBeInTheDocument();
    expect(screen.getByAltText(/Icono Facebook/i)).toBeInTheDocument();
  });
});