# HablaChido

Diccionario de bolsillo del español de la Ciudad de México. Funciona sin internet y sin servicios de pago.

Diseño: crema, rojo, azul marino y mostaza, con tipografías Bricolage Grotesque (títulos) y DM Sans (texto).

## Qué hace
- **Palabras**: 54 expresiones, palabra del día, búsqueda (sin importar acentos) y filtro por registro (amistoso, coloquial, vulgar).
- **Ficha**: significado, con quién se puede usar, traducción FR/EN, ejemplo con audio y botón de favorito.
- **Favoritos**: lista guardada en el teléfono.
- **Quiz**: 10 preguntas al azar con corrección inmediata. Cada acierto da 10 puntos.
- **Progreso**: racha de días seguidos y nivel según los puntos (Turista, Foráneo, Chilango, Chilango de cepa).

## Cómo ejecutarla
1. Instala Node.js (versión LTS) y la app **Expo Go** en tu teléfono.
2. En esta carpeta:
   ```bash
   npm install
   npx expo start
   ```
3. Escanea el código QR con Expo Go (el teléfono y la computadora deben estar en la misma red).

## Si `npm install` da un error de dependencias
Usa `npm install --legacy-peer-deps` y luego `npx expo start`.

## Estructura
```
app/                 pantallas (Expo Router)
  _layout.tsx        navegación principal
  (tabs)/            Palabras, Favoritos, Quiz
  palabra/[id].tsx   ficha de una palabra
components/          PalabraFila, Boton
lib/palabras.ts      tipos y funciones de las palabras
lib/guardado.tsx     lo que se guarda en el teléfono: favoritos, puntos, racha
lib/theme.ts         colores, tipografías y estilos comunes
data/palabras.json   las expresiones (editable)
```

## Agregar palabras
Edita `data/palabras.json` y agrega un objeto con `id` (texto único), `palabra`, `significado`, `ejemplo`, `ejemploFr`, `ejemploEn`, `registro` (`amistoso`, `coloquial` o `vulgar`), `fr` y `en`. El campo `categoria` todavía no se usa: queda listo para explorar por tema en una versión futura.

## Tecnología
React Native + Expo (Expo Router), `expo-speech` para el audio (voz es-MX del teléfono) y `@react-native-async-storage/async-storage` para favoritos, puntos y racha. Todo local y gratuito.
