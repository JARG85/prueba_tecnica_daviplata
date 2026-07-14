require 'rails_helper'

RSpec.describe "Transfers API", type: :request do
  let!(:sender) { User.create!(name: 'Juan Pérez', phone: '3001234567', password: '123', status: 'ACTIVO', balance: 1000.00) }
  let!(:receiver) { User.create!(name: 'Maria Gomez', phone: '3109876543', password: '123', status: 'ACTIVO', balance: 500.00) }
  let!(:session_token) { sender.generate_session! }

  describe "POST /api/v1/transfers" do
    context "with valid parameters" do
      it "performs the transfer, updates balances and creates movements" do
        post "/api/v1/transfers", params: {
          user_id: sender.id,
          sessionId: session_token,
          amount: 200.00,
          destination_phone: '3109876543'
        }

        expect(response).to have_http_status(:ok)
        expect(JSON.parse(response.body)['message']).to eq('Transferencia realizada con éxito')

        sender.reload
        receiver.reload

        # Check balances
        expect(sender.balance).to eq(800.00)
        expect(receiver.balance).to eq(700.00)

        # Check movements
        expect(sender.movements.count).to eq(1)
        sender_movement = sender.movements.first
        expect(sender_movement.amount).to eq(200.00)
        expect(sender_movement.movement_type).to eq('DEBITO')
        expect(sender_movement.description).to eq("Transferencia enviada a Maria Gomez")

        expect(receiver.movements.count).to eq(1)
        receiver_movement = receiver.movements.first
        expect(receiver_movement.amount).to eq(200.00)
        expect(receiver_movement.movement_type).to eq('CREDITO')
        expect(receiver_movement.description).to eq("Transferencia recibida de Juan Pérez")
      end
    end

    context "with invalid parameters" do
      it "fails when not authenticated" do
        post "/api/v1/transfers", params: {
          user_id: sender.id,
          sessionId: 'wrong-token',
          amount: 200.00,
          destination_phone: '3109876543'
        }
        expect(response).to have_http_status(:unauthorized)
      end

      it "fails when amount is zero or negative" do
        post "/api/v1/transfers", params: {
          user_id: sender.id,
          sessionId: session_token,
          amount: 0.00,
          destination_phone: '3109876543'
        }
        expect(response).to have_http_status(:unprocessable_entity)
        expect(JSON.parse(response.body)['error']).to eq('El monto debe ser mayor a cero')
      end

      it "fails when destination phone does not exist" do
        post "/api/v1/transfers", params: {
          user_id: sender.id,
          sessionId: session_token,
          amount: 100.00,
          destination_phone: '3555555555'
        }
        expect(response).to have_http_status(:not_found)
        expect(JSON.parse(response.body)['error']).to eq('El teléfono destino no existe')
      end

      it "fails when trying to transfer to self" do
        post "/api/v1/transfers", params: {
          user_id: sender.id,
          sessionId: session_token,
          amount: 100.00,
          destination_phone: '3001234567'
        }
        expect(response).to have_http_status(:unprocessable_entity)
        expect(JSON.parse(response.body)['error']).to eq('No puedes transferirte a ti mismo')
      end

      it "fails when balance is insufficient" do
        post "/api/v1/transfers", params: {
          user_id: sender.id,
          sessionId: session_token,
          amount: 2000.00,
          destination_phone: '3109876543'
        }
        expect(response).to have_http_status(:unprocessable_entity)
        expect(JSON.parse(response.body)['error']).to eq('Saldo insuficiente')
      end
    end
  end
end
