
# JSONick

*(Relaxed) JSON for command line parameters as well as data inputs and outputs. Some say it's icky, and I'm
cool with that.*

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [JSONick](#jsonick)
- [PRELIMINARY DRAFT, NO DETAIL OF THIS WILL REMAIN UNCHANGED](#preliminary-draft-no-detail-of-this-will-remain-unchanged)
  - [Tools](#tools)
    - [CLI Arguments as JSON List Literal](#cli-arguments-as-json-list-literal)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->


# JSONick


# PRELIMINARY DRAFT, NO DETAIL OF THIS WILL REMAIN UNCHANGED

> # ??? paramize
>
> A small, portable specification (plus reference implementations in C and JavaScript) for merging
> command-line flags, positional JSON arguments, and piped stdin JSON into a single, canonical JSON object —
> so that tools which speak JSON in and JSON out don't each have to reinvent argument handling.
>
> ## Specification
>
> * input sources: a tool built on `paramize` accepts up to three kinds of input — JSON piped via stdin, zero
>   or more positional JSON arguments, and zero or more named CLI flags.
> * precedence: stdin JSON is the baseline, positional JSON arguments are merged on top of it left to right,
>   and named CLI flags are merged last and always win.
> * merge depth: merging is shallow at the top level only; a key present in a later source fully replaces the
>   value from an earlier source, including whole arrays and whole nested objects — there is no recursive/deep
>   merge.
> * missing stdin: if stdin is empty, closed, or not piped, it is treated as `{}` rather than as an error.
> * malformed JSON: any malformed JSON from stdin or from a positional argument is a hard error, written to
>   stderr, causing a non-zero exit code — `paramize` never guesses or repairs broken JSON.
> * named parameter: starts with `-` or `--` followed by the full name; `-` and `--` are treated identically
>   and carry no semantic difference.
> * named parameter with implicit value: naming a parameter with no attached value sets it to boolean `true`,
>   e.g. `cmd -foo` and `cmd --foo` both yield `{"foo":true}`.
> * named parameter with explicit value: a value can be attached with `=` or `:` and *no* intervening
>   whitespace, e.g. `cmd --foo=true`, `cmd -foo:true`.
> * value casting: an explicit value is cast to JSON types where unambiguous — `true`/`false` become Boolean,
>   a string matching a JSON number literal becomes Number, `null` becomes JSON null — and falls back to a
>   plain string otherwise.
> * forcing a string: a value can be forced to remain a string even if it looks like another type by wrapping
>   it in single quotes shielded from the shell, e.g. `--id:'"true"'`.
> * repeated flags: if the same flag name is given more than once, the last occurrence wins; earlier
>   occurrences are discarded silently.
> * negative-number disambiguation: a bare token consisting of `-` followed immediately by digits (e.g. `-5`)
>   is treated as a value, not as a flag name, so it is only ever consumed as the value of a preceding flag or
>   rejected as a stray positional token.
> * positional tokens: any CLI argument that is not a recognized flag and not valid JSON is a hard error —
>   `paramize` does not accept bare positional strings as implicit data.
> * control namespace: a single reserved top-level key, `$`, carries tool-control metadata (e.g. `replace`,
>   `pretty`) as its own JSON object, kept separate from payload data.
> * control namespace defaults: if no source sets `$`, the merged output has no `$` key or an empty `{}`,
>   depending on the consuming tool's own default handling — `paramize` itself does not invent control values.
> * control namespace merge: `$` is merged the same way as any other top-level key across sources — shallow,
>   later-source-wins — so a later source can override individual control flags without needing to restate the
>   whole `$` object.
> * escaping a literal `$` field: payload data that legitimately needs a top-level key literally named `$`
>   must be written as `$$` in JSON input; `paramize` unescapes `$$` back to `$` on output and never treats it
>   as the control namespace.
> * named CLI flags and control namespace: a bare `--replace=true` on the CLI is sugar for
>   `{"$":{"replace":true}}` and is merged into the `$` object, not into the payload root.
> * output: `paramize` (the CLI binary) writes exactly one JSON object to stdout and nothing else, so its
>   output is always safe to pipe into another JSON-speaking tool.
> * output formatting: output is compact (no insignificant whitespace) by default; pretty-printing is opt-in
>   via the control flag `$.pretty` (i.e. `--pretty` on the CLI).
> * exit codes: `0` on successful merge and emit, non-zero on any parse error, with a human-readable message
>   on stderr — never on stdout.
> * determinism: given the same stdin, positional arguments, and flags in the same order, `paramize` always
>   produces byte-identical output.
>
> ## Components
>
> * `libparamize` (C): a small C99 static/shared library exposing a single entry point that performs the merge
>   and returns a malloc'd, NUL-terminated JSON string owned by the caller.
> * `paramize` (CLI): a statically linked binary built on `libparamize` that reads argv and stdin and writes
>   the merged JSON object to stdout, usable as a standalone pre-processing pipe stage in front of any other
>   tool.
> * `paramize.js` (JS): a dependency-free reference port implementing the same specification for use in
>   Node.js tools, kept in sync with the C implementation via this document rather than via shared binary
>   bindings.
>
> ## Non-goals (for now)
>
> * array-valued or repeated-list flags (e.g. `--tag=a --tag=b` collecting into an array) are not supported in
>   v1; a repeated flag simply overwrites.
> * deep/recursive merging of nested objects across sources is intentionally out of scope, to keep merge
>   semantics predictable and easy to reason about.

## Tools

### CLI Arguments as JSON List Literal

When in doubt how a given command line with variable substitution and spaces would be presented to command
line tools, use `normalize-cli-arguments/cli-arguments-as-list` to echo a JSON list literal to STDOUT. For
example, this line

```bash
words='a b' ; node ./cli-arguments-as-list replace:4 +upper-case {d:8} '{s:true,+bool,}' words:$words
```

will output this JSON text:

```json
["replace:4","+upper-case","{d:8}","{s:true,+bool,}","words:a b"]%
```

Surprisingly (for me), although the shell variable `words` was defined with a space and is used without
quotes (as in, `words:"$words"`), it still arrives in one chunk.

