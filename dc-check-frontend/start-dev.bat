@echo off
cd %~dp0
pm2 delete dc-check-frontend
pm2 start npm --name "dc-check-frontend" -- run dev 