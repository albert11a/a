// Objekt për ruajtjen e përgjigjeve të përdoruesit
const userResponses = {};

// Lista e pyetjeve që kërkojnë zgjedhje
const selectionRequiredQuestions = [2, 3];

// Funksioni për të filluar pyetësorin
function startQuestionnaire() {
    // Fillojmë direkt me pyetjen e parë
    document.getElementById("question-container").style.display = "block";
    document.getElementById("question1").style.display = "block";
    document.getElementById("answers1").style.display = "block";
    document.getElementById("nav-buttons1").style.display = "flex";
}

// Fillojmë pyetësorin kur faqja ngarkohet
window.onload = startQuestionnaire;

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

// Funksioni për të bërë një foto
function takePhoto() {
    const video = document.getElementById('cameraView');
    const overlay = document.getElementById('overlay');

    // Kontrollo nëse video është gati
    if (!video || video.readyState < 2) {
        alert('Video ende nuk është gati. Ju lutem provoni përsëri.');
        return;
    }

    // Merr dimensionet natyrore të videos
    const videoWidth = video.videoWidth;
    const videoHeight = video.videoHeight;

    // Krijo canvas dhe vendos madhësinë
    const canvas = document.createElement('canvas');
    canvas.width = videoWidth;
    canvas.height = videoHeight;

    const ctx = canvas.getContext('2d');

    // Anullo pasqyrimin si në CSS
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);

    // Vizato videon në canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Anullo transformimin për overlay
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    // Vizato overlay në canvas
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

    // Merr foton si Data URL
    const dataURL = canvas.toDataURL('image/png');

    // Protokollo foton në konzolë
    console.log('Foto e bërë (Data URL):', dataURL);

    // Ruaj foton
    localStorage.setItem('capturedImage', dataURL);

    // Mbyll kamerën dhe kalon te pyetja tjetër
    closeCamera();
    nextQuestion(2);
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

// ... (Der vorherige Code bleibt unverändert)

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

    // Weiterleiten zur Diagnose-Seite
    window.location.href = 'nextPage.html';
}

// Funktion zum Anzeigen der Diagnose auf nextPage.html
function displayDiagnosis() {
    // Prüfe, ob wir auf nextPage.html sind
    if (window.location.pathname.endsWith('nextPage.html')) {
        const userResponses = JSON.parse(localStorage.getItem('userResponses'));
        const userName = userResponses['name'];
        const userAge = userResponses['age'];

        document.getElementById('userName').textContent = userName;
        document.getElementById('userAge').textContent = userAge;

        // Logik für die Analyse
        const skinHealthValue = Math.floor(Math.random() * 51) + 20; // 20 bis 70%
        document.getElementById('skinHealthValue').textContent = skinHealthValue;

        // Status basierend auf dem Wert
        const skinHealthStatus = getStatusText(skinHealthValue);
        document.getElementById('skinHealthStatus').textContent = skinHealthStatus;

        // Texture immer "Care Needed"
        document.getElementById('textureValue').textContent = Math.floor(Math.random() * 31) + 20; // 20 bis 50%
        document.getElementById('textureStatus').textContent = 'Care Needed';

        // Andere Werte zufällig generieren
        generateRandomChart('spotsChart', 'spotsValue', 'spotsStatus');
        generateRandomChart('wrinklesChart', 'wrinklesValue', 'wrinklesStatus');
        generateRandomChart('rednessChart', 'rednessValue', 'rednessStatus');

        // Acne basierend auf der Auswahl
        const issues = userResponses['question3'] || [];
        if (issues.includes('Akne')) {
            document.getElementById('acneValue').textContent = Math.floor(Math.random() * 31) + 20; // 20 bis 50%
            document.getElementById('acneStatus').textContent = 'Care Needed';
        } else {
            document.getElementById('acneValue').textContent = Math.floor(Math.random() * 51) + 50; // 50 bis 100%
            document.getElementById('acneStatus').textContent = getStatusText(parseInt(document.getElementById('acneValue').textContent));
        }

        // Fortschrittsbalken für Elasticity und Barrier
        setProgressBar('elasticityBar');
        setProgressBar('barrierBar');
    }
}

// Funktion zum Anzeigen der Diagnose auf nextPage.html
function displayDiagnosis() {
    // Prüfe, ob wir auf nextPage.html sind
    if (window.location.pathname.endsWith('nextPage.html')) {
        const userResponses = JSON.parse(localStorage.getItem('userResponses'));
        const userName = userResponses['name'];
        const userAge = userResponses['age'];
        const skinTypeSelections = userResponses['question2'] || [];
        const problemSelections = userResponses['question3'] || [];

        // Anzeige von Name und Alter
        document.getElementById('userName').textContent = userName;
        document.getElementById('userAge').textContent = userAge;

        // Einbinden des Hauttyps in die Diagnose
        let diagnosisText = '';
        if (skinTypeSelections.length > 0) {
            const skinType = skinTypeSelections[0];
            diagnosisText += `Ju keni lëkurë të tipit ${skinType.toLowerCase()}. `;
        }

        // Generieren der Diagnose basierend auf den ausgewählten Problemen
        if (problemSelections.length > 0) {
            diagnosisText += 'Pas analizës, kemi vërejtur se ju keni: ';
            diagnosisText += problemSelections.map(problem => problem.toLowerCase()).join(', ') + '. ';

            // Zufällige Varianten der Diagnose hinzufügen
            const diagnosisVariants = [
                'Rekomandojmë të përdorni produktet tona për trajtimin e këtyre problemeve.',
                'Këshillohet të konsultoheni me një dermatolog për trajtim të mëtejshëm.',
                'Ne kemi një gamë produktesh që mund të ndihmojnë në përmirësimin e lëkurës suaj.',
                // ... fügen Sie hier weitere Varianten hinzu, insgesamt ca. 50 Varianten
            ];

            // Wählen Sie zufällig eine Variante aus
            const randomIndex = Math.floor(Math.random() * diagnosisVariants.length);
            diagnosisText += diagnosisVariants[randomIndex];
        } else {
            diagnosisText += 'Lëkura juaj duket e shëndetshme. ';
            diagnosisText += 'Rekomandojmë të vazhdoni me rutinën tuaj të kujdesit.';
        }

        // Anzeige der Diagnose
        document.getElementById('diagnosisText').textContent = diagnosisText;

        // Generieren der Diagrammwerte
        const allProblems = ['Akne', 'Poret', 'Hiperpigmentim', 'Rrudhat', 'Mirembajtje'];
        allProblems.forEach(problem => {
            const elementId = problem.toLowerCase(); // z.B. 'akne', 'poret', etc.
            let value;
            if (problemSelections.includes(problem)) {
                // Wenn das Problem ausgewählt wurde, Wert zwischen 15% und 37%
                value = Math.floor(Math.random() * (37 - 15 + 1)) + 15;
            } else {
                // Wenn das Problem nicht ausgewählt wurde, Wert zwischen 50% und 70%
                value = Math.floor(Math.random() * (70 - 50 + 1)) + 50;
            }
            // Aktualisieren Sie das Diagramm oder den Fortschrittsbalken
            const element = document.querySelector(`.progress-circle[data-category="${elementId}"]`);
            if (element) {
                element.dataset.percentage = value;
                element.style.background = `conic-gradient(black ${value}%, #F6F6F7 0%)`;
            }
        });
    }
}

const diagnosisVariants = [
    'Rekomandojmë të përdorni produktet tona për trajtimin e këtyre problemeve.',
    'Këshillohet të konsultoheni me një dermatolog për trajtim të mëtejshëm.',
    'Ne kemi një gamë produktesh që mund të ndihmojnë në përmirësimin e lëkurës suaj.',
    'Përdorimi i kremrave me SPF mund të ndihmojë në mbrojtjen e lëkurës tuaj.',
    'Hidratimi i rregullt është çelësi për një lëkurë të shëndetshme.',
    // Fügen Sie weitere Varianten hinzu...
];


// Hilfsfunktion, um zufällige Werte für Diagramme zu generieren
function generateRandomChart(chartId, valueId, statusId) {
    const value = Math.floor(Math.random() * 81) + 20; // 20 bis 100%
    document.getElementById(valueId).textContent = value;
    document.getElementById(statusId).textContent = getStatusText(value);
}

// Funktion, um den Status basierend auf dem Wert zu erhalten
function getStatusText(value) {
    if (value < 40) {
        return 'Care Needed';
    } else if (value < 70) {
        return 'Normal';
    } else {
        return 'Good';
    }
}

// Funktion, um Fortschrittsbalken zu setzen
function setProgressBar(barId) {
    const value = Math.floor(Math.random() * 81) + 20; // 20 bis 100%
    document.getElementById(barId).style.width = value + '%';
}

// Rufe displayDiagnosis auf, wenn die Seite geladen wird
window.onload = function() {
    if (window.location.pathname.endsWith('nextPage.html')) {
        displayDiagnosis();
    } else {
        startQuestionnaire();
    }
};
