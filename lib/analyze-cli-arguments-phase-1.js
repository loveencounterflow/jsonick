#!/bin/env node
(function() {
  //!/bin/env node
  'use strict';
  var GUY, Grammar, Level, Lexeme, Token, alert, blue, bold, debug, demo, echo, get_type_of_stdin, get_type_of_stdout, gold, green, grey, help, info, inspect, internals, log, plain, praise, red, reverse, rpr, rx, urge, warn, whisper, white;

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
  // debug 'Ωjsonick___2', require '../../bricabrac-sfmodules'
  ({get_type_of_stdin, get_type_of_stdout} = require('../../bricabrac-sfmodules/lib/cli-get-type-of-stdin-stdout'));

  ({Grammar, Level, Token, Lexeme, rx, internals} = require('interlex'));

  //===========================================================================================================
  demo = function() {
    var _isa_null_pod, abbrlxm, cdef, condense_lexemes, g, new_facet, new_grammar, nre, object_from_dol, parse_argv, show_cdef, tabulate_lexeme, tabulate_lexemes;
    ({condense_lexemes, abbrlxm, tabulate_lexemes, tabulate_lexeme} = require('../../hengist-NG/dev/interlex/lib/helpers'));
    //---------------------------------------------------------------------------------------------------------
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
    //---------------------------------------------------------------------------------------------------------
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
      gnd.new_token('escaped', rx`\\(?<string>.+)$`, {
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
      gnd.new_token('dol', rx`(?<string>\{.*\})$`, {
        data: {
          slot: 'd',
          type: 'dol'
        }
      });
      /* NOTE: DOL = Data Object Literal */      gnd.new_token('facet', rx`:((?<xslot>d)\.)?(?<name>${nre})=(?<string>.*)$`, {
        data: {
          slot: 'c',
          type: 'facet'
        }
      });
      gnd.new_token('other', rx`(?<string>[\-+:].*)$`, {
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
    //---------------------------------------------------------------------------------------------------------
    new_facet = function(name, value) {
      var R;
      R = Object.create(null);
      R[name] = value;
      return R;
    };
    object_from_dol = function(literal) {
      var R;
      R = Object.create(null);
      Object.assign(R, JSON.parse(literal));
      return R;
    };
    //---------------------------------------------------------------------------------------------------------
    parse_argv = function(argv = null) {
      var R, argument, error, i, len, lexemes, name, past_fence, slot, string, type, value, xslot;
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
      for (i = 0, len = argv.length; i < len; i++) {
        argument = argv[i];
        lexemes = g.scan_to_list(argument);
        //.....................................................................................................
        if (lexemes.length !== 1) {
          R.e.push(argument);
          continue;
        }
        //.....................................................................................................
        // tabulate_lexeme lexemes[ 0 ] ### !!!!!!!!!!!!!!! ###
        ({xslot, slot, type, name, value, string} = lexemes[0].data);
        slot = xslot != null ? xslot : slot;
        //.....................................................................................................
        if (past_fence) {
          R.d.push(string);
          continue;
        }
        //.....................................................................................................
        R.t[slot].push(type);
        //.....................................................................................................
        switch (type) {
          case 'fence':
            past_fence = true;
            break;
          case 'boolean':
            R[slot].push(new_facet(name, value));
            break;
          case 'facet':
            R[slot].push(new_facet(name, string));
            break;
          case 'dol':
            try {
              R[slot].push(object_from_dol(string));
            } catch (error1) {
              error = error1;
              if (!(error instanceof SyntaxError)) {
                throw error;
              }
              R.e.push(string);
            }
            break;
          case 'other':
          case 'escaped':
          case 'word':
            R[slot].push(string);
            break;
          default:
            throw new Error(`Ωjsonick___2 should never happen: unknown lexeme type ${rpr(type)}`);
        }
      }
      return R;
    };
    //---------------------------------------------------------------------------------------------------------
    _isa_null_pod = function(x) {
      return (Object.getPrototypeOf(x)) === null;
    };
    //---------------------------------------------------------------------------------------------------------
    show_cdef = function(cdef) {
      process.stdout.write(JSON.stringify(cdef));
      return null;
    };
    //---------------------------------------------------------------------------------------------------------
    // PQ  = process.argv[ 2 .. ]
    g = new_grammar();
    cdef = parse_argv();
    show_cdef(cdef);
    /*
    [ 'replace:4', '+upper-case', '+', '-verbose', '{d:8}', '{s:true,+bool,}', 'words:a b', '{', '{"name":true,"width":445}' ]
    */
    return null;
  };

  //===========================================================================================================
  // module.exports = { nfa, get_signature, Normalize_function_arguments, Template, internals, }

  //===========================================================================================================
  if (module === require.main) {
    (() => {
      demo();
      return null;
    })();
  }

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2FuYWx5emUtY2xpLWFyZ3VtZW50cy1waGFzZS0xLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBZTtFQUFBO0VBRWY7QUFGZSxNQUFBLEdBQUEsRUFBQSxPQUFBLEVBQUEsS0FBQSxFQUFBLE1BQUEsRUFBQSxLQUFBLEVBQUEsS0FBQSxFQUFBLElBQUEsRUFBQSxJQUFBLEVBQUEsS0FBQSxFQUFBLElBQUEsRUFBQSxJQUFBLEVBQUEsaUJBQUEsRUFBQSxrQkFBQSxFQUFBLElBQUEsRUFBQSxLQUFBLEVBQUEsSUFBQSxFQUFBLElBQUEsRUFBQSxJQUFBLEVBQUEsT0FBQSxFQUFBLFNBQUEsRUFBQSxHQUFBLEVBQUEsS0FBQSxFQUFBLE1BQUEsRUFBQSxHQUFBLEVBQUEsT0FBQSxFQUFBLEdBQUEsRUFBQSxFQUFBLEVBQUEsSUFBQSxFQUFBLElBQUEsRUFBQSxPQUFBLEVBQUEsS0FBQTs7O0VBS2YsR0FBQSxHQUE0QixPQUFBLENBQVEsS0FBUjs7RUFDNUIsQ0FBQSxDQUFFLEtBQUYsRUFDRSxLQURGLEVBRUUsSUFGRixFQUdFLElBSEYsRUFJRSxLQUpGLEVBS0UsTUFMRixFQU1FLElBTkYsRUFPRSxJQVBGLEVBUUUsT0FSRixDQUFBLEdBUTRCLEdBQUcsQ0FBQyxHQUFHLENBQUMsV0FBUixDQUFvQix5QkFBcEIsQ0FSNUI7O0VBU0EsQ0FBQSxDQUFFLEdBQUYsRUFDRSxPQURGLEVBRUUsSUFGRixFQUdFLEtBSEYsRUFJRSxLQUpGLEVBS0UsSUFMRixFQU1FLElBTkYsRUFPRSxJQVBGLEVBUUUsR0FSRixFQVNFLElBVEYsRUFVRSxPQVZGLEVBV0UsR0FYRixDQUFBLEdBVzRCLEdBQUcsQ0FBQyxHQVhoQyxFQWZlOzs7Ozs7Ozs7RUFrQ2YsQ0FBQSxDQUFFLGlCQUFGLEVBQ0Usa0JBREYsQ0FBQSxHQUM0QixPQUFBLENBQVEsNERBQVIsQ0FENUI7O0VBRUEsQ0FBQSxDQUFFLE9BQUYs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LE9BWFA7QUFBQSxlQVdnQixTQVhoQjtBQUFBLGVBVzJCLE1BWDNCO1lBWUssQ0FBQyxDQUFFLElBQUYsQ0FBUSxDQUFDLElBQVYsQ0FBZSxNQUFmO0FBRHNCO0FBWDNCO1lBY0ksTUFBTSxJQUFJLEtBQUosQ0FBVSxDQUFBLHNEQUFBLENBQUEsQ0FBeUQsR0FBQSxDQUFJLElBQUosQ0FBekQsQ0FBQSxDQUFWO0FBZFY7TUF0QkY7QUFxQ0EsYUFBTztJQTFDSSxFQWhEZjs7SUE0RkUsYUFBQSxHQUFnQixRQUFBLENBQUUsQ0FBRixDQUFBO2FBQVMsQ0FBRSxNQUFNLENBQUMsY0FBUCxDQUFzQixDQUF0QixDQUFGLENBQUEsS0FBK0I7SUFBeEMsRUE1RmxCOztJQThGRSxTQUFBLEdBQVksUUFBQSxDQUFFLElBQUYsQ0FBQTtNQUNWLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBZixDQUFxQixJQUFJLENBQUMsU0FBTCxDQUFlLElBQWYsQ0FBckI7YUFDQztJQUZTLEVBOUZkOzs7SUFtR0UsQ0FBQSxHQUFZLFdBQUEsQ0FBQTtJQUNaLElBQUEsR0FBWSxVQUFBLENBQUE7SUFDWixTQUFBLENBQVUsSUFBVixFQXJHRjs7OztXQXlHRztFQTFHSSxFQTdDUTs7Ozs7O0VBOEpmLElBQUcsTUFBQSxLQUFVLE9BQU8sQ0FBQyxJQUFyQjtJQUFrQyxDQUFBLENBQUEsQ0FBQSxHQUFBO01BQ2hDLElBQUEsQ0FBQTthQUNDO0lBRitCLENBQUEsSUFBbEM7O0FBOUplIiwic291cmNlc0NvbnRlbnQiOlsiIyEvYmluL2VudiBub2RlXG5cbid1c2Ugc3RyaWN0J1xuXG4jPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbkdVWSAgICAgICAgICAgICAgICAgICAgICAgPSByZXF1aXJlICdndXknXG57IGFsZXJ0XG4gIGRlYnVnXG4gIGhlbHBcbiAgaW5mb1xuICBwbGFpblxuICBwcmFpc2VcbiAgdXJnZVxuICB3YXJuXG4gIHdoaXNwZXIgfSAgICAgICAgICAgICAgID0gR1VZLnRybS5nZXRfbG9nZ2VycyAnbm9ybWFsaXplLWNsaS1hcmd1bWVudHMnXG57IHJwclxuICBpbnNwZWN0XG4gIGVjaG9cbiAgd2hpdGVcbiAgZ3JlZW5cbiAgYmx1ZVxuICBnb2xkXG4gIGdyZXlcbiAgcmVkXG4gIGJvbGRcbiAgcmV2ZXJzZVxuICBsb2cgICAgIH0gICAgICAgICAgICAgICA9IEdVWS50cm1cbiMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuIyBTRk1PRFVMRVMgICAgICAgICAgICAgICAgID0gcmVxdWlyZSAnYnJpY2FicmFjLXNmbW9kdWxlcydcbiMgeyB0eXBlX29mLCAgICAgICAgICAgICAgfSA9IFNGTU9EVUxFUy51bnN0YWJsZS5yZXF1aXJlX3R5cGVfb2YoKVxuIyB7IEpldHN0cmVhbSxcbiMgICBpbnRlcm5hbHMsICAgICAgICAgICAgfSA9IFNGTU9EVUxFUy5yZXF1aXJlX2pldHN0cmVhbSgpXG4jIHsgZ2V0X3R5cGVfb2Zfc3RkaW4sICAgIH0gPSByZXF1aXJlICdicmljYWJyYWMtc2Ztb2R1bGVzL2xpYi9jbGktZ2V0LXR5cGUtb2Ytc3RkaW4nXG4jIGRlYnVnICfOqWpzb25pY2tfX18yJywgcmVxdWlyZSAnLi4vLi4vYnJpY2FicmFjLXNmbW9kdWxlcydcbnsgZ2V0X3R5cGVfb2Zfc3RkaW5cbiAgZ2V0X3R5cGVfb2Zfc3Rkb3V0ICAgIH0gPSByZXF1aXJlICcuLi8uLi9icmljYWJyYWMtc2Ztb2R1bGVzL2xpYi9jbGktZ2V0LXR5cGUtb2Ytc3RkaW4tc3Rkb3V0J1xueyBHcmFtbWFyXG4gIExldmVsXG4gIFRva2VuXG4gIExleGVtZVxuICByeFxuICBpbnRlcm5hbHMgICAgICAgICAgICAgfSA9IHJlcXVpcmUgJ2ludGVybGV4J1xuXG5cbiM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZGVtbyA9IC0+XG4gIHsgY29uZGVuc2VfbGV4ZW1lc1xuICAgIGFiYnJseG1cbiAgICB0YWJ1bGF0ZV9sZXhlbWVzXG4gICAgdGFidWxhdGVfbGV4ZW1lICAgICAgIH0gPSByZXF1aXJlICcuLi8uLi9oZW5naXN0LU5HL2Rldi9pbnRlcmxleC9saWIvaGVscGVycydcbiAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAjIyMgdGh4IHRvXG4gICAgaHR0cHM6Ly9naXRodWIuY29tL21hdGhpYXNieW5lbnMvbW90aGVyZWZmLmluL2Jsb2IvbWFzdGVyL2pzLXZhcmlhYmxlcy9lZmYuanNcbiAgICBodHRwczovL21hdGhpYXNieW5lbnMuYmUvbm90ZXMvamF2YXNjcmlwdC1pZGVudGlmaWVycy1lczZcbiAgIyMjXG4gICMganNpZGVudGlmaWVyX3BhdHRlcm4gPSAvLy8gXlxuICAjICAgKD86IFsgJF8gXSAgICAgICAgICAgICAgICAgICAgfCBcXHB7SURfU3RhcnR9ICAgIClcbiAgIyAgICg/OiBbICQgXyBcXHV7MjAwY30gXFx1ezIwMGR9IF0gfCBcXHB7SURfQ29udGludWV9ICkqXG4gICMgICAkIC8vL3ZcbiAgbnJlID0gLy8vXG4gICAgKD86IFsgJF8gXSAgICAgICAgICAgICAgICAgICAgICAgIHwgXFxwe0lEX1N0YXJ0fSAgICApXG4gICAgKD86IFsgJCBfIFxcLSBcXHV7MjAwY30gXFx1ezIwMGR9IF0gIHwgXFxwe0lEX0NvbnRpbnVlfSApKlxuICAgIC8vL3ZcbiAgIyBucmUgPSBqc29uaWNfb3B0aW9uX3JlLnNvdXJjZVxuICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIG5ld19ncmFtbWFyID0gLT5cbiAgICBSICAgPSBuZXcgR3JhbW1hciB7IG5hbWU6ICdnJywgbGlua2luZzogZmFsc2UsIGVtaXRfc2lnbmFsczogZmFsc2UsIH1cbiAgICBnbmQgPSBSLm5ld19sZXZlbCB7IG5hbWU6ICdnbmQnLCB9XG4gICAgZ25kLm5ld190b2tlbiAnZmVuY2UnLCAgJy0tJywgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IGRhdGE6IHsgc2xvdDogbnVsbCwgdHlwZTogJ2ZlbmNlJywgc3RyaW5nOiAnLS0nLCAgfSwgfVxuICAgIGduZC5uZXdfdG9rZW4gJ2VzY2FwZWQnLCByeFwiXFxcXCg/PHN0cmluZz4uKykkXCIsICAgICAgICAgICAgICAgICAgICAgICB7IGRhdGE6IHsgc2xvdDogJ2QnLCB0eXBlOiAnZXNjYXBlZCcsIH0sIH1cbiAgICBnbmQubmV3X3Rva2VuICdidHJ1ZScsICByeFwiXFwrKCg/PHhzbG90PmQpXFwuKT8oPzxuYW1lPiN7bnJlfSkkXCIsICAgICAgeyBkYXRhOiB7IHNsb3Q6ICdjJywgdHlwZTogJ2Jvb2xlYW4nLCBzdHJpbmc6ICd0cnVlJywgICB2YWx1ZTogdHJ1ZSwgIH0sIH1cbiAgICBnbmQubmV3X3Rva2VuICdiZmFsc2UnLCByeFwiLSgoPzx4c2xvdD5kKVxcLik/KD88bmFtZT4je25yZX0pJFwiLCAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgZGF0YTogeyBzbG90OiAnYycsIHR5cGU6ICdib29sZWFuJywgc3RyaW5nOiAnZmFsc2UnLCAgdmFsdWU6IGZhbHNlLCB9LCB9XG4gICAgZ25kLm5ld190b2tlbiAnZG9sJywgICAgcnhcIig/PHN0cmluZz5cXHsuKlxcfSkkXCIsICAgICAgICAgICAgICAgICAgICAgIHsgZGF0YTogeyBzbG90OiAnZCcsIHR5cGU6ICdkb2wnLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgfSAjIyMgTk9URTogRE9MID0gRGF0YSBPYmplY3QgTGl0ZXJhbCAjIyNcbiAgICBnbmQubmV3X3Rva2VuICdmYWNldCcsICByeFwiOigoPzx4c2xvdD5kKVxcLik/KD88bmFtZT4je25yZX0pPSg/PHN0cmluZz4uKikkXCIsICAgICAgICAgIHsgZGF0YTogeyBzbG90OiAnYycsIHR5cGU6ICdmYWNldCcsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgfVxuICAgIGduZC5uZXdfdG9rZW4gJ290aGVyJywgIHJ4XCIoPzxzdHJpbmc+W1xcLSs6XS4qKSRcIiwgICAgICAgICAgICAgICAgICAgICAgICAgIHsgZGF0YTogeyBzbG90OiAnZScsIHR5cGU6ICdvdGhlcicsIG5hbWU6IG51bGwsICAgICAgICAgICAgICAgICAgICAgfSwgfVxuICAgIGduZC5uZXdfdG9rZW4gJ3dvcmQnLCAgIHJ4XCIoPzxzdHJpbmc+LispJFwiLCAgICAgICAgICAgICAgICAgICAgICAgICAgeyBkYXRhOiB7IHNsb3Q6ICdkJywgdHlwZTogJ3dvcmQnLCBuYW1lOiBudWxsLCAgICAgICAgICAgICAgICAgICAgIH0sIH1cbiAgICByZXR1cm4gUlxuICAjICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgIyBnZXRfdHlwZV9vZl9zdGRpbiA9IC0+XG4gICMgICBzdGF0cyA9IEZTLmZzdGF0U3luYyAwXG4gICMgICAjIHJldHVybiBwcm9jZXNzLnN0ZGluIGlmIHN0YXRzLmlzRklGTygpXG4gICMgICByZXR1cm4gJ3R0eScgICAgaWYgcHJvY2Vzcy5zdGRpbi5pc1RUWVxuICAjICAgcmV0dXJuICdwaXBlJyAgIGlmIHN0YXRzLmlzRklGTygpXG4gICMgICByZXR1cm4gJ2ZpbGUnICAgaWYgc3RhdHMuaXNGaWxlKClcbiAgIyAgIHJldHVybiAnc29ja2V0JyBpZiBzdGF0cy5pc1NvY2tldCgpXG4gICMgICByZXR1cm4gJ290aGVyJyAgICMgei5CLiAvZGV2L251bGwsIEJsb2NrIERldmljZVxuICAgICMgcmV0dXJuIG51bGxcbiAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBuZXdfZmFjZXQgPSAoIG5hbWUsIHZhbHVlICkgLT4gUiA9IE9iamVjdC5jcmVhdGUgbnVsbDsgUlsgbmFtZSBdID0gdmFsdWU7IFJcbiAgb2JqZWN0X2Zyb21fZG9sID0gKCBsaXRlcmFsICkgLT5cbiAgICBSID0gT2JqZWN0LmNyZWF0ZSBudWxsXG4gICAgT2JqZWN0LmFzc2lnbiBSLCBKU09OLnBhcnNlIGxpdGVyYWxcbiAgICByZXR1cm4gUlxuICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIHBhcnNlX2FyZ3YgPSAoIGFyZ3YgPSBudWxsICkgLT5cbiAgICBhcmd2ICAgICAgICA9IGlmIGFyZ3Y/IHRoZW4gWyBhcmd2Li4uLCBdIGVsc2UgcHJvY2Vzcy5hcmd2WyAyIC4uIF1cbiAgICBSICAgICAgICAgICA9IHsgYTogYXJndiwgYzogW10sIGQ6IFtdLCBlOiBbXSwgaTogZ2V0X3R5cGVfb2Zfc3RkaW4oKSwgbzogZ2V0X3R5cGVfb2Zfc3Rkb3V0KCksIHQ6IHsgYzogW10sIGQ6IFtdLCBlOiBbXSwgfSB9XG4gICAgIyBkZWJ1ZyAnzqlqc29uaWNrX19fMScsIGFyZ3ZcbiAgICBwYXN0X2ZlbmNlICA9IGZhbHNlXG4gICAgZm9yIGFyZ3VtZW50IGluIGFyZ3ZcbiAgICAgIGxleGVtZXMgPSBnLnNjYW5fdG9fbGlzdCBhcmd1bWVudFxuICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICB1bmxlc3MgbGV4ZW1lcy5sZW5ndGggaXMgMVxuICAgICAgICBSLmUucHVzaCBhcmd1bWVudFxuICAgICAgICBjb250aW51ZVxuICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICAjIHRhYnVsYXRlX2xleGVtZSBsZXhlbWVzWyAwIF0gIyMjICEhISEhISEhISEhISEhISAjIyNcbiAgICAgIHsgeHNsb3RcbiAgICAgICAgc2xvdFxuICAgICAgICB0eXBlXG4gICAgICAgIG5hbWVcbiAgICAgICAgdmFsdWVcbiAgICAgICAgc3RyaW5nIH0gPSBsZXhlbWVzWyAwIF0uZGF0YVxuICAgICAgc2xvdCA9IHhzbG90ID8gc2xvdFxuICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICBpZiBwYXN0X2ZlbmNlXG4gICAgICAgIFIuZC5wdXNoIHN0cmluZ1xuICAgICAgICBjb250aW51ZVxuICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICBSLnRbIHNsb3QgXS5wdXNoIHR5cGVcbiAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgc3dpdGNoIHR5cGVcbiAgICAgICAgd2hlbiAnZmVuY2UnXG4gICAgICAgICAgcGFzdF9mZW5jZSA9IHRydWVcbiAgICAgICAgd2hlbiAnYm9vbGVhbidcbiAgICAgICAgICBSWyBzbG90IF0ucHVzaCBuZXdfZmFjZXQgbmFtZSwgdmFsdWVcbiAgICAgICAgd2hlbiAnZmFjZXQnXG4gICAgICAgICAgUlsgc2xvdCBdLnB1c2ggbmV3X2ZhY2V0IG5hbWUsIHN0cmluZ1xuICAgICAgICB3aGVuICdkb2wnXG4gICAgICAgICAgdHJ5IFJbIHNsb3QgXS5wdXNoIG9iamVjdF9mcm9tX2RvbCBzdHJpbmcgY2F0Y2ggZXJyb3JcbiAgICAgICAgICAgIHRocm93IGVycm9yIHVubGVzcyBlcnJvciBpbnN0YW5jZW9mIFN5bnRheEVycm9yXG4gICAgICAgICAgICBSLmUucHVzaCBzdHJpbmdcbiAgICAgICAgd2hlbiAnb3RoZXInLCAnZXNjYXBlZCcsICd3b3JkJ1xuICAgICAgICAgICBSWyBzbG90IF0ucHVzaCBzdHJpbmdcbiAgICAgICAgZWxzZVxuICAgICAgICAgIHRocm93IG5ldyBFcnJvciBcIs6panNvbmlja19fXzIgc2hvdWxkIG5ldmVyIGhhcHBlbjogdW5rbm93biBsZXhlbWUgdHlwZSAje3JwciB0eXBlfVwiXG4gICAgcmV0dXJuIFJcbiAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBfaXNhX251bGxfcG9kID0gKCB4ICkgLT4gKCBPYmplY3QuZ2V0UHJvdG90eXBlT2YgeCApIGlzIG51bGxcbiAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBzaG93X2NkZWYgPSAoIGNkZWYgKSAtPlxuICAgIHByb2Nlc3Muc3Rkb3V0LndyaXRlIEpTT04uc3RyaW5naWZ5IGNkZWZcbiAgICA7bnVsbFxuICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICMgUFEgID0gcHJvY2Vzcy5hcmd2WyAyIC4uIF1cbiAgZyAgICAgICAgID0gbmV3X2dyYW1tYXIoKVxuICBjZGVmICAgICAgPSBwYXJzZV9hcmd2KClcbiAgc2hvd19jZGVmIGNkZWZcbiAgIyMjXG4gIFsgJ3JlcGxhY2U6NCcsICcrdXBwZXItY2FzZScsICcrJywgJy12ZXJib3NlJywgJ3tkOjh9JywgJ3tzOnRydWUsK2Jvb2wsfScsICd3b3JkczphIGInLCAneycsICd7XCJuYW1lXCI6dHJ1ZSxcIndpZHRoXCI6NDQ1fScgXVxuICAjIyNcbiAgO251bGxcblxuXG4jPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiMgbW9kdWxlLmV4cG9ydHMgPSB7IG5mYSwgZ2V0X3NpZ25hdHVyZSwgTm9ybWFsaXplX2Z1bmN0aW9uX2FyZ3VtZW50cywgVGVtcGxhdGUsIGludGVybmFscywgfVxuXG4jPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmlmIG1vZHVsZSBpcyByZXF1aXJlLm1haW4gdGhlbiBkbyA9PlxuICBkZW1vKClcbiAgO251bGxcbiJdfQ==
