
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
SFMODULES                 = require 'bricabrac-sfmodules'
{ type_of,              } = SFMODULES.unstable.require_type_of()
{ Jetstream,
  internals,            } = SFMODULES.require_jetstream()
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
  PQ = process.argv[ 2 .. ]
  debug 'Ωnca___1', PQ
  ;null


#===========================================================================================================
# module.exports = { nfa, get_signature, Normalize_function_arguments, Template, internals, }

#===========================================================================================================
if module is require.main then do =>
  demo()
  ;null
