# 🏢 Manual de Arquitectura y Reglas del Backend (Ruby on Rails)

> **ATENCIÓN AGENTE BACKEND:** Este archivo es el anclaje central de tu contexto de desarrollo. Cada modelo, controlador, migración y regla de negocio que implementes debe cumplir estrictamente con los estándares bancarios y técnicos aquí definidos.

---

## 🛠️ 1. Stack Tecnológico Obligatorio
* **Framework:** Ruby on Rails 7.x en modo API pura (`--api`).
* **Base de Datos:** PostgreSQL.
* **Seguridad:** Gema `bcrypt` activa para el hashing seguro de contraseñas (`has_secure_password`).

---

## 🗄️ 2. Estructura de la Base de Datos (Modelos y Restricciones)

### Modelo: `User`
* **Campos:**
  * `name`: String, obligatorio (`null: false`).
  * `phone`: String, obligatorio, indexado con restricción de unicidad estricta en PostgreSQL.
  * `password_digest`: String, obligatorio (manejado por `bcrypt`).
  * `status`: String, por defecto `'ACTIVO'`.
  * `balance`: Decimal, por defecto `0.0`. **Obligatorio:** Precisión bancaria de `precision: 15, scale: 2`.

### Modelo: `Movement`
* **Campos:**
  * `user_id`: Llave foránea indexada hacia la tabla `users` (`null: false`).
  * `amount`: Decimal, obligatorio con precisión bancaria `precision: 15, scale: 2`[cite: 1].
  * `movement_type`: String, obligatorio (Valores permitidos: `'DEBITO'` o `'CREDITO'`)[cite: 1].
  * `description`: String, obligatorio[cite: 1].
  * `status`: String, por defecto `'EXITOSO'`[cite: 1].

---

## 🧭 3. Ruteo y Contratos de Endpoints (`api/v1/`)

| Método | Endpoint | Entrada Esperada | Respuesta Exitosa (200 OK / 201 Created) |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/v1/auth/login` | `phone`, `password`[cite: 1] | JSON con estructura de sesión exacta (ver abajo)[cite: 1] |
| **GET** | `/api/v1/account/balance`| `user_id` (vía parámetro/header) | `{ "balance": 50000.00 }`[cite: 1] |
| **POST** | `/api/v1/transfers` | `user_id`, `amount`, `destination_phone`[cite: 1] | `{ "message": "Transferencia realizada con éxito" }`[cite: 1] |
| **GET** | `/api/v1/movements` | `user_id` (vía parámetro/header) | Array de objetos con el historial filtrado[cite: 1] |

---

## 🔐 4. Reglas Críticas de Negocio y Lógica de Controladores

### Módulo de Autenticación (`Auth#login`)
* Validar que tanto el teléfono como la contraseña sean provistos; de lo contrario, responder con un error `400 Bad Request`[cite: 1].
* Verificar que el usuario exista, la contraseña coincida y su estado sea estrictamente **ACTIVO**[cite: 1].
* Generar un token temporal o `sessionId` usando `SecureRandom.uuid`[cite: 1].
* Retornar **exactamente** la siguiente estructura JSON requerida por la prueba[cite: 1]:
```json
{
  "sessionId": "uuid-generado-aqui",
  "userId": "id_del_usuario_en_string",
  "name": "Nombre del Usuario",
  "phone": "3001234567",
  "expiresAt": "2026-05-07T10:30:00Z"
}

### Módulo de Transferencias (`Transfers#create`)
Para evitar condiciones de carrera o inconsistencias de saldo, todo el flujo de actualización de saldos y creación de bitácoras debe envolverse en un bloque transaccional atómico de PostgreSQL (`ActiveRecord::Base.transaction`).
* **Validación 1:** El usuario origen debe estar debidamente autenticado.
* **Validación 2:** El monto de la transferencia debe ser estrictamente mayor a cero.
* **Validación 3:** El número telefónico destino debe existir previamente en la base de datos.
* **Validación 4:** El usuario origen **no** puede transferirse fondos a sí mismo.
* **Validación 5:** El usuario origen debe contar con saldo disponible suficiente para cubrir el monto solicitado[cite: 1].
* **Resultado:** Si pasa los filtros, se debita del emisor, se acredita al receptor y se genera un registro de tipo débito o crédito en la tabla de movimientos para cada uno de los involucrados[cite: 1].

### Módulo de Movimientos (`Movements#index`)
* Debe filtrar y retornar **únicamente** los registros que pertenezcan al usuario autenticado[cite: 1].
* El mapeo del JSON de salida debe renderizar de forma obligatoria la fecha, el tipo, el valor, la descripción y el estado de cada movimiento[cite: 1]:
```json
[
  {
    "fecha": "2026-07-13T13:30:00Z",
    "tipo": "DEBITO",
    "valor": 15000.00,
    "descripcion": "Transferencia enviada a Maria Gomez",
    "estado": "EXITOSO"
  }
]

🚨 5. Directivas de Código y Manejo de Errores

    Cero Texto Plano: Queda estrictamente prohibido guardar contraseñas sin cifrar o mantener credenciales en texto plano dentro del sistema[cite: 1].

    Manejo Controlado de Errores: Implementa un control de errores estructurado para responder con formatos JSON limpios ante fallos y evitar excepciones descontroladas[cite: 1].

    Protección de Payloads Sensibles: Garantizar que la información financiera y los identificadores sensibles viajen protegidos y bajo estrictas reglas de cifrado[cite: 1].

    Sin Secretos Quemados: No se deben almacenar llaves criptográficas, credenciales fijas ni secretos quemados dentro del código fuente[cite: 1].

    CORS Activo: Permite peticiones cruzadas (rack-cors) desde cualquier origen en el entorno de desarrollo para evitar bloqueos de red con el emulador de Android.
