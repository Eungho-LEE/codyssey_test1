# E1-1 · 내 컴퓨터에 개발자용 작업실 꾸미기

Windows PC에 WSL 2 기반 Ubuntu 작업 환경을 구성하고, 터미널·파일 권한·Git·Docker를 실습했다. NGINX 기반 커스텀 웹 서버 이미지를 만들고 포트 매핑, 바인드 마운트의 변경 반영, Docker 볼륨의 데이터 영속성을 확인했다.

- 실습일: 2026-11-05
- 작성자: Eungho-Lee
- 제출용 GitHub 저장소: [Eungho-LEE/codyssey_test1](https://github.com/Eungho-LEE/codyssey_test1)
- 웹 서버 소스: [site/index.html](site/index.html) · [Dockerfile](Dockerfile)

> 이 문서는 실제 HTML 기록장, 터미널 로그, 브라우저 캡처를 바탕으로 정리했다. 긴 로그에서는 핵심 명령과 출력을 발췌했으며, `…`는 생략을 뜻한다. 개인 이메일과 인증 관련 설정은 공개용 기록에서 가렸다. **사용자 최초 실습과 이후 AI 보조 보완 검증을 구분해 기록했다.**

학습 자료: [입력형 교재·복습 교재 모음](learning/README.md) · [핵심 개념과 명령어 복습](learning/복습_핵심개념과_명령어.md)

## 1. 실행 환경

| 항목 | 실습 환경 |
| --- | --- |
| 호스트 OS | Windows 11, AMD64 PC |
| Linux 실행 환경 | WSL 2 / 배포판 이름 Ubuntu-26.04 |
| Ubuntu | Ubuntu 26.04.1 LTS (Resolute Raccoon) |
| Linux 커널 | 6.18.54.1-microsoft-standard-WSL2 |
| 쉘 | Bash, `/bin/bash` |
| 터미널·편집기 | Windows용 VSCode의 통합 터미널 / WSL 연결, 버전 별도 미기록 |
| Git | 2.53.0 |
| Docker Desktop | 4.98.0 |
| Docker CLI / Engine | 29.9.2 / 29.9.2, linux/amd64 |
| 웹 서버 베이스 | nginx:alpine, 응답에 표시된 NGINX 버전 1.31.8 |
| 컨테이너 Linux 이미지 | ubuntu:24.04 |
| 최초 실습 경로 | `/home/ox6965/codyssey/e1-1-workstation` (이후 호환 링크로 전환) |
| 현재 Windows 관리 경로 | `C:\Users\nabis\Desktop\Projects\codyssey\e1-1-workstation` |
| 현재 Ubuntu 접근 경로 | `/mnt/c/Users/nabis/Desktop/Projects/codyssey/e1-1-workstation` |

WSL Ubuntu의 버전과 컨테이너 Ubuntu의 버전은 서로 다른 실행 환경이므로 달라도 된다. 최초 권한 실습은 Ubuntu 홈 폴더에서 수행했다. 이후 관리 편의를 위해 Windows 프로젝트 폴더로 이전했다. Linux 고유 권한 실습을 다시 할 때는 [복습 교재](learning/복습_핵심개념과_명령어.md)의 Linux 임시 폴더 절차를 사용한다.

환경 증거: [WSL 배포판 목록](docs/records/step-00.txt), [Docker 설치·엔진 점검](docs/records/step-06.txt), [OS·쉘·Git 버전 기록](docs/records/step-13.txt), [문서 작성 시 재조회](docs/records/authoring-check.txt).

## 2. 수행 체크리스트와 검증 위치

| 항목 | 상태 | 검증 방법 및 증거 |
| --- | --- | --- |
| 터미널 기본 조작·경로 | 확인 | pwd, ls -la, touch, cp, mv, mkdir, rm, rmdir · [기록](docs/records/step-03.txt) |
| 파일 1개·디렉터리 1개 권한 변경 | 확인 | chmod 후 ls -ld 비교 · [기록](docs/records/step-04.txt) |
| Docker 버전·엔진 동작 | 확인 | docker --version, docker version, docker info · [기록](docs/records/step-06.txt) |
| hello-world 실행 | 확인 | Hello from Docker! · [터미널 로그](docs/logs/07-containers.txt) |
| Ubuntu 컨테이너 내부 진입 | 확인 | bash 진입 및 컨테이너 안 pwd · [터미널 로그](docs/logs/07-containers.txt) |
| attach·exec·분리 비교 | 보완 확인 | 별도 컨테이너에서 exec 쉘 종료·attach 분리 후 Running=true 확인 · [실제 보완 로그](docs/records/supplement-attach-exec.txt) |
| 이미지·컨테이너 운영 | 확인 | pull, images, start, stop, ps, ps -a, logs, stats · [기록](docs/records/step-08.txt) |
| 직접 작성한 Dockerfile·빌드 | 확인 | e11-web:1.0 생성 · [기록](docs/records/step-09.txt) |
| 포트 매핑·브라우저 접속 | 확인 | 8080 → 80, HTTP 200과 주소창 캡처 · [기록](docs/records/step-10.txt) |
| 바인드 마운트 변경 반영 | 확인 | 8082에서 version-1 → version-2 · [기록](docs/records/step-11.txt) |
| 볼륨 영속성 | 확인 | 컨테이너 A 삭제 후 B에서 동일 데이터 조회 · [기록](docs/records/step-12.txt) |
| Git 작성자·기본 브랜치·커밋 | 확인 | git config --list, main, 커밋 이력 · [설정](docs/records/git-config.txt), [초기 커밋](docs/records/step-05.txt) |
| GitHub 원격 연결 | 연결 확인 | origin 연결 및 기존 main 이력 fetch · [연결 기록](docs/records/remote-connected.txt) |
| GitHub 푸시·VSCode 연동 | 확인 | main 업로드 및 로컬·원격 SHA 일치 · [푸시 기록](docs/records/push-proof.txt), [로그인 캡처](docs/images/14-vscode-github-account.png) |
| 트러블슈팅 2건 이상 | 확인 | 실제 발생·해결 기록 3건을 10절에 정리 |

최초 증거인 **8080의 이미지 실행과 8082의 마운트 실행**에 더해, 보완 검증으로 같은 원본 이미지의 **8081 접속**과 새 위치에서 빌드한 **8090 접속**을 추가 확인했다. [보완 빌드·HTTP 200 로그](docs/records/supplement-web.txt)

## 3. 저장소 구성

```text
.
├─ README.md
├─ Dockerfile
├─ .dockerignore
├─ .gitignore
├─ site/
│  └─ index.html
├─ learning/                # 입력형 HTML 교재와 핵심 개념 복습 교재
├─ scripts/                 # 실제 보완 검증 및 교재 HTML 생성 소스
└─ docs/
   ├─ images/
   │  ├─ 10-port-8080.png
   │  ├─ 11-bind-before.png
   │  └─ 11-bind-after.png
   ├─ records/              # HTML 기록장에서 추출한 명령·출력, 환경 재확인
   └─ logs/                 # script로 남긴 터미널 기록의 공개용 사본
```

HTML 기록장의 7단계에는 설치 점검 내용이 중복 기록되어 있어, 컨테이너 실습은 실제 `07-containers.txt` 로그로 확인했다. 원시 터미널 기록에는 입력 편집·화면 갱신의 흔적이 남아 있으므로 읽기 쉬운 HTML 추출 기록을 함께 제공한다. 자료 출처와 스크린샷 SHA-256은 [sources.json](docs/records/sources.json)에 있다.

## 4. 터미널 조작과 파일 권한

### 4-1. 디렉터리·파일 조작

아래는 실제 기록에서 발췌한 명령과 출력이다.

```bash
$ cd practice/terminal
$ pwd
/home/ox6965/codyssey/e1-1-workstation/practice/terminal
$ touch empty.txt
$ printf 'Hello terminal\n' > memo.txt
$ cat memo.txt
Hello terminal
$ cp memo.txt copy.txt
$ mv copy.txt renamed.txt
$ mkdir archive
$ mv renamed.txt archive/
$ cat archive/renamed.txt
Hello terminal
$ rm archive/renamed.txt
$ rmdir archive
$ ls -la
# 목록에 empty.txt, memo.txt, 추가 복사본 12323ffy.txt가 남아 있고 archive는 없음
```

위 마지막 주석은 결과 해석이며 실제 ls 출력은 [전체 기록](docs/records/step-03.txt)에 있다. `touch`는 빈 파일, `cp`는 복사, `mv`는 이동·이름 변경, `rm`은 파일 삭제, `rmdir`은 빈 디렉터리 삭제에 사용했다. `ls -la`로 숨김 항목을 포함한 상세 목록을 확인했다.

- 절대 경로 예: `/home/ox6965/codyssey/e1-1-workstation/practice/terminal/memo.txt`
- 상대 경로 예: 과제 루트에서 `practice/terminal/memo.txt`
- `~`는 사용자 홈, `.`은 현재 디렉터리, `..`는 부모 디렉터리이다.

### 4-2. 권한 변경 전후

파일 `sample.txt`와 디렉터리 `sample-dir`에 서로 다른 권한을 적용한 후 원래의 644·755로 되돌렸다.

```bash
$ ls -ld practice/permissions/sample.txt practice/permissions/sample-dir
drwxr-xr-x 2 ox6965 ox6965 4096 Nov  5 18:00 practice/permissions/sample-dir
-rw-r--r-- 1 ox6965 ox6965   16 Nov  5 18:00 practice/permissions/sample.txt

$ chmod 600 practice/permissions/sample.txt
$ chmod 700 practice/permissions/sample-dir
$ ls -ld practice/permissions/sample.txt practice/permissions/sample-dir
drwx------ 2 ox6965 ox6965 4096 Nov  5 18:00 practice/permissions/sample-dir
-rw------- 1 ox6965 ox6965   16 Nov  5 18:00 practice/permissions/sample.txt

$ chmod 644 practice/permissions/sample.txt
$ chmod 755 practice/permissions/sample-dir
$ ls -ld practice/permissions/sample.txt practice/permissions/sample-dir
drwxr-xr-x 2 ox6965 ox6965 4096 Nov  5 18:00 practice/permissions/sample-dir
-rw-r--r-- 1 ox6965 ox6965   16 Nov  5 18:00 practice/permissions/sample.txt
```

세 숫자는 소유자·그룹·그 외 사용자의 순서다. `r=4`, `w=2`, `x=1`을 합산하므로 644는 `rw-r--r--`, 755는 `rwxr-xr-x`이다. 디렉터리의 x는 경로를 통과하고 내부에 접근하는 권한이다. [권한 전체 기록](docs/records/step-04.txt)

## 5. Docker 설치·컨테이너 운영

### 5-1. 설치 및 엔진 확인

```text
$ docker --version
Docker version 29.9.2, build a82e528

$ docker version
Client: Version 29.9.2 / OS/Arch linux/amd64
Server: Docker Desktop 4.98.0
Engine: Version 29.9.2 / OS/Arch linux/amd64

$ docker info
Server Version: 29.9.2
Operating System: Docker Desktop
OSType: linux
Architecture: x86_64
```

상세 출력에서 핵심 항목만 발췌했다. Client뿐 아니라 Server 정보가 나오는 것으로 엔진 연결을 확인했다. [전체 점검 기록](docs/records/step-06.txt)

### 5-2. hello-world 및 Ubuntu 진입

```text
$ docker run --name e11-hello hello-world
Hello from Docker!
This message shows that your installation appears to be working correctly.

$ docker run -it --name e11-shell ubuntu:24.04 bash
root@56ca9f888082:/# pwd
/
root@56ca9f888082:/# exit
```

hello-world는 메시지 출력 후 종료하므로 `Exited (0)`가 정상이다. Ubuntu 컨테이너의 주 프로세스인 bash에서 `exit`하면 컨테이너도 멈춘다. `docker run`은 새 컨테이너 생성이고, 기존 컨테이너 재실행은 `docker start`이다. [실행·진입 로그](docs/logs/07-containers.txt)

`exec`는 실행 중인 컨테이너 안에 추가 명령·쉘을 만들고, `attach`는 주 프로세스의 입출력에 연결한다. 학습 중 VSCode에서 분리 단축키 문제를 겪었다. 보완 검증에서는 별도의 컨테이너를 만들고 **명시적인 분리 키 Ctrl+X, Ctrl+X**로 검사했다.

```text
$ docker exec 검증컨테이너 bash -lc 'pwd; ls /; echo EXEC_SESSION; exit 0'
/
…
EXEC_SESSION
$ docker inspect 검증컨테이너 --format '{{.State.Running}}'
true
$ docker attach --detach-keys=ctrl-x,ctrl-x 검증컨테이너
root@…:/# echo ATTACH_CONNECTED
ATTACH_CONNECTED
[Ctrl+X, Ctrl+X 전송]
read escape sequence
$ docker inspect 검증컨테이너 --format '{{.State.Running}}'
true
```

위 발췌의 검증컨테이너는 설명용 이름이며 실제 고유 이름·출력은 [보완 로그](docs/records/supplement-attach-exec.txt)에 있다. 현재 Docker CLI는 분리 시 `read escape sequence`와 종료 코드 1을 반환했으므로 코드 0으로 기록하지 않았다. 분리 후 주 컨테이너가 `Running=true`이며 명시적인 stop 후 `false`가 되는 것으로 유지·종료 차이를 확인했다. [실행한 검증 소스](scripts/verify_attach_exec.py)는 본인의 VSCode 키보드 충돌까지 해결했다는 뜻은 아니다.

### 5-3. 운영 명령

| 목적 | 수행 명령 | 실제 확인 결과 |
| --- | --- | --- |
| 이미지 다운로드 | docker pull nginx:alpine | Downloaded newer image |
| 이미지 목록 | docker images | hello-world, nginx:alpine, ubuntu:24.04 |
| 컨테이너 재시작 | docker start e11-lab | e11-lab 출력 |
| 실행 중·전체 목록 | docker ps / docker ps -a | Up 및 Exited 상태 구분 |
| 로그 | docker logs e11-hello | Hello from Docker! |
| 리소스 | docker stats --no-stream e11-lab | CPU 0.00%, MEM 1.848MiB / 15.27GiB |
| 중지 | docker stop e11-lab | 중지 후 Exited (137) 관찰 |

`Exited (137)`은 정상 종료 코드 0과는 다르므로 성공 코드라고 해석하지 않았다. 해당 실습에서는 stop 후 실행 상태가 종료 상태로 바뀐 것을 확인했다. [명령·출력 전체](docs/records/step-08.txt)

## 6. Dockerfile 기반 커스텀 이미지

[Dockerfile](Dockerfile)은 다음과 같이 직접 작성했다.

```dockerfile
FROM nginx:alpine
LABEL org.opencontainers.image.title="e11-workstation-web"
COPY site/ /usr/share/nginx/html/
EXPOSE 80
```

| 커스텀 항목 | 목적 |
| --- | --- |
| NGINX Alpine 베이스 선택 | 별도 웹 프레임워크 없이 정적 HTML을 제공하는 서버 기능 활용 |
| LABEL | 이미지 용도를 e11-workstation-web으로 식별 |
| COPY | 기본 웹 루트에 내가 만든 HTML을 넣어 기본 환영 페이지 교체 |
| EXPOSE 80 | 컨테이너의 서버 포트를 문서화. 실제 호스트 연결은 run의 -p로 설정 |

이미지는 프로그램·파일·설정·실행 정보를 담은 패키지이고, 컨테이너는 그 이미지로 만들어 실행하는 환경이다. 이미지가 존재하는 것과 서버가 실행 중인 것은 다르다.

```text
$ docker build --progress=plain -t e11-web:1.0 .
#6 [2/2] COPY site/ /usr/share/nginx/html/
#6 DONE 0.1s
#7 naming to docker.io/library/e11-web:1.0 done
#7 DONE 0.2s

$ docker images e11-web
IMAGE         ID             DISK USAGE   CONTENT SIZE
e11-web:1.0   e56ff6542972       93.6MB         26.3MB
```

빌드 당시 베이스 digest는 다음과 같다.

```text
nginx@sha256:785835ea65db4bba6f021acc0f3be91b0fef76a53fe41f8588c6698d2aed0606
```

`nginx:alpine` 태그의 내용은 향후 달라질 수 있다. 동일 베이스가 필요한 경우 위 digest를 참조할 수 있다. [Dockerfile 작성·빌드 기록](docs/records/step-09.txt)

## 7. 포트 매핑과 바인드 마운트

### 7-1. 이미지 기반 서버: 호스트 8080 → 컨테이너 80

```text
$ docker run -d --name e11-web-8080 -p 127.0.0.1:8080:80 e11-web:1.0
44728c17656a09e52efb13ee729fdbac72f50a3e98453ed6050eb1db951295c9
$ docker port e11-web-8080
80/tcp -> 127.0.0.1:8080
$ curl -i http://localhost:8080
HTTP/1.1 200 OK
Server: nginx/1.31.8
Content-Type: text/html
…
<p id="version">version-1</p>
```

컨테이너 내부 서버는 80번에서 요청을 받는다. `-p 127.0.0.1:8080:80`은 내 PC의 8080 접속을 컨테이너 80에 전달한다. [실행·HTTP 응답 기록](docs/records/step-10.txt)

![localhost:8080에서 version-1을 표시한 이미지 기반 서버](docs/images/10-port-8080.png)

### 7-2. 마운트 기반 서버: 호스트 8082 → 컨테이너 80

```bash
docker run -d --name e11-web-bind -p 127.0.0.1:8082:80 --mount "type=bind,source=$(pwd)/site,target=/usr/share/nginx/html,readonly" e11-web:1.0
docker inspect e11-web-bind --format '{{json .Mounts}}'
```

실제 Mounts 출력에서 `Type=bind`, Source가 과제의 `site` 폴더, Destination이 `/usr/share/nginx/html`, `RW=false`임을 확인했다. 호스트의 파일을 컨테이너에서 읽기 전용으로 보도록 연결한 것이다.

**변경 전:** 8082에서 `version-1`을 확인했다.

![바인드 마운트 변경 전 localhost:8082의 version-1](docs/images/11-bind-before.png)

```bash
$ sed -i 's/version-1/version-2/' site/index.html
$ curl -s http://localhost:8082
…
<p id="version">version-2</p>
$ curl -s http://localhost:8080
…
<p id="version">version-1</p>
```

**변경 후:** 재빌드 없이 8082가 `version-2`로 바뀌었다.

![바인드 마운트 변경 후 localhost:8082의 version-2](docs/images/11-bind-after.png)

8080은 이미지에 복사된 파일을 사용하여 version-1을 유지하고, 8082는 현재 호스트 파일을 연결하여 version-2를 보여준다. 바인드 마운트는 호스트 수정 반영에 활용할 수 있다. [호스트 파일·응답 전후 전체 기록](docs/records/step-11.txt)

## 8. Docker 볼륨 영속성

이름 있는 볼륨 `e11-data`를 `/data`에 연결했다. 볼륨 안에는 영속 파일, 볼륨 밖에는 비교용 임시 파일을 작성했다.

```bash
$ docker volume create e11-data
e11-data
$ docker run -d --name e11-vol-a --mount type=volume,source=e11-data,target=/data ubuntu:24.04 sleep infinity
$ docker exec e11-vol-a bash -lc 'echo "my-persistent-record" > /data/proof.txt; echo "temporary-record" > /tmp/local-only.txt'
$ docker exec e11-vol-a cat /data/proof.txt
my-persistent-record
$ docker exec e11-vol-a cat /tmp/local-only.txt
temporary-record
$ docker stop e11-vol-a
e11-vol-a
$ docker rm e11-vol-a
e11-vol-a
$ docker ps -a --filter name=e11-vol-a
CONTAINER ID   IMAGE     COMMAND   CREATED   STATUS    PORTS     NAMES
```

같은 볼륨을 새 컨테이너 B에 연결했다.

```bash
$ docker run -d --name e11-vol-b --mount type=volume,source=e11-data,target=/data ubuntu:24.04 sleep infinity
$ docker exec e11-vol-b cat /data/proof.txt
my-persistent-record
$ docker exec e11-vol-b bash -lc 'if [ -e /tmp/local-only.txt ]; then cat /tmp/local-only.txt; else echo "temporary file is absent"; fi'
temporary file is absent
```

컨테이너 A를 실제 삭제한 뒤에도 볼륨의 데이터는 B에서 유지됐다. 볼륨 밖 임시 파일은 새 컨테이너에 없었다. 따라서 컨테이너의 쓰기 영역과 이름 있는 볼륨의 수명이 다름을 확인했다. [생성·연결·삭제·재검증 전체 기록](docs/records/step-12.txt)

## 9. Git 설정과 GitHub 제출 상태

Git은 로컬 변경 이력을 관리하고, GitHub는 원격 저장소를 보관·공유하는 서비스이다. `commit`은 로컬 기록이고 `push`가 원격 업로드이다.

```text
$ git config --list
user.name=Eungho-Lee
user.email=[이메일 마스킹]
init.defaultbranch=main
core.repositoryformatversion=0
core.filemode=true
core.bare=false
core.logallrefupdates=true
```

초기 커밋 `5779ef8`과 웹 서버 실습 커밋 `370328e`를 만들었고, 문서 작성 시 main의 최신 커밋은 `9bd7811 docs: update practice logs`였다. [초기 설정·커밋](docs/records/step-05.txt), [현재 설정](docs/records/git-config.txt), [문서 작성 시 상태](docs/records/authoring-check.txt)

처음에는 GitHub에 `codyssey_test1` 저장소만 만들었고 로컬에는 원격 연결이 없었다. 이후 사용자 요청으로 기존 GitHub CLI 인증을 사용하여 origin을 연결하고 원격 이력을 가져왔다. 인증 토큰을 문서·파일에 저장하지 않았다. 이후 생성하는 커밋의 작성자 이메일은 GitHub noreply 주소를 사용한다.

```text
$ git remote -v
origin  https://github.com/Eungho-LEE/codyssey_test1.git (fetch)
origin  https://github.com/Eungho-LEE/codyssey_test1.git (push)
```

[원격 연결 기록](docs/records/remote-connected.txt) · [연결 전 기록](docs/records/step-14.txt). 원격의 초기 README 커밋 `03d34cb`는 병합 커밋 `6429e61`로 로컬 이력과 함께 보존했다. 원격 README 원문도 [별도 기록](docs/records/github-initial-README.md)에 남겼다. [병합 과정](docs/records/history-integration.txt)

공개 범위에 대한 사용자 승인 후 main을 업로드했다. 최초 업로드 확인 커밋은 `d7de957`이며, push 성공과 로컬 HEAD·원격 main의 동일 SHA를 확인했다. 이후 문서·증거 보완분도 main에 반영한다. [실제 푸시 기록](docs/records/push-proof.txt)

VSCode의 WSL 과제 작업 공간에서 Accounts 메뉴의 `Eungho-LEE (GitHub)` 로그인을 확인했다. 새 WSL 경로의 폴더 신뢰는 사용자가 직접 적용했고, Restricted Mode 표시가 사라짐도 확인했다.

![VSCode GitHub 로그인 계정과 WSL 과제 작업 공간](docs/images/14-vscode-github-account.png)

## 10. 트러블슈팅

### 문제 1. Dockerfile 지시문을 터미널에서 실행

- **문제:** `FROM nginx:alpine`과 `LABEL …` 입력 시 `command not found`가 발생했다.
- **원인 가설:** Linux 쉘 명령과 Dockerfile에 작성할 지시문을 혼동했다.
- **확인:** 터미널 기록에 `FROM: command not found`, `LABEL: command not found`가 있었고 Dockerfile을 아직 만들지 않은 상태였다.
- **해결:** `cat > Dockerfile <<'EOF'`를 사용해 네 줄을 파일로 저장하고 `cat Dockerfile`로 확인했다. 이후 `docker build`가 성공하고 `e11-web:1.0` 이미지가 생성됐다.
- **증거:** [오류·수정·빌드 성공 기록](docs/records/step-09.txt)

### 문제 2. 잘못된 작업 위치에서 이미지 빌드

- **문제:** `/mnt/c/Users/nabis`에서 빌드해 `failed to read dockerfile: open Dockerfile: no such file or directory`가 발생했다. 생성되지 않은 verify 이미지를 실행하려다 실패했고 8090 curl 접속도 실패했다.
- **원인 가설:** 마지막 `.`이 지정한 빌드 컨텍스트에 Dockerfile이 없다.
- **확인:** `practice` 폴더에서도 같은 오류를 재현하고 `pwd`, `ls -la`로 Dockerfile이 없음을 확인했다. 과제 루트에서 `ls -l Dockerfile`은 파일을 표시했다.
- **해결:** 당시에는 과제 루트에서 `docker build -t e11-web:check .` 빌드 성공까지 기록했다. 이후 보완 검증에서는 새 작업 위치에서 verify 이미지를 빌드하고 8090 HTTP 200·version-2까지 확인했다. [후속 성공 기록](docs/records/supplement-web.txt)
- **증거:** [빌드 위치 오류·check 태그 빌드 성공](docs/records/step-13.txt)

### 문제 3. 여러 줄 파일 입력의 종료 구분자 혼동

- **문제:** HTML 작성 중 소문자 `eof`를 입력하고 `cat site/index.html`까지 이어 적었더니 두 줄이 HTML 파일 내용에 포함됐다.
- **원인 가설:** 시작 시 지정한 구분자 `EOF`와 소문자 `eof`가 다르므로 입력 종료로 인식되지 않았다.
- **확인:** `cat site/index.html` 출력 끝에 `eof`와 `cat site/index.html` 문자열이 들어 있었다.
- **해결:** `cat > site/index.html <<'EOF'`로 HTML 전체를 다시 작성하고 단독 대문자 `EOF`로 종료했다. 다시 출력해 불필요한 줄이 사라진 정상 HTML을 확인했다.
- **증거:** [HTML 입력 오류·재작성 기록](docs/records/step-09.txt)

## 11. 평가자 재현 방법

이 절은 **다시 실행할 절차**이다. 최초 8090 검증은 빌드 위치 오류로 실패했지만, 이후 새 작업 경로에서 다시 빌드·실행해 8090 HTTP 200과 version-2를 확인했다. 같은 원본 이미지로 실행한 8081은 version-1을 확인했다. [실제 보완 기록](docs/records/supplement-web.txt)

### 11-1. 준비

Windows에서 WSL 2, Ubuntu, Docker Desktop의 WSL 연동을 준비한다. Ubuntu에서 `docker version`의 Client·Server를 확인한다. GitHub 업로드 후 저장소를 clone하거나 제출된 전체 폴더를 받아 **Dockerfile이 있는 루트**에서 시작한다.

```bash
pwd
ls -l Dockerfile site/index.html
docker build -t e11-web:review .
docker run -d --name e11-review-web -p 127.0.0.1:8090:80 e11-web:review
curl -i http://localhost:8090
```

브라우저에서 `http://localhost:8090`을 연다. 제출된 현재 HTML은 마운트 실습 후의 **version-2**이므로 새 빌드도 version-2를 보여줘야 한다. 초기 e11-web:1.0의 version-1 기록과 시점이 다르다. 이름이나 포트가 이미 사용 중이면 새로운 이름·호스트 포트를 정하고 접속 주소도 같이 바꾼다.

### 11-2. 마운트 재현

```bash
docker run -d --name e11-review-bind -p 127.0.0.1:8092:80 --mount "type=bind,source=$(pwd)/site,target=/usr/share/nginx/html,readonly" e11-web:review
curl -s http://localhost:8092
```

`site/index.html`의 version-2를 다른 문구로 수정하고 8092를 다시 조회한다. 마운트 서버에는 반영되고, 이미지로만 실행한 8090에는 반영되지 않는지 비교한다. 필요하면 수정한 원본을 되돌린다.

### 11-3. 볼륨 재현

```bash
docker volume create e11-review-data
docker run -d --name e11-review-a --mount type=volume,source=e11-review-data,target=/data ubuntu:24.04 sleep infinity
docker exec e11-review-a bash -lc 'echo review-proof > /data/proof.txt'
docker exec e11-review-a cat /data/proof.txt
docker stop e11-review-a
docker rm e11-review-a
docker run -d --name e11-review-b --mount type=volume,source=e11-review-data,target=/data ubuntu:24.04 sleep infinity
docker exec e11-review-b cat /data/proof.txt
```

앞뒤 모두 `review-proof`가 출력되는지 확인한다. 새 이름을 사용하여 기존 실습 볼륨을 건드리지 않는다. 이 볼륨은 Git으로 전송되지 않으므로 재현할 때 직접 생성한다.

## 12. 폴더 이전과 추가 학습 자료

사용자 요청에 따라 과제를 기존 Windows 프로젝트 관리 위치로 이전했다. 최초 파일 103개를 복사·대조한 뒤 Linux 원본은 `/home/ox6965/codyssey/e1-1-workstation.backup-20261105`에 보존했다. 예전 `~/codyssey/e1-1-workstation`은 새 Windows 폴더를 가리키는 호환 링크다.

Docker 볼륨은 Docker가 계속 관리하고, WSL 배포판 자체도 별도로 유지된다. 파일 작업 공간만 이전한 것이다. 8082 읽기 전용 마운트 서버는 이전 로그를 보존한 후 새 `site` 경로로 재생성하여 HTTP 200과 version-2를 확인했다. [이전·마운트 검증](docs/records/relocation.txt)

```bash
cd /mnt/c/Users/nabis/Desktop/Projects/codyssey/e1-1-workstation
```

학습 자료는 [learning/README.md](learning/README.md)에 모았다. HTML은 내려받아 브라우저로 열고, Markdown은 GitHub에서 바로 읽을 수 있다. 복습 교재에는 경로·권한·이미지·컨테이너·포트·마운트·볼륨·Git 개념, 명령 예제와 옵션 해설, 자주 겪은 오류, 자가 점검 문제와 답이 있다.

검증·반영 과정의 상태는 [점검 기록](제출전_점검.md)에서 확인한다.
