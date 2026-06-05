# Idea Slot Machine

Local static demo of a 5-slot idea generator (Apps / YouTube modes).

How to run
- Open `/workspaces/Idea-slot-machine-/index.html` in a browser (double-click or serve with a simple static server).

Notes
- Adjust the `1-slot X %` and `2-slot X %` sliders to control how often 1 or 2 slots become absent (✕).
- Mode `Apps` produces short app idea sentences; `YouTube` produces coding/AI challenge prompts.
- AI generation: optionally paste your OpenAI API key into the `API key` field and enable `Use AI`. The demo will call the OpenAI Chat Completions API to produce a single natural sentence based on the spun slots. Keep your key private and use this locally only.
-- This version uses an internal AI module (no external API required). The UI no longer uses slots — it generates a prompt or sentence on a paper-style area.
- Speed: choose `Normal (1 w/s)` to see the text type one word per second, or `Fast` to reveal instantly.
- Click `Generate` to produce a new idea; use `Copy`, `Download`, or `Share` to export.
