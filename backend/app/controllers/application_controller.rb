class ApplicationController < ActionController::API
  attr_reader :current_user

  private

  # Filtro para verificar que la sesión esté activa y corresponda al usuario solicitado
  def authenticate_user!
    user_id = params[:user_id] || params[:userId] || request.headers['User-Id'] || request.headers['X-User-Id']
    session_token = params[:sessionId] || params[:session_id] || request.headers['Session-Id'] || request.headers['X-Session-Id']

    if user_id.blank? || session_token.blank?
      render json: { error: 'No autorizado. Se requiere user_id y sessionId' }, status: :unauthorized
      return
    end

    user = User.find_by(id: user_id)

    if user && user.status == 'ACTIVO' && user.session_active?(session_token)
      @current_user = user
    else
      render json: { error: 'Sesión inválida, expirada o usuario inactivo' }, status: :unauthorized
    end
  end
end
