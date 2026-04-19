document.addEventListener("DOMContentLoaded", async function () {
    // 1. Hàm nạp component đơn lẻ (Giữ nguyên)
    async function loadSingleComponent(id, path) {
        try {
            const response = await fetch(path);
            const data = await response.text();
            const element = document.getElementById(id);
            if (element) {
                element.innerHTML = data;
                if (id === "nav-header") setActiveNav();
            }
        } catch (error) { 
            console.error("Lỗi nạp component đơn:", error); 
        }
    }

    // 2. Hàm nạp danh sách card (Đã sửa logic gán Link)
    async function loadUserCards(className, path, dataList) {
        try {
            const response = await fetch(path);
            const template = await response.text();
            const slots = document.querySelectorAll(`.${className}`);

            slots.forEach((slot, index) => {
                // Nạp khung HTML vào slot
                slot.innerHTML = template;

                const user = dataList[index];
                if (user) {
                    // Đổ text và ảnh
                    const nameEl = slot.querySelector(".name-slot");
                    if (nameEl) nameEl.innerText = user.name;

                    const statEl = slot.querySelector(".stat-slot");
                    if (statEl) statEl.innerText = "Nghề nghiệp: " + user.stats;

                    const avatarImg = slot.querySelector(".avatar-slot");
                    if (avatarImg) avatarImg.src = user.avatarUrl;

                    // --- SỬA LOGIC GÁN LINK TẠI ĐÂY ---
                    // Bước 1: Thử tìm thẻ con có class card-link-wrapper
                    let cardLink = slot.querySelector(".card-link-wrapper");
                    
                    // Bước 2: Nếu không thấy thẻ con, mà chính cái slot là thẻ <a>, thì dùng luôn nó
                    if (!cardLink && slot.tagName === 'A') {
                        cardLink = slot;
                    }

                    if (cardLink) {
                        // Vì Community.html và user-details.html cùng nằm trong folder Pages
                        // Nên link chỉ cần gọi tên file trực tiếp
                        cardLink.href = `./user-details.html?id=${user.id}`;
                        console.log(`Gán ID ${user.id} cho ${user.name}`);
                    }
                }
            });
        } catch (error) { 
            console.error("Lỗi nạp danh sách card:", error); 
        }
    }

    // --- THỰC THI ---
    loadSingleComponent("header-placeholder", "../Components/header.html");
    loadSingleComponent("footer-placeholder", "../Components/footer.html");
    loadSingleComponent("nav-header", "../Components/navComponent.html");
    loadSingleComponent("button-header", "../Components/button-header.html");

    // Đảm bảo userData đã được nạp từ data.js
    if (typeof userData !== 'undefined') {
        loadUserCards("user-slot", "../Components/card-user.html", userData);
    } else {
        console.error("Lỗi: Không tìm thấy biến userData từ data.js!");
    }
    
    function setActiveNav() {
        const path = window.location.pathname;
        let currentPage = path.split("/").pop().replace(".html", "") || "index";
        const navItems = document.querySelectorAll(".nav-item");
        navItems.forEach(item => {
            const page = item.dataset.page;
            item.classList.toggle("active", page === currentPage);
        });
    }
});