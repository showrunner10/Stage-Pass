$ErrorActionPreference = 'Stop'
Set-Location 'D:\Stage-Final\Stage-Pass'

Write-Host '1) Sync env files...'
Copy-Item .env.local .env -Force

Write-Host '2) Stop Node processes...'
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force

Write-Host '3) Prisma db push...'
npx.cmd prisma db push --skip-generate

Write-Host '4) Seed database...'
npm.cmd run db:seed

Write-Host '5) Typecheck...'
npm.cmd run typecheck

Write-Host 'Done. Start app with: npm run dev'
