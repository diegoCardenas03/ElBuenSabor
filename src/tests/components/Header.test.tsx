import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { Header } from '../../components/Header';

describe('Header', () => {

    test('muestra el logo', () => {
        render(<Header />);
        expect(screen.getByAltText(/logo el buen sabor/i)).toBeInTheDocument();
    });
    test('muestra el logo y el nombre de usuario', () => {
        render(<Header nombreUsuario="Usuario Test" />);
        expect(screen.getAllByText(/Usuario Test/i).length).toBeGreaterThan(0);
    });
    test('llama a onBackClick cuando se hace click en VOLVER', () => {
        const onBackClick = vi.fn();
        render(<Header onBackClick={onBackClick} />);
        const volver = screen.getByText(/VOLVER/i);
        fireEvent.click(volver);
        expect(onBackClick).toHaveBeenCalled();
    });
});