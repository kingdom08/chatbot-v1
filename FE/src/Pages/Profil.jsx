import React, { useState, useEffect } from "react";
import api from "../URL BE/api"; // Pastikan path ini benar (ke file Axios instance Anda)

const Profil = () => {
    const [profileData, setProfileData] = useState({
        nim: 'Memuat...',
        nama: 'Memuat...',
        email: 'Memuat...',
        wa: 'Memuat...',
        status: 'Memuat...',
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Ambil nama user dari localStorage untuk sapaan awal
    const namaUser = localStorage.getItem("nama") || "Pengguna";

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                setError("Sesi berakhir. Silakan login kembali.");
                setLoading(false);
                return;
            }

            try {
                // Endpoint GET /api/student/profile
                const response = await api.get("/api/student/profile", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                // ASUMSI: BE mengembalikan { msg: "success", student: { studentId: "...", fullName: "...", ... } }
                const data = response.data.student;

                setProfileData({
                    nim: data.studentId || 'N/A',
                    nama: data.fullName || 'N/A',
                    email: data.email || 'N/A',
                    wa: data.whatsappNumber || 'N/A',
                    status: data.accountStatus || 'N/A',
                });
                setLoading(false);
            } catch (err) {
                console.error("Gagal mengambil data profil:", err.response?.data || err);
                setError("Gagal memuat profil. Pastikan Anda sudah login atau server berjalan.");
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const statusColor = (status) => {
        if (status === "Aktif") return "bg-emerald-200 text-emerald-800";
        if (status === "Menunggu") return "bg-amber-200 text-amber-800";
        return "bg-rose-200 text-rose-800"; // Nonaktif atau Ditolak
    };

    if (loading) {
        return <div className="p-20 flex justify-center w-full">Memuat Profil Mahasiswa...</div>;
    }

    if (error) {
        return <div className="p-20 flex justify-center w-full text-red-600">Error: {error}</div>;
    }

    return (
        <div className="p-20 flex flex-col ml-55 mt-5 w-full gap-10">
            <h1 className="font-bold text-3xl">Halo, {namaUser} </h1>
            <div>
                {/* Koatak PRofil */}
                <div className="bg-blue-50 w-150 h-100 p-6 rounded-lg">
                    <h1 className="font-bold text-2xl text-blue-600">Ringkasan Akun</h1>

                    <div className="mt-10 flex flex-col gap-5 font-medium text-[17px] px-8">
                        
                        <section className=" flex justify-between border-b-2 pb-2 border-gray-300">
                            <p>NIM</p>
                            {/* Tampilkan data dari state */}
                            <p>{profileData.nim}</p>
                        </section>
                        <section className=" flex justify-between border-b-2 pb-2 border-gray-300">
                            <p>Nama</p>
                            {/* Tampilkan data dari state */}
                            <p>{profileData.nama}</p>
                        </section>
                        <section className=" flex justify-between border-b-2 pb-2 border-gray-300">
                            <p>Email</p>
                            {/* Tampilkan data dari state */}
                            <p>{profileData.email}</p>
                        </section>
                        <section className=" flex justify-between border-b-2 pb-2 border-gray-300">
                            <p>No Wa</p>
                            {/* Tampilkan data dari state */}
                            <p>{profileData.wa}</p>
                        </section>
                        <section className=" flex justify-between pb-2 border-gray-300">
                            <p>Status Akun</p>
                            {/* Tampilkan data dari state dengan warna dinamis */}
                            <p className={`p-1 rounded-full w-30 text-center font-bold ${statusColor(profileData.status)}`}>
                                Aktif
                            </p>
                        </section>
                    </div>
                </div>

                {/* kotak history */}
                <div></div>
            </div>
        </div>
    );
};

export default Profil;