# 🏦 DaviPlata - Backend API (Ruby on Rails)

Este proyecto corresponde al desarrollo del backend para la prueba técnica de **DaviPlata**. Consiste en una API pura (`--api`) en Ruby on Rails que expone los endpoints necesarios para el manejo de autenticación de usuarios, consultas de saldo, visualización de movimientos y transferencias atómicas de dinero en tiempo real, integrándose de forma segura con un cliente móvil Android nativo y React Native.

---

## 🛠️ 1. Stack Tecnológico

* **Lenguaje:** Ruby 3.4.1 (definido en [.ruby-version](file:///home/jarg/Documents/works/davivienda/develop/backend/.ruby-version))
* **Framework:** Ruby on Rails 8.1.x en modo API
* **Base de Datos:** PostgreSQL
* **Gemas Principales:**
  * `bcrypt`: Cifrado y hashing seguro de contraseñas (`has_secure_password`).
  * `rack-cors`: Habilitación de CORS para permitir conexiones cruzadas con el emulador Android de desarrollo.
  * `rspec-rails`: Suite de pruebas automatizadas unitarias y de integración.

---

## 📋 2. Requisitos Previos

Antes de ejecutar el proyecto, asegúrate de tener instalado:
* **Ruby** (versión 3.4.1) mediante gestores como `rbenv`, `rvm` o `asdf`.
* **PostgreSQL** instalado y corriendo localmente en el puerto `5432`.
* **Bundler** para el manejo de gemas de Ruby.

---

## 🚀 3. Instalación y Puesta en Marcha

Sigue estos pasos en tu terminal para configurar y levantar el proyecto localmente:

### Paso 1: Clonar e instalar dependencias
Instala todas las gemas requeridas definidas en el [Gemfile](file:///home/jarg/Documents/works/davivienda/develop/backend/Gemfile):
```bash
bundle install
```

### Paso 2: Configurar la Base de Datos
Asegúrate de que PostgreSQL esté activo y ejecuta los comandos para crear y migrar las tablas:
```bash
bin/rails db:create
bin/rails db:migrate
```

### Paso 3: Cargar las Semillas (Seed Data)
Puebla la base de datos con usuarios y transacciones históricas listas para pruebas:
```bash
bin/rails db:seed
```
* **Usuarios de Prueba creados:**
  * **Juan Pérez** (Teléfono: `3001234567`, Clave: `123`, Saldo inicial: `$50,000.00`)
  * **Maria Gomez** (Teléfono: `3109876543`, Clave: `123`, Saldo inicial: `$10,000.00`)
  * **Carlos Rojas** (Teléfono: `3111111111`, Clave: `123`, Saldo inicial: `$25,000.00`)
  * **Usuario Inactivo** (Teléfono: `3200000000`, Clave: `123`, Estado: `INACTIVO`) - *Útil para simular errores de login.*

### Paso 4: Levantar el Servidor
Ejecuta el servidor enlazándolo a la IP `0.0.0.0` para permitir la comunicación fluida con dispositivos físicos o emuladores de Android de desarrollo en tu red:
```bash
bin/rails server -b 0.0.0.0
```
La API estará accesible localmente en: `http://localhost:3000` (o a través de la IP de tu máquina en el emulador Android).

---

## 🧪 4. Suite de Pruebas (RSpec)

Se implementó una suite de pruebas automatizadas completa con 28 pruebas unitarias y de integración que validan el comportamiento de seguridad, reglas de negocio e integridad de base de datos.

### Preparar la base de datos de pruebas:
```bash
bin/rails db:test:prepare
```

### Ejecutar las pruebas:
```bash
bundle exec rspec
```

Las especificaciones cubren:
* **Modelos:** Validación de presencia, unicidad del teléfono celular, rango de saldo positivo (`balance >= 0`) y monto de movimientos (`amount > 0`).
* **Autenticación:** Login exitoso, fallido por contraseña errónea, fallido por usuario inactivo, y control de tiempo de expiración.
* **Consulta de saldo y movimientos:** Validación de seguridad por sesión, y formato estructurado JSON en español (`fecha`, `tipo`, `valor`, `descripcion`, `estado`).
* **Transferencias:** Actualización transaccional de saldos, generación de movimientos débito/crédito, rechazo de transferencias a sí mismo, por montos negativos o por fondos insuficientes.

---

## 🧭 5. Contrato de la API (`api/v1/`)

### A. Autenticación (Login)
* **Endpoint:** `POST /api/v1/auth/login`
* **Entrada (JSON):**
  ```json
  {
    "phone": "3001234567",
    "password": "123"
  }
  ```
* **Respuesta Exitosa (200 OK):**
  ```json
  {
    "sessionId": "a820c78a-cf8e-49b4-b4a1-7782c58a8a43",
    "userId": "1",
    "name": "Juan Pérez",
    "phone": "3001234567",
    "expiresAt": "2026-07-14T17:05:00Z"
  }
  ```

### B. Consulta de Saldo
* **Endpoint:** `GET /api/v1/account/balance`
* **Entrada:** `user_id` y opcionalmente `sessionId` (vía parámetros URL o cabeceras HTTP `User-Id` y `Session-Id`).
* **Respuesta Exitosa (200 OK):**
  ```json
  {
    "balance": 50000.00
  }
  ```

### C. Consulta de Movimientos
* **Endpoint:** `GET /api/v1/movements`
* **Entrada:** `user_id` y opcionalmente `sessionId` (vía parámetros URL o cabeceras HTTP `User-Id` y `Session-Id`).
* **Respuesta Exitosa (200 OK):**
  ```json
  [
    {
      "fecha": "2026-07-14T14:30:00Z",
      "tipo": "DEBITO",
      "valor": 5000.00,
      "descripcion": "Transferencia enviada a Maria Gomez",
      "estado": "EXITOSO"
    }
  ]
  ```

### D. Crear Transferencia
* **Endpoint:** `POST /api/v1/transfers`
* **Entrada (JSON):**
  ```json
  {
    "user_id": "1",
    "amount": 2000.00,
    "destination_phone": "3109876543"
  }
  ```
* **Respuesta Exitosa (200 OK):**
  ```json
  {
    "message": "Transferencia realizada con éxito"
  }
  ```

---

## 🔐 6. Arquitectura y Mecanismos de Seguridad Implementados

1. **Cero Texto Plano:** Las contraseñas se almacenan cifradas en la base de datos utilizando el algoritmo robusto de hashing `BCrypt` en el campo `password_digest` del modelo `User`.
2. **Mitigación de Condiciones de Carrera (Race Conditions):** El procesamiento de transferencias se realiza dentro de un bloque atómico `ActiveRecord::Base.transaction` y utiliza **bloqueo pesimista de base de datos** (`SELECT FOR UPDATE` en PostgreSQL) mediante el método `.lock!` de ActiveRecord. Para prevenir deadlocks, el bloqueo de los registros de emisor y receptor siempre se realiza ordenándolos de manera consistente por su `id`.
3. **Manejo Seguro de Sesión:** El inicio de sesión genera y almacena un `session_token` único y temporal de 30 minutos. La validación se gestiona de manera local y descentralizada en el emulador móvil, y se valida estrictamente del lado del servidor en el ambiente de pruebas.
4. **CORS Habilitado:** Configuración activa de `rack-cors` permitiendo orígenes cruzados (`origins '*'`) en desarrollo para facilitar la integración nativa y comunicación de red del backend local con emuladores Android en entornos virtuales.
