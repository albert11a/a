// Objekt zur Speicherung der Benutzerantworten
const userResponses = {};

// Funktion zum Starten des Fragebogens 
function startQuestionnaire() {
    // Direkt mit der ersten Frage starten
    document.getElementById("question-container").style.display = "block";
    document.getElementById("question1").style.display = "block";
    document.getElementById("answers1").style.display = "block";
}

// Starten des Fragebogens beim Laden der Seite
window.onload = startQuestionnaire;

// Funktion zum Umschalten der Auswahl von Antwortboxen
function toggleSelection(element) {
    // Nur für Fragen 1 und 2 anwenden
    const questionId = element.parentElement.id;
    if (questionId !== 'answers1' && questionId !== 'answers2') return;

    element.classList.toggle('selected');

    // Prüfen, ob mindestens eine Antwort ausgewählt wurde
    const selectedAnswers = element.parentElement.querySelectorAll('.answer-box.selected');

    // Bestimme die entsprechende continue-box ID
    const questionNumber = questionId.replace('answers', '');
    const continueBox = document.getElementById(`continue${questionNumber}`);

    if (selectedAnswers.length > 0) {
        // Hinweis und Vazhdo-Button anzeigen
        continueBox.style.display = 'block';
    } else {
        // Hinweis und Vazhdo-Button ausblenden
        continueBox.style.display = 'none';
    }

    // Speichern der ausgewählten Antworten
    const selectedTexts = Array.from(selectedAnswers).map(box => {
        const heading = box.querySelector('.answer-heading');
        if (heading) {
            return heading.innerText;
        } else {
            return box.querySelector('input').value.trim();
        }
    });
    userResponses[`question${questionNumber}`] = selectedTexts;
}

// Funktion zum Anzeigen der nächsten Frage
function nextQuestion(nextQuestionNumber) {
    // Versteckt die aktuelle Frage, Antworten und continue-box
    const currentQuestion = document.getElementById(`question${nextQuestionNumber - 1}`);
    const currentAnswers = document.getElementById(`answers${nextQuestionNumber - 1}`);
    const currentContinue = document.getElementById(`continue${nextQuestionNumber - 1}`);

    if (currentQuestion) currentQuestion.style.display = "none";
    if (currentAnswers) currentAnswers.style.display = "none";
    if (currentContinue) currentContinue.style.display = "none";

    // Zeige die nächste Frage und Antworten an
    const nextQuestion = document.getElementById(`question${nextQuestionNumber}`);
    const nextAnswers = document.getElementById(`answers${nextQuestionNumber}`);
    const nextContinue = document.getElementById(`continue${nextQuestionNumber}`);

    if (nextQuestion) nextQuestion.style.display = "block";
    if (nextAnswers) nextAnswers.style.display = "block";

    // Überprüfen, ob die nächste Frage Eingabefelder hat
    if (nextQuestionNumber === 4 || nextQuestionNumber === 5) {
        // Für die neuen Fragen 4 und 5 sind die "Vazhdo"-Buttons immer sichtbar
        if (nextContinue) nextContinue.style.display = 'block';
    } else {
        if (nextContinue) nextContinue.style.display = 'none'; // Anfangs ausblenden
    }

    // Scrollt automatisch nach oben
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Ausgabe zur Fehlerverfolgung in der Konsole
    console.log(`Zur nächsten Frage: ${nextQuestionNumber}`);
}

// Funktion zur Aktualisierung des Sensitivitätswerts
function updateSensitivityValue(value) {
    document.getElementById("sensitivityValue").textContent = value;
    // Optional: Speichern der Sensitivitätswerte
    userResponses['sensitivity'] = value;
}

// Funktion zum Öffnen der Kamera und Initialisieren von FaceMesh
async function openCamera() {
    const video = document.getElementById('cameraView');
    const overlay = document.getElementById('overlay');
    const ctx = overlay.getContext('2d');

    try {
        // Videostream abrufen
        const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "user" }
        });
        video.srcObject = stream;

        video.onloadedmetadata = () => {
            console.log("Video-Metadaten geladen");
            video.play().then(() => {
                console.log("Video wird abgespielt");
                document.getElementById("cameraContainer").style.display = "block";

                // Elemente einblenden nach Kamerafreigabe
                document.getElementById('topBorder').style.display = 'block';
                document.getElementById('bottomBorder').style.display = 'block';
                document.getElementById('buttonLogoContainer').style.display = 'flex';
                document.getElementById('closeButton').style.display = 'block';

                disableGestures();

                resizeVideoOverlay(video, overlay);
                initializeFaceMesh(video, overlay, ctx);
                window.addEventListener('resize', () => resizeVideoOverlay(video, overlay));
            }).catch(error => {
                console.error("Fehler beim Abspielen des Videos: ", error);
            });
        };
    } catch (error) {
        console.error("Fehler beim Öffnen der Kamera: ", error);
        alert("Die Kamera konnte nicht geöffnet werden. Stellen Sie sicher, dass Sie den Zugriff erlaubt haben.");
    }
}

// Funktion zur Anpassung des Video- und Overlay-Elements an die Bildschirmgröße
function resizeVideoOverlay(video, overlay) {
    overlay.width = video.videoWidth;
    overlay.height = video.videoHeight;

    const aspectRatio = video.videoWidth / video.videoHeight;

    if (window.innerWidth / window.innerHeight > aspectRatio) {
        video.style.width = '100%';
        video.style.height = 'auto';
        overlay.style.width = '100%';
        overlay.style.height = 'auto';
    } else {
        video.style.width = 'auto';
        video.style.height = '100%';
        overlay.style.width = 'auto';
        overlay.style.height = '100%';
    }
}

// Funktion zur Initialisierung von FaceMesh und Kamera
function initializeFaceMesh(video, overlay, ctx) {
    const faceMesh = new FaceMesh({ locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}` });
    faceMesh.setOptions({
        maxNumFaces: 1,
        refineLandmarks: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
    });
    faceMesh.onResults(results => onFaceMeshResults(results, video, overlay, ctx));

    const camera = new Camera(video, {
        onFrame: async () => {
            await faceMesh.send({ image: video });
        }
    });
    camera.start();
    console.log("FaceMesh erfolgreich initialisiert.");
}

// Funktion zur Verarbeitung der Ergebnisse von FaceMesh
function onFaceMeshResults(results, video, overlay, ctx) {
    ctx.clearRect(0, 0, overlay.width, overlay.height);
    ctx.drawImage(video, 0, 0, overlay.width, overlay.height);

    if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
        const landmarks = results.multiFaceLandmarks[0];
        drawLandmarks(landmarks, ctx);
    } else {
        console.log("Kein Gesicht erkannt.");
    }
}

// Funktion zum Zeichnen der Gesichtspunkte
function drawLandmarks(landmarks, ctx) {
    ctx.fillStyle = "cyan";
    landmarks.forEach((landmark) => {
        const x = landmark.x * overlay.width;
        const y = landmark.y * overlay.height;
        ctx.beginPath();
        ctx.arc(x, y, 1, 0, 2 * Math.PI);
        ctx.fill();
    });
}

// Funktion zum Schließen der Kamera
function closeCamera() {
    const video = document.getElementById('cameraView');
    const stream = video.srcObject;

    if (stream) {
        stream.getTracks().forEach(track => track.stop());
    }
    video.srcObject = null;
    document.getElementById("cameraContainer").style.display = "none";
    enableGestures();
    console.log("Kamera geschlossen.");
}

// Funktion zum Aufnehmen eines Fotos
function takePhoto() {
    const video = document.getElementById('cameraView');
    const overlay = document.getElementById('overlay');

    // Überprüfen, ob das Video bereit ist
    if (!video || video.readyState < 2) {
        alert('Das Video ist noch nicht bereit. Bitte versuchen Sie es erneut.');
        return;
    }

    // Ermitteln der nativen Videoabmessungen
    const videoWidth = video.videoWidth;
    const videoHeight = video.videoHeight;

    // Canvas erstellen und Größe setzen
    const canvas = document.createElement('canvas');
    canvas.width = videoWidth;
    canvas.height = videoHeight;

    const ctx = canvas.getContext('2d');

    // Spiegelung wie im CSS aufheben
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);

    // Zeichnen des Videos auf das Canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Rückgängigmachen der Transformation für das Overlay
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    // Zeichnen des Overlays auf das Canvas
    ctx.drawImage(
        overlay,
        0,
        0,
        overlay.width,
        overlay.height,
        0,
        0,
        canvas.width,
        canvas.height
    );

    // Foto als Data URL erhalten
    const dataURL = canvas.toDataURL('image/png');

    // Speichern des Fotos und Weiterleitung
    localStorage.setItem('capturedImage', dataURL);
    window.location.href = 'nextPage.html';
}

// Funktionen zur Deaktivierung und Aktivierung von Gesten
function disableGestures() {
    document.addEventListener('touchmove', preventTouch, { passive: false });
    document.addEventListener('gesturestart', preventGesture);
    document.addEventListener('gesturechange', preventGesture);
    document.addEventListener('gestureend', preventGesture);
}

function enableGestures() {
    document.removeEventListener('touchmove', preventTouch);
    document.removeEventListener('gesturestart', preventGesture);
    document.removeEventListener('gesturechange', preventGesture);
    document.removeEventListener('gestureend', preventGesture);
}

// Hilfsfunktionen zur Verhinderung von Gesten
function preventTouch(event) {
    event.preventDefault();  // Verhindert Scrollen durch Berühren
}

function preventGesture(event) {
    event.preventDefault();  // Verhindert Gesten wie Zoom
}
// Funktion zur Erkennung von In-App-Browsern wie Instagram
function isInAppBrowser() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    return /Instagram|FBAV|FBAN|Twitter/i.test(userAgent);
}

// Funktion zum Öffnen der Seite im Standardbrowser des Geräts
function openInBrowser() {
    const url = window.location.href; // aktuelle URL der Seite
    window.open(url, '_blank'); // öffnet die Seite in einem neuen Tab/Standardbrowser
}

// Funktion, die prüft, ob der Button angezeigt werden soll
function checkBrowserCompatibility() {
    if (isInAppBrowser()) {
        document.getElementById("openInBrowserContainer").style.display = "block";
    }
}

// Ruft die Browser-Kompatibilitätsprüfung beim Laden der Seite auf
window.onload = function() {
    checkBrowserCompatibility();
    startQuestionnaire(); // Startet den Fragebogen
};

// Funktion zur Erkennung von In-App-Browsern wie Instagram und Facebook
function isInAppBrowser() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    return /Instagram|FBAV|FBAN|Twitter/i.test(userAgent);
}

// Funktion zum Öffnen der Seite im Standardbrowser des Geräts
function openInBrowser() {
    const url = window.location.href; // aktuelle URL der Seite
    window.open(url, '_blank'); // öffnet die Seite in einem neuen Tab/Standardbrowser
}

// Funktion, die prüft, ob der Button angezeigt werden soll
function checkBrowserCompatibility() {
    if (isInAppBrowser()) {
        // Zeige eine Meldung und den Button an, um die Seite im Standardbrowser zu öffnen
        document.getElementById("openInBrowserContainer").style.display = "block";
    } else {
        // Kamera direkt öffnen, wenn es ein Standardbrowser ist
        openCamera();
    }
}

// Ruft die Browser-Kompatibilitätsprüfung beim Laden der Seite auf
window.onload = function() {
    checkBrowserCompatibility();
    startQuestionnaire(); // Startet den Fragebogen
};

// HTML für den "Im Browser öffnen"-Button
/*
<div id="openInBrowserContainer" style="display: none;">
    <p>Um die Kamera zu nutzen, öffnen Sie diese Seite bitte im Standardbrowser Ihres Geräts.</p>
    <button onclick="openInBrowser()">Im Browser öffnen</button>
</div>
*/
