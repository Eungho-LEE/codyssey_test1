# 학습 자료 모음

| 자료 | 목적 |
| --- | --- |
| [입력형 실습 교재 HTML](E1-1_Windows_따라하기.html) | 단계별 명령 해설, 완료 체크, 명령·출력·캡처 기록, HTML 저장·Markdown 내보내기 |
| [실습 교재 Markdown](E1-1_Windows_따라하기.md) | GitHub에서 읽거나 수정할 원본 |
| [핵심 개념 복습 HTML](복습_핵심개념과_명령어.html) | 파일·권한·Docker·포트·볼륨·Git 개념, 명령 예제, 복습 문제와 답 |
| [핵심 개념 복습 Markdown](복습_핵심개념과_명령어.md) | GitHub에서 읽기 좋은 복습 원본 |

HTML은 파일을 내려받아 브라우저로 열면 됩니다. GitHub 파일 화면에서는 HTML 소스가 표시될 수 있습니다. 교재에는 외부 서비스 전송 기능이 없으며, 입력형 교재의 기록은 브라우저 임시 저장과 다운로드한 HTML/JSON으로 보관합니다.

현재 프로젝트 경로는 `C:\Users\nabis\Desktop\Projects\codyssey\e1-1-workstation`입니다. Ubuntu에서는 `/mnt/c/Users/nabis/Desktop/Projects/codyssey/e1-1-workstation`을 사용합니다. 이전 경로·권한 기록은 실제 실습 당시의 증거로 유지합니다.

원본 Markdown에서 HTML을 다시 생성하려면 저장소 루트에서 Node.js로 실행합니다. HTML을 읽기만 할 때는 Node.js가 필요 없습니다.

```bash
node scripts/render-learning.cjs
node scripts/render-learning.cjs 복습_핵심개념과_명령어
```

학습 중 작성한 본인 기록과 제출용 검증 결과는 [저장소 README](../README.md) 및 `docs/records/`에서 확인합니다. 템플릿의 예시 출력과 실제 증거를 구분하세요.
