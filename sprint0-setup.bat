@echo off
REM Sprint 0 Setup Script for Postday
REM Run this to create directory structure and install dependencies

echo [1/3] Creating directory structure...
mkdir prisma
mkdir src\app
mkdir src\modules\auth
mkdir src\modules\dashboard
mkdir src\modules\create-post
mkdir src\modules\idea-generator
mkdir src\modules\carousel-maker
mkdir src\modules\drafts
mkdir src\modules\autopilot
mkdir src\modules\calendar
mkdir src\modules\media-library
mkdir src\modules\analytics
mkdir src\modules\settings
mkdir src\modules\notifications
mkdir src\modules\billing
mkdir src\modules\profile
mkdir src\modules\error-pages
mkdir src\shared\components
mkdir src\shared\hooks
mkdir src\shared\types
mkdir src\shared\utils
mkdir src\shared\services
mkdir src\shared\layouts
mkdir src\api
mkdir src\lib
mkdir src\styles
mkdir src\constants

echo [2/3] Installing npm dependencies...
call npm install

echo [3/3] Generating Prisma client and setting up database...
call npm run prisma:generate

echo.
echo ✓ Sprint 0 setup complete!
echo.
echo Next steps:
echo 1. Update .env.local with your database credentials
echo 2. Run: npm run prisma:migrate
echo 3. Run: npm run dev
echo.
pause
