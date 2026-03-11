// ============================================================
// GeoVilles Explorer — Authentification LocalStorage
// ============================================================

var isLoginMode = true;

var form = d3.select('#login-form');
var emailInput = d3.select('#email');
var passInput = d3.select('#password');
var btnSubmit = d3.select('#btn-submit');
var toggleLink = d3.select('#toggle-link');
var toggleMode = d3.select('#toggle-mode');
var alertError = d3.select('#alert-error');
var alertSuccess = d3.select('#alert-success');

// ─── VÉRIFICATION : si déjà connecté → rediriger ──────────
if (localStorage.getItem('gv_session')) {
    window.location.replace('index.html');
}

// ─── BASCULER LOGIN / INSCRIPTION ─────────────────────────
function setupToggle() {
    var tl = d3.select('#toggle-link');
    if (tl.empty()) return;
    
    tl.on('click', function () {
        isLoginMode = !isLoginMode;
        hideAlerts();

        if (isLoginMode) {
            btnSubmit.text('Se connecter');
            toggleMode.html('Pas encore de compte ? <a id="toggle-link" style="cursor:pointer;color:var(--accent);font-weight:500;">Écréer un compte</a>');
        } else {
            btnSubmit.text('Créer un compte');
            toggleMode.html('Déjà un compte ? <a id="toggle-link" style="cursor:pointer;color:var(--accent);font-weight:500;">Se connecter</a>');
        }
        setupToggle(); // Rebind
    });
}
setupToggle();

// ─── SOUMISSION DU FORMULAIRE ─────────────────────────────
form.on('submit', function () {
    d3.event.preventDefault();
    hideAlerts();

    var email = emailInput.property('value').trim();
    var password = passInput.property('value');

    if (!email || !password) {
        showError('Veuillez remplir tous les champs.');
        return;
    }

    if (password.length < 6) {
        showError('Le mot de passe doit contenir au moins 6 caractères.');
        return;
    }

    btnSubmit.property('disabled', true);
    btnSubmit.text('Chargement…');

    setTimeout(function () {
        var rawUsers = localStorage.getItem('gv_users');
        var users = rawUsers ? JSON.parse(rawUsers) : [];

        if (isLoginMode) {
            // Se connecter
            var found = users.find(function (u) { return u.email === email && u.password === btoa(password); });
            if (found) {
                localStorage.setItem('gv_session', JSON.stringify({ email: found.email, name: email.split('@')[0] }));
                showSuccess('Connexion réussie ! Redirection…');
                setTimeout(function () {
                    window.location.replace('index.html');
                }, 800);
            } else {
                showError('Email ou mot de passe incorrect.');
                btnSubmit.property('disabled', false);
                btnSubmit.text('Se connecter');
            }
        } else {
            // Créer un compte
            var exists = users.find(function (u) { return u.email === email; });
            if (exists) {
                showError('Un compte existe déjà avec cet email.');
                btnSubmit.property('disabled', false);
                btnSubmit.text('Créer un compte');
            } else {
                users.push({ email: email, password: btoa(password) });
                localStorage.setItem('gv_users', JSON.stringify(users));
                localStorage.setItem('gv_session', JSON.stringify({ email: email, name: email.split('@')[0] }));

                showSuccess('Compte créé et connecté ! Redirection…');
                setTimeout(function () {
                    window.location.replace('index.html');
                }, 800);
            }
        }
    }, 400);
});

// ─── UTILITAIRES ───────────────────────────────────────────
function showError(msg) {
    alertError.text(msg);
    alertError.classed('show', true);
    alertSuccess.classed('show', false);
}
function showSuccess(msg) {
    alertSuccess.text(msg);
    alertSuccess.classed('show', true);
    alertError.classed('show', false);
}
function hideAlerts() {
    alertError.classed('show', false);
    alertSuccess.classed('show', false);
}
