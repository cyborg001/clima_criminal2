// script.js

let map = null; // Global variable to hold the map instance

document.addEventListener('DOMContentLoaded', () => {
    const mainContent = document.getElementById('main-content');
    const introPageButton = document.getElementById('intro-page-button');
    const reportFormButton = document.getElementById('report-form-button');
    const statsPageButton = document.getElementById('stats-page-button');

    // Function to load content dynamically
    function loadPage(pageName) {
        mainContent.innerHTML = ''; // Clear current content
        if (map) {
            map.remove(); // Remove map instance if it exists
            map = null;
        }
        switch (pageName) {
            case 'intro':
                loadIntroPage();
                break;
            case 'report':
                loadReportFormPage();
                break;
            case 'stats':
                loadStatsPage();
                break;
            default:
                loadIntroPage(); // Default to intro page
        }
    }

    // Functions for page content
    async function loadIntroPage() {
        mainContent.innerHTML = `
            <h2>Página Introductoria: Mapa de Calor y Estadísticas Diarias</h2>
            <div style="display: flex; justify-content: space-around; flex-wrap: wrap;">
                <div id="mapid" style="width: 60%; height: 500px;"></div>
                <div style="width: 35%;">
                    <h3>Estadísticas del Día</h3>
                    <canvas id="dailyStatsChart"></canvas>
                </div>
            </div>
        `;

        // Initialize Leaflet Map
        map = L.map('mapid').setView([18.7357, -70.1627], 8); // Centered on Dominican Republic
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        try {
            // Fetch data from the backend API
            const response = await fetch('http://127.0.0.1:8000/api/denuncias/');
            print(response)
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const denuncias = await response.json();

            // --- Heatmap Logic ---
            const heatData = denuncias.map(denuncia => [denuncia.latitud, denuncia.longitud, 0.6]); // Using a fixed intensity
            L.heatLayer(heatData).addTo(map);

            // --- Daily Stats Chart Logic ---
            const today = new Date().toISOString().slice(0, 10); // Get YYYY-MM-DD
            const dailyStats = {
                'robo': 0,
                'violacion': 0,
                'homicidio': 0,
                'feminicidio': 0
            };
            const labels = {
                'robo': 'Robo',
                'violacion': 'Violación',
                'homicidio': 'Homicidio',
                'feminicidio': 'Feminicidio'
            };

            denuncias.forEach(denuncia => {
                if (denuncia.fecha.startsWith(today)) {
                    if (dailyStats.hasOwnProperty(denuncia.tipo_crimen)) {
                        dailyStats[denuncia.tipo_crimen]++;
                    }
                }
            });

            const chartLabels = Object.keys(dailyStats).map(key => labels[key]);
            const chartData = Object.values(dailyStats);

            // Initialize Chart.js with fetched data
            const ctx = document.getElementById('dailyStatsChart').getContext('2d');
            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: chartLabels,
                    datasets: [{
                        label: 'Incidentes de Hoy',
                        data: chartData,
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 206, 86, 0.2)',
                            'rgba(75, 192, 192, 0.2)'
                        ],
                        borderColor: [
                            'rgba(255, 99, 132, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: { 
                                stepSize: 1 // Ensure y-axis increments by whole numbers
                            }
                        }
                    }
                }
            });

        } catch (error) {
            console.error("Could not fetch data for intro page:", error);
            alert("No se pudieron cargar los datos para la página de introducción.");
        }
    }

    function loadReportFormPage() {
        mainContent.innerHTML = `
            <h2>Reportar un Crimen</h2>
            <form id="crimeReportForm">
                <h3>Detalles del Incidente</h3>
                
                <label for="crimeType">Tipo de Crimen:</label>
                <select id="crimeType" name="tipo_crimen" required>
                    <option value="">Seleccione...</option>
                    <option value="robo">Robo</option>
                    <option value="violacion">Violación</option>
                    <option value="homicidio">Homicidio</option>
                    <option value="feminicidio">Feminicidio</option>
                </select><br><br>

                <label for="incidentDate">Fecha y Hora:</label>
                <input type="datetime-local" id="incidentDate" name="fecha" required><br><br>

                <label for="description">Descripción del Crimen:</label><br>
                <textarea id="description" name="descripcion" rows="5" required></textarea><br><br>

                <label for="locationMap">Ubicación del Crimen (haga clic en el mapa):</label>
                <div id="locationMap" style="height: 300px; width: 100%; margin-bottom: 15px; border-radius: 4px;"></div>
                <input type="hidden" id="latitud" name="latitud" required>
                <input type="hidden" id="longitud" name="longitud" required>

                <hr>

                <h3>Detalles de la Víctima (Opcional)</h3>
                <label for="hasVictims">¿Añadir detalles de la víctima?</label>
                <input type="checkbox" id="hasVictims" name="hasVictims"><br><br>

                <div id="victimDetails" style="display: none;">
                    <label for="victimName">Nombre de la Víctima:</label>
                    <input type="text" id="victimName" name="nombre"><br><br>

                    <label for="victimAge">Edad de la Víctima:</label>
                    <input type="number" id="victimAge" name="edad"><br><br>

                    <label for="victimType">Tipo de Víctima:</label>
                    <select id="victimType" name="tipo_victima">
                        <option value="">Seleccione...</option>
                        <option value="agredida">Agredida</option>
                        <option value="asesinada">Asesinada</option>
                        <option value="otra">Otra</option>
                    </select><br><br>
                </div>

                <hr>
                
                <h3>Detalles del Denunciante</h3>
                <label for="isAnonymous">Soy un denunciante anónimo</label>
                <input type="checkbox" id="isAnonymous" name="isAnonymous" checked><br><br>

                <div id="denuncianteDetails" style="display: none;">
                    <label for="cedula">Cédula de Identidad:</label>
                    <input type="text" id="cedula" name="cedula_denunciante"><br><br>
                </div>

                <button type="submit">Enviar Reporte</button>
            </form>
        `;

        // Map initialization
        const locationMap = L.map('locationMap').setView([18.7357, -70.1627], 8);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(locationMap);
        let marker;
        locationMap.on('click', function(e) {
            const { lat, lng } = e.latlng;
            document.getElementById('latitud').value = lat;
            document.getElementById('longitud').value = lng;
            if (marker) marker.setLatLng(e.latlng); else marker = L.marker(e.latlng).addTo(locationMap);
        });

        // Form logic
        const crimeReportForm = document.getElementById('crimeReportForm');
        const hasVictimsCheckbox = document.getElementById('hasVictims');
        const victimDetailsDiv = document.getElementById('victimDetails');
        const isAnonymousCheckbox = document.getElementById('isAnonymous');
        const denuncianteDetailsDiv = document.getElementById('denuncianteDetails');

        hasVictimsCheckbox.addEventListener('change', () => {
            victimDetailsDiv.style.display = hasVictimsCheckbox.checked ? 'block' : 'none';
        });

        isAnonymousCheckbox.addEventListener('change', () => {
            denuncianteDetailsDiv.style.display = isAnonymousCheckbox.checked ? 'none' : 'block';
        });

        crimeReportForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const formData = new FormData(crimeReportForm);

            if (!formData.get('tipo_crimen') || !formData.get('fecha') || !formData.get('latitud')) {
                alert('Por favor complete los campos de incidente requeridos y seleccione una ubicación.');
                return;
            }

            const denunciaData = {
                tipo_crimen: formData.get('tipo_crimen'),
                fecha: formData.get('fecha'),
                descripcion: formData.get('descripcion'),
                latitud: parseFloat(formData.get('latitud')),
                longitud: parseFloat(formData.get('longitud')),
                victima: null,
                cedula_denunciante: null
            };

            if (!isAnonymousCheckbox.checked) {
                const cedula = formData.get('cedula_denunciante');
                if (!cedula) {
                    alert('Por favor, ingrese su cédula de identidad para reportar como usuario registrado.');
                    return;
                }
                denunciaData.cedula_denunciante = cedula;
            }

            try {
                if (hasVictimsCheckbox.checked) {
                    const victimData = {
                        nombre: formData.get('nombre'),
                        edad: formData.get('edad') ? parseInt(formData.get('edad')) : null,
                        tipo_victima: formData.get('tipo_victima')
                    };

                    if (victimData.nombre || victimData.tipo_victima) {
                        if (!victimData.tipo_victima) {
                            alert('El "Tipo de Víctima" es obligatorio si se añaden detalles de la víctima.');
                            return;
                        }
                        const victimaResponse = await fetch('http://127.0.0.1:8000/api/victimas/', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(victimData)
                        });

                        if (!victimaResponse.ok) {
                            const errorData = await victimaResponse.json();
                            throw new Error(`Error al crear la víctima: ${JSON.stringify(errorData)}`);
                        }
                        const nuevaVictima = await victimaResponse.json();
                        denunciaData.victima = nuevaVictima.id;
                    }
                }

                const denunciaResponse = await fetch('http://127.0.0.1:8000/api/denuncias/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(denunciaData)
                });

                if (denunciaResponse.ok) {
                    alert('¡Reporte enviado con éxito!');
                    crimeReportForm.reset();
                    victimDetailsDiv.style.display = 'none';
                    denuncianteDetailsDiv.style.display = 'none';
                    isAnonymousCheckbox.checked = true;
                    if (marker) marker.remove();
                } else {
                    const errorData = await denunciaResponse.json();
                    throw new Error(JSON.stringify(errorData));
                }
            } catch (error) {
                console.error('Error al enviar el reporte:', error);
                alert(`Error al enviar el reporte: ${error.message}`);
            }
        });
    }

    function loadStatsPage() {
        mainContent.innerHTML = `
            <h2>Informes Estadísticos</h2>
            <div class="filters">
                <label for="filterCrimeType">Tipo de Crimen:</label>
                <select id="filterCrimeType">
                    <option value="all">Todos</option>
                    <option value="robo">Robo</option>
                    <option value="violacion">Violación</option>
                    <option value="homicidio">Homicidio</option>
                    <option value="feminicidio">Feminicidio</option>
                </select>

                <label for="filterTime">Periodo de Tiempo:</label>
                <select id="filterTime">
                    <option value="all">Todo</option>
                    <option value="today">Hoy</option>
                    <option value="week">Esta Semana</option>
                    <option value="month">Este Mes</option>
                    <option value="year">Este Año</option>
                </select>
                <button id="applyFilters">Aplicar Filtros</button>
            </div>
            <div class="charts">
                <div id="crimeTypeChartContainer">
                    <h3>Gráfico de Crímenes por Tipo</h3>
                    <canvas id="crimeTypeChart"></canvas>
                </div>
                <div id="crimeTrendChartContainer">
                    <h3>Gráfico de Crímenes a lo largo del Tiempo</h3>
                    <canvas id="crimeTrendChart"></canvas>
                </div>
            </div>
        `;

        let crimeTypeChartInstance = null;
        let crimeTrendChartInstance = null;

        const applyFiltersButton = document.getElementById('applyFilters');

        async function updateCharts() {
            const crimeType = document.getElementById('filterCrimeType').value;
            const timePeriod = document.getElementById('filterTime').value;

            let queryParams = new URLSearchParams();

            if (crimeType !== 'all') {
                queryParams.append('tipo_crimen', crimeType);
            }

            const now = new Date();
            let startDate;
            if (timePeriod !== 'all') {
                switch (timePeriod) {
                    case 'today':
                        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                        break;
                    case 'week':
                        startDate = new Date(now.setDate(now.getDate() - now.getDay()));
                        break;
                    case 'month':
                        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                        break;
                    case 'year':
                        startDate = new Date(now.getFullYear(), 0, 1);
                        break;
                }
                queryParams.append('fecha__gte', startDate.toISOString());
            }

            try {
                const response = await fetch(`http://127.0.0.1:8000/api/denuncias/?${queryParams.toString()}`);
                if (!response.ok) throw new Error('Failed to fetch data');
                const data = await response.json();

                // Update Crime Type Chart
                const typeCounts = data.reduce((acc, denuncia) => {
                    acc[denuncia.tipo_crimen] = (acc[denuncia.tipo_crimen] || 0) + 1;
                    return acc;
                }, {});
                
                const crimeLabels = {'robo': 'Robo', 'violacion': 'Violación', 'homicidio': 'Homicidio', 'feminicidio': 'Feminicidio'};
                const typeLabels = Object.keys(crimeLabels);
                const typeData = typeLabels.map(label => typeCounts[label] || 0);

                if (crimeTypeChartInstance) crimeTypeChartInstance.destroy();
                crimeTypeChartInstance = new Chart(document.getElementById('crimeTypeChart').getContext('2d'), {
                    type: 'pie',
                    data: {
                        labels: typeLabels.map(l => crimeLabels[l]),
                        datasets: [{ data: typeData, backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'] }]
                    }
                });

                // Update Crime Trend Chart
                const trendCounts = data.reduce((acc, denuncia) => {
                    const date = denuncia.fecha.split('T')[0];
                    acc[date] = (acc[date] || 0) + 1;
                    return acc;
                }, {});
                const sortedDates = Object.keys(trendCounts).sort();
                const trendLabels = sortedDates;
                const trendData = sortedDates.map(date => trendCounts[date]);

                if (crimeTrendChartInstance) crimeTrendChartInstance.destroy();
                crimeTrendChartInstance = new Chart(document.getElementById('crimeTrendChart').getContext('2d'), {
                    type: 'line',
                    data: {
                        labels: trendLabels,
                        datasets: [{ label: 'Incidentes', data: trendData, borderColor: '#36A2EB', fill: false }]
                    }
                });

            } catch (error) {
                console.error("Error fetching or processing stats data:", error);
                alert("No se pudieron cargar las estadísticas.");
            }
        }

        applyFiltersButton.addEventListener('click', updateCharts);

        // Initial chart load
        updateCharts();
    }

    // Event Listeners
    introPageButton.addEventListener('click', () => loadPage('intro'));
    reportFormButton.addEventListener('click', () => loadPage('report'));
    statsPageButton.addEventListener('click', () => loadPage('stats'));

    // Load the introductory page by default when the app loads
    loadPage('intro');
});

// Basic Login Logic (client-side only for now)
// TODO: Implement actual login functionality with backend integration
const loginButton = document.querySelector('.login-section button');
loginButton.addEventListener('click', () => {
    const username = document.querySelector('.login-section input[type="text"]').value;
    const password = document.querySelector('.login-section input[type="password"]').value;
    console.log(`Attempting to login with Username: ${username}, Password: ${password}`);
    alert('Login functionality not yet implemented.');
});