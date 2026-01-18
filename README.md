# Módulo de Gestión de Asistentes IA - Funnelhot

Aplicación web responsive para crear, listar, editar, eliminar y entrenar asistentes de IA con gestión profesional de estado.

## 🚀 Cómo Ejecutar el Proyecto

### Requisitos Previos
- **Node.js**: 18+ instalado
- **pnpm**: Gestor de paquetes (o npm/yarn)

### Instalación y Ejecución

1. **Clonar el repositorio**
```bash
git clone https://github.com/LofoMarin/prueba-tecnica-funnelhot.git
cd prueba-tecnica-funnelhot
```

2. **Instalar dependencias**
```bash
pnpm install
# o si usas npm
npm install
```

3. **Ejecutar en desarrollo**
```bash
pnpm dev
# o
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

4. **Compilar para producción**
```bash
pnpm build
pnpm start
```

## 🚀 Características Implementadas

### ✅ Funcionalidad Principal
- ✅ **Página Principal**: Listado de asistentes en tarjetas con información detallada
- ✅ **Modal 2 Pasos**: Creación y edición de asistentes con validaciones en tiempo real
- ✅ **Página de Entrenamiento**: Configuración de reglas y chat simulado
- ✅ **Gestión de Eliminación**: Confirmación y feedback visual
- ✅ **Estados de Carga**: Loading, error handling y optimistic updates
- ✅ **Tema Oscuro/Claro**: Toggle de tema con persistencia
- ✅ **Logo Funnelhot**: Branding personalizado en el header
- ✅ **Toasts de Notificación**: Feedback visual con Sonner

### 📋 Secciones Detalladas

#### 1. Página Principal (`/`)
- Listado responsive de asistentes en tarjetas (3 columnas en desktop, 2 en tablet, 1 en mobile)
- Información mostrada: Nombre, idioma, tono, estado de audio
- **Gráfico Visual**: Barra de distribución de respuestas (cortas 🔵, medias 🟠, largas 🟢)
- Menú desplegable con acciones (Editar, Eliminar)
- Botón "Entrenar" que lleva a la página de entrenamiento
- Estado vacío elegante cuando no hay asistentes
- Skeletons de carga mientras se obtienen datos
- Animaciones suaves en transiciones

#### 2. Modal de Creación/Edición (2 Pasos)
**Paso 1: Datos Básicos**
- ✅ Campo Nombre (validación: mínimo 3 caracteres, requerido)
- ✅ Select Idioma (Español, Inglés, Portugués)
- ✅ Select Tono (Formal, Casual, Profesional, Amigable)
- ✅ Indicador visual mostrando "Paso 1/2"
- ✅ Botón "Siguiente" con validación

**Paso 2: Configuración de Respuestas**
- ✅ 3 Sliders para ajustar porcentajes (Cortas, Medias, Largas)
- ✅ **Validación crítica**: suma debe ser exactamente 100%
- ✅ Checkbox para habilitar/deshabilitar audio
- ✅ Indicador visual mostrando "Paso 2/2"
- ✅ Botones "Atrás" y "Guardar"
- ✅ Manejo de estados: loading, error, éxito

#### 3. Página de Entrenamiento (`/asistant/[id]`)
**Sección Izquierda: 📝 Entrenamiento**
- Header mostrando datos del asistente (nombre, idioma, tono, audio)
- Textarea grande para escribir instrucciones/prompts
- Botón "GUARDAR" con estado de carga
- Toasts de feedback (éxito/error)
- **Persistencia**: Los datos se guardan en sesión

**Sección Derecha: 💬 Chat Simulado**
- Interfaz de chat limpia y moderna
- Mensajes del usuario alineados a la derecha (fondo púrpura)
- Mensajes del asistente alineados a la izquierda (fondo gris)
- **Indicador "escribiendo"** con animación de puntos
- Delay realista de 1-2 segundos antes de responder
- Respuestas aleatorias del array predefinido
- Input para escribir mensajes
- Botón "Enviar" (también con Enter)
- Botón "Reiniciar" para limpiar el chat
- Auto-scroll al mensaje más nuevo

## 🛠 Decisiones Técnicas

### 1. **Zustand para Estado Global** ✅
**Por qué:**
- Más ligero que Context API
- No requiere Provider wrapper (aunque lo usamos para mejor práctica)
- Excelente performance incluso con múltiples renders
- Sintaxis simple y intuitiva
- Fácil de debuggear

**Qué gestiona:**
- Lista de asistentes
- Asistente seleccionado
- Estado del modal (abierto/cerrado)
- Mensajes del chat por asistente

### 2. **React Query (TanStack Query) para Operaciones Asíncronas** ✅
**Por qué:**
- Manejo automático de loading, error y success states
- Caching inteligente de datos
- Invalidación automática de queries
- Reintentos automáticos en caso de error
- DevTools para debugging

**Qué usa:**
- `useQuery`: Para obtener lista de asistentes y asistente específico
- `useMutation`: Para crear, editar, eliminar y guardar instrucciones
- `queryClient.invalidateQueries`: Para actualizar cache automáticamente

### 3. **Validaciones en Tiempo Real** ✅
**Implementado en:**
- **Paso 1 del Modal**: Validación de nombre (min 3 caracteres)
- **Paso 2 del Modal**: Validación de suma = 100% exacto
- **Mensajes de Error**: Claros y en español

**Flujo:**