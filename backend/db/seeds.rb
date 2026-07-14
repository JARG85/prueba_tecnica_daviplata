# Limpiar datos previos
puts "Limpiando base de datos..."
Movement.destroy_all
User.destroy_all

# Clave por defecto más sencilla para todos los usuarios de prueba
DEFAULT_PASSWORD = "pass12345"

# ==============================================================================
# 1. SEMILLA DE USUARIOS
# ==============================================================================
puts "Creando usuarios de prueba..."

users = {}

users[:juan] = User.create!(
  name: 'Juan Pérez',
  phone: '3001234567',
  password: DEFAULT_PASSWORD,
  status: 'ACTIVO',
  balance: 50000.00
)

users[:maria] = User.create!(
  name: 'Maria Gomez',
  phone: '3109876543',
  password: DEFAULT_PASSWORD,
  status: 'ACTIVO',
  balance: 10000.00
)

users[:carlos] = User.create!(
  name: 'Carlos Rojas',
  phone: '3111111111',
  password: DEFAULT_PASSWORD,
  status: 'ACTIVO',
  balance: 25000.00
)

users[:ana] = User.create!(
  name: 'Ana Silva',
  phone: '3122222222',
  password: DEFAULT_PASSWORD,
  status: 'ACTIVO',
  balance: 5000.00
)

users[:luis] = User.create!(
  name: 'Luis Torres',
  phone: '3133333333',
  password: DEFAULT_PASSWORD,
  status: 'ACTIVO',
  balance: 0.00
)

users[:inactivo] = User.create!(
  name: 'Usuario Inactivo',
  phone: '3200000000',
  password: DEFAULT_PASSWORD,
  status: 'INACTIVO',
  balance: 0.00
)

puts "Usuarios creados con éxito: #{User.count} usuarios registrados."

# ==============================================================================
# 2. SEMILLA DE MOVIMIENTOS
# ==============================================================================
puts "Creando historial de movimientos..."

# Movimientos para Juan Pérez
users[:juan].movements.create!([
  { amount: 15000.00, movement_type: 'CREDITO', description: 'Depósito inicial de apertura', status: 'EXITOSO', created_at: 5.days.ago },
  { amount: 5000.00, movement_type: 'DEBITO', description: 'Transferencia enviada a Maria Gomez', status: 'EXITOSO', created_at: 3.days.ago }
])

# Movimientos para Maria Gomez
users[:maria].movements.create!([
  { amount: 5000.00, movement_type: 'CREDITO', description: 'Transferencia recibida de Juan Pérez', status: 'EXITOSO', created_at: 3.days.ago },
  { amount: 2000.00, movement_type: 'DEBITO', description: 'Transferencia enviada a Carlos Rojas', status: 'EXITOSO', created_at: 2.days.ago }
])

# Movimientos para Carlos Rojas
users[:carlos].movements.create!([
  { amount: 2000.00, movement_type: 'CREDITO', description: 'Transferencia recibida de Maria Gomez', status: 'EXITOSO', created_at: 2.days.ago },
  { amount: 1000.00, movement_type: 'CREDITO', description: 'Carga de saldo por corresponsal', status: 'EXITOSO', created_at: 1.day.ago }
])

# Movimientos para Ana Silva
users[:ana].movements.create!([
  { amount: 5000.00, movement_type: 'CREDITO', description: 'Carga de saldo inicial', status: 'EXITOSO', created_at: 4.days.ago }
])

puts "Movimientos creados con éxito: #{Movement.count} movimientos registrados."
