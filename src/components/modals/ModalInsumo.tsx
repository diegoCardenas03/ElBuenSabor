import { Button, Modal } from "react-bootstrap";
import * as Yup from "yup";
import { Formik, Form, Field } from "formik";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { removeElementActive } from "../../hooks/redux/slices/TableReducer";
import { UnidadMedida } from "../../types/enums/UnidadMedida";
import { InsumoDTO } from "../../types/Insumo/InsumoDTO";
import { InsumoService } from "../../services/InsumoService";
import TextFieldValue from "../TextFildValue/TextFildValue";
import SelectField from "../SelectField/SelectField"; // Componente personalizado tipo select
import { useEffect, useState } from "react";
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
  const apiInsumo = new InsumoService(API_URL + "/insumos");

  // Estado para rubros (simula que los cargas de API)
  const [rubros, setRubros] = useState<{ id: number; nombre: string }[]>([]);

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
        rubro: 0,
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
            rubro: Yup.number().required("Campo requerido"),
            unidadMedida: Yup.string().required("Campo requerido"),
          })}
          enableReinitialize
          onSubmit={async (values) => {
            if (elementActive?.id) {
              await apiInsumo.put(elementActive.id, values);
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

                <SelectField
                  label="Rubro"
                  name="rubro"
                  options={rubroOptions}
                />

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
