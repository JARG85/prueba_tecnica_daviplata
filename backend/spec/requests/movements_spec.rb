require 'rails_helper'

RSpec.describe "Movements API", type: :request do
  let!(:user) { User.create!(name: 'Juan Pérez', phone: '3001234567', password: '123', status: 'ACTIVO', balance: 50000.00) }
  let!(:session_token) { user.generate_session! }
  
  before do
    user.movements.create!(amount: 15000.00, movement_type: 'CREDITO', description: 'Depósito inicial', status: 'EXITOSO')
    user.movements.create!(amount: 5000.00, movement_type: 'DEBITO', description: 'Transferencia a Maria', status: 'EXITOSO')
  end

  describe "GET /api/v1/movements" do
    context "with authenticated session" do
      it "returns the list of movements mapped correctly" do
        get "/api/v1/movements", params: { user_id: user.id, sessionId: session_token }
        
        expect(response).to have_http_status(:ok)
        json = JSON.parse(response.body)
        expect(json.length).to eq(2)
        
        first_movement = json.first # Ordenado desc
        expect(first_movement['tipo']).to eq('DEBITO')
        expect(first_movement['valor']).to eq(5000.0)
        expect(first_movement['descripcion']).to eq('Transferencia a Maria')
        expect(first_movement['estado']).to eq('EXITOSO')
        expect(first_movement['fecha']).not_to be_nil
      end
    end

    context "without authorization" do
      it "denies access" do
        get "/api/v1/movements", params: { user_id: user.id }
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end
end
