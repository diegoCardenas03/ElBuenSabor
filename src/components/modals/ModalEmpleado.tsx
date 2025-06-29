import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Switch,
    FormControlLabel,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
    Chip,
} from "@mui/material";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useState, useEffect } from "react";
import * as Yup from "yup";
import { EmpleadoDTO } from "../../types/Empleado/EmpleadoDTO";
import { EmpleadosService } from "../../services/EmpleadosService";
import { EmpleadoResponseDTO } from "../../types/Empleado/EmpleadoResponseDTO";
import Swal from "sweetalert2";
import { FaTimes } from "react-icons/fa";
import { RolService } from "../../services/RolService";
import { RolResponseDTO } from "../../types/Rol/RolResponseDTO";

interface ModalEmpleadoProps {
    open: boolean;
    onClose: () => void;
    getEmpleados: () => void;
    empleado?: EmpleadoResponseDTO | null;
}

export const ModalEmpleado = ({
    open,
    onClose,
    getEmpleados,
    empleado,
}: ModalEmpleadoProps) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [rolesDisponibles, setRolesDisponibles] = useState<RolResponseDTO[]>([]);
    const [rolAAgregar, setRolAAgregar] = useState<string>("");
    const [showPassword, setShowPassword] = useState(false);

    // Traer roles disponibles al abrir el modal
    useEffect(() => {
        if (open) {
            const fetchRoles = async () => {
                try {
                    const service = new RolService();
                    const roles = await service.getAll();

                    setRolesDisponibles(roles.filter((rol) => rol.nombre !== 'Cliente'));
                } catch {
                    setRolesDisponibles([]);
                }
            };
            fetchRoles();
        }
    }, [open]);

    const initialValues: EmpleadoDTO = empleado
        ? {
            nombreCompleto: empleado.nombreCompleto,
            telefono: empleado.telefono,
            usuario: {
                email: empleado.usuario.email,
                contrasenia: "",
                connection: "Username-Password-Authentication",
                roles: empleado.usuario.roles.map(r =>
                    typeof r === "string"
                        ? r
                        : r.auth0RolId // <-- usa el auth0RolId
                ),
            },
            domicilio: empleado.domicilio,
            activo: empleado.activo,
        }
        : {
            nombreCompleto: "",
            telefono: "",
            usuario: {
                email: "",
                contrasenia: "",
                connection: "Username-Password-Authentication",
                roles: [],
            },
            domicilio: {
                calle: "",
                numero: 0,
                localidad: "",
                codigoPostal: 0,
            },
            activo: true,
        };

    const passwordValidation = Yup.string()
        .test(
            "password-strength",
            "La contraseña debe tener al menos 8 caracteres y cumplir 3 de los 4 requisitos: mayúsculas, minúsculas, números, símbolos.",
            value => {
                if (!value) return false;
                const tests = [
                    /[a-z]/.test(value), // minúscula
                    /[A-Z]/.test(value), // mayúscula
                    /\d/.test(value),    // número
                    /[!@#$%^&*(),.?":{}|<>]/.test(value), // símbolo
                ];
                const passed = tests.filter(Boolean).length;
                return value.length >= 8 && passed >= 3;
            }
        );

    const validationSchema = Yup.object({
        nombreCompleto: Yup.string().required("El nombre es obligatorio"),
        telefono: Yup.string()
            .required("El teléfono es obligatorio")
            .min(10, "El teléfono debe tener 10 caracteres")
            .max(10, "El teléfono no puede tener más de 10 caracteres"),
        usuario: Yup.object({
            email: Yup.string().email("Email inválido").required("El email es obligatorio"),
            contrasenia: empleado
                ? Yup.string()
                : passwordValidation.required("La contraseña es obligatoria"),
            roles: Yup.array().of(Yup.string()).min(1, "Debe seleccionar al menos un rol"),
        }),
        domicilio: Yup.object({
            calle: Yup.string().required("La calle es obligatoria"),
            numero: Yup.number().typeError("Debe ser un número").required("El número es obligatorio"),
            localidad: Yup.string().required("La localidad es obligatoria"),
            codigoPostal: Yup.number().typeError("Debe ser un número").required("El código postal es obligatorio"),
        }),
    });

    const handleSubmit = async (values: EmpleadoDTO) => {
        setIsSubmitting(true);
        const empleadosService = new EmpleadosService();
        try {
            console.log('values: ', values)
            if (empleado) {
                await empleadosService.patch(empleado.id, values);
                Swal.fire("¡Éxito!", "Empleado actualizado correctamente.", "success");
            } else {
                await empleadosService.post(values);
                Swal.fire("¡Éxito!", "Empleado creado correctamente.", "success");
            }
            getEmpleados();
            onClose();
        } catch (error: any) {
            Swal.fire("Error", error?.message || "No se pudo guardar el empleado", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!open) return null;

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle sx={{ p: 0, pb: 2, position: "relative" }}>
                <button
                    onClick={onClose}
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
                        margin: 0,
                        paddingTop: "1.5rem",
                    }}
                >
                    {empleado ? "EDITAR EMPLEADO" : "CREAR NUEVO EMPLEADO"}
                </p>
            </DialogTitle>
            <DialogContent dividers>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    enableReinitialize
                    onSubmit={handleSubmit}
                >
                    {({ values, setFieldValue }) => (
                        <Form>
                            <div className="container_Form_Ingredientes">
                                <div className="input-col">
                                    <label className="font-semibold">Nombre completo:</label>
                                    <Field
                                        name="nombreCompleto"
                                        type="text"
                                        className="form-control input-formulario"
                                        placeholder="Nombre completo"
                                        style={{ marginBottom: 8 }}
                                    />
                                    <ErrorMessage name="nombreCompleto" component="div" className="error" />

                                    <label className="font-semibold mt-2">Teléfono:</label>
                                    <Field
                                        name="telefono"
                                        type="text"
                                        className="form-control input-formulario"
                                        placeholder="Teléfono"
                                        style={{ marginBottom: 8 }}
                                    />
                                    <ErrorMessage name="telefono" component="div" className="error" />

                                    <label className="font-semibold mt-2">Email:</label>
                                    <Field
                                        name="usuario.email"
                                        type="email"
                                        className="form-control input-formulario"
                                        placeholder="Email"
                                        style={{
                                            marginBottom: 8,
                                            backgroundColor: empleado ? "#e0e0e0" : undefined, 
                                            color: empleado ? "#555" : undefined,             
                                            cursor: empleado ? "not-allowed" : undefined       
                                        }}
                                        disabled={!!empleado}
                                    />
                                    <ErrorMessage name="usuario.email" component="div" className="error" />

                                    {!empleado && (
                                        <>
                                            <label className="font-semibold mt-2">Contraseña:</label>
                                            <div style={{
                                                position: "relative",
                                                marginBottom: 8,
                                                width: "100%",
                                                display: "flex",
                                                alignItems: "center"
                                            }}>
                                                <Field
                                                    name="usuario.contrasenia"
                                                    type={showPassword ? "text" : "password"}
                                                    className="form-control input-formulario"
                                                    placeholder="Contraseña"
                                                    style={{
                                                        paddingRight: 40,
                                                        borderRadius: 8,
                                                        border: "2px solid #ccc",
                                                        fontSize: "1rem",
                                                        height: 40,
                                                        boxSizing: "border-box",
                                                        width: "100%",
                                                    }}
                                                    autoComplete="new-password"
                                                />
                                                <span
                                                    onClick={() => setShowPassword((prev) => !prev)}
                                                    style={{
                                                        position: "absolute",
                                                        right: 12,
                                                        top: "50%",
                                                        transform: "translateY(-50%)",
                                                        cursor: "pointer",
                                                        color: "#888",
                                                        zIndex: 2,
                                                        fontSize: 18,
                                                        display: "flex",
                                                        alignItems: "center",
                                                        height: 40,
                                                    }}
                                                    tabIndex={0}
                                                    role="button"
                                                    aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                                                >
                                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                                </span>
                                            </div>
                                            <ErrorMessage
                                                name="usuario.contrasenia"
                                                render={msg =>
                                                    <div style={{
                                                        color: "#d17b0f",
                                                        fontWeight: 500,
                                                        fontSize: "0.97em",
                                                        marginBottom: 4,
                                                        marginTop: -2,
                                                    }}>
                                                        {msg}
                                                    </div>
                                                }
                                            />
                                        </>
                                    )}

                                    <FormControlLabel
                                        control={
                                            <Field
                                                type="checkbox"
                                                name="activo"
                                                as={Switch}
                                                color="primary"
                                            />
                                        }
                                        label="Activo"
                                        sx={{ mt: 2 }}
                                    />

                                    {/* Selector de roles estilo chips */}
                                    <FormControl fullWidth sx={{ mt: 2 }}>
                                        <InputLabel id="rol-label">Agregar rol</InputLabel>
                                        <Select
                                            labelId="rol-label"
                                            value={rolAAgregar}
                                            label="Agregar rol"
                                            onChange={e => setRolAAgregar(e.target.value)}
                                        >
                                            <MenuItem value="">
                                                <em>Seleccione un rol</em>
                                            </MenuItem>
                                            {rolesDisponibles
                                                .filter(r => !values.usuario.roles.includes(r.auth0RolId))
                                                .map((rol) => (
                                                    <MenuItem key={rol.auth0RolId} value={rol.auth0RolId}>
                                                        {rol.nombre}
                                                    </MenuItem>
                                                ))}
                                        </Select>
                                        <Button
                                            variant="contained"
                                            sx={{
                                                mt: 1,
                                                backgroundColor: "#f9a825",
                                                color: "white",
                                                fontWeight: "bold",
                                                borderRadius: "25px",
                                                minWidth: 120,
                                                "&:hover": { backgroundColor: "#f57f17" },
                                            }}
                                            disabled={!rolAAgregar}
                                            onClick={() => {
                                                if (
                                                    rolAAgregar &&
                                                    !values.usuario.roles.includes(rolAAgregar)
                                                ) {
                                                    setFieldValue("usuario.roles", [
                                                        ...values.usuario.roles,
                                                        rolAAgregar,
                                                    ]);
                                                    setRolAAgregar("");
                                                }
                                            }}
                                        >
                                            Agregar
                                        </Button>
                                        <ErrorMessage name="usuario.roles" component="div" className="error" />
                                    </FormControl>
                                    {/* Chips de roles seleccionados */}
                                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
                                        {values.usuario.roles.map((rolId) => {
                                            const rolObj = rolesDisponibles.find(r => r.auth0RolId === rolId);
                                            return (
                                                <Chip
                                                    key={rolId}
                                                    label={rolObj ? rolObj.nombre : rolId}
                                                    onDelete={() =>
                                                        setFieldValue(
                                                            "usuario.roles",
                                                            values.usuario.roles.filter((r) => r !== rolId)
                                                        )
                                                    }
                                                    deleteIcon={<FaTimes />}
                                                    sx={{
                                                        backgroundColor: "#f9a825",
                                                        color: "white",
                                                        fontWeight: "bold",
                                                    }}
                                                />
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="input-col">
                                    <label className="font-semibold">Calle:</label>
                                    <Field
                                        name="domicilio.calle"
                                        type="text"
                                        className="form-control input-formulario"
                                        placeholder="Calle"
                                        style={{ marginBottom: 8 }}
                                    />
                                    <ErrorMessage name="domicilio.calle" component="div" className="error" />

                                    <label className="font-semibold mt-2">Número:</label>
                                    <Field
                                        name="domicilio.numero"
                                        type="number"
                                        className="form-control input-formulario"
                                        placeholder="Número"
                                        style={{ marginBottom: 8 }}
                                    />
                                    <ErrorMessage name="domicilio.numero" component="div" className="error" />

                                    <label className="font-semibold mt-2">Localidad:</label>
                                    <Field
                                        name="domicilio.localidad"
                                        type="text"
                                        className="form-control input-formulario"
                                        placeholder="Localidad"
                                        style={{ marginBottom: 8 }}
                                    />
                                    <ErrorMessage name="domicilio.localidad" component="div" className="error" />

                                    <label className="font-semibold mt-2">Código Postal:</label>
                                    <Field
                                        name="domicilio.codigoPostal"
                                        type="number"
                                        className="form-control input-formulario"
                                        placeholder="Código Postal"
                                        style={{ marginBottom: 8 }}
                                    />
                                    <ErrorMessage name="domicilio.codigoPostal" component="div" className="error" />
                                </div>
                            </div>
                            <DialogActions sx={{ justifyContent: "space-between", p: 2 }}>
                                <Button
                                    onClick={onClose}
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
                                    disabled={isSubmitting}
                                >
                                    GUARDAR
                                </Button>
                            </DialogActions>
                        </Form>
                    )}
                </Formik>
            </DialogContent>
        </Dialog>
    );
};

export default ModalEmpleado;