// Kill switch for Google Translate (in case browser cached this file)
document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${location.hostname};`;

document.addEventListener('DOMContentLoaded', () => {
    // Force remove any Google Translate artifacts
    const removeGT = () => {
        document.querySelectorAll('.goog-te-banner-frame, #google_translate_element, .skiptranslate').forEach(e => e.remove());
        if (document.body) {
            document.body.style.top = '0px';
            document.body.style.position = 'static';
        }
    };
    
    removeGT();
    setTimeout(removeGT, 500);
    setTimeout(removeGT, 1000);
    setTimeout(removeGT, 2000);
});
