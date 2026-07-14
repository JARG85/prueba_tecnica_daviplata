# app/models/movement.rb
class Movement < ApplicationRecord
  belongs_to :user
  
  validates :amount, :movement_type, :description, :status, presence: true
  validates :amount, numericality: { greater_than: 0 }
  validates :movement_type, inclusion: { in: %w[DEBITO CREDITO] }
end
