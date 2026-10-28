# Explorador móvil

Aplicación móvil hecha con **Expo + React Native** que permite tomar una fotografía, consultar la ubicación actual (GPS) y ver la orientación aproximada del teléfono con el magnetómetro.

Práctica de laboratorio de la asignatura *Desarrollo de Aplicaciones Móviles* (modalidad individual).

**Autor:** CLARITA CARPIO

## Qué hace la app

La pantalla principal tiene tres pestañas en la parte superior:

| Pestaña | Qué hace |
|---|---|
| **Cámara** | Pide permiso, muestra la vista previa, toma una foto y la muestra en pantalla. |
| **Ubicación** | Pide permiso, obtiene latitud, longitud y precisión (en metros) con indicador de carga y mensajes de error. |
| **Brújula** | Lee el magnetómetro (X, Y, Z en µT) y muestra una orientación aproximada con un dial que gira. |

### Manejo de permisos

- **Cámara y Ubicación:** al entrar se muestran los botones **Permitir** y **No permitir**.
  - Con *Permitir* aparece el aviso del sistema.
  - Con *No permitir* se oculta el botón de pedir permiso y se explica, paso a paso, cómo activarlo en los ajustes del teléfono (con un botón **Abrir ajustes**).
  - Si el usuario cambia de pestaña y regresa, la app vuelve a preguntar.
- **Brújula:** el magnetómetro no requiere permiso. La app solo comprueba si el sensor existe; si no, muestra **"Sensor no disponible"** y sigue funcionando.

## Requisitos

- [Node.js](https://nodejs.org/) 
- Un teléfono **físico** Android o iOS con la app **Expo Go** instalada
- El teléfono y la computadora en la **misma red Wi-Fi** 

Se recomienda un teléfono físico: los simuladores pueden no tener cámara, magnetómetro ni datos reales de ubicación.

## Instalación

1. Clona el repositorio e ingresa a la carpeta:

   ```bash
   git clone <URL-DEL-REPOSITORIO>
   cd explorador-movil
   ```

2. Instala las dependencias del proyecto:

   ```bash
   npm install
   ```

3. Si empiezas el proyecto desde cero, estos son los comandos con los que se creó:

   ```bash
   npx create-expo-app@latest explorador-movil --template blank
   cd explorador-movil
   npx expo install expo-camera expo-location expo-sensors react-native-safe-area-context
   ```

## Ejecución

1. Inicia el servidor de desarrollo:

   ```bash
   npx expo start
   ```

2. Abre **Expo Go** en el teléfono y escanea el código QR que aparece en la terminal

3. Si la conexión local falla, usa el modo túnel:

   ```bash
   npx expo start --tunnel
   ```

4. Si algo se ve raro después de cambiar código o instalar paquetes, limpia la caché:

   ```bash
   npx expo start -c
   ```

## Estructura del proyecto

```
explorador-movil/
├── App.js                      # Pantalla principal y navegación entre pestañas
└── componentes/
    ├── ModuloCamara.js         # Módulo A: cámara
    ├── ModuloUbicacion.js      # Módulo B: ubicación GPS
    └── ModuloBrujula.js        # Módulo C: brújula (magnetómetro)
```


## Limitaciones conocidas

- **El magnetómetro depende del dispositivo.** El teléfono usado para las pruebas **no cuenta con magnetómetro**, por lo que en él la pestaña Brújula muestra "Sensor no disponible". La lectura de la brújula se verificó en otro dispositivo que sí tiene el sensor.
- **La orientación es aproximada.** Se calcula con los ejes X e Y y supone que el teléfono está **horizontal**. 
- **La precisión del GPS es una estimación.** El valor en metros es lo que reporta el dispositivo y no es un error garantizado. En interiores puede tardar más o ser menos exacta.
- **La foto no se guarda.** La imagen capturada solo se muestra en pantalla; no se guarda en la galería ni se envía a ningún lado.
- **La ubicación no se almacena ni se comparte.** Se muestra únicamente en pantalla.
- **Permiso bloqueado en Android.** Si el usuario deniega el permiso varias veces, el sistema puede dejar de mostrar el aviso. En ese caso hay que activarlo manualmente desde los ajustes del teléfono
- **El permiso de la brújula no lo pide el sistema.** En Android el magnetómetro no pide permiso, por eso la pestaña Brújula no tiene botones de permitir o no permitir.

## Tecnologías

- [Expo](https://expo.dev/) y [React Native](https://reactnative.dev/)
- [expo-camera](https://docs.expo.dev/versions/latest/sdk/camera/)
- [expo-location](https://docs.expo.dev/versions/latest/sdk/location/)
- [expo-sensors](https://docs.expo.dev/versions/latest/sdk/sensors/)
- [react-native-safe-area-context](https://docs.expo.dev/versions/latest/sdk/safe-area-context/)