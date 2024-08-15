function StopVideo(){
    const iframe = document.getElementById('video');
    if (iframe) {
        const iframeSrc = iframe.src;
        iframe.src = '';
        iframe.src = iframeSrc; 
    }
}