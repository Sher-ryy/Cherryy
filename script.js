
let notFollowingBack = [];
let filteredUsers = [];

let currentIndex = 0;
let currentView = "card";


// ==========================================
// ELEMENTOS
// ==========================================

const file1 = document.getElementById("file1");
const file2 = document.getElementById("file2");

const selectFile1 = document.getElementById("selectFile1");
const selectFile2 = document.getElementById("selectFile2");

const compareButton =
    document.getElementById("compareButton");

const searchInput =
    document.getElementById("searchInput");


// ==========================================
// SELECCIONAR ARCHIVOS
// ==========================================

selectFile1.addEventListener("click", () => {
    file1.click();
});


selectFile2.addEventListener("click", () => {
    file2.click();
});


file1.addEventListener("change", () => {

    const fileName =
        document.getElementById("fileName1");

    if (file1.files.length > 0) {
        fileName.textContent =
            file1.files[0].name;
    } else {
        fileName.textContent =
            "Ningún archivo seleccionado";
    }

});


file2.addEventListener("change", () => {

    const fileName =
        document.getElementById("fileName2");

    if (file2.files.length > 0) {
        fileName.textContent =
            file2.files[0].name;
    } else {
        fileName.textContent =
            "Ningún archivo seleccionado";
    }

});


// ==========================================
// COMPARAR ARCHIVOS
// ==========================================

compareButton.addEventListener(
    "click",
    compareJsonFiles
);


function compareJsonFiles() {

    const followingFile =
        file1.files[0];

    const followersFile =
        file2.files[0];


    if (!followingFile || !followersFile) {

        alert(
            "Por favor, selecciona ambos archivos."
        );

        return;
    }


    const readerFollowing =
        new FileReader();

    const readerFollowers =
        new FileReader();


    readerFollowing.onload =
        function (event) {

            let followingJson;


            try {

                followingJson =
                    JSON.parse(
                        event.target.result
                    );

            } catch (error) {

                alert(
                    "El archivo de seguidos no es un JSON válido."
                );

                return;
            }


            readerFollowers.onload =
                function (event) {

                    let followersJson;


                    try {

                        followersJson =
                            JSON.parse(
                                event.target.result
                            );

                    } catch (error) {

                        alert(
                            "El archivo de seguidores no es un JSON válido."
                        );

                        return;
                    }


                    const following =
                        extractFollowing(
                            followingJson
                        );


                    const followers =
                        extractFollowers(
                            followersJson
                        );


                    if (
                        !following.length ||
                        !followers.length
                    ) {

                        alert(
                            "No se encontraron datos válidos en uno o ambos archivos."
                        );

                        return;
                    }


                    // ==================================
                    // CREAR SET DE FOLLOWERS
                    // ==================================

                    const followersSet =
                        new Set(
                            followers.map(
                                user =>
                                    normalizeUsername(
                                        user.username
                                    )
                            )
                        );


                    // ==================================
                    // ENCONTRAR LOS QUE NO SIGUEN
                    // ==================================

                    notFollowingBack =
                        following.filter(
                            user =>
                                !followersSet.has(
                                    normalizeUsername(
                                        user.username
                                    )
                                )
                        );


                    filteredUsers =
                        [...notFollowingBack];


                    currentIndex = 0;


                    // ==================================
                    // ESTADÍSTICAS
                    // ==================================

                    updateStats(
                        following.length,
                        followers.length,
                        notFollowingBack.length
                    );


                    // ==================================
                    // MOSTRAR RESULTADOS
                    // ==================================

                    const results =
                        document.getElementById(
                            "results"
                        );


                    results.style.display =
                        "block";


                    render();


                    results.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });

                };


            readerFollowers.readAsText(
                followersFile
            );

        };


    readerFollowing.readAsText(
        followingFile
    );
}


// ==========================================
// EXTRAER SEGUIDOS
// ==========================================

function extractFollowing(json) {

    const users = [];


    /*
        Estructura de following.json:

        relationships_following
            └── title
            └── string_list_data
                    └── href
    */

    if (
        json.relationships_following &&
        Array.isArray(
            json.relationships_following
        )
    ) {

        json.relationships_following.forEach(
            item => {

                if (!item.title) {
                    return;
                }


                const href =
                    item
                        .string_list_data
                        ?. [0]
                        ?. href || "";


                users.push({

                    username:
                        item.title,

                    href:
                        href

                });

            }
        );

    }


    return users;
}


// ==========================================
// EXTRAER FOLLOWERS
// ==========================================

function extractFollowers(json) {

    const users = [];


    /*
        Estructura de followers_1.json:

        [
            {
                string_list_data: [
                    {
                        value,
                        href
                    }
                ]
            }
        ]
    */

    if (Array.isArray(json)) {

        json.forEach(item => {

            if (
                !item.string_list_data ||
                !Array.isArray(
                    item.string_list_data
                )
            ) {
                return;
            }


            item.string_list_data.forEach(
                sub => {

                    if (!sub.value) {
                        return;
                    }


                    users.push({

                        username:
                            sub.value,

                        href:
                            sub.href || ""

                    });

                }
            );

        });

    }


    return users;
}


// ==========================================
// NORMALIZAR USERNAME
// ==========================================

function normalizeUsername(username) {

    return username
        .trim()
        .toLowerCase()
        .replace(/^@/, "");

}


// ==========================================
// ESTADÍSTICAS
// ==========================================

function updateStats(
    following,
    followers,
    notFollowing
) {

    document.getElementById(
        "followingCount"
    ).textContent =
        following;


    document.getElementById(
        "followersCount"
    ).textContent =
        followers;


    document.getElementById(
        "notFollowingCount"
    ).textContent =
        notFollowing;


    document.getElementById(
        "resultDescription"
    ).textContent =
        notFollowing === 1
            ? "1 persona no te sigue de vuelta."
            : `${notFollowing} personas no te siguen de vuelta.`;

}


// ==========================================
// AVATAR
// ==========================================

function getInitials(username) {

    const clean =
        username
            .replace(/^@/, "")
            .trim();


    if (!clean) {
        return "?";
    }


    const parts =
        clean
            .split(/[._-]/)
            .filter(Boolean);


    if (parts.length >= 2) {

        return (
            parts[0][0] +
            parts[1][0]
        ).toUpperCase();

    }


    return clean
        .slice(0, 2)
        .toUpperCase();
}


function createAvatar(
    username,
    large = false
) {

    const avatar =
        document.createElement("div");


    avatar.className =
        large
            ? "avatar-large"
            : "avatar";


    avatar.textContent =
        getInitials(username);


    return avatar;
}


// ==========================================
// VISTA TARJETA
// ==========================================

function renderCard() {

    const container =
        document.getElementById(
            "profileCard"
        );


    container.innerHTML = "";


    if (!filteredUsers.length) {

        container.innerHTML = `
            <div class="empty">
                <strong>
                    No encontramos usuarios
                </strong>

                Prueba con otra búsqueda.
            </div>
        `;

        return;
    }


    if (
        currentIndex >=
        filteredUsers.length
    ) {

        currentIndex =
            filteredUsers.length - 1;

    }


    const user =
        filteredUsers[currentIndex];


    const card =
        document.createElement("div");


    card.className =
        "profile-card";


    // AVATAR

    card.appendChild(
        createAvatar(
            user.username,
            true
        )
    );


    // USERNAME

    const username =
        document.createElement("div");


    username.className =
        "username";


    username.textContent =
        "@" + user.username;


    card.appendChild(username);


    // STATUS

    const status =
        document.createElement("div");


    status.className =
        "status";


    status.textContent =
        "● No te sigue de vuelta";


    card.appendChild(status);


    // CONTADOR

    const counter =
        document.createElement("div");


    counter.className =
        "counter";


    counter.textContent =
        `${currentIndex + 1} de ${filteredUsers.length}`;


    card.appendChild(counter);


    // LINK

    if (user.href) {

        const link =
            document.createElement("a");


        link.className =
            "profile-link";


        link.href =
            user.href;


        link.target =
            "_blank";


        link.rel =
            "noopener noreferrer";


        link.textContent =
            "Ver perfil ↗";


        card.appendChild(link);

    }


    container.appendChild(card);
}


// ==========================================
// VISTA CUADRÍCULA
// ==========================================

function renderGrid() {

    const container =
        document.getElementById(
            "gridContainer"
        );


    container.innerHTML = "";


    if (!filteredUsers.length) {

        container.innerHTML = `
            <div class="empty">
                <strong>
                    No encontramos usuarios
                </strong>

                Prueba con otra búsqueda.
            </div>
        `;

        return;
    }


    filteredUsers.forEach(user => {

        const card =
            document.createElement("div");


        card.className =
            "user-card";


        const top =
            document.createElement("div");


        top.className =
            "user-card-top";


        top.appendChild(
            createAvatar(
                user.username
            )
        );


        const info =
            document.createElement("div");


        info.className =
            "user-info";


        const username =
            document.createElement("strong");


        username.textContent =
            "@" + user.username;


        const status =
            document.createElement("span");


        status.textContent =
            "No te sigue";


        info.appendChild(username);
        info.appendChild(status);


        top.appendChild(info);


        card.appendChild(top);


        if (user.href) {

            const link =
                document.createElement("a");


            link.href =
                user.href;


            link.target =
                "_blank";


            link.rel =
                "noopener noreferrer";


            link.textContent =
                "Ver perfil ↗";


            card.appendChild(link);

        }


        container.appendChild(card);

    });

}


// ==========================================
// VISTA LISTA
// ==========================================

function renderList() {

    const container =
        document.getElementById(
            "listContainer"
        );


    container.innerHTML = "";


    if (!filteredUsers.length) {

        container.innerHTML = `
            <div class="empty">
                <strong>
                    No encontramos usuarios
                </strong>

                Prueba con otra búsqueda.
            </div>
        `;

        return;
    }


    filteredUsers.forEach(user => {

        const item =
            document.createElement("div");


        item.className =
            "list-item";


        item.appendChild(
            createAvatar(
                user.username
            )
        );


        const info =
            document.createElement("div");


        info.className =
            "list-item-info";


        const username =
            document.createElement("strong");


        username.textContent =
            "@" + user.username;


        const status =
            document.createElement("span");


        status.textContent =
            "No te sigue de vuelta";


        info.appendChild(username);
        info.appendChild(status);


        item.appendChild(info);


        if (user.href) {

            const link =
                document.createElement("a");


            link.href =
                user.href;


            link.target =
                "_blank";


            link.rel =
                "noopener noreferrer";


            link.textContent =
                "↗";


            item.appendChild(link);

        }


        container.appendChild(item);

    });

}


// ==========================================
// RENDER GENERAL
// ==========================================

function render() {

    renderCard();

    renderGrid();

    renderList();

    updateViewVisibility();

}


// ==========================================
// CAMBIAR VISTA
// ==========================================

document
    .querySelectorAll(".view-button")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                changeView(
                    button.dataset.view
                );

            }
        );

    });


function changeView(view) {

    currentView =
        view;


    document
        .querySelectorAll(".view-button")
        .forEach(button => {

            button.classList.remove(
                "active"
            );

        });


    const activeButton =
        document.querySelector(
            `[data-view="${view}"]`
        );


    if (activeButton) {

        activeButton.classList.add(
            "active"
        );

    }


    updateViewVisibility();
}


function updateViewVisibility() {

    const card =
        document.getElementById(
            "cardContainer"
        );


    const grid =
        document.getElementById(
            "gridContainer"
        );


    const list =
        document.getElementById(
            "listContainer"
        );


    card.style.display =
        currentView === "card"
            ? "flex"
            : "none";


    grid.style.display =
        currentView === "grid"
            ? "grid"
            : "none";


    list.style.display =
        currentView === "list"
            ? "flex"
            : "none";
}


// ==========================================
// NAVEGACIÓN
// ==========================================

document
    .getElementById("previousButton")
    .addEventListener(
        "click",
        previousUser
    );


document
    .getElementById("nextButton")
    .addEventListener(
        "click",
        nextUser
    );


function previousUser() {

    if (!filteredUsers.length) {
        return;
    }


    currentIndex--;


    if (currentIndex < 0) {

        currentIndex =
            filteredUsers.length - 1;

    }


    renderCard();
}


function nextUser() {

    if (!filteredUsers.length) {
        return;
    }


    currentIndex++;


    if (
        currentIndex >=
        filteredUsers.length
    ) {

        currentIndex = 0;

    }


    renderCard();
}


// ==========================================
// BUSCADOR
// ==========================================

searchInput.addEventListener(
    "input",
    searchUsers
);


function searchUsers() {

    const query =
        searchInput
            .value
            .trim()
            .toLowerCase()
            .replace(/^@/, "");


    filteredUsers =
        notFollowingBack.filter(
            user =>
                user.username
                    .toLowerCase()
                    .includes(query)
        );


    currentIndex = 0;


    render();
}


// ==========================================
// TEMA OSCURO
// ==========================================

const themeButton =
    document.getElementById(
        "themeButton"
    );


themeButton.addEventListener(
    "click",
    toggleTheme
);


function toggleTheme() {

    document.body.classList.toggle(
        "dark"
    );


    const isDark =
        document.body.classList.contains(
            "dark"
        );


    themeButton.textContent =
        isDark
            ? "☀"
            : "☾";


    localStorage.setItem(
        "followCheckerTheme",
        isDark
            ? "dark"
            : "light"
    );
}


// ==========================================
// CARGAR TEMA GUARDADO
// ==========================================

const savedTheme =
    localStorage.getItem(
        "followCheckerTheme"
    );


if (savedTheme === "dark") {

    document.body.classList.add(
        "dark"
    );

    themeButton.textContent =
        "☀";
}


// ==========================================
// FLECHAS DEL TECLADO
// ==========================================

document.addEventListener(
    "keydown",
    event => {

        if (
            currentView !== "card" ||
            !filteredUsers.length
        ) {
            return;
        }


        if (event.key === "ArrowLeft") {
            previousUser();
        }


        if (event.key === "ArrowRight") {
            nextUser();
        }

    }
);
```
