window.addEventListener("load", () => {
    const loadingScreen = document.querySelector(".loading-screen");

    // Hide the loading screen after 3.7 seconds (adjust time if needed)
    setTimeout(() => {
        loadingScreen.classList.add("hide"); // Hide after 2.7 seconds
    }, 2750); // 3750ms = 2.7 seconds
});


document.addEventListener("DOMContentLoaded", function () {
    // Toggle sidebar functionality
    const container = document.querySelector('.container');
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const toggleSidebar = document.getElementById('toggleSidebar');

    // Initialize sidebar as collapsed by default
    sidebar.classList.add('collapsed');
    container.classList.add('sidebar-collapsed');

    // Hover functionality for sidebar instead of click
    sidebar.addEventListener('mouseenter', function() {
        sidebar.classList.remove('collapsed');
        container.classList.remove('sidebar-collapsed');
    });

    sidebar.addEventListener('mouseleave', function() {
        sidebar.classList.add('collapsed');
        container.classList.add('sidebar-collapsed');
    });

    // Keep the click toggle functionality as a backup
    function toggleSidebarState() {
        sidebar.classList.toggle('collapsed');
        container.classList.toggle('sidebar-collapsed');
    }

    sidebarToggle.addEventListener('click', toggleSidebarState);
    toggleSidebar.addEventListener('click', toggleSidebarState);

    // Set active menu item
    const menuItems = document.querySelectorAll('.sidebar-menu li a');
    menuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelectorAll('.sidebar-menu li').forEach(li => {
                li.classList.remove('active');
            });
            this.parentElement.classList.add('active');
            
            // Filter gallery based on category
            const category = this.getAttribute('href').substring(1);
            filterGallery(category);
        });
    });

    // Define image counts for each category (adjust these numbers based on how many images you actually have)
    const imageCounts = {
        "collateral": 968, // Number of image you have in collateral, collateral (1) through collateral (968)
	    "special": 165,    // Number of you have special, special (1) through special (165)
		"standard": 125,   // Number of you have standard, standard (1) through standard (125)
		"upgraded": 321    // Number of you have upgraded, upgraded (1) through upgraded (321)
    };

    // Function to generate image paths for a category
    function generateImagePaths(category, count) {
        const paths = [];
        for (let i = 1; i <= count; i++) {
            paths.push(`${category}/${category} (${i}).jpg`);
        }
        return paths;
    }

    // Generate image paths for each category
    const categoryImages = {
        "collateral": generateImagePaths("collateral", imageCounts.collateral),
        "special": generateImagePaths("special", imageCounts.special),
        "standard": generateImagePaths("standard", imageCounts.standard),
        "upgraded": generateImagePaths("upgraded", imageCounts.upgraded)
    };

    // Create a combined array of all images for the "all" category
    const allImages = [
        ...categoryImages.collateral,
        ...categoryImages.special,
        ...categoryImages.standard,
        ...categoryImages.upgraded
    ];

    // Setup the gallery rows
    const galleryRows = document.querySelectorAll(".gallery-row");
    
    // Initialize gallery with random images
    setupGallery('all');

    // Function to set up gallery with proper animation
    function setupGallery(category) {
        const imagesToUse = category === 'all' 
            ? [...allImages].sort(() => 0.5 - Math.random()) 
            : [...categoryImages[category]].sort(() => 0.5 - Math.random());
            
        if (imagesToUse.length === 0) return;
            
        // Setup each row
        galleryRows.forEach((row, index) => {
            // Clear existing content and animations
            row.innerHTML = '';
            row.style.transform = '';
            
            // Store original styles
            const originalGap = '50px';
            const gapSize = 50;
            
            // Select images for this row (shuffled from appropriate category)
            let selectedImages;
            
            // Distribute images evenly among rows
            selectedImages = imagesToUse.filter((_, i) => i % galleryRows.length === index);
            
            // If not enough images for a row, duplicate some
            if (selectedImages.length < 3) {
                selectedImages = [...selectedImages, ...selectedImages];
            }
            
            // Create image elements HTML
            let baseImagesHTML = '';
            selectedImages.forEach(img => {
                baseImagesHTML += `<img src="images/${img}" alt="Gallery Image" data-fullsize="images/${img}">`;
            });
            
            // Duplicate the images enough times to fill the screen width multiple times
            row.innerHTML = baseImagesHTML.repeat(Math.max(5, Math.ceil(30 / selectedImages.length)));
            
            // Wait for images to load to get accurate measurements
            setTimeout(() => {
                const imageElements = row.querySelectorAll('img');
                
                // Make sure there are images to work with
                if (imageElements.length === 0) return;
                
                // Preserve the original gap between images
                row.style.columnGap = `${gapSize}px`;
                
                // Calculate the width of a single set (all unique images + gaps)
                let singleSetWidth = 0;
                for (let i = 0; i < selectedImages.length; i++) {
                    if (imageElements[i]) {
                        singleSetWidth += imageElements[i].offsetWidth;
                        // Add gap after each image except the last one
                        if (i < selectedImages.length - 1) {
                            singleSetWidth += gapSize;
                        }
                    }
                }
                
                // Direction alternates by row index
                const goingRight = index % 2 === 0;
                
                // Set initial position
                let currentPosition = goingRight ? 0 : -singleSetWidth;
                row.style.transform = `translateX(${currentPosition}px)`;
                
                // Speed varies by row (pixels per frame)
                const speed = goingRight ? 0.9 : -0.9;
                
                // Store pause state
                let isPaused = false;
                let lastFrameTime = 0;
                
                // Animation function for seamless scrolling
                function animateRow(timestamp) {
                    // Throttle to reasonable frame rate for smoother animation
                    if (timestamp - lastFrameTime < 16) { // ~60fps
                        requestAnimationFrame(animateRow);
                        return;
                    }
                    
                    lastFrameTime = timestamp;
                    
                    if (!isPaused) {
                        // Move the row
                        currentPosition += speed;
                        
                        // Check if we need to reset (invisibly)
                        if (goingRight) { // Moving right
                            // Apply the movement with CSS transform
                            row.style.transform = `translateX(${currentPosition}px)`;
                            
                            if (currentPosition >= 0) {
                                // When position reaches start, jump back one set width with transition disabled
                                row.style.transition = 'none';
                                currentPosition = -singleSetWidth;
                                row.style.transform = `translateX(${currentPosition}px)`;
                                // Force reflow to apply the transform immediately
                                row.offsetHeight;
                                // Re-enable transition
                                row.style.transition = 'transform 20ms linear';
                            }
                        } else { // Moving left
                            // Apply the movement
                            row.style.transform = `translateX(${currentPosition}px)`;
                            
                            if (currentPosition <= -2 * singleSetWidth) {
                                // When position reaches end, jump forward one set width with transition disabled
                                row.style.transition = 'none';
                                currentPosition = -singleSetWidth;
                                row.style.transform = `translateX(${currentPosition}px)`;
                                // Force reflow
                                row.offsetHeight;
                                // Re-enable transition
                                row.style.transition = 'transform 20ms linear';
                            }
                        }
                    }
                    
                    // Continue animation
                    requestAnimationFrame(animateRow);
                }
                
                // Initialize smooth transitions
                row.style.transition = 'transform 20ms linear';
                
                // Start animation
                requestAnimationFrame(animateRow);
                
                // Set up hover effect for individual images
                imageElements.forEach(img => {
                    img.addEventListener("mouseenter", () => {
                        isPaused = true;
                        // Add hover effect styling if needed
                        img.style.transform = "scale(1.05)";
                        img.style.transition = "transform 0.3s ease";
                        img.style.zIndex = "5";
                    });
                    
                    img.addEventListener("mouseleave", () => {
                        isPaused = false;
                        // Remove hover effect styling
                        img.style.transform = "scale(1)";
                        img.style.zIndex = "1";
                    });
                    
                    // Add click event for viewing full-size image
                    img.addEventListener("click", () => {
                        openLightbox(img.getAttribute('data-fullsize'));
                    });
                });
                
                // Also keep the original row hover behavior
                row.addEventListener("mouseenter", () => {
                    isPaused = true;
                });
                
                row.addEventListener("mouseleave", () => {
                    isPaused = false;
                    // Reset any scale effects when leaving the row
                    imageElements.forEach(img => {
                        img.style.transform = "scale(1)";
                        img.style.zIndex = "1";
                    });
                });
            }, 300); // Delay to ensure images have time to load properly
        });
    }

    // Lightbox functionality
    function openLightbox(imageSrc) {
        // Create lightbox elements
        const lightbox = document.createElement('div');
        lightbox.classList.add('lightbox');
        
        const lightboxContent = document.createElement('div');
        lightboxContent.classList.add('lightbox-content');
        
        const closeButton = document.createElement('span');
        closeButton.classList.add('close-lightbox');
        closeButton.innerHTML = '&times;';
        
        const image = document.createElement('img');
        image.src = imageSrc;
        
        // Assemble and add to document
        lightboxContent.appendChild(closeButton);
        lightboxContent.appendChild(image);
        lightbox.appendChild(lightboxContent);
        document.body.appendChild(lightbox);
        
        // Add event listeners
        closeButton.addEventListener('click', () => {
            document.body.removeChild(lightbox);
        });
        
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                document.body.removeChild(lightbox);
            }
        });
        
        // Add lightbox styles dynamically
        const style = document.createElement('style');
        style.textContent = `
            .lightbox {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.9);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 1000;
            }
            
            .lightbox-content {
                position: relative;
                max-width: 90%;
                max-height: 90%;
            }
            
            .lightbox-content img {
                max-width: 100%;
                max-height: 90vh;
                object-fit: contain;
            }
            
            .close-lightbox {
                position: absolute;
                top: -40px;
                right: 0;
                color: white;
                font-size: 40px;
                font-weight: bold;
                cursor: pointer;
            }
        `;
        document.head.appendChild(style);
    }

    // Function to update gallery based on selected category
    function filterGallery(category) {
        setupGallery(category);
    }
});

document.addEventListener("DOMContentLoaded", function() {
    const backButton = document.getElementById("backButton");
    
    if (backButton) {
        backButton.addEventListener("click", function () {
            window.location.href = "index.html";
        });
    } else {
        console.warn("Back button not found in the document");
    }
});