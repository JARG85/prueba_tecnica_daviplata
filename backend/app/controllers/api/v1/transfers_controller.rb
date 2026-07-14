class Api::V1::TransfersController < ApplicationController
  before_action :authenticate_user!

  def create
    sender = current_user
    amount = params[:amount].to_f
    destination_phone = params[:destination_phone]

    # 2. Monto mayor a cero
    if amount <= 0
      return render json: { error: 'El monto debe ser mayor a cero' }, status: :unprocessable_entity
    end

    # 3. Teléfono destino existente
    receiver = User.find_by(phone: destination_phone)
    if receiver.nil?
      return render json: { error: 'El teléfono destino no existe' }, status: :not_found
    end

    # 4. No transferirse a sí mismo
    if sender.id == receiver.id
      return render json: { error: 'No puedes transferirte a ti mismo' }, status: :unprocessable_entity
    end

    # Procesar la transferencia de forma atómica y protegida contra condiciones de carrera
    begin
      ActiveRecord::Base.transaction do
        # Bloquear filas en orden de ID para evitar deadlocks de concurrencia (SELECT FOR UPDATE)
        ordered_users = User.where(id: [sender.id, receiver.id]).order(:id).lock("FOR UPDATE").to_a
        locked_sender = ordered_users.find { |u| u.id == sender.id }
        locked_receiver = ordered_users.find { |u| u.id == receiver.id }

        # 5. Saldo suficiente (validado bajo bloqueo seguro)
        if locked_sender.balance < amount
          raise "Saldo insuficiente"
        end

        locked_sender.update!(balance: locked_sender.balance - amount)
        locked_receiver.update!(balance: locked_receiver.balance + amount)

        # Registrar movimientos débito y crédito
        locked_sender.movements.create!(
          amount: amount,
          movement_type: 'DEBITO',
          description: "Transferencia enviada a #{locked_receiver.name}",
          status: 'EXITOSO'
        )

        locked_receiver.movements.create!(
          amount: amount,
          movement_type: 'CREDITO',
          description: "Transferencia recibida de #{locked_sender.name}",
          status: 'EXITOSO'
        )
      end

      render json: { message: 'Transferencia realizada con éxito' }, status: :ok
    rescue => e
      if e.message == "Saldo insuficiente"
        render json: { error: 'Saldo insuficiente' }, status: :unprocessable_entity
      else
        render json: { error: 'Error procesando la transacción' }, status: :internal_server_error
      end
    end
  end
end
