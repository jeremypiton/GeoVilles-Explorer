// ============================================================
// GeoVilles Explorer — DOM Builder
// Génère toute la structure HTML avec D3.js
// ============================================================

(function () {
    'use strict';

    // Le <div id="root"> existe déjà dans le HTML (avant les scripts)
    // On construit le DOM de manière synchrone, directement.
    buildDOM();

    function buildDOM() {
        // Sélectionner le conteneur racine
        var root = d3.select('#root');

        // Créer la structure principale de l'app avec d3
        var app = root.append('div')
            .attr('class', 'app');

        // ===== CONSTRUCTION DE LA SIDEBAR =====
        buildSidebar(app);

        // ===== OVERLAY MOBILE =====
        app.append('div')
            .attr('class', 'sidebar-overlay')
            .attr('id', 'sidebar-overlay');

        // ===== ZONE PRINCIPALE =====
        var main = app.append('div')
            .attr('class', 'main');

        // ===== TOPBAR =====
        buildTopbar(main);

        // ===== CONTENU SCROLLABLE =====
        var content = main.append('div')
            .attr('class', 'content');

        // ===== CONSTRUCTION DES ONGLETS =====
        buildTabCarte(content);
        buildTabGeneral(content);
        buildTabEmploi(content);
        buildTabLogement(content);
        buildTabMeteo(content);
        buildTabDemographie(content);
        buildTabEducation(content);
        buildTabTransports(content);
        buildTabQualite(content);

        // ===== FOOTER =====
        main.append('footer')
            .attr('id', 'footer')
            .append('p')
            .html('Données : INSEE · Open-Meteo · API Géo&ensp;·&ensp;Réalisé avec D3.js v4&ensp;·&ensp;BUT Science des Données S4');

        // ===== MODAL SUPPRESSION =====
        buildDeleteModal(root);

        // ===== TOOLTIP GLOBAL =====
        root.append('div')
            .attr('id', 'tooltip')
            .attr('class', 'tooltip');

        // Afficher l'email de l'utilisateur
        updateUserEmail();

        // Afficher l'app avec animation
        // (utiliser setTimeout pour laisser le navigateur peindre d'abord)
        setTimeout(function () {
            app.style('opacity', '1');
        }, 50);
    }

    // ===== CONSTRUCTION DE LA SIDEBAR =====
    function buildSidebar(container) {
        var sidebar = container.append('aside')
            .attr('class', 'sidebar')
            .attr('id', 'sidebar');

        // Brand
        sidebar.append('div')
            .attr('class', 'sidebar-brand')
            .append('span')
            .attr('class', 'brand-text')
            .text('GeoVilles Explorer');

        // Navigation
        var nav = sidebar.append('nav')
            .attr('id', 'main-nav');

        // Définition des menus avec leurs icônes SVG
        var menuItems = [
            {
                tab: 'carte',
                label: 'Carte',
                icon: '<circle cx="12" cy="10" r="3" /><path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 7 8 11.7Z" />',
                active: true
            },
            {
                tab: 'general',
                label: "Vue d'ensemble",
                icon: '<rect x="3" y="12" width="4" height="9" rx="1" /><rect x="10" y="7" width="4" height="14" rx="1" /><rect x="17" y="3" width="4" height="18" rx="1" />',
                active: false
            },
            {
                tab: 'emploi',
                label: 'Emploi',
                icon: '<rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />',
                active: false
            },
            {
                tab: 'logement',
                label: 'Logement',
                icon: '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />',
                active: false
            },
            {
                tab: 'meteo',
                label: 'Météo',
                icon: '<circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />',
                active: false
            },
            {
                tab: 'demographie',
                label: 'Démographie',
                icon: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />',
                active: false
            },
            {
                tab: 'education',
                label: 'Éducation',
                icon: '<path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" />',
                active: false
            },
            {
                tab: 'transports',
                label: 'Transports',
                icon: '<rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />',
                active: false
            },
            {
                tab: 'qualite',
                label: 'Qualité de vie',
                icon: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />',
                active: false
            }
        ];

        // Créer les boutons de navigation avec D3
        menuItems.forEach(function (item) {
            var button = nav.append('button')
                .attr('class', item.active ? 'tab-btn active' : 'tab-btn')
                .attr('data-tab', item.tab);

            var svg = button.append('svg')
                .attr('class', 'nav-icon')
                .attr('viewBox', '0 0 24 24')
                .attr('fill', 'none')
                .attr('stroke', 'currentColor')
                .attr('stroke-width', '2')
                .attr('stroke-linecap', 'round')
                .attr('stroke-linejoin', 'round');

            svg.html(item.icon);

            button.append('span')
                .text(item.label);
        });

        // Footer de la sidebar
        var footer = sidebar.append('div')
            .attr('class', 'sidebar-footer');

        footer.append('div')
            .attr('class', 'sidebar-user')
            .attr('id', 'sidebar-user');

        // Bouton déconnexion
        var btnLogout = footer.append('button')
            .attr('class', 'btn-logout')
            .attr('id', 'btn-logout');

        btnLogout.append('svg')
            .attr('width', '16')
            .attr('height', '16')
            .attr('viewBox', '0 0 24 24')
            .attr('fill', 'none')
            .attr('stroke', 'currentColor')
            .attr('stroke-width', '2')
            .attr('stroke-linecap', 'round')
            .attr('stroke-linejoin', 'round')
            .html('<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />');

        btnLogout.append('span')
            .text('Déconnexion');

        // Bouton suppression compte
        var btnDelete = footer.append('button')
            .attr('class', 'btn-logout btn-danger')
            .attr('id', 'btn-delete-account');

        btnDelete.append('svg')
            .attr('width', '16')
            .attr('height', '16')
            .attr('viewBox', '0 0 24 24')
            .attr('fill', 'none')
            .attr('stroke', 'currentColor')
            .attr('stroke-width', '2')
            .attr('stroke-linecap', 'round')
            .attr('stroke-linejoin', 'round')
            .html('<path d="M3 6h18" /><path d="M8 6V4h8v2" /><path d="M19 6l-1 14H6L5 6" />');

        btnDelete.append('span')
            .text('Supprimer mon compte');

        footer.append('p')
            .text('Données : INSEE · Open-Meteo');

        footer.append('p')
            .text('D3.js v4 — BUT SD S4');
    }

    // ===== CONSTRUCTION DU TOPBAR =====
    function buildTopbar(container) {
        var header = container.append('header')
            .attr('class', 'topbar')
            .attr('id', 'header');

        // Menu toggle
        var menuToggle = header.append('button')
            .attr('class', 'menu-toggle')
            .attr('id', 'menu-toggle')
            .attr('aria-label', 'Ouvrir le menu');

        menuToggle.append('svg')
            .attr('width', '20')
            .attr('height', '20')
            .attr('viewBox', '0 0 20 20')
            .attr('fill', 'currentColor')
            .html('<path d="M2 4.75A.75.75 0 0 1 2.75 4h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 4.75Zm0 5A.75.75 0 0 1 2.75 9h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 9.75Zm0 5a.75.75 0 0 1 .75-.75h14.5a.75.75 0 0 1 0 1.5H2.75a.75.75 0 0 1-.75-.75Z" />');

        // Search container
        var searchContainer = header.append('div')
            .attr('id', 'search-container');

        var searchInner = searchContainer.append('div')
            .attr('class', 'search-inner');

        searchInner.append('svg')
            .attr('class', 'search-icon')
            .attr('width', '16')
            .attr('height', '16')
            .attr('viewBox', '0 0 24 24')
            .attr('fill', 'none')
            .attr('stroke', 'currentColor')
            .attr('stroke-width', '2')
            .html('<circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />');

        searchInner.append('input')
            .attr('type', 'text')
            .attr('id', 'search-city')
            .attr('placeholder', 'Rechercher une ville…')
            .attr('autocomplete', 'off');

        searchInner.append('kbd')
            .attr('class', 'search-kbd')
            .text('⌘K');

        searchContainer.append('div')
            .attr('id', 'search-results');

        // Theme selector
        var themeSelect = header.append('div')
            .attr('class', 'theme-select');

        themeSelect.append('label')
            .attr('class', 'theme-label')
            .attr('for', 'theme-select')
            .text('Theme');

        var select = themeSelect.append('select')
            .attr('id', 'theme-select')
            .attr('aria-label', 'Theme');

        select.append('option')
            .attr('value', 'system')
            .text('Systeme');

        select.append('option')
            .attr('value', 'dark')
            .text('Dark');

        select.append('option')
            .attr('value', 'light')
            .text('White');
    }

    // ===== ONGLET CARTE =====
    function buildTabCarte(container) {
        var tab = container.append('div')
            .attr('id', 'tab-carte')
            .attr('class', 'tab-content active');

        var pageTitle = tab.append('div')
            .attr('class', 'page-title');

        pageTitle.append('h2')
            .text('Cartographie');

        pageTitle.append('p')
            .text('Visualisez et sélectionnez les villes françaises de plus de 20 000 habitants');

        var gridMap = tab.append('div')
            .attr('class', 'grid-map');

        // Carte
        gridMap.append('div')
            .attr('class', 'card card-map')
            .append('div')
            .attr('id', 'map');

        // Stack de sélection
        var stack = gridMap.append('div')
            .attr('class', 'card-selection-stack');

        // Ville 1
        var city1 = stack.append('div')
            .attr('id', 'city1')
            .attr('class', 'card city-card');

        var header1 = city1.append('div')
            .attr('class', 'city-card-header');

        header1.append('span')
            .attr('class', 'city-dot dot-v1');

        header1.append('span')
            .attr('class', 'city-card-title')
            .text('Ville 1');

        city1.append('div')
            .attr('class', 'placeholder')
            .attr('id', 'placeholder1')
            .text('Cliquez sur une ville…');

        // Ville 2
        var city2 = stack.append('div')
            .attr('id', 'city2')
            .attr('class', 'card city-card');

        var header2 = city2.append('div')
            .attr('class', 'city-card-header');

        header2.append('span')
            .attr('class', 'city-dot dot-v2');

        header2.append('span')
            .attr('class', 'city-card-title')
            .text('Ville 2');

        city2.append('div')
            .attr('class', 'placeholder')
            .attr('id', 'placeholder2')
            .text('Cliquez sur une 2e ville…');

        // Analyse rapide
        var comparison = stack.append('div')
            .attr('id', 'comparison-result')
            .attr('class', 'card city-card comparison-card');

        var headerComp = comparison.append('div')
            .attr('class', 'city-card-header');

        headerComp.append('span')
            .attr('class', 'city-card-title')
            .text('Analyse rapide');

        comparison.append('div')
            .attr('id', 'comparison-text');
    }

    // ===== ONGLET GÉNÉRAL =====
    function buildTabGeneral(container) {
        var tab = container.append('div')
            .attr('id', 'tab-general')
            .attr('class', 'tab-content');

        var pageTitle = tab.append('div')
            .attr('class', 'page-title');

        pageTitle.append('h2')
            .text("Vue d'ensemble");

        pageTitle.append('p')
            .text('Comparaison des populations et classement régional');

        // Carte comparaison visuelle
        var card1 = tab.append('div')
            .attr('class', 'card');

        card1.append('div')
            .attr('class', 'card-header')
            .append('h3')
            .text('Comparaison visuelle');

        card1.append('div')
            .attr('id', 'comparison-chart');

        card1.append('p')
            .attr('id', 'comparison-placeholder')
            .attr('class', 'placeholder-text')
            .text('Sélectionnez deux villes sur la carte pour lancer la comparaison.');

        // Carte bar chart
        var card2 = tab.append('div')
            .attr('class', 'card');

        var header = card2.append('div')
            .attr('class', 'card-header')
            .attr('id', 'chart-header');

        header.append('h3')
            .text('Top 15 — Population municipale');

        var controlGroup = header.append('div')
            .attr('class', 'control-group');

        controlGroup.append('label')
            .attr('for', 'select-region')
            .text('Région');

        var select = controlGroup.append('select')
            .attr('id', 'select-region');

        select.append('option')
            .attr('value', '')
            .text('— Choisir —');

        card2.append('div')
            .attr('id', 'bar-chart');
    }

    // ===== ONGLET EMPLOI =====
    function buildTabEmploi(container) {
        var tab = container.append('div')
            .attr('id', 'tab-emploi')
            .attr('class', 'tab-content');

        var pageTitle = tab.append('div')
            .attr('class', 'page-title');

        pageTitle.append('h2')
            .text('Emploi');

        pageTitle.append('p')
            .text('Indicateurs économiques et répartition sectorielle');

        // KPI
        var card1 = tab.append('div')
            .attr('class', 'card');

        card1.append('div')
            .attr('id', 'emploi-kpi')
            .attr('class', 'kpi-grid');

        card1.append('p')
            .attr('id', 'emploi-placeholder')
            .attr('class', 'placeholder-text')
            .text('Sélectionnez deux villes sur la carte pour voir les données emploi.');

        // Bar chart
        var section1 = tab.append('section')
            .attr('id', 'emploi-bar-section')
            .attr('class', 'card')
            .style('display', 'none');

        section1.append('div')
            .attr('class', 'card-header')
            .append('h3')
            .text('Comparaison des indicateurs');

        section1.append('div')
            .attr('id', 'emploi-bar-chart');

        // Secteurs
        var section2 = tab.append('section')
            .attr('id', 'emploi-secteurs-section')
            .attr('class', 'card')
            .style('display', 'none');

        section2.append('div')
            .attr('class', 'card-header')
            .append('h3')
            .text('Répartition sectorielle');

        section2.append('div')
            .attr('id', 'emploi-secteurs')
            .attr('class', 'chart-duo');
    }

    // ===== ONGLET LOGEMENT =====
    function buildTabLogement(container) {
        var tab = container.append('div')
            .attr('id', 'tab-logement')
            .attr('class', 'tab-content');

        var pageTitle = tab.append('div')
            .attr('class', 'page-title');

        pageTitle.append('h2')
            .text('Logement');

        pageTitle.append('p')
            .text('Parc immobilier, prix au m² et occupation');

        // KPI
        var card1 = tab.append('div')
            .attr('class', 'card');

        card1.append('div')
            .attr('id', 'logement-kpi')
            .attr('class', 'kpi-grid');

        card1.append('p')
            .attr('id', 'logement-placeholder')
            .attr('class', 'placeholder-text')
            .text('Sélectionnez deux villes sur la carte pour voir les données logement.');

        // Types
        var section1 = tab.append('section')
            .attr('id', 'logement-type-section')
            .attr('class', 'card')
            .style('display', 'none');

        section1.append('div')
            .attr('class', 'card-header')
            .append('h3')
            .text('Types de logement');

        section1.append('div')
            .attr('id', 'logement-type')
            .attr('class', 'chart-duo');

        // Statut
        var section2 = tab.append('section')
            .attr('id', 'logement-statut-section')
            .attr('class', 'card')
            .style('display', 'none');

        section2.append('div')
            .attr('class', 'card-header')
            .append('h3')
            .text("Statut d'occupation");

        section2.append('div')
            .attr('id', 'logement-statut')
            .attr('class', 'chart-duo');
    }

    // ===== ONGLET MÉTÉO =====
    function buildTabMeteo(container) {
        var tab = container.append('div')
            .attr('id', 'tab-meteo')
            .attr('class', 'tab-content');

        var pageTitle = tab.append('div')
            .attr('class', 'page-title');

        pageTitle.append('h2')
            .text('Météo');

        pageTitle.append('p')
            .text('Conditions actuelles, prévisions 7 jours et climat annuel');

        // KPI
        var card1 = tab.append('div')
            .attr('class', 'card');

        card1.append('div')
            .attr('id', 'meteo-current')
            .attr('class', 'kpi-grid');

        card1.append('p')
            .attr('id', 'meteo-placeholder')
            .attr('class', 'placeholder-text')
            .text('Sélectionnez deux villes sur la carte pour voir la météo.');

        // Prévisions
        var section1 = tab.append('section')
            .attr('id', 'meteo-forecast-section')
            .attr('class', 'card')
            .style('display', 'none');

        section1.append('div')
            .attr('class', 'card-header')
            .append('h3')
            .text('Prévisions 7 jours');

        section1.append('div')
            .attr('id', 'meteo-forecast');

        // Climat
        var section2 = tab.append('section')
            .attr('id', 'meteo-climat-section')
            .attr('class', 'card')
            .style('display', 'none');

        section2.append('div')
            .attr('class', 'card-header')
            .append('h3')
            .text('Climat annuel — Températures mensuelles');

        section2.append('div')
            .attr('id', 'meteo-climat');
    }

    // ===== ONGLET DÉMOGRAPHIE =====
    function buildTabDemographie(container) {
        var tab = container.append('div')
            .attr('id', 'tab-demographie')
            .attr('class', 'tab-content');

        var pageTitle = tab.append('div')
            .attr('class', 'page-title');

        pageTitle.append('h2')
            .text('Démographie');

        pageTitle.append('p')
            .text('Structure de la population, densité et évolutions');

        // KPI
        var card1 = tab.append('div')
            .attr('class', 'card');

        card1.append('div')
            .attr('id', 'demographie-kpi')
            .attr('class', 'kpi-grid');

        card1.append('p')
            .attr('id', 'demographie-placeholder')
            .attr('class', 'placeholder-text')
            .text('Sélectionnez deux villes sur la carte pour voir les données démographiques.');

        // Pyramide
        var section1 = tab.append('section')
            .attr('id', 'demographie-pyramide-section')
            .attr('class', 'card')
            .style('display', 'none');

        section1.append('div')
            .attr('class', 'card-header')
            .append('h3')
            .text('Pyramide des âges comparée');

        section1.append('div')
            .attr('id', 'demographie-pyramide');

        // Évolution
        var section2 = tab.append('section')
            .attr('id', 'demographie-evolution-section')
            .attr('class', 'card')
            .style('display', 'none');

        section2.append('div')
            .attr('class', 'card-header')
            .append('h3')
            .text('Évolution de la population (10 ans)');

        section2.append('div')
            .attr('id', 'demographie-evolution');

        // Tableau
        var section3 = tab.append('section')
            .attr('id', 'demographie-tableau-section')
            .attr('class', 'card')
            .style('display', 'none');

        section3.append('div')
            .attr('class', 'card-header')
            .append('h3')
            .text('Tableau comparatif détaillé');

        section3.append('div')
            .attr('id', 'demographie-tableau');
    }

    // ===== ONGLET ÉDUCATION =====
    function buildTabEducation(container) {
        var tab = container.append('div')
            .attr('id', 'tab-education')
            .attr('class', 'tab-content');

        var pageTitle = tab.append('div')
            .attr('class', 'page-title');

        pageTitle.append('h2')
            .text('Éducation');

        pageTitle.append('p')
            .text('Niveau de formation, établissements et taux de scolarisation');

        // KPI
        var card1 = tab.append('div')
            .attr('class', 'card');

        card1.append('div')
            .attr('id', 'education-kpi')
            .attr('class', 'kpi-grid');

        card1.append('p')
            .attr('id', 'education-placeholder')
            .attr('class', 'placeholder-text')
            .text('Sélectionnez deux villes sur la carte pour voir les données éducation.');

        // Diplômes
        var section1 = tab.append('section')
            .attr('id', 'education-diplomes-section')
            .attr('class', 'card')
            .style('display', 'none');

        section1.append('div')
            .attr('class', 'card-header')
            .append('h3')
            .text('Répartition des diplômes');

        section1.append('div')
            .attr('id', 'education-diplomes')
            .attr('class', 'chart-duo');

        // Bar
        var section2 = tab.append('section')
            .attr('id', 'education-bar-section')
            .attr('class', 'card')
            .style('display', 'none');

        section2.append('div')
            .attr('class', 'card-header')
            .append('h3')
            .text('Indicateurs éducatifs');

        section2.append('div')
            .attr('id', 'education-bar');
    }

    // ===== ONGLET TRANSPORTS =====
    function buildTabTransports(container) {
        var tab = container.append('div')
            .attr('id', 'tab-transports')
            .attr('class', 'tab-content');

        var pageTitle = tab.append('div')
            .attr('class', 'page-title');

        pageTitle.append('h2')
            .text('Transports & Mobilité');

        pageTitle.append('p')
            .text('Accessibilité, réseaux et modes de déplacement');

        // KPI
        var card1 = tab.append('div')
            .attr('class', 'card');

        card1.append('div')
            .attr('id', 'transports-kpi')
            .attr('class', 'kpi-grid');

        card1.append('p')
            .attr('id', 'transports-placeholder')
            .attr('class', 'placeholder-text')
            .text('Sélectionnez deux villes sur la carte pour voir les données transports.');

        // Modes
        var section1 = tab.append('section')
            .attr('id', 'transports-modes-section')
            .attr('class', 'card')
            .style('display', 'none');

        section1.append('div')
            .attr('class', 'card-header')
            .append('h3')
            .text('Modes de transport domicile-travail');

        section1.append('div')
            .attr('id', 'transports-modes')
            .attr('class', 'chart-duo');

        // Bar
        var section2 = tab.append('section')
            .attr('id', 'transports-bar-section')
            .attr('class', 'card')
            .style('display', 'none');

        section2.append('div')
            .attr('class', 'card-header')
            .append('h3')
            .text("Score d'accessibilité comparé");

        section2.append('div')
            .attr('id', 'transports-bar');
    }

    // ===== ONGLET QUALITÉ DE VIE =====
    function buildTabQualite(container) {
        var tab = container.append('div')
            .attr('id', 'tab-qualite')
            .attr('class', 'tab-content');

        var pageTitle = tab.append('div')
            .attr('class', 'page-title');

        pageTitle.append('h2')
            .text('Qualité de vie');

        pageTitle.append('p')
            .text('Santé, environnement, sécurité et bien-être');

        // KPI
        var card1 = tab.append('div')
            .attr('class', 'card');

        card1.append('div')
            .attr('id', 'qualite-kpi')
            .attr('class', 'kpi-grid');

        card1.append('p')
            .attr('id', 'qualite-placeholder')
            .attr('class', 'placeholder-text')
            .text('Sélectionnez deux villes sur la carte pour voir les indicateurs qualité de vie.');

        // Radar
        var section1 = tab.append('section')
            .attr('id', 'qualite-radar-section')
            .attr('class', 'card')
            .style('display', 'none');

        section1.append('div')
            .attr('class', 'card-header')
            .append('h3')
            .text('Radar multidimensionnel');

        section1.append('div')
            .attr('id', 'qualite-radar')
            .attr('class', 'chart-duo');

        // Bar
        var section2 = tab.append('section')
            .attr('id', 'qualite-bar-section')
            .attr('class', 'card')
            .style('display', 'none');

        section2.append('div')
            .attr('class', 'card-header')
            .append('h3')
            .text('Comparaison des indicateurs');

        section2.append('div')
            .attr('id', 'qualite-bar');
    }

    // ===== MODAL SUPPRESSION =====
    function buildDeleteModal(container) {
        var modal = container.append('div')
            .attr('id', 'delete-modal')
            .attr('class', 'modal')
            .attr('aria-hidden', 'true');

        modal.append('div')
            .attr('class', 'modal-backdrop')
            .attr('id', 'delete-modal-backdrop');

        var card = modal.append('div')
            .attr('class', 'modal-card')
            .attr('role', 'dialog')
            .attr('aria-modal', 'true')
            .attr('aria-labelledby', 'delete-title');

        card.append('h3')
            .attr('id', 'delete-title')
            .text('Supprimer mon compte');

        card.append('p')
            .attr('class', 'modal-text')
            .text('Action irreversible. Pour confirmer, tapez :');

        card.append('div')
            .attr('class', 'modal-token')
            .attr('id', 'delete-token');

        card.append('input')
            .attr('type', 'text')
            .attr('id', 'delete-input')
            .attr('class', 'modal-input')
            .attr('placeholder', 'Tapez le mot exact');

        card.append('div')
            .attr('id', 'delete-error')
            .attr('class', 'modal-error');

        var actions = card.append('div')
            .attr('class', 'modal-actions');

        actions.append('button')
            .attr('class', 'btn-secondary')
            .attr('id', 'delete-cancel')
            .text('Annuler');

        actions.append('button')
            .attr('class', 'btn-danger')
            .attr('id', 'delete-confirm')
            .attr('disabled', true)
            .text('Supprimer définitivement');
    }

    // ===== MISE À JOUR EMAIL UTILISATEUR =====
    function updateUserEmail() {
        var rawSession = localStorage.getItem('gv_session');
        if (rawSession) {
            try {
                var session = JSON.parse(rawSession);
                d3.select('#sidebar-user')
                    .text(session.email);
            } catch (e) {
                console.error('Erreur parsing session:', e);
            }
        }
    }

})();
