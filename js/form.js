import { INTEGRATION_CONFIG } from "./config.js";

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isValidPhone(value) {
  return /^(?:\+84|0)\d{9,10}$/.test(value.replace(/\s+/g, ""));
}

function isValidTikTokUrl(value) {
  try {
    const url = new URL(value);
    return /tiktok\.com$/i.test(url.hostname) || /tiktok\.com$/i.test(url.host);
  } catch {
    return false;
  }
}

// Keep field state and helper text synchronized with the latest validation result.
function showFieldError(form, name, message) {
  const field = form.elements[name];
  const messageNode = form.querySelector(`[data-error-for="${name}"]`);

  if (field) {
    const hasValue =
      field.type === "checkbox"
        ? field.checked
        : String(field.value || "").trim() !== "";

    field.classList.toggle("is-error", Boolean(message));
    field.classList.toggle("is-success", !message && hasValue);
    field.setAttribute("aria-invalid", String(Boolean(message)));
  }

  if (messageNode) {
    messageNode.textContent = message;
    messageNode.classList.toggle("is-error", Boolean(message));
  }
}

// Read the normalized values once so validation and submit logic use the same shape.
function getFormData(form) {
  return {
    full_name: form.elements.full_name.value.trim(),
    tiktok_link: form.elements.tiktok_link.value.trim(),
    contact_method: form.elements.contact_method.value.trim(),
    content_category: form.elements.content_category.value.trim(),
    phone: form.elements.phone.value.trim(),
    email: form.elements.email.value.trim(),
    consent: form.elements.consent.checked,
  };
}

// Validate only the fields needed for a low-friction TikTok Ads signup flow.
function validateForm(form) {
  const values = getFormData(form);
  const errors = {};

  if (!values.full_name) {
    errors.full_name = "Vui lòng nhập họ và tên.";
  }

  if (!values.tiktok_link) {
    errors.tiktok_link = "Vui lòng nhập link TikTok.";
  } else if (!isValidTikTokUrl(values.tiktok_link)) {
    errors.tiktok_link = "Link TikTok chưa đúng định dạng.";
  }

  if (!values.contact_method) {
    errors.contact_method = "Vui lòng chọn phương thức liên hệ.";
  }

  if (!values.content_category) {
    errors.content_category = "Vui lòng chọn danh mục nội dung.";
  }

  if (!values.phone) {
    errors.phone = "Vui lòng nhập số điện thoại.";
  } else if (!isValidPhone(values.phone)) {
    errors.phone = "Số điện thoại chưa hợp lệ.";
  }

  if (values.email && !isValidEmail(values.email)) {
    errors.email = "Email chưa hợp lệ.";
  }

  if (!values.consent) {
    errors.consent = "Bạn cần đồng ý nhận thông tin từ SADU.";
  }

  return errors;
}

function setButtonLoading(button, isLoading) {
  if (!button) {
    return;
  }

  button.disabled = isLoading;
  button.classList.toggle("is-loading", isLoading);
  button.setAttribute("aria-busy", String(isLoading));
}

function ensureFormStatusNode(form) {
  let statusNode = form.querySelector("[data-form-status]");

  if (statusNode) {
    return statusNode;
  }

  statusNode = document.createElement("div");
  statusNode.className = "form-submit-status";
  statusNode.hidden = true;
  statusNode.setAttribute("data-form-status", "true");
  statusNode.setAttribute("aria-live", "polite");
  form.append(statusNode);

  return statusNode;
}

function showFormStatus(form, message, state = "error") {
  const statusNode = ensureFormStatusNode(form);

  if (!message) {
    statusNode.hidden = true;
    statusNode.textContent = "";
    statusNode.classList.remove("is-error", "is-success");
    return;
  }

  statusNode.hidden = false;
  statusNode.textContent = message;
  statusNode.classList.toggle("is-error", state === "error");
  statusNode.classList.toggle("is-success", state === "success");
}

function buildPayload(values) {
  return {
    ...values,
    consent: values.consent,
    source: "sadu-landing-page",
    page_url: window.location.href,
    submitted_at: new Date().toISOString(),
    user_agent: navigator.userAgent,
  };
}

function extractErrorMessage(text) {
  if (!text) {
    return "Không thể gửi đăng ký lúc này. Vui lòng thử lại sau.";
  }

  if (
    /Exception:|SyntaxError:|Không tìm thấy hàm tập lệnh|Telegram|error/i.test(
      text
    )
  ) {
    return "Kết nối biểu mẫu đã hoạt động nhưng App Script đang lỗi phía máy chủ. Vui lòng kiểm tra lại cấu hình App Script.";
  }

  return "Không thể gửi đăng ký lúc này. Vui lòng thử lại sau.";
}

async function submitToGoogleAppsScript(values) {
  const endpoint = INTEGRATION_CONFIG.form.googleAppsScriptUrl;

  if (!endpoint) {
    return;
  }

  const payload = buildPayload(values);

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const text = await response.text();

    if (!response.ok) {
      throw new Error(extractErrorMessage(text));
    }

    if (/Exception:|SyntaxError:|Không tìm thấy hàm tập lệnh/i.test(text)) {
      throw new Error(extractErrorMessage(text));
    }

    return;
  } catch (error) {
    // Local `file://` previews often hit a CORS wall when posting to Apps Script.
    // In that case, send a fire-and-forget JSON body using a simple content type.
    if (error instanceof TypeError) {
      await fetch(endpoint, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "text/plain;charset=utf-8",
        },
        body: JSON.stringify(payload),
      });
      return;
    }

    throw error;
  }
}

export function setupRegistrationForm({ onSuccess }) {
  const form = document.getElementById("registration-form");
  const submitButton = document.getElementById("submit-button");
  const successMessage = document.getElementById("form-success-message");
  if (!form) {
    return;
  }

  // Run the validation pass and immediately render inline feedback.
  const validateAndRender = () => {
    const errors = validateForm(form);
    Array.from(form.elements)
      .filter((field) => field.name)
      .forEach((field) => {
        showFieldError(form, field.name, errors[field.name] || "");
      });

    return Object.keys(errors).length === 0;
  };

  form.addEventListener("input", (event) => {
    if (event.target?.name) {
      if (successMessage) {
        successMessage.hidden = true;
      }
      showFormStatus(form, "");
      validateAndRender();
    }
  });

  form.addEventListener("change", (event) => {
    if (event.target?.name) {
      if (successMessage) {
        successMessage.hidden = true;
      }
      showFormStatus(form, "");
      validateAndRender();
    }
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!validateAndRender()) {
      const firstError = form.querySelector(".is-error");
      firstError?.focus();
      return;
    }

    setButtonLoading(submitButton, true);
    showFormStatus(form, "");

    try {
      await submitToGoogleAppsScript(getFormData(form));

      showFormStatus(form, "");
      setButtonLoading(submitButton, false);
      form.reset();
      Array.from(form.elements)
        .filter((field) => field.name)
        .forEach((field) => showFieldError(form, field.name, ""));

      if (successMessage) {
        successMessage.hidden = false;
        successMessage.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }

      if (typeof onSuccess === "function") {
        onSuccess();
      }
    } catch (error) {
      setButtonLoading(submitButton, false);
      showFormStatus(
        form,
        error instanceof Error
          ? error.message
          : "Không thể gửi đăng ký lúc này. Vui lòng thử lại sau."
      );
    }
  });
}
