# Patch market.html
$marketHtml = [System.IO.File]::ReadAllText("C:\project-programmer\Biomassx\market.html")
$marketHtml = $marketHtml.Replace('<script src="js/main.js?v=2"></script>
    <script src="js/market.js?v=1"></script>', '<script src="js/main.js?v=2"></script>
    <script src="js/products.js?v=11"></script>
    <script src="js/market.js?v=1"></script>')
[System.IO.File]::WriteAllText("C:\project-programmer\Biomassx\market.html", $marketHtml, [System.Text.Encoding]::UTF8)

# Patch insights.html
$insightsHtml = [System.IO.File]::ReadAllText("C:\project-programmer\Biomassx\insights.html")
$insightsHtml = $insightsHtml.Replace('<script src="js/main.js?v=2"></script>
    <script src="js/insights.js?v=4"></script>', '<script src="js/main.js?v=2"></script>
    <script src="js/products.js?v=11"></script>
    <script src="js/insights.js?v=4"></script>')
[System.IO.File]::WriteAllText("C:\project-programmer\Biomassx\insights.html", $insightsHtml, [System.Text.Encoding]::UTF8)

# Patch js/market.js
$marketJs = [System.IO.File]::ReadAllText("C:\project-programmer\Biomassx\js\market.js")
$target = @"
        // สินค้า
        productSelect.innerHTML = '<option value="all">สินค้าทั้งหมด</option>';
        products.forEach(p => productSelect.innerHTML += `<option value="`${p}`">`${p}`</option>`);
"@

$replacement = @"
        // สินค้า
        productSelect.innerHTML = '<option value="all">สินค้าทั้งหมด</option>';
        if (typeof allProducts !== 'undefined') {
            allProducts.forEach(p => productSelect.innerHTML += `<option value="`${p}`">`${p}`</option>`);
        } else {
            products.forEach(p => productSelect.innerHTML += `<option value="`${p}`">`${p}`</option>`);
        }
"@
$marketJs = $marketJs.Replace($target, $replacement)
[System.IO.File]::WriteAllText("C:\project-programmer\Biomassx\js\market.js", $marketJs, [System.Text.Encoding]::UTF8)

Write-Host "Done patching market and insights"
