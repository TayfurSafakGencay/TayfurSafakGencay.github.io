function LoadModals(){
    document.addEventListener("DOMContentLoaded", function() {
        const contentFiles = {
            'TileBustersCloneModal': '../HTML/Modal/TileBustersCloneModal.html',
            'RoyalMatchCloneModal': '../HTML/Modal/RoyalMatchCloneModal.html',
        };
        Object.keys(contentFiles).forEach(id => {
            const contentDiv = document.getElementById(id);
            if (contentDiv)
            {
                fetch(contentFiles[id]).then(response => response.text()).then(data =>
                {
                    contentDiv.innerHTML = data;
                }).catch(error => console.error('Error loading content:', error));
            } else
            {
                console.error(`No element found with id: ${id}`);
            }
        });
    });
}

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