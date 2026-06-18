import os
import re

footer_html = """
    <!-- Footer -->
    <footer class="site-footer">
        <div class="footer-links">
            <a href="about.html">เกี่ยวกับเรา</a>
            <a href="contact.html">ติดต่อเรา</a>
            <a href="guide.html">คู่มือการใช้งาน</a>
            <a href="terms.html">ข้อกำหนดการให้บริการ</a>
            <a href="privacy.html">นโยบายความเป็นส่วนตัว</a>
        </div>
        <div class="footer-copyright">
            &copy; 2026 BiomassX. สงวนลิขสิทธิ์.
        </div>
    </footer>
"""

for file in os.listdir('.'):
    if not file.endswith('.html'):
        continue
    
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()

    original_content = content

    if file == 'analytics.html':
        content = re.sub(r'<!-- Footer -->.*?</div>\s*</div>\s*</div>', footer_html.strip(), content, flags=re.DOTALL)
    elif '<footer class="site-footer">' in content:
        continue
    else:
        # insert before script or body
        match = re.search(r'(<!-- Supabase CDN -->|<script src="|<script type="text/javascript"|</body>)', content)
        if match:
            content = content.replace(match.group(1), footer_html + '\n    ' + match.group(1))

    if content != original_content:
        try:
            with open(file, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Updated {file}")
        except Exception as e:
            print(f"Error updating {file}: {e}")
