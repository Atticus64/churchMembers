# Api Membresia Church

## Development setup

* Instalar Dependencias

```sh
npm install
```

* crear archivo de variables de entorno `.env`

```
# Environment Configuration
PORT="3000"            # The port your server will listen on
DATABASE_URL=postgresql://<user>:<password>@<host>:<port>/<database>
IMGUR_TOKEN=bearertokenAPI
```

* Iniciar watcher de typescript

```sh
npm run watch:build
```

* Iniciar servidor

```sh
npm run watch:serve
```