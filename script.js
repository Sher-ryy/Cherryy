// ==========================================
// ELEMENTOS
// ==========================================

const file1 = document.getElementById("file1");
const file2 = document.getElementById("file2");

const selectFile1 = document.getElementById("selectFile1");
const selectFile2 = document.getElementById("selectFile2");

const compareButton = document.getElementById("compareButton");

const searchInput = document.getElementById("searchInput");

const themeButton = document.getElementById("themeButton");


// ==========================================
// VERIFICAR ELEMENTOS
// ==========================================

console.log({
    file1,
    file2,
    selectFile1,
    selectFile2,
    compareButton,
    searchInput,
    themeButton
});


// ==========================================
// SELECCIONAR ARCHIVOS
// ==========================================

if (selectFile1 && file1) {

    selectFile1.addEventListener("click", () => {
        file1.click();
    });

}


if (selectFile2 && file2) {

    selectFile2.addEventListener("click", () => {
        file2.click();
    });

}


if (file1) {

    file1.addEventListener("change", () => {

        const fileName =
            document.getElementById("fileName1");

        if (fileName && file1.files.length > 0) {

            fileName.textContent =
                file1.files[0].name;

        } else if (fileName) {

            fileName.textContent =
                "Ningún archivo seleccionado";

        }

    });

}


if (file2) {

    file2.addEventListener("change", () => {

        const fileName =
            document.getElementById("fileName2");

        if (fileName && file2.files.length > 0) {

            fileName.textContent =
                file2.files[0].name;

        } else if (fileName) {

            fileName.textContent =
                "Ningún archivo seleccionado";

        }

    });

}
