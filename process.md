# Development Process & Workflow

This document outlines the typical workflow for making changes to the DJToggle Frontend application.

## Architecture Overview

The application consists of:
- **Frontend**: React + Vite application with LaunchDarkly integration and Strudel audio engine
- **Backend Proxy**: Node.js Express server that fetches flag configurations from LaunchDarkly API
- **Deployment**: Dockerized application running on port 8081

## Standard Development Workflow

### 1. Making Code Changes

When updating the application, changes typically fall into these categories:

#### A. LaunchDarkly Flag Updates
When flags or variants change in LaunchDarkly:

1. **Update `server.js`**:
   - Modify the `relevantFlags` array to whitelist new flag keys
   - Example: `const relevantFlags = ['bassArrangement', 'drumArrangement', 'leadArrangement'];`

2. **Update `src/App.jsx`**:
   - Update the `titles` mapping for display names
   - Update the flag key array in the `forEach` loop
   - Update the pattern lookup to use new flag names

3. **Update `src/audio/patterns.js`**:
   - Add new variant keys matching LaunchDarkly's `value` field
   - Write Strudel pattern code for each variant

#### B. UI/UX Changes
When modifying the interface:

1. **Component Updates**: Edit files in `src/components/`
2. **Styling**: Modify `src/index.css` or component-specific styles
3. **Layout**: Update `src/App.jsx` for structural changes

#### C. Audio Pattern Changes
When updating music patterns:

1. Edit `src/audio/patterns.js`
2. Use Strudel syntax for pattern definitions
3. Ensure variant keys match LaunchDarkly flag values

### 2. Rebuilding the Application

**CRITICAL**: After any code changes, you MUST rebuild the Docker container for changes to take effect.

```bash
# Standard rebuild command
docker build -t djtoggle-frontend-app . && \
docker rm -f djtoggle-frontend-app-1 && \
docker run -d -p 8081:80 --name djtoggle-frontend-app-1 --env-file .env djtoggle-frontend-app
```

This command:
1. Builds a new Docker image with your changes
2. Removes the old container
3. Starts a new container with the updated code

### 3. Verification

After rebuilding:

```bash
# Check container is running
docker ps

# View server logs
docker logs djtoggle-frontend-app-1 --tail 50

# Test API endpoint
curl http://localhost:8081/api/config | jq .

# Access application
open http://localhost:8081
```

### 4. Committing Changes

```bash
# Stage all changes
git add .

# Commit with descriptive message
git commit -m "feat: description of changes"

# Push to remote
git push
```

## Common Tasks

### Adding a New Flag
1. Create flag in LaunchDarkly with variants
2. Update `server.js` relevantFlags array
3. Update `src/App.jsx` titles and key mappings
4. Add patterns to `src/audio/patterns.js`
5. Rebuild container
6. Test in browser

### Debugging Flag Issues
1. Add debug logging to `server.js`:
   ```javascript
   console.log("Available Flags:", response.data.items.map(f => f.key));
   ```
2. Rebuild container
3. Trigger API call: `curl http://localhost:8081/api/config`
4. Check logs: `docker logs djtoggle-frontend-app-1 --tail 50`
5. Remove debug logging after investigation

### Updating Environment Variables
1. Edit `.env` file
2. Rebuild container (environment is loaded at startup)
3. Verify with: `docker logs djtoggle-frontend-app-1 --tail 10`

### Local Strudel Samples
1. Set `VITE_STRUDEL_SAMPLES_URL` in `.env` to your local samples URL
2. Ensure you have a `strudel.json` map file at that location
3. Rebuild container
4. Leave blank to use default CDN samples

## Key Files Reference

| File | Purpose |
|------|---------|
| `server.js` | Backend proxy, flag whitelisting, API transformation |
| `src/App.jsx` | Main React component, flag consumption, pattern orchestration |
| `src/audio/patterns.js` | Strudel pattern definitions for all variants |
| `src/hooks/useStrudel.js` | Strudel audio engine initialization |
| `src/components/` | UI components (TrackColumn, OptionCard, Controls) |
| `.env` | Environment variables (keys, project config) |
| `Dockerfile` | Container build configuration |

## Troubleshooting

### Container Won't Start
- Check logs: `docker logs djtoggle-frontend-app-1`
- Verify `.env` file exists and has required keys
- Check port 8081 isn't already in use

### Changes Not Appearing
- **Did you rebuild the container?** This is the most common issue
- Clear browser cache
- Check Docker image was rebuilt: `docker images | grep djtoggle`

### API Returns Empty
- Verify LaunchDarkly API key in `.env`
- Check flag keys in `server.js` match LaunchDarkly
- Review server logs for API errors

### Audio Not Playing
- Check browser console for Strudel errors
- Verify pattern syntax in `patterns.js`
- Ensure flag values match pattern keys exactly
- Check if samples URL is configured correctly (if using local)

## Development Tips

1. **Always rebuild after code changes** - The container serves a built version of the app
2. **Use descriptive commit messages** - Follow conventional commits format
3. **Test locally before pushing** - Verify changes work in the container
4. **Keep patterns simple** - Start with basic Strudel patterns, then enhance
5. **Match LaunchDarkly exactly** - Flag keys and variant values must match precisely
