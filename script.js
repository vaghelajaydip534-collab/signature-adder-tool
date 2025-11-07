document.addEventListener('DOMContentLoaded', () => {
    // Theme switcher
    const themeSwitcher = document.getElementById('checkbox');
    const currentTheme = localStorage.getItem('theme');

    if (currentTheme) {
        document.documentElement.setAttribute('data-theme', currentTheme);
        if (currentTheme === 'dark') {
            themeSwitcher.checked = true;
        }
    }

    themeSwitcher.addEventListener('change', () => {
        if (themeSwitcher.checked) {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
        }
    });

    // Mobile navigation
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('nav-active');
    });

    // Tool tabs
    const tabs = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            tabContents.forEach(content => {
                if (content.id === tab.dataset.tab) {
                    content.classList.add('active');
                } else {
                    content.classList.remove('active');
                }
            });
        });
    });

    // Draw mode
    const canvas = document.getElementById('signature-canvas');
    const ctx = canvas.getContext('2d');
    let drawing = false;

    // Set initial canvas size
    resizeCanvas();

    function startPosition(e) {
        drawing = true;
        draw(e);
    }

    function endPosition() {
        drawing = false;
        ctx.beginPath();
    }

    function draw(e) {
        if (!drawing) return;
        ctx.lineWidth = document.getElementById('pen-size').value;
        ctx.lineCap = 'round';
        ctx.strokeStyle = document.getElementById('pen-color').value;

        ctx.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
    }

    canvas.addEventListener('mousedown', startPosition);
    canvas.addEventListener('mouseup', endPosition);
    canvas.addEventListener('mousemove', draw);

    // Add touch support
    canvas.addEventListener('touchstart', (e) => {
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent('mousedown', {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        canvas.dispatchEvent(mouseEvent);
    }, false);

    canvas.addEventListener('touchend', () => {
        const mouseEvent = new MouseEvent('mouseup', {});
        canvas.dispatchEvent(mouseEvent);
    }, false);

    canvas.addEventListener('touchmove', (e) => {
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent('mousemove', {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        canvas.dispatchEvent(mouseEvent);
    }, false);


    document.getElementById('clear-button').addEventListener('click', () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    });

    // Undo functionality needs to be implemented by saving canvas states

    document.getElementById('download-png-draw').addEventListener('click', () => {
        const link = document.createElement('a');
        link.download = 'signature.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    });

    function resizeCanvas() {
        const ratio = Math.max(window.devicePixelRatio || 1, 1);
        canvas.width = canvas.offsetWidth * ratio;
        canvas.height = canvas.offsetHeight * ratio;
        canvas.getContext("2d").scale(ratio, ratio);
    }

    window.addEventListener('resize', resizeCanvas);


    // Type mode
    const fonts = [
        'Dancing Script', 'Pacifico', 'Sacramento', 'Great Vibes', 'Satisfy',
        'Patrick Hand', 'Allura', 'Yellowtail', 'Alex Brush', 'Courgette',
        'Mr Bedfort', 'Homemade Apple', 'Kalam', 'Reenie Beanie', 'Herr Von Muellerhoff',
        'Indie Flower', 'Gochi Hand', 'Tangerine', 'Rochester', 'Oleo Script',
        'La Belle Aurore', 'Cookie', 'Parisienne', 'Shadows Into Light', 'Brittany Signature'
    ];

    const fontSelector = document.getElementById('font-family');
    fonts.forEach(font => {
        const option = document.createElement('option');
        option.value = font;
        option.textContent = font;
        option.style.fontFamily = font;
        fontSelector.appendChild(option);
    });

    const signatureText = document.getElementById('signature-text');
    const signaturePreview = document.getElementById('signature-preview');
    const fontSize = document.getElementById('font-size');
    const letterSpacing = document.getElementById('letter-spacing');

    function updatePreview() {
        signaturePreview.textContent = signatureText.value || 'Your Signature';
        signaturePreview.style.fontFamily = fontSelector.value;
        signaturePreview.style.fontSize = `${fontSize.value}px`;
        signaturePreview.style.letterSpacing = `${letterSpacing.value}px`;
    }

    signatureText.addEventListener('input', updatePreview);
    fontSelector.addEventListener('change', updatePreview);
    fontSize.addEventListener('input', updatePreview);
    letterSpacing.addEventListener('input', updatePreview);

    updatePreview();

    document.getElementById('download-png-type').addEventListener('click', () => {
        // Use a library like html2canvas or draw to a temporary canvas to export
        alert('PNG download for typed signature requires an external library or more complex canvas drawing.');
    });

    document.getElementById('download-svg-type').addEventListener('click', () => {
        const svg = `
            <svg xmlns="http://www.w3.org/2000/svg" width="400" height="150">
                <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle"
                    style="font-family: '${fontSelector.value}'; font-size: ${fontSize.value}px; letter-spacing: ${letterSpacing.value}px;">
                    ${signatureText.value || 'Your Signature'}
                </text>
            </svg>
        `;
        const blob = new Blob([svg], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = 'signature.svg';
        link.href = url;
        link.click();
    });

    // Contact form validation
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const successMessage = document.getElementById('success-message');
            successMessage.style.display = 'block';
            contactForm.reset();
        });
    }
});