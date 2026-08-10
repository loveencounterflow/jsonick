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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2FuYWx5emUtY2xpLWFyZ3VtZW50cy1waGFzZS0xLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBZTtFQUFBO0VBRWY7QUFGZSxNQUFBLEdBQUEsRUFBQSxPQUFBLEVBQUEsS0FBQSxFQUFBLE1BQUEsRUFBQSxLQUFBLEVBQUEsYUFBQSxFQUFBLEtBQUEsRUFBQSxJQUFBLEVBQUEsSUFBQSxFQUFBLEtBQUEsRUFBQSxJQUFBLEVBQUEsSUFBQSxFQUFBLGlCQUFBLEVBQUEsa0JBQUEsRUFBQSxJQUFBLEVBQUEsT0FBQSxFQUFBLEtBQUEsRUFBQSxJQUFBLEVBQUEsSUFBQSxFQUFBLElBQUEsRUFBQSxPQUFBLEVBQUEsU0FBQSxFQUFBLGlCQUFBLEVBQUEsR0FBQSxFQUFBLFNBQUEsRUFBQSxXQUFBLEVBQUEsR0FBQSxFQUFBLHFCQUFBLEVBQUEsVUFBQSxFQUFBLEtBQUEsRUFBQSxNQUFBLEVBQUEsR0FBQSxFQUFBLE9BQUEsRUFBQSxHQUFBLEVBQUEsRUFBQSxFQUFBLFNBQUEsRUFBQSxJQUFBLEVBQUEsSUFBQSxFQUFBLE9BQUEsRUFBQSxLQUFBOzs7RUFLZixHQUFBLEdBQTRCLE9BQUEsQ0FBUSxLQUFSOztFQUM1QixDQUFBLENBQUUsS0FBRixFQUNFLEtBREYsRUFFRSxJQUZGLEVBR0UsSUFIRixFQUlFLEtBSkYsRUFLRSxNQUxGLEVBTUUsSUFORixFQU9FLElBUEYsRUFRRSxPQVJGLENBQUEsR0FRNEIsR0FBRyxDQUFDLEdBQUcsQ0FBQyxXQUFSLENBQW9CLHlCQUFwQixDQVI1Qjs7RUFTQSxDQUFBLENBQUUsR0FBRixFQUNFLE9BREYsRUFFRSxJQUZGLEVBR0UsS0FIRixFQUlFLEtBSkYsRUFLRSxJQUxGLEVBTUUsSUFORixFQU9FLElBUEYsRUFRRSxHQVJGLEVBU0UsSUFURixFQVVFLE9BVkYsRUFXRSxHQVhGLENBQUEsR0FXNEIsR0FBRyxDQUFDLEdBWGhDLEVBZmU7Ozs7Ozs7OztFQW1DZixDQUFBLENBQUUsaUJBQUYsRUFDRSxrQkFERixDQUFBLEdBQzRCLE9BQUEsQ0FBUSw0REFBUixDQUQ1Qjs7RUFFQSxDQUFBLENBQUUsT0FBRixFQUNFLEtBREYsRUFFRSxLQUZGLEVBR0UsTUFIRixFQUlFLEVBSkYsRUFLRSxTQUxGLENBQUEsR0FLNEIsT0FBQSxDQUFRLFVBQVIsQ0FMNUI7O0VBTUEsT0FBQSxHQUE0QixLQTNDYjs7Ozs7Ozs7Ozs7Ozs7Ozs7RUE0RGYsR0FBQSxHQUFNLGdFQTVEUzs7Ozs7RUFtRWYsV0FBQSxHQUFjLFFBQUEsQ0FBQSxDQUFBO0FBQ2QsUUFBQSxDQUFBLEVBQUE7SUFBRSxDQUFBLEdBQU0sSUFBSSxPQUFKLENBQVk7TUFBRSxJQUFBLEVBQU0sR0FBUjtNQUFhLE9BQUEsRUFBUyxLQUF0QjtNQUE2QixZQUFBLEVBQWM7SUFBM0MsQ0FBWjtJQUNOLEdBQUEsR0FBTSxDQUFDLENBQUMsU0FBRixDQUFZO01BQUUsSUFBQSxFQUFNO0lBQVIsQ0FBWjtJQUNOLEdBQUcsQ0FBQyxTQUFKLENBQWMsT0FBZCxFQUF3QixJQUF4QixFQUFrRjtNQUFFLElBQUEsRUFBTTtRQUFFLElBQUEsRUFBTSxJQUFSO1FBQWMsSUFBQSxFQUFNLE9BQXBCO1FBQTZCLE1BQUEsRUFBUTtNQUFyQztJQUFSLENBQWxGO0lBQ0EsR0FBRyxDQUFDLFNBQUosQ0FBYyxTQUFkLEVBQTRCLEVBQUUsQ0FBQSxlQUFBLENBQTlCLEVBQWtGO01BQUUsSUFBQSxFQUFNO1FBQUUsSUFBQSxFQUFNLEdBQVI7UUFBYSxJQUFBLEVBQU07TUFBbkI7SUFBUixDQUFsRjtJQUNBLEdBQUcsQ0FBQyxTQUFKLENBQWMsT0FBZCxFQUE0QixFQUFFLENBQUEsMEJBQUEsQ0FBQSxDQUE2QixHQUE3QixDQUFBLEVBQUEsQ0FBOUIsRUFBa0Y7TUFBRSxJQUFBLEVBQU07UUFBRSxJQUFBLEVBQU0sR0FBUjtRQUFhLElBQUEsRUFBTSxTQUFuQjtRQUE4QixNQUFBLEVBQVEsTUFBdEM7UUFBZ0QsS0FBQSxFQUFPO01BQXZEO0lBQVIsQ0FBbEY7SUFDQSxHQUFHLENBQUMsU0FBSixDQUFjLFFBQWQsRUFBNEIsRUFBRSxDQUFBLHlCQUFBLENBQUEsQ0FBNEIsR0FBNUIsQ0FBQSxFQUFBLENBQTlCLEVBQWtGO01BQUUsSUFBQSxFQUFNO1FBQUUsSUFBQSxFQUFNLEdBQVI7UUFBYSxJQUFBLEVBQU0sU0FBbkI7UUFBOEIsTUFBQSxFQUFRLE9BQXRDO1FBQWdELEtBQUEsRUFBTztNQUF2RDtJQUFSLENBQWxGO0lBQ0EsR0FBRyxDQUFDLFNBQUosQ0FBYyxXQUFkLEVBQTRCLEVBQUUsQ0FBQSxnQkFBQSxDQUE5QixFQUFrRjtNQUFFLElBQUEsRUFBTTtRQUFFLElBQUEsRUFBTSxHQUFSO1FBQWEsSUFBQSxFQUFNO01BQW5CO0lBQVIsQ0FBbEY7SUFDQSxHQUFHLENBQUMsU0FBSixDQUFjLFNBQWQsRUFBNEIsRUFBRSxDQUFBLGdCQUFBLENBQTlCLEVBQWtGO01BQUUsSUFBQSxFQUFNO1FBQUUsSUFBQSxFQUFNLEdBQVI7UUFBYSxJQUFBLEVBQU07TUFBbkI7SUFBUixDQUFsRjtJQUNBLEdBQUcsQ0FBQyxTQUFKLENBQWMsT0FBZCxFQUE0QixFQUFFLENBQUEseUJBQUEsQ0FBQSxDQUE0QixHQUE1QixDQUFBLGdCQUFBLENBQTlCLEVBQWtGO01BQUUsSUFBQSxFQUFNO1FBQUUsSUFBQSxFQUFNLEdBQVI7UUFBYSxJQUFBLEVBQU07TUFBbkI7SUFBUixDQUFsRjtJQUNBLEdBQUcsQ0FBQyxTQUFKLENBQWMsT0FBZCxFQUE0QixFQUFFLENBQUEsd0JBQUEsQ0FBOUIsRUFBa0Y7TUFBRSxJQUFBLEVBQU07UUFBRSxJQUFBLEVBQU0sR0FBUjtRQUFhLElBQUEsRUFBTSxPQUFuQjtRQUE0QixJQUFBLEVBQU07TUFBbEM7SUFBUixDQUFsRjtJQUNBLEdBQUcsQ0FBQyxTQUFKLENBQWMsTUFBZCxFQUE0QixFQUFFLENBQUEsY0FBQSxDQUE5QixFQUFrRjtNQUFFLElBQUEsRUFBTTtRQUFFLElBQUEsRUFBTSxHQUFSO1FBQWEsSUFBQSxFQUFNLE1BQW5CO1FBQTJCLElBQUEsRUFBTTtNQUFqQztJQUFSLENBQWxGO0FBQ0EsV0FBTztFQVpLLEVBbkVDOzs7Ozs7Ozs7Ozs7OztFQTRGZixTQUFBLEdBQVksUUFBQSxDQUFFLElBQUYsRUFBUSxLQUFSLENBQUE7QUFBa0IsUUFBQTtJQUFDLENBQUEsR0FBSSxNQUFNLENBQUMsTUFBUCxDQUFjLElBQWQ7SUFBb0IsQ0FBQyxDQUFFLElBQUYsQ0FBRCxHQUFZO1dBQU87RUFBOUQsRUE1Rkc7OztFQStGZixxQkFBQSxHQUF3QixRQUFBLENBQUUsU0FBRixDQUFBO0FBQ3hCLFFBQUE7SUFBRSxDQUFBLEdBQUksTUFBTSxDQUFDLE1BQVAsQ0FBYyxJQUFkO0lBQ0osTUFBTSxDQUFDLE1BQVAsQ0FBYyxDQUFkLEVBQWlCLElBQUksQ0FBQyxLQUFMLENBQVcsU0FBWCxDQUFqQjtBQUNBLFdBQU87RUFIZSxFQS9GVDs7O0VBcUdmLGlCQUFBLEdBQW9CLFFBQUEsQ0FBRSxPQUFGLENBQUE7V0FBZSxJQUFJLENBQUMsS0FBTCxDQUFXLE9BQVg7RUFBZixFQXJHTDs7O0VBd0dmLFVBQUEsR0FBYSxRQUFBLENBQUUsT0FBTyxJQUFULENBQUE7QUFDYixRQUFBLENBQUEsRUFBQSxRQUFBLEVBQUEsS0FBQSxFQUFBLENBQUEsRUFBQSxHQUFBLEVBQUEsT0FBQSxFQUFBLE1BQUEsRUFBQSxJQUFBLEVBQUEsVUFBQSxFQUFBLElBQUEsRUFBQSxNQUFBLEVBQUEsSUFBQSxFQUFBLEtBQUEsRUFBQTtJQUFFLElBQUEsR0FBaUIsWUFBSCxHQUFjLENBQUUsR0FBQSxJQUFGLENBQWQsR0FBZ0MsT0FBTyxDQUFDLElBQUk7SUFDMUQsQ0FBQSxHQUFjO01BQUUsQ0FBQSxFQUFHLElBQUw7TUFBVyxDQUFBLEVBQUcsRUFBZDtNQUFrQixDQUFBLEVBQUcsRUFBckI7TUFBeUIsQ0FBQSxFQUFHLEVBQTVCO01BQWdDLENBQUEsRUFBRyxpQkFBQSxDQUFBLENBQW5DO01BQXdELENBQUEsRUFBRyxrQkFBQSxDQUFBLENBQTNEO01BQWlGLENBQUEsRUFBRztRQUFFLENBQUEsRUFBRyxFQUFMO1FBQVMsQ0FBQSxFQUFHLEVBQVo7UUFBZ0IsQ0FBQSxFQUFHO01BQW5CO0lBQXBGLEVBRGhCOztJQUdFLFVBQUEsR0FBYzs7TUFDZCxVQUFjLFdBQUEsQ0FBQTs7SUFDZCxLQUFBLHNDQUFBO3lCQUFBOztNQUVFLElBQUcsVUFBSDtRQUNFLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSixDQUFTLFFBQVQ7QUFDQSxpQkFGRjtPQURKOztNQUtJLE9BQUEsR0FBVSxPQUFPLENBQUMsWUFBUixDQUFxQixRQUFyQixFQUxkOztNQU9JLElBQU8sT0FBTyxDQUFDLE1BQVIsS0FBa0IsQ0FBekI7UUFDRSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUosQ0FBUyxRQUFUO0FBQ0EsaUJBRkY7T0FQSjs7O01BWUksQ0FBQSxDQUFFLEtBQUYsRUFDRSxJQURGLEVBRUUsSUFGRixFQUdFLElBSEYsRUFJRSxLQUpGLEVBS0UsTUFMRixDQUFBLEdBS2EsT0FBTyxDQUFFLENBQUYsQ0FBSyxDQUFDLElBTDFCO01BTUEsSUFBQSxtQkFBTyxRQUFRLEtBbEJuQjs7QUFvQkksY0FBTyxJQUFQO0FBQUEsYUFDTyxTQURQO1VBQ3VDLENBQUMsQ0FBRSxJQUFGLENBQVEsQ0FBQyxJQUFWLENBQWUsU0FBQSxDQUFVLElBQVYsRUFBZ0IsS0FBaEIsQ0FBZjtBQUFoQztBQURQLGFBRU8sT0FGUDtVQUV1QyxDQUFDLENBQUUsSUFBRixDQUFRLENBQUMsSUFBVixDQUFlLFNBQUEsQ0FBVSxJQUFWLEVBQWdCLE1BQWhCLENBQWY7QUFBaEM7QUFGUCxhQUdPLE9BSFA7QUFBQSxhQUdnQixTQUhoQjtBQUFBLGFBRzJCLE1BSDNCO1VBR3VDLENBQUMsQ0FBRSxJQUFGLENBQVEsQ0FBQyxJQUFWLENBQWUsTUFBZjtBQUFaOztBQUgzQixhQUtPLFdBTFA7QUFBQSxhQUtvQixTQUxwQjtVQU1JLE1BQUEsR0FBWSxJQUFBLEtBQVEsV0FBWCxHQUE0QixxQkFBNUIsR0FBdUQ7QUFDaEU7WUFDRSxDQUFDLENBQUUsSUFBRixDQUFRLENBQUMsSUFBVixDQUFlLE1BQUEsQ0FBTyxNQUFQLENBQWYsRUFERjtXQUVBLGNBQUE7WUFBTTtZQUNKLE1BQW1CLEtBQUEsWUFBaUIsWUFBcEM7Y0FBQSxNQUFNLE1BQU47O1lBQ0EsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFKLENBQVMsTUFBVDtZQUNBLElBQUEsR0FBUTtZQUNSLElBQUEsR0FBUSxDQUFBLENBQUEsQ0FBQSxDQUFJLElBQUosQ0FBQSxFQUpWOztBQUpnQjs7QUFMcEIsYUFlTyxPQWZQO1VBZ0JJLFVBQUEsR0FBYTtBQUNiO0FBakJKOztVQW1CTyxNQUFNLElBQUksS0FBSixDQUFVLENBQUEsc0RBQUEsQ0FBQSxDQUF5RCxHQUFBLENBQUksSUFBSixDQUF6RCxDQUFBLENBQVY7QUFuQmI7TUFvQkEsQ0FBQyxDQUFDLENBQUMsQ0FBRSxJQUFGLENBQVEsQ0FBQyxJQUFaLENBQWlCLElBQWpCO0lBekNGO0FBMENBLFdBQU87RUFoREksRUF4R0U7OztFQTJKZixhQUFBLEdBQWdCLFFBQUEsQ0FBRSxDQUFGLENBQUE7V0FBUyxDQUFFLE1BQU0sQ0FBQyxjQUFQLENBQXNCLENBQXRCLENBQUYsQ0FBQSxLQUErQjtFQUF4QyxFQTNKRDs7O0VBOEpmLFNBQUEsR0FBWSxRQUFBLENBQUUsSUFBRixDQUFBO0lBQ1YsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFmLENBQXFCLElBQUksQ0FBQyxTQUFMLENBQWUsSUFBZixDQUFyQjtXQUNDO0VBRlMsRUE5Skc7OztFQW9LZixJQUFBLEdBQU8sUUFBQSxDQUFBLENBQUE7QUFDUCxRQUFBLElBQUE7OztJQUVFLElBQUEsR0FBWSxVQUFBLENBQUE7SUFDWixTQUFBLENBQVUsSUFBVixFQUhGOzs7O1dBT0c7RUFSSSxFQXBLUTs7O0VBZ0xmLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLENBQUUsVUFBRixFQWhMRjs7O0VBbUxmLElBQUcsTUFBQSxLQUFVLE9BQU8sQ0FBQyxJQUFyQjtJQUFrQyxDQUFBLENBQUEsQ0FBQSxHQUFBO01BQ2hDLElBQUEsQ0FBQTthQUNDO0lBRitCLENBQUEsSUFBbEM7O0FBbkxlIiwic291cmNlc0NvbnRlbnQiOlsiIyEvYmluL2VudiBub2RlXG5cbid1c2Ugc3RyaWN0J1xuXG4jPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbkdVWSAgICAgICAgICAgICAgICAgICAgICAgPSByZXF1aXJlICdndXknXG57IGFsZXJ0XG4gIGRlYnVnXG4gIGhlbHBcbiAgaW5mb1xuICBwbGFpblxuICBwcmFpc2VcbiAgdXJnZVxuICB3YXJuXG4gIHdoaXNwZXIgfSAgICAgICAgICAgICAgID0gR1VZLnRybS5nZXRfbG9nZ2VycyAnbm9ybWFsaXplLWNsaS1hcmd1bWVudHMnXG57IHJwclxuICBpbnNwZWN0XG4gIGVjaG9cbiAgd2hpdGVcbiAgZ3JlZW5cbiAgYmx1ZVxuICBnb2xkXG4gIGdyZXlcbiAgcmVkXG4gIGJvbGRcbiAgcmV2ZXJzZVxuICBsb2cgICAgIH0gICAgICAgICAgICAgICA9IEdVWS50cm1cblxuIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4jIFNGTU9EVUxFUyAgICAgICAgICAgICAgICAgPSByZXF1aXJlICdicmljYWJyYWMtc2Ztb2R1bGVzJ1xuIyB7IHR5cGVfb2YsICAgICAgICAgICAgICB9ID0gU0ZNT0RVTEVTLnVuc3RhYmxlLnJlcXVpcmVfdHlwZV9vZigpXG4jIHsgSmV0c3RyZWFtLFxuIyAgIGludGVybmFscywgICAgICAgICAgICB9ID0gU0ZNT0RVTEVTLnJlcXVpcmVfamV0c3RyZWFtKClcbiMgeyBnZXRfdHlwZV9vZl9zdGRpbiwgICAgfSA9IHJlcXVpcmUgJ2JyaWNhYnJhYy1zZm1vZHVsZXMvbGliL2NsaS1nZXQtdHlwZS1vZi1zdGRpbidcbiMgZGVidWcgJ86panNvbmlja19fXzInLCByZXF1aXJlICdicmljYWJyYWMtc2Ztb2R1bGVzJ1xueyBnZXRfdHlwZV9vZl9zdGRpblxuICBnZXRfdHlwZV9vZl9zdGRvdXQgICAgfSA9IHJlcXVpcmUgJy4uLy4uL2JyaWNhYnJhYy1zZm1vZHVsZXMvbGliL2NsaS1nZXQtdHlwZS1vZi1zdGRpbi1zdGRvdXQnXG57IEdyYW1tYXJcbiAgTGV2ZWxcbiAgVG9rZW5cbiAgTGV4ZW1lXG4gIHJ4XG4gIGludGVybmFscyAgICAgICAgICAgICB9ID0gcmVxdWlyZSAnaW50ZXJsZXgnXG5ncmFtbWFyICAgICAgICAgICAgICAgICAgID0gbnVsbFxuXG4jPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiMgeyBjb25kZW5zZV9sZXhlbWVzXG4jICAgYWJicmx4bVxuIyAgIHRhYnVsYXRlX2xleGVtZXNcbiMgICB0YWJ1bGF0ZV9sZXhlbWUgICAgICAgfSA9IHJlIHF1aXJlICcuLi8uLi9oZW5naXN0LU5HL2Rldi9pbnRlcmxleC9saWIvaGVscGVycydcblxuIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4jIyMgdGh4IHRvXG4gIGh0dHBzOi8vZ2l0aHViLmNvbS9tYXRoaWFzYnluZW5zL21vdGhlcmVmZi5pbi9ibG9iL21hc3Rlci9qcy12YXJpYWJsZXMvZWZmLmpzXG4gIGh0dHBzOi8vbWF0aGlhc2J5bmVucy5iZS9ub3Rlcy9qYXZhc2NyaXB0LWlkZW50aWZpZXJzLWVzNlxuIyMjXG4jIGpzaWRlbnRpZmllcl9wYXR0ZXJuID0gLy8vIF5cbiMgICAoPzogWyAkXyBdICAgICAgICAgICAgICAgICAgICB8IFxccHtJRF9TdGFydH0gICAgKVxuIyAgICg/OiBbICQgXyBcXHV7MjAwY30gXFx1ezIwMGR9IF0gfCBcXHB7SURfQ29udGludWV9ICkqXG4jICAgJCAvLy92XG5ucmUgPSAvLy9cbiAgKD86IFsgJF8gXSAgICAgICAgICAgICAgICAgICAgICAgIHwgXFxwe0lEX1N0YXJ0fSAgICApXG4gICg/OiBbICQgXyBcXC0gXFx1ezIwMGN9IFxcdXsyMDBkfSBdICB8IFxccHtJRF9Db250aW51ZX0gKSpcbiAgLy8vdlxuIyBucmUgPSBqc29uaWNfb3B0aW9uX3JlLnNvdXJjZVxuXG4jLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbm5ld19ncmFtbWFyID0gLT5cbiAgUiAgID0gbmV3IEdyYW1tYXIgeyBuYW1lOiAnZycsIGxpbmtpbmc6IGZhbHNlLCBlbWl0X3NpZ25hbHM6IGZhbHNlLCB9XG4gIGduZCA9IFIubmV3X2xldmVsIHsgbmFtZTogJ2duZCcsIH1cbiAgZ25kLm5ld190b2tlbiAnZmVuY2UnLCAgJy0tJywgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgZGF0YTogeyBzbG90OiBudWxsLCB0eXBlOiAnZmVuY2UnLCBzdHJpbmc6ICctLScsICB9LCB9XG4gIGduZC5uZXdfdG9rZW4gJ2VzY2FwZWQnLCAgICByeFwiJSg/PHN0cmluZz4uKykkXCIsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgZGF0YTogeyBzbG90OiAnZCcsIHR5cGU6ICdlc2NhcGVkJywgfSwgfVxuICBnbmQubmV3X3Rva2VuICdidHJ1ZScsICAgICAgcnhcIlxcKygoPzx4c2xvdD5kKVxcLik/KD88bmFtZT4je25yZX0pJFwiLCAgICAgICAgICAgICAgIHsgZGF0YTogeyBzbG90OiAnYycsIHR5cGU6ICdib29sZWFuJywgc3RyaW5nOiAndHJ1ZScsICAgdmFsdWU6IHRydWUsICB9LCB9XG4gIGduZC5uZXdfdG9rZW4gJ2JmYWxzZScsICAgICByeFwiLSgoPzx4c2xvdD5kKVxcLik/KD88bmFtZT4je25yZX0pJFwiLCAgICAgICAgICAgICAgICB7IGRhdGE6IHsgc2xvdDogJ2MnLCB0eXBlOiAnYm9vbGVhbicsIHN0cmluZzogJ2ZhbHNlJywgIHZhbHVlOiBmYWxzZSwgfSwgfVxuICBnbmQubmV3X3Rva2VuICdvYmplY3RsaXQnLCAgcnhcIig/PHN0cmluZz5cXHsuKikkXCIsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyBkYXRhOiB7IHNsb3Q6ICdkJywgdHlwZTogJ29iamVjdGxpdCcsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIH1cbiAgZ25kLm5ld190b2tlbiAnbGlzdGxpdCcsICAgIHJ4XCIoPzxzdHJpbmc+XFxbLiopJFwiLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgZGF0YTogeyBzbG90OiAnZCcsIHR5cGU6ICdsaXN0bGl0JywgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIH1cbiAgZ25kLm5ld190b2tlbiAnZmFjZXQnLCAgICAgIHJ4XCI6KCg/PHhzbG90PmQpXFwuKT8oPzxuYW1lPiN7bnJlfSk9KD88c3RyaW5nPi4qKSRcIiwgIHsgZGF0YTogeyBzbG90OiAnYycsIHR5cGU6ICdmYWNldCcsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgfVxuICBnbmQubmV3X3Rva2VuICdvdGhlcicsICAgICAgcnhcIig/PHN0cmluZz5bXFwtKzpcXHtcXFtdLiopJFwiLCAgICAgICAgICAgICAgICAgICAgICAgICB7IGRhdGE6IHsgc2xvdDogJ2UnLCB0eXBlOiAnb3RoZXInLCBuYW1lOiBudWxsLCAgICAgICAgICAgICAgICAgICAgIH0sIH1cbiAgZ25kLm5ld190b2tlbiAnd29yZCcsICAgICAgIHJ4XCIoPzxzdHJpbmc+LispJFwiLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyBkYXRhOiB7IHNsb3Q6ICdkJywgdHlwZTogJ3dvcmQnLCBuYW1lOiBudWxsLCAgICAgICAgICAgICAgICAgICAgIH0sIH1cbiAgcmV0dXJuIFJcbiMgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuIyBnZXRfdHlwZV9vZl9zdGRpbiA9IC0+XG4jICAgc3RhdHMgPSBGUy5mc3RhdFN5bmMgMFxuIyAgICMgcmV0dXJuIHByb2Nlc3Muc3RkaW4gaWYgc3RhdHMuaXNGSUZPKClcbiMgICByZXR1cm4gJ3R0eScgICAgaWYgcHJvY2Vzcy5zdGRpbi5pc1RUWVxuIyAgIHJldHVybiAncGlwZScgICBpZiBzdGF0cy5pc0ZJRk8oKVxuIyAgIHJldHVybiAnZmlsZScgICBpZiBzdGF0cy5pc0ZpbGUoKVxuIyAgIHJldHVybiAnc29ja2V0JyBpZiBzdGF0cy5pc1NvY2tldCgpXG4jICAgcmV0dXJuICdvdGhlcicgICAjIHouQi4gL2Rldi9udWxsLCBCbG9jayBEZXZpY2VcbiAgIyByZXR1cm4gbnVsbFxuXG4jLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbm5ld19mYWNldCA9ICggbmFtZSwgdmFsdWUgKSAtPiBSID0gT2JqZWN0LmNyZWF0ZSBudWxsOyBSWyBuYW1lIF0gPSB2YWx1ZTsgUlxuXG4jLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbm9iamVjdF9mcm9tX29iamVjdGxpdCA9ICggb2JqZWN0bGl0ICkgLT5cbiAgUiA9IE9iamVjdC5jcmVhdGUgbnVsbFxuICBPYmplY3QuYXNzaWduIFIsIEpTT04ucGFyc2Ugb2JqZWN0bGl0XG4gIHJldHVybiBSXG5cbiMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxubGlzdF9mcm9tX2xpc3RsaXQgPSAoIGxpc3RsaXQgKSAtPiBKU09OLnBhcnNlIGxpc3RsaXRcblxuIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5wYXJzZV9hcmd2ID0gKCBhcmd2ID0gbnVsbCApIC0+XG4gIGFyZ3YgICAgICAgID0gaWYgYXJndj8gdGhlbiBbIGFyZ3YuLi4sIF0gZWxzZSBwcm9jZXNzLmFyZ3ZbIDIgLi4gXVxuICBSICAgICAgICAgICA9IHsgYTogYXJndiwgYzogW10sIGQ6IFtdLCBlOiBbXSwgaTogZ2V0X3R5cGVfb2Zfc3RkaW4oKSwgbzogZ2V0X3R5cGVfb2Zfc3Rkb3V0KCksIHQ6IHsgYzogW10sIGQ6IFtdLCBlOiBbXSwgfSB9XG4gICMgZGVidWcgJ86panNvbmlja19fXzEnLCBhcmd2XG4gIHBhc3RfZmVuY2UgID0gZmFsc2VcbiAgZ3JhbW1hciAgICA/PSBuZXdfZ3JhbW1hcigpXG4gIGZvciBhcmd1bWVudCBpbiBhcmd2XG4gICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgaWYgcGFzdF9mZW5jZVxuICAgICAgUi5kLnB1c2ggYXJndW1lbnRcbiAgICAgIGNvbnRpbnVlXG4gICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgbGV4ZW1lcyA9IGdyYW1tYXIuc2Nhbl90b19saXN0IGFyZ3VtZW50XG4gICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgdW5sZXNzIGxleGVtZXMubGVuZ3RoIGlzIDFcbiAgICAgIFIuZS5wdXNoIGFyZ3VtZW50XG4gICAgICBjb250aW51ZVxuICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICMgdGFidWxhdGVfbGV4ZW1lIGxleGVtZXNbIDAgXSAjIyMgISEhISEhISEhISEhISEhICMjI1xuICAgIHsgeHNsb3RcbiAgICAgIHNsb3RcbiAgICAgIHR5cGVcbiAgICAgIG5hbWVcbiAgICAgIHZhbHVlXG4gICAgICBzdHJpbmcgfSA9IGxleGVtZXNbIDAgXS5kYXRhXG4gICAgc2xvdCA9IHhzbG90ID8gc2xvdFxuICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgc3dpdGNoIHR5cGVcbiAgICAgIHdoZW4gJ2Jvb2xlYW4nICAgICAgICAgICAgICAgICAgdGhlbiBSWyBzbG90IF0ucHVzaCBuZXdfZmFjZXQgbmFtZSwgdmFsdWVcbiAgICAgIHdoZW4gJ2ZhY2V0JyAgICAgICAgICAgICAgICAgICAgdGhlbiBSWyBzbG90IF0ucHVzaCBuZXdfZmFjZXQgbmFtZSwgc3RyaW5nXG4gICAgICB3aGVuICdvdGhlcicsICdlc2NhcGVkJywgJ3dvcmQnIHRoZW4gUlsgc2xvdCBdLnB1c2ggc3RyaW5nXG4gICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgIHdoZW4gJ29iamVjdGxpdCcsICdsaXN0bGl0J1xuICAgICAgICBtZXRob2QgPSBpZiB0eXBlIGlzICdvYmplY3RsaXQnIHRoZW4gb2JqZWN0X2Zyb21fb2JqZWN0bGl0IGVsc2UgbGlzdF9mcm9tX2xpc3RsaXRcbiAgICAgICAgdHJ5XG4gICAgICAgICAgUlsgc2xvdCBdLnB1c2ggbWV0aG9kIHN0cmluZ1xuICAgICAgICBjYXRjaCBlcnJvclxuICAgICAgICAgIHRocm93IGVycm9yIHVubGVzcyBlcnJvciBpbnN0YW5jZW9mIFN5bnRheEVycm9yXG4gICAgICAgICAgUi5lLnB1c2ggc3RyaW5nXG4gICAgICAgICAgc2xvdCAgPSAnZSdcbiAgICAgICAgICB0eXBlICA9IFwiZSN7dHlwZX1cIlxuICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICB3aGVuICdmZW5jZSdcbiAgICAgICAgcGFzdF9mZW5jZSA9IHRydWVcbiAgICAgICAgY29udGludWVcbiAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgZWxzZSB0aHJvdyBuZXcgRXJyb3IgXCLOqWpzb25pY2tfX18yIHNob3VsZCBuZXZlciBoYXBwZW46IHVua25vd24gbGV4ZW1lIHR5cGUgI3tycHIgdHlwZX1cIlxuICAgIFIudFsgc2xvdCBdLnB1c2ggdHlwZVxuICByZXR1cm4gUlxuXG4jLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbl9pc2FfbnVsbF9wb2QgPSAoIHggKSAtPiAoIE9iamVjdC5nZXRQcm90b3R5cGVPZiB4ICkgaXMgbnVsbFxuXG4jLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbnNob3dfY2RlZiA9ICggY2RlZiApIC0+XG4gIHByb2Nlc3Muc3Rkb3V0LndyaXRlIEpTT04uc3RyaW5naWZ5IGNkZWZcbiAgO251bGxcblxuXG4jPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmRlbW8gPSAtPlxuICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICMgUFEgID0gcHJvY2Vzcy5hcmd2WyAyIC4uIF1cbiAgY2RlZiAgICAgID0gcGFyc2VfYXJndigpXG4gIHNob3dfY2RlZiBjZGVmXG4gICMjI1xuICBbICdyZXBsYWNlOjQnLCAnK3VwcGVyLWNhc2UnLCAnKycsICctdmVyYm9zZScsICd7ZDo4fScsICd7czp0cnVlLCtib29sLH0nLCAnd29yZHM6YSBiJywgJ3snLCAne1wibmFtZVwiOnRydWUsXCJ3aWR0aFwiOjQ0NX0nIF1cbiAgIyMjXG4gIDtudWxsXG5cblxuIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5tb2R1bGUuZXhwb3J0cyA9IHsgcGFyc2VfYXJndiwgfVxuXG4jPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmlmIG1vZHVsZSBpcyByZXF1aXJlLm1haW4gdGhlbiBkbyA9PlxuICBkZW1vKClcbiAgO251bGxcbiJdfQ==
