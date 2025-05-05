// Global variables
let activeWindows = [];
let draggedWindow = null;
let startX, startY, windowX, windowY;
let isResizing = false;
let resizeDirection = null;

// Initialize the OS
function initOS() {
    updateClock();
    setInterval(updateClock, 1000);

    // Make windows draggable
    const windowHeaders = document.querySelectorAll('.window-header');
    windowHeaders.forEach(header => {
        header.addEventListener('mousedown', startDrag);
    });

    // Close window when clicking outside
    document.addEventListener('mousedown', (e) => {
        if (!e.target.closest('.window') && !e.target.closest('.start-button') && !e.target.closest('.start-menu')) {
            document.getElementById('start-menu').classList.remove('active');
        }

        if (!e.target.closest('.context-menu')) {
            document.getElementById('context-menu').classList.remove('active');
        }
    });

    // Right click context menu
    document.getElementById('desktop').addEventListener('contextmenu', (e) => {
        e.preventDefault();
        const contextMenu = document.getElementById('context-menu');
        contextMenu.style.left = `${e.clientX}px`;
        contextMenu.style.top = `${e.clientY}px`;
        contextMenu.classList.add('active');
    });

    // Setup window resizing
    setupWindowResizing();

    // Load Edge with a default page
    setTimeout(() => {
        const edgeIframe = document.querySelector('.edge-content');
        edgeIframe.src = 'https://chatgpt.com/'; // Changed back to Bing or another allowed site
    }, 1000);
}

// Setup window resizing
function setupWindowResizing() {
    const resizeHandles = document.querySelectorAll('.window-resize-handle');

    resizeHandles.forEach(handle => {
        handle.addEventListener('mousedown', function (e) {
            e.preventDefault();
            e.stopPropagation();

            isResizing = true;
            resizeDirection = this.classList.contains('bottom-right') ? 'bottom-right' :
                this.classList.contains('bottom') ? 'bottom' : 'right';

            const window = this.closest('.window');
            const rect = window.getBoundingClientRect();

            startX = e.clientX;
            startY = e.clientY;
            windowX = rect.width;
            windowY = rect.height;

            document.addEventListener('mousemove', resizeWindow);
            document.addEventListener('mouseup', stopResize);
        });
    });
}

function resizeWindow(e) {
    if (!isResizing) return;

    const window = document.querySelector('.window:hover');
    if (!window) return;

    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    let newWidth = windowX;
    let newHeight = windowY;

    if (resizeDirection === 'bottom-right' || resizeDirection === 'right') {
        newWidth = windowX + dx;
    }

    if (resizeDirection === 'bottom-right' || resizeDirection === 'bottom') {
        newHeight = windowY + dy;
    }

    // Minimum size constraints
    newWidth = Math.max(newWidth, 300);
    newHeight = Math.max(newHeight, 200);

    window.style.width = `${newWidth}px`;
    window.style.height = `${newHeight}px`;
}

function stopResize() {
    isResizing = false;
    resizeDirection = null;

    document.removeEventListener('mousemove', resizeWindow);
    document.removeEventListener('mouseup', stopResize);
}

// Update clock
function updateClock() {
    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const date = now.toLocaleDateString();
    document.getElementById('time-date').innerHTML = `${time}<br>${date}`;
}

// Toggle start menu
function toggleStartMenu() {
    const startMenu = document.getElementById('start-menu');
    startMenu.classList.toggle('active');
}

// Open app
function openApp(app) {
    // Close start menu if open
    document.getElementById('start-menu').classList.remove('active');

    // Show the window
    const window = document.getElementById(`${app}-window`);
    window.style.display = 'flex';

    // Set initial position if not already positioned
    if (!window.style.left || !window.style.top) {
        window.style.left = `${Math.random() * 200 + 100}px`;
        window.style.top = `${Math.random() * 100 + 50}px`;
    }

    window.style.zIndex = getHighestZIndex() + 1;

    // Add to active windows
    if (!activeWindows.includes(app)) {
        activeWindows.push(app);
    }

    // Update taskbar indicator
    updateTaskbarIndicator(app, true);

    // Bring to front
    bringToFront(app);
}

// Close window
function closeWindow(app) {
    const window = document.getElementById(`${app}-window`);
    window.style.display = 'none';

    // Remove from active windows
    activeWindows = activeWindows.filter(item => item !== app);

    // Update taskbar indicator
    updateTaskbarIndicator(app, false);
}

// Minimize window
function minimizeWindow(app) {
    const window = document.getElementById(`${app}-window`);
    window.style.display = 'none';

    // Update taskbar indicator (still active but minimized)
    updateTaskbarIndicator(app, true);
}

// Maximize window
function maximizeWindow(app) {
    const window = document.getElementById(`${app}-window`);
    if (window.style.width === '90%' && window.style.height === '80%') {
        // Restore
        window.style.width = '';
        window.style.height = '';
        window.style.left = `${Math.random() * 200 + 100}px`;
        window.style.top = `${Math.random() * 100 + 50}px`;
    } else {
        // Maximize
        window.style.width = '90%';
        window.style.height = '80%';
        window.style.left = '5%';
        window.style.top = '10%';
    }
}

// Bring window to front
function bringToFront(app) {
    const window = document.getElementById(`${app}-window`);
    window.style.zIndex = getHighestZIndex() + 1;

    // Update taskbar indicator
    updateTaskbarIndicator(app, true);
}

// Get highest z-index
function getHighestZIndex() {
    const windows = document.querySelectorAll('.window');
    let highest = 100;
    windows.forEach(w => {
        const zIndex = parseInt(w.style.zIndex || '100');
        if (zIndex > highest) highest = zIndex;
    });
    return highest;
}

// Update taskbar indicator
function updateTaskbarIndicator(app, isActive) {
    const taskbarIcon = document.getElementById(`taskbar-${app}`);
    if (taskbarIcon) {
        if (isActive) {
            taskbarIcon.classList.add('active');
        } else {
            taskbarIcon.classList.remove('active');
        }
    }
}

// Window dragging
function startDrag(e) {
    if (e.button !== 0) return; // Only left mouse button
    if (isResizing) return; // Don't drag while resizing

    draggedWindow = e.target.closest('.window');
    startX = e.clientX;
    startY = e.clientY;

    const rect = draggedWindow.getBoundingClientRect();
    windowX = rect.left;
    windowY = rect.top;

    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', stopDrag);

    // Bring to front
    draggedWindow.style.zIndex = getHighestZIndex() + 1;

    // Update taskbar indicator
    const app = draggedWindow.id.replace('-window', '');
    updateTaskbarIndicator(app, true);
}

function drag(e) {
    if (!draggedWindow) return;

    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    draggedWindow.style.left = `${windowX + dx}px`;
    draggedWindow.style.top = `${windowY + dy}px`;
}

function stopDrag() {
    document.removeEventListener('mousemove', drag);
    document.removeEventListener('mouseup', stopDrag);
    draggedWindow = null;
}

// Calculator functions
function appendToDisplay(value) {
    const display = document.getElementById('calc-display');
    if (display.textContent === '0' && value !== '.') {
        display.textContent = value;
    } else {
        display.textContent += value;
    }
}

function clearCalculator() {
    document.getElementById('calc-display').textContent = '0';
}

function backspace() {
    const display = document.getElementById('calc-display');
    if (display.textContent.length === 1) {
        display.textContent = '0';
    } else {
        display.textContent = display.textContent.slice(0, -1);
    }
}

function calculate() {
    const display = document.getElementById('calc-display');
    try {
        // Replace × with * for evaluation
        const expression = display.textContent.replace(/×/g, '*');
        const result = eval(expression);
        display.textContent = result;
    } catch (e) {
        display.textContent = 'Error';
    }
}

// Notification functions
function showNotification(title, message) {
    document.getElementById('notification-title').textContent = title;
    document.getElementById('notification-message').textContent = message;
    document.getElementById('notification').classList.add('active');

    // Auto hide after 5 seconds
    setTimeout(hideNotification, 5000);
}

function hideNotification() {
    document.getElementById('notification').classList.remove('active');
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initOS);