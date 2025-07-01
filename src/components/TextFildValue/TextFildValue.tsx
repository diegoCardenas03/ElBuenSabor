import { ErrorMessage, Field } from "formik";
import "./textFildValue.css"; // Importación del archivo de estilos CSS

// Interfaz para los props del componente TextFieldValue
interface props {
  label: string; // Etiqueta del campo
  id?: string;
  name: string; // Nombre del campo
  type: string; // Tipo de campo (text, number, etc.)
  placeholder?: string; // Placeholder del campo
}

// Componente TextFieldValue
const TextFieldValue = ({ label, name, id, type, placeholder }: props) => {
  // Componente para crear los input de un formulario con Formik
  return (
    <div className="mt-2" style={{ display: "flex", flexDirection: "column" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
          padding: ".3rem 0",
        }}
      >
        {/* Etiqueta del campo */}
        <label
          htmlFor={id ?? name}
          style={{
            color: "black",
            fontFamily: "sans-serif",
            fontSize: "14px",
            fontWeight: "bold",
          }}
        >
          {label}
        </label>
      </div>

      {/* Campo de entrada del formulario */}
      <Field name={name}>
        {({ field }: any) => (
          <input
            {...field}
            className={`form-control  mb-3  input-formulario `}
            placeholder={placeholder}
            id={id ?? name}
            type={type}
            autoComplete="off"
            value={
              type === "number" && (field.value === 0 || field.value === "0")
                ? ""
                : field.value
            }
          />
        )}
      </Field>

      {/* Mensaje de error para el campo */}
      <ErrorMessage component="div" name={name} className="error" />
    </div>
  );
};

export default TextFieldValue; // Exportación del componente TextFieldValue
