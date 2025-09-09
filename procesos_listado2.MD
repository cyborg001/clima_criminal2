# Plan de Trabajo - Instrucciones 2

Aquí se detallan los pasos para completar las instrucciones del archivo `instrucciones2.txt`.

## Tarea 1: Mapa Doble en `mapa.html`
- [x] **Paso 1.1:** Modificar `mapa.html` para tener un layout de dos columnas (ej. usando Flexbox).
- [x] **Paso 1.2:** Mover el mapa de calor existente a la columna izquierda.
- [x] **Paso 1.3:** Crear un segundo contenedor de mapa en la columna derecha.
- [x] **Paso 1.4:** En el JavaScript, inicializar un segundo objeto de mapa de Leaflet para el nuevo contenedor.
- [x] **Paso 1.5:** Modificar la función de carga de datos para que, además de actualizar el mapa de calor, popule el segundo mapa con marcadores individuales.
- [x] **Paso 1.6:** Asegurarse de que los filtros de fecha se apliquen a ambos mapas simultáneamente.

## Tarea 2 y 3: Mapa de Coropletas en `estadisticas.html`
- [x] **Paso 2.1:** Descargar y guardar los datos GeoJSON de las provincias de RD en `static/data/provincias.geojson`.
- [x] **Paso 2.2:** Leer el archivo `estadisticas.html` para entender su estructura actual y los filtros existentes.
- [x] **Paso 2.3:** Añadir un contenedor de mapa en `estadisticas.html`.
- [x] **Paso 2.4:** Escribir el JavaScript para:
    - [x] Cargar y renderizar los polígonos de las provincias desde el archivo GeoJSON.
    - [x] Cargar todos los datos de crímenes de la API.
    - [x] Escribir una función para contar cuántos crímenes caen dentro de cada polígono de provincia (requiere una librería de análisis espacial como `turf.js` o una implementación manual).
    - [x] Crear una escala de colores (verde a rojo) basada en el número de crímenes.
    - [x] Colorear cada provincia según la escala.
    - [x] Añadir los filtros de fecha (día, mes, año, y rango personalizado) que actualicen el conteo y los colores del mapa.

## Tarea 4: Botón de Reporte en `estadisticas.html`
- [x] **Paso 4.1:** Añadir un botón "Generar Reporte" en `estadisticas.html`.
- [x] **Paso 4.2:** Crear una nueva plantilla HTML para el reporte (`reporte_detalle.html`).
- [x] **Paso 4.3:** Escribir una función de JavaScript que, al hacer clic en el botón:
    - [x] Recopile los crímenes filtrados actualmente en el mapa de coropletas.
    - [x] Abra una nueva ventana o pestaña.
    - [x] Inyecte los datos de los crímenes en la nueva ventana con un formato de tabla legible.
    - [x] Opcional: active el diálogo de impresión del navegador.

## Tarea 5: Mejoras en Marcadores de `mapa.html`
- [x] **Paso 5.1:** En el nuevo mapa de marcadores, asegurarse de que cada marcador tenga un `popup` que muestre los detalles del crimen (tipo, descripción, fecha).
- [x] **Paso 5.2:** Añadir un botón "Imprimir Detalle" dentro de cada `popup`.
- [x] **Paso 5.3:** Escribir una función de JavaScript que se active con ese botón para abrir una nueva ventana con solo los detalles de ese crimen específico y active la impresión.

---
*Estado: ¡Todas las tareas han sido completadas!*