import React, { useState, useEffect } from "react";
import {
  Database,
  Settings,
  Brain,
  BarChart3,
  Calculator,
  FileText,
  Target,
  Search,
  CheckCircle,
  Loader2,
  RefreshCw,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import api from "../URL BE/api";

const PerhitunganModel = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [testSentence, setTestSentence] = useState(
    "Nilai KHS Saya Belum Masuk",
  );
  const [expandedSections, setExpandedSections] = useState({
    dataset: true,
    preprocessingInfo: true,
    training: true,
    evaluation: true,
    preprocessingTest: true,
    prior: true,
    likelihood: true,
    posterior: true,
    cosine: true,
    result: true,
  });

  const fetchCalculation = async (sentence = null) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      let response;

      if (sentence) {
        response = await api.post(
          "/api/admin/model-calculation",
          { test_sentence: sentence },
          { headers: { Authorization: `Bearer ${token}` } },
        );
      } else {
        response = await api.get("/api/admin/model-calculation", {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      if (response.data.msg === "success") {
        setData(response.data.data);
      } else {
        setError(response.data.error || "Terjadi kesalahan");
      }
    } catch (err) {
      console.error("Error fetching calculation:", err);
      setError("Gagal memuat data perhitungan. Pastikan server berjalan.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCalculation();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (testSentence.trim()) {
      fetchCalculation(testSentence.trim());
    }
  };

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Section Header Component
  const SectionHeader = ({ icon: Icon, title, section, color }) => (
    <button
      onClick={() => toggleSection(section)}
      className={`w-full flex items-center justify-between p-4 ${color} rounded-t-xl text-white font-semibold text-lg hover:opacity-90 transition-opacity`}
    >
      <div className="flex items-center gap-3">
        <Icon size={24} />
        <span>{title}</span>
      </div>
      {expandedSections[section] ? (
        <ChevronUp size={20} />
      ) : (
        <ChevronDown size={20} />
      )}
    </button>
  );

  if (loading) {
    return (
      <div className="min-h-screen mt-19 pl-70 bg-gradient-to-br from-slate-50 to-slate-100 p-8 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 size={48} className="animate-spin text-blue-600" />
          <p className="text-slate-600 font-medium">
            Memuat perhitungan model...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen mt-19 pl-70 bg-gradient-to-br from-slate-50 to-slate-100 p-8 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center max-w-md">
          <p className="text-red-600 font-medium mb-4">{error}</p>
          <button
            onClick={() => fetchCalculation()}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen mt-19 pl-70 bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
          <h1 className="text-2xl font-bold text-slate-800 mb-2">
            📊 Perhitungan Manual Model Naive Bayes
          </h1>
          <p className="text-slate-600">
            Demonstrasi step-by-step proses klasifikasi menggunakan Naive Bayes
            dan Cosine Similarity
          </p>
        </div>

        {/* ============================================== */}
        {/* BAGIAN A: PELATIHAN MODEL */}
        {/* ============================================== */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 rounded-full p-3">
              <Brain size={28} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                BAGIAN A: PELATIHAN MODEL
              </h2>
              <p className="text-blue-100 text-sm">
                Dataset, Preprocessing Dataset, Training, dan Evaluasi Model
              </p>
            </div>
          </div>
        </div>

        {/* 1. Dataset Section */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <SectionHeader
            icon={Database}
            title="1. Dataset Awal"
            section="dataset"
            color="bg-emerald-600"
          />
          {expandedSections.dataset && data?.dataset && (
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-emerald-50 rounded-lg p-4 text-center">
                  <p className="text-3xl font-bold text-emerald-700">
                    {data.dataset.total}
                  </p>
                  <p className="text-emerald-600 text-sm">Total Dataset</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <p className="text-3xl font-bold text-blue-700">
                    {data.dataset.categories?.length || 0}
                  </p>
                  <p className="text-blue-600 text-sm">Jumlah Kategori</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 text-center">
                  <p className="text-3xl font-bold text-purple-700">80:20</p>
                  <p className="text-purple-600 text-sm">Rasio Train:Test</p>
                </div>
              </div>

              <h4 className="font-semibold text-slate-700 mt-4">
                Distribusi Kategori:
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-slate-100">
                      <th className="border border-slate-200 px-4 py-2 text-left">
                        Kategori
                      </th>
                      <th className="border border-slate-200 px-4 py-2 text-right">
                        Jumlah Data
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.dataset.categories?.map((cat, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="border border-slate-200 px-4 py-2">
                          {cat.kategori}
                        </td>
                        <td className="border border-slate-200 px-4 py-2 text-right font-mono">
                          {cat.jumlah}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* 2. Tahapan Preprocessing (Penjelasan) */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <SectionHeader
            icon={Settings}
            title="2. Tahapan Preprocessing"
            section="preprocessingInfo"
            color="bg-orange-600"
          />
          {expandedSections.preprocessingInfo && (
            <div className="p-6">
              <p className="text-slate-600 mb-4">
                Preprocessing adalah tahap awal pengolahan teks untuk menyiapkan
                data agar dapat diproses lebih akurat oleh algoritma. Tahapan
                yang digunakan:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-orange-50 rounded-lg p-4">
                  <h4 className="font-semibold text-orange-800 mb-2">
                    1. Case Folding
                  </h4>
                  <p className="text-sm text-orange-700">
                    Mengubah seluruh karakter huruf menjadi huruf kecil
                    (lowercase)
                  </p>
                </div>
                <div className="bg-orange-50 rounded-lg p-4">
                  <h4 className="font-semibold text-orange-800 mb-2">
                    2. Remove Numbers
                  </h4>
                  <p className="text-sm text-orange-700">
                    Menghapus semua angka dari teks
                  </p>
                </div>
                <div className="bg-orange-50 rounded-lg p-4">
                  <h4 className="font-semibold text-orange-800 mb-2">
                    3. Remove Punctuation
                  </h4>
                  <p className="text-sm text-orange-700">
                    Menghapus tanda baca dari teks
                  </p>
                </div>
                <div className="bg-orange-50 rounded-lg p-4">
                  <h4 className="font-semibold text-orange-800 mb-2">
                    4. Tokenizing
                  </h4>
                  <p className="text-sm text-orange-700">
                    Memecah kalimat menjadi token (kata-kata)
                  </p>
                </div>
                <div className="bg-orange-50 rounded-lg p-4">
                  <h4 className="font-semibold text-orange-800 mb-2">
                    5. Stopword Removal
                  </h4>
                  <p className="text-sm text-orange-700">
                    Menghapus kata-kata umum yang tidak bermakna (menggunakan
                    Sastrawi)
                  </p>
                </div>
                <div className="bg-orange-50 rounded-lg p-4">
                  <h4 className="font-semibold text-orange-800 mb-2">
                    6. Stemming
                  </h4>
                  <p className="text-sm text-orange-700">
                    Mengubah kata ke bentuk dasar (menggunakan Sastrawi Stemmer)
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 3. Training Info Section */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <SectionHeader
            icon={Brain}
            title="3. Pelatihan Model"
            section="training"
            color="bg-purple-600"
          />
          {expandedSections.training && data?.training && (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex justify-between border-b border-slate-200 pb-2">
                    <span className="text-slate-600">Model:</span>
                    <span className="font-semibold text-slate-800">
                      {data.training.model}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-2">
                    <span className="text-slate-600">Vectorizer:</span>
                    <span className="font-semibold text-slate-800">
                      {data.training.vectorizer}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-2">
                    <span className="text-slate-600">Random State:</span>
                    <span className="font-mono text-slate-800">
                      {data.training.random_state}
                    </span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between border-b border-slate-200 pb-2">
                    <span className="text-slate-600">Data Train:</span>
                    <span className="font-semibold text-slate-800">
                      {data.training.train_size} (
                      {data.training.train_percentage}%)
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-2">
                    <span className="text-slate-600">Data Test:</span>
                    <span className="font-semibold text-slate-800">
                      {data.training.test_size} ({data.training.test_percentage}
                      %)
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-2">
                    <span className="text-slate-600">
                      Ukuran Vocabulary (|V|):
                    </span>
                    <span className="font-mono text-purple-700 font-bold">
                      {data.training.vocabulary_size}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 4. Evaluation Section */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <SectionHeader
            icon={BarChart3}
            title="4. Evaluasi Model (Confusion Matrix)"
            section="evaluation"
            color="bg-rose-600"
          />
          {expandedSections.evaluation && data?.evaluation && (
            <div className="p-6">
              <div className="bg-rose-50 rounded-lg p-4 mb-4 text-center">
                <p className="text-sm text-rose-700">Akurasi Model</p>
                <p className="text-4xl font-bold text-rose-700">
                  {data.evaluation.accuracy_percentage}%
                </p>
              </div>

              <h4 className="font-semibold text-slate-700 mb-3">
                Confusion Matrix:
              </h4>
              <div className="overflow-x-auto">
                <table className="border-collapse mx-auto">
                  <thead>
                    <tr>
                      <th className="border border-slate-300 px-3 py-2 bg-slate-100"></th>
                      {data.evaluation.labels?.map((label, idx) => (
                        <th
                          key={idx}
                          className="border border-slate-300 px-3 py-2 bg-slate-100 text-xs font-medium"
                        >
                          {label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.evaluation.confusion_matrix?.map((row, rowIdx) => (
                      <tr key={rowIdx}>
                        <td className="border border-slate-300 px-3 py-2 bg-slate-100 text-xs font-medium">
                          {data.evaluation.labels?.[rowIdx]}
                        </td>
                        {row.map((val, colIdx) => (
                          <td
                            key={colIdx}
                            className={`border border-slate-300 px-3 py-2 text-center font-mono text-sm ${
                              rowIdx === colIdx
                                ? "bg-green-100 text-green-800 font-bold"
                                : val > 0
                                  ? "bg-red-50 text-red-600"
                                  : ""
                            }`}
                          >
                            {val}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* ============================================== */}
        {/* BAGIAN B: KLASIFIKASI KALIMAT UJI */}
        {/* ============================================== */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl p-6 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 rounded-full p-3">
              <Target size={28} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                BAGIAN B: KLASIFIKASI KALIMAT UJI
              </h2>
              <p className="text-emerald-100 text-sm">
                Preprocessing, Prior, Likelihood, Posterior, Cosine Similarity,
                dan Hasil
              </p>
            </div>
          </div>
        </div>

        {/* Input Kalimat Uji */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">
            📝 Input Kalimat Uji
          </h3>
          <form onSubmit={handleSubmit} className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Masukkan kalimat pertanyaan yang ingin diuji:
              </label>
              <input
                type="text"
                value={testSentence}
                onChange={(e) => setTestSentence(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                placeholder="Contoh: Nilai KHS Saya Belum Masuk"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
            >
              <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
              Hitung
            </button>
          </form>
        </div>

        {/* 5. Preprocessing Kalimat Uji */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <SectionHeader
            icon={Settings}
            title="5. Preprocessing Kalimat Uji"
            section="preprocessingTest"
            color="bg-orange-600"
          />
          {expandedSections.preprocessingTest && data?.preprocessing && (
            <div className="p-6 space-y-4">
              <div className="bg-orange-50 rounded-lg p-4 mb-4">
                <p className="text-sm text-orange-700 font-medium">
                  Kalimat Asli:
                </p>
                <p className="text-lg font-semibold text-orange-800">
                  "{data.preprocessing.original}"
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-slate-100">
                      <th className="border border-slate-200 px-4 py-2 text-left">
                        Tahap
                      </th>
                      <th className="border border-slate-200 px-4 py-2 text-left">
                        Deskripsi
                      </th>
                      <th className="border border-slate-200 px-4 py-2 text-left">
                        Hasil
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.preprocessing.steps?.map((step, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="border border-slate-200 px-4 py-2 font-medium">
                          {step.step}
                        </td>
                        <td className="border border-slate-200 px-4 py-2 text-sm text-slate-600">
                          {step.description}
                        </td>
                        <td className="border border-slate-200 px-4 py-2 font-mono text-sm">
                          {Array.isArray(step.output)
                            ? step.output.join(", ")
                            : step.output}
                          {step.removed && step.removed.length > 0 && (
                            <span className="text-red-500 ml-2">
                              (dihapus: {step.removed.join(", ")})
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="bg-green-50 rounded-lg p-4 mt-4">
                <p className="text-sm text-green-700 font-medium">
                  Hasil Akhir Preprocessing:
                </p>
                <p className="text-lg font-semibold text-green-800 font-mono">
                  "{data.preprocessing.final}"
                </p>
              </div>
            </div>
          )}
        </div>

        {/* 6. Prior Probability Section */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <SectionHeader
            icon={Calculator}
            title="6. Perhitungan Prior Probability"
            section="prior"
            color="bg-cyan-600"
          />
          {expandedSections.prior && data?.prior_probability && (
            <div className="p-6">
              <div className="bg-cyan-50 rounded-lg p-4 mb-4">
                <p className="text-sm text-cyan-700">Rumus:</p>
                <p className="font-mono text-cyan-800 font-semibold">
                  {data.prior_probability.formula}
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-slate-100">
                      <th className="border border-slate-200 px-4 py-2 text-left">
                        Kategori
                      </th>
                      <th className="border border-slate-200 px-4 py-2 text-center">
                        Jumlah Data
                      </th>
                      <th className="border border-slate-200 px-4 py-2 text-center">
                        Perhitungan
                      </th>
                      <th className="border border-slate-200 px-4 py-2 text-center">
                        P(C)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.prior_probability.results?.map((result, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="border border-slate-200 px-4 py-2 font-medium">
                          {result.kategori}
                        </td>
                        <td className="border border-slate-200 px-4 py-2 text-center">
                          {result.jumlah_data}
                        </td>
                        <td className="border border-slate-200 px-4 py-2 text-center font-mono text-sm">
                          {result.formula}
                        </td>
                        <td className="border border-slate-200 px-4 py-2 text-center font-mono font-bold text-cyan-700">
                          {result.probability}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* 7. Likelihood Section */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <SectionHeader
            icon={FileText}
            title="7. Perhitungan Likelihood (Laplace Smoothing)"
            section="likelihood"
            color="bg-indigo-600"
          />
          {expandedSections.likelihood && data?.likelihood && (
            <div className="p-6">
              <div className="bg-indigo-50 rounded-lg p-4 mb-4">
                <p className="text-sm text-indigo-700">Rumus:</p>
                <p className="font-mono text-indigo-800 font-semibold">
                  {data.likelihood.formula}
                </p>
                <p className="text-sm text-indigo-600 mt-1">
                  |V| = {data.likelihood.vocabulary_size}
                </p>
              </div>

              <h4 className="font-semibold text-slate-700 mb-3">
                Frekuensi Kata per Kategori:
              </h4>
              <div className="overflow-x-auto mb-6">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-slate-100">
                      <th className="border border-slate-200 px-4 py-2 text-left">
                        Kata
                      </th>
                      {data.likelihood.results?.map((r) => (
                        <th
                          key={r.kategori}
                          className="border border-slate-200 px-4 py-2 text-center"
                        >
                          {r.kategori}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.word_frequency?.map((wf, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="border border-slate-200 px-4 py-2 font-mono">
                          {wf.kata}
                        </td>
                        {data.likelihood.results?.map((r) => (
                          <td
                            key={r.kategori}
                            className="border border-slate-200 px-4 py-2 text-center font-mono"
                          >
                            {wf[r.kategori] || 0}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <h4 className="font-semibold text-slate-700 mb-3">
                Likelihood per Kategori:
              </h4>
              {data.likelihood.results?.map((result, idx) => (
                <div
                  key={idx}
                  className="mb-4 border border-slate-200 rounded-lg overflow-hidden"
                >
                  <div className="bg-slate-100 px-4 py-2 font-semibold">
                    {result.kategori}
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-slate-600 mb-2">
                      Total kata: {result.total_kata_kategori} | Denominator:{" "}
                      {result.denominator}
                    </p>
                    <div className="space-y-1">
                      {result.kata_likelihoods?.map((kl, klIdx) => (
                        <div
                          key={klIdx}
                          className="flex items-center gap-2 text-sm"
                        >
                          <span className="font-mono">
                            P({kl.kata}|{result.kategori})
                          </span>
                          <span className="text-slate-400">=</span>
                          <span className="font-mono text-slate-600">
                            {kl.formula}
                          </span>
                          <span className="text-slate-400">=</span>
                          <span className="font-mono font-bold text-indigo-700">
                            {kl.likelihood}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 8. Posterior Probability Section */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <SectionHeader
            icon={Target}
            title="8. Perhitungan Posterior Probability"
            section="posterior"
            color="bg-amber-600"
          />
          {expandedSections.posterior && data?.posterior && (
            <div className="p-6">
              <div className="bg-amber-50 rounded-lg p-4 mb-4">
                <p className="text-sm text-amber-700">Rumus:</p>
                <p className="font-mono text-amber-800 font-semibold">
                  {data.posterior.formula}
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-slate-100">
                      <th className="border border-slate-200 px-4 py-2 text-left">
                        Kategori
                      </th>
                      <th className="border border-slate-200 px-4 py-2 text-center">
                        P(C)
                      </th>
                      <th className="border border-slate-200 px-4 py-2 text-center">
                        Π P(w|C)
                      </th>
                      <th className="border border-slate-200 px-4 py-2 text-center">
                        Posterior
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.posterior.results?.map((result, idx) => (
                      <tr
                        key={idx}
                        className={`hover:bg-slate-50 ${result.is_max ? "bg-green-50" : ""}`}
                      >
                        <td className="border border-slate-200 px-4 py-2 font-medium">
                          {result.kategori}
                          {result.is_max && (
                            <span className="ml-2 text-green-600 text-sm">
                              ✓ MAX
                            </span>
                          )}
                        </td>
                        <td className="border border-slate-200 px-4 py-2 text-center font-mono">
                          {result.prior}
                        </td>
                        <td className="border border-slate-200 px-4 py-2 text-center font-mono text-xs">
                          {result.likelihood_product.toExponential(4)}
                        </td>
                        <td
                          className={`border border-slate-200 px-4 py-2 text-center font-mono font-bold ${
                            result.is_max
                              ? "text-green-700 text-lg"
                              : "text-slate-700"
                          }`}
                        >
                          {result.posterior_formatted}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="bg-green-100 rounded-lg p-4 mt-4 text-center">
                <p className="text-sm text-green-700">Kategori Terprediksi:</p>
                <p className="text-2xl font-bold text-green-800">
                  {data.posterior.predicted_category}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* 9. Cosine Similarity Section */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <SectionHeader
            icon={Search}
            title="9. Cosine Similarity"
            section="cosine"
            color="bg-teal-600"
          />
          {expandedSections.cosine && data?.cosine_similarity && (
            <div className="p-6">
              <div className="bg-teal-50 rounded-lg p-4 mb-4">
                <p className="text-sm text-teal-700">Rumus:</p>
                <p className="font-mono text-teal-800 font-semibold">
                  {data.cosine_similarity.formula}
                </p>
              </div>

              <div className="mb-4">
                <p className="text-sm text-slate-600 mb-2">
                  Vektor Pertanyaan Uji:
                </p>
                <div className="bg-slate-100 rounded-lg p-3 font-mono text-sm">
                  <p className="text-slate-600 mb-1">
                    Kata: [{data.cosine_similarity.test_vocabulary?.join(", ")}]
                  </p>
                  <p className="text-slate-800">
                    Nilai: [{data.cosine_similarity.test_values?.join(", ")}]
                  </p>
                </div>
              </div>

              <h4 className="font-semibold text-slate-700 mb-3">
                Top 5 Hasil Similarity:
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-slate-100">
                      <th className="border border-slate-200 px-4 py-2 text-left">
                        Pertanyaan
                      </th>
                      <th className="border border-slate-200 px-4 py-2 text-center">
                        Similarity
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.cosine_similarity.similarity_results?.map(
                      (result, idx) => (
                        <tr
                          key={idx}
                          className={`hover:bg-slate-50 ${idx === 0 ? "bg-teal-50" : ""}`}
                        >
                          <td className="border border-slate-200 px-4 py-2 text-sm">
                            {result.pertanyaan}
                          </td>
                          <td className="border border-slate-200 px-4 py-2 text-center font-mono font-bold">
                            {result.similarity_percentage}%
                          </td>
                        </tr>
                      ),
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* 10. Final Result Section */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <SectionHeader
            icon={CheckCircle}
            title="10. Hasil Klasifikasi (Post-Processing)"
            section="result"
            color="bg-green-600"
          />
          {expandedSections.result && data?.result && (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-sm text-blue-600 mb-1">Kalimat Uji:</p>
                  <p className="font-semibold text-blue-800">
                    "{data.result.test_sentence}"
                  </p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <p className="text-sm text-purple-600 mb-1">
                    Kategori Terprediksi:
                  </p>
                  <p className="font-bold text-2xl text-purple-800">
                    {data.result.predicted_category}
                  </p>
                </div>
              </div>

              <div className="bg-green-100 border-2 border-green-300 rounded-xl p-6">
                <p className="text-sm text-green-700 mb-2 font-medium">
                  💬 Jawaban Chatbot:
                </p>
                <p className="text-lg text-green-900">{data.result.answer}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PerhitunganModel;
