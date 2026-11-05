# E1-1 Windows PC 따라 하기

> 작업 공간 이전 안내: 현재 기준 폴더는 `C:\Users\nabis\Desktop\Projects\codyssey\e1-1-workstation`입니다. Ubuntu에서는 `/mnt/c/Users/nabis/Desktop/Projects/codyssey/e1-1-workstation`으로 접근합니다. 기존 `~/codyssey/e1-1-workstation` 경로는 호환 링크로 유지합니다. 이 교재의 최초 실습 기록과 Linux 권한 설명은 이전 환경을 기준으로 합니다. 권한 실습을 다시 할 때는 [복습 교재](복습_핵심개념과_명령어.md)의 Linux 임시 폴더 절차를 사용하세요.

처음 배우는 사람을 위한 「개발자용 작업실 꾸미기」 실습 교재

작성 기준: 2026-11-05 · 대상: Windows PC · 필수 미션 전체 수행용

이 문서는 실습 안내서입니다. 아래 명령을 직접 실행한 결과와 본인의 설명을 제출 저장소에 기록하세요. 예시 출력은 실제 수행 증거가 아닙니다. 이 교재를 만들면서 PC에 프로그램을 설치하거나 컨테이너를 실행하지는 않았습니다.

## 먼저 전체 흐름 보기

Windows에 Linux 작업 공간을 준비하고 → 터미널과 권한을 배우고 → Git으로 기록하고 → Docker 웹 서버를 만들고 → 접속·파일 반영·데이터 보존을 검증하고 → GitHub 링크로 제출합니다.

| 순서 | 주제 | 완료했을 때 남는 것 |
| --- | --- | --- |
| 0 | 설치 선택과 준비 | 사용할 환경 결정 |
| 1 | WSL·Ubuntu 준비 | Linux 터미널 |
| 2 | VSCode·폴더·기록 준비 | 과제 폴더와 README 틀 |
| 3 | 터미널 기본 조작 | 명령·출력 기록 |
| 4 | 파일·디렉터리 권한 | 변경 전후 비교 |
| 5 | Git 설정과 로컬 커밋 | 버전 관리 시작 |
| 6 | Docker Desktop 설치·점검 | Docker 실행 환경 |
| 7 | 컨테이너 입문 | hello-world·Ubuntu 실습 |
| 8 | 운영 명령 | 이미지·컨테이너 관리 기록 |
| 9 | 나만의 웹 서버 이미지 | HTML·Dockerfile·이미지 |
| 10 | 포트 매핑 | 브라우저 접속 증거 2회 |
| 11 | 바인드 마운트 | 파일 수정 전후 증거 |
| 12 | 볼륨 | 컨테이너 삭제 전후 데이터 증거 |
| 13 | README·트러블슈팅 | 평가 가능한 기술 문서 |
| 14 | GitHub·VSCode 연동과 제출 | 최종 저장소 링크 |

이전 계획의 GitHub 공개 단계는 여기서는 마지막에 배치했습니다. 먼저 로컬 Git으로 기록하고, 문서와 민감정보를 확인한 뒤 업로드합니다. VSCode GitHub 연동 증거도 마지막 단계에서 추가합니다.

## 0. 설치 선택안과 추천

### 추천 조합

**Windows + WSL 2(Ubuntu) + Docker Desktop(WSL 2 연동) + Windows용 VSCode(WSL 확장) + Ubuntu 안의 Git**을 추천합니다.

WSL은 Windows에서 Linux를 사용할 수 있게 하는 기능이고, Ubuntu는 그 안에 설치할 Linux 배포판입니다. Docker Desktop은 컨테이너 실행 엔진을 관리하고, VSCode는 파일을 편집합니다. Git은 변경 이력, GitHub는 원격 저장소를 담당합니다.

| 항목 | 선택안 | 추천과 이유 |
| --- | --- | --- |
| Linux 환경 | WSL 2 / 별도 가상머신 / 별도 Linux PC | **WSL 2**: Windows를 쓰면서 Linux 명령·권한을 실습하기 편함 |
| 배포판 | Ubuntu / Debian 등 | **Ubuntu LTS**: 이 교재 명령을 그대로 따라 하기 쉬움. 예시는 Ubuntu-24.04 |
| Docker 실행 환경 | Docker Desktop / WSL 안에 Docker Engine 직접 설치 | **Docker Desktop**: 초보자가 실행 상태와 설정을 확인하기 쉬움. 직접 Engine 설치는 관리 학습이 추가됨 |
| 편집기 | VSCode / 다른 편집기 | **Windows용 VSCode + WSL 확장**: 과제의 VSCode 연동 증거까지 충족 |
| Git | Ubuntu Git / Git for Windows | **Ubuntu Git**: 실습 위치와 버전 관리 위치를 통일. Windows에서 별도 Git 작업을 할 때만 Git for Windows 추가 |
| 터미널 | Windows Terminal / Ubuntu 앱 창 | **Windows Terminal**: PowerShell과 Ubuntu를 탭으로 구분하기 편함. Ubuntu 앱 창도 가능 |
| 웹 서버 | NGINX 정적 사이트 / Python 웹 서버 | **NGINX 정적 사이트**: 파이썬을 몰라도 이미지·포트·마운트를 집중 학습할 수 있음 |
| GitHub 인증 | VSCode 브라우저 로그인 / SSH | **VSCode 브라우저 로그인**: 처음에는 키·토큰을 직접 다루는 단계를 줄일 수 있음 |

OrbStack은 이 Windows 실습의 선택안으로 사용하지 않습니다. Windows에서 진행하는 이 교재는 Docker Desktop을 기준으로 합니다.

### 설치 전 확인

Windows 검색에서 `winver`를 실행해 Windows 버전·빌드를 적습니다. 설정 → 시스템 → 정보에서 시스템 종류(x64/ARM64), 메모리를 확인합니다. 작업 관리자 → 성능 → CPU에서 가상화 상태를 확인합니다.

**Docker Desktop 설치 페이지의 현재 시스템 요구사항과 내 PC를 비교**하세요. 이 교재는 지원되는 Windows 11 PC를 권장합니다. WSL 설치가 가능하다는 사실과 Docker Desktop 지원 여부는 별개입니다. 가상화가 꺼져 있거나 기관 PC에서 설치 권한이 제한되면 해당 설정부터 해결해야 합니다.

Docker Desktop은 개인 학습 용도와 조직 사용의 이용 조건이 다를 수 있으므로 설치 화면의 약관을 확인합니다.

공식 확인: [Docker Desktop Windows 설치·요구사항](https://docs.docker.com/desktop/setup/install/windows-install/), [WSL 설치](https://learn.microsoft.com/en-us/windows/wsl/install).

### 명령을 입력할 창 구분

| 이 교재의 표시 | 실제 실행 위치 | 프롬프트의 흔한 모습 |
| --- | --- | --- |
| PowerShell — 관리자 | Windows에서 PowerShell을 관리자 권한으로 실행 | `PS C:\…>` |
| PowerShell — 일반 | Windows PowerShell 또는 Windows Terminal의 PowerShell 탭 | `PS C:\…>` |
| Ubuntu | 시작 메뉴의 Ubuntu 또는 Windows Terminal의 Ubuntu 탭 | `사용자@PC:~$` |
| 컨테이너 내부 | `docker run -it … bash` 또는 `docker exec -it … bash`로 들어간 상태 | `root@컨테이너:/#` |

코드블록의 명령만 입력합니다. `$`, `PS C:\…>`, `root@…#` 같은 프롬프트는 입력하지 않습니다. **0~14단계를 한꺼번에 붙여넣지 말고 단계별로 확인하세요.**

코드블록 위의 `bash`는 Ubuntu에서 명령을 해석·실행하는 쉘의 이름입니다. “Ubuntu 터미널용 명령”이라는 표지이며 `bash`라는 제목 자체를 입력하라는 뜻은 아닙니다. PowerShell에서 `wsl`로 Ubuntu에 들어갔다면 본문의 `mkdir`, `cd` 같은 명령부터 입력하세요. `dockerfile`·`markdown` 표시는 터미널 명령이 아니라 파일에 작성할 내용입니다. 컨테이너 내부라고 표시한 구간은 해당 컨테이너 쉘에서 실행합니다.

### 명령어 한 줄 읽는 법

명령은 보통 **명령어 + 옵션 + 대상**으로 구성됩니다. 예를 들어 `mkdir -p ~/codyssey/e1-1-workstation`은 “중간 폴더도 함께 만들면서 내 홈 아래에 과제 폴더를 만들어라”라는 뜻입니다.

| 구성 요소 | 뜻 | 이번 예시 |
| --- | --- | --- |
| 명령어 | 컴퓨터에게 시킬 동작 | mkdir = 디렉터리 만들기 |
| 옵션 | 동작 방식에 붙이는 추가 조건 | -p = 부모 폴더까지 함께 생성 |
| 대상·인수 | 무엇에 적용할지 지정하는 값 | ~/codyssey/e1-1-workstation = 만들 폴더 경로 |
| 공백 | 명령어·옵션·대상을 구분 | 경로 중간에 임의로 공백을 넣지 않음 |
| 따옴표 | 여러 단어나 공백 있는 경로를 한 묶음으로 전달 | 작성자 이름이나 긴 명령 문자열 |

`~`는 Ubuntu 사용자 홈, `/`는 Linux 경로 구분자, `.`은 현재 폴더, `..`는 부모 폴더입니다. 파일명 앞의 점은 보통 숨김 파일 관례입니다. `--version`처럼 하이픈 두 개는 긴 옵션, `-p`처럼 하나는 짧은 옵션인 경우가 많지만 **같은 -p라도 명령마다 뜻이 다릅니다.** mkdir의 -p는 부모 폴더 생성, docker run의 -p는 포트 연결입니다.

각 명령은 입력 후 Enter로 실행합니다. **다음 입력 줄인 `사용자@컴퓨터:경로$`가 다시 나오면 처리가 끝나고 다음 명령을 기다리는 상태**입니다. 출력이 없다는 이유로 같은 명령을 반복할 필요는 없습니다. `pwd`·`ls -la`처럼 조회 명령으로 결과를 확인하세요. 파일 입력 중 나타나는 단독 `>` 줄이나 sudo 비밀번호 대기는 다른 상태입니다.

각 코드블록 바로 아래의 해설 표는 읽는 자료이며 터미널에 붙여넣지 않습니다. 명령만 복사하고, 실행 환경과 출력 결과를 확인한 뒤 다음으로 이동합니다.

## 1. WSL 2와 Ubuntu 설치

### 1-1. 먼저 기존 설치 확인

**PowerShell — 일반**

```powershell
wsl --status
wsl --version
wsl --list --verbose
```

<!-- command-notes:start -->
**바로 위 코드 해설 — 읽고 실행하기**

| 명령·코드 | 하는 일 | 옵션·기호·확인할 결과 |
| --- | --- | --- |
| wsl --status | WSL의 기본 배포판·기본 버전과 실행 준비 상태를 조회합니다. | 조회만 합니다. 설치 오류·가상화 안내가 있으면 다음 설치로 진행하기 전에 확인합니다. |
| wsl --version | WSL 프로그램·커널 등의 버전을 보여줍니다. | --version은 버전 조회 옵션입니다. Ubuntu 버전과는 별개입니다. |
| wsl --list --verbose | 설치된 Linux 배포판과 실행 상태, WSL 1/2 버전을 보여줍니다. | --list는 목록, --verbose는 상세 표시입니다. VERSION 2와 Ubuntu 이름을 확인합니다. |
<!-- command-notes:end -->




이미 Ubuntu가 있고 VERSION 열이 `2`라면 새 배포판을 설치하지 않고 사용해도 됩니다. 이후 `Ubuntu-24.04`라고 적힌 부분은 실제 배포판 이름으로 바꿉니다. WSL이 없다는 안내가 나오면 다음 설치로 진행합니다.

### 1-2. 새로 설치할 때

Ubuntu 홈페이지에서 Desktop / Server / WSL 중 고르는 화면이라면 **맨 아래 WSL → Get Ubuntu on WSL**을 선택합니다. 이 교재는 Windows 안의 Ubuntu 터미널을 사용하므로 Desktop·Server용 ISO 파일은 받지 않습니다. 홈페이지 버튼을 거치지 않고 아래 PowerShell 명령으로 설치해도 됩니다. 두 방법으로 같은 배포판을 중복 설치할 필요는 없습니다.

시작 메뉴에서 PowerShell을 검색 → 오른쪽 클릭 → 관리자 권한으로 실행합니다.

**PowerShell — 관리자**

```powershell
wsl --list --online
wsl --install -d Ubuntu-24.04
```

<!-- command-notes:start -->
**바로 위 코드 해설 — 읽고 실행하기**

| 명령·코드 | 하는 일 | 옵션·기호·확인할 결과 |
| --- | --- | --- |
| wsl --list --online | 온라인에서 설치 가능한 배포판 이름을 조회합니다. | --online은 설치된 목록이 아닌 다운로드 가능한 목록을 뜻합니다. |
| wsl --install -d Ubuntu-24.04 | WSL과 지정한 Ubuntu 배포판을 설치합니다. | --install은 설치, -d는 배포판 지정입니다. 이미 사용 중인 Ubuntu가 있으면 중복 설치하지 않습니다. |
<!-- command-notes:end -->




첫 명령의 목록에 `Ubuntu-24.04`가 있는지 확인하고 두 번째 명령을 실행합니다. 목록이 다르면 표시된 Ubuntu LTS 이름으로 바꿉니다. 설치가 재시작을 요구하면 작업을 저장하고 Windows를 재시작하세요.

이미 `Ubuntu-26.04` 등 다른 Ubuntu를 설치했다면 그 배포판을 그대로 사용해도 됩니다. 이 교재의 설치 예시 때문에 다시 설치하지 마세요. 이후 Docker 실습에 나오는 `ubuntu:24.04`는 별도의 컨테이너 이미지이므로 WSL 배포판 버전과 달라도 됩니다.

Ubuntu를 처음 실행하면 Linux 사용자 이름과 비밀번호를 만듭니다. Windows·코디세이 계정과 별개입니다. 비밀번호 입력 중 화면에 아무것도 안 보이는 것은 정상입니다.

### 1-3. 업데이트와 WSL 2 확인

**PowerShell — 일반. 권한 요청이 나타나면 안내에 따릅니다.**

```powershell
wsl --update
wsl --list --verbose
```

<!-- command-notes:start -->
**바로 위 코드 해설 — 읽고 실행하기**

| 명령·코드 | 하는 일 | 옵션·기호·확인할 결과 |
| --- | --- | --- |
| wsl --update | WSL을 업데이트합니다. | 설정이나 배포판 삭제 명령이 아닙니다. 네트워크와 권한 안내를 확인합니다. |
| wsl --list --verbose | 설치된 Linux 배포판과 실행 상태, WSL 1/2 버전을 보여줍니다. | --list는 목록, --verbose는 상세 표시입니다. VERSION 2와 Ubuntu 이름을 확인합니다. |
<!-- command-notes:end -->




해당 Ubuntu의 VERSION이 `1`일 때만 다음 변환을 수행합니다.

```powershell
wsl --set-version Ubuntu-24.04 2
```

<!-- command-notes:start -->
**바로 위 코드 해설 — 읽고 실행하기**

| 명령·코드 | 하는 일 | 옵션·기호·확인할 결과 |
| --- | --- | --- |
| wsl --set-version Ubuntu-24.04 2 | 지정한 배포판의 WSL 실행 버전을 바꿉니다. | 배포판 이름 뒤의 2는 WSL 2로 변환한다는 뜻입니다. Ubuntu 자체 버전 변경은 아닙니다. |
<!-- command-notes:end -->




**Ubuntu**

```bash
cat /etc/os-release
uname -r
sudo apt update
sudo apt install -y git curl util-linux
```

<!-- command-notes:start -->
**바로 위 코드 해설 — 읽고 실행하기**

| 명령·코드 | 하는 일 | 옵션·기호·확인할 결과 |
| --- | --- | --- |
| cat /etc/os-release | 뒤에 적은 파일의 내용을 터미널에 보여줍니다. | /etc/os-release는 Ubuntu 배포판 정보입니다. 다른 경로는 해당 실습 파일입니다. 읽기만 하며 내용을 바꾸지 않습니다. |
| uname -r | 현재 Linux 커널 버전을 출력합니다. | -r은 커널 릴리스 정보만 표시합니다. Ubuntu 배포판 버전과 구분합니다. |
| sudo apt update | Ubuntu 관리자 권한으로 설치 가능한 패키지 목록을 새로 받아옵니다. | sudo는 관리자 권한 실행, apt는 패키지 관리 도구입니다. update는 목록 갱신이며 설치된 모든 프로그램을 업그레이드하는 명령은 아닙니다. |
| sudo apt install -y git curl util-linux | Ubuntu에 Git, HTTP 요청 도구 curl, 터미널 기록 도구 script가 들어 있는 util-linux를 설치합니다. | install은 설치, -y는 일반 확인 질문에 자동 동의입니다. sudo 비밀번호는 입력해도 화면에 표시되지 않습니다. |
<!-- command-notes:end -->




`sudo`는 Linux 관리자 권한으로 명령을 실행합니다. 방금 만든 Ubuntu 비밀번호를 입력합니다. `apt`는 Ubuntu 프로그램 설치 도구입니다. 여기서는 Docker Engine을 설치하지 않습니다.

**성공 기준:** Ubuntu 터미널이 열리고 `wsl --list --verbose`에서 VERSION `2`를 확인했습니다.

**기록:** Windows 버전, WSL 버전, 배포판 이름·버전. 설치 중 겪은 문제가 있으면 즉시 메모합니다.

참고: [Microsoft WSL 설치](https://learn.microsoft.com/en-us/windows/wsl/install), [Ubuntu WSL 설치](https://documentation.ubuntu.com/wsl/latest/howto/install-ubuntu-wsl2/).

## 2. VSCode와 과제 폴더·기록 준비

### 2-1. 편집기 설치

[VSCode 공식 다운로드](https://code.visualstudio.com/Download)에서 **Windows용**을 설치합니다. x64/Arm64는 PC 시스템 종류에 맞춥니다. 설치 후 확장 메뉴에서 Microsoft의 **WSL** 확장을 설치합니다. Ubuntu 안에 Linux용 VSCode 데스크톱을 따로 설치하지 않습니다.

### 2-2. 새 과제 작업 공간 만들기

**Ubuntu**

```bash
mkdir -p ~/codyssey/e1-1-workstation
cd ~/codyssey/e1-1-workstation
pwd
ls -la
```

<!-- command-notes:start -->
**바로 위 코드 해설 — 읽고 실행하기**

| 명령·코드 | 하는 일 | 옵션·기호·확인할 결과 |
| --- | --- | --- |
| mkdir -p ~/codyssey/e1-1-workstation | 지정한 이름의 디렉터리(폴더)를 만듭니다. | -p는 중간 부모 폴더도 만들고 이미 있는 폴더는 그대로 둡니다. 여러 경로는 공백으로 구분합니다. 성공하면 보통 출력 없이 입력 줄이 돌아옵니다. ls로 확인하세요. |
| cd ~/codyssey/e1-1-workstation | 현재 작업 위치를 뒤에 적은 디렉터리로 바꿉니다. change directory입니다. | ~는 내 Ubuntu 홈 폴더이고, /는 경로 구분자입니다. 성공해도 보통 출력은 없습니다. pwd로 확인합니다. |
| pwd | 현재 작업 디렉터리의 전체 경로를 출력합니다. print working directory의 약자입니다. | 이번 실습의 과제 경로인지 확인합니다. 읽기 전용 조회입니다. |
| ls -la | 파일과 디렉터리 목록을 보여줍니다. 대상 경로가 없으면 현재 폴더를 봅니다. | -l은 권한·소유자·크기 등을 길게 표시합니다. -a는 점(.)으로 시작하는 숨김 항목까지 표시합니다. 목록 앞의 d는 디렉터리, -는 일반 파일입니다. |
<!-- command-notes:end -->




이 폴더가 이미 있고 파일이 있다면 덮어쓰지 말고 내용을 확인하거나 새 과제 폴더 이름을 정하세요. 여기부터는 **새 빈 과제 폴더**에서 진행한다고 가정합니다.

```bash
mkdir -p docs/logs docs/images site practice
touch README.md
printf 'env/\n.env\n.env.*\n*.key\n*.pem\n' > .gitignore
printf 'docs/\npractice/\n.git/\nenv/\n.env\n.env.*\n' > .dockerignore
code .
```

<!-- command-notes:start -->
**바로 위 코드 해설 — 읽고 실행하기**

| 명령·코드 | 하는 일 | 옵션·기호·확인할 결과 |
| --- | --- | --- |
| mkdir -p docs/logs docs/images site practice | 지정한 이름의 디렉터리(폴더)를 만듭니다. | -p는 중간 부모 폴더도 만들고 이미 있는 폴더는 그대로 둡니다. 여러 경로는 공백으로 구분합니다. 성공하면 보통 출력 없이 입력 줄이 돌아옵니다. ls로 확인하세요. |
| touch README.md | 없으면 빈 파일을 만들고, 이미 있으면 수정 시각을 갱신합니다. | 파일 내용을 지우지는 않습니다. 성공 시 보통 출력이 없습니다. ls로 확인합니다. |
| printf 'env/\n.env\n.env.*\n*.key\n*.pem\n' > .gitignore | 따옴표 안의 형식에 따라 글자를 출력합니다. 여기서는 파일을 작성합니다. | \n은 줄바꿈입니다. > 뒤의 파일에 출력하며, 같은 파일이 있으면 기존 내용을 덮어씁니다. .gitignore는 Git 제외 규칙, .dockerignore는 빌드에 보낼 파일 제외 규칙입니다. |
| printf 'docs/\npractice/\n.git/\nenv/\n.env\n.env.*\n' > .dockerignore | 따옴표 안의 형식에 따라 글자를 출력합니다. 여기서는 파일을 작성합니다. | \n은 줄바꿈입니다. > 뒤의 파일에 출력하며, 같은 파일이 있으면 기존 내용을 덮어씁니다. .gitignore는 Git 제외 규칙, .dockerignore는 빌드에 보낼 파일 제외 규칙입니다. |
| code . | VSCode로 뒤에 지정한 경로를 엽니다. | .은 현재 디렉터리입니다. code .은 지금의 과제 폴더를 편집기로 엽니다. 첫 WSL 연결은 서버 준비 시간이 걸릴 수 있습니다. |
<!-- command-notes:end -->




VSCode 왼쪽 아래에 `WSL: Ubuntu…`가 보이는지 확인합니다. VSCode의 터미널 → 새 터미널도 Ubuntu인지 확인하세요. `code`를 못 찾으면 VSCode를 재실행하고 WSL 확장 설치를 확인한 뒤, 명령 팔레트의 `WSL: Connect to WSL`로 연결하고 Linux 과제 폴더를 엽니다.

작업 파일은 `/mnt/c/…`보다 **Ubuntu 홈 폴더 `~/codyssey/…`**에 두는 것을 권장합니다. Windows 파일 권한과 Linux 권한이 섞이는 혼란을 줄일 수 있습니다. Windows 탐색기로 보고 싶으면 과제 폴더에서 `explorer.exe .`를 실행합니다.

### 2-3. README 틀 준비

`README.md`에 아래 항목을 작성합니다. `미작성`은 나중에 실제 결과로 채웁니다.

```markdown
# E1-1 개발자용 작업실 꾸미기

## 1. 프로젝트 개요
미작성

## 2. 실행 환경
Windows / WSL / Ubuntu / 쉘 / 터미널 / Docker / Git 버전

## 3. 수행 체크리스트
- [ ] 터미널 기본 조작
- [ ] 파일·디렉터리 권한 변경
- [ ] Docker 설치·점검
- [ ] hello-world와 Ubuntu 컨테이너
- [ ] 이미지·컨테이너 운영 명령
- [ ] Dockerfile 작성·이미지 빌드
- [ ] 포트 매핑·브라우저 접속
- [ ] 바인드 마운트 변경 반영
- [ ] 볼륨 영속성
- [ ] Git 설정·커밋
- [ ] VSCode GitHub 로그인·저장소 연동
- [ ] 트러블슈팅 2건 이상

## 4. 단계별 수행·검증 결과
명령, 출력, 해석, 증거 링크

## 5. 재현 방법
저장소를 받은 사람이 웹 서버를 실행하는 절차

## 6. 트러블슈팅
문제 → 원인 가설 → 확인 → 해결/대안

## 7. 배운 개념
경로 / 권한 / 이미지·컨테이너 / 포트 / 마운트·볼륨 / Git·GitHub
```

<!-- command-notes:start -->
**바로 위 코드 해설 — 읽고 실행하기**

| 명령·코드 | 하는 일 | 옵션·기호·확인할 결과 |
| --- | --- | --- |
| 문서 작성 예시 전체 | 터미널에서 실행하는 명령이 아니라 README에 적을 문서 형식입니다. | #은 제목, -는 목록, [ ]와 [x]는 체크박스입니다. 링크는 대괄호 설명 뒤에 괄호 경로를 붙이며, 이미지는 그 앞에 !를 붙입니다. 실제 결과로 내용을 채우세요. |
<!-- command-notes:end -->




### 2-4. 명령과 출력을 함께 남기는 방법

수동으로 복사해 코드블록에 붙여도 됩니다. 추천은 단계별 `script` 기록입니다.

**Ubuntu — 예시**

```bash
cd ~/codyssey/e1-1-workstation
script -q -a docs/logs/03-terminal.txt
```

<!-- command-notes:start -->
**바로 위 코드 해설 — 읽고 실행하기**

| 명령·코드 | 하는 일 | 옵션·기호·확인할 결과 |
| --- | --- | --- |
| cd ~/codyssey/e1-1-workstation | 현재 작업 위치를 뒤에 적은 디렉터리로 바꿉니다. change directory입니다. | ~는 내 Ubuntu 홈 폴더이고, /는 경로 구분자입니다. 성공해도 보통 출력은 없습니다. pwd로 확인합니다. |
| script -q -a docs/logs/03-terminal.txt | 새 기록용 쉘을 열어 입력한 명령과 출력을 파일에 기록합니다. | -q는 시작·종료 안내를 줄이고, -a는 기존 로그 뒤에 덧붙입니다. 뒤는 로그 파일 경로입니다. 현재 쉘에서 exit를 입력하면 기록을 마칩니다. |
<!-- command-notes:end -->




이제 새 기록용 쉘이 열립니다. 명령을 실행하면 입력과 출력이 기록됩니다. **그 단계가 끝나고 Ubuntu 쉘에 돌아왔을 때** `exit`를 한 번 입력하면 기록이 끝납니다. 컨테이너 안에서의 `exit`는 컨테이너 쉘을 나가는 뜻이므로 구분하세요.

`script`는 비밀번호 등 민감한 작업을 할 때 사용하지 않습니다. 토큰·기기 인증 코드·설정 내 인증값이 포함된 로그는 원본 그대로 커밋하지 않습니다. 원문이 읽기 어려우면 필요한 구간을 README에 정리하고, 민감정보가 없는지 확인한 기록만 저장합니다.

스크린샷은 `Win + Shift + S`로 캡처합니다. Windows 그림판 등에서 저장할 때 WSL 과제 폴더의 `docs/images/`를 선택하세요. 브라우저 접속 증거에는 **주소창의 포트와 웹페이지 내용**이 함께 보여야 합니다.

**성공 기준:** WSL 연결 상태의 VSCode에서 과제 폴더와 README를 열 수 있습니다.

참고: [VSCode WSL 개발](https://code.visualstudio.com/docs/remote/wsl), [WSL 개발 환경](https://learn.microsoft.com/en-us/windows/wsl/setup/environment).

## 3. 터미널 기본 조작

**배울 것:** 디렉터리는 폴더입니다. 절대 경로는 `/`에서 시작하는 전체 위치, 상대 경로는 현재 폴더를 기준으로 한 위치입니다. `~`는 내 Ubuntu 홈, `.`은 현재 폴더, `..`는 상위 폴더입니다.

**Ubuntu** — 2단계에서 기록을 시작했다면 다시 시작하지 않습니다.

```bash
cd ~/codyssey/e1-1-workstation
script -q -a docs/logs/03-terminal.txt
```

<!-- command-notes:start -->
**바로 위 코드 해설 — 읽고 실행하기**

| 명령·코드 | 하는 일 | 옵션·기호·확인할 결과 |
| --- | --- | --- |
| cd ~/codyssey/e1-1-workstation | 현재 작업 위치를 뒤에 적은 디렉터리로 바꿉니다. change directory입니다. | ~는 내 Ubuntu 홈 폴더이고, /는 경로 구분자입니다. 성공해도 보통 출력은 없습니다. pwd로 확인합니다. |
| script -q -a docs/logs/03-terminal.txt | 새 기록용 쉘을 열어 입력한 명령과 출력을 파일에 기록합니다. | -q는 시작·종료 안내를 줄이고, -a는 기존 로그 뒤에 덧붙입니다. 뒤는 로그 파일 경로입니다. 현재 쉘에서 exit를 입력하면 기록을 마칩니다. |
<!-- command-notes:end -->




명령은 한 줄씩 실행하고 출력을 읽습니다.

```bash
pwd
ls
ls -la
mkdir -p practice/terminal
cd practice/terminal
pwd
touch empty.txt
printf 'Hello terminal\n' > memo.txt
cat memo.txt
cp memo.txt copy.txt
mv copy.txt renamed.txt
mkdir archive
mv renamed.txt archive/
ls -la
ls -la archive
cat archive/renamed.txt
rm archive/renamed.txt
rmdir archive
ls -la
cd ..
pwd
cd ~/codyssey/e1-1-workstation
pwd
exit
```

<!-- command-notes:start -->
**바로 위 코드 해설 — 읽고 실행하기**

| 명령·코드 | 하는 일 | 옵션·기호·확인할 결과 |
| --- | --- | --- |
| pwd | 현재 작업 디렉터리의 전체 경로를 출력합니다. print working directory의 약자입니다. | 이번 실습의 과제 경로인지 확인합니다. 읽기 전용 조회입니다. |
| ls | 파일과 디렉터리 목록을 보여줍니다. 대상 경로가 없으면 현재 폴더를 봅니다. | 목록 앞의 d는 디렉터리, -는 일반 파일입니다. |
| ls -la | 파일과 디렉터리 목록을 보여줍니다. 대상 경로가 없으면 현재 폴더를 봅니다. | -l은 권한·소유자·크기 등을 길게 표시합니다. -a는 점(.)으로 시작하는 숨김 항목까지 표시합니다. 목록 앞의 d는 디렉터리, -는 일반 파일입니다. |
| mkdir -p practice/terminal | 지정한 이름의 디렉터리(폴더)를 만듭니다. | -p는 중간 부모 폴더도 만들고 이미 있는 폴더는 그대로 둡니다. 여러 경로는 공백으로 구분합니다. 성공하면 보통 출력 없이 입력 줄이 돌아옵니다. ls로 확인하세요. |
| cd practice/terminal | 현재 작업 위치를 뒤에 적은 디렉터리로 바꿉니다. change directory입니다. | ~는 내 Ubuntu 홈 폴더이고, /는 경로 구분자입니다. 성공해도 보통 출력은 없습니다. pwd로 확인합니다. |
| pwd | 현재 작업 디렉터리의 전체 경로를 출력합니다. print working directory의 약자입니다. | 이번 실습의 과제 경로인지 확인합니다. 읽기 전용 조회입니다. |
| touch empty.txt | 없으면 빈 파일을 만들고, 이미 있으면 수정 시각을 갱신합니다. | 파일 내용을 지우지는 않습니다. 성공 시 보통 출력이 없습니다. ls로 확인합니다. |
| printf 'Hello terminal\n' > memo.txt | 따옴표 안의 형식에 따라 글자를 출력합니다. 여기서는 파일을 작성합니다. | \n은 줄바꿈입니다. > 뒤의 파일에 출력하며, 같은 파일이 있으면 기존 내용을 덮어씁니다. .gitignore는 Git 제외 규칙, .dockerignore는 빌드에 보낼 파일 제외 규칙입니다. |
| cat memo.txt | 뒤에 적은 파일의 내용을 터미널에 보여줍니다. | /etc/os-release는 Ubuntu 배포판 정보입니다. 다른 경로는 해당 실습 파일입니다. 읽기만 하며 내용을 바꾸지 않습니다. |
| cp memo.txt copy.txt | 첫 경로의 파일을 두 번째 경로로 복사합니다. 원본은 남습니다. | 이 예시에서는 memo.txt를 copy.txt로 복사합니다. 대상 파일이 있으면 덮어쓸 수 있으므로 연습 폴더에서 실행합니다. |
| mv copy.txt renamed.txt | 파일을 옮기거나 이름을 바꿉니다. 첫 항목이 출발지, 두 번째가 목적지입니다. | 같은 폴더의 다른 파일명을 주면 이름 변경, archive/처럼 디렉터리를 주면 그 안으로 이동합니다. 성공 시 보통 출력이 없습니다. |
| mkdir archive | 지정한 이름의 디렉터리(폴더)를 만듭니다. | 성공하면 보통 출력 없이 입력 줄이 돌아옵니다. ls로 확인하세요. |
| mv renamed.txt archive/ | 파일을 옮기거나 이름을 바꿉니다. 첫 항목이 출발지, 두 번째가 목적지입니다. | 같은 폴더의 다른 파일명을 주면 이름 변경, archive/처럼 디렉터리를 주면 그 안으로 이동합니다. 성공 시 보통 출력이 없습니다. |
| ls -la | 파일과 디렉터리 목록을 보여줍니다. 대상 경로가 없으면 현재 폴더를 봅니다. | -l은 권한·소유자·크기 등을 길게 표시합니다. -a는 점(.)으로 시작하는 숨김 항목까지 표시합니다. 목록 앞의 d는 디렉터리, -는 일반 파일입니다. |
| ls -la archive | 파일과 디렉터리 목록을 보여줍니다. 대상 경로가 없으면 현재 폴더를 봅니다. | -l은 권한·소유자·크기 등을 길게 표시합니다. -a는 점(.)으로 시작하는 숨김 항목까지 표시합니다. 목록 앞의 d는 디렉터리, -는 일반 파일입니다. |
| cat archive/renamed.txt | 뒤에 적은 파일의 내용을 터미널에 보여줍니다. | /etc/os-release는 Ubuntu 배포판 정보입니다. 다른 경로는 해당 실습 파일입니다. 읽기만 하며 내용을 바꾸지 않습니다. |
| rm archive/renamed.txt | 뒤에 적은 파일을 삭제합니다. | 휴지통 이동이 아닌 삭제입니다. 이 교재에서는 방금 만든 연습 파일만 대상으로 합니다. 성공 시 보통 출력이 없습니다. |
| rmdir archive | 비어 있는 디렉터리를 삭제합니다. | 안에 파일이 남아 있으면 실패합니다. 성공 시 보통 출력이 없습니다. |
| ls -la | 파일과 디렉터리 목록을 보여줍니다. 대상 경로가 없으면 현재 폴더를 봅니다. | -l은 권한·소유자·크기 등을 길게 표시합니다. -a는 점(.)으로 시작하는 숨김 항목까지 표시합니다. 목록 앞의 d는 디렉터리, -는 일반 파일입니다. |
| cd .. | 현재 작업 위치를 뒤에 적은 디렉터리로 바꿉니다. change directory입니다. | ..는 현재 폴더의 부모 폴더입니다. 성공해도 보통 출력은 없습니다. pwd로 확인합니다. |
| pwd | 현재 작업 디렉터리의 전체 경로를 출력합니다. print working directory의 약자입니다. | 이번 실습의 과제 경로인지 확인합니다. 읽기 전용 조회입니다. |
| cd ~/codyssey/e1-1-workstation | 현재 작업 위치를 뒤에 적은 디렉터리로 바꿉니다. change directory입니다. | ~는 내 Ubuntu 홈 폴더이고, /는 경로 구분자입니다. 성공해도 보통 출력은 없습니다. pwd로 확인합니다. |
| pwd | 현재 작업 디렉터리의 전체 경로를 출력합니다. print working directory의 약자입니다. | 이번 실습의 과제 경로인지 확인합니다. 읽기 전용 조회입니다. |
| exit | 현재 쉘을 끝냅니다. | 컨테이너 쉘이면 컨테이너 밖으로, script 쉘이면 기록 종료, WSL 기본 쉘이면 PowerShell 등 이전 환경으로 돌아갑니다. 실행 전 현재 위치를 구분하세요. |
<!-- command-notes:end -->




`>`는 파일 내용을 덮어씁니다. `cp`는 복사, `mv`는 이동 또는 이름 변경, `rm`은 파일 삭제, `rmdir`은 빈 디렉터리 삭제입니다. 여기서 삭제하는 것은 방금 만든 연습 파일뿐입니다.

**성공 기준:** `memo.txt`에는 `Hello terminal`이 있고, `empty.txt`는 빈 파일이며 `archive`는 삭제됐습니다.

**기록:** `docs/logs/03-terminal.txt` 링크를 README에 추가하고, 같은 파일을 절대 경로와 상대 경로로 나타내는 본인 예시를 적습니다. 절대 경로에는 `pwd`로 확인한 실제 홈 경로를 사용하세요.

## 4. 파일과 디렉터리 권한

**배울 것:** 권한은 소유자·그룹·그 외 사용자 세 묶음입니다. 각 묶음은 읽기 `r=4`, 쓰기 `w=2`, 실행 `x=1`을 더합니다. `644`는 `rw-r--r--`, `755`는 `rwxr-xr-x`입니다. 디렉터리의 `x`는 그 안으로 들어가고 경로를 통과하는 권한입니다.

**Ubuntu**

```bash
cd ~/codyssey/e1-1-workstation
script -q -a docs/logs/04-permissions.txt
mkdir -p practice/permissions/sample-dir
printf 'permission test\n' > practice/permissions/sample.txt
ls -ld practice/permissions/sample.txt practice/permissions/sample-dir
chmod 600 practice/permissions/sample.txt
chmod 700 practice/permissions/sample-dir
ls -ld practice/permissions/sample.txt practice/permissions/sample-dir
chmod 644 practice/permissions/sample.txt
chmod 755 practice/permissions/sample-dir
ls -ld practice/permissions/sample.txt practice/permissions/sample-dir
exit
```

<!-- command-notes:start -->
**바로 위 코드 해설 — 읽고 실행하기**

| 명령·코드 | 하는 일 | 옵션·기호·확인할 결과 |
| --- | --- | --- |
| cd ~/codyssey/e1-1-workstation | 현재 작업 위치를 뒤에 적은 디렉터리로 바꿉니다. change directory입니다. | ~는 내 Ubuntu 홈 폴더이고, /는 경로 구분자입니다. 성공해도 보통 출력은 없습니다. pwd로 확인합니다. |
| script -q -a docs/logs/04-permissions.txt | 새 기록용 쉘을 열어 입력한 명령과 출력을 파일에 기록합니다. | -q는 시작·종료 안내를 줄이고, -a는 기존 로그 뒤에 덧붙입니다. 뒤는 로그 파일 경로입니다. 현재 쉘에서 exit를 입력하면 기록을 마칩니다. |
| mkdir -p practice/permissions/sample-dir | 지정한 이름의 디렉터리(폴더)를 만듭니다. | -p는 중간 부모 폴더도 만들고 이미 있는 폴더는 그대로 둡니다. 여러 경로는 공백으로 구분합니다. 성공하면 보통 출력 없이 입력 줄이 돌아옵니다. ls로 확인하세요. |
| printf 'permission test\n' > practice/permissions/sample.txt | 따옴표 안의 형식에 따라 글자를 출력합니다. 여기서는 파일을 작성합니다. | \n은 줄바꿈입니다. > 뒤의 파일에 출력하며, 같은 파일이 있으면 기존 내용을 덮어씁니다. .gitignore는 Git 제외 규칙, .dockerignore는 빌드에 보낼 파일 제외 규칙입니다. |
| ls -ld practice/permissions/sample.txt practice/permissions/sample-dir | 파일과 디렉터리 목록을 보여줍니다. 대상 경로가 없으면 현재 폴더를 봅니다. | -l은 권한·소유자·크기 등을 길게 표시합니다. -d는 폴더 안이 아닌 폴더 자체의 정보를 봅니다. 목록 앞의 d는 디렉터리, -는 일반 파일입니다. |
| chmod 600 practice/permissions/sample.txt | 지정한 파일 또는 디렉터리의 접근 권한을 바꿉니다. | 600 = 소유자 읽기·쓰기, 그룹과 나머지 사용자 권한 없음입니다. 세 자리는 소유자/그룹/그 외 순서이고 r=4, w=2, x=1을 합산합니다. 성공 시 무출력이며 ls -l로 확인합니다. |
| chmod 700 practice/permissions/sample-dir | 지정한 파일 또는 디렉터리의 접근 권한을 바꿉니다. | 700 = 소유자 읽기·쓰기·실행, 나머지 권한 없음입니다. 세 자리는 소유자/그룹/그 외 순서이고 r=4, w=2, x=1을 합산합니다. 성공 시 무출력이며 ls -l로 확인합니다. |
| ls -ld practice/permissions/sample.txt practice/permissions/sample-dir | 파일과 디렉터리 목록을 보여줍니다. 대상 경로가 없으면 현재 폴더를 봅니다. | -l은 권한·소유자·크기 등을 길게 표시합니다. -d는 폴더 안이 아닌 폴더 자체의 정보를 봅니다. 목록 앞의 d는 디렉터리, -는 일반 파일입니다. |
| chmod 644 practice/permissions/sample.txt | 지정한 파일 또는 디렉터리의 접근 권한을 바꿉니다. | 644 = 소유자 읽기·쓰기, 그룹과 나머지는 읽기입니다. 세 자리는 소유자/그룹/그 외 순서이고 r=4, w=2, x=1을 합산합니다. 성공 시 무출력이며 ls -l로 확인합니다. |
| chmod 755 practice/permissions/sample-dir | 지정한 파일 또는 디렉터리의 접근 권한을 바꿉니다. | 755 = 소유자는 읽기·쓰기·실행, 그룹과 나머지는 읽기·실행입니다. 세 자리는 소유자/그룹/그 외 순서이고 r=4, w=2, x=1을 합산합니다. 성공 시 무출력이며 ls -l로 확인합니다. |
| ls -ld practice/permissions/sample.txt practice/permissions/sample-dir | 파일과 디렉터리 목록을 보여줍니다. 대상 경로가 없으면 현재 폴더를 봅니다. | -l은 권한·소유자·크기 등을 길게 표시합니다. -d는 폴더 안이 아닌 폴더 자체의 정보를 봅니다. 목록 앞의 d는 디렉터리, -는 일반 파일입니다. |
| exit | 현재 쉘을 끝냅니다. | 컨테이너 쉘이면 컨테이너 밖으로, script 쉘이면 기록 종료, WSL 기본 쉘이면 PowerShell 등 이전 환경으로 돌아갑니다. 실행 전 현재 위치를 구분하세요. |
<!-- command-notes:end -->




**성공 기준:** 파일은 `600 → 644`, 디렉터리는 `700 → 755`로 바뀐 출력이 있습니다. `ls -l` 앞부분의 `-`는 파일, `d`는 디렉터리입니다.

**기록:** 두 대상의 변경 전후 출력, `644`와 `755`의 뜻. 권한 실습은 `/mnt/c`가 아닌 Ubuntu 홈에서 했다는 점도 적습니다.

## 5. Git 설정과 첫 커밋

**배울 것:** Git은 내 파일 변경 이력을 저장합니다. GitHub에 로그인하는 것과 Git 작성자 정보를 정하는 것은 별개입니다. 커밋은 로컬 기록이고, 푸시는 원격 업로드입니다.

먼저 Ubuntu에서 현재 설정을 확인합니다. 기존 설정이 있으면 무조건 덮어쓰지 않습니다.

```bash
git --version
git config --get user.name
git config --get user.email
git config --get init.defaultBranch
```

<!-- command-notes:start -->
**바로 위 코드 해설 — 읽고 실행하기**

| 명령·코드 | 하는 일 | 옵션·기호·확인할 결과 |
| --- | --- | --- |
| git --version | Git 프로그램 버전을 조회합니다. | 설치 확인용입니다. |
| git config --get user.name | Git 작성자 정보와 동작 설정을 확인하거나 바꿉니다. | --get은 특정 값 조회, --list는 전체 목록, --global은 이 Ubuntu 사용자 전체 설정입니다. user.name은 작성자 이름, user.email은 커밋 이메일, init.defaultBranch는 새 저장소 기본 브랜치입니다. 조회는 무출력일 수도 있고 설정 성공도 보통 무출력입니다. |
| git config --get user.email | Git 작성자 정보와 동작 설정을 확인하거나 바꿉니다. | --get은 특정 값 조회, --list는 전체 목록, --global은 이 Ubuntu 사용자 전체 설정입니다. user.name은 작성자 이름, user.email은 커밋 이메일, init.defaultBranch는 새 저장소 기본 브랜치입니다. 조회는 무출력일 수도 있고 설정 성공도 보통 무출력입니다. |
| git config --get init.defaultBranch | Git 작성자 정보와 동작 설정을 확인하거나 바꿉니다. | --get은 특정 값 조회, --list는 전체 목록, --global은 이 Ubuntu 사용자 전체 설정입니다. user.name은 작성자 이름, user.email은 커밋 이메일, init.defaultBranch는 새 저장소 기본 브랜치입니다. 조회는 무출력일 수도 있고 설정 성공도 보통 무출력입니다. |
<!-- command-notes:end -->




아무것도 안 나오는 항목은 아직 설정이 없을 수 있습니다. **아래 두 예시 문자열을 본인 정보로 바꾼 뒤** 실행합니다. 공개 이메일 노출을 줄이려면 GitHub Settings → Emails에서 표시되는 본인의 `noreply` 주소를 그대로 사용하세요.

```bash
git config --global user.name "본인이 사용할 작성자 이름"
git config --global user.email "GitHub에서 확인한 본인의 noreply 이메일"
git config --global init.defaultBranch main
```

<!-- command-notes:start -->
**바로 위 코드 해설 — 읽고 실행하기**

| 명령·코드 | 하는 일 | 옵션·기호·확인할 결과 |
| --- | --- | --- |
| git config --global user.name "본인이 사용할 작성자 이름" | Git 작성자 정보와 동작 설정을 확인하거나 바꿉니다. | --get은 특정 값 조회, --list는 전체 목록, --global은 이 Ubuntu 사용자 전체 설정입니다. user.name은 작성자 이름, user.email은 커밋 이메일, init.defaultBranch는 새 저장소 기본 브랜치입니다. 조회는 무출력일 수도 있고 설정 성공도 보통 무출력입니다. |
| git config --global user.email "GitHub에서 확인한 본인의 noreply 이메일" | Git 작성자 정보와 동작 설정을 확인하거나 바꿉니다. | --get은 특정 값 조회, --list는 전체 목록, --global은 이 Ubuntu 사용자 전체 설정입니다. user.name은 작성자 이름, user.email은 커밋 이메일, init.defaultBranch는 새 저장소 기본 브랜치입니다. 조회는 무출력일 수도 있고 설정 성공도 보통 무출력입니다. |
| git config --global init.defaultBranch main | Git 작성자 정보와 동작 설정을 확인하거나 바꿉니다. | --get은 특정 값 조회, --list는 전체 목록, --global은 이 Ubuntu 사용자 전체 설정입니다. user.name은 작성자 이름, user.email은 커밋 이메일, init.defaultBranch는 새 저장소 기본 브랜치입니다. 조회는 무출력일 수도 있고 설정 성공도 보통 무출력입니다. |
<!-- command-notes:end -->




전역 설정은 이 Ubuntu 사용자의 다른 Git 저장소에도 적용됩니다. 기존 작성자 정보를 유지하고 싶으면 과제 폴더에서 `git init -b main`을 먼저 실행하고, 이름·이메일은 `--global` 대신 `--local`로 설정할 수 있습니다. 기본 브랜치 전역 변경을 피한다면 `git init -b main`으로 이번 저장소 브랜치를 명시하고 그 선택을 문서화하세요.

**Ubuntu — 과제 폴더가 맞는지 확인한 뒤 진행**

```bash
cd ~/codyssey/e1-1-workstation
pwd
git init -b main
git status
git config --list
```

<!-- command-notes:start -->
**바로 위 코드 해설 — 읽고 실행하기**

| 명령·코드 | 하는 일 | 옵션·기호·확인할 결과 |
| --- | --- | --- |
| cd ~/codyssey/e1-1-workstation | 현재 작업 위치를 뒤에 적은 디렉터리로 바꿉니다. change directory입니다. | ~는 내 Ubuntu 홈 폴더이고, /는 경로 구분자입니다. 성공해도 보통 출력은 없습니다. pwd로 확인합니다. |
| pwd | 현재 작업 디렉터리의 전체 경로를 출력합니다. print working directory의 약자입니다. | 이번 실습의 과제 경로인지 확인합니다. 읽기 전용 조회입니다. |
| git init -b main | 현재 폴더에 로컬 Git 저장소를 만듭니다. | -b main은 첫 브랜치 이름을 main으로 지정합니다. .git 폴더가 생깁니다. GitHub 업로드는 아직 하지 않습니다. |
| git status | 작업 파일과 커밋 대기 상태를 조회합니다. | --short는 간단 표시입니다. ??는 미추적, A는 추가, M은 수정 등입니다. 작업이 없으면 짧은 목록은 비어 있을 수 있습니다. |
| git config --list | Git 작성자 정보와 동작 설정을 확인하거나 바꿉니다. | --get은 특정 값 조회, --list는 전체 목록, --global은 이 Ubuntu 사용자 전체 설정입니다. user.name은 작성자 이름, user.email은 커밋 이메일, init.defaultBranch는 새 저장소 기본 브랜치입니다. 조회는 무출력일 수도 있고 설정 성공도 보통 무출력입니다. |
<!-- command-notes:end -->




원문은 `git config --list` 결과를 요구합니다. 먼저 화면에서 민감한 값이 있는지 확인하고, README에는 민감정보를 제거한 결과를 넣습니다. 설정 목록에 토큰이나 인증 헤더가 보이면 원문 로그를 저장하지 않습니다.

```bash
git add README.md .gitignore .dockerignore docs practice
git diff --cached --stat
git commit -m "docs: record terminal and permissions practice"
git log --oneline -3
```

<!-- command-notes:start -->
**바로 위 코드 해설 — 읽고 실행하기**

| 명령·코드 | 하는 일 | 옵션·기호·확인할 결과 |
| --- | --- | --- |
| git add README.md .gitignore .dockerignore docs practice | 명시한 파일·폴더의 현재 변경을 다음 커밋 대상으로 올립니다. | 스테이징이라고 부릅니다. 파일을 인터넷에 업로드하지 않으며 성공 시 보통 무출력입니다. |
| git diff --cached --stat | 아직 기록하지 않은 변경 내용을 비교합니다. | 기본은 스테이징 안 된 변경, --cached는 스테이징된 변경, --stat은 파일별 변경량 요약입니다. 차이가 없으면 무출력입니다. |
| git commit -m "docs: record terminal and permissions practice" | 스테이징한 변경을 로컬 이력으로 저장합니다. | -m 뒤의 따옴표 내용은 커밋 설명입니다. 자동으로 GitHub에 올라가지는 않습니다. |
| git log --oneline -3 | 커밋 이력을 조회합니다. | --oneline은 커밋당 한 줄, -3과 -5는 최근 3개·5개까지만 표시합니다. |
<!-- command-notes:end -->




**성공 기준:** `main` 브랜치에 첫 커밋이 보입니다. 아직 GitHub 업로드는 하지 않아도 됩니다.

**기록:** Git 버전, 작성자·기본 브랜치 설정 결과, 민감정보를 제거한 설정 목록과 첫 커밋 결과.

참고: [GitHub 커밋 이메일 설정](https://docs.github.com/en/account-and-profile/how-tos/email-preferences/setting-your-commit-email-address), [VSCode Git 시작](https://code.visualstudio.com/docs/sourcecontrol/quickstart).

## 6. Docker Desktop 설치와 점검

**배울 것:** Docker CLI는 `docker` 명령을 받는 도구이고, 엔진은 실제 이미지·컨테이너를 관리합니다. 명령 도구가 있어도 엔진이 꺼져 있으면 실행할 수 없습니다.

1. [Docker Desktop Windows 공식 설치 페이지](https://docs.docker.com/desktop/setup/install/windows-install/)에서 PC 아키텍처에 맞는 설치 파일을 받습니다.
2. 설치 옵션에 표시되면 **WSL 2** 백엔드를 선택합니다. 설치 모드가 제공되면 개인 PC에서는 기본 사용자별 설치가 간편합니다. 화면과 권한 요구는 버전에 따라 다를 수 있습니다.
3. 설치 후 **Docker Desktop을 실행**하고 엔진 준비가 끝날 때까지 기다립니다.
4. Settings → General에서 WSL 2 엔진 설정을 확인합니다.
5. Settings → Resources → WSL Integration에서 사용할 Ubuntu 배포판을 켜고 Apply/Restart를 적용합니다.
6. Linux 컨테이너 모드를 사용합니다. WSL Integration이 안 보이면 Windows 컨테이너 모드인지 확인합니다.

이 추천 경로에서는 Ubuntu 안에 `docker.io`나 별도 Docker Engine을 추가 설치하지 않습니다. Docker 공식 문서도 중복 엔진·CLI 설치로 인한 충돌을 주의하도록 안내합니다.

**Ubuntu**

```bash
cd ~/codyssey/e1-1-workstation
script -q -a docs/logs/06-docker-check.txt
docker --version
docker version
docker info
exit
```

<!-- command-notes:start -->
**바로 위 코드 해설 — 읽고 실행하기**

| 명령·코드 | 하는 일 | 옵션·기호·확인할 결과 |
| --- | --- | --- |
| cd ~/codyssey/e1-1-workstation | 현재 작업 위치를 뒤에 적은 디렉터리로 바꿉니다. change directory입니다. | ~는 내 Ubuntu 홈 폴더이고, /는 경로 구분자입니다. 성공해도 보통 출력은 없습니다. pwd로 확인합니다. |
| script -q -a docs/logs/06-docker-check.txt | 새 기록용 쉘을 열어 입력한 명령과 출력을 파일에 기록합니다. | -q는 시작·종료 안내를 줄이고, -a는 기존 로그 뒤에 덧붙입니다. 뒤는 로그 파일 경로입니다. 현재 쉘에서 exit를 입력하면 기록을 마칩니다. |
| docker --version | Docker CLI 버전만 보여줍니다. |  뒤의 이름은 명령을 적용할 대상입니다. 조회 결과나 오류 메시지를 읽고 확인합니다. |
| docker version | Docker Client와 Server의 버전을 조회합니다. |  뒤의 이름은 명령을 적용할 대상입니다. 조회 결과나 오류 메시지를 읽고 확인합니다. |
| docker info | Docker 엔진과 실행 환경의 상세 상태를 조회합니다. |  뒤의 이름은 명령을 적용할 대상입니다. 조회 결과나 오류 메시지를 읽고 확인합니다. |
| exit | 현재 쉘을 끝냅니다. | 컨테이너 쉘이면 컨테이너 밖으로, script 쉘이면 기록 종료, WSL 기본 쉘이면 PowerShell 등 이전 환경으로 돌아갑니다. 실행 전 현재 위치를 구분하세요. |
<!-- command-notes:end -->




**성공 기준:** `docker version`에 Client와 Server가 나오고 `docker info`가 연결 오류 없이 끝납니다.

**막히면:** `docker: command not found`는 Ubuntu 연동과 새 터미널을 확인합니다. `Cannot connect to the Docker daemon`은 Desktop 실행·엔진 준비·WSL 연동을 확인합니다. 이때 임의로 다른 엔진을 설치하지 않습니다.

**기록:** Docker 버전, 엔진 동작 결과, 사용한 백엔드. 계정·장치 이름 등 공개하고 싶지 않은 정보는 가립니다.

참고: [Docker Desktop WSL 2 연동](https://docs.docker.com/desktop/features/wsl/).

## 7. 첫 컨테이너 실행과 내부 진입

**배울 것:** 이미지는 실행 재료, 컨테이너는 그 이미지로 만든 실행 환경입니다. 컨테이너는 주요 프로세스가 종료되면 멈춥니다.

### 7-1. hello-world

**Ubuntu**

```bash
cd ~/codyssey/e1-1-workstation
script -q -a docs/logs/07-containers.txt
docker run --name e11-hello hello-world
docker ps -a
```

<!-- command-notes:start -->
**바로 위 코드 해설 — 읽고 실행하기**

| 명령·코드 | 하는 일 | 옵션·기호·확인할 결과 |
| --- | --- | --- |
| cd ~/codyssey/e1-1-workstation | 현재 작업 위치를 뒤에 적은 디렉터리로 바꿉니다. change directory입니다. | ~는 내 Ubuntu 홈 폴더이고, /는 경로 구분자입니다. 성공해도 보통 출력은 없습니다. pwd로 확인합니다. |
| script -q -a docs/logs/07-containers.txt | 새 기록용 쉘을 열어 입력한 명령과 출력을 파일에 기록합니다. | -q는 시작·종료 안내를 줄이고, -a는 기존 로그 뒤에 덧붙입니다. 뒤는 로그 파일 경로입니다. 현재 쉘에서 exit를 입력하면 기록을 마칩니다. |
| docker run --name e11-hello hello-world | 이미지로 새 컨테이너를 만들어 실행합니다. 같은 이름의 기존 컨테이너를 다시 시작하는 명령은 아닙니다. | --name 뒤는 직접 정한 컨테이너 이름. 백그라운드 실행 성공 시 긴 컨테이너 ID가 나올 수 있음. |
| docker ps -a | 컨테이너 목록을 조회합니다. 기본은 실행 중인 것만 나옵니다. | -a는 종료된 것까지 전체 표시. |
<!-- command-notes:end -->




`Hello from Docker!` 문구를 확인합니다. 이 프로그램은 메시지를 출력한 뒤 종료하므로 `Exited`는 정상입니다. 같은 이름으로 다시 `run`하면 이름 충돌이 납니다. 재실행은 `docker start -a e11-hello`를 사용합니다.

### 7-2. Ubuntu 컨테이너의 주 쉘을 종료해 보기

**Ubuntu에서 실행**

```bash
docker run -it --name e11-shell ubuntu:24.04 bash
```

<!-- command-notes:start -->
**바로 위 코드 해설 — 읽고 실행하기**

| 명령·코드 | 하는 일 | 옵션·기호·확인할 결과 |
| --- | --- | --- |
| docker run -it --name e11-shell ubuntu:24.04 bash | 이미지로 새 컨테이너를 만들어 실행합니다. 같은 이름의 기존 컨테이너를 다시 시작하는 명령은 아닙니다. | -it는 입력 유지와 가상 터미널을 함께 켜 대화형 쉘 사용. --name 뒤는 직접 정한 컨테이너 이름. ubuntu:24.04는 컨테이너용 이미지 이름·태그로, WSL Ubuntu-26.04와 달라도 정상. 끝의 bash는 컨테이너에서 실행할 쉘. 백그라운드 실행 성공 시 긴 컨테이너 ID가 나올 수 있음. |
<!-- command-notes:end -->




**이제 컨테이너 내부입니다.** 다음만 입력합니다.

```bash
pwd
ls
echo "Hello from container"
exit
```

<!-- command-notes:start -->
**바로 위 코드 해설 — 읽고 실행하기**

| 명령·코드 | 하는 일 | 옵션·기호·확인할 결과 |
| --- | --- | --- |
| pwd | 현재 작업 디렉터리의 전체 경로를 출력합니다. print working directory의 약자입니다. | 이번 실습의 과제 경로인지 확인합니다. 읽기 전용 조회입니다. |
| ls | 파일과 디렉터리 목록을 보여줍니다. 대상 경로가 없으면 현재 폴더를 봅니다. | 목록 앞의 d는 디렉터리, -는 일반 파일입니다. |
| echo "Hello from container" | 뒤의 글자 또는 변수 값을 출력합니다. | 따옴표는 여러 단어를 하나의 글자 묶음으로 전달합니다. 화면에 문구가 나오면 명령 실행을 확인할 수 있습니다. |
| exit | 현재 쉘을 끝냅니다. | 컨테이너 쉘이면 컨테이너 밖으로, script 쉘이면 기록 종료, WSL 기본 쉘이면 PowerShell 등 이전 환경으로 돌아갑니다. 실행 전 현재 위치를 구분하세요. |
<!-- command-notes:end -->




**다시 Ubuntu로 돌아오면** 상태를 확인합니다.

```bash
docker ps -a
```

<!-- command-notes:start -->
**바로 위 코드 해설 — 읽고 실행하기**

| 명령·코드 | 하는 일 | 옵션·기호·확인할 결과 |
| --- | --- | --- |
| docker ps -a | 컨테이너 목록을 조회합니다. 기본은 실행 중인 것만 나옵니다. | -a는 종료된 것까지 전체 표시. |
<!-- command-notes:end -->




이 컨테이너는 주 프로세스가 `bash`였기 때문에 `exit` 후 멈춥니다.

### 7-3. exec로 새 쉘을 열면 어떻게 다를까?

**Ubuntu**

```bash
docker run -dit --name e11-lab ubuntu:24.04 bash
docker exec -it e11-lab bash
```

<!-- command-notes:start -->
**바로 위 코드 해설 — 읽고 실행하기**

| 명령·코드 | 하는 일 | 옵션·기호·확인할 결과 |
| --- | --- | --- |
| docker run -dit --name e11-lab ubuntu:24.04 bash | 이미지로 새 컨테이너를 만들어 실행합니다. 같은 이름의 기존 컨테이너를 다시 시작하는 명령은 아닙니다. | -dit는 -d(백그라운드), -i(입력 유지), -t(가상 터미널) 결합. --name 뒤는 직접 정한 컨테이너 이름. ubuntu:24.04는 컨테이너용 이미지 이름·태그로, WSL Ubuntu-26.04와 달라도 정상. 끝의 bash는 컨테이너에서 실행할 쉘. 백그라운드 실행 성공 시 긴 컨테이너 ID가 나올 수 있음. |
| docker exec -it e11-lab bash | 실행 중인 컨테이너 안에서 별도의 명령을 실행합니다. | -it는 입력 유지와 가상 터미널을 함께 켜 대화형 쉘 사용. 끝의 bash는 컨테이너에서 실행할 쉘. |
<!-- command-notes:end -->




**컨테이너 내부**

```bash
echo "This shell was opened by exec"
exit
```

<!-- command-notes:start -->
**바로 위 코드 해설 — 읽고 실행하기**

| 명령·코드 | 하는 일 | 옵션·기호·확인할 결과 |
| --- | --- | --- |
| echo "This shell was opened by exec" | 뒤의 글자 또는 변수 값을 출력합니다. | 따옴표는 여러 단어를 하나의 글자 묶음으로 전달합니다. 화면에 문구가 나오면 명령 실행을 확인할 수 있습니다. |
| exit | 현재 쉘을 끝냅니다. | 컨테이너 쉘이면 컨테이너 밖으로, script 쉘이면 기록 종료, WSL 기본 쉘이면 PowerShell 등 이전 환경으로 돌아갑니다. 실행 전 현재 위치를 구분하세요. |
<!-- command-notes:end -->




**Ubuntu**

```bash
docker ps --filter name=e11-lab
```

<!-- command-notes:start -->
**바로 위 코드 해설 — 읽고 실행하기**

| 명령·코드 | 하는 일 | 옵션·기호·확인할 결과 |
| --- | --- | --- |
| docker ps --filter name=e11-lab | 컨테이너 목록을 조회합니다. 기본은 실행 중인 것만 나옵니다. | --filter name=…는 컨테이너 이름 조건으로 목록을 좁힘. |
<!-- command-notes:end -->




주 `bash`가 살아 있으므로, `exec`로 연 추가 쉘을 나가도 컨테이너가 실행 중입니다.

### 7-4. attach로 주 쉘에 연결하기

```bash
docker attach e11-lab
```

<!-- command-notes:start -->
**바로 위 코드 해설 — 읽고 실행하기**

| 명령·코드 | 하는 일 | 옵션·기호·확인할 결과 |
| --- | --- | --- |
| docker attach e11-lab | 컨테이너 주 프로세스의 입출력에 연결합니다. | Ctrl+P 다음 Ctrl+Q는 컨테이너를 유지하며 분리. 여기서 exit는 주 bash 종료. |
<!-- command-notes:end -->




**컨테이너 내부**에서 `echo "attached"`를 입력합니다. 이번에는 `exit` 대신 **Ctrl을 누른 채 P, 손을 뗀 뒤 Ctrl을 누른 채 Q**를 순서대로 눌러 분리합니다. Ubuntu 프롬프트로 돌아왔는지 확인합니다. 바로 돌아오지 않으면 Enter를 한 번 눌러봅니다. 그래도 어렵다면 새 Ubuntu 탭을 열어 상태를 확인하세요.

**Ubuntu**

```bash
docker ps --filter name=e11-lab
docker stop e11-lab
docker ps -a --filter name=e11-lab
exit
```

<!-- command-notes:start -->
**바로 위 코드 해설 — 읽고 실행하기**

| 명령·코드 | 하는 일 | 옵션·기호·확인할 결과 |
| --- | --- | --- |
| docker ps --filter name=e11-lab | 컨테이너 목록을 조회합니다. 기본은 실행 중인 것만 나옵니다. | --filter name=…는 컨테이너 이름 조건으로 목록을 좁힘. |
| docker stop e11-lab | 이름으로 지정한 컨테이너를 중지합니다. 컨테이너·이미지·볼륨은 삭제하지 않습니다. |  뒤의 이름은 명령을 적용할 대상입니다. 조회 결과나 오류 메시지를 읽고 확인합니다. |
| docker ps -a --filter name=e11-lab | 컨테이너 목록을 조회합니다. 기본은 실행 중인 것만 나옵니다. | -a는 종료된 것까지 전체 표시. --filter name=…는 컨테이너 이름 조건으로 목록을 좁힘. |
| exit | 현재 쉘을 끝냅니다. | 컨테이너 쉘이면 컨테이너 밖으로, script 쉘이면 기록 종료, WSL 기본 쉘이면 PowerShell 등 이전 환경으로 돌아갑니다. 실행 전 현재 위치를 구분하세요. |
<!-- command-notes:end -->




마지막 `exit`는 기록 종료용입니다. 이 단계에서는 먼저 `e11-lab`을 중지했습니다.

**성공 기준:** 주 쉘의 `exit`는 컨테이너 종료, `exec` 쉘의 `exit`는 추가 쉘 종료, `attach` 후 분리는 컨테이너 유지라는 차이를 관찰했습니다.

**기록:** 실행·내부 명령·상태 결과와 본인 설명. `attach`에 키 입력이 전달되므로 무작정 Ctrl+C를 누르는 것과 분리는 다릅니다.

참고: [docker attach](https://docs.docker.com/reference/cli/docker/container/attach/), [docker exec](https://docs.docker.com/reference/cli/docker/container/exec/).

## 8. Docker 운영 명령 익히기

**Ubuntu**

```bash
cd ~/codyssey/e1-1-workstation
script -q -a docs/logs/08-operations.txt
docker pull nginx:alpine
docker images
docker start e11-lab
docker ps
docker ps -a
docker logs e11-hello
docker stats --no-stream e11-lab
docker stop e11-lab
docker ps -a --filter name=e11-lab
exit
```

<!-- command-notes:start -->
**바로 위 코드 해설 — 읽고 실행하기**

| 명령·코드 | 하는 일 | 옵션·기호·확인할 결과 |
| --- | --- | --- |
| cd ~/codyssey/e1-1-workstation | 현재 작업 위치를 뒤에 적은 디렉터리로 바꿉니다. change directory입니다. | ~는 내 Ubuntu 홈 폴더이고, /는 경로 구분자입니다. 성공해도 보통 출력은 없습니다. pwd로 확인합니다. |
| script -q -a docs/logs/08-operations.txt | 새 기록용 쉘을 열어 입력한 명령과 출력을 파일에 기록합니다. | -q는 시작·종료 안내를 줄이고, -a는 기존 로그 뒤에 덧붙입니다. 뒤는 로그 파일 경로입니다. 현재 쉘에서 exit를 입력하면 기록을 마칩니다. |
| docker pull nginx:alpine | 지정한 이미지를 레지스트리에서 다운로드합니다. | nginx:alpine은 웹 서버 이미지의 이름:태그. |
| docker images | 내 PC의 Docker 엔진에 저장된 이미지 목록을 조회합니다. |  뒤의 이름은 명령을 적용할 대상입니다. 조회 결과나 오류 메시지를 읽고 확인합니다. |
| docker start e11-lab | 기존에 만들어 둔 중지 컨테이너를 다시 시작합니다. |  뒤의 이름은 명령을 적용할 대상입니다. 조회 결과나 오류 메시지를 읽고 확인합니다. |
| docker ps | 컨테이너 목록을 조회합니다. 기본은 실행 중인 것만 나옵니다. |  뒤의 이름은 명령을 적용할 대상입니다. 조회 결과나 오류 메시지를 읽고 확인합니다. |
| docker ps -a | 컨테이너 목록을 조회합니다. 기본은 실행 중인 것만 나옵니다. | -a는 종료된 것까지 전체 표시. |
| docker logs e11-hello | 컨테이너 프로그램의 표준 출력·오류 로그를 보여줍니다. | 로그가 없으면 무출력일 수도 있음. no-such-container 예시는 의도적인 이름 오류. |
| docker stats --no-stream e11-lab | 컨테이너의 CPU·메모리 등 리소스 사용량을 조회합니다. | --no-stream은 실시간 갱신 없이 한 번 표시 후 종료. |
| docker stop e11-lab | 이름으로 지정한 컨테이너를 중지합니다. 컨테이너·이미지·볼륨은 삭제하지 않습니다. |  뒤의 이름은 명령을 적용할 대상입니다. 조회 결과나 오류 메시지를 읽고 확인합니다. |
| docker ps -a --filter name=e11-lab | 컨테이너 목록을 조회합니다. 기본은 실행 중인 것만 나옵니다. | -a는 종료된 것까지 전체 표시. --filter name=…는 컨테이너 이름 조건으로 목록을 좁힘. |
| exit | 현재 쉘을 끝냅니다. | 컨테이너 쉘이면 컨테이너 밖으로, script 쉘이면 기록 종료, WSL 기본 쉘이면 PowerShell 등 이전 환경으로 돌아갑니다. 실행 전 현재 위치를 구분하세요. |
<!-- command-notes:end -->




`--no-stream`은 실시간 출력을 한 번만 보여주고 끝냅니다. `docker logs e11-lab`은 출력이 거의 없을 수 있으므로, 실제 로그가 있는 `hello-world` 컨테이너로 확인합니다.

**성공 기준:** 이미지 목록, 실행 중·종료된 컨테이너 목록, 로그, 리소스 사용량을 읽을 수 있습니다.

**기록:** 각 명령의 목적과 주요 출력. 이미지와 컨테이너가 서로 다른 목록에 나타나는 이유를 적습니다.

## 9. 나만의 웹 서버 이미지 만들기

**배울 것:** HTML은 웹페이지 파일, NGINX는 그 파일을 브라우저에 보내는 서버입니다. Dockerfile은 이미지 만드는 순서입니다. `build`는 이미지를 만들고 `run`은 컨테이너를 만듭니다.

### 9-1. 내 웹페이지 작성

**Ubuntu**

```bash
cd ~/codyssey/e1-1-workstation
cat > site/index.html <<'EOF'
<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>나의 개발 작업실</title>
</head>
<body>
  <h1>나의 첫 Docker 작업실</h1>
  <p>WSL과 Docker로 웹 서버를 실행했습니다.</p>
  <p id="version">version-1</p>
</body>
</html>
EOF
cat site/index.html
```

<!-- command-notes:start -->
**바로 위 코드 해설 — 읽고 실행하기**

| 명령·코드 | 하는 일 | 옵션·기호·확인할 결과 |
| --- | --- | --- |
| cd ~/codyssey/e1-1-workstation | 현재 작업 위치를 뒤에 적은 디렉터리로 바꿉니다. change directory입니다. | ~는 내 Ubuntu 홈 폴더이고, /는 경로 구분자입니다. 성공해도 보통 출력은 없습니다. pwd로 확인합니다. |
| cat > site/index.html <<'EOF' | 여러 줄의 내용을 파일에 저장하는 입력을 시작합니다. | >는 파일 생성/덮어쓰기, <<'EOF'는 다음 줄부터 단독 EOF 줄 직전까지를 그대로 파일 내용으로 받는 표기입니다. 끝의 EOF까지 입력해야 명령이 완료됩니다. |
| <!doctype html> 부터 </html> 까지 | 브라우저에 보여줄 HTML 문서 내용입니다. 한 줄씩 Linux 명령으로 실행하는 것이 아닙니다. | doctype은 HTML 문서 선언, html lang은 언어, head는 설정, meta charset은 한글 인코딩, viewport는 화면 크기 대응, title은 탭 제목, body는 화면 본문, h1은 큰 제목, p는 문단, id는 요소 이름입니다. </…>는 해당 요소의 끝입니다. |
| EOF | 여러 줄 파일 입력을 끝내는 약속된 구분자입니다. | 줄 맨 앞에 EOF만 입력하고 Enter를 누릅니다. 이 줄이 없으면 > 입력 대기 줄이 계속 나타날 수 있습니다. EOF 자체는 HTML 파일에 들어가지 않습니다. |
| cat site/index.html | 뒤에 적은 파일의 내용을 터미널에 보여줍니다. | /etc/os-release는 Ubuntu 배포판 정보입니다. 다른 경로는 해당 실습 파일입니다. 읽기만 하며 내용을 바꾸지 않습니다. |
<!-- command-notes:end -->




예시를 이해한 후 제목과 소개를 **본인 프로젝트에 맞게 수정**합니다. 뒤 실습을 위해 `version-1` 문구는 유지합니다.

### 9-2. Dockerfile 직접 작성

VSCode에서 과제 폴더 바로 아래에 `Dockerfile`이라는 이름으로 파일을 만들고 아래 내용을 직접 입력합니다. `.txt` 확장자를 붙이지 않습니다.

```dockerfile
FROM nginx:alpine
LABEL org.opencontainers.image.title="e11-workstation-web"
COPY site/ /usr/share/nginx/html/
EXPOSE 80
```

<!-- command-notes:start -->
**바로 위 코드 해설 — 읽고 실행하기**

| 명령·코드 | 하는 일 | 옵션·기호·확인할 결과 |
| --- | --- | --- |
| FROM nginx:alpine | 어떤 기존 이미지를 출발점으로 삼을지 정합니다. | nginx:alpine = 이미지 이름 nginx와 태그 alpine. 웹 서버 기능을 재사용합니다. |
| LABEL org.opencontainers.image.title="e11-workstation-web" | 이미지에 설명용 이름·값 정보를 붙입니다. | 서버 화면을 바꾸는 기능이 아니라 이미지 메타데이터입니다. |
| COPY site/ /usr/share/nginx/html/ | 내 파일을 빌드할 이미지 안에 복사합니다. | site/는 빌드 컨텍스트 안의 원본 폴더, /usr/share/nginx/html/은 이미지 안의 NGINX 웹 루트입니다. |
| EXPOSE 80 | 이미지가 사용할 포트를 설명 정보로 표시합니다. | 80은 컨테이너 서버 포트입니다. 이 줄만으로 Windows 접속이 열리지는 않으며 docker run -p가 필요합니다. |
<!-- command-notes:end -->




| 줄 | 의미 | 내 커스텀 목적 |
| --- | --- | --- |
| FROM | 출발할 베이스 이미지 | NGINX 웹 서버 기능을 재사용 |
| LABEL | 이미지 설명 정보 | 이미지의 용도 표시 |
| COPY | 빌드 시 내 파일을 이미지에 복사 | 기본 환영 페이지를 내 웹페이지로 교체 |
| EXPOSE | 이미지가 사용할 포트를 설명 | 서버가 80번 포트를 쓴다는 정보. 실제 연결은 `-p`로 설정 |

`nginx:alpine`은 이동 가능한 태그라 나중에 이미지 내용이 바뀔 수 있습니다. 이번에 사용한 베이스의 digest도 기록해두면 재현에 도움이 됩니다.

### 9-3. 빌드와 확인

**Ubuntu**

```bash
script -q -a docs/logs/09-build.txt
pwd
cat Dockerfile
docker build --progress=plain -t e11-web:1.0 .
docker images e11-web
docker image inspect nginx:alpine --format '{{json .RepoDigests}}'
exit
```

<!-- command-notes:start -->
**바로 위 코드 해설 — 읽고 실행하기**

| 명령·코드 | 하는 일 | 옵션·기호·확인할 결과 |
| --- | --- | --- |
| script -q -a docs/logs/09-build.txt | 새 기록용 쉘을 열어 입력한 명령과 출력을 파일에 기록합니다. | -q는 시작·종료 안내를 줄이고, -a는 기존 로그 뒤에 덧붙입니다. 뒤는 로그 파일 경로입니다. 현재 쉘에서 exit를 입력하면 기록을 마칩니다. |
| pwd | 현재 작업 디렉터리의 전체 경로를 출력합니다. print working directory의 약자입니다. | 이번 실습의 과제 경로인지 확인합니다. 읽기 전용 조회입니다. |
| cat Dockerfile | 뒤에 적은 파일의 내용을 터미널에 보여줍니다. | /etc/os-release는 Ubuntu 배포판 정보입니다. 다른 경로는 해당 실습 파일입니다. 읽기만 하며 내용을 바꾸지 않습니다. |
| docker build --progress=plain -t e11-web:1.0 . | 현재 Dockerfile과 빌드에 보낼 파일을 이용해 이미지를 만듭니다. | -t는 이미지이름:태그 지정, 마지막 .은 현재 폴더를 빌드 컨텍스트로 사용, --progress=plain은 진행을 텍스트 로그로 표시. |
| docker images e11-web | 내 PC의 Docker 엔진에 저장된 이미지 목록을 조회합니다. |  뒤의 이름은 명령을 적용할 대상입니다. 조회 결과나 오류 메시지를 읽고 확인합니다. |
| docker image inspect nginx:alpine --format '{{json .RepoDigests}}' | 이미지의 상세 정보를 조회합니다. | --format은 원하는 정보만 고르는 출력 템플릿. json은 JSON 형식, .RepoDigests는 이미지 digest 목록, .Mounts는 마운트 연결 정보. nginx:alpine은 웹 서버 이미지의 이름:태그. |
| exit | 현재 쉘을 끝냅니다. | 컨테이너 쉘이면 컨테이너 밖으로, script 쉘이면 기록 종료, WSL 기본 쉘이면 PowerShell 등 이전 환경으로 돌아갑니다. 실행 전 현재 위치를 구분하세요. |
<!-- command-notes:end -->




끝의 `.`은 현재 디렉터리를 빌드에 사용할 파일 범위로 지정합니다. `COPY site/…`가 찾는 파일도 이 범위 안에 있어야 합니다. `e11-web:1.0`에서 콜론 앞은 이미지 이름, 뒤는 태그입니다.

**성공 기준:** `docker images e11-web`에 `1.0` 이미지가 나타납니다.

**기록:** 베이스 선택, 바꾼 웹 콘텐츠와 목적, Dockerfile, 빌드 명령·결과, 베이스 digest. 출력에 있는 예시 문장을 제출 설명으로 그대로 쓰지 말고 본인 말로 적으세요.

참고: [Dockerfile 작성](https://docs.docker.com/get-started/docker-concepts/building-images/writing-a-dockerfile/), [이미지 빌드와 태그](https://docs.docker.com/get-started/docker-concepts/building-images/build-tag-and-publish-an-image/).

## 10. 포트 매핑과 브라우저 접속

**배울 것:** `127.0.0.1:8080:80`은 내 PC의 8080번 접속을 컨테이너 80번으로 보냅니다. 컨테이너에 서버가 있어도 호스트 접속 연결은 별도로 필요합니다. 학습용 서버는 내 PC의 루프백 주소에 연결합니다.

**Ubuntu**

```bash
cd ~/codyssey/e1-1-workstation
script -q -a docs/logs/10-ports.txt
docker run -d --name e11-web-8080 -p 127.0.0.1:8080:80 e11-web:1.0
docker ps --filter name=e11-web
docker port e11-web-8080
curl -i http://localhost:8080
```

<!-- command-notes:start -->
**바로 위 코드 해설 — 읽고 실행하기**

| 명령·코드 | 하는 일 | 옵션·기호·확인할 결과 |
| --- | --- | --- |
| cd ~/codyssey/e1-1-workstation | 현재 작업 위치를 뒤에 적은 디렉터리로 바꿉니다. change directory입니다. | ~는 내 Ubuntu 홈 폴더이고, /는 경로 구분자입니다. 성공해도 보통 출력은 없습니다. pwd로 확인합니다. |
| script -q -a docs/logs/10-ports.txt | 새 기록용 쉘을 열어 입력한 명령과 출력을 파일에 기록합니다. | -q는 시작·종료 안내를 줄이고, -a는 기존 로그 뒤에 덧붙입니다. 뒤는 로그 파일 경로입니다. 현재 쉘에서 exit를 입력하면 기록을 마칩니다. |
| docker run -d --name e11-web-8080 -p 127.0.0.1:8080:80 e11-web:1.0 | 이미지로 새 컨테이너를 만들어 실행합니다. 같은 이름의 기존 컨테이너를 다시 시작하는 명령은 아닙니다. | -d는 백그라운드 실행. --name 뒤는 직접 정한 컨테이너 이름. -p의 127.0.0.1:호스트포트:컨테이너포트는 내 PC의 해당 접속을 컨테이너로 전달. 백그라운드 실행 성공 시 긴 컨테이너 ID가 나올 수 있음. |
| docker ps --filter name=e11-web | 컨테이너 목록을 조회합니다. 기본은 실행 중인 것만 나옵니다. | --filter name=…는 컨테이너 이름 조건으로 목록을 좁힘. |
| docker port e11-web-8080 | 컨테이너 포트가 호스트 어디에 연결됐는지 조회합니다. |  뒤의 이름은 명령을 적용할 대상입니다. 조회 결과나 오류 메시지를 읽고 확인합니다. |
| curl -i http://localhost:8080 | URL에 HTTP 요청을 보내 서버 응답을 터미널에 보여줍니다. | -i는 응답 헤더와 본문을 함께 보여줍니다. HTTP 성공 상태와 HTML을 확인합니다. localhost는 내 컴퓨터, 콜론 뒤 숫자는 접속 포트입니다. 브라우저 화면 캡처와 별개의 증거입니다. |
<!-- command-notes:end -->




**Windows 브라우저**에서 [http://localhost:8080](http://localhost:8080)을 엽니다. 만든 웹페이지와 `version-1`이 보이는지 확인합니다. 주소창과 본문을 함께 캡처해 `docs/images/10-port-8080.png`로 저장합니다.

원문의 결과 예시에 나오는 접속 2회도 확인할 수 있도록 다른 호스트 포트에서 실행합니다.

**Ubuntu — 같은 기록 세션에서**

```bash
docker run -d --name e11-web-8081 -p 127.0.0.1:8081:80 e11-web:1.0
curl -i http://localhost:8081
docker logs e11-web-8080
docker stats --no-stream e11-web-8080
exit
```

<!-- command-notes:start -->
**바로 위 코드 해설 — 읽고 실행하기**

| 명령·코드 | 하는 일 | 옵션·기호·확인할 결과 |
| --- | --- | --- |
| docker run -d --name e11-web-8081 -p 127.0.0.1:8081:80 e11-web:1.0 | 이미지로 새 컨테이너를 만들어 실행합니다. 같은 이름의 기존 컨테이너를 다시 시작하는 명령은 아닙니다. | -d는 백그라운드 실행. --name 뒤는 직접 정한 컨테이너 이름. -p의 127.0.0.1:호스트포트:컨테이너포트는 내 PC의 해당 접속을 컨테이너로 전달. 백그라운드 실행 성공 시 긴 컨테이너 ID가 나올 수 있음. |
| curl -i http://localhost:8081 | URL에 HTTP 요청을 보내 서버 응답을 터미널에 보여줍니다. | -i는 응답 헤더와 본문을 함께 보여줍니다. HTTP 성공 상태와 HTML을 확인합니다. localhost는 내 컴퓨터, 콜론 뒤 숫자는 접속 포트입니다. 브라우저 화면 캡처와 별개의 증거입니다. |
| docker logs e11-web-8080 | 컨테이너 프로그램의 표준 출력·오류 로그를 보여줍니다. | 로그가 없으면 무출력일 수도 있음. no-such-container 예시는 의도적인 이름 오류. |
| docker stats --no-stream e11-web-8080 | 컨테이너의 CPU·메모리 등 리소스 사용량을 조회합니다. | --no-stream은 실시간 갱신 없이 한 번 표시 후 종료. |
| exit | 현재 쉘을 끝냅니다. | 컨테이너 쉘이면 컨테이너 밖으로, script 쉘이면 기록 종료, WSL 기본 쉘이면 PowerShell 등 이전 환경으로 돌아갑니다. 실행 전 현재 위치를 구분하세요. |
<!-- command-notes:end -->




브라우저에서 [http://localhost:8081](http://localhost:8081)을 열어 `docs/images/10-port-8081.png`로 캡처합니다.

**성공 기준:** 서로 다른 두 컨테이너가 같은 이미지로 동작하고, 두 URL 모두 같은 웹페이지를 보여줍니다. curl 응답에 HTTP 성공 상태와 HTML이 있습니다.

**기록:** 매핑의 각 숫자 의미, 실행·curl 결과, 브라우저 캡처 2장. 이름·포트가 이미 사용 중이면 부록의 해결 순서를 확인합니다.

참고: [Docker 포트 공개](https://docs.docker.com/get-started/docker-concepts/running-containers/publishing-ports/).

## 11. 바인드 마운트로 파일 수정 반영

**배울 것:** 앞에서는 빌드 시 파일을 이미지에 복사했습니다. 바인드 마운트는 지금 내 Ubuntu 폴더를 컨테이너 폴더에 연결합니다. 연결된 폴더의 내용이 이미지에 있던 내용을 가려서 대신 보입니다.

**Ubuntu**

```bash
cd ~/codyssey/e1-1-workstation
script -q -a docs/logs/11-bind-mount.txt
pwd
docker run -d --name e11-web-bind -p 127.0.0.1:8082:80 --mount "type=bind,source=$(pwd)/site,target=/usr/share/nginx/html,readonly" e11-web:1.0
docker inspect e11-web-bind --format '{{json .Mounts}}'
cat site/index.html
curl -s http://localhost:8082
```

<!-- command-notes:start -->
**바로 위 코드 해설 — 읽고 실행하기**

| 명령·코드 | 하는 일 | 옵션·기호·확인할 결과 |
| --- | --- | --- |
| cd ~/codyssey/e1-1-workstation | 현재 작업 위치를 뒤에 적은 디렉터리로 바꿉니다. change directory입니다. | ~는 내 Ubuntu 홈 폴더이고, /는 경로 구분자입니다. 성공해도 보통 출력은 없습니다. pwd로 확인합니다. |
| script -q -a docs/logs/11-bind-mount.txt | 새 기록용 쉘을 열어 입력한 명령과 출력을 파일에 기록합니다. | -q는 시작·종료 안내를 줄이고, -a는 기존 로그 뒤에 덧붙입니다. 뒤는 로그 파일 경로입니다. 현재 쉘에서 exit를 입력하면 기록을 마칩니다. |
| pwd | 현재 작업 디렉터리의 전체 경로를 출력합니다. print working directory의 약자입니다. | 이번 실습의 과제 경로인지 확인합니다. 읽기 전용 조회입니다. |
| docker run -d --name e11-web-bind -p 127.0.0.1:8082:80 --mount "type=bind,source=$(pwd)/site,target=/usr/share/nginx/html,readonly" e11-web:1.0 | 이미지로 새 컨테이너를 만들어 실행합니다. 같은 이름의 기존 컨테이너를 다시 시작하는 명령은 아닙니다. | -d는 백그라운드 실행. --name 뒤는 직접 정한 컨테이너 이름. -p의 127.0.0.1:호스트포트:컨테이너포트는 내 PC의 해당 접속을 컨테이너로 전달. --mount는 저장 공간 연결: type=bind는 호스트 폴더, type=volume은 Docker 볼륨, source는 원본, target은 컨테이너 안 위치, readonly는 컨테이너에서 읽기 전용. $(pwd)는 Ubuntu에서 현재 전체 경로를 계산해 넣는 명령 치환. 백그라운드 실행 성공 시 긴 컨테이너 ID가 나올 수 있음. |
| docker inspect e11-web-bind --format '{{json .Mounts}}' | 컨테이너 등의 상세 설정을 조회합니다. | --format은 원하는 정보만 고르는 출력 템플릿. json은 JSON 형식, .RepoDigests는 이미지 digest 목록, .Mounts는 마운트 연결 정보. |
| cat site/index.html | 뒤에 적은 파일의 내용을 터미널에 보여줍니다. | /etc/os-release는 Ubuntu 배포판 정보입니다. 다른 경로는 해당 실습 파일입니다. 읽기만 하며 내용을 바꾸지 않습니다. |
| curl -s http://localhost:8082 | URL에 HTTP 요청을 보내 서버 응답을 터미널에 보여줍니다. | -s는 진행률 등을 숨겨 본문 위주로 봅니다. localhost는 내 컴퓨터, 콜론 뒤 숫자는 접속 포트입니다. 브라우저 화면 캡처와 별개의 증거입니다. |
<!-- command-notes:end -->




브라우저에서 [http://localhost:8082](http://localhost:8082)을 열어 변경 전 화면을 `docs/images/11-bind-before.png`로 저장합니다.

**Ubuntu — 같은 기록 세션에서**

```bash
sed -i 's/version-1/version-2/' site/index.html
cat site/index.html
curl -s http://localhost:8082
curl -s http://localhost:8080
exit
```

<!-- command-notes:start -->
**바로 위 코드 해설 — 읽고 실행하기**

| 명령·코드 | 하는 일 | 옵션·기호·확인할 결과 |
| --- | --- | --- |
| sed -i 's/version-1/version-2/' site/index.html | 파일에서 지정한 문자열을 바꿉니다. | -i는 파일을 직접 수정합니다. s/version-1/version-2/는 version-1을 version-2로 치환합니다. 이 표현은 각 줄의 첫 일치 항목을 바꿉니다. 성공 시 보통 무출력입니다. |
| cat site/index.html | 뒤에 적은 파일의 내용을 터미널에 보여줍니다. | /etc/os-release는 Ubuntu 배포판 정보입니다. 다른 경로는 해당 실습 파일입니다. 읽기만 하며 내용을 바꾸지 않습니다. |
| curl -s http://localhost:8082 | URL에 HTTP 요청을 보내 서버 응답을 터미널에 보여줍니다. | -s는 진행률 등을 숨겨 본문 위주로 봅니다. localhost는 내 컴퓨터, 콜론 뒤 숫자는 접속 포트입니다. 브라우저 화면 캡처와 별개의 증거입니다. |
| curl -s http://localhost:8080 | URL에 HTTP 요청을 보내 서버 응답을 터미널에 보여줍니다. | -s는 진행률 등을 숨겨 본문 위주로 봅니다. localhost는 내 컴퓨터, 콜론 뒤 숫자는 접속 포트입니다. 브라우저 화면 캡처와 별개의 증거입니다. |
| exit | 현재 쉘을 끝냅니다. | 컨테이너 쉘이면 컨테이너 밖으로, script 쉘이면 기록 종료, WSL 기본 쉘이면 PowerShell 등 이전 환경으로 돌아갑니다. 실행 전 현재 위치를 구분하세요. |
<!-- command-notes:end -->




8082 페이지를 새로고침하고 `version-2`를 `docs/images/11-bind-after.png`로 캡처합니다. 캐시가 의심되면 Ctrl+F5를 사용합니다.

**성공 기준:** 바인드 마운트한 8082는 `version-2`, 기존 이미지로 실행한 8080은 `version-1`입니다. 이미지 재빌드 없이 호스트 파일 변경이 8082에 반영됩니다. `readonly`는 컨테이너 쪽 쓰기를 막으며, 호스트에서 파일을 수정하는 것은 가능합니다.

**기록:** 마운트 실행 명령·Mounts 결과·호스트 파일 전후·접속 화면 전후. 8080과 8082가 다른 이유를 설명합니다. 아직 이미지는 1.0인데 호스트 파일만 2로 바뀐 상태라는 점을 적으세요.

참고: [Docker 바인드 마운트](https://docs.docker.com/engine/storage/bind-mounts/).

## 12. 볼륨으로 데이터 영속성 증명

**배울 것:** 컨테이너의 쓰기 영역과 볼륨은 수명이 다릅니다. 컨테이너를 삭제하고 다시 만들어도 **같은 볼륨을 연결**하면 그 안의 데이터를 읽을 수 있습니다. 여기서는 비교를 위해 볼륨 밖의 파일도 함께 만듭니다.

**Ubuntu**

```bash
cd ~/codyssey/e1-1-workstation
script -q -a docs/logs/12-volume.txt
docker volume create e11-data
docker volume inspect e11-data
docker run -d --name e11-vol-a --mount type=volume,source=e11-data,target=/data ubuntu:24.04 sleep infinity
docker exec e11-vol-a bash -lc 'echo "my-persistent-record" > /data/proof.txt; echo "temporary-record" > /tmp/local-only.txt'
docker exec e11-vol-a cat /data/proof.txt
docker exec e11-vol-a cat /tmp/local-only.txt
docker stop e11-vol-a
docker rm e11-vol-a
docker ps -a --filter name=e11-vol-a
docker run -d --name e11-vol-b --mount type=volume,source=e11-data,target=/data ubuntu:24.04 sleep infinity
docker exec e11-vol-b cat /data/proof.txt
docker exec e11-vol-b bash -lc 'if [ -e /tmp/local-only.txt ]; then cat /tmp/local-only.txt; else echo "temporary file is absent"; fi'
docker volume ls
exit
```

<!-- command-notes:start -->
**바로 위 코드 해설 — 읽고 실행하기**

| 명령·코드 | 하는 일 | 옵션·기호·확인할 결과 |
| --- | --- | --- |
| cd ~/codyssey/e1-1-workstation | 현재 작업 위치를 뒤에 적은 디렉터리로 바꿉니다. change directory입니다. | ~는 내 Ubuntu 홈 폴더이고, /는 경로 구분자입니다. 성공해도 보통 출력은 없습니다. pwd로 확인합니다. |
| script -q -a docs/logs/12-volume.txt | 새 기록용 쉘을 열어 입력한 명령과 출력을 파일에 기록합니다. | -q는 시작·종료 안내를 줄이고, -a는 기존 로그 뒤에 덧붙입니다. 뒤는 로그 파일 경로입니다. 현재 쉘에서 exit를 입력하면 기록을 마칩니다. |
| docker volume create e11-data | Docker가 관리하는 영속 저장 공간을 생성하거나 조회합니다. | create는 생성, inspect는 상세 조회, ls는 목록 표시. e11-data는 지정한 볼륨 이름. |
| docker volume inspect e11-data | Docker가 관리하는 영속 저장 공간을 생성하거나 조회합니다. | create는 생성, inspect는 상세 조회, ls는 목록 표시. e11-data는 지정한 볼륨 이름. |
| docker run -d --name e11-vol-a --mount type=volume,source=e11-data,target=/data ubuntu:24.04 sleep infinity | 이미지로 새 컨테이너를 만들어 실행합니다. 같은 이름의 기존 컨테이너를 다시 시작하는 명령은 아닙니다. | -d는 백그라운드 실행. --name 뒤는 직접 정한 컨테이너 이름. --mount는 저장 공간 연결: type=bind는 호스트 폴더, type=volume은 Docker 볼륨, source는 원본, target은 컨테이너 안 위치. ubuntu:24.04는 컨테이너용 이미지 이름·태그로, WSL Ubuntu-26.04와 달라도 정상. sleep infinity는 계속 대기하는 주 프로세스로 컨테이너를 유지. 백그라운드 실행 성공 시 긴 컨테이너 ID가 나올 수 있음. |
| docker exec e11-vol-a bash -lc 'echo "my-persistent-record" > /data/proof.txt; echo "temporary-record" > /tmp/local-only.txt' | 실행 중인 컨테이너 안에서 별도의 명령을 실행합니다. | bash -l은 로그인 쉘 설정 사용, -c는 뒤의 문자열을 명령으로 실행. 따옴표 안 >는 컨테이너 안 파일에 출력 저장·덮어쓰기, ;는 명령 구분. |
| docker exec e11-vol-a cat /data/proof.txt | 실행 중인 컨테이너 안에서 별도의 명령을 실행합니다. | cat 뒤 경로의 파일 내용을 컨테이너 안에서 읽어 출력. |
| docker exec e11-vol-a cat /tmp/local-only.txt | 실행 중인 컨테이너 안에서 별도의 명령을 실행합니다. | cat 뒤 경로의 파일 내용을 컨테이너 안에서 읽어 출력. |
| docker stop e11-vol-a | 이름으로 지정한 컨테이너를 중지합니다. 컨테이너·이미지·볼륨은 삭제하지 않습니다. |  뒤의 이름은 명령을 적용할 대상입니다. 조회 결과나 오류 메시지를 읽고 확인합니다. |
| docker rm e11-vol-a | 중지된 컨테이너를 삭제합니다. 컨테이너 쓰기 영역은 사라지지만 별도 이름 있는 볼륨은 이 명령으로 삭제되지 않습니다. |  뒤의 이름은 명령을 적용할 대상입니다. 조회 결과나 오류 메시지를 읽고 확인합니다. |
| docker ps -a --filter name=e11-vol-a | 컨테이너 목록을 조회합니다. 기본은 실행 중인 것만 나옵니다. | -a는 종료된 것까지 전체 표시. --filter name=…는 컨테이너 이름 조건으로 목록을 좁힘. |
| docker run -d --name e11-vol-b --mount type=volume,source=e11-data,target=/data ubuntu:24.04 sleep infinity | 이미지로 새 컨테이너를 만들어 실행합니다. 같은 이름의 기존 컨테이너를 다시 시작하는 명령은 아닙니다. | -d는 백그라운드 실행. --name 뒤는 직접 정한 컨테이너 이름. --mount는 저장 공간 연결: type=bind는 호스트 폴더, type=volume은 Docker 볼륨, source는 원본, target은 컨테이너 안 위치. ubuntu:24.04는 컨테이너용 이미지 이름·태그로, WSL Ubuntu-26.04와 달라도 정상. sleep infinity는 계속 대기하는 주 프로세스로 컨테이너를 유지. 백그라운드 실행 성공 시 긴 컨테이너 ID가 나올 수 있음. |
| docker exec e11-vol-b cat /data/proof.txt | 실행 중인 컨테이너 안에서 별도의 명령을 실행합니다. | cat 뒤 경로의 파일 내용을 컨테이너 안에서 읽어 출력. |
| docker exec e11-vol-b bash -lc 'if [ -e /tmp/local-only.txt ]; then cat /tmp/local-only.txt; else echo "temporary file is absent"; fi' | 실행 중인 컨테이너 안에서 별도의 명령을 실행합니다. | bash -l은 로그인 쉘 설정 사용, -c는 뒤의 문자열을 명령으로 실행. if는 조건 분기, [ -e 경로 ]는 파일 존재 검사, then/else는 참/거짓 동작, fi는 분기 끝. cat 뒤 경로의 파일 내용을 컨테이너 안에서 읽어 출력. |
| docker volume ls | Docker가 관리하는 영속 저장 공간을 생성하거나 조회합니다. | create는 생성, inspect는 상세 조회, ls는 목록 표시. e11-data는 지정한 볼륨 이름. |
| exit | 현재 쉘을 끝냅니다. | 컨테이너 쉘이면 컨테이너 밖으로, script 쉘이면 기록 종료, WSL 기본 쉘이면 PowerShell 등 이전 환경으로 돌아갑니다. 실행 전 현재 위치를 구분하세요. |
<!-- command-notes:end -->




**성공 기준:** 원래 컨테이너 `e11-vol-a`는 삭제됐지만 새 컨테이너 `e11-vol-b`가 `my-persistent-record`를 읽습니다. 볼륨 밖에 만든 임시 파일은 새 컨테이너에 없습니다.

**기록:** 생성·연결·쓰기·삭제·재연결·읽기 전체 흐름. 단순 재시작이 아닌 **컨테이너 삭제 후 재생성**임을 명확히 적습니다. 볼륨은 GitHub에 자동 업로드되지 않으므로 생성과 검증 방법을 문서에 남겨야 합니다.

참고: [Docker 볼륨](https://docs.docker.com/engine/storage/volumes/).

## 13. README와 트러블슈팅 완성

### 13-1. README에서 증거를 연결

다음은 링크 형식 예시입니다. 실제 만든 파일명에 맞춥니다.

```markdown
### 터미널 기본 조작
현재 위치·파일 목록·생성·복사·이동·삭제를 수행했다.
[명령과 출력](docs/logs/03-terminal.txt)

### 포트 매핑
호스트 8080을 컨테이너 80에 연결했다.
[명령과 출력](docs/logs/10-ports.txt)
![8080 접속](docs/images/10-port-8080.png)

### 볼륨 영속성
컨테이너 A 삭제 후 컨테이너 B에 같은 볼륨을 연결했다.
[명령과 출력](docs/logs/12-volume.txt)
```

<!-- command-notes:start -->
**바로 위 코드 해설 — 읽고 실행하기**

| 명령·코드 | 하는 일 | 옵션·기호·확인할 결과 |
| --- | --- | --- |
| 문서 작성 예시 전체 | 터미널에서 실행하는 명령이 아니라 README에 적을 문서 형식입니다. | #은 제목, -는 목록, [ ]와 [x]는 체크박스입니다. 링크는 대괄호 설명 뒤에 괄호 경로를 붙이며, 이미지는 그 앞에 !를 붙입니다. 실제 결과로 내용을 채우세요. |
<!-- command-notes:end -->




로그 링크만 나열하지 말고, 각 항목에서 **무엇을 했고 무엇이 증명됐는지**를 한두 문장으로 설명합니다. 핵심 명령과 출력은 README 코드블록에도 발췌합니다. 성공을 직접 확인한 체크박스만 `[x]`로 바꿉니다.

### 13-2. 실행 환경 채우기

Windows 정보는 0단계 기록, WSL 버전은 PowerShell의 `wsl --version`을 사용합니다. Ubuntu에서는 다음을 확인합니다.

```bash
cat /etc/os-release
echo "$SHELL"
git --version
docker --version
docker version
```

<!-- command-notes:start -->
**바로 위 코드 해설 — 읽고 실행하기**

| 명령·코드 | 하는 일 | 옵션·기호·확인할 결과 |
| --- | --- | --- |
| cat /etc/os-release | 뒤에 적은 파일의 내용을 터미널에 보여줍니다. | /etc/os-release는 Ubuntu 배포판 정보입니다. 다른 경로는 해당 실습 파일입니다. 읽기만 하며 내용을 바꾸지 않습니다. |
| echo "$SHELL" | 뒤의 글자 또는 변수 값을 출력합니다. | $SHELL은 사용자에게 설정된 기본 쉘 경로 변수입니다. 큰따옴표 안에서는 변수 값으로 치환됩니다. 현재 실행 중인 쉘과 항상 같다는 뜻은 아닙니다. |
| git --version | Git 프로그램 버전을 조회합니다. | 설치 확인용입니다. |
| docker --version | Docker CLI 버전만 보여줍니다. |  뒤의 이름은 명령을 적용할 대상입니다. 조회 결과나 오류 메시지를 읽고 확인합니다. |
| docker version | Docker Client와 Server의 버전을 조회합니다. |  뒤의 이름은 명령을 적용할 대상입니다. 조회 결과나 오류 메시지를 읽고 확인합니다. |
<!-- command-notes:end -->




어떤 터미널 앱과 VSCode WSL 연결을 사용했는지도 씁니다.

### 13-3. 다른 사람이 실행할 재현 절차

README에는 Docker Desktop·WSL 연동 준비를 적고, 저장소를 받은 후 과제 루트에서 실행할 아래 절차를 설명합니다.

```bash
docker build -t e11-web:verify .
docker run -d --name e11-verify -p 127.0.0.1:8090:80 e11-web:verify
curl -i http://localhost:8090
```

<!-- command-notes:start -->
**바로 위 코드 해설 — 읽고 실행하기**

| 명령·코드 | 하는 일 | 옵션·기호·확인할 결과 |
| --- | --- | --- |
| docker build -t e11-web:verify . | 현재 Dockerfile과 빌드에 보낼 파일을 이용해 이미지를 만듭니다. | -t는 이미지이름:태그 지정, 마지막 .은 현재 폴더를 빌드 컨텍스트로 사용. |
| docker run -d --name e11-verify -p 127.0.0.1:8090:80 e11-web:verify | 이미지로 새 컨테이너를 만들어 실행합니다. 같은 이름의 기존 컨테이너를 다시 시작하는 명령은 아닙니다. | -d는 백그라운드 실행. --name 뒤는 직접 정한 컨테이너 이름. -p의 127.0.0.1:호스트포트:컨테이너포트는 내 PC의 해당 접속을 컨테이너로 전달. 백그라운드 실행 성공 시 긴 컨테이너 ID가 나올 수 있음. |
| curl -i http://localhost:8090 | URL에 HTTP 요청을 보내 서버 응답을 터미널에 보여줍니다. | -i는 응답 헤더와 본문을 함께 보여줍니다. HTTP 성공 상태와 HTML을 확인합니다. localhost는 내 컴퓨터, 콜론 뒤 숫자는 접속 포트입니다. 브라우저 화면 캡처와 별개의 증거입니다. |
<!-- command-notes:end -->




Windows 브라우저에서도 `http://localhost:8090`을 확인합니다. 11단계에서 웹 파일을 바꿨으므로 **새 빌드의 페이지는 `version-2`**입니다. 초기 1.0 이미지가 version-1이었던 실습 기록과 구분하세요. README에는 초기 빌드 후 마운트로 수정한 순서를 적습니다.

이 명령을 직접 재검증할 때는 새 컨테이너 이름·포트를 사용해 기존 실습 서버와 충돌을 피합니다. 확인을 마친 후 `docker stop e11-verify`와 `docker rm e11-verify`로 이 검증 컨테이너만 정리할 수 있습니다.

### 13-4. 트러블슈팅 2건 이상

각 건을 아래 구조로 작성합니다.

```markdown
### 문제 1: 실제 문제 제목
- 문제: 어떤 명령에서 어떤 증상이 발생했는가?
- 원인 가설: 무엇 때문이라고 생각했는가?
- 확인: 어떤 명령과 결과로 원인을 좁혔는가?
- 해결/대안: 무엇을 바꿨고 재확인 결과는 무엇인가?
```

<!-- command-notes:start -->
**바로 위 코드 해설 — 읽고 실행하기**

| 명령·코드 | 하는 일 | 옵션·기호·확인할 결과 |
| --- | --- | --- |
| 문서 작성 예시 전체 | 터미널에서 실행하는 명령이 아니라 README에 적을 문서 형식입니다. | #은 제목, -는 목록, [ ]와 [x]는 체크박스입니다. 링크는 대괄호 설명 뒤에 괄호 경로를 붙이며, 이미지는 그 앞에 !를 붙입니다. 실제 결과로 내용을 채우세요. |
<!-- command-notes:end -->




실제로 겪은 문제를 우선 기록하세요. 문제가 부족하면 아래 두 연습 오류를 **의도적인 오류 실험**이라고 밝히고 실제로 실행·기록할 수 있습니다. 경험하지 않은 문제를 겪었다고 쓰지 않습니다.

**연습 A — 존재하지 않는 컨테이너 확인**

```bash
docker logs e11-no-such-container
docker ps -a
docker logs e11-hello
```

<!-- command-notes:start -->
**바로 위 코드 해설 — 읽고 실행하기**

| 명령·코드 | 하는 일 | 옵션·기호·확인할 결과 |
| --- | --- | --- |
| docker logs e11-no-such-container | 컨테이너 프로그램의 표준 출력·오류 로그를 보여줍니다. | 로그가 없으면 무출력일 수도 있음. no-such-container 예시는 의도적인 이름 오류. |
| docker ps -a | 컨테이너 목록을 조회합니다. 기본은 실행 중인 것만 나옵니다. | -a는 종료된 것까지 전체 표시. |
| docker logs e11-hello | 컨테이너 프로그램의 표준 출력·오류 로그를 보여줍니다. | 로그가 없으면 무출력일 수도 있음. no-such-container 예시는 의도적인 이름 오류. |
<!-- command-notes:end -->




잘못된 이름으로 오류 발생 → 목록에서 실제 이름 확인 → 올바른 이름으로 로그 확인 과정을 기록합니다.

**연습 B — 잘못된 빌드 위치**

```bash
cd ~/codyssey/e1-1-workstation/practice
docker build -t e11-wrong-context:demo .
pwd
ls -la
cd ~/codyssey/e1-1-workstation
ls -l Dockerfile
docker build -t e11-web:check .
```

<!-- command-notes:start -->
**바로 위 코드 해설 — 읽고 실행하기**

| 명령·코드 | 하는 일 | 옵션·기호·확인할 결과 |
| --- | --- | --- |
| cd ~/codyssey/e1-1-workstation/practice | 현재 작업 위치를 뒤에 적은 디렉터리로 바꿉니다. change directory입니다. | ~는 내 Ubuntu 홈 폴더이고, /는 경로 구분자입니다. 성공해도 보통 출력은 없습니다. pwd로 확인합니다. |
| docker build -t e11-wrong-context:demo . | 현재 Dockerfile과 빌드에 보낼 파일을 이용해 이미지를 만듭니다. | -t는 이미지이름:태그 지정, 마지막 .은 현재 폴더를 빌드 컨텍스트로 사용. |
| pwd | 현재 작업 디렉터리의 전체 경로를 출력합니다. print working directory의 약자입니다. | 이번 실습의 과제 경로인지 확인합니다. 읽기 전용 조회입니다. |
| ls -la | 파일과 디렉터리 목록을 보여줍니다. 대상 경로가 없으면 현재 폴더를 봅니다. | -l은 권한·소유자·크기 등을 길게 표시합니다. -a는 점(.)으로 시작하는 숨김 항목까지 표시합니다. 목록 앞의 d는 디렉터리, -는 일반 파일입니다. |
| cd ~/codyssey/e1-1-workstation | 현재 작업 위치를 뒤에 적은 디렉터리로 바꿉니다. change directory입니다. | ~는 내 Ubuntu 홈 폴더이고, /는 경로 구분자입니다. 성공해도 보통 출력은 없습니다. pwd로 확인합니다. |
| ls -l Dockerfile | 파일과 디렉터리 목록을 보여줍니다. 대상 경로가 없으면 현재 폴더를 봅니다. | -l은 권한·소유자·크기 등을 길게 표시합니다. 목록 앞의 d는 디렉터리, -는 일반 파일입니다. |
| docker build -t e11-web:check . | 현재 Dockerfile과 빌드에 보낼 파일을 이용해 이미지를 만듭니다. | -t는 이미지이름:태그 지정, 마지막 .은 현재 폴더를 빌드 컨텍스트로 사용. |
<!-- command-notes:end -->




`practice`에 Dockerfile이 없어서 실패하는지 관찰하고, 파일 위치·빌드 컨텍스트를 확인한 뒤 과제 루트에서 다시 성공시킵니다. 두 실험도 `script`로 별도 로그를 남기거나 입력·출력을 복사하세요.

**성공 기준:** README에 모든 필수 항목의 설명·증거가 있고, 트러블슈팅이 최소 2건 있습니다.

## 14. GitHub와 VSCode 연결 후 제출

### 14-1. 업로드 전 파일 확인과 커밋

**Ubuntu**

```bash
cd ~/codyssey/e1-1-workstation
git status --short
git diff
git add README.md Dockerfile .gitignore .dockerignore site docs practice
git diff --cached --stat
git diff --cached
git commit -m "feat: document Docker workstation practice"
git log --oneline -5
```

<!-- command-notes:start -->
**바로 위 코드 해설 — 읽고 실행하기**

| 명령·코드 | 하는 일 | 옵션·기호·확인할 결과 |
| --- | --- | --- |
| cd ~/codyssey/e1-1-workstation | 현재 작업 위치를 뒤에 적은 디렉터리로 바꿉니다. change directory입니다. | ~는 내 Ubuntu 홈 폴더이고, /는 경로 구분자입니다. 성공해도 보통 출력은 없습니다. pwd로 확인합니다. |
| git status --short | 작업 파일과 커밋 대기 상태를 조회합니다. | --short는 간단 표시입니다. ??는 미추적, A는 추가, M은 수정 등입니다. 작업이 없으면 짧은 목록은 비어 있을 수 있습니다. |
| git diff | 아직 기록하지 않은 변경 내용을 비교합니다. | 기본은 스테이징 안 된 변경, --cached는 스테이징된 변경, --stat은 파일별 변경량 요약입니다. 차이가 없으면 무출력입니다. |
| git add README.md Dockerfile .gitignore .dockerignore site docs practice | 명시한 파일·폴더의 현재 변경을 다음 커밋 대상으로 올립니다. | 스테이징이라고 부릅니다. 파일을 인터넷에 업로드하지 않으며 성공 시 보통 무출력입니다. |
| git diff --cached --stat | 아직 기록하지 않은 변경 내용을 비교합니다. | 기본은 스테이징 안 된 변경, --cached는 스테이징된 변경, --stat은 파일별 변경량 요약입니다. 차이가 없으면 무출력입니다. |
| git diff --cached | 아직 기록하지 않은 변경 내용을 비교합니다. | 기본은 스테이징 안 된 변경, --cached는 스테이징된 변경, --stat은 파일별 변경량 요약입니다. 차이가 없으면 무출력입니다. |
| git commit -m "feat: document Docker workstation practice" | 스테이징한 변경을 로컬 이력으로 저장합니다. | -m 뒤의 따옴표 내용은 커밋 설명입니다. 자동으로 GitHub에 올라가지는 않습니다. |
| git log --oneline -5 | 커밋 이력을 조회합니다. | --oneline은 커밋당 한 줄, -3과 -5는 최근 3개·5개까지만 표시합니다. |
<!-- command-notes:end -->




토큰·비밀번호·인증 코드·개인키가 없고, 로그가 본인 실제 결과인지 확인합니다. `.gitignore`는 이미 추적 중인 파일의 비밀을 제거하지 않으므로 업로드 전 내용을 직접 확인합니다.

### 14-2. 추천 방법: VSCode에서 GitHub에 게시

1. VSCode가 `WSL: Ubuntu…` 상태로 과제 폴더를 열었는지 확인합니다.
2. 왼쪽 Source Control에서 로컬 커밋이 있는지 확인합니다.
3. `Publish Branch` 또는 명령 팔레트의 `Publish to GitHub`를 사용합니다. 버전에 따라 표시가 다를 수 있습니다.
4. GitHub 브라우저 로그인·권한 확인을 직접 완료합니다. 비밀번호·인증 코드를 로그로 기록하지 않습니다.
5. 저장소 이름을 예를 들어 `e1-1-workstation`으로 지정합니다. 과제 규칙에 맞는 공개 범위를 선택합니다. 개인 학습 결과 공개가 괜찮다면 Public이 평가자 접근에 간편합니다.
6. 게시가 끝나면 GitHub에서 README와 소스가 보이는지 확인합니다.

기존 GitHub 저장소가 있는 경우 이 게시 절차로 중복 생성하지 않습니다. 해당 저장소 주소를 확인한 뒤 원격 연결 방법을 사용해야 합니다. 이미 원격에 커밋이 있는 저장소는 빈 저장소와 연결 절차가 다르므로 강제 푸시하지 않습니다.

**Ubuntu — 인증 작업을 끝낸 후 확인**

```bash
git remote -v
git branch -vv
git status
```

<!-- command-notes:start -->
**바로 위 코드 해설 — 읽고 실행하기**

| 명령·코드 | 하는 일 | 옵션·기호·확인할 결과 |
| --- | --- | --- |
| git remote -v | 연결된 원격 저장소 주소를 조회합니다. | -v는 이름과 주소를 자세히 표시합니다. 원격을 아직 연결하지 않았으면 출력이 없을 수 있습니다. |
| git branch -vv | 로컬 브랜치 정보를 조회합니다. | -vv는 마지막 커밋과 추적 중인 원격 브랜치까지 자세히 보여줍니다. |
| git status | 작업 파일과 커밋 대기 상태를 조회합니다. | --short는 간단 표시입니다. ??는 미추적, A는 추가, M은 수정 등입니다. 작업이 없으면 짧은 목록은 비어 있을 수 있습니다. |
<!-- command-notes:end -->




원격 주소에는 토큰을 넣지 않습니다. 위 결과도 개인 경로·계정 정보가 공개 가능한지 확인합니다.

### 14-3. 연동 증거를 추가하고 다시 푸시

VSCode의 WSL 상태와 Source Control의 연결 상태, GitHub 저장소의 커밋·파일 화면을 캡처합니다. 로그인 완료 계정 표시는 확인하되 비밀번호·인증 코드는 포함하지 않습니다. `docs/images/14-vscode-github.png`, `docs/images/14-github-repo.png`처럼 저장하고 README에서 연결합니다.

**Ubuntu**

```bash
git add README.md docs/images
git diff --cached --stat
git commit -m "docs: add VSCode and GitHub integration evidence"
git push
git status
```

<!-- command-notes:start -->
**바로 위 코드 해설 — 읽고 실행하기**

| 명령·코드 | 하는 일 | 옵션·기호·확인할 결과 |
| --- | --- | --- |
| git add README.md docs/images | 명시한 파일·폴더의 현재 변경을 다음 커밋 대상으로 올립니다. | 스테이징이라고 부릅니다. 파일을 인터넷에 업로드하지 않으며 성공 시 보통 무출력입니다. |
| git diff --cached --stat | 아직 기록하지 않은 변경 내용을 비교합니다. | 기본은 스테이징 안 된 변경, --cached는 스테이징된 변경, --stat은 파일별 변경량 요약입니다. 차이가 없으면 무출력입니다. |
| git commit -m "docs: add VSCode and GitHub integration evidence" | 스테이징한 변경을 로컬 이력으로 저장합니다. | -m 뒤의 따옴표 내용은 커밋 설명입니다. 자동으로 GitHub에 올라가지는 않습니다. |
| git push | 로컬 커밋을 연결된 원격 저장소로 보냅니다. | 이 단계에서는 GitHub 업로드입니다. 원격과 인증이 준비되어야 하며 화면의 성공 결과를 확인합니다. |
| git status | 작업 파일과 커밋 대기 상태를 조회합니다. | --short는 간단 표시입니다. ??는 미추적, A는 추가, M은 수정 등입니다. 작업이 없으면 짧은 목록은 비어 있을 수 있습니다. |
<!-- command-notes:end -->




푸시가 인증 오류로 실패하면 VSCode 로그인 상태를 확인하고 Source Control의 Push/Sync 기능을 사용합니다. GitHub 계정 비밀번호를 터미널 프롬프트에 반복 입력하는 방식으로 해결하지 않습니다.

### 14-4. 마지막 제출 확인

- [ ] 제출 저장소 링크로 README·소스·Dockerfile을 볼 수 있다.
- [ ] OS·쉘·터미널·Docker·Git 버전이 있다.
- [ ] 기본 터미널 명령과 파일·디렉터리 권한 전후가 있다.
- [ ] Docker 설치·엔진 점검·운영 명령 결과가 있다.
- [ ] hello-world·Ubuntu 내부 명령·attach/exec 차이가 있다.
- [ ] 베이스 선택과 커스텀 목적, 빌드·실행 결과가 있다.
- [ ] 포트가 보이는 브라우저 캡처가 있다.
- [ ] 바인드 마운트 변경 전후가 있다.
- [ ] 컨테이너 삭제 후 볼륨 데이터 유지 증거가 있다.
- [ ] Git 설정과 VSCode GitHub 연동 증거가 있다.
- [ ] 트러블슈팅 2건 이상이 실제 확인 결과로 작성됐다.
- [ ] README의 이미지·로그 링크가 GitHub에서 열린다.
- [ ] 다른 사람이 따라 할 실행 방법과 필요한 환경이 있다.
- [ ] 민감정보가 없고 예시 출력을 실제 결과처럼 제출하지 않았다.

**제출물은 GitHub 저장소 링크**입니다. 평가 요청의 세부 화면·권한·제출 기한은 코디세이의 현재 안내를 확인하세요.

참고: [VSCode의 GitHub 연동·게시](https://code.visualstudio.com/docs/sourcecontrol/github).

## 부록 A. 자주 막히는 지점

| 증상 | 먼저 확인 | 해결 방향 |
| --- | --- | --- |
| WSL 설치가 재시작 요구 | 설치 안내 | Windows 재시작 후 Ubuntu 첫 실행 |
| 가상화 관련 오류 | 작업 관리자 가상화, 기관 정책 | 기기별 BIOS/UEFI 가이드 또는 관리자 확인 |
| Ubuntu가 WSL 1 | PowerShell의 `wsl -l -v` | 실제 배포판 이름으로 WSL 2 변환 |
| Ubuntu에서 docker 없음 | Desktop WSL Integration | 해당 배포판 연동 후 터미널 다시 열기 |
| Docker 서버 연결 실패 | Desktop 엔진 상태 | 엔진 시작과 연동 확인 |
| 컨테이너 이름 충돌 | `docker ps -a` | 기존 것을 start하거나 새 이름 사용. 삭제 전 기존 데이터 확인 |
| 포트 사용 중 | `docker ps`의 PORTS | 새 호스트 포트 사용하고 브라우저 주소도 변경 |
| 빌드가 Dockerfile 못 찾음 | `pwd`, `ls -la` | Dockerfile이 있는 과제 루트에서 빌드 |
| COPY가 파일 못 찾음 | `ls -la site`, `.dockerignore` | 빌드 컨텍스트와 복사 경로 확인 |
| 마운트 경로 없음 | `pwd`, `ls -la site` | Ubuntu 과제 루트에서 마운트 실행 |
| 수정했는데 8080 안 바뀜 | 실행한 컨테이너의 Mounts | 8080은 이미지 복사본, 8082가 마운트 서버인지 확인 |
| curl은 성공하나 브라우저 실패 | Desktop Linux 모드·WSL 연동·localhost | `http://localhost:포트`와 `http://127.0.0.1:포트` 확인. 그래도 실패하면 네트워크 증상을 기록하고 진단 |
| Windows에서 chmod가 이상함 | `pwd`가 `/mnt/c`인지 | Ubuntu 홈 폴더에서 권한 실습 |
| VSCode가 Git 못 찾음 | 왼쪽 아래 WSL 상태, Ubuntu `git --version` | WSL 연결과 Ubuntu Git 설치 확인 |
| script 로그가 계속 늘어남 | 기록용 쉘 종료 여부 | 컨테이너 밖 Ubuntu에서 `exit`로 기록 종료 |

문제 해결을 위해 WSL 배포판 초기화, Docker 전체 데이터 초기화, `docker system prune --volumes` 같은 전체 삭제를 먼저 실행하지 마세요. 이번 과제의 개별 대상부터 확인합니다.

## 부록 B. 작업을 잠시 멈출 때

컨테이너 목록부터 확인합니다. 실행 중인 **이번 실습 컨테이너 이름만 골라** 중지할 수 있습니다.

```bash
docker ps
docker stop e11-web-8080 e11-web-8081 e11-web-bind e11-vol-b
```

<!-- command-notes:start -->
**바로 위 코드 해설 — 읽고 실행하기**

| 명령·코드 | 하는 일 | 옵션·기호·확인할 결과 |
| --- | --- | --- |
| docker ps | 컨테이너 목록을 조회합니다. 기본은 실행 중인 것만 나옵니다. |  뒤의 이름은 명령을 적용할 대상입니다. 조회 결과나 오류 메시지를 읽고 확인합니다. |
| docker stop e11-web-8080 e11-web-8081 e11-web-bind e11-vol-b | 이름으로 지정한 컨테이너를 중지합니다. 컨테이너·이미지·볼륨은 삭제하지 않습니다. |  뒤의 이름은 명령을 적용할 대상입니다. 조회 결과나 오류 메시지를 읽고 확인합니다. |
<!-- command-notes:end -->




아직 만들지 않은 이름은 위 명령에서 빼세요. 다시 시작할 때 Docker Desktop을 켠 뒤 `docker start 컨테이너이름`을 사용합니다. 이미지나 컨테이너를 삭제할 필요는 없습니다. `e11-data` 볼륨도 증거 확인이 끝날 때까지 유지하세요.

매번 과제를 시작할 때 Ubuntu에서 다음 위치로 이동하면 됩니다.

```bash
cd ~/codyssey/e1-1-workstation
pwd
code .
```

<!-- command-notes:start -->
**바로 위 코드 해설 — 읽고 실행하기**

| 명령·코드 | 하는 일 | 옵션·기호·확인할 결과 |
| --- | --- | --- |
| cd ~/codyssey/e1-1-workstation | 현재 작업 위치를 뒤에 적은 디렉터리로 바꿉니다. change directory입니다. | ~는 내 Ubuntu 홈 폴더이고, /는 경로 구분자입니다. 성공해도 보통 출력은 없습니다. pwd로 확인합니다. |
| pwd | 현재 작업 디렉터리의 전체 경로를 출력합니다. print working directory의 약자입니다. | 이번 실습의 과제 경로인지 확인합니다. 읽기 전용 조회입니다. |
| code . | VSCode로 뒤에 지정한 경로를 엽니다. | .은 현재 디렉터리입니다. code .은 지금의 과제 폴더를 편집기로 엽니다. 첫 WSL 연결은 서버 준비 시간이 걸릴 수 있습니다. |
<!-- command-notes:end -->




## 부록 C. 필수 완료 후 선택 과제

필수 결과와 문서를 먼저 완성하세요. 이후 다음 순서를 권장합니다.

1. 단일 웹 서버를 Compose 파일로 실행하고 `up`, `ps`, `logs`, `down`을 실습합니다.
2. 환경 변수를 실제로 읽는 프로그램·설정으로 동작 차이를 확인합니다. NGINX 정적 HTML은 환경 변수를 추가하는 것만으로 내용이 자동 변경되지는 않습니다.
3. 보조 서비스와 네트워크 통신이 있는 멀티 컨테이너 구성을 만듭니다.
4. GitHub SSH 키를 설정하고 키 기반 푸시를 확인합니다.

## 공식 참고 자료

- [Microsoft WSL 설치](https://learn.microsoft.com/en-us/windows/wsl/install)
- [Ubuntu WSL 설치](https://documentation.ubuntu.com/wsl/latest/howto/install-ubuntu-wsl2/)
- [Microsoft WSL 개발 환경](https://learn.microsoft.com/en-us/windows/wsl/setup/environment)
- [VSCode WSL](https://code.visualstudio.com/docs/remote/wsl)
- [VSCode Git 시작](https://code.visualstudio.com/docs/sourcecontrol/quickstart)
- [VSCode GitHub 연동](https://code.visualstudio.com/docs/sourcecontrol/github)
- [GitHub 커밋 이메일](https://docs.github.com/en/account-and-profile/how-tos/email-preferences/setting-your-commit-email-address)
- [Docker Desktop Windows 설치](https://docs.docker.com/desktop/setup/install/windows-install/)
- [Docker Desktop WSL 2 연동](https://docs.docker.com/desktop/features/wsl/)
- [Dockerfile](https://docs.docker.com/get-started/docker-concepts/building-images/writing-a-dockerfile/)
- [Docker 이미지 빌드](https://docs.docker.com/get-started/docker-concepts/building-images/build-tag-and-publish-an-image/)
- [포트 매핑](https://docs.docker.com/get-started/docker-concepts/running-containers/publishing-ports/)
- [바인드 마운트](https://docs.docker.com/engine/storage/bind-mounts/)
- [볼륨](https://docs.docker.com/engine/storage/volumes/)
- [attach](https://docs.docker.com/reference/cli/docker/container/attach/)
- [exec](https://docs.docker.com/reference/cli/docker/container/exec/)

과제 기준은 같은 폴더의 `E1-1_개발자용_작업실_꾸미기.txt`와 홈페이지에서 보존한 HTML입니다. 교재의 폴더명·포트·콘텐츠는 학습용 선택이며, 필수 요구사항을 충족한다면 본인 구성으로 바꿀 수 있습니다.
