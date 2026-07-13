# Limpiar datos previos
Movement.destroy_all[cite: 1]
User.destroy_all[cite: 1]

# Crear usuarios de prueba obligatorios
user1 = User.create!(
  name: 'Juan Pérez',[cite: 1]
  phone: '3001234567',[cite: 1]
  password: 'password123',[cite: 1]
  status: 'ACTIVO',[cite: 1]
  balance: 50000.00[cite: 1] # Saldo inicial controlado
)

user2 = User.create!(
  name: 'Maria Gomez',[cite: 1]
  phone: '3109876543',[cite: 1]
  password: 'password123',[cite: 1]
  status: 'ACTIVO',[cite: 1]
  balance: 1000.00[cite: 1]
)

# Usuario inactivo para pruebas de fallo de login
User.create!(
  name: 'Usuario Inactivo',[cite: 1]
  phone: '3200000000',[cite: 1]
  password: 'password123',[cite: 1]
  status: 'INACTIVO'[cite: 1]
)

puts "Seeds cargados con éxito: Juan (3001234567) y Maria (3109876543) creados."
