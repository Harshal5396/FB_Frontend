@echo off
title Frontend Server - React + Vite
echo ========================================
echo   Starting Frontend Server (React + Vite)
echo ========================================
echo.

cd /d "%~dp0frontend"

echo Setting execution policy...
powershell -Command "Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass"

echo.
echo ========================================
echo   Frontend running at http://localhost:5173
echo   Press Ctrl+C to stop
echo ========================================
echo.

npm run dev

pause