document.addEventListener('DOMContentLoaded', () => {
    // Automated Hero Image Slider
    let idx = 0;
    const slides = document.querySelectorAll('.slide-item');
    
    if (slides.length > 0) {
        setInterval(() => {
            slides[idx].classList.remove('active');
            idx = (idx + 1) % slides.length;
            slides[idx].classList.add('active');
        }, 3500);
    }

    // Interactive WhatsApp Quote Calculator Integration
    const calcBtn = document.getElementById('calcBtn');
    if (calcBtn) {
        calcBtn.addEventListener('click', () => {
            const propType = document.getElementById('propType').value;
            const pestType = document.getElementById('pestType').value;
            
            const message = `Hello Absolute Pest Control, I want to book an inspection.\n\nProperty: ${propType}\nPest Issue: ${pestType}\n\nPlease share details and availability for Hebbal, Bengaluru.`;
            const encodedMessage = encodeURIComponent(message);
            
            window.open(`https://wa.me/919663017155?text=${encodedMessage}`, '_blank');
        });
    }
});
