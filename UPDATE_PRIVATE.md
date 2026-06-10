# Private Source Repo With Public Updates

Use this setup when you want:

```txt
private repo = app source code
public repo = update downloads only
```

This lets you keep the application code private while still allowing installed apps to download updates without login.

## Repository Setup

Create two repositories.

Private source repo:

```txt
github.com/YOUR_GITHUB_OWNER/YOUR_PRIVATE_APP_REPO
```

This repo contains the real app code.

Public update repo:

```txt
github.com/YOUR_GITHUB_OWNER/YOUR_PUBLIC_UPDATE_REPO
```

This repo is only used for GitHub Releases. It can contain just a `README.md`.

Example:

```txt
Private:
github.com/naserswei/my-private-app

Public:
github.com/naserswei/my-app-updates
```

## Why The Update Repo Should Be Public

Installed apps need to download update files such as:

```txt
latest.yml
latest-mac.yml
*.exe
*.dmg
*.zip
*.blockmap
```

If the update repo is private, normal users cannot download those files without GitHub authentication.

For the easiest updater experience, keep only the source code private and make the update/releases repo public.

## Configure electron-builder

In the private source repo, update `electron-builder.yml`.

The `publish` section should point to the public update repo:

```yaml
publish:
  provider: github
  owner: YOUR_GITHUB_OWNER
  repo: YOUR_PUBLIC_UPDATE_REPO
```

Example:

```yaml
publish:
  provider: github
  owner: naserswei
  repo: my-app-updates
```

Do not point this to the private source repo.

## Create A GitHub Token

The default `GITHUB_TOKEN` can usually publish only to the same repo where the workflow is running.

Because the workflow runs in the private source repo but publishes to the public update repo, create a fine-grained personal access token.

Open:

```txt
GitHub -> Profile picture -> Settings -> Developer settings -> Personal access tokens -> Fine-grained tokens
```

Or go directly to:

```txt
https://github.com/settings/personal-access-tokens/new
```

Create the token with:

```txt
Token name: GH_RELEASE_TOKEN
Resource owner: YOUR_GITHUB_OWNER
Repository access: Only select repositories
Selected repository: YOUR_PUBLIC_UPDATE_REPO
```

Repository permissions:

```txt
Contents: Read and write
Metadata: Read
```

`Metadata: Read` is normally included automatically.

Copy the token immediately. GitHub shows it only once.

## Save The Token In The Private Repo

Open the private source repo on GitHub.

Go to:

```txt
Settings -> Secrets and variables -> Actions -> New repository secret
```

Create this secret:

```txt
Name: GH_RELEASE_TOKEN
Value: paste the token
```

Do not commit the token into code.

## Configure GitHub Actions

In the private source repo, the release workflow should publish to the public update repo.

The important part is:

```yaml
env:
  GH_TOKEN: ${{ secrets.GH_RELEASE_TOKEN }}
  GH_REPO: YOUR_GITHUB_OWNER/YOUR_PUBLIC_UPDATE_REPO
```

Example:

```yaml
env:
  GH_TOKEN: ${{ secrets.GH_RELEASE_TOKEN }}
  GH_REPO: naserswei/my-app-updates
```

If your workflow uses `gh release create` or `gh release upload`, make sure it uses that `GH_REPO` value.

Example publish step:

```yaml
- name: Publish GitHub release
  env:
    GH_TOKEN: ${{ secrets.GH_RELEASE_TOKEN }}
    GH_REPO: naserswei/my-app-updates
  run: |
    tag="${GITHUB_REF_NAME}"
    version="${tag#v}"

    if gh release view "$tag" --repo "$GH_REPO" >/dev/null 2>&1; then
      gh release upload "$tag" release-assets/* --repo "$GH_REPO" --clobber
    else
      gh release create "$tag" release-assets/* --repo "$GH_REPO" --title "$version" --notes "$tag"
    fi
```

## Release Flow

Work normally in the private source repo:

```bash
git add .
git commit -m "Add feature"
git push origin main
```

This does not release an update.

When you are ready to release:

```bash
npm version patch
git push origin main --follow-tags
```

That creates and pushes a tag like:

```txt
v1.0.1
```

The private source repo workflow then:

```txt
builds the app
packages Mac and Windows releases
uploads the files to the public update repo
creates or updates the GitHub Release
```

Installed apps check the public update repo for newer versions.

## What Users See

Users do not need access to the private source repo.

They only need access to public release files in:

```txt
github.com/YOUR_GITHUB_OWNER/YOUR_PUBLIC_UPDATE_REPO/releases
```

Mac users download:

```txt
*.dmg
```

Windows users download:

```txt
*.exe
```

The auto-updater uses:

```txt
latest.yml
latest-mac.yml
*.zip
*.blockmap
```

## Testing

1. Install an older version of the app.
2. Make a small visible change.
3. Run:

```bash
npm version patch
git push origin main --follow-tags
```

4. Wait for the private repo GitHub Action to finish.
5. Open the public update repo releases page.
6. Confirm the new release assets exist.
7. Open the old installed app.
8. The app should detect the newer version and ask to restart after download.

Do not test updater behavior with `npm run dev`; the updater is meant for packaged apps.

## Important Notes

The public update repo will show GitHub's automatic source archives:

```txt
Source code (zip)
Source code (tar.gz)
```

That is fine if the public update repo contains only a README or placeholder files.

Before real users install the app, choose stable values for:

```txt
package.json -> name
electron-builder.yml -> appId
electron-builder.yml -> productName
electron-builder.yml -> win.executableName
```

Changing app identity later can make updates harder because operating systems may treat it as a different app.

For production Mac distribution, add Apple code signing and notarization.

For production Windows distribution, add code signing to reduce security warnings.
