import { UserX, UserCheck, Clock } from "lucide-react";
import { useState } from "react";

// handleAction di sini kini menerima NIM dan aksi: handleAction(nim, action)
const DashboardTable = ({ filteredList, mahasiswaList, handleAction }) => {
  // showConfirm sekarang menyimpan { nim: string, action: string }
  const [showConfirm, setShowConfirm] = useState(null);

  const statusColor = (status) => {
    if (status === "Aktif")
      return "bg-emerald-100 text-emerald-700 border-emerald-200";
    if (status === "Menunggu")
      return "bg-amber-100 text-amber-700 border-amber-200";
    if (status === "Nonaktif" || status === "Ditolak")
      return "bg-rose-100 text-rose-700 border-rose-200";
  };

  const statusIcon = (status) => {
    if (status === "Aktif") return <UserCheck className="w-3 h-3" />;
    if (status === "Menunggu") return <Clock className="w-3 h-3" />;
    if (status === "Nonaktif" || status === "Ditolak")
      return <UserX className="w-3 h-3" />;
  };

  // FUNGSI onAction SEKARANG MENGIRIM NIM KE PARENT
  const onAction = (nim, action) => {
    handleAction(nim, action); // Mengirim NIM ke DasborAdmin.jsx
    setShowConfirm(null);
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="py-4 px-6 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  NIM
                </th>
                <th className="py-4 px-6 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Nama Mahasiswa
                </th>
                <th className="py-4 px-6 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Email Kampus
                </th>
                <th className="py-4 px-6 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  No WhatsApp
                </th>
                <th className="py-4 px-6 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="py-4 px-6 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200">
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-500">
                    <UserX className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                    <p className="text-lg font-medium">
                      Tidak ada data ditemukan
                    </p>
                    <p className="text-sm">
                      Coba ubah filter atau kata kunci pencarian
                    </p>
                  </td>
                </tr>
              ) : (
                filteredList.map((mhs) => (
                  <tr key={mhs.nim} className="hover:bg-slate-50 transition">
                    {/* Gunakan NIM sebagai key */}
                    <td className="py-4 px-6 text-sm font-medium text-slate-900">
                      {mhs.nim}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-slate-900">
                          {mhs.nama}
                        </span>
                        <span className="text-xs text-slate-500">
                          {mhs.prodi}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm text-slate-700">
                      {mhs.email}
                    </td>
                    <td className="py-4 px-6 text-sm text-slate-700">
                      {mhs.wa}
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${statusColor(
                          mhs.status
                        )}`}
                      >
                        {statusIcon(mhs.status)}
                        {mhs.status}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex gap-2">
                        {mhs.status === "Menunggu" && (
                          <>
                            <button
                              // MENGIRIM NIM KE PARENT
                              onClick={() => handleAction(mhs.nim, "aktifkan")}
                              className="px-3 py-1.5 text-xs font-medium bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
                            >
                              Terima
                            </button>
                            <button
                              // MENYIMPAN NIM DI STATE CONFIRM
                              onClick={() =>
                                setShowConfirm({
                                  nim: mhs.nim,
                                  action: "tolak",
                                })
                              }
                              className="px-3 py-1.5 text-xs font-medium bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition"
                            >
                              Tolak
                            </button>
                          </>
                        )}

                        {mhs.status === "Aktif" && (
                          <button
                            // MENYIMPAN NIM DI STATE CONFIRM
                            onClick={() =>
                              setShowConfirm({
                                nim: mhs.nim,
                                action: "nonaktifkan",
                              })
                            }
                            className="px-3 py-1.5 text-xs font-medium bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition"
                          >
                            Nonaktifkan
                          </button>
                        )}
                        {mhs.status === "Ditolak" && (
                          <button
                            // MENGIRIM NIM KE PARENT
                            onClick={() => handleAction(mhs.nim, "aktifkan")}
                            className="px-3 py-1.5 text-xs font-medium bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition"
                          >
                            Terima
                          </button>
                        )}

                        {mhs.status === "Nonaktif" && (
                          <button
                            // MENGIRIM NIM KE PARENT
                            onClick={() => handleAction(mhs.nim, "aktifkan")}
                            className="px-3 py-1.5 text-xs font-medium bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
                          >
                            Aktifkan
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {filteredList.length > 0 && (
          <div className="px-6 py-4 border-t border-slate-200 bg-slate-50">
            <p className="text-sm text-slate-600">
              Menampilkan{" "}
              <span className="font-medium">{filteredList.length}</span> dari{" "}
              <span className="font-medium">{mahasiswaList.length}</span>{" "}
              mahasiswa
            </p>
          </div>
        )}
      </div>

      {showConfirm && (
        <div className="fixed inset-0 bg-black/20 bg-opacity-50 z-100 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-slate-800 mb-2">
              Konfirmasi Aksi
            </h3>
            <p className="text-slate-600 mb-6">
              Apakah Anda yakin ingin{" "}
              {showConfirm.action === "tolak" ? "menolak" : "menonaktifkan"}{" "}
              akun mahasiswa ini?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowConfirm(null)}
                className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition"
              >
                Batal
              </button>
              <button
                // MENGIRIM NIM DARI STATE CONFIRM
                onClick={() => onAction(showConfirm.nim, showConfirm.action)}
                className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition"
              >
                Ya, Lanjutkan
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DashboardTable;
