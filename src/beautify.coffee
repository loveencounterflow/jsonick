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
# { Grammar
#   Level
#   Token
#   Lexeme
#   rx
#   internals             } = require 'interlex'
# FS                        = require 'fs'
{ get_type_of_stdin
  get_type_of_stdout    } = require '../../bricabrac-sfmodules/lib/cli-get-type-of-stdin-stdout'
# { Pipeline,           \
#   Async_pipeline,     \
#   transforms: TF }    = require 'moonriver'
# { Async_pipeline,   } = require 'moonriver'
util                      = require 'node:util'


#===========================================================================================================
read_stdin = ->
  R = []
  for await chunk from process.stdin
    R.push chunk
  return ( Buffer.concat R ).toString 'utf8'

#-----------------------------------------------------------------------------------------------------------
fetch_input = ->
  type_of_stdin = get_type_of_stdin()
  switch type_of_stdin
    when 'tty'
      R = process.argv[ 2 .. ].join ' '
    when 'pipe', 'file'
      R = await read_stdin()
    when 'socket'
      warn "Ωjsonick___2 type of input not implemented: #{rpr type_of_stdin}"
    else
      warn "Ωjsonick___3 unknown type of input: #{rpr type_of_stdin}"
  return R

#===========================================================================================================
demo = ->
  # argv        = if argv? then [ argv..., ] else process.argv[ 2 .. ]
  # console.log cdef
  input       = await fetch_input()
  use_colors  = process.stdout.isTTY
  try
    value = JSON.parse input
    # process.stdout.write JSON.stringify value, null, ' '
    process.stdout.write util.inspect value, { colors: use_colors, }
    process.stdout.write '\n'
  catch error
    process.stdout.write input
  ;null


#===========================================================================================================
# module.exports = { nfa, get_signature, Normalize_function_arguments, Template, internals, }

#===========================================================================================================
if module is require.main then do =>
  await demo()
  ;null
