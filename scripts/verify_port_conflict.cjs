'use strict';
// Controlled Docker port collision. Stops/removes only containers created here.
const fs = require('node:fs');
const path = require('node:path');
const {spawnSync} = require('node:child_process');
const root = path.resolve(__dirname, '..');
const logFile = path.join(root, 'docs/records/port-conflict.txt');
const port = 18080;
const owner = 'e11-port-conflict-owner';
const retry = 'e11-port-conflict-retry';
const lines = ['Controlled port-conflict verification', 'UTC: ' + new Date().toISOString()];
const created = new Set();
function command(exe, args, allowed = [0], record = true) {
  const r = spawnSync(exe, args, {encoding:'utf8',timeout:30000});
  if (record) {
    lines.push('$ ' + [exe,...args].map(x=>/\s/.test(x)?JSON.stringify(x):x).join(' '));
    if (r.stdout) lines.push(r.stdout.trimEnd());
    if (r.stderr) lines.push(r.stderr.trimEnd());
    lines.push('[exit=' + r.status + ']');
  }
  if (r.error || !allowed.includes(r.status)) throw r.error || new Error(r.stdout + r.stderr);
  return r;
}
const docker = (args, allowed=[0], record=true) => command('wsl.exe',['-d','Ubuntu-26.04','--','docker',...args],allowed,record);
function listeners() {
  const ps = '[Console]::OutputEncoding=[System.Text.UTF8Encoding]::new($false); ' +
    '$items=@(Get-NetTCPConnection -State Listen -LocalPort '+port+' -ErrorAction SilentlyContinue); ' +
    '$rows=@($items | ForEach-Object { [pscustomobject]@{LocalAddress=$_.LocalAddress;LocalPort=$_.LocalPort;OwningProcess=$_.OwningProcess;ProcessName=(Get-Process -Id $_.OwningProcess -ErrorAction SilentlyContinue).ProcessName} }); ' +
    'ConvertTo-Json -InputObject $rows -Compress; exit 0';
  return JSON.parse(command('powershell.exe',['-NoProfile','-NonInteractive','-Command',ps]).stdout.trim());
}
let failure;
try {
  if (listeners().length) throw new Error('Port already in use by an unrelated listener; no process stopped.');
  for (const name of [owner,retry]) {
    if (docker(['inspect',name],[0,1],false).status===0) throw new Error('Container name already exists; preserved: '+name);
  }
  docker(['run','-d','--name',owner,'--label','codyssey.port-proof=true','-p','127.0.0.1:'+port+':80','nginx:alpine']);
  created.add(owner);
  const collision = docker(['run','-d','--name',retry,'--label','codyssey.port-proof=true','-p','127.0.0.1:'+port+':80','nginx:alpine'],[0,125]);
  if (docker(['inspect',retry],[0,1],false).status===0) created.add(retry);
  if (collision.status!==125 || !/port is already allocated|address already in use/i.test(collision.stderr)) throw new Error('Expected a port binding collision, not another error.');
  lines.push('PASS: second container cannot bind the same host port.');
  const occupied = listeners();
  if (!occupied.length) throw new Error('Windows listener was not observed.');
  docker(['ps','--filter','publish='+port,'--format','table {{.Names}}\t{{.Status}}\t{{.Ports}}']);
  docker(['port',owner]);
  docker(['inspect',owner,'--format','{{json .HostConfig.PortBindings}}']);
  lines.push('Release the identified owner container instead of killing Docker Desktop backend PID.');
  docker(['stop','--timeout','3',owner]);
  if (listeners().length) throw new Error('Host port still occupied after stopping the owner.');
  lines.push('PASS: host port is free after docker stop.');
  // A failed run can leave a Created container without a working network endpoint.
  // Recreate that known verification container with the intended binding.
  docker(['rm',retry]);
  created.delete(retry);
  docker(['run','-d','--name',retry,'--label','codyssey.port-proof=true','-p','127.0.0.1:'+port+':80','nginx:alpine']);
  created.add(retry);
  docker(['restart','--timeout','3',retry]);
  docker(['port',retry]);
  listeners();
  // Test from Windows, the host where the published 127.0.0.1 listener lives.
  command('curl.exe',['--fail','--retry','5','--retry-connrefused','--retry-delay','1','-i','http://127.0.0.1:'+port]);
  docker(['ps','--filter','name='+retry,'--format','table {{.Names}}\t{{.Status}}\t{{.Ports}}']);
  listeners();
  lines.push('PASS: retry starts and HTTP 200 is returned after releasing the port.');
} catch (e) {
  lines.push('VERIFICATION FAILED: '+e.message);
  failure=e;
} finally {
  for (const name of created) {
    try {docker(['stop','--timeout','3',name]);docker(['rm',name]);}
    catch (e) { lines.push('Cleanup issue: '+e.message);failure ||= e; }
  }
  try { if (listeners().length) throw new Error('Final port release check failed'); }
  catch(e) {failure ||= e;lines.push(e.message);}
  lines.push(failure?'Verification incomplete.':'PASS: final cleanup complete; no localhost server left on '+port+'.');
  fs.mkdirSync(path.dirname(logFile),{recursive:true});
  fs.writeFileSync(logFile,lines.join('\n')+'\n');
  console.log(lines.join('\n'));
}
if(failure)process.exitCode=1;
