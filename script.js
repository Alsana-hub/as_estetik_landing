// ========================================
// BOT LINKS
// ========================================

const TELEGRAM_BOT_URL =
    "https://t.me/as_estetik_massage_bot";

const MAX_BOT_URL =
    "https://max.ru/id231223161128_1_bot";

const REF_STORAGE_KEY =
    "as_estetik_referral";


// ========================================
// REFERRAL HELPERS
// ========================================

function normalizeReferral(code) {
    return code
        .trim()
        .toUpperCase();
}


function getSavedReferral() {
    return localStorage.getItem(
        REF_STORAGE_KEY
    );
}


function saveReferral(code) {

    const normalized =
        normalizeReferral(code);

    if (!normalized) {
        return null;
    }

    localStorage.setItem(
        REF_STORAGE_KEY,
        normalized
    );

    return normalized;
}


function canUseAsBotPayload(code) {
    return /^[A-Z0-9_-]+$/.test(code);
}


// ========================================
// REFERRAL FROM URL
// ========================================

const urlParams =
    new URLSearchParams(
        window.location.search
    );

const referralFromUrl =
    urlParams.get("ref");


if (referralFromUrl) {

    saveReferral(
        referralFromUrl
    );

}


// ========================================
// BUILD TELEGRAM LINK
// ========================================

function getTelegramBotUrl() {

    const referral =
        getSavedReferral();

    if (
        referral &&
        canUseAsBotPayload(referral)
    ) {

        return (
            TELEGRAM_BOT_URL +
            "?start=" +
            encodeURIComponent(
                "ref_" + referral
            )
        );

    }

    return TELEGRAM_BOT_URL;
}


// ========================================
// BUILD MAX LINK
// ========================================

function getMaxBotUrl() {

    const referral =
        getSavedReferral();

    if (
        referral &&
        canUseAsBotPayload(referral)
    ) {

        return (
            MAX_BOT_URL +
            "?start=" +
            encodeURIComponent(
                "ref_" + referral
            )
        );

    }

    return MAX_BOT_URL;
}


// ========================================
// UPDATE BOT LINKS
// ========================================

function updateBotLinks() {

    const telegramLinks =
        document.querySelectorAll(
            'a[href*="t.me/as_estetik_massage_bot"]'
        );


    telegramLinks.forEach(
        (link) => {

            link.href =
                getTelegramBotUrl();

            link.target =
                "_blank";

            link.rel =
                "noopener";

        }
    );


    const maxLinkIds = [
        "maxBotLink",
        "maxChooseLink",
        "maxFinalLink",
        "maxFooterLink"
    ];


    maxLinkIds.forEach(
        (id) => {

            const link =
                document.getElementById(
                    id
                );

            if (!link) {
                return;
            }


            link.href =
                getMaxBotUrl();

            link.target =
                "_blank";

            link.rel =
                "noopener";

        }
    );

}


// ========================================
// PROMO FORM
// ========================================

const promoForm =
    document.getElementById(
        "promoForm"
    );

const promoInput =
    document.getElementById(
        "promoCode"
    );

const promoResult =
    document.getElementById(
        "promoResult"
    );


const savedReferral =
    getSavedReferral();


if (
    savedReferral &&
    promoInput
) {

    promoInput.value =
        savedReferral;


    if (promoResult) {

        promoResult.textContent =
            `Код рекомендации ${savedReferral} сохранён. ` +
            `Скидка 10% будет учтена при первом визите.`;

    }

}


if (promoForm) {

    promoForm.addEventListener(
        "submit",
        (event) => {

            event.preventDefault();


            const rawCode =
                promoInput.value;


            if (!rawCode.trim()) {

                promoResult.textContent =
                    "Введите код рекомендации.";

                return;
            }


            const promoCode =
                saveReferral(
                    rawCode
                );


            promoInput.value =
                promoCode;


            if (
                canUseAsBotPayload(
                    promoCode
                )
            ) {

                promoResult.textContent =
                    `Код рекомендации ${promoCode} сохранён. ` +
                    `Вы получите 10% скидку на первое посещение.`;

            } else {

                promoResult.textContent =
                    `Код ${promoCode} сохранён.`;

            }


            updateBotLinks();

        }
    );

}


// ========================================
// DIKIDI REFERRAL MODAL
// ========================================

function createDikidiReferralModal() {

    if (
        document.getElementById(
            "dikidiReferralModal"
        )
    ) {
        return;
    }


    const style =
        document.createElement(
            "style"
        );


    style.textContent = `
        .dikidi-referral-overlay {
            position: fixed;
            inset: 0;
            z-index: 99999;
            display: none;
            align-items: center;
            justify-content: center;
            padding: 20px;
            background: rgba(29, 24, 20, 0.55);
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
        }

        .dikidi-referral-overlay.is-open {
            display: flex;
        }

        .dikidi-referral-modal {
            position: relative;
            width: min(100%, 470px);
            padding: 34px 28px 28px;
            border: 1px solid rgba(137, 103, 70, 0.20);
            border-radius: 28px;
            background:
                linear-gradient(
                    145deg,
                    #fffdf9 0%,
                    #f7f0e7 100%
                );
            box-shadow:
                0 24px 70px rgba(45, 35, 25, 0.25);
            text-align: center;
        }

        .dikidi-referral-close {
            position: absolute;
            top: 14px;
            right: 16px;
            width: 36px;
            height: 36px;
            border: 0;
            border-radius: 50%;
            background: rgba(80, 61, 45, 0.07);
            color: #4a4038;
            font-size: 22px;
            line-height: 1;
            cursor: pointer;
        }

        .dikidi-referral-icon {
            margin-bottom: 8px;
            font-size: 36px;
        }

        .dikidi-referral-title {
            margin: 0 0 12px;
            color: #332b25;
            font-family: Georgia, serif;
            font-size: 28px;
            line-height: 1.2;
        }

        .dikidi-referral-text {
            margin: 0;
            color: #62564d;
            font-size: 16px;
            line-height: 1.55;
        }

        .dikidi-referral-code-label {
            margin-top: 22px;
            color: #807166;
            font-size: 13px;
            text-transform: uppercase;
            letter-spacing: 0.08em;
        }

        .dikidi-referral-code {
            margin: 8px 0 10px;
            padding: 15px 18px;
            border: 1px dashed rgba(151, 112, 73, 0.55);
            border-radius: 16px;
            background: #fff;
            color: #372b22;
            font-size: 24px;
            font-weight: 700;
            letter-spacing: 0.08em;
            word-break: break-word;
        }

        .dikidi-referral-warning {
            margin: 16px 0 22px;
            padding: 16px 18px;
            border: 2px solid rgba(145, 91, 50, 0.28);
            border-radius: 16px;
            background: rgba(151, 112, 73, 0.08);
            color: #493a2f;
            font-size: 15px;
            line-height: 1.55;
            text-align: left;
        }

        .dikidi-referral-warning strong {
            color: #2f241c;
            font-weight: 800;
        }

        .dikidi-referral-actions {
            display: grid;
            gap: 10px;
        }

        .dikidi-referral-button {
            display: flex;
            min-height: 52px;
            align-items: center;
            justify-content: center;
            width: 100%;
            padding: 12px 20px;
            border-radius: 16px;
            font: inherit;
            font-weight: 600;
            cursor: pointer;
            transition:
                transform 0.15s ease,
                opacity 0.15s ease;
        }

        .dikidi-referral-button:hover {
            transform: translateY(-1px);
        }

        .dikidi-referral-copy {
            border: 1px solid rgba(133, 98, 65, 0.28);
            background: transparent;
            color: #54473d;
        }

        .dikidi-referral-go {
            border: 0;
            background:
                linear-gradient(
                    135deg,
                    #7f634b,
                    #a47d59
                );
            color: #ffffff;
        }

        .dikidi-copy-status {
            min-height: 20px;
            margin-top: 10px;
            color: #6c5b4f;
            font-size: 13px;
        }

        @media (max-width: 520px) {

            .dikidi-referral-modal {
                padding:
                    30px
                    20px
                    22px;
                border-radius: 24px;
            }

            .dikidi-referral-title {
                font-size: 24px;
            }

            .dikidi-referral-code {
                font-size: 21px;
            }

            .dikidi-referral-warning {
                font-size: 14px;
            }

        }
    `;


    document.head.appendChild(
        style
    );


    const overlay =
        document.createElement(
            "div"
        );


    overlay.id =
        "dikidiReferralModal";

    overlay.className =
        "dikidi-referral-overlay";


    overlay.innerHTML = `
        <div
            class="dikidi-referral-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="dikidiReferralTitle"
        >
            <button
                type="button"
                class="dikidi-referral-close"
                id="dikidiReferralClose"
                aria-label="Закрыть"
            >
                ×
            </button>

            <div
                class="dikidi-referral-icon"
            >
                🎁
            </div>

            <h2
                class="dikidi-referral-title"
                id="dikidiReferralTitle"
            >
                Ваша скидка 10%
            </h2>

            <p
                class="dikidi-referral-text"
            >
                Вы пришли по рекомендации.
                На первое посещение для вас
                действует скидка 10%.
            </p>

            <div
                class="dikidi-referral-code-label"
            >
                Код рекомендации
            </div>

            <div
                class="dikidi-referral-code"
                id="dikidiReferralCode"
            >
            </div>

            <div
                class="dikidi-referral-warning"
            >
                <strong>
                    ВАЖНО: НЕ вводите этот код
                    в поле «Промокод» DIKIDI.
                </strong>

                <br><br>

                <strong>
                    Вставьте код в поле
                    «Комментарий» при записи.
                </strong>

                <br><br>

                Так я увижу, по чьей рекомендации
                вы пришли, и учту скидку 10%
                на первое посещение.
            </div>

            <div
                class="dikidi-referral-actions"
            >
                <button
                    type="button"
                    class="
                        dikidi-referral-button
                        dikidi-referral-copy
                    "
                    id="dikidiReferralCopy"
                >
                    📋 Скопировать код
                </button>

                <button
                    type="button"
                    class="
                        dikidi-referral-button
                        dikidi-referral-go
                    "
                    id="dikidiReferralGo"
                >
                    📅 Перейти в DIKIDI
                </button>
            </div>

            <div
                class="dikidi-copy-status"
                id="dikidiCopyStatus"
            >
            </div>
        </div>
    `;


    document.body.appendChild(
        overlay
    );


    const closeButton =
        document.getElementById(
            "dikidiReferralClose"
        );


    closeButton.addEventListener(
        "click",
        () => {

            closeDikidiReferralModal();

        }
    );


    overlay.addEventListener(
        "click",
        (event) => {

            if (
                event.target === overlay
            ) {

                closeDikidiReferralModal();

            }

        }
    );


    document.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key === "Escape"
            ) {

                closeDikidiReferralModal();

            }

        }
    );

}


// ========================================
// OPEN DIKIDI MODAL
// ========================================

function openDikidiReferralModal(
    referral,
    dikidiUrl
) {

    createDikidiReferralModal();


    const overlay =
        document.getElementById(
            "dikidiReferralModal"
        );

    const codeElement =
        document.getElementById(
            "dikidiReferralCode"
        );

    const copyButton =
        document.getElementById(
            "dikidiReferralCopy"
        );

    const goButton =
        document.getElementById(
            "dikidiReferralGo"
        );

    const copyStatus =
        document.getElementById(
            "dikidiCopyStatus"
        );


    codeElement.textContent =
        referral;


    copyStatus.textContent =
        "";

    copyButton.textContent =
        "📋 Скопировать код";


    copyButton.onclick =
        async () => {

            try {

                await navigator.clipboard.writeText(
                    referral
                );

                copyStatus.textContent =
                    "✓ Код скопирован. Вставьте его в поле «Комментарий».";

                copyButton.textContent =
                    "✓ Код скопирован";

            } catch (error) {

                const temporaryInput =
                    document.createElement(
                        "textarea"
                    );

                temporaryInput.value =
                    referral;

                temporaryInput.style.position =
                    "fixed";

                temporaryInput.style.opacity =
                    "0";

                document.body.appendChild(
                    temporaryInput
                );

                temporaryInput.select();

                document.execCommand(
                    "copy"
                );

                temporaryInput.remove();


                copyStatus.textContent =
                    "✓ Код скопирован. Вставьте его в поле «Комментарий».";

                copyButton.textContent =
                    "✓ Код скопирован";

            }

        };


    goButton.onclick =
        () => {

            window.open(
                dikidiUrl,
                "_blank",
                "noopener"
            );

            closeDikidiReferralModal();

        };


    overlay.classList.add(
        "is-open"
    );


    document.body.style.overflow =
        "hidden";

}


// ========================================
// CLOSE DIKIDI MODAL
// ========================================

function closeDikidiReferralModal() {

    const overlay =
        document.getElementById(
            "dikidiReferralModal"
        );

    if (!overlay) {
        return;
    }


    overlay.classList.remove(
        "is-open"
    );


    document.body.style.overflow =
        "";

}


// ========================================
// DIKIDI LINKS
// ========================================

const dikidiLinks =
    document.querySelectorAll(
        'a[href*="dikidi.ru"]'
    );


dikidiLinks.forEach(
    (link) => {

        link.addEventListener(
            "click",
            (event) => {

                const referral =
                    getSavedReferral();


                if (!referral) {
                    return;
                }


                event.preventDefault();


                const dikidiUrl =
                    link.href;


                openDikidiReferralModal(
                    referral,
                    dikidiUrl
                );

            }
        );

    }
);


// ========================================
// SMOOTH SCROLL
// ========================================

document.querySelectorAll(
    'a[href^="#"]'
).forEach(
    (link) => {

        link.addEventListener(
            "click",
            (event) => {

                const targetId =
                    link.getAttribute(
                        "href"
                    );


                if (
                    !targetId ||
                    targetId === "#"
                ) {
                    return;
                }


                const target =
                    document.querySelector(
                        targetId
                    );


                if (!target) {
                    return;
                }


                event.preventDefault();


                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }
        );

    }
);


// ========================================
// INITIALIZE
// ========================================

updateBotLinks();
createDikidiReferralModal();