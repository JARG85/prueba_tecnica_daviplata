class Api::V1::MovementsController < ApplicationController
  def index
    user = User.find(params[:user_id])
    # Muestra solo movimientos del usuario autenticado
    movements = user.movements.order(created_at: :desc)

    render json: movements.map { |m|
      {
        fecha: m.created_at.iso8601,
        tipo: m.movement_type,
        valor: m.amount.to_f,
        descripcion: m.description,
        estado: m.status
      }
    }, status: :ok
  rescue ActiveRecord::RecordNotFound
    render json: { error: 'Usuario no encontrado' }, status: :not_found
  end
end
