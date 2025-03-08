import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import "./App.css";
import image1 from "./assets/image1.jpg";
import image2 from "./assets/image2.jpg";
import image3 from "./assets/image3.jpeg";
import image4 from "./assets/image4.jpg";
import logo from "./assets/logo.png";

const images = [image1, image2, image3, image4];

const fetchData = async (setData) => {
  try {
    const response = await fetch("https://api.thingspeak.com/channels/2345140/feeds.json?results=10&api_key=2GLZ3UBFFNFP4OYT");
    const data = await response.json();
    const formattedData = data.feeds.map((entry) => ({
      time: entry.created_at,
      humedad: parseFloat(entry.field1),
      temperatura: parseFloat(entry.field2),
      luz: parseFloat(entry.field3),
      calidadAire: parseFloat(entry.field4),
    }));
    setData(formattedData);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

export default function LoRaWANDashboard() {
  const [data, setData] = useState([]);
  const [currentImage, setCurrentImage] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    fetchData(setData);
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000); // Actualiza el reloj cada segundo

    return () => clearInterval(interval); // Limpia el intervalo cuando el componente se desmonta
  }, []);

  const nextImage = () => setCurrentImage((prev) => (prev + 1) % images.length);
  const prevImage = () => setCurrentImage((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6 relative">
      <div className="bg-white bg-opacity-90 p-6 rounded-2xl shadow-xl w-full max-w-5xl">
      <h1 className="text-3xl font-bold mb-6 text-center" style={{ color: "white" }}>
  Proyecto LoRaWAN - Monitoreo Ambiental Parque Curiquingue en Cuenca
</h1>
        {/* 🕰️ Reloj en tiempo real */}
        <div className="text-4x1 font-bold text-center mt-6"style={{ color: "white" }}>
          <p>Hora Actual: {currentTime}</p>
        </div>

        <div className="flex justify-between items-center gap-2 mb-6">
          {/* 📷 Imagen y Slider */}
          <div className="w-1/2 p-4 flex flex-col items-center bg-gray-100 rounded-lg shadow">
            <img src={images[currentImage]} alt="Sensor" className="w-full h-48 object-cover rounded-lg shadow-md" />
            <div className="mt-2 flex justify-between w-full">
              <button onClick={prevImage} className="px-3 py-1 bg-gray-300 rounded">⬅️</button>
              <button onClick={nextImage} className="px-3 py-1 bg-gray-300 rounded">➡️</button>
            </div>
          </div>

          {/* 📊 Rectángulo de Datos */}
          <div className="w-1/2 p-4 border border-gray-300 rounded-lg bg-gray-50 shadow">
            <h2 className="text-xl font-semibold text-gray-800">Datos Actuales</h2>
            {data.length > 0 ? (
              <ul className="mt-6 text-gray-600">
                <li>🌡 Humedad: {data[data.length - 1].humedad}%</li>
                <li>🔥 Temperatura: {data[data.length - 1].temperatura}°C</li>
                <li>💡 Luz: {data[data.length - 1].luz} lx</li>
                <li>🌫 Calidad del Aire: {data[data.length - 1].calidadAire}</li>
              </ul>
            ) : (
              <p className="text-gray-500">Cargando datos...</p>
            )}
          </div>

        </div>

        {/* 📉 Gráfico */}
        <ResponsiveContainer width="100%" height={300} className="mt-6">
          <LineChart data={data}>
            <XAxis dataKey="time" tickFormatter={(time) => new Date(time).toLocaleTimeString()} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="humedad" stroke="#00aaff" strokeWidth={3} />
            <Line type="monotone" dataKey="temperatura" stroke="#ff7300" strokeWidth={3} />
            <Line type="monotone" dataKey="luz" stroke="#ffff00" strokeWidth={3} />
            <Line type="monotone" dataKey="calidadAire" stroke="#00ff00" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
        
        {/* 🏢 Logo */}
        <img src={logo} alt="Logo" className="absolute bottom-4 right-4 w-10 h-10 opacity-100" />


      </div>


    </div>
  );
}

