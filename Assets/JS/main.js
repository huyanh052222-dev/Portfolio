document.addEventListener("DOMContentLoaded", async function () {
    // Dữ liệu mẫu
    const userData = [
        { name: "Nguyễn Văn A", stats: "Kĩ sư Phần mềm", avatarUrl: "../Assets/Images/Users/Avatars/Test_Avatar.jpg" },
        { name: "Trần Thị B", stats: "Chuyên viên UI", avatarUrl: "../Assets/Images/Users/Avatars/Test_Avatar_2.jpg" },
        { name: "Lê Văn C", stats: "Người tiên phong", avatarUrl: "../Assets/Images/Users/Avatars/Test_Avatar_3.jpg" }
    ];

    // 1. Hàm nạp component đơn lẻ (Giữ nguyên)
    async function loadSingleComponent(id, path) {
        try {
            const response = await fetch(path);
            const data = await response.text();
            const element = document.getElementById(id);
            if (element) element.innerHTML = data;
        } catch (error) { console.error(error); }
    }

    // 2. Hàm nạp danh sách card VÀ đổ dữ liệu (Hợp nhất tại đây)
    async function loadUserCards(className, path, dataList) {
        try {
            const response = await fetch(path);
            const template = await response.text();
            const slots = document.querySelectorAll(`.${className}`);

            slots.forEach((slot, index) => {
                // Bước 1: Nạp cái khung (Xác)
                slot.innerHTML = template;

                // Bước 2: Đổ dữ liệu (Hồn) - Chỉ đổ nếu có dữ liệu tương ứng
                if (dataList[index]) {
                    const user = dataList[index];
                    
                    // Điền tên
                    const nameEl = slot.querySelector(".name-slot");
                    if (nameEl) nameEl.innerText = user.name;

                    // Điền chỉ số
                    const statEl = slot.querySelector(".stat-slot");
                    if (statEl) statEl.innerText = "Nghề nghiệp: " + user.stats;

                    // Điền Avatar
                    const avatarImg = slot.querySelector(".avatar-slot");
                    if (avatarImg) avatarImg.src = user.avatarUrl;
                }
            });
        } catch (error) { console.error("Lỗi nạp card:", error); }
    }

    // --- Thực thi tất cả trong một lần chạy ---
    loadSingleComponent("header-placeholder", "../Components/header.html");
    loadSingleComponent("nav-header", "../Components/navComponent.html");
    loadSingleComponent("button-header", "../Components/button-header.html");

    // Nạp card và truyền mảng dữ liệu vào
    loadUserCards("user-slot", "../Components/card-user.html", userData);
});