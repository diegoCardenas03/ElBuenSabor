import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import MisDirecciones from '../../pages/MisDirecciones';

describe('MisDirecciones', () => {
  test('muestra las direcciones iniciales', () => {
    render(<MisDirecciones />);
    expect(screen.getAllByText(/Av. San Martin 123/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Calle Falsa 456/i).length).toBeGreaterThan(0);
  });

  test('abre el modal al hacer clic en Agregar Dirección', () => {
    render(<MisDirecciones />);
    fireEvent.click(screen.getByText(/Agregar Direccion/i));
    expect(screen.getByText(/Agregar nueva dirección/i)).toBeInTheDocument();
  });

  test('agrega una nueva dirección', async () => {
    render(<MisDirecciones />);
    fireEvent.click(screen.getByText(/Agregar Direccion/i));
    fireEvent.change(screen.getByPlaceholderText(/Calle/i), { target: { value: 'Av Libertador' } });
    fireEvent.change(screen.getByPlaceholderText(/Número/i), { target: { value: '999' } });
    fireEvent.change(screen.getByPlaceholderText(/Ciudad/i), { target: { value: 'Buenos Aires' } });
    fireEvent.click(screen.getByText(/Guardar/i));

    await waitFor(() => {
        expect(screen.getAllByText(/Av Libertador 999, Buenos Aires/i).length).toBeGreaterThan(0);
    });
  });

  test('elimina una dirección', async () => {
    render(<MisDirecciones />);
    const eliminarButtons = await screen.findAllByText(/Eliminar/i);
    fireEvent.click(eliminarButtons[0]);

    await waitFor(() => {
        expect(screen.queryByText(/Av. San Martin 123/i)).not.toBeInTheDocument();
    });
  });
});