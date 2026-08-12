
# Sigil

*(A Superset of) JSON for Command Line Parameters as well as Data Inputs and Outputs that is both nice for
humans (readable) and nice for machines (parsable)*

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [Sigil](#sigil)
  - [Motivation](#motivation)
  - [Sigil](#sigil-1)
    - [Naming the Parts](#naming-the-parts)
    - [Conventions for Command Line Arguments](#conventions-for-command-line-arguments)
      - [Overarching Rules](#overarching-rules)
      - [Detailed Rules for each Argument Type](#detailed-rules-for-each-argument-type)
    - [Argument Descriptions: TNVX Objects](#argument-descriptions-tnvx-objects)
    - [Phase 1](#phase-1)
      - [Example 1.1](#example-11)
    - [Phase 2](#phase-2)
  - [Tools](#tools)
    - [CLI Arguments as JSON List Literal](#cli-arguments-as-json-list-literal)
    - [Beautify](#beautify)
  - [Notes](#notes)
    - [Metadata, Multiple Operands](#metadata-multiple-operands)
  - [See Also](#see-also)
  - [To Do](#to-do)
  - [Is Done](#is-done)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->


# Sigil

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

## Sigil

* Sigil is a standard and a software to facilitate inter-process communication and command line option
  handling by relying on JSON for inputs and outputs.

### Naming the Parts

The **command name** will frequently be a short-ish US-ASCII string; Sigil has nothing to say about this
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

To capture all the fine details and remain configurable, Sigil processes the command line in phases.


### Conventions for Command Line Arguments

#### Overarching Rules

Sigil follows some very simple rules to parse command line arguments:

* Each argument is, in Phase 1, classified either as an option (control) or as an operand (data).
* An empty argument such as in `cmd ''` is always an operand.
* Each argument is classified based on its first character, of which there are six special ones (plus the
  digits and the dot used to recognize numbers):
  * percent sign (`%`), leading a so-called escaped value whose first character might otherwise trigger one
    of the below interpretations;
  * hyphen-minus `-`, leading either a fence `--`, a numeric string, or a negative Boolean option (as in,
    `-colors`);
  * plus `+`, leading to either a numeric string or a positive Boolean (as in, `+colors`);
  * colon `:`, leading a faced i.e. a named value (as in, `:colors=always`);
  * left brace `{`, leading a JSON object literal (as in, `{"colors":"always"}`); and
  * left bracket `[`, leading a JSON list literal (as in, `[true,false,56,"colors",null]}`);
* When an argument has one of the above leading characters (thereby 'pretends' to be something) but the rest
  of the argument is not correctly formed (thereby failing to 'live up to' the expectations for that prefix
  as laid out below), the argument is classified as an error. Consumers may decide how to deal with errors.
* In the below, the term 'name' specifically means "a legal JavaScript identifier albeit one where hyphens
  are acceptable in non-initial positions". All name-bearing argument types are by default options, not
  operands, and therefore their parsing results go into slot `c`. To re-route name-bearing arguments like
  Booleans and facets to slot `d`, use a qualified name by prefixing `d.` (letter `d` U+0064, full stop `.`
  U+002e). For example, `cmd '{"verbose":false}' +d.verbose` will produce two entries in `d`, the first
  specifying `false` for a property in the payload object called `verbose`, and the second one specifying
  `true`. Depending on further processing, this may be resolved by having the latter overwrite the former.
  Likewise, `cmd :d.color=red` is (almost) the same as `cmd '{"color":"red"}'`. The prefixed `d.` is always
  stripped so that only the unprefixed name remains.
* Arguments that start with an optional plus or minus sign `/[+\-]?/`, followed by an optional dot `/[.]?/`,
  followed by a digit `/[0-9]/` are considered numeric strings and, hence, operands. This rule turns
  notations like `+.45cm`, `800.3` and `-3` into legal operands.
* Parsing of numeric strings is not attempted outside of JSON object and list literals and left to the
  explicit handling in Phase 2; the reason being that an apparently number-like literal `'+9837.765'` may
  just as well represent some kind of numerical code.


#### Detailed Rules for each Argument Type

In Phase 1, each command line argument gets assigned one of the following types (`t`) and slots (`s`):

* 'post-fence', `{ t: 'pfn', }`, slot `d`, for all arguments following a `--` (fence) argument;
* 'bare', `{ t: 'bar', }`, slot `d`;
* 'escaped', `{ t: 'esc', }`, slot `d`;
* 'numeric', `{ t: 'num', }`, slot `d`;
* 'boolean', `{ t: 'bol', }`, slot `c` (can also go to slot `d` if explicitly marked);
* 'facet', `{ t: 'fac', }`, slot `c` (can also go to slot `d` if explicitly marked);
* (JSON) 'list' (literal), `{ t: 'lst', }`, slot `d`;
* (JSON) 'object' (literal), `{ t: 'obj', }`, slot `d`.

Here is how arguments are processed:

* An argument that consists of two hyphen-minuses (`--`, U+002d U+002d) is a fence. The fence causes
  suspension of parsing and all arguments following `--` will be turned into entries in slot `d` with type
  `pfn` whose value is the unchanged test of the argument. It is not possible to resume parsing once a fence
  has been encountered. The first `--` encountered will not cause an entry anywhere except for its listing
  in `cde.a`; however, each argument following it (naturally including arguments that consist of two
  hyphen-minuses) will be reflected as an entry in `d`.

* An argument that starts with an optional single hyphen-minus (`-`, U+002d) or plus sign (`+`, U+002b),
  followed by an optional full stop (`.`, U+002e), followed by one or more digits (`/[0-9]/`, U+0030..U+0039)
  is considered numeric (`num`) and is classified as an operand.

* An argument that starts with a single hyphen-minus (`-`, U+002d) is considered a candidate for a Boolean
  flag with the value of `false`. It must directly be followed by an optionally qualified name, e.g. `cmd
  -colorize` sets `{"c":{"colorize": false}}`.

* An argument that starts with a single hyphen-minus but is not followed by a name is an error and goes to
  slot `e`.

* An argument that starts with a plus sign (`+`, U+002b) is considered a candidate for a Boolean flag with
  the value of `true`. It must directly be followed by an optionally qualified name, e.g. `cmd +colorize`
  sets `{"c":{"colorize": true}}`.

* An argument that starts with a plus sign but is not followed by a name is an error and goes to slot `e`.

* An argument that starts with a colon (`:`, U+003a) is considered a candidate for a 'facet', i.e. a name /
  value pair. It must be followed by 1) an optionally qualified name, then 2) an equals sign (`=`, U+003d),
  then 3) a (possibly empty) value. For example, `cmd :verbosity=eloquent` sets the option `{ verbosity:
  'eloquent' }`.

* An argument that starts with a colon but doesn't comply with the rule above this one is an error and goes
  to slot `e`.

* An argument that starts with a percent sign (`%`, U+0025) is considered an escaped operand. The percent
  sign blocks leading punction such as `+`, `-`, `:`, `{` and `[` from triggering recognition as a
  special-syntax element. For example, to add the text `+good` as an operand to `cmd` one can write `cmd
  %+good`. To start an operand with a value whose first character is a percent sign, use two percent signs
  as in `cmd '%% is a percent sign'`.

* An argument that starts with a left curly brace (`{`, U+007b) is considered a candidate for a JSON object
  literal. It is put into the `d` slot but not parsed which is left to Phase 2.

* An argument that starts with a left square bracket (`[`, U+005b) is considered a candidate for a JSON list
  literal. It is put into the `d` slot but not parsed which is left to Phase 2.

### Argument Descriptions: TNVX Objects

The so-called *tnvx* objects used to describe each argument in the `c`, `d` and `e` slots of the *cde*
object have at least 2 and up to 4 properties:

* `t` (mandatory): The (suspected or factual) type of the argument; one of `'pfn'`, `'bar'`, `'esc'`,
  `'num'`, `'bol'`, `'fac'`, `'lst'`, `'obj'`.

* `n` (optional): In the case of types `bol` (Boolean option) and `fac` (facet option), the name of the
  option.

* `v` (optional): Missing only if the argument was put into slot `e`; retrieve original form from `cde.a`
  for error messages. Otherwise (if the entry representing the argument was put into `c` or `d`):
  * In the case of type `bol` (Boolean option), `v` is either `true` or `false`.
  * In the case of `fac` (facet option), `v` represents the part of the argument that came after the equals
    sign (which may be an empty string).
  * In the case of `esc`, `v` is the part of the argument after the initial percent sign `%`.
  * In the case of `bar`, `pfn`, `num`, `obj` and `lst`, `v` is the entire argument.

  For example, `+colorize` gives `{ t: 'bol', n: 'colorize', v: true, }`, `:colorize=always` gives `{ t:
  'fac', n: 'colorize', v: 'always', }`, `:secret=` gives `{ t: 'fac', n: 'secret', v: '', }`.

* `x` (mandatory): the index of the argument in the list of arguments, `cde.a`.


### Phase 1

Phase 1 consists of looking at each command line argument and building an object of a predetermined shape in
a predetermined way. Phase 1 is not configurable and should never terminate with a non-null status code
except for bugs.

Consumers of script `analyze-cli-arguments-phase-1` and its equivalents are expected to use
`analyze-cli-arguments-phase-2` to reorganize the output of phase 1 and potentially react with error
messages as seen fit, for which see below.

The object (dictionary) that is the result of processing in phase 1 is called (from the names of its most
prominent members) the ***cde*** object. The attributes of the *cde* object are in turn called called
**slots**; they all have single-character names:

* slot `a`: **A**ll, a list of all command line arguments in their original form and original order. This
  does not include the name of the executable. In NodeJS programs, `a` is the result of
  `process.argv.splice(2)`.

* slot `c`: **C**ontrol, a list of *tnvx* objects (see above) containing representations of Booleans and
  facets intended for controlling the receiving command line tool.

* slot `d`: **D**ata, the 'business data' a.k.a. the 'payload': a list of *tnvx* objects (see above)
  containing representations of the arguments intended as data inputs to the receiving command line tool.

* slot `e`: **E**rratic, a list of objects describing every argument that could not be parsed. These entries
  only contain a property `t` with the 3-letter name of the type that corresponds to their first character
  and a property `x` which is an index into the list of arguments, `cde.a`.

* slot `i` and slot `o`: **I**nput and **O**utput. These two slots are each set to one of `'tty'`, `'pipe'`,
  `'file'`, `'socket'`, `'other'`, depending on the status of `process.stdin` and `process.stdout`,
  respectively.



#### Example 1.1

The command line `node sigil/analyze-cli-arguments-phase-1 +verbose -verbose -- wat | ./beautify` will
produce this (reformatted) JSON representation of the *cde* object:

```
{
  a: [ '+verbose', '-verbose', '--', 'wat' ],
  c: [
    { t: 'bol', n: 'verbose', v: true, x: 0 },
    { t: 'bol', n: 'verbose', v: false, x: 1 }
  ],
  d: [ { t: 'pfn', v: 'wat', x: 3 } ],
  e: [],
  i: 'tty',
  o: 'pipe'
}
```


### Phase 2

**To Be Written**


<!--

Loose ends

* Sigil-compliant command line tools whose inputs are text oriented:

  * must accept JSON-formatted data over STDIN as input (the minimum and default behavior)
    * typically, the input will be a standard JSON-formatted object literal
    * in the future we will extend JSON to include convenient shortcuts, see below
  * must accept pipelined data, meaning `cmd {}` is equivalent to `printf '{}' | cmd`
  * may additionally accept data in other formats, typically announced by a command line switch or a file
    name

* Sigil-compliant command line tools whose outputs are text oriented:

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

    and both outputs are still Sigil-compliant.

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

### Beautify

**To Be Written**

To reformat JSON output as a human-friendly representation, pipe into `sigil/beautify`:

```bash
node sigil/analyze-cli-arguments-phase-1 +verbose -verbose -- wat | sigil/beautify
```

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
it not print to STDOUT but write to files). Given that the *cde* object has both a `c` (control, options)
slot and a `d` (data, payload) slot—which one is it for `pamphlet.css`? Shouldn't one write
`d.input:pamphlet.css` according to Sigil?

Well, no. `input:pamphlet.css` is OK. One might say it is metadata about an operand of our imaginary
`markdown-to-webpage` tool, and of course if `input:pamphlet.css` is metadata, then so is `pamphlet.html`:
it is, after all, just a pointer to the location where the payload may be found. Now, in the case of
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

* [SQLite *JSON Functions And Operators*](https://sqlite.org/json1.html); this may become interesting in the
  future for the formulation of selectors into complex JSON objects.

## To Do

* [—] Write about how `get_type_of_stdin()` returns `null` for `/dev/null` inputs which may not be
  sufficient under some scenarios
* [—] Write about how `cmd-1 | cmd-2 < file` is not a meaningful construct and what consumers can expect
  if they encounter it
  * [+] How is `cmd-1 | cmd-2` to be treated when compared to `cmd-2 < file`? Is it possible /meaningful to write
    `cmd-1 | cmd-2 < file`?

## Is Done

* [+] <strike>Classical options are marked by `-x` or `-xxx`; Sigil Boolean options are marked by `+` and
  `-`; only facet options are not marked by a prefix, only by a colon that appears after the option name.
  Shouldn't facets also have a prefix such as, maybe</strike>
  * <strike>`@name:value`,</strike>
  * <strike>`^name:value`,</strike>
  * <strike>`&name:value`,</strike>
  * <strike>`*name:value`,</strike>
  * <strike>`:name:value`,</strike>
  * <strike>`?name:value`,</strike>
  * <strike>`$name:value`,</strike>
  * <strike>`%name:value`, or, indeed</strike>
  * <strike>`+name:value` or</strike>
  * <strike>`-name:value`, neither of which would collide with the use of `+name`, `-name` for
    Booleans.</strike>
  * <strike>A suitable prefix could make many strings such as URLs (as in `https://sqlite.org`) less likely
    to be mistaken for facets.</strike>
  * <strike>using `$` collides with its usage as shell variable markers.</strike>
  * <strike>When any prefix gets adopted, must clarify what happens in the case of `cmd %name: xxx`: is the
    value of field `name` empty or is it `xxx` (which in this case appears as not the same but the next
    argument).</strike>

