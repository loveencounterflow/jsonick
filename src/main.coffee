
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
  new_lexer = ->
    R   = new Grammar { name: 'g', linking: false, emit_signals: false, }
    gnd = R.new_level { name: 'gnd', }
    gnd.new_token 'btrue',    rx'^\+(?<name>.+)$',                            { data: { realm: 'c', type: 'boolean', value: true, }, }
    gnd.new_token 'bfalse',   rx'^-(?<name>.+)$',                             { data: { realm: 'c', type: 'boolean', value: false, }, }
    gnd.new_token 'dobject',  rx'^(?<literal>\{.*\})$',                       { data: { realm: 'd', type: 'literal', }, }
    gnd.new_token 'facet',    rx'^(?<name>[^\-+\{][^\s:]*):(?<literal>.*)$',  { data: { realm: 'c', type: 'facet', }, }
    gnd.new_token 'other',    rx'^(?<other>.*)$',                             { data: { realm: 'c', type: 'other', }, }
    return R
  PQ  = process.argv[ 2 .. ]
  g   = new_lexer()
  debug 'Ωjsonick___2', PQ
  for argument in PQ
    lexemes = g.scan_to_list argument
    tabulate_lexemes lexemes
  ;null


#===========================================================================================================
# module.exports = { nfa, get_signature, Normalize_function_arguments, Template, internals, }

#===========================================================================================================
if module is require.main then do =>
  demo()
  ;null
