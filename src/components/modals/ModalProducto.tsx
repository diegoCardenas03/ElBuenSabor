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
import { ProductoDTO } from "../../types/Producto/ProductoDTO";
import TextFieldValue from "../TextFildValue/TextFildValue";
import { useEffect, useRef, useState } from "react";
import { RubroProductoResponseDTO } from "../../types/RubroProducto/RubroProductoResponseDTO";
import { DetalleProductoDTO } from "../../types/DetalleProducto/DetalleProductoDTO";
import "./ModalInsumo.css";
import { ProductoService } from "../../services/ProductoService";
import { FaTimes } from "react-icons/fa";
import AddImageIcon from "../../assets/img/SVGRepo_iconCarrier.png";
import Swal from "sweetalert2";
const API_CLOUDINARY_URL = import.meta.env.VITE_API_CLOUDINARY_URL;
const API_CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_API_CLOUDINARY_UPLOAD_PRESET;
import { InsumoResponseDTO } from "../../types/Insumo/InsumoResponseDTO";

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

  // console.log("elementActive", elementActive);

  const apiProducto = new ProductoService();
  const [rubros, setRubros] = useState<RubroProductoResponseDTO[]>([]);
  const [insumos, setInsumos] = useState<InsumoResponseDTO[]>([]);
  const [insumoId, setInsumoId] = useState<number>(0);
  const [cantidad, setCantidad] = useState<number>(1);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const token = sessionStorage.getItem("auth_token");

  useEffect(() => {
    const fetchRubros = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/rubroproductos");
        const data = await response.json();
        setRubros(data);
      } catch (error) {
        console.error("Error al cargar rubros:", error);
      }
    };

    fetchRubros();
  }, []);

  useEffect(() => {
    fetch("http://localhost:8080/api/insumos")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setInsumos(data);
        } else {
          setInsumos([]);
        }
      })
      .catch((err) => {
        console.error("Error al cargar insumos:", err);
        setInsumos([]);
      });
  }, []);

  const initialValues: ProductoDTO =
    elementActive && "descripcion" in elementActive && "tiempoEstimadoPreparacion" in elementActive
      ? {
        id: elementActive.id,
        denominacion: elementActive.denominacion,
        descripcion: elementActive.descripcion,
        tiempoEstimadoPreparacion: elementActive.tiempoEstimadoPreparacion,
        precioVenta: elementActive.precioVenta,
        urlImagen: elementActive.urlImagen,
        activo: elementActive.activo,
        rubroId: elementActive.rubro?.id ?? 0,
        margenGanancia: elementActive.margenGanancia ?? 0,
        detalleProductos: elementActive.detalleProductos ?? [],
      }
      : {
        id: 0,
        denominacion: "",
        descripcion: "",
        tiempoEstimadoPreparacion: 0,
        precioVenta: 0,
        urlImagen: "",
        activo: true,
        rubroId: 0,
        margenGanancia: 0,
        detalleProductos: [],
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
        <button onClick={handleClose} className="absolute top-7 right-4 text-gray-500 hover:text-red-600">
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
          {elementActive ? "EDITAR PRODUCTO" : "CREAR UN NUEVO PRODUCTO"}
        </p>
      </DialogTitle>

      <DialogContent dividers>
        <Formik
          initialValues={initialValues}
          validationSchema={Yup.object({
            denominacion: Yup.string().required("Campo requerido"),
            margenGanancia: Yup.number()
              .min(0, "Debe ser 0 o mayor")

              .required("Campo requerido"),
            rubroId: Yup.number()
              .min(1, "Seleccione una categoría")
              .required("Campo requerido"),
            tiempoEstimadoPreparacion: Yup.number()
              .min(1, "Debe ser mayor a 0")
              .required("Campo requerido"),
            activo: Yup.boolean(),
            detalleProductos: Yup.array()
              .min(1, "Debe agregar al menos un insumo al producto")
              .required("Debe agregar al menos un insumo al producto")
              .of(
                Yup.object().shape({
                  insumoId: Yup.number().required(),
                  cantidad: Yup.number()
                    .min(0.01, "La cantidad debe ser mayor a 0")
                    .required("La cantidad es obligatoria"),
                })
              ),
            descripcion: Yup.string().required("Campo requerido"),
          })}
          enableReinitialize
          onSubmit={async (values, { setSubmitting, setStatus }) => {
            try {
              let imageUrl = values.urlImagen;
              if (
                selectedImage &&
                elementActive &&
                "urlImagen" in elementActive &&
                typeof elementActive.urlImagen === "string" &&
                elementActive.urlImagen
              ) {
                // Reutiliza la función de ModalInsumo
                const getCloudinaryPublicId = (url: string): string | null => {
                  const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.[a-zA-Z]+$/);
                  return match ? match[1] : null;
                };
                const publicId = getCloudinaryPublicId(elementActive.urlImagen);
                console.log("Intentando eliminar imagen anterior de Cloudinary");
                console.log("URL anterior:", elementActive.urlImagen);
                console.log("publicId extraído:", publicId);

                if (publicId) {
                  const deleteUrl = `http://localhost:8080/api/cloudinary/eliminar?publicId=${publicId}`;
                  console.log("Llamando endpoint de borrado:", deleteUrl);
                  const res = await fetch(deleteUrl, {
                    method: "DELETE",
                    headers: { "Authorization": `Bearer ${token}` }
                  });
                  const result = await res.json().catch(() => ({}));
                  console.log("Respuesta del backend al borrar imagen:", result, "Status:", res.status);
                } else {
                  console.warn("No se pudo extraer el publicId de la imagen anterior.");
                }
              }

              // Subir la nueva imagen si corresponde
              if (selectedImage) {
                const formData = new FormData();
                formData.append("file", selectedImage);
                formData.append("upload_preset", `${API_CLOUDINARY_UPLOAD_PRESET}`);
                const res = await fetch(`${API_CLOUDINARY_URL}`, {
                  method: "POST",
                  body: formData,
                });
                const data = await res.json();
                imageUrl = data.secure_url;
              }


              const detalleProductos = values.detalleProductos.map((detalle: DetalleProductoDTO) => ({
                insumoId: detalle.insumoId,
                cantidad: detalle.cantidad
              }));

              const payload = {
                ...values,
                urlImagen: imageUrl,
                detalleProductos,
              };

              if (elementActive?.id) {
                await apiProducto.patch(elementActive.id, payload);
                Swal.fire({
                  title: "Producto actualizado",
                  text: "El producto se ha actualizado correctamente.",
                  icon: "success",
                });
              } else {
                await apiProducto.post(payload);
                Swal.fire({
                  title: "Producto creado",
                  text: "El producto se ha creado correctamente.",
                  icon: "success",
                });
              }
              getProductos();
              handleClose();
            } catch (error) {
              setStatus(
                error instanceof Error
                  ? error.message
                  : "Ocurrió un error al guardar el producto"
              );
              Swal.fire(
                "Error",
                error instanceof Error ? error.message : String(error),
                "error"
              );
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ values, setFieldValue, isValid, dirty, isSubmitting }) => (
            <Form>
              <div className="container_Form_Ingredientes" >
                {/* Columna izquierda */}
                <div className="input-col">
                  <TextFieldValue
                    label="Nombre del producto:"
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
                    {rubros
                      .filter((rubroproducto) => rubroproducto.activo)
                      .map((rubroproducto) => (
                        <option key={rubroproducto.id} value={rubroproducto.id}>
                          {rubroproducto.denominacion}
                        </option>
                      ))}
                  </Field>
                  <ErrorMessage
                    name="rubroId"
                    component="div"
                    className="error"
                  />

                  <TextFieldValue
                    label="Descripción:"
                    name="descripcion"
                    type="text"
                    placeholder="Ingrese la descripción"
                  />

                  <TextFieldValue
                    label="Margen de ganancia (%):"
                    name="margenGanancia"
                    type="number"
                    placeholder="0"
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

                {/* Columna derecha */}
                <div className="input-col">
                  <TextFieldValue
                    label="Tiempo estimado de preparación (min):"
                    name="tiempoEstimadoPreparacion"
                    type="number"
                    placeholder="Ej: 30"
                  />

                  {/* Insumos y cantidad */}
                  <div style={{ margin: "15px 0" }}>
                    <label
                      style={{ fontWeight: "bold", fontSize: "1em" }}
                    >
                      Agregar Insumos al Producto
                    </label>
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
                        className="form-control input-formulario"
                        style={{
                          width: "15em"
                        }}
                      >
                        <option value={0}>Seleccione un insumo</option>
                        {insumos
                          .filter(
                            (insumoproducto) =>
                              !values.detalleProductos.some((d) => d.insumoId === insumoproducto.id) &&
                              insumoproducto.esParaElaborar
                          )
                          .map((insumoproducto) => (
                            <option key={insumoproducto.id} value={insumoproducto.id}>
                              {insumoproducto.denominacion}
                              {insumoproducto.unidadMedida ? ` (${insumoproducto.unidadMedida})` : ""}
                            </option>
                          ))}
                      </select>
                      <input
                        type="number"
                        min={0.01}
                        step="any"
                        value={cantidad}
                        onChange={(e) => setCantidad(Number(e.target.value))}
                        className="form-control input-formulario"
                        style={{
                          width: "5em"
                        }}
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
                              key={`${detalle.insumoId}-${idx}`}
                              style={{ display: "flex", alignItems: "center", gap: "1em" }}
                            >
                              {/* Nombre y unidad de medida */}
                              <span>
                                {insumo ? insumo.denominacion : "Insumo"}
                                {insumo?.unidadMedida ? ` (${insumo.unidadMedida})` : ""}
                              </span>
                              {/* Input para editar cantidad */}
                              <input
                                type="number"
                                min={0.01}
                                step="any"
                                value={detalle.cantidad}
                                onChange={(e) => {
                                  const nuevaCantidad = Number(e.target.value);
                                  setFieldValue(
                                    "detalleProductos",
                                    values.detalleProductos.map((d, i) =>
                                      i === idx ? { ...d, cantidad: nuevaCantidad } : d
                                    )
                                  );
                                }}
                                className="form-control input-formulario"
                                style={{ width: "5em" }}
                              />
                              <Button
                                size="small"
                                color="error"
                                onClick={() => {
                                  setFieldValue(
                                    "detalleProductos",
                                    values.detalleProductos.filter(
                                      (_: DetalleProductoDTO, i: number) => i !== idx
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

                  {/* Imagen del producto */}
                  <label style={{ fontWeight: "bold" }}>Imagen del producto:</label>
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
                      {(previewUrl || values.urlImagen) ? (
                        <>
                          <img
                            src={previewUrl || values.urlImagen}
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
                          setFieldValue("urlImagen", ""); // Limpiar para evitar validación
                        }
                      }}
                    />
                    {(!previewUrl && !values.urlImagen) && (
                      <div className="error" style={{ textAlign: "center" }}>Debe seleccionar una imagen</div>
                    )}
                  </div>
                </div>
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
                    values.detalleProductos.length === 0 ||
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