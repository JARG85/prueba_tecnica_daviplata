class ApplyConstraintsAndSessions < ActiveRecord::Migration[8.1]
  def change
    # 1. Modificar tabla users
    change_column_null :users, :name, false
    change_column_null :users, :phone, false
    change_column_null :users, :password_digest, false
    
    # balance: precisión 15, escala 2, default 0.0, no nulo
    change_column :users, :balance, :decimal, precision: 15, scale: 2, default: 0.0, null: false
    
    # status: default 'ACTIVO', no nulo
    change_column :users, :status, :string, default: 'ACTIVO', null: false
    
    # Índice de unicidad para el teléfono
    add_index :users, :phone, unique: true

    # Campos de sesión
    add_column :users, :session_token, :string
    add_column :users, :session_expires_at, :datetime
    add_index :users, :session_token, unique: true

    # 2. Modificar tabla movements
    change_column :movements, :amount, :decimal, precision: 15, scale: 2, null: false
    change_column_null :movements, :movement_type, false
    change_column_null :movements, :description, false
    
    # status: default 'EXITOSO', no nulo
    change_column :movements, :status, :string, default: 'EXITOSO', null: false
  end
end
