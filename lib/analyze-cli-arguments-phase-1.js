#!/bin/env node
(function() {
  //!/bin/env node
  'use strict';
  var GUY, Grammar, Level, Lexeme, Token, _isa_null_pod, alert, blue, bold, debug, demo, echo, get_type_of_stdin, get_type_of_stdout, gold, grammar, green, grey, help, info, inspect, internals, list_from_listlit, log, new_facet, new_grammar, nre, object_from_objectlit, parse_argv, plain, praise, red, reverse, rpr, rx, show_cdef, urge, warn, whisper, white;

  //===========================================================================================================
  GUY = require('guy');

  ({alert, debug, help, info, plain, praise, urge, warn, whisper} = GUY.trm.get_loggers('normalize-cli-arguments'));

  ({rpr, inspect, echo, white, green, blue, gold, grey, red, bold, reverse, log} = GUY.trm);

  //-----------------------------------------------------------------------------------------------------------
  // SFMODULES                 = require 'bricabrac-sfmodules'
  // { type_of,              } = SFMODULES.unstable.require_type_of()
  // { Jetstream,
  //   internals,            } = SFMODULES.require_jetstream()
  // { get_type_of_stdin,    } = require 'bricabrac-sfmodules/lib/cli-get-type-of-stdin'
  // debug 'Ωjsonick___2', require 'bricabrac-sfmodules'
  ({get_type_of_stdin, get_type_of_stdout} = require('../../bricabrac-sfmodules/lib/cli-get-type-of-stdin-stdout'));

  ({Grammar, Level, Token, Lexeme, rx, internals} = require('interlex'));

  grammar = null;

  //===========================================================================================================
  // { condense_lexemes
  //   abbrlxm
  //   tabulate_lexemes
  //   tabulate_lexeme       } = re quire '../../hengist-NG/dev/interlex/lib/helpers'

  //-----------------------------------------------------------------------------------------------------------
  /* thx to
    https://github.com/mathiasbynens/mothereff.in/blob/master/js-variables/eff.js
    https://mathiasbynens.be/notes/javascript-identifiers-es6
  */
  // jsidentifier_pattern = /// ^
  //   (?: [ $_ ]                    | \p{ID_Start}    )
  //   (?: [ $ _ \u{200c} \u{200d} ] | \p{ID_Continue} )*
  //   $ ///v
  nre = /(?:[$_]|\p{ID_Start})(?:[$_\-\u200c\u200d]|\p{ID_Continue})*/v;

  // nre = jsonic_option_re.source

  //-----------------------------------------------------------------------------------------------------------
  new_grammar = function() {
    var R, gnd;
    R = new Grammar({
      name: 'g',
      linking: false,
      emit_signals: false
    });
    gnd = R.new_level({
      name: 'gnd'
    });
    gnd.new_token('fence', '--', {
      data: {
        slot: null,
        type: 'fence',
        string: '--'
      }
    });
    gnd.new_token('numberlit', rx`(?<string>[+\-]?[.]?[0-9].*)$`, {
      data: {
        slot: 'd',
        type: 'numberlit'
      }
    });
    gnd.new_token('escaped', rx`%(?<string>.+)$`, {
      data: {
        slot: 'd',
        type: 'escaped'
      }
    });
    gnd.new_token('btrue', rx`\+((?<xslot>d)\.)?(?<name>${nre})$`, {
      data: {
        slot: 'c',
        type: 'boolean',
        string: 'true',
        value: true
      }
    });
    gnd.new_token('bfalse', rx`-((?<xslot>d)\.)?(?<name>${nre})$`, {
      data: {
        slot: 'c',
        type: 'boolean',
        string: 'false',
        value: false
      }
    });
    gnd.new_token('objectlit', rx`(?<string>\{.*)$`, {
      data: {
        slot: 'd',
        type: 'objectlit'
      }
    });
    gnd.new_token('listlit', rx`(?<string>\[.*)$`, {
      data: {
        slot: 'd',
        type: 'listlit'
      }
    });
    gnd.new_token('facet', rx`:((?<xslot>d)\.)?(?<name>${nre})=(?<string>.*)$`, {
      data: {
        slot: 'c',
        type: 'facet'
      }
    });
    gnd.new_token('other', rx`(?<string>[\-+:\{\[].*)$`, {
      data: {
        slot: 'e',
        type: 'other',
        name: null
      }
    });
    gnd.new_token('word', rx`(?<string>.+)$`, {
      data: {
        slot: 'd',
        type: 'word',
        name: null
      }
    });
    return R;
  };

  // #---------------------------------------------------------------------------------------------------------
  // get_type_of_stdin = ->
  //   stats = FS.fstatSync 0
  //   # return process.stdin if stats.isFIFO()
  //   return 'tty'    if process.stdin.isTTY
  //   return 'pipe'   if stats.isFIFO()
  //   return 'file'   if stats.isFile()
  //   return 'socket' if stats.isSocket()
  //   return 'other'   # z.B. /dev/null, Block Device
  // return null

  //-----------------------------------------------------------------------------------------------------------
  new_facet = function(name, value) {
    var R;
    R = Object.create(null);
    R[name] = value;
    return R;
  };

  //-----------------------------------------------------------------------------------------------------------
  object_from_objectlit = function(objectlit) {
    var R;
    R = Object.create(null);
    Object.assign(R, JSON.parse(objectlit));
    return R;
  };

  //-----------------------------------------------------------------------------------------------------------
  list_from_listlit = function(listlit) {
    return JSON.parse(listlit);
  };

  //-----------------------------------------------------------------------------------------------------------
  parse_argv = function(argv = null) {
    var R, argument, error, i, len, lexemes, method, name, past_fence, slot, string, type, value, xslot;
    argv = argv != null ? [...argv] : process.argv.slice(2);
    R = {
      a: argv,
      c: [],
      d: [],
      e: [],
      i: get_type_of_stdin(),
      o: get_type_of_stdout(),
      t: {
        c: [],
        d: [],
        e: []
      }
    };
    // debug 'Ωjsonick___1', argv
    past_fence = false;
    if (grammar == null) {
      grammar = new_grammar();
    }
    for (i = 0, len = argv.length; i < len; i++) {
      argument = argv[i];
      //.....................................................................................................
      if (past_fence) {
        R.d.push(argument);
        continue;
      }
      //.....................................................................................................
      lexemes = grammar.scan_to_list(argument);
      //.....................................................................................................
      if (lexemes.length !== 1) {
        R.e.push(argument);
        continue;
      }
      //.....................................................................................................
      // tabulate_lexeme lexemes[ 0 ] ### !!!!!!!!!!!!!!! ###
      ({xslot, slot, type, name, value, string} = lexemes[0].data);
      slot = xslot != null ? xslot : slot;
      //.......................................................................................................
      switch (type) {
        case 'boolean':
          R[slot].push(new_facet(name, value));
          break;
        case 'facet':
          R[slot].push(new_facet(name, string));
          break;
        case 'other':
        case 'escaped':
        case 'word':
        case 'numberlit':
          R[slot].push(string);
          break;
        //.....................................................................................................
        case 'objectlit':
        case 'listlit':
          method = type === 'objectlit' ? object_from_objectlit : list_from_listlit;
          try {
            R[slot].push(method(string));
          } catch (error1) {
            error = error1;
            if (!(error instanceof SyntaxError)) {
              throw error;
            }
            R.e.push(string);
            slot = 'e';
            type = `e${type}`;
          }
          break;
        //.....................................................................................................
        case 'fence':
          past_fence = true;
          continue;
        default:
          //.....................................................................................................
          throw new Error(`Ωjsonick___2 should never happen: unknown lexeme type ${rpr(type)}`);
      }
      R.t[slot].push(type);
    }
    return R;
  };

  //-----------------------------------------------------------------------------------------------------------
  _isa_null_pod = function(x) {
    return (Object.getPrototypeOf(x)) === null;
  };

  //-----------------------------------------------------------------------------------------------------------
  show_cdef = function(cdef) {
    process.stdout.write(JSON.stringify(cdef));
    return null;
  };

  //===========================================================================================================
  demo = function() {
    var cdef;
    //---------------------------------------------------------------------------------------------------------
    // PQ  = process.argv[ 2 .. ]
    cdef = parse_argv();
    show_cdef(cdef);
    /*
    [ 'replace:4', '+upper-case', '+', '-verbose', '{d:8}', '{s:true,+bool,}', 'words:a b', '{', '{"name":true,"width":445}' ]
    */
    return null;
  };

  //===========================================================================================================
  module.exports = {parse_argv};

  //===========================================================================================================
  if (module === require.main) {
    (() => {
      demo();
      return null;
    })();
  }

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2FuYWx5emUtY2xpLWFyZ3VtZW50cy1waGFzZS0xLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBZTtFQUFBO0VBRWY7QUFGZSxNQUFBLEdBQUEsRUFBQSxPQUFBLEVBQUEsS0FBQSxFQUFBLE1BQUEsRUFBQSxLQUFBLEVBQUEsYUFBQSxFQUFBLEtBQUEsRUFBQSxJQUFBLEVBQUEsSUFBQSxFQUFBLEtBQUEsRUFBQSxJQUFBLEVBQUEsSUFBQSxFQUFBLGlCQUFBLEVBQUEsa0JBQUEsRUFBQSxJQUFBLEVBQUEsT0FBQSxFQUFBLEtBQUEsRUFBQSxJQUFBLEVBQUEsSUFBQSxFQUFBLElBQUEsRUFBQSxPQUFBLEVBQUEsU0FBQSxFQUFBLGlCQUFBLEVBQUEsR0FBQSxFQUFBLFNBQUEsRUFBQSxXQUFBLEVBQUEsR0FBQSxFQUFBLHFCQUFBLEVBQUEsVUFBQSxFQUFBLEtBQUEsRUFBQSxNQUFBLEVBQUEsR0FBQSxFQUFBLE9BQUEsRUFBQSxHQUFBLEVBQUEsRUFBQSxFQUFBLFNBQUEsRUFBQSxJQUFBLEVBQUEsSUFBQSxFQUFBLE9BQUEsRUFBQSxLQUFBOzs7RUFLZixHQUFBLEdBQTRCLE9BQUEsQ0FBUSxLQUFSOztFQUM1QixDQUFBLENBQUUsS0FBRixFQUNFLEtBREYsRUFFRSxJQUZGLEVBR0UsSUFIRixFQUlFLEtBSkYsRUFLRSxNQUxGLEVBTUUsSUFORixFQU9FLElBUEYsRUFRRSxPQVJGLENBQUEsR0FRNEIsR0FBRyxDQUFDLEdBQUcsQ0FBQyxXQUFSLENBQW9CLHlCQUFwQixDQVI1Qjs7RUFTQSxDQUFBLENBQUUsR0FBRixFQUNFLE9BREYsRUFFRSxJQUZGLEVBR0UsS0FIRixFQUlFLEtBSkYsRUFLRSxJQUxGLEVBTUUsSUFORixFQU9FLElBUEYsRUFRRSxHQVJGLEVBU0UsSUFURixFQVVFLE9BVkYsRUFXRSxHQVhGLENBQUEsR0FXNEIsR0FBRyxDQUFDLEdBWGhDLEVBZmU7Ozs7Ozs7OztFQW1DZixDQUFBLENBQUUsaUJBQUYsRUFDRSxrQkFERixDQUFBLEdBQzRCLE9BQUEsQ0FBUSw0REFBUixDQUQ1Qjs7RUFFQSxDQUFBLENBQUUsT0FBRixFQUNFLEtBREYsRUFFRSxLQUZGLEVBR0UsTUFIRixFQUlFLEVBSkYsRUFLRSxTQUxGLENBQUEsR0FLNEIsT0FBQSxDQUFRLFVBQVIsQ0FMNUI7O0VBTUEsT0FBQSxHQUE0QixLQTNDYjs7Ozs7Ozs7Ozs7Ozs7Ozs7RUE0RGYsR0FBQSxHQUFNLGdFQTVEUzs7Ozs7RUFtRWYsV0FBQSxHQUFjLFFBQUEsQ0FBQSxDQUFBO0FBQ2QsUUFBQSxDQUFBLEVBQUE7SUFBRSxDQUFBLEdBQU0sSUFBSSxPQUFKLENBQVk7TUFBRSxJQUFBLEVBQU0sR0FBUjtNQUFhLE9BQUEsRUFBUyxLQUF0QjtNQUE2QixZQUFBLEVBQWM7SUFBM0MsQ0FBWjtJQUNOLEdBQUEsR0FBTSxDQUFDLENBQUMsU0FBRixDQUFZO01BQUUsSUFBQSxFQUFNO0lBQVIsQ0FBWjtJQUNOLEdBQUcsQ0FBQyxTQUFKLENBQWMsT0FBZCxFQUF3QixJQUF4QixFQUFrRjtNQUFFLElBQUEsRUFBTTtRQUFFLElBQUEsRUFBTSxJQUFSO1FBQWMsSUFBQSxFQUFNLE9BQXBCO1FBQTZCLE1BQUEsRUFBUTtNQUFyQztJQUFSLENBQWxGO0lBQ0EsR0FBRyxDQUFDLFNBQUosQ0FBYyxXQUFkLEVBQTRCLEVBQUUsQ0FBQSw2QkFBQSxDQUE5QixFQUFrRjtNQUFFLElBQUEsRUFBTTtRQUFFLElBQUEsRUFBTSxHQUFSO1FBQWEsSUFBQSxFQUFNO01BQW5CO0lBQVIsQ0FBbEY7SUFDQSxHQUFHLENBQUMsU0FBSixDQUFjLFNBQWQsRUFBNEIsRUFBRSxDQUFBLGVBQUEsQ0FBOUIsRUFBa0Y7TUFBRSxJQUFBLEVBQU07UUFBRSxJQUFBLEVBQU0sR0FBUjtRQUFhLElBQUEsRUFBTTtNQUFuQjtJQUFSLENBQWxGO0lBQ0EsR0FBRyxDQUFDLFNBQUosQ0FBYyxPQUFkLEVBQTRCLEVBQUUsQ0FBQSwwQkFBQSxDQUFBLENBQTZCLEdBQTdCLENBQUEsRUFBQSxDQUE5QixFQUFrRjtNQUFFLElBQUEsRUFBTTtRQUFFLElBQUEsRUFBTSxHQUFSO1FBQWEsSUFBQSxFQUFNLFNBQW5CO1FBQThCLE1BQUEsRUFBUSxNQUF0QztRQUFnRCxLQUFBLEVBQU87TUFBdkQ7SUFBUixDQUFsRjtJQUNBLEdBQUcsQ0FBQyxTQUFKLENBQWMsUUFBZCxFQUE0QixFQUFFLENBQUEseUJBQUEsQ0FBQSxDQUE0QixHQUE1QixDQUFBLEVBQUEsQ0FBOUIsRUFBa0Y7TUFBRSxJQUFBLEVBQU07UUFBRSxJQUFBLEVBQU0sR0FBUjtRQUFhLElBQUEsRUFBTSxTQUFuQjtRQUE4QixNQUFBLEVBQVEsT0FBdEM7UUFBZ0QsS0FBQSxFQUFPO01BQXZEO0lBQVIsQ0FBbEY7SUFDQSxHQUFHLENBQUMsU0FBSixDQUFjLFdBQWQsRUFBNEIsRUFBRSxDQUFBLGdCQUFBLENBQTlCLEVBQWtGO01BQUUsSUFBQSxFQUFNO1FBQUUsSUFBQSxFQUFNLEdBQVI7UUFBYSxJQUFBLEVBQU07TUFBbkI7SUFBUixDQUFsRjtJQUNBLEdBQUcsQ0FBQyxTQUFKLENBQWMsU0FBZCxFQUE0QixFQUFFLENBQUEsZ0JBQUEsQ0FBOUIsRUFBa0Y7TUFBRSxJQUFBLEVBQU07UUFBRSxJQUFBLEVBQU0sR0FBUjtRQUFhLElBQUEsRUFBTTtNQUFuQjtJQUFSLENBQWxGO0lBQ0EsR0FBRyxDQUFDLFNBQUosQ0FBYyxPQUFkLEVBQTRCLEVBQUUsQ0FBQSx5QkFBQSxDQUFBLENBQTRCLEdBQTVCLENBQUEsZ0JBQUEsQ0FBOUIsRUFBa0Y7TUFBRSxJQUFBLEVBQU07UUFBRSxJQUFBLEVBQU0sR0FBUjtRQUFhLElBQUEsRUFBTTtNQUFuQjtJQUFSLENBQWxGO0lBQ0EsR0FBRyxDQUFDLFNBQUosQ0FBYyxPQUFkLEVBQTRCLEVBQUUsQ0FBQSx3QkFBQSxDQUE5QixFQUFrRjtNQUFFLElBQUEsRUFBTTtRQUFFLElBQUEsRUFBTSxHQUFSO1FBQWEsSUFBQSxFQUFNLE9BQW5CO1FBQTRCLElBQUEsRUFBTTtNQUFsQztJQUFSLENBQWxGO0lBQ0EsR0FBRyxDQUFDLFNBQUosQ0FBYyxNQUFkLEVBQTRCLEVBQUUsQ0FBQSxjQUFBLENBQTlCLEVBQWtGO01BQUUsSUFBQSxFQUFNO1FBQUUsSUFBQSxFQUFNLEdBQVI7UUFBYSxJQUFBLEVBQU0sTUFBbkI7UUFBMkIsSUFBQSxFQUFNO01BQWpDO0lBQVIsQ0FBbEY7QUFDQSxXQUFPO0VBYkssRUFuRUM7Ozs7Ozs7Ozs7Ozs7O0VBNkZmLFNBQUEsR0FBWSxRQUFBLENBQUUsSUFBRixFQUFRLEtBQVIsQ0FBQTtBQUFrQixRQUFBO0lBQUMsQ0FBQSxHQUFJLE1BQU0sQ0FBQyxNQUFQLENBQWMsSUFBZDtJQUFvQixDQUFDLENBQUUsSUFBRixDQUFELEdBQVk7V0FBTztFQUE5RCxFQTdGRzs7O0VBZ0dmLHFCQUFBLEdBQXdCLFFBQUEsQ0FBRSxTQUFGLENBQUE7QUFDeEIsUUFBQTtJQUFFLENBQUEsR0FBSSxNQUFNLENBQUMsTUFBUCxDQUFjLElBQWQ7SUFDSixNQUFNLENBQUMsTUFBUCxDQUFjLENBQWQsRUFBaUIsSUFBSSxDQUFDLEtBQUwsQ0FBVyxTQUFYLENBQWpCO0FBQ0EsV0FBTztFQUhlLEVBaEdUOzs7RUFzR2YsaUJBQUEsR0FBb0IsUUFBQSxDQUFFLE9BQUYsQ0FBQTtXQUFlLElBQUksQ0FBQyxLQUFMLENBQVcsT0FBWDtFQUFmLEVBdEdMOzs7RUF5R2YsVUFBQSxHQUFhLFFBQUEsQ0FBRSxPQUFPLElBQVQsQ0FBQTtBQUNiLFFBQUEsQ0FBQSxFQUFBLFFBQUEsRUFBQSxLQUFBLEVBQUEsQ0FBQSxFQUFBLEdBQUEsRUFBQSxPQUFBLEVBQUEsTUFBQSxFQUFBLElBQUEsRUFBQSxVQUFBLEVBQUEsSUFBQSxFQUFBLE1BQUEsRUFBQSxJQUFBLEVBQUEsS0FBQSxFQUFBO0lBQUUsSUFBQSxHQUFpQixZQUFILEdBQWMsQ0FBRSxHQUFBLElBQUYsQ0FBZCxHQUFnQyxPQUFPLENBQUMsSUFBSTtJQUMxRCxDQUFBLEdBQWM7TUFBRSxDQUFBLEVBQUcsSUFBTDtNQUFXLENBQUEsRUFBRyxFQUFkO01BQWtCLENBQUEsRUFBRyxFQUFyQjtNQUF5QixDQUFBLEVBQUcsRUFBNUI7TUFBZ0MsQ0FBQSxFQUFHLGlCQUFBLENBQUEsQ0FBbkM7TUFBd0QsQ0FBQSxFQUFHLGtCQUFBLENBQUEsQ0FBM0Q7TUFBaUYsQ0FBQSxFQUFHO1FBQUUsQ0FBQSxFQUFHLEVBQUw7UUFBUyxDQUFBLEVBQUcsRUFBWjtRQUFnQixDQUFBLEVBQUc7TUFBbkI7SUFBcEYsRUFEaEI7O0lBR0UsVUFBQSxHQUFjOztNQUNkLFVBQWMsV0FBQSxDQUFBOztJQUNkLEtBQUEsc0NBQUE7eUJBQUE7O01BRUUsSUFBRyxVQUFIO1FBQ0UsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFKLENBQVMsUUFBVDtBQUNBLGlCQUZGO09BREo7O01BS0ksT0FBQSxHQUFVLE9BQU8sQ0FBQyxZQUFSLENBQXFCLFFBQXJCLEVBTGQ7O01BT0ksSUFBTyxPQUFPLENBQUMsTUFBUixLQUFrQixDQUF6QjtRQUNFLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSixDQUFTLFFBQVQ7QUFDQSxpQkFGRjtPQVBKOzs7TUFZSSxDQUFBLENBQUUsS0FBRixFQUNFLElBREYsRUFFRSxJQUZGLEVBR0UsSUFIRixFQUlFLEtBSkYsRUFLRSxNQUxGLENBQUEsR0FLYSxPQUFPLENBQUUsQ0FBRixDQUFLLENBQUMsSUFMMUI7TUFNQSxJQUFBLG1CQUFPLFFBQVEsS0FsQm5COztBQW9CSSxjQUFPLElBQVA7QUFBQSxhQUNPLFNBRFA7VUFDcUQsQ0FBQyxDQUFFLElBQUYsQ0FBUSxDQUFDLElBQVYsQ0FBZSxTQUFBLENBQVUsSUFBVixFQUFnQixLQUFoQixDQUFmO0FBQTlDO0FBRFAsYUFFTyxPQUZQO1VBRXFELENBQUMsQ0FBRSxJQUFGLENBQVEsQ0FBQyxJQUFWLENBQWUsU0FBQSxDQUFVLElBQVYsRUFBZ0IsTUFBaEIsQ0FBZjtBQUE5QztBQUZQLGFBR08sT0FIUDtBQUFBLGFBR2dCLFNBSGhCO0FBQUEsYUFHMkIsTUFIM0I7QUFBQSxhQUdtQyxXQUhuQztVQUdxRCxDQUFDLENBQUUsSUFBRixDQUFRLENBQUMsSUFBVixDQUFlLE1BQWY7QUFBbEI7O0FBSG5DLGFBS08sV0FMUDtBQUFBLGFBS29CLFNBTHBCO1VBTUksTUFBQSxHQUFZLElBQUEsS0FBUSxXQUFYLEdBQTRCLHFCQUE1QixHQUF1RDtBQUNoRTtZQUNFLENBQUMsQ0FBRSxJQUFGLENBQVEsQ0FBQyxJQUFWLENBQWUsTUFBQSxDQUFPLE1BQVAsQ0FBZixFQURGO1dBRUEsY0FBQTtZQUFNO1lBQ0osTUFBbUIsS0FBQSxZQUFpQixZQUFwQztjQUFBLE1BQU0sTUFBTjs7WUFDQSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUosQ0FBUyxNQUFUO1lBQ0EsSUFBQSxHQUFRO1lBQ1IsSUFBQSxHQUFRLENBQUEsQ0FBQSxDQUFBLENBQUksSUFBSixDQUFBLEVBSlY7O0FBSmdCOztBQUxwQixhQWVPLE9BZlA7VUFnQkksVUFBQSxHQUFhO0FBQ2I7QUFqQko7O1VBbUJPLE1BQU0sSUFBSSxLQUFKLENBQVUsQ0FBQSxzREFBQSxDQUFBLENBQXlELEdBQUEsQ0FBSSxJQUFKLENBQXpELENBQUEsQ0FBVjtBQW5CYjtNQW9CQSxDQUFDLENBQUMsQ0FBQyxDQUFFLElBQUYsQ0FBUSxDQUFDLElBQVosQ0FBaUIsSUFBakI7SUF6Q0Y7QUEwQ0EsV0FBTztFQWhESSxFQXpHRTs7O0VBNEpmLGFBQUEsR0FBZ0IsUUFBQSxDQUFFLENBQUYsQ0FBQTtXQUFTLENBQUUsTUFBTSxDQUFDLGNBQVAsQ0FBc0IsQ0FBdEIsQ0FBRixDQUFBLEtBQStCO0VBQXhDLEVBNUpEOzs7RUErSmYsU0FBQSxHQUFZLFFBQUEsQ0FBRSxJQUFGLENBQUE7SUFDVixPQUFPLENBQUMsTUFBTSxDQUFDLEtBQWYsQ0FBcUIsSUFBSSxDQUFDLFNBQUwsQ0FBZSxJQUFmLENBQXJCO1dBQ0M7RUFGUyxFQS9KRzs7O0VBcUtmLElBQUEsR0FBTyxRQUFBLENBQUEsQ0FBQTtBQUNQLFFBQUEsSUFBQTs7O0lBRUUsSUFBQSxHQUFZLFVBQUEsQ0FBQTtJQUNaLFNBQUEsQ0FBVSxJQUFWLEVBSEY7Ozs7V0FPRztFQVJJLEVBcktROzs7RUFpTGYsTUFBTSxDQUFDLE9BQVAsR0FBaUIsQ0FBRSxVQUFGLEVBakxGOzs7RUFvTGYsSUFBRyxNQUFBLEtBQVUsT0FBTyxDQUFDLElBQXJCO0lBQWtDLENBQUEsQ0FBQSxDQUFBLEdBQUE7TUFDaEMsSUFBQSxDQUFBO2FBQ0M7SUFGK0IsQ0FBQSxJQUFsQzs7QUFwTGUiLCJzb3VyY2VzQ29udGVudCI6WyIjIS9iaW4vZW52IG5vZGVcblxuJ3VzZSBzdHJpY3QnXG5cbiM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuR1VZICAgICAgICAgICAgICAgICAgICAgICA9IHJlcXVpcmUgJ2d1eSdcbnsgYWxlcnRcbiAgZGVidWdcbiAgaGVscFxuICBpbmZvXG4gIHBsYWluXG4gIHByYWlzZVxuICB1cmdlXG4gIHdhcm5cbiAgd2hpc3BlciB9ICAgICAgICAgICAgICAgPSBHVVkudHJtLmdldF9sb2dnZXJzICdub3JtYWxpemUtY2xpLWFyZ3VtZW50cydcbnsgcnByXG4gIGluc3BlY3RcbiAgZWNob1xuICB3aGl0ZVxuICBncmVlblxuICBibHVlXG4gIGdvbGRcbiAgZ3JleVxuICByZWRcbiAgYm9sZFxuICByZXZlcnNlXG4gIGxvZyAgICAgfSAgICAgICAgICAgICAgID0gR1VZLnRybVxuXG4jLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiMgU0ZNT0RVTEVTICAgICAgICAgICAgICAgICA9IHJlcXVpcmUgJ2JyaWNhYnJhYy1zZm1vZHVsZXMnXG4jIHsgdHlwZV9vZiwgICAgICAgICAgICAgIH0gPSBTRk1PRFVMRVMudW5zdGFibGUucmVxdWlyZV90eXBlX29mKClcbiMgeyBKZXRzdHJlYW0sXG4jICAgaW50ZXJuYWxzLCAgICAgICAgICAgIH0gPSBTRk1PRFVMRVMucmVxdWlyZV9qZXRzdHJlYW0oKVxuIyB7IGdldF90eXBlX29mX3N0ZGluLCAgICB9ID0gcmVxdWlyZSAnYnJpY2FicmFjLXNmbW9kdWxlcy9saWIvY2xpLWdldC10eXBlLW9mLXN0ZGluJ1xuIyBkZWJ1ZyAnzqlqc29uaWNrX19fMicsIHJlcXVpcmUgJ2JyaWNhYnJhYy1zZm1vZHVsZXMnXG57IGdldF90eXBlX29mX3N0ZGluXG4gIGdldF90eXBlX29mX3N0ZG91dCAgICB9ID0gcmVxdWlyZSAnLi4vLi4vYnJpY2FicmFjLXNmbW9kdWxlcy9saWIvY2xpLWdldC10eXBlLW9mLXN0ZGluLXN0ZG91dCdcbnsgR3JhbW1hclxuICBMZXZlbFxuICBUb2tlblxuICBMZXhlbWVcbiAgcnhcbiAgaW50ZXJuYWxzICAgICAgICAgICAgIH0gPSByZXF1aXJlICdpbnRlcmxleCdcbmdyYW1tYXIgICAgICAgICAgICAgICAgICAgPSBudWxsXG5cbiM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuIyB7IGNvbmRlbnNlX2xleGVtZXNcbiMgICBhYmJybHhtXG4jICAgdGFidWxhdGVfbGV4ZW1lc1xuIyAgIHRhYnVsYXRlX2xleGVtZSAgICAgICB9ID0gcmUgcXVpcmUgJy4uLy4uL2hlbmdpc3QtTkcvZGV2L2ludGVybGV4L2xpYi9oZWxwZXJzJ1xuXG4jLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiMjIyB0aHggdG9cbiAgaHR0cHM6Ly9naXRodWIuY29tL21hdGhpYXNieW5lbnMvbW90aGVyZWZmLmluL2Jsb2IvbWFzdGVyL2pzLXZhcmlhYmxlcy9lZmYuanNcbiAgaHR0cHM6Ly9tYXRoaWFzYnluZW5zLmJlL25vdGVzL2phdmFzY3JpcHQtaWRlbnRpZmllcnMtZXM2XG4jIyNcbiMganNpZGVudGlmaWVyX3BhdHRlcm4gPSAvLy8gXlxuIyAgICg/OiBbICRfIF0gICAgICAgICAgICAgICAgICAgIHwgXFxwe0lEX1N0YXJ0fSAgICApXG4jICAgKD86IFsgJCBfIFxcdXsyMDBjfSBcXHV7MjAwZH0gXSB8IFxccHtJRF9Db250aW51ZX0gKSpcbiMgICAkIC8vL3Zcbm5yZSA9IC8vL1xuICAoPzogWyAkXyBdICAgICAgICAgICAgICAgICAgICAgICAgfCBcXHB7SURfU3RhcnR9ICAgIClcbiAgKD86IFsgJCBfIFxcLSBcXHV7MjAwY30gXFx1ezIwMGR9IF0gIHwgXFxwe0lEX0NvbnRpbnVlfSApKlxuICAvLy92XG4jIG5yZSA9IGpzb25pY19vcHRpb25fcmUuc291cmNlXG5cbiMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxubmV3X2dyYW1tYXIgPSAtPlxuICBSICAgPSBuZXcgR3JhbW1hciB7IG5hbWU6ICdnJywgbGlua2luZzogZmFsc2UsIGVtaXRfc2lnbmFsczogZmFsc2UsIH1cbiAgZ25kID0gUi5uZXdfbGV2ZWwgeyBuYW1lOiAnZ25kJywgfVxuICBnbmQubmV3X3Rva2VuICdmZW5jZScsICAnLS0nLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyBkYXRhOiB7IHNsb3Q6IG51bGwsIHR5cGU6ICdmZW5jZScsIHN0cmluZzogJy0tJywgIH0sIH1cbiAgZ25kLm5ld190b2tlbiAnbnVtYmVybGl0JywgIHJ4XCIoPzxzdHJpbmc+WytcXC1dP1suXT9bMC05XS4qKSRcIiwgICAgICAgICAgICAgICAgICAgIHsgZGF0YTogeyBzbG90OiAnZCcsIHR5cGU6ICdudW1iZXJsaXQnLCB9LCB9XG4gIGduZC5uZXdfdG9rZW4gJ2VzY2FwZWQnLCAgICByeFwiJSg/PHN0cmluZz4uKykkXCIsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgZGF0YTogeyBzbG90OiAnZCcsIHR5cGU6ICdlc2NhcGVkJywgfSwgfVxuICBnbmQubmV3X3Rva2VuICdidHJ1ZScsICAgICAgcnhcIlxcKygoPzx4c2xvdD5kKVxcLik/KD88bmFtZT4je25yZX0pJFwiLCAgICAgICAgICAgICAgIHsgZGF0YTogeyBzbG90OiAnYycsIHR5cGU6ICdib29sZWFuJywgc3RyaW5nOiAndHJ1ZScsICAgdmFsdWU6IHRydWUsICB9LCB9XG4gIGduZC5uZXdfdG9rZW4gJ2JmYWxzZScsICAgICByeFwiLSgoPzx4c2xvdD5kKVxcLik/KD88bmFtZT4je25yZX0pJFwiLCAgICAgICAgICAgICAgICB7IGRhdGE6IHsgc2xvdDogJ2MnLCB0eXBlOiAnYm9vbGVhbicsIHN0cmluZzogJ2ZhbHNlJywgIHZhbHVlOiBmYWxzZSwgfSwgfVxuICBnbmQubmV3X3Rva2VuICdvYmplY3RsaXQnLCAgcnhcIig/PHN0cmluZz5cXHsuKikkXCIsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyBkYXRhOiB7IHNsb3Q6ICdkJywgdHlwZTogJ29iamVjdGxpdCcsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIH1cbiAgZ25kLm5ld190b2tlbiAnbGlzdGxpdCcsICAgIHJ4XCIoPzxzdHJpbmc+XFxbLiopJFwiLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgZGF0YTogeyBzbG90OiAnZCcsIHR5cGU6ICdsaXN0bGl0JywgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIH1cbiAgZ25kLm5ld190b2tlbiAnZmFjZXQnLCAgICAgIHJ4XCI6KCg/PHhzbG90PmQpXFwuKT8oPzxuYW1lPiN7bnJlfSk9KD88c3RyaW5nPi4qKSRcIiwgIHsgZGF0YTogeyBzbG90OiAnYycsIHR5cGU6ICdmYWNldCcsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgfVxuICBnbmQubmV3X3Rva2VuICdvdGhlcicsICAgICAgcnhcIig/PHN0cmluZz5bXFwtKzpcXHtcXFtdLiopJFwiLCAgICAgICAgICAgICAgICAgICAgICAgICB7IGRhdGE6IHsgc2xvdDogJ2UnLCB0eXBlOiAnb3RoZXInLCBuYW1lOiBudWxsLCAgICAgICAgICAgICAgICAgICAgIH0sIH1cbiAgZ25kLm5ld190b2tlbiAnd29yZCcsICAgICAgIHJ4XCIoPzxzdHJpbmc+LispJFwiLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyBkYXRhOiB7IHNsb3Q6ICdkJywgdHlwZTogJ3dvcmQnLCBuYW1lOiBudWxsLCAgICAgICAgICAgICAgICAgICAgIH0sIH1cbiAgcmV0dXJuIFJcbiMgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuIyBnZXRfdHlwZV9vZl9zdGRpbiA9IC0+XG4jICAgc3RhdHMgPSBGUy5mc3RhdFN5bmMgMFxuIyAgICMgcmV0dXJuIHByb2Nlc3Muc3RkaW4gaWYgc3RhdHMuaXNGSUZPKClcbiMgICByZXR1cm4gJ3R0eScgICAgaWYgcHJvY2Vzcy5zdGRpbi5pc1RUWVxuIyAgIHJldHVybiAncGlwZScgICBpZiBzdGF0cy5pc0ZJRk8oKVxuIyAgIHJldHVybiAnZmlsZScgICBpZiBzdGF0cy5pc0ZpbGUoKVxuIyAgIHJldHVybiAnc29ja2V0JyBpZiBzdGF0cy5pc1NvY2tldCgpXG4jICAgcmV0dXJuICdvdGhlcicgICAjIHouQi4gL2Rldi9udWxsLCBCbG9jayBEZXZpY2VcbiAgIyByZXR1cm4gbnVsbFxuXG4jLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbm5ld19mYWNldCA9ICggbmFtZSwgdmFsdWUgKSAtPiBSID0gT2JqZWN0LmNyZWF0ZSBudWxsOyBSWyBuYW1lIF0gPSB2YWx1ZTsgUlxuXG4jLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbm9iamVjdF9mcm9tX29iamVjdGxpdCA9ICggb2JqZWN0bGl0ICkgLT5cbiAgUiA9IE9iamVjdC5jcmVhdGUgbnVsbFxuICBPYmplY3QuYXNzaWduIFIsIEpTT04ucGFyc2Ugb2JqZWN0bGl0XG4gIHJldHVybiBSXG5cbiMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxubGlzdF9mcm9tX2xpc3RsaXQgPSAoIGxpc3RsaXQgKSAtPiBKU09OLnBhcnNlIGxpc3RsaXRcblxuIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5wYXJzZV9hcmd2ID0gKCBhcmd2ID0gbnVsbCApIC0+XG4gIGFyZ3YgICAgICAgID0gaWYgYXJndj8gdGhlbiBbIGFyZ3YuLi4sIF0gZWxzZSBwcm9jZXNzLmFyZ3ZbIDIgLi4gXVxuICBSICAgICAgICAgICA9IHsgYTogYXJndiwgYzogW10sIGQ6IFtdLCBlOiBbXSwgaTogZ2V0X3R5cGVfb2Zfc3RkaW4oKSwgbzogZ2V0X3R5cGVfb2Zfc3Rkb3V0KCksIHQ6IHsgYzogW10sIGQ6IFtdLCBlOiBbXSwgfSB9XG4gICMgZGVidWcgJ86panNvbmlja19fXzEnLCBhcmd2XG4gIHBhc3RfZmVuY2UgID0gZmFsc2VcbiAgZ3JhbW1hciAgICA/PSBuZXdfZ3JhbW1hcigpXG4gIGZvciBhcmd1bWVudCBpbiBhcmd2XG4gICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgaWYgcGFzdF9mZW5jZVxuICAgICAgUi5kLnB1c2ggYXJndW1lbnRcbiAgICAgIGNvbnRpbnVlXG4gICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgbGV4ZW1lcyA9IGdyYW1tYXIuc2Nhbl90b19saXN0IGFyZ3VtZW50XG4gICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgdW5sZXNzIGxleGVtZXMubGVuZ3RoIGlzIDFcbiAgICAgIFIuZS5wdXNoIGFyZ3VtZW50XG4gICAgICBjb250aW51ZVxuICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICMgdGFidWxhdGVfbGV4ZW1lIGxleGVtZXNbIDAgXSAjIyMgISEhISEhISEhISEhISEhICMjI1xuICAgIHsgeHNsb3RcbiAgICAgIHNsb3RcbiAgICAgIHR5cGVcbiAgICAgIG5hbWVcbiAgICAgIHZhbHVlXG4gICAgICBzdHJpbmcgfSA9IGxleGVtZXNbIDAgXS5kYXRhXG4gICAgc2xvdCA9IHhzbG90ID8gc2xvdFxuICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgc3dpdGNoIHR5cGVcbiAgICAgIHdoZW4gJ2Jvb2xlYW4nICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGVuIFJbIHNsb3QgXS5wdXNoIG5ld19mYWNldCBuYW1lLCB2YWx1ZVxuICAgICAgd2hlbiAnZmFjZXQnICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoZW4gUlsgc2xvdCBdLnB1c2ggbmV3X2ZhY2V0IG5hbWUsIHN0cmluZ1xuICAgICAgd2hlbiAnb3RoZXInLCAnZXNjYXBlZCcsICd3b3JkJywgJ251bWJlcmxpdCcgIHRoZW4gUlsgc2xvdCBdLnB1c2ggc3RyaW5nXG4gICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgIHdoZW4gJ29iamVjdGxpdCcsICdsaXN0bGl0J1xuICAgICAgICBtZXRob2QgPSBpZiB0eXBlIGlzICdvYmplY3RsaXQnIHRoZW4gb2JqZWN0X2Zyb21fb2JqZWN0bGl0IGVsc2UgbGlzdF9mcm9tX2xpc3RsaXRcbiAgICAgICAgdHJ5XG4gICAgICAgICAgUlsgc2xvdCBdLnB1c2ggbWV0aG9kIHN0cmluZ1xuICAgICAgICBjYXRjaCBlcnJvclxuICAgICAgICAgIHRocm93IGVycm9yIHVubGVzcyBlcnJvciBpbnN0YW5jZW9mIFN5bnRheEVycm9yXG4gICAgICAgICAgUi5lLnB1c2ggc3RyaW5nXG4gICAgICAgICAgc2xvdCAgPSAnZSdcbiAgICAgICAgICB0eXBlICA9IFwiZSN7dHlwZX1cIlxuICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICB3aGVuICdmZW5jZSdcbiAgICAgICAgcGFzdF9mZW5jZSA9IHRydWVcbiAgICAgICAgY29udGludWVcbiAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgZWxzZSB0aHJvdyBuZXcgRXJyb3IgXCLOqWpzb25pY2tfX18yIHNob3VsZCBuZXZlciBoYXBwZW46IHVua25vd24gbGV4ZW1lIHR5cGUgI3tycHIgdHlwZX1cIlxuICAgIFIudFsgc2xvdCBdLnB1c2ggdHlwZVxuICByZXR1cm4gUlxuXG4jLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbl9pc2FfbnVsbF9wb2QgPSAoIHggKSAtPiAoIE9iamVjdC5nZXRQcm90b3R5cGVPZiB4ICkgaXMgbnVsbFxuXG4jLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbnNob3dfY2RlZiA9ICggY2RlZiApIC0+XG4gIHByb2Nlc3Muc3Rkb3V0LndyaXRlIEpTT04uc3RyaW5naWZ5IGNkZWZcbiAgO251bGxcblxuXG4jPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmRlbW8gPSAtPlxuICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICMgUFEgID0gcHJvY2Vzcy5hcmd2WyAyIC4uIF1cbiAgY2RlZiAgICAgID0gcGFyc2VfYXJndigpXG4gIHNob3dfY2RlZiBjZGVmXG4gICMjI1xuICBbICdyZXBsYWNlOjQnLCAnK3VwcGVyLWNhc2UnLCAnKycsICctdmVyYm9zZScsICd7ZDo4fScsICd7czp0cnVlLCtib29sLH0nLCAnd29yZHM6YSBiJywgJ3snLCAne1wibmFtZVwiOnRydWUsXCJ3aWR0aFwiOjQ0NX0nIF1cbiAgIyMjXG4gIDtudWxsXG5cblxuIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5tb2R1bGUuZXhwb3J0cyA9IHsgcGFyc2VfYXJndiwgfVxuXG4jPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmlmIG1vZHVsZSBpcyByZXF1aXJlLm1haW4gdGhlbiBkbyA9PlxuICBkZW1vKClcbiAgO251bGxcbiJdfQ==
