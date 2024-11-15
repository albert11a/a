// Objekt zur Speicherung der Benutzerantworten
const userResponses = {};

/**
 * Liste der Fragen, die eine Auswahl erfordern.
 * Diese Fragen müssen eine oder mehrere Antworten vom Benutzer erhalten, bevor er fortfahren kann.
 */
const selectionRequiredQuestions = [2, 3];

/**
 * Hilfsfunktion zur Generierung eines zufälligen Wertes innerhalb eines angegebenen Bereichs.
 * @param {number} min - Der minimale Wert (inklusive).
 * @param {number} max - Der maximale Wert (inklusive).
 * @returns {number} - Ein zufälliger Ganzzahlwert zwischen min und max.
 */
function getRandomValue(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Hilfsfunktion zur Bestimmung des Status basierend auf einem numerischen Wert.
 * @param {number} value - Der Wert, der bewertet werden soll.
 * @returns {string} - Der Status als Text ("Care Needed", "Normal", "Good").
 */
function getStatusText(value) {
    if (value < 40) {
        return 'Care Needed';
    } else if (value < 70) {
        return 'Normal';
    } else {
        return 'Good';
    }
}

/**
 * Funktion zum Starten des Fragebogens.
 * Sie zeigt die erste Frage sowie die zugehörigen Antworten und Navigationsbuttons an.
 */
function startQuestionnaire() {
    // Anzeige des gesamten Fragecontainers
    document.getElementById("question-container").style.display = "block";
    // Anzeige der ersten Frage
    document.getElementById("question1").style.display = "block";
    // Anzeige der Antwortmöglichkeiten zur ersten Frage
    document.getElementById("answers1").style.display = "block";
    // Anzeige der Navigationsbuttons zur ersten Frage
    document.getElementById("nav-buttons1").style.display = "flex";
}

/**
 * Event-Listener, der den Fragebogen beim Laden der Seite startet
 * oder die Diagnoseseite anzeigt, falls bereits ein Fragebogen abgeschlossen wurde.
 */
window.onload = function() {
    if (window.location.pathname.endsWith('nextPage.html')) {
        displayDiagnosis();
    } else {
        startQuestionnaire();
    }
};

/**
 * Funktion zum Umschalten der Auswahl von Antwortboxen.
 * @param {HTMLElement} element - Das angeklickte Antwortfeld.
 */
function toggleSelection(element) {
    // Bestimmen der Frage-ID basierend auf dem übergeordneten Element
    const questionId = element.parentElement.id;
    const questionNumber = parseInt(questionId.replace('answers', ''));
    
    // Überprüfen, ob die aktuelle Frage eine Auswahl erfordert
    if (!selectionRequiredQuestions.includes(questionNumber)) return;

    // Umschalten der 'selected' Klasse zur visuellen Hervorhebung
    element.classList.toggle('selected');

    // Sammeln aller ausgewählten Antworten innerhalb der aktuellen Frage
    const selectedAnswers = element.parentElement.querySelectorAll('.answer-box.selected');
    const selectedTexts = Array.from(selectedAnswers).map(box => {
        const heading = box.querySelector('.answer-heading');
        if (heading) {
            return heading.innerText;
        } else {
            return box.querySelector('input').value.trim();
        }
    });

    // Speichern der ausgewählten Antworten im userResponses Objekt
    userResponses[`question${questionNumber}`] = selectedTexts;

    // Aktualisieren des Zustands des "Vazhdo" (Weiter) Buttons
    setVazhdoButtonState(questionNumber);
}

/**
 * Funktion zur Einstellung des Zustands der Navigationsbuttons ("Vazhdo" und "Mbrapa").
 * @param {number} questionNumber - Die Nummer der aktuellen Frage.
 */
function setVazhdoButtonState(questionNumber) {
    // Zugriff auf die Navigationsbuttons der aktuellen Frage
    const navButtons = document.getElementById(`nav-buttons${questionNumber}`);
    if (!navButtons) return;

    const vazhdoButton = navButtons.querySelector('.vazhdo-button'); // "Vazhdo" (Weiter) Button
    const backButton = navButtons.querySelector('.left'); // "Mbrapa" (Zurück) Button

    // Für Frage 1 gibt es keinen "Vazhdo" Button
    if (questionNumber === 1) {
        return;
    }

    // Überprüfen, ob die aktuelle Frage eine Auswahl erfordert
    if (selectionRequiredQuestions.includes(questionNumber)) {
        // Überprüfen, ob mindestens eine Antwort ausgewählt wurde
        const selected = userResponses[`question${questionNumber}`] && userResponses[`question${questionNumber}`].length > 0;

        if (selected) {
            vazhdoButton.classList.remove('disabled'); // Aktivieren des "Vazhdo" Buttons
        } else {
            vazhdoButton.classList.add('disabled'); // Deaktivieren des "Vazhdo" Buttons
        }
    } else {
        // Für Fragen, die keine Auswahl erfordern, den "Vazhdo" Button aktivieren
        vazhdoButton.classList.remove('disabled');
    }

    // Spezieller Fall für Frage 2: Den "Mbrapa" Button deaktivieren
    if (questionNumber === 2) {
        if (backButton) backButton.classList.add('disabled');
    } else {
        if (backButton) backButton.classList.remove('disabled');
    }
}

/**
 * Funktion zum Anzeigen der nächsten Frage im Fragebogen.
 * @param {number} nextQuestionNumber - Die Nummer der nächsten Frage.
 */
function nextQuestion(nextQuestionNumber) {
    const currentQuestionNumber = nextQuestionNumber - 1;

    // Überprüfen, ob die aktuelle Frage eine Auswahl erfordert und ob eine Antwort ausgewählt wurde
    if (selectionRequiredQuestions.includes(currentQuestionNumber)) {
        const currentSelections = userResponses[`question${currentQuestionNumber}`];
        if (!currentSelections || currentSelections.length === 0) {
            alert('Ju lutem zgjidhni një përgjigje para se të vazhdoni.'); // "Bitte wählen Sie eine Antwort, bevor Sie fortfahren."
            return;
        }
    }

    // Speichern der Eingaben für Fragen mit Texteingabefeldern
    if (currentQuestionNumber === 5) { // Frage 5: Name
        const nameInput = document.getElementById('nameInput').value.trim();
        if (nameInput === '') {
            alert('Ju lutem vendosni emrin tuaj.'); // "Bitte geben Sie Ihren Namen ein."
            return;
        }
        userResponses['name'] = nameInput;
    }

    if (currentQuestionNumber === 6) { // Frage 6: Alter
        const ageInput = document.getElementById('ageInput').value.trim();
        if (ageInput === '') {
            alert('Ju lutem vendosni moshën tuaj.'); // "Bitte geben Sie Ihr Alter ein."
            return;
        }
        userResponses['age'] = ageInput;
    }

    // Verbergen der aktuellen Frage, Antworten und Navigationsbuttons
    const currentQuestion = document.getElementById(`question${currentQuestionNumber}`);
    const currentAnswers = document.getElementById(`answers${currentQuestionNumber}`);
    const currentNavButtons = document.getElementById(`nav-buttons${currentQuestionNumber}`);

    if (currentQuestion) currentQuestion.style.display = "none";
    if (currentAnswers) currentAnswers.style.display = "none";
    if (currentNavButtons) currentNavButtons.style.display = "none";

    // Anzeigen der nächsten Frage, Antworten und Navigationsbuttons
    const nextQuestionElement = document.getElementById(`question${nextQuestionNumber}`);
    const nextAnswers = document.getElementById(`answers${nextQuestionNumber}`);
    const nextNavButtons = document.getElementById(`nav-buttons${nextQuestionNumber}`);

    if (nextQuestionElement) nextQuestionElement.style.display = "block";
    if (nextAnswers) nextAnswers.style.display = "block";
    if (nextNavButtons) nextNavButtons.style.display = "flex";

    // Aktualisieren des Zustands des "Vazhdo" Buttons für die nächste Frage
    setVazhdoButtonState(nextQuestionNumber);

    // Automatisches Scrollen nach oben zur nächsten Frage
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Konsolenlog zur Nachverfolgung der Fragewechsel
    console.log(`Te pyetja tjetër: ${nextQuestionNumber}`); // "Zur nächsten Frage: x"
}

/**
 * Funktion zum Navigieren zurück zur vorherigen Frage.
 * @param {number} previousQuestionNumber - Die Nummer der vorherigen Frage.
 */
function navigateBack(previousQuestionNumber) {
    const currentQuestionNumber = previousQuestionNumber + 1;

    // Verbergen der aktuellen Frage, Antworten und Navigationsbuttons
    const currentQuestion = document.getElementById(`question${currentQuestionNumber}`);
    const currentAnswers = document.getElementById(`answers${currentQuestionNumber}`);
    const currentNavButtons = document.getElementById(`nav-buttons${currentQuestionNumber}`);

    if (currentQuestion) currentQuestion.style.display = "none";
    if (currentAnswers) currentAnswers.style.display = "none";
    if (currentNavButtons) currentNavButtons.style.display = "none";

    // Anzeigen der vorherigen Frage, Antworten und Navigationsbuttons
    const previousQuestion = document.getElementById(`question${previousQuestionNumber}`);
    const previousAnswers = document.getElementById(`answers${previousQuestionNumber}`);
    const previousNavButtons = document.getElementById(`nav-buttons${previousQuestionNumber}`);

    if (previousQuestion) previousQuestion.style.display = "block";
    if (previousAnswers) previousAnswers.style.display = "block";
    if (previousNavButtons) previousNavButtons.style.display = "flex";

    // Aktualisieren des Zustands des "Vazhdo" Buttons für die vorherige Frage
    setVazhdoButtonState(previousQuestionNumber);

    // Automatisches Scrollen nach oben zur vorherigen Frage
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Konsolenlog zur Nachverfolgung des Fragenwechsels
    console.log(`Te pyetja e mëparshme: ${previousQuestionNumber}`); // "Zur vorherigen Frage: x"
}

/**
 * Funktion zur Aktualisierung des Wertes der Sensitivität.
 * @param {number} value - Der aktuelle Wert des Sensitivitäts-Sliders.
 */
function updateSensitivityValue(value) {
    // Aktualisieren des angezeigten Wertes neben dem Slider
    document.getElementById("sensitivityValue").textContent = value;
    // Speichern des Wertes in den Benutzerantworten
    userResponses['sensitivity'] = value;
}

/**
 * Funktion zum Öffnen der Kamera und Initialisieren von FaceMesh.
 * Verwendet Mediapipe und TensorFlow.js, um Gesichtslandmarken zu erkennen.
 */
async function openCamera() {
    const video = document.getElementById('cameraView');
    const overlay = document.getElementById('overlay');
    const ctx = overlay.getContext('2d');

    try {
        // Zugriff auf den Videostream der Kamera (Frontkamera)
        const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "user" }
        });
        video.srcObject = stream;

        video.onloadedmetadata = () => {
            console.log("Meta-Daten des Videos wurden geladen.");
            video.play().then(() => {
                console.log("Video wird abgespielt.");
                // Anzeige des Kameraconsumers
                document.getElementById("cameraContainer").style.display = "block";

                // Verbergen des Fragebogens
                document.getElementById("question-container").style.display = "none";

                // Anzeigen der Overlays und Buttons
                document.getElementById('topBorder').style.display = 'block';
                document.getElementById('bottomBorder').style.display = 'block';
                document.getElementById('buttonLogoContainer').style.display = 'flex';
                document.getElementById('closeButton').style.display = 'block';

                // Deaktivieren von Gesten während der Kameranutzung
                disableGestures();

                // Anpassen der Video-Overlay-Größe
                resizeVideoOverlay(video, overlay);
                // Initialisieren von FaceMesh für die Gesichtserkennung
                initializeFaceMesh(video, overlay, ctx);
                // Anpassung der Overlay-Größe bei Fensteränderung
                window.addEventListener('resize', () => resizeVideoOverlay(video, overlay));
            }).catch(error => {
                console.error("Fehler beim Abspielen des Videos: ", error);
            });
        };
    } catch (error) {
        console.error("Fehler beim Öffnen der Kamera: ", error);
        alert("Kamera konnte nicht geöffnet werden. Bitte stellen Sie sicher, dass Sie den Zugriff erlaubt haben.");
    }
}

/**
 * Funktion zur Anpassung der Größe von Video und Overlay an die Bildschirmgröße.
 * @param {HTMLVideoElement} video - Das Videoelement.
 * @param {HTMLCanvasElement} overlay - Das Canvas-Overlay-Element.
 */
function resizeVideoOverlay(video, overlay) {
    // Setzen der Overlay-Größe basierend auf der Videoauflösung
    overlay.width = video.videoWidth;
    overlay.height = video.videoHeight;

    const aspectRatio = video.videoWidth / video.videoHeight;

    // Anpassen des Video- und Overlay-Stils basierend auf dem Seitenverhältnis
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

/**
 * Funktion zur Initialisierung von FaceMesh und der Kamera.
 * @param {HTMLVideoElement} video - Das Videoelement.
 * @param {HTMLCanvasElement} overlay - Das Canvas-Overlay-Element.
 * @param {CanvasRenderingContext2D} ctx - Der 2D-Zeichenkontext des Canvas.
 */
function initializeFaceMesh(video, overlay, ctx) {
    // Erstellen einer neuen FaceMesh-Instanz mit den gewünschten Optionen
    const faceMesh = new FaceMesh({ locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}` });
    faceMesh.setOptions({
        maxNumFaces: 1, // Maximale Anzahl der zu erkennenden Gesichter
        refineLandmarks: true,
        minDetectionConfidence: 0.5, // Mindest-Erkennungswahrscheinlichkeit
        minTrackingConfidence: 0.5   // Mindest-Tracking-Wahrscheinlichkeit
    });
    // Festlegen der Callback-Funktion für Ergebnisse der Gesichtserkennung
    faceMesh.onResults(results => onFaceMeshResults(results, video, overlay, ctx));

    // Starten der Kamera mit FaceMesh-Integration
    const camera = new Camera(video, {
        onFrame: async () => {
            await faceMesh.send({ image: video });
        }
    });
    camera.start();
    console.log("FaceMesh wurde erfolgreich initialisiert.");
}

/**
 * Callback-Funktion zur Verarbeitung der FaceMesh-Ergebnisse.
 * Zeichnet die Gesichtslandmarken auf das Canvas-Overlay.
 * @param {Object} results - Die Ergebnisse von FaceMesh.
 * @param {HTMLVideoElement} video - Das Videoelement.
 * @param {HTMLCanvasElement} overlay - Das Canvas-Overlay-Element.
 * @param {CanvasRenderingContext2D} ctx - Der 2D-Zeichenkontext des Canvas.
 */
function onFaceMeshResults(results, video, overlay, ctx) {
    // Löschen des Canvas
    ctx.clearRect(0, 0, overlay.width, overlay.height);
    // Zeichnen des aktuellen Videoframes auf das Canvas
    ctx.drawImage(video, 0, 0, overlay.width, overlay.height);

    // Überprüfen, ob Gesichtslandmarken erkannt wurden
    if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
        const landmarks = results.multiFaceLandmarks[0]; // Nur das erste Gesicht
        drawLandmarks(landmarks, ctx); // Zeichnen der Landmarken
    } else {
        console.log("Kein Gesicht erkannt.");
    }
}

/**
 * Funktion zum Zeichnen der Gesichtslandmarken auf das Canvas.
 * @param {Array} landmarks - Die erkannten Gesichtslandmarken.
 * @param {CanvasRenderingContext2D} ctx - Der 2D-Zeichenkontext des Canvas.
 */
function drawLandmarks(landmarks, ctx) {
    ctx.fillStyle = "cyan"; // Farbe der Landmarkenpunkte

    // Iterieren über alle Landmarken und Zeichnen eines kleinen Kreises an jeder Position
    landmarks.forEach((landmark) => {
        const x = landmark.x * overlay.width;
        const y = landmark.y * overlay.height;
        ctx.beginPath();
        ctx.arc(x, y, 1, 0, 2 * Math.PI);
        ctx.fill();
    });
}

/**
 * Funktion zum Schließen der Kamera und Rückkehr zum Fragebogen.
 * Stoppt den Videostream und zeigt den Fragebogen wieder an.
 */
function closeCamera() {
    const video = document.getElementById('cameraView');
    const stream = video.srcObject;

    // Stoppen aller Tracks im Videostream
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
    }
    video.srcObject = null; // Entfernen des Streams aus dem Videoelement
    document.getElementById("cameraContainer").style.display = "none"; // Verbergen des Kameraconsumers

    // Wiederanzeige des Fragebogens
    document.getElementById("question-container").style.display = "block";

    // Aktivieren von Gesten nach dem Schließen der Kamera
    enableGestures();
    console.log("Kamera wurde geschlossen.");
}

/**
 * Funktion zum Aufnehmen eines Fotos.
 * Hier können Sie den bestehenden Code zum Erfassen und Speichern des Fotos einfügen.
 */
function takePhoto() {
    // ... Ihr bestehender Code zum Aufnehmen des Fotos ...

    // Beispiel: Bild im Ladebildschirm setzen (falls benötigt)
    // document.getElementById('loadingPhoto').src = dataURL;

    // Verbergen des Kameraconsumers
    document.getElementById("cameraContainer").style.display = "none";

    // Anzeigen des Ladebildschirms
    document.getElementById("loadingScreen").style.display = "flex";

    // Vibration auslösen für 3 Sekunden, falls unterstützt
    if (navigator.vibrate) {
        navigator.vibrate(3000);
    }

    // Nach 3,5 Sekunden den Ladebildschirm ausblenden und zur nächsten Frage weiterleiten
    setTimeout(function() {
        document.getElementById("loadingScreen").style.display = "none";
        closeCamera(); // Kamera schließen und zurückkehren zum Fragebogen
        nextQuestion(2); // Zur nächsten Frage wechseln (Frage 2)
    }, 3500);
}

/**
 * Funktionen zum Deaktivieren und Aktivieren von Gesten.
 * Diese verhindern unerwünschte Gesten während der Kameranutzung (z.B. Scrollen, Zoomen).
 */
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

/**
 * Hilfsfunktionen zur Verhinderung von Gesten.
 * @param {Event} event - Das auslösende Ereignis.
 */
function preventTouch(event) {
    event.preventDefault();  // Verhindert Scrollen durch Berührungen
}

function preventGesture(event) {
    event.preventDefault();  // Verhindert Gesten wie Zoom
}

// Verhindern des Zoom-Ins durch Doppelklick
window.addEventListener('dblclick', function(event) {
    event.preventDefault();
});

// Verhindern des Zoom-Ins durch Tastenkombinationen (z.B. Ctrl + Plus/Minus)
window.addEventListener('keydown', function(event) {
    if ((event.ctrlKey || event.metaKey) && 
        (event.key === '+' || event.key === '-' || event.key === '=' || event.key === '0')) {
        event.preventDefault();
    }
});

// Verhindern des Zoom-Ins durch Mausrad mit gedrückter Ctrl-Taste
window.addEventListener('wheel', function(event) {
    if (event.ctrlKey) {
        event.preventDefault();
    }
}, { passive: false });

// Verhindern von Zoom-Gesten auf Touch-Geräten
document.addEventListener('gesturestart', function(event) {
    event.preventDefault();
});
document.addEventListener('gesturechange', function(event) {
    event.preventDefault();
});
document.addEventListener('gestureend', function(event) {
    event.preventDefault();
});

/**
 * Funktion zum Abschließen des Fragebogens.
 * Speichert die gesammelten Antworten und leitet zur Diagnose-Seite weiter.
 */
function finishQuestionnaire() {
    // Überprüfen und Speichern des Alters
    const ageInput = document.getElementById('ageInput').value.trim();
    if (ageInput === '') {
        alert('Ju lutem vendosni moshën tuaj.'); // "Bitte geben Sie Ihr Alter ein."
        return;
    }
    userResponses['age'] = ageInput;

    // Abrufen des aufgenommenen Fotos aus dem localStorage
    const photoData = localStorage.getItem('capturedImage');

    if (!photoData) {
        alert('Asnjë foto nuk u gjet. Ju lutem filloni pyetësorin nga fillimi.'); // "Kein Foto gefunden. Bitte starten Sie den Fragebogen neu."
        return;
    }

    console.log('Der Fragebogen wurde abgeschlossen. Gesammelte Daten:', userResponses);

    // Speichern der Antworten und des Fotos im localStorage
    localStorage.setItem('userResponses', JSON.stringify(userResponses));
    localStorage.setItem('capturedImage', photoData);

    // Generieren der Diagnose-Daten basierend auf den Antworten
    const diagnosisData = generateDiagnosis(userResponses);
    localStorage.setItem('diagnosisData', JSON.stringify(diagnosisData));

    // Anzeigen des neuen Ladebildschirms
    document.getElementById("loadingScreen2").style.display = "flex";

    // Nach 3,5 Sekunden den Ladebildschirm ausblenden und zur Diagnose-Seite weiterleiten
    setTimeout(function() {
        // Optional: Hier können Sie Animationen hinzufügen oder den Ladebildschirm sanft ausblenden
        document.getElementById("loadingScreen2").style.display = "none";
        // Weiterleiten zur Diagnose-Seite
        window.location.href = 'nextPage.html';
    }, 3500);
}

/**
 * Funktion zur Generierung der Diagnose-Daten basierend auf den Benutzerantworten.
 * @param {Object} userResponses - Die gesammelten Antworten des Benutzers.
 * @returns {Object} - Das Diagnose-Datenobjekt.
 */
function generateDiagnosis(userResponses) {
    // Generierung der Basiseigenschaften
    const skinHealthValue = getRandomValue(20, 70); // Wert zwischen 20 und 70%
    const skinHealthStatus = getStatusText(skinHealthValue);
    
    const textureValue = getRandomValue(20, 50); // Wert zwischen 20 und 50%
    const textureStatus = 'Care Needed'; // Fester Status

    /**
     * Konfiguration der spezifischen Hautprobleme und deren Wertbereiche.
     * Jeder Eintrag enthält:
     * - selected: Ob das Problem ausgewählt wurde.
     * - selectedRange: Der Wertebereich, wenn das Problem ausgewählt wurde.
     * - defaultRange: Der Wertebereich, wenn das Problem nicht ausgewählt wurde.
     */
    const problemsConfig = {
        'Akne': { selected: false, selectedRange: [11, 37], defaultRange: [52, 69] },
        'Poret': { selected: false, selectedRange: [14, 28], defaultRange: [52, 69] },
        'Hiperpigmentim': { selected: false, selectedRange: [14, 34], defaultRange: [52, 69] },
        'Rrudhat': { selected: false, selectedRange: [24, 39], defaultRange: [52, 69] }
    };
    
    // Überprüfen, welche Probleme ausgewählt wurden und entsprechend markieren
    if (userResponses['question3'] && userResponses['question3'].length > 0) {
        userResponses['question3'].forEach(problem => {
            if (problemsConfig.hasOwnProperty(problem)) {
                problemsConfig[problem].selected = true;
            }
        });
    }
    
    // Initialisierung des Diagnose-Datenobjekts
    const diagnosisData = {
        skinHealthValue: skinHealthValue,
        skinHealthStatus: skinHealthStatus,
        textureValue: textureValue,
        textureStatus: textureStatus,
        diagnosisText: '', // Wird später generiert
        elasticityValue: getRandomValue(20, 100), // Beispielbereich für Elastizität
        barrierValue: getRandomValue(20, 100)    // Beispielbereich für Hautbarriere
    };
    
    // Generierung der Werte für spezifische Probleme basierend auf der Auswahl
    for (const [problem, config] of Object.entries(problemsConfig)) {
        if (config.selected) {
            diagnosisData[`${problem.toLowerCase()}Value`] = getRandomValue(config.selectedRange[0], config.selectedRange[1]);
        } else {
            diagnosisData[`${problem.toLowerCase()}Value`] = getRandomValue(config.defaultRange[0], config.defaultRange[1]);
        }
    }
    
    /**
     * Zusätzliche Logik für 'Shëndeti i Lëkurës' basierend auf 'Mirembajtje'.
     * Wenn 'Mirembajtje' (Pflege) ausgewählt ist, wird der Wert niedriger gesetzt.
     */
    const isMirembajtjeSelected = userResponses['question3'] && userResponses['question3'].includes('Mirembajtje');
    if (isMirembajtjeSelected) {
        diagnosisData.shendetiValue = getRandomValue(8, 27); // Niedriger Wert bei ausgewählter Pflege
    } else {
        diagnosisData.shendetiValue = getRandomValue(52, 69); // Normaler Bereich ohne Pflege
    }
    diagnosisData.shendetiStatus = getStatusText(diagnosisData.shendetiValue);
    
    /**
     * Generierung des Diagnose-Texts basierend auf Hauttyp und ausgewählten Problemstellungen.
     */
    let diagnosisText = '';
    
    // Integration des ausgewählten Hauttyps in den Diagnose-Text
    if (userResponses['question2'] && userResponses['question2'].length > 0) {
        const skinType = userResponses['question2'][0];
        switch (skinType) {
            case 'Thate':
                diagnosisText += 'Sebumi i lëkurës tuaj është i thatë. '; // "Ihre Haut ist trocken."
                break;
            case 'Yndyrshme':
                diagnosisText += 'Sebumi i lëkurës tuaj është i yndyrshëm. '; // "Ihre Haut ist ölig."
                break;
            case 'Kombinuar':
                diagnosisText += 'Sebumi i lëkurës tuaj është i kombinuar. '; // "Ihre Haut ist kombiniert."
                break;
            case 'Normale':
                diagnosisText += 'Sebumi i lëkurës tuaj është normale. '; // "Ihre Haut ist normal."
                break;
            default:
                diagnosisText += 'Sebumi i lëkurës tuaj është në gjendje të mirë. '; // "Ihre Haut ist in gutem Zustand."
        }
    }
    
    // Integration der ausgewählten Problemstellungen in den Diagnose-Text
    if (userResponses['question3'] && userResponses['question3'].length > 0) {
        diagnosisText += 'Pas analizës, kemi vërejtur se keni problemet e mëposhtme: '; // "Nach der Analyse haben wir festgestellt, dass Sie folgende Probleme haben:"
        diagnosisText += userResponses['question3'].join(', ').toLowerCase() + '. '; // Auflistung der Probleme
        
        // Auswahl einer zufälligen Diagnosevariante aus einem Array von Optionen
        const diagnosisVariants = [
            'Kemi identifikuar këto probleme si rezultat të faktorëve të ndryshëm të jetës së përditshme dhe ambientit. ',
            'Këto probleme mund të shkaktohen nga stresi, ushqimi, dhe mungesa e kujdesit adekuat të lëkurës. ',
            'Analiza jonë tregon që këto çështje kërkojnë vëmendje dhe mirëmbajtje të vazhdueshme. ',
            'Këto problematika janë shpesh rezultat i përdorimit të duhur të produkteve për kujdesin e lëkurës. ',
            'Faktorët gjenetikë dhe mjedisorë luajnë një rol të rëndësishëm në shfaqjen e këtyre problemeve. ',
            'Këto probleme shpesh lidhen me mungesën e hidratimit adekuat dhe ekspozimin ndaj faktorëve të jashtëm. ',
            'Shëndeti i përgjithshëm dhe dieta juaj kanë një ndikim të madh në gjendjen e lëkurës. ',
            'Nivelet e lartë të stresit dhe jetesa në mjedise të ndotura mund të kontribuojnë në këto çështje. ',
            'Mungesa e gjumit të mjaftueshëm dhe aktiviteti fizik i pamjaftueshëm mund të ndikojnë negativisht në shëndetin e lëkurës. ',
            'Produktet e tepërt për kujdesin e lëkurës mund të çojnë në irritim dhe probleme të tjera. '
            // Weitere Varianten können hier hinzugefügt werden
        ];
        
        // Zufällige Auswahl einer Diagnosevariante
        const randomIndex = Math.floor(Math.random() * diagnosisVariants.length);
        diagnosisText += diagnosisVariants[randomIndex];
    } else {
        diagnosisText += 'Lëkura juaj duket e shëndetshme. Rekomandojmë të vazhdoni me rutinën tuaj të kujdesit të lëkurës. '; // "Ihre Haut sieht gesund aus. Wir empfehlen, Ihre Hautpflegeroutine fortzusetzen."
    }
    
    // Zusätzliche Informationen zur Diagnose
    diagnosisText += 'Është e rëndësishme të kuptoni se kujdesi adekuat për lëkurën mund të ndihmojë në parandalimin dhe përmirësimin e këtyre problemeve. '; // "Es ist wichtig zu verstehen, dass angemessene Hautpflege dazu beitragen kann, diese Probleme zu verhindern und zu verbessern."

    // Speichern des generierten Diagnose-Texts im Diagnose-Datenobjekt
    diagnosisData.diagnosisText = diagnosisText;
    
    return diagnosisData;
}

/**
 * Funktion zur Anzeige der Diagnose auf der Diagnose-Seite (`nextPage.html`).
 * Liest die gespeicherten Diagnose-Daten aus dem localStorage und zeigt sie an.
 */
function displayDiagnosis() {
    // Überprüfen, ob wir auf der Diagnose-Seite sind
    if (window.location.pathname.endsWith('nextPage.html')) {
        // Abrufen der Benutzerantworten aus dem localStorage
        const userResponses = JSON.parse(localStorage.getItem('userResponses'));
        if (!userResponses) {
            alert('Asnjë përgjigje u gjet. Ju lutem filloni pyetësorin.'); // "Keine Antworten gefunden. Bitte starten Sie den Fragebogen neu."
            return;
        }

        const userName = userResponses['name']; // Benutzername
        const userAge = userResponses['age'];   // Benutzeralter
        const skinTypeSelections = userResponses['question2'] || []; // Hauttyp-Auswahl
        const problemSelections = userResponses['question3'] || [];  // Hautprobleme-Auswahl

        // Anzeige von Name und Alter auf der Diagnose-Seite
        const userNameElement = document.getElementById('userName');
        const userAgeElement = document.getElementById('userAge');
        if (userNameElement) userNameElement.textContent = userName;
        if (userAgeElement) userAgeElement.textContent = userAge;

        // Abrufen der Diagnose-Daten aus dem localStorage
        const diagnosisData = JSON.parse(localStorage.getItem('diagnosisData'));
        if (!diagnosisData) {
            alert('Asnjë diagnozë u gjet. Ju lutem filloni pyetësorin.'); // "Keine Diagnose gefunden. Bitte starten Sie den Fragebogen neu."
            return;
        }

        // Anzeige des Diagnose-Texts
        const diagnosisTextElement = document.getElementById('diagnosisText');
        if (diagnosisTextElement) {
            diagnosisTextElement.textContent = diagnosisData.diagnosisText;
            diagnosisTextElement.style.textAlign = 'left'; // Links ausrichten
            // Optional: Weitere Stile setzen, falls nötig
            diagnosisTextElement.style.fontSize = '1rem';
            diagnosisTextElement.style.color = '#333';
            diagnosisTextElement.style.margin = '20px';
            diagnosisTextElement.style.lineHeight = '1.6';
            diagnosisTextElement.style.fontFamily = '"Harmonia Sans", sans-serif';
        }
        
        // Anzeige der Diagrammwerte für 'Shëndeti i Lëkurës' (Hautgesundheit)
        const shendetiValueElement = document.getElementById('shendetiValue');
        const shendetiStatusElement = document.getElementById('shendetiStatus');
        if (shendetiValueElement) shendetiValueElement.textContent = diagnosisData.shendetiValue;
        if (shendetiStatusElement) shendetiStatusElement.textContent = diagnosisData.shendetiStatus;

        // Anzeige der Diagrammwerte für andere Hautprobleme
        const poretValueElement = document.getElementById('poretValue');
        const poretStatusElement = document.getElementById('poretStatus');
        if (poretValueElement) poretValueElement.textContent = diagnosisData.poretValue;
        if (poretStatusElement) poretStatusElement.textContent = getStatusText(diagnosisData.poretValue);

        const textureValueElement = document.getElementById('textureValue');
        const textureStatusElement = document.getElementById('textureStatus');
        if (textureValueElement) textureValueElement.textContent = diagnosisData.textureValue;
        if (textureStatusElement) textureStatusElement.textContent = diagnosisData.textureStatus;

        const rrudhatValueElement = document.getElementById('rrudhatValue');
        const rrudhatStatusElement = document.getElementById('rrudhatStatus');
        if (rrudhatValueElement) rrudhatValueElement.textContent = diagnosisData.rrudhatValue;
        if (rrudhatStatusElement) rrudhatStatusElement.textContent = getStatusText(diagnosisData.rrudhatValue);

        const hiperpigmentimValueElement = document.getElementById('hiperpigmentimValue');
        const hiperpigmentimStatusElement = document.getElementById('hiperpigmentimStatus');
        if (hiperpigmentimValueElement) hiperpigmentimValueElement.textContent = diagnosisData.hiperpigmentimValue;
        if (hiperpigmentimStatusElement) hiperpigmentimStatusElement.textContent = getStatusText(diagnosisData.hiperpigmentimValue);

        const akneValueElement = document.getElementById('akneValue');
        const akneStatusElement = document.getElementById('akneStatus');
        if (akneValueElement) akneValueElement.textContent = diagnosisData.akneValue;
        if (akneStatusElement) akneStatusElement.textContent = getStatusText(diagnosisData.akneValue);

        // Aktualisieren der progress-circle Hintergrundfarben für 'Shëndeti i Lëkurës'
        const shendetiCircle = document.querySelector(`.progress-circle[data-category="shendeti"]`);
        if (shendetiCircle) {
            shendetiCircle.dataset.percentage = diagnosisData.shendetiValue;
            shendetiCircle.style.background = `conic-gradient(black ${diagnosisData.shendetiValue}%, #F6F6F7 0%)`;
        }

        // Aktualisieren der progress-circle Hintergrundfarben für andere Hautprobleme
        const poretCircle = document.querySelector(`.progress-circle[data-category="poret"]`);
        if (poretCircle) {
            poretCircle.dataset.percentage = diagnosisData.poretValue;
            poretCircle.style.background = `conic-gradient(black ${diagnosisData.poretValue}%, #F6F6F7 0%)`;
        }

        const textureCircle = document.querySelector(`.progress-circle[data-category="tekstura"]`);
        if (textureCircle) {
            textureCircle.dataset.percentage = diagnosisData.textureValue;
            textureCircle.style.background = `conic-gradient(black ${diagnosisData.textureValue}%, #F6F6F7 0%)`;
        }

        const rrudhatCircle = document.querySelector(`.progress-circle[data-category="rrudhat"]`);
        if (rrudhatCircle) {
            rrudhatCircle.dataset.percentage = diagnosisData.rrudhatValue;
            rrudhatCircle.style.background = `conic-gradient(black ${diagnosisData.rrudhatValue}%, #F6F6F7 0%)`;
        }

        const hiperpigmentimCircle = document.querySelector(`.progress-circle[data-category="hiperpigmentim"]`);
        if (hiperpigmentimCircle) {
            hiperpigmentimCircle.dataset.percentage = diagnosisData.hiperpigmentimValue;
            hiperpigmentimCircle.style.background = `conic-gradient(black ${diagnosisData.hiperpigmentimValue}%, #F6F6F7 0%)`;
        }

        const akneCircle = document.querySelector(`.progress-circle[data-category="akne"]`);
        if (akneCircle) {
            akneCircle.dataset.percentage = diagnosisData.akneValue;
            akneCircle.style.background = `conic-gradient(black ${diagnosisData.akneValue}%, #F6F6F7 0%)`;
        }

        // Setzen der Fortschrittsbalken für Elastizität und Barriere
        const elasticityBar = document.getElementById('elasticityBar');
        if (elasticityBar) {
            elasticityBar.style.width = `${diagnosisData.elasticityValue}%`;
            elasticityBar.setAttribute('data-status', getStatusText(diagnosisData.elasticityValue));
        }

        const barrierBar = document.getElementById('barrierBar');
        if (barrierBar) {
            barrierBar.style.width = `${diagnosisData.barrierValue}%`;
            barrierBar.setAttribute('data-status', getStatusText(diagnosisData.barrierValue));
        }
    }
}
