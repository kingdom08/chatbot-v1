from ..utils.extensions import db
from datetime import datetime

class Student(db.Model):
    __tablename__ = 'mahasiswa'

    nomor_induk_mahasiswa = db.Column(db.String(20), primary_key=True)
    nama_lengkap = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    kata_sandi = db.Column(db.String(255), nullable=False) # Disimpan dalam bentuk Hash
    nomor_whatsapp = db.Column(db.String(20), nullable=True)
    status_akun = db.Column(db.String(20), default='Aktif') # Contoh: 'Aktif', 'Nonaktif'
    riwayat_logs = db.relationship('History', backref='mahasiswa', lazy=True)