$ErrorActionPreference = "Stop"

$source = Split-Path -Parent $PSScriptRoot
$outDir = "C:\Users\ANIKET SHARMA\Documents\Codex\2026-09-01\run\outputs"
$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$zipPath = Join-Path $outDir "jalpaji-react-source-$timestamp.zip"

Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem

$sourceRoot = [System.IO.Path]::GetFullPath($source).TrimEnd([System.IO.Path]::DirectorySeparatorChar) + [System.IO.Path]::DirectorySeparatorChar
$archive = [System.IO.Compression.ZipFile]::Open($zipPath, [System.IO.Compression.ZipArchiveMode]::Create)

try {
  $count = 0
  Get-ChildItem -LiteralPath $source -Recurse -File -Force | ForEach-Object {
    $fullPath = [System.IO.Path]::GetFullPath($_.FullName)
    $relative = $fullPath.Substring($sourceRoot.Length).Replace("\", "/")

    if (
      $relative.StartsWith("node_modules/") -or
      $relative.StartsWith("dist/") -or
      $relative.StartsWith(".git/") -or
      $relative -like ".env*"
    ) {
      return
    }

    [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile(
      $archive,
      $fullPath,
      $relative,
      [System.IO.Compression.CompressionLevel]::Fastest
    ) | Out-Null
    $count += 1
  }
}
finally {
  $archive.Dispose()
}

$item = Get-Item -LiteralPath $zipPath
[pscustomobject]@{
  Zip = $zipPath
  Files = $count
  SizeMB = [math]::Round($item.Length / 1MB, 2)
}
