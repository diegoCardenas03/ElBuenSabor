import React from "react";
import pizza from "../assets/img/pizza-landing.png";
import CardLanding from "../components/CardLanding";
import pizzaCarrusel from "../assets/img/pizzaCarrusel.png"
import burger1 from "../assets/img/burger1.png"
import PapasCheddar from "../assets/img/PapasCheddar.png"
import PizzanuestroMenu from "../assets/img/pizzanuestromenu.png"
import ProductosPopularesImg from "../assets/img/imagen-productos-populares.png";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import ProdPopulares from "../components/prodPopulares";
const items = [
  {id: 1, titulo:"Hamburguesas", imagen: burger1 },
   {id: 2, titulo:"Pizzas", imagen: pizzaCarrusel},
{id: 3, titulo:"Lomos", imagen: pizzaCarrusel},
{id: 4, titulo:"Panchos", imagen: pizzaCarrusel},
{id: 5, titulo:"Papas Fritas", imagen: PapasCheddar},
{ id: 6, titulo: "Bebidas", imagen: pizzaCarrusel},
{ id: 7, titulo: "Postres", imagen: pizzaCarrusel},
]
const Landing = () => {
  return (
    <div className="min-h-screen bg-[#FFF4E0] relative overflow-hidden font-sans">
      {/* Círculo rojo de fondo */}
      <div className="absolute bg-[#BD1E22] w-[1500px] h-[1500px] rounded-full top-[-700px] right-[-500px] z-0"></div>


      {/* Contenido principal en capa superior */}
      <div className="relative z-10">
        {/* Header */}
        <Header whiteUserBar={true} showBackButton={false}/>


        {/* Main */}
        <main className="flex flex-col md:flex-row items-center justify-start px-6 md:px-16 pt-4 pb-8">

          {/* Imagen pizza */}
          <div className="w-full md:w-1/2 flex justify-center">
            <img src={pizza} alt="Pizza" className="w-[30vh] md:w-[80vh]" />
          </div>

          {/* Texto derecho */}
          <div className="w-full md:w-1/2 flex flex-col items-start -translate-y-6 md:-translate-y-40 gap-4 md:gap-6 pl-4 md:pl-40">
            <h1 className="text-[#FF9D3A] text-[60px] md:text-[150px] font-(family-name:--font-tertiary) leading-none uppercase">
              El Buen <br /> Sabor
            </h1>

            {/* Botón */}
            <div className="mt-6 self-center">
              <button className="bg-[#FFF4E0] text-black px-15 py-2 font-(family-name:--font-primary) rounded-full font-semibold shadow hover:scale-105 transition text-lg">
               Ver el menú completo
              </button>
            </div>
          </div>
        </main>
        {/* Productos populares */}
        <div className="flex flex-col items-center justify-center mt-10 mb-10 p-20">
          <div className="flex items-center justify-center gap-6 relative mb-12">
            <h2 className="font-(family-name:--font-tertiary) text-7xl text-center leading-tight">
              PRODUCTOS<br />POPULARES
            </h2>
            <img
              src={ProductosPopularesImg}
              alt="Pizza"
              className="w-[15vh] md:w-[25vh] lg:w-[30vh] object-contain"
            />
           
          </div>
          <ProdPopulares />
          </div>

        {/* Nuestro menu */}
        <div>
          <h2 className="font-(family-name:--font-tertiary) text-7xl text-center py-30">NUESTRO MENÚ</h2>
          <CardLanding items={items}></CardLanding>
          <img src={PizzanuestroMenu} alt="Pizza" className="w-[15vh] md:w-[25vh] lg:w-[30vh]" />


        </div>
        {/* Formas de pago y entrega  */}
        <h2 className="font-(family-name:--font-tertiary) text-7xl text-center py-30">Formas de entrega
        y pago</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start max-w-6xl mx-auto pb-25">
          <div className="space-y-6 text-lg">

        <p className="font-(family-name:--font-primary)"> Elige los platos necesarios a través del 
        menú y solicita la entrega.</p>
        <h3 className="font-(family-name:--font-primary) font-bold text-xl mb-1"> Método de entrega</h3>
        <p className="font-(family-name:--font-primary)"> Entregamos el pedido a la dirección que solicites</p>
        <h3 className="font-(family-name:--font-primary) font-bold text-xl mb-1"> Información adicional</h3>
        <p className="font-(family-name:--font-primary)"> Tiempo de entrega estimado de 45 minutos</p>
        <p className="font-(family-name:--font-primary)">Aceptamos todos los medios de pago</p>
        </div>
        {/* mapa */}
        <div className="w-full h-80 rounded-xl overflow-hidden shadow-md">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3360.610138720327!2d-68.84449952496326!3d-32.89049857362564!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x967e091c2f7b2dcd%3A0x62df92a4f6a3eb96!2sUTN%20Facultad%20Regional%20Mendoza!5e0!3m2!1ses-419!2sar!4v1713465943429"
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
      <p className="text-sm text-center mt-2 font-(family-name:--font-primary) font-bold text-black ">
        Dirección: Av Belgrano 671, Mendoza, Argentina
      </p>
    </div>

        </div>
      </div>
      <Footer />
    </div>

  );
};

export default Landing;
