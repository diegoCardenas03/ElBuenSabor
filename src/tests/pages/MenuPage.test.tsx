import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MenuPage } from '../../pages/MenuPage';

describe('MenuPage', () => {
  test('renderiza el título del menú', () => {
    render(<MenuPage />);
    expect(screen.getByText(/MENÚ/i)).toBeInTheDocument();
  });

  test('renderiza el buscador', () => {
    render(<MenuPage />);
    expect(screen.getByPlaceholderText(/Buscar por nombre/i)).toBeInTheDocument();
  });

  test('renderiza el Footer', () => {
    render(<MenuPage />);
    expect(screen.getByText(/El Buen Sabor/i)).toBeInTheDocument();
  });

});