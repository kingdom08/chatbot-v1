from ..repositories.student_repository import (
    get_student_by_student_id, create_student_account, update_student_account)
from ..utils.security import hash_password, verify_password
from flask_jwt_extended import create_access_token
from datetime import timedelta
from flask import jsonify


def student_register(studentId, full_name, email, password, whatsapp_number):
    if get_student_by_student_id(studentId):
        return {"msg": "student ID already exists"}, 400
    hashed_password = hash_password(password)
    create_student_account(studentId, full_name, email, hashed_password, whatsapp_number)
    return {"msg": "User registered succesfully"}, 201
    
def student_login(studentId, password):
    student = get_student_by_student_id(studentId)
    
    # 1. Cek User & Password
    if not student or not verify_password(password, student.kata_sandi):
        return {
            "msg": "Invalid username or password"
        }, 401

    if student.status_akun != "Aktif":
        return {
            "msg": f"Status akun '{student.status_akun}'. Silahkan menunggu akun diaktifkan atau coba hubungi admin."
        }, 403

    token = create_access_token(
        identity=str(student.nomor_induk_mahasiswa),
        additional_claims={"role": "Student"},
        expires_delta=timedelta(hours=24)
    )
    # ... return jsonify success ...

    return jsonify({ # <<< HARUS DIUBAH KE jsonify
        "msg": "success",
        "token": token,
        "role": "Student",
        
        # >>> INI DATA YANG HILANG DAN HARUS DITAMBAHKAN <<<
        "nomor_induk_mahasiswa": student.nomor_induk_mahasiswa,
        "nama_lengkap": student.nama_lengkap
        # ----------------------------------------------------
    }), 200

def get_student_profile(studentId): 
    student = get_student_by_student_id(studentId)
    if not student:

        return jsonify({
        "msg": "Student not found"
         }), 404 # Perbaikan 1: Gunakan jsonify

    student_data = {
        "studentId": student.nomor_induk_mahasiswa,
        "fullName": student.nama_lengkap,
        "email": student.email,
        "whatsappNumber": student.nomor_whatsapp,
        "accountStatus": student.status_akun,
        "password": student.kata_sandi
    }

    return jsonify({ # Perbaikan 2: Gunakan jsonify
         "msg": "success",
        "student": student_data
     }), 200

def update_student_account(studentId, full_name=None, email=None, password=None, whatsapp_number=None):
    student = update_student_account(studentId, full_name, email, password, whatsapp_number)
    if not student:
        return {
            "msg": "Student not found"
        }, 404

    return {
        "msg": "Student account updated successfully"
    }, 200
        