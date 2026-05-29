// BiomassX Main JavaScript (Supabase Version)
document.addEventListener('DOMContentLoaded', async () => {
    
    // ==========================================
    // 1. Initialize Supabase
    // ==========================================
    const supabaseUrl = 'https://kvbbiylhxfwqevsvpktj.supabase.co';
    const supabaseKey = 'sb_publishable_fuLd_Gw_8UFr7tVRoi9gpg_J5lL02xx';
    
    // ตรวจสอบว่าโหลด supabase js มาแล้วหรือไม่
    if (typeof supabase === 'undefined') {
        console.error('Supabase is not loaded!');
        return;
    }
    
    const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);
    window.supabaseClient = supabaseClient; // ส่งออกให้สคริปต์อื่นใช้ได้

    // ==========================================
    // 2. Language Select Logic
    // ==========================================
    const langSelect = document.querySelector('.lang-select');
    if (langSelect) {
        langSelect.addEventListener('change', (e) => {
            console.log('Language changed to:', e.target.value);
        });
    }

    // ==========================================
    // 3. Supabase Authentication System
    // ==========================================
    
    // Register Form Logic
    const registerForm = document.getElementById('registerForm');
    const registerSuccess = document.getElementById('registerSuccess');
    const registerError = document.getElementById('registerError');
    const registerSubmitBtn = registerForm ? registerForm.querySelector('button[type="submit"]') : null;
    
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // ป้องกันการกดปุ่มซ้ำ
            if (registerSubmitBtn) registerSubmitBtn.disabled = true;
            if (registerSubmitBtn) registerSubmitBtn.innerText = 'กำลังสมัครสมาชิก...';
            
            const firstname = document.getElementById('firstname').value;
            const lastname = document.getElementById('lastname').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            
            // Validate password match
            if (password !== confirmPassword) {
                registerError.innerText = "รหัสผ่านและการยืนยันรหัสผ่านไม่ตรงกัน";
                registerError.style.display = 'block';
                if (registerSubmitBtn) { registerSubmitBtn.disabled = false; registerSubmitBtn.innerText = 'สมัครสมาชิก'; }
                return;
            }
            
            // Supabase Sign Up
            try {
                const { data, error } = await supabaseClient.auth.signUp({
                    email: email,
                    password: password,
                    options: {
                        data: {
                            firstname: firstname,
                            lastname: lastname
                        }
                    }
                });
                
                if (error) {
                    registerError.innerText = error.message || "เกิดข้อผิดพลาดในการสมัครสมาชิก";
                    registerError.style.display = 'block';
                    if (registerSubmitBtn) { registerSubmitBtn.disabled = false; registerSubmitBtn.innerText = 'สมัครสมาชิก'; }
                } else {
                    // Success
                    registerError.style.display = 'none';
                    
                    // ตรวจสอบว่าต้องยืนยันอีเมลหรือไม่
                    if (data.user && data.user.identities && data.user.identities.length === 0) {
                        registerSuccess.innerText = "อีเมลนี้ถูกใช้งานไปแล้ว หรือมีข้อผิดพลาด";
                        registerSuccess.style.backgroundColor = "var(--alert-red-bg)";
                        registerSuccess.style.color = "var(--alert-red)";
                    } else if (data.session === null) {
                        registerSuccess.innerText = "สมัครสำเร็จ! กรุณาตรวจสอบอีเมลของคุณเพื่อยืนยันตัวตน";
                    } else {
                        registerSuccess.innerText = "สมัครสมาชิกสำเร็จ! กำลังพากลับไปหน้าเข้าสู่ระบบ...";
                        setTimeout(() => {
                            window.location.href = 'login.html';
                        }, 2000);
                    }
                    
                    registerSuccess.style.display = 'block';
                }
            } catch (err) {
                console.error("Sign up error:", err);
                registerError.innerText = "เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองใหม่อีกครั้ง";
                registerError.style.display = 'block';
                if (registerSubmitBtn) { registerSubmitBtn.disabled = false; registerSubmitBtn.innerText = 'สมัครสมาชิก'; }
            }
        });
    }

    // Login Form Logic
    const loginForm = document.getElementById('loginForm');
    const loginError = document.getElementById('loginError');
    const loginSubmitBtn = loginForm ? loginForm.querySelector('button[type="submit"]') : null;
    
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // ป้องกันการกดซ้ำ
            if (loginSubmitBtn) loginSubmitBtn.disabled = true;
            if (loginSubmitBtn) loginSubmitBtn.innerText = 'กำลังเข้าสู่ระบบ...';
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            // Supabase Sign In
            try {
                const { data, error } = await supabaseClient.auth.signInWithPassword({
                    email: email,
                    password: password,
                });
                
                if (error) {
                    // Fail
                    loginError.innerText = error.message === 'Invalid login credentials' ? 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' : error.message;
                    loginError.style.display = 'block';
                    
                    if (loginSubmitBtn) { loginSubmitBtn.disabled = false; loginSubmitBtn.innerText = 'เข้าสู่ระบบ'; }
                    
                    setTimeout(() => {
                        loginError.style.display = 'none';
                    }, 3000);
                } else {
                    // Login Success
                    window.location.href = 'dashboard.html';
                }
            } catch (err) {
                console.error("Login error:", err);
                loginError.innerText = "เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองใหม่อีกครั้ง";
                loginError.style.display = 'block';
                if (loginSubmitBtn) { loginSubmitBtn.disabled = false; loginSubmitBtn.innerText = 'เข้าสู่ระบบ'; }
            }
        });
    }

    // Protected Pages Auth Check & Display
    const pathName = window.location.pathname.toLowerCase();
    const isProtectedPage = pathName.includes('dashboard') || pathName.includes('invoices') || pathName.includes('order');
    if (isProtectedPage) {
        try {
            // เช็ค Session ปัจจุบัน
            const { data: { session }, error } = await supabaseClient.auth.getSession();
            
            // If not logged in, redirect to login
            if (!session || error) {
                console.log("No session or error, redirecting to login...");
                window.location.href = 'login.html';
                return; // Stop execution
            }
            
            // Display user info from User Metadata
            const userNameDisplay = document.getElementById('userNameDisplay');
            if (userNameDisplay && session.user) {
                const metadata = session.user.user_metadata || {};
                if (metadata.firstname && metadata.lastname) {
                    userNameDisplay.innerText = metadata.firstname + " " + metadata.lastname;
                } else if (metadata.firstname) {
                    userNameDisplay.innerText = metadata.firstname;
                } else if (session.user.email) {
                    userNameDisplay.innerText = session.user.email; // Fallback to email
                } else {
                    userNameDisplay.innerText = "ผู้ใช้งาน"; // Fallback สุดท้าย
                }
            }
        } catch (err) {
            console.error("Auth check failed (possibly invalid Supabase Key):", err);
            alert("ระบบตรวจสอบสิทธิ์ผิดพลาด (API Key อาจไม่ถูกต้อง) กำลังพากลับไปหน้าเข้าสู่ระบบ");
            window.location.href = 'login.html';
        }
    }

    // Global Logout Function (ทำงานได้ทุกหน้า)
    window.logoutUser = function(e) {
        if (e) e.preventDefault();
        
        // 1. ล้าง LocalStorage & SessionStorage ทันที
        localStorage.clear();
        sessionStorage.clear();

        // 2. สั่งเตะออกจากระบบหลังบ้านแบบ Fire & Forget (ไม่ต้องรอ)
        if (window.supabaseClient) {
            window.supabaseClient.auth.signOut().catch(err => console.error(err));
        }

        // 3. พากลับหน้าแรกทันที ไม่ว่าจะเกิดอะไรขึ้น
        window.location.replace('index.html');
    };

    // ผูกปุ่ม Logout ทั้งหมดในระบบ
    const logoutBtns = document.querySelectorAll('#logoutBtn, .logout-btn');
    logoutBtns.forEach(btn => {
        btn.addEventListener('click', window.logoutUser);
    });

    // Public Pages Auth Check (Index, Insights, Products)
    const isPublicPage = pathName.includes('index') || pathName === '/' || pathName.endsWith('/') || pathName.includes('insights') || pathName.includes('products');
    if (isPublicPage) {
        try {
            const { data: { session } } = await supabaseClient.auth.getSession();
            if (session) {
                // ถ้าล็อกอินอยู่แล้ว เปลี่ยนปุ่ม "เข้าสู่ระบบ" เป็น "ไปหน้าแดชบอร์ด"
                const loginBtn = document.querySelector('a[href="login.html"].btn-outline') || document.querySelector('a[href="dashboard.html"].btn-outline');
                if (loginBtn && loginBtn.innerText.includes('เข้าสู่ระบบ')) {
                    loginBtn.innerText = 'ไปหน้าแดชบอร์ด';
                    loginBtn.href = 'dashboard.html';
                }
            }
        } catch (err) {
            console.error("Home page auth check failed:", err);
        }
    }
});

// ==========================================
// Global Utilities
// ==========================================
window.sanitizeHTML = function(str) {
    if (typeof str !== 'string') return str;
    return str.replace(/[&<>"']/g, function(m) {
        return {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        }[m];
    });
};
