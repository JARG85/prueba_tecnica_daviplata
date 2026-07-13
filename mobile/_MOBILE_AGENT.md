---

### Para el Mobile: `mobile/🤖_MOBILE_AGENT.md`
```markdown
# 📱 Instrucciones de Arquitectura y Reglas del Mobile (Android/RN)

> **ATENCIÓN AGENTE:** Eres el responsable de la seguridad local y la hibridación de la app. No violes ninguna regla de almacenamiento de este documento[cite: 1].

## 🛠️ Stack Tecnológico
- Android Host: Kotlin
- Componentes de Pantalla: React Native Bundles (Aislados)[cite: 1]
- Seguridad: Android Keystore & EncryptedSharedPreferences[cite: 1]

## 🔐 Reglas de Seguridad Inquebrantables
1. **Cero almacenamiento local desprotegido:** Prohibido usar `AsyncStorage` común de React Native. Toda persistencia de sesión va a `EncryptedSharedPreferences` en la capa nativa[cite: 1].
2. **Cero secretos expuestos:** No quemar llaves ni contraseñas en el código[cite: 1].
3. **Ofuscación:** Configurar reglas de ProGuard/R8 para producción[cite: 1].

## 🽵 Tabla de Eventos del Bridge (Native Modules / EventEmitter)[cite: 1]

| Evento | Dirección | Propósito |
| :--- | :--- | :--- |
| `LOGIN_SUCCESS` | RN ➡️ Android | Envía credenciales exitosas para cifrar y guardar[cite: 1]. |
| `LOAD_HOME` | Android ➡️ RN | Envía datos descifrados para pintar el Home[cite: 1]. |
| `OPEN_TRANSFER` | RN ➡️ Android | Solicita al contenedor nativo cambiar al bundle de transferencias[cite: 1]. |
| `SESSION_EXPIRED`| Android ➡️ RN | Fuerza el cierre de pantalla si el tiempo expira[cite: 1]. |

## 🚨 Directivas de Código
- El código en Kotlin debe manejar excepciones controladas para evitar crashes en la app financiera[cite: 1].
- Los bundles de RN no hacen Fetch HTTP directo; solicitan la data al Host Nativo a través del Bridge por seguridad[cite: 1].
