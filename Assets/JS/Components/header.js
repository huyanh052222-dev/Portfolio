const container = document.querySelector(".search-input-container");
const input = document.querySelector(".search-input");
const icon = document.querySelector(".search-icon");

icon.addEventListener("click", (e) => {
    e.stopPropagation();
    input.classList.toggle("active");
    if (input.classList.contains("active")) {
        input.focus();
    } 
    else {
        input.blur();
    }
});

document.addEventListener("click", (e) => {
    if (!e.target.closest(".search-input-container")) {
        input.classList.remove("active");
    }
});
