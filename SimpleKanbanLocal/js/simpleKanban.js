var kanbanTasks = localStorage.getItem('storedKanbanTasks');
const nKanban = 3;

if (!kanbanTasks)
    kanbanTasks = "[]";

var tasks = JSON.parse(kanbanTasks);

function saveData()
{
    localStorage.setItem('storedKanbanTasks', JSON.stringify(tasks));
}

function addTaskToHtml(newTask){
 
    let newTaskElm = document.createElement("button");
    newTaskElm.innerHTML = newTask.name;
    newTaskElm.classList.add("taskAsBt");

    newTaskElm.classList.add("inSLine"+newTask.sLine);

    newTaskElm.setAttribute("type","button");

    newTaskElm.addEventListener("click",
        () => {
            if (newTask.sLine == nKanban)
               return;
            let prev = newTask.sLine;
            newTask.sLine++;
            saveData();
            newTaskElm.classList.replace("inSLine"+prev, "inSLine"+newTask.sLine);
            document.getElementById("taskline"+prev).removeChild(newTaskElm);
            document.getElementById("taskline"+newTask.sLine).appendChild(newTaskElm);
        }
    );
    document.getElementById("taskline"+newTask.sLine).appendChild(newTaskElm);
    
}

function reloadTasks()
{
    for (let i = 1; i <= 3; ++i)
        document.getElementById("taskline"+i).innerHTML = "";
    tasks.forEach((t)=>addTaskToHtml(t));
}

reloadTasks();

document.getElementById("btAddTask").addEventListener("click",
    () => {
        let newTask = {};
        newTask.name = document.getElementById("inNewTask").value.trim();
        if (newTask.name == "")
            return;

        let un = 1;
        for (let tt of tasks) {
            if (tt.id == un)
                un++;
        }
        newTask.id = un;
        newTask.sLine = 1;

        tasks.push(newTask);
        saveData();
        addTaskToHtml(newTask);
        document.getElementById("inNewTask").value.trim();
    }
);

document.getElementById("btRemCmpl").addEventListener("click",
    () => {
        tasks = tasks.filter((task) => {return +task.sLine != nKanban});
        saveData();
        let completedTasks = document.getElementsByClassName("inSLine"+nKanban);
        while (completedTasks.length > 0)
            completedTasks[0].parentNode.removeChild(completedTasks[0]);
    }
);
