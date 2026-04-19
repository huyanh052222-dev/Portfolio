/**
 * user-details.js - Phiên bản SIÊU ỔN ĐỊNH
 * Tự động tìm dữ liệu và nạp vào Profile + Breadcrumb
 */

(function() {
    // 1. Lấy ID từ URL (Vd: ?id=1)
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('id');

    function startDataInjection() {
        // Kiểm tra xem dữ liệu từ data.js đã sẵn sàng chưa
        if (typeof userData === 'undefined') {
            console.log("[Waiting] Đang đợi userData từ data.js...");
            setTimeout(startDataInjection, 100);
            return;
        }

        // Tìm User trong danh sách (ép kiểu về String để so sánh chuẩn)
        const user = userData.find(u => String(u.id) === String(userId));
        
        if (!user) {
            console.error("[Error] Không tìm thấy thành viên có ID:", userId);
            showNotFoundError();
            return;
        }

        // --- CẬP NHẬT CÁC PHẦN TỬ CỐ ĐỊNH (TRONG HTML CHÍNH) ---
        const updateStatic = () => {
            const elements = {
                name: document.getElementById('detail-name'),
                rank: document.getElementById('detail-rank'),
                uidLabel: document.getElementById('detail-stats-label'),
                uidDisplay: document.getElementById('display-id'),
                level: document.getElementById('user-level'),
                avatar: document.getElementById('detail-avatar')
            };

            if (elements.name) elements.name.innerText = user.name;
            if (elements.rank) elements.rank.innerText = user.stats;
            if (elements.uidLabel) elements.uidLabel.innerText = "UID: " + user.id + "-2026-X";
            if (elements.uidDisplay) elements.uidDisplay.innerText = user.id;
            if (elements.level) elements.level.innerText = "Lv. " + (90 + (user.id % 10));
            
            if (elements.avatar) {
                elements.avatar.src = user.avatarUrl;
                elements.avatar.alt = user.name;
                elements.avatar.onerror = () => {
                    elements.avatar.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=4f46e5&color=fff&bold=true`;
                };
            }

            document.title = "Hồ sơ của " + user.name;
        };

        // --- CẬP NHẬT CÁC PHẦN TỬ NẠP ĐỘNG (BREADCRUMB) ---
        const updateDynamic = () => {
            const dynamicNames = document.querySelectorAll('.detail-name-slot');
            dynamicNames.forEach(el => {
                if (el.innerText !== user.name) {
                    el.innerText = user.name;
                }
            });
        };

        // Chạy lần đầu
        updateStatic();

        // Theo dõi và cập nhật liên tục trong 2 giây đầu (vì Breadcrumb nạp chậm)
        let count = 0;
        const syncTimer = setInterval(() => {
            updateStatic();
            updateDynamic();
            count++;
            if (count > 20) clearInterval(syncTimer); // Dừng sau 2s
        }, 150);
    }

    function showNotFoundError() {
        const grid = document.querySelector('.bento-grid');
        if (grid) {
            grid.innerHTML = `<div class="bento-card" style="grid-column: span 4; text-align: center; padding: 100px;">
                <h1 style="color: var(--second-color); font-size: 40px;">404</h1>
                <p>Không tìm thấy thành viên này trong hệ thống.</p>
                <a href="./community.html" style="color: var(--primary-color); font-weight: 700;">Quay lại danh sách</a>
            </div>`;
        }
    }

    // Khởi động khi DOM sẵn sàng
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startDataInjection);
    } else {
        startDataInjection();
    }
})();