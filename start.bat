@echo off
title Sistema E-Commerce ^& Tickets - Inicio Servidor
echo ========================================================
echo   Iniciando Plataforma de E-Commerce y Venta de Tickets
echo ========================================================
echo.

echo [1/2] Verificando / Creando el usuario Administrador inicial...
call npm run create-admin
echo.

echo [2/2] Iniciando el servidor de desarrollo de Next.js...
echo El proyecto estara disponible en: http://localhost:3000
echo Presiona Ctrl+C para detener el servidor.
echo.

call npm run dev
pause
