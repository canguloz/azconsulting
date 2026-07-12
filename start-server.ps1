$port = 5500
$process = netstat -ano | Select-String ":$port " | ForEach-Object { ($_ -split '\s+')[-1] } | Select-Object -First 1
if ($process) { Stop-Process -Id $process -Force -ErrorAction SilentlyContinue; Start-Sleep 2 }
Start-Process -FilePath "pythonw" -ArgumentList "-m http.server $port --directory E:\PORTAFOLIO\azconsulting" -WindowStyle Hidden