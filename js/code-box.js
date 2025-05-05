(() => {
    // Configuration constants
    // load from assets/images
    const COPY_ICON = '<img src="./assets/images/COPY_ICON.png" alt="Copy" width="16" height="16" onerror="this.onerror=null; this.outerHTML=\'&#x2398;\';" />';
    const SUCCESS_ICON = '<img src="./assets/images/SUCCESS_ICON.png" alt="Success" width="16" height="16" onerror="this.onerror=null; this.outerHTML=\'&#x2713;\';" />';
    const ERROR_ICON = '<img src="./assets/images/ERROR_ICON.png" alt="Error" width="16" height="16" onerror="this.onerror=null; this.outerHTML=\'&#x2717;\';" />';

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