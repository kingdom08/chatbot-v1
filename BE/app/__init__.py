from flask import Flask, jsonify
from flask_cors import CORS
from app.utils.config import Config
from app.utils.extensions import db, migrate, bcrypt, jwt
from app.routes.student_routes import student_bp
from app.routes.admin_routes import admin_bp
from app.routes.auth import auth_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    CORS(
        app,
        supports_credentials=True,
        origins=["http://localhost:5173", "http://127.0.0.1:5173"],
        allow_headers=["Content-Type", "Authorization"],
        methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]
    )

    # ✅ INIT EXTENSIONS
    db.init_app(app)
    migrate.init_app(app, db)
    bcrypt.init_app(app)
    jwt.init_app(app)

    # ✅ REGISTER MODELS (WAJIB)
    from app import models

    # JWT handlers
    @jwt.unauthorized_loader
    def unauthorized_callback(error):
        return jsonify(msg="Unauthorized: Token tidak ditemukan"), 401

    @jwt.expired_token_loader
    def expired_callback(jwt_header, jwt_payload):
        return jsonify(msg="Token expired"), 401

    @jwt.invalid_token_loader
    def invalid_token_callback(error):
        return jsonify(msg="Unauthorized: Token invalid"), 422

    # ✅ REGISTER ROUTES
    app.register_blueprint(student_bp)
    app.register_blueprint(admin_bp)
    app.register_blueprint(auth_bp)

    return app
