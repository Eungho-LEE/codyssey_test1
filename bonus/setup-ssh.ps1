# Run in an interactive PowerShell window. Never type the passphrase into chat.
$ErrorActionPreference = 'Stop'
$sshTools = 'C:\Program Files\Git\usr\bin'
$keyPath = Join-Path $env:USERPROFILE '.ssh/codyssey_e11_ed25519'
$sessionPath = Join-Path $env:USERPROFILE '.ssh/codyssey-e11-agent.json'
Write-Host 'Create a passphrase-protected SSH key for the Codyssey assignment.'
Write-Host 'At the passphrase prompt, type a NON-EMPTY passphrase twice. Input is hidden.'
Write-Host 'Do not paste the passphrase or private key into chat.'
if (-not (Test-Path -LiteralPath $keyPath)) {
    & "$sshTools\ssh-keygen.exe" -t ed25519 -C 'codyssey-e11-workstation' -f $keyPath
    if ($LASTEXITCODE -ne 0) { throw 'Key creation failed.' }
}
# Confirm that the key cannot be opened with an empty passphrase.
& "$sshTools\ssh-keygen.exe" -y -P '' -f $keyPath 2>$null | Out-Null
if ($LASTEXITCODE -eq 0) {
    Write-Host 'This key needs a non-empty passphrase. Set one now.'
    & "$sshTools\ssh-keygen.exe" -p -f $keyPath
    if ($LASTEXITCODE -ne 0) { throw 'Passphrase setup failed.' }
    & "$sshTools\ssh-keygen.exe" -y -P '' -f $keyPath 2>$null | Out-Null
    if ($LASTEXITCODE -eq 0) { throw 'A non-empty passphrase is required.' }
}
$agentOutput = (& "$sshTools\ssh-agent.exe" -s) -join "`n"
if ($LASTEXITCODE -ne 0) { throw 'Could not start SSH agent.' }
$socketMatch = [regex]::Match($agentOutput, 'SSH_AUTH_SOCK=([^;]+);')
$pidMatch = [regex]::Match($agentOutput, 'SSH_AGENT_PID=(\d+);')
if (-not $socketMatch.Success -or -not $pidMatch.Success) { throw 'Unexpected SSH agent output.' }
$env:SSH_AUTH_SOCK = $socketMatch.Groups[1].Value
$env:SSH_AGENT_PID = $pidMatch.Groups[1].Value
Write-Host 'Enter the same passphrase once more to unlock the key for one hour.'
& "$sshTools\ssh-add.exe" -t 3600 $keyPath
if ($LASTEXITCODE -ne 0) { throw 'Could not unlock key.' }
# Agent connection metadata only; no passphrase or private key is saved here.
@{socket=$env:SSH_AUTH_SOCK; pid=$env:SSH_AGENT_PID; ready=$true} |
    ConvertTo-Json | Set-Content -LiteralPath $sessionPath -Encoding utf8
Write-Host 'SSH key is ready. Tell Codex that setup is complete.'
