const connector = new Connector("3z3dMzegoTQnOHPP1BJsTgfh7G1Q937LgjIkZAwe", "m6iMXGpSdiXFlc0LIOsN534SE84HmerkSa8Ptlia");

function setupConnector()
{
    connector.setUrl("https://parseapi.back4app.com/classes/Tasks/");
}

function formatTask(task)
{
    return ""+ task.name;
}

function getAllHandler(data)
{
    JSON.parse(data).results.forEach(t => addToHtml(t));
}

function getOneHandler(data)
{
    addToHtml(JSON.parse(data));
}

function reloadTasks()
{
    document.getElementById("frmTasks").innerHTML = "";
    connector.getData(getAllHandler);
}

function handleInsertedTask(data)
{
    let parsedData = JSON.parse(data);
    connector.getOneObject(parsedData.objectId, getOneHandler);
}

function addToHtml(task){
    let taskButton = document.createElement("button");
    taskButton.innerHTML = formatTask(task);

    taskButton.classList.add("taskAsBt");
    taskButton.setAttribute("type", "button");
    taskButton.setAttribute("objectId", task.objectId);

    if (!task.isDone)
        taskButton.classList.add("activeTask");
    else
        taskButton.classList.add("completedTask");

    // ISDONE CLICK
    taskButton.addEventListener("click", ()=>{
        task.isDone = !task.isDone;
        if (task.isDone)
            taskButton.classList.replace("activeTask", "completedTask");
        else
            taskButton.classList.replace("completedTask", "activeTask");
        connector.updateData(task.objectId, {isDone: task.isDone});
    });

    document.getElementById("frmTasks").appendChild(taskButton);
}

function addListeners() {
    document.getElementById("btAddTask").addEventListener("click",
        () => {
            let t = {};
            t.name = document.getElementById("inNewTask").value.trim();
            if (t.name == "")
                return;
            t.isDone = false;   
            connector.addData(t, handleInsertedTask);
            document.getElementById("inNewTask").value = "";
        }
    );

    document.getElementById("btRemCmpl").addEventListener("click",
        () => {
            let list = document.getElementsByClassName("completedTask");
            while (list.length) {
                    connector.removeData(list[0].getAttribute("objectId"));  
                    list[0].parentNode.removeChild(list[0]);
            }
        }
    );
}

window.onload = () => {
    addListeners();
    setupConnector();
    reloadTasks();
}
