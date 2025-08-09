# Setting Chrome as Default Browser in VSCode Dev Containers

## Method 1: VSCode User Settings (Global)

1. Open VSCode Settings (`Cmd+,` on Mac)
2. Search for "browser"
3. Find "Remote: Local Port Host" setting
4. Set it to "allInterfaces"
5. Find "Simple Browser: Focus Lock Indicator" and other browser-related settings

Or add this to your VSCode `settings.json`:

```json
{
  "remote.localPortHost": "allInterfaces",
  "remote.portsAttributes": {
    "5173": {
      "onAutoForward": "openBrowser"
    }
  }
}
```

## Method 2: Set Chrome as System Default (Temporary)

If you want a quick fix just for development:

1. Go to System Preferences → General → Default web browser
2. Select Chrome
3. After development, change it back to Firefox

## Method 3: Manual Control

Instead of auto-forwarding, manually open the browser:
1. Look at the "Ports" tab in VSCode terminal panel
2. Click the globe icon next to port 5173
3. Choose "Open in Browser" and select Chrome

## Method 4: Environment Variable

You can also set the BROWSER environment variable in your terminal:

```bash
export BROWSER="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
```

Add this to your shell profile (`.zshrc` or `.bash_profile`) to make it permanent.
