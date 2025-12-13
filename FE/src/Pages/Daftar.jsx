import React, { useState } from "react";
import BgBeranda from "../assets/BgBeranda.jpg";
import api from "../URL BE/api";
import { useNavigate } from "react-router-dom";

const Daftar = () => {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [email, setEmail] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Password dan konfirmasi tidak sama");
      return;
    }

    try {
      const res = await api.post("/api/auth/student/register", {
        fullName,
        studentId,
        email,
        whatsappNumber,
        password,
      });

      if (res.data.msg === "User registered succesfully") {
        alert("Registrasi berhasil");
        navigate("/login");
      }
    } catch (error) {
      alert("NIM sudah terdaftar");
    }
  };

  return (
    <div
      style={{
        backgroundImage: `url(${BgBeranda})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      className="min-h-screen bg-gray-900/50 flex flex-col justify-center items-center py-10"
    >
      <div className="text-center text-black mb-4">
        <h1 className="text-3xl font-bold">BIMA</h1>
        <p className="text-gray-800">Bimbingan Mahasiswa</p>
      </div>

      <div className="w-[477px] bg-white rounded-[28px] py-8 px-8 shadow-2xl">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800">
            Buat Akun Baru
          </h2>
          <p className="text-sm text-gray-600">
            Daftar untuk mengakses BIMA Bimbingan Mahasiswa.
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium mb-1">
              Nama Lengkap
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full h-10 border border-gray-300 rounded-[5px] px-3"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Nomor Induk Mahasiswa (NIM)
            </label>
            <input
              type="text"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className="w-full h-10 border border-gray-300 rounded-[5px] px-3"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Email Kampus
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-10 border border-gray-300 rounded-[5px] px-3"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              No WhatsApp
            </label>
            <input
              type="text"
              value={whatsappNumber}
              onChange={(e) => setWhatsappNumber(e.target.value)}
              className="w-full h-10 border border-gray-300 rounded-[5px] px-3"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-10 border border-gray-300 rounded-[5px] px-3"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Konfirmasi Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full h-10 border border-gray-300 rounded-[5px] px-3"
            />
          </div>

          <button
            type="submit"
            className="w-full h-12 bg-blue-700 text-white rounded-[5px] mt-6 hover:bg-blue-500 duration-300"
          >
            Daftar dan Ajukan Akun
          </button>
        </form>

        <p className="text-center text-sm mt-4 text-gray-500">
          Sudah punya akun?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            Login di sini
          </a>
        </p>
      </div>
    </div>
  );
};

export default Daftar;
