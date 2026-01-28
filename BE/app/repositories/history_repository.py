from ..utils.extensions import db
from ..models.history_model import History

def create_history(pertanyaan, kategori, keyakinan, respons, student_id):
    """Simpan riwayat chat baru ke database"""
    history = History(
        pertanyaan_user=pertanyaan,
        prediksi_kategori=kategori,
        tingkat_keyakinan=keyakinan,
        respons_bot=respons,
        nomor_induk_mahasiswa=student_id
    )
    db.session.add(history)
    db.session.commit()
    return history

def get_history_by_student(student_id):
    """Ambil semua riwayat berdasarkan NIM mahasiswa, urutkan terbaru dulu"""
    return History.query.filter_by(nomor_induk_mahasiswa=student_id)\
        .order_by(History.waktu.desc()).all()

def get_history_by_id(history_id):
    """Ambil riwayat berdasarkan ID"""
    return History.query.get(history_id)

def delete_history(history_id):
    """Hapus riwayat berdasarkan ID"""
    history = History.query.get(history_id)
    if history:
        db.session.delete(history)
        db.session.commit()
        return True
    return False
