document.addEventListener('DOMContentLoaded', () => {
    const scanner = document.getElementById('scanner-area');
    const ringFill = document.getElementById('progress-ring');
    const instructionText = document.getElementById('instruction-text');
    const systolicVal = document.getElementById('systolic-val');
    const diastolicVal = document.getElementById('diastolic-val');
    const bpmVal = document.getElementById('bpm-val');
    const progressData = document.getElementById('progress-data');
    const videoOverlay = document.getElementById('video-overlay');
    const closeVideo = document.getElementById('close-video');
    const prankVideo = document.getElementById('prank-video');

    // CONFIGURATION: Replace THIS link with your Google Drive Video Link
    // Format: https://drive.google.com/file/d/FILE_ID/preview
    const MY_DRIVE_VIDEO_LINK = "https://drive.google.com/file/d/14lug7138TIC17xB41JJjEDwK_UaBtsD1/preview?autoplay=1"; // Autoplay enabled!

    let progress = 0;
    let isScanning = false;
    let scanInterval;

    const startScan = (e) => {
        if (isScanning) return;
        
        // Prevent mobile context menus and scaling
        if (e.cancelable) e.preventDefault();
        
        isScanning = true;
        scanner.classList.add('scanning');
        instructionText.innerText = "HOLD STEADY... SCANNING";
        progressData.style.opacity = "1";

        // Real haptic feedback (Vibrate)
        if (navigator.vibrate) {
            navigator.vibrate([10, 20, 10]); // Subtle medical-grade pulse
        }
        
        scanInterval = setInterval(() => {
            progress += 1;
            
            // Pulse vibration every 1 second
            if (progress % 20 === 0 && navigator.vibrate) {
                navigator.vibrate(30); 
            }
            
            // UI Feedback
            if (progress < 100) {
                // Update ring fill (bottom up)
                ringFill.style.clipPath = `inset(${100 - progress}% 0 0 0)`;
                
                // Randomize data to look "real"
                if (progress % 5 === 0) {
                    systolicVal.innerText = Math.floor(110 + Math.random() * 15);
                    diastolicVal.innerText = Math.floor(70 + Math.random() * 10);
                    bpmVal.innerText = Math.floor(65 + Math.random() * 20);
                }

                // Update text
                if (progress > 30 && progress < 60) instructionText.innerText = "CALIBRATING...";
                if (progress > 60 && progress < 90) instructionText.innerText = "FINALIZING ANALYSIS...";
                if (progress > 90) instructionText.innerText = "GENERATING RESULTS...";

            } else {
                completeScan();
            }
        }, 50); // ~5 seconds for full scan
    };

    const stopScan = () => {
        if (!isScanning) return;
        if (progress < 100) {
            resetScan();
        }
    };

    const resetScan = () => {
        clearInterval(scanInterval);
        isScanning = false;
        progress = 0;
        scanner.classList.remove('scanning');
        ringFill.style.clipPath = `inset(100% 0 0 0)`;
        instructionText.innerText = "PLACE THUMB HERE TO START";
        progressData.style.opacity = "0";
        systolicVal.innerText = "---";
        diastolicVal.innerText = "---";
        bpmVal.innerText = "---";
    };

    const completeScan = () => {
        clearInterval(scanInterval);
        instructionText.innerText = "ANALYSIS COMPLETE!";
        
        // Show the overlay immediately
        videoOverlay.classList.add('active');
        
        // Instant play with volume (interaction already occurred)
        if (prankVideo) {
            prankVideo.play().catch(e => console.error("Video failed to play:", e));
        }
    };

    // Close Video
    closeVideo.addEventListener('click', () => {
        videoOverlay.classList.remove('active');
        if (prankVideo) {
            prankVideo.pause();
            prankVideo.currentTime = 0;
        }
        resetScan();
    });

    // Touch Support
    scanner.addEventListener('touchstart', startScan);
    scanner.addEventListener('touchend', stopScan);
    scanner.addEventListener('touchcancel', stopScan);

    // Mouse Support
    scanner.addEventListener('mousedown', startScan);
    scanner.addEventListener('mouseup', stopScan);
    scanner.addEventListener('mouseleave', stopScan);
});
