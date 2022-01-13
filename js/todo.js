const toDoInput = document.querySelector(".todo-input");
const toDoList = document.querySelector(".todo-list"); // ul
const completeAllBtn = document.querySelector(".complete-all-btn"); // 전체완료버튼
const leftItems = document.querySelector(".left-items");
const showAllBtn = document.querySelector(".show-all-btn");
const showActiveBtn = document.querySelector(".show-active-btn");
const showCompletedBtn = document.querySelector(".show-completed-btn");
const clearCompletedBtn = document.querySelector(".clear-completed-btn");

let todos = []; // 할 일 item 담는 배열
let id = 0; // 각각의 할 일들을 유니크하게 구별할 수 있는 키값 설정 (i++로 구분)

// 기존 todos 배열을 새로운 배열로 변경하는 함수
function setTodos(newTodos){
    todos = newTodos; 
}

// todos 배열을 불러오는 함수
function getAllTodos(){
    return todos; // setTodos 함수로 인해 변경된 새로운 배열 불러오기
}

// todos 배열 체크 여부
let isAllCompleted = false; 

function setIsAllCompleted(bool){ // bool = boolean 약자
    isAllCompleted = bool;
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

// 현재 완료되지 않은 할 일 리스트 반환하는 함수
function getActiveTodos(){
    return todos.filter(item => item.isCompleted === false);
}

// 남은 item 배열을 그려주는 함수
function setLeftItems(){
    const leftTodos = getActiveTodos();
    leftItems.innerHTML = `${leftTodos.length} items left!`
}

// 완료된 할 일 리스트 반환하는 함수
function getCompletedTodos(){
    return todos.filter(item => item.isCompleted === true); 
}

// item 직접 클릭해서 전체완료로 만드는 경우
// 현재 todos 배열의 길이, 완료된 todos 배열의 길이 비교 -> isAllCompleted 상태 변경
function checkIsAllCompleted(){
    if(getAllTodos().length === getCompletedTodos().length){ // item이 모두 완료상태일 때
        setIsAllCompleted(true); // = isAllCompleted(true)
        completeAllBtn.classList.add('checked');
    } else {
        setIsAllCompleted(false); // = isAllCompleted(false)
        completeAllBtn.classList.remove('checked');
    }
}

// 전체완료버튼 클릭으로 item을 한번에 전체완료로 만드는 경우
function onClickCompleteAll(){
    if(!getAllTodos().length) return; // todos 배열의 길이가 0이면(없다면) return

    // isAllCompleted 기본값 false
    if(isAllCompleted) incompleteAll(); // isAllCompleted = true -> todos 전체 미완료
    else completeAll(); // isAllCompleted = false -> todos 전체 완료

    setIsAllCompleted(!isAllCompleted); // !isAllCompleted(!false) = true ?  / isAllCompleted = !isAllCompleted; ?
    setLeftItems(); // 남은 할 일 개수 그려줌
    paintTodos(); // 새로운 todos를 렌더링
}

// todos 배열에 할 일을 추가하는 함수
function appendTodos(text){ 
    const newId = id++; // +1씩
    const newTodos = getAllTodos().concat({id: newId, isCompleted: false, content: text});
    // 새로운 할 일의 타입
    setTodos(newTodos);
    checkIsAllCompleted(); // 배열이 하나 추가되면 if 조건문 성립X
    setLeftItems();
    paintTodos();
}

// X버튼 클릭시 실행되는 함수
function deleteTodo(todoId){
    const newTodos = getAllTodos().filter(item => item.id !== todoId);
    setTodos(newTodos);
    setLeftItems();
    paintTodos();
}

// 완료체크박스 클릭시 실행되는 함수
function completeTodo(todoId){
    const newTodos = getAllTodos().map(item => item.id === todoId ? ({...item, isCompleted: !item.isCompleted}) : item);
    // isCompleted값이 true면 false / false면 true로 toggle 처리
    setTodos(newTodos);
    setLeftItems();
    paintTodos();
    checkIsAllCompleted(); // 전체 todos의 완료 상태를 파악하여 전체 완료 처리 버튼 css 반영
}

// input창 더블클릭시 실행되는 함수(input 입력값 수정)
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

// all, active, completed 버튼 클릭시 실행되는 함수
// 클릭된 todos의 타입에 따라 투두리스트를 보여줌
let currentShowType = 'all'; // all, active, complete

function setCurrentShowType(newShowType){
    currentShowType = newShowType;
}

function onClickShowTodosType(e){
    const currentBtn = e.target;
    const newShowType = currentBtn.dataset.type; // all, active, completed
    // dataset = 데이터속성을 사용해 type을 가지고 옴

    if(currentShowType === newShowType) return;

    const preBtn = document.querySelector(`.show-${currentShowType}-btn`);
    preBtn.classList.remove('selected');

    currentBtn.classList.add('selected'); // 새롭게 이벤트가 발생한 곳
    setCurrentShowType(newShowType);
    paintTodos();
}

function onClickClearTodos(){
    const newTodos = getActiveTodos(); // 완료되지 않은 item 배열
    setTodos(newTodos); // 새로 바뀐 item 배열을 setTodos에 넘겨주기
    paintTodos();
}

// currentShowType에 따라 할 일 배열을 렌더링 하는 함수
function paintTodos(){
    toDoList.innerHTML = null; // todo-list(ul) 요소 초기화

    switch(currentShowType){
        case 'all':
            const allTodos = getAllTodos();
            allTodos.forEach(item => { paintTodo(item); });
            break;
        case 'active':
            const activeTodos = getActiveTodos();
            activeTodos.forEach(item => { paintTodo(item); });
            break;
        case 'completed':
            const completedTodos = getCompletedTodos();
            completedTodos.forEach(item => { paintTodo(item); });
            break;
        default:
            break;
    }
}

// 각각의 할 일(item)이 그려지는 함수
function paintTodo(item){
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

    if(item.isCompleted){ // item.isCompleted = true 라면
        toDoItem.classList.add('checked');
        checkBox.innerText = '✔';
    }

    toDoItem.appendChild(checkBox);
    toDoItem.appendChild(toDo);
    toDoItem.appendChild(delBtn);

    toDoList.appendChild(toDoItem);
}

// 앱 실행시 처음 실행되는 함수
function init(){
    toDoInput.addEventListener("keypress", (e) => {
        if(e.key === "Enter"){ // 'Enter' 키가 눌리면
            appendTodos(e.target.value); toDoInput.value="";
        }
    })

    showAllBtn.addEventListener("click", onClickShowTodosType);
    showActiveBtn.addEventListener("click", onClickShowTodosType);
    showCompletedBtn.addEventListener("click", onClickShowTodosType);
    clearCompletedBtn.addEventListener("click", onClickClearTodos);

    completeAllBtn.addEventListener("click", onClickCompleteAll);
    setLeftItems();
}

init();