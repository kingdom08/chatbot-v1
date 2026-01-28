from ..utils.extensions import db
from ..models.chat_model import ChatSession, ChatMessage

# ========== SESSION OPERATIONS ==========

def create_session(student_id, judul="Chat Baru"):
    """Buat sesi chat baru"""
    session = ChatSession(
        judul=judul,
        nomor_induk_mahasiswa=student_id
    )
    db.session.add(session)
    db.session.commit()
    return session

def get_sessions_by_student(student_id):
    """Ambil semua sesi milik mahasiswa, urutkan terbaru dulu"""
    return ChatSession.query.filter_by(nomor_induk_mahasiswa=student_id)\
        .order_by(ChatSession.waktu_update.desc()).all()

def get_session_by_id(session_id):
    """Ambil sesi berdasarkan ID"""
    return ChatSession.query.get(session_id)

def update_session_title(session_id, new_title):
    """Update judul sesi"""
    session = ChatSession.query.get(session_id)
    if session:
        session.judul = new_title[:100]  # Max 100 chars
        db.session.commit()
    return session

def delete_session(session_id):
    """Hapus sesi (cascade hapus semua pesan)"""
    session = ChatSession.query.get(session_id)
    if session:
        db.session.delete(session)
        db.session.commit()
        return True
    return False

# ========== MESSAGE OPERATIONS ==========

def add_message(session_id, pengirim, isi_pesan):
    """Tambah pesan ke sesi"""
    message = ChatMessage(
        id_sesi=session_id,
        pengirim=pengirim,
        isi_pesan=isi_pesan
    )
    db.session.add(message)
    
    # Update waktu_update sesi
    session = ChatSession.query.get(session_id)
    if session:
        from datetime import datetime
        session.waktu_update = datetime.utcnow()
    
    db.session.commit()
    return message

def get_messages_by_session(session_id):
    """Ambil semua pesan dalam sesi, urutkan kronologis"""
    return ChatMessage.query.filter_by(id_sesi=session_id)\
        .order_by(ChatMessage.waktu.asc()).all()
