const canvas = document.getElementById("hero-canvas");
const context = canvas.getContext("2d");
const fadeSection = document.querySelector(".fade-section");
const loader = document.getElementById("loader");

const frameCount = 71;
const animationSpeed = 800; // Text fades by 800px of scroll

// IMPORTANT: Ensure your folder is 'frames' (lowercase) and files are 'frame_0001.webp'
const currentFrame = index => `frames/frame_${index.toString().padStart(4, '0')}.webp`;

const images = [];
let loadedCount = 0;

// Failsafe: Hide loader after 3 seconds even if images fail
setTimeout(() => {
    if (loader.style.display !== 'none') {
        console.warn("Image preloading taking too long - showing site anyway.");
        startApp();
    }
}, 3000);

for (let i = 1; i <= frameCount; i++) {
    const img = new Image();
    img.src = currentFrame(i);
    img.onload = () => {
        loadedCount++;
        if (loadedCount === frameCount) startApp();
    };
    img.onerror = () => {
        console.error("Failed to load:", img.src);
        loadedCount++; // Count it anyway to move the loader along
        if (loadedCount === frameCount) startApp();
    };
    images.push(img);
}

function startApp() {
    loader.style.opacity = "0";
    setTimeout(() => loader.style.display = "none", 500);
    resize();
    render(0);
}

function render(index) {
    const img = images[index];
    if (!img || !img.complete) return;

    context.clearRect(0, 0, canvas.width, canvas.height);
    const canvasRatio = canvas.width / canvas.height;
    const imgRatio = img.width / img.height;
    
    let dW, dH, oW, oH;
    if (canvasRatio > imgRatio) {
        dW = canvas.width;
        dH = canvas.width / imgRatio;
        oW = 0;
        oH = (canvas.height - dH) / 2;
    } else {
        dW = canvas.height * imgRatio;
        dH = canvas.height;
        oW = (canvas.width - dW) / 2;
        oH = 0;
    }
    context.drawImage(img, oW, oH, dW, dH);
}

window.addEventListener("scroll", () => {
    const scrollTop = window.scrollY;
    const progress = Math.min(scrollTop / animationSpeed, 1);
    
    // Animation frame
    const frameIndex = Math.floor(progress * (frameCount - 1));
    requestAnimationFrame(() => render(frameIndex));
    
    // Text fade
    fadeSection.style.opacity = Math.max(1 - (progress * 1.5), 0);
    fadeSection.style.transform = `translateY(-${scrollTop * 0.3}px)`;
});

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener('resize', resize);
