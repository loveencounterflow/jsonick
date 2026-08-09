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
  white
  green
  blue
  gold
  grey
  red
  bold
  reverse
  log     }               = GUY.trm
#-----------------------------------------------------------------------------------------------------------
# SFMODULES                 = require 'bricabrac-sfmodules'
# { type_of,              } = SFMODULES.unstable.require_type_of()
# { Jetstream,
#   internals,            } = SFMODULES.require_jetstream()
# { get_type_of_stdin,    } = require 'bricabrac-sfmodules/lib/cli-get-type-of-stdin'
# debug 'Ωjsonick___2', require '../../bricabrac-sfmodules'
{ get_type_of_stdin
  get_type_of_stdout    } = require '../../bricabrac-sfmodules/lib/cli-get-type-of-stdin-stdout'
{ Grammar
  Level
  Token
  Lexeme
  rx
  internals             } = require 'interlex'


#===========================================================================================================
demo = ->
  { condense_lexemes
    abbrlxm
    tabulate_lexemes
    tabulate_lexeme       } = require '../../hengist-NG/dev/interlex/lib/helpers'
  #---------------------------------------------------------------------------------------------------------
  ### thx to
    https://github.com/mathiasbynens/mothereff.in/blob/master/js-variables/eff.js
    https://mathiasbynens.be/notes/javascript-identifiers-es6
  ###
  # jsidentifier_pattern = /// ^
  #   (?: [ $_ ]                    | \p{ID_Start}    )
  #   (?: [ $ _ \u{200c} \u{200d} ] | \p{ID_Continue} )*
  #   $ ///v
  nre = ///
    (?: [ $_ ]                        | \p{ID_Start}    )
    (?: [ $ _ \- \u{200c} \u{200d} ]  | \p{ID_Continue} )*
    ///v
  # nre = jsonic_option_re.source
  #---------------------------------------------------------------------------------------------------------
  new_grammar = ->
    R   = new Grammar { name: 'g', linking: false, emit_signals: false, }
    gnd = R.new_level { name: 'gnd', }
    gnd.new_token 'fence',  '--',                                       { data: { slot: null, type: 'fence', string: '--',  }, }
    gnd.new_token 'escaped', rx"\\(?<string>.+)$",                       { data: { slot: 'd', type: 'escaped', }, }
    gnd.new_token 'btrue',  rx"\+((?<xslot>d)\.)?(?<name>#{nre})$",      { data: { slot: 'c', type: 'boolean', string: 'true',   value: true,  }, }
    gnd.new_token 'bfalse', rx"-((?<xslot>d)\.)?(?<name>#{nre})$",                           { data: { slot: 'c', type: 'boolean', string: 'false',  value: false, }, }
    gnd.new_token 'dol',    rx"(?<string>\{.*\})$",                      { data: { slot: 'd', type: 'dol',                                   }, } ### NOTE: DOL = Data Object Literal ###
    gnd.new_token 'facet',  rx":((?<xslot>d)\.)?(?<name>#{nre})=(?<string>.*)$",          { data: { slot: 'c', type: 'facet',                                 }, }
    gnd.new_token 'other',  rx"(?<string>[\-+:].*)$",                          { data: { slot: 'e', type: 'other', name: null,                     }, }
    gnd.new_token 'word',   rx"(?<string>.+)$",                          { data: { slot: 'd', type: 'word', name: null,                     }, }
    return R
  # #---------------------------------------------------------------------------------------------------------
  # get_type_of_stdin = ->
  #   stats = FS.fstatSync 0
  #   # return process.stdin if stats.isFIFO()
  #   return 'tty'    if process.stdin.isTTY
  #   return 'pipe'   if stats.isFIFO()
  #   return 'file'   if stats.isFile()
  #   return 'socket' if stats.isSocket()
  #   return 'other'   # z.B. /dev/null, Block Device
    # return null
  #---------------------------------------------------------------------------------------------------------
  new_facet = ( name, value ) -> R = Object.create null; R[ name ] = value; R
  object_from_dol = ( literal ) ->
    R = Object.create null
    Object.assign R, JSON.parse literal
    return R
  #---------------------------------------------------------------------------------------------------------
  parse_argv = ( argv = null ) ->
    argv        = if argv? then [ argv..., ] else process.argv[ 2 .. ]
    R           = { a: argv, c: [], d: [], e: [], i: get_type_of_stdin(), o: get_type_of_stdout(), t: { c: [], d: [], e: [], } }
    # debug 'Ωjsonick___1', argv
    past_fence  = false
    for argument in argv
      lexemes = g.scan_to_list argument
      #.....................................................................................................
      unless lexemes.length is 1
        R.e.push argument
        continue
      #.....................................................................................................
      # tabulate_lexeme lexemes[ 0 ] ### !!!!!!!!!!!!!!! ###
      { xslot
        slot
        type
        name
        value
        string } = lexemes[ 0 ].data
      slot = xslot ? slot
      #.....................................................................................................
      if past_fence
        R.d.push string
        continue
      #.....................................................................................................
      R.t[ slot ].push type
      #.....................................................................................................
      switch type
        when 'fence'
          past_fence = true
        when 'boolean'
          R[ slot ].push new_facet name, value
        when 'facet'
          R[ slot ].push new_facet name, string
        when 'dol'
          try R[ slot ].push object_from_dol string catch error
            throw error unless error instanceof SyntaxError
            R.e.push string
        when 'other', 'escaped', 'word'
           R[ slot ].push string
        else
          throw new Error "Ωjsonick___2 should never happen: unknown lexeme type #{rpr type}"
    return R
  #---------------------------------------------------------------------------------------------------------
  _isa_null_pod = ( x ) -> ( Object.getPrototypeOf x ) is null
  #---------------------------------------------------------------------------------------------------------
  show_cdef = ( cdef ) ->
    process.stdout.write JSON.stringify cdef
    ;null
  #---------------------------------------------------------------------------------------------------------
  # PQ  = process.argv[ 2 .. ]
  g         = new_grammar()
  cdef      = parse_argv()
  show_cdef cdef
  ###
  [ 'replace:4', '+upper-case', '+', '-verbose', '{d:8}', '{s:true,+bool,}', 'words:a b', '{', '{"name":true,"width":445}' ]
  ###
  ;null


#===========================================================================================================
# module.exports = { nfa, get_signature, Normalize_function_arguments, Template, internals, }

#===========================================================================================================
if module is require.main then do =>
  demo()
  ;null
