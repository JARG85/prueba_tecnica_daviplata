class Api::V1::AuthController < ApplicationController
  def login
    # Todos los campos obligatorios obligados por validación inicial
    if params[:phone].blank? || params[:password].blank?[cite: 1]
      return render json: { error: 'Todos los campos son obligatorios' }, status: :bad_request[cite: 1]
    end

    user = User.find_by(phone: params[:phone])

    # Validar usuario, contraseña y estado ACTIVO
    if user&.authenticate(params[:password]) && user.status == 'ACTIVO'[cite: 1]
      expires_at = Time.current + 30.minutes # Configurable para pruebas de expiración
      
      render json: {
        sessionId: SecureRandom.uuid,[cite: 1]
        userId: user.id.to_s,[cite: 1]
        name: user.name,[cite: 1]
        phone: user.phone,[cite: 1]
        expiresAt: expires_at.iso8601[cite: 1]
      }, status: :ok
    else
      render json: { error: 'Credenciales inválidas o usuario inactivo' }, status: :unauthorized[cite: 1]
    end
  end
end
