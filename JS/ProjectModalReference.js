function openModal(modalId)
{
    const contentFile = '../HTML/Modal/' + modalId + '.html';
    
    console.log(`Opening modal with id: ${modalId}`); // Debug log

    // Modal elementini al
    const modal = document.getElementById(modalId);
    if (modal) {
        // Modal içeriğini yükleyin
        fetch(contentFile)
            .then(response => response.text())
            .then(data => {
                modal.innerHTML = data; // İçeriği modal'a yükleyin
                modal.style.display = "flex"; // Modal'ı görünür yapın
            })
            .catch(error => console.error('Error loading content:', error));
    } else {
        console.error(`No modal found with id: ${modalId}`);
    }
}

function closeModal(modalId) {
    console.log(`Closing modal with id: ${modalId}`); // Debug log

    // Modal elementini al
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = "none"; // Modal'ı görünmez yapın
    } else {
        console.error(`No modal found with id: ${modalId}`); // Hata mesajı
    }
}