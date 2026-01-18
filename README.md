# Módulo de Gestión de Asistentes IA - Funnelhot

Aplicación web responsive para crear, listar, editar, eliminar y entrenar asistentes de IA con gestión profesional de estado.

## 🚀 Características Implementadas

### ✅ Funcionalidad Principal
- **Página Principal**: Listado de asistentes en tarjetas con información detallada
- **Modal 2 Pasos**: Creación y edición de asistentes con validaciones en tiempo real
- **Página de Entrenamiento**: Configuración de reglas y chat simulado
- **Gestión de Eliminación**: Confirmación y feedback visual
- **Estados de Carga**: Loading, error handling y optimistic updates
- **Tema Oscuro/Claro**: Toggle de tema con persistencia

### 📋 Secciones Implementadas

#### 1. Página Principal (`/`)
- Listado responsive de asistentes en tarjetas
- Información: Nombre, idioma, tono, estado de audio
- Gráfico de distribución de respuestas (cortas, medias, largas)
- Menú de acciones (Editar, Eliminar, Entrenar)
- Estado vacío con CTA
- Botón flotante "Crear Asistente"
- Skeletons durante carga

#### 2. Modal de Creación/Edición
**Paso 1: Datos Básicos**
- Nombre (validado: 3+ caracteres)
- Idioma (Español, Inglés, Portugués)
- Tono (Formal, Casual, Profesional, Amigable)
- Validaciones en tiempo real con mensajes claros

**Paso 2: Configuración**
- Sliders para porcentaje de respuestas
- Validación: suma debe ser 100%
- Checkbox para audio
- Indicador visual del paso actual
- Navegación: Atrás/Guardar

#### 3. Página de Entrenamiento (`/asistant/[id]`)
**Sección de Entrenamiento**
- Área de texto para prompts/instrucciones
- Botón "Guardar" con estado de carga
- Toasts de éxito/error
- Persistencia en sesión

**Chat Simulado**
- Interfaz limpia con mensajes diferenciados
- Delay 1-2 segundos en respuestas
- Respuestas aleatorias del JSON
- Indicador "escribiendo"
- Input para mensajes
- Botón "Reiniciar" conversación

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