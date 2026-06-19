$cssPath = 'css\style.css'
$css = Get-Content -Path $cssPath -Raw

# Replace the 2-column stats-grid with 1-column in the mobile media query
$css = $css -replace 'grid-template-columns: repeat\(2, 1fr\)', 'grid-template-columns: 1fr'

# Add hamburger menu CSS
$hamburgerCss = "
/* Mobile Menu */
.mobile-menu-btn {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px;
  color: var(--primary-green);
}
@media (max-width: 768px) {
  .mobile-menu-btn {
    display: block;
    order: -1;
  }
  .nav-content {
    flex-direction: row;
    justify-content: space-between;
    flex-wrap: wrap;
    align-items: center;
  }
  .logo {
    display: none; /* Hide logo on mobile to match reference */
  }
  .nav-links {
    display: none;
    width: 100%;
    flex-direction: column;
    padding-top: 10px;
    border-top: 1px solid var(--border-color);
    margin-top: 10px;
  }
  .nav-links.show {
    display: flex;
  }
  .nav-actions {
    display: flex;
    flex-direction: row;
    gap: 10px;
  }
}
"

Add-Content -Path $cssPath -Value $hamburgerCss -Encoding UTF8
Set-Content -Path $cssPath -Value $css -Encoding UTF8

# Patch index.html
$indexPath = 'index.html'
$indexHtml = Get-Content -Path $indexPath -Raw

if ($indexHtml -notmatch 'mobile-menu-btn') {
    $indexHtml = $indexHtml -replace '<div class="container nav-content">', '<div class="container nav-content">
            <button class="mobile-menu-btn" onclick="document.querySelector(''.nav-links'').classList.toggle(''show'')"><svg viewBox="0 0 24 24" width="28" height="28" stroke="currentColor" stroke-width="2" fill="none"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg></button>'
    Set-Content -Path $indexPath -Value $indexHtml -Encoding UTF8
}

