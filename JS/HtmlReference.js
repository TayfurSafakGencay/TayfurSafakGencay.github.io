document.addEventListener("DOMContentLoaded", function() {
    // İçerik dosyalarının yollarını tanımlayın
    const sections = {
        'about': '../HTML/Section/About.html',
        'experience': '../HTML/Section/Experience.html',
        'projects': '../HTML/Section/Projects.html',
        'knowledge': '../HTML/Section/UnityKnowledge.html',
        'contact': '../HTML/Section/Contact.html',
    };

    Object.keys(sections).forEach(id => {
        const section = document.getElementById(id);
        if (section)
        {
            fetch(sections[id]).then(response => response.text()).then(data => 
            {
                    section.innerHTML = data;
            }).catch(error => console.error('Error loading content:', error));
        }
    });
});

function openPage(pageId) {
    window.location.href = 'HTML/Modal/' + pageId + '.html';
}