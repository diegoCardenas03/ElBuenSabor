import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ProductModal } from '../../../features/products/ProductModal';

const product = {
    name: 'Pizza',
    price: 1200,
    image: 'pizza.jpg',
    description: 'Deliciosa pizza de muzzarella',
};

describe('ProductModal', () => {
    test('no renderiza nada si isOpen es false', () => {
        render(
            <ProductModal
                product={product}
                isOpen={false}
                onClose={vi.fn()}
                onAddToCart={vi.fn()}
            />
        );
        expect(screen.queryByText(/Pizza/i)).not.toBeInTheDocument();
    });

    test('muestra la información del producto cuando isOpen es true', () => {
        render(
            <ProductModal
                product={product}
                isOpen={true}
                onClose={vi.fn()}
                onAddToCart={vi.fn()}
            />
        );
        expect(screen.getAllByText(/Pizza/i).length).toBeGreaterThan(0);
        expect(screen.getByText(/\$1200/i)).toBeInTheDocument();
        expect(screen.getByText(/Deliciosa pizza de muzzarella/i)).toBeInTheDocument();
        expect(screen.getByRole('img', { name: /Pizza/i })).toBeInTheDocument();
        expect(screen.getByText(/Añadir al carrito/i)).toBeInTheDocument();
    });

    test('llama a onClose al hacer click en la X', () => {
        const onClose = vi.fn();
        render(
            <ProductModal
                product={product}
                isOpen={true}
                onClose={onClose}
                onAddToCart={vi.fn()}
            />
        );
        fireEvent.click(screen.getByRole('button', { name: /✕/i }));
        expect(onClose).toHaveBeenCalled();
    });

    test('llama a onAddToCart al hacer click en "Añadir al carrito"', () => {
        const onAddToCart = vi.fn();
        render(
            <ProductModal
                product={product}
                isOpen={true}
                onClose={vi.fn()}
                onAddToCart={onAddToCart}
            />
        );
        fireEvent.click(screen.getByText(/Añadir al carrito/i));
        expect(onAddToCart).toHaveBeenCalled();
    });
});