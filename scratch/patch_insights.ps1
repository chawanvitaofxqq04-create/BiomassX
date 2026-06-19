$insightsJs = [System.IO.File]::ReadAllText("C:\project-programmer\Biomassx\js\insights.js")
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
$insightsJs = $insightsJs.Replace($target, $replacement)
[System.IO.File]::WriteAllText("C:\project-programmer\Biomassx\js\insights.js", $insightsJs, [System.Text.Encoding]::UTF8)

Write-Host "Done patching insights.js"
