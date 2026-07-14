# Prueba Técnica DaviPlata (Mobile)

Este repositorio contiene el cliente móvil híbrido para la prueba técnica de DaviPlata. El proyecto combina una interfaz moderna en **React Native (v0.86.0)** con una arquitectura nativa en **Android (Kotlin)**, conectándose con una API de backend en Ruby on Rails.

---

## 📱 Características del Proyecto

* **Diseño Premium y Consistente:** Cabeceras con gradientes mesh orgánicos en rojo institucional, tarjetas blancas solapadas, entradas de texto tipo píldora (pills) con iconos vectoriales minimalistas hechos con hojas de estilo nativas y badges dinámicos.
* **Separación de Responsabilidades:** Cada bundle del aplicativo móvil está aislado en su propia subcarpeta dentro de `src/bundles/`, dividiendo la lógica de pintado y estado de la hoja de estilos (`*.styles.ts`).
* **Puente Nativo Robusto (Native Bridge):** Comunicación bidireccional entre la capa JavaScript y Kotlin utilizando `DaviPlataBridge` para transacciones, cierres de pantalla nativos en el hilo de interfaz (`runOnUiThread`) y sincronizaciones automáticas.
* **Estilos Centralizados:** Gestión de tokens de diseño, colores institucionales y espaciados de seguridad unificados en `src/styles/theme.ts` y layouts comunes en `src/styles/commonStyles.ts`.
* **Pruebas Unitarias Automatizadas:** Cobertura de tests unitarios robustos con mocks para todas las pantallas del aplicativo.

---

## 🛠️ Arquitectura de Directorios Móbiles

```text
mobile/
├── index.js                      # Registro central de los bundles de React Native
├── jest.config.js                # Configuración de Jest con presets nativos
├── __tests__/                    # Pruebas unitarias del frontend
│   ├── App.test.tsx
│   ├── LoginBundle.test.tsx
│   ├── HomeBundle.test.tsx
│   ├── TransferenciaBundle.test.tsx
│   └── MovimientosBundle.test.tsx
└── src/
    ├── assets/                   # Recursos estáticos (Logos e imágenes corporativas)
    ├── services/
    │   └── bridge.ts             # Interfaz TypeScript del puente nativo de Kotlin
    ├── styles/
    │   ├── theme.ts              # Paleta de colores y tokens de espaciado
    │   └── commonStyles.ts       # Hojas de estilo y layouts compartidos
    └── bundles/                  # Componentes aislados de vistas del negocio
        ├── Login/                # Ingreso de credenciales y redirecciones
        ├── Home/                 # Saldos consolidados, accesos directos y navegación
        ├── Transferencia/        # Formulario de Pasar Plata, validaciones e iconos píldora
        └── Movimientos/          # Historial de transacciones con indicadores gráficos
```

---

## 🚀 Guía de Inicio Rápido

### Requisitos Previos
* **Node.js** (versión recomendada `>= 22.11.0`)
* **Android SDK** y un emulador configurado o dispositivo físico conectado mediante ADB.
* El servidor de Backend (Rails API) debe estar corriendo y accesible desde la red del emulador.

### Paso 1: Instalación de dependencias
Instala los paquetes de Node y dependencias de desarrollo (incluyendo configuraciones de pruebas):
```bash
npm install
```

### Paso 2: Iniciar Metro Bundler
Inicia el empaquetador de JavaScript de React Native:
```bash
npm start
```

### Paso 3: Compilar y ejecutar en Android
Con el Metro Bundler corriendo en una ventana de comandos, abre otra terminal en la raíz del proyecto móvil y ejecuta:
```bash
npm run android
```

---

## 🧪 Pruebas Automatizadas

El proyecto incluye un conjunto de pruebas unitarias implementadas con **Jest** y **React Test Renderer**. Estas simulan el puente nativo para evaluar de forma aislada la interfaz y las actualizaciones de estado asíncronas de las vistas.

Para ejecutar la suite de pruebas unitarias, ejecuta:
```bash
npm test
```

### Detalle de las Pruebas:
* `LoginBundle.test.tsx`: Evalúa la existencia y configuración de placeholders para los inputs de celular y clave e ingresa correctamente la UI.
* `HomeBundle.test.tsx`: Verifica que el saludo de usuario, formato de teléfono e importe en pesos colombianos (`$75.000,00`) rendericen según la estática.
* `TransferenciaBundle.test.tsx`: Evalúa que el saldo de cuenta actual se pre-cargue en la cabecera de Pasar Plata y los campos se configuren.
* `MovimientosBundle.test.tsx`: Mapea egresos (debitos) e ingresos (creditos) simulados y verifica que la FlatList renderice con sus correspondientes prefijos (`+` / `-`) y formatos de divisa.

---

## 💡 Detalles Técnicos y Buenas Prácticas Aplicadas

* **Sincronización de Saldo (Lifecycle Resumes):**
  Al retornar al panel principal, el método `onResume()` en Kotlin vuelve a consultar los saldos asíncronamente en el servidor de Rails y los envía de regreso a JavaScript, manteniendo el saldo sincronizado inmediatamente.
* **Formateo de Moneda Local:**
  Implementación limpia de formateo numérico personalizada por expresiones regulares, garantizando que el formato de pesos colombianos (`$1.450.000,00`) se pinte correctamente en cualquier versión de motor JS (Hermes/JSC).
* **Robustez en Hilos Nativos:**
  Todas las acciones que afectan las vistas de Android (`activity.finish()`) son despachadas mediante `activity.runOnUiThread { ... }` para prevenir excepciones y cierres de pantalla nativos.
