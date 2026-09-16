 /* =====================================================
   BIRTHDAY SURPRISE WEBSITE

   FLOW:
   COUNTDOWN
   → BIRTHDAY MESSAGE
   → VIDEO
   → WISH FORM
   → SHEETDB SAVE
   → GIFTS
   → POLAROIDS
   → PHOTO BOOTH

   FIREWORKS DISABLED
===================================================== */


/* =====================================================
   SETTINGS
===================================================== */

const TEST_MODE = true;
const TEST_SECONDS = 5;

const CELEBRATION_DELAY = 1000;
const VIDEO_END_DELAY = 1000;


/* =====================================================
   DOM ELEMENTS
===================================================== */

const hoursElement =
    document.getElementById("hours");

const minutesElement =
    document.getElementById("minutes");

const secondsElement =
    document.getElementById("seconds");

const countdownElement =
    document.getElementById("countdown");

const waitingSection =
    document.getElementById("waitingSection");

const celebrationSection =
    document.getElementById("celebrationSection");

const starsContainer =
    document.getElementById("stars");

const heartsContainer =
    document.getElementById("hearts");

const canvas =
    document.getElementById("fireworksCanvas");

const fireworksSound =
    document.getElementById("fireworksSound");

const mainContainer =
    document.querySelector(".main-container");

const videoSection =
    document.getElementById("videoSection");

const birthdayVideo =
    document.getElementById("birthdayVideo");


/* =====================================================
   WISH FORM ELEMENTS
===================================================== */

const wishSection =
    document.getElementById("wishSection");

const wishForm =
    document.getElementById("wishForm");

const wishInput =
    document.getElementById("wishInput");

const saveWishBtn =
    document.getElementById("saveWishBtn");

const wishTimestamp =
    document.getElementById("wishTimestamp");


/* =====================================================
   GIFT ELEMENTS
===================================================== */

const giftSection =
    document.getElementById("giftSection");

const gift1 =
    document.getElementById("gift1");

const gift2 =
    document.getElementById("gift2");

const gift3 =
    document.getElementById("gift3");

const gift4 =
    document.getElementById("gift4");

const polaroidSection =
    document.getElementById("polaroidSection");

const polaroidImage =
    document.getElementById("polaroidImage");

const polaroidCaption =
    document.getElementById("polaroidCaption");

const nextGiftBtn =
    document.getElementById("nextGiftBtn");


/* =====================================================
   PHOTO BOOTH
===================================================== */

const photoBoothSection =
    document.getElementById("photoBoothSection");

const photoBoothSong =
    document.getElementById("photoBoothSong");

/* =====================================================
   Letter 
===================================================== */
const birthdayLetterSection =
    document.getElementById("birthdayLetterSection");

const letterEnvelopeScreen =
    document.getElementById("letterEnvelopeScreen");

const birthdayEnvelope =
    document.getElementById("birthdayEnvelope");

const openLetterBtn =
    document.getElementById("openLetterBtn");

const letterPageScreen =
    document.getElementById("letterPageScreen");

/* =====================================================
   REQUIRED ELEMENT CHECK
===================================================== */

const requiredElements = {

    hoursElement,
    minutesElement,
    secondsElement,
    countdownElement,

    waitingSection,
    celebrationSection,

    starsContainer,
    heartsContainer,

    canvas,
    fireworksSound,
    mainContainer,

    videoSection,
    birthdayVideo,

    wishSection,
    wishForm,
    wishInput,
    saveWishBtn,
    wishTimestamp,

    giftSection,
    gift1,
    gift2,
    gift3,
    gift4,

    polaroidSection,
    polaroidImage,
    polaroidCaption,
    nextGiftBtn,

    birthdayLetterSection,
    letterEnvelopeScreen,
    birthdayEnvelope,
    openLetterBtn,
    letterPageScreen

};


const missingElements =
    Object.entries(requiredElements)
        .filter(([, element]) => !element)
        .map(([name]) => name);


if (missingElements.length > 0) {

    console.error(
        "Required DOM elements are missing:",
        missingElements
    );

    throw new Error(
        `Required DOM elements missing: ${missingElements.join(", ")}`
    );
}


/* =====================================================
   CANVAS SETUP
   Fireworks are disabled.
===================================================== */

const ctx =
    canvas.getContext("2d");


if (!ctx) {

    throw new Error(
        "Canvas 2D context is not available."
    );

}


/* =====================================================
   GLOBAL VARIABLES
===================================================== */

let countdownInterval = null;

let celebrationStarted = false;

let testEndTime = null;


/*
   IMPORTANT:

   Photo Booth ko page load par start hone se rokne ke liye
   ye variable use hoga.

   Sirf Gift 4 ke baad true hoga.
*/

let photoBoothStarted = false;


/* =====================================================
   CANVAS RESIZE
===================================================== */

function resizeCanvas() {

    const dpr =
        window.devicePixelRatio || 1;

    canvas.width =
        window.innerWidth * dpr;

    canvas.height =
        window.innerHeight * dpr;

    canvas.style.width =
        window.innerWidth + "px";

    canvas.style.height =
        window.innerHeight + "px";

    ctx.setTransform(
        dpr,
        0,
        0,
        dpr,
        0,
        0
    );

}


resizeCanvas();


window.addEventListener(
    "resize",
    resizeCanvas
);

/* =====================================================
   FIREWORKS ANIMATION
===================================================== */

let fireworksAnimationId = null;
let fireworksRunning = false;
let fireworksLaunchInterval = null;

const fireworks = [];
const particles = [];

const fireworkColors = [
    "#ff4fa3",
    "#ff9dcc",
    "#9b5cff",
    "#ffffff",
    "#ffd166",
    "#ff6b6b",
    "#7df9ff"
];


function createFirework() {
    const startX =
        window.innerWidth * (
            0.12 + Math.random() * 0.76
        );

    const startY =
        window.innerHeight + 25;

    const targetX =
        window.innerWidth * (
            0.15 + Math.random() * 0.70
        );

    const targetY =
        window.innerHeight * (
            0.10 + Math.random() * 0.48
        );

    fireworks.push({
        x: startX,
        y: startY,
        targetX,
        targetY,
        speed: 0.052 + Math.random() * 0.015,
        progress: 0,
        distanceX: targetX - startX,
        distanceY: targetY - startY,
        color: fireworkColors[
            Math.floor(
                Math.random() *
                fireworkColors.length
            )
        ]
    });
}


function explodeFirework(firework) {
    const particleCount =
        window.innerWidth < 600
            ? 42
            : 62;

    for (let i = 0; i < particleCount; i++) {
        const angle =
            (Math.PI * 2 * i) / particleCount +
            Math.random() * 0.22;

        const speed =
            1.8 + Math.random() * 4.1;

        const color =
            Math.random() > 0.30
                ? firework.color
                : fireworkColors[
                    Math.floor(
                        Math.random() *
                        fireworkColors.length
                    )
                ];

        particles.push({
            x: firework.x,
            y: firework.y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            gravity: 0.055,
            friction: 0.978,
            alpha: 1,
            decay: 0.010 + Math.random() * 0.013,
            size: 1.4 + Math.random() * 2.3,
            color
        });
    }
}


function updateFireworks() {
    if (!fireworksRunning) {
        return;
    }

    ctx.fillStyle =
        "rgba(5, 2, 13, 0.20)";

    ctx.fillRect(
        0,
        0,
        window.innerWidth,
        window.innerHeight
    );

    for (
        let index = fireworks.length - 1;
        index >= 0;
        index--
    ) {
        const firework =
            fireworks[index];

        firework.progress +=
            firework.speed;

        firework.x +=
            firework.distanceX *
            firework.speed;

        firework.y +=
            firework.distanceY *
            firework.speed;

        ctx.beginPath();

        ctx.arc(
            firework.x,
            firework.y,
            2.5,
            0,
            Math.PI * 2
        );

        ctx.fillStyle =
            firework.color;

        ctx.shadowBlur = 14;
        ctx.shadowColor =
            firework.color;

        ctx.fill();

        if (firework.progress >= 1) {
            explodeFirework(firework);

            fireworks.splice(
                index,
                1
            );
        }
    }

    for (
        let index = particles.length - 1;
        index >= 0;
        index--
    ) {
        const particle =
            particles[index];

        particle.vx *=
            particle.friction;

        particle.vy *=
            particle.friction;

        particle.vy +=
            particle.gravity;

        particle.x +=
            particle.vx;

        particle.y +=
            particle.vy;

        particle.alpha -=
            particle.decay;

        if (particle.alpha <= 0) {
            particles.splice(
                index,
                1
            );

            continue;
        }

        ctx.beginPath();

        ctx.arc(
            particle.x,
            particle.y,
            particle.size,
            0,
            Math.PI * 2
        );

        ctx.globalAlpha =
            particle.alpha;

        ctx.fillStyle =
            particle.color;

        ctx.shadowBlur = 11;
        ctx.shadowColor =
            particle.color;

        ctx.fill();
    }

    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;

    fireworksAnimationId =
        requestAnimationFrame(
            updateFireworks
        );
}

function startFireworks() {
    if (fireworksRunning) {
        return;
    }

    fireworksRunning = true;

    ctx.clearRect(
        0,
        0,
        window.innerWidth,
        window.innerHeight
    );

    createFirework();
    createFirework();

    fireworksLaunchInterval = setInterval(() => {
        if (!fireworksRunning) {
            return;
        }

        createFirework();

        if (Math.random() > 0.52) {
            setTimeout(() => {
                if (fireworksRunning) {
                    createFirework();
                }
            }, 180);
        }
    }, 700);

    updateFireworks();
}

// function startFireworks() {
//     if (fireworksRunning) {
//         return;
//     }

//     fireworksRunning = true;

//     ctx.clearRect(
//         0,
//         0,
//         window.innerWidth,
//         window.innerHeight
//     );

//     /* First fireworks immediately */
//     createFirework();
//     createFirework();

//     /* New fireworks keep launching during 10 sec audio */
//     fireworksLaunchInterval =
//         setInterval(() => {
//             if (!fireworksRunning) {
//                 return;
//             }

//             createFirework();

//             if (Math.random() > 0.52) {
//                 setTimeout(
//                     createFirework,
//                     180
//                 );
//             }
//         }, 700);

//     updateFireworks();
// }


function stopFireworks() {
    fireworksRunning = false;

    if (fireworksLaunchInterval) {
        clearInterval(
            fireworksLaunchInterval
        );

        fireworksLaunchInterval = null;
    }

    if (fireworksAnimationId) {
        cancelAnimationFrame(
            fireworksAnimationId
        );

        fireworksAnimationId = null;
    }

    fireworks.length = 0;
    particles.length = 0;

    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;

    /* Canvas bilkul clear — video ke upar kuch nahi dikhega */
    ctx.clearRect(
        0,
        0,
        window.innerWidth,
        window.innerHeight
    );
}


/* =====================================================
   CREATE STARS
===================================================== */

function createStars() {

    const numberOfStars =
        window.innerWidth < 600
            ? 100
            : 150;


    for (
        let i = 0;
        i < numberOfStars;
        i++
    ) {

        const star =
            document.createElement("div");

        star.classList.add("star");


        if (Math.random() > 0.85) {

            star.classList.add("big");

        }


        star.style.left =
            Math.random() * 100 + "%";

        star.style.top =
            Math.random() * 100 + "%";


        star.style.setProperty(
            "--duration",
            1.5 + Math.random() * 3 + "s"
        );


        star.style.animationDelay =
            Math.random() * 4 + "s";


        starsContainer.appendChild(star);

    }

}


/* =====================================================
   CREATE FLOATING HEARTS
===================================================== */

function createHearts() {

    const numberOfHearts =
        window.innerWidth < 600
            ? 12
            : 20;


    for (
        let i = 0;
        i < numberOfHearts;
        i++
    ) {

        const heart =
            document.createElement("span");


        heart.classList.add("heart");


        heart.textContent =
            "♥";


        heart.style.left =
            Math.random() * 100 + "%";


        heart.style.setProperty(
            "--size",
            8 + Math.random() * 14 + "px"
        );


        heart.style.setProperty(
            "--move",
            -40 + Math.random() * 80 + "px"
        );


        heart.style.setProperty(
            "--duration",
            8 + Math.random() * 8 + "s"
        );


        heart.style.setProperty(
            "--delay",
            Math.random() * 10 + "s"
        );


        heartsContainer.appendChild(heart);

    }

}


/* =====================================================
   FORMAT NUMBER
===================================================== */

function formatNumber(number) {

    return String(number)
        .padStart(2, "0");

}


/* =====================================================
   GET TIME UNTIL INDIA MIDNIGHT
===================================================== */

function getMillisecondsUntilISTMidnight() {

    const now =
        new Date();


    const utcMilliseconds =
        now.getTime() +
        now.getTimezoneOffset() *
        60 *
        1000;


    const istNow =
        new Date(
            utcMilliseconds +
            5.5 *
            60 *
            60 *
            1000
        );


    const tomorrowIST =
        new Date(istNow);


    tomorrowIST.setDate(
        tomorrowIST.getDate() + 1
    );


    tomorrowIST.setHours(
        0,
        0,
        0,
        0
    );


    const midnightUTC =
        tomorrowIST.getTime() -
        5.5 *
        60 *
        60 *
        1000;


    return (
        midnightUTC -
        now.getTime()
    );

}


/* =====================================================
   UPDATE COUNTDOWN
===================================================== */

function updateCountdown(milliseconds) {

    if (milliseconds < 0) {

        milliseconds = 0;

    }


    const totalSeconds =
        Math.floor(
            milliseconds / 1000
        );


    const hours =
        Math.floor(
            totalSeconds / 3600
        );


    const minutes =
        Math.floor(
            (totalSeconds % 3600) / 60
        );


    const seconds =
        totalSeconds % 60;


    hoursElement.textContent =
        formatNumber(hours);


    minutesElement.textContent =
        formatNumber(minutes);


    secondsElement.textContent =
        formatNumber(seconds);

}


/* =====================================================
   REAL COUNTDOWN
===================================================== */

function startRealCountdown() {

    function tick() {

        const remaining =
            getMillisecondsUntilISTMidnight();


        if (remaining <= 0) {

            clearInterval(
                countdownInterval
            );


            countdownInterval =
                null;


            startCelebration();

            return;

        }


        updateCountdown(
            remaining
        );

    }


    tick();


    countdownInterval =
        setInterval(
            tick,
            250
        );

}


/* =====================================================
   TEST COUNTDOWN
===================================================== */

function startTestCountdown() {

    testEndTime =
        Date.now() +
        TEST_SECONDS * 1000;


    function tick() {

        const remaining =
            testEndTime -
            Date.now();


        if (remaining <= 0) {

            clearInterval(
                countdownInterval
            );


            countdownInterval =
                null;


            updateCountdown(0);


            startCelebration();

            return;

        }


        updateCountdown(
            remaining
        );

    }


    tick();


    countdownInterval =
        setInterval(
            tick,
            50
        );

}


/* =====================================================
   START CELEBRATION
===================================================== */

// function startCelebration() {

//     if (celebrationStarted) {

//         return;

//     }


//     celebrationStarted =
//         true;


//     if (countdownInterval) {

//         clearInterval(
//             countdownInterval
//         );


//         countdownInterval =
//             null;

//     }


//     const introSection =
//         document.querySelector(
//             ".intro-section"
//         );


//     const countdownSection =
//         document.querySelector(
//             ".countdown-section"
//         );


//     /*
//        Initial intro remove
//     */

//     if (introSection) {

//         introSection.remove();

//     }


//     /*
//        Countdown remove
//     */

//     if (countdownSection) {

//         countdownSection.remove();

//     }


//     /*
//        Waiting section remove
//     */

//     if (waitingSection) {

//         waitingSection.remove();

//     }


//     /*
//        Birthday message
//     */

//     celebrationSection.innerHTML =
//         "";


//     const finalMessage =
//         document.createElement(
//             "div"
//         );


//     finalMessage.className =
//         "final-birthday-message";


//     finalMessage.textContent =
//         "🎂 Happy Birthday My Love 🫂❤️";


//     celebrationSection.appendChild(
//         finalMessage
//     );


//     celebrationSection.classList.add(
//         "show"
//     );


//     celebrationSection.setAttribute(
//         "aria-hidden",
//         "false"
//     );


//     /*
//        Fireworks intentionally disabled.

//        Directly video start hogi.
//     */

//     /* =========================================
//    10-SECOND CELEBRATION
//    Message + sound + visual fireworks
// ========================================= */

// // startFireworks();

// // fireworksSound.currentTime = 0;
// // fireworksSound.volume = 0.60;


// /* Sound 10 sec complete hote hi:
//    fireworks stop + video start */
// // fireworksSound.onended = () => {
// //     stopFireworks();
// //     showVideoAfterCelebration();
// // };


// /* Patake ki sound start */
// // fireworksSound.play().catch(error => {
// //     console.warn(
// //         "Fireworks sound autoplay blocked:",
// //         error
// //     );

// //     /* Agar sound browser block kar de,
// //        tab bhi 10 sec baad video start ho */
// //     setTimeout(() => {
// //         stopFireworks();
// //         showVideoAfterCelebration();
// //     }, 10000);
// // });


// /* =========================================
//    MESSAGE + FIREWORKS TOGETHER
//    Duration: 10 seconds
// ========================================= */

// const CELEBRATION_DURATION = 10000;

// startFireworks();

// fireworksSound.currentTime = 0;
// fireworksSound.volume = 0.60;

// let celebrationEnded = false;

// function endCelebration() {
//     if (celebrationEnded) {
//         return;
//     }

//     celebrationEnded = true;

//     stopFireworks();

//     fireworksSound.pause();
//     fireworksSound.currentTime = 0;
//     fireworksSound.onended = null;

//     showVideoAfterCelebration();
// }

// /* Sound start */
// fireworksSound.play().catch(error => {
//     console.warn(
//         "Fireworks sound autoplay blocked:",
//         error
//     );
// });

// /* Message + fireworks exactly 10 seconds */
// setTimeout(() => {
//     endCelebration();
// }, CELEBRATION_DURATION);

// }

function startCelebration() {
    if (celebrationStarted) {
        return;
    }

    celebrationStarted = true;

    if (countdownInterval) {
        clearInterval(countdownInterval);
        countdownInterval = null;
    }

    const introSection = document.querySelector(".intro-section");
    const countdownSection = document.querySelector(".countdown-section");

    if (introSection) introSection.remove();
    if (countdownSection) countdownSection.remove();
    if (waitingSection) waitingSection.remove();

    // Purana content clear karein
    celebrationSection.innerHTML = "";

    // Birthday message create karein
    const finalMessage = document.createElement("div");
    finalMessage.className = "final-birthday-message";
    finalMessage.textContent = "🎂 Happy Birthday My Love 🫂❤️";

    celebrationSection.appendChild(finalMessage);

    // Celebration visible karein
    celebrationSection.classList.add("show");
    celebrationSection.setAttribute("aria-hidden", "false");

    // Text animation
    setTimeout(() => {
        finalMessage.classList.add("visible");
    }, 50);

    // Fireworks start
    startFireworks();

    fireworksSound.currentTime = 0;
    fireworksSound.volume = 0.6;

    fireworksSound.play().catch(error => {
        console.warn("Fireworks sound autoplay blocked:", error);
    });

    // 10 seconds baad video
    setTimeout(() => {
        stopFireworks();

        fireworksSound.pause();
        fireworksSound.currentTime = 0;

        showVideoAfterCelebration();
    }, 10000);
}

/* =====================================================
   SHOW VIDEO AFTER CELEBRATION
===================================================== */

// function showVideoAfterCelebration() {

//     setTimeout(() => {

//         celebrationSection.classList.remove(
//             "show"
//         );


//         celebrationSection.setAttribute(
//             "aria-hidden",
//             "true"
//         );


//         videoSection.classList.add(
//             "show"
//         );


//         videoSection.setAttribute(
//             "aria-hidden",
//             "false"
//         );


//         birthdayVideo.currentTime =
//             0;


//         birthdayVideo.muted =
//             true;


//         birthdayVideo.playsInline =
//             true;


//         birthdayVideo.onended =
//             handleVideoEnded;


//         const playPromise =
//             birthdayVideo.play();


//         if (
//             playPromise !== undefined
//         ) {

//             playPromise.catch(error => {

//                 console.warn(
//                     "Video autoplay blocked:",
//                     error
//                 );

//             });

//         }

//     }, CELEBRATION_DELAY);

// }

function showVideoAfterCelebration() {
    /* Video se pehle fireworks ko fully stop aur clear karo */
    stopFireworks();

    /* Sound event remove, taki function dobara trigger na ho */
    fireworksSound.onended = null;

    /* Birthday message hide */
    celebrationSection.classList.remove(
        "show"
    );

    celebrationSection.setAttribute(
        "aria-hidden",
        "true"
    );

    /* Video section show */
    videoSection.classList.add(
        "show"
    );

    videoSection.setAttribute(
        "aria-hidden",
        "false"
    );

    /* Video restart */
    birthdayVideo.currentTime = 0;
    birthdayVideo.muted = true;
    birthdayVideo.playsInline = true;

    birthdayVideo.onended = handleVideoEnded;

    const playPromise = birthdayVideo.play();

    if (playPromise !== undefined) {
        playPromise.catch(error => {
            console.warn(
                "Video autoplay blocked:",
                error
            );
        });
    }
}


/* =====================================================
   VIDEO END HANDLER
===================================================== */

function handleVideoEnded() {

    birthdayVideo.onended =
        null;


    setTimeout(() => {

        showWishScreen();

    }, VIDEO_END_DELAY);

}


/* =====================================================
   SHOW WISH FORM
===================================================== */

function showWishScreen() {

    videoSection.classList.remove(
        "show"
    );


    videoSection.setAttribute(
        "aria-hidden",
        "true"
    );


    wishSection.classList.add(
        "show"
    );


    wishSection.setAttribute(
        "aria-hidden",
        "false"
    );


    document.body.classList.add(
        "no-scroll"
    );


    setTimeout(() => {

        wishInput.focus();

    }, 800);

}


/* =====================================================
   HIDE WISH FORM
===================================================== */

function hideWishScreen() {

    wishSection.classList.remove(
        "show"
    );


    wishSection.setAttribute(
        "aria-hidden",
        "true"
    );


    document.body.classList.remove(
        "no-scroll"
    );

}


/* =====================================================
   SUBMIT FORM TO SHEETDB
===================================================== */

wishForm.addEventListener(
    "submit",
    async event => {

        event.preventDefault();


        const wishText =
            wishInput.value.trim();


        if (!wishText) {

            wishInput.focus();

            return;

        }


        saveWishBtn.disabled =
            true;


        /*
           Timestamp SheetDB ke timestamp
           column mein save hoga.
        */

        wishTimestamp.value =
            new Date().toLocaleString(
                "en-IN",
                {
                    dateStyle: "medium",
                    timeStyle: "medium"
                }
            );


        try {

            const response =
                await fetch(
                    wishForm.action,
                    {
                        method: "POST",

                        body: new FormData(
                            wishForm
                        )
                    }
                );


            if (!response.ok) {

                throw new Error(
                    `SheetDB error: ${response.status}`
                );

            }


            /*
               Wish screen par display nahi hogi.

               Submit ke baad clear + hide.
            */

            wishInput.value =
                "";


            wishTimestamp.value =
                "";


            hideWishScreen();


            /*
               IMPORTANT:

               Wish save ke baad
               3 seconds wait.
            */

            setTimeout(() => {

                showGiftScreen();

            }, 1000);


        } catch (error) {

            console.error(
                "Wish save failed:",
                error
            );

        } finally {

            saveWishBtn.disabled =
                false;

        }

    }
);


/* =====================================================
   INITIALIZE WEBSITE
===================================================== */

function init() {

    /*
       IMPORTANT:

       Page load ke time Photo Booth
       kabhi bhi visible/play nahi hona chahiye.
    */

    if (photoBoothSection) {

        photoBoothSection.classList.remove(
            "show"
        );


        photoBoothSection.setAttribute(
            "aria-hidden",
            "true"
        );

    }


    if (photoBoothSong) {

        photoBoothSong.pause();


        photoBoothSong.currentTime =
            0;

    }


    createStars();

    createHearts();


    if (TEST_MODE) {

        console.log(
            "TEST MODE ON"
        );


        console.log(
            `Countdown starts from ${TEST_SECONDS} seconds.`
        );


        startTestCountdown();

    } else {

        console.log(
            "REAL MODE ON"
        );


        console.log(
            "Waiting for India midnight (IST)..."
        );


        startRealCountdown();

    }

}


/* =====================================================
   SHOW GIFT SCREEN
===================================================== */

function showGiftScreen() {

    giftSection.classList.add(
        "show"
    );


    giftSection.setAttribute(
        "aria-hidden",
        "false"
    );

}


/* =====================================================
   SHOW POLAROID
===================================================== */

function showPolaroid(giftNumber) {

    let imageSrc = "";

    let captionText = "";


    /* =================================================
       GIFT 1
    ================================================= */

    if (giftNumber === 1) {

        imageSrc =
            "1.png";


        captionText =
            "Meet-up of long distance friends 🤣";


        nextGiftBtn.textContent =
            "2nd Gift 🎁";


        nextGiftBtn.style.display =
            "block";

    }


    /* =================================================
       GIFT 2
    ================================================= */

    else if (giftNumber === 2) {

        imageSrc =
            "2.png";


        captionText =
            "Nepal poch gye dono mia biwi 😁";


        nextGiftBtn.textContent =
            "3rd Gift 💝";


        nextGiftBtn.style.display =
            "block";

    }


    /* =================================================
       GIFT 3
    ================================================= */

    else if (giftNumber === 3) {

        imageSrc =
            "3.png";


        captionText =
            "Guu khalo 💩";


        nextGiftBtn.textContent =
            "4th Gift 💟";


        nextGiftBtn.style.display =
            "block";

    }


    /* =================================================
       GIFT 4
    ================================================= */

    else if (giftNumber === 4) {

        imageSrc =
            "4.png";


        captionText =
            "Ladte ladte ek din hum bhi yah tak poch jayenga 🫂";


        /*
           Gift 4 ke baad next button nahi.
        */

        nextGiftBtn.style.display =
            "none";

    }


    /*
       Polaroid image
    */

    polaroidImage.src =
        imageSrc;


    /*
       Polaroid caption
    */

    polaroidCaption.textContent =
        captionText;


    /*
       Gift screen hide
    */

    giftSection.classList.remove(
        "show"
    );


    giftSection.setAttribute(
        "aria-hidden",
        "true"
    );


    /*
       Polaroid show
    */

    polaroidSection.classList.add(
        "show"
    );


    polaroidSection.setAttribute(
        "aria-hidden",
        "false"
    );


    /*
       =================================================
       IMPORTANT PHOTO BOOTH TRIGGER
       =================================================

       Photo Booth ONLY Gift 4 ke baad chalega.

       Page load par nahi.
       Gift 1 par nahi.
       Gift 2 par nahi.
       Gift 3 par nahi.

       Gift 4 Polaroid:
       ↓
       1.5 second wait
       ↓
       Photo Booth
    */

    if (giftNumber === 4) {

        setTimeout(() => {

            startPhotoBooth();

        }, 2000);

    }
}


/* =====================================================
   GIFT 1 CLICK
===================================================== */

gift1.addEventListener(
    "click",
    () => {

        gift1.classList.add(
            "opening"
        );


        setTimeout(() => {

            showPolaroid(1);


            gift1.classList.remove(
                "opening"
            );

        }, 650);

    }
);


/* =====================================================
   NEXT GIFT BUTTONS
===================================================== */

let currentGift = 1;


nextGiftBtn.addEventListener(
    "click",
    () => {

        if (currentGift === 1) {

            currentGift = 2;

            showPolaroid(2);

        }


        else if (currentGift === 2) {

            currentGift = 3;

            showPolaroid(3);

        }


        else if (currentGift === 3) {

            currentGift = 4;

            showPolaroid(4);

        }

    }
);


/* =====================================================
   START PHOTO BOOTH
===================================================== */

function startPhotoBooth() {

    if (
        !photoBoothSection ||
        !photoBoothSong
    ) {
        return;
    }

    /*
       Photo Booth sirf ek baar chalega
    */

    if (photoBoothStarted) {
        return;
    }

    photoBoothStarted = true;


    /* =================================================
       IMPORTANT:
       4th POLAROID KO HIDE KARO
       Photo Booth ke baad dobara nahi dikhega.
    ================================================= */

    polaroidSection.classList.remove("show");

    polaroidSection.setAttribute(
        "aria-hidden",
        "true"
    );


    /* =================================================
       PHOTO BOOTH SHOW
    ================================================= */

    photoBoothSection.classList.add("show");

    photoBoothSection.setAttribute(
        "aria-hidden",
        "false"
    );


    /* =================================================
       SONG START
    ================================================= */

    photoBoothSong.currentTime = 0;

    photoBoothSong.play().catch(() => {

        console.log(
            "Photo Booth music could not autoplay."
        );

    });


    /* =================================================
       PHOTO BOOTH = 34 SECONDS
    ================================================= */

    setTimeout(() => {
        photoBoothSong.pause();
        photoBoothSong.currentTime = 0;

        photoBoothSection.classList.remove("show");
        photoBoothSection.setAttribute("aria-hidden", "true");

        birthdayLetterSection.classList.add("show");
        birthdayLetterSection.setAttribute("aria-hidden", "false");

    }, 34000);

}

// function openBirthdayLetter() {
//     if (
//         birthdayEnvelope.classList.contains("open") ||
//         openLetterBtn.disabled
//     ) {
//         return;
//     }

//     birthdayEnvelope.classList.add("open");

//     openLetterBtn.disabled = true;
//     openLetterBtn.setAttribute("aria-expanded", "true");

//     setTimeout(() => {
//         letterEnvelopeScreen.style.display = "none";

//         letterPageScreen.classList.add("show");
//         letterPageScreen.setAttribute("aria-hidden", "false");

//         // document.body.style.overflow = "hidden";

//         const firstParagraph =
//             letterPageScreen.querySelector(".letter-page-to");

//         if (firstParagraph) {
//             firstParagraph.focus?.();
//         }
//     }, 1350);
// }

function openBirthdayLetter() {
    if (
        birthdayEnvelope.classList.contains("open") ||
        openLetterBtn.disabled
    ) {
        return;
    }

    birthdayEnvelope.classList.add("open");

    openLetterBtn.disabled = true;
    openLetterBtn.setAttribute("aria-expanded", "true");

    setTimeout(() => {
        letterEnvelopeScreen.style.display = "none";

        letterPageScreen.classList.add("show");
        letterPageScreen.setAttribute("aria-hidden", "false");

        /* Har baar letter top se open hoga */
        letterPageScreen.scrollTop = 0;
    }, 1350);
}


openLetterBtn.addEventListener("click", openBirthdayLetter);


/* Envelope click se bhi letter khulega */
birthdayEnvelope.addEventListener("click", openBirthdayLetter);


/* Keyboard: Enter / Space se envelope open hoga */
birthdayEnvelope.addEventListener("keydown", event => {
    if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openBirthdayLetter();
    }
});


/* =====================================================
   START WEBSITE
===================================================== */

init();