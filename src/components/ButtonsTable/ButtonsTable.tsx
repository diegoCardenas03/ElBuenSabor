import { useAppDispatch } from "../../hooks/redux";
import { setElementActive } from "../../hooks/redux/slices/TableReducer";
import { InsumoDTO } from "../../types/Insumo/InsumoDTO";
import { FaPencilAlt } from "react-icons/fa";
// Interfaz para los props del componente
interface IButtonsTable {
  el: InsumoDTO; // Elemento de tipo Insumo
  handleDelete: (id: number) => void; // Función para manejar la eliminación de un elemento
  setOpenModal: (state: boolean) => void; // Función para manejar la eliminación de un elemento
}

export const ButtonsTable = ({
  el,
  // handleDelete,
  setOpenModal,
}: IButtonsTable) => {
  const dispatch = useAppDispatch();

  // Función para manejar la selección del modal para editar
  const handleModalSelected = () => {
    // Establecer el elemento activo en el estado
    dispatch(setElementActive({ element: el }));
    // Mostrar el modal para editar el elemento
    setOpenModal(true);
  };

  // // Función para manejar la eliminación de un elemento
  // const handleDeleteItem = () => {
  //   handleDelete(el.id); // Llamar a la función handleDelete con el ID del elemento
  // };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-around",
      }}
    >
      {/* Botón para editar el elemento */}
      <button className="rounded-3xl bg-[#BD1E22] text-white px-4 py-2 font-primary font-semibold shadow hover:scale-105 transition text-lg"  onClick={handleModalSelected}>
        <FaPencilAlt />
      </button>
       {/* Botón para eliminar el elemento */}
      {/* // <Button variant="contained" color="error" onClick={handleDeleteItem}>
      //   <span className="material-symbols-outlined">delete_forever</span>
      // </Button> */}
    </div>
  );
};
