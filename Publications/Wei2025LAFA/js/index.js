window.HELP_IMPROVE_VIDEOJS = false;

// More Works Dropdown Functionality
function toggleMoreWorks() {
    const dropdown = document.getElementById('moreWorksDropdown');
    const button = document.querySelector('.more-works-btn');
    
    if (dropdown.classList.contains('show')) {
        dropdown.classList.remove('show');
        button.classList.remove('active');
    } else {
        dropdown.classList.add('show');
        button.classList.add('active');
    }
}

// Close dropdown when clicking outside
document.addEventListener('click', function(event) {
    const container = document.querySelector('.more-works-container');
    const dropdown = document.getElementById('moreWorksDropdown');
    const button = document.querySelector('.more-works-btn');
    
    if (container && !container.contains(event.target)) {
        dropdown.classList.remove('show');
        button.classList.remove('active');
    }
});

// Close dropdown on escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const dropdown = document.getElementById('moreWorksDropdown');
        const button = document.querySelector('.more-works-btn');
        dropdown.classList.remove('show');
        button.classList.remove('active');
    }
});

// Copy BibTeX to clipboard
function copyBibTeX() {
    const bibtexElement = document.getElementById('bibtex-code');
    const button = document.querySelector('.copy-bibtex-btn');
    const copyText = button.querySelector('.copy-text');
    
    if (bibtexElement) {
        navigator.clipboard.writeText(bibtexElement.textContent).then(function() {
            // Success feedback
            button.classList.add('copied');
            copyText.textContent = 'Cop';
            
            setTimeout(function() {
                button.classList.remove('copied');
                copyText.textContent = 'Copy';
            }, 2000);
        }).catch(function(err) {
            console.error('Failed to copy: ', err);
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = bibtexElement.textContent;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            
            button.classList.add('copied');
            copyText.textContent = 'Cop';
            setTimeout(function() {
                button.classList.remove('copied');
                copyText.textContent = 'Copy';
            }, 2000);
        });
    }
}

// Scroll to top functionality
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Show/hide scroll to top button
window.addEventListener('scroll', function() {
    const scrollButton = document.querySelector('.scroll-to-top');
    if (window.pageYOffset > 300) {
        scrollButton.classList.add('visible');
    } else {
        scrollButton.classList.remove('visible');
    }
});

// Video carousel autoplay when in view
function setupVideoCarouselAutoplay() {
    const carouselVideos = document.querySelectorAll('.results-carousel video');
    
    if (carouselVideos.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const video = entry.target;
            if (entry.isIntersecting) {
                // Video is in view, play it
                video.play().catch(e => {
                    // Autoplay failed, probably due to browser policy
                    console.log('Autoplay prevented:', e);
                });
            } else {
                // Video is out of view, pause it
                video.pause();
            }
        });
    }, {
        threshold: 0.5 // Trigger when 50% of the video is visible
    });
    
    carouselVideos.forEach(video => {
        observer.observe(video);
    });
}

$(document).ready(function() {
    // Check for click events on the navbar burger icon

    var options = {
		slidesToScroll: 1,
		slidesToShow: 1,
		loop: true,
		infinite: true,
		autoplay: true,
		autoplaySpeed: 5000,
    }

	// Initialize all div with carousel class
    var carousels = bulmaCarousel.attach('.carousel', options);
	
    bulmaSlider.attach();
    
    // Setup video autoplay for carousel
    setupVideoCarouselAutoplay();

})

// Fabrication Process Animation Logic
let currentStage = 0;
let isAnimating = false;
let laserInterval = null;
let exposureInterval = null;
let animationInterval = null;
let canvas, ctx;
let laserIntensity = 0.5;
let intensityDirection = 1;
let manualControl = false;

let max_duration = 15000;


const stageInfo = [
    {
        title: 'Direct-Write Grayscale Lithography',
        description: 'A focused laser beam writes variable intensity patterns directly onto the photoresist layer.',
        points: [
            'Laser scans across the substrate',
            'Resist chemistry varies with exposure intensity',
            // 'Potential issues: Laser focus drift, stage vibration, non-uniform photoresist thickness, incorrect exposure dose, beam profile distortion'
        ],
        html: "<p> <b>Physical Effects:</b> Optical blur, modeled as the design pattern convolved with the laser's point spread function, causes effects like corner rounding. </p>"
    },
    {
        title: 'Development',
        description: 'The exposed photoresist is chemically developed, removing the exposed areas.',
        points: [
            'Developer solution dissolves exposed resist',
            'Diffractive 3D relief is revealed',
            // 'Potential issues: Over/under-development, developer temperature variation, agitation inconsistency, resist swelling, incomplete removal'
        ],
        html: "<p> <b>Physical Effects:</b> The local exposure level nonlinearly alters the photoresist's chemistry, and the developer dissolves the resist with complex 3D chemical interactions. </p>"
    },
    {
        title: 'Nanoimprint Replication',
        description: 'UV-curable resin is deposited and UV cured to replicate the pattern.',
        points: [
            'UV resin fills the patterned substrate',
            'UV light cures the resin structure',
            // 'Potential issues: Air bubbles, incomplete resin filling, non-uniform UV exposure, mold misalignment, resin shrinkage'
        ],
        html: "<p> <b>Physical Effects:</b> Further shape distortions like volume shrinkage of the resin during curing </p>"
    },
    {
        title: 'Finished DOE',
        description: 'The cured UV resin is detached from the photoresist, leaving a replicated diffractive optical element.',
        points: [
            'Mold separation reveals final structure',
            'Pattern is transferred to UV resin',
            'Ready for optical applications',
            // 'Potential issues: Mold sticking, pattern damage during release, surface contamination, edge defects'
        ],
        html: ""
    }
];

function initCanvas() {
    canvas = document.getElementById('exposureCanvas');
    const container = document.getElementById('stageContainer');
    canvas.width = container.offsetWidth;
    // canvas.width = container.offsetHeight;
    canvas.height = 80;
    ctx = canvas.getContext('2d');
    ctx.fillStyle = '#e8d689';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function updateStageInfo() {
    const info = stageInfo[currentStage];
    const panel = document.getElementById('infoPanel');
    panel.innerHTML = `
        <div class="stage-info">
            <h2>${info.title}</h2>
            <p>${info.description}</p>
            <ul>
                ${info.points.map(point => `<li>&#9658; ${point}</li>`).join('')}
            </ul>
            ${info.html}
        </div>
    `;
    document.getElementById('stageIndicator').textContent = `Stage ${['A','B','C','D'][currentStage]}`;
}

function animateLaserIntensity() {
    if (laserInterval) return;
    laserInterval = setInterval(() => {
        laserIntensity += intensityDirection * 0.05;
        if (laserIntensity >= 1) { laserIntensity = 1; intensityDirection = -1; }
        else if (laserIntensity <= 0.2) { laserIntensity = 0.2; intensityDirection = 1; }

        const beam = document.getElementById('laserBeam');
        const glow = document.getElementById('beamGlow');
        beam.style.opacity = 0.4 + laserIntensity * 0.6;
        glow.style.opacity = 0.3 + laserIntensity * 0.7;
        glow.style.filter = `blur(${15 + laserIntensity * 15}px) brightness(${1 + laserIntensity * 0.5})`;
    }, 90); // Synchronizes brighness in the darker area
}

function stopLaserIntensity() {
    if (laserInterval) { clearInterval(laserInterval); laserInterval = null; }
    if (exposureInterval) { clearInterval(exposureInterval); exposureInterval = null; }
}

function updateAnimationState(progress) {
    const slider = document.getElementById('animationSlider');
    const sliderValue = document.getElementById('sliderValue');
    slider.value = progress;
    sliderValue.textContent = Math.round(progress) + '%';
    document.getElementById('progressFill').style.width = `${progress}%`;

    let newStage = progress < 25 ? 0 : progress < 65 ? 1 : progress < 90 ? 2 : 3;

    if (newStage !== currentStage) {
        currentStage = newStage;
        updateStageInfo();

        if (currentStage === 0) {
            const container = document.getElementById('laserContainer');
            document.getElementById('uvResin').style.opacity = '0';
            container.style.opacity = '1';
            container.style.transition = 'none';
            document.getElementById('laserBeam').style.opacity = '0.8';
            document.getElementById('beamGlow').style.opacity = '0.6';
            document.getElementById('pattern').style.opacity = '0'
            document.getElementById('photoresist').style.opacity = '1';
            document.getElementById('exposureCanvas').style.opacity = '1';
            animateLaserIntensity();
        } else if (currentStage === 1) {
            // Clear the exposure drawing
            // if (ctx && canvas) {
            //     ctx.clearRect(0, 0, canvas.width, canvas.height);
            // }
            if (ctx && canvas) {
                ctx.fillStyle = '#e8d689';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                // Draw the full exposure pattern
                for (let x = 0; x < canvas.width; x += 2) {
                    drawExposureAtPosition(x, 0.5 + Math.sin(x/0.001) * 0.3);
                }
            }
            document.getElementById('laserContainer').style.opacity = '0'
            document.getElementById('exposureCanvas').style.opacity = '0';
            document.getElementById('uvResin').style.opacity = '0';
            document.getElementById('laserBeam').style.opacity = '0';
            document.getElementById('beamGlow').style.opacity = '0';
            document.getElementById('photoresist').style.opacity = '0';
            stopLaserIntensity();
        } else if (currentStage === 2) {
            document.getElementById('laserContainer').style.opacity = '0'
            document.getElementById('uvResin').style.opacity = '1';
            document.getElementById('photoresist').style.height = '0px';
            document.getElementById('exposureCanvas').style.opacity = '0';
            document.getElementById('pattern').style.opacity = '1';
        }
    }

    if (progress < 25) {
        const stageProgress = progress / 22;
        const containerWidth = document.getElementById('stageContainer').offsetWidth;
        const laserX = -50 + stageProgress * containerWidth;
        document.getElementById('laserContainer').style.left = laserX + 'px';

        if (ctx && canvas) {
            ctx.fillStyle = '#e8d689';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            const exposureWidth = Math.max(0, stageProgress * canvas.width - 50/1.7);
            for (let x = 0; x < exposureWidth; x += 2) {
                drawExposureAtPosition(x, 0.5 + Math.sin(x/0.001) * 0.3);
            }
        }
    } else if (progress < 50) {
        const stageProgress = (progress - 25) / 25;
        document.getElementById('photoresist').style.height = (80 - stageProgress * 80) + 'px';
        canvas.style.opacity = 1 - stageProgress;
        document.getElementById('pattern').style.opacity = stageProgress;
    } else if (progress < 75) {

        const resin = document.getElementById('uvResin');
        const uvOverlay = document.getElementById('uvOverlay');
        resin.style.bottom = '60px';
        
        // Phase 1: Resin fills from progress 50 to 65
        if (progress < 65) {
            uvOverlay.style.opacity = 0; // No UV yet
            const fillProgress = (progress - 50) / 15; // 0 → 1 over 15% progress
            resin.style.height = (fillProgress * 80) + 'px';
            
        } 
        // Phase 2: UV exposure starts at progress 65
        else if (progress > 70 ) {
            resin.style.height = '80px'; // Keep resin at full height
            const uvProgress = (progress - 65) / 10; // 0 → 1 from 65 to 75
            uvOverlay.style.opacity = uvProgress //Math.min(uvProgress * 2.5, 1); // Fade in UV
        }
    } else {

        const resin = document.getElementById('uvResin');
        const uvOverlay = document.getElementById('uvOverlay');
        
        // Phase 1: UV light fades out from progress 75 to 85
        if (progress < 85) {
            const uvFadeProgress = (progress - 75) / 10; // 0 → 1 over 10% progress
            uvOverlay.style.opacity = Math.max(0, 1 - uvFadeProgress); // Fade out UV
            resin.style.bottom = '60px'; // Resin stays in place
        }
        // Phase 2: Detach UV resin from progress 85 to 100
        else {
            uvOverlay.style.opacity = 0; // UV completely off
            const detachProgress = (progress - 85) / 15; // 0 → 1 from 85 to 100
            resin.style.bottom = (60 + detachProgress * 100) + 'px'; // Move resin up
        }
    }
}

function drawExposureAtPosition(x, intensity) {
    if (!ctx || !canvas) return;
    const width = 35;
    const oscillation = Math.sin(x / 45) * 0.4 + 0.6;
    const combinedIntensity = intensity * oscillation;
    const baseR = 232, baseG = 214, baseB = 137;
    const r = Math.floor(baseR - combinedIntensity * 90);
    const g = Math.floor(baseG - combinedIntensity * 110);
    const b = Math.floor(baseB - combinedIntensity * 80);
    const gradient = ctx.createLinearGradient(x - width/2, 0, x + width/2, 0);
    gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.3)`);
    gradient.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, 1)`);
    gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0.3)`);
    ctx.fillStyle = gradient;
    ctx.fillRect(x - width/2, 0, width, canvas.height);
}

function nextStage() {
    // if (isAnimating) return;
    if (currentStage >= 3) return;
    let startProgress = (currentStage + 1) * 25;
    playAnimationFromProgress(startProgress);
}

function previousStage() {
    // if (isAnimating) return;
    if (currentStage <= 0) return;
    let startProgress = (currentStage - 1) * 25;
    playAnimationFromProgress(startProgress);
}

function playAnimationFromProgress(startProgress) {
    isAnimating = true;
    manualControl = false;
    if (animationInterval) { clearInterval(animationInterval); animationInterval = null; }
    let progress = startProgress;
    const duration = max_duration * ((100 - startProgress) / 100); // scale duration to remaining progress
    const startTime = Date.now();

    animationInterval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        progress = Math.min(startProgress + (elapsed / duration) * (100 - startProgress), 100);
        updateAnimationState(progress);
        if (progress >= 100) {
            clearInterval(animationInterval);
            animationInterval = null;
            isAnimating = false;
        }
    }, 16);

    setTimeout(() => { animateLaserIntensity(); }, 10);
    setTimeout(() => { stopLaserIntensity(); }, 8000);
}


function startAnimation() {
    if (isAnimating) return;
    isAnimating = true;
    manualControl = false;
    reset(false);

    let progress = 0;
    const startTime = Date.now();

    animationInterval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        progress = Math.min((elapsed / max_duration) * 100, 100);
        updateAnimationState(progress);
        if (progress >= 100) {
            clearInterval(animationInterval);
            animationInterval = null;
            isAnimating = false;
        }
    }, 16);

    setTimeout(() => { animateLaserIntensity(); }, 10);
    setTimeout(() => { stopLaserIntensity(); }, 8000);
}

function reset(fullClear = true) {
    stopLaserIntensity();
    if (fullClear) {
        if (animationInterval) { clearInterval(animationInterval); animationInterval = null; }
        isAnimating = false;
    }

    currentStage = 0;
    manualControl = false;
    updateStageInfo();

    if (ctx) {
        ctx.fillStyle = '#e8d689';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    const container = document.getElementById('laserContainer');
    container.style.transition = 'none';
    container.style.left = '-100px';
    container.style.opacity = '1';
    document.getElementById('beamGlow').style.filter = 'blur(20px) brightness(1)';
    document.getElementById('laserBeam').style.opacity = '0';
    document.getElementById('beamGlow').style.opacity = '1';
    document.getElementById('photoresist').style.height = '80px';
    document.getElementById('exposureCanvas').style.opacity = '1';
    document.getElementById('pattern').style.opacity = '0';
    document.getElementById('uvResin').style.height = '0';
    document.getElementById('uvResin').style.bottom = '60px';
    document.getElementById('uvOverlay').style.opacity = '0';
    document.getElementById('animationSlider').value = 0;
    document.getElementById('sliderValue').textContent = '0%';
    document.getElementById('progressFill').style.width = '0%';

    laserIntensity = 0.5;
    intensityDirection = 1;
}

window.addEventListener('load', () => {
    initCanvas();
    reset();
    const slider = document.getElementById('animationSlider');
    slider.addEventListener('input', (e) => {
        if (animationInterval) { clearInterval(animationInterval); animationInterval = null; isAnimating = false; }
        stopLaserIntensity();
        manualControl = true;
        updateAnimationState(parseFloat(e.target.value));
    });
    });

function generateWavePath() {
    const width = 1000, height = 100, base = height * 0.5;
    const amplitude = height * 0.4, wavelength = 50;
    let path = `M0,${base.toFixed(2)}`;
    for (let x = 0; x <= width; x += 10) {
        const y = base - amplitude * ((1 + 0.2 * Math.cos(x / (2 * wavelength))) * Math.sin(x / wavelength - Math.PI*1.2) - 0.02 * Math.sign(Math.cos(x / (0.1 * wavelength))));
        path += ` L${x.toFixed(2)},${y.toFixed(2)}`;
    }
    path += ` L${width},${height} L0,${height} Z`;
    return path;
}

function generateWavePathUpper() {
    const width = 1000, height = 100, base = height * 0.5;
    const amplitude = height * 0.4, wavelength = 50;
    let path = `M0,0 L0,${base.toFixed(2)}`;
    for (let x = 0; x <= width; x += 10) {
        const y = base - amplitude * ((1 + 0.2 * Math.cos(x / (2 * wavelength))) * Math.sin(x / wavelength - Math.PI * 1.2) - 0.02 * Math.sign(Math.cos(x / (0.1 * wavelength))));
        path += ` L${x.toFixed(2)},${y.toFixed(2)}`;
    }
    path += ` L${width},0 Z`;
    return path;
}
document.getElementById("wavePath").setAttribute("d", generateWavePath());
document.getElementById("resin-wavePath").setAttribute("d", generateWavePathUpper());
