#!/bin/env node
(function() {
  //!/bin/env node
  'use strict';
  process.stdout.write(JSON.stringify(process.argv.slice(2)));

  // #===========================================================================================================
// GUY                       = require 'guy'
// { alert
//   debug
//   help
//   info
//   plain
//   praise
//   urge
//   warn
//   whisper }               = GUY.trm.get_loggers 'normalize-cli-arguments'
// { rpr
//   inspect
//   echo
//   white
//   green
//   blue
//   gold
//   grey
//   red
//   bold
//   reverse
//   log     }               = GUY.trm
// #-----------------------------------------------------------------------------------------------------------
// SFMODULES                 = require 'bricabrac-sfmodules'
// { type_of,              } = SFMODULES.unstable.require_type_of()
// { Jetstream,
//   internals,            } = SFMODULES.require_jetstream()
// { Grammar
//   Level
//   Token
//   Lexeme
//   rx
//   internals             } = require 'interlex'

  // #===========================================================================================================
// demo = ->
//   { condense_lexemes
//     abbrlxm
//     tabulate_lexemes
//     tabulate_lexeme       } = require '../../hengist-NG/dev/interlex/lib/helpers'
//   PQ = process.argv[ 2 .. ]
//   debug 'Ωnca___1', PQ
//   ;null

  // #===========================================================================================================
// # module.exports = { nfa, get_signature, Normalize_function_arguments, Template, internals, }

  // #===========================================================================================================
// if module is require.main then do =>
//   demo()
//   ;null

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2NsaS1hcmd1bWVudHMtYXMtbGlzdC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQWU7RUFBQTtFQUVmO0VBRUEsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFmLENBQXFCLElBQUksQ0FBQyxTQUFMLENBQWUsT0FBTyxDQUFDLElBQUksU0FBM0IsQ0FBckI7O0VBSmU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSIsInNvdXJjZXNDb250ZW50IjpbIiMhL2Jpbi9lbnYgbm9kZVxuXG4ndXNlIHN0cmljdCdcblxucHJvY2Vzcy5zdGRvdXQud3JpdGUgSlNPTi5zdHJpbmdpZnkgcHJvY2Vzcy5hcmd2WyAyIC4uIF1cblxuXG4jICM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuIyBHVVkgICAgICAgICAgICAgICAgICAgICAgID0gcmVxdWlyZSAnZ3V5J1xuIyB7IGFsZXJ0XG4jICAgZGVidWdcbiMgICBoZWxwXG4jICAgaW5mb1xuIyAgIHBsYWluXG4jICAgcHJhaXNlXG4jICAgdXJnZVxuIyAgIHdhcm5cbiMgICB3aGlzcGVyIH0gICAgICAgICAgICAgICA9IEdVWS50cm0uZ2V0X2xvZ2dlcnMgJ25vcm1hbGl6ZS1jbGktYXJndW1lbnRzJ1xuIyB7IHJwclxuIyAgIGluc3BlY3RcbiMgICBlY2hvXG4jICAgd2hpdGVcbiMgICBncmVlblxuIyAgIGJsdWVcbiMgICBnb2xkXG4jICAgZ3JleVxuIyAgIHJlZFxuIyAgIGJvbGRcbiMgICByZXZlcnNlXG4jICAgbG9nICAgICB9ICAgICAgICAgICAgICAgPSBHVVkudHJtXG4jICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuIyBTRk1PRFVMRVMgICAgICAgICAgICAgICAgID0gcmVxdWlyZSAnYnJpY2FicmFjLXNmbW9kdWxlcydcbiMgeyB0eXBlX29mLCAgICAgICAgICAgICAgfSA9IFNGTU9EVUxFUy51bnN0YWJsZS5yZXF1aXJlX3R5cGVfb2YoKVxuIyB7IEpldHN0cmVhbSxcbiMgICBpbnRlcm5hbHMsICAgICAgICAgICAgfSA9IFNGTU9EVUxFUy5yZXF1aXJlX2pldHN0cmVhbSgpXG4jIHsgR3JhbW1hclxuIyAgIExldmVsXG4jICAgVG9rZW5cbiMgICBMZXhlbWVcbiMgICByeFxuIyAgIGludGVybmFscyAgICAgICAgICAgICB9ID0gcmVxdWlyZSAnaW50ZXJsZXgnXG5cblxuIyAjPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiMgZGVtbyA9IC0+XG4jICAgeyBjb25kZW5zZV9sZXhlbWVzXG4jICAgICBhYmJybHhtXG4jICAgICB0YWJ1bGF0ZV9sZXhlbWVzXG4jICAgICB0YWJ1bGF0ZV9sZXhlbWUgICAgICAgfSA9IHJlcXVpcmUgJy4uLy4uL2hlbmdpc3QtTkcvZGV2L2ludGVybGV4L2xpYi9oZWxwZXJzJ1xuIyAgIFBRID0gcHJvY2Vzcy5hcmd2WyAyIC4uIF1cbiMgICBkZWJ1ZyAnzqluY2FfX18xJywgUFFcbiMgICA7bnVsbFxuXG5cbiMgIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4jICMgbW9kdWxlLmV4cG9ydHMgPSB7IG5mYSwgZ2V0X3NpZ25hdHVyZSwgTm9ybWFsaXplX2Z1bmN0aW9uX2FyZ3VtZW50cywgVGVtcGxhdGUsIGludGVybmFscywgfVxuXG4jICM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuIyBpZiBtb2R1bGUgaXMgcmVxdWlyZS5tYWluIHRoZW4gZG8gPT5cbiMgICBkZW1vKClcbiMgICA7bnVsbFxuXG5cblxuIl19
