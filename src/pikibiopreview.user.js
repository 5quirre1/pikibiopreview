// ==UserScript==
// @name         pikibiopreview
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  adds a realtime bio preview to the settings page!!
// @author       @squirrel
// @match        https://pikidiary.lol/settings
// @require      https://raw.githubusercontent.com/5quirre1/pbbcode-decode/main/src/bbcode.js
// @grant        none
// ==/UserScript==
(function() {
    'use strict';

    function waitForElements() {
        const bioTextarea = document.getElementById('bio');
        const barCont = document.querySelector('.bar-cont');

        if (bioTextarea && barCont) {
            createPreviewContainer(bioTextarea, barCont);
        } else {
            setTimeout(waitForElements, 500);
        }
    }

    function createPreviewContainer(bioTextarea, barCont) {
        const previewBar = document.createElement('div');
        previewBar.className = 'bar';

        const infoContainer = document.createElement('div');
        infoContainer.className = 'info';

        const previewContainer = document.createElement('div');
        previewContainer.className = 'bio';
        previewContainer.id = 'bio-preview';

        const previewLabel = document.createElement('small');
        previewLabel.textContent = 'Bio Preview:';
        previewLabel.style.cssText = `
            display: block;
            margin-bottom: 6px;
            font-size: 11px;
            color: #666;
        `;

        infoContainer.appendChild(previewLabel);
        infoContainer.appendChild(previewContainer);
        previewBar.appendChild(infoContainer);

        barCont.appendChild(previewBar);

        function updatePreview() {
            const bbcodeText = bioTextarea.value;
            try {
                if (!window.formatContentWithBBCode || typeof window.formatContentWithBBCode !== 'function') {
                    throw new Error('pbbcode parser not loaded');
                }
                const htmlContent = window.formatContentWithBBCode(bbcodeText);
                previewContainer.innerHTML = htmlContent;
            } catch (error) {
                console.error('pbbcode parsing error:', error);
                previewContainer.textContent = "failed to parse :(";
            }
        }

        updatePreview();

        bioTextarea.addEventListener('input', updatePreview);
        bioTextarea.addEventListener('paste', () => {
            setTimeout(updatePreview, 10);
        });

        console.log('pikibiopreview started!11 enjoy :D');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', waitForElements);
    } else {
        waitForElements();
    }
})();
