class Api::V1::AuthController < ApplicationController
  def login
    if params[:phone].blank? || params[:password].blank?
      return render json: { error: 'Todos los campos son obligatorios' }, status: :bad_request
    end

    user = User.find_by(phone: params[:phone])

    if user&.authenticate(params[:password]) && user.status == 'ACTIVO'
      # Generar y guardar la sesión persistente
      session_id = user.generate_session!
      
      render json: {
        sessionId: session_id,
        userId: user.id.to_s,
        name: user.name,
        phone: user.phone,
        expiresAt: user.session_expires_at.iso8601
      }, status: :ok
    else
      render json: { error: 'Credenciales inválidas o usuario inactivo' }, status: :unauthorized
    end
  end
end
