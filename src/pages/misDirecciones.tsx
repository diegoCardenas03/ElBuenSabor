import React from 'react'
import Pizza from '../assets/img/pizzaBanco.png'
import { IconMapPin } from '@tabler/icons-react';
import { IconPencil } from '@tabler/icons-react';
import { IconTrash } from '@tabler/icons-react';

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
                            <IconMapPin stroke={2} width={28} height={28} className='relative top-[3px]'/>
                            <h2 className="text-primary text-xl font-semibold pt-1 pb-3 pl-1">{direccion.nombre}</h2>
                        </div>
                        <p className="text-primary pb-3 pl-3">{direccion.direccion}</p>
                        <div className='flex justify-around'>
                            <button className="flex bg-primary px-4 py-2 rounded-full mt-2 hover:scale-102 transition-transform duration-200">
                                Editar 
                                <IconPencil stroke={2} width={20} height={20} className="relative left-[5px]"/>
                            </button>
                            <button className="flex bg-primary px-4 py-2 rounded-full mt-2 hover:scale-102 transition-transform duration-200">
                                Eliminar 
                                <IconTrash stroke={2} width={20} height={20} className="relative left-[5px]"/>
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