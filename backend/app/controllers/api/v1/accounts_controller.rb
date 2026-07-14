class Api::V1::AccountsController < ApplicationController
  before_action :authenticate_user!

  def balance
    # El current_user ya está autenticado e identificado
    render json: { balance: current_user.balance.to_f }, status: :ok
  end
end
