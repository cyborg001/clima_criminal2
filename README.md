# Clima Criminal - Visualizador de Datos de Criminalidad

## 1. Objetivo del Proyecto

El objetivo de **Clima Criminal** es proporcionar una plataforma interactiva para la visualización y análisis de datos de criminalidad en la República Dominicana. La aplicación permite a los usuarios reportar incidentes, explorar datos a través de mapas de calor y mapas coropléticos, y generar reportes estadísticos basados en diversos filtros.

---

## 2. Características Principales

- **Página Principal**: Muestra un mapa de calor con la concentración de crímenes reportados hoy y un gráfico con las estadísticas del día.
- **Reportar un Crimen**: Un formulario completo para que los usuarios puedan reportar nuevos incidentes, incluyendo tipo de crimen, fecha, descripción y ubicación en un mapa interactivo.
- **Página de Estadísticas**: Una vista analítica avanzada con:
    - Un mapa coroplético que colorea las provincias según la cantidad de crímenes.
    - Filtros por tipo de crimen, provincia y rangos de fecha.
    - Gráficos de pastel y de líneas que se actualizan dinámicamente.
    - Popups interactivos en el mapa con desglose de crímenes por tipo.
    - Generación de reportes en formato imprimible, tanto generales como por provincia.
- **Mapa de Criminalidad**: Una vista de mapa dual que sincroniza un mapa de calor con un mapa de marcadores individuales para una exploración detallada.

---

## 3. Requisitos Previos

- Python 3.8 o superior
- `pip` (manejador de paquetes de Python)

---

## 4. Instalación y Puesta en Marcha

Sigue estos pasos para instalar y ejecutar el proyecto en tu máquina local:

1.  **Clonar el Repositorio** (si aún no lo has hecho):
    ```bash
    git clone <URL_DEL_REPOSITORIO>
    cd clima_criminal
    ```

2.  **Crear y Activar un Entorno Virtual**:
    Es una buena práctica aislar las dependencias del proyecto.

    ```bash
    # Crear el entorno virtual
    python -m venv .venv

    # Activar en Windows
    .venv\Scripts\activate

    # Activar en macOS/Linux
    # source .venv/bin/activate
    ```

3.  **Instalar las Dependencias**:
    El archivo `requirements.txt` contiene todas las librerías de Python necesarias.
    ```bash
    pip install -r requirements.txt
    ```

4.  **Aplicar las Migraciones de la Base de Datos**:
    Esto creará la base de datos SQLite y las tablas necesarias.
    ```bash
    python manage.py migrate
    ```

5.  **Poblar la Base de Datos (Opcional)**:
    El proyecto incluye un comando para llenar la base de datos con datos de ejemplo.
    ```bash
    python manage.py seed_crimes
    ```

6.  **Ejecutar el Servidor de Desarrollo**:
    ```bash
    python manage.py runserver
    ```

7.  **Acceder a la Aplicación**:
    Abre tu navegador web y ve a la siguiente dirección: `http://127.0.0.1:8000/`

---

## 5. Modo de Uso

- **Navegación**: Utiliza los enlaces en la barra de navegación superior para moverte entre las diferentes páginas: `Inicio`, `Reportar`, `Estadísticas` y `Mapa`.

- **Página de Estadísticas**:
    - Usa los menús desplegables para filtrar los datos por **tipo de crimen**, **provincia** o **periodo de tiempo**.
    - Haz clic en **"Aplicar Filtros"** para que el mapa y los gráficos se actualicen.
    - Pasa el cursor sobre una provincia para ver su nombre y haz clic para ver un desglose de los crímenes.
    - Dentro del popup, puedes generar un **reporte específico para esa provincia**.
    - Usa el botón **"Generar Reporte General"** para imprimir los datos que están actualmente filtrados.

- **Página de Mapa**:
    - Usa los botones de filtro de fecha para actualizar los datos que se muestran en los mapas de calor y de marcadores.
    - Haz clic en cualquier marcador para ver los detalles del crimen y usar el botón **"Imprimir Detalle"**.
