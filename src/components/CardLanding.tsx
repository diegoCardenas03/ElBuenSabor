import { useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useEffect } from "react";
interface CarruselItem {
  id: number;
  titulo: string;
}

interface CarruselProps {
  items: CarruselItem[];
}

const MAX_VISIBLE_DESKTOP = 5;
const MAX_VISIBLE_TABLET = 3;
const MAX_VISIBLE_MOBILE = 1;

function getMaxVisible() {
  if (typeof window !== "undefined") {
    if (window.innerWidth < 640) return MAX_VISIBLE_MOBILE; // sm
    if (window.innerWidth < 1024) return MAX_VISIBLE_TABLET; // md
  }
  return MAX_VISIBLE_DESKTOP;
}

const CardLanding: React.FC<CarruselProps> = ({ items }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [maxVisible, setMaxVisible] = useState(getMaxVisible());

  // Handle resize to update number of visible items
  useEffect(() => {
    const handleResize = () => {
      setMaxVisible(getMaxVisible());
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getCircularIndex = (idx: number) => {
    const total = items.length;
    return ((idx % total) + total) % total;
  };

  const visibleItems = Array.from({ length: Math.min(maxVisible, items.length) }).map((_, i) =>
    items[getCircularIndex(currentIndex + i)]
  );

  const handlePrev = () => {
    setCurrentIndex((prev) => getCircularIndex(prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => getCircularIndex(prev + 1));
  };

  const pageCount = Math.ceil(items.length / maxVisible);
  const currentPage = Math.floor(currentIndex / maxVisible);

  const handlePageClick = (pageIdx: number) => {
    setCurrentIndex(pageIdx * maxVisible);
  };

  return (
    <div className="relative w-full max-w-5xl mx-auto px-2">
      <div className="flex items-center justify-center gap-2 sm:gap-3 md:gap-6">
        <button
          onClick={handlePrev}
          className="text-white bg-[#D32F2F] border border-[#D32F2F] rounded-full p-2 sm:p-3 hover:bg-[#c1272d] hover:scale-110 transition shadow-md"
          aria-label="Anterior"
        >
          <FaArrowLeft size={18} className="sm:size-5" />
        </button>

        <div className="flex gap-1 sm:gap-2 md:gap-4 overflow-hidden">
          {visibleItems.map((item, idx) => {
            const isMiddle = idx === Math.floor(visibleItems.length / 2);
            return (
              <Link
                key={item.id}
                to="/menu"
                className={`w-24 h-28 xs:w-28 xs:h-32 md:w-44 md:h-40 shadow-lg rounded-2xl flex flex-col items-center justify-center shrink-0
                  px-1 xs:px-2 md:px-4 transition-transform duration-300 border-2 cursor-pointer
                  ${
                    isMiddle
                      ? "bg-[#D32F2F] text-white border-[#FF9D3A] z-10"
                      : "bg-white text-[#D32F2F] border-[#D32F2F] opacity-80 hover:opacity-100"
                  }
                  hover:shadow-xl`}
                style={{
                  boxShadow: isMiddle
                    ? "0 8px 32px 0 rgba(211,47,47,0.3)"
                    : "0 2px 8px 0 rgba(211,47,47,0.12)",
                  textDecoration: "none",
                }}
              >
                <p
                  className={`
                    font-tertiary 
                    ${isMiddle ? "font-bold" : "font-normal"}
                    text-xs xs:text-sm sm:text-base
                    uppercase text-center tracking-wider select-none leading-tight 
                    break-all whitespace-pre-line md:break-normal md:whitespace-nowrap
                    max-w-[80px] sm:max-w-[110px] md:max-w-[180px] md:truncate
                    overflow-hidden
                  `}
                >
                  {item.titulo}
                </p>
              </Link>
            );
          })}
        </div>

        <button
          onClick={handleNext}
          className="text-white bg-[#D32F2F] border border-[#D32F2F] rounded-full p-2 sm:p-3 hover:bg-[#c1272d] hover:scale-110 transition shadow-md"
          aria-label="Siguiente"
        >
          <FaArrowRight size={18} className="sm:size-5" />
        </button>
      </div>

      <div className="flex justify-center mt-2 sm:mt-4 space-x-1 sm:space-x-2">
        {Array.from({ length: pageCount }).map((_, pageIndex) => (
          <button
            key={pageIndex}
            onClick={() => handlePageClick(pageIndex)}
            className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 border
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