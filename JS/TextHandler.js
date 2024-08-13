const strings = {
    welcome: "Hoş geldiniz!",
    about: "Bu, hakkında kısmının içeriğidir.",
};

function insertText(key, elementId) {
    const text = strings[key];
    const element = document.getElementById(elementId);
    if (element && text) {
        element.textContent = text;
    } else {
        console.error(`Anahtar "${key}" bulunamadı veya element "${elementId}" mevcut değil.`);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    insertText('welcome', 'welcome');
    insertText('about', 'about');
});
// Örnek kullanım

