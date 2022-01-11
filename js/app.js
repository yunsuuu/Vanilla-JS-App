let date = new Date();

// 달이 바뀔 때마다 아래 기능들을 반복(함수로 만들어 쉽게 호출)
function handleCalendar(){
    const Y = date.getFullYear();
    const M = date.getMonth();

    document.querySelector('#getYM').innerHTML = `${Y}년 ${M+1}월`;

    const prevLast = new Date(Y, M, 0);
    const thisLast = new Date(Y, M + 1, 0);

    // 지난달 마지막 날짜&요일
    const PLDate = prevLast.getDate();
    const PLDay = prevLast.getDay();

    // 이번달 마지막 날짜&요일
    const TLDate = thisLast.getDate();
    const TLDay = thisLast.getDay();

    // 전체 달력에 필요한 날짜
    const prevDates = []; // 지난달 날짜를 담는 배열
    const thisDates = [...Array(TLDate + 1).keys()].slice(1); // 전개구문으로 배열을 펼침
    const nextDates = []; // 다음달 날짜를 담는 배열

    // 단순 반복문으로 prevDates / nextDates 채우기
    if(PLDay !== 6){
        for (let i = 0; i <= PLDay; i++){ // 지난달 마지막 요일이 될 때까지 반복
            prevDates.unshift(PLDate - i);
        }
    }
        for (let i = 1; i < 7 - TLDay; i++){ // 다음달 초반 날짜를 표현
            nextDates.push(i);
        }

    // prevDates / thisDates / nextDates 를 HTML에 그려내기
    const dates = prevDates.concat(thisDates, nextDates);

    // 이번달 첫번째 날짜와 마지막 날짜를 알아내 지난달, 다음달 날짜에 투명도 주기
    const firstDateIndex = dates.indexOf(1);
    const lastDateIndex = dates.lastIndexOf(TLDate);

    dates.forEach((date, i) => { // forEach문 인자(i번째 요소: date)
        const condition = i >= firstDateIndex && i < lastDateIndex + 1
        // 이번달 날짜를 의미(i가 첫번째 날짜(1)보다 크거나 같고 마지막 날짜+1 보다 작으면)
                          ? 'this'
                          : 'other';

        dates[i] = `<div class="date"><span class="${condition}">${date}</span></div>`;
    })

    document.querySelector('#dates').innerHTML = dates.join('');

    // 오늘 날짜 표시
    const today = new Date();     // 날짜는 매일 달라지기 때문에 new Date() 객체 새롭게 생성
    
    if(M === today.getMonth() && Y === today.getFullYear()){
        for(let date of document.querySelectorAll('.this')){
            if(+date.innerText === today.getDate()){ 
                date.classList.add('today');
                break; // 반복문 종료 (오늘 날짜는 하나뿐이기 때문에 찾으면 더 이상의 반복은 필요 없음)
            }
        }
    } 
}

 // HTML에 달력을 그려주는 함수
handleCalendar();

// 버튼클릭이벤트 - 지난달, 다음달, 오늘로 이동
const prevBtn = document.querySelector(".prev");
const nextBtn = document.querySelector(".next");
const todayBtn = document.querySelector(".today");

function preMonth(){
    date.setDate(1);
    date.setMonth(date.getMonth() -1); // 이번달에서 하나 뺀 값(지난달)
    handleCalendar();
}

function nextMonth(){
    date.setDate(1);
    date.setMonth(date.getMonth() +1); // 이번달에서 하나 더한 값(다음달)
    handleCalendar();
}

function goToday(){
    date = new Date();
    // date 값을 재할당해줘야 해서, 가장 첫줄에 있는 date 변수를 const가 아닌 let으로 수정
    handleCalendar();
}

prevBtn.addEventListener("click", preMonth);
nextBtn.addEventListener("click", nextMonth);
todayBtn.addEventListener("click", goToday);