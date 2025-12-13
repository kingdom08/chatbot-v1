import React, { useState } from "react";
import BgBeranda from "../assets/BgBeranda.jpg";
import MahasiswaForm from "../components/Login/MahasiswaForm";
import AdminForm from "../components/Login/AdminForm";
// --- Komponen Form Mahasiswa (Sesuai Gambar 1) ---

const Login = () => {
  const [loginMode, setLoginMode] = useState("mahasiswa"); // State untuk mode login

  return (
    <div
      style={{
        backgroundImage: `url(${BgBeranda})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      className="h-screen gap-4 flex-col flex justify-center items-center"
    >
      <div className="text-center ">
        <h1 className="text-3xl font-bold">BIMA</h1>
        <p className="text-gray-800">Selamat Datang Kembali</p>
      </div>
      <div className="w-[477px] h-[460px] bg-white rounded-[28px] py-6 px-8">
        {/* === TAB SWITCHER === */}
        <div className="bg-gray-200 h-[55px] rounded-[10px] flex justify-between p-1">
          <button
            onClick={() => setLoginMode("mahasiswa")} // <-- Ubah state ke mahasiswa
            className={`w-1/2 rounded-[8px] transition-all duration-300 ${
              loginMode === "mahasiswa"
                ? "bg-white text-gray-800 shadow-md"
                : "bg-transparent text-gray-600 hover:bg-gray-300"
            }`}
          >
            Mahasiswa
          </button>
          <button
            onClick={() => setLoginMode("admin")} // <-- Ubah state ke admin
            className={`w-1/2 rounded-[8px] transition-all duration-300 ${
              loginMode === "admin"
                ? "bg-white text-gray-800 shadow-md"
                : "bg-transparent text-gray-600 hover:bg-gray-300"
            }`}
          >
            Admin
          </button>
        </div>

        {/* === CONDITIONAL RENDERING FORM === */}
        {loginMode === "mahasiswa" ? <MahasiswaForm /> : <AdminForm />}
      </div>
    </div>
  );
};

export default Login;
