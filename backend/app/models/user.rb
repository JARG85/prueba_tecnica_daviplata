# app/models/user.rb
class User < ApplicationRecord
  has_secure_password
  
  has_many :movements, dependent: :destroy
  
  validates :name, :phone, presence: true
  validates :phone, uniqueness: true
  validates :status, inclusion: { in: %w[ACTIVO INACTIVO] }
end


