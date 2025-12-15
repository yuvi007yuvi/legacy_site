window.addEventListener('load', function () {
    const loader = document.querySelector('.loader-wrapper');
    if (loader) {
        loader.classList.add('loader-hidden');
        loader.addEventListener('transitionend', function () {
            if (loader.parentNode) {
                loader.parentNode.removeChild(loader);
            }
        });
    }

    // Navbar Scrolled Effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', function () {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
});

// Map Animation Logic
document.addEventListener('DOMContentLoaded', function () {
    const mapObj = document.getElementById('india-map-obj');

    if (mapObj) {
        const initMap = () => {
            const svgDoc = mapObj.contentDocument;
            if (!svgDoc) return;

            // Check if already styled to prevent double initialization
            if (svgDoc.getElementById('map-styles')) return;

            // Add styles to SVG
            const styleElement = svgDoc.createElement('style');
            styleElement.id = 'map-styles';
            styleElement.textContent = `
                path { transition: all 0.3s ease; cursor: pointer; }
                path:hover { fill: #ffffff !important; filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.8)); transform: translateY(-2px); z-index: 100; stroke: #333 !important; stroke-width: 1px !important; }
                .pop-active { animation: pop 0.6s ease; fill: #ffffff !important; filter: drop-shadow(0 0 15px rgba(255, 255, 255, 0.9)); z-index: 100; stroke: #333 !important; stroke-width: 1px !important; }
                @keyframes pop {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.02); }
                    100% { transform: scale(1); }
                }
            `;

            // Append style element to SVG
            const svgElement = svgDoc.querySelector('svg');
            if (svgElement) {
                svgElement.prepend(styleElement);
            }

            const paths = Array.from(svgDoc.querySelectorAll('path'));

            // Vibrant Political/Professional Color Palette with Light Orange and Green
            const colors = [
                '#FF9F43', // Light Orange
                '#2ecc71', // Green
                '#264653', '#2a9d8f', '#e9c46a', '#f4a261', '#e76f51',
                '#457b9d', '#1d3557', '#a8dadc', '#e63946', '#6d597a',
                '#355070', '#6d597a', '#b56576', '#e56b6f', '#eaac8b',
                '#55efc4', // Light Green
                '#fab1a0'  // Light Orange/Peach
            ];

            // Assign random colors to each path
            paths.forEach(path => {
                const randomColor = colors[Math.floor(Math.random() * colors.length)];
                path.setAttribute('fill', randomColor);
                path.style.fill = randomColor;
                path.style.stroke = '#fff';
                path.style.strokeWidth = '0.5px';
            });

            // Random Pop Animation
            setInterval(() => {
                if (paths.length > 0) {
                    const randomPath = paths[Math.floor(Math.random() * paths.length)];
                    if (randomPath) {
                        randomPath.classList.add('pop-active');
                        setTimeout(() => {
                            randomPath.classList.remove('pop-active');
                        }, 600);
                    }
                }
            }, 2000);
        };

        // Run immediately if already loaded
        if (mapObj.contentDocument && mapObj.contentDocument.readyState === 'complete') {
            initMap();
        }

        // Also waiting for load event just in case
        mapObj.addEventListener('load', initMap);
    }
});
