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
    loadComponent("nav-header", "../Components/navComponent.html");
    loadComponent("button-header", "../Components/button-header.html");

    loadComponent("card-user-1", '../Components/card-user.html');
    loadComponent("card-user-2", '../Components/card-user.html');
    loadComponent("card-user-3", '../Components/card-user.html');
    // loadComponent("button-placeholder", "../Components/header.html");
});

async function loadComponents() {
    const response = await fetch("../Components/card-user.html");
    const htmlContent = await response.text();

    // Tìm tất cả các thẻ có class là "user-slot"
    const slots = document.querySelectorAll(".user-slot");

    // Đổ nội dung component vào từng slot một
    slots.forEach(slot => {
        slot.innerHTML = htmlContent;
    });
}

// Gọi hàm khi trang web tải xong
loadComponents();