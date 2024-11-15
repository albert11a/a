// Objekt për ruajtjen e përgjigjeve të përdoruesit
const userResponses = {};

// Lista e pyetjeve që kërkojnë zgjedhje
const selectionRequiredQuestions = [2, 3];

// Hilfsfunktion, um einen zufälligen Wert innerhalb eines Bereichs zu generieren
function getRandomValue(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Hilfsfunktion, um den Status basierend auf dem Wert zu erhalten
function getStatusText(value) {
    if (value < 40) {
        return 'Care Needed';
    } else if (value < 70) {
        return 'Normal';
    } else {
        return 'Good';
    }
}

// Funksioni për të filluar pyetësorin
function startQuestionnaire() {
    // Fillojmë direkt me pyetjen e parë
    document.getElementById("question-container").style.display = "block";
    document.getElementById("question1").style.display = "block";
    document.getElementById("answers1").style.display = "block";
    document.getElementById("nav-buttons1").style.display = "flex";
}

// Fillojmë pyetësorin kur faqja ngarkohet
window.onload = function() {
    if (window.location.pathname.endsWith('nextPage.html')) {
        displayDiagnosis();
    } else {
        startQuestionnaire();
    }
};

// Funksioni për të ndërruar zgjedhjen e kutive të përgjigjeve
function toggleSelection(element) {
    // Vetëm për pyetjet që kërkojnë zgjedhje
    const questionId = element.parentElement.id;
    const questionNumber = parseInt(questionId.replace('answers', ''));
    if (!selectionRequiredQuestions.includes(questionNumber)) return;

    element.classList.toggle('selected');

    // Ruajtja e përgjigjeve të zgjedhura
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

    // Përditëso gjendjen e butonit "Vazhdo"
    setVazhdoButtonState(questionNumber);
}

// Funksioni për të vendosur gjendjen e butonave "Vazhdo" dhe "Mbrapa"
function setVazhdoButtonState(questionNumber) {
    const navButtons = document.getElementById(`nav-buttons${questionNumber}`);
    if (!navButtons) return;

    const vazhdoButton = navButtons.querySelector('.vazhdo-button'); // Butoni "Vazhdo"
    const backButton = navButtons.querySelector('.left'); // Butoni "Mbrapa"

    if (questionNumber === 1) {
        // Për pyetjen 1 nuk ka buton "Vazhdo"
        return;
    }

    if (selectionRequiredQuestions.includes(questionNumber)) {
        // Kontrollo nëse ka përgjigje të zgjedhura
        const selected = userResponses[`question${questionNumber}`] && userResponses[`question${questionNumber}`].length > 0;

        if (selected) {
            vazhdoButton.classList.remove('disabled');
        } else {
            vazhdoButton.classList.add('disabled');
        }
    } else {
        // Pyetjet që nuk kërkojnë zgjedhje
        vazhdoButton.classList.remove('disabled');
    }

    // Trajtim special për pyetjen e dytë: butoni "Mbrapa" të jetë i çaktivizuar
    if (questionNumber === 2) {
        if (backButton) backButton.classList.add('disabled');
    } else {
        if (backButton) backButton.classList.remove('disabled');
    }
}

// Funksioni për të shfaqur pyetjen tjetër
function nextQuestion(nextQuestionNumber) {
    const currentQuestionNumber = nextQuestionNumber - 1;

    // Kontrollo nëse pyetja aktuale kërkon zgjedhje
    if (selectionRequiredQuestions.includes(currentQuestionNumber)) {
        const currentSelections = userResponses[`question${currentQuestionNumber}`];
        if (!currentSelections || currentSelections.length === 0) {
            alert('Ju lutem zgjidhni një përgjigje para se të vazhdoni.');
            return;
        }
    }

    // Ruajtja e hyrjeve për pyetjet me fusha teksti
    if (currentQuestionNumber === 5) {
        const nameInput = document.getElementById('nameInput').value.trim();
        if (nameInput === '') {
            alert('Ju lutem vendosni emrin tuaj.');
            return;
        }
        userResponses['name'] = nameInput;
    }

    if (currentQuestionNumber === 6) {
        const ageInput = document.getElementById('ageInput').value.trim();
        if (ageInput === '') {
            alert('Ju lutem vendosni moshën tuaj.');
            return;
        }
        userResponses['age'] = ageInput;
    }

    // Fsheh pyetjen aktuale, përgjigjet dhe butonat e navigimit
    const currentQuestion = document.getElementById(`question${currentQuestionNumber}`);
    const currentAnswers = document.getElementById(`answers${currentQuestionNumber}`);
    const currentNavButtons = document.getElementById(`nav-buttons${currentQuestionNumber}`);

    if (currentQuestion) currentQuestion.style.display = "none";
    if (currentAnswers) currentAnswers.style.display = "none";
    if (currentNavButtons) currentNavButtons.style.display = "none";

    // Shfaq pyetjen dhe përgjigjet e ardhshme
    const nextQuestionElement = document.getElementById(`question${nextQuestionNumber}`);
    const nextAnswers = document.getElementById(`answers${nextQuestionNumber}`);
    const nextNavButtons = document.getElementById(`nav-buttons${nextQuestionNumber}`);

    if (nextQuestionElement) nextQuestionElement.style.display = "block";
    if (nextAnswers) nextAnswers.style.display = "block";
    if (nextNavButtons) nextNavButtons.style.display = "flex";

    // Vendos gjendjen e butonit "Vazhdo" për pyetjen e ardhshme
    setVazhdoButtonState(nextQuestionNumber);

    // Shkoni automatikisht lart
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Printim për gjurmim në konzolë
    console.log(`Te pyetja tjetër: ${nextQuestionNumber}`);
}

// Funksioni për të kthyer te pyetja e mëparshme
function navigateBack(previousQuestionNumber) {
    const currentQuestionNumber = previousQuestionNumber + 1;

    // Fsheh pyetjen aktuale, përgjigjet dhe butonat e navigimit
    const currentQuestion = document.getElementById(`question${currentQuestionNumber}`);
    const currentAnswers = document.getElementById(`answers${currentQuestionNumber}`);
    const currentNavButtons = document.getElementById(`nav-buttons${currentQuestionNumber}`);

    if (currentQuestion) currentQuestion.style.display = "none";
    if (currentAnswers) currentAnswers.style.display = "none";
    if (currentNavButtons) currentNavButtons.style.display = "none";

    // Shfaq pyetjen dhe përgjigjet e mëparshme
    const previousQuestion = document.getElementById(`question${previousQuestionNumber}`);
    const previousAnswers = document.getElementById(`answers${previousQuestionNumber}`);
    const previousNavButtons = document.getElementById(`nav-buttons${previousQuestionNumber}`);

    if (previousQuestion) previousQuestion.style.display = "block";
    if (previousAnswers) previousAnswers.style.display = "block";
    if (previousNavButtons) previousNavButtons.style.display = "flex";

    // Vendos gjendjen e butonit "Vazhdo" për pyetjen e mëparshme
    setVazhdoButtonState(previousQuestionNumber);

    // Shkoni automatikisht lart
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Printim për gjurmim në konzolë
    console.log(`Te pyetja e mëparshme: ${previousQuestionNumber}`);
}

// Funksioni për të përditësuar vlerën e sensitivitetit
function updateSensitivityValue(value) {
    document.getElementById("sensitivityValue").textContent = value;
    // Ruajtja e vlerës së sensitivitetit
    userResponses['sensitivity'] = value;
}

// Funksioni për të hapur kamerën dhe inicializuar FaceMesh
async function openCamera() {
    const video = document.getElementById('cameraView');
    const overlay = document.getElementById('overlay');
    const ctx = overlay.getContext('2d');

    try {
        // Merr stream-in e videos
        const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "user" }
        });
        video.srcObject = stream;

        video.onloadedmetadata = () => {
            console.log("Meta të dhënat e videos u ngarkuan");
            video.play().then(() => {
                console.log("Video po luan");
                document.getElementById("cameraContainer").style.display = "block";

                // Fsheh pyetësorin
                document.getElementById("question-container").style.display = "none";

                // Shfaq elementet pasi kamera është hapur
                document.getElementById('topBorder').style.display = 'block';
                document.getElementById('bottomBorder').style.display = 'block';
                document.getElementById('buttonLogoContainer').style.display = 'flex';
                document.getElementById('closeButton').style.display = 'block';

                disableGestures();

                resizeVideoOverlay(video, overlay);
                initializeFaceMesh(video, overlay, ctx);
                window.addEventListener('resize', () => resizeVideoOverlay(video, overlay));
            }).catch(error => {
                console.error("Gabim gjatë luajtjes së videos: ", error);
            });
        };
    } catch (error) {
        console.error("Gabim gjatë hapjes së kamerës: ", error);
        alert("Kamera nuk mund të hapet. Ju lutem sigurohuni që keni lejuar aksesin.");
    }
}

// Funksioni për të përshtatur elementet e videos dhe overlay-it me madhësinë e ekranit
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

// Funksioni për të inicializuar FaceMesh dhe kamerën
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
    console.log("FaceMesh u inicializua me sukses.");
}

// Funksioni për të përpunuar rezultatet e FaceMesh
function onFaceMeshResults(results, video, overlay, ctx) {
    ctx.clearRect(0, 0, overlay.width, overlay.height);
    ctx.drawImage(video, 0, 0, overlay.width, overlay.height);

    if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
        const landmarks = results.multiFaceLandmarks[0];
        drawLandmarks(landmarks, ctx);
    } else {
        console.log("Asnjë fytyrë nuk u detektua.");
    }
}

// Funksioni për të vizatuar pikat e fytyrës
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

// Funksioni për të mbyllur kamerën
function closeCamera() {
    const video = document.getElementById('cameraView');
    const stream = video.srcObject;

    if (stream) {
        stream.getTracks().forEach(track => track.stop());
    }
    video.srcObject = null;
    document.getElementById("cameraContainer").style.display = "none";

    // Shfaq përsëri pyetësorin
    document.getElementById("question-container").style.display = "block";

    enableGestures();
    console.log("Kamera u mbyll.");
}

function takePhoto() {
    // ... (Ihr bestehender Code zum Aufnehmen des Fotos)

    // Setze das Bild im Ladebildschirm (falls Sie das Bild anzeigen)
    // document.getElementById('loadingPhoto').src = dataURL;

    // Verstecke den Kamera-Container
    document.getElementById("cameraContainer").style.display = "none";

    // Zeige den Ladebildschirm
    document.getElementById("loadingScreen").style.display = "flex";

    // **Löse die Vibration für 3 Sekunden aus, falls unterstützt**
    if (navigator.vibrate) {
        navigator.vibrate(3000);
    }

    // Nach 3,5 Sekunden den Ladebildschirm ausblenden und zur ersten Frage weiterleiten
    setTimeout(function() {
        document.getElementById("loadingScreen").style.display = "none";
        closeCamera();
        nextQuestion(2); // Weiter zur ersten Frage
    }, 3500);
}

// Funksionet për të çaktivizuar dhe aktivizuar gjestet
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

// Funksionet ndihmëse për të parandaluar gjestet
function preventTouch(event) {
    event.preventDefault();  // Parandalon scroll me prekjen
}

function preventGesture(event) {
    event.preventDefault();  // Parandalon gjestet si zoom
}

// Parandalon zoom-in me dy klikime
window.addEventListener('dblclick', function(event) {
    event.preventDefault();
});

// Parandalon zoom-in me kombinime tastiere (p.sh., Ctrl + Plus/Minus)
window.addEventListener('keydown', function(event) {
    if ((event.ctrlKey || event.metaKey) && 
        (event.key === '+' || event.key === '-' || event.key === '=' || event.key === '0')) {
        event.preventDefault();
    }
});

// Parandalon zoom-in me rrotullën e miut me tastin Ctrl
window.addEventListener('wheel', function(event) {
    if (event.ctrlKey) {
        event.preventDefault();
    }
}, { passive: false });

// Parandalon gjestet e zoom-it në pajisjet me prekje
document.addEventListener('gesturestart', function(event) {
    event.preventDefault();
});
document.addEventListener('gesturechange', function(event) {
    event.preventDefault();
});
document.addEventListener('gestureend', function(event) {
    event.preventDefault();
});

// Funktion zum Abschließen des Fragebogens
function finishQuestionnaire() {
    const ageInput = document.getElementById('ageInput').value.trim();
    if (ageInput === '') {
        alert('Ju lutem vendosni moshën tuaj.');
        return;
    }
    userResponses['age'] = ageInput;

    // Hol das Foto aus dem localStorage
    const photoData = localStorage.getItem('capturedImage');

    if (!photoData) {
        alert('Asnjë foto nuk u gjet. Ju lutem filloni pyetësorin nga fillimi.');
        return;
    }

    console.log('Pyetësori u përfundua. Të dhënat e mbledhura:', userResponses);

    // Speichere die Antworten und das Foto im localStorage
    localStorage.setItem('userResponses', JSON.stringify(userResponses));
    localStorage.setItem('capturedImage', photoData);

    // Generieren der Diagnose-Daten
    const diagnosisData = generateDiagnosis(userResponses);
    localStorage.setItem('diagnosisData', JSON.stringify(diagnosisData));

    // Weiterleiten zur Diagnose-Seite
    window.location.href = 'nextPage.html';
}

// Funktion zum Generieren der Diagnose-Daten
function generateDiagnosis(userResponses) {
    // Generierung der Basiseigenschaften
    const skinHealthValue = getRandomValue(20, 70); // 20 bis 70%
    const skinHealthStatus = getStatusText(skinHealthValue);
    
    const textureValue = getRandomValue(20, 50); // 20 bis 50%
    const textureStatus = 'Care Needed';
    
    // Definieren der spezifischen Probleme und deren Bereiche (ohne 'Mirembajte')
    const problemsConfig = {
        'Akne': { selected: false, selectedRange: [11, 37], defaultRange: [52, 69] },
        'Poret': { selected: false, selectedRange: [14, 28], defaultRange: [52, 69] },
        'Hiperpigmentim': { selected: false, selectedRange: [14, 34], defaultRange: [52, 69] },
        'Rrudhat': { selected: false, selectedRange: [24, 39], defaultRange: [52, 69] }
    };
    
    // Überprüfen, welche Probleme ausgewählt wurden
    if (userResponses['question3'] && userResponses['question3'].length > 0) {
        userResponses['question3'].forEach(problem => {
            if (problemsConfig.hasOwnProperty(problem)) {
                problemsConfig[problem].selected = true;
            }
        });
    }
    
    // Generierung der Werte für jedes Problem
    const diagnosisData = {
        skinHealthValue: skinHealthValue,
        skinHealthStatus: skinHealthStatus,
        textureValue: textureValue,
        textureStatus: textureStatus,
        diagnosisText: '', // Wird später generiert
        elasticityValue: getRandomValue(20, 100), // Beispielbereich
        barrierValue: getRandomValue(20, 100)    // Beispielbereich
    };
    
    // Generierung der Werte für spezifische Probleme
    for (const [problem, config] of Object.entries(problemsConfig)) {
        if (config.selected) {
            diagnosisData[`${problem.toLowerCase()}Value`] = getRandomValue(config.selectedRange[0], config.selectedRange[1]);
        } else {
            diagnosisData[`${problem.toLowerCase()}Value`] = getRandomValue(config.defaultRange[0], config.defaultRange[1]);
        }
    }
    
    // Zusätzliche Logik für 'Shëndeti i Lëkurës' basierend auf 'Mirembajtje'
    const isMirembajtjeSelected = userResponses['question3'] && userResponses['question3'].includes('Mirembajtje');
    if (isMirembajtjeSelected) {
        diagnosisData.shendetiValue = getRandomValue(8, 27);
    } else {
        diagnosisData.shendetiValue = getRandomValue(52, 69);
    }
    diagnosisData.shendetiStatus = getStatusText(diagnosisData.shendetiValue);
    
    // Generierung des Diagnose-Texts basierend auf Hauttyp und Problemstellungen
    let diagnosisText = '';
    
    // Integration des ausgewählten Hauttyps
    if (userResponses['question2'] && userResponses['question2'].length > 0) {
        const skinType = userResponses['question2'][0];
        switch (skinType) {
            case 'Thate':
                diagnosisText += 'Sebumi i lëkurës tuaj është i thatë. ';
                break;
            case 'Yndyrshme':
                diagnosisText += 'Sebumi i lëkurës tuaj është i yndyrshëm. ';
                break;
            case 'Kombinuar':
                diagnosisText += 'Sebumi i lëkurës tuaj është i kombinuar. ';
                break;
            case 'Normal':
                diagnosisText += 'Sebumi i lëkurës tuaj është normal. ';
                break;
            default:
                diagnosisText += 'Sebumi i lëkurës tuaj është në gjendje të mirë. ';
        }
    }
    
    // Integration der ausgewählten Problemstellungen
    if (userResponses['question3'] && userResponses['question3'].length > 0) {
        diagnosisText += 'Pas analizës, kemi vërejtur se keni problemet e mëposhtme: ';
        diagnosisText += userResponses['question3'].join(', ').toLowerCase() + '. ';
        
        // Auswahl einer zufälligen Diagnosevariante
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
            // Shtoni më shumë variante sipas nevojës
        ];
        
        const randomIndex = Math.floor(Math.random() * diagnosisVariants.length);
        diagnosisText += diagnosisVariants[randomIndex];
    } else {
        diagnosisText += 'Lëkura juaj duket e shëndetshme. Rekomandojmë të vazhdoni me rutinën tuaj të kujdesit të lëkurës. ';
    }
    
    // Zusätzliche Diagnose-Informationen
    diagnosisText += 'Është e rëndësishme të kuptoni se kujdesi adekuat për lëkurën mund të ndihmojë në parandalimin dhe përmirësimin e këtyre problemeve. ';
    
    diagnosisData.diagnosisText = diagnosisText;
    
    return diagnosisData;
}

// Funktion zum Anzeigen der Diagnose auf nextPage.html
function displayDiagnosis() {
    // Prüfe, ob wir auf nextPage.html sind
    if (window.location.pathname.endsWith('nextPage.html')) {
        // Abrufen der Benutzerantworten
        const userResponses = JSON.parse(localStorage.getItem('userResponses'));
        if (!userResponses) {
            alert('Asnjë përgjigje u gjet. Ju lutem filloni pyetësorin.');
            return;
        }

        const userName = userResponses['name'];
        const userAge = userResponses['age'];
        const skinTypeSelections = userResponses['question2'] || [];
        const problemSelections = userResponses['question3'] || [];

        // Anzeige von Name und Alter
        const userNameElement = document.getElementById('userName');
        const userAgeElement = document.getElementById('userAge');
        if (userNameElement) userNameElement.textContent = userName;
        if (userAgeElement) userAgeElement.textContent = userAge;

        // Abrufen der Diagnose-Daten aus localStorage
        const diagnosisData = JSON.parse(localStorage.getItem('diagnosisData'));
        if (!diagnosisData) {
            alert('Asnjë diagnozë u gjet. Ju lutem filloni pyetësorin.');
            return;
        }

         // Anzeige der Diagnose-Daten
         const diagnosisTextElement = document.getElementById('diagnosisText');
         if (diagnosisTextElement) {
             diagnosisTextElement.textContent = diagnosisData.diagnosisText;
             diagnosisTextElement.style.textAlign = 'left'; // Links-Ausrichtung setzen
             // Optional: Weitere Stile setzen, falls nötig
             diagnosisTextElement.style.fontSize = '1rem';
             diagnosisTextElement.style.color = '#333';
             diagnosisTextElement.style.margin = '20px';
             diagnosisTextElement.style.lineHeight = '1.6';
             diagnosisTextElement.style.fontFamily = '"Harmonia Sans", sans-serif';
         }
         
        // Anzeige der Diagrammwerte für 'Shëndeti i Lëkurës'
        const shendetiValueElement = document.getElementById('shendetiValue');
        const shendetiStatusElement = document.getElementById('shendetiStatus');
        if (shendetiValueElement) shendetiValueElement.textContent = diagnosisData.shendetiValue;
        if (shendetiStatusElement) shendetiStatusElement.textContent = diagnosisData.shendetiStatus;

        // Anzeige der Diagrammwerte für andere Probleme
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

        // Aktualisieren der progress-circle Hintergrundfarben für andere Probleme
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

        // Setzen der Fortschrittsbalken für Elasticity und Barrier
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
