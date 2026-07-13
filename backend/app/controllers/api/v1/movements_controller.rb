class Api::V1::MovementsController < ApplicationController
  def index
    user = User.find(params[:user_id])[cite: 1]
    # Muestra solo movimientos del usuario autenticado
    movements = user.movements.order(created_at: :desc)[cite: 1]

    render json: movements.map { |m|
      {
        fecha: m.created_at.iso8601,[cite: 1]
        tipo: m.movement_type,[cite: 1]
        valor: m.amount.to_f,[cite: 1]
        descripcion: m.description,[cite: 1]
        estado: m.status[cite: 1]
      }
    }, status: :ok
  rescue ActiveRecord::RecordNotFound
    render json: { error: 'Usuario no encontrado' }, status: :not_found
  end
end
