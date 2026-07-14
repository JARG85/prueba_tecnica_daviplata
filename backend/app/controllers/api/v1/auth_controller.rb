class Api::V1::AuthController < ApplicationController
  def login
    # Todos los campos obligatorios obligados por validación inicial
    if params[:phone].blank? || params[:password].blank?
      return render json: { error: 'Todos los campos son obligatorios' }, status: :bad_request
    end

    user = User.find_by(phone: params[:phone])

    # Validar usuario, contraseña y estado ACTIVO
    if user&.authenticate(params[:password]) && user.status == 'ACTIVO'
      expires_at = Time.current + 30.minutes # Configurable para pruebas de expiración
      
      render json: {
        sessionId: SecureRandom.uuid,
        userId: user.id.to_s,
        name: user.name,
        phone: user.phone,
        expiresAt: expires_at.iso8601
      }, status: :ok
    else
      render json: { error: 'Credenciales inválidas o usuario inactivo' }, status: :unauthorized
    end
  end
end
