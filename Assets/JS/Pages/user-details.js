document.addEventListener("DOMContentLoaded", function () {
    console.log("1. Kiểm tra userData:", typeof userData !== 'undefined' ? userData : "Chưa nhận được data.js");
    console.log("2. Query String:", window.location.search);

    const urlParams = new URLSearchParams(window.location.search);
    const rawId = urlParams.get('id');
    
    const userId = rawId ? Number(rawId) : null;
    console.log("3. ID sau khi xử lý:", userId);

    const user = (typeof userData !== 'undefined' && userId !== null) 
                 ? userData.find(u => u.id == userId) 
                 : null;

    if (user) {
        const nameEl = document.getElementById("detail-name");
        const avatarImg = document.getElementById("detail-avatar");
        const statEl = document.getElementById("detail-stats");
        const idSpan = document.getElementById("display-id");
        
        const statsLabelEl = document.getElementById("detail-stats-label");
        const levelBadge = document.getElementById("user-level");

        if (nameEl) nameEl.innerText = user.name;
        if (idSpan) idSpan.innerText = user.id;
        if (statEl) statEl.innerText = "Nghề nghiệp: " + user.stats;
        if (statsLabelEl) statsLabelEl.innerText = "UID: " + user.id + "-2026-X";

        if (levelBadge) {
            levelBadge.innerText = "LV. " + (10 + (user.id % 10));
        }

        if (avatarImg) {
            avatarImg.src = user.avatarUrl;
            avatarImg.alt = user.name;
            avatarImg.onerror = () => {
                avatarImg.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=4f46e5&color=fff&bold=true`;
            };
        }
        
        document.title = "Hồ sơ của " + user.name;
    } else {
        console.error("Không tìm thấy user với ID này!");
        const mainContainer = document.querySelector(".container");
        if (mainContainer) {
            mainContainer.innerHTML = `<div style="text-align:center; padding:50px;">
                <h1>Người dùng không tồn tại!</h1>
                <a href="../Pages/community.html">Quay lại danh sách</a>
            </div>`;
        }
    }

    loadHeaderForDetail();
});

async function loadHeaderForDetail() {
    const path = "../Components/navComponent.html";
    try {
        const response = await fetch(path);
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.text();
        const nav = document.getElementById("nav-header");
        if (nav) nav.innerHTML = data;
    } catch (e) { 
        console.error("Lỗi nạp header:", e.message); 
    }
}