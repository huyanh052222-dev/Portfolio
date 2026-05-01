// ========================================
// SKILL CHART PAGE - JAVASCRIPT
// ========================================

// Global variables
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

// ========================================
// THEME TOGGLE
// ========================================
function initThemeToggle() {
    const themeToggle = document.querySelector('.theme-toggle');
    
    if (!themeToggle) return;
    
    // Load saved theme
    const savedTheme = localStorage.getItem('theme') || 'light-mode';
    document.body.classList.add(savedTheme);
    updateThemeIcon(savedTheme);
    
    themeToggle.addEventListener('click', () => {
        const isDark = document.body.classList.toggle('dark-mode');
        const theme = isDark ? 'dark-mode' : 'light-mode';
        
        document.body.classList.remove('light-mode', 'dark-mode');
        document.body.classList.add(theme);
        
        localStorage.setItem('theme', theme);
        updateThemeIcon(theme);
        
        // Update chart colors
        if (skillChart) {
            updateChartTheme(isDark);
        }
    });
}

// ========================================
// CHART INITIALIZATION
// ========================================
function initSkillChart() {
    const chartCanvas = document.getElementById('skillChart');
    if (!chartCanvas) return;
    
    const ctx = chartCanvas.getContext('2d');
    const isDark = document.body.classList.contains('dark-mode');
    const textColor = isDark ? '#e5e7eb' : '#333';
    const gridColor = isDark ? '#374151' : '#e5e7eb';
    
    // Define colors for each skill
    const colors = [
        '#6366f1', // Kiến thức - Indigo
        '#8b5cf6', // Teamwork - Purple
        '#ec4899', // Thái độ - Pink
        '#f59e0b', // Giải quyết - Amber
        '#10b981', // Hiệu suất - Green
        '#06b6d4'  // Tư duy - Cyan
    ];
    
    skillChart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: skillLabels,
            datasets: [
                {
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
                    tension: 0,
                    fill: true
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    borderColor: '#6366f1',
                    borderWidth: 1,
                    padding: 12,
                    cornerRadius: 8,
                    titleFont: { size: 14, weight: 'bold' },
                    bodyFont: { size: 13 },
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + context.parsed.r + '/100';
                        }
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
                        font: {
                            size: 11
                        },
                        stepSize: 20,
                        backdropColor: 'transparent'
                    },
                    grid: {
                        color: gridColor,
                        lineWidth: 1
                    },
                    pointLabels: {
                        color: textColor,
                        font: {
                            size: 13,
                            weight: 'bold'
                        },
                        padding: 15
                    }
                }
            }
        }
    });
}

// ========================================
// INITIALIZATION
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('Skill Chart page loaded');
    
    // Initialize all features
    initThemeToggle();
    initSkillChart();
    
    console.log('All features initialized');
});

