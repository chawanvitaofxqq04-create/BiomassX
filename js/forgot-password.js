document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('forgotPasswordForm');
    const emailInput = document.getElementById('email');
    const resetBtn = document.getElementById('resetBtn');
    const messageBox = document.getElementById('resetMessage');

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            if (!window.supabaseClient) {
                showMessage('ไม่สามารถเชื่อมต่อระบบได้ กรุณาลองใหม่ภายหลัง', 'error');
                return;
            }

            const email = emailInput.value.trim();
            if (!email) {
                showMessage('กรุณากรอกอีเมล', 'error');
                return;
            }

            // Set loading state
            resetBtn.disabled = true;
            resetBtn.innerHTML = 'กำลังส่งข้อมูล... <span class="loading-spinner"></span>';
            messageBox.style.display = 'none';

            try {
                const { data, error } = await window.supabaseClient.auth.resetPasswordForEmail(email, {
                    redirectTo: window.location.origin + '/login.html', // กลับไปหน้า login หรือหน้าที่ให้เปลี่ยนรหัส
                });

                if (error) {
                    throw error;
                }

                showMessage('ส่งลิงก์ตั้งรหัสผ่านใหม่ไปที่อีเมลของคุณแล้ว กรุณาตรวจสอบในกล่องข้อความ (หรือโฟลเดอร์ขยะ)', 'success');
                form.reset();

            } catch (error) {
                console.error("Reset Password Error:", error);
                
                let errorMsg = 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง';
                if (error.message.includes('not found') || error.status === 404) {
                    errorMsg = 'ไม่พบอีเมลนี้ในระบบ';
                }
                showMessage(errorMsg, 'error');
            } finally {
                // Reset button state
                resetBtn.disabled = false;
                resetBtn.innerHTML = 'ส่งลิงก์ตั้งรหัสผ่านใหม่';
            }
        });
    }

    function showMessage(msg, type) {
        messageBox.innerText = msg;
        messageBox.style.display = 'block';
        if (type === 'success') {
            messageBox.style.backgroundColor = '#ecfdf5';
            messageBox.style.color = '#10b981';
            messageBox.style.border = '1px solid #a7f3d0';
        } else {
            messageBox.style.backgroundColor = '#fef2f2';
            messageBox.style.color = '#ef4444';
            messageBox.style.border = '1px solid #fecaca';
        }
    }
});
