const HARD_MODE = true;

document.addEventListener("contextmenu", e => e.preventDefault());
document.addEventListener("mousedown", e => {
  if (HARD_MODE) e.preventDefault();
  else if (e.button === 2 || e.button === 1) e.preventDefault();
}, true);

["selectstart", "copy", "cut", "paste", "dragstart"].forEach(evt =>
  document.addEventListener(evt, e => e.preventDefault())
);

document.addEventListener("keydown", function (event) {
  const key = event.key.toLowerCase();
  if (event.ctrlKey || event.shiftKey || event.altKey || event.metaKey) event.preventDefault();
  const blocked = ["f12", "f11", "f5", "u", "s", "p", "r", "i", "j", "c", "a"];
  if (blocked.includes(key)) event.preventDefault();
});

window.addEventListener("beforeprint", () => {
  document.body.innerHTML = "";
});

document.addEventListener("visibilitychange", () => {
  if (document.hidden) document.body.innerHTML = "";
});

(function () {
  let last = performance.now();
  let threshold = 200;
  setInterval(() => {
    if (
      window.outerWidth - window.innerWidth > threshold ||
      window.outerHeight - window.innerHeight > threshold
    ) {
      document.body.innerHTML = "";
    }
    const now = performance.now();
    if (now - last > 300) document.body.innerHTML = "";
    last = now;
  }, 500);
})();
