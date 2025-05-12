(() => {
    // Configuration constants
    // load from assets/images
    const COPY_ICON = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6"><path fill-rule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clip-rule="evenodd" /></svg>';;
    const SUCCESS_ICON = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6"><path fill-rule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clip-rule="evenodd" /></svg>';
    const ERROR_ICON = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6"><path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06l3 3a.75.75 0 001.06 0l3-3a.75.75 0 00-1.06-1.06L12 11.44l-1.72-2.22z" clip-rule="evenodd" /></svg>';
    
    const RESET_DELAY = 2000;

    // Main initialization
    document.addEventListener('DOMContentLoaded', () => {
        initializeCodeBlocks();
        initializeCopyButtons();
    });

    function initializeCodeBlocks() {
        document.querySelectorAll('.code-container').forEach(container => {
            addLineNumbers(container);
        });
    }

    function initializeCopyButtons() {
        document.querySelectorAll('.copy-button').forEach(button => {
            button.addEventListener('click', handleCopyClick);
            button.setAttribute('aria-label', 'Copy code');
            button.innerHTML = COPY_ICON;
        });
    }

    function handleCopyClick(event) {
        const button = event.currentTarget;
        const codeContent = button.closest('.code-box')?.querySelector('.code-content');
        
        if (!codeContent) {
            showFeedback(button, 'Code content not found', false);
            return;
        }

        copyToClipboard(getPlainText(codeContent))
            .then(() => showFeedback(button, 'Copied!', true))
            .catch(() => showFeedback(button, 'Failed to copy', false));
    }

    function copyToClipboard(text) {
        if (!navigator.clipboard) {
            return Promise.reject('Clipboard API not supported');
        }
        return navigator.clipboard.writeText(text);
    }

    function showFeedback(button, message, isSuccess) {
        button.innerHTML = isSuccess ? SUCCESS_ICON : ERROR_ICON;
        button.setAttribute('aria-label', message);
    
        // Create an aria-live region for screen reader feedback
        const feedbackElement = document.createElement('div');
        feedbackElement.setAttribute('aria-live', 'polite');
        feedbackElement.style.position = 'absolute';
        feedbackElement.style.left = '-9999px';
        feedbackElement.textContent = message;
        document.body.appendChild(feedbackElement);
    
        setTimeout(() => {
            button.innerHTML = COPY_ICON;
            button.setAttribute('aria-label', 'Copy code');
            document.body.removeChild(feedbackElement);
        }, RESET_DELAY);
    }

    function getPlainText(element) {
        const clonedElement = element.cloneNode(true);
        clonedElement.querySelectorAll('span').forEach(span => {
            span.replaceWith(...span.childNodes);
        });
        return clonedElement.textContent?.trim() || '';
    }

    function addLineNumbers(container) {
        const codeElement = container.querySelector('code');
        if (!codeElement) {
            console.error('Code element not found in container:', container);
            return;
        }
    
        const plainText = getPlainText(codeElement);
        const lines = plainText.split('\n');
        if (lines.length < 2) return;
    
        container.dataset.lineNumbers = lines.map((_, i) => i + 1).join('\n');
        container.classList.add('with-line-numbers');
    }
})();