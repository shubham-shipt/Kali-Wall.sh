document.addEventListener("contextmenu", e => e.preventDefault());
document.addEventListener("mousedown", e => {
    if (e.button === 2 || e.button === 1) e.preventDefault();
});

document.addEventListener("keydown", function(event) {
    const key = event.key.toLowerCase();

    if (event.ctrlKey && key === "u") event.preventDefault();
    if (["f12", "escape"].includes(key)) event.preventDefault();
    if (event.ctrlKey && event.shiftKey && ["i","c","j"].includes(key)) event.preventDefault();
    if (event.ctrlKey && ["s","p","o","a","r"].includes(key)) event.preventDefault();
    if (key === "f5") event.preventDefault();
});

document.addEventListener("selectstart", e => e.preventDefault());
document.addEventListener("copy", e => e.preventDefault());
document.addEventListener("cut", e => e.preventDefault());
document.addEventListener("paste", e => e.preventDefault());
document.addEventListener("dragstart", e => e.preventDefault());
