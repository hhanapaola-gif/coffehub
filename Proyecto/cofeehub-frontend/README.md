# CofeeHub Frontend (demo, solo interfaces)

Proyecto Expo **independiente** del proyecto principal (`cofeehub/`). Contiene
únicamente las interfaces de los módulos **Mesero**, **Cocina** y **Cajero** —
son las mismas pantallas del proyecto completo, copiadas tal cual.

**No hay backend, no hay FastAPI, no hay base de datos, no hay ninguna capa de
API** (ni siquiera simulada). Cada pantalla usa datos fijos escritos
directamente en el componente. Las acciones (enviar pedido, cambiar estado,
cobrar, registrar un gasto) no hacen ninguna petición: solo navegan a la
siguiente pantalla o muestran un `Alert` (modal) confirmando la acción. Nada
se guarda entre pantallas de forma "real" — es puramente para recorrer las
interfaces.

## Cómo correrlo

```
npm install
npx expo start
```

Luego `w` para web, `a` para Android, o escanea el QR con Expo Go.

## Cómo entrar

El login no valida nada real. Escribe cualquier contraseña y en el correo
incluye la palabra del rol que quieres ver:

| Para ver...  | Escribe un correo que contenga |
|--------------|-------------------------------|
| Mesero       | `mesero` (o cualquier cosa, es el rol por defecto) |
| Cocina       | `cocina` |
| Cajero       | `cajero` |

Ejemplo: `cocina@demo.com` / cualquier contraseña.

Desde cualquier pantalla principal de cada módulo puedes abrir el menú
hamburguesa (arriba a la izquierda) para moverte entre pantallas del rol o
cerrar sesión y probar otro módulo.
