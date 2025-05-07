import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { ProductFilterModal } from '../../../features/products/ProductFilterModal';

const defaultProps = {
  isOpen: true,
  onClose: vi.fn(),
  onApply: vi.fn(),
  initialFilters: { order: '', bestseller: false },
};

describe('ProductFilterModal', () => {
  test('no renderiza nada si isOpen es false', () => {
    render(<ProductFilterModal {...defaultProps} isOpen={false} />);
    expect(screen.queryByText(/Filtrar productos/i)).not.toBeInTheDocument();
  });

  test('muestra el título y los chips', () => {
    render(<ProductFilterModal {...defaultProps} />);
    expect(screen.getByText(/Filtrar productos/i)).toBeInTheDocument();
    expect(screen.getByText(/Menor a mayor precio/i)).toBeInTheDocument();
    expect(screen.getByText(/Mayor a menor precio/i)).toBeInTheDocument();
    expect(screen.getByText(/Más vendidos/i)).toBeInTheDocument();
  });

  test('activa y desactiva un chip al hacer click', () => {
    render(<ProductFilterModal {...defaultProps} />);
    const menorChip = screen.getByText(/Menor a mayor precio/i);
    fireEvent.click(menorChip);
    expect(menorChip).toHaveClass('font-semibold');
    // Al hacer click de nuevo se desactiva
    fireEvent.click(menorChip);
    expect(menorChip).not.toHaveClass('font-semibold');
  });

  test('llama a onApply y onClose al hacer click en "Aplicar"', () => {
    const onApply = vi.fn();
    const onClose = vi.fn();
    render(
      <ProductFilterModal
        {...defaultProps}
        onApply={onApply}
        onClose={onClose}
      />
    );
    fireEvent.click(screen.getByText(/Aplicar/i));
    expect(onApply).toHaveBeenCalled();
    expect(onClose).toHaveBeenCalled();
  });

  it('limpia los filtros al hacer click en "Limpiar"', () => {
    render(
      <ProductFilterModal
        {...defaultProps}
        initialFilters={{ order: 'asc', bestseller: true }}
      />
    );
    fireEvent.click(screen.getByText(/Limpiar/i));
    // Los chips deberían estar desactivados
    expect(screen.getByText(/Menor a mayor precio/i)).not.toHaveClass('font-semibold');
    expect(screen.getByText(/Más vendidos/i)).not.toHaveClass('font-semibold');
  });
});