require 'rails_helper'

RSpec.describe User, type: :model do
  describe 'validations' do
    it 'is valid with valid attributes' do
      user = User.new(
        name: 'Juan Pérez',
        phone: '3001234567',
        password: '123',
        status: 'ACTIVO',
        balance: 50000.00
      )
      expect(user).to be_valid
    end

    it 'is invalid without a name' do
      user = User.new(phone: '3001234567', password: '123')
      expect(user).not_to be_valid
      expect(user.errors[:name]).to include("can't be blank")
    end

    it 'is invalid without a phone' do
      user = User.new(name: 'Juan Pérez', password: '123')
      expect(user).not_to be_valid
      expect(user.errors[:phone]).to include("can't be blank")
    end

    it 'enforces uniqueness of phone' do
      User.create!(name: 'Juan', phone: '3001234567', password: '123')
      duplicate = User.new(name: 'Pedro', phone: '3001234567', password: '123')
      expect(duplicate).not_to be_valid
      expect(duplicate.errors[:phone]).to include("has already been taken")
    end

    it 'validates status is inclusion of ACTIVO or INACTIVO' do
      user = User.new(name: 'Juan', phone: '3001234567', password: '123', status: 'INVALIDO')
      expect(user).not_to be_valid
      expect(user.errors[:status]).to include("is not included in the list")
    end
  end

  describe 'session helpers' do
    let(:user) { User.create!(name: 'Juan', phone: '3001234567', password: '123', status: 'ACTIVO') }

    it 'generates a session token and sets expiration' do
      token = user.generate_session!
      expect(token).not_to be_nil
      expect(user.session_token).to eq(token)
      expect(user.session_expires_at).to be > Time.current
    end

    it 'verifies active session correctly' do
      token = user.generate_session!
      expect(user.session_active?(token)).to be true
      expect(user.session_active?('wrong-token')).to be false
    end

    it 'detects expired session' do
      token = user.generate_session!
      user.update!(session_expires_at: 1.minute.ago)
      expect(user.session_active?(token)).to be false
    end
  end
end
