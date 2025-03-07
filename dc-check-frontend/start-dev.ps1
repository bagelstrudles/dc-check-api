Set-Location $PSScriptRoot
pm2 delete dc-check-frontend
pm2 start "npm" --name "dc-check-frontend" -- "run" "dev" 