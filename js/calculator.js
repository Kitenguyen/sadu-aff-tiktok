const BONUS_MILESTONES = [
  { revenue: 100000000, bonus: 0, label: "Thưởng đặc biệt" },
  { revenue: 60000000, bonus: 5000000, label: "5.000.000đ" },
  { revenue: 40000000, bonus: 3500000, label: "3.500.000đ" },
  { revenue: 25000000, bonus: 2000000, label: "2.000.000đ" },
  { revenue: 15000000, bonus: 1000000, label: "1.000.000đ" },
  { revenue: 8000000, bonus: 500000, label: "500.000đ" },
  { revenue: 5000000, bonus: 200000, label: "200.000đ" },
];

function formatCurrency(value) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(Math.max(0, value));
}

// Pick the highest bonus tier the current revenue qualifies for.
function getBonusForRevenue(revenue) {
  return (
    BONUS_MILESTONES.find((milestone) => revenue >= milestone.revenue) ?? {
      revenue: 0,
      bonus: 0,
      label: "",
    }
  );
}

// Animate metric changes so the calculator feels responsive without being flashy.
function animateValue(element, nextValue, formatter) {
  const currentValue = Number(element.dataset.value || 0);
  const delta = nextValue - currentValue;
  const duration = 550;
  const start = performance.now();

  const tick = (time) => {
    const progress = Math.min((time - start) / duration, 1);
    const value = currentValue + delta * progress;
    element.textContent = formatter(value);

    if (progress < 1) {
      requestAnimationFrame(tick);
      return;
    }

    element.dataset.value = String(nextValue);
    element.textContent = formatter(nextValue);
  };

  requestAnimationFrame(tick);
}

export function setupCalculator() {
  const form = document.getElementById("calculator-form");
  if (!form) {
    return;
  }

  const modeInputs = Array.from(form.querySelectorAll('input[name="calc_mode"]'));
  const revenueInput = document.getElementById("calc-revenue");
  const ordersInput = document.getElementById("calc-orders");
  const aovInput = document.getElementById("calc-aov");
  const revenueResult = document.getElementById("result-revenue");
  const commissionResult = document.getElementById("result-commission");
  const bonusResult = document.getElementById("result-bonus");
  const totalResult = document.getElementById("result-total");
  const badge = document.getElementById("result-badge");
  const revenuePanel = form.querySelector('[data-calc-panel="revenue"]');
  const ordersPanel = form.querySelector('[data-calc-panel="orders"]');

  // Toggle between revenue input mode and order-based input mode.
  const syncPanels = () => {
    const mode = form.elements.calc_mode.value;
    if (revenuePanel && ordersPanel) {
      revenuePanel.hidden = mode !== "revenue";
      ordersPanel.hidden = mode !== "orders";
    }
  };

  // Recompute the derived values every time the user edits the calculator.
  const updateCalculator = () => {
    const mode = form.elements.calc_mode.value;
    let revenue = Number(revenueInput?.value || 0);

    if (mode === "orders") {
      const orders = Number(ordersInput?.value || 0);
      const averageOrderValue = Number(aovInput?.value || 0);
      revenue = orders * averageOrderValue;
    }

    const commission = revenue * 0.15;
    const milestone = getBonusForRevenue(revenue);
    const bonus = milestone.bonus;
    const total = commission + bonus;

    animateValue(revenueResult, revenue, formatCurrency);
    animateValue(commissionResult, commission, formatCurrency);
    animateValue(bonusResult, bonus, formatCurrency);
    animateValue(totalResult, total, formatCurrency);

    if (!badge) {
      return;
    }

    if (milestone.revenue > 0) {
      badge.hidden = false;
      badge.textContent =
        milestone.bonus > 0
          ? `🔥 Bạn đã đạt mốc thưởng ${milestone.label}`
          : "🔥 Bạn đã chạm mốc thưởng đặc biệt";
      return;
    }

    badge.hidden = true;
  };

  syncPanels();
  updateCalculator();

  modeInputs.forEach((input) => input.addEventListener("change", () => {
    syncPanels();
    updateCalculator();
  }));

  [revenueInput, ordersInput, aovInput].forEach((input) => {
    input?.addEventListener("input", updateCalculator);
  });
}
