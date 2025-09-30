# KIBA - Sistema de Administración de Club de Voleibol

Sistema web completo para la administración del club de voleibol KIBA, desarrollado con Next.js 14, TypeScript, TailwindCSS y PostgreSQL.

## 🚀 Características

- **Gestión de Jugadores**: CRUD completo con categorías y posiciones
- **Control de Pagos**: Registro de pagos mensuales con generación de recibos
- **Asistencias**: Control de asistencia con estados múltiples
- **Dashboard**: Panel administrativo con métricas en tiempo real
- **Usuarios**: Sistema de autenticación básico con roles
- **Responsive**: Diseño adaptativo para móvil, tablet y desktop

## 🛠️ Tecnologías

- **Frontend**: Next.js 14, React, TypeScript, TailwindCSS
- **UI Components**: Shadcn/ui, Lucide React
- **Base de Datos**: PostgreSQL (Supabase)
- **Estilos**: TailwindCSS con paleta negro-morado

## 📦 Instalación

1. Clona el repositorio:
```bash
git clone <repository-url>
cd kiba-volleyball-system
```

2. Instala las dependencias:
```bash
npm install
```

3. Configura las variables de entorno:
```bash
cp .env.example .env.local
```

4. Edita `.env.local` con tus credenciales de Supabase:
```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-clave-anonima
```

5. Ejecuta las migraciones de base de datos en Supabase

6. Inicia el servidor de desarrollo:
```bash
npm run dev
```

## 🚀 Despliegue en Vercel

1. Conecta tu repositorio a Vercel
2. Configura las variables de entorno en Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Despliega automáticamente

## 🔐 Credenciales por Defecto

- **Email**: admin@kiba.com
- **Contraseña**: admin123

## 📱 Funcionalidades

### Dashboard
- Métricas de jugadores activos
- Control de pagos pendientes
- Porcentaje de asistencia
- Gráficas en tiempo real

### Gestión de Jugadores
- Registro completo de jugadores
- Asignación de categorías por edad
- Gestión de posiciones técnicas
- Estados: activo, inactivo, suspendido

### Control Financiero
- Registro de pagos mensuales
- Generación de recibos electrónicos
- Estados de pago: pagado, pendiente, vencido
- Métodos de pago múltiples

### Asistencias
- Control diario de asistencia
- Estados: presente, ausente, justificado
- Registro masivo de asistencias
- Reportes por fecha y jugador

## 🎨 Diseño

- Paleta principal: Negro (#000000) y Morado (#8B5CF6)
- Diseño moderno y minimalista
- Componentes accesibles con shadcn/ui
- Iconografía deportiva con Lucide React

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.