        // --- FOLLOWER LOGIC (GLOBAL SCOPE) ---
        const follower = document.getElementById('follower');
        const body = document.body;

        /**
         * Updates the position of the follower div to match the mouse cursor's coordinates.
         * @param {MouseEvent} e - The mouse event object.
         */
        function updateFollowerPosition(e) {
            // Ensure follower exists before trying to style it
            if (follower) {
                follower.style.left = `${e.clientX}px`;
                follower.style.top = `${e.clientY}px`;
            }
        }

        // Event listener for mouse movement across the entire body
        if (body && follower) { // Add checks
            body.addEventListener('mousemove', (e) => {
                updateFollowerPosition(e);
                follower.style.opacity = '1';
                follower.style.transform = 'translate(-50%, -50%) scale(1)';
                follower.style.display = 'block';
            });

            // Event listener for when the mouse leaves the body
            body.addEventListener('mouseleave', () => {
                follower.style.opacity = '0';
                follower.style.transform = 'translate(-50%, -50%) scale(0.1)';
            });

            // Event listener for when the mouse re-enters the body
            body.addEventListener('mouseenter', (e) => {
                follower.style.opacity = '1';
                follower.style.transform = 'translate(-50%, -50%) scale(1)';
                follower.style.display = 'block';
                updateFollowerPosition(e);
            });

            // Event listener for mouse button press
            body.addEventListener('mousedown', () => {
                follower.style.transform = 'translate(-50%, -50%) scale(0.8)';
            });

            // Event listener for mouse button release
            body.addEventListener('mouseup', () => {
                follower.style.transform = 'translate(-50%, -50%) scale(1.2)';
                setTimeout(() => {
                    follower.style.transform = 'translate(-50%, -50%) scale(1)';
                }, 100);
            });
        }
        // --- END GLOBAL FOLLOWER LOGIC ---


        document.addEventListener('DOMContentLoaded', () => {
            // --- DIAMOND GRID LOGIC ---
            const gridContainer = document.getElementById('diamond-grid-background');
            if (gridContainer) {
                const styles = getComputedStyle(document.documentElement);
                // Ensure these CSS variables are defined, otherwise parseFloat will return NaN
                const diamondVisualSizeProp = styles.getPropertyValue('--diamond-visual-size');
                const gapSizeProp = styles.getPropertyValue('--gap-size');

                if (diamondVisualSizeProp && gapSizeProp) {
                    const diamondVisualSize = parseFloat(diamondVisualSizeProp.replace('px', ''));
                    const gapSize = parseFloat(gapSizeProp.replace('px', ''));
                    const cellTotalSize = diamondVisualSize + gapSize;

                    function createDiamonds() {
                        if (!gridContainer) return; // Ensure gridContainer still exists
                        gridContainer.innerHTML = '';
                        const containerWidth = gridContainer.offsetWidth;
                        const containerHeight = gridContainer.offsetHeight;
                        const numCols = Math.ceil(containerWidth / cellTotalSize) + 1;
                        const numRows = Math.ceil(containerHeight / cellTotalSize) + 1;
                        const totalDiamonds = numCols * numRows;
                        const fragment = document.createDocumentFragment();
                        for (let i = 0; i < totalDiamonds; i++) {
                            const diamond = document.createElement('div');
                            diamond.classList.add('diamond');
                            fragment.appendChild(diamond);
                        }
                        gridContainer.appendChild(fragment);
                    }

                    function debounce(func, delay) {
                        let timeout;
                        return function(...args) {
                            clearTimeout(timeout);
                            timeout = setTimeout(() => func.apply(this, args), delay);
                        };
                    }
                    const debouncedCreateDiamonds = debounce(createDiamonds, 250);
                    createDiamonds();
                    window.addEventListener('resize', debouncedCreateDiamonds);
                }
            }
            // --- END DIAMOND GRID LOGIC ---


            // --- PROFILE IMAGE APPEAR AND POP LOGIC ---
            const profileImages = document.querySelectorAll('.profile-image');
            if (profileImages.length > 0) {
                const appearObserverOptions = {
                    root: null,
                    rootMargin: '0px',
                    threshold: 0.1
                };

                const appearObserver = new IntersectionObserver((entries, observer) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add('has-appeared');
                            observer.unobserve(entry.target);
                        }
                    });
                }, appearObserverOptions);

                profileImages.forEach(image => {
                    appearObserver.observe(image);

                    image.addEventListener('click', function() {
                        this.classList.remove('is-popping');
                        void this.offsetHeight;
                        this.classList.add('is-popping');
                    });

                    image.addEventListener('animationend', function(event) {
                        if (event.animationName === 'popOnClick') {
                            this.classList.remove('is-popping');
                        }
                    });
                });
            }
            // --- END PROFILE IMAGE LOGIC ---


            // --- START: MAIN TITLE POP ON CLICK LOGIC ---
            const mainTitles = document.querySelectorAll('.main-title');
            if (mainTitles.length > 0) {
                mainTitles.forEach(title => {
                    title.addEventListener('click', function() {
                        this.classList.remove('is-popping');
                        void this.offsetHeight; // Force reflow to restart animation if clicked again quickly
                        this.classList.add('is-popping');
                    });

                    // Listen for the end of the 'popOnClickTitle' animation to remove the class
                    title.addEventListener('animationend', function(event) {
                        // Ensure we're reacting to the correct animation defined in your CSS
                        if (event.animationName === 'popOnClickTitle') {
                            this.classList.remove('is-popping');
                        }
                    });
                });
            }
            // --- END: MAIN TITLE POP ON CLICK LOGIC ---

            // --- UPDATED JAVASCRIPT FOR HOVER EFFECT ON FLOATING SQUARES ---
            const contactLinks = document.querySelectorAll('.contact-link');
            const floatingSquares = document.querySelectorAll('.floating-square');

            // Map image names to their respective uploaded file paths
            // IMPORTANT: These paths assume the images are directly accessible by filename.
            // If they are served from a specific directory or require a full URL,
            // you'll need to update these paths accordingly.
            const imageMap = {
                'instagram.png': 'instagram.png', // Replace with actual path if different
                'tiktok.png': 'tiktok.png',     // Replace with actual path if different
                'youtube.png': 'youtube.png'      // Replace with actual path if different
            };

            contactLinks.forEach(link => {
                // Get the image path from the data-image attribute of the hovered link
                const linkImageName = link.dataset.image; // Gets 'instagram.png', 'github.png', etc.
                const imagePath = imageMap[linkImageName]; // Resolves to the actual image path

                link.addEventListener('mouseenter', () => {
                    floatingSquares.forEach(square => {
                        if (imagePath) { // Only apply if a valid image path is found
                            square.style.backgroundImage = `url(${imagePath})`;
                            square.style.backgroundSize = 'cover';
                            square.style.backgroundRepeat = 'no-repeat';
                            square.style.backgroundPosition = 'center';
                            square.style.backgroundAttachment = 'fixed';
                            square.style.boxshadow = 'none';
                        }
                    });
                });

                link.addEventListener('mouseleave', () => {
                    floatingSquares.forEach(square => {
                        square.style.backgroundImage = 'none'; // Revert to no background image
                    });
                });
            });
        });