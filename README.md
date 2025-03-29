# API Membresía Iglesia

## Configuración del Entorno de Desarrollo

* Instalar Dependencias

```sh
npm install
```

* Crear archivo de variables de entorno `.env`

```
# Configuración del Entorno
PORT="3000"            # Puerto en el que escuchará el servidor
DATABASE_URL=postgresql://<usuario>:<contraseña>@<host>:<puerto>/<base_de_datos>
IMGUR_TOKEN=tokenDeAPI
```

## Scripts Disponibles

### Desarrollo
* `npm run watch:build` - Observa cambios en TypeScript y compila automáticamente
* `npm run watch:serve` - Ejecuta el servidor con recarga automática al detectar cambios
* `npm run build` - Compila el proyecto TypeScript

### Gestión de Base de Datos
* `npm run db:init` - Crea las tablas de la base de datos
* `npm run db:del` - Elimina todas las tablas de la base de datos
* `npm run db:fill` - Genera e inserta datos de prueba
* `npm run db:clear` - Limpia todos los datos manteniendo la estructura de las tablas
* `npm run db:reset` - Reinicio completo: elimina tablas, las recrea y las llena con datos de prueba
* `npm run db:rebuild` - Limpia los datos existentes y los rellena con nuevos datos de prueba

## Flujo de Trabajo de Desarrollo

1. Iniciar la compilación de TypeScript en modo observador:
```sh
npm run watch:build
```

2. En otra terminal, iniciar el servidor de desarrollo:
```sh
npm run watch:serve
```
