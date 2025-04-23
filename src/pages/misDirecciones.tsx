import React from 'react'
import Pizza from '../assets/img/pizzaBanco.png'

const MisDirecciones = () => {

    const direcciones = [
        { id: 1, nombre: 'Direccion 1', direccion: 'Calle Falsa 123' },
        { id: 2, nombre: 'Direccion 2', direccion: 'Avenida San Martin 456' },
        { id: 3, nombre: 'Direccion 3', direccion: 'Calle San Juan 436' },
        { id: 4, nombre: 'Direccion 4', direccion: 'Avenida Libertador 789' },
        { id: 5, nombre: 'Direccion 5', direccion: 'Calle Independencia 101' },
    ];

    return (
        <div className="bg-primary flex flex-col justify-center align-center">
            <h1 className="font-tertiary pt-10 text-[40px] flex justify-center">Mis Direcciones</h1>

            <div className='flex justify-center pt-8 pb-13'>
                <button className="bg-tertiary rounded-full text-md max-w-sm px-5 py-1 hover:scale-102 transition-transform duration-200">Agregar Direccion</button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 mt-10 justify-center place-items-center sm:px-18">
                {direcciones.map((direccion) => (
                    <div className="bg-secondary rounded-lg shadow-lg p-4 w-[320px]" key={direccion.id}>
                        <div className='flex text-primary'>
                            <svg xmlns="http://www.w3.org/2000/svg" width={28} height={28} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-map-pin relative top-[3px]"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M9 11a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" /><path d="M17.657 16.657l-4.243 4.243a2 2 0 0 1 -2.827 0l-4.244 -4.243a8 8 0 1 1 11.314 0z" /></svg>
                            <h2 className="text-primary text-xl font-semibold pt-1 pb-3 pl-1">{direccion.nombre}</h2>
                        </div>
                        <p className="text-primary pb-3 pl-3">{direccion.direccion}</p>
                        <div className='flex justify-around'>
                            <button className="flex bg-primary px-4 py-2 rounded-full mt-2 hover:scale-102 transition-transform duration-200">
                                Editar <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-pencil relative right-[-5px]"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4" /><path d="M13.5 6.5l4 4" /></svg>
                            </button>
                            <button className="flex bg-primary px-4 py-2 rounded-full mt-2 hover:scale-102 transition-transform duration-200">
                                Eliminar <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-trash relative right-[-5px]"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M4 7l16 0" /><path d="M10 11l0 6" /><path d="M14 11l0 6" /><path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" /><path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" /></svg>
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex justify-center items-center pt-10">
                <img src={Pizza} alt="pizza" className="w-[45%] h-[45%]" />
            </div>
        </div>
    );
}

export default MisDirecciones;