@echo off
cd /d "%~dp0"
set CHAINLENS_OPEN_BROWSER=1
python server/app.py
pause
