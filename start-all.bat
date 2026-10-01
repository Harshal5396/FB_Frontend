@echo off
title Starting Full Stack - Excel Reconciliation App
echo ========================================
echo   Starting Backend + Frontend
echo ========================================
echo.

REM Start backend in new window
start "Backend - FastAPI" cmd /k "%~dp0start-backend.bat"

REM Small delay to let backend start first
timeout /t 3 /nobreak >nul

REM Start frontend in new window
start "Frontend - React" cmd /k "%~dp0start-frontend.bat"

echo.
echo ========================================
echo   Both servers starting...
echo   Backend:  http://localhost:8000
echo   Frontend: http://localhost:5173
echo ========================================
echo.
echo   Close the two new windows to stop servers.
echo.
pause