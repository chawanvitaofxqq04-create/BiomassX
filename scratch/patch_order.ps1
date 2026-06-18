$content = [System.IO.File]::ReadAllText("C:\project-programmer\Biomassx\order.html")

$target = @"
                    <div class="form-group" style="grid-column: span 2;">
                        <label>สินค้าชีวมวล</label>
                        <input type="text" id="productSelect" list="productOptions" placeholder="พิมพ์ค้นหา หรือเลือกสินค้าชีวมวล...">
                        <datalist id="productOptions"></datalist>
                    </div>
"@

$replacement = @"
                    <div class="form-group" style="grid-column: span 2; position: relative;">
                        <label>สินค้าชีวมวล</label>
                        <input type="text" id="productInput" placeholder="พิมพ์ค้นหา หรือเลือกสินค้าชีวมวล..." autocomplete="off">
                        <div id="productSuggestions" class="autocomplete-suggestions"></div>
                        <input type="hidden" id="productSelect">
                    </div>
"@

$content = $content.Replace($target, $replacement)

[System.IO.File]::WriteAllText("C:\project-programmer\Biomassx\order.html", $content, [System.Text.Encoding]::UTF8)
Write-Host "Patched order.html"
