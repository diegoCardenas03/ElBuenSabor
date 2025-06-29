import { useMemo } from 'react';
import { useAppDispatch, useAppSelector } from './redux';
import { toggleCategory } from './redux/slices/ProductReducer';

export const useCategories = () => {
    
    const dispatch = useAppDispatch();
    const { selectedCategories, rubrosConInsumosVendibles } = useAppSelector((state) => state.products);
    const { rubros, rubrosInsumos } = useAppSelector((state) => state.rubros);
//  console.log('rubros:', rubros);
    // console.log('rubrosInsumos:', rubrosInsumos);
    // console.log('rubrosConInsumosVendibles:', rubrosConInsumosVendibles)
    // Crear categorías únicas para mostrar (sin duplicados por nombre)
    const categories = useMemo(() => {
        const categoryMap = new Map();
        
        // Agregar productos primero
        rubros.forEach(rubro => {
            if (rubro.id) {
                const key = rubro.denominacion.toLowerCase();
                if (!categoryMap.has(key)) {
                    categoryMap.set(key, {
                        id: `producto-${rubro.id}`,
                        name: rubro.denominacion,
                        tipo: 'producto'
                    });
                }
            }
        });

        // Agregar insumos solo si no existe el nombre
        rubrosInsumos.forEach(rubro => {
            if (rubro.id && rubrosConInsumosVendibles.includes(rubro.id)) {
                const key = rubro.denominacion.toLowerCase();
                if (!categoryMap.has(key)) {
                    categoryMap.set(key, {
                        id: `insumo-${rubro.id}`,
                        name: rubro.denominacion,
                        tipo: 'insumo'
                    });
                }
            }
        });

        return Array.from(categoryMap.values());
    }, [rubros, rubrosInsumos, rubrosConInsumosVendibles]);

    // Manejar selección - ahora pasamos el ID compuesto directamente
    const handleSelectCategory = (categoryId: string) => {
        // console.log('Seleccionando categoría:', categoryId);
        dispatch(toggleCategory(categoryId)); // Pasar directamente "producto-2" o "insumo-3"
    };

    // Preparar datos para el componente
    const categoriesForComponent = categories.map(cat => ({
        id: cat.id,
        name: cat.name
    }));

    return {
        categories: categoriesForComponent,
        selectedCategories, // Ahora son strings como "producto-2", "insumo-3"
        handleSelectCategory
    };
};