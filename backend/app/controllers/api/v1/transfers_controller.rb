class Api::V1::TransfersController < ApplicationController
  def create
    sender = User.find_by(id: params[:user_id])[cite: 1]
    amount = params[:amount].to_f[cite: 1]
    destination_phone = params[:destination_phone][cite: 1]

    # 1. Validar usuario autenticado
    return render json: { error: 'Usuario no autorizado' }, status: :unauthorized unless sender[cite: 1]

    # 2. Monto mayor a cero
    return render json: { error: 'El monto debe ser mayor a cero' }, status: :unprocessable_entity if amount <= 0[cite: 1]

    # 3. Teléfono destino existente
    receiver = User.find_by(phone: destination_phone)[cite: 1]
    return render json: { error: 'El teléfono destino no existe' }, status: :not_found unless receiver[cite: 1]

    # 4. No transferirse a sí mismo
    return render json: { error: 'No puedes transferirte a ti mismo' }, status: :unprocessable_entity if sender.id == receiver.id[cite: 1]

    # 5. Saldo suficiente
    return render json: { error: 'Saldo insuficiente' }, status: :unprocessable_entity if sender.balance < amount[cite: 1]

    # Procesar la transferencia atómicamente
    ActiveRecord::Base.transaction do
      sender.update!(balance: sender.balance - amount)[cite: 1]
      receiver.update!(balance: receiver.balance + amount)[cite: 1]

      # Registrar movimientos débito/crédito
      sender.movements.create!(
        amount: amount,
        movement_type: 'DEBITO',[cite: 1]
        description: "Transferencia enviada a #{receiver.name}",[cite: 1]
        status: 'EXITOSO'[cite: 1]
      )

      receiver.movements.create!(
        amount: amount,
        movement_type: 'CREDITO',[cite: 1]
        description: "Transferencia recibida de #{sender.name}",[cite: 1]
        status: 'EXITOSO'[cite: 1]
      )
    end

    render json: { message: 'Transferencia realizada con éxito' }, status: :ok[cite: 1]
  rescue => e
    render json: { error: 'Error procesando la transacción' }, status: :internal_server_error
  end
end
