from flask import Blueprint, request, jsonify
from ..services.student_service import student_login as student_login_service
from ..services.student_service import student_register as student_register_service
from ..services.admin_service import admin_login as admin_login_service
from ..services.admin_service import admin_register as admin_register_service

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

@auth_bp.route('/admin/login', methods=['POST'])
def admin_login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    return admin_login_service(username, password)

@auth_bp.route('/admin/register', methods=['POST'])
def admin_register():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    whatsapp_number = data.get('whatsapp_number') # Gunakan .get()

    return admin_register_service(username, email, password, whatsapp_number)

# --- STUDENT ROUTES ---

@auth_bp.route('/student/login', methods=['POST']) # Tambahkan slash di depan route
def student_login():
    data = request.get_json()
    studentId = data.get('studentId')
    password = data.get('password')
    return student_login_service(studentId, password)

@auth_bp.route('/student/register', methods=['POST'])
def student_register():
    data = request.get_json()

    studentId = data.get('studentId')
    full_name = data.get('fullName')
    email = data.get('email')
    password = data.get('password')
    whatsapp_number = data.get('whatsappNumber') 

    return student_register_service(studentId, full_name, email, password, whatsapp_number)