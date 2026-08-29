// ==========================================
// Vertex Authentication System
// auth.js
// Supabase Edition
// ==========================================

const VertexAuth = {

    // ======================================
    // الصفحات المحمية
    // ======================================

    protectedPages: [

        "dashboard.html",
        "projects.html",

        "ai.html",
        "robots.html",
        "games.html",
        "web.html",

        "space.html",
        "minecraft.html",

        "planets.html",
        "stars.html",
        "black-holes.html",
        "galaxies.html",
        "moons.html",
        "exploration.html",
        "check.html"

    ],


    // ======================================
    // حالة نظام الدخول
    // ======================================

    _session: null,

    _user: null,

    _ready: false,

    _checking: true,

    _initPromise: null,

    _authSubscription: null,


    // ======================================
    // معرفة الصفحة الحالية
    // ======================================

    getCurrentPage() {

        const path =
            window.location.pathname;


        const page =
            path
                .split("/")
                .pop();


        return (
            page ||
            "index.html"
        );

    },


    // ======================================
    // هل الصفحة محمية؟
    // ======================================

    isProtectedPage(
        page
    ) {

        return this.protectedPages
            .includes(
                page
            );

    },


    // ======================================
    // الحصول على Supabase Client
    // ======================================

    getSupabaseClient() {

        if (
            window.supabaseClient &&
            window.supabaseClient.auth
        ) {

            return window.supabaseClient;

        }


        try {

            if (
                typeof supabaseClient !==
                "undefined"
                &&
                supabaseClient
                &&
                supabaseClient.auth
            ) {

                return supabaseClient;

            }

        }

        catch (
            error
        ) {

            console.log(
                "Supabase client not ready yet"
            );

        }


        return null;

    },


    // ======================================
    // تحميل ملف JavaScript
    // ======================================

    loadScript(
        src
    ) {

        return new Promise(

            function (
                resolve,
                reject
            ) {

                const absoluteURL =
                    new URL(
                        src,
                        window.location.href
                    ).href;


                const existing =
                    Array.from(
                        document.scripts
                    )
                        .find(

                            function (
                                script
                            ) {

                                return (
                                    script.src ===
                                    absoluteURL
                                );

                            }

                        );


                if (
                    existing
                ) {

                    if (
                        src.includes(
                            "@supabase/supabase-js"
                        )
                        &&
                        window.supabase
                    ) {

                        resolve();

                        return;

                    }


                    if (
                        src.includes(
                            "supabase-config.js"
                        )
                        &&
                        VertexAuth
                            .getSupabaseClient()
                    ) {

                        resolve();

                        return;

                    }


                    existing.addEventListener(

                        "load",

                        resolve,

                        {
                            once:
                                true
                        }

                    );


                    existing.addEventListener(

                        "error",

                        function () {

                            reject(

                                new Error(
                                    "تعذر تحميل: " +
                                    src
                                )

                            );

                        },

                        {
                            once:
                                true
                        }

                    );


                    return;

                }


                const script =
                    document.createElement(
                        "script"
                    );


                script.src =
                    src;


                script.async =
                    true;


                script.onload =
                    function () {

                        resolve();

                    };


                script.onerror =
                    function () {

                        reject(

                            new Error(
                                "تعذر تحميل: " +
                                src
                            )

                        );

                    };


                document.head
                    .appendChild(
                        script
                    );

            }

        );

    },


    // ======================================
    // التأكد من جاهزية Supabase
    // ======================================

    async ensureSupabase() {

        if (
            !window.supabase
        ) {

            await this.loadScript(

                "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"

            );

        }


        if (
            !this.getSupabaseClient()
        ) {

            await this.loadScript(
                "supabase-config.js"
            );

        }


        const client =
            this.getSupabaseClient();


        if (
            !client
        ) {

            throw new Error(
                "لم يتم العثور على supabaseClient. تأكد من ملف supabase-config.js"
            );

        }


        return client;

    },


    // ======================================
    // تجهيز بيانات المستخدم
    // ======================================

    normalizeUser(
        user
    ) {

        if (
            !user
        ) {

            return null;

        }


        const metadata =
            user.user_metadata ||
            {};


        const email =
            user.email ||
            "";


        const name =
            metadata.name
            ||
            metadata.full_name
            ||
            metadata.display_name
            ||
            (
                email
                    ?
                email.split("@")[0]
                    :
                "مستخدم Vertex"
            );


        return {

            id:
                user.id,

            name:
                name,

            email:
                email,

            emailConfirmed:
                Boolean(
                    user.email_confirmed_at
                ),

            createdAt:
                user.created_at ||
                null

        };

    },


    // ======================================
    // تطبيق الجلسة
    // ======================================

    applySession(
        session
    ) {

        this._session =
            session ||
            null;


        this._user =
            session &&
            session.user
                ?
            this.normalizeUser(
                session.user
            )
                :
            null;


        this._ready =
            true;


        this._checking =
            false;


        // حذف الجلسة المحلية القديمة

        localStorage.removeItem(
            "vertexSession"
        );


        this.dispatchAuthReady();

    },


    // ======================================
    // هل انتهى التحقق؟
    // ======================================

    isReady() {

        return this._ready;

    },


    // ======================================
    // قراءة الجلسة الحالية
    // ======================================

    getSession() {

        return this._session;

    },


    // ======================================
    // قراءة الجلسة من Supabase
    // ======================================

    async getSessionAsync() {

        const client =
            await this.ensureSupabase();


        const {
            data,
            error
        } =
            await client.auth
                .getSession();


        if (
            error
        ) {

            throw error;

        }


        this.applySession(
            data.session
        );


        return data.session;

    },


    // ======================================
    // هل المستخدم مسجل دخول؟
    // ======================================

    isLoggedIn() {

        /*
            بعض ملفات Vertex القديمة مثل ai.js
            تفحص isLoggedIn فور تحميل الصفحة.

            لذلك أثناء فحص Supabase ننتظر
            حتى ينتهي التحقق الحقيقي.
        */

        if (
            this._checking &&
            !this._ready
        ) {

            return true;

        }


        return Boolean(

            this._session &&
            this._session.user

        );

    },


    // ======================================
    // معلومات المستخدم
    // ======================================

    getUser() {

        return this._user;

    },


    // ======================================
    // اسم المستخدم
    // ======================================

    getUserName() {

        const user =
            this.getUser();


        if (
            !user
        ) {

            return "";

        }


        return user.name;

    },


    // ======================================
    // بريد المستخدم
    // ======================================

    getUserEmail() {

        const user =
            this.getUser();


        if (
            !user
        ) {

            return "";

        }


        return user.email;

    },


    // ======================================
    // حفظ الصفحة للرجوع لها بعد الدخول
    // ======================================

    rememberCurrentPage() {

        const page =
            this.getCurrentPage();


        if (
            !this.isProtectedPage(
                page
            )
        ) {

            return;

        }


        localStorage.setItem(

            "vertexReturnPage",

            page

        );

    },


    // ======================================
    // إظهار الصفحة المحمية
    // ======================================

    showProtectedPage() {

        document
            .documentElement
            .classList
            .add(
                "vertex-authenticated"
            );

    },


    // ======================================
    // إخفاء الصفحة المحمية
    // ======================================

    hideProtectedPage() {

        document
            .documentElement
            .classList
            .remove(
                "vertex-authenticated"
            );

    },


    // ======================================
    // حماية الصفحة
    // ======================================

    async requireAuth() {

        const page =
            this.getCurrentPage();


        // الصفحة غير محمية

        if (
            !this.isProtectedPage(
                page
            )
        ) {

            this.showProtectedPage();

            return true;

        }


        try {

            const client =
                await this.ensureSupabase();


            const {
                data,
                error
            } =
                await client.auth
                    .getSession();


            if (
                error
            ) {

                throw error;

            }


            this.applySession(
                data.session
            );


            // المستخدم مسجل

            if (
                data.session &&
                data.session.user
            ) {

                this.showProtectedPage();

                return true;

            }


            // لا توجد جلسة

            this.rememberCurrentPage();


            window.location.replace(
                "login.html"
            );


            return false;

        }

        catch (
            error
        ) {

            console.error(
                "Vertex Auth Error:",
                error
            );


            this._session =
                null;


            this._user =
                null;


            this._ready =
                true;


            this._checking =
                false;


            this.rememberCurrentPage();


            window.location.replace(
                "login.html"
            );


            return false;

        }

    },


    // ======================================
    // تجديد جلسة Supabase
    // ======================================

    async refreshSession() {

        try {

            const client =
                await this.ensureSupabase();


            const {
                data,
                error
            } =
                await client.auth
                    .refreshSession();


            if (
                error
            ) {

                throw error;

            }


            this.applySession(
                data.session
            );


            return Boolean(
                data.session
            );

        }

        catch (
            error
        ) {

            console.error(
                "Vertex Refresh Error:",
                error
            );


            return false;

        }

    },


    // ======================================
    // تحديث بيانات المستخدم
    // ======================================

    async refreshUser() {

        try {

            const client =
                await this.ensureSupabase();


            const {
                data,
                error
            } =
                await client.auth
                    .getUser();


            if (
                error
            ) {

                throw error;

            }


            if (
                data &&
                data.user
            ) {

                this._user =
                    this.normalizeUser(
                        data.user
                    );


                this.dispatchAuthReady();


                return this._user;

            }


            return null;

        }

        catch (
            error
        ) {

            console.error(
                "Vertex User Error:",
                error
            );


            return null;

        }

    },


    // ======================================
    // تنظيف الجلسة القديمة
    // ======================================

    clearLegacySession() {

        localStorage.removeItem(
            "vertexSession"
        );

    },


    // ======================================
    // تسجيل الخروج الحقيقي
    // ======================================

    async logout() {

        try {

            const client =
                await this.ensureSupabase();


            const {
                error
            } =
                await client.auth
                    .signOut();


            if (
                error
            ) {

                throw error;

            }

        }

        catch (
            error
        ) {

            console.error(
                "Vertex Logout Error:",
                error
            );

        }


        this._session =
            null;


        this._user =
            null;


        this._ready =
            true;


        this._checking =
            false;


        this.clearLegacySession();


        localStorage.removeItem(
            "vertexRequestedSystem"
        );


        localStorage.removeItem(
            "vertexReturnPage"
        );


        window.location.replace(
            "login.html"
        );

    },


    // ======================================
    // مراقبة تغيّر حالة الدخول
    // ======================================

    async listenToAuthChanges() {

        const client =
            await this.ensureSupabase();


        if (
            this._authSubscription
        ) {

            return;

        }


        const {
            data
        } =
            client.auth
                .onAuthStateChange(

                    (
                        event,
                        session
                    ) => {

                        this.applySession(
                            session
                        );


                        const page =
                            this.getCurrentPage();


                        // المستخدم دخل

                        if (
                            session &&
                            session.user
                        ) {

                            this.showProtectedPage();

                            return;

                        }


                        // المستخدم خرج

                        if (
                            this.isProtectedPage(
                                page
                            )
                        ) {

                            this.rememberCurrentPage();


                            window.location.replace(
                                "login.html"
                            );

                        }

                    }

                );


        if (
            data &&
            data.subscription
        ) {

            this._authSubscription =
                data.subscription;

        }

    },


    // ======================================
    // حدث انتهاء التحقق
    // ======================================

    dispatchAuthReady() {

        document.dispatchEvent(

            new CustomEvent(

                "vertex-auth-ready",

                {

                    detail: {

                        loggedIn:
                            Boolean(

                                this._session &&
                                this._session.user

                            ),

                        user:
                            this._user

                    }

                }

            )

        );

    },


    // ======================================
    // تشغيل نظام الحماية
    // ======================================

    async init() {

        if (
            this._initPromise
        ) {

            return this._initPromise;

        }


        this._initPromise =
            (

                async () => {

                    await this.requireAuth();


                    try {

                        await this.listenToAuthChanges();

                    }

                    catch (
                        error
                    ) {

                        console.error(
                            "Vertex Auth Listener Error:",
                            error
                        );

                    }


                    return this.isLoggedIn();

                }

            )();


        return this._initPromise;

    }

};


// ==========================================
// إتاحة VertexAuth لبقية الملفات
// ==========================================

window.VertexAuth =
    VertexAuth;


// ==========================================
// إخفاء الصفحات المحمية أثناء التحقق
// ==========================================

(function () {

    const currentPage =
        VertexAuth
            .getCurrentPage();


    if (
        VertexAuth
            .isProtectedPage(
                currentPage
            )
    ) {

        const style =
            document.createElement(
                "style"
            );


        style.textContent = `

            html:not(.vertex-authenticated) body {

                visibility:
                    hidden !important;

            }

        `;


        document.head
            .appendChild(
                style
            );

    }


    // تشغيل الحماية

    VertexAuth.init();

})();