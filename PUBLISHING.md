GitHub Pages publishing
======================

In the repository's Settings > Pages > Build and deployment, set Source to
GitHub Actions. Push these changes to the default branch. The Publish Blakeworld
workflow builds and deploys only the `_site` output.

While `UNDER_CONSTRUCTION = true` in main.js, every existing HTML address and
the 404 page serves the construction screen with no JavaScript required. The
original pages, guestbook form, JavaScript, and images are excluded from the
deployment. The working files remain intact in the repository.

To reopen the site, set `UNDER_CONSTRUCTION = false` and push the change.

Local build: run `./scripts/build-pages.ps1` in PowerShell. The output directory
must not already exist; it is ignored by Git. The script never modifies source pages.

This controls what GitHub Pages publishes. Files in a public GitHub repository
and previously downloaded copies are still accessible separately.
