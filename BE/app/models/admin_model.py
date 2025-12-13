from ..utils.extensions import db

class Admin(db.Model):
    __tablename__ = 'admin'
    id_admin = db.Column(db.Integer, primary_key=True, autoincrement=True)
    nama_lengkap = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    kata_sandi = db.Column(db.String(255), nullable=False)
    nomor_whatsapp = db.Column(db.String(20), nullable=True)

    def __repr__(self):
        return f"<Admin {self.nama_lengkap}>"