const canvas = document.getElementById("hero-canvas");
const context = canvas.getContext("2d");
const loader = document.getElementById("loader");

const frameCount = 71;
const images = [];
const imagePath = (index) => `./frames/frame_${index.toString().padStart(4, '0')}.webp`;

// 1. Preload Images
let imagesLoaded = 0;

function preloadImages() {
    for (let i = 1; i <= frameCount; i++) {
        const img = new Image();
        img.src = imagePath(i);
        img.onload = () => {
            imagesLoaded++;
            if (imagesLoaded === frameCount) {
                initCanvas();
            }
        };
        images.push(img);
    }
}

// 2. Initialize Canvas & Draw First Frame
function initCanvas() {
    // Set internal resolution
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Hide loader
    loader.style.opacity = "0";
    setTimeout(() => loader.style.display = "none", 500);

    renderFrame(0);
}

// 3. Render Logic
function renderFrame(index) {
    if (images[index]) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw image with "cover" logic manually
        const img = images[index];
        const canvasAspect = canvas.width / canvas.height;
        const imgAspect = img.width / img.height;
        
        let drawWidth, drawHeight, offsetX, offsetY;

        if (canvasAspect > imgAspect) {
            drawWidth = canvas.width;
            drawHeight = canvas.width / imgAspect;
            offsetX = 0;
            offsetY = (canvas.height - drawHeight) / 2;
        } else {
            drawWidth = canvas.height * imgAspect;
            drawHeight = canvas.height;
            offsetX = (canvas.width - drawWidth) / 2;
            offsetY = 0;
        }

        context.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    }
}

// 4. Scroll Event
window.addEventListener("scroll", () => {
    const scrollTop = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const scrollFraction = scrollTop / maxScroll;

    // Map scroll to frame index (0 to 70)
    const frameIndex = Math.min(
        frameCount - 1,
        Math.floor(scrollFraction * frameCount)
    );

    requestAnimationFrame(() => renderFrame(frameIndex));
});

// 5. Handle Resize
window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    // Redraw current position on resize
    const scrollTop = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const frameIndex = Math.floor((scrollTop / maxScroll) * frameCount);
    renderFrame(frameIndex || 0);
});

// Start the process
preloadImages();
