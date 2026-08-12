#!/bin/env node
(function() {
  //!/bin/env node
  'use strict';
  var GUY, alert, cli, debug, echo, get_type_of_stdin, get_type_of_stdout, help, info, inspect, isa_text, log, parse_argv, patterns, plain, praise, rpr, type_of, urge, warn, whisper;

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

  //===========================================================================================================
  cli = function() {
    var cde;
    //---------------------------------------------------------------------------------------------------------
    cde = parse_argv();
    process.stdout.write(JSON.stringify(cde));
    return null;
  };

  //===========================================================================================================
  module.exports = {parse_argv};

  //===========================================================================================================
  if (module === require.main) {
    (() => {
      cli();
      return null;
    })();
  }

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2FuYWx5emUtY2xpLWFyZ3VtZW50cy1waGFzZS0xLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBZTtFQUFBO0VBRWY7QUFGZSxNQUFBLEdBQUEsRUFBQSxLQUFBLEVBQUEsR0FBQSxFQUFBLEtBQUEsRUFBQSxJQUFBLEVBQUEsaUJBQUEsRUFBQSxrQkFBQSxFQUFBLElBQUEsRUFBQSxJQUFBLEVBQUEsT0FBQSxFQUFBLFFBQUEsRUFBQSxHQUFBLEVBQUEsVUFBQSxFQUFBLFFBQUEsRUFBQSxLQUFBLEVBQUEsTUFBQSxFQUFBLEdBQUEsRUFBQSxPQUFBLEVBQUEsSUFBQSxFQUFBLElBQUEsRUFBQSxPQUFBOzs7RUFLZixHQUFBLEdBQTRCLE9BQUEsQ0FBUSxLQUFSOztFQUM1QixDQUFBLENBQUUsS0FBRixFQUNFLEtBREYsRUFFRSxJQUZGLEVBR0UsSUFIRixFQUlFLEtBSkYsRUFLRSxNQUxGLEVBTUUsSUFORixFQU9FLElBUEYsRUFRRSxPQVJGLENBQUEsR0FRNEIsR0FBRyxDQUFDLEdBQUcsQ0FBQyxXQUFSLENBQW9CLHlCQUFwQixDQVI1Qjs7RUFTQSxDQUFBLENBQUUsR0FBRixFQUNFLE9BREYsRUFFRSxJQUZGLEVBR0UsR0FIRixDQUFBLEdBRzRCLEdBQUcsQ0FBQyxHQUhoQyxFQWZlOzs7RUFxQmYsQ0FBQSxDQUFFLGlCQUFGLEVBQ0Usa0JBREYsQ0FBQSxHQUM0QixPQUFBLENBQVEsNERBQVIsQ0FENUI7O0VBRUEsQ0FBQSxDQUFFLE9BQUYsQ0FBQSxHQUE0QixDQUFFLE9BQUEsQ0FBUSwwREFBUixDQUFGLENBQXNFLENBQUMsZUFBdkUsQ0FBQSxDQUE1Qjs7RUFDQSxRQUFBLEdBQTRCLFFBQUEsQ0FBRSxDQUFGLENBQUE7V0FBUyxDQUFFLE9BQU8sQ0FBVCxDQUFBLEtBQWdCO0VBQXpCLEVBeEJiOzs7RUE0QmYsUUFBQSxHQUFjLENBQUEsQ0FBQSxDQUFBLEdBQUEsRUFB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RjtZQTRCRCxDQUFBLEdBQVE7WUFDUixDQUFBLEdBQVEsQ0FBQztBQUZOOztBQTNCRixlQStCRSxHQS9CRjtZQStCVyxDQUFBLEdBQUk7QUFBYjtBQS9CRixlQWdDRSxHQWhDRjtZQWdDVyxDQUFBLEdBQUk7QUFBYjtBQWhDRjtZQWlDVyxDQUFBLEdBQUk7QUFqQ2YsU0FITDtPQVpKOztNQWtESSxLQUFBLEdBQVksQ0FBRSxDQUFGO01BQ1osSUFBaUIsU0FBakI7UUFBQSxLQUFLLENBQUMsQ0FBTixHQUFZLEVBQVo7O01BQ0EsSUFBeUIsSUFBQSxLQUFRLEdBQWpDO1FBQUEsS0FBSyxDQUFDLENBQU4sZUFBWSxJQUFJLEVBQWhCOztNQUNBLEtBQUssQ0FBQyxDQUFOLEdBQVk7TUFDWixDQUFDLENBQUUsSUFBRixDQUFRLENBQUMsSUFBVixDQUFlLEtBQWY7SUF2REYsQ0FMRjs7QUE4REUsV0FBTztFQS9ESSxFQTdDRTs7O0VBK0dmLEdBQUEsR0FBTSxRQUFBLENBQUEsQ0FBQTtBQUNOLFFBQUEsR0FBQTs7SUFDRSxHQUFBLEdBQU0sVUFBQSxDQUFBO0lBQ04sT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFmLENBQXFCLElBQUksQ0FBQyxTQUFMLENBQWUsR0FBZixDQUFyQjtXQUNDO0VBSkcsRUEvR1M7OztFQXVIZixNQUFNLENBQUMsT0FBUCxHQUFpQixDQUFFLFVBQUYsRUF2SEY7OztFQTBIZixJQUFHLE1BQUEsS0FBVSxPQUFPLENBQUMsSUFBckI7SUFBa0MsQ0FBQSxDQUFBLENBQUEsR0FBQTtNQUNoQyxHQUFBLENBQUE7YUFDQztJQUYrQixDQUFBLElBQWxDOztBQTFIZSIsInNvdXJjZXNDb250ZW50IjpbIiMhL2Jpbi9lbnYgbm9kZVxuXG4ndXNlIHN0cmljdCdcblxuIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5HVVkgICAgICAgICAgICAgICAgICAgICAgID0gcmVxdWlyZSAnZ3V5J1xueyBhbGVydFxuICBkZWJ1Z1xuICBoZWxwXG4gIGluZm9cbiAgcGxhaW5cbiAgcHJhaXNlXG4gIHVyZ2VcbiAgd2FyblxuICB3aGlzcGVyIH0gICAgICAgICAgICAgICA9IEdVWS50cm0uZ2V0X2xvZ2dlcnMgJ25vcm1hbGl6ZS1jbGktYXJndW1lbnRzJ1xueyBycHJcbiAgaW5zcGVjdFxuICBlY2hvXG4gIGxvZyAgICAgfSAgICAgICAgICAgICAgID0gR1VZLnRybVxuXG4jLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbnsgZ2V0X3R5cGVfb2Zfc3RkaW5cbiAgZ2V0X3R5cGVfb2Zfc3Rkb3V0ICAgIH0gPSByZXF1aXJlICcuLi8uLi9icmljYWJyYWMtc2Ztb2R1bGVzL2xpYi9jbGktZ2V0LXR5cGUtb2Ytc3RkaW4tc3Rkb3V0J1xueyB0eXBlX29mLCAgICAgICAgICAgICAgfSA9ICggcmVxdWlyZSAnLi4vLi4vYnJpY2FicmFjLXNmbW9kdWxlcy9saWIvdW5zdGFibGUtcnByLXR5cGVfb2YtYnJpY3MnICkucmVxdWlyZV90eXBlX29mKClcbmlzYV90ZXh0ICAgICAgICAgICAgICAgICAgPSAoIHggKSAtPiAoIHR5cGVvZiB4ICkgaXMgJ3N0cmluZydcblxuXG4jLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbnBhdHRlcm5zID0gZG8gPT5cbiAgIyMjIGBubWVfcmVgIG1hdGNoZXMgYWxsIHN0cmluZ3MgdGhhdCBhcmUgbGVnYWwgaWRlbnRpZmllcnMgaW4gSmF2YVNjcmlwdDsgYWRkaXRpb25hbGx5LCBpdCBhbGxvd3MgdGhlXG4gIHVzYWdlIG9mIGh5cGhlbi1taW51cyAoYC1gLCBVKzAwMmQpIGluc2lkZSBvZiBuYW1lcyBzbyBib3RoIGBteV9uYW1lYCBhbmQgYG15LW5hbWVgIGFyZSBib3RoIGxlZ2FsIG5hbWVzXG4gIChidXQgYC14eHhgIGlzIG5vdCB3aGVyZWFzIGBfeHh4YCBpcyBPSykuIFRoeCB0b1xuICBodHRwczovL2dpdGh1Yi5jb20vbWF0aGlhc2J5bmVucy9tb3RoZXJlZmYuaW4vYmxvYi9tYXN0ZXIvanMtdmFyaWFibGVzL2VmZi5qcyBhbmRcbiAgaHR0cHM6Ly9tYXRoaWFzYnluZW5zLmJlL25vdGVzL2phdmFzY3JpcHQtaWRlbnRpZmllcnMtZXM2ICMjI1xuICBubWVfcmUgPSAvLy9cbiAgICAoPzogWyAkXyBdICAgICAgICAgICAgICAgICAgICAgICAgfCBcXHB7SURfU3RhcnR9ICAgIClcbiAgICAoPzogWyAkIF8gXFwtIFxcdXsyMDBjfSBcXHV7MjAwZH0gXSAgfCBcXHB7SURfQ29udGludWV9ICkqIC8vL3ZcbiAgUiA9XG4gICAgbm1lX3JlOiBubWVfcmVcbiAgICBudW1fcmU6IC8vL14gKD88dj4gWytcXC1dPyBbLl0/IFswLTldLiogKSAkLy8vdlxuICAgIGJvbF9yZTogLy8vXiBbK1xcLV0gKCAoPzxzbG90PiBkICkgXFwuICk/ICg/PG4+ICN7bm1lX3JlLnNvdXJjZX0pICAgICAgICAgICAgICAkLy8vdlxuICAgIGZhY19yZTogLy8vXiA6ICAgICAoICg/PHNsb3Q+IGQgKSBcXC4gKT8gKD88bj4gI3tubWVfcmUuc291cmNlfSkgPSAoPzx2PiAuKiApICQvLy92XG4gIHJldHVybiBSXG5cbiMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxucGFyc2VfYXJndiA9ICggYXJndiA9IG51bGwgKSAtPlxuICBhcmd2ICA9IGlmIGFyZ3Y/IHRoZW4gWyBhcmd2Li4uLCBdIGVsc2UgcHJvY2Vzcy5hcmd2WyAyIC4uIF1cbiAgUiAgICAgPSB7IGE6IGFyZ3YsIGM6IFtdLCBkOiBbXSwgZTogW10sIGk6IGdldF90eXBlX29mX3N0ZGluKCksIG86IGdldF90eXBlX29mX3N0ZG91dCgpLCB9XG4gIHJldHVybiBSIGlmIGFyZ3YubGVuZ3RoIGlzIDBcbiAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICBwYXN0X2ZlbmNlICA9IGZhbHNlXG4gIGZvciBzLCB4IGluIGFyZ3ZcbiAgICB0aHJvdyBuZXcgRXJyb3IgXCLOqWpzb25pY2tfX18yIGF0IGFyZ3ZbICN7eH0gXTogZXhwZWN0ZWQgYSBzdHJpbmcsIGdvdCBhICN7dHlwZV9vZiBzfVwiIHVubGVzcyBpc2FfdGV4dCBzXG4gICAgY29udGludWUgaWYgcy5sZW5ndGggaXMgMCAjIyMgU2hvdWxkIG5ldmVyIGhhcHBlbiAjIyNcbiAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICBpZiBwYXN0X2ZlbmNlXG4gICAgICBSLmQucHVzaCB7IHQ6ICdwZm4nLCB2OiBzLCB4LCB9XG4gICAgICBjb250aW51ZVxuICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgIHNsb3QgICAgPSAnZCdcbiAgICB0ICAgICAgID0gbnVsbFxuICAgIHYgICAgICAgPSBudWxsXG4gICAgbiAgICAgICA9IG51bGxcbiAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgIGlmIHBhdHRlcm5zLm51bV9yZS50ZXN0IHNcbiAgICAgIHQgPSAnbnVtJ1xuICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgZWxzZSBzd2l0Y2ggczAgPSBzWyAwIF1cbiAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgd2hlbiAnLScsICcrJ1xuICAgICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICAgIGlmIHMgaXMgJy0tJ1xuICAgICAgICAgIHBhc3RfZmVuY2UgPSB0cnVlXG4gICAgICAgICAgY29udGludWVcbiAgICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgICB0ID0gJ2JvbCdcbiAgICAgICAgaWYgKCBtYXRjaCA9IHMubWF0Y2ggcGF0dGVybnMuYm9sX3JlICk/XG4gICAgICAgICAgc2xvdCAgPSBtYXRjaC5ncm91cHMuc2xvdCA/ICdjJ1xuICAgICAgICAgIHYgICAgID0gaWYgczAgaXMgJysnIHRoZW4gdHJ1ZSBlbHNlIGZhbHNlXG4gICAgICAgICAgbiAgICAgPSBtYXRjaC5ncm91cHMublxuICAgICAgICAgIGJyZWFrXG4gICAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgICAgc2xvdCA9ICdlJ1xuICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICB3aGVuICc6J1xuICAgICAgICB0ICAgICA9ICdmYWMnXG4gICAgICAgIGlmICggbWF0Y2ggPSBzLm1hdGNoIHBhdHRlcm5zLmZhY19yZSApP1xuICAgICAgICAgIHNsb3QgID0gbWF0Y2guZ3JvdXBzLnNsb3QgPyAnYydcbiAgICAgICAgICB2ICAgICA9IG1hdGNoLmdyb3Vwcy52XG4gICAgICAgICAgbiAgICAgPSBtYXRjaC5ncm91cHMublxuICAgICAgICAgIGJyZWFrXG4gICAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgICAgc2xvdCA9ICdlJ1xuICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICB3aGVuICclJ1xuICAgICAgICB0ICAgICA9ICdlc2MnXG4gICAgICAgIHYgICAgID0gc1sgMSAuLiBdXG4gICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgIHdoZW4gJ3snIHRoZW4gdCA9ICdvYmonXG4gICAgICB3aGVuICdbJyB0aGVuIHQgPSAnbHN0J1xuICAgICAgZWxzZSAgICAgICAgICB0ID0gJ2JhcidcbiAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgIGVudHJ5ICAgICA9IHsgdCwgfVxuICAgIGVudHJ5Lm4gICA9IG4gaWYgbj9cbiAgICBlbnRyeS52ICAgPSB2ID8gcyB1bmxlc3Mgc2xvdCBpcyAnZSdcbiAgICBlbnRyeS54ICAgPSB4XG4gICAgUlsgc2xvdCBdLnB1c2ggZW50cnlcbiAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICByZXR1cm4gUlxuXG4jPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmNsaSA9IC0+XG4gICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgY2RlID0gcGFyc2VfYXJndigpXG4gIHByb2Nlc3Muc3Rkb3V0LndyaXRlIEpTT04uc3RyaW5naWZ5IGNkZVxuICA7bnVsbFxuXG5cbiM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubW9kdWxlLmV4cG9ydHMgPSB7IHBhcnNlX2FyZ3YsIH1cblxuIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5pZiBtb2R1bGUgaXMgcmVxdWlyZS5tYWluIHRoZW4gZG8gPT5cbiAgY2xpKClcbiAgO251bGxcbiJdfQ==
