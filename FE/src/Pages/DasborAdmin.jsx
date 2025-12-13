import React, { useState, useEffect } from "react"; // <<< IMPORT useEffect
import DashboardHeader from "../components/Dashboard admin/DashboardHeader";
import DashboardStats from "../components/Dashboard admin/DasboardStats";
import DashboardTable from "../components/Dashboard admin/DashboardTabel";
import { UserCheck, UserX, Clock } from "lucide-react";
import api from "../URL BE/api"; // <<< IMPORT API

const DasborAdmin = () => {
  // Ganti data dummy dengan state kosong
  const [mahasiswaList, setMahasiswaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("Semua");

  // ==========================================================
  // 1. FUNGSI FETCH DATA DARI BACKEND
  // ==========================================================
  const fetchStudents = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      // Panggil endpoint GET /api/admin/students
      const response = await api.get("/api/admin/students", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Mapping kunci dari BE (contoh: studentId) ke FE (nim)
      const students = response.data.students.map((s) => ({
        nim: s.studentId, // BE: studentId -> FE: nim
        nama: s.fullName, // BE: fullName -> FE: nama
        email: s.email,
        wa: s.whatsappNumber,
        status: s.accountStatus, // BE: accountStatus -> FE: status
        prodi: s.prodi || "Non-Informatika", // Asumsi prodi tidak selalu ada atau default
      }));

      setMahasiswaList(students);
      setLoading(false);
    } catch (err) {
      console.error(
        "Gagal mengambil data mahasiswa:",
        err.response?.data || err
      );
      setError("Gagal memuat data. Pastikan server Flask berjalan.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // ==========================================================
  // 2. FUNGSI AKSI (UPDATE STATUS)
  // ==========================================================
  // Menerima NIM dan ACTION dari DashboardTable
  const handleAction = async (nim, action) => {
    let newStatus = "";

    if (action === "aktifkan") newStatus = "Aktif";
    else if (action === "nonaktifkan") newStatus = "Nonaktif";
    else if (action === "tolak") newStatus = "Ditolak";

    if (!newStatus) return;

    try {
      const token = localStorage.getItem("token");

      // Kirim PATCH request ke endpoint: /api/admin/students/<nim>
      await api.patch(
        `/api/admin/students/${nim}`,
        {
          status: newStatus,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Update state di frontend setelah sukses
      setMahasiswaList((prev) =>
        prev.map((m) => (m.nim === nim ? { ...m, status: newStatus } : m))
      );

      alert(`Status NIM ${nim} berhasil diubah menjadi ${newStatus}.`);
    } catch (err) {
      console.error("Gagal update status:", err.response?.data || err);
      alert("Gagal mengubah status mahasiswa.");
    }
  };

  // ==========================================================
  // 3. FILTERING DAN STATS
  // ==========================================================
  const filteredList = mahasiswaList.filter((mhs) => {
    const matchSearch =
      mhs.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mhs.nim.includes(searchTerm) ||
      mhs.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchFilter = filterStatus === "Semua" || mhs.status === filterStatus;
    return matchSearch && matchFilter;
  });

  const stats = {
    total: mahasiswaList.length,
    aktif: mahasiswaList.filter((m) => m.status === "Aktif").length,
    menunggu: mahasiswaList.filter((m) => m.status === "Menunggu").length,
    nonaktif: mahasiswaList.filter(
      (m) => m.status === "Nonaktif" || m.status === "Ditolak"
    ).length,
  };

  // ==========================================================
  // 4. RENDER
  // ==========================================================
  return (
    <div className="min-h-screen mt-19 pl-70 bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-6xl mx-auto">
        <DashboardHeader
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
        />

        <DashboardStats stats={stats} />

        {loading ? (
          <div className="text-center py-12 text-slate-500">
            Memuat data mahasiswa...
          </div>
        ) : error ? (
          <div className="text-center py-12 text-rose-600">{error}</div>
        ) : (
          <DashboardTable
            filteredList={filteredList}
            mahasiswaList={mahasiswaList} // Tetap kirim seluruh list untuk counter
            handleAction={handleAction} // Mengirim NIM dan aksi
          />
        )}
      </div>
    </div>
  );
};
export default DasborAdmin;
