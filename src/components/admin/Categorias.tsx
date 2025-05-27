import { ChangeEvent, useEffect, useState } from 'react';
import { FaSearch, FaTimes, FaPencilAlt, FaRegTrashAlt, FaAngleUp } from "react-icons/fa";
import { RubroInsumoDTO } from '../../types/RubroInsumo/RubroInsumoDTO';
import { RubroProductoDTO } from '../../types/RubroProducto/RubroProductoDTO';

// Tipos internos para el manejo en frontend
type RubroInsumo = RubroInsumoDTO & {
  id: number;
  subRubros: RubroInsumo[];
  tipo: "Insumo";
};
type RubroProducto = RubroProductoDTO & {
  id: number;
  tipo: "Producto";
};
type Rubro = RubroInsumo | RubroProducto;

const Categorias = () => {
  const [modalAbierto, setModalAbierto] = useState<boolean>(false);
  const [nombreRubro, setNombreRubro] = useState<string>("");
  const [tipoRubro, setTipoRubro] = useState<"Insumo" | "Producto">("Insumo");
  const [rubroPadreSeleccionado, setRubroPadreSeleccionado] = useState<string>("");
  const [rubrosInsumos, setRubrosInsumos] = useState<RubroInsumo[]>([]);
  const [rubrosProductos, setRubrosProductos] = useState<RubroProducto[]>([]);
  const [busqueda, setBusqueda] = useState<string>("");
  const [opcionFiltrar, setOpcionFiltrar] = useState<"Insumo" | "Producto" | "">("");
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
        alert('Error al cargar rubros insumo');
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
        alert('Error al cargar rubros producto');
        console.error("Error fetch rubros producto", error);
      }
    })();
  }, []);
  // ------------------------------------------------------------------- //

  const toggleAbierto = (id: number) => {
    setAbiertos(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const eliminarRubroInsumo = (rubros: RubroInsumo[], id: number): RubroInsumo[] => {
    return rubros
      .filter(rubro => rubro.id !== id)
      .map(rubro => ({
        ...rubro,
        subRubros: eliminarRubroInsumo(rubro.subRubros, id)
      }));
  };

  const limpiarAbiertos = (obj: { [id: number]: boolean }, id: number, rubros: RubroInsumo[]) => {
    delete obj[id];
    rubros.forEach(sub => limpiarAbiertos(obj, sub.id, sub.subRubros));
  };

  const handleEliminar = async (rubro: Rubro) => {
    if (rubro.tipo === "Insumo") {
      // Si tienes endpoint DELETE, descomenta:
      // await fetch(`http://localhost:8080/api/rubroinsumo/${rubro.id}`, { method: "DELETE" });
      const nuevosRubros = eliminarRubroInsumo(rubrosInsumos, rubro.id);
      setRubrosInsumos(nuevosRubros);
      setAbiertos(prev => {
        const nuevos = { ...prev };
        limpiarAbiertos(nuevos, rubro.id, (rubro as RubroInsumo).subRubros || []);
        return nuevos;
      });
    } else {
      // await fetch(`http://localhost:8080/api/rubroProducto/${rubro.id}`, { method: "DELETE" });
      setRubrosProductos(rubrosProductos.filter(r => r.id !== rubro.id));
    }
  };

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

  const filteredInsumos = filtrarRubrosInsumos(rubrosInsumos, busqueda);
  const filteredProductos = rubrosProductos.filter(rubro =>
    rubro.denominacion.toLowerCase().includes(busqueda.toLowerCase())
  );

  const obtenerRubrosInsumoAnidados = (rubros: RubroInsumo[]): RubroInsumo[] => {
    return rubros.flatMap(rubro => [rubro, ...obtenerRubrosInsumoAnidados(rubro.subRubros)]);
  };

  const encontrarPadre = (rubros: RubroInsumo[], id: number): RubroInsumo | undefined => {
    for (const rubro of rubros) {
      if (rubro.id === id) return rubro;
      const encontrado = encontrarPadre(rubro.subRubros, id);
      if (encontrado) return encontrado;
    }
  };

  const crearRubro = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombreRubro || !tipoRubro) return;

    try {
      if (editando && rubroEditando) {
        if (tipoRubro === "Insumo") {
          let nuevosRubros = [...rubrosInsumos];
          const eliminarRubro = (rubros: RubroInsumo[], id: number): RubroInsumo[] => {
            return rubros
              .filter(rubro => rubro.id !== id)
              .map(rubro => ({
                ...rubro,
                subRubros: eliminarRubro(rubro.subRubros, id)
              }));
          };
          nuevosRubros = eliminarRubro(nuevosRubros, rubroEditando.id);

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
          } catch (error) {
            alert('Fallo al editar rubro insumo');
            console.error("Error PUT rubro insumo", error);
            return;
          }

          const rubroActualizado: RubroInsumo = {
            ...rubroEditando as RubroInsumo,
            denominacion: nombreRubro,
          };
          if (rubroPadreSeleccionado) {
            const padre = encontrarPadre(nuevosRubros, Number(rubroPadreSeleccionado));
            if (padre) {
              padre.subRubros.push(rubroActualizado);
            }
          } else {
            nuevosRubros.push(rubroActualizado);
          }
          setRubrosInsumos(nuevosRubros);

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
          } catch (error) {
            alert('Fallo al editar rubro producto');
            console.error("Error PUT rubro producto", error);
            return;
          }
          setRubrosProductos(rubrosProductos.map(rubro =>
            rubro.id === rubroEditando.id
              ? { ...rubro, denominacion: nombreRubro }
              : rubro
          ));
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
            const res = await fetch("http://localhost:8080/api/rubroinsumo", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(nuevoRubro)
            });
            if (!res.ok) throw new Error('Error en POST rubro insumo');
            const resp = await res.json();
            const nuevoRubroObj: RubroInsumo = {
              id: resp.id,
              denominacion: resp.denominacion,
              activo: resp.activo,
              tipo: "Insumo",
              subRubros: []
            };
            if (rubroPadreSeleccionado) {
              const padre = encontrarPadre(rubrosInsumos, Number(rubroPadreSeleccionado));
              if (padre) {
                padre.subRubros.push(nuevoRubroObj);
                setRubrosInsumos([...rubrosInsumos]);
              }
            } else {
              setRubrosInsumos([...rubrosInsumos, nuevoRubroObj]);
            }
          } catch (error) {
            alert('Fallo al crear rubro insumo');
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
            const resp = await res.json();
            setRubrosProductos([...rubrosProductos, {
              id: resp.id,
              denominacion: resp.denominacion,
              activo: resp.activo,
              tipo: "Producto"
            }]);
          } catch (error) {
            alert('Fallo al crear rubro producto');
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
      alert('Error general en creación o edición de rubro');
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
    } else {
      setRubroPadreSeleccionado("");
    }
  };

  const RubroItem = ({ rubro, nivel = 0, abierto, onToggle,
  }: { rubro: Rubro; nivel?: number; abierto?: boolean; onToggle?: () => void;
  }) => {
    return (
      <div className="w-full">
        <div className="flex items-center h-10">
          <div className="w-1/2 pl-10 flex items-center gap-5" style={{ marginLeft: `${rubro.tipo === "Insumo" ? nivel * 20 : 0}px` }}>
            <p className="underline">{rubro.denominacion}</p>
          </div>
          <div className="flex justify-end w-full pr-10 gap-5">
            <FaPencilAlt className="cursor-pointer hover:text-tertiary" onClick={() => handleEditar(rubro)}
            />
            <FaRegTrashAlt className="cursor-pointer hover:text-tertiary" onClick={() => handleEliminar(rubro)}
            />
            {rubro.tipo === "Insumo" && (rubro as RubroInsumo).subRubros.length > 0 && (
              <FaAngleUp onClick={onToggle} className={`cursor-pointer h-5 ${abierto ? "rotate-180" : ""}`} />
            )}
          </div>
        </div>
        {rubro.tipo === "Insumo" && abierto && (
          <div className="ml-5">
            {(rubro as RubroInsumo).subRubros.map((subrubro) => (
              <RubroItem key={subrubro.id} rubro={subrubro} nivel={nivel + 1} abierto={abiertos[subrubro.id]} onToggle={() => toggleAbierto(subrubro.id)} />
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
          <input type="search" placeholder='Buscar' onChange={(e) => setBusqueda(e.target.value)} className='bg-white py-2 pl-3 pr-8 border rounded-2xl focus:outline-[#BD1E22]' />
          <FaSearch className={`relative right-7 ${busqueda ? "hidden" : "block"}`} />
        </form>
        <div className='flex gap-2'>
          <button className={`font-bold py-2 rounded-lg px-3 ${opcionFiltrar === "Insumo" ? "bg-gray-200" : "bg-white"}`} onClick={() => setOpcionFiltrar("Insumo")} type="button" > Insumos </button>
          <button className={`font-bold py-2 rounded-lg px-3 ${opcionFiltrar === "Producto" ? "bg-gray-200" : "bg-white"}`} onClick={() => setOpcionFiltrar("Producto")} type="button"> Productos </button>
        </div>
        <button className='bg-secondary text-white px-2 py-2 rounded-2xl cursor-pointer' onClick={() => { setModalAbierto(true); setEditando(false); setRubroEditando(null); setNombreRubro(""); setTipoRubro("Insumo"); setRubroPadreSeleccionado(""); }} > +Agregar Categoría
        </button>
      </div>

      <div className="mt-10 bg-white h-10 w-8/10 pl-10 flex items-center rounded-t-lg font-semibold">Nombre</div>

      <ul className='w-8/10'>
        {opcionFiltrar === "Insumo" && filteredInsumos.map((rubro) => (
          <li className='border-b-1 mt-2 underline-offset-6 font-semibold text-md' key={rubro.id}>
            <RubroItem rubro={rubro} abierto={abiertos[rubro.id]} onToggle={() => toggleAbierto(rubro.id)} />
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
            <button onClick={() => { setModalAbierto(false); setEditando(false); setRubroEditando(null); setNombreRubro(""); setTipoRubro("Insumo"); setRubroPadreSeleccionado(""); }} className="absolute top-4 right-4 text-gray-500 hover:text-red-600" >
              <FaTimes className="text-secondary h-6 w-6" />
            </button>
            <h2 className="text-2xl font-bold mb-4 text-secondary">
              {editando ? "Editar Categoría" : "Nueva Categoría"}
            </h2>
            <form onSubmit={crearRubro}>
              <div className="mb-4">
                <label className="block mb-2">Nombre</label>
                <input type="text" placeholder='Nombre de la categoria' className="w-full p-2 border rounded bg-white" value={nombreRubro} onChange={(e) => setNombreRubro(e.target.value)} required />
              </div>

              <div className="mb-4">
                <label className="block mb-2">Tipo</label>
                <div className="flex gap-4">
                  <label>
                    <input type="radio" name="tipo" value="Insumo" checked={tipoRubro === "Insumo"} onChange={() => setTipoRubro("Insumo")} disabled={editando} />
                    <span className="ml-2">Insumo</span>
                  </label>
                  <label>
                    <input type="radio" name="tipo" value="Producto" checked={tipoRubro === "Producto"} onChange={() => setTipoRubro("Producto")} disabled={editando} />
                    <span className="ml-2">Producto</span>
                  </label>
                </div>
              </div>

              {tipoRubro === "Insumo" && (
                <div className="mb-4">
                  <label className="block mb-2">Rubro Padre (Opcional)</label>
                  <select className="w-full p-2 border rounded bg-white" onChange={(e) => setRubroPadreSeleccionado(e.target.value)} value={rubroPadreSeleccionado} disabled={editando && rubroEditando?.tipo === "Insumo" && (rubroEditando as RubroInsumo).subRubros.length > 0} >
                    <option value="">Ninguno</option>
                    {obtenerRubrosInsumoAnidados(rubrosInsumos)
                      .filter(r => !editando || r.id !== rubroEditando?.id)
                      .map((rubro) => (
                        <option key={rubro.id} value={rubro.id}>
                          {"— ".repeat(rubro.subRubros.length)} {rubro.denominacion}
                        </option>
                      ))}
                  </select>
                  {editando && rubroEditando?.tipo === "Insumo" && (rubroEditando as RubroInsumo).subRubros.length > 0 && (
                    <p className="text-xs text-gray-500 mt-1">No puedes cambiar el padre si el rubro tiene subrubros.</p>
                  )}
                </div>
              )}

              <div className="flex justify-end gap-4 mt-6">
                <button type="button" onClick={() => { setModalAbierto(false); setEditando(false); setRubroEditando(null); setNombreRubro(""); setTipoRubro("Insumo"); setRubroPadreSeleccionado(""); }} className="px-4 py-2 text-gray-600 hover:text-gray-800"> Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-tertiary text-white rounded hover:bg-secondary transition-colors"> {editando ? "Guardar Cambios" : "Crear"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Categorias;