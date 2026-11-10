# 1주차 부가과제 · Docker Compose

2026-11-10에 기존 E1-1 과제에 추가로 수행했다. 원문은 [보너스 과제 5절](../learning/E1-1_개발자용_작업실_꾸미기.txt)에 있다. 아래 결과는 자동화 도구로 실제 CLI를 실행해 검증한 기록이다.

| 부가과제 | 결과 | 증거 |
| --- | --- | --- |
| Compose 단일 서비스 | 완료 | 기존 Dockerfile을 빌드해 18080에서 HTTP 200 및 version-2 확인 |
| Compose 멀티 컨테이너 | 완료 | web·helper가 healthy, web에서 http://helper/status.json 조회 성공 |
| up / down / ps / logs | 완료 | 두 구성의 실행·상태·로그·종료 및 종료 후 빈 목록 확인 |
| 환경 변수 활용 | 완료 | development·8080 → production·9090 전환 후 HTTP 응답 확인 |
| GitHub SSH 키 등록·푸시 | SSH 인증 완료 | 암호 보호 키의 공개키만 등록, Eungho-LEE 인증 및 SSH fetch 성공. 푸시 결과는 SSH 검증 로그 참조 |

**[실제 명령·출력 전체](../docs/records/bonus-compose.txt)** · **[검증 자동화 소스](verify.ps1)**

공개용 로그는 줄끝 공백과 개행 형식만 정규화했다.

## 준비와 실행

Docker Desktop의 Linux 엔진이 실행 중이어야 한다. 이번 검증은 Windows PowerShell 7 / Docker Engine 29.9.2 / Compose v5.6.1에서 수행했다. `docker info`에 엔진 연결 오류가 나면 Docker Desktop을 실행하고 준비 완료 후 다시 확인한다. 로그인용 프로젝트 `env/.env`는 사용하지 않는다.

과제 저장소 루트에서:

```powershell
cd bonus
docker compose -p e11-bonus-single -f compose.single.yml up -d --build --wait
docker compose -p e11-bonus-single -f compose.single.yml ps
Invoke-WebRequest http://127.0.0.1:18080/
docker compose -p e11-bonus-single -f compose.single.yml logs --tail 15
docker compose -p e11-bonus-single -f compose.single.yml down
```

`compose.single.yml`의 `build: ..`는 부모의 기존 Dockerfile을 사용한다. `ports`는 호스트 18080을 컨테이너의 80으로 연결한다. 기존 `docker run` 옵션을 YAML에 남기면 같은 설정을 공유하고 다시 실행할 수 있다.

## 두 컨테이너의 통신

```powershell
docker compose -p e11-bonus-multi up -d --build --wait
docker compose -p e11-bonus-multi ps
docker compose -p e11-bonus-multi exec -T web wget -qO- http://helper/status.json
Invoke-WebRequest http://127.0.0.1:18081/api/status.json
docker compose -p e11-bonus-multi logs --no-color --tail 20
```

실제 내부 통신과 외부 프록시 응답은 모두 다음과 같았다.

```json
{"service":"helper","message":"Compose service discovery works"}
```

`web`은 호스트로 포트를 공개하고, `helper`는 같은 Compose 네트워크에서만 접근한다. `helper`라는 서비스 이름이 내부 DNS 이름이 된다. 컨테이너 안의 `localhost`는 그 컨테이너 자신이므로 보조 서비스 접속 주소로 사용할 수 없다. `depends_on`의 `service_healthy`로 보조 서비스의 준비를 기다린다. [Docker 네트워크 공식 문서](https://docs.docker.com/compose/how-tos/networking/)

## 환경 변수로 모드와 포트 변경

최초 응답:

```text
HTTP 200
Codyssey week 1 bonus
mode=development
port=8080
```

동일한 이미지에서 설정만 바꾼다.

```powershell
$env:APP_MODE = 'production'
$env:APP_PORT = '9090'
$env:HOST_PORT = '18082'
docker compose -p e11-bonus-multi up -d --wait
Invoke-WebRequest http://127.0.0.1:18082/
Invoke-WebRequest http://127.0.0.1:18082/api/status.json
docker compose -p e11-bonus-multi ps
docker compose -p e11-bonus-multi down
Remove-Item Env:APP_MODE, Env:APP_PORT, Env:HOST_PORT
```

실제 변경 후 응답:

```text
HTTP 200
Codyssey week 1 bonus
mode=production
port=9090
```

`APP_PORT`는 서버가 컨테이너 안에서 듣는 포트, `HOST_PORT`는 PC에서 접속하는 포트다. Compose의 `${...:-기본값}` 치환과 `environment` 주입을 통해 NGINX 공식 이미지의 템플릿 처리가 서버 설정을 만든다. `APP_MODE`는 실습용 표시 설정이다. 실제 운영 환경의 보안 설정을 자동 적용하는 값은 아니다. `up`이 변경된 설정으로 web을 재생성하며, `--build` 없이도 새 포트와 모드가 적용되었다. [Docker 환경 변수 공식 문서](https://docs.docker.com/compose/how-tos/environment-variables/set-environment-variables/)

## 한 번에 다시 검증

저장소 루트에서 다음을 실행한다.

```powershell
pwsh -File bonus/verify.ps1
```

자동 검증은 18080·18081·18082를 사용한다. 동일 프로젝트 이름의 컨테이너가 이미 있으면 기존 작업을 변경하지 않고 중단한다. 성공 시 실습 컨테이너와 네트워크를 `down`으로 정리하고, 이미지와 파일은 남긴다. 실행 전 환경 변수는 복원한다. 실패 시 로그에 FAIL을 남기고 중단하므로, 원인을 확인한 후 이 문서의 해당 프로젝트 `down` 명령으로 정리한다. 다른 용도로 이 프로젝트 이름을 사용하지 않는다.

## GitHub SSH 키 등록과 검증

사용자 `.ssh/codyssey_e11_ed25519` 경로에 암호로 보호한 Ed25519 키를 생성했다. 암호는 사용자가 로컬 터미널에서 직접 입력했으며, Git for Windows의 SSH 에이전트에 1시간 동안 잠금 해제했다. [로컬 입력용 스크립트](setup-ssh.ps1)는 암호를 저장하거나 기록하지 않는다. `.ssh/codyssey-e11-agent.json`은 에이전트 연결 메타데이터만 담고 저장소 밖에 보관한다. GitHub CLI 로그인은 없지만 Aside의 GitHub에는 Eungho-LEE로 로그인되어 있어 이 세션을 재사용한다.

GitHub의 이메일 본인 확인은 사용자가 직접 완료했다. Aside에서 공개키 등록과 지문 일치를 확인한 뒤, SSH로 인증하고 fetch에 성공했다. 기존 원격 HTTPS 주소는 `https://github.com/Eungho-LEE/codyssey_test1.git`였으며, 이 저장소의 origin을 `git@github.com:Eungho-LEE/codyssey_test1.git`로 변경했다. Git의 로컬 `core.sshCommand`에 Git for Windows SSH 실행 파일·전용 키·전용 known_hosts 경로를 지정했다. 다른 저장소의 전역 Git 설정은 변경하지 않았다.

**[실제 SSH 검증 로그](../docs/records/bonus-ssh.txt)**

```text
Hi Eungho-LEE! You've successfully authenticated, but GitHub does not provide shell access.
[exit=1]
```

GitHub는 셸을 제공하지 않아 성공 인사와 함께 종료 코드 1을 반환한다. 따라서 인사에 표시된 계정과 성공 문구를 함께 확인했다. GitHub 서버의 Ed25519 호스트 지문은 `SHA256:+DiY3wvvV6TuJJhbpZisF/zLDA0zPMSvHdkr4UvCOqU`이며 공식 공개키를 저장소 밖 전용 `known_hosts` 파일에 고정해 검증했다. [GitHub 공식 호스트 지문](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/githubs-ssh-key-fingerprints)

이 PC에서 다시 SSH를 사용할 때는 터미널에서 아래 절차를 따른다. 에이전트의 키는 1시간 뒤 만료되며, `setup-ssh.ps1`을 다시 실행하면 기존 키를 덮어쓰지 않고 암호를 입력받아 잠금을 해제한다.

```powershell
pwsh -File bonus/setup-ssh.ps1
$agentState = Get-Content (Join-Path $env:USERPROFILE '.ssh/codyssey-e11-agent.json') -Raw | ConvertFrom-Json
$env:SSH_AUTH_SOCK = $agentState.socket
$env:SSH_AGENT_PID = $agentState.pid
git fetch origin
git push origin main
```

다른 PC에서는 그 PC의 키를 별도로 생성·등록하고 로컬 `core.sshCommand` 경로를 맞춘다. 개인키를 과제 저장소로 복사하지 않는다. 핵심 절차는 다음과 같다.

1. 개인키는 계속 저장소 밖에 보관한다. 개인키·암호를 문서·채팅에 넣지 않는다.
2. GitHub의 SSH keys 설정에 **공개키만** 등록한다.
3. GitHub 공식 호스트 지문과 대조한 뒤 `ssh -T git@github.com`으로 인증 계정을 확인한다. GitHub는 셸을 제공하지 않으므로 성공 인사와 함께 종료 코드 1을 반환할 수 있다.
4. 기존 원격 주소를 기록하고 SSH 원격 주소 `git@github.com:Eungho-LEE/codyssey_test1.git`를 사용해 실제 푸시와 원격 SHA 일치를 검증한다.

[GitHub 공식 SSH 검증 절차](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/testing-your-ssh-connection)
