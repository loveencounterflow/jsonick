#!/bin/env node
(function() {
  //!/bin/env node
  'use strict';
  var GUY, _isa_null_pod, alert, debug, demo, echo, get_type_of_stdin, get_type_of_stdout, help, info, inspect, isa_text, list_from_listlit, log, new_facet, nre, object_from_objectlit, parse_argv, patterns, plain, praise, rpr, show_cdef, type_of, urge, warn, whisper;

  //===========================================================================================================
  GUY = require('guy');

  ({alert, debug, help, info, plain, praise, urge, warn, whisper} = GUY.trm.get_loggers('normalize-cli-arguments'));

  ({rpr, inspect, echo, log} = GUY.trm);

  // white
  // green
  // blue
  // gold
  // grey
  // red
  // bold
  // reverse

    //-----------------------------------------------------------------------------------------------------------
  // SFMODULES                 = require 'bricabrac-sfmodules'
  // { type_of,              } = SFMODULES.unstable.require_type_of()
  // { Jetstream,
  //   internals,            } = SFMODULES.require_jetstream()
  // { get_type_of_stdin,    } = require 'bricabrac-sfmodules/lib/cli-get-type-of-stdin'
  // debug 'Ωjsonick___2', require 'bricabrac-sfmodules'
  ({get_type_of_stdin, get_type_of_stdout} = require('../../bricabrac-sfmodules/lib/cli-get-type-of-stdin-stdout'));

  ({type_of} = (require('../../bricabrac-sfmodules/lib/unstable-rpr-type_of-brics')).require_type_of());

  isa_text = function(x) {
    return (typeof x) === 'string';
  };

  //-----------------------------------------------------------------------------------------------------------
  /* thx to
    https://github.com/mathiasbynens/mothereff.in/blob/master/js-variables/eff.js
    https://mathiasbynens.be/notes/javascript-identifiers-es6
  */
  nre = /(?:[$_]|\p{ID_Start})(?:[$_\-\u200c\u200d]|\p{ID_Continue})*/v;

  // nre = jsonic_option_re.source

  // #-----------------------------------------------------------------------------------------------------------
  // new_grammar = ->
  //   R   = new Grammar { name: 'g', linking: false, emit_signals: false, }
  //   gnd = R.new_level { name: 'gnd', }
  //   gnd.new_token 'fence',  '--',                                                     { data: { slot: null, type: 'fence', string: '--',  }, }
  //   gnd.new_token 'numberlit',  rx"(?<string>[+\-]?[.]?[0-9].*)$",                    { data: { slot: 'd', type: 'numberlit', }, }
  //   gnd.new_token 'escaped',    rx"(?<string>%.+)$",                                  { data: { slot: 'd', type: 'escaped', }, }
  //   gnd.new_token 'btrue',      rx"\+((?<xslot>d)\.)?(?<name>#{nre})$",               { data: { slot: 'c', type: 'boolean', string: 'true',   value: true,  }, }
  //   gnd.new_token 'bfalse',     rx"-((?<xslot>d)\.)?(?<name>#{nre})$",                { data: { slot: 'c', type: 'boolean', string: 'false',  value: false, }, }
  //   gnd.new_token 'objectlit',  rx"(?<string>\{.*)$",                                 { data: { slot: 'd', type: 'objectlit',                                  }, }
  //   gnd.new_token 'listlit',    rx"(?<string>\[.*)$",                                 { data: { slot: 'd', type: 'listlit',                                   }, }
  //   gnd.new_token 'facet',      rx":((?<xslot>d)\.)?(?<name>#{nre})=(?<string>.*)$",  { data: { slot: 'c', type: 'facet',                                 }, }
  //   gnd.new_token 'other',      rx"(?<string>[\-+:\{\[].*)$",                         { data: { slot: 'e', type: 'other', name: null,                     }, }
  //   gnd.new_token 'word',       rx"(?<string>.+)$",                                   { data: { slot: 'd', type: 'word', name: null,                     }, }
  //   return R

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
  patterns = {
    num_re: /^(?<v>[+\-]?[.]?[0-9].*)$/v,
    bol_re: RegExp(`^[+\\-]((?<slot>d)\\.)?(?<n>${nre.source})$`, "v"),
    fac_re: RegExp(`^:((?<slot>d)\\.)?(?<n>${nre.source})=(?<v>.*)$`, "v")
  };

  //-----------------------------------------------------------------------------------------------------------
  parse_argv = function(argv = null) {
    var R, entry, i, len, match, n, past_fence, ref, ref1, s, s0, slot, t, v, x;
    argv = argv != null ? [...argv] : process.argv.slice(2);
    R = {
      a: argv,
      c: [],
      d: [],
      e: [],
      i: get_type_of_stdin(),
      o: get_type_of_stdout()
    };
    if (argv.length === 0) {
      return R;
    }
    //.........................................................................................................
    past_fence = false;
    for (x = i = 0, len = argv.length; i < len; x = ++i) {
      s = argv[x];
      if (!isa_text(s)) {
        throw new Error(`Ωjsonick___2 at argv[ ${x} ]: expected a string, got a ${type_of(s)}`);
      }
      if (s.length === 0/* Should never happen */) {
        continue;
      }
      //.....................................................................................................
      if (past_fence) {
        R.d.push({
          t: 'pfn',
          v: s,
          x
        });
        continue;
      }
      //.....................................................................................................
      s0 = s[0];
      slot = 'd';
      t = null;
      v = null;
      n = null;
      switch (s0) {
        //.....................................................................................................
        case '.':
        case '0':
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
          t = (s0 !== '.') || ((s0 === '.') && (patterns.num_re.test(s))) ? 'num' : 'bar';
          break;
        //.....................................................................................................
        case '-':
        case '+':
          //...................................................................................................
          if (s === '--') {
            past_fence = true;
            continue;
          }
          //...................................................................................................
          t = 'num';
          if ((match = s.match(patterns.num_re)) != null) {
            break;
          }
          //...................................................................................................
          t = 'bol';
          if ((match = s.match(patterns.bol_re)) != null) {
            slot = (ref = match.groups.slot) != null ? ref : 'c';
            v = s0 === '+' ? true : false;
            n = match.groups.n;
            break;
          }
          //...................................................................................................
          slot = 'e';
          break;
        //.....................................................................................................
        case ':':
          t = 'fac';
          if ((match = s.match(patterns.fac_re)) != null) {
            slot = (ref1 = match.groups.slot) != null ? ref1 : 'c';
            v = match.groups.v;
            n = match.groups.n;
            break;
          }
          //...................................................................................................
          slot = 'e';
          break;
        //.....................................................................................................
        case '%':
          t = 'esc';
          v = s.slice(1);
          break;
        //.....................................................................................................
        case '{':
          t = 'obj';
          break;
        //.....................................................................................................
        case '[':
          t = 'lst';
          break;
        default:
          //.....................................................................................................
          t = 'bar';
      }
      entry = {t};
      if (n != null) {
        entry.n = n;
      }
      if (slot !== 'e') {
        entry.v = v != null ? v : s;
      }
      entry.x = x;
      R[slot].push(entry);
    }
    //.........................................................................................................
    return R;
  };

  // #=========================================================================================================
  // return null
  // # debug 'Ωjsonick___1', argv
  // # grammar    ?= new_grammar()
  // for argument in argv
  //   #.....................................................................................................
  //   lexemes = grammar.scan_to_list argument
  //   #.....................................................................................................
  //   unless lexemes.length is 1
  //     R.e.push argument
  //     continue
  //   #.....................................................................................................
  //   # tabulate_lexeme lexemes[ 0 ] ### !!!!!!!!!!!!!!! ###
  //   { xslot
  //     slot
  //     type
  //     name
  //     value
  //     string } = lexemes[ 0 ].data
  //   slot = xslot ? slot
  //   #.......................................................................................................
  //   switch type
  //     when 'boolean'                                then R[ slot ].push new_facet name, value
  //     when 'facet'                                  then R[ slot ].push new_facet name, string
  //     when 'other', 'escaped', 'word', 'numberlit'  then R[ slot ].push string
  //     #.....................................................................................................
  //     when 'objectlit', 'listlit'
  //       method = if type is 'objectlit' then object_from_objectlit else list_from_listlit
  //       try
  //         R[ slot ].push method string
  //       catch error
  //         throw error unless error instanceof SyntaxError
  //         R.e.push string
  //         slot  = 'e'
  //         type  = "e#{type}"
  //     #.....................................................................................................
  //     when 'fence'
  //       past_fence = true
  //       continue
  //     #.....................................................................................................
  //     else throw new Error "Ωjsonick___2 should never happen: unknown lexeme type #{rpr type}"
  //   R.t[ slot ].push type
  // return R

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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2FuYWx5emUtY2xpLWFyZ3VtZW50cy1waGFzZS0xLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBZTtFQUFBO0VBRWY7QUFGZSxNQUFBLEdBQUEsRUFBQSxhQUFBLEVBQUEsS0FBQSxFQUFBLEtBQUEsRUFBQSxJQUFBLEVBQUEsSUFBQSxFQUFBLGlCQUFBLEVBQUEsa0JBQUEsRUFBQSxJQUFBLEVBQUEsSUFBQSxFQUFBLE9BQUEsRUFBQSxRQUFBLEVBQUEsaUJBQUEsRUFBQSxHQUFBLEVBQUEsU0FBQSxFQUFBLEdBQUEsRUFBQSxxQkFBQSxFQUFBLFVBQUEsRUFBQSxRQUFBLEVBQUEsS0FBQSxFQUFBLE1BQUEsRUFBQSxHQUFBLEVBQUEsU0FBQSxFQUFBLE9BQUEsRUFBQSxJQUFBLEVBQUEsSUFBQSxFQUFBLE9BQUE7OztFQUtmLEdBQUEsR0FBNEIsT0FBQSxDQUFRLEtBQVI7O0VBQzVCLENBQUEsQ0FBRSxLQUFGLEVBQ0UsS0FERixFQUVFLElBRkYsRUFHRSxJQUhGLEVBSUUsS0FKRixFQUtFLE1BTEYsRUFNRSxJQU5GLEVBT0UsSUFQRixFQVFFLE9BUkYsQ0FBQSxHQVE0QixHQUFHLENBQUMsR0FBRyxDQUFDLFdBQVIsQ0FBb0IseUJBQXBCLENBUjVCOztFQVNBLENBQUEsQ0FBRSxHQUFGLEVBQ0UsT0FERixFQUVFLElBRkYsRUFHRSxHQUhGLENBQUEsR0FHNEIsR0FBRyxDQUFDLEdBSGhDLEVBZmU7Ozs7Ozs7Ozs7Ozs7Ozs7OztFQW1DZixDQUFBLENBQUUsaUJBQUYsRUFDRSxrQkFERixDQUFBLEdBQzRCLE9BQUEsQ0FBUSw0REFBUixDQUQ1Qjs7RUFFQSxDQUFBLENBQUUsT0FBRixDQUFBLEdBQTRCLENBQUUsT0FBQSxDQUFRLDBEQUFSLENBQUYsQ0FBc0UsQ0FBQyxlQUF2RSxDQUFBLENBQTVCOztFQUNBLFFBQUEsR0FBNEIsUUFBQSxDQUFFLENBQUYsQ0FBQTtXQUFTLENB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QUY7TUFDWixJQUFpQixTQUFqQjtRQUFBLEtBQUssQ0FBQyxDQUFOLEdBQVksRUFBWjs7TUFDQSxJQUF5QixJQUFBLEtBQVEsR0FBakM7UUFBQSxLQUFLLENBQUMsQ0FBTixlQUFZLElBQUksRUFBaEI7O01BQ0EsS0FBSyxDQUFDLENBQU4sR0FBWTtNQUNaLENBQUMsQ0FBRSxJQUFGLENBQVEsQ0FBQyxJQUFWLENBQWUsS0FBZjtJQTlERixDQUxGOztBQXFFRSxXQUFPO0VBdEVJLEVBdEZFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztFQTRNZixhQUFBLEdBQWdCLFFBQUEsQ0FBRSxDQUFGLENBQUE7V0FBUyxDQUFFLE1BQU0sQ0FBQyxjQUFQLENBQXNCLENBQXRCLENBQUYsQ0FBQSxLQUErQjtFQUF4QyxFQTVNRDs7O0VBK01mLFNBQUEsR0FBWSxRQUFBLENBQUUsSUFBRixDQUFBO0lBQ1YsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFmLENBQXFCLElBQUksQ0FBQyxTQUFMLENBQWUsSUFBZixDQUFyQjtXQUNDO0VBRlMsRUEvTUc7OztFQXFOZixJQUFBLEdBQU8sUUFBQSxDQUFBLENBQUE7QUFDUCxRQUFBLElBQUE7OztJQUVFLElBQUEsR0FBWSxVQUFBLENBQUE7SUFDWixTQUFBLENBQVUsSUFBVixFQUhGOzs7O1dBT0c7RUFSSSxFQXJOUTs7O0VBaU9mLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLENBQUUsVUFBRixFQWpPRjs7O0VBb09mLElBQUcsTUFBQSxLQUFVLE9BQU8sQ0FBQyxJQUFyQjtJQUFrQyxDQUFBLENBQUEsQ0FBQSxHQUFBO01BQ2hDLElBQUEsQ0FBQTthQUNDO0lBRitCLENBQUEsSUFBbEM7O0FBcE9lIiwic291cmNlc0NvbnRlbnQiOlsiIyEvYmluL2VudiBub2RlXG5cbid1c2Ugc3RyaWN0J1xuXG4jPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbkdVWSAgICAgICAgICAgICAgICAgICAgICAgPSByZXF1aXJlICdndXknXG57IGFsZXJ0XG4gIGRlYnVnXG4gIGhlbHBcbiAgaW5mb1xuICBwbGFpblxuICBwcmFpc2VcbiAgdXJnZVxuICB3YXJuXG4gIHdoaXNwZXIgfSAgICAgICAgICAgICAgID0gR1VZLnRybS5nZXRfbG9nZ2VycyAnbm9ybWFsaXplLWNsaS1hcmd1bWVudHMnXG57IHJwclxuICBpbnNwZWN0XG4gIGVjaG9cbiAgbG9nICAgICB9ICAgICAgICAgICAgICAgPSBHVVkudHJtXG4gICMgd2hpdGVcbiAgIyBncmVlblxuICAjIGJsdWVcbiAgIyBnb2xkXG4gICMgZ3JleVxuICAjIHJlZFxuICAjIGJvbGRcbiAgIyByZXZlcnNlXG5cbiMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuIyBTRk1PRFVMRVMgICAgICAgICAgICAgICAgID0gcmVxdWlyZSAnYnJpY2FicmFjLXNmbW9kdWxlcydcbiMgeyB0eXBlX29mLCAgICAgICAgICAgICAgfSA9IFNGTU9EVUxFUy51bnN0YWJsZS5yZXF1aXJlX3R5cGVfb2YoKVxuIyB7IEpldHN0cmVhbSxcbiMgICBpbnRlcm5hbHMsICAgICAgICAgICAgfSA9IFNGTU9EVUxFUy5yZXF1aXJlX2pldHN0cmVhbSgpXG4jIHsgZ2V0X3R5cGVfb2Zfc3RkaW4sICAgIH0gPSByZXF1aXJlICdicmljYWJyYWMtc2Ztb2R1bGVzL2xpYi9jbGktZ2V0LXR5cGUtb2Ytc3RkaW4nXG4jIGRlYnVnICfOqWpzb25pY2tfX18yJywgcmVxdWlyZSAnYnJpY2FicmFjLXNmbW9kdWxlcydcbnsgZ2V0X3R5cGVfb2Zfc3RkaW5cbiAgZ2V0X3R5cGVfb2Zfc3Rkb3V0ICAgIH0gPSByZXF1aXJlICcuLi8uLi9icmljYWJyYWMtc2Ztb2R1bGVzL2xpYi9jbGktZ2V0LXR5cGUtb2Ytc3RkaW4tc3Rkb3V0J1xueyB0eXBlX29mLCAgICAgICAgICAgICAgfSA9ICggcmVxdWlyZSAnLi4vLi4vYnJpY2FicmFjLXNmbW9kdWxlcy9saWIvdW5zdGFibGUtcnByLXR5cGVfb2YtYnJpY3MnICkucmVxdWlyZV90eXBlX29mKClcbmlzYV90ZXh0ICAgICAgICAgICAgICAgICAgPSAoIHggKSAtPiAoIHR5cGVvZiB4ICkgaXMgJ3N0cmluZydcblxuIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4jIyMgdGh4IHRvXG4gIGh0dHBzOi8vZ2l0aHViLmNvbS9tYXRoaWFzYnluZW5zL21vdGhlcmVmZi5pbi9ibG9iL21hc3Rlci9qcy12YXJpYWJsZXMvZWZmLmpzXG4gIGh0dHBzOi8vbWF0aGlhc2J5bmVucy5iZS9ub3Rlcy9qYXZhc2NyaXB0LWlkZW50aWZpZXJzLWVzNlxuIyMjXG5ucmUgPSAvLy9cbiAgKD86IFsgJF8gXSAgICAgICAgICAgICAgICAgICAgICAgIHwgXFxwe0lEX1N0YXJ0fSAgICApXG4gICg/OiBbICQgXyBcXC0gXFx1ezIwMGN9IFxcdXsyMDBkfSBdICB8IFxccHtJRF9Db250aW51ZX0gKSpcbiAgLy8vdlxuIyBucmUgPSBqc29uaWNfb3B0aW9uX3JlLnNvdXJjZVxuXG4jICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuIyBuZXdfZ3JhbW1hciA9IC0+XG4jICAgUiAgID0gbmV3IEdyYW1tYXIgeyBuYW1lOiAnZycsIGxpbmtpbmc6IGZhbHNlLCBlbWl0X3NpZ25hbHM6IGZhbHNlLCB9XG4jICAgZ25kID0gUi5uZXdfbGV2ZWwgeyBuYW1lOiAnZ25kJywgfVxuIyAgIGduZC5uZXdfdG9rZW4gJ2ZlbmNlJywgICctLScsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IGRhdGE6IHsgc2xvdDogbnVsbCwgdHlwZTogJ2ZlbmNlJywgc3RyaW5nOiAnLS0nLCAgfSwgfVxuIyAgIGduZC5uZXdfdG9rZW4gJ251bWJlcmxpdCcsICByeFwiKD88c3RyaW5nPlsrXFwtXT9bLl0/WzAtOV0uKikkXCIsICAgICAgICAgICAgICAgICAgICB7IGRhdGE6IHsgc2xvdDogJ2QnLCB0eXBlOiAnbnVtYmVybGl0JywgfSwgfVxuIyAgIGduZC5uZXdfdG9rZW4gJ2VzY2FwZWQnLCAgICByeFwiKD88c3RyaW5nPiUuKykkXCIsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgZGF0YTogeyBzbG90OiAnZCcsIHR5cGU6ICdlc2NhcGVkJywgfSwgfVxuIyAgIGduZC5uZXdfdG9rZW4gJ2J0cnVlJywgICAgICByeFwiXFwrKCg/PHhzbG90PmQpXFwuKT8oPzxuYW1lPiN7bnJlfSkkXCIsICAgICAgICAgICAgICAgeyBkYXRhOiB7IHNsb3Q6ICdjJywgdHlwZTogJ2Jvb2xlYW4nLCBzdHJpbmc6ICd0cnVlJywgICB2YWx1ZTogdHJ1ZSwgIH0sIH1cbiMgICBnbmQubmV3X3Rva2VuICdiZmFsc2UnLCAgICAgcnhcIi0oKD88eHNsb3Q+ZClcXC4pPyg/PG5hbWU+I3tucmV9KSRcIiwgICAgICAgICAgICAgICAgeyBkYXRhOiB7IHNsb3Q6ICdjJywgdHlwZTogJ2Jvb2xlYW4nLCBzdHJpbmc6ICdmYWxzZScsICB2YWx1ZTogZmFsc2UsIH0sIH1cbiMgICBnbmQubmV3X3Rva2VuICdvYmplY3RsaXQnLCAgcnhcIig/PHN0cmluZz5cXHsuKikkXCIsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyBkYXRhOiB7IHNsb3Q6ICdkJywgdHlwZTogJ29iamVjdGxpdCcsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIH1cbiMgICBnbmQubmV3X3Rva2VuICdsaXN0bGl0JywgICAgcnhcIig/PHN0cmluZz5cXFsuKikkXCIsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyBkYXRhOiB7IHNsb3Q6ICdkJywgdHlwZTogJ2xpc3RsaXQnLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgfVxuIyAgIGduZC5uZXdfdG9rZW4gJ2ZhY2V0JywgICAgICByeFwiOigoPzx4c2xvdD5kKVxcLik/KD88bmFtZT4je25yZX0pPSg/PHN0cmluZz4uKikkXCIsICB7IGRhdGE6IHsgc2xvdDogJ2MnLCB0eXBlOiAnZmFjZXQnLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIH1cbiMgICBnbmQubmV3X3Rva2VuICdvdGhlcicsICAgICAgcnhcIig/PHN0cmluZz5bXFwtKzpcXHtcXFtdLiopJFwiLCAgICAgICAgICAgICAgICAgICAgICAgICB7IGRhdGE6IHsgc2xvdDogJ2UnLCB0eXBlOiAnb3RoZXInLCBuYW1lOiBudWxsLCAgICAgICAgICAgICAgICAgICAgIH0sIH1cbiMgICBnbmQubmV3X3Rva2VuICd3b3JkJywgICAgICAgcnhcIig/PHN0cmluZz4uKykkXCIsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IGRhdGE6IHsgc2xvdDogJ2QnLCB0eXBlOiAnd29yZCcsIG5hbWU6IG51bGwsICAgICAgICAgICAgICAgICAgICAgfSwgfVxuIyAgIHJldHVybiBSXG5cbiMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxubmV3X2ZhY2V0ID0gKCBuYW1lLCB2YWx1ZSApIC0+IFIgPSBPYmplY3QuY3JlYXRlIG51bGw7IFJbIG5hbWUgXSA9IHZhbHVlOyBSXG5cbiMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxub2JqZWN0X2Zyb21fb2JqZWN0bGl0ID0gKCBvYmplY3RsaXQgKSAtPlxuICBSID0gT2JqZWN0LmNyZWF0ZSBudWxsXG4gIE9iamVjdC5hc3NpZ24gUiwgSlNPTi5wYXJzZSBvYmplY3RsaXRcbiAgcmV0dXJuIFJcblxuIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5saXN0X2Zyb21fbGlzdGxpdCA9ICggbGlzdGxpdCApIC0+IEpTT04ucGFyc2UgbGlzdGxpdFxuXG4jLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbnBhdHRlcm5zID1cbiAgbnVtX3JlOiAgIC8vL14gKD88dj4gWytcXC1dPyBbLl0/IFswLTldLiogKSAkLy8vdlxuICBib2xfcmU6ICAgLy8vXiBbK1xcLV0gKCAoPzxzbG90PiBkICkgXFwuICk/ICg/PG4+ICN7bnJlLnNvdXJjZX0pICAgICAgICAgICAgICAkLy8vdlxuICBmYWNfcmU6ICAgLy8vXiA6ICAgICAoICg/PHNsb3Q+IGQgKSBcXC4gKT8gKD88bj4gI3tucmUuc291cmNlfSkgPSAoPzx2PiAuKiApICQvLy92XG5cbiMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxucGFyc2VfYXJndiA9ICggYXJndiA9IG51bGwgKSAtPlxuICBhcmd2ICA9IGlmIGFyZ3Y/IHRoZW4gWyBhcmd2Li4uLCBdIGVsc2UgcHJvY2Vzcy5hcmd2WyAyIC4uIF1cbiAgUiAgICAgPSB7IGE6IGFyZ3YsIGM6IFtdLCBkOiBbXSwgZTogW10sIGk6IGdldF90eXBlX29mX3N0ZGluKCksIG86IGdldF90eXBlX29mX3N0ZG91dCgpLCB9XG4gIHJldHVybiBSIGlmIGFyZ3YubGVuZ3RoIGlzIDBcbiAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICBwYXN0X2ZlbmNlICA9IGZhbHNlXG4gIGZvciBzLCB4IGluIGFyZ3ZcbiAgICB0aHJvdyBuZXcgRXJyb3IgXCLOqWpzb25pY2tfX18yIGF0IGFyZ3ZbICN7eH0gXTogZXhwZWN0ZWQgYSBzdHJpbmcsIGdvdCBhICN7dHlwZV9vZiBzfVwiIHVubGVzcyBpc2FfdGV4dCBzXG4gICAgY29udGludWUgaWYgcy5sZW5ndGggaXMgMCAjIyMgU2hvdWxkIG5ldmVyIGhhcHBlbiAjIyNcbiAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICBpZiBwYXN0X2ZlbmNlXG4gICAgICBSLmQucHVzaCB7IHQ6ICdwZm4nLCB2OiBzLCB4LCB9XG4gICAgICBjb250aW51ZVxuICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgIHMwICA9IHNbIDAgXVxuICAgIHNsb3QgICAgPSAnZCdcbiAgICB0ICAgICAgID0gbnVsbFxuICAgIHYgICAgICAgPSBudWxsXG4gICAgbiAgICAgICA9IG51bGxcbiAgICBzd2l0Y2ggczBcbiAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgd2hlbiAnLicsICcwJywgJzEnLCAnMicsICczJywgJzQnLCAnNScsICc2JywgJzcnLCAnOCcsICc5J1xuICAgICAgICB0ID0gaWYgKCBzMCBpc250ICcuJyApIG9yICggKCBzMCBpcyAnLicgKSBhbmQgKCBwYXR0ZXJucy5udW1fcmUudGVzdCBzICkgKSB0aGVuICdudW0nIGVsc2UgJ2JhcidcbiAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgd2hlbiAnLScsICcrJ1xuICAgICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICAgIGlmIHMgaXMgJy0tJ1xuICAgICAgICAgIHBhc3RfZmVuY2UgPSB0cnVlXG4gICAgICAgICAgY29udGludWVcbiAgICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgICB0ID0gJ251bSdcbiAgICAgICAgYnJlYWsgaWYgKCBtYXRjaCA9IHMubWF0Y2ggcGF0dGVybnMubnVtX3JlICk/XG4gICAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgICAgdCA9ICdib2wnXG4gICAgICAgIGlmICggbWF0Y2ggPSBzLm1hdGNoIHBhdHRlcm5zLmJvbF9yZSApP1xuICAgICAgICAgIHNsb3QgID0gbWF0Y2guZ3JvdXBzLnNsb3QgPyAnYydcbiAgICAgICAgICB2ICAgICA9IGlmIHMwIGlzICcrJyB0aGVuIHRydWUgZWxzZSBmYWxzZVxuICAgICAgICAgIG4gICAgID0gbWF0Y2guZ3JvdXBzLm5cbiAgICAgICAgICBicmVha1xuICAgICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICAgIHNsb3QgPSAnZSdcbiAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgd2hlbiAnOidcbiAgICAgICAgdCAgICAgPSAnZmFjJ1xuICAgICAgICBpZiAoIG1hdGNoID0gcy5tYXRjaCBwYXR0ZXJucy5mYWNfcmUgKT9cbiAgICAgICAgICBzbG90ICA9IG1hdGNoLmdyb3Vwcy5zbG90ID8gJ2MnXG4gICAgICAgICAgdiAgICAgPSBtYXRjaC5ncm91cHMudlxuICAgICAgICAgIG4gICAgID0gbWF0Y2guZ3JvdXBzLm5cbiAgICAgICAgICBicmVha1xuICAgICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICAgIHNsb3QgPSAnZSdcbiAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgd2hlbiAnJSdcbiAgICAgICAgdCAgICAgPSAnZXNjJ1xuICAgICAgICB2ICAgICA9IHNbIDEgLi4gXVxuICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICB3aGVuICd7J1xuICAgICAgICB0ICAgICA9ICdvYmonXG4gICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgIHdoZW4gJ1snXG4gICAgICAgIHQgICAgID0gJ2xzdCdcbiAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgZWxzZVxuICAgICAgICB0ICAgICA9ICdiYXInXG4gICAgZW50cnkgICAgID0geyB0LCB9XG4gICAgZW50cnkubiAgID0gbiBpZiBuP1xuICAgIGVudHJ5LnYgICA9IHYgPyBzIHVubGVzcyBzbG90IGlzICdlJ1xuICAgIGVudHJ5LnggICA9IHhcbiAgICBSWyBzbG90IF0ucHVzaCBlbnRyeVxuICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gIHJldHVybiBSXG5cblxuICAjICM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgIyByZXR1cm4gbnVsbFxuICAjICMgZGVidWcgJ86panNvbmlja19fXzEnLCBhcmd2XG4gICMgIyBncmFtbWFyICAgID89IG5ld19ncmFtbWFyKClcbiAgIyBmb3IgYXJndW1lbnQgaW4gYXJndlxuICAjICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICMgICBsZXhlbWVzID0gZ3JhbW1hci5zY2FuX3RvX2xpc3QgYXJndW1lbnRcbiAgIyAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAjICAgdW5sZXNzIGxleGVtZXMubGVuZ3RoIGlzIDFcbiAgIyAgICAgUi5lLnB1c2ggYXJndW1lbnRcbiAgIyAgICAgY29udGludWVcbiAgIyAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAjICAgIyB0YWJ1bGF0ZV9sZXhlbWUgbGV4ZW1lc1sgMCBdICMjIyAhISEhISEhISEhISEhISEgIyMjXG4gICMgICB7IHhzbG90XG4gICMgICAgIHNsb3RcbiAgIyAgICAgdHlwZVxuICAjICAgICBuYW1lXG4gICMgICAgIHZhbHVlXG4gICMgICAgIHN0cmluZyB9ID0gbGV4ZW1lc1sgMCBdLmRhdGFcbiAgIyAgIHNsb3QgPSB4c2xvdCA/IHNsb3RcbiAgIyAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICMgICBzd2l0Y2ggdHlwZVxuICAjICAgICB3aGVuICdib29sZWFuJyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhlbiBSWyBzbG90IF0ucHVzaCBuZXdfZmFjZXQgbmFtZSwgdmFsdWVcbiAgIyAgICAgd2hlbiAnZmFjZXQnICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoZW4gUlsgc2xvdCBdLnB1c2ggbmV3X2ZhY2V0IG5hbWUsIHN0cmluZ1xuICAjICAgICB3aGVuICdvdGhlcicsICdlc2NhcGVkJywgJ3dvcmQnLCAnbnVtYmVybGl0JyAgdGhlbiBSWyBzbG90IF0ucHVzaCBzdHJpbmdcbiAgIyAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICMgICAgIHdoZW4gJ29iamVjdGxpdCcsICdsaXN0bGl0J1xuICAjICAgICAgIG1ldGhvZCA9IGlmIHR5cGUgaXMgJ29iamVjdGxpdCcgdGhlbiBvYmplY3RfZnJvbV9vYmplY3RsaXQgZWxzZSBsaXN0X2Zyb21fbGlzdGxpdFxuICAjICAgICAgIHRyeVxuICAjICAgICAgICAgUlsgc2xvdCBdLnB1c2ggbWV0aG9kIHN0cmluZ1xuICAjICAgICAgIGNhdGNoIGVycm9yXG4gICMgICAgICAgICB0aHJvdyBlcnJvciB1bmxlc3MgZXJyb3IgaW5zdGFuY2VvZiBTeW50YXhFcnJvclxuICAjICAgICAgICAgUi5lLnB1c2ggc3RyaW5nXG4gICMgICAgICAgICBzbG90ICA9ICdlJ1xuICAjICAgICAgICAgdHlwZSAgPSBcImUje3R5cGV9XCJcbiAgIyAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICMgICAgIHdoZW4gJ2ZlbmNlJ1xuICAjICAgICAgIHBhc3RfZmVuY2UgPSB0cnVlXG4gICMgICAgICAgY29udGludWVcbiAgIyAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICMgICAgIGVsc2UgdGhyb3cgbmV3IEVycm9yIFwizqlqc29uaWNrX19fMiBzaG91bGQgbmV2ZXIgaGFwcGVuOiB1bmtub3duIGxleGVtZSB0eXBlICN7cnByIHR5cGV9XCJcbiAgIyAgIFIudFsgc2xvdCBdLnB1c2ggdHlwZVxuICAjIHJldHVybiBSXG5cbiMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuX2lzYV9udWxsX3BvZCA9ICggeCApIC0+ICggT2JqZWN0LmdldFByb3RvdHlwZU9mIHggKSBpcyBudWxsXG5cbiMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuc2hvd19jZGVmID0gKCBjZGVmICkgLT5cbiAgcHJvY2Vzcy5zdGRvdXQud3JpdGUgSlNPTi5zdHJpbmdpZnkgY2RlZlxuICA7bnVsbFxuXG5cbiM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZGVtbyA9IC0+XG4gICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgIyBQUSAgPSBwcm9jZXNzLmFyZ3ZbIDIgLi4gXVxuICBjZGVmICAgICAgPSBwYXJzZV9hcmd2KClcbiAgc2hvd19jZGVmIGNkZWZcbiAgIyMjXG4gIFsgJ3JlcGxhY2U6NCcsICcrdXBwZXItY2FzZScsICcrJywgJy12ZXJib3NlJywgJ3tkOjh9JywgJ3tzOnRydWUsK2Jvb2wsfScsICd3b3JkczphIGInLCAneycsICd7XCJuYW1lXCI6dHJ1ZSxcIndpZHRoXCI6NDQ1fScgXVxuICAjIyNcbiAgO251bGxcblxuXG4jPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbm1vZHVsZS5leHBvcnRzID0geyBwYXJzZV9hcmd2LCB9XG5cbiM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuaWYgbW9kdWxlIGlzIHJlcXVpcmUubWFpbiB0aGVuIGRvID0+XG4gIGRlbW8oKVxuICA7bnVsbFxuIl19
