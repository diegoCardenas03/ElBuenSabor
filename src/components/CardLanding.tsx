import { useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa";
interface CarruselItem {
  id: number;
  titulo: string;
  imagen: string;
}

interface CarruselProps {
  items: CarruselItem[];
}

const CardLanding: React.FC<CarruselProps> = ({ items }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? items.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === items.length - 1 ? 0 : prevIndex + 1
    );
  };

 
  const visibleItems = items
    .slice(currentIndex, currentIndex + 5)
    .concat(
      currentIndex + 5 > items.length
        ? items.slice(0, (currentIndex + 5) % items.length)
        : []
    );

  return (
    <div className="relative w-full max-w-6xl mx-auto">
      <div className="flex items-center justify-center gap-6">
        <button
          onClick={handlePrev}
          className="text-red-500 border border-red-500 rounded-full p-2 hover:bg-red-100 transition"
        >
          <FaArrowLeft />
        </button>

        <div className="flex gap-4 overflow-hidden">
          {visibleItems.map((item, idx) => {
            const isMiddle = idx === 2;

            return (
              <div
                key={item.id}
                className={`w-44 h-44 shadow-md rounded-lg flex flex-col items-center justify-center shrink-0 transition-transform duration-300 ${
                  isMiddle
                    ? "scale-110 bg-[#D32F2F] text-white"
                    : "bg-white"
                }`}
              >
                <img
                  src={item.imagen}
                  alt={item.titulo}
                  className="w-20 h-20 object-contain mb-2"
                />
                <p className="font-semibold">{item.titulo}</p>
              </div>
            );
          })}
        </div>

        <button
          onClick={handleNext}
          className="text-red-500 border border-red-500 rounded-full p-2 hover:bg-red-100 transition"
        >
          <FaArrowRight />
        </button>
      </div>

      <div className="flex justify-center mt-6 space-x-2">
        {Array.from({ length: Math.ceil(items.length / 5) }).map(
          (_, pageIndex) => (
            <button
              key={pageIndex}
              onClick={() => setCurrentIndex(pageIndex * 5)}
              className={`w-3 h-3 rounded-full ${
                currentIndex >= pageIndex * 5 &&
                currentIndex < (pageIndex + 1) * 5
                  ? "bg-red-500"
                  : "bg-gray-300"
              }`}
            />
          )
        )}
      </div>
    </div>
  );
};

export default CardLanding;
