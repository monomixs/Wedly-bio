document.addEventListener('DOMContentLoaded', () => {
    const loadingScreen = document.getElementById('loadingScreen');
    const bodyElement = document.body;

    if (loadingScreen && bodyElement.classList.contains('loading-active')) {
        // Determine loading duration: 1.5s or 0.8s (50% chance)
        const isShortDuration = Math.random() < 0.5;
        const duration = isShortDuration ? 800 : 1500; // 800ms or 1500ms

        setTimeout(() => {
            loadingScreen.classList.add('fade-out'); // Trigger fade-out animation

            // Wait for fade-out animation to complete before setting display to none
            loadingScreen.addEventListener('transitionend', (event) => {
                // Ensure we're reacting to the opacity transition specifically,
                // and that it has indeed faded out.
                if (event.propertyName === 'opacity' && getComputedStyle(loadingScreen).opacity === '0') {
                    loadingScreen.style.display = 'none'; // Remove from layout
                }
            }, { once: true }); // Listener fires once

            // Remove loading-active class and add loaded class to trigger content appearance
            bodyElement.classList.remove('loading-active');
            bodyElement.classList.add('loaded');

        }, duration);
    } else if (loadingScreen) {
        // Fallback: if body isn't in loading state, just ensure loading screen is hidden
        loadingScreen.style.display = 'none';
        bodyElement.classList.remove('loading-active'); // Ensure this is also removed
        bodyElement.classList.add('loaded'); // Ensure content shows
    } else {
        // If there's no loading screen, ensure body is in loaded state
        bodyElement.classList.remove('loading-active');
        bodyElement.classList.add('loaded');
    }
});

document.addEventListener('contextmenu', function(event) {
  event.preventDefault();
});