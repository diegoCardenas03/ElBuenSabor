import { useState } from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import Swal from "sweetalert2";
import { Header } from "../components/commons/Header";
import { Footer } from "../components/commons/Footer";


export default function Contactanos() {
  const [form, setForm] = useState({ nombre: "", email: "", mensaje: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    Swal.fire({
      title: "Enviando mensaje...",
    });
    Swal.fire({
      title: "¡Gracias por tu mensaje!",
      text: "Te responderemos a la brevedad.",
      icon: "success",
    }  );
    setForm({ nombre: "", email: "", mensaje: "" });
  };

  return (
    <>
      <Header />
    
    
    <div className="min-h-screen bg-primary flex flex-col items-center justify-center p-4">
      
      <div className="max-w-4xl w-full bg-white shadow-md rounded-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        
        {/* Información de contacto */}
        <div className="bg-secondary text-white flex flex-col justify-center p-8">
          <h2 className="text-3xl font-bold mb-4">¡Hablemos!</h2>
          <p className="mb-6">¿Consultas, pedidos especiales o sugerencias? Estamos para escucharte.</p>
          <div className="flex items-center gap-2 mb-3">
            <Phone size={20} /> <span>+54 261 555 5555</span>
          </div>
          <div className="flex items-center gap-2 mb-3">
            <Mail size={20} /> <span>contacto@elbuenSabor.com</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={20} /> <span>Mendoza, Argentina</span>
          </div>
        </div>

        {/* Formulario */}
        <div className="p-8 bg-white">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Envianos tu mensaje</h3>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              placeholder="Tu nombre"
              required
              className="border border-gray-300 rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-red-400"
            />
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Tu email"
              required
              className="border border-gray-300 rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-red-400"
            />
            <textarea
              name="mensaje"
              value={form.mensaje}
              onChange={handleChange}
              placeholder="Tu mensaje"
              required
              rows={4}
              className="border border-gray-300 rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-red-400"
            />
            <button
              type="submit"
              className="bg-secondary text-white py-2 rounded-xl hover:bg-red-700 transition-colors"
            >
              Enviar
            </button>
          </form>
        </div>
      </div>
    </div>
    <Footer />
    </>
  );
}
