"""
Script untuk membuat akun Admin default
Jalankan dengan: python seed_admin.py
"""
from app import create_app
from app.utils.extensions import db
from app.models.admin_model import Admin
from app.utils.security import hash_password

app = create_app()

def seed_admin():
    with app.app_context():
        # Hapus semua data admin yang ada
        deleted_count = Admin.query.delete()
        db.session.commit()
        print(f"Menghapus {deleted_count} data admin yang ada...")
        
        # Buat admin baru
        admin = Admin(
            nama_lengkap="admin",
            email="admin@example.com",
            kata_sandi=hash_password("admin123"),
            nomor_whatsapp="081234567890"
        )
        
        db.session.add(admin)
        db.session.commit()
        
        print("="*50)
        print("Admin berhasil dibuat!")
        print("="*50)
        print(f"Email    : admin@example.com")
        print(f"Password : admin123")
        print("="*50)
        print("PENTING: Ganti password setelah login pertama!")
        print("="*50)

if __name__ == "__main__":
    seed_admin()
