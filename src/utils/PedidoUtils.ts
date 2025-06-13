import { Estado } from '../types/enums/Estado';
import { TipoEnvio } from '../types/enums/TipoEnvio';
import { FormaPago } from '../types/enums/FormaPago';

export const mostrarSoloNumero = (codigo: string) => {
  const partes = codigo.split("-");
  return partes[partes.length - 1];
};

export const getEstadoTexto = (estado: Estado) => {
  switch (estado) {
    case Estado.SOLICITADO:
      return "Solicitado";
    case Estado.PENDIENTE:
      return "Pendiente";
    case Estado.EN_PREPARACION:
      return "En preparación";
    case Estado.EN_CAMINO:
      return "En camino";
    case Estado.ENTREGADO:
      return "Entregado";
    default:
      return "Desconocido";
  }
};

export const getTipoEnvioTexto = (tipoEnvio: TipoEnvio) => {
  switch (tipoEnvio) {
    case TipoEnvio.DELIVERY:
      return "Delivery";
    case TipoEnvio.RETIRO_LOCAL:
      return "Retiro en local";
    default:
      return "Desconocido";
  }
};

export const getFormaPagoTexto = (formaPago: FormaPago) => {
  switch (formaPago) {
    case FormaPago.MERCADO_PAGO:
      return "Mercado Pago";
    case FormaPago.EFECTIVO:
      return "Efectivo";
    default:
      return "Desconocido";
  }
};