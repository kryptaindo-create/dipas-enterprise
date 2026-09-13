$log = Get-Content 'C:\Users\User\.gemini\antigravity-ide\brain\b7434b2a-07c4-4eca-8e7c-fe6dce1ca60a\.system_generated\logs\transcript_full.jsonl'
foreach ($line in $log) {
  if ($line -like '*<script type="text/babel"*') {
    Write-Host $line.Substring(0, 300)
    break
  }
}
