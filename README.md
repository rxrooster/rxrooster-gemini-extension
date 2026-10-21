# RxRooster for Gemini CLI

This Gemini CLI extension connects Gemini to RxRooster's public, read-only MCP
server. It supports current public anesthesia job search, bounded job detail,
and privacy-thresholded CRNA coverage-area exploration.

## Install

After this repository is public:

```sh
gemini extensions install https://github.com/rxrooster/rxrooster-gemini-extension
```

For local validation before publication:

```sh
gemini extensions install /absolute/path/to/rxrooster-gemini-extension
```

Restart Gemini CLI after installing or updating the extension. Then confirm it
is enabled:

```text
/extensions list
```

## Try it

- Find CRNA jobs in Texas and Arizona.
- Show anesthesiologist jobs in Oregon.
- Tell me more about the first result.
- Where does RxRooster show CRNA coverage in Florida?

## Privacy and limitations

The extension has no credentials and requests no local or cloud permissions.
It connects only to `https://api.rxrooster.com/mcp` and allowlists three
read-only tools:

- `search_anesthesia_jobs`
- `get_anesthesia_job`
- `explore_coverage_areas`

It cannot apply to jobs, post or edit requisitions, contact clinicians, expose
provider identities or contact details, return provider counts, or confirm
exact availability. Coverage-area exploration supports CRNAs in this release;
anesthesiologist coverage-area requests return an explicit unsupported result.

Read the [RxRooster privacy policy](https://rxrooster.com/privacy-policy),
[terms of service](https://rxrooster.com/terms-of-service), and
[AI connector support guide](https://rxrooster.com/support#ai-connector).

## Validate

The package has no runtime dependencies. Validate its manifest and required
files with:

```sh
npm run validate
```

This checks the extension identity, production endpoint, read-only tool
allowlist, and required context file.

## Publish to the Gemini CLI gallery

1. Publish this folder as the root of a public GitHub repository.
2. Add the repository topic `gemini-cli-extension`.
3. Keep `gemini-extension.json` at the absolute repository root.
4. Keep the default branch stable. The Gemini CLI gallery crawler discovers
   tagged repositories automatically and rechecks them daily.

RxRooster is a product of RxRooster, LLC.
