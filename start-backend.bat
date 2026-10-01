@echo off
title Backend Server - FastAPI
echo ========================================
echo   Starting Backend Server (FastAPI)
echo ========================================
echo.

cd /d "%~dp0backend"

echo [1/4] Setting execution policy...
powershell -Command "Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass"

echo [2/4] Activating virtual environment...
call "C:\venvs\reconciliation\Scripts\activate.bat"

echo [3/4] Adding PostgreSQL to PATH...
set PATH=%PATH%;C:\Program Files\PostgreSQL\18\bin

echo [4/4] Starting uvicorn server...
echo.
echo ========================================
echo   Backend running at http://localhost:8000
echo   Press Ctrl+C to stop
echo ========================================
echo.

uvicorn main:app --reload

pause