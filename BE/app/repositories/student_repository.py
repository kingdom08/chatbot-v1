from ..utils.extensions import db


def get_student_by_student_id(studentId):
    from ..models.student_model import Student
    return Student.query.filter(Student.nomor_induk_mahasiswa==studentId).first()

def create_student_account(studentId, full_name, email, password, whatsapp_number):
    from ..models.student_model import Student
    new_student = Student(nomor_induk_mahasiswa=studentId, nama_lengkap=full_name, email=email, kata_sandi=password, nomor_whatsapp=whatsapp_number)
    new_student.status_akun = "Menunggu"
    db.session.add(new_student)
    db.session.commit()
    return new_student

def update_student_account(studentId, full_name=None, email=None, password=None, whatsapp_number=None):
    from ..models.student_model import Student
    student = get_student_by_student_id(studentId)
    if not student:
        return None

    if full_name:
        student.nama_lengkap = full_name
    if email:
        student.email = email
    if password:
        student.kata_sandi = password
    if whatsapp_number:
        student.nomor_whatsapp = whatsapp_number

    db.session.commit()
    return student