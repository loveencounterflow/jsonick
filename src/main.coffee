
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
  new_grammar = ->
    R   = new Grammar { name: 'g', linking: false, emit_signals: false, }
    gnd = R.new_level { name: 'gnd', }
    gnd.new_token 'btrue',  rx'\+(?<name>.+)',                          { data: { realm: 'c', type: 'boolean', string: 'true', value: true,  }, }
    gnd.new_token 'bfalse', rx'-(?<name>.+)',                           { data: { realm: 'c', type: 'boolean', string: 'true', value: false, }, }
    gnd.new_token 'dol',    rx'(?<string>\{.*\})',                      { data: { realm: 'd', type: 'dol',                                   }, } ### NOTE: DOL = Data Object Literal ###
    gnd.new_token 'facet',  rx'(?<name>[^\-+\{][^\s:]*):(?<string>.*)', { data: { realm: 'c', type: 'facet',                                 }, }
    gnd.new_token 'other',  rx'(?<string>.+)',                          { data: { realm: 'c', type: 'other', name: null,                     }, }
    return R
  #---------------------------------------------------------------------------------------------------------
  parse_argv = ( argv = null ) ->
    R     = { c: {}, d: {}, }
    argv ?= process.argv[ 2 .. ]
    debug 'Ωjsonick___1', argv
    for argument in argv
      for lexeme from g.scan argument
        tabulate_lexeme lexeme ### !!!!!!!!!!!!!!! ###
        { realm
          type
          name
          value
          string } = lexeme.data
        switch type
          when 'boolean'
            R[ realm ][ name ] = value
          when 'facet'
            R[ realm ][ name ] = string
          when 'dol'
            try
              R[ realm ] = Object.assign ( R[ realm ] ? {} ), JSON.parse string
            catch error
              warn "Ωjsonick___2", error.message
          when 'other'
            warn "Ωjsonick___3", "illegal argument: #{rpr string}"
          else
            throw new Error "Ωjsonick___4 should never happen: unknown lexeme type #{rpr type}"
    return R
  #---------------------------------------------------------------------------------------------------------
  # PQ  = process.argv[ 2 .. ]
  g   = new_grammar()
  info 'Ωjsonick___5', parse_argv()
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
