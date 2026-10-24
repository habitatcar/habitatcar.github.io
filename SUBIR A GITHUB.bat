@echo off
setlocal enabledelayedexpansion
cd /d "%~dp0"
title Subir CUPONES a GitHub

echo ============================================================
echo    SUBIR SITIO "CUPONES HABITAT-CAR" A GITHUB
echo ============================================================
echo.
echo Carpeta: %CD%
echo.

rem --- LISTA BLANCA: solo estos archivos se suben ---
set FILES=.gitignore index.html firebase-config.js admin_auth.js proteger.js^
 admin_comercios.html admin_curioso.html admin_estadisticas.html^
 admin_historial_comercio.html admin_ingreso_duenos.html admin_leads.html^
 admin_legales.html admin_logs.html admin_mi_comercio.html admin_sorteos.html^
 admin_tokens_vip.html admin_tutoriales.html admin_validaciones.html admin_vips.html^
 usuarios_comercios_postulacion.html usuarios_cupones_leads.html usuarios_cupones_vips.html^
 usuarios_curioso.html usuarios_invitaciones_grupales.html usuarios_registro_lead.html^
 usuarios_registro_vip.html usuarios_sorteos_promos.html usuarios_terminos.html^
 usuarios_tutoriales.html simulador_cupones.html

echo Agregando archivos del sitio...
git add -- %FILES%

if errorlevel 1 (
  echo.
  echo [ERROR] No se pudieron agregar los archivos.
  echo.
  pause
  exit /b 1
)

echo.
echo Cambios que se van a subir:
echo ------------------------------------------------------------
git diff --cached --stat
echo ------------------------------------------------------------
echo.

git diff --cached --quiet
if not errorlevel 1 (
  echo No hay cambios nuevos para subir. Nada que hacer.
  echo.
  pause
  exit /b 0
)

echo Confirmas subir estos cambios a GitHub?
choice /c SN /m "  Presiona S = Si, N = No"
if errorlevel 2 (
  echo.
  echo Cancelado. No se subio nada.
  git reset >nul 2>&1
  echo.
  pause
  exit /b 0
)

echo.
echo Haciendo commit...
git commit -m "Actualizacion sitio %date% %time%"
if errorlevel 1 (
  echo.
  echo [ERROR] Fallo el commit.
  echo.
  pause
  exit /b 1
)

echo.
echo Subiendo a GitHub (puede pedir login la primera vez)...
git push origin main
if errorlevel 1 (
  echo.
  echo [ERROR] Fallo el push. Revisa el mensaje de arriba.
  echo.
  pause
  exit /b 1
)

echo.
echo ============================================================
echo    LISTO. GitHub tardara unos segundos/minutos en publicar.
echo ============================================================
echo.
pause
