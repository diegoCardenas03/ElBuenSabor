import { useState } from 'react';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { FaSearch, FaPlus } from 'react-icons/fa';
import { AgregarCategoria } from '../../components/admin/configuracionPage/agregarCategoria';
import { AgregarSubcategoria } from '../../components/admin/configuracionPage/agregarSubCategoria';
import { EliminarCategoria } from '../../components/admin/configuracionPage/eliminarCategoria';
import { CategoriaItem } from '../../components/admin/configuracionPage/CategoriaItem';
import { SubCategoriaList } from '../../components/admin/configuracionPage/SubCategoriaList';

const Configuracion = () => {
  // Estados principales
  const [busqueda, setBusqueda] = useState('');
  const [subcategoriasVisibles, setSubcategoriasVisibles] = useState<Record<number, boolean>>({});
  const [filtroPrincipal, setFiltroPrincipal] = useState<string | null>(null);
  const [filtroProductosInsumos, setFiltroProductosInsumos] = useState<string | null>(null);
  const [listaCategorias, setListaCategorias] = useState<Array<{
    id: number;
    nombre: string;
    subcategorias: string[];
  }>>([]);

  // Estados para modales y formularios
  const [abrirAgregarCategoria, setAbrirAgregarCategoria] = useState(false);
  const [mostrarModalSubcategoria, setMostrarModalSubcategoria] = useState(false);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<number | null>(null);
  const [mostrarConfirmacionEliminar, setMostrarConfirmacionEliminar] = useState<number | null>(null);
  
  // Estados para datos temporales
  const [nuevaCategoria, setNuevaCategoria] = useState('');
  const [nuevaSubcategoria, setNuevaSubcategoria] = useState('');

  // Estados para edición
  const [editandoCategoria, setEditandoCategoria] = useState<number | null>(null);
  const [nombreEditado, setNombreEditado] = useState('');
  const [editandoSubcategoria, setEditandoSubcategoria] = useState<{
    categoriaId: number;
    index: number;
  } | null>(null);
  const [subcategoriaEditada, setSubcategoriaEditada] = useState('');

  // Funciones para categorías
  const agregarCategoria = (e: React.FormEvent) => {
    e.preventDefault();
    if (nuevaCategoria.trim()) {
      const nuevoId = listaCategorias.length > 0 
        ? Math.max(...listaCategorias.map(c => c.id)) + 1 
        : 1;
      
      setListaCategorias(prev => [
        ...prev,
        {
          id: nuevoId,
          nombre: nuevaCategoria,
          subcategorias: []
        }
      ]);
      setNuevaCategoria('');
      setAbrirAgregarCategoria(false);
    }
  };

  const editarCategoria = (id: number) => {
    if (nombreEditado.trim()) {
      setListaCategorias(prev =>
        prev.map(cat =>
          cat.id === id
            ? { ...cat, nombre: nombreEditado }
            : cat
        )
      );
      setEditandoCategoria(null);
      setNombreEditado('');
    }
  };

  const eliminarCategoria = (id: number) => {
    setListaCategorias(prev => prev.filter(cat => cat.id !== id));
    setMostrarConfirmacionEliminar(null);
  };

  // Funciones para subcategorías
  const agregarSubcategoria = (e: React.FormEvent) => {
    e.preventDefault();
    if (nuevaSubcategoria.trim() && categoriaSeleccionada) {
      setListaCategorias(prev => 
        prev.map(cat => 
          cat.id === categoriaSeleccionada
            ? { ...cat, subcategorias: [...cat.subcategorias, nuevaSubcategoria] }
            : cat
        )
      );
      setNuevaSubcategoria('');
      setMostrarModalSubcategoria(false);
    }
  };

  const editarSubcategoria = (categoriaId: number, index: number) => {
    if (subcategoriaEditada.trim()) {
      setListaCategorias(prev =>
        prev.map(cat =>
          cat.id === categoriaId
            ? {
                ...cat,
                subcategorias: cat.subcategorias.map((sub, i) => 
                  i === index ? subcategoriaEditada : sub
                )
              }
            : cat
        )
      );
      setEditandoSubcategoria(null);
      setSubcategoriaEditada('');
    }
  };

  const eliminarSubcategoria = (categoriaId: number, index: number) => {
    setListaCategorias(prev =>
      prev.map(cat =>
        cat.id === categoriaId
          ? {
              ...cat,
              subcategorias: cat.subcategorias.filter((_, i) => i !== index)
            }
          : cat
      )
    );
  };

  // Funciones auxiliares
  const toggleSubcategorias = (id: number) => {
    setSubcategoriasVisibles(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const categoriasFiltradas = listaCategorias.filter((categoria) => {
    const nombreCategoria = categoria.nombre.toLowerCase();
    const coincideCategoria = nombreCategoria.includes(busqueda.toLowerCase());

    const coincideSubcategoria = categoria.subcategorias.some((sub) =>
      sub.toLowerCase().includes(busqueda.toLowerCase())
    );

    return coincideCategoria || coincideSubcategoria;
  });


  return (
    <>
      <AdminHeader />
      <main className="min-h-screen pb-30 bg-primary pt-4 md:pt-12 px-4">
        {/* Filtros principales */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-10 mb-12">
          <button onClick={() => setFiltroPrincipal('Categorias')} 
            className={`cursor-pointer rounded-full md:w-60 w-full py-2 text-xl ${
              filtroPrincipal === 'Categorias' 
                ? 'font-semibold shadow-lg/20 rounded-xl bg-white text-tertiary' 
                : 'bg-transparent text-tertiary'
            }`}>Categorías</button>
          <button onClick={() => setFiltroPrincipal('Roles')} 
            className={`cursor-pointer rounded-full md:w-60 w-full py-2 text-xl ${
              filtroPrincipal === 'Roles' 
                ? 'font-semibold shadow-lg/20 rounded-xl bg-white text-tertiary' 
                : 'bg-transparent text-tertiary'
            }`}>Roles</button>
        </div>

        {/* Contenido principal */}
        {filtroPrincipal === 'Categorias' && (
          <>
            {/* Barra de herramientas */}
            <div className="flex flex-col md:flex-row justify-around items-center mb-8 lg:px-25">
              {/* Buscador */}
              <div className="relative w-full sm:w-64">
                <FaSearch className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 mr-2" height="20"/>
                <input type="text" placeholder="Buscar..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} className="bg-white border px-4 py-2 rounded-4xl w-full" />
              </div>

              {/* Filtros secundarios */}
              <div className="flex flex-col sm:flex-row justify-center">
                <button onClick={() => setFiltroProductosInsumos('Insumos')} 
                  className={`rounded-4xl cursor-pointer md:w-35 w-full py-2 text-lg ${
                    filtroProductosInsumos === 'Insumos' 
                      ? 'font-semibold shadow-lg/20 rounded-xl bg-white text-tertiary' 
                      : 'bg-transparent text-tertiary'
                  }`}
                >Insumos</button>
                <button onClick={() => setFiltroProductosInsumos('Productos')} 
                  className={`rounded-4xl cursor-pointer md:w-35 w-full py-2 text-lg ${
                    filtroProductosInsumos === 'Productos' 
                      ? 'font-semibold shadow-lg/20 rounded-xl bg-white text-tertiary' 
                      : 'bg-transparent text-tertiary'
                  }`}>Productos</button>
              </div>

              {/* Botón agregar categoría */}
              <button onClick={() => setAbrirAgregarCategoria(true)} className="mt-4 md:mt-0 flex items-center gap-2 bg-secondary text-white px-4 py-2 rounded-4xl shadow-md cursor-pointer hover:bg-secondary-dark transition-colors"><FaPlus />Agregar Categoría</button>
            </div>

            {/* Listado de categorías */}
            <div className="w-5/6 mt-10 mx-auto min-h-80 h-auto">
              {/* Encabezado de la tabla */}
              <div className="w-full rounded-2xl shadow-sm/30 bg-white h-10 flex items-center">
                <p className="pl-10 font-bold">Nombre</p>
              </div>
              
              {/* Componente Agregar Categoría */}
              <AgregarCategoria
                isOpen={abrirAgregarCategoria}
                onClose={() => {
                  setAbrirAgregarCategoria(false);
                  setNuevaCategoria('');
                }}
                nuevaCategoria={nuevaCategoria}
                setNuevaCategoria={setNuevaCategoria}
                onSubmit={agregarCategoria}
              />

              {/* Componente Agregar Subcategoría */}
              <AgregarSubcategoria
                isOpen={mostrarModalSubcategoria}
                onClose={() => {
                  setMostrarModalSubcategoria(false);
                  setNuevaSubcategoria('');
                }}
                nuevaSubcategoria={nuevaSubcategoria}
                setNuevaSubcategoria={setNuevaSubcategoria}
                onSubmit={agregarSubcategoria}
              />

              {/* Componente Eliminar Categoría */}
              <EliminarCategoria
                isOpen={mostrarConfirmacionEliminar !== null}
                onClose={() => setMostrarConfirmacionEliminar(null)}
                onConfirm={() => {
                  if (mostrarConfirmacionEliminar !== null) {
                    eliminarCategoria(mostrarConfirmacionEliminar);
                  }
                }}
              />

              {/* Lista de categorías */}
              <section className="mt-8">
                {listaCategorias.length === 0 ? (
                  <div className="text-center py-10 text-gray-500">No hay categorías creadas aún</div>
                ) : (
                  categoriasFiltradas.map((categoria) => (
                    <CategoriaItem
                      key={categoria.id}
                      categoria={categoria}
                      editandoCategoria={editandoCategoria}
                      nombreEditado={nombreEditado}
                      subcategoriasVisibles={subcategoriasVisibles}
                      setEditandoCategoria={setEditandoCategoria}
                      setNombreEditado={setNombreEditado}
                      setMostrarConfirmacionEliminar={setMostrarConfirmacionEliminar}
                      setCategoriaSeleccionada={setCategoriaSeleccionada}
                      setMostrarModalSubcategoria={setMostrarModalSubcategoria}
                      editarCategoria={editarCategoria}
                      toggleSubcategorias={toggleSubcategorias}
                    >
                      <SubCategoriaList
                        subcategorias={categoria.subcategorias}
                        categoriaId={categoria.id}
                        editandoSubcategoria={editandoSubcategoria}
                        subcategoriaEditada={subcategoriaEditada}
                        setEditandoSubcategoria={setEditandoSubcategoria}
                        setSubcategoriaEditada={setSubcategoriaEditada}
                        editarSubcategoria={editarSubcategoria}
                        eliminarSubcategoria={eliminarSubcategoria}
                      />
                    </CategoriaItem>
                  ))
                )}
              </section>
            </div>
          </>
        )}
      </main>
    </>
  );
};

export default Configuracion;