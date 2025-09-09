# Plan de Desarrollo del Backend (Etapa 1)

**Pasos:**

1.  **Configuración del Proyecto (Ya hecho, pero re-verificar)**
    *   [x] Verificar Django project y `api` app existencia.
    *   [x] Verificar `api` app es en `INSTALLED_APPS`.
    *   [x] Verificar main URLs incluyen `api` app URLs.

2.  **Database Configuration (Ya hecho, pero re-verificar)**
    *   [x] Asegurar `DATABASES` en `core/settings.py` es configurado para SQLite3.
    *   [x] Verificar `NAME` apunta a `BASE_DIR / 'db.sqlite3'`.

3.  **Model Definition (`api/models.py`)**
    *   [x] Definir `Victima` model (ya existe, verificar campos).
        *   `nombre` (CharField)
        *   `edad` (IntegerField)
        *   `tipo_victima` (CharField con choices)
    *   [x] Definir `Denuncia` model (ya existe, verificar campos).
        *   `tipo_crimen` (CharField con choices)
        *   `descripcion` (TextField)
        *   `fecha` (DateTimeField)
        *   `latitud` (FloatField)
        *   `longitud` (FloatField)
        *   `victima` (ForeignKey a Victima)
        *   `denunciante` (ForeignKey a User)
    *   [x] Definir `ClimaCriminalidad` model (renombrado de `Clima`, verificar campos).
        *   `area_geografica` (CharField)
        *   `latitud` (FloatField)
        *   `longitud` (FloatField)
        *   `nivel_criminalidad` (FloatField)
        *   `fecha_actualizacion` (DateField)
    *   [x] Asegurar `Criminalidad` model usa `ClimaCriminalidad` como ForeignKey (ya hecho, verificar).
        *   `fecha` (DateField)
        *   `tipo_delito` (CharField)
        *   `ubicacion` (CharField)
        *   `numero_incidentes` (IntegerField)
        *   `clima_criminalidad` (ForeignKey a ClimaCriminalidad)

4.  **Migraciones**
    *   [x] Crear initial migraciones para todos los models (`python manage.py makemigrations api`).
    *   [x] Aplicar migraciones a la database (`python manage.py migrate`).

5.  **Admin Registration (`api/admin.py`)**
    *   [x] Registrar `Victima`, `Denuncia`, `ClimaCriminalidad`, y `Criminalidad` models en `api/admin.py`.

6.  **Serializers (`api/serializers.py`)**
    *   [x] Crear serializers para `Victima`, `Denuncia`, `ClimaCriminalidad`, y `Criminalidad` models usando Django REST Framework's `ModelSerializer`.

7.  **Views (`api/views.py`)**
    *   [x] Crear API views (e.g., `ViewSet` o `APIView`) para `Victima`, `Denuncia`, `ClimaCriminalidad`, y `Criminalidad` para manejar CRUD operations.
        *   Considerar `ListCreateAPIView`, `RetrieveUpdateDestroyAPIView`, o `ModelViewSet`.

8.  **URLs (`api/urls.py`)**
    *   [x] Definir URL patterns para la API views.
        *   Usar `DefaultRouter` para `ViewSet`s o `path()` para `APIView`s.

9.  **Testing the API**
    *   [ ] Iniciar el Django development server (`python manage.py runserver`).
    *   [ ] Test API endpoints usando `curl` o una herramienta como Postman/Insomnia (I will provide `curl` examples).
        *   [ ] Verificar data creation, retrieval, update, y deletion.