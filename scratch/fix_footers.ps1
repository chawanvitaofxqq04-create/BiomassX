$footerHtml = @"
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
"@

$files = Get-ChildItem -Path "*.html"

foreach ($file in $files) {
    try {
        $content = [System.IO.File]::ReadAllText($file.FullName)
        $original = $content
        
        # 1. Remove all footers
        $content = $content -replace '(?s)\s*<!-- Footer -->\s*<footer class="site-footer">.*?</footer>\s*', "`r`n"
        
        # 2. Insert exactly one footer before </body>
        if ($content -match '(?i)</body>') {
            $idx = $content.IndexOf("</body>")
            if ($idx -lt 0) {
                # Fallback to last index if case insensitive indexOf is needed
                $idx = $content.ToLower().IndexOf("</body>")
            }
            if ($idx -ge 0) {
                $content = $content.Substring(0, $idx) + "`r`n" + $footerHtml + "`r`n    " + $content.Substring($idx)
            }
        }
        
        if ($content -ne $original) {
            [System.IO.File]::WriteAllText($file.FullName, $content, [System.Text.Encoding]::UTF8)
            Write-Host "Fixed $($file.Name)"
        }
    } catch {
        Write-Host "Failed $($file.Name): $_"
    }
}
Write-Host "Done fixing footers"
