from flask import jsonify
from ..repositories.history_repository import (
    create_history, 
    get_history_by_student, 
    delete_history
)

def save_chat_history(student_id, pertanyaan, kategori, keyakinan, respons):
    """Simpan riwayat chat ke database"""
    try:
        history = create_history(
            pertanyaan=pertanyaan,
            kategori=kategori,
            keyakinan=keyakinan,
            respons=respons,
            student_id=student_id
        )
        return history
    except Exception as e:
        print(f"Error saving history: {e}")
        return None

def get_student_history(student_id):
    """Ambil semua riwayat chat mahasiswa"""
    histories = get_history_by_student(student_id)
    
    result = []
    for h in histories:
        result.append({
            "id": h.id_riwayat,
            "pertanyaan": h.pertanyaan_user,
            "kategori": h.prediksi_kategori,
            "keyakinan": round(h.tingkat_keyakinan * 100, 1),  # Konversi ke persentase
            "jawaban": h.respons_bot,
            "waktu": h.waktu.strftime("%Y-%m-%d %H:%M:%S") if h.waktu else None
        })
    
    return {"msg": "success", "data": result}, 200

def delete_chat_history(history_id, student_id):
    """Hapus riwayat chat (hanya jika milik mahasiswa tersebut)"""
    from ..repositories.history_repository import get_history_by_id
    
    history = get_history_by_id(history_id)
    if not history:
        return {"msg": "Riwayat tidak ditemukan"}, 404
    
    if history.nomor_induk_mahasiswa != student_id:
        return {"msg": "Tidak diizinkan menghapus riwayat orang lain"}, 403
    
    delete_history(history_id)
    return {"msg": "Riwayat berhasil dihapus"}, 200
