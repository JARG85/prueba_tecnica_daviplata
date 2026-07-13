class Api::V1::AccountsController < ApplicationController
  def balance
    user = User.find(params[:user_id]) # Pasado por el Header o Parámetro desde Android
    render json: { balance: user.balance }, status: :ok[cite: 1]
  rescue ActiveRecord::RecordNotFound
    render json: { error: 'Usuario no encontrado' }, status: :not_found
  end
end
