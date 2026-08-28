// ==========================================
// Vertex User Bar
// vertex-userbar.js
// ==========================================

(function () {

    // ======================================
    // منع التكرار
    // ======================================

    if (
        document.getElementById(
            "vertex-global-userbar"
        )
    ) {

        return;

    }


    // ======================================
    // التأكد من نظام الدخول
    // ======================================

    if (
        !window.VertexAuth
    ) {

        console.error(
            "VertexAuth غير موجود."
        );


        return;

    }


    if (
        !VertexAuth.isLoggedIn()
    ) {

        return;

    }


    // ======================================
    // المستخدم الحالي
    // ======================================

    const user =
        VertexAuth.getUser();


    if (
        !user
    ) {

        return;

    }


    const userName =
        user.name || "Vertex";


    const userEmail =
        user.email || "";


    const firstLetter =
        userName
            .trim()
            .charAt(0)
            .toUpperCase()
        ||
        "V";


    // ======================================
    // إنشاء العنصر الرئيسي
    // ======================================

    const host =
        document.createElement(
            "div"
        );


    host.id =
        "vertex-global-userbar";


    document.body.appendChild(
        host
    );


    // ======================================
    // Shadow DOM
    //
    // يمنع CSS الخاص بالشريط من التأثير
    // على بقية صفحات Vertex
    // ======================================

    const shadow =
        host.attachShadow({
            mode: "open"
        });


    // ======================================
    // الواجهة
    // ======================================

    shadow.innerHTML = `

        <style>

            * {
                box-sizing: border-box;
            }


            :host {
                position: fixed;

                z-index: 999999;

                left: 18px;

                bottom: 18px;

                font-family:
                    Arial,
                    Tahoma,
                    sans-serif;

                direction: rtl;
            }


            .vertex-bar {
                min-height: 58px;

                padding:
                    7px 8px;

                display: flex;

                align-items: center;

                gap: 8px;

                border:
                    1px solid
                    rgba(255, 255, 255, 0.13);

                border-radius: 17px;

                background:
                    rgba(8, 12, 19, 0.94);

                box-shadow:
                    0 15px 45px
                    rgba(0, 0, 0, 0.45);

                backdrop-filter:
                    blur(18px);

                -webkit-backdrop-filter:
                    blur(18px);
            }


            .user {
                min-width: 145px;

                padding-left: 9px;

                display: flex;

                align-items: center;

                gap: 9px;

                border-left:
                    1px solid
                    rgba(255, 255, 255, 0.08);
            }


            .avatar {
                width: 40px;

                height: 40px;

                flex-shrink: 0;

                display: flex;

                justify-content: center;

                align-items: center;

                border-radius: 50%;

                background:
                    linear-gradient(
                        135deg,
                        #167cf4,
                        #42c7ff
                    );

                color: white;

                box-shadow:
                    0 0 15px
                    rgba(30, 140, 255, 0.3);

                font-size: 16px;

                font-weight: bold;
            }


            .user-text {
                min-width: 0;
            }


            .user-name {
                max-width: 125px;

                overflow: hidden;

                display: block;

                color: white;

                font-size: 12px;

                font-weight: bold;

                text-overflow: ellipsis;

                white-space: nowrap;
            }


            .user-email {
                max-width: 125px;

                margin-top: 3px;

                overflow: hidden;

                display: block;

                color: #758297;

                font-size: 9px;

                text-overflow: ellipsis;

                white-space: nowrap;
            }


            .actions {
                display: flex;

                align-items: center;

                gap: 5px;
            }


            button {
                min-width: 43px;

                height: 43px;

                padding:
                    0 10px;

                display: flex;

                justify-content: center;

                align-items: center;

                gap: 6px;

                border:
                    1px solid
                    rgba(255, 255, 255, 0.08);

                border-radius: 11px;

                background:
                    #121923;

                color:
                    #aeb8c9;

                font-family: inherit;

                font-size: 11px;

                cursor: pointer;

                transition:
                    transform 0.2s,
                    background 0.2s,
                    color 0.2s,
                    border 0.2s;
            }


            button:hover {
                transform:
                    translateY(-2px);

                border-color:
                    rgba(70, 170, 255, 0.25);

                background:
                    #172536;

                color:
                    white;
            }


            .logout-button:hover {
                border-color:
                    rgba(240, 80, 90, 0.25);

                background:
                    rgba(180, 45, 55, 0.2);

                color:
                    #ff9da4;
            }


            .button-icon {
                font-size: 16px;
            }


            /* =================================
               نافذة تأكيد تسجيل الخروج
            ================================== */

            .logout-confirm {
                position: absolute;

                left: 0;

                bottom: 72px;

                width: 285px;

                padding: 18px;

                display: none;

                border:
                    1px solid
                    rgba(255, 255, 255, 0.1);

                border-radius: 16px;

                background:
                    rgba(10, 14, 21, 0.98);

                box-shadow:
                    0 20px 50px
                    rgba(0, 0, 0, 0.5);

                color: white;
            }


            .logout-confirm.visible {
                display: block;

                animation:
                    showConfirm
                    0.2s
                    ease;
            }


            @keyframes showConfirm {

                from {
                    opacity: 0;

                    transform:
                        translateY(8px);
                }

                to {
                    opacity: 1;

                    transform:
                        translateY(0);
                }

            }


            .logout-confirm h3 {
                margin:
                    0 0 8px;

                font-size: 16px;
            }


            .logout-confirm p {
                margin:
                    0 0 15px;

                color:
                    #8995a8;

                font-size: 11px;

                line-height: 1.7;
            }


            .confirm-actions {
                display: grid;

                grid-template-columns:
                    1fr 1fr;

                gap: 7px;
            }


            .confirm-actions button {
                width: 100%;
            }


            .confirm-logout {
                border-color:
                    rgba(230, 70, 80, 0.18);

                background:
                    #a8323d;

                color: white;
            }


            .confirm-logout:hover {
                background:
                    #c7404b;

                color: white;
            }


            /* =================================
               Mobile
            ================================== */

            @media (
                max-width: 650px
            ) {

                :host {
                    left: 10px;

                    bottom: 10px;
                }


                .vertex-bar {
                    padding:
                        6px;
                }


                .user {
                    min-width: auto;

                    padding-left: 6px;
                }


                .user-text {
                    display: none;
                }


                button {
                    width: 40px;

                    min-width: 40px;

                    padding: 0;
                }


                .button-text {
                    display: none;
                }


                .logout-confirm {
                    width:
                        min(
                            280px,
                            calc(100vw - 20px)
                        );

                    left: 0;
                }

            }

        </style>


        <div class="vertex-wrapper">


            <!-- =================================
                 تأكيد تسجيل الخروج
            ================================== -->

            <div
                id="logoutConfirm"
                class="logout-confirm"
            >

                <h3>
                    🚪 تسجيل الخروج؟
                </h3>

                <p>
                    سيتم إنهاء جلسة Vertex الحالية
                    والعودة إلى صفحة تسجيل الدخول.
                </p>


                <div class="confirm-actions">

                    <button
                        id="cancelLogout"
                    >
                        إلغاء
                    </button>


                    <button
                        id="confirmLogout"
                        class="confirm-logout"
                    >
                        خروج
                    </button>

                </div>

            </div>



            <!-- =================================
                 الشريط
            ================================== -->

            <div class="vertex-bar">


                <div class="user">

                    <div class="avatar">
                        ${escapeHTML(firstLetter)}
                    </div>


                    <div class="user-text">

                        <span class="user-name">
                            ${escapeHTML(userName)}
                        </span>

                        <span class="user-email">
                            ${escapeHTML(userEmail)}
                        </span>

                    </div>

                </div>



                <div class="actions">


                    <button
                        id="dashboardButton"
                        title="Dashboard"
                    >

                        <span class="button-icon">
                            📊
                        </span>

                        <span class="button-text">
                            Dashboard
                        </span>

                    </button>


                    <button
                        id="projectsButton"
                        title="المشاريع"
                    >

                        <span class="button-icon">
                            🚀
                        </span>

                        <span class="button-text">
                            المشاريع
                        </span>

                    </button>


                    <button
                        id="logoutButton"
                        class="logout-button"
                        title="تسجيل الخروج"
                    >

                        <span class="button-icon">
                            🚪
                        </span>

                        <span class="button-text">
                            خروج
                        </span>

                    </button>


                </div>

            </div>

        </div>

    `;


    // ======================================
    // العناصر
    // ======================================

    const dashboardButton =
        shadow.getElementById(
            "dashboardButton"
        );


    const projectsButton =
        shadow.getElementById(
            "projectsButton"
        );


    const logoutButton =
        shadow.getElementById(
            "logoutButton"
        );


    const logoutConfirm =
        shadow.getElementById(
            "logoutConfirm"
        );


    const cancelLogout =
        shadow.getElementById(
            "cancelLogout"
        );


    const confirmLogout =
        shadow.getElementById(
            "confirmLogout"
        );


    // ======================================
    // Dashboard
    // ======================================

    dashboardButton.addEventListener(

        "click",

        function () {

            window.location.href =
                "dashboard.html";

        }

    );


    // ======================================
    // Projects
    // ======================================

    projectsButton.addEventListener(

        "click",

        function () {

            window.location.href =
                "projects.html";

        }

    );


    // ======================================
    // فتح نافذة الخروج
    // ======================================

    logoutButton.addEventListener(

        "click",

        function () {

            logoutConfirm.classList.toggle(
                "visible"
            );

        }

    );


    // ======================================
    // إلغاء
    // ======================================

    cancelLogout.addEventListener(

        "click",

        function () {

            logoutConfirm.classList.remove(
                "visible"
            );

        }

    );


    // ======================================
    // تسجيل الخروج
    // ======================================

    confirmLogout.addEventListener(

        "click",

        function () {

            VertexAuth.logout();

        }

    );


    // ======================================
    // Escape
    // ======================================

    document.addEventListener(

        "keydown",

        function (
            event
        ) {

            if (
                event.key ===
                "Escape"
            ) {

                logoutConfirm.classList.remove(
                    "visible"
                );

            }

        }

    );


    // ======================================
    // دالة حماية النص
    // ======================================

    function escapeHTML(
        value
    ) {

        return String(
            value
        )
            .replaceAll(
                "&",
                "&amp;"
            )
            .replaceAll(
                "<",
                "&lt;"
            )
            .replaceAll(
                ">",
                "&gt;"
            )
            .replaceAll(
                '"',
                "&quot;"
            )
            .replaceAll(
                "'",
                "&#039;"
            );

    }

})();