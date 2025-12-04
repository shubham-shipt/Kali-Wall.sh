document.addEventListener("mousedown", e => e.preventDefault());
document.addEventListener("contextmenu", e => e.preventDefault());

["copy", "cut", "paste", "dragstart", "selectstart"].forEach(evt =>
  document.addEventListener(evt, e => e.preventDefault())
);

window.addEventListener("beforeprint", e => {
  document.body.innerHTML = "";
});

document.addEventListener("keydown", function(event) {
  const key = event.key.toLowerCase();
  if (event.ctrlKey || event.shiftKey || event.altKey || event.metaKey) event.preventDefault();
  if (event.ctrlKey && ["s"].includes(key)) event.preventDefault();
  if (event.ctrlKey && event.shiftKey && key === "s") event.preventDefault();
  if (event.ctrlKey && key === "u") event.preventDefault();
  if (["f12","escape"].includes(key)) event.preventDefault();
  if (event.ctrlKey && event.shiftKey && ["i","c","j"].includes(key)) event.preventDefault();
  if (event.ctrlKey && ["p","o","a","x","h","l"].includes(key)) event.preventDefault();
  if (event.ctrlKey && key === "r") event.preventDefault();
});

setInterval(() => {
  let t = 200;
  if (window.outerWidth - window.innerWidth > t || window.outerHeight - window.innerHeight > t) {
    document.body.innerHTML = "";
  }
}, 500);

document.addEventListener("visibilitychange", function() {
  if (document.hidden) {
    document.body.innerHTML = "";
  }
});

