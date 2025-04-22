import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MenuLayout } from '../../layouts/MenuLayout';

describe('MenuLayout', () => {
  const onSearch = vi.fn();

  test('renderiza el título y el buscador', () => {
    render(
      <MenuLayout onSearch={onSearch}>
        <div>Contenido de prueba</div>
      </MenuLayout>
    );
    expect(screen.getByText(/MENÚ/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Buscar por nombre/i)).toBeInTheDocument();
    expect(screen.getByText(/Contenido de prueba/i)).toBeInTheDocument();
  });

  test('llama a onSearch al escribir en el input', () => {
    render(
      <MenuLayout onSearch={onSearch}>
        <div />
      </MenuLayout>
    );
    const input = screen.getByPlaceholderText(/Buscar por nombre/i);
    fireEvent.change(input, { target: { value: 'pizza' } });
    expect(onSearch).toHaveBeenCalledWith('pizza');
  });

  test('abre el modal de filtros al hacer click en el botón de filtros', () => {
    render(
      <MenuLayout onSearch={onSearch}>
        <div />
      </MenuLayout>
    );
    const filterBtn = screen.getByRole('button', { name: '' }); 
    fireEvent.click(filterBtn);
  });

  test('renderiza el Footer', () => {
    render(
      <MenuLayout onSearch={onSearch}>
        <div />
      </MenuLayout>
    );
    expect(screen.getByText(/El Buen Sabor/i)).toBeInTheDocument(); 
  });
});