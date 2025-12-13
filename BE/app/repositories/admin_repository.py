from ..utils.extensions import db
from ..utils.extensions import db
from ..models.admin_model import Admin # Tambahkan ini jika belum ada
from ..models.student_model import Student # Tambahkan ini jika belum ada

def get_admin_by_username(username):
    # Mencari berdasarkan nama_lengkap (sesuai DB)
    return Admin.query.filter(Admin.nama_lengkap==username).first()


def create_admin_account(username, email, password, whatsapp_number):
    # Mapping data ke kolom DB
    new_admin = Admin(nama_lengkap=username, email=email, kata_sandi=password, nomor_whatsapp=whatsapp_number)
    db.session.add(new_admin)
    db.session.commit()
    return new_admin


def get_all_students():
    from ..models.student_model import Student 
    return Student.query.all()

def update_student_status(studentId, status):
    from ..models.student_model import Student
    student = Student.query.filter(Student.nomor_induk_mahasiswa==studentId).first()
    if not student:
        return None
    student.status_akun = status
    db.session.commit()