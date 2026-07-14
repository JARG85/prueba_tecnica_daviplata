# app/models/user.rb
class User < ApplicationRecord
  has_secure_password
  
  has_many :movements, dependent: :destroy
  
  validates :name, :phone, presence: true
  validates :phone, uniqueness: true
  validates :status, inclusion: { in: %w[ACTIVO INACTIVO] }
  
  # Genera una nueva sesión activa para el usuario por 30 minutos
  def generate_session!
    update!(
      session_token: SecureRandom.uuid,
      session_expires_at: 30.minutes.from_now
    )
    session_token
  end

  # Verifica si la sesión actual con un token dado está activa y no ha expirado
  def session_active?(token)
    session_token.present? && session_token == token && session_expires_at&.future?
  end
end
