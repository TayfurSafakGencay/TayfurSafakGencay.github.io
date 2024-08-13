// main.js

document.addEventListener("DOMContentLoaded", function() {
    // İçerik dosyalarının yollarını tanımlayın
    const sections = {
        'about': '../HTML/Section/About.html',
        // 'services': 'services.html',
        // 'portfolio': 'portfolio.html',
        // 'contact': 'contact.html'
    };

    // Her section için içerik yükleme işlemi
    Object.keys(sections).forEach(id => {
        const section = document.getElementById(id);
        if (section) {
            fetch(sections[id])
                .then(response => response.text())
                .then(data => {
                    section.innerHTML = data;
                })
                .catch(error => console.error('Error loading content:', error));
        }
    });
});
