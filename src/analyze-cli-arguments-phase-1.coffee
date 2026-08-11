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
  # white
  # green
  # blue
  # gold
  # grey
  # red
  # bold
  # reverse

#-----------------------------------------------------------------------------------------------------------
# SFMODULES                 = require 'bricabrac-sfmodules'
# { type_of,              } = SFMODULES.unstable.require_type_of()
# { Jetstream,
#   internals,            } = SFMODULES.require_jetstream()
# { get_type_of_stdin,    } = require 'bricabrac-sfmodules/lib/cli-get-type-of-stdin'
# debug 'Ωjsonick___2', require 'bricabrac-sfmodules'
{ get_type_of_stdin
  get_type_of_stdout    } = require '../../bricabrac-sfmodules/lib/cli-get-type-of-stdin-stdout'
{ type_of,              } = ( require '../../bricabrac-sfmodules/lib/unstable-rpr-type_of-brics' ).require_type_of()
isa_text                  = ( x ) -> ( typeof x ) is 'string'

#-----------------------------------------------------------------------------------------------------------
### thx to
  https://github.com/mathiasbynens/mothereff.in/blob/master/js-variables/eff.js
  https://mathiasbynens.be/notes/javascript-identifiers-es6
###
nre = ///
  (?: [ $_ ]                        | \p{ID_Start}    )
  (?: [ $ _ \- \u{200c} \u{200d} ]  | \p{ID_Continue} )*
  ///v
# nre = jsonic_option_re.source

# #-----------------------------------------------------------------------------------------------------------
# new_grammar = ->
#   R   = new Grammar { name: 'g', linking: false, emit_signals: false, }
#   gnd = R.new_level { name: 'gnd', }
#   gnd.new_token 'fence',  '--',                                                     { data: { slot: null, type: 'fence', string: '--',  }, }
#   gnd.new_token 'numberlit',  rx"(?<string>[+\-]?[.]?[0-9].*)$",                    { data: { slot: 'd', type: 'numberlit', }, }
#   gnd.new_token 'escaped',    rx"(?<string>%.+)$",                                  { data: { slot: 'd', type: 'escaped', }, }
#   gnd.new_token 'btrue',      rx"\+((?<xslot>d)\.)?(?<name>#{nre})$",               { data: { slot: 'c', type: 'boolean', string: 'true',   value: true,  }, }
#   gnd.new_token 'bfalse',     rx"-((?<xslot>d)\.)?(?<name>#{nre})$",                { data: { slot: 'c', type: 'boolean', string: 'false',  value: false, }, }
#   gnd.new_token 'objectlit',  rx"(?<string>\{.*)$",                                 { data: { slot: 'd', type: 'objectlit',                                  }, }
#   gnd.new_token 'listlit',    rx"(?<string>\[.*)$",                                 { data: { slot: 'd', type: 'listlit',                                   }, }
#   gnd.new_token 'facet',      rx":((?<xslot>d)\.)?(?<name>#{nre})=(?<string>.*)$",  { data: { slot: 'c', type: 'facet',                                 }, }
#   gnd.new_token 'other',      rx"(?<string>[\-+:\{\[].*)$",                         { data: { slot: 'e', type: 'other', name: null,                     }, }
#   gnd.new_token 'word',       rx"(?<string>.+)$",                                   { data: { slot: 'd', type: 'word', name: null,                     }, }
#   return R

#-----------------------------------------------------------------------------------------------------------
new_facet = ( name, value ) -> R = Object.create null; R[ name ] = value; R

#-----------------------------------------------------------------------------------------------------------
object_from_objectlit = ( objectlit ) ->
  R = Object.create null
  Object.assign R, JSON.parse objectlit
  return R

#-----------------------------------------------------------------------------------------------------------
list_from_listlit = ( listlit ) -> JSON.parse listlit

#-----------------------------------------------------------------------------------------------------------
patterns =
  num_re:   ///^ (?<v> [+\-]? [.]? [0-9].* ) $///v
  bol_re:   ///^ [+\-] ( (?<slot> d ) \. )? (?<n> #{nre.source})              $///v
  fac_re:   ///^ :     ( (?<slot> d ) \. )? (?<n> #{nre.source}) = (?<v> .* ) $///v

#-----------------------------------------------------------------------------------------------------------
parse_argv = ( argv = null ) ->
  argv  = if argv? then [ argv..., ] else process.argv[ 2 .. ]
  R     = { a: argv, c: [], d: [], e: [], i: get_type_of_stdin(), o: get_type_of_stdout(), }
  return R if argv.length is 0
  #.........................................................................................................
  past_fence  = false
  for s, x in argv
    throw new Error "Ωjsonick___2 at argv[ #{x} ]: expected a string, got a #{type_of s}" unless isa_text s
    continue if s.length is 0 ### Should never happen ###
    #.....................................................................................................
    if past_fence
      R.d.push { t: 'pfn', v: s, x, }
      continue
    #.....................................................................................................
    s0  = s[ 0 ]
    slot    = 'd'
    t       = null
    v       = null
    n       = null
    switch s0
      #.....................................................................................................
      when '.', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'
        t = if ( s0 isnt '.' ) or ( ( s0 is '.' ) and ( patterns.num_re.test s ) ) then 'num' else 'bar'
      #.....................................................................................................
      when '-', '+'
        #...................................................................................................
        if s is '--'
          past_fence = true
          continue
        #...................................................................................................
        t = 'num'
        break if ( match = s.match patterns.num_re )?
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
      when '{'
        t     = 'obj'
      #.....................................................................................................
      when '['
        t     = 'lst'
      #.....................................................................................................
      else
        t     = 'bar'
    entry     = { t, }
    entry.n   = n if n?
    entry.v   = v ? s unless slot is 'e'
    entry.x   = x
    R[ slot ].push entry
  #.........................................................................................................
  return R


  # #=========================================================================================================
  # return null
  # # debug 'Ωjsonick___1', argv
  # # grammar    ?= new_grammar()
  # for argument in argv
  #   #.....................................................................................................
  #   lexemes = grammar.scan_to_list argument
  #   #.....................................................................................................
  #   unless lexemes.length is 1
  #     R.e.push argument
  #     continue
  #   #.....................................................................................................
  #   # tabulate_lexeme lexemes[ 0 ] ### !!!!!!!!!!!!!!! ###
  #   { xslot
  #     slot
  #     type
  #     name
  #     value
  #     string } = lexemes[ 0 ].data
  #   slot = xslot ? slot
  #   #.......................................................................................................
  #   switch type
  #     when 'boolean'                                then R[ slot ].push new_facet name, value
  #     when 'facet'                                  then R[ slot ].push new_facet name, string
  #     when 'other', 'escaped', 'word', 'numberlit'  then R[ slot ].push string
  #     #.....................................................................................................
  #     when 'objectlit', 'listlit'
  #       method = if type is 'objectlit' then object_from_objectlit else list_from_listlit
  #       try
  #         R[ slot ].push method string
  #       catch error
  #         throw error unless error instanceof SyntaxError
  #         R.e.push string
  #         slot  = 'e'
  #         type  = "e#{type}"
  #     #.....................................................................................................
  #     when 'fence'
  #       past_fence = true
  #       continue
  #     #.....................................................................................................
  #     else throw new Error "Ωjsonick___2 should never happen: unknown lexeme type #{rpr type}"
  #   R.t[ slot ].push type
  # return R

#-----------------------------------------------------------------------------------------------------------
_isa_null_pod = ( x ) -> ( Object.getPrototypeOf x ) is null

#-----------------------------------------------------------------------------------------------------------
show_cdef = ( cdef ) ->
  process.stdout.write JSON.stringify cdef
  ;null


#===========================================================================================================
demo = ->
  #---------------------------------------------------------------------------------------------------------
  # PQ  = process.argv[ 2 .. ]
  cdef      = parse_argv()
  show_cdef cdef
  ###
  [ 'replace:4', '+upper-case', '+', '-verbose', '{d:8}', '{s:true,+bool,}', 'words:a b', '{', '{"name":true,"width":445}' ]
  ###
  ;null


#===========================================================================================================
module.exports = { parse_argv, }

#===========================================================================================================
if module is require.main then do =>
  demo()
  ;null
