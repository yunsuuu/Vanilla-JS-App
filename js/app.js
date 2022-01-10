const date = new Date();
console.log(date);

const Y = date.getFullYear();
const M = date.getMonth();

document.querySelector('#getYM').innerHTML = `${Y}년 ${M+1}월`;

// new Date() -> 파라미터 date(마지막 인자)에 0을 전달하면 지난달 마지막 날짜 생성
// 이번달 마지막 날짜 = 다음달에 0을 전달하면 됨
const prevLast = new Date(Y, M, 0);
const thisLast = new Date(Y, M + 1, 0);

// 지난달 마지막 날짜&요일
const PLDate = prevLast.getDate();
const PLDay = prevLast.getDay();

// 이번달 마지막 날짜&요일
const TLDate = thisLast.getDate();
const TLDay = thisLast.getDay();

// 전체 달력에 필요한 날짜
const prevDates = []; // 초기값은 일단 빈 배열
const thisDates = [...Array(TLDate + 1).keys()].slice(1);
// ...Array = 전개구문 (객체 혹은 배열들을 펼침)
//Array(n)으로 배열을 만들면 길이가 n인 배열 생성 (이때 모든 요소들은 undefined)
// 모든 요소들이 empty 값이기 때문에 key() 메서드를 활용하면 0 ~ n-1까지의 Array Iterator 얻을 수 있음
// 0 ~ n-1까지 얻어내기 때문에 이번달 마지막 날짜 +1을 n에 전달
// key 메서드 가장 앞에 있는 0을 없애기 위해 slice 메서드 활용
const nextDates = []; // 초기값은 일단 빈 배열

// 단순 반복문으로 prevDates / nextDates 채우기
if(PLDay !== 6){ // 지난달 마지막 요일이 토요일(6)이 아니라면
    for (let i = 0; i < PLDay + 1; i++){ // 지난달 마지막 요일이 될 때까지 반복
        prevDates.unshift(PLDate - i); // 지난달의 마지막 날짜로부터 1씩 줄어든 값을 unshift 메서드를 통해 prevDates 배열 앞쪽으로 계속 채워넣음
    }
}
    for (let i = 1; i < 7 - TLDay; i++){ // 다음달 초반 날짜를 표현
        nextDates.push(i); // 이번달 마지막 날짜의 요일을 기준으로 필요한 개수를 파악해서 1부터 1씩 증가시키며 nextDates 배열에 하나씩 채워넣음
    }


// prevDates / thisDates / nextDates 를 HTML에 그려내기
const dates = prevDates.concat(thisDates, nextDates);

dates.forEach((date, i) => { // for Each문 인자(i번째 요소: date)
    dates[i] = `<div id="dates">${date}</div>`
})

document.querySelector('#dates').innerHTML = dates.join('');
