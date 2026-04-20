@echo off
chcp 65001 >nul
title Password Cracker - Start Script

echo ========================================
echo   Password Cracker Project Start Script
echo ========================================
echo.

REM Check Node.js installation
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js not found
    echo Please install Node.js from: https://nodejs.org/
    pause
    exit /b 1
)

echo [OK] Node.js is installed

REM Check npm installation
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] npm not found
    pause
    exit /b 1
)

echo [OK] npm is installed
echo.

REM Change to project directory
cd /d "%~dp0"

echo Current directory: %CD%
echo.

REM Install dependencies if not exist
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo [ERROR] Failed to install dependencies
        pause
        exit /b 1
    )
    echo Dependencies installed successfully.
    echo.
) else (
    echo Dependencies already installed.
    echo.
)

:menu
cls
echo ========================================
echo   Start Menu
echo ========================================
echo.
echo  1. Start Development Server (npm run dev)
echo  2. Build Production (npm run build)
echo  3. Preview Production (npm start)
echo  4. Clean and Reinstall Dependencies
echo  5. Lint Code (npm run lint)
echo  6. Exit
echo.
choice /c 123456 /n /m "Select option [1-6]: "

if %errorlevel%==1 goto dev
if %errorlevel%==2 goto build
if %errorlevel%==3 goto start
if %errorlevel%==4 goto reinstall
if %errorlevel%==5 goto lint
if %errorlevel%==6 goto exit

:dev
cls
echo Starting development server...
echo.
echo Press Ctrl+C to stop the server
echo.
call npm run dev
goto end

:build
cls
echo Building production...
echo.
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Build failed
) else (
    echo [OK] Build successful! Output: .next
)
echo.
pause
goto end

:start
cls
echo Starting production preview...
echo.
call npm start
goto end

:reinstall
cls
echo Removing node_modules...
if exist "node_modules" rmdir /s /q node_modules
if exist "package-lock.json" del package-lock.json
echo.
echo Installing dependencies...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Installation failed
) else (
    echo [OK] Installation complete
)
echo.
pause
goto end

:lint
cls
echo Linting code...
echo.
call npm run lint
echo.
pause
goto end

:exit
cls
echo Goodbye!
exit /b 0

:end
echo.
pause
