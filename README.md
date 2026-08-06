
# JSONick

*(Relaxed) JSON for command line parameters as well as data inputs and outputs. Some say it's icky, and I'm
cool with that.*

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [JSONick](#jsonick)
  - [Motivation](#motivation)
  - [JSONick](#jsonick-1)
  - [Tools](#tools)
    - [CLI Arguments as JSON List Literal](#cli-arguments-as-json-list-literal)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->


# JSONick

## Motivation

* JSONick is a standard and a software to facilitate inter-process communication and command line option
  handling by relying on JSON for inputs and outputs.

* Classical command line tools typically accept named parameters (arguments, options, flags) and mark their
  names by prefixing them with a single or double hyphen. Most CLI tools use a single hyphen for short
  option names and double hyphens for long option names. Some CLI tools use only single hyphens and do not
  provide short options. Rarely, CLI tools use a somewhat twisted Boolean logic for options: for example,
  the Bash `set` command accepts the call `set -u` to enable errors when an unset variable is encountered.
  Now, to *disable* errors from unset variables you'd call `set +u` which is 180 degrees of strange.

* Classical command line tools typically output "mildly structured" text. It may come in any kind of
  formatting, change between releases, change with locale settings. When things like filenames with spaces
  and Unicode characteres outside of US-ASCII (Unicode U+0001..U+007f) are output, all bets are off what
  will happen: octal codes, percent encoding, single quotes, double quotes, no special handling at
  all—anything is possible.

* Both of the observations above make the command line harder to use than necessary. Often one has to write
  custom parsers to digest the output of tools. Assembling properly formatted command lines can also be
  difficult.

* We can not change this (for now).

* Instead, since in reality the shapes of inputs to and outputs from Linux xommand line tools are rather
  loosely characterized by Lore instead of strictly defined by any universally-adopted Spec, one should not
  feel too obliged to follow mediocre[^1] or downright bad[^2] precedent. One obvious candidate for
  formatting structured data is of course <strike>XML</strike> JSON, which is what JSONick is built upon.

> [^1]: e.g. when ImageMagick uses command line argument to implement an organically-grown agglomeration
> that could be called its own 'language'. To quote [Brave Search
> AI](https://search.brave.com/search?q=imagemagick+command+line+arguments%3A+Is+there+a+spec+for+its+language%3F&source=web&summary=1&conversation=09691c29381f0c95243a16cbe542a23379ba):
> "there is no formal specification or standard for the ImageMagick command-line language. ImageMagick uses
> a proprietary command-line interface that evolved significantly between major versions. In ImageMagick 6
> and earlier, the syntax was described as "ill-defined" and "broken," with operators often applied in
> unpredictable orders."

> [^2]: e.g. when different low-level tools employ conflicting standards how to deal with Unicode characters
> outside of US-ASCII; this, of, course also applies to the gazillions of configuration files and
> informational data such as `/etc/mtab` for mounted filesystems whihc may conatin lines like
> `/home/xxx/bin/GhosTTY/Ghostty-1.2.3-x86_64.AppImage /tmp/.mount_Ghostremp15621361697402718996 fuse.dwarfs
> ro,nosuid,nodev,relatime,user_id=1000,group_id=1000 0 0` that uses a mixture of space- and comma-delimited
> syntax (for mount options, technically a nested complex field) with no quotes in sight. One can decry XML
> and even JSON for their relative amounts of wasted bytes but does that concern weigh more heavily than the
> difficulty of parsing sources like `/etc/mtab` where each source is a law unto itself, while ensuring
> nothing breaks when the occasional rogue entry contains a space, a comma or a fancy accented letter?

## JSONick

* JSONick-compliant command line tools whose inputs are text oriented:

  * must accept JSON-formatted data over STDIN as input (the minimum and default behavior)
    * typically, the input will be a standard JSON-formatted object literal
    * in the future we will extend JSON to include convenient shortcuts, see below
  * must accept pipelined data, meaning `cmd {}` is equivalent to `printf '{}' | cmd`
  * may additionally accept data in other formats, typically announced by a command line switch or a file
    name

* JSONick-compliant command line tools whose outputs are text oriented:

  * must output JSON-formatted data to STDOUT. It remains unspecified (for the time being at least) whether
    the output should use compressed (optimized for size) or formatted JSON (optimized for readability);
  * in any event, formatting of outputs (or any JSON, for that matter) should be left to specialized
    formatting tools and not be implemented over and over for each individual command.

* The task of the JSONick toolkit is to present a unified view onto input data and options. These data are
  modelled as an an object with two members, `c` for 'control' (whose attributes are set by command line
  arguments) and `d` for 'data', that is, the 'business data' that the command works on.

* `c` and `d` are called 'modules' of data in the below.

* Modules `c` and `d` are instantiated as attributes on the object returned by the normalization method:
  `{"c":{},"d":{}}`. This is called the Top Level Object (TLO).

* In the current iteration, the setting(s) for the data module must be written as JSON object literals on
  the command line. Future versions may allow positional parameters where alternative settings are allowed
  for convenience. However, both `c` and `d` attributes of the TOL will always remain to objects.

* If JSONick-compliant command line tools provide command line arguments (CLAs), they must follow these
  guidelines:

  * a CLA that starts with a single hypen-minus (`-`, U+002d) is considered a Boolean flag with the value of
    `false`, e.g. `cmd -colorize` sets `{"c":{"colorize": false}}`.

  * a CLA that starts with a single plus sign (`+`, U+002b) is considered a Boolean flag with the value of
    `true`, e.g. `cmd +colorize` sets `{"c":{"colorize": true}}`.

  * a CLA that starts with a letter and has a colon (`:`) followed by arbitrary text is called a 'facet' and
    represents a name / value pair (the name coming before, the value coming after the colon) in module `c`.
    For example, `cmd colorize:always` is mapped to `{"c":{"colorize":"always"}}`.

  * a CLA that starts with `{` and ends with `}` is considered a JSON object literal in module `d`. In the
    current iteration only values that are accepted by JavaScript's `JSON.parse()` method are accepted. In
    later version, convenience notations may become acceptable, such as `{+has_agreed}` for
    `{"has_agreed":true}`.

  * The aim here is to allow the exact same syntax inside and outside of braces so that the syntax for
    modules `c` and `d` becomes identical except for the surrounding braces. The paralleslism will be
    furthered by stipulating that top-level braces in command line argument values will be implicitly
    understood as applying to module `d` unless explicitly marked otherwise with either `c:{}` for the
    control module or `t:{}` for the TLO. At that point, the following equivalences will hold:

    * `cmd '{x:3}'` ≍ `cmd d:'{x:3}'` ≍ `cmd`


<!-- # PRELIMINARY DRAFT, NO DETAIL OF THIS WILL REMAIN UNCHANGED

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
 -->

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

