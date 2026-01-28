from ..repositories.chat_repository import (
    create_session,
    get_sessions_by_student,
    get_session_by_id,
    update_session_title,
    delete_session,
    add_message,
    get_messages_by_session
)

def create_new_session(student_id):
    """Buat sesi chat baru untuk mahasiswa"""
    session = create_session(student_id)
    return {
        "msg": "success",
        "session": {
            "id": session.id_sesi,
            "judul": session.judul,
            "waktu_dibuat": session.waktu_dibuat.strftime("%Y-%m-%d %H:%M:%S")
        }
    }, 201

def get_all_sessions(student_id):
    """Ambil semua sesi milik mahasiswa"""
    sessions = get_sessions_by_student(student_id)
    result = []
    for s in sessions:
        # Ambil pesan pertama untuk preview
        messages = get_messages_by_session(s.id_sesi)
        preview = ""
        if messages:
            first_user_msg = next((m for m in messages if m.pengirim == 'user'), None)
            if first_user_msg:
                preview = first_user_msg.isi_pesan[:50] + "..." if len(first_user_msg.isi_pesan) > 50 else first_user_msg.isi_pesan
        
        result.append({
            "id": s.id_sesi,
            "judul": s.judul,
            "preview": preview,
            "waktu_update": s.waktu_update.strftime("%Y-%m-%d %H:%M:%S") if s.waktu_update else None,
            "jumlah_pesan": len(messages)
        })
    return {"msg": "success", "data": result}, 200

def get_session_detail(session_id, student_id):
    """Ambil detail sesi beserta semua pesannya"""
    session = get_session_by_id(session_id)
    
    if not session:
        return {"msg": "Sesi tidak ditemukan"}, 404
    
    if session.nomor_induk_mahasiswa != student_id:
        return {"msg": "Tidak diizinkan mengakses sesi orang lain"}, 403
    
    messages = get_messages_by_session(session_id)
    messages_data = [
        {
            "id": m.id_pesan,
            "from": m.pengirim,
            "text": m.isi_pesan,
            "waktu": m.waktu.strftime("%Y-%m-%d %H:%M:%S") if m.waktu else None
        }
        for m in messages
    ]
    
    return {
        "msg": "success",
        "session": {
            "id": session.id_sesi,
            "judul": session.judul,
            "waktu_dibuat": session.waktu_dibuat.strftime("%Y-%m-%d %H:%M:%S"),
            "waktu_update": session.waktu_update.strftime("%Y-%m-%d %H:%M:%S") if session.waktu_update else None
        },
        "messages": messages_data
    }, 200

def delete_session_by_id(session_id, student_id):
    """Hapus sesi chat"""
    session = get_session_by_id(session_id)
    
    if not session:
        return {"msg": "Sesi tidak ditemukan"}, 404
    
    if session.nomor_induk_mahasiswa != student_id:
        return {"msg": "Tidak diizinkan menghapus sesi orang lain"}, 403
    
    delete_session(session_id)
    return {"msg": "Sesi berhasil dihapus"}, 200

def save_chat_message(session_id, student_id, user_message, bot_response, intent):
    """Simpan pesan user dan bot ke sesi"""
    session = get_session_by_id(session_id)
    
    if not session:
        return None
    
    if session.nomor_induk_mahasiswa != student_id:
        return None
    
    # Simpan pesan user
    add_message(session_id, 'user', user_message)
    
    # Simpan respons bot
    add_message(session_id, 'bot', bot_response)
    
    # Update judul sesi jika masih default
    if session.judul == 'Chat Baru':
        # Buat judul dari pesan pertama
        new_title = user_message[:50] + "..." if len(user_message) > 50 else user_message
        update_session_title(session_id, new_title)
    
    return True

def rename_session(session_id, student_id, new_title):
    """Rename judul sesi"""
    session = get_session_by_id(session_id)
    
    if not session:
        return {"msg": "Sesi tidak ditemukan"}, 404
    
    if session.nomor_induk_mahasiswa != student_id:
        return {"msg": "Tidak diizinkan mengubah sesi orang lain"}, 403
    
    update_session_title(session_id, new_title)
    return {"msg": "success"}, 200
