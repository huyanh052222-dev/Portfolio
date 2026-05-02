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

const skillDefinitions = {
    'Kiến thức chuyên môn': 'Khả năng nắm vững lý thuyết, thư viện và kiến trúc hệ thống lõi.',
    'Làm việc nhóm': 'Năng lực phối hợp, giao tiếp và hỗ trợ đồng đội trong dự án.',
    'Thái độ & Kỷ luật': 'Sự chuyên nghiệp, tinh thần trách nhiệm và tuân thủ quy trình.',
    'Giải quyết vấn đề': 'Tư duy logic để phân tích bài toán và tìm ra giải pháp tối ưu.',
    'Hiệu suất học tập': 'Tốc độ nghiên cứu, tiếp thu và làm chủ các công nghệ mới.',
    'Tư duy sản phẩm': 'Góc nhìn từ phía người dùng để tối ưu hóa tính năng và trải nghiệm.'
};

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
            
            if (skillChart) {
                const textColor = isDark ? '#e5e7eb' : '#333';
                const gridColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
                skillChart.options.scales.r.grid.color = gridColor;
                skillChart.options.scales.r.pointLabels.color = textColor;
                skillChart.update();
            }
        });
    }

    // ========================================
    // CHART INITIALIZATION (NÂNG CẤP HOVER & ANIMATION)
    // ========================================
    function initSkillChart() {
        const chartCanvas = document.getElementById('skillChart');
        if (!chartCanvas) return;
        
        const ctx = chartCanvas.getContext('2d');
        const isDark = document.body.classList.contains('dark-mode');

        const gradient = ctx.createRadialGradient(ctx.canvas.width / 2, ctx.canvas.height / 2, 0, ctx.canvas.width / 2, ctx.canvas.height / 2, 200);
        gradient.addColorStop(0, 'rgba(29, 131, 255, 0.6)');
        gradient.addColorStop(1, 'rgba(29, 131, 255, 0.05)');

        const textColor = isDark ? '#e5e7eb' : '#25354d';
        const gridColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)';

        if (skillChart) skillChart.destroy();

        skillChart = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: skillLabels,
                datasets: [{
                    label: 'Chỉ số năng lực',
                    data: currentSkills,
                    borderColor: '#1d83ff', 
                    borderWidth: 3,
                    backgroundColor: gradient,
                    pointBackgroundColor: '#fff',
                    pointBorderColor: '#1d83ff',
                    pointRadius: 5,
                    pointHoverRadius: 10,
                    fill: true,
                    tension: 0.15
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: { duration: 2000, easing: 'easeOutQuart' },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: 'rgba(15, 23, 42, 0.9)',
                        padding: 12,
                        cornerRadius: 10,
                        displayColors: false,
                        callbacks: {
                            label: (context) => ` Chỉ số: ${context.parsed.r}/100`,
                            footer: (context) => '\n' + (skillDefinitions[context[0].label] || '')
                        }
                    }
                },
                scales: {
                    r: {
                        grid: { color: gridColor },
                        angleLines: { color: gridColor },
                        ticks: { display: false },
                        pointLabels: {
                            color: textColor,
                            font: { size: 13, weight: '700' },
                            padding: 20
                        },
                        suggestedMin: 0,
                        suggestedMax: 100
                    }
                }
            }
        });

        // Animation cho Progress Bar trong tile
        setTimeout(() => {
            const statusFill = document.querySelector('.status-fill');
            if (statusFill) statusFill.style.width = '92%';
        }, 500);
    }

    // ========================================
    // PAGE INITIALIZATION FLOW
    // ========================================
    async function initPage() {
        console.log("[Init] Đang nạp toàn bộ thành phần...");
        
        try {
            await Promise.all([
                loadSingleComponent("header-placeholder", "../Components/header.html"),
                loadSingleComponent("footer-placeholder", "../Components/footer.html"),
                loadSingleComponent("badge-section", "../Components/badge.html"), // ĐÃ NẠP LẠI Ở ĐÂY
                loadSingleComponent("breadcrumb-placeholder", "../Components/breadcrumb.html"),
                loadSingleComponent("linkContact", "../Components/linkContact.html"),
                loadSingleComponent("skill", "../Components/skill-radar.html")
            ]);

            await loadSingleComponent("nav-header", "../Components/navComponent.html");
            await loadSingleComponent("button-header", "../Components/button-header.html");

            if (typeof userData !== 'undefined') {
                await loadUserCards("user-slot", "../Components/card-user.html", userData);
            }

            initThemeToggle();
            // Đợi một chút để component 'skill' nạp xong canvas trước khi vẽ chart
            setTimeout(initSkillChart, 200);

            console.log("[Success] Hoàn tất nạp Badge và các thành phần khác!");
        } catch (err) {
            console.error("[Fatal Error]:", err);
        }
    }

    initPage();
});