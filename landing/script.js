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
  var WHATSAPP_NUMBER = "56961864903";
  var WHATSAPP_URL = "https://wa.me/" + WHATSAPP_NUMBER;
  var REQUIRED_FIELDS = ["negocio", "telefono"];

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
    REQUIRED_FIELDS.forEach(function (name) {
      var field = form.querySelector('[name="' + name + '"]');
      if (!field) return;
      var ok = field.value.trim() !== "";
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
      setStatus("Completa el nombre del negocio y tu WhatsApp para continuar.", "error");
      var firstInvalid = form.querySelector(".is-invalid");
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    function fieldValue(name) {
      var el = form.querySelector('[name="' + name + '"]');
      return el ? el.value.trim() : "";
    }

    var message = [
      "Hola Pramtech, me gustaría agendar un diagnóstico gratuito.",
      "- Nombre de mi negocio: " + fieldValue("negocio"),
      "- Mi WhatsApp de contacto: " + fieldValue("telefono"),
      "- Lo que necesito: " + (fieldValue("descripcion") || "Prefiero conversarlo por WhatsApp")
    ].join("\n");

    var url = WHATSAPP_URL + "?text=" + encodeURIComponent(message);
    window.open(url, "_blank", "noopener");
    form.reset();
    form.querySelectorAll(".is-invalid").forEach(function (field) {
      field.classList.remove("is-invalid");
    });
    setStatus("Abriendo WhatsApp…", "success");
  });

  /* =====================================================
     Demos interactivos (modal)
     ===================================================== */
  var ICON_SPINNER = '<svg class="demo__spinner" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-dasharray="30 50"/></svg>';
  var ICON_CHECK = '<svg class="demo__check" viewBox="0 0 24 24" aria-hidden="true"><path d="m5 13 4 4L19 7" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  function appendUserMessage(chat, text) {
    var msg = document.createElement("div");
    msg.className = "demo__msg demo__msg--user";
    var p = document.createElement("p");
    p.textContent = text;
    msg.appendChild(p);
    chat.appendChild(msg);
    chat.scrollTop = chat.scrollHeight;
  }

  function appendAIMessage(chat, text) {
    var msg = document.createElement("div");
    msg.className = "demo__msg demo__msg--ai";
    var badge = document.createElement("span");
    badge.className = "demo__ia-badge";
    badge.textContent = "IA";
    var p = document.createElement("p");
    p.textContent = text;
    msg.appendChild(badge);
    msg.appendChild(p);
    chat.appendChild(msg);
    chat.scrollTop = chat.scrollHeight;
  }

  function appendTyping(chat) {
    var msg = document.createElement("div");
    msg.className = "demo__msg demo__msg--ai";
    msg.innerHTML =
      '<span class="demo__ia-badge">IA</span>' +
      '<span class="demo__typing" role="status" aria-label="IA escribiendo"><i></i><i></i><i></i></span>' +
      '<span class="demo__typing-label">IA escribiendo…</span>';
    chat.appendChild(msg);
    chat.scrollTop = chat.scrollHeight;
    return msg;
  }

  var DEMOS = {
    inventario: {
      eyebrow: "Control de Inventario",
      title: "Demo: Control de Inventario Inteligente",
      sub: "Simula una venta y observa cómo la IA te avisa antes de que te quedes sin stock.",
      html: function () {
        return '' +
          '<div class="demo__stage">' +
            '<div class="demo__product">' +
              '<div>' +
                '<span class="demo__product-name">Café molido 500g</span>' +
                '<span class="demo__product-sku">SKU · CAF-500 · Bodega principal</span>' +
              '</div>' +
              '<div class="demo__stock">' +
                '<span class="demo__stock-label">Stock actual:</span>' +
                '<strong class="demo__stock-value" data-stock>5</strong>' +
                '<span class="demo__stock-unit"> unidades</span>' +
              '</div>' +
            '</div>' +
            '<div class="demo__alert demo__alert--warn" data-alert hidden>' +
              '<span class="demo__ia-badge">IA</span>' +
              '<div class="demo__alert-body">' +
                '<p>⚠️ Alerta de IA: Stock por debajo del mínimo crítico. ¿Deseas reabastecer automáticamente?</p>' +
                '<div class="demo__alert-actions">' +
                  '<button type="button" class="btn btn--primary btn--sm" data-action="restock">Sí, reabastecer</button>' +
                  '<button type="button" class="btn btn--ghost btn--sm" data-action="dismiss">Ahora no</button>' +
                '</div>' +
              '</div>' +
            '</div>' +
          '</div>' +
          '<div class="demo__actions">' +
            '<button type="button" class="btn btn--primary btn--sm" data-action="sale">Simular Venta</button>' +
          '</div>';
      },
      init: function (root) {
        var stockEl = root.querySelector("[data-stock]");
        var alertEl = root.querySelector("[data-alert]");
        var stock = 5;
        root.addEventListener("click", function (event) {
          var trigger = event.target.closest("[data-action]");
          if (!trigger) return;
          var action = trigger.getAttribute("data-action");

          if (action === "sale") {
            if (stock <= 0) return;
            stock -= 1;
            stockEl.textContent = stock;
            stockEl.classList.remove("is-bump");
            void stockEl.offsetWidth;
            stockEl.classList.add("is-bump");
            if (stock < 5) {
              stockEl.classList.add("is-low");
              alertEl.hidden = false;
            }
          } else if (action === "restock") {
            stock = 5;
            stockEl.textContent = stock;
            stockEl.classList.remove("is-low");
            stockEl.classList.add("is-bump");
            alertEl.hidden = true;
          } else if (action === "dismiss") {
            alertEl.hidden = true;
          }
        });
      }
    },

    ventas: {
      eyebrow: "Ventas Online",
      title: "Demo: Automatización de Ventas Online",
      sub: "Mira cómo un pedido se procesa solo, paso a paso, en segundos.",
      html: function () {
        return '' +
          '<div class="demo__stage">' +
            '<div class="demo__log" data-log>' +
              '<p class="demo__log-empty" data-empty>Sin actividad reciente. Presiona el botón para ver el flujo automático de un pedido.</p>' +
            '</div>' +
          '</div>' +
          '<div class="demo__actions">' +
            '<button type="button" class="btn btn--primary btn--sm" data-action="order">Simular Entrada de Pedido</button>' +
          '</div>';
      },
      init: function (root) {
        var log = root.querySelector("[data-log]");
        var btn = root.querySelector('[data-action="order"]');
        var running = false;
        var steps = [
          "Pedido detectado en la tienda online",
          "Stock actualizado en bodega",
          "Notificación de despacho enviada al cliente"
        ];

        btn.addEventListener("click", function () {
          if (running) return;
          running = true;
          btn.disabled = true;
          btn.textContent = "Procesando pedido…";

          var emptyEl = log.querySelector("[data-empty]");
          if (emptyEl) emptyEl.remove();
          log.querySelectorAll(".demo__step").forEach(function (n) { n.remove(); });

          steps.forEach(function (text, i) {
            setTimeout(function () {
              var step = document.createElement("div");
              step.className = "demo__step is-pending";
              step.innerHTML =
                '<span class="demo__status">' + ICON_SPINNER + ICON_CHECK + '</span>' +
                '<span class="demo__step-text"><strong>' + (i + 1) + '. ' + text + '</strong></span>';
              log.appendChild(step);
            }, i * 1000);

            setTimeout(function () {
              var node = log.querySelectorAll(".demo__step")[i];
              if (node) node.classList.add("is-done");
            }, i * 1000 + 700);
          });

          setTimeout(function () {
            running = false;
            btn.disabled = false;
            btn.textContent = "Simular Entrada de Pedido";
          }, steps.length * 1000 + 700);
        });
      }
    },

    asistente: {
      eyebrow: "Asistente IA",
      title: "Demo: Asistente IA para tu Pyme",
      sub: "Hazle una pregunta a nuestro asistente y mira cómo te responde al instante.",
      html: function () {
        return '' +
          '<div class="demo__stage demo__stage--chat">' +
            '<div class="demo__chat" data-chat>' +
              '<div class="demo__msg demo__msg--ai">' +
                '<span class="demo__ia-badge">IA</span>' +
                '<p>¡Hola! Soy tu asistente PramTech 👋 Pregúntame lo que quieras sobre tu negocio.</p>' +
              '</div>' +
            '</div>' +
          '</div>' +
          '<div class="demo__quick">' +
            '<button type="button" class="demo__chip" data-q="best">¿Cuál es el producto más vendido hoy?</button>' +
            '<button type="button" class="demo__chip" data-q="week">¿Cómo va el rendimiento de la semana?</button>' +
          '</div>';
      },
      init: function (root) {
        var chat = root.querySelector("[data-chat]");
        var chips = root.querySelectorAll("[data-q]");
        var busy = false;
        var labels = {
          best: "¿Cuál es el producto más vendido hoy?",
          week: "¿Cómo va el rendimiento de la semana?"
        };
        var replies = {
          best: "Hoy el que más sale es el Café molido 500g: llevas 23 unidades vendidas, un 18% más que ayer ☕. Te quedan 12 en bodega, así que ojo, quizás quieras pedir más para el fin de semana. ¡Vas muy bien!",
          week: "Tu semana viene mejor que la anterior: las ventas subieron un 15% y el ticket promedio llegó a $12.400 📈. El miércoles fue tu mejor día. Si sigues así, cerrarás el mes con un 12% más que el mes pasado. ¿Te preparo un resumen para mandar a tu equipo?"
        };

        chips.forEach(function (chip) {
          chip.addEventListener("click", function () {
            if (busy) return;
            busy = true;
            var key = chip.getAttribute("data-q");

            chips.forEach(function (c) { c.disabled = true; });
            appendUserMessage(chat, labels[key]);
            var typing = appendTyping(chat);

            setTimeout(function () {
              typing.remove();
              appendAIMessage(chat, replies[key]);
              chips.forEach(function (c) { c.disabled = false; });
              busy = false;
            }, 1400);
          });
        });
      }
    },

    reportes: {
      eyebrow: "Reportes",
      title: "Demo: Reportes que se entienden",
      sub: "Genera una conclusión con IA a partir de tus datos de ventas.",
      html: function () {
        var data = [
          { d: "Lun", h: 42 },
          { d: "Mar", h: 55 },
          { d: "Mié", h: 92, peak: true },
          { d: "Jue", h: 60 },
          { d: "Vie", h: 72 },
          { d: "Sáb", h: 48 },
          { d: "Dom", h: 30 }
        ];
        var bars = data.map(function (item, i) {
          return '<div class="demo__bar-wrap">' +
            '<div class="demo__bar' + (item.peak ? ' demo__bar--peak' : '') + '" style="--h:' + item.h + '%; animation-delay:' + (i * 70) + 'ms"></div>' +
            '<span class="demo__bar-day">' + item.d + '</span>' +
          '</div>';
        }).join("");

        return '' +
          '<div class="demo__stage">' +
            '<div class="demo__chart" data-chart>' + bars + '</div>' +
          '</div>' +
          '<div class="demo__actions">' +
            '<button type="button" class="btn btn--primary btn--sm" data-action="conclusion">Generar Conclusión con IA</button>' +
          '</div>' +
          '<div class="demo__conclusion" data-conclusion hidden>' +
            '<span class="demo__ia-badge">IA</span>' +
            '<p>💡 Conclusión de IA: Tus ventas online aumentaron un 15% los días miércoles. Se recomienda activar promociones automatizadas a mitad de semana.</p>' +
          '</div>';
      },
      init: function (root) {
        var chart = root.querySelector("[data-chart]");
        var conclusion = root.querySelector("[data-conclusion]");
        var btn = root.querySelector('[data-action="conclusion"]');

        btn.addEventListener("click", function () {
          if (btn.disabled) return;
          btn.disabled = true;
          btn.textContent = "Analizando datos…";
          setTimeout(function () {
            chart.classList.add("is-active");
            conclusion.hidden = false;
            btn.textContent = "Conclusión generada ✓";
            btn.disabled = false;
          }, 1100);
        });
      }
    }
  };

  var modal = document.getElementById("demoModal");
  var modalBody = document.getElementById("demoModalBody");
  var lastTrigger = null;

  function openDemo(key) {
    var demo = DEMOS[key];
    if (!demo || !modal || !modalBody) return;

    modalBody.innerHTML = '' +
      '<div class="demo__head">' +
        '<span class="eyebrow">' + demo.eyebrow + '</span>' +
        '<h3 class="demo__title" id="demoModalTitle">' + demo.title + '</h3>' +
        '<p class="demo__sub">' + demo.sub + '</p>' +
      '</div>' +
      '<div class="demo" data-demo-root></div>';

    var root = modalBody.querySelector("[data-demo-root]");
    root.innerHTML = demo.html();
    demo.init(root);

    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("is-locked");

    var closeBtn = modal.querySelector(".modal__close");
    if (closeBtn) closeBtn.focus();
  }

  function closeDemo() {
    if (!modal || !modal.classList.contains("is-open")) return;
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("is-locked");
    if (lastTrigger) lastTrigger.focus();
  }

  if (modal) {
    document.querySelectorAll(".card[data-demo]").forEach(function (card) {
      card.addEventListener("click", function () {
        lastTrigger = card;
        openDemo(card.getAttribute("data-demo"));
      });
      card.addEventListener("keydown", function (event) {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          lastTrigger = card;
          openDemo(card.getAttribute("data-demo"));
        }
      });
    });

    modal.querySelectorAll("[data-close]").forEach(function (node) {
      node.addEventListener("click", closeDemo);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeDemo();
    });
  }

  /* =====================================================
     Asistente Kai: catálogo de servicios + texto libre
     ===================================================== */
  var mascot = document.getElementById("mascot");
  if (mascot) {
    var mascotLog = document.getElementById("mascotLog");
    var mascotChips = document.getElementById("mascotChips");
    var mascotForm = document.getElementById("mascotForm");
    var mascotInput = document.getElementById("mascotInput");
    var mascotFigure = document.getElementById("mascotFigure");
    var mascotClose = document.getElementById("mascotClose");
    var mascotImg = document.getElementById("mascotImg");

    var mascotReduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var mascotNotes = [];

    if (mascotImg) {
      mascotImg.addEventListener("error", function () {
        if (mascotImg.getAttribute("data-fallback")) return;
        mascotImg.setAttribute("data-fallback", "1");
        mascotImg.src = "assets/mascot/akita.svg";
      });
    }

    var MASCOT_SERVICES = [
      {
        key: "inventario",
        label: "Inventario y stock",
        emoji: "📦",
        title: "Control de Inventario Inteligente",
        detail: "Ves tu stock y tu bodega en un solo panel, y la IA te avisa qué pedir antes de que se acabe. Nunca más una venta perdida por falta de producto.",
        keywords: ["inventario", "stock", "producto", "productos", "bodega", "almacen", "existencia", "existencias", "reabastecer", "conteo"]
      },
      {
        key: "ventas",
        label: "Ventas online",
        emoji: "🛒",
        title: "Automatización de Ventas Online",
        detail: "Conecta tus canales y deja que pedidos, recordatorios y respuestas repetitivas se hagan solos. Tú te enfocas en vender, no en copiar y pegar.",
        keywords: ["venta", "ventas", "vender", "pedido", "pedidos", "cliente", "clientes", "tienda", "online", "whatsapp", "instagram", "facebook", "mensaje", "mensajes", "recordatorio", "cobrar", "pago", "pagos"]
      },
      {
        key: "asistente",
        label: "Asistente IA",
        emoji: "🤖",
        title: "Asistente IA para tu Pyme",
        detail: "Pregúntale por tus productos, tus ventas o tu stock en lenguaje normal. Como tener un ayudante siempre disponible que conoce tu negocio.",
        keywords: ["asistente", "ia", "inteligencia", "chat", "chatbot", "bot", "ayudante", "preguntar", "consulta", "consultas", "pregunta"]
      },
      {
        key: "reportes",
        label: "Reportes",
        emoji: "📊",
        title: "Reportes que se entienden",
        detail: "Gráficos claros que te dicen cómo va tu negocio y qué decisión tomar. Información útil en segundos, sin tablas complejas.",
        keywords: ["reporte", "reportes", "grafico", "graficos", "informe", "informes", "estadistica", "estadisticas", "datos", "resumen", "indicador", "indicadores", "balance", "metricas"]
      }
    ];

    function mascotScrollLog() {
      if (mascotLog) mascotLog.scrollTop = mascotLog.scrollHeight;
    }

    function mascotAddMessage(role, text) {
      if (!mascotLog) return null;
      var el = document.createElement("div");
      el.className = "mascot__msg mascot__msg--" + role;
      el.textContent = text;
      mascotLog.appendChild(el);
      mascotScrollLog();
      return el;
    }

    function mascotKai(text, actions) {
      if (!mascotLog) return null;
      var el = document.createElement("div");
      el.className = "mascot__msg mascot__msg--kai";
      var span = document.createElement("span");
      el.appendChild(span);
      mascotLog.appendChild(el);

      function reveal() {
        span.textContent = text;
        if (actions && actions.length) {
          var wrap = document.createElement("div");
          wrap.className = "mascot__actions";
          actions.forEach(function (action) {
            var btn = document.createElement("button");
            btn.type = "button";
            btn.className = "mascot__action" + (action.ghost ? " mascot__action--ghost" : "");
            btn.textContent = action.label;
            btn.addEventListener("click", action.onClick);
            wrap.appendChild(btn);
          });
          el.appendChild(wrap);
        }
        mascotScrollLog();
      }

      if (mascotReduce || !text) {
        reveal();
        return el;
      }
      var typing = document.createElement("span");
      typing.className = "mascot__typing";
      typing.innerHTML = "<i></i><i></i><i></i>";
      span.appendChild(typing);
      mascotScrollLog();
      window.setTimeout(reveal, 420);
      return el;
    }

    function mascotRenderChips(filter) {
      if (!mascotChips) return;
      var f = (filter || "").trim().toLowerCase();
      mascotChips.innerHTML = "";
      var list = MASCOT_SERVICES.filter(function (svc) {
        if (!f) return true;
        var haystack = (svc.label + " " + svc.title + " " + svc.keywords.join(" ")).toLowerCase();
        return haystack.indexOf(f) !== -1;
      });
      if (!list.length) {
        var empty = document.createElement("span");
        empty.className = "mascot__chip is-empty";
        empty.textContent = "No está en el portafolio → lo vamos a sugerir";
        mascotChips.appendChild(empty);
        return;
      }
      list.forEach(function (svc) {
        var chip = document.createElement("button");
        chip.type = "button";
        chip.className = "mascot__chip";
        chip.textContent = svc.emoji + " " + svc.label;
        chip.addEventListener("click", function () {
          mascotAddMessage("user", svc.label);
          mascotShowService(svc);
        });
        mascotChips.appendChild(chip);
      });
    }

    function mascotGoToCard(key) {
      var card = document.querySelector('.card[data-demo="' + key + '"]');
      if (!card) return;
      card.scrollIntoView({ behavior: mascotReduce ? "auto" : "smooth", block: "center" });
      card.classList.add("is-highlight");
      window.setTimeout(function () { card.classList.remove("is-highlight"); }, 1800);
    }

    function mascotShowService(svc) {
      mascotRenderChips("");
      mascotKai(svc.emoji + " " + svc.title + "\n" + svc.detail, [
        { label: "Ir a la tarjeta →", onClick: function () { mascotGoToCard(svc.key); } },
        { label: "Ver demo", ghost: true, onClick: function () {
            mascot.classList.add("is-collapsed");
            if (typeof openDemo === "function") openDemo(svc.key);
          } }
      ]);
    }

    function mascotFindService(text) {
      var t = (text || "").toLowerCase();
      var best = null;
      var bestScore = 0;
      MASCOT_SERVICES.forEach(function (svc) {
        var score = 0;
        if (t.indexOf(svc.label.toLowerCase()) !== -1) score += 3;
        if (t.indexOf(svc.title.toLowerCase()) !== -1) score += 3;
        svc.keywords.forEach(function (word) {
          if (word.length > 2 && t.indexOf(word) !== -1) score += 1;
        });
        if (score > bestScore) { bestScore = score; best = svc; }
      });
      return bestScore > 0 ? best : null;
    }

    function mascotSyncContactForm(reveal) {
      var area = document.getElementById("descripcion");
      var wrap = document.getElementById("descripcionWrapper");
      if (!area || !mascotNotes.length) return;
      area.value = mascotNotes.join("\n\n");
      if (reveal) {
        if (wrap) wrap.hidden = false;
        area.focus({ preventScroll: true });
      }
    }

    function mascotGoToContact() {
      mascotSyncContactForm(true);
      mascot.classList.add("is-collapsed");
      var target = document.getElementById("contacto");
      if (target) target.scrollIntoView({ behavior: mascotReduce ? "auto" : "smooth", block: "start" });
    }

    function mascotHandleText(text) {
      var value = (text || "").trim();
      if (!value) return;
      mascotAddMessage("user", value);
      mascotNotes.push(value);
      mascotSyncContactForm(false);
      var svc = mascotFindService(value);
      if (svc) {
        mascotKai(svc.emoji + " " + svc.title + "\n" + svc.detail, [
          { label: "Ir a contacto", onClick: mascotGoToContact }
        ]);
      } else {
        mascotKai(
          "Lo vamos a sugerir 🙌. Esa solución todavía no está en nuestro portafolio, pero la anotamos y la evaluamos para ti. ¿Quieres contarnos un poco más o prefieres que un humano te contacte?",
          [
            { label: "Ir a contacto", onClick: mascotGoToContact }
          ]
        );
      }
      if (mascotChips) mascotChips.innerHTML = "";
      if (mascotInput) mascotInput.value = "";
    }

    function mascotGreet() {
      mascotKai("¡Hola! Soy Bock 🐾, el asistente de PramTech. ¿Qué necesitas para tu negocio? Elige un servicio o escríbeme lo que buscas.", null);
    }

    if (mascotInput) {
      mascotInput.addEventListener("input", function () {
        mascotRenderChips(mascotInput.value);
      });
    }
    if (mascotForm) {
      mascotForm.addEventListener("submit", function (event) {
        event.preventDefault();
        mascotHandleText(mascotInput ? mascotInput.value : "");
      });
    }
    if (mascotFigure) {
      mascotFigure.addEventListener("click", function () {
        mascot.classList.toggle("is-collapsed");
      });
    }
    if (mascotClose) {
      mascotClose.addEventListener("click", function (event) {
        event.stopPropagation();
        mascot.classList.add("is-collapsed");
      });
    }

    var mascotTicking = false;
    function mascotOnScroll() {
      if (mascotTicking) return;
      mascotTicking = true;
      requestAnimationFrame(function () {
        mascot.classList.toggle("is-compact", window.scrollY > 320);
        mascotTicking = false;
      });
    }
    window.addEventListener("scroll", mascotOnScroll, { passive: true });

    mascotRenderChips("");
    mascot.classList.toggle("is-compact", window.scrollY > 320);
    window.setTimeout(mascotGreet, 900);
    window.setTimeout(function () {
      mascot.classList.add("is-collapsed");
    }, 5000);
  }
})();
