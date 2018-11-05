
    let button_sign_in = document.querySelector(".botao-entrar");
    button_sign_in.addEventListener("click", function () {

        if (button_sign_in.value == "Login") {
            if (localStorage !== "undefined") {

                localStorage.setItem("idUser", prompt("Hi, type below your idUser to sign in!"));
                button_sign_in.value = "Logout";
            } else {

                console.log("Sorry, but your browser doesn't support local storage!");
            }
        } else if (button_sign_in.value == "Logout") {

            console.log(localStorage.getItem("idUser"))
            localStorage.removeItem("idUser");
            button_sign_in.value = "Login";

        }


    });

    let urlGetGroups = "http://rest.learncode.academy/api/yuri/grupos";
    let urlMessagesByGroup = "http://rest.learncode.academy/api/yuri/";
    let urlPOSTGroups = "http://rest.learncode.academy/api/yuri/";

    let groupNameApp = document.querySelector(".group-name");
    let groupsList;
    let messagesByGroupList;
    let idGroupActivated;

    let listaAmigosUl = document.querySelector(".menu-lista-amigos");
    let div_messages = document.querySelector(".messages");

    let button_send_new_message;

    let button_new_group = document.getElementById("buttonCreateGroup");
    button_new_group.addEventListener("click", function () {

        let nameGroup = document.getElementById("newGroupName");
        let idGroup = document.getElementById("idNewGroup");

        createNewGroup(nameGroup.value, idGroup.value);

        nameGroup.innerHTML = "";
        idGroup.innerHTML = "";

    });

    function getGroups() {

        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (xhttp.readyState == 4) {
                groupsList = JSON.parse(xhttp.responseText);
                for (let i = 0; i <= groupsList[0].grupos.length; i++) {
                    createGroupItem(groupsList[0].grupos[i].groupName,
                        groupsList[0].grupos[i].groupID);
                }
            }
        }

        xhttp.open("GET", urlGetGroups, true);
        xhttp.send();
    }

    function getMessagesByGroup(idGrupo) {

        urlMessagesByGroup += idGrupo;
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (xhttp.readyState == 4) {
                messagesByGroupList = JSON.parse(xhttp.responseText);
                for (let i = 0; i < messagesByGroupList[0].mensagens.length; i++) {
                    createPanelMessage(messagesByGroupList[0].mensagens[i].usuario,
                        messagesByGroupList[0].mensagens[i].texto);
                }

                createFooterNewMessage()

            }
        }

        xhttp.open("GET", urlMessagesByGroup, true);
        xhttp.send();
    }

    function createGroupItem(title, idGroup) {

        let a = document.createElement("a");
        let li = document.createElement("li");
        let div = document.createElement("div");
        let img = document.createElement("img");
        let p = document.createElement("p");

        img.src = "./imgs/group_img.jpg";
        img.setAttribute("float", "left");

        a.innerHTML = title;
        p.appendChild(a);
        p.setAttribute("float", "left");
        p.setAttribute("width", "50px");

        a.addEventListener("click", function (event) {

            idGroupActivated = idGroup;
            div_messages.innerHTML = "";
            getMessagesByGroup(idGroup);
            groupNameApp.innerHTML = title;
        });

        div.appendChild(img);
        div.appendChild(p);
        li.appendChild(div);

        listaAmigosUl.appendChild(li);
    }

    function createPanelMessage(title, text) {

        let div_panel_main = document.createElement("div");
        div_panel_main.classList.add("panel", "panel-default", "panel-messages");

        let div_panel_heading = document.createElement("div");
        div_panel_heading.classList.add("panel-heading");
        div_panel_main.setAttribute("width", "100px");

        let h4_title_heading = document.createElement("h4");
        h4_title_heading.classList.add("panel-title");
        h4_title_heading.innerHTML = title;

        let div_panel_body = document.createElement("div");
        div_panel_body.classList.add("panel-body");
        div_panel_body.innerHTML = text;

        div_panel_heading.appendChild(h4_title_heading);
        div_panel_main.appendChild(div_panel_heading);
        div_panel_main.appendChild(div_panel_body);

        div_messages.appendChild(div_panel_main);
    }

    function createFooterNewMessage() {

        let footer = document.createElement("footer");
        let input_text = document.createElement("input");
        let input_submit = document.createElement("input");

        input_text.type = "text";
        input_text.classList.add("input-text-new-message", "form-control");
        input_text.placeholder = "Digite sua nova mensagem aqui";
        input_submit.setAttribute("width", "50px")

        input_submit.classList.add("button-submit-new-message", "btn", "btn-primary");
        input_submit.type = "submit";
        input_submit.value = "Enviar";

        footer.appendChild(input_text);
        footer.appendChild(input_submit);

        footer.style.marginTop = "150px";

        div_messages.appendChild(footer);

        button_send_new_message = document.querySelector(".button-submit-new-message");
        button_send_new_message.addEventListener("click", function () {

            let textfield_new_message = document.querySelector(".input-text-new-message");
            let text = textfield_new_message.innerHTML;
            sendNewMessage(text);
        });
    }

    function sendNewMessage(text) {

        let idUser = localStorage.getItem("idUser");

        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (xhttp.readyState == 4) {
                getMessagesByGroup(idGroupActivated);
            }
        };

        xhttp.open("POST", urlMessagesByGroup, true);
        xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhttp.send(JSON.stringify('{ usuario:' + idUser + ', texto:' + text + '}'));
    }

    function createNewGroup(nameGroup, idGroup) {

        let alertSuccess = document.querySelector(".alert");

        let xhttp = new XMLHttpRequest();

        xhttp.onreadystatechange = function () {

            if (readyState == 4) {
                alertSuccess.setAttribute("hidden", "false");
                listaAmigosUl.innerHTML = "";
                getGroups();

            }

            xhttp.open("POST", urlPOSTGroups, true);
            xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            xhttp.send(JSON.stringify('{ groupName:' + nameGroup + ', groupID:' + idGroup + '}'));
        }

        alertSuccess.setAttribute("hidden", "true");
    }

    listaAmigosUl.innerHTML = "";
    getGroups();
        