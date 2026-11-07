param(
    [string]$PagePath = "index.html",
    [string]$PageName = "home"
)

$chromePath = "C:\Program Files\Google\Chrome\Application\chrome.exe"
$outDir = "C:\Projects\MyWork\s_p patel\screenshots\$PageName"
New-Item -ItemType Directory -Force -Path $outDir | Out-Null

$viewports = @(
    @{ Name = "desktop"; Width = 1440; Height = 900 },
    @{ Name = "laptop";  Width = 1366; Height = 768 },
    @{ Name = "tablet";  Width = 768;  Height = 1024 },
    @{ Name = "mobile";  Width = 390;  Height = 844 }
)

$fullUrl = "file:///C:/Projects/MyWork/s_p%20patel/$PagePath"

foreach ($vp in $viewports) {
    $outFile = "$outDir\$($vp.Name).png"
    $argWindow = "--window-size=$($vp.Width),$($vp.Height)"
    $argShot = "--screenshot=$outFile"
    $randProfile = "$env:TEMP\chrome_prof_$(Get-Random)"
    
    & $chromePath --headless=new --no-sandbox --disable-gpu --incognito --disable-extensions --user-data-dir="$randProfile" $argWindow $argShot $fullUrl | Out-Null
    
    Remove-Item $randProfile -Recurse -Force -ErrorAction SilentlyContinue
    
    if (Test-Path $outFile) {
        $size = (Get-Item $outFile).Length
        Write-Host "Captured $PageName $($vp.Name) ($($vp.Width)x$($vp.Height)): $size bytes -> $outFile"
    } else {
        Write-Host "Failed to capture $PageName $($vp.Name)"
    }
}
