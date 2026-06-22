@echo off
setlocal enabledelayedexpansion

cd /d c:\Users\ASUS\postday-web

echo === STEP 1: Creating Directory Structure ===

mkdir prisma 2>nul
mkdir src 2>nul
mkdir src\app 2>nul
mkdir src\modules 2>nul
mkdir src\modules\auth 2>nul
mkdir src\modules\dashboard 2>nul
mkdir src\modules\create-post 2>nul
mkdir src\modules\idea-generator 2>nul
mkdir src\modules\carousel-maker 2>nul
mkdir src\modules\drafts 2>nul
mkdir src\modules\autopilot 2>nul
mkdir src\modules\calendar 2>nul
mkdir src\modules\media-library 2>nul
mkdir src\modules\analytics 2>nul
mkdir src\modules\settings 2>nul
mkdir src\modules\notifications 2>nul
mkdir src\modules\billing 2>nul
mkdir src\modules\profile 2>nul
mkdir src\modules\error-pages 2>nul
mkdir src\shared 2>nul
mkdir src\shared\components 2>nul
mkdir src\shared\hooks 2>nul
mkdir src\shared\types 2>nul
mkdir src\shared\utils 2>nul
mkdir src\shared\services 2>nul
mkdir src\shared\layouts 2>nul
mkdir src\api 2>nul
mkdir src\lib 2>nul
mkdir src\styles 2>nul
mkdir src\constants 2>nul

echo ✓ Directory structure created successfully

echo.
echo === STEP 2: Installing npm Dependencies ===
call npm install
if errorlevel 1 goto error_npm

echo ✓ npm install completed successfully

echo.
echo === STEP 3: Generating Prisma Client ===
call npm run prisma:generate
if errorlevel 1 goto error_prisma

echo ✓ Prisma client generated successfully

echo.
echo === STEP 4: Type-Checking TypeScript ===
call npm run type-check
if errorlevel 1 goto error_typecheck

echo ✓ TypeScript type-check passed

echo.
echo === ALL TASKS COMPLETED SUCCESSFULLY ===
exit /b 0

:error_npm
echo ✗ npm install failed
exit /b 1

:error_prisma
echo ✗ Prisma generation failed
exit /b 1

:error_typecheck
echo ✗ TypeScript type-check failed
exit /b 1
