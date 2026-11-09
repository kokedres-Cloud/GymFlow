@echo off
title GymFlow Launcher
setlocal EnableDelayedExpansion

echo ==============================================
echo       Iniciando GymFlow Prototype...
echo ==============================================
echo.

:: 1. Verificar si Node.js esta instalado
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] No se encontro Node.js instalado en este equipo.
    echo Por favor instala Node.js desde https://nodejs.org antes de continuar.
    echo.
    pause
    exit /b 1
)

:: 2. Verificar dependencias del Backend
if not exist "%~dp0GymFlowProtipe\backend\node_modules" (
    echo [1/3] Instalando dependencias del Backend por primera vez...
    pushd "%~dp0GymFlowProtipe\backend"
    call npm install
    popd
    echo Dependencias del Backend listas.
    echo.
)

:: 3. Verificar dependencias del Frontend
if not exist "%~dp0GymFlowProtipe\frontend\node_modules" (
    echo [2/3] Instalando dependencias del Frontend por primera vez...
    pushd "%~dp0GymFlowProtipe\frontend"
    call npm install
    popd
    echo Dependencias del Frontend listas.
    echo.
)

:: 4. Levantar Backend
echo [3/3] Levantando servidores...
echo - Levantando Backend en http://localhost:5000...
start "GymFlow - Backend (Puerto 5000)" cmd /k "cd /d "%~dp0GymFlowProtipe\backend" && npm run dev"

:: 5. Levantar Frontend
echo - Levantando Frontend en http://localhost:5173...
start "GymFlow - Frontend (Puerto 5173)" cmd /k "cd /d "%~dp0GymFlowProtipe\frontend" && npm run dev"

:: 6. Esperar y abrir navegador
echo.
echo Esperando que los servidores respondan...
timeout /t 3 /nobreak >nul

echo Abriendo GymFlow en tu navegador...
start http://localhost:5173

echo.
echo ==============================================
echo  GymFlow esta corriendo exitosamente!
echo  Frontend: http://localhost:5173
echo  Backend:  http://localhost:5000
echo ==============================================
echo Presiona cualquier tecla para cerrar esta ventana.
pause >nul
