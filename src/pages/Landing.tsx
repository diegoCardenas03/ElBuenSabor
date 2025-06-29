import pizza from "../assets/img/pizza-landing.png";
import CardLanding from "../components/CardLanding";
import PizzanuestroMenu from "../assets/img/pizzanuestromenu.png";
import ProductosPopularesImg from "../assets/img/imagen-productos-populares.png";
import { Header } from "../components/commons/Header";
import { Footer } from "../components/commons/Footer";
import ProdPopulares from "../components/prodPopulares";
import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useCategories } from "../hooks/useCategories";
import { useAppDispatch } from "../hooks/redux";
import { fetchProducts, fetchInsumosVendibles } from "../hooks/redux/slices/ProductReducer";
import { fetchRubrosProductos, fetchRubrosInsumos } from "../hooks/redux/slices/RubroReducer";
import { motion } from "framer-motion";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import { markerIcon } from "./misDirecciones";

const Landing = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchInsumosVendibles());
    dispatch(fetchRubrosProductos());
    dispatch(fetchRubrosInsumos());
  }, [dispatch]);

  const { categories } = useCategories();
  const items = categories.map((cat, idx) => ({
    id: idx,
    titulo: cat.name,
  }));

  const [navbarWhite, setNavbarWhite] = useState(true);
  const redCircleRef = useRef<HTMLDivElement | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);


  useEffect(() => {
    const updateSentinel = () => {
      if (redCircleRef.current && sentinelRef.current) {
        sentinelRef.current.style.top = `${redCircleRef.current.offsetTop + redCircleRef.current.offsetHeight}px`;
      }
    };
    updateSentinel();
    window.addEventListener("resize", updateSentinel);
    return () => window.removeEventListener("resize", updateSentinel);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (sentinelRef.current) {
        const rect = sentinelRef.current.getBoundingClientRect();
        setNavbarWhite(rect.top > 0);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#FFF4E0] relative overflow-hidden font-sans">
      <div
        ref={redCircleRef}
        className="absolute bg-[#BD1E22] rounded-[300%] z-0 
          w-[90vw] h-[90vw] 
          md:w-[1000px] md:h-[900px] 
          lg:w-[1200px] lg:h-[940px] 
          top-[-40vw] right-[-40vw] 
          md:top-[-350px] md:right-[-500px]"
      />
      <div
        ref={sentinelRef}
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          height: 1,
          pointerEvents: "none",
          zIndex: 1,
        }}
      />
      <div className="relative">
        <Header whiteUserBar={navbarWhite} showBackButton={false} />
        <main className="pt-20 h-screen flex flex-col md:flex-row items-center md:items-start justify-center px-4 md:px-16 gap-15 md:gap-40 relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="w-full md:w-1/2 flex justify-center md:justify-end pt-0 md:pt-30"
          >
            <img
              src={pizza}
              alt="Pizza"
              className="w-[50vw] md:w-[40vw] lg:w-[35vw] max-w-[500px]"
            />
          </motion.div>
          <div className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left gap-4 md:gap-6 md:mt-15">
            <motion.h1
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="text-[#FF9D3A] text-[48px] md:text-[80px] lg:text-[15vh] font-tertiary leading-none uppercase"
            >
              El Buen <br /> Sabor
            </motion.h1>
            <Link to="/menu">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="bg-whit cursor-pointer md:bg-[#FFF4E0] text-black px-8 py-2 font-primary rounded-full font-semibold shadow transition text-base md:text-[14px] md:ml-20 lg:text-lg"
              >
                Ver el menú completo
              </motion.button>
            </Link>
          </div>
        </main>
        {/* Productos Populares */}
        <div className="flex flex-col items-center justify-center mt-0 md:mt-10 mb-10 p-6 md:p-20">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="flex items-center justify-center gap-6 relative mb-12 flex-wrap"
          >
            <h2 className="font-tertiary text-5xl md:text-7xl text-center leading-tight">
              PROMOCIONES<br />POPULARES
            </h2>
            <img
              src={ProductosPopularesImg}
              alt="Pizza"
              className="w-[15vh] md:w-[25vh] lg:w-[30vh] object-contain"
            />
          </motion.div>
          <ProdPopulares />
        </div>
        {/* Menú */}
        <div className="px-4 md:px-0">
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="font-tertiary text-5xl md:text-7xl text-center py-10"
          >
            NUESTRO MENÚ
          </motion.h2>
          <CardLanding items={items} />
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="flex justify-center mt-6"
          >
            <img
              src={PizzanuestroMenu}
              alt="Pizza"
              className="w-[15vh] md:w-[25vh] lg:w-[30vh]"
            />
          </motion.div>
        </div>
        {/* Formas de entrega y pago */}
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="font-tertiary text-5xl md:text-7xl text-center py-10"
        >
          Formas de entrega y pago
        </motion.h2>
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
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="w-full h-80 rounded-xl overflow-hidden shadow-md"
          >
            <MapContainer
              center={[-32.8969915, -68.8536561]}
              zoom={15}
              scrollWheelZoom={false}
              dragging={false}
              style={{ height: "100%", width: "100%", borderRadius: "10px" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              <Marker position={[-32.8969915, -68.8536561]} icon={markerIcon} />
            </MapContainer>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Landing;
