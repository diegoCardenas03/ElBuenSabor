import pizza from "../assets/img/pizza-landing.png";
import CardLanding from "../components/CardLanding";
import pizzaCarrusel from "../assets/img/pizzaCarrusel.png";
import burger1 from "../assets/img/burger1.png";
import PapasCheddar from "../assets/img/PapasCheddar.png";
import PizzanuestroMenu from "../assets/img/pizzanuestromenu.png";
import ProductosPopularesImg from "../assets/img/imagen-productos-populares.png";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import ProdPopulares from "../components/prodPopulares";
import { Link } from "react-router-dom";

const items = [
  { id: 1, titulo: "Hamburguesas", imagen: burger1 },
  { id: 2, titulo: "Pizzas", imagen: pizzaCarrusel },
  { id: 3, titulo: "Lomos", imagen: pizzaCarrusel },
  { id: 4, titulo: "Panchos", imagen: pizzaCarrusel },
  { id: 5, titulo: "Papas Fritas", imagen: PapasCheddar },
  { id: 6, titulo: "Bebidas", imagen: pizzaCarrusel },
  { id: 7, titulo: "Postres", imagen: pizzaCarrusel },
];

const Landing = () => {
  return (
    <div className="min-h-screen bg-[#FFF4E0] relative overflow-hidden font-sans">


      {/* Círculo rojo derecho (atrás del texto) */}
      <div className="absolute bg-[#BD1E22] rounded-full z-0 
  w-[90vw] h-[90vw] 
  sm:w-[120vw] sm:h-[120vw] 
  md:w-[1000px] md:h-[1000px] 
  lg:w-[1200px] lg:h-[1200px] 
  top-[-40vw] right-[-40vw] 
  md:top-[-300px] md:right-[-500px]">
</div>

      {/* Contenido principal */}
      <div className="relative z-10">
        <Header whiteUserBar={true} showBackButton={false} />

        <main className="h-screen flex flex-col md:flex-row items-center md:items-start justify-center px-4 md:px-16 gap-10 relative z-20">
  {/* Pizza */}
  <div className="w-full md:w-1/2 flex justify-center md:justify-end pt-10 md:pt-0">
    <img
      src={pizza}
      alt="Pizza"
      className="w-[50vw] md:w-[40vw] lg:w-[35vw] max-w-[500px]"
    />
  </div>

  {/* Texto */}
  <div className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left gap-4 md:gap-6">
    <h1 className="text-[#FF9D3A] text-[48px] md:text-[80px] lg:text-[15vh] font-tertiary leading-none uppercase">
      El Buen <br /> Sabor
    </h1>
    <Link to="/menu">
      <button className="bg-[#FFF4E0] text-black px-8 py-2 font-primary rounded-full font-semibold shadow hover:scale-105 transition text-base md:text-lg">
        Ver el menú completo
      </button>
    </Link>
  </div>
</main>



        {/* Productos Populares */}
        <div className="flex flex-col items-center justify-center mt-0 md:mt-10 mb-10 p-6 md:p-20">
        <div className="flex items-center justify-center gap-6 relative mb-12 flex-wrap">
            <h2 className="font-tertiary text-5xl md:text-7xl text-center leading-tight">
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

        {/* Menú */}
        <div className="px-4 md:px-0">
          <h2 className="font-tertiary text-5xl md:text-7xl text-center py-10">NUESTRO MENÚ</h2>
          <CardLanding items={items} />
          <div className="flex justify-center mt-6">
            <img
              src={PizzanuestroMenu}
              alt="Pizza"
              className="w-[15vh] md:w-[25vh] lg:w-[30vh]"
            />
          </div>
        </div>

        {/* Formas de entrega y pago */}
        <h2 className="font-tertiary text-5xl md:text-7xl text-center py-10">
          Formas de entrega y pago
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start max-w-6xl mx-auto pb-20 px-4">
          <div className="space-y-6 text-lg">
            <p className="font-primary">
              Elige los platos necesarios a través del menú y solicita la entrega.
            </p>
            <h3 className="font-primary font-bold text-xl mb-1">Método de entrega</h3>
            <p className="font-primary">Entregamos el pedido a la dirección que solicites</p>
            <h3 className="font-primary font-bold text-xl mb-1">Información adicional</h3>
            <p className="font-primary">Tiempo de entrega estimado de 45 minutos</p>
            <p className="font-primary">Aceptamos todos los medios de pago</p>
          </div>

          {/* Mapa */}
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
            <p className="text-sm text-center mt-2 font-primary font-bold text-black">
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
