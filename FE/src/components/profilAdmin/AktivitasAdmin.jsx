import React from 'react'

const AktivitasAdmin = () => {
  return (
   <div className="lg:col-span-2 bg-white shadow-lg rounded-2xl p-8 border border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-800 mb-5">Aktivitas Terbaru</h2>

          <div className="flex flex-col gap-4">
            <div className="p-4 bg-gray-50 rounded-xl border flex justify-between">
              <p>Menonaktifkan akun mahasiswa</p>
              <span className="text-gray-500 text-sm">2 jam lalu</span>
            </div>

            <div className="p-4 bg-gray-50 rounded-xl border flex justify-between">
              <p>Menonaktifkan akun mahasiswa</p>
              <span className="text-gray-500 text-sm">5 jam lalu</span>
            </div>

            <div className="p-4 bg-gray-50 rounded-xl border flex justify-between">
              <p>Mengaktifkan kembali akun mahasiswa</p>
              <span className="text-gray-500 text-sm">1 hari lalu</span>
            </div>

            <div className="p-4 bg-gray-50 rounded-xl border flex justify-between">
              <p>Menolak daftar akun mahasiswa</p>
              <span className="text-gray-500 text-sm">2 hari lalu</span>
            </div>
          </div>
        </div>
  )
}

export default AktivitasAdmin