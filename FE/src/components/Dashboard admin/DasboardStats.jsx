import { UserCheck, UserX, Clock } from "lucide-react";

const DashboardStats = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-600 mb-1">Total Mahasiswa</p>
            <p className="text-3xl font-bold text-slate-800">{stats.total}</p>
          </div>
          <div className="bg-blue-100 p-3 rounded-lg">
            <UserCheck className="w-6 h-6 text-blue-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-600 mb-1">Aktif</p>
            <p className="text-3xl font-bold text-emerald-600">{stats.aktif}</p>
          </div>
          <div className="bg-emerald-100 p-3 rounded-lg">
            <UserCheck className="w-6 h-6 text-emerald-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-600 mb-1">Menunggu</p>
            <p className="text-3xl font-bold text-amber-600">{stats.menunggu}</p>
          </div>
          <div className="bg-amber-100 p-3 rounded-lg">
            <Clock className="w-6 h-6 text-amber-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-600 mb-1">Nonaktif</p>
            <p className="text-3xl font-bold text-rose-600">{stats.nonaktif}</p>
          </div>
          <div className="bg-rose-100 p-3 rounded-lg">
            <UserX className="w-6 h-6 text-rose-600" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;
