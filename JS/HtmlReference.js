// main.js

document.addEventListener("DOMContentLoaded", function() {
    // İçerik dosyalarının yollarını tanımlayın
    const sections = {
        'about': '../HTML/Section/About.html',
        'experience': '../HTML/Section/Experience.html',
        'projects': '../HTML/Section/Projects.html',
        'contact': '../HTML/Section/Contact.html'
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
