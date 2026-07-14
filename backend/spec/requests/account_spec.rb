require 'rails_helper'

RSpec.describe "Account API", type: :request do
  let!(:user) { User.create!(name: 'Juan Pérez', phone: '3001234567', password: '123', status: 'ACTIVO', balance: 50000.00) }
  let!(:session_token) { user.generate_session! }

  describe "GET /api/v1/account/balance" do
    context "with authenticated session" do
      it "returns the user balance when passed via params" do
        get "/api/v1/account/balance", params: { user_id: user.id, sessionId: session_token }
        
        expect(response).to have_http_status(:ok)
        json = JSON.parse(response.body)
        expect(json['balance']).to eq(50000.0)
      end

      it "returns the user balance when passed via headers" do
        headers = { 'User-Id' => user.id.to_s, 'Session-Id' => session_token }
        get "/api/v1/account/balance", headers: headers
        
        expect(response).to have_http_status(:ok)
        json = JSON.parse(response.body)
        expect(json['balance']).to eq(50000.0)
      end
    end

    context "with unauthenticated session" do
      it "returns unauthorized status" do
        get "/api/v1/account/balance", params: { user_id: user.id, sessionId: 'wrong-token' }
        expect(response).to have_http_status(:unauthorized)
      end

      it "returns unauthorized when session is missing" do
        get "/api/v1/account/balance", params: { user_id: user.id }
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end
end
