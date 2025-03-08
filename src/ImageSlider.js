import React, { useState } from "react";
import image1 from "./assets/image1.jpg";
import image2 from "./assets/image2.jpg";
import image3 from "./assets/image3.jpeg";
import image4 from "./assets/image4.jpg";

const images = [image1, image2, image3, image4];

export default function ImageSlider() {
  const [currentImage, setCurrentImage] = useState(0);

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 bg-white rounded-lg shadow-lg text-center">
      <img
        src={images[currentImage]}
        alt={`Imagen ${currentImage + 1}`}
        className="w-full h-64 object-cover rounded-lg shadow-md"
      />
      <div className="flex justify-between mt-4">
        <button onClick={prevImage} className="px-4 py-2 bg-blue-500 text-white rounded-lg">⬅️</button>
        <button onClick={nextImage} className="px-4 py-2 bg-blue-500 text-white rounded-lg">➡️</button>
      </div>
    </div>
  );
}
