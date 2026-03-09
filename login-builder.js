// ============================================================
// GeoVilles Explorer — Login DOM Builder
// Génère la page de connexion avec D3.js
// ============================================================

(function () {
    'use strict';

    // Le <div id="login-root"> existe déjà dans le HTML (avant les scripts)
    // On construit le DOM de manière synchrone, directement.
    buildLoginDOM();

    function buildLoginDOM() {
        // Sélectionner le conteneur racine
        var root = d3.select('#login-root');

        // Créer le conteneur principal
        var container = root.append('div')
            .attr('class', 'login-container');

        var card = container.append('div')
            .attr('class', 'login-card');

        // Brand
        var brand = card.append('div')
            .attr('class', 'login-brand');

        brand.append('h1')
            .text('GeoVilles Explorer');

        card.append('p')
            .attr('class', 'login-subtitle')
            .text('Connectez-vous pour explorer les villes françaises');

        // Theme selector
        var themeSelect = card.append('div')
            .attr('class', 'theme-select login-theme');

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

        // Alerts
        card.append('div')
            .attr('id', 'alert-error')
            .attr('class', 'alert alert-error');

        card.append('div')
            .attr('id', 'alert-success')
            .attr('class', 'alert alert-success');

        // Login Form
        var form = card.append('form')
            .attr('id', 'login-form');

        // Email field
        var emailGroup = form.append('div')
            .attr('class', 'form-group');

        emailGroup.append('label')
            .attr('for', 'email')
            .text('Adresse email');

        emailGroup.append('input')
            .attr('type', 'email')
            .attr('id', 'email')
            .attr('placeholder', 'votre@email.com')
            .attr('required', true);

        // Password field
        var passwordGroup = form.append('div')
            .attr('class', 'form-group');

        passwordGroup.append('label')
            .attr('for', 'password')
            .text('Mot de passe');

        passwordGroup.append('input')
            .attr('type', 'password')
            .attr('id', 'password')
            .attr('placeholder', '••••••••')
            .attr('required', true)
            .attr('minlength', '6');

        // Submit button
        form.append('button')
            .attr('type', 'submit')
            .attr('class', 'btn-primary')
            .attr('id', 'btn-submit')
            .text('Se connecter');

        // Toggle mode
        var toggleMode = card.append('p')
            .attr('class', 'toggle-mode')
            .attr('id', 'toggle-mode');

        toggleMode.append('span')
            .text('Pas encore de compte ? ');

        toggleMode.append('a')
            .attr('id', 'toggle-link')
            .text('Créer un compte');

        // Footer
        var footer = card.append('div')
            .attr('class', 'login-footer');

        footer.append('p')
            .text('BUT Science des Données · Semestre 4');

        // Initialiser le thème
        initializeTheme();
    }

    function initializeTheme() {
        var select = d3.select('#theme-select');
        if (select.empty()) return;

        var root = d3.select(document.documentElement);
        var stored = localStorage.getItem('theme-preference') || 'system';
        select.property('value', stored);

        function applyTheme(mode) {
            root.classed('theme-light', false).classed('theme-dark', false);
            if (mode === 'light') root.classed('theme-light', true);
            if (mode === 'dark') root.classed('theme-dark', true);
        }

        applyTheme(stored);
        select.on('change', function () {
            var mode = select.property('value');
            localStorage.setItem('theme-preference', mode);
            applyTheme(mode);
        });
    }

})();
