import { Button, Modal } from "react-bootstrap";
import * as Yup from "yup";
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
    <Modal show={openModal} onHide={handleClose} size="lg" backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>{elementActive ? "Editar" : "Añadir"} Insumo</Modal.Title>
      </Modal.Header>
      <Modal.Body>
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
            console.log(values);
            if (elementActive?.id) {
              await apiInsumo.patch(elementActive.id, values);
            } else {
              await apiInsumo.post(values);
            }
            getInsumos();
            handleClose();
          }}
        >
          {() => (
            <Form className="form-obraAlta">
              <div className="container_Form_Ingredientes">
                <TextFieldValue
                  label="Denominación"
                  name="denominacion"
                  type="text"
                  placeholder="Nombre del insumo"
                />
                <TextFieldValue
                  label="Imagen (URL)"
                  name="urlImagen"
                  type="text"
                  placeholder="https://..."
                />
                <TextFieldValue
                  label="Precio de costo"
                  name="precioCosto"
                  type="number"
                  placeholder="0.00"
                />
                <TextFieldValue
                  label="Precio de venta"
                  name="precioVenta"
                  type="number"
                  placeholder="0.00"
                />
                <TextFieldValue
                  label="Stock actual"
                  name="stockActual"
                  type="number"
                  placeholder="0"
                />
                <TextFieldValue
                  label="Stock mínimo"
                  name="stockMinimo"
                  type="number"
                  placeholder="0"
                />

                <SelectField
                  label="Unidad de medida"
                  name="unidadMedida"
                  options={unidadMedidaOptions}
                />

                <div className="mt-2">
                  <label htmlFor="rubroId" style={{ fontWeight: "bold" }}>
                    Rubro:
                  </label>
                  <Field
                    as="select"
                    name="rubroId"
                    className="form-control mb-3 input-formulario"
                  >
                    <option value="">Seleccione un rubro</option>
                    {rubros.map((rubro) => (
                      <option value={rubro.id} key={rubro.id}>
                        {rubro.denominacion}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage name="rubroId" component="div" className="error" />
                </div>

                {/* Checkboxes */}
                <div className="form-check">
                  <label>
                    <Field type="checkbox" name="esParaElaborar" />
                    {" "}¿Es para elaborar?
                  </label>
                </div>
                <div className="form-check">
                  <label>
                    <Field type="checkbox" name="activo" />
                    {" "}¿Está activo?
                  </label>
                </div>
              </div>
              <div className="d-flex justify-content-end mt-3">
                <Button variant="success" type="submit">
                  Guardar
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  );
};
