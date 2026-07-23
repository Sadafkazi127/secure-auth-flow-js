if (getToken()) {
  window.location.href = "dashboard.html";
}

const form = document.getElementById("register-form");
const errorBox = document.getElementById("error-box");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  errorBox.classList.add("hidden");

  const password = form.password.value;
  const confirmPassword = form["confirm-password"]
    ? form["confirm-password"].value
    : document.getElementById("confirm-password").value;

  if (password !== confirmPassword) {
    errorBox.textContent = "Passwords do not match";
    errorBox.classList.remove("hidden");
    return;
  }

  const submitBtn = form.querySelector('button[type="submit"]');
  submitBtn.disabled = true;
  submitBtn.textContent = "Creating account...";

  try {
    const data = await apiFetch("/auth/register", {
      method: "POST",
      body: JSON.stringify({
        name: form.name.value.trim(),
        email: form.email.value.trim(),
        password,
      }),
    });

    setToken(data.token);
    window.location.href = "dashboard.html";
  } catch (err) {
    errorBox.textContent = err.message;
    errorBox.classList.remove("hidden");
    submitBtn.disabled = false;
    submitBtn.textContent = "Create account";
  }
});
