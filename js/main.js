(function () {
  var doc = document.documentElement;
  var header = document.querySelector("[data-header]");
  var toggle = document.querySelector(".menu-toggle");
  var panel = document.querySelector(".nav-panel");
  var email = "hello@gardenofgrowingcounseling.com";
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function markLoaded() {
    doc.classList.add("is-loaded");
    try {
      sessionStorage.setItem("gogc-visited", "1");
    } catch (e) {}
  }

  if (doc.classList.contains("no-loader") || reduceMotion) {
    requestAnimationFrame(markLoaded);
  } else {
    var started = performance.now();
    var finished = false;
    var finish = function () {
      if (finished) return;
      finished = true;
      window.setTimeout(markLoaded, Math.max(0, 1500 - (performance.now() - started)));
    };
    if (document.readyState === "complete") finish();
    else window.addEventListener("load", finish);
    window.setTimeout(finish, 2800);
  }

  var lastY = window.scrollY;
  var parallaxItems = reduceMotion ? [] : Array.prototype.slice.call(document.querySelectorAll("[data-parallax]"));
  var wordBlocks = [];

  function updateHeader(y) {
    if (!header) return;
    header.classList.toggle("is-stuck", y > 24);
    var menuOpen = document.body.classList.contains("menu-open");
    var goingDown = y > lastY + 2;
    var goingUp = y < lastY - 2;
    if (!menuOpen && goingDown && y > 520) header.classList.add("is-hidden");
    else if (goingUp || y <= 520 || menuOpen) header.classList.remove("is-hidden");
  }

  function updateParallax() {
    var vh = window.innerHeight;
    parallaxItems.forEach(function (el) {
      var box = el.parentElement.getBoundingClientRect();
      if (box.bottom < -100 || box.top > vh + 100) return;
      var speed = parseFloat(el.dataset.parallax) || 0.1;
      var offset = (box.top + box.height / 2 - vh / 2) * -speed;
      el.style.transform = "translate3d(0," + offset.toFixed(1) + "px,0)";
    });
  }

  function updateWords() {
    var vh = window.innerHeight;
    wordBlocks.forEach(function (block) {
      var box = block.el.getBoundingClientRect();
      var progress = (vh * 0.86 - box.top) / (box.height + vh * 0.36);
      progress = Math.min(1, Math.max(0, progress));
      var lit = Math.round(progress * block.words.length);
      block.words.forEach(function (word, i) {
        word.classList.toggle("on", i < lit);
      });
    });
  }

  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      var y = window.scrollY;
      updateHeader(y);
      updateParallax();
      updateWords();
      lastY = y;
      ticking = false;
    });
  }

  function splitWords(node) {
    Array.prototype.slice.call(node.childNodes).forEach(function (child) {
      if (child.nodeType === 3) {
        var parts = child.textContent.split(/([ \t\n\r]+)/);
        var frag = document.createDocumentFragment();
        parts.forEach(function (part) {
          if (!part) return;
          if (/^[ \t\n\r]+$/.test(part)) {
            frag.appendChild(document.createTextNode(part));
          } else {
            var span = document.createElement("span");
            span.className = "w";
            span.textContent = part;
            frag.appendChild(span);
          }
        });
        node.replaceChild(frag, child);
      } else if (child.nodeType === 1) {
        splitWords(child);
      }
    });
  }

  if (!reduceMotion) {
    document.querySelectorAll("[data-words]").forEach(function (el) {
      splitWords(el);
      wordBlocks.push({ el: el, words: Array.prototype.slice.call(el.querySelectorAll(".w")) });
    });
  }

  updateHeader(lastY);
  updateParallax();
  updateWords();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);

  function setMenu(open) {
    if (!toggle || !panel) return;
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    document.body.classList.toggle("menu-open", open);

    if (open) {
      if (header) header.classList.remove("is-hidden");
      panel.hidden = false;
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          panel.classList.add("is-open");
        });
      });
      var first = panel.querySelector("a");
      if (first) window.setTimeout(function () { first.focus({ preventScroll: true }); }, 300);
      return;
    }

    panel.classList.remove("is-open");
    var hide = function () {
      if (!panel.classList.contains("is-open")) panel.hidden = true;
      panel.removeEventListener("transitionend", hide);
    };
    panel.addEventListener("transitionend", hide);
    window.setTimeout(hide, 900);
  }

  if (toggle) {
    toggle.addEventListener("click", function () {
      setMenu(toggle.getAttribute("aria-expanded") !== "true");
    });
  }

  if (panel) {
    panel.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        setMenu(false);
      });
    });
  }

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && toggle && toggle.getAttribute("aria-expanded") === "true") {
      setMenu(false);
      toggle.focus();
    }
  });

  window.matchMedia("(min-width: 981px)").addEventListener("change", function (mq) {
    if (mq.matches) setMenu(false);
  });

  document.querySelectorAll("[data-reveal-group]").forEach(function (group) {
    group.querySelectorAll("[data-reveal]").forEach(function (el, index) {
      el.style.setProperty("--d", index * 120 + "ms");
    });
  });

  var revealTargets = document.querySelectorAll("[data-reveal], .reveal-img");
  if ("IntersectionObserver" in window && !reduceMotion) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("in");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );
    revealTargets.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    revealTargets.forEach(function (el) {
      el.classList.add("in");
    });
  }

  var year = document.querySelector("[data-year]");
  if (year) year.textContent = String(new Date().getFullYear());

  var params = new URLSearchParams(window.location.search);
  var focus = params.get("focus");
  var support = document.querySelector("[name='support']");
  if (focus && support) {
    var match = Array.prototype.some.call(support.options, function (option) {
      return option.value === focus;
    });
    if (match) support.value = focus;
  }

  document.querySelectorAll("[data-mail-form]").forEach(function (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      form.dataset.tried = "true";
      var fields = form.querySelectorAll("input, select, textarea");
      var firstBad = null;
      var ok = true;

      fields.forEach(function (field) {
        var wrap = field.closest(".field");
        var valid = field.checkValidity();
        field.setAttribute("aria-invalid", valid ? "false" : "true");
        if (wrap) wrap.classList.toggle("is-invalid", !valid);
        if (!valid) {
          ok = false;
          if (!firstBad) firstBad = field;
        }
      });

      if (!ok) {
        if (firstBad) firstBad.focus();
        return;
      }

      var data = new FormData(form);
      var lines = [];
      data.forEach(function (value, key) {
        var field = form.querySelector("[name='" + key + "']");
        var label = field && field.dataset.label ? field.dataset.label : key;
        lines.push(label + ": " + value);
      });

      var subject = form.dataset.subject || "Message from the website";
      window.location.href =
        "mailto:" + email + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(lines.join("\n"));

      form.hidden = true;
      var head = form.parentElement.querySelector(".form-card-head");
      if (head) head.hidden = true;
      var success = form.parentElement.querySelector("[data-success]");
      if (success) {
        success.hidden = false;
        success.setAttribute("tabindex", "-1");
        success.focus();
      }
    });

    form.addEventListener("input", function (event) {
      if (form.dataset.tried !== "true") return;
      var field = event.target;
      if (!field || !field.closest) return;
      var wrap = field.closest(".field");
      if (!wrap || !field.checkValidity) return;
      var valid = field.checkValidity();
      field.setAttribute("aria-invalid", valid ? "false" : "true");
      wrap.classList.toggle("is-invalid", !valid);
    });
  });
})();
