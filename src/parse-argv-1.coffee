#!/bin/env node

'use strict'

#===========================================================================================================
GUY                       = require 'guy'
{ alert
  debug
  help
  info
  plain
  praise
  urge
  warn
  whisper }               = GUY.trm.get_loggers 'normalize-cli-arguments'
{ rpr
  inspect
  echo
  log     }               = GUY.trm
#-----------------------------------------------------------------------------------------------------------
{ get_type_of_stdin
  get_type_of_stdout    } = require '../../bricabrac-sfmodules/lib/cli-get-type-of-stdin-stdout'
{ type_of,              } = ( require '../../bricabrac-sfmodules/lib/unstable-rpr-type_of-brics' ).require_type_of()
isa_text                  = ( x ) -> ( typeof x ) is 'string'


#-----------------------------------------------------------------------------------------------------------
patterns = do =>
  ### `nme_re` matches all strings that are legal identifiers in JavaScript; additionally, it allows the
  usage of hyphen-minus (`-`, U+002d) inside of names so both `my_name` and `my-name` are both legal names
  (but `-xxx` is not whereas `_xxx` is OK). Thx to
  https://github.com/mathiasbynens/mothereff.in/blob/master/js-variables/eff.js and
  https://mathiasbynens.be/notes/javascript-identifiers-es6 ###
  nme_re = ///
    (?! .* - $ ) # disallow strings ending in hyphen-minus
    (?: [ $_ ]                        | \p{ID_Start}    )
    (?: [ $ _ \- \u{200c} \u{200d} ]  | \p{ID_Continue} )*
    ///v
  R =
    nme_re: nme_re
    num_re: ///^ (?<v> [+\-]? [.]? [0-9].* ) $///v
    bol_re: ///^ [+\-] ( (?<slot> d ) \. )? (?<n> #{nme_re.source})              $///v
    fac_re: ///^ :     ( (?<slot> d ) \. )? (?<n> #{nme_re.source}) = (?<v> .* ) $///v
  return R

#-----------------------------------------------------------------------------------------------------------
parse_argv = parse_argv_1 = ( argv = null ) ->
  if argv?
    unless ( type_of_argv = type_of argv ) is 'list'
      throw new Error "Ωjsonick___2 expected a list for argv, got a #{type_of_argv}"
    argv  = [ argv..., ]
  else
    argv = process.argv[ 2 .. ]
  #.........................................................................................................
  R     = { a: argv, c: [], d: [], e: [], i: get_type_of_stdin(), o: get_type_of_stdout(), }
  return R if argv.length is 0
  #.........................................................................................................
  past_fence  = false
  for s, x in argv
    throw new Error "Ωjsonick___2 at argv[ #{x} ]: expected a string, got a #{type_of s}" unless isa_text s
    #.....................................................................................................
    if past_fence
      R.d.push { t: 'pfn', v: s, x, }
      continue
    #.....................................................................................................
    slot    = 'd'
    t       = null
    v       = null
    n       = null
    #.......................................................................................................
    if patterns.num_re.test s
      t = 'num'
    #.......................................................................................................
    else switch s0 = s[ 0 ] ? null
      #.....................................................................................................
      when null ### in the case of empty string as input ###
        t = 'bar'
      #.....................................................................................................
      when '-', '+'
        #...................................................................................................
        if s is '--'
          past_fence = true
          continue
        #...................................................................................................
        t = 'bol'
        if ( match = s.match patterns.bol_re )?
          slot  = match.groups.slot ? 'c'
          v     = if s0 is '+' then true else false
          n     = match.groups.n
          break
        #...................................................................................................
        slot = 'e'
      #.....................................................................................................
      when ':'
        t     = 'fac'
        if ( match = s.match patterns.fac_re )?
          slot  = match.groups.slot ? 'c'
          v     = match.groups.v
          n     = match.groups.n
          break
        #...................................................................................................
        slot = 'e'
      #.....................................................................................................
      when '%'
        t     = 'esc'
        v     = s[ 1 .. ]
      #.....................................................................................................
      when '{' then t = 'obj'
      when '[' then t = 'lst'
      else          t = 'bar'
    #.......................................................................................................
    entry     = { t, }
    entry.n   = n if n?
    entry.v   = v ? s unless slot is 'e'
    entry.x   = x
    R[ slot ].push entry
  #.........................................................................................................
  return R

#===========================================================================================================
cli = ->
  #---------------------------------------------------------------------------------------------------------
  cde = parse_argv()
  process.stdout.write JSON.stringify cde
  ;null


#===========================================================================================================
module.exports = { parse_argv, parse_argv_1, }

#===========================================================================================================
if module is require.main then do =>
  cli()
  ;null
