// === Benutzerantworten und Status ===
let userResponses = {}; // Ändern von const zu let
let activeCameraStream = null; // Speichert den aktiven Kamerastream
let isFaceMeshLoaded = false;  // Überprüft, ob die Gesichtslandmarken geladen sind

/*** Liste der Fragen, die eine Auswahl erfordern.
 * * Diese Fragen müssen eine oder mehrere Antworten vom Benutzer erhalten, bevor er fortfahren kann.
 */
const selectionRequiredQuestions = [2, 3];

// === Hilfsfunktionen ===

/**
 * Generiert einen zufälligen Ganzzahlwert zwischen min und max (inklusive).
 * @param {number} min - Der minimale Wert (inklusive).
 * @param {number} max - Der maximale Wert (inklusive).
 * @returns {number} - Ein zufälliger Ganzzahlwert zwischen min und max.
 */
function getRandomValue(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Bestimmt den Status basierend auf einem numerischen Wert.
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

// ... (Weitere Hilfsfunktionen bleiben unverändert) ...

// Produkt-Empfehlungen
const productRecommendations = {
    'Akne': {
        name: 'Benzoyl Peroxide 5%',
        price: 19.99,
        id: '8050210963676',
        description: 'Lifeskin Benzoyl Peroxide 5% përmban formulën unike ,një sekret i vërtetë për një lëkurë të shëndetshme.',
        purpose: 'Largon aknet hormonale dhe bakteriale dhe shenjat nga aknet',
        activeIngredients: 'Benzoylperoxid 5%',
        usage: 'Për të gjitha gjinjtë, është e zakonshme të përdoret kujdesi ndaj fytyrës dhe trupit Njafton një sasi të vogël të kremit në dorën tënde dhe apliko atë në pjesët e fytyrës ose trupit Përdorimin ne detaje e keni me një udhëzues brenda pakos, ku tregon saktë se si përdoret.',
        size: '30mL', // Größe hinzufügen
        origin: 'Made in Germany' // Herkunft hinzufügen
    },
    'Poret': {
        name: 'Pore Control',
        price: 24.99,
        id: '8056262557916',
        description: 'Kontrollon dhe minimizon madhësinë e poreve.',
        purpose: 'Zvogëlon poret e dukshme dhe lëmon lëkurën.',
        activeIngredients: 'Lipo-hydroxy',
        usage: 'Për të gjitha gjinjtë, është e zakonshme të përdoret kujdesi ndaj fytyrës dhe trupit Njafton një sasi të vogël të kremit në dorën tënde dhe apliko atë në pjesët e fytyrës ose trupit Përdorimin ne detaje e keni me një udhëzues brenda pakos, ku tregon saktë se si përdoret.'
    },
    'Hiperpigmentim': {
        name: 'Vitac',
        price: 29.99,
        id: '8050211684572',
        description: 'Trajton hiperpigmentimin dhe tonin e pabarabartë të lëkurës.',
        purpose: 'Lëkurë më e ndritshme dhe strukturë e përmirësuar e lëkurës.',
        activeIngredients: 'Molekular Vitamin c',
        usage: 'Për të gjitha gjinjtë, është e zakonshme të përdoret kujdesi ndaj fytyrës dhe trupit Njafton një sasi të vogël të kremit në dorën tënde dhe apliko atë në pjesët e fytyrës ose trupit Përdorimin ne detaje e keni me një udhëzues brenda pakos, ku tregon saktë se si përdoret.'
    },
    'Rrudhat': {
        name: 'Reti',
        price: 21.99,
        id: '8050211455196',
        description: 'Kujdeset për lëkurën e ndjeshme dhe redukton skuqjen.',
        purpose: 'Qetëson lëkurën dhe zvogëlon skuqjen.',
        activeIngredients: 'Retinol 1%',
        usage: 'Për të gjitha gjinjtë, është e zakonshme të përdoret kujdesi ndaj fytyrës dhe trupit Njafton një sasi të vogël të kremit në dorën tënde dhe apliko atë në pjesët e fytyrës ose trupit Përdorimin ne detaje e keni me një udhëzues brenda pakos, ku tregon saktë se si përdoret.'
    },
    'Mirembajtje': {
        name: 'Hydro Cleanser',
        price: 15.99,
        id: '8050211127516',
        description: 'Hidraton dhe pastron lëkurën në thellësi si dhe miremban ate.',
        purpose: 'I jep lëkurës lagështi dhe heq papastërtitë.',
        activeIngredients: 'Acid Hialuronik, Glicerinë',
        usage: 'Për të gjitha gjinjtë, është e zakonshme të përdoret kujdesi ndaj fytyrës dhe trupit Njafton një sasi të vogël të kremit në dorën tënde dhe apliko atë në pjesët e fytyrës ose trupit Përdorimin ne detaje e keni me një udhëzues brenda pakos, ku tregon saktë se si përdoret.'
    }
};



// === Shopify Buy Button Client Initialisierung ===
const client = ShopifyBuy.buildClient({
    domain: 'lifeskin-ks-4785.myshopify.com',
    storefrontAccessToken: '3ff7175c4f759e429a8d332922360fee',
});

/**
 * Funktion zum Erstellen eines collapsiblen Abschnitts
 */
function createCollapsibleSection(title, content, isOpen = false) {
    const section = document.createElement('div');
    section.classList.add('collapsible-section');

    const header = document.createElement('button');
    header.classList.add('collapsible');

    // Label
    const labelSpan = document.createElement('span');
    labelSpan.textContent = title;
    header.appendChild(labelSpan);

    if (isOpen) {
        header.classList.add('active');
    }

    const contentDiv = document.createElement('div');
    contentDiv.classList.add('content');
    contentDiv.innerHTML = `<p>${content}</p>`;
    contentDiv.style.display = isOpen ? 'block' : 'none';

    header.addEventListener('click', function () {
        this.classList.toggle('active');
        if (contentDiv.style.display === 'block') {
            contentDiv.style.display = 'none';
        } else {
            contentDiv.style.display = 'block';
        }
    });

    section.appendChild(header);
    section.appendChild(contentDiv);

    return section;
}

/**
 * Funktion zum Anzeigen der Produkt-Empfehlungen
 */
function displayProductRecommendations() {
    const productsContainer = document.getElementById('products-container');
    const selectedProblems = userResponses['question3'] || [];

    // Initialisieren des Shopify Buy Button UI einmalig
    ShopifyBuy.UI.onReady(client).then(function (ui) {
        const moneyFormat = '€{{amount_with_comma_separator}}'; // Globale moneyFormat-Einstellung

        // Initialisieren des Warenkorbs inline, nicht als Popup
        ui.createComponent('cart', {
            moneyFormat: moneyFormat,
            options: {
                "cart": {
                    "popup": false, // Deaktivieren des Popups
                    "styles": {
                        "button": {
                            "background-color": "#000000",
                            "color": "#ffffff",
                            "padding": "15px",
                            "font-size": "16px",
                            "font-weight": "bold",
                            "border": "none",
                            "border-radius": "5px",
                            "cursor": "pointer",
                            "text-transform": "none"
                        },
                        "button:hover": {
                            "background-color": "#333333"
                        },
                        "button:focus": {
                            "background-color": "#000000"
                        }
                    },
                    "text": {
                        "title": "Shporta",
                        "total": "Total",
                        "notice": "Posta falas",
                        "button": "Porosit" // "Checkout" auf Albanisch
                    }
                }
            }
        });

// Event-Listener für AddToCart
document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', function () {
        const productId = button.getAttribute('data-product-id');
        const productName = button.getAttribute('data-product-name');
        const productPrice = parseFloat(button.getAttribute('data-product-price'));

        // Facebook Pixel Tracking
        fbq('track', 'AddToCart', {
            content_ids: [productId],
            content_name: productName,
            currency: 'EUR',
            value: productPrice
        });

        console.log('AddToCart Pixel gesendet:', {
            content_ids: [productId],
            content_name: productName,
            currency: 'EUR',
            value: productPrice
        });
    });
});


        // Iterieren über die ausgewählten Probleme
        selectedProblems.forEach((problem, index) => {
            if (productRecommendations.hasOwnProperty(problem)) {
                const product = productRecommendations[problem];
                const divId = `product-component-${product.id}`;

                // Überprüfen, ob das Produkt bereits hinzugefügt wurde, um Duplikate zu vermeiden
                if (document.getElementById(divId)) return;

                // Erstellen eines Containers für das Produkt
                const productDiv = document.createElement('div');
                productDiv.id = divId;
                productDiv.classList.add('product-item');
                productDiv.setAttribute('data-product-id', product.id);
                productsContainer.appendChild(productDiv);

                // Erstellen von Containern für jedes Element
                const imageContainer = document.createElement('div');
                const titleContainer = document.createElement('div');
                titleContainer.classList.add('spacing-adjustable');
                const madeInContainer = document.createElement('div');
                const sizeContainer = document.createElement('div');
                const priceContainer = document.createElement('div');
                const buttonContainer = document.createElement('div');

                // Fügen Sie die Container in der gewünschten Reihenfolge hinzu
                productDiv.appendChild(imageContainer);
                productDiv.appendChild(titleContainer);
                productDiv.appendChild(madeInContainer);
                productDiv.appendChild(sizeContainer);
                productDiv.appendChild(priceContainer);
                productDiv.appendChild(buttonContainer);

                // Rendern des Produktbilds ohne iframe
                ui.createComponent('product', {
                    id: product.id,
                    moneyFormat: moneyFormat,
                    node: imageContainer,
                    options: {
                        "product": {
                            "iframe": false,
                            "contents": {
                                "img": true,
                                "title": false,
                                "price": false,
                                "button": false
                            },
                            "styles": {
                                "img": {
                                    "border-radius": "5px",
                                    "margin-bottom": "15px"
                                }
                            }
                        }
                    }
                });

                // Rendern des Produkttitels ohne iframe
                ui.createComponent('product', {
                    id: product.id,
                    moneyFormat: moneyFormat,
                    node: titleContainer,
                    options: {
                        "product": {
                            "iframe": false,
                            "contents": {
                                "img": false,
                                "title": true,
                                "price": false,
                                "button": false
                            },
                            "styles": {
                                "title": {
                                    "font-size": "20px",
                                    "color": "#333333",
                                    "font-weight": "bold",
                                    "margin-bottom": "10px",
                                    "text-align": "left"
                                }
                            }
                        }
                    }
                });

                // "Made in Germany" hinzufügen
                madeInContainer.classList.add('made-in');
                madeInContainer.textContent = product.origin;

                // "30mL" hinzufügen
                sizeContainer.classList.add('product-size');
                sizeContainer.textContent = product.size;

                // Rendern des Preises innerhalb eines iframes
                ui.createComponent('product', {
                    id: product.id,
                    moneyFormat: moneyFormat,
                    node: priceContainer,
                    options: {
                        "product": {
                            "iframe": true,
                            "contents": {
                                "img": false,
                                "title": false,
                                "price": true,
                                "button": false
                            },
                            "styles": {
                                "product": {
                                    "text-align": "left"
                                },
                                "price": {
                                    "font-size": "14px",
                                    "color": "#000000"
                                }
                            }
                        }
                    }
                });

                // Rendern des "Add to Cart" Buttons ohne iframe
                ui.createComponent('product', {
                    id: product.id,
                    moneyFormat: moneyFormat,
                    node: buttonContainer,
                    options: {
                        "product": {
                            "iframe": false,
                            "contents": {
                                "img": false,
                                "title": false,
                                "price": false,
                                "button": true
                            },
                            "text": {
                                "button": "Shto në Shportë" // "Add to Cart" auf Albanisch
                            },
                            "styles": {
                                "button": {
                                    "width": "100%",
                                    "background-color": "#000000",
                                    "color": "#ffffff",
                                    "padding": "15px",
                                    "font-size": "16px",
                                    "font-weight": "normal !important",
                                    "border": "none",
                                    "border-radius": "5px",
                                    "cursor": "pointer",
                                    "text-transform": "none"
                                },
                                "button:hover": {
                                    "background-color": "#333333"
                                },
                                "button:focus": {
                                    "background-color": "#000000"
                                }
                            },
                            "events": {
                                "afterRender": function (component) {
                                    const addToCartButton = component.node.querySelector('button');
                                    if (addToCartButton) {
                                        const productId = component.model.id;
                                        const productTitle = component.model.title;
                                        const productPrice = component.model.variants[0].price.amount;

                                        // Entfernen Sie die folgende Zeile, um den Button-Typ nicht zu ändern
                                        // addToCartButton.setAttribute('type', 'button');

                                        addToCartButton.classList.add('html-add-to-cart');
                                        addToCartButton.id = `add-to-cart-${productId}`;
                                        addToCartButton.setAttribute('data-pixel-event', 'AddToCart');
                                        addToCartButton.setAttribute('data-product-id', productId);
                                        addToCartButton.setAttribute('data-product-name', productTitle);
                                        addToCartButton.setAttribute('data-product-price', productPrice);

                                        // Pixel-Tracking wird jetzt durch Event-Delegation gehandhabt
                                    }
                                }
                            }
                        } // Ende von "product"
                    }
                });

                // Hinzufügen der collapsible Sektionen
                const collapsibleContainer = document.createElement('div');
                collapsibleContainer.classList.add('collapsible-container');

                const sections = [
                    { title: 'Përshkrimi', content: product.description },
                    { title: 'Për çfarë shërben', content: product.purpose },
                    { title: 'Substanca aktive', content: product.activeIngredients },
                    { title: 'Përdorimi', content: product.usage }
                ];

                sections.forEach((section, secIndex) => {
                    const isOpen = secIndex === 0;
                    const collapsibleSection = createCollapsibleSection(section.title, section.content, isOpen);
                    collapsibleContainer.appendChild(collapsibleSection);
                });

                productDiv.appendChild(collapsibleContainer);
            }
        });

        // Implementierung der direkten Checkout-Funktion
        const checkoutButton = document.getElementById('direct-checkout-button');
        if (checkoutButton) {
            checkoutButton.addEventListener('click', () => {
                // Holen Sie sich die aktuelle Checkout-Session
                client.checkout.create().then((checkout) => {
                    window.location.href = checkout.webUrl; // Weiterleitung im selben Fenster
                }).catch(error => {
                    console.error('Fehler beim Erstellen des Checkouts:', error);
                });
            });
        }
    }).catch(error => {
        console.error('Fehler beim Initialisieren des UI:', error);
    });
}

// Rufe die Funktion auf, um die Empfehlungen anzuzeigen, nachdem das DOM geladen ist
document.addEventListener('DOMContentLoaded', function () {
    displayProductRecommendations();
});



// === Fragebogen-Management ===

/**
 * Startet den Fragebogen, indem die erste Frage und die zugehörigen Elemente angezeigt werden.
 */
function startQuestionnaire() {
    const questionContainer = document.getElementById("question-container");
    const firstQuestion = document.getElementById("question1");
    const firstAnswers = document.getElementById("answers1");
    const firstNavButtons = document.getElementById("nav-buttons1");

    // Anzeige des gesamten Fragecontainers und der ersten Frage
    questionContainer.style.display = "block";
    firstQuestion.style.display = "block";
    firstAnswers.style.display = "block";
    firstNavButtons.style.display = "flex";
}

/**
 * Event-Listener, der den Fragebogen beim Laden der Seite startet
 * oder die Diagnoseseite anzeigt, falls bereits ein Fragebogen abgeschlossen wurde.
 */
window.onload = function () {
    if (window.location.pathname.endsWith('nextPage.html')) {
        displayDiagnosis();
    } else {
        startQuestionnaire();
    }
};

/**
 * Umschaltet die Auswahl von Antwortboxen und speichert die Auswahl.
 * @param {HTMLElement} element - Das angeklickte Antwortfeld.
 */
function toggleSelection(element) {
    const questionId = element.parentElement.id;
    const questionNumber = parseInt(questionId.replace('answers', ''), 10);

    // Überprüfen, ob die aktuelle Frage eine Auswahl erfordert
    if (!selectionRequiredQuestions.includes(questionNumber)) return;

    // Umschalten der 'selected' Klasse
    element.classList.toggle('selected');

    // Sammeln aller ausgewählten Antworten innerhalb der aktuellen Frage
    const selectedAnswers = element.parentElement.querySelectorAll('.answer-box.selected');
    const selectedTexts = Array.from(selectedAnswers).map(box => {
        const heading = box.querySelector('.answer-heading');
        return heading ? heading.innerText : box.querySelector('input').value.trim();
    });

    // Speichern der ausgewählten Antworten im userResponses Objekt
    userResponses[`question${questionNumber}`] = selectedTexts;

    // Aktualisieren des Zustands des "Vazhdo" (Weiter) Buttons
    setVazhdoButtonState(questionNumber);
}

/**
 * Aktualisiert den Zustand der Navigationsbuttons basierend auf der Auswahl.
 * @param {number} questionNumber - Die Nummer der aktuellen Frage.
 */
function setVazhdoButtonState(questionNumber) {
    const navButtons = document.getElementById(`nav-buttons${questionNumber}`);
    if (!navButtons) return;

    const vazhdoButton = navButtons.querySelector('.vazhdo-button'); // "Vazhdo" (Weiter) Button
    const backButton = navButtons.querySelector('.left'); // "Mbrapa" (Zurück) Button

    // Für Frage 1 gibt es keinen "Vazhdo" Button
    if (questionNumber === 1) return;

    // Überprüfen, ob die aktuelle Frage eine Auswahl erfordert
    if (selectionRequiredQuestions.includes(questionNumber)) {
        const selected = userResponses[`question${questionNumber}`]?.length > 0;

        // Aktivieren oder Deaktivieren des "Vazhdo" Buttons
        vazhdoButton.classList.toggle('disabled', !selected);
    } else {
        // Für Fragen ohne Auswahlanforderung den "Vazhdo" Button aktivieren
        vazhdoButton.classList.remove('disabled');
    }

    // Spezieller Fall für Frage 2: Den "Mbrapa" Button deaktivieren
    if (questionNumber === 2 && backButton) {
        backButton.classList.add('disabled');
    } else if (backButton) {
        backButton.classList.remove('disabled');
    }
}

/**
 * Zeigt die nächste Frage im Fragebogen an.
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
 * Navigiert zurück zur vorherigen Frage.
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

// === Sensitivitätsregelung ===

/**
 * Aktualisiert den angezeigten Wert der Sensitivität und speichert ihn.
 * @param {number} value - Der aktuelle Wert des Sensitivitäts-Sliders.
 */
function updateSensitivityValue(value) {
    const sensitivityValueElement = document.getElementById("sensitivityValue");
    if (sensitivityValueElement) {
        sensitivityValueElement.textContent = value;
    }
    userResponses['sensitivity'] = value;
}

// === Kamerafunktionen ===

/**
 * Öffnet die Kamera und initialisiert FaceMesh zur Gesichtserkennung mit einem Ladebildschirm.
 */
async function openCamera() {
    const loadingScreen = document.getElementById("loadingScreen");
    // Der Ladebildschirm wird hier nicht angezeigt

    const video = document.getElementById('cameraView');
    const overlay = document.getElementById('overlay');
    const ctx = overlay.getContext('2d');

    try {
        // Zugriff auf den Video-Stream der Kamera
        const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "user" }
        });
        video.srcObject = stream;
        activeCameraStream = stream;

        // Erstellen einer Promise, die auf das Starten des Videos wartet
        await new Promise((resolve, reject) => {
            // Sobald die Metadaten geladen sind
            video.onloadedmetadata = () => {
                console.log("Meta-Daten des Videos geladen");

                // Versuchen, das Video abzuspielen
                video.play().then(() => {
                    console.log("Video wird abgespielt");

                    // Sobald das Video zu spielen beginnt, zeigen wir den Ladebildschirm an
                    if (loadingScreen) {
                        loadingScreen.style.display = "flex"; // Ladebildschirm anzeigen
                    }

                    // Startzeit für die Mindestanzeigezeit von 3,5 Sekunden
                    const loadingStartTime = Date.now();

                    // Anzeigen der Kamera-UI-Elemente
                    document.getElementById("cameraContainer").style.display = "block";
                    // Verbergen des Fragebogens
                    document.getElementById("question-container").style.display = "none";
                    // Anzeigen relevanter UI-Elemente
                    document.getElementById('topBorder').style.display = 'block';
                    document.getElementById('bottomBorder').style.display = 'block';
                    document.getElementById('buttonLogoContainer').style.display = 'flex';
                    document.getElementById('closeButton').style.display = 'block';
                    disableGestures();
                    resizeVideoOverlay(video, overlay);
                    initializeFaceMesh(video, overlay, ctx);
                    window.addEventListener('resize', () => resizeVideoOverlay(video, overlay));

                    // Starten der Mindestwartezeit von 3,5 Sekunden
                    setTimeout(() => {
                        if (loadingScreen) {
                            loadingScreen.style.display = "none"; // Ladebildschirm ausblenden
                        }
                        resolve(); // Kamera ist bereit und Mindestwartezeit ist abgelaufen
                    }, 3500);
                }).catch(error => {
                    console.error("Fehler beim Abspielen des Videos: ", error);
                    reject(error);
                });
            };

            // Optional: Fehlerbehandlung für das Laden der Metadaten
            video.onerror = (error) => {
                console.error("Fehler beim Laden der Video-Metadaten: ", error);
                reject(error);
            };
        });

    } catch (error) {
        console.error("Fehler beim Öffnen der Kamera: ", error);
        alert("Kamera kann nicht geöffnet werden. Bitte stellen Sie sicher, dass Sie den Zugriff erlaubt haben.");
        if (loadingScreen) {
            loadingScreen.style.display = "none"; // Ladebildschirm im Fehlerfall ausblenden
        }
    }
}


/**
 * Passt die Größe von Video und Overlay an die Fenstergröße an.
 * @param {HTMLVideoElement} video - Das Videoelement der Kamera.
 * @param {HTMLCanvasElement} overlay - Das Overlay-Canvas.
 */
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

/**
 * Initialisiert FaceMesh und startet die Gesichtserkennung.
 * @param {HTMLVideoElement} video - Das Videoelement der Kamera.
 * @param {HTMLCanvasElement} overlay - Das Overlay-Canvas.
 * @param {CanvasRenderingContext2D} ctx - Der Zeichenkontext des Overlays.
 */
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

/**
 * Verarbeitet die Ergebnisse von FaceMesh und zeichnet die Gesichtslandmarken.
 * @param {Object} results - Die Ergebnisse von FaceMesh.
 * @param {HTMLVideoElement} video - Das Videoelement der Kamera.
 * @param {HTMLCanvasElement} overlay - Das Overlay-Canvas.
 * @param {CanvasRenderingContext2D} ctx - Der Zeichenkontext des Overlays.
 */
function onFaceMeshResults(results, video, overlay, ctx) {
    ctx.clearRect(0, 0, overlay.width, overlay.height);
    ctx.drawImage(video, 0, 0, overlay.width, overlay.height);

    if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
        const landmarks = results.multiFaceLandmarks[0];
        drawLandmarks(landmarks, ctx, overlay);
    } else {
        console.log("Kein Gesicht erkannt.");
    }
}

/**
 * Zeichnet die Gesichtslandmarken auf das Overlay.
 * @param {Array} landmarks - Die Landmarks des Gesichts.
 * @param {CanvasRenderingContext2D} ctx - Der Zeichenkontext des Overlays.
 * @param {HTMLCanvasElement} overlay - Das Overlay-Canvas.
 */
function drawLandmarks(landmarks, ctx, overlay) {
    ctx.fillStyle = "cyan";
    landmarks.forEach((landmark) => {
        const x = landmark.x * overlay.width;
        const y = landmark.y * overlay.height;
        ctx.beginPath();
        ctx.arc(x, y, 1, 0, 2 * Math.PI);
        ctx.fill();
    });
}

// === Kamerabeschluss ===

/**
 * Schließt die Kamera und zeigt den Fragebogen wieder an.
 */
function closeCamera() {
    const video = document.getElementById('cameraView');
    const stream = video.srcObject;

    if (stream) {
        stream.getTracks().forEach(track => track.stop());
    }
    video.srcObject = null;
    activeCameraStream = null;
    document.getElementById("cameraContainer").style.display = "none";

    // Anzeige des Fragebogens
    document.getElementById("question-container").style.display = "block";

    enableGestures();

    console.log("Kamera geschlossen.");
}

// === Fotoaufnahme ===

/**
 * Nimmt ein Foto auf, zeigt den Ladebildschirm und leitet nach 3,5 Sekunden zur nächsten Frage weiter.
 */
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

    // Mbyll kamerën
    closeCamera();

    // Shfaqë e ekranit të ngarkimit
    const loadingScreen = document.getElementById("loadingScreen");
    if (loadingScreen) {
        loadingScreen.style.display = "flex";
    }

    // Prit 3.5 sekonda dhe vazhdo te pyetja tjetër
    setTimeout(function () {
        if (loadingScreen) {
            loadingScreen.style.display = "none";
        }
        nextQuestion(2);
    }, 3500);
}

// === Gestensteuerung ===

/**
 * Deaktiviert unerwünschte Gesten während der Kameranutzung.
 */
function disableGestures() {
    document.addEventListener('touchmove', preventTouch, { passive: false });
    document.addEventListener('gesturestart', preventGesture);
    document.addEventListener('gesturechange', preventGesture);
    document.addEventListener('gestureend', preventGesture);
}

/**
 * Aktiviert die zuvor deaktivierten Gesten wieder.
 */
function enableGestures() {
    document.removeEventListener('touchmove', preventTouch);
    document.removeEventListener('gesturestart', preventGesture);
    document.removeEventListener('gesturechange', preventGesture);
    document.removeEventListener('gestureend', preventGesture);
}

/**
 * Verhindert das Standardverhalten von Berührungen.
 * @param {Event} event - Das auslösende Ereignis.
 */
function preventTouch(event) {
    event.preventDefault();  // Verhindert Scrollen durch Berührungen
}

/**
 * Verhindert das Standardverhalten von Gesten.
 * @param {Event} event - Das auslösende Ereignis.
 */
function preventGesture(event) {
    event.preventDefault();  // Verhindert Gesten wie Zoom
}

// === Zoom-Verhinderung ===

// Verhindern des Zoom-Ins durch Doppelklick
window.addEventListener('dblclick', function (event) {
    event.preventDefault();
});

// Verhindern des Zoom-Ins durch Tastenkombinationen (z.B. Ctrl + Plus/Minus)
window.addEventListener('keydown', function (event) {
    if ((event.ctrlKey || event.metaKey) &&
        (event.key === '+' || event.key === '-' || event.key === '=' || event.key === '0')) {
        event.preventDefault();
    }
});

// Verhindern des Zoom-Ins durch Mausrad mit gedrückter Ctrl-Taste
window.addEventListener('wheel', function (event) {
    if (event.ctrlKey) {
        event.preventDefault();
    }
}, { passive: false });

// Verhindern von Zoom-Gesten auf Touch-Geräten
document.addEventListener('gesturestart', function (event) {
    event.preventDefault();
});
document.addEventListener('gesturechange', function (event) {
    event.preventDefault();
});
document.addEventListener('gestureend', function (event) {
    event.preventDefault();
});

// === Fragebogenabschluss ===

/**
 * Schließt den Fragebogen ab, speichert die Antworten und leitet zur Diagnose-Seite weiter.
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



    console.log('Der Fragebogen wurde abgeschlossen. Gesammelte Daten:', userResponses);

    // Speichern der Antworten und des Fotos im localStorage
    localStorage.setItem('userResponses', JSON.stringify(userResponses));
    localStorage.setItem('capturedImage', photoData);

    // Generieren der Diagnose-Daten basierend auf den Antworten
    const diagnosisData = generateDiagnosis(userResponses);
    localStorage.setItem('diagnosisData', JSON.stringify(diagnosisData));

    // Anzeigen des Ladebildschirms
    const loadingScreen2 = document.getElementById("loadingScreen2");
    if (loadingScreen2) {
        loadingScreen2.style.display = "flex";
    }

    // Nach 3,5 Sekunden den Ladebildschirm ausblenden und zur Diagnose-Seite weiterleiten
    setTimeout(function () {
        if (loadingScreen2) {
            loadingScreen2.style.display = "none";
        }
        window.location.href = 'nextPage.html';
    }, 3500);
}

/**
 * Generiert die Diagnose-Daten basierend auf den Benutzerantworten.
 * @param {Object} userResponses - Die gesammelten Antworten des Benutzers.
 * @returns {Object} - Das Diagnose-Datenobjekt.
 */
function generateDiagnosis(userResponses) {
    // Generierung der Basiseigenschaften
    const skinHealthValue = getRandomValue(20, 70); // Wert zwischen 20 und 70%
    const skinHealthStatus = getStatusText(skinHealthValue);

    // *** Anpassung des texturaValue Bereichs auf 34-74 ***
    const texturaValue = getRandomValue(34, 74); // Wert zwischen 34 und 74%
    const texturaStatus = getStatusText(texturaValue); // Dynamischer Status basierend auf texturaValue

    /**
     * Konfiguration der spezifischen Hautprobleme und deren Wertbereiche.
     */
    const problemsConfig = {
        'Akne': { selected: false, selectedRange: [11, 37], defaultRange: [90, 99] },
        'Poret': { selected: false, selectedRange: [14, 28], defaultRange: [52, 69] },
        'Hiperpigmentim': { selected: false, selectedRange: [14, 34], defaultRange: [89, 98] },
        'Rrudhat': { selected: false, selectedRange: [24, 39], defaultRange: [95, 99] }
    };

    // Überprüfen, welche Probleme ausgewählt wurden und entsprechend markieren
    if (userResponses['question3']) {
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
        texturaValue: texturaValue, // Angepasst auf 34-74%
        texturaStatus: texturaStatus, // Dynamisch basierend auf texturaValue
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
     */
    const isMirembajtjeSelected = userResponses['question3']?.includes('Mirembajtje');
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



    // Integration der ausgewählten Problemstellungen in den Diagnose-Text
    if (userResponses['question3'] && userResponses['question3'].length > 0) {
        diagnosisText += 'Gjatë skanimit të lëkurës tuaj, kemi vërejtur se keni disa shqetësime lidhur me '; // "Nach der Analyse haben wir festgestellt, dass Sie folgende Probleme haben:"
        diagnosisText += userResponses['question3'].join(', ').toLowerCase() + '. '; // Auflistung der Probleme

        // Auswahl einer zufälligen Diagnosevariante aus einem Array von Optionen
        const diagnosisVariants = [
            'këto probleme si rezultat të faktorëve të ndryshëm të jetës së përditshme dhe ambientit. ',
            'Këto probleme mund të shkaktohen nga stresi, ushqimi, dhe mungesa e kujdesit adekuat të lëkurës. ',
            'Analiza jonë tregon që këto çështje kërkojnë vëmendje dhe mirëmbajtje të vazhdueshme. ',
            'Këto problematika janë shpesh rezultat i përdorimit të duhur të produkteve për kujdesin e lëkurës. ',
            'Faktorët gjenetikë dhe mjedisorë luajnë një rol të rëndësishëm në shfaqjen e këtyre problemeve. ',
            'Këto probleme shpesh lidhen me mungesën e hidratimit adekuat dhe ekspozimin ndaj faktorëve të jashtëm. ',
            'Shëndeti i përgjithshëm juaj ka një ndikim të madh në gjendjen e lëkurës. ',
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
 * Zeigt die Diagnose auf der Diagnose-Seite (`nextPage.html`) an.
 */
function displayDiagnosis() {
    // Überprüfen, ob wir auf der Diagnose-Seite sind
    if (!window.location.pathname.endsWith('nextPage.html')) return;

    // Abrufen der Benutzerantworten aus dem localStorage und Zuweisung zur globalen Variable
    userResponses = JSON.parse(localStorage.getItem('userResponses'));
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
        diagnosisTextElement.style.fontSize = '0.9rem';
        diagnosisTextElement.style.color = '#333';
        diagnosisTextElement.style.margin = '14px';
        diagnosisTextElement.style.lineHeight = '0,9';

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

    const texturaValueElement = document.getElementById('texturaValue');
    const texturaStatusElement = document.getElementById('texturaStatus');
    if (texturaValueElement) texturaValueElement.textContent = diagnosisData.texturaValue;
    if (texturaStatusElement) texturaStatusElement.textContent = diagnosisData.texturaStatus;

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

    // Aktualisieren der progress-circle Hintergrundfarben für alle Kategorien
    const categories = ['shendeti', 'poret', 'textura', 'rrudhat', 'hiperpigmentim', 'akne'];
    categories.forEach(category => {
        const value = diagnosisData[`${category}Value`];
        const circle = document.querySelector(`.progress-circle[data-category="${category}"]`);
        if (circle) {
            circle.dataset.percentage = value;
            circle.style.background = `conic-gradient(black ${value}%, #F6F6F7 0%)`;
        }
    });

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

    // Aufrufen der Funktion zur Anzeige der Produktvorschläge
    displayProductRecommendations();
}
