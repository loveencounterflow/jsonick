
# JSONick

*(A Superset of) JSON for Command Line Parameters as well as Data Inputs and Outputs that is both nice for
humans (readable) and nice for machines (parsable)*

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [JSONick](#jsonick)
  - [Motivation](#motivation)
  - [JSONick](#jsonick-1)
    - [Naming the Parts](#naming-the-parts)
    - [Conventions for Command Line Arguments](#conventions-for-command-line-arguments)
    - [Phases 1](#phases-1)
      - [Example 1.1](#example-11)
    - [Phases 2](#phases-2)
    - [XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX](#xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx)
  - [Tools](#tools)
    - [CLI Arguments as JSON List Literal](#cli-arguments-as-json-list-literal)
  - [Notes](#notes)
    - [Metadata, Multiple Operands](#metadata-multiple-operands)
  - [See Also](#see-also)
  - [Open Questions](#open-questions)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->


# JSONick

## Motivation

* Classical command line tools typically accept named parameters (arguments, options, flags) and mark their
  names by prefixing them with a single or double hyphen. Most CLI tools use a single hyphen for short
  option names and double hyphens for long option names. Some CLI tools use only single hyphens and do not
  provide short options. Rarely, CLI tools use a somewhat twisted Boolean logic for options: for example,
  the Bash `set` command accepts the call `set -u` to enable errors when an unset variable is encountered.
  Now, to *disable* errors from unset variables you'd call `set +u` which is 180 degrees of strange.

* Classical command line tools typically output "mildly structured" text. It may come in any kind of
  formatting, change between releases, and, even more annoyingly, with locale settings.

* Both of the observations above make the command line harder to use than necessary. Often one has to write
  custom parsers to digest the output of tools. More often than not the solution will be a quick-and-dirty,
  rough-shot regular expression that "works for me". Assembling properly formatted command lines can also be
  difficult.

* Although this state of affairs would appear to be difficult to change across the board (because it would
  entail implementing at least a new shell, if not something close to an entire operating system), I think
  experience shows that, in practice, the shapes of inputs to and outputs from many popular Linux command
  line tools are rather loosely characterized by Lore instead of strictly defined by any universally-adopted
  Spec. This, then, to me, entails that one should not feel too anxious to do something new; one should not
  feel too obliged to follow mediocre[^1] or downright bad[^2] precedent.

> [^1]: e.g. when ImageMagick uses command line argument to implement an organically-grown agglomeration
> that could be called its own 'language'. To quote [Brave Search
> AI](https://search.brave.com/search?q=imagemagick+command+line+arguments%3A+Is+there+a+spec+for+its+language%3F&source=web&summary=1&conversation=09691c29381f0c95243a16cbe542a23379ba):
> "there is no formal specification or standard for the ImageMagick command-line language. ImageMagick uses
> a proprietary command-line interface that evolved significantly between major versions. In ImageMagick 6
> and earlier, the syntax was described as "ill-defined" and "broken," with operators often applied in
> unpredictable orders."

> [^2]: e.g. when different low-level tools employ conflicting standards how to deal with Unicode characters
> outside of US-ASCII; this, of, course also applies to the gazillions of configuration files and
> informational data such as `/etc/mtab` for mounted filesystems which may contain lines like
> `/home/xxx/bin/GhosTTY/Ghostty-1.2.3-x86_64.AppImage /tmp/.mount_Ghostremp15621361697402718996 fuse.dwarfs
> ro,nosuid,nodev,relatime,user_id=1000,group_id=1000 0 0` that uses a mixture of space- and comma-delimited
> syntax (for mount options, technically a nested complex field) with no quotes in sight. One can decry XML
> and JSON for their relative amounts of 'wasted' bytes. But does that concern weigh more heavily than the
> difficulty and vagueness of parsing files and outputs where each source is a law unto itself, where every
> quoted user-defined name that contains a space, a comma or a fancy accented letter can lead to edge cases
> that must be considered for each output anew?

## JSONick

* JSONick is a standard and a software to facilitate inter-process communication and command line option
  handling by relying on JSON for inputs and outputs.

### Naming the Parts

The **command name** will frequently be a short-ish US-ASCII string; JSONick has nothing to say about this
except perhaps that in this context, as well as with parameter names, hyphens are commonly preferred over
underscores (or camelCase).

A typical **command call** consists of the command name, followed by **options**, followed by **operands**.
In the context of this documentation we'll subsume the options under `control` (letter `c`) and the operands
(which either spell out the payload literally or point to it with (a) file system path(s) and/or (a) URL(s))
as `data` (letter `d`). The difference between options (control) and operands (payload, data) is similar to
adjuncts and arguments in grammar: the orders 'cut the rope quickly with a knife' and 'cut the paper
carefully with scissors' both use the same command ('cut') and both have a mandatory argument (direct
object, 'the rope' and 'the paper'); the adjuncts deliver additional details about *how* to perform the
command ('carefully', 'with a knife' and so on). On the command line, another distinction between options
and payload is that payload can (most often) be piped into the command, wheres options can't.

To capture all the fine details and remain configurable, JSONick processes the command line in phases.


### Conventions for Command Line Arguments

* An argument that starts with a single hypen-minus (`-`, U+002d) is considered a Boolean flag with the
  value of `false`, e.g. `cmd -colorize` sets `{"c":{"colorize": false}}`.

* An argument that starts with a single plus sign (`+`, U+002b) is considered a Boolean flag with the value
  of `true`, e.g. `cmd +colorize` sets `{"c":{"colorize": true}}`.

* An argument that starts with a letter and has a colon (`:`) followed by arbitrary text is called a 'facet'
  and represents a name / value pair (the name coming before, the value coming after the colon) in slot `c`.
  For example, `cmd colorize:always` is mapped to `{"c":{"colorize":"always"}}`.


### Phases 1

Phase 1 consists of looking at each command line argument and building an object of a predetermined shape in
a predetermined way. Phase 1 is not configurable and should never terminate with a non-null status code;
instead, the consumer of `analyze-cli-arguments-phase-1` and its equivalents is expected to use
`analyze-cli-arguments-phase-2` to reorganize the output of phase 1 and potentially react with error
messages as seen fit, for which see below.

The object (dictionary) that is the result of processing in phase 1 is called (from the names of its most
important members, and also intelligible as 'command definition') the ***cdef*** object. The attributes of
the *cdef* object are in turn called called **slots**; they all have single-character names:

* slot `a`: **A**ll, a list of all command line arguments in their original order. This does not include the
  name of the executable. In NodeJS programs, `a` is the result of `process.argv.splice(2)`.

* slot `c`: **C**ontrol, a list of objects (dictionaries) containing named values intended for controlling
  the receiving command line tool.

* slot `d`: **D**ata, the 'business data' a.k.a. the 'payload': a list of values (objects, Booleans, numbers
  and strings) intended as data inputs to the receiving command line tool.

* slot `e`: **E**rrors is a list of everything on the command line that could not be parsed.

* slot `f`: **F**ile either `null` or, if the tool is on the receiving end of a UNIX pipe, `STDIN` (i.e.
  `process.stdin` in NodeJS).

#### Example 1.1

The command line `node jsonick/lib/main.js +verbose -verbose -- wat` will produce this JSON representation
of the *cdef* object:

```json
{
"a":["+verbose","-verbose","--","wat"],
"c":[{"verbose":true},{"verbose":false}],
"d":["wat"],
"e":[],
"f":null
}
```

We can see that every element of slot `a` has been cared for: the (probably contradictory, but we'll come to
that later) options `+verbose` and `-verbose` appear as `{"c":[{"verbose":true},{"verbose":false}]}` in the
order given; the double hyphen `--` indicates then end of options (hence it's called End of Options Marker,
**EOM**) and causes argument `wat` to be correctly identified as payload. Without the EOM, `wat` would be
classified as error and the *cdef* would contain `{"d":[],"e":["wat"]}` instead; this is because `wat` does
not look like a Boolean or Facet Option, does not look like a JSON literal, and is not explicitly marked as
being payload, either.


### Phases 2




### XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

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

  * in any event, formatting (beautification) of outputs (or any JSON, for that matter) should be left to
    specialized formatting tools and *not* be implemented over and over for each individual command.

  * Therefore, one tool might output

    ```json
    {"foo":5,"bar":false}
    ```

    and another one

    ```json
    {
      "foo":    5,
      "bar":    false
    }
    ```

    and both outputs are still JSONick-compliant.



* In the current iteration, the setting(s) for the data slot must be written as JSON object literals on
  the command line. Future versions may allow positional parameters where alternative settings are allowed
  for convenience. However, both `c` and `d` attributes of the TOL will always remain to objects.

* If JSONick-compliant command line tools provide command line arguments (CLAs), they must follow these
  guidelines:


  * a CLA that starts with `{` and ends with `}` is considered a JSON object literal in slot `d`. In the
    current iteration only values that are accepted by JavaScript's `JSON.parse()` method are accepted. In
    later version, convenience notations may become acceptable, such as `{+has_agreed}` for
    `{"has_agreed":true}`.

  * The aim here is to allow the exact same syntax inside and outside of braces so that the syntax for
    slots `c` and `d` becomes identical except for the surrounding braces. The paralleslism will be
    furthered by stipulating that top-level braces in command line argument values will be implicitly
    understood as applying to slot `d` unless explicitly marked otherwise with either `c:{}` for the
    control slot or `t:{}` for the TLO. At that point, the following equivalences will hold:

    * `cmd '{x:3}'` ≍ `cmd d:'{x:3}'` ≍ `cmd`

* the parser must not silently ignore any part of the command line input; each part must be reflected as an
  entry in slot `c`, in slot `d`, or cause an error.
  * When the name of an option is used more than once, the default is to terminate wth an error.
  * However, tool authors may configure command line parsing such that all or some names may become either
    overrides or multi-valued options (e.g. a number of file paths each labeled `input:`)

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

## Notes

### Metadata, Multiple Operands

In the conceptual framework outlined here, **Payload Metadata** is in place squarely between the realm of
options and the realm of operators. An example will help to clarify: imagine we have a command line tool
`amd-i` that takes any number of file inputs, analyses their contents, and prints the findings to STDOUT.
This is what e.g. `sha1sum` does which one can call like `sha1sum -b /path/to/file1 /path/to/file2` where
`/path/to/file1` and `/path/to/file2` are of course the operands. There can be any number of file paths as
positional arguments on the command line, the solution is elegant and fairly standardized. In case the
source for the SHA1 computation is not a file but a literal text, the usual conventions apply: use piping or
interactive input. In case some filenames look like command line switches because they start with one or
more hyphens, a `--` (EOM) can be used to separate options from operands. All is well.

Likewise one can imagine a tool that allows to specify, next to an input file, several output files, as in
`markdown-to-webpage pamphlet.md index.html styles.css`. The astute reader can immediately spot a number of
questions with this kind of arrangement: What happens if I leave out the `styles.css` arguments, will the
generated CSS be embedded into `index.html`? How is one expected to formulate a command line where both an
`*.md` and `*.css` files are used as inputs, will `markdown-to-webpage pamphlet.md styles.css index.html` do
that or will `styles.css` be regarded as inputs? The solution of course is to not use positional arguments
for (all of the) operands, and instead use named arguments (options) instead. In classical \*nix fashion a
call could look like `markdown-to-webpage --input=pamphlet.md --input=pamphlet.css --output=index.html
--output=styles.css` (and let's say we trust filename extensions to mean what they purport to mean—a common
assumption which allows us to decide which parts of the output go into which one of the output files).
Another solution could be to allow a single input file as positional argument; the same command line would
then become `markdown-to-webpage --input=pamphlet.css --output=index.html --output=styles.css pamphlet.md`.

Now observe that both `pamphlet.md` and `pamphlet.css` are strictly speaking operands (while the two output
settings could justifiably be called options because they determine how the tool operates in that they make
it not print to STDOUT but write to files). Given that the *cdef* object has both a `c` (control, options)
slot and a `d` (data, payload) slot—which one is it for `pamphlet.css`? Shouldn't one write
`d.input:pamphlet.css` according to JSONick?

Well, no. `input:pamphlet.css` is OK. One might say it is metadata about an operand of our imaginary
`markdown-to-webpage` tool, and of course if `input:pamphlet.css` is metadata, then so is `pamphlet.html`:
it is, after all, just a pointer to the location where the payload may be found. Mow, in the case of
`markdown-to-webpage --input=pamphlet.css ...`, a piece of operative metadata will be thrown into the `c`
slot, so become part of the 'control' configuration. But in the case of  `markdown-to-webpage ...
pamphlet.html`, a very similar piece of operational metadata ends up as an element inside the `d` slot. So
yeah, 'metadata straddles the realms of options and operators' is the new ['A monad is just a monoid in the
category of endofunctors. What's the
problem?'](https://stackoverflow.com/questions/3870088/a-monad-is-just-a-monoid-in-the-category-of-endofunctors-whats-the-problem),
apparently.

To see why that should make sense, consider what the semantics of `d.nnn:vvv` (data slot, name/value pair)
could potentially be good for. Within the context of compiling some Markdown code to a web document the
first thing that comes to my mind is to interpolate (fill out, insert) variable fields in a document—think
'mail merge' (which used to be a thing where you have a MSWord document with named fields for address,
salutation and so on and those fields would be filled out by pairing the document with a spreadsheet as a
data source): `pandoc-like-tool 'd.salutation:My dear Mr Pommeroy' input:festive.css
output:invitation-for-dinner.pdf invitation-for-dinner.md`. There's not necessarily a field named `input` in
`invitation-for-dinner.md`; instead, the `pandoc-like-tool` will choose how to deal with provided styling
information; the path of `festive.css` will not necessarily be preserved anywhere in the output. But (if)
there *is* (in our example) a field named `salution`, then that field will be used to print the phrase 'My
dear Mr Pommeroy' into the output (and maybe show an error if no suitable field was found). Of course, one
could very well implement something very similar by offering a named filed for a CSS field to be included in
the output, and in that case, `d.include:festive.css` would be the right thing to do. Again, metadata is
kind of sitting on the fence.

## See Also

* [SQLite *JSON Functions And Operators*](https://sqlite.org/json1.html)

## Open Questions

* [—] Classical options are marked by `-x` or `-xxx`; JSONick Boolean options are marked by `+` and `-`;
  only facet options are not marked by a prefix, only by a colon that appears after the option name.
  Shouldn't facets also have a prefix such as, maybe
  * `?name:value`,
  * `$name:value`,
  * `%name:value`, or, indeed
  * `+name:value` or
  * `-name:value`, neither of which would collide with the use of `+name`, `-name` for Booleans.

  A suitable prefix could make many strings such as URLs (as in `https://sqlite.org`) less likely to be
  mistaken for facets.

  * using `$` collides with their usage as shell variable markers.
