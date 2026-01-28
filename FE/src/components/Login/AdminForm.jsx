import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../URL BE/api"; // Pastikan path import api.js benar
// 1. Import Icon
import { FaEye, FaEyeSlash } from "react-icons/fa";

const AdminForm = () => {
  const [inputName, setInputName] = useState("");
  const [password, setPassword] = useState("");
  // 2. State untuk toggle password
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      // Kita kirim 'username' karena auth.py bacanya data.get('username')
      // Tapi isinya kita ambil dari input nama lengkap/email admin
      const res = await api.post("/api/auth/admin/login", {
        username: inputName,
        password: password,
      });

      // Simpan Token
      localStorage.setItem("token", res.data.access_token);
      localStorage.setItem("role", "admin");
      localStorage.setItem("nama", res.data.nama_lengkap);
      localStorage.setItem("email", res.data.email);
      localStorage.removeItem("nim");
      // Simpan ID Admin jika perlu (sesuai kolom id_admin)
      if (res.data.id_admin) localStorage.setItem("adminId", res.data.id_admin);

      alert("Login Admin Berhasil!");
      navigate("/admin/dasbor");

    } catch (error) {
      console.error(error);
      alert("Login gagal. Cek Nama Lengkap atau Password.");
    }
  };

  return (
    <>
      <div className="mt-6">
        <h2 className="text-xl font-bold">Login Administrator</h2>
        <p className="text-sm text-gray-600">Masukkan kredensial admin</p>
      </div>

      <div className="mt-4">
        {/* Label disesuaikan dengan database */}
        <label className="block text-sm font-medium mb-1">Nama Lengkap / Email</label>
        <input
          type="text"
          value={inputName}
          onChange={(e) => setInputName(e.target.value)}
          className="w-full h-10 border border-gray-300 rounded-[5px] px-3 focus:ring-blue-500"
        />
      </div>

      {/* 3. Bagian Password dengan Fitur Lihat Password */}
      <div className="mt-4">
        <label className="block text-sm font-medium mb-1">Password</label>
        <div className="relative w-full">
          <input
            // Tipe berubah dinamis
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            // pr-10 ditambahkan agar teks tidak tertutup ikon
            className="w-full h-10 border border-gray-300 rounded-[5px] pl-3 pr-10 focus:ring-blue-500"
          />
          {/* Tombol Ikon */}
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
        className="w-full h-12 bg-blue-700 text-white rounded-[5px] mt-6 hover:bg-blue-600 duration-300"
      >
        Masuk
      </button>
    </>
  );
};

export default AdminForm;