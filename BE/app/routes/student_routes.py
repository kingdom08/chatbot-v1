from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..utils.model import model, vectorizer, df
from ..utils.preprocessing import clean_text
from sklearn.metrics.pairwise import cosine_similarity
from ..utils.decorators import student_required
from ..services.student_service import get_student_profile, update_student_account
from ..services.chat_service import (
    create_new_session,
    get_all_sessions,
    get_session_detail,
    delete_session_by_id,
    save_chat_message,
    rename_session
)
from ..repositories.chat_repository import create_session

student_bp = Blueprint('student', __name__, url_prefix='/api/student')

# ========== SESSION ROUTES ==========

@student_bp.route('/session', methods=['POST'])
@jwt_required()
@student_required
def new_session():
    """Buat sesi chat baru"""
    student_id = get_jwt_identity()
    return create_new_session(student_id)

@student_bp.route('/sessions', methods=['GET'])
@jwt_required()
@student_required
def list_sessions():
    """Daftar semua sesi chat user"""
    student_id = get_jwt_identity()
    return get_all_sessions(student_id)

@student_bp.route('/session/<int:session_id>', methods=['GET'])
@jwt_required()
@student_required
def session_detail(session_id):
    """Ambil detail sesi beserta semua pesan"""
    student_id = get_jwt_identity()
    return get_session_detail(session_id, student_id)

@student_bp.route('/session/<int:session_id>', methods=['DELETE'])
@jwt_required()
@student_required
def remove_session(session_id):
    """Hapus sesi chat"""
    student_id = get_jwt_identity()
    return delete_session_by_id(session_id, student_id)

@student_bp.route('/session/<int:session_id>', methods=['PATCH'])
@jwt_required()
@student_required
def update_session(session_id):
    """Rename judul sesi"""
    student_id = get_jwt_identity()
    data = request.get_json()
    new_title = data.get('judul', '')
    if not new_title:
        return jsonify({"msg": "Judul tidak boleh kosong"}), 400
    return rename_session(session_id, student_id, new_title)

# ========== CHAT ROUTE ==========

@student_bp.route('/chat', methods=['POST'])
@jwt_required()
@student_required
def predict():
    """Kirim pesan chat ke bot"""
    data = request.get_json()
    user_input = data.get('message', '')
    session_id = data.get('session_id')
    student_id = get_jwt_identity()

    if not user_input:
        return jsonify({'response': 'Input tidak boleh kosong'}), 400

    # Jika tidak ada session_id, buat sesi baru
    if not session_id:
        new_session = create_session(student_id)
        session_id = new_session.id_sesi

    user_clean = clean_text(user_input)
    
    if not user_clean:
        return jsonify({'response': 'Maaf, saya tidak mengerti maksud Anda.', 'session_id': session_id})

    user_vec = vectorizer.transform([user_clean])
    pred_intent = model.predict(user_vec)[0]

    subset = df[df['Kategori'] == pred_intent]

    if subset.empty:
        final_response = 'Maaf, saya belum punya jawaban spesifik untuk topik ini.'
        save_chat_message(session_id, student_id, user_input, final_response, pred_intent)
        return jsonify({
            'intent': pred_intent, 
            'response': final_response,
            'session_id': session_id
        })

    subset_vec = vectorizer.transform(subset['clean_pertanyaan'])
    similarities = cosine_similarity(user_vec, subset_vec)
    max_similarity = float(similarities.max())

    if max_similarity < 0.2:
        final_response = 'Maaf, pertanyaan kurang jelas. Bisa diperjelas?'
        save_chat_message(session_id, student_id, user_input, final_response, 'unknown')
        return jsonify({
            'intent': 'unknown',
            'response': final_response,
            'session_id': session_id
        })

    best_idx = similarities.argmax()
    final_response = subset.iloc[best_idx]['Jawaban']
    
    # Simpan pesan ke sesi
    save_chat_message(session_id, student_id, user_input, final_response, pred_intent)

    return jsonify({
        'intent': pred_intent, 
        'response': final_response,
        'session_id': session_id
    })

# ========== PROFILE ROUTES ==========

@student_bp.route('/profile', methods=['GET'])
@jwt_required()
@student_required
def profile():
    studentId = get_jwt_identity()
    return get_student_profile(studentId)

@student_bp.route('/profile', methods=['PATCH'])
@jwt_required()
@student_required
def update_account():
    studentId = get_jwt_identity()
    data = request.get_json()
    studentId = data.get('studentId')
    full_name = data.get('fullName')
    email = data.get('email')
    password = data.get('password')
    whatsapp_number = data.get('whatsappNumber')

    return update_student_account(studentId, full_name, email, password, whatsapp_number)