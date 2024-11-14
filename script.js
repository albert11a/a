@font-face {
    font-family: 'Harmonia Sans';
    src: url('fonts/HarmoniaSans-Regular.woff2') format('woff2'),
         url('fonts/HarmoniaSans-Regular.woff') format('woff');
    font-weight: normal;
    font-style: normal;
}

@font-face {
    font-family: 'Harmonia Sans';
    src: url('fonts/HarmoniaSans-SemiBold.woff2') format('woff2'),
         url('fonts/HarmoniaSans-SemiBold.woff') format('woff');
    font-weight: 600;
    font-style: normal;
}

/* Globale Reset-Regeln */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    h6 {
        text-align: center;
    }
    
}

html, body {
    width: 100%;
    min-height: 100%;
    font-family: Arial, sans-serif;
    background-color: #ffffff;
    overflow-y: auto;
}

body {
    display: flex;
    justify-content: center;
    padding: 20px;
    box-sizing: border-box;
    flex-direction: column;
}

#user-input {
    width: 90%;
    max-width: 400px;
    padding: 20px;
    text-align: center;
}

input {
    width: 100%;
    margin-top: 15px;
    padding: 12px;
    font-size: 16px;
    border: 1px solid #dddddd;
    border-radius: 5px;
    text-align: center;
}

button {
    width: 40%;
    margin-top: 20px;
    padding: 12px;
    font-size: 16px;
    background-color: #000000;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

/* Frage-Box */
.question-box {
    background-color: #F6F6F7;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 20px;
    font-family: "Harmonia Sans", sans-serif;
    transition: background-color 0.3s, color 0.3s;
    text-align: left;
    min-height: 150px;
}

/* Zentrierung der Text-Elemente innerhalb der Frage-Box */
.question-box h3,
.question-box h6 {
    width: 100%;
    margin: 0;
    text-align: left; /* Links-Ausrichtung des Textes */
}

.question-box h3 {
    font-size: 1.2rem;
    font-weight: 600;
    color: #2E2A39;
}

.question-box h6 {
    font-size: 0.9rem;
    font-weight: 400;
    color: #555;
    line-height: 1.6;
}

/* Antwort-Box */
.answer-box {
    background-color: #F6F6F7;
    padding: 20px;
    margin: 20px 0;
    border-radius: 10px;
    min-height: 150px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    font-family: "Harmonia Sans", sans-serif;
    cursor: pointer;
    transition: background-color 0.3s, color 0.3s;
}

/* Änderung: Schriftgrößen um 2px verkleinert */
.question-box h3,
.answer-box h3 {
    font-size: 1.2rem;
    font-weight: 600;
    color: #2E2A39;
    margin-bottom: 10px;
}

.question-box h6,
.answer-box h6 {
    font-size: 0.9rem;
    font-weight: 400;
    color: #555;
    line-height: 1.6;
}

/* Antwort-Option */
.answer-option {
    background-color: #f8f9fa;
    padding: 15px;
    margin-top: 15px;
    border: 1px solid #ddd;
    border-radius: 10px;
    text-align: center;
    font-size: 1.3rem;
    font-weight: 600;
    color: #333;
    font-family: "Harmonia Sans", sans-serif;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.answer-option:hover {
    background-color: #e0e0e0;
}

/* Antwort-Box ausgewählt */
.answer-box.selected {
    background-color: #000000;
    color: #ffffff;
}

.answer-box.selected h3,
.answer-box.selected h6 {
    color: #ffffff;
}

/* Continue-Boxen */
.continue-box {
    background-color: #F6F6F7;
    cursor: default;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    padding: 20px;
    margin-top: 10px;
    font-size: 0.8rem;
    color: #555;
}

/* Antwort-Button */
.answer-button {
    margin-top: 10px;
    padding: 8px 16px;
    font-size: 14px;
    font-family: 'Harmonia Sans', sans-serif;
    color: #333;
    border: 1px solid #333;
    border-radius: 8px;
    background-color: transparent;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.answer-button:hover {
    background-color: #e6e6e6;
}

/* Kamera-Container */
#cameraContainer {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #ffffff;
    overflow: hidden;
    z-index: 1000;
}

/* Video und Overlay */
#cameraView,
#overlay {
    position: absolute;
    top: 50%;
    left: 50%;
    width: auto;
    height: 100%;
    transform: translate(-50%, -50%) scaleX(-1);
    object-fit: contain;
}

/* Schwarze, halbtransparente Ränder oben und unten */
#topBorder,
#bottomBorder {
    position: absolute;
    left: 0;
    width: 100%;
    height: 15%;
    background-color: rgba(0, 0, 0, 0.7);
    z-index: 2;
}

#topBorder {
    top: 0;
}

#bottomBorder {
    bottom: 0;
}

/* Button- und Logo-Container */
#buttonLogoContainer {
    position: absolute;
    bottom: 150px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    z-index: 3;
}

/* Logo-Stil */
#logo {
    max-width: 100%;
    height: auto;
    margin-right: 30px;
}

/* Foto-Button */
#takePhotoButton {
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    width: 200px;
    height: 200px;
}

#takePhotoButton img {
    width: 100%;
    height: 100%;
    object-fit: contain;
}

/* Button zum Schließen */
.close-button {
    position: absolute;
    top: 10px;
    right: 10px;
    background-color: white;
    color: black;
    padding: 10px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    z-index: 3;
}

/* Elemente standardmäßig ausblenden */
#cameraContainer,
#topBorder,
#bottomBorder,
#buttonLogoContainer,
.close-button {
    display: none;
}

/* Elemente anzeigen, wenn die Kamera aktiv ist */
.camera-active #cameraContainer,
.camera-active #topBorder,
.camera-active #bottomBorder,
.camera-active .close-button {
    display: block;
}

.camera-active #buttonLogoContainer {
    display: flex;
}

/* Responsive Design */
@media (max-width: 600px) {
    #logo {
        width: 110px;
        height: auto;
        margin-top: 170px;
        margin-left: -125px;
        margin-right: 20px;
    }

    #takePhotoButton {
        width: 100px;
        height: 100px;
        margin-top: 170px;
    }

    #buttonLogoContainer {
        bottom: 40px;
    }

    #topBorder,
    #bottomBorder {
        height: 20%;
    }
    .question-box,
    .answer-box {
        padding: 18px;
        margin: 10px 0;
        min-height: 140px;
    }

    .question-box h3,
    .answer-box h3 {
        font-size: 1rem;
    }

    .question-box h6,
    .answer-box h6 {
        font-size: 0.8rem;
    }
}

.sticky-bar {
    position: fixed;
    bottom: 0;
    width: 100%;
    z-index: 1000;
    background-color: #fff;
    box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: space-between;
    padding: 10px 20px;
}
  
.nav-button {
    padding: 10px 20px;
    font-size: 16px;
    border: none;
    cursor: pointer;
}

.left {
    align-self: flex-start;
}

.right {
    align-self: flex-end;
} 
/* Navigations-Buttons */
.nav-buttons {
    display: flex;
    justify-content: space-between;
    width: 100%;
    margin-bottom: 20px;
}

.nav-button.left {
    align-self: flex-start;
}

.nav-button.right {
    align-self: flex-end;
} 

/* Vazhdo-Button Styles */
.vazhdo-button.disabled {
    opacity: 0.5; /* Macht den Button blasser */
    cursor: not-allowed; /* Ändert den Cursor, um zu zeigen, dass der Button nicht aktiv ist */
}

.vazhdo-button {
    transition: opacity 0.3s; /* Für sanfte Übergänge */
}

/* Back-Button Styles */
.left.disabled {
    opacity: 0.5; /* Macht den Button blasser */
    cursor: not-allowed; /* Ändert den Cursor, um zu zeigen, dass der Button nicht aktiv ist */
}

.left {
    transition: opacity 0.3s; /* Für sanfte Übergänge */
}

/* Spaced Buttons für Fragen 3, 4 und 5 */
.spaced-buttons {
    margin-top: 60px; /* Anpassen nach Bedarf */
}






/* ... (Dein vorheriger CSS-Code bleibt unverändert) */

/* Stile für die Diagnose-Seite */


/* Container für Ergebnisse */
.result-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;
    margin-top: 20px;
    text-align: left;
    
}

.row {
    display: flex;
    justify-content: space-around;
    width: 100%;
    max-width: 500px;
    gap: 15px;
}

.result-box {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: left;
}

/* Label für alle Kreise und Balken - jetzt über den Kreisen */
.label {
    font-size: 0.9rem;
    color: #333;
    font-family: "Harmonia Sans", sans-serif;
    margin-bottom: 5px; /* Abstand zum Kreis */
    text-align: center;
}

/* Fortschrittskreis */
.progress-circle {
    position: relative;
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background: conic-gradient(
        black calc(var(--percentage, 0) * 1%),
        #F6F6F7 0%
    );
    display: flex;
    justify-content: center;
    align-items: center;
}

.progress-circle::before {
    content: attr(data-percentage) '%';
    position: absolute;
    color: #333;
    font-size: 0.9rem;
    font-weight: bold;
}

/* Dynamische Befüllung basierend auf Daten */
.progress-circle[data-percentage='50'] {
    --percentage: 50;
}
.progress-circle[data-percentage='30'] {
    --percentage: 30;
}
.progress-circle[data-percentage='20'] {
    --percentage: 20;
}
.progress-circle[data-percentage='60'] {
    --percentage: 60;
}
.progress-circle[data-percentage='40'] {
    --percentage: 40;
}
.progress-circle[data-percentage='70'] {
    --percentage: 70;
}

/* Linearer Fortschrittsbalken für Elasticiteti und Barriera */
.progress-bar {
    position: relative;
    width: 90px;
    height: 15px;
    border-radius: 10px;
    background-color: #F6F6F7;
    overflow: hidden;
    margin-top: 5px;
}

.progress-bar::before {
    content: '';
    position: absolute;
    height: 100%;
    width: calc(var(--percentage, 0) * 1%);
    background-color: black;
}

.progress-bar[data-percentage='55'] {
    --percentage: 55;
}

.progress-bar[data-percentage='25'] {
    --percentage: 25;
}

/* Anpassung für kleine Texte unter den Balken */
small {
    font-size: 0.8rem;
    color: #333;
    margin-top: 5px;
}

/* Mobile-Optimierung */
@media (max-width: 600px) {
    .progress-circle {
        width: 70px;
        height: 70px;
    }
    .row {
        gap: 10px;
    }
    .label {
        font-size: 0.8rem;
    }
    .progress-bar {
        width: 70px;
        height: 10px;
    }
}

/* Stil für den Diagnose-Text */
#diagnosisText {
    font-size: 1rem;
    color: #333;
    margin: 20px;
    line-height: 1.6;
    text-align: center;
    font-family: "Harmonia Sans", sans-serif;
}

.answer-box {
    background-color: #F6F6F7;
    padding: 20px;
    margin: 20px 0;
    border-radius: 10px;
    min-height: 150px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    font-family: "Harmonia Sans", sans-serif;
    cursor: pointer;
    transition: background-color 0.3s, color 0.3s;
    
}

/* Allgemeine Stile für .answer-box */
.answer-box {
    /* ... andere Stile ... */
    /* Entfernen Sie text-align: center; wenn vorhanden */
    /* text-align: center; */
}

/* Spezifische Stile für die Diagnosebox */
.answer-box.diagnosis-box {
    text-align: left;
    align-items: flex-start;
}

.answer-box.diagnosis-box h3,
.answer-box.diagnosis-box h6,
.answer-box.diagnosis-box p {
    text-align: left;
}

#diagnosisText {
    text-align: left !important;
}

