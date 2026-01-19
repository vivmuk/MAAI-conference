$ErrorActionPreference = "Stop"

if (-not $env:VENICE_API_KEY) {
  throw "VENICE_API_KEY is not set. Set it before running this script."
}

$headers = @{
  Authorization = "Bearer $env:VENICE_API_KEY"
  "Content-Type" = "application/json"
}

$assets = Join-Path $PSScriptRoot "assets"
if (-not (Test-Path $assets)) {
  New-Item -ItemType Directory -Path $assets | Out-Null
}

$jobs = @(
  @{ name = "hero-watercolor.webp"; prompt = "Watercolor whimsical collage of a Parisian medical notebook, soft pastel washes, airy composition, no text, bright and friendly"; width = 1024; height = 640 },
  @{ name = "craft-watercolor.webp"; prompt = "Watercolor whimsical illustration of a prompt framework notebook page with soft pastel circles and lines, no text"; width = 1024; height = 640 },
  @{ name = "icon-ideas.webp"; prompt = "Watercolor whimsical icon of a glowing lightbulb with a small medical cross, pastel coral and cream, simple, no text"; width = 512; height = 512 },
  @{ name = "icon-analyze.webp"; prompt = "Watercolor whimsical icon of a magnifying glass over a document, pastel blue and cream, simple, no text"; width = 512; height = 512 },
  @{ name = "icon-generate.webp"; prompt = "Watercolor whimsical icon of a pen writing a note, pastel green and cream, simple, no text"; width = 512; height = 512 },
  @{ name = "icon-feedback.webp"; prompt = "Watercolor whimsical icon of a chat bubble with three dots, pastel gold and cream, simple, no text"; width = 512; height = 512 }
)

foreach ($job in $jobs) {
  $body = @{
    model = "flux-2-max"
    prompt = $job.prompt
    format = "webp"
    width = $job.width
    height = $job.height
    steps = 0
    cfg_scale = 7
    hide_watermark = $true
    safe_mode = $true
    return_binary = $false
  } | ConvertTo-Json

  $response = Invoke-RestMethod -Method Post -Uri "https://api.venice.ai/api/v1/image/generate" -Headers $headers -Body $body
  $target = Join-Path $assets $job.name

  if ($response.images -and $response.images.Count -gt 0) {
    [IO.File]::WriteAllBytes($target, [Convert]::FromBase64String($response.images[0]))
  } elseif ($response.data -and $response.data.Count -gt 0) {
    $data = $response.data[0]
    if ($data.url) {
      Invoke-WebRequest -Uri $data.url -OutFile $target | Out-Null
    } elseif ($data.b64_json) {
      [IO.File]::WriteAllBytes($target, [Convert]::FromBase64String($data.b64_json))
    } else {
      throw "Unexpected response when generating $($job.name)."
    }
  } else {
    throw "Unexpected response when generating $($job.name)."
  }
}

Write-Output "Images generated in $assets"
