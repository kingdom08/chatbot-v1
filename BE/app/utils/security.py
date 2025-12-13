from .extensions import bcrypt
def hash_password(password: str) -> str:
    return bcrypt.generate_password_hash(password).decode('utf-8')

def verify_password(plain_password: str, hash_password: str)-> bool:
    return bcrypt.check_password_hash(hash_password, plain_password)