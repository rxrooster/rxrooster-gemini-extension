# RxRooster for Gemini CLI

This Gemini CLI extension connects Gemini to RxRooster's public MCP server. It
supports current public anesthesia job search, bounded job detail, anonymous
public CRNA service coverage, and privacy-safe draft preparation for provider
services and employer requisitions.

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
It connects only to `https://api.rxrooster.com/mcp` and allowlists five
read-only tools:

- `search_anesthesia_jobs`
- `get_anesthesia_job`
- `explore_coverage_areas`
- `prepare_anesthesia_service_draft`
- `prepare_anesthesia_job_draft`

All five tools are read-only. The preparation tools structure a short-lived
handoff but do not create accounts, save records, publish services or jobs, or
contact anyone. Native RxRooster sign-in, verification, review, and an explicit
publish action remain required.

The extension cannot apply to jobs, expose provider identities or contact
details, return provider counts, reveal private rates or personal calendars, or
confirm exact availability. Public CRNA service cards may include
provider-published minimum compensation, engagement type, work type, and
schedule preferences. Anesthesiologist coverage requests return an explicit
unsupported result in this release.
An empty coverage response is inconclusive: it establishes neither a provider
count nor availability and must never be translated into a numeric bound.

Gemini must preserve the exact order returned by job search. Ordinal follow-ups
such as "the first result" use the opaque ID at that position in the most
recent displayed result array by passing its exact `detail_arguments` object;
they never trigger a reordered search or a title/location guess.

For providers, Gemini can collect public work terms and prepare a private
RxRooster service draft. For employers, it can parse a pasted anesthesia job
description, ask for missing publication facts, and prepare a requisition for
native facility verification and review. Neither path exposes PII: provider
drafts reject identity/contact fields, and requisition parsing removes contact
details before returning structured facts.

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
