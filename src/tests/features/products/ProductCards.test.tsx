import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { ProductCards } from '../../../features/products/ProductCards';

const products = [
  { id: 1, name: 'Pizza', price: 1200, image: 'pizza.jpg' },
  { id: 2, name: 'Empanada', price: 300, image: 'empanada.jpg' },
];

describe('ProductCards', () => {
    test('muestra todos los productos', () => {
    render(<ProductCards products={products} />);
    expect(screen.getByText(/Pizza/i)).toBeInTheDocument();
    expect(screen.getByText(/Empanada/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Añadir/i).length).toBe(2);
  });

  test('llama a onCardClick al hacer click en una card', () => {
    const onCardClick = vi.fn();
    render(<ProductCards products={products} onCardClick={onCardClick} />);
    fireEvent.click(screen.getByText(/Pizza/i));
    expect(onCardClick).toHaveBeenCalledWith(products[0]);
  });

  test('muestra el precio de cada producto', () => {
    render(<ProductCards products={products} />);
    expect(screen.getByText(/\$1200/i)).toBeInTheDocument();
    expect(screen.getByText(/\$300/i)).toBeInTheDocument();
  });

  test('muestra la imagen de cada producto', () => {
    render(<ProductCards products={products} />);
    expect(screen.getByAltText(/Pizza/i)).toBeInTheDocument();
    expect(screen.getByAltText(/Empanada/i)).toBeInTheDocument();
  });
});