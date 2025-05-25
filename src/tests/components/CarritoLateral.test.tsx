import { render, screen, waitFor } from '@testing-library/react';
import CarritoLateral from '../../components/commons/CarritoLateral';
import axios from 'axios';
import React from 'react';
import { vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';

// Mock de axios
vi.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('CarritoLateral', () => {
    const mockDetallePedido = [
        { id: 1, productoId: "burger", cantidad: 1, subTotal: 100, pedidoId: 1, insumoId: 1 },
        { id: 2, productoId: "pizza", cantidad: 1, subTotal: 200, pedidoId: 1, insumoId: 2 },
    ];

    beforeEach(() => {
        vi.clearAllMocks();
    });

    test('muestra mensaje de carga al renderizar', async () => {
        mockedAxios.get.mockResolvedValue({ data: mockDetallePedido });

        render(
            <MemoryRouter>
                <CarritoLateral onClose={() => { }} />
            </MemoryRouter>
        );

        expect(screen.getByText('Cargando pedido...')).toBeInTheDocument();

        // Esperar a que desaparezca el loading
        await waitFor(() => {
            expect(screen.queryByText('Cargando pedido...')).not.toBeInTheDocument();
        });
    });

    test('muestra los productos del pedido una vez cargados', async () => {
        mockedAxios.get.mockResolvedValue({ data: mockDetallePedido });

        render(
            <MemoryRouter>
                <CarritoLateral onClose={() => { }} />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('burger')).toBeInTheDocument();
            expect(screen.getByText('Subtotal: $100')).toBeInTheDocument();
            expect(screen.getByText('pizza')).toBeInTheDocument();
            expect(screen.getByText('Subtotal: $200')).toBeInTheDocument();
        });
    });

    test('muestra mensaje de error si la API falla', async () => {
        mockedAxios.get.mockRejectedValue(new Error('API falló'));

        render(
            <MemoryRouter>
                <CarritoLateral onClose={() => { }} />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('Error al cargar los detalles del pedido')).toBeInTheDocument();
        });
    });
});
