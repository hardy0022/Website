const canvas = document.getElementById("hero-canvas");
const context = canvas.getContext("2d");
const fadeSection = document.querySelector(".fade-section");
const loader = document.getElementById("loader");

const frameCount = 71;
// ADJUST THIS: Lower = faster animation/fade | Higher = slower
const animationSpeed = 1000; 

const currentFrame = index => `./frames/frame_${index.toString().padStart(4, '0')}.webp`;

const images = [];
let loadedCount = 0;

// Preload
for (let i = 1; i <= frameCount; i++) {
    const img = new Image();
    img.src = currentFrame(i);
    img.onload = () => {
        loadedCount++;
        if (loadedCount === frameCount) {
            startApp();
        }
    };
    images.push(img);
}

function startApp() {
    loader.style.opacity = "0";
    setTimeout(() => loader.style.display = "none", 600);
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    render(0);
}

function render(index) {
    if (images[index]) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        
        // Manual "Cover" Fit logic
        const img = images[index];
        const canvasRatio = canvas.width / canvas.height;
        const imgRatio = img.width / img.height;
        let drawW, drawH, offsetW, offsetH;

        if (canvasRatio > imgRatio) {
            drawW = canvas.width;
            drawH = canvas.width / imgRatio;
            offsetW = 0;
            offsetH = (canvas.height - drawH) / 2;
        } else {
            drawW = canvas.height * imgRatio;
            drawH = canvas.height;
            offsetW = (canvas.width - drawW) / 2;
            offsetH = 0;
        }
        context.drawImage(img, offsetW, offsetH, drawW, drawH);
    }
}

window.addEventListener("scroll", () => {
    const scrollTop = window.scrollY;
    
    // 1. Calculate Progress (0 to 1)
    const progress = Math.min(scrollTop / animationSpeed, 1);
    
    // 2. Update Animation Frame
    const frameIndex = Math.floor(progress * (frameCount - 1));
    requestAnimationFrame(() => render(frameIndex));
    
    // 3. Update Text Opacity & Scale
    // Text fades out completely halfway through the animation (0.5)
    const textOpacity = 1 - (progress * 2); 
    fadeSection.style.opacity = Math.max(textOpacity, 0);
    
    // Optional: Slight zoom out effect as you scroll
    const textScale = 1 - (progress * 0.1);
    fadeSection.style.transform = `scale(${Math.max(textScale, 0.9)})`;
});

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    render(0);
});
