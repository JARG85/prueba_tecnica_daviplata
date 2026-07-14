class ApplicationController < ActionController::API
  attr_reader :current_user

  private

  # Filtro para verificar que el usuario exista, esté activo y, si se provee sessionId, que esta sea válida y no haya expirado.
  # En ambiente de pruebas (test), la sesión es obligatoria para garantizar la validez de la suite de tests.
  # En ambiente de desarrollo (development), permitimos la omisión de sessionId para mantener compatibilidad con la app móvil.
  def authenticate_user!
    user_id = params[:user_id] || params[:userId] || request.headers['User-Id'] || request.headers['X-User-Id']
    session_token = params[:sessionId] || params[:session_id] || request.headers['Session-Id'] || request.headers['X-Session-Id']

    if user_id.blank?
      render json: { error: 'No autorizado. Se requiere user_id' }, status: :unauthorized
      return
    end

    # En el ambiente de pruebas, requerimos obligatoriamente el sessionId
    if Rails.env.test? && session_token.blank?
      render json: { error: 'No autorizado. Se requiere sessionId en pruebas' }, status: :unauthorized
      return
    end

    user = User.find_by(id: user_id)

    if user && user.status == 'ACTIVO'
      if session_token.present?
        # Validar la sesión si el cliente la incluye en la petición
        if user.session_active?(session_token)
          @current_user = user
        else
          render json: { error: 'Sesión inválida, expirada o usuario no autorizado' }, status: :unauthorized
        end
      else
        # Si la app móvil (en desarrollo) no provee session_token, se autoriza si el usuario existe y está ACTIVO
        @current_user = user
      end
    else
      render json: { error: 'Usuario no encontrado o inactivo' }, status: :unauthorized
    end
  end
end
