# app/models/user.rb
class User < ApplicationRecord
  has_secure_password[cite: 1]
  
  has_many :movements, dependent: :destroy[cite: 1]
  
  validates :name, :phone, presence: true[cite: 1]
  validates :phone, uniqueness: true[cite: 1]
  validates :status, inclusion: { in: %w[ACTIVO INACTIVO] }[cite: 1]
end


