// ========================================
// GLOBAL VARIABLES & CHART CONFIG
// ========================================
let skillChart = null;
const skillLabels = [
    'Kiến thức chuyên môn',
    'Làm việc nhóm',
    'Thái độ & Kỷ luật',
    'Giải quyết vấn đề',
    'Hiệu suất học tập',
    'Tư duy sản phẩm'
];
const initialSkills = [88, 85, 92, 90, 87, 84];
let currentSkills = [...initialSkills];

document.addEventListener("DOMContentLoaded", function () {
    
    // ========================================
    // COMPONENT LOADER FUNCTIONS
    // ========================================
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

    // ========================================
    // THEME TOGGLE LOGIC
    // ========================================
    function initThemeToggle() {
        const themeToggle = document.querySelector('.theme-toggle');
        if (!themeToggle) return;
        
        const savedTheme = localStorage.getItem('theme') || 'light-mode';
        document.body.classList.add(savedTheme);
        
        themeToggle.addEventListener('click', () => {
            const isDark = document.body.classList.toggle('dark-mode');
            const theme = isDark ? 'dark-mode' : 'light-mode';
            
            document.body.classList.remove('light-mode', 'dark-mode');
            document.body.classList.add(theme);
            localStorage.setItem('theme', theme);
            
            // Cập nhật lại màu sắc biểu đồ nếu đang tồn tại
            if (skillChart) {
                const textColor = isDark ? '#e5e7eb' : '#333';
                const gridColor = isDark ? '#374151' : '#e5e7eb';
                
                skillChart.options.scales.r.ticks.color = textColor;
                skillChart.options.scales.r.grid.color = gridColor;
                skillChart.options.scales.r.pointLabels.color = textColor;
                skillChart.update();
            }
        });
    }

    // ========================================
    // CHART INITIALIZATION
    // ========================================
    function initSkillChart() {
        const chartCanvas = document.getElementById('skillChart');
        if (!chartCanvas) {
            console.warn("[Warn] Không tìm thấy canvas skillChart để vẽ.");
            return;
        }
        
        if (typeof Chart === 'undefined') {
            console.error("[Error] Thư viện Chart.js chưa được nạp vào trang.");
            return;
        }

        const ctx = chartCanvas.getContext('2d');
        const isDark = document.body.classList.contains('dark-mode');
        const textColor = isDark ? '#e5e7eb' : '#333';
        const gridColor = isDark ? '#374151' : '#e5e7eb';
        
        skillChart = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: skillLabels,
                datasets: [{
                    label: 'Chỉ số năng lực',
                    data: currentSkills,
                    borderColor: '#6366f1',
                    backgroundColor: 'rgba(99, 102, 241, 0.15)',
                    borderWidth: 3,
                    pointRadius: 6,
                    pointBackgroundColor: '#6366f1',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointHoverRadius: 8,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        callbacks: {
                            label: (context) => `${context.dataset.label}: ${context.parsed.r}/100`
                        }
                    }
                },
                scales: {
                    r: {
                        min: 0,
                        max: 100,
                        beginAtZero: true,
                        ticks: {
                            color: textColor,
                            stepSize: 20,
                            backdropColor: 'transparent'
                        },
                        grid: { color: gridColor },
                        pointLabels: {
                            color: textColor,
                            font: { size: 12, weight: 'bold' }
                        }
                    }
                }
            }
        });
    }

    // ========================================
    // PAGE INITIALIZATION FLOW
    // ========================================
    async function initPage() {
        console.log("[Init] Bắt đầu nạp các thành phần giao diện...");
        
        try {
            // Nạp đồng thời các component tĩnh (không phụ thuộc vào nhau)
            await Promise.all([
                loadSingleComponent("header-placeholder", "../Components/header.html"),
                loadSingleComponent("footer-placeholder", "../Components/footer.html"),
                loadSingleComponent("badge-section", "../Components/badge.html"),
                loadSingleComponent("breadcrumb-placeholder", "../Components/breadcrumb.html"),
                loadSingleComponent("linkContact", "../Components/linkContact.html"),
                loadSingleComponent("skill", "../Components/skill-radar.html")
            ]);

            // Nạp nav-header trước vì ID "button-header" nằm bên trong component này
            await loadSingleComponent("nav-header", "../Components/navComponent.html");

            // Sau khi nav-header nạp xong, ID "button-header" mới xuất hiện trong DOM để nạp tiếp
            await loadSingleComponent("button-header", "../Components/button-header.html");

            // Nạp các thẻ User nếu có dữ liệu userData
            if (typeof userData !== 'undefined') {
                await loadUserCards("user-slot", "../Components/card-user.html", userData);
            }

            // Khởi tạo Chart sau khi HTML component đã được nạp
            initSkillChart();
            
            // Khởi tạo tính năng đổi màu nền
            initThemeToggle();

            console.log("[Success] Toàn bộ trang, thẻ thành viên và biểu đồ đã sẵn sàng!");
        } catch (err) {
            console.error("[Fatal] Khởi tạo trang thất bại:", err);
        }
    }

    initPage();
});