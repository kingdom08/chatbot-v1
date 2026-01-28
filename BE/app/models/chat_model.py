from ..utils.extensions import db
from datetime import datetime

class ChatSession(db.Model):
    """Model untuk sesi percakapan (seperti thread di ChatGPT)"""
    __tablename__ = 'sesi_chat'
    
    id_sesi = db.Column(db.Integer, primary_key=True, autoincrement=True)
    judul = db.Column(db.String(100), default='Chat Baru')
    nomor_induk_mahasiswa = db.Column(db.String(20), db.ForeignKey('mahasiswa.nomor_induk_mahasiswa'), nullable=False)
    waktu_dibuat = db.Column(db.DateTime, default=datetime.utcnow)
    waktu_update = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationship ke pesan
    pesan_list = db.relationship('ChatMessage', backref='sesi', lazy=True, cascade='all, delete-orphan')
    
    def __repr__(self):
        return f"<ChatSession {self.id_sesi} - {self.judul}>"


class ChatMessage(db.Model):
    """Model untuk pesan individual dalam sesi"""
    __tablename__ = 'pesan_chat'
    
    id_pesan = db.Column(db.Integer, primary_key=True, autoincrement=True)
    id_sesi = db.Column(db.Integer, db.ForeignKey('sesi_chat.id_sesi'), nullable=False)
    pengirim = db.Column(db.String(10), nullable=False)  # 'user' atau 'bot'
    isi_pesan = db.Column(db.Text, nullable=False)
    waktu = db.Column(db.DateTime, default=datetime.utcnow)
    
    def __repr__(self):
        return f"<ChatMessage {self.id_pesan} - {self.pengirim}>"
