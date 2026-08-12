#!/bin/env node
(function() {
  //!/bin/env node
  'use strict';
  var GUY, alert, cli, debug, echo, get_type_of_stdin, get_type_of_stdout, help, info, inspect, isa_text, log, parse_argv, parse_argv_1, patterns, plain, praise, rpr, type_of, urge, warn, whisper;

  //===========================================================================================================
  GUY = require('guy');

  ({alert, debug, help, info, plain, praise, urge, warn, whisper} = GUY.trm.get_loggers('normalize-cli-arguments'));

  ({rpr, inspect, echo, log} = GUY.trm);

  //-----------------------------------------------------------------------------------------------------------
  ({get_type_of_stdin, get_type_of_stdout} = require('../../bricabrac-sfmodules/lib/cli-get-type-of-stdin-stdout'));

  ({type_of} = (require('../../bricabrac-sfmodules/lib/unstable-rpr-type_of-brics')).require_type_of());

  isa_text = function(x) {
    return (typeof x) === 'string';
  };

  //-----------------------------------------------------------------------------------------------------------
  patterns = (() => {
    /* `nme_re` matches all strings that are legal identifiers in JavaScript; additionally, it allows the
     usage of hyphen-minus (`-`, U+002d) inside of names so both `my_name` and `my-name` are both legal names
     (but `-xxx` is not whereas `_xxx` is OK). Thx to
     https://github.com/mathiasbynens/mothereff.in/blob/master/js-variables/eff.js and
     https://mathiasbynens.be/notes/javascript-identifiers-es6 */
    var R, nme_re;
    nme_re = /(?:[$_]|\p{ID_Start})(?:[$_\-\u200c\u200d]|\p{ID_Continue})*/v;
    R = {
      nme_re: nme_re,
      num_re: /^(?<v>[+\-]?[.]?[0-9].*)$/v,
      bol_re: RegExp(`^[+\\-]((?<slot>d)\\.)?(?<n>${nme_re.source})$`, "v"),
      fac_re: RegExp(`^:((?<slot>d)\\.)?(?<n>${nme_re.source})=(?<v>.*)$`, "v")
    };
    return R;
  })();

  //-----------------------------------------------------------------------------------------------------------
  parse_argv = parse_argv_1 = function(argv = null) {
    var R, entry, i, len, match, n, past_fence, ref, ref1, ref2, s, s0, slot, t, type_of_argv, v, x;
    if (argv != null) {
      if ((type_of_argv = type_of(argv)) !== 'list') {
        throw new Error(`Ωjsonick___2 expected a list for argv, got a ${type_of_argv}`);
      }
      argv = [...argv];
    } else {
      argv = process.argv.slice(2);
    }
    //.........................................................................................................
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
        switch (s0 = (ref = s[0]) != null ? ref : null) {
          //.....................................................................................................
          case null/* in the case of empty string as input */:
            t = 'bar';
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
            t = 'bol';
            if ((match = s.match(patterns.bol_re)) != null) {
              slot = (ref1 = match.groups.slot) != null ? ref1 : 'c';
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
              slot = (ref2 = match.groups.slot) != null ? ref2 : 'c';
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

  //===========================================================================================================
  cli = function() {
    var cde;
    //---------------------------------------------------------------------------------------------------------
    cde = parse_argv();
    process.stdout.write(JSON.stringify(cde));
    return null;
  };

  //===========================================================================================================
  module.exports = {parse_argv, parse_argv_1};

  //===========================================================================================================
  if (module === require.main) {
    (() => {
      cli();
      return null;
    })();
  }

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3BhcnNlLWFyZ3YtMS5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQWU7RUFBQTtFQUVmO0FBRmUsTUFBQSxHQUFBLEVBQUEsS0FBQSxFQUFBLEdBQUEsRUFBQSxLQUFBLEVBQUEsSUFBQSxFQUFBLGlCQUFBLEVBQUEsa0JBQUEsRUFBQSxJQUFBLEVBQUEsSUFBQSxFQUFBLE9BQUEsRUFBQSxRQUFBLEVBQUEsR0FBQSxFQUFBLFVBQUEsRUFBQSxZQUFBLEVBQUEsUUFBQSxFQUFBLEtBQUEsRUFBQSxNQUFBLEVBQUEsR0FBQSxFQUFBLE9BQUEsRUFBQSxJQUFBLEVBQUEsSUFBQSxFQUFBLE9BQUE7OztFQUtmLEdBQUEsR0FBNEIsT0FBQSxDQUFRLEtBQVI7O0VBQzVCLENBQUEsQ0FBRSxLQUFGLEVBQ0UsS0FERixFQUVFLElBRkYsRUFHRSxJQUhGLEVBSUUsS0FKRixFQUtFLE1BTEYsRUFNRSxJQU5GLEVBT0UsSUFQRixFQVFFLE9BUkYsQ0FBQSxHQVE0QixHQUFHLENBQUMsR0FBRyxDQUFDLFdBQVIsQ0FBb0IseUJBQXBCLENBUjVCOztFQVNBLENBQUEsQ0FBRSxHQUFGLEVBQ0UsT0FERixFQUVFLElBRkYsRUFHRSxHQUhGLENBQUEsR0FHNEIsR0FBRyxDQUFDLEdBSGhDLEVBZmU7OztFQW9CZixDQUFBLENBQUUsaUJBQUYsRUFDRSxrQkFERixDQUFBLEdBQzRCLE9BQUEsQ0FBUSw0REFBUixDQUQ1Qjs7RUFFQSxDQUFBLENBQUUsT0FBRixDQUFBLEdBQTRCLENBQUUsT0FBQSxDQUFRLDBEQUFSLENBQUYsQ0FBc0UsQ0FBQyxlQUF2RSxDQUFBLENBQTVCOztFQUNBLFFBQUEsR0FBNEIsUUFBQSxDQUFFLENBQUYsQ0FBQTtXQUFTLENBQUUsT0FBTyxDQUFULENBQUEsS0FBZ0I7RUFBekIsRUF2QmI7OztFQTJCZixRQUFBLEdBQWMsQ0FBQSxDQUFBLENBQUEsR0FBQSxFQUFBOzs7Ozs7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ZXNDb250ZW50IjpbIiMhL2Jpbi9lbnYgbm9kZVxuXG4ndXNlIHN0cmljdCdcblxuIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5HVVkgICAgICAgICAgICAgICAgICAgICAgID0gcmVxdWlyZSAnZ3V5J1xueyBhbGVydFxuICBkZWJ1Z1xuICBoZWxwXG4gIGluZm9cbiAgcGxhaW5cbiAgcHJhaXNlXG4gIHVyZ2VcbiAgd2FyblxuICB3aGlzcGVyIH0gICAgICAgICAgICAgICA9IEdVWS50cm0uZ2V0X2xvZ2dlcnMgJ25vcm1hbGl6ZS1jbGktYXJndW1lbnRzJ1xueyBycHJcbiAgaW5zcGVjdFxuICBlY2hvXG4gIGxvZyAgICAgfSAgICAgICAgICAgICAgID0gR1VZLnRybVxuIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG57IGdldF90eXBlX29mX3N0ZGluXG4gIGdldF90eXBlX29mX3N0ZG91dCAgICB9ID0gcmVxdWlyZSAnLi4vLi4vYnJpY2FicmFjLXNmbW9kdWxlcy9saWIvY2xpLWdldC10eXBlLW9mLXN0ZGluLXN0ZG91dCdcbnsgdHlwZV9vZiwgICAgICAgICAgICAgIH0gPSAoIHJlcXVpcmUgJy4uLy4uL2JyaWNhYnJhYy1zZm1vZHVsZXMvbGliL3Vuc3RhYmxlLXJwci10eXBlX29mLWJyaWNzJyApLnJlcXVpcmVfdHlwZV9vZigpXG5pc2FfdGV4dCAgICAgICAgICAgICAgICAgID0gKCB4ICkgLT4gKCB0eXBlb2YgeCApIGlzICdzdHJpbmcnXG5cblxuIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5wYXR0ZXJucyA9IGRvID0+XG4gICMjIyBgbm1lX3JlYCBtYXRjaGVzIGFsbCBzdHJpbmdzIHRoYXQgYXJlIGxlZ2FsIGlkZW50aWZpZXJzIGluIEphdmFTY3JpcHQ7IGFkZGl0aW9uYWxseSwgaXQgYWxsb3dzIHRoZVxuICB1c2FnZSBvZiBoeXBoZW4tbWludXMgKGAtYCwgVSswMDJkKSBpbnNpZGUgb2YgbmFtZXMgc28gYm90aCBgbXlfbmFtZWAgYW5kIGBteS1uYW1lYCBhcmUgYm90aCBsZWdhbCBuYW1lc1xuICAoYnV0IGAteHh4YCBpcyBub3Qgd2hlcmVhcyBgX3h4eGAgaXMgT0spLiBUaHggdG9cbiAgaHR0cHM6Ly9naXRodWIuY29tL21hdGhpYXNieW5lbnMvbW90aGVyZWZmLmluL2Jsb2IvbWFzdGVyL2pzLXZhcmlhYmxlcy9lZmYuanMgYW5kXG4gIGh0dHBzOi8vbWF0aGlhc2J5bmVucy5iZS9ub3Rlcy9qYXZhc2NyaXB0LWlkZW50aWZpZXJzLWVzNiAjIyNcbiAgbm1lX3JlID0gLy8vXG4gICAgKD86IFsgJF8gXSAgICAgICAgICAgICAgICAgICAgICAgIHwgXFxwe0lEX1N0YXJ0fSAgICApXG4gICAgKD86IFsgJCBfIFxcLSBcXHV7MjAwY30gXFx1ezIwMGR9IF0gIHwgXFxwe0lEX0NvbnRpbnVlfSApKiAvLy92XG4gIFIgPVxuICAgIG5tZV9yZTogbm1lX3JlXG4gICAgbnVtX3JlOiAvLy9eICg/PHY+IFsrXFwtXT8gWy5dPyBbMC05XS4qICkgJC8vL3ZcbiAgICBib2xfcmU6IC8vL14gWytcXC1dICggKD88c2xvdD4gZCApIFxcLiApPyAoPzxuPiAje25tZV9yZS5zb3VyY2V9KSAgICAgICAgICAgICAgJC8vL3ZcbiAgICBmYWNfcmU6IC8vL14gOiAgICAgKCAoPzxzbG90PiBkICkgXFwuICk/ICg/PG4+ICN7bm1lX3JlLnNvdXJjZX0pID0gKD88dj4gLiogKSAkLy8vdlxuICByZXR1cm4gUlxuXG4jLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbnBhcnNlX2FyZ3YgPSBwYXJzZV9hcmd2XzEgPSAoIGFyZ3YgPSBudWxsICkgLT5cbiAgaWYgYXJndj9cbiAgICB1bmxlc3MgKCB0eXBlX29mX2FyZ3YgPSB0eXBlX29mIGFyZ3YgKSBpcyAnbGlzdCdcbiAgICAgIHRocm93IG5ldyBFcnJvciBcIs6panNvbmlja19fXzIgZXhwZWN0ZWQgYSBsaXN0IGZvciBhcmd2LCBnb3QgYSAje3R5cGVfb2ZfYXJndn1cIlxuICAgIGFyZ3YgID0gWyBhcmd2Li4uLCBdXG4gIGVsc2VcbiAgICBhcmd2ID0gcHJvY2Vzcy5hcmd2WyAyIC4uIF1cbiAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICBSICAgICA9IHsgYTogYXJndiwgYzogW10sIGQ6IFtdLCBlOiBbXSwgaTogZ2V0X3R5cGVfb2Zfc3RkaW4oKSwgbzogZ2V0X3R5cGVfb2Zfc3Rkb3V0KCksIH1cbiAgcmV0dXJuIFIgaWYgYXJndi5sZW5ndGggaXMgMFxuICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gIHBhc3RfZmVuY2UgID0gZmFsc2VcbiAgZm9yIHMsIHggaW4gYXJndlxuICAgIHRocm93IG5ldyBFcnJvciBcIs6panNvbmlja19fXzIgYXQgYXJndlsgI3t4fSBdOiBleHBlY3RlZCBhIHN0cmluZywgZ290IGEgI3t0eXBlX29mIHN9XCIgdW5sZXNzIGlzYV90ZXh0IHNcbiAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICBpZiBwYXN0X2ZlbmNlXG4gICAgICBSLmQucHVzaCB7IHQ6ICdwZm4nLCB2OiBzLCB4LCB9XG4gICAgICBjb250aW51ZVxuICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgIHNsb3QgICAgPSAnZCdcbiAgICB0ICAgICAgID0gbnVsbFxuICAgIHYgICAgICAgPSBudWxsXG4gICAgbiAgICAgICA9IG51bGxcbiAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgIGlmIHBhdHRlcm5zLm51bV9yZS50ZXN0IHNcbiAgICAgIHQgPSAnbnVtJ1xuICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgZWxzZSBzd2l0Y2ggczAgPSBzWyAwIF0gPyBudWxsXG4gICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgIHdoZW4gbnVsbCAjIyMgaW4gdGhlIGNhc2Ugb2YgZW1wdHkgc3RyaW5nIGFzIGlucHV0ICMjI1xuICAgICAgICB0ID0gJ2JhcidcbiAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgd2hlbiAnLScsICcrJ1xuICAgICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICAgIGlmIHMgaXMgJy0tJ1xuICAgICAgICAgIHBhc3RfZmVuY2UgPSB0cnVlXG4gICAgICAgICAgY29udGludWVcbiAgICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgICB0ID0gJ2JvbCdcbiAgICAgICAgaWYgKCBtYXRjaCA9IHMubWF0Y2ggcGF0dGVybnMuYm9sX3JlICk/XG4gICAgICAgICAgc2xvdCAgPSBtYXRjaC5ncm91cHMuc2xvdCA/ICdjJ1xuICAgICAgICAgIHYgICAgID0gaWYgczAgaXMgJysnIHRoZW4gdHJ1ZSBlbHNlIGZhbHNlXG4gICAgICAgICAgbiAgICAgPSBtYXRjaC5ncm91cHMublxuICAgICAgICAgIGJyZWFrXG4gICAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgICAgc2xvdCA9ICdlJ1xuICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICB3aGVuICc6J1xuICAgICAgICB0ICAgICA9ICdmYWMnXG4gICAgICAgIGlmICggbWF0Y2ggPSBzLm1hdGNoIHBhdHRlcm5zLmZhY19yZSApP1xuICAgICAgICAgIHNsb3QgID0gbWF0Y2guZ3JvdXBzLnNsb3QgPyAnYydcbiAgICAgICAgICB2ICAgICA9IG1hdGNoLmdyb3Vwcy52XG4gICAgICAgICAgbiAgICAgPSBtYXRjaC5ncm91cHMublxuICAgICAgICAgIGJyZWFrXG4gICAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgICAgc2xvdCA9ICdlJ1xuICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICB3aGVuICclJ1xuICAgICAgICB0ICAgICA9ICdlc2MnXG4gICAgICAgIHYgICAgID0gc1sgMSAuLiBdXG4gICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgIHdoZW4gJ3snIHRoZW4gdCA9ICdvYmonXG4gICAgICB3aGVuICdbJyB0aGVuIHQgPSAnbHN0J1xuICAgICAgZWxzZSAgICAgICAgICB0ID0gJ2JhcidcbiAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgIGVudHJ5ICAgICA9IHsgdCwgfVxuICAgIGVudHJ5Lm4gICA9IG4gaWYgbj9cbiAgICBlbnRyeS52ICAgPSB2ID8gcyB1bmxlc3Mgc2xvdCBpcyAnZSdcbiAgICBlbnRyeS54ICAgPSB4XG4gICAgUlsgc2xvdCBdLnB1c2ggZW50cnlcbiAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICByZXR1cm4gUlxuXG4jPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmNsaSA9IC0+XG4gICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgY2RlID0gcGFyc2VfYXJndigpXG4gIHByb2Nlc3Muc3Rkb3V0LndyaXRlIEpTT04uc3RyaW5naWZ5IGNkZVxuICA7bnVsbFxuXG5cbiM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubW9kdWxlLmV4cG9ydHMgPSB7IHBhcnNlX2FyZ3YsIHBhcnNlX2FyZ3ZfMSwgfVxuXG4jPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmlmIG1vZHVsZSBpcyByZXF1aXJlLm1haW4gdGhlbiBkbyA9PlxuICBjbGkoKVxuICA7bnVsbFxuIl19
