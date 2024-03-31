---
title: "나만의 PC 초기화 순서/방법"
description: "PC 포맷부터 이런저런 프로그램까지 설치 순서/방법들 기록, 계속 업데이트 예정"
updated: "2024-03-30"
---

## Windows 설치

사전 준비물: 8G 이상의 USB, 윈도우즈 정품 인증 키 

[레미쯔](https://remiz.co.kr/) 사이트에서 윈도우즈 iso 다운로드

다운로드 파일 안에서 추천하는 대로, [Ventoy](https://www.ventoy.net/en/index.html) 프로그램을 이용해서, 윈도우즈 설치 USB 제작

## WSL 설치

`WINDOWS + I` 키 --> "기능" 으로 검색 --> "Windows 기능 켜기/끄기" 클릭 --> Hyper-V, Linux용 Windows 하위 시스템 체크 --> 확인 클릭 --> 재부팅

재부팅 후 --> `WINDOWS` 키 --> "cmd" 로 검색 --> "명령 프롬프트"를 **관리자 권한으로 실행** 클릭

활성화된 cmd 창 클릭 --> 아래 명령어를 위부터 순서대로 입력하여 설치

- 명령 프롬프트
```powershell
wsl --install
wsl --update
```

아래 명령어들로 리눅스 배포판을 확인하고, `<Distro>` 란에 설치 원하는 배포한 입력하여 설치 진행

- 명령 프롬프트
```powershell
wsl --list --online
wsl --install <Distro>
```

[VSCode](https://code.visualstudio.com/Download) 다운로드 후 설치

왼쪽 메뉴아이콘에서 확장팩(Extensions) 선택 후, "WSL" 검색 --> 설치

좌하단의 >< 모양의 "원격" 버튼 클릭하여 WSL 접속

## Ubuntu 프로그램 설치

VSCode `CTRL + \`` 키 --> 아래 명령어 실행 (선택을 묻는 질문이 나올때마다 y/yes 선택)

- bash
```bash
sudo apt update
sudo apt upgrade
```

git 설치

- bash
```bash
sudo apt install git
```

git 초기화, `<username>` 과 `<useremail>` 에는 본인의 이름과 이메일 입력 (이름과 이메일을 쌍따옴표로 둘러싸고 입력)

- bash
```bash
git config --global user.name "<username>"
git config --global user.email "<useremail>"
```

맘바포지 설치를 위해, 설치파일을 다운받고자 하는 폴더 생성 --> 해당 폴더로 이동

[맘바포지](https://github.com/conda-forge/miniforge/releases) 사이트 방문, 설치파일 인터넷 링크 복사 --> 아래 명령어의 `<인터넷경로>`에 복사한 링크 붙여넣고 실행

- bash
```bash
wget <인터넷경로>
```

다운로드 된 파일을 ls 명령어로 확인 --> `<파일>` 부분에 다운로드 파일명을 입력(대소문자 구분)하고 실행 (선택을 묻는 질문 나올때마다 y/yes 선택)

- bash
```bash
bash <파일>
source ~/.bashrc
```

터미널 화면 프롬프트에 `(base)` 표시가 되면 완료

mamba 명령어는 conda 와 매우 유사, 포털에서 원하는 기능을 conda 로 실행하는 방법을 검색해도 OK