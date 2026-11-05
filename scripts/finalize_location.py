#!/usr/bin/env python3
"""Preserve the old Linux workspace, link its old name, and rebind the web server."""
import datetime
import json
import pathlib
import shlex
import subprocess

old = pathlib.Path('/home/ox6965/codyssey/e1-1-workstation')
backup = pathlib.Path('/home/ox6965/codyssey/e1-1-workstation.backup-20261105')
new = pathlib.Path('/mnt/c/Users/nabis/Desktop/Projects/codyssey/e1-1-workstation')
assert old.resolve() == old and old.parent.resolve() == pathlib.Path('/home/ox6965/codyssey')
assert new.resolve() == new and (new / '.git').is_dir()
assert (old / '.git').is_dir() and not backup.exists()
lines = ['Workspace relocation requested by the user', datetime.datetime.now(datetime.timezone.utc).isoformat()]


def run(*args):
    lines.append('$ ' + shlex.join(args))
    result = subprocess.run(args, capture_output=True, text=True, timeout=30)
    lines.append(result.stdout.rstrip())
    if result.stderr:
        lines.append(result.stderr.rstrip())
    result.check_returncode()
    return result.stdout


try:
    mount = json.loads(run('docker', 'inspect', 'e11-web-bind', '--format', '{{json .Mounts}}'))
    assert len(mount) == 1 and mount[0]['Type'] == 'bind' and mount[0]['RW'] is False
    assert mount[0]['Source'] == str(old / 'site') and mount[0]['Destination'] == '/usr/share/nginx/html'
    previous_logs = subprocess.run(['docker', 'logs', 'e11-web-bind'], capture_output=True, text=True, check=True)
    (new / 'docs/records/bind-before-relocation-log.txt').write_text(previous_logs.stdout + previous_logs.stderr)
    old.rename(backup)
    old.symlink_to(new, target_is_directory=True)
    lines.extend(['Original preserved at: ' + str(backup), 'Compatibility link: ' + str(old) + ' -> ' + str(new)])
    run('docker', 'stop', 'e11-web-bind')
    run('docker', 'rm', 'e11-web-bind')
    run('docker', 'run', '-d', '--name', 'e11-web-bind', '-p', '127.0.0.1:8082:80', '--mount',
        'type=bind,source=' + str(new / 'site') + ',target=/usr/share/nginx/html,readonly', 'e11-web:1.0')
    run('docker', 'inspect', 'e11-web-bind', '--format', '{{json .Mounts}}')
    # A few retries allow the newly started server to become ready.
    run('curl', '--fail', '--retry', '5', '--retry-connrefused', '--retry-delay', '1', '-i', 'http://localhost:8082')
    lines.append('PASS: bind server recreated against the new Windows-managed source folder.')
finally:
    (new / 'docs/records/relocation.txt').write_text('\n'.join(lines) + '\n', encoding='utf-8')
    print('\n'.join(lines))
