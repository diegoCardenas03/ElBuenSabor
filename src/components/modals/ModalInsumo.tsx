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
import { useEffect, useRef, useState } from "react";
// import { RubroInsumoDTO } from "../../types/RubroInsumo/RubroInsumoDTO";
import { RubroInsumoResponseDTO } from "../../types/RubroInsumo/RubroInsumoResponseDTO";
const API_CLOUDINARY_URL = import.meta.env.VITE_API_CLOUDINARY_URL;
const API_CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_API_CLOUDINARY_UPLOAD_PRESET;
import "./ModalInsumo.css";
import { FaTimes } from "react-icons/fa";
import AddImageIcon from "../../assets/img/SVGRepo_iconCarrier.png"



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
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [isHovering, setIsHovering] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchRubros = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/rubroinsumos");
        const data = await response.json();
        setRubros(data);
      } catch (error) {
        console.error("Error al cargar rubros:", error);
      }
    };

    fetchRubros();
  }, []);

  const unidadMedidaOptions = Object.values(UnidadMedida).map((value) => ({
    value,
    label: value,
  }));

  const initialValues: InsumoDTO =
    elementActive && "precioCosto" in elementActive
      ? {
        id: elementActive.id,
        denominacion: elementActive.denominacion,
        urlImagen: elementActive.urlImagen,
        precioCosto: elementActive.precioCosto,
        precioVenta: elementActive.precioVenta,
        stockActual: elementActive.stockActual,
        stockMinimo: elementActive.stockMinimo,
        esParaElaborar: elementActive.esParaElaborar,
        activo: elementActive.activo,
        unidadMedida: elementActive.unidadMedida,
        rubroId: elementActive.rubro?.id ?? 0,
      }
      : {
        id: 0,
        denominacion: "",
        urlImagen: "",
        precioCosto: 0,
        precioVenta: 0,
        stockActual: 0,
        stockMinimo: 0,
        esParaElaborar: false,
        activo: true,
        unidadMedida: UnidadMedida.UNIDADES, // O el valor por defecto que corresponda
        rubroId: 0,
      };

  const handleClose = () => {
    setOpenModal(false);
    dispatch(removeElementActive());
    setSelectedImage(null);
    setPreviewUrl("");
  };

  return (
    <Dialog open={openModal} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle>
        <button onClick={handleClose} className="absolute top-7 right-4 text-gray-500 hover:text-red-600" >
          <FaTimes className="text-secondary h-6 w-6 cursor-pointer" />
        </button>
        <p className="font-tertiary"
          style={{
            color: "#c62828",
            fontWeight: "bold",
            fontSize: "2rem",
            textAlign: "center",
          }}
        >
          {elementActive ? "EDITAR INSUMO" : "CREAR UN NUEVO INSUMO"}
        </p>
      </DialogTitle>

      <DialogContent dividers>
        <Formik
          initialValues={initialValues}
          validationSchema={Yup.object({
            denominacion: Yup.string().required("Campo requerido"),
            urlImagen: Yup.string().required("Debe seleccionar una imagen"),
            precioCosto: Yup.number().min(0, "Debe ser positivo").required("Campo requerido"),
            precioVenta: Yup.number().min(0, "Debe ser positivo"),
            stockActual: Yup.number().min(0).required("Campo requerido"),
            stockMinimo: Yup.number().min(0),
            rubroId: Yup.number().required("Campo requerido").required("Campo requerido"),
            unidadMedida: Yup.string().required("Campo requerido").required("Campo requerido"),
          })}
          enableReinitialize
          onSubmit={async (values) => {
            let imageUrl = values.urlImagen;
            if (selectedImage) {
              const formData = new FormData();
              formData.append("file", selectedImage);
              formData.append("upload_preset", `${API_CLOUDINARY_UPLOAD_PRESET}`);
              const res = await fetch(
                `${API_CLOUDINARY_URL}`,
                {
                  method: "POST",
                  body: formData,
                }
              );
              const data = await res.json();
              imageUrl = data.secure_url;
            }

            const payload = {
              ...values,
              urlImagen: imageUrl,
            };

            if (elementActive?.id) {
              await apiInsumo.patch(elementActive.id, payload);
            } else {
              await apiInsumo.post(payload);
            }
            getInsumos();
            handleClose();
          }}
        >
          {({ isValid, dirty, isSubmitting, values }) => (
            <Form>
              <div className="container_Form_Ingredientes">
                {/* Columna izquierda */}
                <div className="input-col">
                  <TextFieldValue
                    label="Nombre del insumo:"
                    name="denominacion"
                    id="denominacion"
                    type="text"
                    placeholder="Ingrese el nombre"
                  />

                  <label htmlFor="rubroId" style={{ fontWeight: "bold" }}>Categoría:</label>
                  <Field
                    as="select"
                    id="rubroId"
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
                    id="stockMinimo"
                    type="number"
                    placeholder="Ingrese el stock mínimo"
                  />
                  <TextFieldValue
                    label="Stock actual:"
                    name="stockActual"
                    id="stockActual"
                    type="number"
                    placeholder="Ingrese el stock actual"
                  />
                </div>

                {/* Columna derecha */}
                <div className="input-col">
                  <label htmlFor="unidadMedida" style={{
                    color: "black",
                    fontFamily: "sans-serif",
                    fontSize: "14px",
                    fontWeight: "bold",
                  }}>Unidad de medida:</label>
                  <Field
                    as="select"
                    name="unidadMedida"
                    id="unidadMedida"
                    className="form-control input-formulario"
                  >
                    <option value="">Seleccione una unidad</option>
                    {unidadMedidaOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage
                    name="unidadMedida"
                    component="div"
                    className="error"
                  />
                  {/* <TextFieldValue
                    label="Imagen del insumo:"
                    name="urlImagen"
                    id="urlImagen"
                    type="text"
                    placeholder="https://..."
                  /> */}

                  {/* Miniatura */}
                  <Field name="urlImagen">
                    {({ field, form: { setFieldValue } }: any) => (
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "10px" }}>
                        <div
                          className="image-upload-area"
                          style={{
                            width: "100px",
                            height: "100px",
                            borderRadius: "10px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            marginBottom: "10px",
                            position: "relative",
                            overflow: "hidden",
                          }}
                          onClick={() => fileInputRef.current?.click()}
                          onMouseEnter={() => setIsHovering(true)}
                          onMouseLeave={() => setIsHovering(false)}
                        >
                          {(previewUrl || field.value) ? (
                            <>
                              <img
                                src={previewUrl || field.value}
                                alt="Vista previa"
                                style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "10px" }}
                              />
                              {/* Overlay solo visible en hover */}
                              <div
                                style={{
                                  position: "absolute",
                                  top: 0,
                                  left: 0,
                                  width: "100%",
                                  height: "100%",
                                  background: "rgba(0,0,0,0.4)",
                                  color: "#fff",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  opacity: isHovering ? 1 : 0,
                                  transition: "opacity 0.2s",
                                  fontWeight: "bold",
                                  fontSize: "1.1rem",
                                  pointerEvents: "none",
                                }}
                              >
                                Editar
                              </div>
                            </>
                          ) : (
                            <img
                              src={AddImageIcon}
                              alt="Agregar imagen"
                              style={{ width: "100px", height: "100px", objectFit: "contain" }}
                            />
                          )}
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          style={{ display: "none" }}
                          ref={fileInputRef}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setSelectedImage(file);
                              setPreviewUrl(URL.createObjectURL(file));
                              setFieldValue("urlImagen", "temp"); // Valor temporal para pasar la validación
                            }
                          }}
                        />
                        {(!previewUrl && !field.value) && (
                          <div className="error" style={{ textAlign: "center" }}>Debe seleccionar una imagen</div>
                        )}
                      </div>
                    )}
                  </Field>
                  <TextFieldValue
                    label={`Precio de costo${values.unidadMedida === "GRAMOS"
                        ? " (Por 100 Gramos):"
                        : values.unidadMedida === "MILILITROS"
                          ? " (Por 100 Mililitros):"
                          : values.unidadMedida
                            ? ` (Por ${values.unidadMedida.toLowerCase()}):`
                            : " (Por unidad de medida):"
                      }`}
                    name="precioCosto"
                    id="precioCosto"
                    type="number"
                    placeholder="0.00"
                  />
                  {!values.esParaElaborar && (
                    <TextFieldValue
                      label="Precio de venta:"
                      name="precioVenta"
                      id="precioVenta"
                      type="number"
                      placeholder="0.00"
                    />
                  )}
                  {/* ESTO POR SI SE NECESITA EL PRECIO DE VENTA AUNQUE SEA ELABORABLE*/}
                  {/* <TextFieldValue
                      label="Precio de venta:"
                      name="precioVenta"
                      id="precioVenta"
                      type="number"
                      placeholder="0.00"
                    /> */}
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
                  disabled={
                    !isValid ||
                    !dirty ||
                    isSubmitting ||
                    (!previewUrl && !values.urlImagen)
                  }
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
