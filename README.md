# Módulo de Gestión de Asistentes IA - Funnelhot

Aplicación web responsive para crear, listar, editar, eliminar y entrenar asistentes de IA, con gestión profesional de estado.

## 🚀 Características Implementadas

### Funcionalidad Principal
- ✅ **Página Principal**: Listado de asistentes en tarjetas con información detallada
- ✅ **Modal 2 Pasos**: Creación y edición de asistentes con validaciones
- ✅ **Página de Entrenamiento**: Configuración de reglas y chat simulado
- ✅ **Gesión de Eliminación**: Confirmación y feedback visual
- ✅ **Estados de Carga**: Loading, error handling y optimistic updates

### Funcionalidades por Sección

#### 1. Página Principal (`/`)
- Listado de asistentes en tarjetas con:
  - Nombre, idioma y tono
  - Visualización de distribución de respuestas (gráfico de barras)
  - Estado de audio (habilitado/deshabilitado)
  - Menú desplegable de acciones (Editar, Eliminar)
  - Botón "Entrenar" con link a página de training
- Estado vacío con llamada a la acción
- Botón "Crear Asistente" flotante
- Loading skeletons durante la carga

#### 2. Modal de Creación/Edición
**Paso 1: Datos Básicos**
- Nombre (validado: 3+ caracteres)
- Idioma (Español, Inglés, Portugués)
- Tono (Formal, Casual, Profesional, Amigable)
- Validaciones en tiempo real con mensajes de error

**Paso 2: Configuración de Respuestas**
- Sliders para ajustar porcentaje de respuestas (Cortas, Medias, Largas)
- Validación: suma debe ser exactamente 100%
- Checkbox para habilitar respuestas de audio
- Indicador visual del paso actual

#### 3. Página de Entrenamiento (`/asistant/[id]`)
**Sección de Entrenamiento**
- Área de texto para ingresar prompts/instrucciones
- Botón "Guardar" con estado de carga
- Mensajes de éxito/error con toast
- Persistencia en sesión

**Chat Simulado**
- Interfaz de chat limpia con mensajes del usuario (derecha, azul) y asistente (izquierda, gris)
- Área de scroll con indicador de "escribiendo"
- Input para enviar mensajes
- Botón "Reiniciar" para limpiar conversación
- Respuestas simuladas con delay 1-2 segundos
- Respuestas aleatorias de un JSON predefinido

## 🛠 Stack Técnico

### Requisitos
- **Node.js**: 18+
- **Next.js**: 14+ (App Router)
- **TypeScript**: Tipado completo

### Dependencias Principales
```json
{
  "next": "^14.0.0",
  "react": "^18.2.0",
  "@tanstack/react-query": "^5.0.0",
  "zustand": "^4.4.0",
  "react-hook-form": "^7.48.0",
  "sonner": "^1.2.0",
  "lucide-react": "^0.263.0",
  "@radix-ui/[components]": "latest"
}
```

## 📁 Estructura de Carpetas
```markdown
/src
  /app
    /asistant
      /[id]
        page.tsx
    /components
      ...
    /hooks
      ...
    /lib
      ...
    /pages
      _app.tsx
      index.tsx
    /public
      ...
    /styles
      globals.css
  /tests
    ...
```

## 📚 Documentación Adicional

- **Next.js**: [Documentación Oficial](https://nextjs.org/docs)
- **React**: [Documentación Oficial](https://reactjs.org/docs/getting-started.html)
- **TypeScript**: [Documentación Oficial](https://www.typescriptlang.org/docs/)
- **TanStack Query**: [Documentación Oficial](https://tanstack.com/query/latest/docs/overview)
- **Zustand**: [Documentación Oficial](https://github.com/pmndrs/zustand)
- **React Hook Form**: [Documentación Oficial](https://react-hook-form.com/get-started)
- **Sonner**: [Documentación Oficial](https://sonner.dev/docs)
- **Lucide React**: [Documentación Oficial](https://lucide.dev/docs/react)
- **Radix UI**: [Documentación Oficial](https://www.radix-ui.com/docs/primitives/overview/introduction)