import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../URL BE/api";
// 1. Import Icon
import { FaEye, FaEyeSlash } from "react-icons/fa";

const MahasiswaForm = () => {
  const [nim, setNim] = useState("");
  const [password, setPassword] = useState("");
  // 2. State untuk toggle password
  const [showPassword, setShowPassword] = useState(false);
  let navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await api.post("/api/auth/student/login", {
        studentId: nim,
        password: password,
      });

      if (res.data.msg === "success") {
        // 1. Ambil 'token' (sesuai BE Anda)
        localStorage.setItem("token", res.data.token);

        localStorage.setItem(
          "role",
          res.data.role?.toLowerCase() || "mahasiswa",
        );

        // 3. Simpan data profile yang dibutuhkan sidebar
        localStorage.setItem("nim", res.data.nomor_induk_mahasiswa);
        localStorage.setItem("nama", res.data.nama_lengkap);

        // Ganti navigate() dengan window.location.href untuk memaksa refresh
        window.location.href = "/user/chat";
      }
    } catch (error) {
      // Lebih baik mencetak error ke konsol untuk debugging BE
      console.error("Login Error:", error.response?.data.msg || error);
      alert(error.response?.data.msg || "Login gagal. Silakan coba lagi.");
    }
  };

  return (
    <>
      <div className="mt-6">
        <h2 className="text-xl font-bold">Masuk Sebagai Mahasiswa</h2>
        <p className="text-sm text-gray-600">Gunakan Nim dan Password Anda</p>
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium mb-1">
          Nomor Induk Mahasiswa (NIM)
        </label>
        <input
          type="text"
          value={nim}
          onChange={(e) => setNim(e.target.value)}
          className="w-full h-10 border border-gray-300 rounded-[5px] px-3 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium mb-1">Password</label>

        <div className="relative w-full">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full h-10 border border-gray-300 rounded-[5px] pl-3 pr-10 focus:ring-blue-500 focus:border-blue-500"
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 focus:outline-none"
          >
            {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
          </button>
        </div>
      </div>

      <button
        onClick={handleLogin}
        className="w-full bg-blue-700 text-white h-12 rounded-[5px] mt-6 hover:bg-blue-500 duration-300"
      >
        Masuk
      </button>

      <p className="text-center text-sm mt-4 text-gray-500">
        Belum punya akun?{" "}
        <a href="/daftar" className="text-blue-600 hover:underline">
          Daftar di sini
        </a>
      </p>
    </>
  );
};

export default MahasiswaForm;
