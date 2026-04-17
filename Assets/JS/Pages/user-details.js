
document.addEventListener("DOMContentLoaded", function () {
    console.log("1. Kiểm tra userData:", typeof userData !== 'undefined' ? userData : "Chưa nhận được data.js");
    console.log("2. ID lấy từ URL:", window.location.search);
    // 1. Lấy ID từ thanh địa chỉ (URL)
    const urlParams = new URLSearchParams(window.location.search);
    // Thêm Number() để ép kiểu về số
    const userId = Number(urlParams.get('id'));

    console.log("3. ID sau khi ép kiểu Number:", userId);

    // 2. Tìm đúng người dùng trong mảng userData (đã nạp từ data.js)
    const user = userData.find(u => u.id == userId);

    // 3. Đổ dữ liệu vào các thẻ ID tương ứng
    if (user) {
        const nameEl = document.getElementById("detail-name");
        const avatarImg = document.getElementById("detail-avatar");
        const statEl = document.getElementById("detail-stats");
        const idSpan = document.getElementById("display-id");

        if (nameEl) nameEl.innerText = user.name;
        if (statEl) statEl.innerText = "Nghề nghiệp: " + user.stats;
        if (idSpan) idSpan.innerText = user.id;
        if (avatarImg) {
            avatarImg.src = user.avatarUrl;
            avatarImg.alt = user.name;
        }
        
        // Đổi title trang cho "xịn"
        document.title = "Hồ sơ của " + user.name;
    } else {
        console.error("Không tìm thấy user với ID này!");
        document.body.innerHTML = "<h1>Người dùng không tồn tại!</h1><a href='../Pages/Community.html'>Quay lại</a>";
    }

    // 4. Vẫn nạp Nav-header bình thường nếu cần
    loadHeaderForDetail();
});

async function loadHeaderForDetail() {
    try {
        const response = await fetch("../Components/navComponent.html");
        const data = await response.text();
        const nav = document.getElementById("nav-header");
        if (nav) nav.innerHTML = data;
    } catch (e) { console.error(e); }
}