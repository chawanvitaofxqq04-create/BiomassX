// global-translator.js - 100% Concealed Auto-Translation Engine

document.addEventListener('DOMContentLoaded', () => {
    // 1. Inject Extreme Concealment CSS dynamically
    const style = document.createElement('style');
    style.textContent = `
        /* Completely Hide Google Translate UI */
        .goog-te-banner-frame.skiptranslate { display: none !important; }
        body { top: 0px !important; position: static !important; }
        
        /* Hide Tooltips & Highlights */
        #goog-gt-tt, .goog-te-balloon-frame { display: none !important; }
        .goog-text-highlight { background-color: transparent !important; border: none !important; box-shadow: none !important; }
        font { background-color: transparent !important; }
        
        /* Hide the element itself */
        #google_translate_element { display: none !important; }
        
        /* Prevent iframe pushing */
        iframe.goog-te-banner-frame { display: none !important; }
    `;
    document.head.appendChild(style);

    // 2. Setup Hidden Google Translate Element
    const gtDiv = document.createElement('div');
    gtDiv.id = 'google_translate_element';
    document.body.appendChild(gtDiv);

    // 3. Inject Google Translate Script
    window.googleTranslateElementInit = function() {
        new google.translate.TranslateElement({
            pageLanguage: 'th',
            includedLanguages: 'th,en,zh-CN,ja,ko,vi,pt,es,id,de,hi,fr,ru',
            autoDisplay: false
        }, 'google_translate_element');
    };
    
    const gtScript = document.createElement('script');
    gtScript.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    document.head.appendChild(gtScript);

    // 4. Handle Language Selection Dropdowns
    const currentLang = localStorage.getItem('appLanguage') || 'th';
    const langSelectors = document.querySelectorAll('.lang-select');
    
    langSelectors.forEach(selector => {
        // Set initial visual state
        for(let i=0; i<selector.options.length; i++) {
            if(selector.options[i].value === currentLang) {
                selector.selectedIndex = i;
                break;
            }
        }

        // Listen for changes
        selector.addEventListener('change', (e) => {
            const selectedLang = e.target.value;
            localStorage.setItem('appLanguage', selectedLang);
            
            // Map custom codes to Google Translate codes
            let gtLang = selectedLang;
            if (selectedLang === 'kr') gtLang = 'ko';
            if (selectedLang === 'jp') gtLang = 'ja';
            if (selectedLang === 'zh') gtLang = 'zh-CN';
            
            // Set googtrans cookies
            if (gtLang === 'th') {
                document.cookie = 'googtrans=/th/th; path=/';
                document.cookie = `googtrans=/th/th; path=/; domain=${window.location.hostname}`;
            } else {
                document.cookie = `googtrans=/th/${gtLang}; path=/`;
                document.cookie = `googtrans=/th/${gtLang}; path=/; domain=${window.location.hostname}`;
            }
            
            // Reload to apply
            window.location.reload();
        });
    });

    // 5. Aggressive Observer to Ensure Body Stays at Top 0
    const observer = new MutationObserver(() => {
        if (document.body && document.body.style.top !== '0px') {
            document.body.style.top = '0px';
        }
    });
    observer.observe(document.documentElement, { attributes: true, childList: true, subtree: true });
    
    // Also run a few checks
    setTimeout(() => { if(document.body) document.body.style.top = '0px'; }, 500);
    setTimeout(() => { if(document.body) document.body.style.top = '0px'; }, 1500);
});
