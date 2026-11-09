@echo off
title Bonsa Portfolio
echo [1/2] Ensuring MySQL is started...
tasklist /fi "imagename eq mysqld.exe" | find /i "mysqld.exe" >nul
if errorlevel 1 (
    start "" "C:\xampp\mysql\bin\mysqld.exe"
    timeout /t 2 >nul
)

echo [2/2] Starting Frontend and Backend servers...
cd /d "%~dp0"
call npm.cmd run dev:all
pause
