# Agua del 7mo Día

**Exodo 20:8**

Agua del 7mo Día es una aplicacion web para gestionar clientes, rutas y entregas de una distribuidora de botellones de agua. El sistema reemplaza el control en papel por una herramienta donde se pueden registrar entregas, actualizar saldos pendientes, identificar clientes con deuda critica y consultar resumenes del dia y del mes.

## Version publicada

Enlace de producción: https://agua-del-7mo-dia.netlify.app

## Caso

Carlos distribuye botellones de agua a domicilio y tiene clientes con servicio semanal o quincenal. Antes manejaba las entregas pendientes en papel, lo que provocaba errores de direccion, olvidos en la ruta, poco control de deudas y falta de conteo mensual de botellones vendidos.

Agua del 7mo Día digitaliza ese proceso y permite controlar clientes, entregas, rutas y deudas desde una aplicacion web.

## Funcionalidades

- Autenticacion con email y contrasena.
- Acceso restringido solo para usuarios autenticados.
- Persistencia de sesion al recargar la pagina.
- Cierre automatico de sesion despues de 5 minutos de inactividad.
- Registro y edicion de clientes.
- Activacion y desactivacion de clientes.
- Filtros por zona y por deuda critica.
- Registro de entregas diarias.
- Control de botellones entregados y pagados.
- Calculo automatico de saldo pendiente.
- Vista de ruta diaria organizada por zona.
- Dashboard con totales del dia, mes y deuda total.
- Alertas para clientes con deuda critica.
- Validacion de formularios con mensajes descriptivos.
- Persistencia de datos en Firebase Firestore.

## Tecnologias

- React
- Vite
- JavaScript
- HTML
- CSS
- Firebase Firestore
- Netlify
- Variables de entorno con `import.meta.env`

## Instalacion local

Instalar dependencias:

```bash
npm install
```

Crear el archivo `.env` a partir de `.env.example`:

```bash
cp .env.example .env
```

Luego completar las variables reales de Firebase:

```text
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

Ejecutar en modo desarrollo:

```bash
npm run dev
```

Compilar para produccion:

```bash
npm run build
```

Vista previa de produccion:

```bash
npm run preview
```

## Dependencias principales

Las dependencias estan definidas en `package.json`.

- `react`
- `react-dom`
- `vite`
- `@vitejs/plugin-react`
- `firebase`

## Credenciales de prueba

Todos los usuarios usan la misma contrasena:

```text
Contrasena: 12345678
```

Usuarios disponibles:

```text
joanperez@7modia.com
severindeleon@7modia.com
abelvargas@7modia.com
taniavilla@7modia.com
hamsselrodriguez@7modia.com
```

## Estructura principal

```text
src/
  App.jsx
  main.jsx
  components/
    clientes/
      ClienteModal.jsx
    layout/
      Sidebar.jsx
    ui/
      UI.jsx
  context/
    AppContext.jsx
    AuthContext.jsx
  hooks/
    useClientes.js
  pages/
    LoginPage.jsx
    DashboardPage.jsx
    RutaPage.jsx
    EntregasPage.jsx
    ClientesPage.jsx
  services/
    firebase.js
    firestoreService.js
  utils/
    helpers.js
```

## Archivos importantes

### `src/context/AuthContext.jsx`

Proveedor de autenticacion implementado con `useContext`. Maneja:

- Usuarios permitidos.
- Login.
- Logout.
- Persistencia de sesion.
- Cierre por inactividad.

### `src/context/AppContext.jsx`

Proveedor de datos de la aplicacion. Maneja:

- Carga de clientes.
- Carga de entregas.
- Registro y edicion de clientes.
- Registro de entregas.
- Actualizacion automatica de saldos.
- Mensajes tipo toast.

### `src/hooks/useClientes.js`

Custom hook creado para exponer la logica relacionada con clientes:

- Lista de clientes.
- Agregar cliente.
- Editar cliente.
- Activar/desactivar cliente.
- Mostrar mensajes.

### `src/services/firebase.js`

Archivo inicial de configuracion de Firebase. Lee las variables de entorno del proyecto y exporta:

- `firebaseApp`
- `db`

Este archivo inicializa Firebase y deja disponible Firestore para la aplicacion.

### `src/services/firestoreService.js`

Servicio de datos que usa Firestore para cargar y guardar clientes y entregas. Trabaja con las colecciones:

- `clientes`
- `entregas`

## Inicio con Firebase

Para conectar Firebase:

1. Crear un proyecto en Firebase Console.
2. Registrar una aplicacion web.
3. Copiar los valores del objeto `firebaseConfig`.
4. Completar las variables `VITE_FIREBASE_*` en `.env`.
5. Activar Cloud Firestore desde Firebase Console.
6. Crear las colecciones principales:
   - `clientes`
   - `entregas`

El proyecto ya tiene instalado el SDK de Firebase y usa `src/services/firebase.js` como punto central de configuracion.

### `src/components/clientes/ClienteModal.jsx`

Formulario modal para registrar o editar clientes.

### `src/components/layout/Sidebar.jsx`

Menu lateral de navegacion y cierre de sesion.

### `src/components/ui/UI.jsx`

Componentes reutilizables de interfaz:

- `Field`
- `Input`
- `Select`
- `Button`
- `Card`
- `Table`
- `Toast`
- `MetricCard`

## Regla de deuda critica

La aplicacion marca como deuda critica a los clientes con saldo pendiente de 4 o mas botellones. Esta regla funciona como una aproximacion automatica al problema del caso, donde se pide identificar clientes con mas de 2 semanas de deuda acumulada.

## Accesibilidad y responsive

El proyecto incluye mejoras basicas de accesibilidad:

- Labels asociados a campos.
- `role="alert"` para mensajes de error.
- `aria-invalid` y `aria-describedby` en formularios.
- `role="dialog"` en el modal.
- Navegacion con `aria-current`.
- Estilos visibles para foco de teclado.

Tambien incluye estilos responsivos para adaptar dashboard, formularios, navegacion y tablas a pantallas pequenas.

## Notas de seguridad

Este proyecto fue desarrollado con fines academicos. Las variables reales de conexion no deben subirse al repositorio. Por eso `.env` esta excluido en `.gitignore`, y `.env.example` solo contiene los nombres de variables requeridas.

## Recorrido sugerido para la presentacion

1. Iniciar sesion con un usuario de prueba.
2. Mostrar el dashboard y sus metricas.
3. Mostrar la ruta del dia organizada por zona.
4. Registrar una entrega.
5. Ver como cambia el saldo pendiente.
6. Entrar al modulo de clientes.
7. Crear o editar un cliente.
8. Mostrar la alerta o filtro de deuda critica.
9. Recargar la pagina para demostrar que la sesion se mantiene.
10. Explicar que la sesion se cierra despues de 5 minutos de inactividad.

## Conclusion

Agua del 7mo Día cumple con los requisitos del caso porque permite autenticar usuarios, gestionar clientes, registrar entregas, calcular saldos pendientes, organizar rutas por zona y consultar un dashboard con informacion clave para la toma de decisiones.