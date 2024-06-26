---
layout: page
title: 동적 계획법(Dynamic Programming) - 개요
description: 수학의 점화식 풀이와 유사한 동적 계획법 알고리즘 및 Iterative 방식의 DP 구현 코드 소개
updated: 2024-06-14
---

## 동적 계획법

[나무위키](https://namu.wiki/w/%EB%8F%99%EC%A0%81%20%EA%B3%84%ED%9A%8D%EB%B2%95)나 다른 곳에서 개념을 찾아봐도 너무 추상적이라 이해가 잘 되지 않는다. 영문으로는 DP(Dynamic Programming)인데 이를 왜 동적 계획법이라고 번역하는지도 모르겠다.

그냥 고등학교 수학시간에 배웠던 [점화식](https://ko.wikipedia.org/wiki/%EC%A0%90%ED%99%94%EC%8B%9D) 사상을 코드로 옮긴 것이 DP다라고 하는 것이 더 확 와닿는 것 같다.

점화식은 수열의 첫째항을 나타내는 "초기값"과, 앞선 수열과 뒤에 위치한 수열간의 관계식을 나타내는 "일반항"으로 구성되며, 이들을 통해 N 번째 수열의 값을 추적한다. DP는 이 방식으로 구현된 알고리즘이다.

## 프로그래머스: 멀리뛰기

[https://school.programmers.co.kr/learn/courses/30/lessons/12914](https://school.programmers.co.kr/learn/courses/30/lessons/12914)

멀리뛰기를 한칸 또는 두칸을 뛸 수 있을때, N칸을 멀리뛸 수 있는 가짓수를 찾는 문제다. DP로 풀 수 있으며, [피보나치 수열](https://namu.wiki/w/%ED%94%BC%EB%B3%B4%EB%82%98%EC%B9%98%20%EC%88%98%EC%97%B4)값을 찾는 방법과 매우 닮았다.

초기값과 일반항은 아래와 같다.

- pseudo
```pseudo
# N칸을 멀리뛰기 할 수 있는 가짓수를 f(N)이라 할 때, 초기값과 일반항
초기값: f(1) = 1, f(2) = 2
일반항: f(N) = f(N-2) + f(N-1)
```

아래는 초기값과 일반항을 그대로 사용하여 iterative DP 방식으로 푼 코드다.

- python
```py
def solution(n):
    a = [None, 1, 2] + [0]*(n-2)
    
    for i in range(3, n+1):
        a[i] = a[i-2] + a[i-1]
    
    return a[n] % 1234567
```

초기값과 함께 충분한 공간이 준비된 a 리스트을 상정한 뒤, for 반복문으로 일반항 값들을 계산하여 배열에 담아낸다.

문제를 보면 n 이 최대 2,000까지 될 수 있는데, 이 경우 무지무지하게 큰 값이 나오게 되는데, 보통 python 은 매우 큰 정수도 별도 타입이나 클래스 인스턴스를 생성하지 않아도 사용할 수 있다.

위 코드를 좀 더 효율화 할 수 있다.

우선, 문제에서 요구하는 것은 n칸 멀리뛰기 가짓수만이므로, n까지의 모든 가짓수를 모아놓은 a 배열을 만들 필요는 없다. 단순 변수 a, b 만을 사용하면 된다.

다음으로, 나머지를 구하는 % 연산자의 특성을 활용하면 너무 큰 수 생성에 따른 메모리나 퍼포먼스 부담을 줄일 수 있다. % 연산은 아래와 같은 공식이 성립한다.

- note
```text
(A + B) % x = ((A % x) + (B % x)) % x
```

아래는 개선 코드다.

- python
```py
def solution(n):
    if n < 3:
        return n
    
    a, b = 1, 2
    
    for _ in range(3, n+1):
        a, b = b % 1234567, (a+b) % 1234567
        
    return b
```

## 프로그래머스: 땅따먹기

[https://school.programmers.co.kr/learn/courses/30/lessons/12913](https://school.programmers.co.kr/learn/courses/30/lessons/12913)

4개의 열로 점수가 써진 땅이 있을 때, 1행부터 땅을 밟아서 숫자들을 모두 더했을 때 가장 큰 값을 찾는 문제다. 단, 다음행으로 내려갈 때 같은 열은 선택할 수 없다는 제약이 있다.

DP로 풀려면 초기값과 일반항을 알아야 하는데 아래와 같다.

- pseudo
```pseudo
# land N번째 각 열(인덱스) 점수 합계를 모은 배열을 a[N]이라 할 때,

초기값: a[0] = land[0]
일반항: a[N] = [
                  land[N][0] + max(a[N-1][1], a[N-1][2], a[N-1][3]),
                  land[N][1] + max(a[N-1][0], a[N-1][2], a[N-1][3]),
                  land[N][2] + max(a[N-1][0], a[N-1][1], a[N-1][3]),
                  land[N][3] + max(a[N-1][0], a[N-1][1], a[N-1][2]),
               ]  
```

코드 구현은 아래와 같다.

- python
```py
def solution(land):
    a = land[0]
    
    for x in land[1:]:
        a = (
            x[0] + max(a[1], a[2], a[3]),
            x[1] + max(a[0], a[2], a[3]),
            x[2] + max(a[0], a[1], a[3]),
            x[3] + max(a[0], a[1], a[2]),
        )
    
    return max(a)
```

문제에서는 제일 마지막의 최대값만 리턴하도록 요구하므로, a 배열 누적을 굳이 쌓을필요는 없기에, for 문 안에서 계속 a 변수가 갱신되도록 했다.
