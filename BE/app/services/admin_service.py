from flask_jwt_extended import create_access_token
from ..repositories.admin_repository import get_admin_by_username, create_admin_account, update_student_status
from ..utils.security import verify_password, hash_password
from datetime import timedelta
from ..repositories.admin_repository import get_all_students
from ..repositories.student_repository import get_student_by_student_id   
from flask import jsonify

def admin_login(username, password):
    admin = get_admin_by_username(username)
    if not admin or not verify_password(password, admin.kata_sandi):
        return {
            "msg": "Invalid username or password"
        }, 401
    
    token = create_access_token(
        identity=str(admin.nama_lengkap),
        additional_claims={"role": "Admin"},
        expires_delta=timedelta(hours=24)
    )

    return jsonify({ # <<< PERBAIKAN: Gunakan jsonify
         "msg": "success",
        "access_token": token, # PERBAIKAN: Gunakan 'access_token' untuk konsistensi frontend
        "role": "admin", # lowercase untuk sinkronisasi dengan FE
        "id_admin": admin.id_admin, # Tambahkan ID admin
        "email": admin.email, # WAJIB: Kirim email untuk disimpan frontend
        "nama_lengkap": admin.nama_lengkap # WAJIB: Kirim nama lengkap untuk disimpan frontend
    }), 200

def admin_register(username, email, password, whatsapp_number):
    if get_admin_by_username(username):
        return {"msg": "username already exists"}, 400
    hashed_password = hash_password(password)
    create_admin_account(username, email, hashed_password, whatsapp_number)
    return {"msg": "Admin registered successfully"}, 201

def admin_update_account(username, email=None, password=None, whatsapp_number=None):
    admin = update_admin_account(username, email, password, whatsapp_number)
    if not admin:
        return {
            "msg": "Admin not found"
        }, 404

    return {
        "msg": "Admin account updated successfully"
    }, 200

def admin_get_profile(adminId): 
    admin = get_admin_by_username(adminId)
    if not admin:
        return {
            "msg": "Admin not found"
        }, 404

    admin_data = {
        "username": admin.nama_lengkap,
        "email": admin.email,
        "whatsappNumber": admin.nomor_whatsapp,
        "password": admin.kata_sandi
    }

    return {
        "msg": "success",
        "admin": admin_data
    }, 200

def admin_list_students():
    students = get_all_students()
    student_list = []
    for student in students:
        student_data = {
            "studentId": student.nomor_induk_mahasiswa,
            "fullName": student.nama_lengkap,
            "email": student.email,
            "whatsappNumber": student.nomor_whatsapp,
            "accountStatus": student.status_akun
        }
        student_list.append(student_data)

    return {
        "msg": "success",
        "students": student_list
    }, 200

def admin_get_student_detail(studentId):
    student = get_student_by_student_id(studentId)
    if not student:
        return {
            "msg": "Student not found"
        }, 404

    student_data = {
        "studentId": student.nomor_induk_mahasiswa,
        "fullName": student.nama_lengkap,
        "email": student.email,
        "whatsappNumber": student.nomor_whatsapp,
        "accountStatus": student.status_akun,
        "password": student.kata_sandi
    }

    return {
        "msg": "success",
        "student": student_data
    }, 200

def admin_update_student_status(studentId, status):
    student = update_student_status(studentId, status)
    if not student:
        return {
            "msg": "Student not found"
        }, 404

    return {
        "msg": "Student account status updated successfully"
    }, 200