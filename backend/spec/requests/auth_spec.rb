require 'rails_helper'

RSpec.describe "Auth API", type: :request do
  let!(:user) { User.create!(name: 'Juan Pérez', phone: '3001234567', password: '123', status: 'ACTIVO') }
  let!(:inactive_user) { User.create!(name: 'Usuario Inactivo', phone: '3200000000', password: '123', status: 'INACTIVO') }

  describe "POST /api/v1/auth/login" do
    context "with valid parameters" do
      it "returns a session token and user info" do
        post "/api/v1/auth/login", params: { phone: '3001234567', password: '123' }
        
        expect(response).to have_http_status(:ok)
        json = JSON.parse(response.body)
        expect(json['sessionId']).not_to be_nil
        expect(json['userId']).to eq(user.id.to_s)
        expect(json['name']).to eq('Juan Pérez')
        expect(json['phone']).to eq('3001234567')
        expect(json['expiresAt']).not_to be_nil
        
        # Verify it was saved in DB
        user.reload
        expect(user.session_token).to eq(json['sessionId'])
      end
    end

    context "with blank parameters" do
      it "returns bad request status" do
        post "/api/v1/auth/login", params: { phone: '', password: '' }
        expect(response).to have_http_status(:bad_request)
      end
    end

    context "with invalid password" do
      it "returns unauthorized status" do
        post "/api/v1/auth/login", params: { phone: '3001234567', password: 'wrong' }
        expect(response).to have_http_status(:unauthorized)
      end
    end

    context "with inactive user" do
      it "returns unauthorized status" do
        post "/api/v1/auth/login", params: { phone: '3200000000', password: '123' }
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end
end
