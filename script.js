document.addEventListener('DOMContentLoaded', () => {
    // Automated Hero Image Slider Logic
    let idx = 0;
    const slides = document.querySelectorAll('.slide-item');
    
    if (slides.length > 0) {
        setInterval(() => {
            slides[idx].classList.remove('active');
            idx = (idx + 1) % slides.length;
            slides[idx].classList.add('active');
        }, 3500);
    }
});
