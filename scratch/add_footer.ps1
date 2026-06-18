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
        
        if ($file.Name -eq "analytics.html") {
            $content = $content -replace '(?s)<!-- Footer -->.*?</div>\s*</div>\s*</div>', $footerHtml.TrimEnd()
        }
        elseif ($content -notmatch '<footer class="site-footer">') {
            if ($content -match '(?s)(<!-- Supabase CDN -->|<script src="|<script type="text/javascript"|</body>)') {
                $match = $matches[1]
                $content = $content -replace [regex]::Escape($match), ($footerHtml + "`r`n    " + $match)
            }
        }
        
        if ($content -ne $original) {
            [System.IO.File]::WriteAllText($file.FullName, $content, [System.Text.Encoding]::UTF8)
            Write-Host "Updated $($file.Name)"
        }
    } catch {
        Write-Host "Failed to update $($file.Name): $_"
    }
}
Write-Host "Done"
