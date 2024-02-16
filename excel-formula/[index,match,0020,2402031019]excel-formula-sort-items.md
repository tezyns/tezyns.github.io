---
title: "INDEX,MATCH: 데이터 항목들을 정렬하여 재나열하는 함수식"
description: 세로로 나열되어있는 데이터 항목들을 오름차순 (또는 내림차순) 으로 정렬하여 다시 재나열해주는 함수식
updated: 2021-08-16
---

## 데이터 항목 정렬 함수식 의미

함수식으로 데이터 항목들을 정렬한다는 것은, 원본 데이터 항목들이 변경되었을 때, 함수식 결과도 알아서 바뀐다는 것이다. 즉, 수동으로 정렬할 필요가 없다는 이점이 있다.

## 정렬 함수식

<!--#region-->
![그림00](data:image/png;base64,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)

<!--#endregion-->

- excel
```excel
{= INDEX( 원본목록, MATCH( SMALL( COUNTIFS( 원본목록, "<"&원본목록 ), ROW(원본목록첫째항목상대참조) - ROW(원본목록첫째항목절대참조) + 1 ), COUNTIFS( 원본목록, "<"&원본목록 ), 0 ))}
```

**배열수식**으로 입력을 해야 정상작동 한다. 정렬된 항목들이 나타나길 원하는 시작 셀에 위 수식을 배열수식으로 입력하고, 그 셀을 복사하여 아래로 계속 붙여가면 된다.

`원본목록`은 정렬하기 원하는 목록 원본으로 모두 5 군데 동일하게 지정하면 된다. 그리고 ROW 함수에는 `원본목록`의 첫번째 항목이 위치한 셀을 지정하되, 상대/절대참조 형태만 주의하면 된다. (이는 복사편의를 위한 것이다.)

위 수식에서 부등호 방향을 바꾸거나 SMALL 함수를 LARGE 함수로 바꾸면, 내림차순 정렬이 된다.

사용할 때 **아래 사항을 주의**해야 한다.

> 정렬을 하고자하는 `원본목록`에 Blank 가 있거나 텍스트와 숫자가 혼재되어 있으면 오작동한다.

## 함수식 이해

이해하기 난해한 함수식이다. 먼저 COUNTIFS 함수의 두번째 인수에 특정값이 아닌 범위가 들어가게 되면, 해당 범위 안에 있는 내용들의 만족여부를 모두 검사하여 다시 배열로 반환한다. 여기서는 범위안에 있는 각각의 내용들보다 작은 값 ('<' 기호가 사용되었으므로) 의 개수를 다시 배열로 만들어 반환하게 되는 셈이다.

그리고 `ROW - ROW + 1` 함수 형태는 순서대로 1, 2, 3, ... 과 같은 숫자를 반환한다. COUNTIFS 의 결과인 배열과 숫자 1, 2, 3, ... 을 SMALL 함수가 받는 형태이다. (이 부분이 정렬의 핵심이다.)

그리고는 최종적으로 INDEX, MATCH 함수 조합이 해당 순서에 맞는 항목을 가져온다.