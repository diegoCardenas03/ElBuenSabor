import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { InsumoResponseDTO } from "../../types/Insumo/InsumoResponseDTO";
import { InsumoService } from "../../services/InsumoService";
import Swal from "sweetalert2";
import { FaTimes } from "react-icons/fa";
import "./ModalInsumo.css"; 

interface CompraItem {
  insumoId: number;
  cantidad: number;
  precioCosto: number;
}

interface ModalCompraProps {
  open: boolean;
  setOpen: (state: boolean) => void;
  insumos: InsumoResponseDTO[];
  onCompraExitosa: () => void;
}

export const ModalCompra = ({
  open,
  setOpen,
  insumos,
  onCompraExitosa,
}: ModalCompraProps) => {
  const [items, setItems] = useState<CompraItem[]>([
    { insumoId: 0, cantidad: 1, precioCosto: 0 },
  ]);
  const api = new InsumoService();
  const token = sessionStorage.getItem('auth_token');

  const handleChange = (index: number, field: keyof CompraItem, value: string | number) => {
    const nuevos = [...items];
    nuevos[index][field] =
      field === "insumoId" ? Number(value) : Number(value);
    setItems(nuevos);
  };

  const agregarFila = () => {
    setItems([...items, { insumoId: 0, cantidad: 1, precioCosto: 0 }]);
  };

  const handleClose = () => {
    setOpen(false);
    setItems([{ insumoId: 0, cantidad: 1, precioCosto: 0 }]);
  };

  const guardarCompra = async () => {
    try {
      for (const item of items) {
        const insumo = insumos.find((i) => i.id === item.insumoId);
        if (!insumo) continue;
        await api.patch(insumo.id, {
          id: insumo.id,
          denominacion: insumo.denominacion,
          urlImagen: insumo.urlImagen,
          precioCosto: item.precioCosto,
          precioVenta: insumo.precioVenta,
          stockActual: insumo.stockActual + item.cantidad,
          stockMinimo: insumo.stockMinimo,
          esParaElaborar: insumo.esParaElaborar,
          activo: insumo.activo,
          unidadMedida: insumo.unidadMedida,
          rubroId: Number(insumo.rubro.id),
          descripcion: insumo.descripcion,
        }, token!);
      }
      Swal.fire("¡Compra registrada!", "El stock fue actualizado.", "success");
      handleClose();
      onCompraExitosa();
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "No se pudo registrar la compra.", "error");
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle sx={{ position: "relative", px: 4, py: 2 }}>
        <button
          onClick={handleClose}
          className="absolute top-7 right-4 text-gray-500 hover:text-red-600"
          style={{
            background: "none",
            border: "none",
            position: "absolute",
            right: 20,
            top: 24,
            cursor: "pointer",
            zIndex: 10,
          }}
        >
          <FaTimes className="text-secondary h-6 w-6 cursor-pointer" />
        </button>
        <p
          className="font-tertiary"
          style={{
            color: "#c62828",
            fontWeight: "bold",
            fontSize: "2rem",
            textAlign: "center",
          }}
        >
          REGISTRAR COMPRA DE INSUMOS
        </p>
      </DialogTitle>
      <DialogContent dividers>
        {items.map((item, index) => {
          const insumo = insumos.find((i) => i.id === item.insumoId);
          return (
            <div
              key={index}
              style={{
                display: "flex",
                gap: "30px",
                alignItems: "end",
                marginBottom: 15,
              }}
            >
              <div>
                <label
                  htmlFor={`insumoId-${index}`}
                  style={{
                    fontWeight: "bold",
                    fontSize: "14px",
                    color: "black",
                    fontFamily: "sans-serif",
                  }}
                >
                  Insumo:
                </label>
                <TextField
                  select
                  id={`insumoId-${index}`}
                  name="insumoId"
                  value={item.insumoId}
                  onChange={(e) =>
                    handleChange(index, "insumoId", e.target.value)
                  }
                  sx={{
                    minWidth: 220,
                    marginRight: 1,
                    marginTop: 1,
                    fontFamily: "sans-serif",
                  }}
                >
                  <MenuItem value={0}>Seleccione...</MenuItem>
                  {insumos.map((i) => (
                    <MenuItem key={i.id} value={i.id}>
                      {i.denominacion}
                    </MenuItem>
                  ))}
                </TextField>
              </div>
              {insumo && (
                <Typography
                  variant="body2"
                  sx={{
                    width: 130,
                    marginBottom: "7px",
                    color: "#424242",
                    fontWeight: "bold",
                    fontFamily: "sans-serif",
                  }}
                >
                  Unidad: {insumo.unidadMedida}
                </Typography>
              )}
              <div>
                <label
                  htmlFor={`cantidad-${index}`}
                  style={{
                    fontWeight: "bold",
                    fontSize: "14px",
                    color: "black",
                    fontFamily: "sans-serif",
                  }}
                >
                  Cantidad:
                </label>
                <TextField
                  id={`cantidad-${index}`}
                  name="cantidad"
                  type="number"
                  value={item.cantidad}
                  onChange={(e) =>
                    handleChange(index, "cantidad", e.target.value)
                  }
                  sx={{
                    width: 120,
                    marginRight: 1,
                    marginTop: 1,
                    fontFamily: "sans-serif",
                  }}
                    inputProps={{ min: 1, step: "0.01" }}
                />
              </div>
              <div>
                <label
                  htmlFor={`precioCosto-${index}`}
                  style={{
                    fontWeight: "bold",
                    fontSize: "14px",
                    color: "black",
                    fontFamily: "sans-serif",
                  }}
                >
                  Precio unitario ($):
                </label>
                <TextField
                  id={`precioCosto-${index}`}
                  name="precioCosto"
                  type="number"
                  value={item.precioCosto}
                  onChange={(e) =>
                    handleChange(index, "precioCosto", e.target.value)
                  }
                  sx={{
                    width: 160,
                    marginTop: 1,
                    fontFamily: "sans-serif",
                  }}
                 inputProps={{ min: 0, step: "0.01" }}
                />
              </div>
            </div>
          );
        })}
        <Button
          onClick={agregarFila}
          variant="outlined"
          sx={{
            mt: 2,
            borderRadius: "25px",
            borderColor: "#f9a825",
            color: "#f9a825",
            fontWeight: "bold",
            fontFamily: "sans-serif",
            "&:hover": { borderColor: "#f57f17", color: "#f57f17" },
          }}
        >
          + Agregar otro insumo
        </Button>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "space-between", p: 2 }}>
        <Button
          onClick={handleClose}
          sx={{
            fontWeight: "bold",
            textDecoration: "underline",
            color: "#000",
            fontFamily: "sans-serif",
          }}
        >
          Cancelar
        </Button>
        <Button
          onClick={guardarCompra}
          variant="contained"
          sx={{
            backgroundColor: "#f9a825",
            color: "white",
            fontWeight: "bold",
            fontFamily: "sans-serif",
            "&:hover": { backgroundColor: "#f57f17" },
            px: 4,
            borderRadius: "25px",
          }}
        >
          Confirmar Compra
        </Button>
      </DialogActions>
    </Dialog>
  );
};