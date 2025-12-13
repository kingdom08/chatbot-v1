from ..utils.extensions import db
from datetime import datetime

class History(db.Model):
    __tablename__ = 'riwayat'
    id_riwayat = db.Column(db.Integer, primary_key=True, autoincrement=True)
    prediksi_kategori = db.Column(db.String(50), nullable=False) # Hasil Naive Bayes
    tingkat_keyakinan = db.Column(db.Float, nullable=False)      # Hasil Max Score (0.0 - 1.0)
    respons_bot = db.Column(db.Text, nullable=False)             # Jawaban dari sistem (Teks panjang)
    waktu = db.Column(db.DateTime, default=datetime.utcnow)      # Waktu otomatis saat insert
    nomor_induk_mahasiswa = db.Column(db.String(20), db.ForeignKey('mahasiswa.nomor_induk_mahasiswa'), nullable=False)

    def __repr__(self):
        return f"<Riwayat {self.id_riwayat} - {self.prediksi_kategori}>"