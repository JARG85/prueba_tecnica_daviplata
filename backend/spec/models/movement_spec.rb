require 'rails_helper'

RSpec.describe Movement, type: :model do
  let(:user) { User.create!(name: 'Juan Pérez', phone: '3001234567', password: '123', status: 'ACTIVO') }

  describe 'validations' do
    it 'is valid with valid attributes' do
      movement = Movement.new(
        user: user,
        amount: 1500.00,
        movement_type: 'DEBITO',
        description: 'Pago de servicio',
        status: 'EXITOSO'
      )
      expect(movement).to be_valid
    end

    it 'is invalid without amount' do
      movement = Movement.new(user: user, movement_type: 'DEBITO', description: 'Pago', status: 'EXITOSO')
      expect(movement).not_to be_valid
    end

    it 'is invalid with amount <= 0' do
      movement = Movement.new(user: user, amount: 0.00, movement_type: 'DEBITO', description: 'Pago', status: 'EXITOSO')
      expect(movement).not_to be_valid
      expect(movement.errors[:amount]).to include("must be greater than 0")
    end

    it 'is invalid with incorrect movement_type' do
      movement = Movement.new(user: user, amount: 100.00, movement_type: 'TRANSFERENCIA', description: 'Pago', status: 'EXITOSO')
      expect(movement).not_to be_valid
      expect(movement.errors[:movement_type]).to include("is not included in the list")
    end
  end
end
