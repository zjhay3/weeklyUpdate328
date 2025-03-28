window.addEventListener("load", () => {
    const loadingScreen = document.querySelector(".loading-screen");

    // Hide the loading screen after 3.7 seconds (adjust time if needed)
    setTimeout(() => {
        loadingScreen.classList.add("hide"); // Hide after 2.7 seconds
    }, 2750); // 3750ms = 2.7 seconds
});


document.addEventListener("DOMContentLoaded", function () {
    const sidebar = document.getElementById("sidebar");
    const toggleSidebar = document.getElementById("toggleSidebar");
    const mainContent = document.getElementById("main-content");

    if (toggleSidebar && sidebar && mainContent) {
        toggleSidebar.addEventListener("click", function () {
            sidebar.classList.toggle("collapsed");
            updateMainContentMargin();
        });

        sidebar.addEventListener("mouseenter", function () {
            if (sidebar.classList.contains("collapsed")) {
                sidebar.classList.remove("collapsed");
                updateMainContentMargin();
            }
        });

        sidebar.addEventListener("mouseleave", function () {
            if (!sidebar.classList.contains("clicked")) {
                sidebar.classList.add("collapsed");
                updateMainContentMargin();
            }
        });

        function updateMainContentMargin() {
            mainContent.style.marginLeft = sidebar.classList.contains("collapsed") ? "75px" : "250px";
        }

        updateMainContentMargin();
    }

    // Product carousel scrolling
    const carousels = document.querySelectorAll(".product-carousel");

    carousels.forEach(carousel => {
        const container = carousel.closest(".product-carousel-container");
        if (!container) return;

        const leftBtn = container.querySelector(".scroll-left");
        const rightBtn = container.querySelector(".scroll-right");

        if (!leftBtn || !rightBtn) return;

        function getScrollAmount() {
            return carousel.querySelector(".product-card")?.offsetWidth + 20 || 300;
        }

        function checkScrollButtons() {
            leftBtn.disabled = carousel.scrollLeft <= 0;
            rightBtn.disabled = carousel.scrollLeft + carousel.clientWidth >= carousel.scrollWidth;
        }

        leftBtn.addEventListener("click", () => {
            carousel.scrollBy({ left: -getScrollAmount(), behavior: "smooth" });
            setTimeout(checkScrollButtons, 300);
        });

        rightBtn.addEventListener("click", () => {
            carousel.scrollBy({ left: getScrollAmount(), behavior: "smooth" });
            setTimeout(checkScrollButtons, 300);
        });

        carousel.addEventListener("scroll", checkScrollButtons);
        window.addEventListener("resize", checkScrollButtons);
        checkScrollButtons();
    });

    // Drag-to-scroll (swipe-like)
    carousels.forEach(carousel => {
        let isDragging = false;
        let startX, scrollLeft;

        carousel.addEventListener("mousedown", (e) => {
            isDragging = true;
            startX = e.pageX - carousel.offsetLeft;
            scrollLeft = carousel.scrollLeft;
            carousel.style.cursor = "grabbing";
        });

        carousel.addEventListener("mouseleave", () => isDragging = false);
        carousel.addEventListener("mouseup", () => {
            isDragging = false;
            carousel.style.cursor = "grab";
        });

        carousel.addEventListener("mousemove", (e) => {
            if (!isDragging) return;
            e.preventDefault();
            const x = e.pageX - carousel.offsetLeft;
            const walk = (x - startX) * 2;
            carousel.scrollLeft = scrollLeft - walk;
        });
    });

    // Submenu functionality
    document.querySelectorAll(".has-submenu > a").forEach(item => {
        item.addEventListener("click", function (e) {
            e.preventDefault();
            const parent = this.parentElement;
            const submenu = parent.querySelector(".submenu");

            if (submenu) {
                submenu.style.maxHeight = submenu.style.maxHeight ? null : submenu.scrollHeight + "px";
                parent.classList.toggle("open");
            }
        });
    });
})

//  Lightbox for More Products Page with Zoom
document.querySelectorAll(".product-card img").forEach(img => {
    img.addEventListener("click", function () {
        openLightbox(this.src, this.alt); // Opens lightbox with clicked image
    });
});

// Enhanced Lightbox Function with Zoom
function openLightbox(imageSrc, imageAlt = '') {
    // Create lightbox container
    const lightbox = document.createElement("div");
    lightbox.classList.add("lightbox");

    // Create lightbox content wrapper
    const lightboxContent = document.createElement("div");
    lightboxContent.classList.add("lightbox-content");

    // Create close button
    const closeButton = document.createElement("span");
    closeButton.classList.add("close-lightbox");
    closeButton.innerHTML = "&times;";

    // Create image container for zooming
    const imageContainer = document.createElement("div");
    imageContainer.classList.add("lightbox-image-container");

    // Create image element
    const image = document.createElement("img");
    image.src = imageSrc;
    image.alt = imageAlt;
    image.classList.add("lightbox-image");

    // Add zoom functionality
    imageContainer.addEventListener("mousemove", function(e) {
        const container = e.target.closest(".lightbox-image-container");
        const img = container.querySelector("img");
        
        // Calculate mouse position relative to container
        const rect = container.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width * 100;
        const y = (e.clientY - rect.top) / rect.height * 100;
        
        // Apply transform and background position for zoom effect
        img.style.transform = 'scale(2)';
        img.style.transformOrigin = `${x}% ${y}%`;
    });

    // Reset zoom when mouse leaves
    imageContainer.addEventListener("mouseleave", function(e) {
        const img = e.target.querySelector("img");
        img.style.transform = 'scale(1)';
        img.style.transformOrigin = 'center center';
    });

    // Assemble lightbox
    imageContainer.appendChild(image);
    lightboxContent.appendChild(closeButton);
    lightboxContent.appendChild(imageContainer);
    lightbox.appendChild(lightboxContent);
    document.body.appendChild(lightbox);

    // Function to close lightbox
    function closeLightbox() {
        document.body.removeChild(lightbox);
        // Remove the event listener to prevent memory leaks
        document.removeEventListener('keydown', escKeyHandler);
    }

    // ESC key handler
    function escKeyHandler(e) {
        if (e.key === 'Escape') {
            closeLightbox();
        }
    }

    // Add ESC key event listener
    document.addEventListener('keydown', escKeyHandler);

    // Close Lightbox via close button
    closeButton.addEventListener("click", closeLightbox);

    // Close Lightbox when clicking outside the image
    lightbox.addEventListener("click", (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
}


document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("searchBox");
    const searchResults = document.getElementById("searchResults");
    let selectedIndex = -1;
    
    // Sample product data with IDs for scrolling
    const products = [     //{ name: "", category: "", id: "" },

        // CHAIRS
                { name: "Monobloc Chair", category: "chairs", id: "monobloc-chair" },
                { name: "Black Stacking Chair Leatherette Cushion", category: "chairs", id: "black-stacking-chair-leatherette-cushion" },
                { name: "White Plastic Chair", category: "chairs", id: "white-plastic-chair" },
                { name: "Brown Folded Chair with Stainless Footing", category: "chairs", id: "brown-folded-chair" },
                { name: "White Special Chair(Nordic Chair with Cushion", category: "chairs", id: "white-special-chair-nordic" },
                { name: "Black Special Chair(Chopstick with Cushion)", category: "chairs", id: "white-special-chair-chopstick-cushion" },
                { name: "White Special Chair(Chopstick with Cushion)", category: "chairs", id: "white-special-chair-chopstick-cushion" },
                { name: "Black Special Chair(Chopstick Chair)", category: "chairs", id: "white-special-chair-chopstick" },
                { name: "White Special Chair(Chopstick Chair)", category: "chairs", id: "white-special-chair-chopstick" },
                { name: "Black Barstool Leatherette", category: "chairs", id: "black-barstool" },
                { name: "Black Hydraulic Chairs Low Backrest", category: "chairs", id: "black-hydraulic-chair" },
                { name: "White Hydraulic Chairs Low Backrest", category: "chairs", id: "white-hydraulic-chair" },
                { name: "Maroon Hydraulic Chairs High Backrest", category: "chairs", id: "maroon-hydraulic-chair" },
                { name: "Red Hydraulic Chairs High Backrest", category: "chairs", id: "red-hydraulic-chair" },
                { name: "Orange Hydraulic Chairs Smiley Type", category: "chairs", id: "orange-hydraulic-chair" },
                { name: "Yellow Hydraulic Chairs Smiley Type", category: "chairs", id: "yellow-hydraulic-chair" },
                { name: "Conference Chair", category: "chairs", id: "conference-chair" },
        // TABLES
                { name: "Information System Table", category: "tables", id: "information-table" },
                { name: "Round Glass Conference Table(60 Diameter)", category: "tables", id: "round-glass-table-60" },
                { name: "Round Glass Conference Table(80 Diameter)", category: "tables", id: "round-glass-table-80" },
                { name: "Round Conference White Round Table(60 Diameter)", category: "tables", id: "round-white-table-60" },
                { name: "Round Conference White Round Table(80 Diameter)", category: "tables", id: "round-white-table-80" },
                { name: "Cocktail Glass Table(60 Diameter)", category: "tables", id: "cocktail-table-60" },
                { name: "Cocktail Glass Table(80 Diameter)", category: "tables", id: "cocktail-table-80" },
                { name: "Hydraulic White Round Table", category: "tables", id: "hydraulic-white-table" },
                { name: "Coffee Table Rectangular 1", category: "tables", id: "coffee-table-1" },
                { name: "Coffee Table Rectangular 2", category: "tables", id: "coffee-table-2" },
                { name: "System Lockable Table ( 1m .5m x .75m (h))", category: "tables", id: "system-lockable-table1" },
                { name: "System Lockable Table ( 1m .5m x 1m (h))", category: "tables", id: "system-lockable-table2" },
        // CONFERENCE SET
                { name: "Conference Set 1", category: "conference", id: "conference-set1" },
                { name: "Conference Set 2", category: "conference", id: "conference-set2" },
                { name: "Conference Set 3", category: "conference", id: "conference-set3" },
                { name: "Conference Set 4", category: "conference", id: "conference-set4" },
                { name: "Conference Set 5", category: "conference", id: "conference-set5" },
                { name: "Conference Set 6", category: "conference", id: "conference-set6" },
                { name: "Conference Set 7", category: "conference", id: "conference-set7" },
        // SOFA SET
                { name: "Sofa Set 1 Black Leatherette ((1) 3-seater, (2) 1-seater, (3) (1) Center Table)", category: "sofa-set", id: "sofa-set1" },
                { name: "Sofa Set 2 Black Leatherette ((1) 3-seater, (2) 1-seater, (3) (1) Center Table)", category: "sofa-set", id: "sofa-set1" },
                { name: "Sofa Set 3 Black Leatherette ((1) 2-seater, (2) 1-seater, (3) (1) Center Table)", category: "sofa-set", id: "sofa-set1" },
                { name: "Sofa Set 4 Black Leatherette ((1) 2-seater, (2) 1-seater, (3) (1) Center Table)", category: "sofa-set", id: "sofa-set1" },
        // SOFA SINGLE
                { name: "Sofa 3 seater Black Leatherette", category: "sofa-single", id: "sofa-3-seater-black" },
                { name: "Sofa 1 seater Black Leatherette", category: "sofa-single", id: "sofa-1-seater-black" },
                { name: "Sofa 3 seater White Leatherette", category: "sofa-single", id: "sofa-3-seater-white" },
                { name: "Sofa 1 seater White Leatherette", category: "sofa-single", id: "sofa-1-seater-white" },
                { name: "Sofa 2 seater Black Leatherette", category: "sofa-single", id: "sofa-1-seater-black" },
                { name: "Sofa 2 seater White Leatherette", category: "sofa-single", id: "sofa-1-seater-white" },
                { name: "Sofa 2 seater Dark Gray Fabric", category: "sofa-single", id: "sofa-2-seater-dark-gray" },
                { name: "Ottoman", category: "sofa-single", id: "ottoman" },
        // SHOWCASE
                { name: "Showcase Type A (1m x .5m x 1m (h))", category: "showcase", id: "showcase-a" },
                { name: "Showcase Type B (1m x .5m x 1.2m (h))", category: "showcase", id: "showcase-b" },
                { name: "Showcase Type C (1m x .5m x 1.8m (h))", category: "showcase", id: "showcase-c" },
        // DISPLAY
                { name: "Standard Shelves (1m x .30m x 3/4 inches (thick)", category: "display", id: "standard-shelves1" },
                { name: "Standard Shelves (2m x .30m x 3/4 inches (thick))", category: "display", id: "standard-shelves2" },
                { name: "Wall Mounted Brochure Pocket 1( 4 cases )", category: "display", id: "wall-mounted-brochure-pocket1" },
                { name: "Wall Mounted Brochure Pocket 1( 2 cases )", category: "display", id: "wall-mounted-brochure-pocket2" },
                { name: "Wooded Brochure Standee 1( 3 pockets )", category: "display", id: "wooded-brochure-standee-1" },
                { name: "Acrylic Folded Brochure Standee 1 ( 4 pockets )", category: "display", id: "acrylic-folded-brochure-standee" },
                { name: "Universal TV Stand", category: "display", id: "univeral-tv-stand" },
                { name: "Universal TV Bracket", category: "display", id: "univeral-tv-bracket" },
                { name: "System Vertical Photo Panel ( 1m x 2.5m (h))", category: "display", id: "system-vertical-photo-panel1" },
                { name: "System Vertical Photo Panel with one spotlight", category: "display", id: "system-vertical-photo-panel2" },
        //PROP AND AIDS
                { name: "Dry Waste Bin 1", category: "prop-and-aids", id: "dry-waste-bin1" },
                { name: "S Hook", category: "prop-and-aids", id: "s-hook" },
                { name: "Tambiolo", category: "prop-and-aids", id: "tambiolo" },
                { name: "Dressing Room Mirror", category: "prop-and-aids", id: "dressing-room-mirror" },
                { name: "Easel Stand", category: "prop-and-aids", id: "easel-stand" },
                { name: "Palochina Folded Rack 3 layer", category: "prop-and-aids", id: "palochina-folded-rack3" },
                { name: "Palochina Folded Rack 4 layer", category: "prop-and-aids", id: "palochina-folded-rack4" },
                { name: "X-Banner with Graphics printed of Tarp", category: "prop-and-aids", id: "x-banner" },
                { name: "Pull up Banner with Graphics printed of Tarp", category: "prop-and-aids", id: "pull-up-banner" },
        // CARPET
                { name: "Needle Punched Carpet ( Standard Color Red, Green, Blue, Light Gray, Dark Gray, Black ) /sqm", category: "carpet", id: "needle-punched-carpet1" },
                { name: "Faux Grass Carpet /sqm", category: "carpet", id: "faux-grass-carpet" },
                { name: "Loop Pile Carpet Carpet /sqm", category: "carpet", id: "loop-pile-carpet" },
                { name: "Tile Carpet Carpet /sqm", category: "carpet", id: "tile-carpet" },
                { name: "Needle Punched Carpet ( Special Color ) /sqm", category: "carpet", id: "needle-punched-carpet2" },
        // APPLIANCES
                { name: "Water Dispenser ( with 5 gal of water with 50 cups )", category: "appliances", id: "water-dispenser" },
                { name: "Refrigerator 1", category: "appliances", id: "refrigerator1" },
                { name: "Refrigerator 2", category: "appliances", id: "refrigerator2" },
                { name: "Chest Type Freezer 1 /day", category: "appliances", id: "chest-type-freezer-1" },
                { name: "Chest Type Freezer 2 /day", category: "appliances", id: "chest-type-freezer-2" },
                { name: "Chest Type Freezer 3 /day", category: "appliances", id: "chest-type-freezer-3" },
                { name: "Microwave Oven", category: "appliances", id: "microwave-oven" },
                { name: "Coffee Maker 1 gal of water with 50 cups", category: "appliances", id: "coffee-maker" },
                { name: "Stand Fan", category: "appliances", id: "stand-fan" },
                { name: "Electric Kettle", category: "appliances", id: "electric-kettle" },
                { name: "Projector Sets", category: "appliances", id: "projector-sets" },
                { name: "Alcohol Dispenser with 1 gal of Alcohol", category: "appliances", id: "alcohol-dispenser1" },
                { name: "Alcohol Dispenser with Thermometer with 1 gal Alcohol", category: "appliances", id: "alcohol-dispenser2" },
                { name: "Mist Spray with ultra violet light with 1 gal Disinfectant", category: "appliances", id: "mist-spray" },
        // TV AND AUDIO VISUAL
                { name: "LED 32 Inches HDMI Ready with TV Stand/Wall mounted", category: "tv-and-audio-visual", id: "led-32" },
                { name: "LED 42 Inches HDMI Ready with TV Stand/Wall mounted", category: "tv-and-audio-visual", id: "led-42" },
                { name: "LED 50 Inches HDMI Ready with TV Stand/Wall mounted", category: "tv-and-audio-visual", id: "led-50" },
                { name: "LED 65 Inches HDMI Ready with TV Stand/Wall mounted", category: "tv-and-audio-visual", id: "led-65" },
                { name: "LED 75 Inches HDMI Ready with TV Stand/Wall mounted", category: "tv-and-audio-visual", id: "led-75" },
                { name: "LED Wall Standard Size with Basic Sound System", category: "tv-and-audio-visual", id: "led-wall-standard-size1" },
                { name: "LED Wall Standard Size", category: "tv-and-audio-visual", id: "led-wall-standard-size2" },
                { name: "LED Wall Other Size", category: "tv-and-audio-visual", id: "led-wall-other-size" },
        // OUTLET AND ADAPTOR
                { name: "Convenience Outlet 3 gang", category: "outlet-and-adaptor", id: "convenience-outlet3" },
                { name: "Convenience Outlet 3 gang", category: "outlet-and-adaptor", id: "convenience-outlet2" },
                { name: "Convenience Outlet ( Universal )", category: "outlet-and-adaptor", id: "convenience-outlet1" },
                { name: "Universal Adaptor", category: "outlet-and-adaptor", id: "universal-adaptor" },
        // BREAKER SINGLE PHASE
                { name: "Up to 4.4kw w/20 A Switch 1P", category: "breaker-single-phase", id: "breaker-single-phase1" },
                { name: "Up to 6.6kw w/30 A Switch 1P", category: "breaker-single-phase", id: "breaker-single-phase2" },
                { name: "Up to 15.4kw w/60 A Switch 1P", category: "breaker-single-phase", id: "breaker-single-phase3" },
                { name: "Up to 22.0kw w/100 A Switch 1P", category: "breaker-single-phase", id: "breaker-single-phase4" },
        // BREAKER THREE PHASE
                { name: "30 Amps V 60 Hz Breaker 3P", category: "breaker-three-phase", id: "breaker-three-phase1" },
                { name: "60 Amps V 60 Hz Breaker 3P", category: "breaker-three-phase", id: "breaker-three-phase2" },
                { name: "100 Amps V 60 Hz Breaker 3P", category: "breaker-three-phase", id: "breaker-three-phase3" },
        // TRANSFORMER
                { name: "Step-down Transformer ( Single Phase )", category: "transformer", id: "step-down-single" },
                { name: "Step-down Transformer ( Three Phase )", category: "transformer", id: "step-down-three" },
                { name: "Step-up Transformer ( Single Phase )", category: "transformer", id: "step-up-single" },
                { name: "Step-up Transformer ( Three Phase )", category: "transformer", id: "step-up-three" },
                { name: "Genset", category: "transformer", id: "genset" },
        // LIGHT FITTINGS
                { name: "Flourescent Lamp(40 watts)", category: "light-fittings", id: "flourescent-lamp-40" },
                { name: "LED Flourescent (Day Light)", category: "light-fittings", id: "led-flourescent-day-light" },
                { name: "LED Pinlight( 5 watts )", category: "light-fittings", id: "led-pin-light1" },
                { name: "LED Pinlight( 15 watts )", category: "light-fittings", id: "led-pin-light2" },
                { name: "Long Arm Spotlight", category: "light-fittings", id: "long-arm-spotlight" },
                { name: "Shot Arm Spotlight", category: "light-fittings", id: "short-arm-spotlight" },
                { name: "Track Bar with 3 Track Light", category: "light-fittings", id: "track-bar-track-light" },
                { name: "Halogen Pinlight", category: "light-fittings", id: "halogen-pinlight" },
                { name: "Floodlight 150 watts", category: "light-fittings", id: "floodlight1" },
                { name: "Floodlight 300 watts", category: "light-fittings", id: "floodlight2" },
                { name: "Metal Halide 150 watts", category: "light-fittings", id: "metal-halide1" },
                { name: "Metal Halide 400 watts", category: "light-fittings", id: "metal-halide2" },    
        ];
    
    searchInput.addEventListener("input", function () {
        const query = searchInput.value.toLowerCase();
        searchResults.innerHTML = "";
        selectedIndex = -1;
        
        if (query.length === 0) {
            searchResults.style.display = "none";
            return;
        }
        
        const filteredProducts = products.filter(product =>
            product.name.toLowerCase().includes(query) ||
            product.category.toLowerCase().includes(query)
        );
        
        if (filteredProducts.length > 0) {
            searchResults.style.display = "block";
            searchResults.style.maxHeight = "200px";
            searchResults.style.overflowY = "auto";
            filteredProducts.forEach((product, index) => {
                const item = document.createElement("div");
                item.classList.add("search-item");
                item.textContent = product.name;
                item.dataset.productId = product.id;
                item.addEventListener("click", function () {
                    selectProduct(product.name, product.id);
                });
                searchResults.appendChild(item);
            });
        } else {
            searchResults.style.display = "none";
        }
    });

    searchInput.addEventListener("keydown", function (e) {
        const items = searchResults.querySelectorAll(".search-item");
        if (items.length > 0) {
            if (e.key === "ArrowDown") {
                selectedIndex = (selectedIndex + 1) % items.length;
            } else if (e.key === "ArrowUp") {
                selectedIndex = (selectedIndex - 1 + items.length) % items.length;
            } else if (e.key === "Enter") {
                e.preventDefault();
                if (selectedIndex === -1) {
                    selectedIndex = 0; // Default to the first item if no selection
                }
                searchInput.value = items[selectedIndex].textContent;
                searchResults.style.display = "none";
                scrollToProduct(items[selectedIndex].dataset.productId);
                return;
            } else if (e.key === "Escape") {
                searchInput.value = "";
                searchResults.style.display = "none";
                return;
            }
            
            items.forEach(item => item.classList.remove("selected"));
            if (selectedIndex >= 0) {
                items[selectedIndex].classList.add("selected");
                items[selectedIndex].scrollIntoView({ block: "nearest" });
            }
        }
    });

    function selectProduct(name, productId) {
        searchInput.value = name;
        searchResults.style.display = "none";
        scrollToProduct(productId);
    }

    function scrollToProduct(productId) {
        const productElement = document.getElementById(productId);
        if (productElement) {
            productElement.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
            productElement.classList.add("highlight-product");
            setTimeout(() => {
                productElement.classList.remove("highlight-product");
            }, 1500);
        }
    }
    
    document.addEventListener("click", function (e) {
        if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
            searchResults.style.display = "none";
        }
    });
});



document.getElementById("backButton").addEventListener("click", function () {
    window.location.href = "index.html";
});


window.history.scrollRestoration = "manual";

window.onload = function () {
    window.scrollTo(0, 0);
};

