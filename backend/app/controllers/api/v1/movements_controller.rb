class Api::V1::MovementsController < ApplicationController
  before_action :authenticate_user!

  def index
    # Retorna únicamente los movimientos del usuario autenticado
    movements = current_user.movements.order(created_at: :desc)

    render json: movements.map { |m|
      {
        fecha: m.created_at.iso8601,
        tipo: m.movement_type,
        valor: m.amount.to_f,
        descripcion: m.description,
        estado: m.status
      }
    }, status: :ok
  end
end
