let currentSlide = 0;

const images = [
];

function showSlide(index) {
    const sliderImage = document.getElementById('slider-image');
    currentSlide = (index + images.length) % images.length;
    sliderImage.src = images[currentSlide];
}

function changeSlide(direction) {
    showSlide(currentSlide + direction);
}

document.addEventListener("DOMContentLoaded", () => {
    showSlide(currentSlide);
});