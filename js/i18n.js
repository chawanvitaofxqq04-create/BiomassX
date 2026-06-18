// i18n.js - Native Auto-DOM Translation System

const originalTexts = new WeakMap();

document.addEventListener('DOMContentLoaded', () => {
    // Initialize language from localStorage or default to 'th'
    const currentLang = localStorage.getItem('appLanguage') || 'th';
    
    // Set the dropdowns to the current language
    const langSelectors = document.querySelectorAll('.lang-select');
    langSelectors.forEach(selector => {
        for(let i=0; i<selector.options.length; i++) {
            if(selector.options[i].value === currentLang) {
                selector.selectedIndex = i;
                break;
            }
        }

        // Handle language change
        selector.addEventListener('change', (e) => {
            const selectedLang = e.target.value;
            localStorage.setItem('appLanguage', selectedLang);
            
            // Sync all other selectors on the page
            langSelectors.forEach(s => s.value = selectedLang);
            
            // Apply translations to DOM
            applyTranslations(selectedLang);

            // Re-render dynamic content if function exists (e.g., in index.html)
            if (typeof window.renderDynamicContent === 'function') {
                window.renderDynamicContent();
            }
        });
    });

    // Wipe Google Translate cookies permanently to avoid native browser translation prompts
    document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;

    // Apply translations on initial load
    if (currentLang !== 'th') {
        applyTranslations(currentLang);
    }

    // Observe DOM for dynamically added elements (like Supabase data)
    const observer = new MutationObserver((mutations) => {
        let shouldTranslate = false;
        for (let mutation of mutations) {
            if (mutation.addedNodes.length > 0) {
                // Check if added nodes contain text nodes
                for (let i = 0; i < mutation.addedNodes.length; i++) {
                    const node = mutation.addedNodes[i];
                    if (node.nodeType === Node.ELEMENT_NODE || node.nodeType === Node.TEXT_NODE) {
                        shouldTranslate = true;
                        break;
                    }
                }
            }
            if (shouldTranslate) break;
        }
        
        if (shouldTranslate) {
            const lang = localStorage.getItem('appLanguage') || 'th';
            if (lang !== 'th') {
                applyTranslations(lang);
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
});

function applyTranslations(lang) {
    // Translate all Text Nodes
    walkDOMAndTranslate(document.body, lang);
    
    // Translate placeholders
    translatePlaceholders(lang);
}

function walkDOMAndTranslate(node, lang) {
    if (node.nodeName === 'SCRIPT' || node.nodeName === 'STYLE' || node.nodeName === 'NOSCRIPT') return;
    
    if (node.nodeType === Node.TEXT_NODE) {
        let text = node.textContent.trim();
        if (text === '') return;
        
        // Save original text if not saved yet
        if (!originalTexts.has(node)) {
            // Clean up excessive whitespaces for key lookup but keep original formatting
            originalTexts.set(node, text.replace(/\s+/g, ' '));
            // Store the exact original string to preserve whitespace when restoring
            node._originalExactText = node.textContent;
        }
        
        let originalKey = originalTexts.get(node);
        
        if (lang === 'th') {
            // Restore original Thai text
            if (node.textContent !== node._originalExactText) {
                node.textContent = node._originalExactText;
            }
        } else {
            let dict = window.translations[lang];
            let enDict = window.translations['en'];
            
            let translatedText = originalKey; // fallback
            
            if (dict && dict[originalKey]) {
                translatedText = dict[originalKey];
            } else if (enDict && enDict[originalKey]) {
                translatedText = enDict[originalKey];
            }

            if (translatedText !== originalKey) {
                // Replace the text but keep surrounding whitespaces
                node.textContent = node._originalExactText.replace(originalKey, translatedText).replace(originalKey.replace(/\s+/g, ' '), translatedText);
            } else if (node.textContent !== node._originalExactText) {
                 // Restore if no translation found
                 node.textContent = node._originalExactText;
            }
        }
    } else {
        node.childNodes.forEach(child => walkDOMAndTranslate(child, lang));
    }
}

function translatePlaceholders(lang) {
    document.querySelectorAll('input, textarea').forEach(el => {
        if (el.placeholder) {
             if (!originalTexts.has(el)) originalTexts.set(el, el.placeholder.trim());
             let originalKey = originalTexts.get(el);
             
             if (lang === 'th') {
                 el.placeholder = originalKey;
             } else {
                 let dict = window.translations[lang];
                 let enDict = window.translations['en'];
                 
                 let translatedText = originalKey;
                 if (dict && dict[originalKey]) translatedText = dict[originalKey];
                 else if (enDict && enDict[originalKey]) translatedText = enDict[originalKey];
                 
                 el.placeholder = translatedText;
             }
        }
    });
}

// Global translation function for dynamic JS content
window.t = function(key) {
    const lang = localStorage.getItem('appLanguage') || 'th';
    if (lang === 'th') return key;
    
    let dict = window.translations[lang];
    if (dict && dict[key]) return dict[key];
    
    let enDict = window.translations['en'];
    if (enDict && enDict[key]) return enDict[key];
    
    return key;
};
