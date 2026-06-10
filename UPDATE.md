# Auto Update Setup

This template uses `electron-updater`, `electron-builder`, and GitHub Releases.

The release flow is:

```txt
push normal code to main
create a version tag like v1.0.1
GitHub Actions builds Mac and Windows apps
GitHub Actions publishes the release assets
installed apps check GitHub Releases for updates
```

## What To Change After Forking

After forking this template, update the app identity and GitHub release target.

In `package.json`, change:

```json
{
  "name": "template-react-vite-electron",
  "version": "1.0.0",
  "description": "Your app description",
  "author": "Your name or company",
  "homepage": "https://github.com/YOUR_GITHUB_OWNER/YOUR_REPO_NAME"
}
```

In `electron-builder.yml`, change:

```yaml
appId: com.yourname.yourapp
productName: Your App Name

win:
  executableName: your-app-name

publish:
  provider: github
  owner: YOUR_GITHUB_OWNER
  repo: YOUR_REPO_NAME
```

Example for this repository:

```yaml
publish:
  provider: github
  owner: naserswei
  repo: template-react-vite-electron
```

`owner` is only the GitHub username or organization name.
`repo` is only the repository name.

Do not use the full URL here.

```txt
Correct:
owner: naserswei
repo: template-react-vite-electron

Wrong:
owner: https://github.com/naserswei
repo: https://github.com/naserswei/template-react-vite-electron
```

## GitHub Actions Setup

This template includes:

```txt
.github/workflows/release.yml
```

The workflow runs only when a tag like `v1.0.1` is pushed.

It creates:

```txt
Mac release files
Windows release files
GitHub Release assets
```

Make sure GitHub Actions has permission to publish releases:

1. Open the GitHub repository.
2. Go to `Settings`.
3. Go to `Actions` -> `General`.
4. Under `Workflow permissions`, choose `Read and write permissions`.
5. Save.

For easiest updater testing, use a public repository. Private repositories can require extra authentication for update downloads.

## Normal Development

Push normal code whenever you want:

```bash
git add .
git commit -m "Add feature"
git push origin main
```

This does not release an update.

## Create A Release

When you are ready to ship an update:

```bash
npm version patch
git push origin main --follow-tags
```

`npm version patch` changes the version:

```txt
1.0.0 -> 1.0.1
```

It also creates a Git tag:

```txt
v1.0.1
```

`git push origin main --follow-tags` pushes the code and the new version tag.

The tag starts the GitHub Actions release workflow.

For bigger version changes, use:

```bash
npm version minor
npm version major
```

## Expected Release Assets

After the workflow finishes, open:

```txt
GitHub repo -> Releases
```

You should see assets like these.

Mac:

```txt
*.dmg
*mac.zip
latest-mac.yml
*.blockmap
```

Windows:

```txt
*.exe
latest.yml
*.blockmap
```

The `.dmg` is for Mac users to install manually.
The `.zip` and `latest-mac.yml` are needed by the Mac auto-updater.

The `.exe` is for Windows users to install manually.
The `latest.yml` file is needed by the Windows auto-updater.

## How The App Checks For Updates

The updater is wired in the main process:

```txt
src/main/updater.ts
```

The updater only runs in packaged apps:

```txt
npm run dev        -> updater does not run
installed app      -> updater runs
```

When an update is downloaded, the app asks the user to restart.

## Testing Updates

To test the update flow:

1. Install version `1.0.0` of the app.
2. Make a small visible change.
3. Run:

```bash
npm version patch
git push origin main --follow-tags
```

4. Wait for GitHub Actions to finish.
5. Open the old installed app.
6. The app should detect the newer version.
7. After download, it should ask to restart.

Do not test updater behavior with `npm run dev`; it is disabled there.

## Release Notes

The workflow creates a basic GitHub Release.

To add better release notes:

1. Open `GitHub repo -> Releases`.
2. Open the release.
3. Click edit.
4. Add notes such as:

```md
## Changes

- Added a new feature
- Fixed a bug
- Improved updater setup

## Downloads

- Mac: download the `.dmg`
- Windows: download the `.exe`
```

5. Save or publish the release.

## Important Notes

Before real users install the app, choose stable values for:

```txt
package.json -> name
electron-builder.yml -> appId
electron-builder.yml -> productName
electron-builder.yml -> win.executableName
```

Changing these later can make the app behave like a different app on users' machines.

For production Mac distribution, you will eventually need Apple code signing and notarization.

For production Windows distribution, you will eventually want code signing to reduce security warnings.
