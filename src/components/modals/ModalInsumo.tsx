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
import { Formik, Form, Field, ErrorMessage,FieldProps } from "formik";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { removeElementActive } from "../../hooks/redux/slices/TableReducer";
import { UnidadMedida } from "../../types/enums/UnidadMedida";
import { InsumoService } from "../../services/InsumoService";
import TextFieldValue from "../TextFildValue/TextFildValue";
import { useEffect, useRef, useState } from "react";
import { RubroInsumoResponseDTO } from "../../types/RubroInsumo/RubroInsumoResponseDTO";
const API_CLOUDINARY_URL = import.meta.env.VITE_API_CLOUDINARY_URL;
const API_CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_API_CLOUDINARY_UPLOAD_PRESET;
import "./ModalInsumo.css";
import { FaTimes } from "react-icons/fa";
import AddImageIcon from "../../assets/img/SVGRepo_iconCarrier.png";
import Swal from "sweetalert2";
import { InsumoResponseDTO } from "../../types/Insumo/InsumoResponseDTO";

interface IModalInsumo {
  getInsumos: () => void;
  openModal: boolean;
  setOpenModal: (state: boolean) => void;
}

export const ModalInsumo = ({ getInsumos, openModal, setOpenModal }: IModalInsumo) => {
  const dispatch = useAppDispatch();
  const elementActive = useAppSelector((state) => state.tablaReducer.elementActive);
  const apiInsumo = new InsumoService();

  const [rubros, setRubros] = useState<RubroInsumoResponseDTO[]>([]);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [isHovering, setIsHovering] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedRubros, setSelectedRubros] = useState<RubroInsumoResponseDTO[]>([]);
  const [formInitialValues, setFormInitialValues] = useState<InsumoResponseDTO & { rubroId?: number }>({
    id: 0,
    denominacion: "",
    urlImagen: "",
    precioCosto: 0,
    precioVenta: 0,
    stockActual: 0,
    stockMinimo: 0,
    esParaElaborar: false,
    activo: true,
    unidadMedida: "" as UnidadMedida,
    rubro: rubros[0] || { id: 0, denominacion: "", subRubros: [] },
    descripcion: "",
  });

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

  useEffect(() => {
    if (!openModal) {
      setSelectedRubros([]);
      return;
    }
    if (!elementActive || !("rubro" in elementActive) || !elementActive.rubro.id) {
      setSelectedRubros([]);
      return;
    }

    const findRubroPath = (rubrosList: RubroInsumoResponseDTO[], rubroId: number, path: RubroInsumoResponseDTO[] = []): RubroInsumoResponseDTO[] | null => {
      for (const rubro of rubrosList) {
        if (rubro.id === rubroId) {
          return [...path, rubro];
        }
        if (rubro.subRubros && rubro.subRubros.length > 0) {
          const found = findRubroPath(rubro.subRubros, rubroId, [...path, rubro]);
          if (found) return found;
        }
      }
      return null;
    };

    if (rubros.length > 0) {
      console.log("elementActive.rubro.id:", elementActive.rubro.id);
      console.log("rubros:", rubros);
      const rubroPath = findRubroPath(rubros, elementActive.rubro.id);
      console.log("rubroPath:", rubroPath);
      setSelectedRubros(rubroPath || []);

    }
  }, [openModal, elementActive, rubros]);

  useEffect(() => {
    if (openModal && elementActive && "precioCosto" in elementActive && "stockActual" in elementActive) {
      setFormInitialValues({
        id: elementActive.id || 0,
        denominacion: elementActive.denominacion || "",
        urlImagen: elementActive.urlImagen || "",
        precioCosto: elementActive.precioCosto || 0,
        precioVenta: elementActive.precioVenta || 0,
        stockActual: elementActive.stockActual || 0,
        stockMinimo: elementActive.stockMinimo || 0,
        esParaElaborar: elementActive.esParaElaborar || false,
        activo: elementActive.activo || true,
        unidadMedida: elementActive.unidadMedida || "",
        rubro: elementActive.rubro || { id: 0, denominacion: "", subRubros: [] },
        rubroId: elementActive.rubro?.id ?? 0,
        descripcion: elementActive.descripcion || "",
      });
    } else if (openModal) {
      setFormInitialValues({
        id: 0,
        denominacion: "",
        urlImagen: "",
        precioCosto: 0,
        precioVenta: 0,
        stockActual: 0,
        stockMinimo: 0,
        esParaElaborar: false,
        activo: true,
        unidadMedida: "" as UnidadMedida,
        rubro: rubros[0] || { id: 0, denominacion: "", subRubros: [] },
        rubroId: rubros[0]?.id ?? 0,
        descripcion: "",
      });
    }
  }, [openModal, elementActive]);

  const handleClose = () => {
    setOpenModal(false);
    dispatch(removeElementActive());
    setSelectedImage(null);
    setPreviewUrl("");
  };

  const unidadMedidaOptions = Object.values(UnidadMedida).map((value) => ({ value, label: value }));
  const handleRubroSelect = (
    nivel: number,
    rubroId: number,
    setFieldValue: (field: string, value: any) => void
  ) => {
    const options = nivel === 0 ? rubros : selectedRubros[nivel - 1]?.subRubros || [];
    const rubro = options.find((r) => r.id === rubroId);
    if (!rubro) return;

    const nuevosSeleccionados = [...selectedRubros.slice(0, nivel), rubro];
    setSelectedRubros(nuevosSeleccionados);

    if (!rubro.subRubros || rubro.subRubros.length === 0) {
      setFieldValue("rubroId", rubro.id);
    } else {
      setFieldValue("rubroId", ""); // Limpiar hasta que elija el último rubro
    }
  };

  return (
    <Dialog open={openModal} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle>
        <button onClick={handleClose} className="absolute top-7 right-4 text-gray-500 hover:text-red-600">
          <FaTimes className="text-secondary h-6 w-6 cursor-pointer" />
        </button>
        <p className="font-tertiary" style={{ color: "#c62828", fontWeight: "bold", fontSize: "2rem", textAlign: "center" }}>
          {elementActive ? "EDITAR INSUMO" : "CREAR UN NUEVO INSUMO"}
        </p>
      </DialogTitle>
      <DialogContent dividers>
        <Formik
          initialValues={formInitialValues}
          enableReinitialize
          validationSchema={Yup.object({
            denominacion: Yup.string().required("Campo requerido"),
            urlImagen: Yup.string().required("Debe seleccionar una imagen"),
            precioCosto: Yup.number().moreThan(0, "El precio debe ser mayor a 0").moreThan(0, "El precio debe ser mayor a 0").required("Campo requerido"),
            precioVenta: Yup.number().min(0, "Debe ser positivo"),
            stockActual: Yup.number().min(0).required("Campo requerido"),
            stockMinimo: Yup.number().min(0).required("Campo requerido"),
            rubroId: Yup.number().required("Campo requerido"),
            unidadMedida: Yup.string().required("Campo requerido"),
            descripcion: Yup.string().required("Campo requerido"),
          })}
          onSubmit={async (values, { setSubmitting }) => {
            let imageUrl = values.urlImagen;
            if (selectedImage) {
              const formData = new FormData();
              formData.append("file", selectedImage);
              formData.append("upload_preset", API_CLOUDINARY_UPLOAD_PRESET);
              const res = await fetch(API_CLOUDINARY_URL, { method: "POST", body: formData });
              const data = await res.json();
              imageUrl = data.secure_url;
            }

            const payload = {
              ...values,
              urlImagen: imageUrl,
              rubroId: selectedRubros.at(-1)?.id ?? values.rubroId ?? 0 
            };

            if (elementActive?.id) {
              await apiInsumo.patch(elementActive.id, payload);
              Swal.fire({ title: "¡Éxito!", text: "Insumo actualizado correctamente.", icon: "success" });
            } else {
              await apiInsumo.post(payload);
              Swal.fire({ title: "¡Éxito!", text: "Insumo creado correctamente.", icon: "success" });
            }

            getInsumos();
            handleClose();
            setSubmitting(false);
          }}
        >
          {({ isValid, dirty, isSubmitting, values, setFieldValue }) => (
            <Form>
              <div className="container_Form_Ingredientes">
                <div className="input-col">
                  <TextFieldValue label="Nombre del insumo:" name="denominacion" id="denominacion" type="text" placeholder="Ingrese el nombre" />
                  <label htmlFor="rubroId" style={{ fontWeight: "bold" }}>Categoría:</label>
                  <Field name="rubroId">
                    {({ form: { setFieldValue } }: FieldProps) => {
                      const allChildIds = rubros.flatMap((r) => r.subRubros?.map((sr) => sr.id) || []);
                      const parentRubros = rubros.filter((r) => !allChildIds.includes(r.id));
                      const selects = [];
                      for (let nivel = 0; ; nivel++) {
                        const options = nivel === 0 ? parentRubros : selectedRubros[nivel - 1]?.subRubros || [];
                        selects.push(
                          <select key={nivel} value={selectedRubros[nivel]?.id ?? ""} onChange={(e) => handleRubroSelect(nivel, Number(e.target.value), setFieldValue)} className="form-control input-formulario" style={{ minWidth: 180, marginRight: 8 }}>
                            <option value="">Seleccione...</option>
                            {options.map((rubro) => (
                              <option key={rubro.id} value={rubro.id}>{rubro.denominacion}</option>
                            ))}
                          </select>
                        );
                        const selected = selectedRubros[nivel];
                        if (!selected || !selected.subRubros || selected.subRubros.length === 0) break;
                      }
                      return <>{selects}</>;
                    }}
                  </Field>
                  <ErrorMessage name="rubroId" component="div" className="error" />
                  <TextFieldValue label="Stock mínimo:" name="stockMinimo" id="stockMinimo" type="number" placeholder="Ingrese el stock mínimo" />
                  <TextFieldValue label="Stock actual:" name="stockActual" id="stockActual" type="number" placeholder="Ingrese el stock actual" />
                  <TextFieldValue label="Descripción:" name="descripcion" id="descripcion" type="text" placeholder="Ingrese una descripción" />
                </div>
                <div className="input-col">
                  <label htmlFor="unidadMedida" style={{ color: "black", fontFamily: "sans-serif", fontSize: "14px", fontWeight: "bold" }}>Unidad de medida:</label>
                  <Field as="select" name="unidadMedida" id="unidadMedida" className="form-control input-formulario">
                    <option value="">Seleccione una unidad</option>
                    {unidadMedidaOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </Field>
                  <ErrorMessage name="unidadMedida" component="div" className="error" />
                  <Field name="urlImagen">
                    {({ field, form: { setFieldValue } }: FieldProps) => (
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "10px" }}>
                        <div className="image-upload-area" style={{ width: "100px", height: "100px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", marginBottom: "10px", position: "relative", overflow: "hidden" }} onClick={() => fileInputRef.current?.click()} onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}>
                          {previewUrl || field.value ? (
                            <>
                              <img src={previewUrl || field.value} alt="Vista previa" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "10px" }} />
                              <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.4)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", opacity: isHovering ? 1 : 0, transition: "opacity 0.2s", fontWeight: "bold", fontSize: "1.1rem", pointerEvents: "none" }}>Editar</div>
                            </>
                          ) : (
                            <img src={AddImageIcon} alt="Agregar imagen" style={{ width: "100px", height: "100px", objectFit: "contain" }} />
                          )}
                        </div>
                        <input type="file" accept="image/*" style={{ display: "none" }} ref={fileInputRef} onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setSelectedImage(file);
                            setPreviewUrl(URL.createObjectURL(file));
                            setFieldValue("urlImagen", "temp");
                          }
                        }} />
                        {!previewUrl && !field.value && (<div className="error" style={{ textAlign: "center" }}>Debe seleccionar una imagen</div>)}
                      </div>
                    )}
                  </Field>
                  <TextFieldValue label={`Precio de costo${values.unidadMedida === "GRAMOS" ? " (Por 100 Gramos):" : values.unidadMedida === "MILILITROS" ? " (Por 100 Mililitros):" : values.unidadMedida ? ` (Por ${values.unidadMedida.toLowerCase()}):` : " (Por unidad de medida):"}`} name="precioCosto" id="precioCosto" type="number" placeholder="0.00" />
                  {!values.esParaElaborar && (<TextFieldValue label="Precio de venta:" name="precioVenta" id="precioVenta" type="number" placeholder="0.00" />)}
                </div>
              </div>
              <div style={{ display: "flex", gap: "30px", padding: "20px" }}>
                <FormControlLabel control={<Switch type="checkbox" name="esParaElaborar" checked={values.esParaElaborar} color="warning" onChange={(e) => {
                  setFieldValue("esParaElaborar", e.target.checked);
                  if (e.target.checked) setFieldValue("precioVenta", 0.00);
                }} />} label="¿Es para elaborar?" />
                <FormControlLabel control={<Switch type="checkbox" name="activo" checked={values.activo} color="error" onChange={(e) => setFieldValue("activo", e.target.checked)} />} label="Activo" />
              </div>
              <DialogActions sx={{ justifyContent: "space-between", p: 2 }}>
                <Button onClick={handleClose} sx={{ fontWeight: "bold", textDecoration: "underline", color: "#000" }}>Cancelar</Button>
                <Button type="submit" variant="contained" sx={{ backgroundColor: "#f9a825", color: "white", fontWeight: "bold", "&:hover": { backgroundColor: "#f57f17" }, px: 4, borderRadius: "25px" }} disabled={!isValid || !dirty || isSubmitting || (!previewUrl && !values.urlImagen)}>Guardar</Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};
