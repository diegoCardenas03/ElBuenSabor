import { Field, ErrorMessage } from "formik";

interface Props {
  label: string;
  name: string;
  id?: string;
  options: { value: any; label: string }[];
}

const SelectField = ({ label, name, id, options }: Props) => (
  <div className="mb-3">
    <label htmlFor={id ?? name}>{label}</label>
    <Field as="select" id={id ?? name} name={name} className="form-select">
      <option value="">Seleccione una opción</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </Field>
    <ErrorMessage name={name} component="div" className="text-danger" />
  </div>
);

export default SelectField;
