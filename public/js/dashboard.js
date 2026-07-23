const token = getToken();
if (!token) {
  window.location.href = "index.html";
}

const nameEl = document.getElementById("profile-name");
const emailEl = document.getElementById("profile-email");
const joinedEl = document.getElementById("profile-joined");
const tokenPreviewEl = document.getElementById("token-preview");
const nameInput = document.getElementById("name-input");

if (token && tokenPreviewEl) {
  tokenPreviewEl.textContent =
    token.length > 24 ? `${token.slice(0, 14)}••••••••${token.slice(-8)}` : token;
}

async function loadProfile() {
  try {
    const data = await apiFetch("/auth/me");
    nameEl.textContent = data.user.name;
    emailEl.textContent = data.user.email;
    joinedEl.textContent = new Date(data.user.createdAt).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
    nameInput.value = data.user.name;
  } catch (err) {
    setToken(null);
    window.location.href = "index.html";
  }
}

function showMessage(el, text, isError) {
  el.textContent = text;
  el.className = isError ? "mb-3 text-sm text-red-400" : "mb-3 text-sm text-emerald-400";
  el.classList.remove("hidden");
}

document.getElementById("logout-btn").addEventListener("click", () => {
  setToken(null);
  window.location.href = "index.html";
});

document.getElementById("profile-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const msg = document.getElementById("profile-msg");
  msg.classList.add("hidden");

  try {
    const data = await apiFetch("/user/profile", {
      method: "PUT",
      body: JSON.stringify({ name: nameInput.value.trim() }),
    });
    nameEl.textContent = data.user.name;
    showMessage(msg, "Profile updated.", false);
  } catch (err) {
    showMessage(msg, err.message, true);
  }
});

document.getElementById("password-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const msg = document.getElementById("password-msg");
  msg.classList.add("hidden");

  const currentPassword = document.getElementById("current-password").value;
  const newPassword = document.getElementById("new-password").value;

  try {
    await apiFetch("/user/password", {
      method: "PUT",
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    showMessage(msg, "Password changed successfully.", false);
    event.target.reset();
  } catch (err) {
    showMessage(msg, err.message, true);
  }
});

loadProfile();
