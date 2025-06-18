import { useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";

interface CarruselItem {
  id: number;
  titulo: string;
}

interface CarruselProps {
  items: CarruselItem[];
}

const MAX_VISIBLE = 5;

const CardLanding: React.FC<CarruselProps> = ({ items }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const getCircularIndex = (idx: number) => {
    const total = items.length;
    return ((idx % total) + total) % total;
  };

  const visibleItems = Array.from({ length: Math.min(MAX_VISIBLE, items.length) }).map((_, i) =>
    items[getCircularIndex(currentIndex + i)]
  );

  const handlePrev = () => {
    setCurrentIndex((prev) => getCircularIndex(prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => getCircularIndex(prev + 1));
  };

  const pageCount = Math.ceil(items.length / MAX_VISIBLE);
  const currentPage = Math.floor(currentIndex / MAX_VISIBLE);

  const handlePageClick = (pageIdx: number) => {
    setCurrentIndex(pageIdx * MAX_VISIBLE);
  };

  return (
    <div className="relative w-full max-w-5xl mx-auto">
      <div className="flex items-center justify-center gap-3 md:gap-6">
        <button
          onClick={handlePrev}
          className="text-white bg-[#D32F2F] border border-[#D32F2F] rounded-full p-3 hover:bg-[#c1272d] hover:scale-110 transition shadow-md"
          aria-label="Anterior"
        >
          <FaArrowLeft size={20} />
        </button>

        <div className="flex gap-2 md:gap-4 overflow-hidden">
          {visibleItems.map((item, idx) => {
  const isMiddle = idx === Math.floor(visibleItems.length / 2);
  return (
    <Link
      key={item.id}
      to="/menu"
      className={
        `w-28 h-32 md:w-44 md:h-40 shadow-lg rounded-2xl flex flex-col items-center justify-center shrink-0
        px-2 md:px-4 transition-transform duration-300 border-2 cursor-pointer
        ${isMiddle
          ? "scale-110 bg-[#D32F2F] text-white border-[#FF9D3A] z-10"
          : "bg-white text-[#D32F2F] border-[#D32F2F] opacity-80 hover:opacity-100"
        }
        hover:shadow-xl`
      }
      style={{
        boxShadow: isMiddle
          ? "0 8px 32px 0 rgba(211,47,47,0.3)"
          : "0 2px 8px 0 rgba(211,47,47,0.12)",
        textDecoration: "none"
      }}
    >
      <p className={`font-tertiary 
        ${isMiddle ? "font-bold" : "font-normal"} 
        text-xs md:text-base 
        uppercase text-center tracking-wider select-none leading-tight break-words`}>
        {item.titulo}
      </p>
    </Link>
  );
})}
        </div>

        <button
          onClick={handleNext}
          className="text-white bg-[#D32F2F] border border-[#D32F2F] rounded-full p-3 hover:bg-[#c1272d] hover:scale-110 transition shadow-md"
          aria-label="Siguiente"
        >
          <FaArrowRight size={20} />
        </button>
      </div>

      <div className="flex justify-center mt-4 space-x-2">
        {Array.from({ length: pageCount }).map((_, pageIndex) => (
          <button
            key={pageIndex}
            onClick={() => handlePageClick(pageIndex)}
            className={`w-3 h-3 rounded-full transition-all duration-300 border
              ${currentPage === pageIndex
                ? "bg-[#D32F2F] border-[#D32F2F]"
                : "bg-gray-300 border-gray-300"
              }`}
            aria-label={`Ir a la página ${pageIndex + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default CardLanding;