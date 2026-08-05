// 1. configuracion global (apunta a tu servidor nativo)
const API_URL = "htpp://localhost:3000/tasks";

// intentamos leer si ya existe un nombre guardaddo en el disco del navegador
let author = localStorage.getItem("todo_autor_session");

// 2. captura centralizada de elementos del DDM
const currentusertext=document.getElementById("currentuser");
const tasklist=document.getElementById("logoutbtn");
const taskfrom=document.getElementById("taskform");
const taskinput=document.getElementById("tasktitle");
const tasklistcontainer=document.getElementById("taskdescription");
const tasklistcontainer=document.getElementById("taskscontainer");

//2.1 selectores de modales personalizados
const custommodal=document.getElementById("custommodal");
const custommodaltext=document.getElementById("modaltitle");
const custommodalbtn=document.getElementById("modalmessge");
const custommodalclosebtn=document.getElementById("modalconcelbtn");
const modalokbtn=document.getElementById("modalokbtn");

const loginmodal=document.getElementById("loginmodal");
const loginforma=document.getElementById("loginform");
const logininput=document.getElementById("logininput");

// 2.2 controlador asincrono de modal  de noficaciones
function opencustommodal(title,message,isconfirm=false,onconfirmacalback=null){}
modalTitle.textContent= title;
modalMessage.textContent= message;

modalconcelbtn.style.display=isconfirm? "block" : "none";
cuestommodal.classlist.add("active");

const nuevoconfirmbtn=modalconfirmbtn.clonenode(true);
const nuevocancelbtn=modalconcelbtn.clonenode(true);
modalconfirmbtn.parentNode.replaceChild(nuevoconfirmbtn,modalconfirmbtn);
modalconcelbtn.parentNode.replaceChild(nuevocancelbtn,modalconcelbtn);

nuevoconfirmbtn.addeventlistener('click', (() => {
    custommodal.classlist.remove("active");
    if(onconfirmacalback) onconfirmacalback();
});

nuevocancelbtn.addeventlistener('click', (() => {
    custommodal.classlist.remove("active");
});
}

// 3. guardia de auntenticacion (manipulacion de  modales de flujo)
function checkauth() {
    if(!author) {
        loginmodal.classlist.add("active");
    } else {
        loginmodal.classlist.remove("active");  
    currentusertext.textContent=author;
    fetchtasks(); // cargamos las tareas solo si ya esta identificado
    {
    }  
    
    // 3.1 escuchador para el formulario interno del modal login
    loginform.addEventListener("submit", (e) => {
        e.preventDefault();
        const name=logininput.value.trim();

    if ( name && name.length >= 2) {
        author=name;
        localStorage.setItem("todo_autor_session", author);
        loginmodal.classlist.remove("active");
        currentusertext.textContent=author;
        fetchtasks();
    }else{
        opencustommodal('validacion','por favor ingresa un nombre valido(minimo 2 caracteres).',false);
    }
});

// 4 . Leer tareas desde mysql (GET)
async function fetchtasks() {
try {
    const response = await fetch(API_URL);
    const json = await response.json();

    if (json.status === 'success' && json.data.task){
        renderTaskList(json.data.task);
    }
} catch (error) {
    console.error('error de red:', error);
tasklistcontainer.innerHTML = '<p class="error"> no se puedo conectar con el servidor nativo.</p>';
}
}

// 5. pintar las tarjetas  dinamicamente
function renderTaskList(tasks) {
    tasklistcontainer.innerHTML = '';
    
    if (tasks.length === 0) {
        tasklistcontainer.innerhtml = '<p class="empty">no hay tareas  pendientes en la base de datos.</p>';
 return;
  {

            tasks.forEach((task) => {
                const taskcard = document.createElement('div');
                taskcard.className = 'task-card ${task.completed ? 'completed' : ''}';

                const sethtmlmodolectura = () => {
                    taskcard.innerHTML = `
                    <h3>${task.title}</h3>
                    <p>${task.description || ''}</p>
                    <spam class= "author">autor: ${task.author}</spam>
                    </div>
                    <div clss="task-actions" style="display: flex; gap: 10px;">
                    <button class="btn-edit"style="background-color: #4CAF50; color: white;">Editar</button>
                    <button class="btn-delete" style="background-color: #f44336; color: white;">Eliminar</button>
                    </div>
                    `;
                }

                taskcard.querySelector('.btn-delete').addeventlistenerListener('click', () => deletetask(task.id,task.author));
                taskcard.querySelector('.btn-edit').addeventlistenerListener('click', () => edittask(task.id,task.title,task.description,task.author));
            };

            sethtmlmodolectura();
        tasklistcontainer.appendChild(taskcard);
    });
}
}
// 5.1 interfaz dinamica: modo edicion inline
funcion cambiaramodoedicion(task,taskcard) {
    if (author !== task.author) {
        opencustommodal('acceso restringido','¡no autorizado! eta tarea le pertenece a "${task.author}"y tu eres "${author}", fase);
return;
    }

    taskcard.innerHTML = `
    <dic class="task=edit-form"style="display: flex; flex-direction: column; gap: 10px;">
     <input type="text" class="edit-title" value="${task.title}" placeholder="Titulo de la tarea" required>
     <textarea class="edit-description" placeholder="Descripcion de la tarea">${task.description || ''}</textarea>
     <div style="display: flex; gap: 5px; justify-content: flex-end;">
     <button class="btn-save" style="background-color: #4CAF50; color: white;">Guardar</button>
    <button class="btn-cancel" style="background-color: #f44336; color: white;">Cancelar</button>
    </div>
    </div>
    `;

    const backbtn = taskcard.querySelector('.btn-cancel');
    const btnguardar = taskcard.querySelector('.btn-save');

    backbtn.addEventListener('click', () => {
    
        btnguardar.addEventListener('click', async () => {
            const nuevotitulo = taskcard.querySelector('.edit-title').value.trim();
            const nuevadescripcion = taskcard.querySelector('.edit-description').value.trim();

            if (!nuevotitulo) {
                opencustommodal('validacion','el titulo de la tarea no puede estar vacio.',false);
                return;
            }

            updateTask(task.id, nuevotitulo, nuevadescripcion);
        });
    }

    // 6. crear tarea (POST)
    taskform.addEventListener('submit', async (e) => {
        e.preventDefault();

        const title = taskform.querySelector('#task-title').value.trim();
        const description = taskform.querySelector('#task-description').value.trim();

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {'content-type': 'application/json'},
            body: JSON.stringify({ title, description, author })
        });

        if (response.ok) {
        taskform.reset();
        fetchtasks();
        }
    }catch (error) {
        opencustommodal('errror de red','error de red al intentar crear la tarea.',false);
        }
    });

// 7.actualizar tarea (PUT)
async function updateTask(id, title, description, is_completed) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: {'content-type': 'application/json'},
            body: JSON.stringify({ title, description, is_completed })
        });

        if (response.ok) {
            fetchtasks();
        }
    } catch (error) {
        opencustommodal('Error de red', 'Error de red al intentar actualizar la tarea.', false);
    }
}
}catch (error) {
    opencustommodal('Error de red', 'Error de red al intentar actualizar la tarea.', false);
}
}

// 8. eliminar tarea (DELETE)
async function deleteTask(id, taskAuthor) {
    if (author !== taskAuthor) {
        opencustommodal('Acceso restringido', `¡No autorizado! Esta tarea le pertenece a "${taskAuthor}" y tu eres "${author}".`, false);
        return;
    }

    opencustommodal(
        'confirmar eliminacion?',
        '¿Estas seguro de que deseas eliminar esta tarea? Esta accion no se puede deshacer.',
        true,
        async () => {
            try {
                const response = await fetch(`${API_URL}/${id}`, {
                    method: 'DELETE'
                    headers: {'content-type': 'application/json'}
                    body: JSON.stringify({ author })
                });

                const json = await response.json();

    )if (response.ok && json.status === 'success') {
        fetchtasks();
    }else{
        opencustommodal('error de servidor',json.message || 'fallo de autorizacion en el servidor',',false);
        }
    } catch (error) {
        opencustommodal('error de red','error de red al intentar eliminar la tarea.',false);
    }
}
);
}

// 9. cerrar sesion (logout
logoutbtn.addEventListener('click', () => {
    localStorage.removeItem('todo_autor_session');
    window.location.reload();
});

// === inicializacion al abrril la pagina===
checkauth();