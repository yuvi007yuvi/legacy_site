document.addEventListener('DOMContentLoaded', () => {

    // --- Authentication Logic ---
    // You can add as many passwords as you want here
    const VALID_PASSWORDS = ["9752462768", "admin"];

    const loginOverlay = document.getElementById('loginOverlay');
    const mainContent = document.getElementById('mainAdminContent');
    const passwordInput = document.getElementById('adminPassword');
    const loginBtn = document.getElementById('loginBtn');
    const loginError = document.getElementById('loginError');

    // Check Session
    if (sessionStorage.getItem('adminAuth') === 'true') {
        if (loginOverlay) loginOverlay.remove();
        if (mainContent) mainContent.classList.remove('d-none');
    }

    function attemptLogin() {
        if (!passwordInput || !loginOverlay || !mainContent || !loginError) return; // Ensure elements exist

        if (VALID_PASSWORDS.includes(passwordInput.value)) {
            sessionStorage.setItem('adminAuth', 'true');
            loginOverlay.style.opacity = '0';
            setTimeout(() => {
                loginOverlay.remove();
                mainContent.classList.remove('d-none');
            }, 300); // Smooth fade
        } else {
            loginError.classList.remove('d-none');
            passwordInput.classList.add('is-invalid');
            passwordInput.value = '';
        }
    }

    if (loginBtn) {
        loginBtn.addEventListener('click', attemptLogin);
        if (passwordInput) {
            passwordInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') attemptLogin();
            });
            // Remove error on input
            passwordInput.addEventListener('input', () => {
                if (loginError) loginError.classList.add('d-none');
                passwordInput.classList.remove('is-invalid');
            });
        }
    }


    // --- ID Card Generator Logic ---
    // Elements
    const empNameInput = document.getElementById('empName');
    const empRoleInput = document.getElementById('empRole');
    const empIdInput = document.getElementById('empId');
    const empValidInput = document.getElementById('empValid');
    const empBloodInput = document.getElementById('empBlood');
    const empPhotoInput = document.getElementById('empPhoto');

    // Preview Elements
    const previewName = document.getElementById('previewName');
    const previewRole = document.getElementById('previewRole');
    const previewId = document.getElementById('previewId');
    const previewValid = document.getElementById('previewValid');
    const previewBlood = document.getElementById('previewBlood');
    const previewPhoto = document.getElementById('previewPhoto');

    // QR Code Initialization
    const qrContainer = document.getElementById("qrCodeContainer");

    // We will use a robust external API for QR generation to avoid library issues
    // API: https://api.qrserver.com/v1/create-qr-code/
    function updateQR() {
        const name = empNameInput.value || "Employee Name";
        const role = empRoleInput.value || "Designation";
        const id = empIdInput.value || "PS-XXXX-000";
        const valid = empValidInput.value || "Dec 2026";
        const blood = empBloodInput.value || "O+";

        // Extensive verification text with Website Link
        const qrText = `Name: ${name} | Role: ${role} | ID: ${id} | Valid: ${valid} | Blood: ${blood} | Verify at: https://politicalsoch.in`;
        const encodedText = encodeURIComponent(qrText);

        // Generate URL
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodedText}&color=000000&bgcolor=ffffff`;

        // Create or Update Image
        if (qrContainer) {
            qrContainer.innerHTML = `<img src="${qrUrl}" alt="QR Code" crossorigin="anonymous" style="width:100%; height:100%;">`;
        }
    }

    // Initialize QR
    updateQR();

    // Live Update Listeners
    if (empNameInput) {
        empNameInput.addEventListener('input', (e) => {
            if (previewName) previewName.textContent = e.target.value || 'Employee Name';
            updateQR();
        });
    }

    if (empRoleInput) {
        empRoleInput.addEventListener('input', (e) => {
            if (previewRole) previewRole.textContent = e.target.value || 'Designation';
            updateQR();
        });
    }

    if (empIdInput) {
        empIdInput.addEventListener('input', (e) => {
            if (previewId) previewId.textContent = e.target.value || 'PS-XXXX-000';
            updateQR();
        });
    }

    if (empValidInput) {
        empValidInput.addEventListener('input', (e) => {
            if (previewValid) previewValid.textContent = e.target.value || 'Dec 2026';
            updateQR();
        });
    }

    if (empBloodInput) {
        empBloodInput.addEventListener('input', (e) => {
            if (previewBlood) previewBlood.textContent = e.target.value || 'O+';
            updateQR();
        });
    }

    // Image Upload Handler
    if (empPhotoInput) {
        empPhotoInput.addEventListener('change', function (e) {
            const defaultIcon = document.getElementById('defaultIcon');

            if (e.target.files && e.target.files[0]) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    if (previewPhoto) {
                        previewPhoto.src = e.target.result;
                        previewPhoto.style.display = 'block'; // Show image
                    }
                    if (defaultIcon) {
                        defaultIcon.style.display = 'none'; // Hide icon
                    }
                }
                reader.readAsDataURL(e.target.files[0]);
            }
        });
    }

    // Helper Function to Download Canvas
    function downloadDiv(elementId, fileName, buttonId) {
        const btn = document.getElementById(buttonId);
        if (!btn) return;

        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i> Generating...';

        // Wait for fonts and images
        const cardElement = document.querySelector(elementId);
        if (!cardElement) {
            console.error("Card element not found:", elementId);
            btn.innerHTML = originalText;
            return;
        }

        document.fonts.ready.then(function () {
            html2canvas(cardElement, {
                scale: 3,
                backgroundColor: null,
                useCORS: true,
                allowTaint: true, // Allow cross-origin images if necessary
                logging: false
            }).then(canvas => {
                const link = document.createElement('a');
                link.download = fileName;
                link.href = canvas.toDataURL('image/png');
                link.click();
                btn.innerHTML = originalText;
            }).catch(err => {
                console.error('Generation failed:', err);
                alert('Could not generate ID card. Check console for details.');
                btn.innerHTML = originalText;
            });
        });
    }

    // Event Listeners for Download
    const downloadFrontBtn = document.getElementById('downloadFrontBtn');
    const downloadBackBtn = document.getElementById('downloadBackBtn');

    if (downloadFrontBtn) {
        downloadFrontBtn.addEventListener('click', () => {
            const name = empNameInput ? (empNameInput.value || 'Staff') : 'Staff';
            downloadDiv("#captureTargetFront", `ID-Front-${name}.png`, "downloadFrontBtn");
        });
    }

    if (downloadBackBtn) {
        downloadBackBtn.addEventListener('click', () => {
            const name = empNameInput ? (empNameInput.value || 'Staff') : 'Staff';
            downloadDiv("#captureTargetBack", `ID-Back-${name}.png`, "downloadBackBtn");
        });
    }

    // PDF Download Handler
    const downloadPdfBtn = document.getElementById('downloadPdfBtn');
    if (downloadPdfBtn) {
        downloadPdfBtn.addEventListener('click', async () => {
            const btn = downloadPdfBtn;
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i> Generating PDF...';

            try {
                const { jsPDF } = window.jspdf;
                const pdf = new jsPDF('p', 'mm', 'a4'); // Portrait, Millimeters, A4

                // Card Dimensions in PDF (approx credit card size: 85.6mm x 53.98mm)
                // We'll scale up slightly for visibility on A4
                const pdfWidth = 90;
                const pdfHeight = 145; // Vertical card roughly
                const margin = 10;

                // Capture Front
                const frontCanvas = await html2canvas(document.querySelector("#captureTargetFront"), { scale: 3, useCORS: true, allowTaint: true });
                const frontImg = frontCanvas.toDataURL('image/png');

                // Capture Back
                const backCanvas = await html2canvas(document.querySelector("#captureTargetBack"), { scale: 3, useCORS: true, allowTaint: true });
                const backImg = backCanvas.toDataURL('image/png');

                const name = empNameInput ? (empNameInput.value || 'Staff') : 'Staff';

                // Add Front Image
                pdf.text(`ID Card: ${name}`, margin, margin);
                pdf.addImage(frontImg, 'PNG', margin, margin + 10, pdfWidth, pdfHeight);

                // Add Back Image (Side by side or below? A4 is 210mm wide. 90+90+margins fits tight or stack)
                // Let's stack them for safety
                pdf.addImage(backImg, 'PNG', margin + pdfWidth + 10, margin + 10, pdfWidth, pdfHeight);

                pdf.save(`ID-Card-Full-${name}.pdf`);

            } catch (error) {
                console.error("PDF Generation Error:", error);
                alert("Failed to generate PDF. See console.");
            } finally {
                btn.innerHTML = originalText;
            }
        });
    }
});
