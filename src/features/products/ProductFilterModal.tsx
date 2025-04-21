import React from 'react';

interface ProductFilterModalProps {
    isOpen: boolean;
    onClose: () => void;
    onApply: (filters: { order: string; bestseller: boolean }) => void;
    initialFilters: { order: string; bestseller: boolean };
}

export const ProductFilterModal: React.FC<ProductFilterModalProps> = ({
    isOpen,
    onClose,
    onApply,
    initialFilters
}) => {
    const [order, setOrder] = React.useState<string>(initialFilters.order);
    const [bestseller, setBestseller] = React.useState<boolean>(initialFilters.bestseller);

    React.useEffect(() => {
        setOrder(initialFilters.order);
        setBestseller(initialFilters.bestseller);
    }, [initialFilters, isOpen]);

    const handleOrder = (value: string) => {
        setOrder(value === order ? '' : value);
    };

    const handleBestseller = () => {
        setBestseller((prev) => !prev);
    };

    const handleRemove = (key: 'order' | 'bestseller') => {
        if (key === 'order') setOrder('');
        if (key === 'bestseller') setBestseller(false);
    };

    const handleApply = () => {
        onApply({ order, bestseller });
        onClose();
    };

    // Etiquetas para mostrar en el modal
    const chips = [
        {
            active: order === 'asc',
            label: 'Menor a mayor precio',
            onClick: () => handleOrder('asc'),
            onRemove: () => handleRemove('order')
        },
        {
            active: order === 'desc',
            label: 'Mayor a menor precio',
            onClick: () => handleOrder('desc'),
            onRemove: () => handleRemove('order')
        },
        {
            active: bestseller,
            label: 'Más vendidos',
            onClick: handleBestseller,
            onRemove: () => handleRemove('bestseller')
        }
    ];

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg relative">
                {/* Botón X para cerrar */}
                <button
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl font-bold focus:outline-none cursor-pointer"
                    onClick={onClose}
                    aria-label="Cerrar"
                    type="button"
                >
                    ×
                </button>
                <h2 className="text-2xl font-bold mb-4 text-[#FF9D3A]">Filtrar productos</h2>
                <div className="flex flex-wrap gap-2 mb-6">
                    {chips.map((chip, idx) => (
                        <span
                            key={chip.label}
                            className={`flex items-center px-3 py-1 rounded-full text-sm cursor-pointer border transition
                                ${chip.active
                                    ? 'bg-orange-200 border-orange-400 text-orange-800 font-semibold'
                                    : 'bg-white border-gray-300 text-gray-700 hover:bg-orange-100'}
                            `}
                            onClick={chip.onClick}
                        >
                            {chip.label}
                            {chip.active && (
                                <button
                                    className="ml-2 font-bold focus:outline-none"
                                    onClick={e => {
                                        e.stopPropagation();
                                        chip.onRemove();
                                    }}
                                    type="button"
                                >
                                    ×
                                </button>
                            )}
                        </span>
                    ))}
                </div>
                <div className="flex justify-end gap-2">
                    <button
                        className="bg-gray-200 px-4 py-1 rounded hover:bg-gray-300"
                        onClick={() => {
                            setOrder('');
                            setBestseller(false);
                        }}
                        type="button"
                    >
                        Limpiar
                    </button>
                    <button
                        className="bg-[#FF9D3A] text-white px-4 py-1 rounded hover:bg-orange-500"
                        onClick={handleApply}
                        type="button"
                    >
                        Aplicar
                    </button>
                </div>
            </div>
        </div>
    );
};