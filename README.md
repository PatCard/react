# 📚 Aprendiendo a Leer con Chocolate

## 📖 Descripción

Plataforma web educativa para mejorar habilidades de lectura en estudiantes de 3° y 4° básico (8-10 años) de escuelas públicas chilenas en contextos de vulnerabilidad.

El sistema permite a profesores crear actividades interactivas personalizadas y hacer seguimiento del progreso de sus estudiantes, mientras los niños practican lectura de forma autónoma y entretenida acompañados por "Chocolate", un perro guía virtual.

---

## ✨ Características Principales

- 🎮 **2 tipos de actividades interactivas:**
  - "Descubrir": Relacionar palabras con definiciones
  - "Ordenar Historia": Secuenciar oraciones lógicamente
  
- 👥 **Sistema multi-rol:**
  - Administradores: Gestión de cursos y usuarios
  - Profesores: Creación de actividades y seguimiento
  - Estudiantes: Acceso simplificado con código de 6 caracteres

- 📊 **Dashboard de seguimiento:**
  - 8 tipos de gráficos analíticos
  - Reportes PDF descargables
  - Seguimiento individual por estudiante

- 🔄 **Sistema de rotación inteligente:**
  - Las actividades no se repiten hasta completar todas
  - Alternancia automática entre tipos de actividad

- 📱 **Diseño responsive:**
  - Compatible con tablets (7" y 10")
  - Compatible con PC escritorio
  - Optimizado para conexiones 3G

---

## 🎯 Objetivos del Proyecto

### Objetivo General
Mejorar las habilidades lectoras de niños de 8 a 10 años en escuelas públicas de contextos vulnerables mediante actividades interactivas.

### Objetivos Específicos
1. Diseñar actividades pedagógicas validadas técnicamente
2. Crear interfaz intuitiva centrada en el niño
3. Garantizar compatibilidad multiplataforma
4. Desarrollar sistema de seguimiento de progreso

---

## 🛠️ Tecnologías Utilizadas

### Backend
- **Laravel 11/12** - Framework PHP
- **MySQL** - Base de datos relacional
- **PHPUnit** - Testing automatizado

### Frontend
- **React 18** - Biblioteca JavaScript
- **Inertia.js** - Puente Laravel-React
- **Tailwind CSS** - Framework de estilos
- **Recharts** - Visualización de datos

### DevOps
- **Docker** - Contenedorización
- **Git/GitHub** - Control de versiones
- **Laravel Sail** - Entorno de desarrollo

---

## 📋 Requisitos Previos

- Docker Desktop instalado
- Git instalado
- Mínimo 4GB RAM disponible
- Puerto 80 disponible

---

## 🚀 Instalación

### 1. Clonar el repositorio
```bash
git clone https://github.com/tu-usuario/aprendiendo-leer-chocolate.git
cd aprendiendo-leer-chocolate
```

### 2. Copiar archivo de configuración
```bash
cp .env.example .env
```

### 3. Instalar dependencias y levantar contenedores
```bash
docker compose up -d
```

### 4. Instalar dependencias PHP
```bash
docker compose exec app composer install
```

### 5. Generar key de aplicación
```bash
docker compose exec app php artisan key:generate
```

### 6. Ejecutar migraciones
```bash
docker compose exec app php artisan migrate --seed
```

### 7. Instalar dependencias JavaScript
```bash
docker compose exec app npm install
docker compose exec app npm run build
```

### 8. Acceder a la aplicación

Abrir navegador en: `http://localhost`

---

## 👤 Usuarios de Prueba

El sistema crea automáticamente usuarios de prueba:

### Administrador
- **Email:** admin@chocolate.cl
- **Contraseña:** password

### Profesor
- **Email:** profesor@chocolate.cl
- **Contraseña:** password

### Estudiante
- **Código:** ABC123

---

## 🧪 Ejecutar Pruebas

### Todas las pruebas
```bash
docker compose exec app php artisan test
```

### Solo pruebas unitarias
```bash
docker compose exec app php artisan test --testsuite=Unit
```

### Solo pruebas de integración
```bash
docker compose exec app php artisan test --testsuite=Feature
```

**Resultado esperado:** 19 tests passed (51 assertions)

---

## 📂 Estructura del Proyecto
```
aprendiendo-leer-chocolate/
├── app/
│   ├── Http/Controllers/     # Controladores
│   ├── Models/                # Modelos Eloquent
│   └── Helpers/               # Clases auxiliares
├── database/
│   ├── migrations/            # Migraciones de BD
│   └── factories/             # Factories para testing
├── resources/
│   └── js/
│       ├── Pages/             # Componentes React (Inertia)
│       └── Components/        # Componentes reutilizables
├── tests/
│   ├── Unit/                  # Pruebas unitarias
│   └── Feature/               # Pruebas de integración
└── docker-compose.yml         # Configuración Docker
```

---

## 📊 Arquitectura del Sistema

### Patrón: MVC (Model-View-Controller)
```
┌─────────────┐
│   React     │ ← Vista (Inertia.js)
│  (Frontend) │
└──────┬──────┘
       │
┌──────▼──────┐
│  Laravel    │ ← Controlador + Modelo
│  (Backend)  │
└──────┬──────┘
       │
┌──────▼──────┐
│   MySQL     │ ← Base de Datos
└─────────────┘
```

---

## 🔐 Seguridad

- Autenticación con Laravel Breeze
- Contraseñas encriptadas con Bcrypt
- Middleware de roles para control de acceso
- Validación de datos en frontend y backend
- Protección CSRF habilitada
- Sanitización de inputs

---

## 📈 Métricas de Calidad

- ✅ 19 pruebas automatizadas (100% exitosas)
- ✅ Tiempo de carga < 3 segundos (3G simulada)
- ✅ Compatible Chrome y Firefox (últimas 2 versiones)
- ✅ 0 errores críticos en funcionalidades principales
- ✅ Cumplimiento PSR-12 (código PHP)

---

## 🚧 Limitaciones Conocidas

- Solo validación técnica (sin pruebas con usuarios reales)
- 2 tipos de actividades implementadas (de 5 planificadas)
- Requiere conexión a internet
- Sin aplicación móvil nativa
- No incluye modo offline

---

## 🗺️ Roadmap Futuro

### Versión 1.1 (Q1 2026)
- [ ] 3 nuevos tipos de actividades
- [ ] Sistema de gamificación (insignias)
- [ ] Modo offline básico

### Versión 2.0 (Q2 2026)
- [ ] Aplicación móvil nativa (React Native)
- [ ] Integración con Google Classroom
- [ ] Reportes avanzados con IA

---

## 👨‍💻 Autor

**Patricio [Apellido]**  
Ingeniero en Computación e Informática  
Universidad [Nombre]

- GitHub: [@tu-usuario](https://github.com/tu-usuario)
- LinkedIn: [Tu Perfil](https://linkedin.com/in/tu-perfil)
- Email: tu-email@ejemplo.com

---

## 👩‍🏫 Profesoras Guías

- Profesora 1 - [Nombre y título]
- Profesora 2 - [Nombre y título]

---

## 📄 Licencia

Este proyecto fue desarrollado como Proyecto de Título para optar al título de Ingeniero en Computación e Informática.

Copyright © 2025 Patricio [Apellido]. Todos los derechos reservados.

---

## 🙏 Agradecimientos

- A las profesoras guías por su orientación durante el desarrollo
- A la comunidad de Laravel y React por la documentación
- A las escuelas públicas chilenas que inspiraron este proyecto

---

## 📞 Contacto y Soporte

Para consultas sobre el proyecto:
- Crear un [Issue en GitHub](https://github.com/tu-usuario/proyecto/issues)
- Enviar email a: tu-email@ejemplo.com

---

## 📸 Capturas de Pantalla

### Panel de Estudiante
![Panel Estudiante](docs/screenshots/estudiante-panel.png)

### Actividad "Descubrir"
![Actividad Descubrir](docs/screenshots/actividad-descubrir.png)

### Dashboard Profesor
![Dashboard](docs/screenshots/dashboard-profesor.png)

---

**⭐ Si este proyecto te fue útil, no olvides darle una estrella en GitHub**