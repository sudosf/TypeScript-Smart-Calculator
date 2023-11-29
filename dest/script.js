"use strict";
const sunMoonContainer = document.querySelector(".sun-moon-container");
const toggleBtn = document.querySelector(".theme-toggle-button");
toggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    const currentRotation = parseInt(getComputedStyle(sunMoonContainer).getPropertyValue("--rotation"));
    sunMoonContainer.style.setProperty("--rotation", (currentRotation + 180).toString());
});
