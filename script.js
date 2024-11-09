// Objekt zur Speicherung der Benutzerantworten
const userResponses = {};

// Liste der Fragen, die eine Auswahl erfordern (z.B. Frage 1 und 2)
const selectionRequiredQuestions = [1, 2];

// Funktion zum Starten des Fragebogens 
function startQuestionnaire() {
    // Direkt mit der ersten Frage starten
    document.getElementById("question-container").style.display = "block";
    document.getElementById("question1").style.display = "block";
    document.getElementById("answers1").style.display = "block";
    document.getElementById("nav-buttons1").style.display = "flex";
    
    // Setze den Zustand des "Vazhdo"-Buttons für die erste Frage
    setVazhdoButtonState(1);
}

// Starten des Fragebogens beim Laden der Seite
window.onload = startQuestionnaire;

// Funktion zum Umschalten der Auswahl von Antwortboxen
function toggleSelection(element) {
    // Nur für Fragen, die eine Auswahl erfordern
    const questionId = element.parentElement.id;
    const questionNumber = parseInt(questionId.replace('answers', ''));
    if (!selectionRequiredQuestions.includes(questionNumber)) return;

    element.classList.toggle('selected');

    // Speichern der ausgewählten Antworten
    const selectedAnswers = element.parentElement.querySelectorAll('.answer-box.selected');
    const selectedTexts = Array.from(selectedAnswers).map(box => {
        const heading = box.querySelector('.answer-heading');
        if (heading) {
            return heading.innerText;
        } else {
            return box.querySelector('input').value.trim();
        }
    });
    userResponses[`question${questionNumber}`] = selectedTexts;

    // Aktualisiere den Zustand des "Vazhdo"-Buttons
    setVazhdoButtonState(questionNumber);
}

// Funktion zum Setzen des Zustands des "Vazhdo"-Buttons
function setVazhdoButtonState(questionNumber) {
    const navButtons = document.getElementById(`nav-buttons${questionNumber}`);
    if (!navButtons) return;

    const vazhdoButton = navButtons.querySelector('.vazhdo-button'); // Annahme: Der Button hat die Klasse 'vazhdo-button'
    if (!vazhdoButton) return;

    // Überprüfe, ob die aktuelle Frage eine Auswahl erfordert
    if (selectionRequiredQuestions.includes(questionNumber)) {
        // Überprüfe, ob es ausgewählte Antworten gibt
        const selected = userResponses[`question${questionNumber}`] && userResponses[`question${questionNumber}`].length > 0;

        if (selected) {
            vazhdoButton.classList.remove('disabled');
        } else {
            vazhdoButton.classList.add('disabled');
        }
    } else {
        // Fragen ab "sensetiv" erfordern keine Auswahl
        vazhdoButton.classList.remove('disabled');
    }
}

// Funktion zum Anzeigen der nächsten Frage
function nextQuestion(nextQuestionNumber) {
    // Bestimme die aktuelle Frage basierend auf der nächsten Fragenummer
    const currentQuestionNumber = nextQuestionNumber - 1;
    const currentSelections = userResponses[`question${currentQuestionNumber}`];

    // Überprüfe, ob die aktuelle Frage eine Auswahl erfordert
    if (selectionRequiredQuestions.includes(currentQuestionNumber)) {
        // Überprüfe, ob für die aktuelle Frage eine Auswahl getroffen wurde
        if (!currentSelections || currentSelections.length === 0) {
            alert('Ju lutem zgjidhni një përgjigje para se të vazhdoni.');
            return;
        }
    }

    // Versteckt die aktuelle Frage, Antworten und Nav-Buttons
    const currentQuestion = document.getElementById(`question${currentQuestionNumber}`);
    const currentAnswers = document.getElementById(`answers${currentQuestionNumber}`);
    const currentNavButtons = document.getElementById(`nav-buttons${currentQuestionNumber}`);

    if (currentQuestion) currentQuestion.style.display = "none";
    if (currentAnswers) currentAnswers.style.display = "none";
    if (currentNavButtons) currentNavButtons.style.display = "none";

    // Zeige die nächste Frage und Antworten an
    const nextQuestionElement = document.getElementById(`question${nextQuestionNumber}`);
    const nextAnswers = document.getElementById(`answers${nextQuestionNumber}`);
    const nextNavButtons = document.getElementById(`nav-buttons${nextQuestionNumber}`);

    if (nextQuestionElement) nextQuestionElement.style.display = "block";
    if (nextAnswers) nextAnswers.style.display = "block";
    if (nextNavButtons) nextNavButtons.style.display = "flex";

    // Setze den Zustand des "Vazhdo"-Buttons für die nächste Frage
    setVazhdoButtonState(nextQuestionNumber);

    // Scrollt automatisch nach oben
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Ausgabe zur Fehlerverfolgung in der Konsole
    console.log(`Zur nächsten Frage: ${nextQuestionNumber}`);
}

// Funktion zum Zurückgehen zur vorherigen Frage
function navigateBack(previousQuestionNumber) {
    // Bestimme die aktuelle Frage basierend auf der vorherigen Fragenummer
    const currentQuestionNumber = previousQuestionNumber + 1;

    // Versteckt die aktuelle Frage, Antworten und Nav-Buttons
    const currentQuestion = document.getElementById(`question${currentQuestionNumber}`);
    const currentAnswers = document.getElementById(`answers${currentQuestionNumber}`);
    const currentNavButtons = document.getElementById(`nav-buttons${currentQuestionNumber}`);

    if (currentQuestion) currentQuestion.style.display = "none";
    if (currentAnswers) currentAnswers.style.display = "none";
    if (currentNavButtons) currentNavButtons.style.display = "none";

    // Zeige die vorherige Frage und Antworten an
    const previousQuestion = document.getElementById(`question${previousQuestionNumber}`);
    const previousAnswers = document.getElementById(`answers${previousQuestionNumber}`);
    const previousNavButtons = document.getElementById(`nav-buttons${previousQuestionNumber}`);

    if (previousQuestion) previousQuestion.style.display = "block";
    if (previousAnswers) previousAnswers.style.display = "block";
    if (previousNavButtons) previousNavButtons.style.display = "flex";

    // Setze den Zustand des "Vazhdo"-Buttons für die vorherige Frage
    setVazhdoButtonState(previousQuestionNumber);

    // Scrollt automatisch nach oben
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Ausgabe zur Fehlerverfolgung in der Konsole
    console.log(`Zur vorherigen Frage: ${previousQuestionNumber}`);
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

// Funktion zur Überprüfung, ob der Browser eine In-App-Browser-Umgebung ist
function isInAppBrowser() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    return /Instagram|FBAN|FBAV|Twitter|Snapchat|LinkedIn|Pinterest|TikTok/i.test(userAgent);
}
