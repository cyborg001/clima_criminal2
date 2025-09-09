# Project Completion Plan

**Backend Development (Stage 1)**

1.  **Project Setup**
    *   [x] Verify Django project and `api` app existence.
    *   [x] Verify `api` app is in `INSTALLED_APPS`.
    *   [x] Verify main URLs include `api` app URLs.

2.  **Database Configuration**
    *   [x] Ensure `DATABASES` in `core/settings.py` is configured for SQLite3.
    *   [x] Verify `NAME` points to `BASE_DIR / \'db.sqlite3\'`.

3.  **Model Definition (`api/models.py`)**
    *   [x] Define `Victima` model.
    *   [x] Define `Denuncia` model.
    *   [x] Define `ClimaCriminalidad` model.
    *   [x] Ensure `Criminalidad` model uses `ClimaCriminalidad` as ForeignKey.

4.  **Migrations**
    *   [x] Create initial migrations for all models (`python manage.py makemigrations api`).
    *   [x] Apply migrations to the database (`python manage.py migrate`).

5.  **Admin Registration (`api/admin.py`)**
    *   [x] Register `Victima`, `Denuncia`, `ClimaCriminalidad`, and `Criminalidad` models in `api/admin.py`.

6.  **Serializers (`api/serializers.py`)**
    *   [x] Create serializers for `Victima`, `Denuncia`, `ClimaCriminalidad`, and `Criminalidad` models using Django REST Framework\'s `ModelSerializer`.

7.  **Views (`api/views.py`)**
    *   [x] Create API views (e.g., `ViewSet` or `APIView`) for `Victima`, `Denuncia`, `ClimaCriminalidad`, and `Criminalidad` to handle CRUD operations.

8.  **URLs (`api/urls.py`)**
    *   [x] Define URL patterns for the API views.

9.  **Testing the API**
    *   [x] Start the Django development server (`python manage.py runserver`).
    *   [x] Test API endpoints using `curl` or a tool like Postman/Insomnia.
        *   [x] Verify data creation, retrieval, update, and deletion.

**Frontend Development (Stage 2)**

1.  **HTML Structure (`index.html`)**
    *   [x] Create basic HTML structure for a single-page application.
    *   [x] Implement a **fixed header** containing:
        *   [x] A "Home" button that calls a JavaScript function to display the introductory page with the heatmap. (Removed)
        *   [x] A navigation bar with three links/buttons:
            *   [x] Introductory page (map and daily statistics) - calls a function.
            *   [x] Report form page - calls a function.
            *   [x] Statistical reports page - calls a function.
        *   [x] A login section on the right side of the header.
    *   [x] Implement a **main content area** (`<div id=\"main-content\">`) where dynamic content will be loaded.
    *   [x] Implement a **fixed footer**.
    *   [x] **Add CDN links for Leaflet.js and Chart.js** in `index.html`.

2.  **CSS Styling (`style.css`)**
    *   [x] Apply basic styling for layout, fixed header, navigation bar, login section, main content area, and fixed footer.
    *   [x] Style for responsiveness.
    *   [x] **Add Leaflet.js CSS import**.
    *   [x] **Adjust styling to ensure login section is to the right of the navigation bar.**
    *   [x] **Add styling for the report form.**
    *   [x] **Add styling for statistical reports filters and charts.**

3.  **JavaScript Logic (`script.js`)**
    *   [x] **Core SPA Logic**:
        *   [x] Implement a function (e.g., `loadPage(pageName)`) that dynamically loads and displays content into the `main-content` area based on the `pageName` argument.
        *   [x] Attach event listeners to the "Home" button and navigation links to call `loadPage()` with the appropriate page name. (Removed event listener for "Home" button)
    *   [x] **Introductory Page (`loadIntroPage()` function)**:
        *   [x] Dynamically generate HTML for the introductory page within `main-content`.
        *   [x] Initialize Leaflet.js map and heatmap layer.
        *   [x] Fetch criminality data from the backend API to populate the heatmap.
        *   [x] Initialize Chart.js for daily crime statistics.
        *   [x] Fetch daily statistics from the backend API.
    *   [x] **Report Form Page (`loadReportFormPage()` function)**:
        *   [x] Dynamically generate HTML for the report form within `main-content`.
        *   [x] Create an HTML form for crime reporting with fields:
            *   [x] Denunciante (optional: name, address, phone, email)
            *   [x] Incident details (type of crime, date/time, description, location, involved parties, victim details)
        *   [x] Implement form validation.
        *   [x] Implement geolocation (e.g., using Leaflet.js map for location selection).
        *   [x] Send form data to the backend API (`/api/denuncias/`).
    *   [x] **Statistical Reports Page (`loadStatsPage()` function)**:
        *   [x] Dynamically generate HTML for the statistical reports within `main-content`.
        *   [x] Implement filters for crime type, region, and time (day, week, month, year).
        *   [x] Fetch filtered data from the backend API.
        *   [x] Display data using interactive charts (e.g., bar, line, scatter) and potentially update the heatmap based on filters.
    *   [x] **Login Logic**:
        *   [x] Implement basic login functionality (client-side, for now, no backend integration yet).

4.  **API Integration (Frontend)**
    *   [x] Implement JavaScript functions to make AJAX requests to the Django REST Framework backend for:
        *   [x] Fetching heatmap data.
        *   [x] Fetching daily statistics.
        *   [x] Submitting new crime reports.
        *   [x] Fetching filtered statistical data.

5.  **Deployment (Optional, beyond current scope)**
    *   [ ] Prepare for deployment (e.g., collect static files, configure web server).
