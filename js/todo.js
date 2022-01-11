const toDoInput = document.querySelector(".todo-input");
const toDoList = document.querySelector(".todo-list");

let todos = []; // 할 일들을 담을 배열
let id = 0; // 각각의 할 일들을 유니크하게 구별할 수 있는 키값 설정

// 할 일 추가하기
function setTodos(newTodos){
    todos = newTodos; // 기존 todos 배열을 새로운 배열로 변경
}

function getAllTodos(){
    return todos; // 기존 todos
}

function appendTodos(text){ // todos 배열에 할 일을 추가하는 함수
    const newId = id++; // 새롭게 저장되는 할일의 id값, ++ 연산자를 통해 1씩 증가시킴으로써 id값이 중복되지 않도록
    const newTodos = getAllTodos().concat({id:newId, isCompleted: false, content: text});
    // newTodos는 새롭게 저장될 todos 배열
    // 이전 todos와 새로운 todos를 합쳐서 newTodos에 저장
    setTodos(newTodos);
    paintTodos();
}

function paintTodos(){
    toDoList.innerHTML = null; // todo-list(ul) 요소 안의 HTML 초기화
    const allTodos = getAllTodos(); // todos 배열 가져오기

    allTodos.forEach(item => { 
        // todos 배열을 반복하면서 각각의 item에 아래 코드 실행
        const toDoItem = document.createElement("li");
        toDoItem.classList.add('todo-item');

        const checkBox = document.createElement("div");
        checkBox.classList.add('checkbox');

        const toDo = document.createElement("div");
        toDo.classList.add('todo');
        toDo.innerText = item.content;

        const delBtn = document.createElement("button");
        delBtn.classList.add('delBtn');
        delBtn.innerHTML = 'X';

        if(item.isChecked){
            toDoItem.classList.add('checked');
            checkBox.innerText = '✔';
        }

        toDoItem.appendChild(checkBox);
        toDoItem.appendChild(toDo);
        toDoItem.appendChild(delBtn);

        toDoList.appendChild(toDoItem);
    })
}

function init(){
    toDoInput.addEventListener("keypress", function(e){
        if( e.key === "Enter"){
            appendTodos(e.target.value); toDoInput.value="";
        }
    })
}

init();