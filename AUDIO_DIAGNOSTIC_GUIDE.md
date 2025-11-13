# 🔊 Audio System Diagnostic Guide

## Quick Test Access

To test your audio system, visit:
```
http://localhost:3001/#audioTest
```

Or add this to your browser console:
```javascript
window.location.hash = 'audioTest'
```

## Common Issues & Fixes

### 1. **Browser Autoplay Policy** ⚠️
**Problem:** Audio doesn't play automatically
**Solution:** User must interact with the page first (click, tap, etc.)

**Fix in your code:**
- In `Session.tsx`, `SoundscapePlayer.tsx`: Audio only starts after user clicks play button ✅
- Make sure users click the play button before audio starts

### 2. **AudioContext Suspended**
**Problem:** AudioContext state is "suspended"
**Solution:** Resume it with user interaction

```typescript
if (audioContext.state === 'suspended') {
  await audioContext.resume();
}
```

### 3. **External Audio URLs Blocked**
**Problem:** CORS errors when loading audio from external sources
**Solutions:**
- Use audio files from your own server
- Or use CORS-enabled sources (like Mixkit, which you're using)
- Test with: `https://assets.mixkit.co/active_storage/sfx/2393/2393-preview.mp3`

### 4. **Gemini Speech Synthesis**
**Problem:** `generateSpeech()` might not be working
**Check:**
- Gemini API key is set
- API has speech synthesis enabled
- Check browser console for errors

### 5. **Frequency Service Not Playing**
**Problem:** Therapeutic frequencies aren't audible
**Debug:**
- Check system volume
- Check if `frequencyGenerator.play()` is called
- Ensure volume parameter (0.1 - 0.3 is good range)
- Browser tab must not be muted

## Testing Steps

1. **Open Audio Test Page**: Navigate to `http://localhost:3001` then type in URL bar: `#audioTest`

2. **Run Tests in Order**:
   - ✅ Test Web Audio API - Should hear a 440Hz beep
   - ✅ Test Frequency Service - Should hear 432Hz tone  
   - ✅ Test HTML5 Audio - Should hear rain sounds

3. **Check Console**: Look for errors in browser DevTools (F12)

4. **Check Results Panel**: View test output messages

## Quick Fixes to Try Now

### Fix 1: Add User Interaction Check
In `services/frequencyService.ts`, the `FrequencyGenerator` class already handles this, but make sure it's being called after user interaction.

### Fix 2: Add AudioContext Resume
Already in your code at line 48 of `Session.tsx`:
```typescript
if (audioContextRef.current.state === 'suspended') {
    audioContextRef.current.resume();
}
```

### Fix 3: Test Simple Audio First
Try adding this button to your Session component:
```tsx
<button onClick={() => {
  const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2393/2393-preview.mp3');
  audio.play();
}}>
  Test Audio
</button>
```

## Current Status

Your app **SHOULD** work because:
- ✅ Web Audio API is used correctly
- ✅ Audio only plays after user interaction (click play button)
- ✅ AudioContext state is checked and resumed
- ✅ Proper error handling exists

**Most likely issue**: Browser autoplay policy or AudioContext not resumed.

## Next Steps

1. Visit the audio test page: `http://localhost:3001/#audioTest`
2. Click each test button
3. Share the results from the test output panel
4. Check browser console for any error messages

If audio works in the test page but not in the main app, we know the browser supports it and can debug the specific components.
