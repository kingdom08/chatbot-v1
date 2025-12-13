from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity # <<< PERBAIKAN: Import get_jwt_identity
from ..utils.decorators import admin_required
from ..services.admin_service import admin_update_account, admin_get_profile, admin_list_students, admin_get_student_detail,admin_update_student_status

admin_bp = Blueprint('admin', __name__, url_prefix='/api/admin')

@admin_bp.route('/profile', methods=['GET'])
@jwt_required()
@admin_required
def profile():
    # PERBAIKAN: Ambil ID Admin dari Token, bukan body request
    adminId = get_jwt_identity() 
    
    return admin_get_profile(adminId)

@admin_bp.route('/profile', methods=['PATCH']) 
@jwt_required()
@admin_required
def update_profile():
    adminId = get_jwt_identity() # Ambil ID Admin dari Token
    data = request.get_json()
    
    # MAPPING data dari Frontend ke nama kolom DB/Service
    # Frontend mungkin mengirim 'nama_lengkap', 'email', 'nomor_whatsapp', dll.
    nama_lengkap = data.get('nama_lengkap')
    email = data.get('email')
    password = data.get('password')
    nomor_whatsapp = data.get('nomor_whatsapp') 

    # Kirim ID Admin dan data yang sudah di-mapping ke service
    return admin_update_account(adminId, nama_lengkap, email, password, nomor_whatsapp)

@admin_bp.route('/students', methods=['GET'])
@jwt_required()
@admin_required
def list_students():
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)

    return admin_list_students()

@admin_bp.route('/students/<int:student_id>', methods=['GET'])
@jwt_required()
def get_student_detail(student_id): 
    return admin_get_student_detail(student_id)


@admin_bp.route('/students/<int:student_id>', methods=['PATCH'])
@jwt_required()
@admin_required
def update_student_status(student_id):
    data = request.get_json()
    status = data.get('status')

    return admin_update_student_status(student_id, status)