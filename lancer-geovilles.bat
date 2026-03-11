@echo off
setlocal
cd /d "%~dp0"

set "PORT=%~1"
if "%PORT%"=="" set "PORT=8000"
set "URL=http://localhost:%PORT%"

where py >nul 2>&1
if %errorlevel%==0 (
    start "" "%URL%"
    py -3 -m http.server %PORT%
    exit /b %errorlevel%
)

where python >nul 2>&1
if %errorlevel%==0 (
    start "" "%URL%"
    python -m http.server %PORT%
    exit /b %errorlevel%
)

echo Python introuvable. Installe Python 3 puis relance ce fichier.
pause
exit /b 1