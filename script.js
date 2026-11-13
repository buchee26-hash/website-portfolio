"use strict";
// Mobile menu
const menuBtn = document.getElementById("menuBtn");
const nav = document.getElementById("nav");
menuBtn.addEventListener("click", function () {
  const open = nav.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", open);
});

// ---------- Academic planner ----------
const taskForm = document.getElementById("taskForm");
if (taskForm) {
  const list = document.getElementById("taskList");
  const counter = document.getElementById("counter");
  let tasks = [];
  try { tasks = JSON.parse(localStorage.getItem("tasks")) || []; } catch (e) { tasks = []; }

  function save() { try { localStorage.setItem("tasks", JSON.stringify(tasks)); } catch (e) {} }

  function render() {
    list.innerHTML = "";
    tasks.forEach(function (t) {
      const li = document.createElement("li");
      if (t.done) li.classList.add("done");
      const box = document.createElement("input");
      box.type = "checkbox"; box.checked = t.done;
      box.setAttribute("aria-label", "Mark " + t.text + " as completed");
      box.addEventListener("change", function () { t.done = box.checked; save(); render(); });
      const span = document.createElement("span");
      span.textContent = t.text;
      if (t.due) { const s = document.createElement("small"); s.textContent = "Due: " + t.due; span.appendChild(s); }
      const del = document.createElement("button");
      del.className = "del"; del.textContent = "Delete";
      del.addEventListener("click", function () { tasks = tasks.filter(function (x) { return x.id !== t.id; }); save(); render(); });
      li.append(box, span, del);
      list.appendChild(li);
    });
    const left = tasks.filter(function (t) { return !t.done; }).length;
    counter.textContent = tasks.length ? left + " of " + tasks.length + " tasks still to do" : "No tasks yet. Add your first one above.";
  }

  taskForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const text = document.getElementById("taskText");
    const due = document.getElementById("taskDue");
    if (!text.value.trim()) { text.classList.add("bad"); text.focus(); return; }
    text.classList.remove("bad");
    tasks.push({ id: Date.now(), text: text.value.trim(), due: due.value, done: false });
    text.value = ""; due.value = "";
    save(); render();
  });
  render();
}

// ---------- Contact form validation ----------
const contactForm = document.getElementById("contactForm");
if (contactForm) {
  const rules = {
    name: function (v) { return v ? "" : "Please enter your name."; },
    email: function (v) {
      if (!v) return "Please enter your email address.";
      return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? "" : "Enter a valid email, like name@example.com.";
    },
    phone: function (v) {
      if (!v) return "Please enter your phone number.";
      return /^\d+$/.test(v) ? "" : "Phone number must contain digits only.";
    },
    message: function (v) { return v ? "" : "Please write a message."; }
  };
  function check(id) {
    const field = document.getElementById(id);
    const msg = rules[id](field.value.trim());
    document.getElementById(id + "Err").textContent = msg;
    field.classList.toggle("bad", msg !== "");
    return msg === "";
  }
  Object.keys(rules).forEach(function (id) {
    document.getElementById(id).addEventListener("blur", function () { check(id); });
  });
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const results = Object.keys(rules).map(check);
    const ok = results.every(Boolean);
    const status = document.getElementById("formStatus");
    status.innerHTML = "";
    if (ok) {
      const p = document.createElement("p");
      p.className = "ok";
      p.textContent = "Thanks, " + document.getElementById("name").value.trim() + "! Your message has been received.";
      status.appendChild(p);
      contactForm.reset();
    }
  });
}
