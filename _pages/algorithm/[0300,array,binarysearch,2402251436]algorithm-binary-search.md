---
title: "[Array] 이진 탐색"
description: "Array가 오름차순으로 정렬되어 있을 때, O(log n) 시간복잡도로 신속히 값을 검색하는 알고리즘"
updated: "2024-02-24"
---

## 이진 탐색

Array 안의 특정값 검색 알고리즘으로, [나무위키](https://namu.wiki/w/%EC%9D%B4%EC%A7%84%20%ED%83%90%EC%83%89)에 있는 그림과 설명을 보면 어떤 원리인지 쉽게 이해가 된다. 사전에서 어떤 단어를 찾아보는 원리와 유사하다.

반드시 **Array 안의 요소들이 오름차순으로 정렬**되어 있어야 알고리즘이 의미가 있다.

## 알고리즘 구현

원리는 간단한데, 실제로 구현하려면 다소 까다로울 수 있다. 아래와 같이 구현하면 된다.

- pseudo
```pseudo
# 탐색범위를 i 이상, j 미만으로 상정하고, 초기값으로 i 는 0, j 는 Array 길이를 대입
# 길이가 10인 Array 라면 아래와 같은 형태가 되며, 탐색범위 정의에 따라 전체 Array 를 탐색범위로 상정됨

i                                       j             
|                                       |
Ṿ                                       Ṿ
a0, a1, a2, a3, a4, a5, a6, a7 ,a8, a9      <-- 요소들은 오름차순

# 중간위치를 i + (j - i) / 2 로 계산 (결과의 정수값만 취함)
# Array[m] 값과 탐색값 t 를 비교
# Array[m] < t 라면 m 위치 왼쪽값은 모두 버려도 되므로, i = m + 1
# 아니라면 m 위치 오른쪽값은 모두 버려도 되므로, j = m
# j < i 인 경우, 다시 반복 계산...
```

왼쪽값을 버리는 것이 `i = m + 1`, 오른쪽값 버리는 것이 `j = m` 인 이유는, 탐색범위의 기준이 `i` 이상, `j` 미만이기 때문이다.

그리고, `j < i` 인 경우에 계속 반복적으로 위 알고리즘을 적용하면, 반드시 `i == j` 이 되는 때가 온다.

이 때의 `i` 또는 `j` 가 찾고자 하는 탐색값이 위치한 곳이 되며, 만일 탐색값이 없다면 Array 안에 애초에 찾고자 하는 탐색값이 처음부터 없었다는 의미이다.

## LeetCode - Search Insert Position 문제

LeetCode의 [35. Search Insert Position](https://leetcode.com/problems/search-insert-position/description/) 문제는 오름차순으로 이미 정렬이 되어 있는 `nums` Array가 주어졌을 때, 오름차순을 해치지 않으면서 어떤 특정값 `target`이 들어가야할 위치를 찾는 문제다. 

이진 탐색 코드 자체를 구현하는 것만으로도 풀 수 있다. `i == j` 지점이 바로 그 위치이기 때문이다.

- python
```python
def searchInsert(self, nums: List[int], target: int) -> int:
    i, j = 0, len(nums)

    while i < j:
        m = i + (j - i) // 2
        (i := m + 1) if nums[m] < target else (j := m)
    
    return i
```

while 구문으로 `i < j` 일 때만 순회한다.

중간위치 `m` 을 계산하고, 중간위치에 있는 중간값 `nums[m]`과 `target`을 비교한 뒤, 언급한 바와 같이 탐색범위를 조정한다.
