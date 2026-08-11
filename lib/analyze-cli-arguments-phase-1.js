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
      slot = 'd';
      t = null;
      v = null;
      n = null;
      //.......................................................................................................
      if (patterns.num_re.test(s)) {
        t = 'num';
      } else {
        //.......................................................................................................
        switch (s0 = s[0]) {
          //.....................................................................................................
          case '-':
          case '+':
            //...................................................................................................
            if (s === '--') {
              past_fence = true;
              continue;
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
          case '[':
            t = 'lst';
            break;
          default:
            t = 'bar';
        }
      }
      //.......................................................................................................
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2FuYWx5emUtY2xpLWFyZ3VtZW50cy1waGFzZS0xLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBZTtFQUFBO0VBRWY7QUFGZSxNQUFBLEdBQUEsRUFBQSxhQUFBLEVBQUEsS0FBQSxFQUFBLEtBQUEsRUFBQSxJQUFBLEVBQUEsSUFBQSxFQUFBLGlCQUFBLEVBQUEsa0JBQUEsRUFBQSxJQUFBLEVBQUEsSUFBQSxFQUFBLE9BQUEsRUFBQSxRQUFBLEVBQUEsaUJBQUEsRUFBQSxHQUFBLEVBQUEsU0FBQSxFQUFBLEdBQUEsRUFBQSxxQkFBQSxFQUFBLFVBQUEsRUFBQSxRQUFBLEVBQUEsS0FBQSxFQUFBLE1BQUEsRUFBQSxHQUFBLEVBQUEsU0FBQSxFQUFBLE9BQUEsRUFBQSxJQUFBLEVBQUEsSUFBQSxFQUFBLE9BQUE7OztFQUtmLEdBQUEsR0FBNEIsT0FBQSxDQUFRLEtBQVI7O0VBQzVCLENBQUEsQ0FBRSxLQUFGLEVBQ0UsS0FERixFQUVFLElBRkYsRUFHRSxJQUhGLEVBSUUsS0FKRixFQUtFLE1BTEYsRUFNRSxJQU5GLEVBT0UsSUFQRixFQVFFLE9BUkYsQ0FBQSxHQVE0QixHQUFHLENBQUMsR0FBRyxDQUFDLFdBQVIsQ0FBb0IseUJBQXBCLENBUjVCOztFQVNBLENBQUEsQ0FBRSxHQUFGLEVBQ0UsT0FERixFQUVFLElBRkYsRUFHRSxHQUhGLENBQUEsR0FHNEIsR0FBRyxDQUFDLEdBSGhDLEVBZmU7Ozs7Ozs7Ozs7Ozs7Ozs7OztFQW1DZixDQUFBLENBQUUsaUJBQUYsRUFDRSxrQkFERixDQUFBLEdBQzRCLE9BQUEsQ0FBUSw0REFBUixDQUQ1Qjs7RUFFQSxDQUFBLENBQUUsT0FBRixDQUFBLEdBQTRCLENBQUUsT0FBQSxDQUFRLDBEQUFSLENBQUYsQ0FBc0UsQ0FBQyxlQUF2RSxDQUFBLENBQTVCOztFQUNBLFFBQUEsR0FBNEIsUUFBQSxDQUFFLENBQUYsQ0FBQTtXQUFTLENB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QVMsQ0FBRSxNQUFNLENBQUMsY0FBUCxDQUFzQixDQUF0QixDQUFGLENBQUEsS0FBK0I7RUFBeEMsRUFyTUQ7OztFQXdNZixTQUFBLEdBQVksUUFBQSxDQUFFLElBQUYsQ0FBQTtJQUNWLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBZixDQUFxQixJQUFJLENBQUMsU0FBTCxDQUFlLElBQWYsQ0FBckI7V0FDQztFQUZTLEVBeE1HOzs7RUE4TWYsSUFBQSxHQUFPLFFBQUEsQ0FBQSxDQUFBO0FBQ1AsUUFBQSxJQUFBOzs7SUFFRSxJQUFBLEdBQVksVUFBQSxDQUFBO0lBQ1osU0FBQSxDQUFVLElBQVYsRUFIRjs7OztXQU9HO0VBUkksRUE5TVE7OztFQTBOZixNQUFNLENBQUMsT0FBUCxHQUFpQixDQUFFLFVBQUYsRUExTkY7OztFQTZOZixJQUFHLE1BQUEsS0FBVSxPQUFPLENBQUMsSUFBckI7SUFBa0MsQ0FBQSxDQUFBLENBQUEsR0FBQTtNQUNoQyxJQUFBLENBQUE7YUFDQztJQUYrQixDQUFBLElBQWxDOztBQTdOZSIsInNvdXJjZXNDb250ZW50IjpbIiMhL2Jpbi9lbnYgbm9kZVxuXG4ndXNlIHN0cmljdCdcblxuIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5HVVkgICAgICAgICAgICAgICAgICAgICAgID0gcmVxdWlyZSAnZ3V5J1xueyBhbGVydFxuICBkZWJ1Z1xuICBoZWxwXG4gIGluZm9cbiAgcGxhaW5cbiAgcHJhaXNlXG4gIHVyZ2VcbiAgd2FyblxuICB3aGlzcGVyIH0gICAgICAgICAgICAgICA9IEdVWS50cm0uZ2V0X2xvZ2dlcnMgJ25vcm1hbGl6ZS1jbGktYXJndW1lbnRzJ1xueyBycHJcbiAgaW5zcGVjdFxuICBlY2hvXG4gIGxvZyAgICAgfSAgICAgICAgICAgICAgID0gR1VZLnRybVxuICAjIHdoaXRlXG4gICMgZ3JlZW5cbiAgIyBibHVlXG4gICMgZ29sZFxuICAjIGdyZXlcbiAgIyByZWRcbiAgIyBib2xkXG4gICMgcmV2ZXJzZVxuXG4jLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiMgU0ZNT0RVTEVTICAgICAgICAgICAgICAgICA9IHJlcXVpcmUgJ2JyaWNhYnJhYy1zZm1vZHVsZXMnXG4jIHsgdHlwZV9vZiwgICAgICAgICAgICAgIH0gPSBTRk1PRFVMRVMudW5zdGFibGUucmVxdWlyZV90eXBlX29mKClcbiMgeyBKZXRzdHJlYW0sXG4jICAgaW50ZXJuYWxzLCAgICAgICAgICAgIH0gPSBTRk1PRFVMRVMucmVxdWlyZV9qZXRzdHJlYW0oKVxuIyB7IGdldF90eXBlX29mX3N0ZGluLCAgICB9ID0gcmVxdWlyZSAnYnJpY2FicmFjLXNmbW9kdWxlcy9saWIvY2xpLWdldC10eXBlLW9mLXN0ZGluJ1xuIyBkZWJ1ZyAnzqlqc29uaWNrX19fMicsIHJlcXVpcmUgJ2JyaWNhYnJhYy1zZm1vZHVsZXMnXG57IGdldF90eXBlX29mX3N0ZGluXG4gIGdldF90eXBlX29mX3N0ZG91dCAgICB9ID0gcmVxdWlyZSAnLi4vLi4vYnJpY2FicmFjLXNmbW9kdWxlcy9saWIvY2xpLWdldC10eXBlLW9mLXN0ZGluLXN0ZG91dCdcbnsgdHlwZV9vZiwgICAgICAgICAgICAgIH0gPSAoIHJlcXVpcmUgJy4uLy4uL2JyaWNhYnJhYy1zZm1vZHVsZXMvbGliL3Vuc3RhYmxlLXJwci10eXBlX29mLWJyaWNzJyApLnJlcXVpcmVfdHlwZV9vZigpXG5pc2FfdGV4dCAgICAgICAgICAgICAgICAgID0gKCB4ICkgLT4gKCB0eXBlb2YgeCApIGlzICdzdHJpbmcnXG5cbiMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuIyMjIHRoeCB0b1xuICBodHRwczovL2dpdGh1Yi5jb20vbWF0aGlhc2J5bmVucy9tb3RoZXJlZmYuaW4vYmxvYi9tYXN0ZXIvanMtdmFyaWFibGVzL2VmZi5qc1xuICBodHRwczovL21hdGhpYXNieW5lbnMuYmUvbm90ZXMvamF2YXNjcmlwdC1pZGVudGlmaWVycy1lczZcbiMjI1xubnJlID0gLy8vXG4gICg/OiBbICRfIF0gICAgICAgICAgICAgICAgICAgICAgICB8IFxccHtJRF9TdGFydH0gICAgKVxuICAoPzogWyAkIF8gXFwtIFxcdXsyMDBjfSBcXHV7MjAwZH0gXSAgfCBcXHB7SURfQ29udGludWV9ICkqXG4gIC8vL3ZcbiMgbnJlID0ganNvbmljX29wdGlvbl9yZS5zb3VyY2VcblxuIyAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiMgbmV3X2dyYW1tYXIgPSAtPlxuIyAgIFIgICA9IG5ldyBHcmFtbWFyIHsgbmFtZTogJ2cnLCBsaW5raW5nOiBmYWxzZSwgZW1pdF9zaWduYWxzOiBmYWxzZSwgfVxuIyAgIGduZCA9IFIubmV3X2xldmVsIHsgbmFtZTogJ2duZCcsIH1cbiMgICBnbmQubmV3X3Rva2VuICdmZW5jZScsICAnLS0nLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyBkYXRhOiB7IHNsb3Q6IG51bGwsIHR5cGU6ICdmZW5jZScsIHN0cmluZzogJy0tJywgIH0sIH1cbiMgICBnbmQubmV3X3Rva2VuICdudW1iZXJsaXQnLCAgcnhcIig/PHN0cmluZz5bK1xcLV0/Wy5dP1swLTldLiopJFwiLCAgICAgICAgICAgICAgICAgICAgeyBkYXRhOiB7IHNsb3Q6ICdkJywgdHlwZTogJ251bWJlcmxpdCcsIH0sIH1cbiMgICBnbmQubmV3X3Rva2VuICdlc2NhcGVkJywgICAgcnhcIig/PHN0cmluZz4lLispJFwiLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IGRhdGE6IHsgc2xvdDogJ2QnLCB0eXBlOiAnZXNjYXBlZCcsIH0sIH1cbiMgICBnbmQubmV3X3Rva2VuICdidHJ1ZScsICAgICAgcnhcIlxcKygoPzx4c2xvdD5kKVxcLik/KD88bmFtZT4je25yZX0pJFwiLCAgICAgICAgICAgICAgIHsgZGF0YTogeyBzbG90OiAnYycsIHR5cGU6ICdib29sZWFuJywgc3RyaW5nOiAndHJ1ZScsICAgdmFsdWU6IHRydWUsICB9LCB9XG4jICAgZ25kLm5ld190b2tlbiAnYmZhbHNlJywgICAgIHJ4XCItKCg/PHhzbG90PmQpXFwuKT8oPzxuYW1lPiN7bnJlfSkkXCIsICAgICAgICAgICAgICAgIHsgZGF0YTogeyBzbG90OiAnYycsIHR5cGU6ICdib29sZWFuJywgc3RyaW5nOiAnZmFsc2UnLCAgdmFsdWU6IGZhbHNlLCB9LCB9XG4jICAgZ25kLm5ld190b2tlbiAnb2JqZWN0bGl0JywgIHJ4XCIoPzxzdHJpbmc+XFx7LiopJFwiLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgZGF0YTogeyBzbG90OiAnZCcsIHR5cGU6ICdvYmplY3RsaXQnLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCB9XG4jICAgZ25kLm5ld190b2tlbiAnbGlzdGxpdCcsICAgIHJ4XCIoPzxzdHJpbmc+XFxbLiopJFwiLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgZGF0YTogeyBzbG90OiAnZCcsIHR5cGU6ICdsaXN0bGl0JywgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIH1cbiMgICBnbmQubmV3X3Rva2VuICdmYWNldCcsICAgICAgcnhcIjooKD88eHNsb3Q+ZClcXC4pPyg/PG5hbWU+I3tucmV9KT0oPzxzdHJpbmc+LiopJFwiLCAgeyBkYXRhOiB7IHNsb3Q6ICdjJywgdHlwZTogJ2ZhY2V0JywgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCB9XG4jICAgZ25kLm5ld190b2tlbiAnb3RoZXInLCAgICAgIHJ4XCIoPzxzdHJpbmc+W1xcLSs6XFx7XFxbXS4qKSRcIiwgICAgICAgICAgICAgICAgICAgICAgICAgeyBkYXRhOiB7IHNsb3Q6ICdlJywgdHlwZTogJ290aGVyJywgbmFtZTogbnVsbCwgICAgICAgICAgICAgICAgICAgICB9LCB9XG4jICAgZ25kLm5ld190b2tlbiAnd29yZCcsICAgICAgIHJ4XCIoPzxzdHJpbmc+LispJFwiLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyBkYXRhOiB7IHNsb3Q6ICdkJywgdHlwZTogJ3dvcmQnLCBuYW1lOiBudWxsLCAgICAgICAgICAgICAgICAgICAgIH0sIH1cbiMgICByZXR1cm4gUlxuXG4jLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbm5ld19mYWNldCA9ICggbmFtZSwgdmFsdWUgKSAtPiBSID0gT2JqZWN0LmNyZWF0ZSBudWxsOyBSWyBuYW1lIF0gPSB2YWx1ZTsgUlxuXG4jLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbm9iamVjdF9mcm9tX29iamVjdGxpdCA9ICggb2JqZWN0bGl0ICkgLT5cbiAgUiA9IE9iamVjdC5jcmVhdGUgbnVsbFxuICBPYmplY3QuYXNzaWduIFIsIEpTT04ucGFyc2Ugb2JqZWN0bGl0XG4gIHJldHVybiBSXG5cbiMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxubGlzdF9mcm9tX2xpc3RsaXQgPSAoIGxpc3RsaXQgKSAtPiBKU09OLnBhcnNlIGxpc3RsaXRcblxuIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5wYXR0ZXJucyA9XG4gIG51bV9yZTogICAvLy9eICg/PHY+IFsrXFwtXT8gWy5dPyBbMC05XS4qICkgJC8vL3ZcbiAgYm9sX3JlOiAgIC8vL14gWytcXC1dICggKD88c2xvdD4gZCApIFxcLiApPyAoPzxuPiAje25yZS5zb3VyY2V9KSAgICAgICAgICAgICAgJC8vL3ZcbiAgZmFjX3JlOiAgIC8vL14gOiAgICAgKCAoPzxzbG90PiBkICkgXFwuICk/ICg/PG4+ICN7bnJlLnNvdXJjZX0pID0gKD88dj4gLiogKSAkLy8vdlxuXG4jLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbnBhcnNlX2FyZ3YgPSAoIGFyZ3YgPSBudWxsICkgLT5cbiAgYXJndiAgPSBpZiBhcmd2PyB0aGVuIFsgYXJndi4uLiwgXSBlbHNlIHByb2Nlc3MuYXJndlsgMiAuLiBdXG4gIFIgICAgID0geyBhOiBhcmd2LCBjOiBbXSwgZDogW10sIGU6IFtdLCBpOiBnZXRfdHlwZV9vZl9zdGRpbigpLCBvOiBnZXRfdHlwZV9vZl9zdGRvdXQoKSwgfVxuICByZXR1cm4gUiBpZiBhcmd2Lmxlbmd0aCBpcyAwXG4gICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgcGFzdF9mZW5jZSAgPSBmYWxzZVxuICBmb3IgcywgeCBpbiBhcmd2XG4gICAgdGhyb3cgbmV3IEVycm9yIFwizqlqc29uaWNrX19fMiBhdCBhcmd2WyAje3h9IF06IGV4cGVjdGVkIGEgc3RyaW5nLCBnb3QgYSAje3R5cGVfb2Ygc31cIiB1bmxlc3MgaXNhX3RleHQgc1xuICAgIGNvbnRpbnVlIGlmIHMubGVuZ3RoIGlzIDAgIyMjIFNob3VsZCBuZXZlciBoYXBwZW4gIyMjXG4gICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgaWYgcGFzdF9mZW5jZVxuICAgICAgUi5kLnB1c2ggeyB0OiAncGZuJywgdjogcywgeCwgfVxuICAgICAgY29udGludWVcbiAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICBzbG90ICAgID0gJ2QnXG4gICAgdCAgICAgICA9IG51bGxcbiAgICB2ICAgICAgID0gbnVsbFxuICAgIG4gICAgICAgPSBudWxsXG4gICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICBpZiBwYXR0ZXJucy5udW1fcmUudGVzdCBzXG4gICAgICB0ID0gJ251bSdcbiAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgIGVsc2Ugc3dpdGNoIHMwID0gc1sgMCBdXG4gICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgIHdoZW4gJy0nLCAnKydcbiAgICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgICBpZiBzIGlzICctLSdcbiAgICAgICAgICBwYXN0X2ZlbmNlID0gdHJ1ZVxuICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgICAgdCA9ICdib2wnXG4gICAgICAgIGlmICggbWF0Y2ggPSBzLm1hdGNoIHBhdHRlcm5zLmJvbF9yZSApP1xuICAgICAgICAgIHNsb3QgID0gbWF0Y2guZ3JvdXBzLnNsb3QgPyAnYydcbiAgICAgICAgICB2ICAgICA9IGlmIHMwIGlzICcrJyB0aGVuIHRydWUgZWxzZSBmYWxzZVxuICAgICAgICAgIG4gICAgID0gbWF0Y2guZ3JvdXBzLm5cbiAgICAgICAgICBicmVha1xuICAgICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICAgIHNsb3QgPSAnZSdcbiAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgd2hlbiAnOidcbiAgICAgICAgdCAgICAgPSAnZmFjJ1xuICAgICAgICBpZiAoIG1hdGNoID0gcy5tYXRjaCBwYXR0ZXJucy5mYWNfcmUgKT9cbiAgICAgICAgICBzbG90ICA9IG1hdGNoLmdyb3Vwcy5zbG90ID8gJ2MnXG4gICAgICAgICAgdiAgICAgPSBtYXRjaC5ncm91cHMudlxuICAgICAgICAgIG4gICAgID0gbWF0Y2guZ3JvdXBzLm5cbiAgICAgICAgICBicmVha1xuICAgICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICAgIHNsb3QgPSAnZSdcbiAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgd2hlbiAnJSdcbiAgICAgICAgdCAgICAgPSAnZXNjJ1xuICAgICAgICB2ICAgICA9IHNbIDEgLi4gXVxuICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICB3aGVuICd7JyB0aGVuIHQgPSAnb2JqJ1xuICAgICAgd2hlbiAnWycgdGhlbiB0ID0gJ2xzdCdcbiAgICAgIGVsc2UgICAgICAgICAgdCA9ICdiYXInXG4gICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICBlbnRyeSAgICAgPSB7IHQsIH1cbiAgICBlbnRyeS5uICAgPSBuIGlmIG4/XG4gICAgZW50cnkudiAgID0gdiA/IHMgdW5sZXNzIHNsb3QgaXMgJ2UnXG4gICAgZW50cnkueCAgID0geFxuICAgIFJbIHNsb3QgXS5wdXNoIGVudHJ5XG4gICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgcmV0dXJuIFJcblxuXG4gICMgIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAjIHJldHVybiBudWxsXG4gICMgIyBkZWJ1ZyAnzqlqc29uaWNrX19fMScsIGFyZ3ZcbiAgIyAjIGdyYW1tYXIgICAgPz0gbmV3X2dyYW1tYXIoKVxuICAjIGZvciBhcmd1bWVudCBpbiBhcmd2XG4gICMgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgIyAgIGxleGVtZXMgPSBncmFtbWFyLnNjYW5fdG9fbGlzdCBhcmd1bWVudFxuICAjICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICMgICB1bmxlc3MgbGV4ZW1lcy5sZW5ndGggaXMgMVxuICAjICAgICBSLmUucHVzaCBhcmd1bWVudFxuICAjICAgICBjb250aW51ZVxuICAjICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICMgICAjIHRhYnVsYXRlX2xleGVtZSBsZXhlbWVzWyAwIF0gIyMjICEhISEhISEhISEhISEhISAjIyNcbiAgIyAgIHsgeHNsb3RcbiAgIyAgICAgc2xvdFxuICAjICAgICB0eXBlXG4gICMgICAgIG5hbWVcbiAgIyAgICAgdmFsdWVcbiAgIyAgICAgc3RyaW5nIH0gPSBsZXhlbWVzWyAwIF0uZGF0YVxuICAjICAgc2xvdCA9IHhzbG90ID8gc2xvdFxuICAjICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgIyAgIHN3aXRjaCB0eXBlXG4gICMgICAgIHdoZW4gJ2Jvb2xlYW4nICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGVuIFJbIHNsb3QgXS5wdXNoIG5ld19mYWNldCBuYW1lLCB2YWx1ZVxuICAjICAgICB3aGVuICdmYWNldCcgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhlbiBSWyBzbG90IF0ucHVzaCBuZXdfZmFjZXQgbmFtZSwgc3RyaW5nXG4gICMgICAgIHdoZW4gJ290aGVyJywgJ2VzY2FwZWQnLCAnd29yZCcsICdudW1iZXJsaXQnICB0aGVuIFJbIHNsb3QgXS5wdXNoIHN0cmluZ1xuICAjICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgIyAgICAgd2hlbiAnb2JqZWN0bGl0JywgJ2xpc3RsaXQnXG4gICMgICAgICAgbWV0aG9kID0gaWYgdHlwZSBpcyAnb2JqZWN0bGl0JyB0aGVuIG9iamVjdF9mcm9tX29iamVjdGxpdCBlbHNlIGxpc3RfZnJvbV9saXN0bGl0XG4gICMgICAgICAgdHJ5XG4gICMgICAgICAgICBSWyBzbG90IF0ucHVzaCBtZXRob2Qgc3RyaW5nXG4gICMgICAgICAgY2F0Y2ggZXJyb3JcbiAgIyAgICAgICAgIHRocm93IGVycm9yIHVubGVzcyBlcnJvciBpbnN0YW5jZW9mIFN5bnRheEVycm9yXG4gICMgICAgICAgICBSLmUucHVzaCBzdHJpbmdcbiAgIyAgICAgICAgIHNsb3QgID0gJ2UnXG4gICMgICAgICAgICB0eXBlICA9IFwiZSN7dHlwZX1cIlxuICAjICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgIyAgICAgd2hlbiAnZmVuY2UnXG4gICMgICAgICAgcGFzdF9mZW5jZSA9IHRydWVcbiAgIyAgICAgICBjb250aW51ZVxuICAjICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgIyAgICAgZWxzZSB0aHJvdyBuZXcgRXJyb3IgXCLOqWpzb25pY2tfX18yIHNob3VsZCBuZXZlciBoYXBwZW46IHVua25vd24gbGV4ZW1lIHR5cGUgI3tycHIgdHlwZX1cIlxuICAjICAgUi50WyBzbG90IF0ucHVzaCB0eXBlXG4gICMgcmV0dXJuIFJcblxuIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5faXNhX251bGxfcG9kID0gKCB4ICkgLT4gKCBPYmplY3QuZ2V0UHJvdG90eXBlT2YgeCApIGlzIG51bGxcblxuIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5zaG93X2NkZWYgPSAoIGNkZWYgKSAtPlxuICBwcm9jZXNzLnN0ZG91dC53cml0ZSBKU09OLnN0cmluZ2lmeSBjZGVmXG4gIDtudWxsXG5cblxuIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5kZW1vID0gLT5cbiAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAjIFBRICA9IHByb2Nlc3MuYXJndlsgMiAuLiBdXG4gIGNkZWYgICAgICA9IHBhcnNlX2FyZ3YoKVxuICBzaG93X2NkZWYgY2RlZlxuICAjIyNcbiAgWyAncmVwbGFjZTo0JywgJyt1cHBlci1jYXNlJywgJysnLCAnLXZlcmJvc2UnLCAne2Q6OH0nLCAne3M6dHJ1ZSwrYm9vbCx9JywgJ3dvcmRzOmEgYicsICd7JywgJ3tcIm5hbWVcIjp0cnVlLFwid2lkdGhcIjo0NDV9JyBdXG4gICMjI1xuICA7bnVsbFxuXG5cbiM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubW9kdWxlLmV4cG9ydHMgPSB7IHBhcnNlX2FyZ3YsIH1cblxuIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5pZiBtb2R1bGUgaXMgcmVxdWlyZS5tYWluIHRoZW4gZG8gPT5cbiAgZGVtbygpXG4gIDtudWxsXG4iXX0=
