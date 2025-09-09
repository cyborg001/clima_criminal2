# Guía de Despliegue de Django en PythonAnywhere

Esta guía detalla los pasos para desplegar la aplicación **Clima Criminal** en un servidor de PythonAnywhere.

### Prerrequisitos

1.  **Cuenta en PythonAnywhere:** [Crea una cuenta gratuita](https://www.pythonanywhere.com/pricing/).
2.  **Git y GitHub:** Tu proyecto debe estar en un repositorio de Git. Súbelo a un servicio como [GitHub](https://github.com/).
3.  **Ajustes de Producción:** Asegúrate de que tu archivo `requirements.txt` está actualizado con todas las dependencias del proyecto.

---

### Paso 1: Preparar el Proyecto para Producción

Antes de subir tu código, es crucial ajustar la configuración de Django para un entorno de producción.

1.  **Edita `core/settings.py`:**
    *   **`DEBUG`**: Cambia `DEBUG = True` a `DEBUG = False`.
    *   **`ALLOWED_HOSTS`**: Agrega el dominio de PythonAnywhere.
        ```python
        # Reemplaza <tu-usuario> con tu nombre de usuario de PythonAnywhere
        ALLOWED_HOSTS = ['<tu-usuario>.pythonanywhere.com']
        ```
    *   **`STATIC_ROOT`**: Define la carpeta donde se recolectarán todos los archivos estáticos.
        ```python
        # Añade esto al final de la sección de archivos estáticos
        STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
        ```

2.  **Guarda los cambios y súbelos a tu repositorio de GitHub.**
    ```bash
    git add .
    git commit -m "Configuración para despliegue en producción"
    git push
    ```

---

### Paso 2: Subir el Código a PythonAnywhere

1.  **Abre una consola Bash:** En tu panel de control de PythonAnywhere, ve a la pestaña **Consoles** y abre una **Bash console**.

2.  **Clona tu repositorio:**
    ```bash
    # Reemplaza la URL con la de tu repositorio
    git clone https://github.com/tu-usuario/clima_criminal.git
    ```

---

### Paso 3: Crear el Entorno Virtual

1.  **Crea el entorno virtual:** En la misma consola Bash, ejecuta el siguiente comando. Asegúrate de usar la misma versión de Python que usaste en tu desarrollo.
    ```bash
    # Reemplaza "3.10" con tu versión de Python si es diferente
    mkvirtualenv --python=/usr/bin/python3.10 clima-criminal-env
    ```
    Tu consola cambiará para mostrar que el entorno virtual está activo `(clima-criminal-env)`.

2.  **Instala las dependencias:**
    ```bash
    cd clima_criminal
    pip install -r requirements.txt
    ```

---

### Paso 4: Configurar la Aplicación Web

1.  **Ve a la pestaña "Web":** En el panel de control de PythonAnywhere, haz clic en la pestaña **Web**.

2.  **Crea una nueva aplicación web:**
    *   Haz clic en **"Add a new web app"**.
    *   Sigue los pasos. Cuando te pregunten por el framework, selecciona **"Manual configuration"** (¡MUY IMPORTANTE!).
    *   Selecciona la versión de Python que coincida con tu entorno virtual (ej: Python 3.10).

3.  **Configura las rutas:** En la sección **Code** de la pestaña **Web**, establece las rutas:
    *   **Source code:** `/home/<tu-usuario>/clima_criminal/`
    *   **Working directory:** `/home/<tu-usuario>/clima_criminal/`
    *   **Virtualenv:** `/home/<tu-usuario>/.virtualenvs/clima-criminal-env`

    *Recuerda reemplazar `<tu-usuario>` con tu nombre de usuario real.*

---

### Paso 5: Configurar el Archivo WSGI

Este es el paso más importante para que PythonAnywhere se comunique con tu aplicación Django.

1.  **Edita el archivo WSGI:** En la sección **Code**, haz clic en el enlace del archivo WSGI (ej: `/var/www/<tu-usuario>_pythonanywhere_com_wsgi.py`).

2.  **Reemplaza todo el contenido** con el siguiente código:
    ```python
    import os
    import sys

    # Ruta al directorio de tu proyecto
    path = '/home/<tu-usuario>/clima_criminal'
    if path not in sys.path:
        sys.path.insert(0, path)

    # Establece el módulo de configuración de Django
    os.environ['DJANGO_SETTINGS_MODULE'] = 'core.settings'

    # Carga la aplicación WSGI de Django
    from django.core.wsgi import get_wsgi_application
    application = get_wsgi_application()
    ```
    *No olvides reemplazar `<tu-usuario>` y guardar los cambios.*

---

### Paso 6: Configurar Archivos Estáticos y Base de Datos

1.  **Configura los archivos estáticos:**
    *   En la pestaña **Web**, ve a la sección **Static files**.
    *   Crea un nuevo mapeo:
        *   **URL:** `/static/`
        *   **Directory:** `/home/<tu-usuario>/clima_criminal/staticfiles`

2.  **Recolecta los archivos estáticos:**
    *   Vuelve a tu consola Bash (asegúrate de que el entorno virtual `clima-criminal-env` esté activo).
    *   Ejecuta el comando `collectstatic`:
        ```bash
        # (clima-criminal-env) ~$ cd ~/clima_criminal
        # (clima-criminal-env) ~/clima_criminal$ python manage.py collectstatic
        ```

3.  **Ejecuta las migraciones de la base de datos:**
    *   Tu proyecto usa `db.sqlite3`, que funcionará bien para empezar.
    *   En la misma consola, ejecuta las migraciones:
        ```bash
        python manage.py migrate
        ```

---

### Paso 7: Recargar y Probar

1.  **Recarga la aplicación:** Vuelve a la pestaña **Web** y haz clic en el gran botón verde **Reload <tu-usuario>.pythonanywhere.com**.

2.  **¡Prueba tu sitio!** Visita tu URL (`https://<tu-usuario>.pythonanywhere.com`) y verifica que todo funcione correctamente.

Si encuentras errores, revisa los registros de errores (**Error log** y **Server log**) en la pestaña **Web** para diagnosticar el problema.
