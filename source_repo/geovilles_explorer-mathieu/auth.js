// ============================================================
// GeoVilles Explorer — Authentification Supabase
// ============================================================

// ─── CONFIGURATION SUPABASE ────────────────────────────────
// Remplace ces valeurs par celles de ton projet Supabase
// (Settings → API dans le dashboard Supabase)
var SUPABASE_URL  = 'https://fbyzofslbovoggzyeexk.supabase.co';
var SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZieXpvZnNsYm92b2dnenllZXhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA4NDM3OTQsImV4cCI6MjA4NjQxOTc5NH0.mBaf8S1Px2do7ibQvdsJj1A82Fnrs4aiIJGIJ6Oh6L0';

// ─── Initialisation du client Supabase ─────────────────────
var supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON);

// ─── VARIABLES ─────────────────────────────────────────────
var isLoginMode = true;

// ─── ÉLÉMENTS DOM ──────────────────────────────────────────
var form        = document.getElementById('login-form');
var emailInput  = document.getElementById('email');
var passInput   = document.getElementById('password');
var btnSubmit   = document.getElementById('btn-submit');
var toggleLink  = document.getElementById('toggle-link');
var toggleMode  = document.getElementById('toggle-mode');
var alertError  = document.getElementById('alert-error');
var alertSuccess = document.getElementById('alert-success');

// ─── VÉRIFICATION : si déjà connecté → rediriger ──────────
supabase.auth.getSession().then(function (result) {
    if (result.data.session) {
        window.location.href = 'index.html';
    }
});

// ─── BASCULER LOGIN / INSCRIPTION ─────────────────────────
toggleLink.addEventListener('click', function () {
    isLoginMode = !isLoginMode;
    hideAlerts();

    if (isLoginMode) {
        btnSubmit.textContent = 'Se connecter';
        toggleMode.innerHTML = 'Pas encore de compte ? <a id="toggle-link">Créer un compte</a>';
    } else {
        btnSubmit.textContent = 'Créer un compte';
        toggleMode.innerHTML = 'Déjà un compte ? <a id="toggle-link">Se connecter</a>';
    }

    // Rebind le lien
    document.getElementById('toggle-link').addEventListener('click', arguments.callee);
});

// ─── SOUMISSION DU FORMULAIRE ─────────────────────────────
form.addEventListener('submit', function (e) {
    e.preventDefault();
    hideAlerts();

    var email = emailInput.value.trim();
    var password = passInput.value;

    if (!email || !password) {
        showError('Veuillez remplir tous les champs.');
        return;
    }

    if (password.length < 6) {
        showError('Le mot de passe doit contenir au moins 6 caractères.');
        return;
    }

    btnSubmit.disabled = true;
    btnSubmit.textContent = 'Chargement…';

    if (isLoginMode) {
        // ─── CONNEXION ─────────────────────────────────────
        supabase.auth.signInWithPassword({
            email: email,
            password: password
        }).then(function (result) {
            btnSubmit.disabled = false;
            btnSubmit.textContent = 'Se connecter';

            if (result.error) {
                showError(translateError(result.error.message));
            } else {
                showSuccess('Connexion réussie ! Redirection…');
                setTimeout(function () {
                    window.location.href = 'index.html';
                }, 800);
            }
        });
    } else {
        // ─── INSCRIPTION ───────────────────────────────────
        supabase.auth.signUp({
            email: email,
            password: password
        }).then(function (result) {
            btnSubmit.disabled = false;
            btnSubmit.textContent = 'Créer un compte';

            if (result.error) {
                showError(translateError(result.error.message));
            } else {
                showSuccess('Compte créé ! Vous pouvez vous connecter.');
                isLoginMode = true;
                btnSubmit.textContent = 'Se connecter';
                toggleMode.innerHTML = 'Pas encore de compte ? <a id="toggle-link">Créer un compte</a>';
            }
        });
    }
});

// ─── UTILITAIRES ───────────────────────────────────────────
function showError(msg) {
    alertError.textContent = msg;
    alertError.classList.add('show');
    alertSuccess.classList.remove('show');
}

function showSuccess(msg) {
    alertSuccess.textContent = msg;
    alertSuccess.classList.add('show');
    alertError.classList.remove('show');
}

function hideAlerts() {
    alertError.classList.remove('show');
    alertSuccess.classList.remove('show');
}

function translateError(msg) {
    var translations = {
        'Invalid login credentials': 'Email ou mot de passe incorrect.',
        'User already registered': 'Un compte existe déjà avec cet email.',
        'Signup requires a valid password': 'Mot de passe invalide (min. 6 caractères).',
        'Password should be at least 6 characters': 'Le mot de passe doit contenir au moins 6 caractères.',
        'Unable to validate email address: invalid format': 'Format d\'email invalide.'
    };
    return translations[msg] || msg;
}
