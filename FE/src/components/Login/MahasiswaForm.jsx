import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../URL BE/api";

const MahasiswaForm = () => {
  const [nim, setNim] = useState("");
  const [password, setPassword] = useState("");
  let navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await api.post("/api/auth/student/login", {
        studentId: nim,
        password: password,
      });
      
      // Kunci yang dikirim BE (sesuai file student_service.py Anda) adalah 'token' dan 'role'.
      // Asumsi BE juga mengirim data profile (nim, nama) seperti sebelumnya.
      if (res.data.msg === "success") {
        
        // 1. Ambil 'token' (sesuai BE Anda)
        localStorage.setItem("token", res.data.token);
        
        // 2. Ambil 'role' (sesuai BE Anda, yaitu "Student")
        // NOTE: Di Sidebar.jsx, kondisinya adalah 'mahasiswa' (huruf kecil).
        // Kita simpan sebagai lowercase di FE untuk sinkronisasi.
        localStorage.setItem("role", res.data.role?.toLowerCase() || "mahasiswa"); 
        
        // 3. Simpan data profile yang dibutuhkan sidebar
        localStorage.setItem("nim", res.data.nomor_induk_mahasiswa);
        localStorage.setItem("nama", res.data.nama_lengkap);

        alert("Login Mahasiswa Berhasil!");
        
        // Ganti navigate() dengan window.location.href untuk memaksa refresh
        window.location.href = "/user/chat"; 
      }
    } catch (error) {
      // Lebih baik mencetak error ke konsol untuk debugging BE
      console.error("Login Error:", error.response?.data || error);
      alert("NIM atau password salah");
    }
  };

  return (
    // ... (JSX sisanya tetap sama)
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
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full h-10 border border-gray-300 rounded-[5px] px-3 focus:ring-blue-500 focus:border-blue-500"
        />
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