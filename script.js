(function () {
  const recommendations = {
    prenatal: {
      title: "Pre/Postnatal Massage",
      text: "This is the best starting point for prenatal or postnatal body support. The session should focus on hip and low back comfort, gentle positioning, and steady pressure that helps the body relax without pushing too aggressively.",
    },
    sports: {
      title: "Sports Massage",
      text: "This fits active clients, training soreness, and recovery after repeated physical stress. Expect focused work on the main tight areas, deeper pressure when appropriate, and attention to how the body is moving before and after activity.",
    },
    trigger: {
      title: "Trigger Point Therapy",
      text: "This fits neck, shoulder, and back tension that feels specific, stubborn, or knot-like. Expect targeted pressure on restricted points, slower work through tight areas, and a session that is more focused than general relaxation massage.",
    },
    deep: {
      title: "Deep Tissue Massage",
      text: "This fits clients who want firm pressure for deeper muscle tightness. Expect slower pressure, more direct work on dense tissue, and a session aimed at reducing long-term tension rather than light relaxation only.",
    },
    recovery: {
      title: "Muscle Recovery Massage",
      text: "This is a good fit for soreness, fatigue, and regular upkeep. Expect restorative work that supports circulation, mobility, and relaxation while still paying attention to the areas that feel most overworked.",
    },
  };

  const weights = {
    goal: {
      pain:        { trigger: 3, deep: 2, recovery: 1 },
      recovery:    { sports: 3, recovery: 2 },
      pregnancy:   { prenatal: 6 },
      maintenance: { recovery: 3, sports: 1 },
    },
    pressure: {
      light:  { prenatal: 2, recovery: 2, trigger: -1, deep: -2 },
      medium: { recovery: 2, sports: 1 },
      firm:   { sports: 2, trigger: 1, deep: 1 },
      deep:   { deep: 4, trigger: 2, recovery: -1, prenatal: -2 },
    },
    area: {
      neck:      { trigger: 3, deep: 1 },
      shoulders: { trigger: 3, deep: 1 },
      back:      { deep: 2, trigger: 2, sports: 1 },
      hips:      { prenatal: 2, sports: 1, deep: 1 },
      legs:      { sports: 2, recovery: 1, deep: 1 },
      feet:      { recovery: 2, sports: 1 },
    },
    lifestyle: {
      desk:     { trigger: 2, deep: 1, recovery: 1 },
      athlete:  { sports: 3, deep: 1 },
      labor:    { deep: 2, sports: 1, recovery: 1 },
      prenatal: { prenatal: 5 },
    },
  };

  const priority = ["prenatal", "sports", "trigger", "deep", "recovery"];

  function getRecommendation(answers) {
    const scores = { prenatal: 0, sports: 0, trigger: 0, deep: 0, recovery: 0 };

    for (const field of ["goal", "pressure", "area", "lifestyle"]) {
      const bucket = weights[field] && weights[field][answers[field]];
      if (!bucket) continue;
      for (const key in bucket) {
        scores[key] += bucket[key];
      }
    }

    let best = priority[0];
    for (const key of priority) {
      if (scores[key] > scores[best]) best = key;
    }

    return recommendations[best];
  }

  function readQuiz(form) {
    return {
      goal: form.goal.value,
      pressure: form.pressure.value,
      area: form.area.value,
      lifestyle: form.lifestyle.value,
    };
  }

  function showRecommendation(event) {
    event.preventDefault();

    const form = event.currentTarget;
    const result = getRecommendation(readQuiz(form));
    const output = document.querySelector("[data-quiz-result]");

    output.hidden = false;
    output.querySelector("h3").textContent = result.title;
    output.querySelector("p:last-child").textContent = result.text;
  }

  document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("[data-quiz]");

    if (form) {
      form.addEventListener("submit", showRecommendation);
    }
  });

  window.SkyQuiz = {
    getRecommendation,
  };
})();
