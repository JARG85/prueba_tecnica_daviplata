class Api::V1::TransfersController < ApplicationController
  def create
    sender = User.find_by(id: params[:user_id])
    amount = params[:amount].to_f
    destination_phone = params[:destination_phone]

    # 1. Validar usuario autenticado
    return render json: { error: 'Usuario no autorizado' }, status: :unauthorized unless sender

    # 2. Monto mayor a cero
    return render json: { error: 'El monto debe ser mayor a cero' }, status: :unprocessable_entity if amount <= 0

    # 3. Teléfono destino existente
    receiver = User.find_by(phone: destination_phone)
    return render json: { error: 'El teléfono destino no existe' }, status: :not_found unless receiver

    # 4. No transferirse a sí mismo
    return render json: { error: 'No puedes transferirte a ti mismo' }, status: :unprocessable_entity if sender.id == receiver.id

    # 5. Saldo suficiente
    return render json: { error: 'Saldo insuficiente' }, status: :unprocessable_entity if sender.balance < amount

    # Procesar la transferencia atómicamente
    ActiveRecord::Base.transaction do
      sender.update!(balance: sender.balance - amount)
      receiver.update!(balance: receiver.balance + amount)

      # Registrar movimientos débito/crédito
      sender.movements.create!(
        amount: amount,
        movement_type: 'DEBITO',
        description: "Transferencia enviada a #{receiver.name}",
        status: 'EXITOSO'
      )

      receiver.movements.create!(
        amount: amount,
        movement_type: 'CREDITO',
        description: "Transferencia recibida de #{sender.name}",
        status: 'EXITOSO'
      )
    end

    render json: { message: 'Transferencia realizada con éxito' }, status: :ok
  rescue => e
    render json: { error: 'Error procesando la transacción' }, status: :internal_server_error
  end
end
