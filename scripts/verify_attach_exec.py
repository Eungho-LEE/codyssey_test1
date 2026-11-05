#!/usr/bin/env python3
"""Run an isolated attach/exec verification and keep a real transcript.

Uses a fresh Ubuntu container; removes only that container after verification.
Run under Linux/WSL with Docker Desktop integration enabled.
"""
import datetime
import os
import pathlib
import pty
import re
import select
import shlex
import subprocess
import time

ROOT = pathlib.Path(__file__).resolve().parents[1]
LOG = ROOT / 'docs/records/supplement-attach-exec.txt'
name = 'e11-proof-attach-' + str(int(time.time()))
transcript = ['Assistant supplemental verification (not the original student session)',
              'UTC: ' + datetime.datetime.now(datetime.timezone.utc).isoformat()]


def run(*args, check=True):
    transcript.append('$ ' + shlex.join(args))
    result = subprocess.run(args, capture_output=True, text=True, timeout=30)
    transcript.append(result.stdout.rstrip())
    if result.stderr:
        transcript.append(result.stderr.rstrip())
    transcript.append('[exit=' + str(result.returncode) + ']')
    if check and result.returncode:
        raise RuntimeError('Command failed: ' + shlex.join(args))
    return result.stdout.strip()


created = False
attach = None
master = slave = None
try:
    run('docker', 'run', '-dit', '--name', name, '--label', 'codyssey.supplement=true', 'ubuntu:24.04', 'bash')
    created = True
    run('docker', 'exec', name, 'bash', '-lc', 'pwd; ls /; echo EXEC_SESSION; exit 0')
    assert run('docker', 'inspect', name, '--format', '{{.State.Running}}') == 'true'
    transcript.append('PASS: ending the exec shell leaves the main bash running.')
    args = ['docker', 'attach', '--detach-keys=ctrl-x,ctrl-x', name]
    transcript.append('$ ' + shlex.join(args))
    master, slave = pty.openpty()
    attach = subprocess.Popen(args, stdin=slave, stdout=slave, stderr=slave,
                              start_new_session=True, env={**os.environ, 'TERM': 'xterm'})
    os.close(slave)
    slave = None
    time.sleep(0.5)
    os.write(master, b'echo ATTACH_CONNECTED\r')
    chunks = bytearray()
    deadline = time.monotonic() + 15
    while time.monotonic() < deadline:
        if select.select([master], [], [], 0.2)[0]:
            chunks.extend(os.read(master, 65536))
        # PTY output line endings vary. The marker appears in command echo and output.
        if bytes(chunks).count(b'ATTACH_CONNECTED') >= 2:
            break
    else:
        transcript.append(chunks.decode('utf-8', errors='replace'))
        raise RuntimeError('attach did not produce the expected echo output')
    transcript.append(chunks.decode('utf-8', errors='replace'))
    transcript.append('[sent Ctrl+X, Ctrl+X to detach; no exit command sent]')
    os.write(master, b'\x18\x18')
    code = attach.wait(timeout=15)
    remaining = bytearray()
    while select.select([master], [], [], 0)[0]:
        try:
            part = os.read(master, 65536)
        except OSError:
            break
        if not part:
            break
        remaining.extend(part)
    detach_output = remaining.decode('utf-8', errors='replace')
    transcript.append(detach_output)
    transcript.append('[docker attach exit=' + str(code) + ']')
    assert run('docker', 'inspect', name, '--format', '{{.State.Running}}') == 'true'
    if code != 0 and 'read escape sequence' not in detach_output:
        raise RuntimeError('Unexpected attach exit: ' + str(code))
    transcript.append('PASS: attach disconnected while the container remained running.')
    run('docker', 'stop', '--timeout', '3', name)
    assert run('docker', 'inspect', name, '--format', '{{.State.Running}}') == 'false'
    transcript.append('PASS: explicit docker stop changes Running to false.')
except Exception as error:
    transcript.append('VERIFICATION FAILED: ' + str(error))
    raise
finally:
    if attach is not None and attach.poll() is None:
        # Docker attach proxies TERM to the container, so kill only this client.
        attach.kill()
        attach.wait(timeout=5)
    for fd in (master, slave):
        if fd is not None:
            os.close(fd)
    if created:
        run('docker', 'stop', '--timeout', '3', name, check=False)
        run('docker', 'rm', name, check=False)
    LOG.parent.mkdir(parents=True, exist_ok=True)
    text = '\n'.join(transcript) + '\n'
    text = re.sub(r'\x1b\[[0-?]*[ -/]*[@-~]', '', text).replace('\r', '')
    LOG.write_text(text, encoding='utf-8')
    print(text)
