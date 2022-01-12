const toDoInput = document.querySelector(".todo-input");
const toDoList = document.querySelector(".todo-list");
const completeAllBtn = document.querySelector(".complete-all-btn");
const leftItems = document.querySelector(".left-items");

let todos = []; // 할 일들을 담을 배열
let id = 0; // 각각의 할 일들을 유니크하게 구별할 수 있는 키값 설정

// 할 일 추가하기
function setTodos(newTodos){
    todos = newTodos; // 기존 todos 배열을 새로운 배열로 변경
}

// todos 배열을 불러오는 함수
function getAllTodos(){
    return todos; // setTodos 함수로 인해 변경된 새로운 배열 불러오기
}

// 전체 todos 체크 여부 (기본값 false)
let isAllCompleted = false; 

function setIsAllCompleted(bool){ // bool = boolean
    isAllCompleted = bool;
    // isAllCompleted = !isAllCompleted;
}

function completeAll(){
    completeAllBtn.classList.add('checked');
    const newTodos = getAllTodos().map(item => ({...item, isCompleted: true}));
    setTodos(newTodos);
}

function incompleteAll(){
    completeAllBtn.classList.remove('checked');
    const newTodos = getAllTodos().map(item => ({...item, isCompleted: false}));
    setTodos(newTodos);
}

function getCompletedTodos(){
    return todos.filter(item => item.isCompleted === true); 
    // 완료된 아이템이 걸러져 나옴
}

// item 직접 클릭해서 전체완료로 만드는 경우
// 현재 todos 배열의 길이, 완료된 todos 배열의 길이 비교 -> isAllCompleted 상태 변경
function checkIsAllCompleted(){
    if(getAllTodos().length === getCompletedTodos().length){ // item이 모두 완료상태일 때
        setIsAllCompleted(true); // isAllCompleted 상태 변경
        completeAllBtn.classList.add('checked');
    } else {
        setIsAllCompleted(false); // isAllCompleted 상태 변경
        completeAllBtn.classList.remove('checked');
    }
}

// 현재 todos의 완료 상태 여부 파악, 전체완료처리를 하는 함수
function onClickCompleteAll(){
    if(!getAllTodos().length) return; // todos 배열의 길이가 0이면(없다면) return

    // isAllCompleted 기본값 false
    if(isAllCompleted) incompleteAll(); // isAllCompleted가 true -> incompleteAll(); 실행
    else completeAll(); // isAllCompleted가 false -> completeAll(); 실행
    setIsAllCompleted(!isAllCompleted); // isAllCompleted 토글
    paintTodos(); // 새로운 todos를 렌더링
}

// 현재 완료되지 않은 할 일 리스트를 반환하는 함수
function getActiveTodos(){
    return todos.filter(item => item.isCompleted === false);
}

function setLeftItems(){
    const leftTodos = getActiveTodos();
    leftItems.innerHTML = `${leftTodos.length} items left!`;
}

// todos 배열에 할 일을 추가하는 함수
function appendTodos(text){ 
    const newId = id++;
    const newTodos = getAllTodos().concat({id: newId, isCompleted: false, content: text}); 
    // 새로운 할 일의 타입
    setTodos(newTodos);
    checkIsAllCompleted(); // 배열이 하나 추가되면 if 조건문 성립X
    paintTodos();
}

function deleteTodo(todoId){
    const newTodos = getAllTodos().filter(item => item.id !== todoId);
    setTodos(newTodos);
    paintTodos();
}

function completeTodo(todoId){
    const newTodos = getAllTodos().map(item => item.id === todoId ? ({...item, isCompleted: !item.isCompleted}) : item);
    // isCompleted값이 true면 false / false면 true로 toggle 처리
    setTodos(newTodos);
    paintTodos();
    checkIsAllCompleted(); // 전체 todos의 완료 상태를 파악하여 전체 완료 처리 버튼 css 반영
}

// 새로운 input 내용 수정하는 함수
function updateTodo(text, todoId){
    const newTodos = getAllTodos().map(item => item.id === todoId ? ({...item, content: text}) : item);
    setTodos(newTodos);
    paintTodos();
}

// 새로운 input 요소를 생성, 수정 가능하게 하는 함수
function onDbclickTodo(e, todoId){
    // 두 개의 파라미터를 입력 받음(event객체 / 할 일의 id)
    const todoElem = e.target; // 이벤트가 발생한 곳 (div)
    const inputText = e.target.innerText;
    const todoItemElem = todoElem.parentNode; // (li)
    // edit-input 클래스 지정으로 인해 기존 input이 가려짐(더블클릭시)
    const inputElem = document.createElement("input");
    inputElem.value = inputText;
    inputElem.classList.add('edit-input');

    inputElem.addEventListener("keypress", (e) => {
        if(e.key === 'Enter'){
            updateTodo(e.target.value, todoId);
            // 두 개의 파라미터를 입력 받음(수정될 할 일의 text / 수정될 할 일의 id)
            document.body.removeEventListener("click", onClickBody);
        }
    })

    // todoItem 요소를 제외한 영역 클릭시 수정모드 종료
    function onClickBody(e){
        if(e.target !== inputElem){ // input이 아닌 곳을 클릭한다면
            todoItemElem.removeChild(inputElem);
            document.body.removeEventListener("click", onClickBody);
        }
    }

    document.body.addEventListener("click", onClickBody);
    todoItemElem.appendChild(inputElem); // todoItemElem에 input을 자식으로 추가
}

// todos 배열을 HTML에 그려주는 함수
function paintTodos(){
    toDoList.innerHTML = null; // todo-list(ul) 요소 안의 HTML 초기화
    const allTodos = getAllTodos(); // todos 배열 가져오기

    allTodos.forEach(item => { 
        // todos 배열을 반복하면서 각각의 item에 아래 코드 적용
        const toDoItem = document.createElement("li");
        toDoItem.classList.add('todo-item');

        const checkBox = document.createElement("div");
        checkBox.classList.add('checkbox');
        checkBox.addEventListener("click", () => completeTodo(item.id));

        const toDo = document.createElement("div");
        toDo.classList.add('todo');
        toDo.innerText = item.content;
        toDo.addEventListener("dblclick", (event) => onDbclickTodo(event, item.id));

        const delBtn = document.createElement("button");
        delBtn.classList.add('delBtn');
        delBtn.innerHTML = 'X';
        delBtn.addEventListener("click", () => deleteTodo(item.id));

        if(item.isCompleted){
            toDoItem.classList.add('checked');
            checkBox.innerText = '✔';
        }

        toDoItem.appendChild(checkBox);
        toDoItem.appendChild(toDo); // li 안에 div
        toDoItem.appendChild(delBtn);

        toDoList.appendChild(toDoItem);
    })
}

// 프로그램을 시작할 때 처음 실행되는 함수(앱을 초기화)
function init(){
    toDoInput.addEventListener("keypress", (e) => {
        if(e.key === "Enter"){ // 'Enter' 키가 눌리면
            appendTodos(e.target.value); toDoInput.value="";
        }
    })
    completeAllBtn.addEventListener("click", onClickCompleteAll);
}

init();