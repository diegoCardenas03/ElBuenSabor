export interface DetallePedido {
    id: number;
    cantidad: number;
    subTotal: number;
    pedidoId: number;
    productoId: number;
    insumoId: number;
}