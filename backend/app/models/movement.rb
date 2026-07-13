# app/models/movement.rb
class Movement < ApplicationRecord
  belongs_to :user[cite: 1]
  
  validates :amount, :movement_type, :description, :status, presence: true[cite: 1]
  validates :movement_type, inclusion: { in: %w[DEBITO CREDITO] }[cite: 1]
end
