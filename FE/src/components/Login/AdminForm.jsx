import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../URL BE/api"; // Pastikan path import api.js benar

const AdminForm = () => {
  const [inputName, setInputName] = useState("");
  const [password, setPassword] = useState("");
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
     localStorage.setItem("nama", res.data.nama_lengkap)
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
      <div className="mt-4">
        <label className="block text-sm font-medium mb-1">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full h-10 border border-gray-300 rounded-[5px] px-3 focus:ring-blue-500"
        />
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