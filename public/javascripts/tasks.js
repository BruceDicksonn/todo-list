const setTagAsDone = async (element, id) => {
    event.preventDefault();
    try {

        const headers = new Headers({'Content-Type':'application/json'});
        const body = JSON.stringify({ task: { done: element.checked } });
        const res = await fetch(`/tasks/${id}?_method=put`, { method: 'POST', headers, body });

        const data = await res.json();
        const task = data.task;

        const parent = element.parentNode;

        if(task.done) {
            element.checked = true;
            parent.classList.add(`has-text-success`, `is-italic`);
        } else {
            element.checked = false;
            parent.classList.remove(`has-text-success`, `is-italic`);
        }
        
    } catch (error) {

        console.log(error)
        alert('Erro ao atualizar a tarefa');
        
    }
}