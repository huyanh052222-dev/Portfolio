document.addEventListener("DOMContentLoaded", function () {
    
    async function loadSingleComponent(id, path) {
        try {
            const response = await fetch(path);
            if (!response.ok) throw new Error(`Không thể fetch ${path}`);
            const data = await response.text();
            const element = document.getElementById(id);
            if (element) {
                element.innerHTML = data;
                if (id === "nav-header") setActiveNav();
                return element;
            }
        } catch (error) { 
            console.error(`[Error] Lỗi nạp component ${id}:`, error); 
        }
    }

    async function loadUserCards(className, path, dataList) {
        try {
            const response = await fetch(path);
            const template = await response.text();
            const slots = document.querySelectorAll(`.${className}`);
            slots.forEach((slot, index) => {
                const user = dataList[index];
                if (user) {
                    slot.innerHTML = template;
                    const nameEl = slot.querySelector(".name-slot");
                    const statEl = slot.querySelector(".stat-slot");
                    const avatarImg = slot.querySelector(".avatar-slot");
                    if (nameEl) nameEl.innerText = user.name;
                    if (statEl) statEl.innerText = "Nghề nghiệp: " + user.stats;
                    if (avatarImg) {
                        avatarImg.src = user.avatarUrl;
                        avatarImg.onerror = () => {
                            avatarImg.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=4f46e5&color=fff&bold=true`;
                        };
                    }
                    let cardLink = slot.querySelector(".card-link-wrapper") || (slot.tagName === 'A' ? slot : null);
                    if (cardLink) cardLink.href = `./user-details.html?id=${user.id}`;
                    slot.classList.add("bento-member-card");
                }
            });
        } catch (error) { console.error("[Error] Lỗi nạp card:", error); }
    }

    function setActiveNav() {
        const path = window.location.pathname;
        let currentPage = path.split("/").pop().replace(".html", "") || "index";
        document.querySelectorAll(".nav-item").forEach(item => {
            item.classList.toggle("active", item.dataset.page === currentPage);
        });
    }

    async function initPage() {
        console.log("[Init] Bắt đầu nạp giao diện...");
        
        try {
            await Promise.all([
                loadSingleComponent("header-placeholder", "../Components/header.html"),
                loadSingleComponent("footer-placeholder", "../Components/footer.html"),
                loadSingleComponent("badge-section", "../Components/badge.html"),
                loadSingleComponent("breadcrumb-placeholder", "../Components/breadcrumb.html"),
                loadSingleComponent("project-comp", "../Components/project.html")
            ]);

            await loadSingleComponent("nav-header", "../Components/navComponent.html");

            await loadSingleComponent("button-header", "../Components/button-header.html");

            if (typeof userData !== 'undefined') {
                await loadUserCards("user-slot", "../Components/card-user.html", userData);
            }
            
            console.log("[Success] Toàn bộ trang đã sẵn sàng!");
        } catch (err) {
            console.error("[Fatal] Khởi tạo thất bại:", err);
        }
    }

    initPage();
});