document.addEventListener("mousedown", e => e.preventDefault());
document.addEventListener("contextmenu", e => e.preventDefault());

document.addEventListener("keydown", function(event) {
    const key = event.key.toLowerCase();
    if (event.ctrlKey || event.shiftKey || event.altKey || event.metaKey) event.preventDefault();
    if (["f12", "escape"].includes(key)) event.preventDefault();
    if (event.ctrlKey && key === "u") event.preventDefault();
    if (event.ctrlKey && event.shiftKey && ["i","c","j"].includes(key)) event.preventDefault();
    if (event.ctrlKey && ["s","p","o"].includes(key)) event.preventDefault();
    if (key === "f5" || (event.ctrlKey && key === "r")) event.preventDefault();
});

document.addEventListener("selectstart", e => e.preventDefault());
document.addEventListener("copy", e => e.preventDefault());
document.addEventListener("cut", e => e.preventDefault());
document.addEventListener("paste", e => e.preventDefault());
document.addEventListener("dragstart", e => e.preventDefault());

setInterval(() => {
    const threshold = 200;
    if (window.outerWidth - window.innerWidth > threshold || window.outerHeight - window.innerHeight > threshold) {
        document.body.innerHTML = "";
    }
}, 500);
