$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot
$record = Join-Path $PSScriptRoot '../docs/records/bonus-compose.txt'
$lines = [System.Collections.Generic.List[string]]::new()
$lines.Add('Week 1 bonus: actual CLI verification')
$lines.Add([DateTimeOffset]::Now.ToString('o'))
$saved = @{}
foreach ($key in @('APP_MODE', 'APP_PORT', 'HOST_PORT', 'SINGLE_HOST_PORT')) {
    $saved[$key] = [Environment]::GetEnvironmentVariable($key, 'Process')
}
function Run-Docker {
    param([string[]]$Arguments)
    $lines.Add('$ docker ' + ($Arguments -join ' '))
    $result = & docker @Arguments 2>&1
    $code = $LASTEXITCODE
    foreach ($line in $result) { $lines.Add([string]$line) }
    $lines.Add('[exit=' + $code + ']')
    if ($code -ne 0) { throw "Docker failed: $($Arguments -join ' ')" }
    return ($result -join "`n")
}
function Check-Http {
    param([string]$Url, [string[]]$Expected)
    $lines.Add('$ Invoke-WebRequest ' + $Url)
    $response = Invoke-WebRequest -Uri $Url -UseBasicParsing
    $body = [string]$response.Content
    $lines.Add('HTTP ' + [string]$response.StatusCode)
    $lines.Add($body)
    foreach ($part in $Expected) {
        if (-not $body.Contains($part)) { throw "Missing expected response: $part" }
    }
    $lines.Add('PASS: response contains ' + ($Expected -join ', '))
}
$single = @('compose', '-p', 'e11-bonus-single', '-f', 'compose.single.yml')
$multi = @('compose', '-p', 'e11-bonus-multi', '-f', 'docker-compose.yml')
try {
    $env:SINGLE_HOST_PORT = '18080'
    $env:APP_MODE = 'development'
    $env:APP_PORT = '8080'
    $env:HOST_PORT = '18081'
    Run-Docker @('compose', 'version') | Out-Null
    # Refuse to modify any pre-existing project with these names.
    foreach ($name in @('e11-bonus-single', 'e11-bonus-multi')) {
        $existing = Run-Docker @('ps', '-aq', '--filter', "label=com.docker.compose.project=$name")
        if (-not [string]::IsNullOrWhiteSpace($existing)) { throw "Project already exists: $name" }
    }
    Run-Docker ($single + @('config', '--quiet')) | Out-Null
    Run-Docker ($single + @('up', '-d', '--build', '--wait')) | Out-Null
    Run-Docker ($single + @('ps')) | Out-Null
    Check-Http 'http://127.0.0.1:18080/' @('version-2')
    Run-Docker ($single + @('logs', '--no-color', '--tail', '15')) | Out-Null
    Run-Docker ($single + @('down')) | Out-Null
    $remaining = Run-Docker ($single + @('ps', '-aq'))
    if (-not [string]::IsNullOrWhiteSpace($remaining)) { throw 'Single service remains' }
    $lines.Add('PASS: single service removed by down')
    Run-Docker ($multi + @('config', '--quiet')) | Out-Null
    Run-Docker ($multi + @('up', '-d', '--build', '--wait')) | Out-Null
    Run-Docker ($multi + @('ps')) | Out-Null
    Check-Http 'http://127.0.0.1:18081/' @('mode=development', 'port=8080')
    $internal = Run-Docker ($multi + @('exec', '-T', 'web', 'wget', '-qO-', 'http://helper/status.json'))
    if (-not $internal.Contains('Compose service discovery works')) { throw 'Service communication failed' }
    $lines.Add('PASS: web resolved helper by service name and received HTTP content')
    Check-Http 'http://127.0.0.1:18081/api/status.json' @('Compose service discovery works')
    $env:APP_MODE = 'production'
    $env:APP_PORT = '9090'
    $env:HOST_PORT = '18082'
    $lines.Add('$ $env:APP_MODE="production"; $env:APP_PORT="9090"; $env:HOST_PORT="18082"')
    Run-Docker ($multi + @('up', '-d', '--wait')) | Out-Null
    Run-Docker ($multi + @('ps')) | Out-Null
    Check-Http 'http://127.0.0.1:18082/' @('mode=production', 'port=9090')
    Check-Http 'http://127.0.0.1:18082/api/status.json' @('Compose service discovery works')
    Run-Docker ($multi + @('logs', '--no-color', '--tail', '20')) | Out-Null
    Run-Docker ($multi + @('down')) | Out-Null
    $remaining = Run-Docker ($multi + @('ps', '-aq'))
    if (-not [string]::IsNullOrWhiteSpace($remaining)) { throw 'Multi services remain' }
    $lines.Add('PASS: multi services removed by down')
    $lines.Add('PASS: all four Compose bonus requirements verified')
} catch {
    $lines.Add('FAIL: ' + $_.Exception.Message)
    throw
} finally {
    foreach ($key in $saved.Keys) { [Environment]::SetEnvironmentVariable($key, $saved[$key], 'Process') }
    $cleanLines = $lines | ForEach-Object { $_.TrimEnd() }
    [IO.File]::WriteAllText($record, (($cleanLines -join "`n") + "`n"), [Text.UTF8Encoding]::new($false))
    Write-Output "Verification record: $record"
}
