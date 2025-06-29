import * as Yup from "yup";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { Formik, Form } from "formik";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { removeElementActive } from "../../hooks/redux/slices/TableReducer";
import { PromocionDTO } from "../../types/Promocion/PromocionDTO";
import TextFieldValue from "../TextFildValue/TextFildValue";
import { useEffect, useRef, useState } from "react";
import { ProductoResponseDTO } from "../../types/Producto/ProductoResponseDTO";
import { InsumoResponseDTO } from "../../types/Insumo/InsumoResponseDTO";
import { DetallePromocionDTO } from "../../types/DetallePromocion/DetallePromocionDTO";
import { PromocionService } from "../../services/PromocionService";
import { FaTimes } from "react-icons/fa";
import AddImageIcon from "../../assets/img/SVGRepo_iconCarrier.png";
import Swal from "sweetalert2";
const API_CLOUDINARY_URL = import.meta.env.VITE_API_CLOUDINARY_URL;
const API_CLOUDINARY_UPLOAD_PRESET = import.meta.env
  .VITE_API_CLOUDINARY_UPLOAD_PRESET;

interface IModalPromocion {
  getPromociones: () => void;
  openModal: boolean;
  setOpenModal: (state: boolean) => void;
}

export const ModalPromocion = ({
  getPromociones,
  openModal,
  setOpenModal,
}: IModalPromocion) => {
  const dispatch = useAppDispatch();
  const elementActive = useAppSelector(
    (state) => state.tablaReducer.elementActive
  );

  const apiPromocion = new PromocionService();
  const [productos, setProductos] = useState<ProductoResponseDTO[]>([]);
  const [insumos, setInsumos] = useState<InsumoResponseDTO[]>([]);
  const [productoId, setProductoId] = useState<number>(0);
  const [insumoId, setInsumoId] = useState<number>(0);
  const [cantidad, setCantidad] = useState<number>(1);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    fetch("http://localhost:8080/api/productos")
      .then((res) => res.json())
      .then((data) => setProductos(Array.isArray(data) ? data : []))
      .catch(() => setProductos([]));
    fetch("http://localhost:8080/api/insumos")
      .then((res) => res.json())
      .then((data) => setInsumos(Array.isArray(data) ? data : []))
      .catch(() => setInsumos([]));
  }, []);

  const initialValues: PromocionDTO =
    elementActive && "denominacion" in elementActive
      ? (elementActive as PromocionDTO)
      : {
          denominacion: "",
          urlImagen: "",
          fechaDesde: "",
          fechaHasta: "",
          descuento: 0,
          detallePromociones: [],
          descripcion: "",
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
        <button
          onClick={handleClose}
          className="absolute top-7 right-4 text-gray-500 hover:text-red-600"
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
          {elementActive ? "EDITAR PROMOCIÓN" : "CREAR UNA NUEVA PROMOCIÓN"}
        </p>
      </DialogTitle>

      <DialogContent dividers>
        <Formik
          initialValues={initialValues}
          validationSchema={Yup.object({
            denominacion: Yup.string().required("Campo requerido"),
            fechaDesde: Yup.date()
              .required("Campo requerido")
              .min(
                new Date().toISOString().split("T")[0],
                "La fecha de inicio no puede ser anterior a hoy"
              )
              .typeError("Fecha inválida"),
            fechaHasta: Yup.date()
              .required("Campo requerido")
              .min(
                Yup.ref("fechaDesde"),
                "La fecha de fin debe ser igual o posterior a la fecha de inicio"
              )
              .typeError("Fecha inválida"),
            descuento: Yup.number()
              .min(0, "Debe ser positivo")
              .required("Campo requerido"),
            detallePromociones: Yup.array()
              .when([], {
                is: () => !elementActive,
                then: (schema) =>
                  schema.min(1, "Debe agregar al menos un producto o insumo"),
                otherwise: (schema) => schema,
              })
              .of(
                Yup.object().shape({
                  productoId: Yup.number(),
                  insumoId: Yup.number(),
                  cantidad: Yup.number()
                    .min(0.01, "La cantidad debe ser mayor a 0")
                    .required(),
                })
              ),
              descripcion: Yup.string()
                .required("Campo requerido")
                .max(500, "La descripción no puede exceder los 500 caracteres"),

          })}
          enableReinitialize
          onSubmit={async (values, { setSubmitting, setStatus }) => {
            try {
              let imageUrl = values.urlImagen;
              if (selectedImage) {
                const formData = new FormData();
                formData.append("file", selectedImage);
                formData.append(
                  "upload_preset",
                  `${API_CLOUDINARY_UPLOAD_PRESET}`
                );
                const res = await fetch(`${API_CLOUDINARY_URL}`, {
                  method: "POST",
                  body: formData,
                });
                const data = await res.json();
                imageUrl = data.secure_url;
              }

              const detallePromociones = values.detallePromociones
                .map((detalle: any) => {
                  let productoId =
                    detalle.productoId ??
                    (detalle.producto ? detalle.producto.id : null);
                  let insumoId =
                    detalle.insumoId ??
                    (detalle.insumo ? detalle.insumo.id : null);

                  if (productoId === 0) productoId = null;
                  if (insumoId === 0) insumoId = null;

                  return {
                    productoId,
                    insumoId,
                    cantidad: detalle.cantidad,
                  };
                })
                .filter(
                  (d: any) =>
                    // Solo uno debe estar presente, y no ambos nulos
                    (d.productoId && !d.insumoId) ||
                    (!d.productoId && d.insumoId)
                );
              // ---------------------------------------

              const payload = {
                ...values,
                urlImagen: imageUrl,
                detallePromociones,
              };

              if (elementActive?.id) {
                await apiPromocion.patch(elementActive.id, payload);
                Swal.fire({
                  title: "Promoción actualizada",
                  text: "La promoción se ha actualizado correctamente.",
                  icon: "success",
                });
              } else {
                await apiPromocion.post(payload);
                Swal.fire({
                  title: "Promoción creada",
                  text: "La promoción se ha creado correctamente.",
                  icon: "success",
                });
              }
              getPromociones();
              handleClose();
            } catch (error) {
              setStatus(
                error instanceof Error
                  ? error.message
                  : "Ocurrió un error al guardar la promoción"
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
              <div className="container_Form_Ingredientes">
                {/* Columna izquierda */}
                <div className="input-col">
                  <TextFieldValue
                    label="Nombre de la promoción:"
                    name="denominacion"
                    type="text"
                    placeholder="Ingrese el nombre"
                  />

                  <TextFieldValue
                    label="Fecha desde:"
                    name="fechaDesde"
                    type="date"
                  />

                  <TextFieldValue
                    label="Fecha hasta:"
                    name="fechaHasta"
                    type="date"
                  />

                  <TextFieldValue
                    label="Descuento (%):"
                    name="descuento"
                    type="number"
                    placeholder="0"
                  />
                  <TextFieldValue
                    label="Descripción:"
                    name="descripcion"
                    type="text"
                    placeholder="Ingrese una descripción"
                  />
                </div>
                

                {/* Columna derecha */}
                <div className="input-col">
                  {/* Agregar productos/insumos a la promoción */}
                  <div style={{ margin: "15px 0" }}>
                    <label style={{ fontWeight: "bold", fontSize: "1em" }}>
                      Agregar Productos/Insumos a la Promoción
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
                        value={productoId}
                        onChange={(e) => setProductoId(Number(e.target.value))}
                        disabled={!!insumoId} // Se deshabilita si hay insumo seleccionado
                        className="form-control input-formulario"
                        style={{ width: "15em" }}
                      >
                        <option value={0}>Seleccione un producto</option>
                        {productos.map((producto) => (
                          <option key={producto.id} value={producto.id}>
                            {producto.denominacion}
                          </option>
                        ))}
                      </select>
                      <select
                        value={insumoId}
                        onChange={(e) => setInsumoId(Number(e.target.value))}
                        disabled={!!productoId} // Se deshabilita si hay producto seleccionado
                        className="form-control input-formulario"
                        style={{ width: "15em" }}
                      >
                        <option value={0}>Seleccione un insumo</option>
                        {insumos
                          .filter((insumo) => !insumo.esParaElaborar)
                          .map((insumo) => (
                            <option key={insumo.id} value={insumo.id}>
                              {insumo.denominacion}
                            </option>
                          ))}
                      </select>
                      <input
                        type="number"
                        min={1}
                        step={1}
                        value={cantidad}
                        onChange={(e) => setCantidad(Number(e.target.value))}
                        className="form-control input-formulario"
                        style={{ width: "5em" }}
                        placeholder="Cantidad"
                      />
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                          // Solo uno de los dos debe estar seleccionado
                          if (
                            ((productoId && !insumoId) ||
                              (!productoId && insumoId)) &&
                            cantidad > 0 &&
                            !values.detallePromociones.some(
                              (d: DetallePromocionDTO) =>
                                d.productoId === productoId &&
                                d.insumoId === insumoId
                            )
                          ) {
                            setFieldValue("detallePromociones", [
                              ...values.detallePromociones,
                              { productoId, insumoId, cantidad },
                            ]);
                            setProductoId(0);
                            setInsumoId(0);
                            setCantidad(1);
                          }
                        }}
                        disabled={
                          (!productoId && !insumoId) ||
                          (productoId && insumoId) ||
                          cantidad <= 0
                        }
                      >
                        Agregar
                      </Button>
                    </div>
                    {/* Lista de productos/insumos agregados */}
                    <ul style={{ marginTop: "10px" }}>
                      {values.detallePromociones.map(
                        (detalle: any, idx: number) => {
                          // Si viene el objeto completo desde el backend
                          const producto =
                            detalle.producto ||
                            (detalle.productoId &&
                              productos.find(
                                (p) => p.id === detalle.productoId
                              ));
                          const insumo =
                            detalle.insumo ||
                            (detalle.insumoId &&
                              insumos.find((i) => i.id === detalle.insumoId));

                          return (
                            <li
                              key={
                                detalle.id ??
                                `${detalle.productoId}-${detalle.insumoId}-${idx}`
                              }
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "1em",
                              }}
                            >
                              <span>
                                {producto
                                  ? `Producto: ${producto.denominacion}`
                                  : insumo
                                  ? `Insumo: ${insumo.denominacion}`
                                  : "Item"}
                              </span>
                              <input
                                type="number"
                                min={1}
                                step={1}
                                value={detalle.cantidad}
                                onChange={(e) => {
                                  const nuevaCantidad = Number(e.target.value);
                                  setFieldValue(
                                    "detallePromociones",
                                    values.detallePromociones.map(
                                      (d: any, i: number) =>
                                        i === idx
                                          ? { ...d, cantidad: nuevaCantidad }
                                          : d
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
                                    "detallePromociones",
                                    values.detallePromociones.filter(
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

                  {/* Imagen de la promoción */}
                  <label style={{ fontWeight: "bold" }}>
                    Imagen de la promoción:
                  </label>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      marginBottom: "10px",
                    }}
                  >
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
                      {previewUrl || values.urlImagen ? (
                        <>
                          <img
                            src={previewUrl || values.urlImagen}
                            alt="Vista previa"
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              borderRadius: "10px",
                            }}
                          />
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
                          style={{
                            width: "100px",
                            height: "100px",
                            objectFit: "contain",
                          }}
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
                          setFieldValue("urlImagen", "");
                        }
                      }}
                    />
                    {!previewUrl && !values.urlImagen && (
                      <div className="error" style={{ textAlign: "center" }}>
                        Debe seleccionar una imagen
                      </div>
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
                    values.detallePromociones.length === 0 ||
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