(function () {
  "use strict";

  var tablist = document.querySelector('[role="tablist"]');
  if (!tablist) return;

  var tabs = Array.prototype.slice.call(tablist.querySelectorAll('[role="tab"]'));
  if (!tabs.length) return;

  function activate(tab, focus, forceReveal) {
    tabs.forEach(function (t) {
      var selected = t === tab;
      t.classList.toggle("is-active", selected);
      t.setAttribute("aria-selected", selected ? "true" : "false");
      t.tabIndex = selected ? 0 : -1;

      var panel = document.getElementById(t.getAttribute("aria-controls"));
      if (!panel) return;

      if (selected) {
        panel.hidden = false;
        if (forceReveal) {
          panel.querySelectorAll(".reveal").forEach(function (el) {
            el.classList.add("is-visible");
          });
        }
      } else {
        panel.hidden = true;
      }
    });

    if (focus) tab.focus();
  }

  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      activate(tab, false, true);
    });

    tab.addEventListener("keydown", function (e) {
      var i = tabs.indexOf(tab);
      var next = null;

      if (e.key === "ArrowRight" || e.key === "ArrowDown") next = (i + 1) % tabs.length;
      else if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = (i - 1 + tabs.length) % tabs.length;
      else if (e.key === "Home") next = 0;
      else if (e.key === "End") next = tabs.length - 1;
      else return;

      e.preventDefault();
      activate(tabs[next], true, true);
    });
  });

  activate(tablist.querySelector('[aria-selected="true"]') || tabs[0], false, false);
})();
