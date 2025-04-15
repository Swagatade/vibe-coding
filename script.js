document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS animation library with more dynamic settings
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: false,
        mirror: true,
        anchorPlacement: 'top-bottom'
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
