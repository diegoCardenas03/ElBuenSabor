import { ChangeEvent, useState } from 'react';
import { FaSearch, FaTimes, FaPencilAlt, FaRegTrashAlt, FaAngleUp } from "react-icons/fa";
<<<<<<< Updated upstream
import { RubroInsumoDTO } from '../../types/RubroProducto/RubroProductoDTO';
import { RubroProductoDTO } from '../../types/RubroInsumo/RubroInsumoDTO';
=======
import { RubroInsumoDTO } from '../../types/RubroInsumo/RubroInsumoDTO';
import { RubroProductoDTO } from '../../types/RubroProducto/RubroProductoDTO';
import Swal from "sweetalert2";
>>>>>>> Stashed changes

type Rubro = RubroInsumoDTO | RubroProductoDTO;

const Categorias = () => {
  const [modalAbierto, setModalAbierto] = useState<boolean>(false);
  const [nombreRubro, setNombreRubro] = useState<string>("");
  const [tipoRubro, setTipoRubro] = useState<"Insumo" | "Producto">("Insumo");
  const [rubroPadreSeleccionado, setRubroPadreSeleccionado] = useState<string>("");
  const [rubrosInsumos, setRubrosInsumos] = useState<RubroInsumo[]>([]);
  const [rubrosProductos, setRubrosProductos] = useState<RubroProducto[]>([]);
  const [busqueda, setBusqueda] = useState<string>("");
  const [opcionFiltrar, setOpcionFiltrar] = useState<"Insumo" | "Producto" | "">("");
<<<<<<< Updated upstream
=======
  const [abiertos, setAbiertos] = useState<{ [id: number]: boolean }>({});

  const [editando, setEditando] = useState<boolean>(false);
  const [rubroEditando, setRubroEditando] = useState<Rubro | null>(null);

  // --------------------- FETCH DATA FROM BACKEND --------------------- //
  useEffect(() => {
    // Traer todos los Rubros Insumo
    (async () => {
      try {
        const res = await fetch('http://localhost:8080/api/rubroinsumo');
        if (!res.ok) throw new Error('Fallo al traer rubros insumo');
        const data: any[] = await res.json();
        function mapRubroInsumo(dto: any): RubroInsumo {
          return {
            id: dto.id,
            denominacion: dto.denominacion,
            activo: dto.activo,
            tipo: "Insumo",
            subRubros: (dto.subRubros || []).map(mapRubroInsumo)
          }
        }
        setRubrosInsumos(data.map(mapRubroInsumo));
      } catch (error) {
        Swal.fire({
          position: "bottom-end",
          icon: "error",
          title: "Error al cargar rubros insumo",
          showConfirmButton: false,
          timer: 1000,
          width: "20em"
        });
        console.error("Error fetch rubros insumo", error);
      }
    })();

    // Traer todos los Rubros Producto
    (async () => {
      try {
        const res = await fetch('http://localhost:8080/api/rubroProducto');
        if (!res.ok) throw new Error('Fallo al traer rubros producto');
        const data: any[] = await res.json();
        setRubrosProductos(
          data.map(dto => ({
            id: dto.id,
            denominacion: dto.denominacion,
            activo: dto.activo,
            tipo: "Producto"
          }))
        );
      } catch (error) {
        Swal.fire({
          position: "bottom-end",
          icon: "error",
          title: "Error al cargar rubros producto",
          showConfirmButton: false,
          timer: 1000,
          width: "20em"
        });
        console.error("Error fetch rubros producto", error);
      }
    })();
  }, []);
  // ------------------------------------------------------------------- //

  const toggleAbierto = (id: number) => {
    setAbiertos(prev => ({ ...prev, [id]: !prev[id] }));
  };
>>>>>>> Stashed changes

  // Función recursiva para eliminar rubros Insumo
  const eliminarRubroInsumo = (rubros: RubroInsumo[], id: number): RubroInsumo[] => {
    return rubros.filter(rubro => rubro.id !== id)
      .map(rubro => ({
        ...rubro,
        subRubros: eliminarRubroInsumo(rubro.subRubros, id)
      }));
  };

  // Función recursiva para filtrar rubros Insumo
  const filtrarRubrosInsumos = (rubros: RubroInsumo[], termino: string): RubroInsumo[] => {
    const term = termino.toLowerCase();
    return rubros.filter(rubro => {
      const nombreMatch = rubro.denominacion.toLowerCase().includes(term);
      const subRubrosFiltrados = filtrarRubrosInsumos(rubro.subRubros, termino);
      return nombreMatch || subRubrosFiltrados.length > 0;
    }).map(rubro => ({
      ...rubro,
      subRubros: filtrarRubrosInsumos(rubro.subRubros, termino)
    }));
  };

  // Filtrar resultados
  const filteredInsumos = filtrarRubrosInsumos(rubrosInsumos, busqueda);
  const filteredProductos = rubrosProductos.filter(rubro => 
    rubro.denominacion.toLowerCase().includes(busqueda.toLowerCase())
  );

  // Obtener todos los rubros Insumo anidados
  const obtenerRubrosInsumoAnidados = (rubros: RubroInsumo[]): RubroInsumo[] => {
    // Devuelve todos los rubros y subrubros en un array plano (para el select de padre)
    return rubros.flatMap(rubro => [rubro, ...obtenerRubrosInsumoAnidados(rubro.subRubros)]);
  };

<<<<<<< Updated upstream
  // Crear nuevo rubro
  const crearRubro = (e: React.FormEvent) => {
=======
  const encontrarPadre = (rubros: RubroInsumo[], id: number): RubroInsumo | undefined => {
    for (const rubro of rubros) {
      if (rubro.id === id) return rubro;
      const encontrado = encontrarPadre(rubro.subRubros, id);
      if (encontrado) return encontrado;
    }
  };

  // Utilidad inmutable para agregar un subrubro a un padre
  function agregarSubRubro(rubros: RubroInsumo[], padreId: number, nuevo: RubroInsumo): RubroInsumo[] {
    return rubros.map(rubro => {
      if (rubro.id === padreId) {
        return {
          ...rubro,
          subRubros: [...rubro.subRubros, nuevo]
        };
      }
      return {
        ...rubro,
        subRubros: agregarSubRubro(rubro.subRubros, padreId, nuevo)
      };
    });
  }

  const crearRubro = async (e: React.FormEvent) => {
>>>>>>> Stashed changes
    e.preventDefault();
    if (!nombreRubro || !tipoRubro) return;

    if (tipoRubro === "Insumo") {
      const nuevoRubro: RubroInsumo = {
        id: Date.now(),
        denominacion: nombreRubro,
        activo: true,
        tipo: "Insumo",
        subRubros: [],
      };

<<<<<<< Updated upstream
      if (rubroPadreSeleccionado) {
        const encontrarPadre = (rubros: RubroInsumo[]): RubroInsumo | undefined => {
          for (const rubro of rubros) {
            if (rubro.id === Number(rubroPadreSeleccionado)) return rubro;
            const encontrado = encontrarPadre(rubro.subRubros);
            if (encontrado) return encontrado;
          }
        };

        const padre = encontrarPadre(rubrosInsumos);
        if (padre) {
          padre.subRubros.push(nuevoRubro);
          setRubrosInsumos([...rubrosInsumos]);
        }
      } else {
        setRubrosInsumos([...rubrosInsumos, nuevoRubro]);
      }
=======
          const rubroEditado: RubroInsumoDTO = {
            denominacion: nombreRubro,
            activo: true,
            rubroPadreId: rubroPadreSeleccionado ? Number(rubroPadreSeleccionado) : undefined,
            tipo: "Insumo"
          };
          try {
            const res = await fetch(`http://localhost:8080/api/rubroinsumo/${rubroEditando.id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(rubroEditado)
            });
            if (!res.ok) throw new Error('Error en PUT rubro insumo');
            let resp = null;
            try {
              resp = await res.json();
            } catch (e) {
              resp = null;
            }
            const rubroActualizado: RubroInsumo = {
              ...rubroEditando as RubroInsumo,
              denominacion: nombreRubro,
            };
            if (rubroPadreSeleccionado) {
              const nuevos = agregarSubRubro(nuevosRubros, Number(rubroPadreSeleccionado), rubroActualizado);
              setRubrosInsumos(nuevos);
            } else {
              setRubrosInsumos([...nuevosRubros, rubroActualizado]);
            }
          } catch (error) {
            Swal.fire({
              position: "bottom-end",
              icon: "error",
              title: "Fallo al editar rubro insumo",
              showConfirmButton: false,
              timer: 1000,
              width: "20em"
            });
            console.error("Error PUT rubro insumo", error);
            return;
          }
        } else {
          const rubroEditado: RubroProductoDTO = {
            denominacion: nombreRubro,
            activo: true,
          };
          try {
            const res = await fetch(`http://localhost:8080/api/rubroProducto/${rubroEditando.id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(rubroEditado)
            });
            if (!res.ok) throw new Error('Error en PUT rubro producto');
            let resp = null;
            try {
              resp = await res.json();
            } catch (e) {
              resp = null;
            }
            setRubrosProductos(rubrosProductos.map(rubro =>
              rubro.id === rubroEditando.id
                ? { ...rubro, denominacion: nombreRubro }
                : rubro
            ));
          } catch (error) {
            Swal.fire({
              position: "bottom-end",
              icon: "error",
              title: "Fallo al editar rubro producto",
              showConfirmButton: false,
              timer: 1000,
              width: "20em"
            });
            console.error("Error PUT rubro producto", error);
            return;
          }
        }
      } else {
        if (tipoRubro === "Insumo") {
          const nuevoRubro: RubroInsumoDTO = {
            denominacion: nombreRubro,
            activo: true,
            rubroPadreId: rubroPadreSeleccionado ? Number(rubroPadreSeleccionado) : undefined,
            tipo: "Insumo"
          };
          try {
            const res = await fetch("http://localhost:8080/api/rubroinsumo/save", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(nuevoRubro)
            });
            if (!res.ok) throw new Error('Error en POST rubro insumo');
            Swal.fire({
              position: "bottom-end",
              icon: "success",
              title: "Categoria Insumo creada correctamente",
              showConfirmButton: false,
              timer: 1000,
              width: "20em"
            });
            let resp = null;
            try {
              resp = await res.json();
            } catch (e) {
              resp = null;
            }
            if (resp) {
              const nuevoRubroObj: RubroInsumo = {
                id: resp.id,
                denominacion: resp.denominacion,
                activo: resp.activo,
                tipo: "Insumo",
                subRubros: []
              };
              if (rubroPadreSeleccionado) {
                const nuevos = agregarSubRubro(rubrosInsumos, Number(rubroPadreSeleccionado), nuevoRubroObj);
                setRubrosInsumos(nuevos);
              } else {
                setRubrosInsumos([...rubrosInsumos, nuevoRubroObj]);
              }
            }
          } catch (error) {
            Swal.fire({
              position: "bottom-end",
              icon: "error",
              title: "Error al crear rubro insumo",
              showConfirmButton: false,
              timer: 1000,
              width: "20em"
            });
            console.error("Error POST rubro insumo", error);
            return;
          }
        } else {
          const nuevoProducto: RubroProductoDTO = {
            denominacion: nombreRubro,
            activo: true,
          };
          try {
            const res = await fetch("http://localhost:8080/api/rubroProducto/save", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(nuevoProducto)
            });
            if (!res.ok) throw new Error('Error en POST rubro producto');
            Swal.fire({
              position: "bottom-end",
              icon: "success",
              title: "Categoria creada correctamente",
              showConfirmButton: false,
              timer: 1000,
              width: "20em"
            });
            let resp = null;
            try {
              resp = await res.json();
            } catch (e) {
              resp = null;
            }
            if (resp) {
              setRubrosProductos([...rubrosProductos, {
                id: resp.id,
                denominacion: resp.denominacion,
                activo: resp.activo,
                tipo: "Producto"
              }]);
            }
          } catch (error) {
            Swal.fire({
              position: "bottom-end",
              icon: "error",
              title: "Error al crear rubro producto",
              showConfirmButton: false,
              timer: 1000,
              width: "20em"
            });
            console.error("Error POST rubro producto", error);
            return;
          }
        }
      }

      setModalAbierto(false);
      setNombreRubro("");
      setRubroPadreSeleccionado("");
      setEditando(false);
      setRubroEditando(null);

    } catch (error) {
      Swal.fire({
        position: "bottom-end",
        icon: "error",
        title: "Error general en creacion o edicion del rubro",
        showConfirmButton: false,
        timer: 1000,
        width: "20em"
      });
      console.error("Error general crear/editar rubro", error);
    }
  };

  const handleEditar = (rubro: Rubro) => { setEditando(true); setRubroEditando(rubro); setNombreRubro(rubro.denominacion); setTipoRubro(rubro.tipo); setModalAbierto(true);
    if (rubro.tipo === "Insumo") {
      const buscarPadre = (rubros: RubroInsumo[], id: number, padreId?: number): number | "" => {
        for (const rubroItem of rubros) {
          if (rubroItem.subRubros.some(sub => sub.id === id)) return rubroItem.id;
          const resultado = buscarPadre(rubroItem.subRubros, id, rubroItem.id);
          if (resultado) return resultado;
        }
        return "";
      };
      const padreId = buscarPadre(rubrosInsumos, rubro.id);
      setRubroPadreSeleccionado(padreId ? String(padreId) : "");
>>>>>>> Stashed changes
    } else {
      const nuevoProducto: RubroProducto = {
        id: Date.now(),
        denominacion: nombreRubro,
        activo: true,
        tipo: "Producto",
      };
      setRubrosProductos([...rubrosProductos, nuevoProducto]);
    }

    setModalAbierto(false);
    setNombreRubro("");
    setRubroPadreSeleccionado("");
  };

  // Componente de rubro
  const RubroItem = ({ rubro, nivel = 0 }: { rubro: Rubro; nivel?: number }) => {
    const [subAbierto, setSubAbierto] = useState(false);

    return (
      <div className="w-full">
        <div className="flex items-center h-10">
          <div className="w-1/2 pl-10 flex items-center gap-5" style={{ marginLeft: `${rubro.tipo === "Insumo" ? nivel * 20 : 0}px` }}>
            <p className="underline">{rubro.denominacion}</p>
          </div>
          <div className="flex justify-end w-full pr-10 gap-5">
            <FaPencilAlt className="cursor-pointer hover:text-tertiary" />
            <FaRegTrashAlt
              className="cursor-pointer hover:text-tertiary"
              onClick={() => {
                if (rubro.tipo === "Insumo") {
                  const nuevosRubros = eliminarRubroInsumo(rubrosInsumos, rubro.id);
                  setRubrosInsumos(nuevosRubros);
                } else {
                  setRubrosProductos(rubrosProductos.filter(r => r.id !== rubro.id));
                }
              }}
            />
            {rubro.tipo === "Insumo" && rubro.subRubros.length > 0 && (
              <FaAngleUp
                onClick={() => setSubAbierto(!subAbierto)}
                className={`cursor-pointer h-5 ${subAbierto ? "rotate-180" : ""}`}
              />
            )}
          </div>
        </div>

        {rubro.tipo === "Insumo" && subAbierto && (
          <div className="ml-5">
            {rubro.subRubros.map((subrubro) => (
              <RubroItem key={subrubro.id} rubro={subrubro} nivel={nivel + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <div className='w-5/6 mt-10 flex justify-around items-center'>
        <form className='flex items-center'>
          <input 
            type="search" 
            placeholder='Buscar' 
            onChange={(e) => setBusqueda(e.target.value)} 
            className='bg-white py-2 pl-3 pr-8 border rounded-2xl focus:outline-[#BD1E22]' 
          />
          <FaSearch className={`relative right-7 ${busqueda ? "hidden" : "block"}`} />
        </form>
        <div className='flex gap-2'>
          <button 
            className={`font-bold py-2 rounded-lg px-3 ${opcionFiltrar === "Insumo" ? "bg-gray-200" : "bg-white"}`} 
            onClick={() => setOpcionFiltrar("Insumo")}
          >
            Insumos
          </button>
          <button 
            className={`font-bold py-2 rounded-lg px-3 ${opcionFiltrar === "Producto" ? "bg-gray-200" : "bg-white"}`} 
            onClick={() => setOpcionFiltrar("Producto")}
          >
            Productos
          </button>
        </div>
        <button 
          className='bg-secondary text-white px-2 py-2 rounded-2xl cursor-pointer'
          onClick={() => setModalAbierto(true)}
        >
          +Agregar Categoría
        </button>
      </div>

      <div className="mt-10 bg-white h-10 w-8/10 pl-10 flex items-center rounded-t-lg font-semibold">
        Nombre
      </div>

      <ul className='w-8/10'>
        {opcionFiltrar === "Insumo" && filteredInsumos.map((rubro) => (
          <li className='border-b-1 mt-2 underline-offset-6 font-semibold text-md' key={rubro.id}>
            <RubroItem rubro={rubro} />
          </li>
        ))}

        {opcionFiltrar === "Producto" && filteredProductos.map((rubro) => (
          <li className='border-b-1 mt-2 underline-offset-6 font-semibold text-md' key={rubro.id}>
            <RubroItem rubro={rubro} />
          </li>
        ))}
      </ul>

      {modalAbierto && (
        <div className="fixed inset-0 bg-black/50 z-40">
          <div className="rounded-3xl p-5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary w-1/2">
            <button
              onClick={() => setModalAbierto(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-red-600"
            >
              <FaTimes className="text-secondary h-6 w-6" />
            </button>
            <h2 className="text-2xl font-bold mb-4 text-secondary">Nueva Categoría</h2>
            <form onSubmit={crearRubro}>
              <div className="mb-4">
                <label className="block mb-2">Nombre</label>
                <input
                  type="text"
                  placeholder='Nombre de la categoria'
                  className="w-full p-2 border rounded bg-white"
                  value={nombreRubro}
                  onChange={(e) => setNombreRubro(e.target.value)}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block mb-2">Tipo</label>
                <div className="flex gap-4">
                  <label>
                    <input
                      type="radio"
                      name="tipo"
                      value="Insumo"
                      checked={tipoRubro === "Insumo"}
                      onChange={() => setTipoRubro("Insumo")}
                    />
                    <span className="ml-2">Insumo</span>
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="tipo"
                      value="Producto"
                      checked={tipoRubro === "Producto"}
                      onChange={() => setTipoRubro("Producto")}
                    />
                    <span className="ml-2">Producto</span>
                  </label>
                </div>
              </div>

              {tipoRubro === "Insumo" && (
                <div className="mb-4">
                  <label className="block mb-2">Rubro Padre (Opcional)</label>
                  <select
                    className="w-full p-2 border rounded bg-white"
                    onChange={(e) => setRubroPadreSeleccionado(e.target.value)}
                  >
                    <option value="">Ninguno</option>
                    {obtenerRubrosInsumoAnidados(rubrosInsumos).map((rubro) => (
                      <option key={rubro.id} value={rubro.id}>
                        {"— ".repeat(rubro.subRubros.length)} {rubro.denominacion}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex justify-end gap-4 mt-6">
                <button 
                  type="button" 
                  onClick={() => setModalAbierto(false)} 
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-tertiary text-white rounded hover:bg-secondary transition-colors"
                >
                  Crear
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Categorias;