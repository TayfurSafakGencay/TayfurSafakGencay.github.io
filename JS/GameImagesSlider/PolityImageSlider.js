let currentSlide = 0;

const images = [
    "Images/GameContents/Polity/PolityFarming.jpg",
    "Images/GameContents/Polity/PolityJobs.jpg",
    "Images/GameContents/Polity/PolityDisco.jpg",
    "Images/GameContents/Polity/ClothGif.gif"
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
    showSlide(currentSlide); // İlk resmi göster
});