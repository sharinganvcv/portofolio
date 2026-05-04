$content = Get-Content -Path "c:\visual_code\bahan_uji_coba\index.html" -Raw

$styleStartIdx = $content.IndexOf("<style>")
$styleEndIdx = $content.IndexOf("</style>")

if ($styleStartIdx -ge 0 -and $styleEndIdx -gt $styleStartIdx) {
    $css = $content.Substring($styleStartIdx + 7, $styleEndIdx - ($styleStartIdx + 7))
    Set-Content -Path "c:\visual_code\bahan_uji_coba\style.css" -Value $css.Trim()
}

$scriptStartIdx = $content.IndexOf("<script>")
$scriptEndIdx = $content.IndexOf("</script>")

if ($scriptStartIdx -ge 0 -and $scriptEndIdx -gt $scriptStartIdx) {
    $js = $content.Substring($scriptStartIdx + 8, $scriptEndIdx - ($scriptStartIdx + 8))
    Set-Content -Path "c:\visual_code\bahan_uji_coba\script.js" -Value $js.Trim()
}

$newContent = $content
if ($scriptStartIdx -ge 0 -and $scriptEndIdx -gt $scriptStartIdx) {
    $newContent = $newContent.Substring(0, $scriptStartIdx) + '<script src="script.js"></script>' + $newContent.Substring($scriptEndIdx + 9)
}

if ($styleStartIdx -ge 0 -and $styleEndIdx -gt $styleStartIdx) {
    $newContent = $newContent.Substring(0, $styleStartIdx) + '<link rel="stylesheet" href="style.css">' + $newContent.Substring($styleEndIdx + 8)
}

Set-Content -Path "c:\visual_code\bahan_uji_coba\index.html" -Value $newContent
Write-Host "Files separated successfully."
