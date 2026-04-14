document.addEventListener("DOMContentLoaded", function () {
    function loadComponent(id, path) {
        fetch(path)
            .then(response => {
                if (!response.ok) throw new Error("Không tìm thấy file: " + path);
                return response.text();
            })
            .then(data => {
                document.getElementById(id).innerHTML = data;
            })
            .catch(error => console.error(error));
    }

    loadComponent("header-placeholder", "../Components/header.html");
    // loadComponent("button-placeholder", "../Components/header.html");
    // loadComponent("button-placeholder", "../Components/header.html");
});
