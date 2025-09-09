
const mainContent = document.getElementById('main-content');

// --- MODAL/LIGHTBOX LOGIC ---
function initializeReportModal() {
    const modal = document.getElementById('report-modal');
    const btn = document.getElementById('report-crime-btn');
    const span = document.getElementsByClassName('close-btn')[0];
    const formContainer = document.getElementById('report-form-container');
    let isFormLoaded = false;
    let locationMap = null;

    // Function to load form content via AJAX
    const loadForm = () => {
        if (isFormLoaded) return;

        // This is the HTML content from the old loadReportFormPage function
        formContainer.innerHTML = `
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
        isFormLoaded = true;
        attachFormListeners();
    };

    const initMap = () => {
        // Initialize map only if it hasn't been already
        if (locationMap) {
            locationMap.invalidateSize();
            return;
        }
        locationMap = L.map('locationMap').setView([18.7357, -70.1627], 8);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(locationMap);
        let marker;
        locationMap.on('click', function(e) {
            const { lat, lng } = e.latlng;
            document.getElementById('latitud').value = lat;
            document.getElementById('longitud').value = lng;
            if (marker) marker.setLatLng(e.latlng); else marker = L.marker(e.latlng).addTo(locationMap);
        });
    };

    // When the user clicks the button, open the modal 
    btn.onclick = function(e) {
        e.preventDefault(); // Prevent page jump
        loadForm();
        modal.style.display = "block";
        // We need to initialize or invalidate the map *after* the modal is visible
        setTimeout(initMap, 10); 
    }

    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
        modal.style.display = "none";
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
}

function attachFormListeners() {
    const crimeReportForm = document.getElementById('crimeReportForm');
    if (!crimeReportForm) return;

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

            const denunciaResponse = await fetch('/api/denuncias/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(denunciaData)
            });

            if (denunciaResponse.ok) {
                alert('¡Reporte enviado con éxito!');
                crimeReportForm.reset();
                document.getElementById('report-modal').style.display = 'none';
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


// --- STATS PAGE LOGIC ---
async function loadStatsPage() {
    mainContent.innerHTML = `
        <h2>Estadísticas</h2>
        <div class="filters" style="padding: 10px; background-color: #f5f5f5; border-radius: 5px; display: flex; flex-wrap: wrap; gap: 15px; align-items: center;">
            <div>
                <label for="filterCrimeType">Tipo de Crimen:</label>
                <select id="filterCrimeType">
                    <option value="all">Todos</option>
                    <option value="robo">Robo</option>
                    <option value="violacion">Violación</option>
                    <option value="homicidio">Homicidio</option>
                    <option value="feminicidio">Feminicidio</option>
                </select>
            </div>
            <div>
                <label for="filterProvince">Provincia:</label>
                <select id="filterProvince">
                    <option value="all">Todas</option>
                </select>
            </div>
            <div>
                <label for="filterTime">Periodo:</label>
                <select id="filterTime">
                    <option value="all">Todo</option>
                    <option value="today">Hoy</option>
                    <option value="week">Esta Semana</option>
                    <option value="month">Este Mes</option>
                    <option value="year">Este Año</option>
                </select>
            </div>
            <div>
                <label for="startDate">Desde:</label>
                <input type="date" id="startDate">
                <label for="endDate" style="margin-left: 5px;">Hasta:</label>
                <input type="date" id="endDate">
            </div>
            <div>
                <button id="applyFilters">Aplicar Filtros</button>
                <button id="generateReport">Generar Reporte General</button>
            </div>
        </div>
        <div class="stats-container">
            <div id="choroplethMap"></div>
            <div id="crimeTypeChartContainer" class="chart">
                <h3>Gráfico de Crímenes por Tipo</h3>
                <canvas id="crimeTypeChart"></canvas>
            </div>
            <div id="crimeTrendChartContainer" class="chart">
                <h3>Gráfico de Crímenes a lo largo del Tiempo</h3>
                <canvas id="crimeTrendChart"></canvas>
            </div>
        </div>
    `;

    let crimeTypeChartInstance = null;
    let crimeTrendChartInstance = null;
    let choroplethMap = L.map('choroplethMap').setView([18.7357, -70.1627], 8);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(choroplethMap);
    let geojsonLayer = null;
    
    let allProvincesGeoJSON = null;
    let dataWithProvinces = []; // Holds data augmented with province name, pre-province-filter
    let currentFilteredData = []; // Holds final data after all filters are applied

    // --- CORRECTED: Function to generate a report with new column order ---
    function generateReport(data, title) {
        const printWindow = window.open('', '_blank');
        let tableRows = data.map(d => `
            <tr>
                <td>${d.id}</td>
                <td>${d.tipo_crimen}</td>
                <td>${d.descripcion}</td>
                <td>${new Date(d.fecha).toLocaleString()}</td>
                <td>${d.latitud}, ${d.longitud}</td>
                <td>${d.provincia || 'N/A'}</td>
            </tr>
        `).join('');

        printWindow.document.write(`
            <html>
                <head><title>${title}</title>
                <style> table { width: 100%; border-collapse: collapse; } th, td { border: 1px solid black; padding: 8px; text-align: left; } </style>
                </head>
                <body>
                    <h1>${title}</h1>
                    <table>
                        <thead><tr><th>ID</th><th>Tipo</th><th>Descripción</th><th>Fecha</th><th>Ubicación</th><th>Provincia</th></tr></thead>
                        <tbody>${tableRows}</tbody>
                    </table>
                    <script>window.print(); setTimeout(() => window.close(), 500);</script>
                </body>
            </html>
        `);
        printWindow.document.close();
    }

    async function populateProvinceFilter() {
        try {
            const response = await fetch('/static/data/provincias.geojson');
            allProvincesGeoJSON = await response.json();
            const provinceFilter = document.getElementById('filterProvince');
            const provinceNames = allProvincesGeoJSON.features.map(f => f.properties.shapeName).sort();
            provinceNames.forEach(name => {
                const option = document.createElement('option');
                option.value = name;
                option.textContent = name;
                provinceFilter.appendChild(option);
            });
        } catch (error) {
            console.error("Could not load provinces for filter:", error);
        }
    }

    async function applyFiltersAndUpdateAll() {
        const crimeType = document.getElementById('filterCrimeType').value;
        const timePeriod = document.getElementById('filterTime').value;
        const startDateVal = document.getElementById('startDate').value;
        const endDateVal = document.getElementById('endDate').value;
        const selectedProvince = document.getElementById('filterProvince').value;

        let queryParams = new URLSearchParams();
        if (crimeType !== 'all') queryParams.append('tipo_crimen', crimeType);

        if (startDateVal && endDateVal) {
            queryParams.append('fecha__gte', new Date(startDateVal).toISOString());
            queryParams.append('fecha__lte', new Date(endDateVal).toISOString());
        } else if (timePeriod !== 'all') {
            const now = new Date();
            let startDate;
            switch (timePeriod) {
                case 'today': startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate()); break;
                case 'week': startDate = new Date(now.setDate(now.getDate() - now.getDay())); break;
                case 'month': startDate = new Date(now.getFullYear(), now.getMonth(), 1); break;
                case 'year': startDate = new Date(now.getFullYear(), 0, 1); break;
            }
            queryParams.append('fecha__gte', startDate.toISOString());
        }

        try {
            const response = await fetch(`/api/denuncias/?${queryParams.toString()}`);
            if (!response.ok) throw new Error('Failed to fetch data');
            let apiData = await response.json();

            apiData.forEach(crime => {
                const point = turf.point([crime.longitud, crime.latitud]);
                let found = false;
                for (const provinceFeature of allProvincesGeoJSON.features) {
                    if (turf.booleanPointInPolygon(point, provinceFeature)) {
                        crime.provincia = provinceFeature.properties.shapeName;
                        found = true;
                        break;
                    }
                }
                if (!found) crime.provincia = 'N/A';
            });
            dataWithProvinces = apiData;

            if (selectedProvince !== 'all') {
                currentFilteredData = dataWithProvinces.filter(crime => crime.provincia === selectedProvince);
            } else {
                currentFilteredData = dataWithProvinces;
            }

            updateCharts(currentFilteredData);
            updateChoroplethMap(currentFilteredData);

        } catch (error) {
            console.error("Error fetching or processing stats data:", error);
            alert("No se pudieron cargar las estadísticas.");
        }
    }

    function updateCharts(data) {
        const typeCounts = data.reduce((acc, d) => { acc[d.tipo_crimen] = (acc[d.tipo_crimen] || 0) + 1; return acc; }, {});
        const crimeLabels = {'robo': 'Robo', 'violacion': 'Violación', 'homicidio': 'Homicidio', 'feminicidio': 'Feminicidio'};
        const typeLabels = Object.keys(crimeLabels);
        const typeData = typeLabels.map(label => typeCounts[label] || 0);
        if (crimeTypeChartInstance) crimeTypeChartInstance.destroy();
        crimeTypeChartInstance = new Chart(document.getElementById('crimeTypeChart').getContext('2d'), {
            type: 'pie',
            data: { labels: typeLabels.map(l => crimeLabels[l]), datasets: [{ data: typeData, backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'] }] }
        });

        const trendCounts = data.reduce((acc, d) => { const date = d.fecha.split('T')[0]; acc[date] = (acc[date] || 0) + 1; return acc; }, {});
        const sortedDates = Object.keys(trendCounts).sort();
        if (crimeTrendChartInstance) crimeTrendChartInstance.destroy();
        crimeTrendChartInstance = new Chart(document.getElementById('crimeTrendChart').getContext('2d'), {
            type: 'line',
            data: { labels: sortedDates, datasets: [{ label: 'Incidentes', data: sortedDates.map(date => trendCounts[date]), borderColor: '#36A2EB', fill: false }] }
        });
    }

    async function updateChoroplethMap(mapData) {
        const crimeLabels = {'robo': 'Robo', 'violacion': 'Violación', 'homicidio': 'Homicidio', 'feminicidio': 'Feminicidio'};
        const counts = {};

        allProvincesGeoJSON.features.forEach(p => {
            counts[p.properties.shapeName] = {};
        });

        mapData.forEach(crime => {
            const provinceName = crime.provincia;
            if (provinceName && provinceName !== 'N/A') {
                const crimeType = crime.tipo_crimen;
                if (!counts[provinceName][crimeType]) {
                    counts[provinceName][crimeType] = 0;
                }
                counts[provinceName][crimeType]++;
            }
        });

        const totals = {};
        let maxCount = 0;
        for (const provinceName in counts) {
            let total = 0;
            for (const crimeType in counts[provinceName]) {
                total += counts[provinceName][crimeType];
            }
            totals[provinceName] = total;
            if (total > maxCount) maxCount = total;
        }

        const getColor = (count) => {
            if (count === 0) return '#FFFFFF';
            const ratio = count / maxCount;
            const red = Math.round(255 * ratio);
            const blue = Math.round(255 * (1 - ratio));
            return `rgb(${red},0,${blue})`;
        };

        if (geojsonLayer) choroplethMap.removeLayer(geojsonLayer);

        geojsonLayer = L.geoJson(allProvincesGeoJSON, {
            style: (feature) => ({
                fillColor: getColor(totals[feature.properties.shapeName] || 0),
                weight: 2, opacity: 1, color: 'white', dashArray: '3', fillOpacity: 0.7
            }),
            onEachFeature: (feature, layer) => {
                const provinceName = feature.properties.shapeName;
                const provinceCounts = counts[provinceName];
                const total = totals[provinceName] || 0;

                // Popup logic (on click)
                let popupContent = `<strong>${provinceName}</strong><br>Total de Casos: ${total}<br><hr style="margin: 5px 0;">`;
                if (total > 0) {
                    popupContent += '<div style="display: grid; grid-template-columns: auto auto; grid-gap: 2px 10px;">';
                    for (const type in provinceCounts) {
                        popupContent += `<span>${crimeLabels[type] || type}:</span><span style="text-align: right;">${provinceCounts[type]}</span>`;
                    }
                    popupContent += '</div>';
                } else {
                    popupContent += '<span>No hay casos reportados</span>';
                }
                popupContent += `<br><button class="province-report-btn" data-province="${provinceName}">Generar Reporte de Provincia</button>`;
                layer.bindPopup(popupContent);

                // Tooltip logic (on hover)
                layer.bindTooltip(provinceName);

                layer.on({
                    mouseover: (e) => {
                        const l = e.target;
                        l.setStyle({ weight: 5, color: '#666', dashArray: '' });
                        if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) l.bringToFront();
                    },
                    mouseout: (e) => { geojsonLayer.resetStyle(e.target); },
                    click: (e) => { choroplethMap.fitBounds(e.target.getBounds()); }
                });
            }
        }).addTo(choroplethMap);
    }

    // --- Event Listeners ---
    document.getElementById('applyFilters').addEventListener('click', applyFiltersAndUpdateAll);
    document.getElementById('generateReport').addEventListener('click', () => {
        const provinceName = document.getElementById('filterProvince').value;
        const title = provinceName === 'all' ? 'Reporte General de Crímenes' : `Reporte de Crímenes - ${provinceName}`;
        generateReport(currentFilteredData, title);
    });

    // --- CORRECTED: Delegated event listener for popup buttons ---
    document.getElementById('choroplethMap').addEventListener('click', (e) => {
        if (e.target && e.target.matches('.province-report-btn')) {
            const province = e.target.getAttribute('data-province');
            if (province) {
                const provinceData = dataWithProvinces.filter(crime => crime.provincia === province);
                generateReport(provinceData, `Reporte de Crímenes - ${province}`);
            }
        }
    });

    // --- Initial Load ---
    await populateProvinceFilter();
    applyFiltersAndUpdateAll();
}


// --- CASES (CASOS) PAGE LOGIC ---
function loadCasesMap() {
    mainContent.innerHTML = `
        <h2>Mapa de Casos</h2>
        <div class="filter-bar" style="width: 100%; box-sizing: border-box; padding: 10px; background-color: #f2f2f2; border-bottom: 1px solid #ddd; display: flex; flex-wrap: wrap; gap: 10px; align-items: center;">
            <button id="filter-today">Hoy</button>
            <button id="filter-week">Esta Semana</button>
            <button id="filter-month">Este Mes</button>
            <button id="filter-year">Este Año</button>
            <div class="custom-range">
                <label for="start-date">Desde:</label>
                <input type="date" id="start-date">
                <label for="end-date">Hasta:</label>
                <input type="date" id="end-date">
                <button id="filter-custom">Filtrar</button>
            </div>
        </div>
        <div id="markersmap" style="width: 100%; height: 80vh; border: 1px solid #ccc;"></div>
    `;

    const initialCoords = [18.7357, -70.1627];
    const initialZoom = 8;

    const markersmap = L.map('markersmap').setView(initialCoords, initialZoom);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap' }).addTo(markersmap);

    const markersLayer = L.layerGroup().addTo(markersmap);
    let currentData = [];
    let allProvincesGeoJSON = null; // To store province data

    // Fetch provinces once
    fetch('/static/data/provincias.geojson')
        .then(response => response.json())
        .then(data => {
            allProvincesGeoJSON = data;
            updateMaps(getApiUrl()); // Initial load
        })
        .catch(error => console.error("Could not load province geojson:", error));

    const updateMaps = (url) => {
        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (!allProvincesGeoJSON) {
                    console.error("Province data not loaded yet.");
                    return;
                }

                // Augment data with province
                data.forEach(crime => {
                    const point = turf.point([crime.longitud, crime.latitud]);
                    let found = false;
                    for (const provinceFeature of allProvincesGeoJSON.features) {
                        if (turf.booleanPointInPolygon(point, provinceFeature)) {
                            crime.provincia = provinceFeature.properties.shapeName;
                            found = true;
                            break;
                        }
                    }
                    if (!found) crime.provincia = 'N/A';
                });

                currentData = data;
                markersLayer.clearLayers();
                data.forEach(denuncia => {
                    if (denuncia.latitud && denuncia.longitud) {
                        const popupContent = `
                            <b>Tipo:</b> ${denuncia.tipo_crimen}<br>
                            <b>Provincia:</b> ${denuncia.provincia || 'N/A'}<br>
                            <b>Descripción:</b> ${denuncia.descripcion}<br>
                            <b>Fecha:</b> ${new Date(denuncia.fecha).toLocaleString()}<br><br>
                            <button class="print-btn" data-id="${denuncia.id}">Imprimir Detalle</button>
                        `;
                        L.marker([denuncia.latitud, denuncia.longitud]).addTo(markersLayer).bindPopup(popupContent);
                    }
                });
            })
            .catch(error => {
                console.error('Error al cargar las denuncias:', error);
            });
    };

    // Delegated event listener for the print button
    document.getElementById('markersmap').addEventListener('click', (e) => {
        if (e.target && e.target.matches('.print-btn')) {
            const denunciaId = e.target.getAttribute('data-id');
            const denuncia = currentData.find(d => d.id == denunciaId);
            if (denuncia) {
                const printWindow = window.open('', '_blank');
                printWindow.document.write(`
                    <html><head><title>Detalle de Crimen</title></head><body>
                    <h1>Detalle de Crimen</h1>
                    <p><b>ID:</b> ${denuncia.id}</p>
                    <p><b>Tipo:</b> ${denuncia.tipo_crimen}</p>
                    <p><b>Provincia:</b> ${denuncia.provincia || 'N/A'}</p>
                    <p><b>Descripción:</b> ${denuncia.descripcion}</p>
                    <p><b>Fecha:</b> ${new Date(denuncia.fecha).toLocaleString()}</p>
                    <p><b>Ubicación:</b> Lat: ${denuncia.latitud}, Lon: ${denuncia.longitud}</p>
                    <script>window.print(); setTimeout(() => window.close(), 500);</script>
                    </body></html>
                `);
                printWindow.document.close();
            }
        }
    });

    const getApiUrl = (params = {}) => {
        const url = new URL('/api/denuncias/', window.location.origin);
        Object.keys(params).forEach(key => { if (params[key]) url.searchParams.append(key, params[key]); });
        return url;
    };

    const toISODateString = (date) => date.toISOString().split('T')[0];

    document.getElementById('filter-today').addEventListener('click', () => {
        const today = new Date();
        const dateStr = toISODateString(today);
        updateMaps(getApiUrl({ fecha__gte: dateStr, fecha__lte: dateStr }));
    });
    document.getElementById('filter-week').addEventListener('click', () => {
        const today = new Date();
        const firstDayOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
        const lastDayOfWeek = new Date(firstDayOfWeek); lastDayOfWeek.setDate(lastDayOfWeek.getDate() + 6);
        updateMaps(getApiUrl({ fecha__gte: toISODateString(firstDayOfWeek), fecha__lte: toISODateString(lastDayOfWeek) }));
    });
    document.getElementById('filter-month').addEventListener('click', () => {
        const today = new Date();
        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        updateMaps(getApiUrl({ fecha__gte: toISODateString(firstDayOfMonth), fecha__lte: toISODateString(lastDayOfMonth) }));
    });
    document.getElementById('filter-year').addEventListener('click', () => {
        const today = new Date();
        const firstDayOfYear = new Date(today.getFullYear(), 0, 1);
        const lastDayOfYear = new Date(today.getFullYear(), 11, 31);
        updateMaps(getApiUrl({ fecha__gte: toISODateString(firstDayOfYear), fecha__lte: toISODateString(lastDayOfYear) }));
    });
    document.getElementById('filter-custom').addEventListener('click', () => {
        const startDate = document.getElementById('start-date').value;
        const endDate = document.getElementById('end-date').value;
        if (!startDate || !endDate) { alert('Por favor, seleccione una fecha de inicio y una de fin.'); return; }
        updateMaps(getApiUrl({ fecha__gte: startDate, fecha__lte: endDate }));
    });
}

// --- GLOBAL INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    initializeReportModal();
});
