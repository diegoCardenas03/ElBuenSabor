import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Categories } from '../../../features/products/Categories';

const categories = [
  { name: 'Pizzas', image: 'pizza.jpg' },
  { name: 'Empanadas', image: 'empanada.jpg' },
];

describe('Categories', () => {
  test('muestra todas las categorías', () => {
    render(<Categories categories={categories} onSelectCategory={vi.fn()} />);
    expect(screen.getByText(/Pizzas/i)).toBeInTheDocument();
    expect(screen.getByText(/Empanadas/i)).toBeInTheDocument();
    expect(screen.getByAltText(/Pizzas/i)).toBeInTheDocument();
    expect(screen.getByAltText(/Empanadas/i)).toBeInTheDocument();
  });

  test('llama a onSelectCategory al hacer click en una categoría', () => {
    const onSelectCategory = vi.fn();
    render(<Categories categories={categories} onSelectCategory={onSelectCategory} />);
    fireEvent.click(screen.getByText(/Empanadas/i));
    expect(onSelectCategory).toHaveBeenCalledWith('Empanadas');
  });

  test('resalta la categoría seleccionada', () => {
    render(
      <Categories
        categories={categories}
        selectedCategory="Pizzas"
        onSelectCategory={vi.fn()}
      />
    );
    const selectedButton = screen.getByText(/Pizzas/i).closest('button');
    expect(selectedButton).toHaveClass('bg-[#9e1c1c]');
  });
});