(function () {
  "use strict";

  var nav = document.getElementById("nav");
  var toggle = document.getElementById("navToggle");
  var links = document.getElementById("navLinks");

  function onScroll() {
    if (window.scrollY > 12) {
      nav.classList.add("is-scrolled");
    } else {
      nav.classList.remove("is-scrolled");
    }
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  function closeMenu() {
    links.classList.remove("is-open");
    toggle.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  }

  toggle.addEventListener("click", function () {
    var open = links.classList.toggle("is-open");
    toggle.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
  });

  links.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", closeMenu);
  });

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var revealEls = document.querySelectorAll(".reveal");

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  } else {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  }

  var counters = document.querySelectorAll(".stat__num");
  function animateCounter(el) {
    var target = parseInt(el.getAttribute("data-count"), 10) || 0;
    var prefix = el.getAttribute("data-prefix") || "";
    var suffix = el.getAttribute("data-suffix") || "";
    if (reduceMotion) {
      el.textContent = prefix + target.toLocaleString("es-CL") + suffix;
      return;
    }
    var duration = 1600;
    var start = null;
    function tick(ts) {
      if (!start) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = prefix + Math.round(target * eased).toLocaleString("es-CL") + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  if ("IntersectionObserver" in window && !reduceMotion) {
    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { counterObserver.observe(el); });
  } else {
    counters.forEach(animateCounter);
  }

  var form = document.getElementById("leadForm");
  var status = document.getElementById("formStatus");
  var endpoint = form.getAttribute("action");
  var notConfigured = !endpoint || endpoint.indexOf("your-id") !== -1;

  function setStatus(message, type) {
    status.textContent = message;
    status.classList.remove("is-success", "is-error");
    if (type) status.classList.add("is-" + type);
  }

  function validate() {
    var valid = true;
    form.querySelectorAll("input[required], select[required]").forEach(function (field) {
      var ok = field.checkValidity() && field.value.trim() !== "";
      field.classList.toggle("is-invalid", !ok);
      if (!ok) valid = false;
    });
    return valid;
  }

  form.querySelectorAll("input, select").forEach(function (field) {
    field.addEventListener("input", function () {
      if (field.classList.contains("is-invalid") && field.checkValidity()) {
        field.classList.remove("is-invalid");
      }
    });
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    if (!validate()) {
      setStatus("Revisa los campos marcados para continuar.", "error");
      return;
    }

    if (notConfigured) {
      console.warn(
        "[PramTech] Formulario sin configurar: reemplaza el action del <form> por tu endpoint de Formspree (https://formspree.io/f/XXXX)."
      );
      setStatus("¡Gracias! El formulario aún no está conectado. Muy pronto podrás enviar tus datos.", "success");
      form.reset();
      return;
    }

    var button = form.querySelector('button[type="submit"]');
    var originalText = button.textContent;
    button.disabled = true;
    button.textContent = "Enviando...";
    setStatus("", null);

    fetch(endpoint, {
      method: "POST",
      body: new FormData(form),
      headers: { Accept: "application/json" }
    })
      .then(function (response) {
        if (response.ok) {
          setStatus("¡Listo! Te contactaremos muy pronto para tu diagnóstico gratuito.", "success");
          form.reset();
        } else {
          return response.json().then(function (data) {
            throw new Error((data && data.error) || "Error del servidor");
          });
        }
      })
      .catch(function () {
        setStatus("No pudimos enviar el formulario. Escríbenos a hola@pramtech.com.", "error");
      })
      .finally(function () {
        button.disabled = false;
        button.textContent = originalText;
      });
  });
})();
