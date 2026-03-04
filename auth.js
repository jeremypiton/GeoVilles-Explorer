// ============================================================
// GeoVilles Explorer — auth.js
// Gestion de l'authentification locale via localStorage
// Compatible avec le site Vercel (même UX, stockage local)
// ============================================================

(function () {

    // --- Helpers localStorage ---
    function getUsers() {
        var raw = localStorage.getItem('gv_users');
        return raw ? JSON.parse(raw) : [];
    }

    function saveUsers(users) {
        localStorage.setItem('gv_users', JSON.stringify(users));
    }

    function setSession(user) {
        localStorage.setItem('gv_session', JSON.stringify({ email: user.email, name: user.name }));
    }

    function getSession() {
        var raw = localStorage.getItem('gv_session');
        return raw ? JSON.parse(raw) : null;
    }

    function clearSession() {
        localStorage.removeItem('gv_session');
    }

    // --- Guard : si déjà connecté → rediriger vers index.html ---
    if (window.location.pathname.indexOf('login.html') !== -1) {
        if (getSession()) {
            window.location.replace('index.html');
            return;
        }
    }

    // ============================================================
    // PAGE LOGIN (login.html)
    // ============================================================
    var tabLogin = document.getElementById('tab-login');
    var tabRegister = document.getElementById('tab-register');
    var formLogin = document.getElementById('form-login');
    var formRegister = document.getElementById('form-register');

    if (!tabLogin) return; // Pas sur la page login

    // --- Tabs switch ---
    tabLogin.addEventListener('click', function () {
        tabLogin.classList.add('active');
        tabRegister.classList.remove('active');
        formLogin.style.display = 'block';
        formRegister.style.display = 'none';
    });

    tabRegister.addEventListener('click', function () {
        tabRegister.classList.add('active');
        tabLogin.classList.remove('active');
        formLogin.style.display = 'none';
        formRegister.style.display = 'block';
    });

    // --- Connexion ---
    formLogin.addEventListener('submit', function (e) {
        e.preventDefault();
        var email = document.getElementById('login-email').value.trim().toLowerCase();
        var password = document.getElementById('login-password').value;
        var errorEl = document.getElementById('login-error');

        errorEl.textContent = '';

        if (!email || !password) {
            errorEl.textContent = 'Veuillez remplir tous les champs.';
            return;
        }

        var users = getUsers();
        var user = users.find(function (u) {
            return u.email === email && u.password === btoa(password);
        });

        if (!user) {
            errorEl.textContent = 'Email ou mot de passe incorrect.';
            return;
        }

        setSession(user);
        window.location.replace('index.html');
    });

    // --- Inscription ---
    formRegister.addEventListener('submit', function (e) {
        e.preventDefault();
        var name = document.getElementById('reg-name').value.trim();
        var email = document.getElementById('reg-email').value.trim().toLowerCase();
        var password = document.getElementById('reg-password').value;
        var password2 = document.getElementById('reg-password2').value;
        var errorEl = document.getElementById('register-error');
        var successEl = document.getElementById('register-success');

        errorEl.textContent = '';
        successEl.textContent = '';

        if (!name || !email || !password || !password2) {
            errorEl.textContent = 'Veuillez remplir tous les champs.';
            return;
        }

        if (password !== password2) {
            errorEl.textContent = 'Les mots de passe ne correspondent pas.';
            return;
        }

        if (password.length < 6) {
            errorEl.textContent = 'Le mot de passe doit contenir au moins 6 caractères.';
            return;
        }

        var users = getUsers();
        var exists = users.find(function (u) { return u.email === email; });
        if (exists) {
            errorEl.textContent = 'Un compte avec cet email existe déjà.';
            return;
        }

        users.push({ email: email, name: name, password: btoa(password) });
        saveUsers(users);
        successEl.textContent = '✅ Compte créé ! Connexion en cours…';

        setTimeout(function () {
            setSession({ email: email, name: name });
            window.location.replace('index.html');
        }, 1200);
    });

})();
