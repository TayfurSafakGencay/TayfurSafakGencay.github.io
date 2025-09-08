function loadContent(projectName, fileName) {
    const content = document.getElementById('content');
    content.innerHTML = "<p>Yükleniyor...</p>";

    // GitHub Pages kökünü ekle
    const basePath = "/Portfolio"; // <-- kendi repo adını buraya yaz
    const path = `${basePath}/HTML/Contents/${projectName}/${fileName}.html`;

    console.log("Denemeye çalışılan dosya:", path);

    fetch(path)
        .then(response => {
            if (!response.ok) throw new Error("Dosya bulunamadı: " + path);
            return response.text();
        })
        .then(data => {
            content.innerHTML = data;
        })
        .catch(err => {
            content.innerHTML = `<p style="color:red;">Hata: ${err.message}</p>`;
            console.error("Hata detayı:", err);
        });
}
// Toggle başlıklar (alt menü açanlar)
const toggles = document.querySelectorAll('.sidebar li > a.toggle');
toggles.forEach(toggle => {
    toggle.addEventListener('click', function(e) {
        e.preventDefault(); // sayfa yenilenmesini engelle
        const parentLi = this.parentElement;
        parentLi.classList.toggle('open'); // aç/kapa
    });
});

// Normal menü öğeleri (aktif olacaklar)
const normalLinks = document.querySelectorAll('.sidebar li > a:not(.toggle)');
normalLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const parentLi = this.parentElement;

        // Önceden aktif olanı temizle
        document.querySelectorAll('.sidebar li.active').forEach(li => {
            li.classList.remove('active');
        });

        // Yeni tıklananı aktif yap
        parentLi.classList.add('active');
    });
});

// window.addEventListener('DOMContentLoaded', () => {
//     const firstLink = document.querySelector('ul li a[data-file="Introduction"]');
//     if(firstLink) loadContent(currentProject, firstLink.dataset.file, firstLink);
// });