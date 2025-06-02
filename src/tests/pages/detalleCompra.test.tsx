import { fireEvent, render, screen } from '@testing-library/react';
import DetalleCompra from '../../pages/DetalleCompra';
import '@testing-library/jest-dom';

describe('DetalleCompra', () => {
  test('muestra datos iniciales correctamente', () => {
    render(<DetalleCompra />);

    expect(screen.getAllByText(/Av\. San Martin 123/i).length).toBeGreaterThan(0);

    const efectivoRadio = screen.getByLabelText(/efectivo/i) as HTMLInputElement;
    const mercadoPagoRadio = screen.getByLabelText(/mercado pago/i) as HTMLInputElement;

    expect(efectivoRadio.checked).toBe(true);
    expect(mercadoPagoRadio.checked).toBe(false);

    fireEvent.click(mercadoPagoRadio);

    expect(efectivoRadio.checked).toBe(false);
    expect(mercadoPagoRadio.checked).toBe(true);
  });
});