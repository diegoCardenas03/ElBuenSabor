// import { Button, Modal } from "react-bootstrap";
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
import { InsumoDTO } from "../../types/Insumo/InsumoDTO";
import { InsumoService } from "../../services/InsumoService";
import TextFieldValue from "../TextFildValue/TextFildValue";
import SelectField from "../SelectField/SelectField"; // Componente personalizado tipo select
import { useEffect, useState } from "react";
import { RubroInsumoDTO } from "../../types/RubroInsumo/RubroInsumoDTO";
import { RubroInsumoResponseDTO } from "../../types/RubroInsumo/RubroInsumoResponseDTO";
const API_URL = import.meta.env.VITE_API_URL;
import "./ModalInsumo.css";
interface IModalInsumo {
  getInsumos: () => void;
  openModal: boolean;
  setOpenModal: (state: boolean) => void;
}
export const ModalInsumo = ({
  getInsumos,
  openModal,
  setOpenModal,
}: IModalInsumo) => {
  const dispatch = useAppDispatch();
  const elementActive = useAppSelector(
    (state) => state.tablaReducer.elementActive
  );
  const apiInsumo = new InsumoService();

  const [rubros, setRubros] = useState<RubroInsumoResponseDTO[]>([]);

  useEffect(() => {
    const fetchRubros = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/rubroinsumo");
        const data = await response.json();
        setRubros(data);
      } catch (error) {
        console.error("Error al cargar rubros:", error);
      }
    };

    fetchRubros();
  }, []);

  useEffect(() => {
    fetch(`${API_URL}/rubros`)
      .then((res) => res.json())
      .then((data) => setRubros(data));
  }, []);

  const unidadMedidaOptions = Object.values(UnidadMedida).map((value) => ({
    value,
    label: value,
  }));

  const rubroOptions = rubros.map((r) => ({
    value: r.id,
    label: r.nombre,
  }));

  const initialValues: InsumoDTO = elementActive
    ? elementActive
    : {
      denominacion: "",
      urlImagen: "",
      precioCosto: 0,
      precioVenta: 0,
      stockActual: 0,
      stockMinimo: 0,
      esParaElaborar: false,
      activo: true,
      unidadMedida: UnidadMedida.UNIDADES,
      rubroId: 0,
    };

  const handleClose = () => {
    setOpenModal(false);
    dispatch(removeElementActive());
  };

  return (
   <Dialog open={openModal} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle>
        <h2 className="font-tertiary"
          style={{
            color: "#c62828",
            fontWeight: "bold",
            fontSize: "2rem",
            textAlign: "center",
          }}
        >
          {elementActive ? "EDITAR INSUMO" : "CREAR UN NUEVO INSUMO"}
        </h2>
      </DialogTitle>

      <DialogContent dividers>
        <Formik
          initialValues={initialValues}
          validationSchema={Yup.object({
            denominacion: Yup.string().required("Campo requerido"),
            urlImagen: Yup.string().url("URL inválida"),
            precioCosto: Yup.number().min(0, "Debe ser positivo"),
            precioVenta: Yup.number().min(0, "Debe ser positivo"),
            stockActual: Yup.number().min(0),
            stockMinimo: Yup.number().min(0),
            rubroId: Yup.number().required("Campo requerido"),
            unidadMedida: Yup.string().required("Campo requerido"),
          })}
          enableReinitialize
          onSubmit={async (values) => {
            if (elementActive?.id) {
              await apiInsumo.patch(elementActive.id, values);
            } else {
              await apiInsumo.post(values);
            }
            getInsumos();
            handleClose()
          }}
        >
          {() => (
            <Form>
              <div className="container_Form_Ingredientes">
                {/* Columna izquierda */}
                <div className="input-col">
                  <TextFieldValue
                    label="Nombre del insumo:"
                    name="denominacion"
                    type="text"
                    placeholder="Ingrese el nombre"
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
                        {rubro.denominacion}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage
                    name="rubroId"
                    component="div"
                    className="error"
                  />

                  <TextFieldValue
                    label="Stock mínimo:"
                    name="stockMinimo"
                    type="number"
                    placeholder="Ingrese el stock mínimo"
                  />
                  <TextFieldValue
                    label="Stock actual:"
                    name="stockActual"
                    type="number"
                    placeholder="Ingrese el stock actual"
                  />
                </div>

                {/* Columna derecha */}
                <div className="input-col">
                  <SelectField
                    label="Unidad de medida:"
                    name="unidadMedida"
                    options={unidadMedidaOptions}
                  />
<TextFieldValue
  label="Imagen del insumo:"
  name="urlImagen"
  type="text"
  placeholder="https://..."
/>

{/* Miniatura */}
<Field name="urlImagen">
  {({ field }: any) => (
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
            (e.target as HTMLImageElement).src = "https://via.placeholder.com/100?text=No+Image";
          }}
        />
      </div>
    )
  )}
</Field>
                  <TextFieldValue
                    label="Precio de costo:"
                    name="precioCosto"
                    type="number"
                    placeholder="0.00"
                  />
                  <TextFieldValue
                    label="Precio de venta:"
                    name="precioVenta"
                    type="number"
                    placeholder="0.00"
                  />
                </div>
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
