# FCC Model Routing Configuration

**Last Updated:** 2026-10-27\
**Applies to:** Phase 1 SDLC agents using Free Claude Code (FCC) as the model gateway

## Overview

The five Phase 1 SDLC agents use Claude Code model aliases (`opus`, `sonnet`) in their frontmatter. When Claude Code runs through FCC, those aliases are resolved by the FCC routing layer rather than directly by Anthropic. This means `model: opus` requests the **Opus tier** as configured in your FCC Admin UI — it does not guarantee a specific Anthropic model version.

## Agent → Model Alias Mapping

| Agent File | `model` field | `effort` field | FCC Tier |
|---|---|---|---|
| `planner.md` | `opus` | `high` | MODEL_OPUS |
| `designer.md` | `opus` | `high` | MODEL_OPUS |
| `developer.md` | `sonnet` | `medium` | MODEL_SONNET |
| `code-reviewer.md` | `opus` | `high` | MODEL_OPUS |
| `tester.md` | `sonnet` | `medium` | MODEL_SONNET |

## Configuring Model Tiers in FCC Admin UI

1. Open the **FCC Admin UI** and navigate to **Model Routing** (or equivalent section)
2. Locate the tier entries: `MODEL_OPUS`, `MODEL_SONNET`, `MODEL_HAIKU`, `MODEL`
3. Set each tier to the provider and model you have access to:
   - `MODEL_OPUS` → e.g., `claude-opus-4` or the highest-capability model available on your subscription
   - `MODEL_SONNET` → e.g., `claude-sonnet-4` or a balanced-performance model
   - `MODEL_HAIKU` → a fast, low-cost model for lightweight tasks
   - `MODEL` → the default fallback when no alias matches

> **Important:** Do not hardcode provider-specific model IDs (e.g., `claude-opus-5-5`) into agent frontmatter unless you have confirmed that FCC passes full model IDs through to the provider unchanged. Using aliases keeps the configuration portable.

## Environment Variable Override

Claude Code respects `CLAUDE_CODE_SUBAGENT_MODEL` to force all subagents onto a single model, overriding their `model` frontmatter field. This is useful for cost-controlled runs:

```bash
# Force all agents to use sonnet regardless of their frontmatter
export CLAUDE_CODE_SUBAGENT_MODEL=sonnet
```

This variable does **not** override the `effort` field.

## Verifying the Actual Model Used

Claude Code does not expose the resolved model in-conversation. To verify which underlying model is being called:

1. **FCC request logs** — Check the FCC Admin UI's request log; each subagent invocation logs the resolved model ID and the tier that was matched
2. **Claude Code debug mode** — Run with `--debug` to see subagent launch details including the model resolved at invocation time
3. **Subagent output inspection** — Some model versions identify themselves in extended thinking or system messages; check the raw transcript in `--debug` output
4. **FCC usage dashboard** — Model-level usage breakdowns show which model ID processed each request

## Compatibility Notes

| Scenario | Behavior |
|---|---|
| FCC not configured | Claude Code falls back to direct Anthropic API; aliases resolve to current Anthropic defaults |
| `MODEL_OPUS` tier not set in FCC | FCC may fall back to `MODEL` or return an error; check FCC docs |
| Alias not recognized by FCC | Request fails or falls back to default; verify FCC alias names match exactly |
| `effort` field on older Claude Code | `effort` requires Claude Code v2.0 or later; ignored on older versions (no error, no effect) |
| FCC subscription doesn't include Opus | FCC routes `MODEL_OPUS` to the highest tier available; verify in FCC Admin UI |

## Changing Model Assignments

To reassign a different tier to an agent, edit the `model` field in the agent's frontmatter:

```yaml
# Example: downgrade tester to haiku for cost savings
model: haiku
effort: medium
```

Any change to model tier should be documented with the rationale. Consider adding an ADR if the change is permanent and affects workflow quality.

## Do Not Modify

- Do not edit FCC global configuration files or credentials from within the project
- Do not commit FCC API keys or access tokens to this repository
- All FCC configuration changes must be made through the FCC Admin UI or FCC's own config management
