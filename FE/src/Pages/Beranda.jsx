import React from "react";
import BgBeranda from "../assets/BgBeranda.jpg";
import { SiChatbot } from "react-icons/si";
import { FaWhatsapp } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa6";
import { NavLink } from "react-router-dom";
import LoadingChat from "../components/LoadingChat";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Beranda = () => {
  const [isLoading, setIsLoading] = useState(false); // State untuk mengontrol loading
  const navigate = useNavigate();

  const handleAction = (path, delay = 1500) => {
    // Pastikan tombol nonaktif agar user tidak klik berulang
    if (isLoading) return;

    setIsLoading(true); // Tampilkan loading

    // Simulasikan delay atau proses asinkron
    setTimeout(() => {
      setIsLoading(false); // Sembunyikan loading

      if (path.startsWith("http")) {
        // Jika tujuannya adalah link eksternal (WA)
        window.location.href = path;
      } else {
        // Jika tujuannya adalah navigasi internal
        navigate(path);
      }
    }, delay);
  };

  return (
    <div
      style={{
        backgroundImage: `url(${BgBeranda})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      className="w-full  h-screen  bg-bg-page"
    >
      {/* Navbar Beranda */}
      <section className="flex justify-center items-center h-30">
        <nav className=" bg-white/30 border backdrop-blur-md w-250 flex justify-between items-center px-20 py-3 rounded-full text-white">
          <h1 className="text-blue-500 font-bold">B I M A</h1>
          <div className="flex text-black gap-4">
            {/* alamat url */}
        
              <button
                onClick={() => handleAction("/login")}
                disabled={isLoading}
                className="hover:scale-105 duration-100 rounded-full bg-white text-[15px] p-1  w-30"
              >
                Masuk
              </button>
     
          
              <button
                onClick={() => handleAction("/daftar")}
                disabled={isLoading}
                className="hover:scale-105 duration-100 rounded-full bg-blue-700 text-white p-1 text-[15px]  w-30"
              >
                Daftar
              </button>

            {/* end */}
          </div>
        </nav>
      </section>

      {/* Main heroo */}
      <main className="flex flex-col gap-10 items-center justify-center p-23 px-35">
        <div className="flex flex-col justify-center text-center items-center px-35 gap-6">
          <section className=" flex items-center justify-center gap-4 bg-white p-2 rounded-4xl w-90">
            <SiChatbot className="text-blue-500" />{" "}
            <h1 className="text-blue-500 font-semibold">
              Asisten AI Bimbingan Akademik
            </h1>
          </section>
          <h1 className="text-5xl font-semibold text-black text-center">
            Efektifkan Studi, Rencanakan KRS, dan Raih IP Maksimal dengan BIMA
            Chatbot Akademik!
          </h1>
          <h2 className="text-l">
            Layanan 24/7 Informasi Mengenai pertanyaan Bimbingan kuliah
            sehari-hari, Nilai Perwalian dan KHS,Informasi Jadwal Perubahan
            Kelas.
          </h2>
        </div>

        {/* button heroo */}
        <div className=" flex gap-16">
          {/* Button ke Wa Admin */}
          {/* <button
            onClick={() => handleAction("http://wa.me/628386490650", 1000)}
            disabled={isLoading}
            className="hover:scale-105 duration-100 rounded-full flex items-center gap-2 justify-center bg-blue-700 font-bold text-[15px] p-2 text-white  w-60"
          >
            <FaWhatsapp className="text-xl" /> Konsultasi dengan Kami
          </button> */}
          {/* Link to Page daftar */}
          <button
            onClick={() => handleAction("/daftar")}
            disabled={isLoading}
            className="hover:scale-105 duration-100 rounded-full flex items-center gap-3 justify-center bg-white text-black font-bold p-2 text-[15px]  w-45"
          >
            Daftar sekarang <FaArrowRight />
          </button>
        </div>
      </main>
      <LoadingChat isLoading={isLoading} />
    </div>
  );
};

export default Beranda;
