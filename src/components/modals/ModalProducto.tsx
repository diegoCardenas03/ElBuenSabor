import * as Yup from "yup";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { removeElementActive } from "../../hooks/redux/slices/TableReducer";
import { UnidadMedida } from "../../types/enums/UnidadMedida";
import { ProductoDTO } from "../../types/Producto/ProductoDTO";
import TextFieldValue from "../TextFildValue/TextFildValue";
import SelectField from "../SelectField/SelectField";
import { useEffect, useState } from "react";
import { RubroInsumoResponseDTO } from "../../types/RubroInsumo/RubroInsumoResponseDTO";
import { DetalleProductoDTO } from "../../types/DetalleProducto/DetalleProductoDTO";
const API_URL = import.meta.env.VITE_API_URL;
import "./ModalInsumo.css";

interface IModalProducto {
  getProductos: () => void;
  openModal: boolean;
  setOpenModal: (state: boolean) => void;
}

export const ModalProducto = ({
  getProductos,
  openModal,
  setOpenModal,
}: IModalProducto) => {
  const dispatch = useAppDispatch();
  const elementActive = useAppSelector(
    (state) => state.tablaReducer.elementActive
  );
  // Cambia esto por tu servicio real de productos
  const apiProducto = {
    post: async (data: any) => fetch(`${API_URL}/productos`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }),
    patch: async (id: number, data: any) => fetch(`${API_URL}/productos/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }),
  };

  const [rubros, setRubros] = useState<RubroInsumoResponseDTO[]>([]);
  const [insumos, setInsumos] = useState<any[]>([]);
  const [insumoId, setInsumoId] = useState<number>(0);
  const [cantidad, setCantidad] = useState<number>(1);

  useEffect(() => {
    fetch(`${API_URL}/rubros`)
      .then((res) => res.json())
      .then((data) => setRubros(data));
  }, []);

  useEffect(() => {
    fetch(`${API_URL}/insumos`)
      .then((res) => res.json())
      .then((data) => setInsumos(data));
  }, []);

  const unidadMedidaOptions = Object.values(UnidadMedida).map((value) => ({
    value,
    label: value,
  }));

  const initialValues: ProductoDTO = elementActive
    ? elementActive
    : {
      denominacion: "",
      urlImagen: "",
      descripcion: "",
      tiempoEstimadoPreparacion: 0,
      precioVenta: 0,
      activo: true,
      detalleProductos: [],
      rubroId: 0,
    };

  const handleClose = () => {
    setOpenModal(false);
    dispatch(removeElementActive());
  };

  return (
    <Dialog open={openModal} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle>
        <h2
          className="font-tertiary"
          style={{
            color: "#c62828",
            fontWeight: "bold",
            fontSize: "2rem",
            textAlign: "center",
          }}
        >
          {elementActive ? "EDITAR PRODUCTO" : "CREAR UN NUEVO PRODUCTO"}
        </h2>
      </DialogTitle>

      <DialogContent dividers>
        <Formik
          initialValues={initialValues}
          validationSchema={Yup.object({
            denominacion: Yup.string().required("Campo requerido"),
            urlImagen: Yup.string()
              .url("URL inválida")
              .required("Campo requerido"),
            precioVenta: Yup.number()
              .min(0, "Debe ser positivo")
              .required("Campo requerido"),
            rubroId: Yup.number().required("Campo requerido"),
            tiempoEstimadoPreparacion: Yup.number()
              .min(0, "Debe ser positivo")
              .required("Campo requerido"),
            activo: Yup.boolean(),
            detalleProductos: Yup.array(),
            descripcion: Yup.string().required("Campo requerido"),
          })}
          enableReinitialize
          onSubmit={async (values) => {
            if (elementActive?.id) {
              await apiProducto.patch(elementActive.id, values);
            } else {
              await apiProducto.post(values);
            }
            getProductos();
            handleClose();
          }}
        >
          {({ values, setFieldValue }) => (
            <Form>

              <div className="container_Form_Ingredientes">
                {/* Columna izquierda */}
                <div className="input-col">
                  <TextFieldValue
                    label="Nombre del producto:"
                    name="denominacion"
                    type="text"
                    placeholder="Ingrese el nombre"
                  />

                  <TextFieldValue
                    label="Descripción:"
                    name="descripcion"
                    type="text"
                    placeholder="Ingrese la descripción"
                  />

                  <label style={{ fontWeight: "bold" }}>Categoría:</label>
                  <Field
                    as="select"
                    name="rubroId"
                    className="form-control input-formulario"
                  >
                    <option value="">Seleccione una categoría</option>
                    {rubros.map((rubro) => (
                      <option key={rubro.id} value={rubro.id}>
                        {rubro.denominacion || rubro.nombre}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage
                    name="rubroId"
                    component="div"
                    className="error"
                  />

                  <TextFieldValue
                    label="Tiempo estimado de preparación (min):"
                    name="tiempoEstimadoPreparacion"
                    type="number"
                    placeholder="Ej: 30"
                  />
                </div>

                {/* Columna derecha */}
                <div className="input-col">
                  <TextFieldValue
                    label="Imagen del producto:"
                    name="urlImagen"
                    type="text"
                    placeholder="https://..."
                  />

                  {/* Miniatura */}
                  <Field name="urlImagen">
                    {({ field }: any) =>
                      field.value && (
                        <div style={{ marginTop: "10px" }}>
                          <img
                            src={field.value}
                            alt="Vista previa"
                            style={{
                              width: "100px",
                              height: "100px",
                              objectFit: "cover",
                              borderRadius: "10px",
                              border: "2px solid #ddd",
                            }}
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                "https://via.placeholder.com/100?text=No+Image";
                            }}
                          />
                        </div>
                      )
                    }
                  </Field>
                  <TextFieldValue
                    label="Precio de venta:"
                    name="precioVenta"
                    type="number"
                    placeholder="0.00"
                  />
                </div>
              </div>

              {/* Sección para agregar insumos */}
              <div style={{ margin: "20px 0" }}>
                <h4>Agregar Insumos al Producto</h4>
                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    alignItems: "center",
                    marginBottom: "10px",
                  }}
                >
                  <select
                    value={insumoId}
                    onChange={(e) => setInsumoId(Number(e.target.value))}
                    className="form-control"
                  >
                    <option value={0}>Seleccione un insumo</option>
                    {insumos.map((insumo) => (
                      <option key={insumo.id} value={insumo.id}>
                        {insumo.denominacion}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    min={1}
                    value={cantidad}
                    onChange={(e) => setCantidad(Number(e.target.value))}
                    className="form-control"
                    style={{ width: "100px" }}
                    placeholder="Cantidad"
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      if (
                        insumoId &&
                        cantidad > 0 &&
                        !values.detalleProductos.some(
                          (d: DetalleProductoDTO) => d.insumoId === insumoId
                        )
                      ) {
                        setFieldValue("detalleProductos", [
                          ...values.detalleProductos,
                          { insumoId, cantidad },
                        ]);
                        setInsumoId(0);
                        setCantidad(1);
                      }
                    }}
                    disabled={!insumoId || cantidad <= 0}
                  >
                    Agregar
                  </Button>
                </div>
                {/* Lista de insumos agregados */}
                <ul style={{ marginTop: "10px" }}>
                  {values.detalleProductos.map(
                    (detalle: DetalleProductoDTO, idx: number) => {
                      const insumo = insumos.find(
                        (i) => i.id === detalle.insumoId
                      );
                      return (
                        <li
                          key={detalle.insumoId}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                          }}
                        >
                          {insumo ? insumo.denominacion : "Insumo"} - Cantidad:{" "}
                          {detalle.cantidad}
                          <Button
                            size="small"
                            color="error"
                            onClick={() => {
                              setFieldValue(
                                "detalleProductos",
                                values.detalleProductos.filter(
                                  (_: any, i: number) => i !== idx
                                )
                              );
                            }}
                          >
                            Quitar
                          </Button>
                        </li>
                      );
                    }
                  )}
                </ul>
              </div>

              {/* Switches */}
              <div style={{ display: "flex", gap: "30px", padding: "20px" }}>
                <FormControlLabel
                  control={
                    <Field
                      type="checkbox"
                      name="esParaElaborar"
                      as={Switch}
                      color="warning"
                    />
                  }
                  label="¿Es para elaborar?"
                />
                <FormControlLabel
                  control={
                    <Field
                      type="checkbox"
                      name="activo"
                      as={Switch}
                      color="error"
                    />
                  }
                  label="Activo"
                />
              </div>

              <DialogActions sx={{ justifyContent: "space-between", p: 2 }}>
                <Button
                  onClick={handleClose}
                  sx={{
                    fontWeight: "bold",
                    textDecoration: "underline",
                    color: "#000",
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    backgroundColor: "#f9a825",
                    color: "white",
                    fontWeight: "bold",
                    "&:hover": { backgroundColor: "#f57f17" },
                    px: 4,
                    borderRadius: "25px",
                  }}
                >
                  Guardar
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};