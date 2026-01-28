import React, { useState, useEffect } from "react";
import DashboardHeader from "../components/Dashboard admin/DashboardHeader";
import DashboardStats from "../components/Dashboard admin/DasboardStats";
import DashboardTable from "../components/Dashboard admin/DashboardTabel";
import { UserCheck, UserX, Clock } from "lucide-react";
import api from "../URL BE/api";

const DasborAdmin = () => {
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
      // Mengambil data dari endpoint list mahasiswa
      const response = await api.get("/api/admin/students", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Mapping data dari format Backend ke format Frontend
      const students = response.data.students.map((s) => ({
        nim: s.studentId,         // Mapping studentId ke nim
        nama: s.fullName,         // Mapping fullName ke nama
        email: s.email,           // Mapping email
        wa: s.whatsappNumber,     // Mapping whatsappNumber ke wa
        status: s.accountStatus,  // Mapping accountStatus ke status
        prodi: "Informatika",     // Default prodi
      }));

      setMahasiswaList(students);
      setLoading(false);
    } catch (err) {
      console.error("Gagal mengambil data mahasiswa:", err.response?.data || err);
      setError("Gagal memuat data. Pastikan server Flask berjalan.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // ==========================================================
  // 2. FUNGSI HELPER WHATSAPP
  // ==========================================================
  const kirimNotifikasiWA = (nomorWA, namaMahasiswa) => {
    // Membersihkan karakter non-digit
    let formattedWA = nomorWA.replace(/\D/g, ""); 
    
    // Konversi awalan 0 menjadi kode negara 62
    if (formattedWA.startsWith("0")) {
      formattedWA = "62" + formattedWA.substring(1);
    }

    const pesan = `Halo *${namaMahasiswa}*, akun Anda di aplikasi BIMA telah *DISETUJUI* oleh Admin. Sekarang Anda sudah bisa login menggunakan NIM dan Password Anda. Terima kasih!`;
    const url = `https://wa.me/${formattedWA}?text=${encodeURIComponent(pesan)}`;
    
    // Membuka WhatsApp di tab baru
    window.open(url, "_blank");
  };

  // ==========================================================
  // 3. FUNGSI AKSI (UPDATE STATUS & WA NOTIF)
  // ==========================================================
  const handleAction = async (nim, action) => {
    let newStatus = "";

    if (action === "aktifkan") newStatus = "Aktif";
    else if (action === "nonaktifkan") newStatus = "Nonaktif";
    else if (action === "tolak") newStatus = "Ditolak";

    if (!newStatus) return;

    try {
      const token = localStorage.getItem("token");

      // Mengirim request PATCH untuk update status akun
      await api.patch(
        `api/admin/students/${nim}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // --- LOGIKA NOTIFIKASI WHATSAPP ---
      if (action === "aktifkan") {
        const student = mahasiswaList.find((m) => m.nim === nim);
        if (student && student.wa) {
          kirimNotifikasiWA(student.wa, student.nama);
        }
      }

      // Update state local agar tampilan langsung berubah tanpa reload manual
      setMahasiswaList((prev) =>
        prev.map((m) => (m.nim === nim ? { ...m, status: newStatus } : m))
      );

      alert(`Status mahasiswa berhasil diubah menjadi ${newStatus}.`);
    } catch (err) {
      console.error("Gagal update status:", err.response?.data || err);
      alert("Gagal mengubah status mahasiswa.");
    }
  };

  // ==========================================================
  // 4. FILTERING DAN STATS (TETAP SAMA)
  // ==========================================================
  const filteredList = mahasiswaList.filter((mhs) => {
    const matchSearch =
      mhs.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mhs.nim.toString().includes(searchTerm) ||
      mhs.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchFilter = filterStatus === "Semua" || mhs.status === filterStatus;
    return matchSearch && matchFilter;
  });

  const stats = {
    total: mahasiswaList.length,
    aktif: mahasiswaList.filter((m) => m.status === "Aktif").length,
    menunggu: mahasiswaList.filter((m) => m.status === "Menunggu").length,
    nonaktif: mahasiswaList.filter((m) => m.status === "Nonaktif" || m.status === "Ditolak").length,
  };

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
          <div className="text-center py-12 text-slate-500 font-medium">
            Memuat data mahasiswa...
          </div>
        ) : error ? (
          <div className="text-center py-12 text-rose-600 font-medium">{error}</div>
        ) : (
          <DashboardTable
            filteredList={filteredList}
            mahasiswaList={mahasiswaList}
            handleAction={handleAction}
          />
        )}
      </div>
    </div>
  );
};

export default DasborAdmin;