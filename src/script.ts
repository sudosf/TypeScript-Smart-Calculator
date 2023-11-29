
/* Darkmode Toggle */
const sunMoonContainer = document.querySelector(".sun-moon-container") as HTMLElement;

const toggleBtn = document.querySelector(".theme-toggle-button") as HTMLElement;

toggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    
    const currentRotation: number = parseInt(
        getComputedStyle(sunMoonContainer).getPropertyValue("--rotation")
    );
    sunMoonContainer.style.setProperty("--rotation", (currentRotation + 180).toString());
});
