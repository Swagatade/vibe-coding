document.addEventListener('DOMContentLoaded', function() {
    // Enhanced Theme Toggle Functionality with system preference detection
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    
    // Check if the user's device prefers dark mode
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Function to set theme based on preference
    function setThemePreference(isDark) {
        if (isDark) {
            body.classList.add('dark-theme');
            animateToDarkMode();
        } else {
            body.classList.remove('dark-theme');
            animateToLightMode();
        }
        
        // Save preference to localStorage
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        
        // Adjust particle colors based on theme
        adjustParticleColors();
    }
    
    // Check for saved theme preference or use system preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        setThemePreference(true);
    } else if (savedTheme === 'light') {
        setThemePreference(false);
    } else {
        // If no saved preference, use system preference
        setThemePreference(prefersDarkScheme.matches);
    }
    
    // Toggle theme when the button is clicked with enhanced animations
    themeToggle.addEventListener('click', () => {
        const isDarkMode = !body.classList.contains('dark-theme');
        setThemePreference(isDarkMode);
        
        // Play toggle animation
        playToggleAnimation(isDarkMode);
    });
    
    // Listen for changes in system color scheme
    prefersDarkScheme.addEventListener('change', (e) => {
        // Only update if user hasn't set a preference
        if (!localStorage.getItem('theme')) {
            setThemePreference(e.matches);
        }
    });
    
    // Function for toggle animation
    function playToggleAnimation(isDarkMode) {
        // Create stars or sun rays animation
        const toggleWrapper = document.querySelector('.theme-toggle-wrapper');
        
        // Remove any existing animation elements
        const existingParticles = toggleWrapper.querySelectorAll('.toggle-particle');
        existingParticles.forEach(particle => particle.remove());
        
        // Create animation particles
        if (isDarkMode) {
            // Create stars for dark mode
            for (let i = 0; i < 10; i++) {
                createStar(toggleWrapper);
            }
        } else {
            // Create sun rays for light mode
            for (let i = 0; i < 8; i++) {
                createRay(toggleWrapper);
            }
        }
        
        // Main toggle button animation
        gsap.to(themeToggle, {
            scale: 1.2,
            duration: 0.3,
            yoyo: true,
            repeat: 1,
            ease: 'back.out(1.7)',
            onComplete: () => {
                // Add a ripple effect
                const ripple = document.createElement('div');
                ripple.className = 'toggle-ripple';
                themeToggle.appendChild(ripple);
                
                gsap.to(ripple, {
                    scale: 2,
                    opacity: 0,
                    duration: 0.6,
                    onComplete: () => ripple.remove()
                });
            }
        });
    }
    
    // Function to create a star particle
    function createStar(parent) {
        const star = document.createElement('div');
        star.classList.add('toggle-particle', 'star');
        
        // Random position around the toggle
        const angle = Math.random() * Math.PI * 2;
        const distance = 30 + Math.random() * 50;
        const xPos = Math.cos(angle) * distance;
        const yPos = Math.sin(angle) * distance;
        
        star.style.top = `calc(50% + ${yPos}px)`;
        star.style.left = `calc(50% + ${xPos}px)`;
        star.style.animationDuration = `${0.5 + Math.random() * 0.5}s`;
        
        parent.appendChild(star);
        
        // Remove the star after animation
        setTimeout(() => {
            star.remove();
        }, 1000);
    }
    
    // Function to create a sun ray
    function createRay(parent) {
        const ray = document.createElement('div');
        ray.classList.add('toggle-particle', 'ray');
        
        // Position rays in a circle
        const angle = Math.random() * Math.PI * 2;
        const distance = 30 + Math.random() * 20;
        const xPos = Math.cos(angle) * distance;
        const yPos = Math.sin(angle) * distance;
        
        ray.style.top = `calc(50% + ${yPos}px)`;
        ray.style.left = `calc(50% + ${xPos}px)`;
        ray.style.transform = `rotate(${angle}rad)`;
        
        parent.appendChild(ray);
        
        // Remove the ray after animation
        setTimeout(() => {
            ray.remove();
        }, 800);
    }
    
    // Animation to transition to dark mode
    function animateToDarkMode() {
        gsap.to('.theme-toggle-thumb', {
            left: 31,
            duration: 0.5,
            ease: 'power4.out'
        });
        
        gsap.to('.theme-toggle-icon.sun', {
            opacity: 0.5,
            scale: 0.7,
            rotate: -90,
            duration: 0.5
        });
        
        gsap.to('.theme-toggle-icon.moon', {
            opacity: 1,
            scale: 1,
            rotate: 0,
            duration: 0.5
        });
    }
    
    // Animation to transition to light mode
    function animateToLightMode() {
        gsap.to('.theme-toggle-thumb', {
            left: 3,
            duration: 0.5,
            ease: 'power4.out'
        });
        
        gsap.to('.theme-toggle-icon.sun', {
            opacity: 1,
            scale: 1,
            rotate: 0,
            duration: 0.5
        });
        
        gsap.to('.theme-toggle-icon.moon', {
            opacity: 0.5,
            scale: 0.7,
            rotate: 90,
            duration: 0.5
        });
    }
    
    // Function to adjust particle colors based on the current theme
    function adjustParticleColors() {
        const isDarkTheme = body.classList.contains('dark-theme');
        
        if (window.particles) {
            window.particles.forEach(p => {
                // Adjust particle opacity based on theme
                p.color = isDarkTheme 
                    ? `rgba(255, 255, 255, ${Math.random() * 0.6 + 0.4})` // Brighter in dark theme
                    : `rgba(255, 255, 255, ${Math.random() * 0.5 + 0.3})`; // Normal in light theme
            });
        }
        
        // Adjust neural network colors if needed
        const neuralCanvas = document.getElementById('neuralNetworkCanvas');
        if (neuralCanvas) {
            neuralCanvas.style.opacity = isDarkTheme ? '0.2' : '0.15';
        }
    }
    
    // Initialize AOS animation library with more dynamic settings
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: false,
        mirror: true,
        anchorPlacement: 'top-bottom'
    });

    // ========== Auto-framing for all devices ==========
    function setupResponsiveFraming() {
        // Get the device type and viewport dimensions
        const isMobile = window.innerWidth <= 768;
        const isTablet = window.innerWidth > 768 && window.innerWidth <= 1024;
        const isDesktop = window.innerWidth > 1024;
        
        // Set root font size based on viewport width for better scaling
        const rootFontSize = Math.min(Math.max(window.innerWidth / 100, 14), 20); // Clamp between 14px and 20px
        document.documentElement.style.fontSize = `${rootFontSize}px`;
        
        // Adjust container paddings based on screen size
        const containers = document.querySelectorAll('.container');
        containers.forEach(container => {
            if (isMobile) {
                container.style.padding = '0 15px';
            } else if (isTablet) {
                container.style.padding = '0 25px';
            } else {
                container.style.padding = '0 30px';
            }
        });
        
        // Adjust header height and content for better framing
        const header = document.querySelector('.header');
        if (header) {
            if (isMobile) {
                header.style.minHeight = '85vh';
            } else {
                header.style.minHeight = '100vh';
            }
        }
        
        // Adjust logo items density based on screen size
        const floatingLogos = document.querySelectorAll('.logo-item');
        if (floatingLogos.length > 0) {
            floatingLogos.forEach((logo, index) => {
                // Hide some logos on smaller screens to prevent crowding
                if (isMobile && index % 3 !== 0) {
                    logo.style.display = 'none';
                } else if (isTablet && index % 2 !== 0) {
                    logo.style.display = 'none';
                } else {
                    logo.style.display = 'flex';
                    
                    // Adjust logo size based on device
                    if (isMobile) {
                        logo.style.width = '45px';
                        logo.style.height = '45px';
                    } else if (isTablet) {
                        logo.style.width = '55px';
                        logo.style.height = '55px';
                    } else {
                        logo.style.width = '60px';
                        logo.style.height = '60px';
                    }
                }
            });
        }
        
        // Adjust navigation bar for mobile
        const navLinks = document.querySelector('.nav-links');
        const navContainer = document.querySelector('.nav-container');
        
        if (navLinks && navContainer) {
            if (isMobile) {
                // Create mobile menu toggle if it doesn't exist
                if (!document.querySelector('.mobile-menu-toggle')) {
                    const mobileToggle = document.createElement('div');
                    mobileToggle.className = 'mobile-menu-toggle';
                    mobileToggle.innerHTML = '<span></span><span></span><span></span>';
                    navContainer.appendChild(mobileToggle);
                    
                    // Create mobile menu functionality
                    mobileToggle.addEventListener('click', () => {
                        navLinks.classList.toggle('active');
                        mobileToggle.classList.toggle('active');
                    });
                    
                    // Style mobile menu
                    navLinks.style.position = 'fixed';
                    navLinks.style.top = '70px';
                    navLinks.style.left = '0';
                    navLinks.style.width = '100%';
                    navLinks.style.backgroundColor = 'rgba(21, 25, 37, 0.95)';
                    navLinks.style.flexDirection = 'column';
                    navLinks.style.padding = '20px';
                    navLinks.style.gap = '20px';
                    navLinks.style.transform = 'translateY(-100%)';
                    navLinks.style.opacity = '0';
                    navLinks.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
                    navLinks.style.zIndex = '99';
                    
                    // Style the toggle button
                    const style = document.createElement('style');
                    style.textContent = `
                        .mobile-menu-toggle {
                            display: flex;
                            flex-direction: column;
                            justify-content: space-between;
                            width: 30px;
                            height: 20px;
                            cursor: pointer;
                        }
                        .mobile-menu-toggle span {
                            display: block;
                            height: 2px;
                            background-color: white;
                            border-radius: 2px;
                            transition: all 0.3s ease;
                        }
                        .mobile-menu-toggle.active span:nth-child(1) {
                            transform: translateY(9px) rotate(45deg);
                        }
                        .mobile-menu-toggle.active span:nth-child(2) {
                            opacity: 0;
                        }
                        .mobile-menu-toggle.active span:nth-child(3) {
                            transform: translateY(-9px) rotate(-45deg);
                        }
                        .nav-links.active {
                            transform: translateY(0);
                            opacity: 1;
                        }
                    `;
                    document.head.appendChild(style);
                }
                
                document.querySelector('.mobile-menu-toggle').style.display = 'flex';
            } else {
                // Reset to desktop navigation
                navLinks.style.position = 'relative';
                navLinks.style.top = 'auto';
                navLinks.style.left = 'auto';
                navLinks.style.width = 'auto';
                navLinks.style.backgroundColor = 'transparent';
                navLinks.style.flexDirection = 'row';
                navLinks.style.padding = '0';
                navLinks.style.transform = 'none';
                navLinks.style.opacity = '1';
                
                const mobileToggle = document.querySelector('.mobile-menu-toggle');
                if (mobileToggle) {
                    mobileToggle.style.display = 'none';
                }
            }
        }
        
        // Adjust layout grids based on screen size
        const grids = document.querySelectorAll('.tool-cards, .focus-areas, .skill-balance-grid, .trend-items');
        grids.forEach(grid => {
            if (isMobile) {
                grid.style.gridTemplateColumns = '1fr';
                grid.style.gap = '20px';
            } else if (isTablet) {
                grid.style.gridTemplateColumns = 'repeat(2, 1fr)';
                grid.style.gap = '25px';
            } else {
                // Reset to original CSS defined in stylesheet
                grid.style.gridTemplateColumns = '';
                grid.style.gap = '';
            }
        });
        
        // Adjust font sizes for better readability on mobile
        if (isMobile) {
            document.querySelectorAll('h2').forEach(h2 => {
                h2.style.fontSize = '2rem';
            });
            
            document.querySelectorAll('h3').forEach(h3 => {
                h3.style.fontSize = '1.5rem';
            });
            
            document.querySelector('.glitch-text').style.fontSize = '3rem';
            document.querySelector('.subtitle').style.fontSize = '1.2rem';
        } else {
            // Reset to original CSS
            document.querySelectorAll('h2').forEach(h2 => {
                h2.style.fontSize = '';
            });
            
            document.querySelectorAll('h3').forEach(h3 => {
                h3.style.fontSize = '';
            });
            
            const glitchText = document.querySelector('.glitch-text');
            if (glitchText) glitchText.style.fontSize = '';
            
            const subtitle = document.querySelector('.subtitle');
            if (subtitle) subtitle.style.fontSize = '';
        }
        
        // Adjust table display for mobile
        const tables = document.querySelectorAll('table');
        if (isMobile && tables) {
            tables.forEach(table => {
                // Add a class for mobile-optimized tables if not already present
                if (!table.classList.contains('mobile-optimized')) {
                    table.classList.add('mobile-optimized');
                    
                    // Add custom CSS for mobile tables
                    const mobileTableStyle = document.createElement('style');
                    mobileTableStyle.textContent = `
                        .mobile-optimized {
                            display: block;
                            width: 100%;
                            overflow-x: auto;
                            -webkit-overflow-scrolling: touch;
                        }
                        
                        .mobile-optimized thead, 
                        .mobile-optimized tbody, 
                        .mobile-optimized tr, 
                        .mobile-optimized th, 
                        .mobile-optimized td {
                            display: block;
                        }
                        
                        .mobile-optimized thead tr {
                            position: absolute;
                            top: -9999px;
                            left: -9999px;
                        }
                        
                        .mobile-optimized tr {
                            margin-bottom: 15px;
                            border: 1px solid rgba(108, 99, 255, 0.2);
                            border-radius: 12px;
                            overflow: hidden;
                        }
                        
                        .mobile-optimized td {
                            position: relative;
                            padding: 12px 12px 12px 50%;
                            border: none;
                            border-bottom: 1px solid #eee;
                            text-align: left;
                        }
                        
                        .mobile-optimized td:before {
                            position: absolute;
                            top: 12px;
                            left: 12px;
                            width: 45%;
                            padding-right: 10px;
                            white-space: nowrap;
                            font-weight: bold;
                            content: attr(data-label);
                            color: var(--primary);
                        }
                    `;
                    document.head.appendChild(mobileTableStyle);
                    
                    // Add data-label attributes to td elements
                    const headerCells = table.querySelectorAll('thead th');
                    const headerTexts = Array.from(headerCells).map(th => th.textContent);
                    
                    table.querySelectorAll('tbody tr').forEach(row => {
                        row.querySelectorAll('td').forEach((cell, index) => {
                            if (headerTexts[index]) {
                                cell.setAttribute('data-label', headerTexts[index]);
                            }
                        });
                    });
                }
            });
        }
        
        // Optimize animations for mobile (reduce complexity for better performance)
        if (isMobile) {
            // Reduce particles for better performance
            const particleCanvas = document.getElementById('particleCanvas');
            if (particleCanvas && window.particles) {
                window.particles = window.particles.slice(0, Math.min(window.particles.length, 50));
            }
            
            // Simplify or disable neural network on mobile
            const neuralCanvas = document.getElementById('neuralNetworkCanvas');
            if (neuralCanvas) {
                neuralCanvas.style.opacity = '0.05';
            }
        }
    }
    
    // Run initial setup
    setupResponsiveFraming();
    
    // Re-run setup on window resize with debounce
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(setupResponsiveFraming, 250);
    });
    
    // Re-run setup on orientation change for mobile devices
    window.addEventListener('orientationchange', () => {
        setTimeout(setupResponsiveFraming, 300);
    });

    // ========== Position and animate floating language logos ==========
    const floatingLogos = document.querySelectorAll('.logo-item');
    const headerContainer = document.querySelector('.header');
    
    // Position logos randomly throughout the header
    if (floatingLogos.length > 0 && headerContainer) {
        const headerWidth = headerContainer.offsetWidth;
        const headerHeight = headerContainer.offsetHeight;
        
        floatingLogos.forEach(logo => {
            // Get custom attributes
            const speed = parseFloat(logo.getAttribute('data-speed'));
            const delay = parseFloat(logo.getAttribute('data-delay'));
            
            // Set random position within header bounds (with some padding)
            const randomX = Math.random() * (headerWidth - 120) + 60;
            const randomY = Math.random() * (headerHeight - 180) + 90;
            
            // Apply position
            logo.style.left = `${randomX}px`;
            logo.style.top = `${randomY}px`;
            
            // Apply custom animation properties
            logo.style.setProperty('--float-duration', `${speed + 3}s`);
            logo.style.setProperty('--float-delay', `${delay}s`);
            
            // Add subtle rotation
            gsap.to(logo, {
                rotation: Math.random() > 0.5 ? "8deg" : "-8deg",
                duration: 3 + Math.random() * 5,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut"
            });
            
            // Add hover effect
            logo.addEventListener('mouseenter', () => {
                gsap.to(logo, {
                    scale: 1.3,
                    duration: 0.4,
                    ease: "back.out(1.7)"
                });
            });
            
            logo.addEventListener('mouseleave', () => {
                gsap.to(logo, {
                    scale: 1,
                    duration: 0.6,
                    ease: "elastic.out(1, 0.3)"
                });
            });
        });
    }

    // ========== Navigation scroll effect ==========
    const navigation = document.querySelector('.navigation');
    const header = document.querySelector('.header');
    let headerHeight = header.offsetHeight;
    
    function handleScroll() {
        if (window.scrollY > 50) {
            navigation.classList.add('scrolled');
        } else {
            navigation.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial state

    // ========== Enhanced smooth scroll for navigation links ==========
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                // Add click animation
                gsap.to(this, {
                    duration: 0.2,
                    scale: 0.95,
                    yoyo: true,
                    repeat: 1
                });
                
                const headerOffset = 100;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ========== Enhanced custom cursor effect ==========
    const cursor = document.querySelector('.cursor-follower');
    
    if (window.innerWidth > 768) {
        cursor.style.display = 'block';
        
        document.addEventListener('mousemove', function(e) {
            gsap.to(cursor, {
                duration: 0.3,
                left: e.clientX,
                top: e.clientY,
                ease: 'power2.out'
            });
        });
        
        document.querySelectorAll('a, button, .info-card, .step-card, .cta-button, .focus-area, .trend-item, .tool').forEach(el => {
            el.addEventListener('mouseenter', () => {
                gsap.to(cursor, {
                    duration: 0.3,
                    scale: 2.5,
                    opacity: 0.15,
                    backgroundColor: 'rgba(108, 99, 255, 0.8)'
                });
            });
            
            el.addEventListener('mouseleave', () => {
                gsap.to(cursor, {
                    duration: 0.3,
                    scale: 1,
                    opacity: 0.3,
                    backgroundColor: 'rgba(108, 99, 255, 0.3)'
                });
            });
        });
    }

    // ========== Enhanced Particle background ==========
    const particleCanvas = document.getElementById('particleCanvas');
    const ctx = particleCanvas.getContext('2d');
    
    // Set canvas to full screen
    particleCanvas.width = window.innerWidth;
    particleCanvas.height = window.innerHeight;
    
    // Particles array
    let particles = [];
    const particleCount = Math.min(window.innerWidth / 8, 150); // Increased count
    
    // Create particles with more variety
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * particleCanvas.width,
            y: Math.random() * particleCanvas.height,
            size: Math.random() * 3 + 0.5, // More size variation
            speedX: Math.random() * 2 - 1,
            speedY: Math.random() * 2 - 1,
            color: `rgba(255, 255, 255, ${Math.random() * 0.5 + 0.3})` // Random opacity
        });
    }
    
    // Store particles globally to allow theme toggle to modify them
    window.particles = particles;
    
    // Animate particles with more connections
    function animateParticles() {
        ctx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
        
        for (let i = 0; i < particles.length; i++) {
            let p = particles[i];
            
            // Draw particle with glow effect
            ctx.shadowBlur = 10;
            ctx.shadowColor = 'rgba(108, 99, 255, 0.5)';
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fill();
            ctx.shadowBlur = 0;
            
            // Move particle with slight acceleration
            p.x += p.speedX;
            p.y += p.speedY;
            
            // Random direction changes occasionally
            if (Math.random() > 0.99) {
                p.speedX = Math.random() * 2 - 1;
                p.speedY = Math.random() * 2 - 1;
            }
            
            // Bounce off edges with damping
            if (p.x < 0 || p.x > particleCanvas.width) {
                p.speedX *= -0.95;
            }
            
            if (p.y < 0 || p.y > particleCanvas.height) {
                p.speedY *= -0.95;
            }
            
            // Connect particles with lines
            connectParticles(p, particles);
        }
        
        requestAnimationFrame(animateParticles);
    }
    
    // Connect particles with lines - enhanced version
    function connectParticles(p, particles) {
        for (let i = 0; i < particles.length; i++) {
            let p2 = particles[i];
            let distance = Math.sqrt(
                Math.pow(p.x - p2.x, 2) + 
                Math.pow(p.y - p2.y, 2)
            );
            
            // Create more connections with gradient effect
            if (distance < 150) {
                const opacity = 0.15 - distance/1000;
                
                ctx.beginPath();
                // Create gradient for line
                const gradient = ctx.createLinearGradient(p.x, p.y, p2.x, p2.y);
                gradient.addColorStop(0, `rgba(108, 99, 255, ${opacity})`);
                gradient.addColorStop(1, `rgba(74, 0, 224, ${opacity})`);
                
                ctx.strokeStyle = gradient;
                ctx.lineWidth = 0.6;
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.stroke();
                ctx.closePath();
            }
        }
    }
    
    // Start animation
    animateParticles();
    
    // ========== Neural Network Animation - Enhanced ==========
    const neuralCanvas = document.createElement('canvas');
    neuralCanvas.id = 'neuralNetworkCanvas';
    document.body.appendChild(neuralCanvas);

    const nnCtx = neuralCanvas.getContext('2d');
    neuralCanvas.width = window.innerWidth;
    neuralCanvas.height = window.innerHeight;

    // Neural network settings with more layers
    const layers = [8, 12, 16, 12, 8]; // More complex structure
    const neuronRadius = 3.5;
    const layerDistance = neuralCanvas.width / (layers.length + 1);
    const neurons = [];
    const signals = [];

    // Create neurons with glow effect
    for (let l = 0; l < layers.length; l++) {
        neurons[l] = [];
        const neuronCount = layers[l];
        const layerX = layerDistance * (l + 1);
        
        for (let n = 0; n < neuronCount; n++) {
            const spacing = neuralCanvas.height / (neuronCount + 1);
            const neuronY = spacing * (n + 1);
            
            neurons[l].push({
                x: layerX,
                y: neuronY,
                connections: [],
                pulseEffect: 0,
                pulsing: false
            });
            
            // Create connections to previous layer
            if (l > 0) {
                for (let pl = 0; pl < neurons[l-1].length; pl++) {
                    const prevNeuron = neurons[l-1][pl];
                    neurons[l][n].connections.push({
                        x1: prevNeuron.x,
                        y1: prevNeuron.y,
                        x2: layerX,
                        y2: neuronY,
                        weight: Math.random(),
                        signalActive: false,
                        signalProgress: 0,
                        signalSize: Math.random() * 2.5 + 1.5
                    });
                }
            }
        }
    }
    
    // Animate neural network with pulsing effects
    function animateNeuralNetwork() {
        nnCtx.clearRect(0, 0, neuralCanvas.width, neuralCanvas.height);
        
        // Draw connections with gradient
        for (let l = 1; l < layers.length; l++) {
            for (let n = 0; n < neurons[l].length; n++) {
                const neuron = neurons[l][n];
                
                for (let c = 0; c < neuron.connections.length; c++) {
                    const conn = neuron.connections[c];
                    
                    // Draw connection line with gradient
                    const gradient = nnCtx.createLinearGradient(conn.x1, conn.y1, conn.x2, conn.y2);
                    gradient.addColorStop(0, `rgba(108, 99, 255, ${0.05 + conn.weight * 0.15})`);
                    gradient.addColorStop(1, `rgba(74, 0, 224, ${0.05 + conn.weight * 0.15})`);
                    
                    nnCtx.beginPath();
                    nnCtx.strokeStyle = gradient;
                    nnCtx.lineWidth = conn.weight * 1.5;
                    nnCtx.moveTo(conn.x1, conn.y1);
                    nnCtx.lineTo(conn.x2, conn.y2);
                    nnCtx.stroke();
                    
                    // Draw signal if active with glow effect
                    if (conn.signalActive) {
                        const progress = conn.signalProgress;
                        const signalX = conn.x1 + (conn.x2 - conn.x1) * progress;
                        const signalY = conn.y1 + (conn.y2 - conn.y1) * progress;
                        
                        nnCtx.beginPath();
                        nnCtx.shadowBlur = 15;
                        nnCtx.shadowColor = 'rgba(108, 99, 255, 0.8)';
                        nnCtx.fillStyle = 'rgba(255, 255, 255, 0.9)';
                        nnCtx.arc(signalX, signalY, conn.signalSize, 0, Math.PI * 2);
                        nnCtx.fill();
                        nnCtx.shadowBlur = 0;
                        
                        conn.signalProgress += 0.02;
                        
                        // When signal reaches end, activate neuron pulsing
                        if (conn.signalProgress > 1) {
                            conn.signalActive = false;
                            conn.signalProgress = 0;
                            
                            // Make the target neuron pulse
                            neurons[l][n].pulsing = true;
                            neurons[l][n].pulseEffect = 1;
                            
                            // Activate next layer with higher probability
                            if (Math.random() > 0.4 && l < layers.length - 1) {
                                activateRandomConnection(l);
                            }
                        }
                    }
                }
            }
        }
        
        // Draw neurons with pulsing effect
        for (let l = 0; l < layers.length; l++) {
            for (let n = 0; n < neurons[l].length; n++) {
                const neuron = neurons[l][n];
                
                // Draw neuron with glow if pulsing
                if (neuron.pulsing) {
                    nnCtx.shadowBlur = 20;
                    nnCtx.shadowColor = 'rgba(108, 99, 255, 0.7)';
                    
                    // Pulsing animation
                    const pulseSize = neuronRadius + neuron.pulseEffect * 3;
                    
                    nnCtx.beginPath();
                    nnCtx.fillStyle = 'rgba(108, 99, 255, 0.9)';
                    nnCtx.arc(neuron.x, neuron.y, pulseSize, 0, Math.PI * 2);
                    nnCtx.fill();
                    
                    // Reduce pulse effect
                    neuron.pulseEffect *= 0.9;
                    if (neuron.pulseEffect < 0.1) {
                        neuron.pulsing = false;
                        neuron.pulseEffect = 0;
                    }
                    
                    nnCtx.shadowBlur = 0;
                } else {
                    // Regular neuron
                    nnCtx.beginPath();
                    nnCtx.fillStyle = 'rgba(74, 0, 224, 0.7)';
                    nnCtx.arc(neuron.x, neuron.y, neuronRadius, 0, Math.PI * 2);
                    nnCtx.fill();
                }
            }
        }
        
        // Generate random signals occasionally
        if (Math.random() > 0.95) {
            activateRandomConnection(0);
        }
        
        requestAnimationFrame(animateNeuralNetwork);
    }
    
    // Activate a random connection in a layer
    function activateRandomConnection(layer) {
        if (layer >= layers.length - 1) return;
        
        const randomNeuron = neurons[layer + 1][Math.floor(Math.random() * neurons[layer + 1].length)];
        const randomConn = randomNeuron.connections[Math.floor(Math.random() * randomNeuron.connections.length)];
        
        randomConn.signalActive = true;
        randomConn.signalProgress = 0;
    }
    
    // Start neural network animation
    animateNeuralNetwork();
    
    // Initial signals
    setTimeout(() => {
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                activateRandomConnection(0);
            }, i * 300);
        }
    }, 1000);
    
    // Handle resize for all canvases
    window.addEventListener('resize', () => {
        // Update particle canvas
        particleCanvas.width = window.innerWidth;
        particleCanvas.height = window.innerHeight;
        
        // Update neural network canvas
        neuralCanvas.width = window.innerWidth;
        neuralCanvas.height = window.innerHeight;
        
        // Update header height
        headerHeight = header.offsetHeight;
    });

    // ========== GSAP Animations - Enhanced ==========
    // Header content animation with staggered effect
    const headerTimeline = gsap.timeline();
    
    headerTimeline
        .from('.header-content h1', {
            duration: 1.2,
            y: 70,
            opacity: 0,
            ease: 'power3.out',
            delay: 0.2
        })
        .from('.header-content .subtitle', {
            duration: 1.2,
            y: 30,
            opacity: 0,
            ease: 'power3.out'
        }, "-=0.8")
        .from('.scroll-indicator', {
            duration: 1,
            opacity: 0,
            y: 20,
            ease: 'power3.out'
        }, "-=0.4");

    // Scroll animations with better triggers
    gsap.registerPlugin(ScrollTrigger);
    
    // Section headings with split text effect
    gsap.utils.toArray('.section h2').forEach(heading => {
        // Create a shimmer effect on scroll
        gsap.from(heading, {
            scrollTrigger: {
                trigger: heading,
                start: "top 75%",
                toggleActions: "play none none none"
            },
            duration: 1,
            opacity: 0,
            y: 40,
            ease: "power3.out",
            onComplete: () => {
                // Add shine animation after appearing
                gsap.to(heading, {
                    backgroundImage: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.8) 50%, rgba(255,255,255,0) 100%)',
                    backgroundSize: '200% 100%',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: '120% 0',
                    duration: 1.5,
                    ease: "power4.inOut"
                });
            }
        });
    });

    // Animate the focus areas in a cascading effect
    gsap.utils.toArray('.focus-area').forEach((area, index) => {
        gsap.from(area, {
            scrollTrigger: {
                trigger: area,
                start: "top 85%",
                toggleActions: "play none none none"
            },
            duration: 0.8,
            opacity: 0,
            y: 40,
            rotateX: "15deg",
            transformOrigin: "top center",
            delay: index * 0.15,
            ease: "power3.out"
        });
    });
    
    // Animate trend items with staggered effect
    gsap.from('.trend-item', {
        scrollTrigger: {
            trigger: '.trend-items',
            start: "top 80%",
        },
        duration: 0.8,
        opacity: 0,
        y: 30,
        stagger: 0.2,
        ease: "back.out(1.4)"
    });
    
    // Animate next steps list with more dynamic movement
    gsap.from('.step-list li', {
        scrollTrigger: {
            trigger: '.step-list',
            start: "top 80%",
        },
        duration: 0.8,
        opacity: 0,
        x: -50,
        stagger: 0.15,
        ease: "power3.out"
    });

    // Add hover animation for focus areas with 3D effect
    const focusAreas = document.querySelectorAll('.focus-area');
    
    if (focusAreas) {
        focusAreas.forEach(area => {
            area.addEventListener('mouseenter', () => {
                gsap.to(area, {
                    duration: 0.4,
                    y: -12,
                    rotateX: "5deg",
                    rotateY: "5deg",
                    boxShadow: '0 20px 40px rgba(74, 0, 224, 0.3)',
                    borderTopColor: 'var(--primary)',
                    ease: "power2.out"
                });
            });
            
            area.addEventListener('mouseleave', () => {
                gsap.to(area, {
                    duration: 0.6,
                    y: 0,
                    rotateX: "0deg",
                    rotateY: "0deg",
                    boxShadow: 'var(--focus-area-shadow)',
                    borderTopColor: 'transparent',
                    ease: "power3.out"
                });
            });
        });
    }
    
    // Interactive Next Steps items with enhanced animations
    const stepItems = document.querySelectorAll('.step-list li');
    
    if (stepItems) {
        stepItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                gsap.to(item, {
                    duration: 0.3,
                    x: 8,
                    backgroundColor: 'rgba(108, 99, 255, 0.08)',
                    boxShadow: '0 8px 25px rgba(74, 0, 224, 0.2)',
                    ease: "power2.out"
                });
            });
            
            item.addEventListener('mouseleave', () => {
                gsap.to(item, {
                    duration: 0.5,
                    x: 0,
                    backgroundColor: 'white',
                    boxShadow: 'var(--box-shadow)',
                    ease: "power2.out"
                });
            });
        });
    }

    // Enhanced glitch text animation
    const glitchElement = document.querySelector('.glitch-text');
    if (glitchElement) {
        // Initial glitch on page load
        setTimeout(() => {
            glitchElement.classList.add('active');
            setTimeout(() => {
                glitchElement.classList.remove('active');
            }, 400);
        }, 1500);
        
        // Recurring glitches
        setInterval(() => {
            // Multiple quick glitches
            for (let i = 0; i < 3; i++) {
                setTimeout(() => {
                    glitchElement.classList.add('active');
                    setTimeout(() => {
                        glitchElement.classList.remove('active');
                    }, 150);
                }, i * 200);
            }
        }, 5000);
    }
    
    // Add interactive animation to code blocks
    const codeBlocks = document.querySelectorAll('.code-block');
    
    if (codeBlocks) {
        codeBlocks.forEach(block => {
            block.addEventListener('mouseenter', () => {
                gsap.to(block, {
                    duration: 0.3,
                    scale: 1.02,
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.25)',
                    ease: "power2.out"
                });
            });
            
            block.addEventListener('mouseleave', () => {
                gsap.to(block, {
                    duration: 0.3,
                    scale: 1,
                    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.15)',
                    ease: "power2.out"
                });
            });
        });
    }
    
    // Add hover effects to all cards for better interactivity
    const allCards = document.querySelectorAll('.info-card, .tool');
    
    if (allCards) {
        allCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                gsap.to(card, {
                    duration: 0.3,
                    y: -8,
                    boxShadow: '0 15px 35px rgba(0, 0, 0, 0.15)',
                    ease: "power2.out"
                });
            });
            
            card.addEventListener('mouseleave', () => {
                gsap.to(card, {
                    duration: 0.5,
                    y: 0, 
                    boxShadow: 'var(--box-shadow)',
                    ease: "power2.out"
                });
            });
        });
    }
    
    // Add ripple effect to buttons
    const buttons = document.querySelectorAll('.cta-button a');
    
    if (buttons) {
        buttons.forEach(button => {
            button.addEventListener('mouseenter', () => {
                gsap.to(button, {
                    duration: 0.3,
                    backgroundSize: '150% 100%',
                    ease: "power1.out"
                });
            });
            
            button.addEventListener('mouseleave', () => {
                gsap.to(button, {
                    duration: 0.5,
                    backgroundSize: '100% 100%',
                    ease: "power1.out"
                });
            });
            
            button.addEventListener('click', (e) => {
                // Create ripple effect
                const ripple = document.createElement('span');
                ripple.classList.add('ripple-effect');
                button.appendChild(ripple);
                
                const rect = button.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                ripple.style.left = `${x}px`;
                ripple.style.top = `${y}px`;
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });
    }
});
