#!/bin/env node
(function() {
  //!/bin/env node
  'use strict';
  var Cde, GUY, Tnvx, alert, cli, debug, echo, get_type_of_stdin, get_type_of_stdout, help, info, inspect, isa_text, log, nfa, parse_argv, parse_argv_1, patterns, plain, praise, rpr, type_of, urge, warn, whisper;

  //===========================================================================================================
  GUY = require('guy');

  ({alert, debug, help, info, plain, praise, urge, warn, whisper} = GUY.trm.get_loggers('normalize-cli-arguments'));

  ({rpr, inspect, echo, log} = GUY.trm);

  //-----------------------------------------------------------------------------------------------------------
  ({get_type_of_stdin, get_type_of_stdout} = require('../../bricabrac-sfmodules/lib/cli-get-type-of-stdin-stdout'));

  ({type_of} = (require('../../bricabrac-sfmodules/lib/unstable-rpr-type_of-brics')).require_type_of());

  ({nfa} = require('normalize-function-arguments'));

  isa_text = function(x) {
    return (typeof x) === 'string';
  };

  //-----------------------------------------------------------------------------------------------------------
  patterns = (() => {
    var R, nme_re;
    /* `nme_re` matches all strings that are legal identifiers in JavaScript; additionally, it allows the
     usage of hyphen-minus (`-`, U+002d) inside of names so both `my_name` and `my-name` are both legal names
     (but `-xxx` is not whereas `_xxx` is OK). Thx to
     https://github.com/mathiasbynens/mothereff.in/blob/master/js-variables/eff.js and
     https://mathiasbynens.be/notes/javascript-identifiers-es6 */
    nme_re = /(?!.*-$)(?:[$_]|\p{ID_Start})(?:[$_\-\u200c\u200d]|\p{ID_Continue})*/v; // disallow strings ending in hyphen-minus
    R = {
      nme_re: nme_re,
      num_re: /^(?<v>[+\-]?[.]?[0-9].*)$/v,
      bol_re: RegExp(`^[+\\-]((?<slot>d)\\.)?(?<n>${nme_re.source})$`, "v"),
      fac_re: RegExp(`^:((?<slot>d)\\.)?(?<n>${nme_re.source})=(?<v>.*)$`, "v")
    };
    return R;
  })();

  Tnvx = (function() {
    //===========================================================================================================
    class Tnvx {
      //---------------------------------------------------------------------------------------------------------
      constructor(...P) {
        var cfg;
        cfg = this._constructor_nfa(...P);
        this.t = cfg.t;
        if (cfg.n != null) {
          this.n = cfg.n;
        }
        if (cfg.v != null) {
          this.v = cfg.v;
        }
        this.x = cfg.x;
        void 0;
      }

    };

    //---------------------------------------------------------------------------------------------------------
    Tnvx.prototype._constructor_nfa = nfa(function(t, n, v, x, cfg) {
      return cfg;
    });

    return Tnvx;

  }).call(this);

  Cde = (function() {
    //===========================================================================================================
    class Cde {
      //---------------------------------------------------------------------------------------------------------
      constructor(...P) {
        var cfg, ref, ref1, ref2, ref3, ref4, ref5, ref6;
        cfg = this._constructor_nfa(...P);
        this.a = (ref = cfg.a) != null ? ref : [];
        this.c = (ref1 = cfg.c) != null ? ref1 : [];
        this.d = (ref2 = cfg.d) != null ? ref2 : [];
        this.e = (ref3 = cfg.e) != null ? ref3 : [];
        this.i = (ref4 = cfg.i) != null ? ref4 : get_type_of_stdin();
        this.o = (ref5 = cfg.o) != null ? ref5 : get_type_of_stdout();
        this.s = (ref6 = cfg.s) != null ? ref6 : null;
        void 0;
      }

      //---------------------------------------------------------------------------------------------------------
      is_after_scissors(idx_or_tnvx) {}

    };

    //---------------------------------------------------------------------------------------------------------
    Cde.prototype._constructor_nfa = nfa(function(a, c, d, e, i, o, s, cfg) {
      return cfg;
    });

    return Cde;

  }).call(this);

  //===========================================================================================================
  parse_argv = parse_argv_1 = function(argv = null) {
    var R, j, len, match, n, past_fence, past_scissors, ref, ref1, ref2, s, s0, slot, t, type_of_argv, v, x;
    if (argv != null) {
      if ((type_of_argv = type_of(argv)) !== 'list') {
        throw new Error(`Ωjsonick___2 expected a list for argv, got a ${type_of_argv}`);
      }
      argv = [...argv];
    } else {
      argv = process.argv.slice(2);
    }
    //.........................................................................................................
    R = new Cde(argv);
    if (argv.length === 0) {
      return R;
    }
    //.........................................................................................................
    past_fence = false;
    past_scissors = false;
    for (x = j = 0, len = argv.length; j < len; x = ++j) {
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
            if (s === '--x--') {
              if (past_scissors) {
                t = 'scs';
                slot = 'e';
                break;
              } else {
                R.s = x;
                past_scissors = true;
                continue;
              }
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
      R[slot].push(new Tnvx(t, n, v != null ? v : s, x));
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
  module.exports = (() => {
    var internals;
    internals = {patterns};
    return {parse_argv, parse_argv_1, internals};
  })();

  //===========================================================================================================
  if (module === require.main) {
    (() => {
      cli();
      return null;
    })();
  }

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3BhcnNlLWFyZ3YtMS5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQWU7RUFBQTtFQUVmO0FBRmUsTUFBQSxHQUFBLEVBQUEsR0FBQSxFQUFBLElBQUEsRUFBQSxLQUFBLEVBQUEsR0FBQSxFQUFBLEtBQUEsRUFBQSxJQUFBLEVBQUEsaUJBQUEsRUFBQSxrQkFBQSxFQUFBLElBQUEsRUFBQSxJQUFBLEVBQUEsT0FBQSxFQUFBLFFBQUEsRUFBQSxHQUFBLEVBQUEsR0FBQSxFQUFBLFVBQUEsRUFBQSxZQUFBLEVBQUEsUUFBQSxFQUFBLEtBQUEsRUFBQSxNQUFBLEVBQUEsR0FBQSxFQUFBLE9BQUEsRUFBQSxJQUFBLEVBQUEsSUFBQSxFQUFBLE9BQUE7OztFQUtmLEdBQUEsR0FBNEIsT0FBQSxDQUFRLEtBQVI7O0VBQzVCLENBQUEsQ0FBRSxLQUFGLEVBQ0UsS0FERixFQUVFLElBRkYsRUFHRSxJQUhGLEVBSUUsS0FKRixFQUtFLE1BTEYsRUFNRSxJQU5GLEVBT0UsSUFQRixFQVFFLE9BUkYsQ0FBQSxHQVE0QixHQUFHLENBQUMsR0FBRyxDQUFDLFdBQVIsQ0FBb0IseUJBQXBCLENBUjVCOztFQVNBLENBQUEsQ0FBRSxHQUFGLEVBQ0UsT0FERixFQUVFLElBRkYsRUFHRSxHQUhGLENBQUEsR0FHNEIsR0FBRyxDQUFDLEdBSGhDLEVBZmU7OztFQW9CZixDQUFBLENBQUUsaUJBQUYsRUFDRSxrQkFERixDQUFBLEdBQzRCLE9BQUEsQ0FBUSw0REFBUixDQUQ1Qjs7RUFFQSxDQUFBLENBQUUsT0FBRixDQUFBLEdBQTRCLENBQUUsT0FBQSxDQUFRLDBEQUFSLENBQUYsQ0FBc0UsQ0FBQyxlQUF2RSxDQUFBLENBQTVCOztFQUNBLENBQUEsQ0FBRSxHQUFGLENBQUEsR0FBNEIsT0FBQSxDQUFRLDhCQUFSLENBQTVCOztFQUNBLFFBQUEsR0FBNEIsUUFBQSxDQUFFLENBQUYsQ0FBQTtXQUFTLENBQUUsT0FBTyxDQUFULENBQUEsS0FBZ0I7RUFBekIsRUF4QmI7OztFQTRCZixRQUFBLEdBQWMsQ0FBQSxDQUFBLENBQUEsR0FBQTtBQUNkLFFBQUEsQ0FBQSxFQUFBLE1BQUE7Ozs7OztJQUtFLE1BQUEsR0FBUyx3RUFMWDtJQVVFLENBQUEsR0FDRTtNQUFBLE1BQUEsRUFBUSxNQUFSO01BQ0EsTUFBQSxFQUFRLDRCQURSO01BRUEsTUFBQSxFQUFRLE1BQUEsQ0FBQSxDQUFBLDRCQUFBLENBQUEsQ0FBd0MsTUFBTSxDQUFDLE1BQS9DLENBQUEsRUFBQSxDQUFBLEVBQXlFLEdBQXpFLENBRlI7TUFHQSxNQUFBLEVBQVEsTUFBQSxDQUFBLENBQUEsdUJBQUEsQ0FBQSxDQUF3QyxNQUFNLENBQUMsTUFBL0MsQ0FBQSxXQUFBLENBQUEsRUFBeUUsR0FBekU7SUFIUjtBQUlGLFdBQU87RUFoQkssQ0FBQTs7RUFtQlI7O0lBQU4sTUFBQSxLQUFBLENBQUE7O01BTUUsV0FBYSxDQUFBLEdBQUUsQ0FBRixDQUFBO0FBQ2YsWUFBQTtRQUFJLEdBQUEsR0FBTSxJQUFDLENBQUEsZ0JBQUQsQ0FBa0IsR0FBQSxDQUFsQjtRQUNOLElBQUMsQ0FBQSxDQUFELEdBQU0sR0FBRyxDQUFDO1FBQ1YsSUFBZSxhQUFmO1VBQUEsSUFBQyxDQUFBLENBQUQsR0FBTSxHQUFHLENBQUMsRUFBVjs7UUFDQSxJQUFlLGFBQWY7VUFBQSxJQUFDLENBQUEsQ0FBRCxHQUFNLEdBQUcsQ0FBQyxFQUFWOztRQUNBLElBQUMsQ0FBQSxDQUFELEdBQU0sR0FBRyxDQUFDO1FBQ1Q7TUFOVTs7SUFOZjs7O21CQUdFLGdCQUFBLEdBQWtCLEdBQUEsQ0FBSSxRQUFBLENBQUUsQ0FBRixFQUFLLENBQUwsRUFBUSxDQUFSLEVBQVcsQ0FBWCxFQUFjLEdBQWQsQ0FBQTthQUF1QjtJQUF2QixDQUFKOzs7Ozs7RUFhZDs7SUFBTixNQUFBLElBQUEsQ0FBQTs7TUFNRSxXQUFhLENBQUEsR0FBRSxDQUFGLENBQUE7QUFDZixZQUFBLEdBQUEsRUFBQSxHQUFBLEVBQUEsSUFBQSxFQUFBLElBQUEsRUFBQSxJQUFBLEVBQUEsSUFBQSxFQUFBLElBQUEsRUFBQTtRQUFJLEdBQUEsR0FBTSxJQUFDLENBQUEsZ0JBQUQsQ0FBa0IsR0FBQSxDQUFsQjtRQUNOLElBQUMsQ0FBQSxDQUFELGlDQUFjO1FBQ2QsSUFBQyxDQUFBLENBQUQsbUNBQWM7UUFDZCxJQUFDLENBQUEsQ0FBRCxtQ0FBYztRQUNkLElBQUMsQ0FBQSxDQUFELG1DQUFjO1FBQ2QsSUFBQyxDQUFBLENBQUQsbUNBQWMsaUJBQUEsQ0FBQTtRQUNkLElBQUMsQ0FBQSxDQUFELG1DQUFjLGtCQUFBLENBQUE7UUFDZCxJQUFDLENBQUEsQ0FBRCxtQ0FBYztRQUNiO01BVFUsQ0FKZjs7O01BZ0JFLGlCQUFtQixDQUFFLFdBQUYsQ0FBQSxFQUFBOztJQWxCckI7OztrQkFHRSxnQkFBQSxHQUFrQixHQUFBLENBQUksUUFBQSxDQUFFLENBQUYsRUFBSyxDQUFMLEVBQVEsQ0FBUixFQUFXLENBQVgsRUFBYyxDQUFkLEVBQWlCLENBQWpCLEVBQW9CLENBQXBCLEVBQXVCLEdBQXZCLENBQUE7YUFBZ0M7SUFBaEMsQ0FBSjs7OztnQkFsRUw7OztFQXFGZixVQUFBLEdBQWEsWUFBQSxHQUFlLFFBQUEsQ0FBRSxPQUFPLElBQVQsQ0FBQTtBQUM1QixRQUFBLENBQUEsRUFBQSxDQUFBLEVBQUEsR0FBQSxFQUFBLEtBQUEsRUFBQSxDQUFBLEVBQUEsVUFBQSxFQUFBLGFBQUEsRUFBQSxHQUFBLEVBQUEsSUFBQSxFQUFBLElBQUEsRUFBQSxDQUFBLEVBQUEsRUFBQSxFQUFBLElBQUEsRUFBQSxDQUFBLEVBQUEsWUFBQSxFQUFBLENBQUEsRUFBQTtJQUFFLElBQUcsWUFBSDtNQUNFLElBQU8sQ0FBRSxZQUFBLEdBQWUsT0FBQSxDQUFRLElBQVIsQ0FBakIsQ0FBQSxLQUFtQyxNQUExQztRQUNFLE1BQU0sSUFBSSxLQUFKLENBQVUsQ0FBQSw2Q0FBQSxDQUFBLENBQWdELFlBQWhELENBQUEsQ0FBVixFQURSOztNQUVBLElBQUEsR0FBUSxDQUFFLEdBQUEsSUFBRixFQUhWO0tBQUEsTUFBQTtNQUtFLElBQUEsR0FBTyxPQUFPLENBQUMsSUFBSSxVQUxyQjtLQUFGOztJQU9FLENBQUEsR0FBSSxJQUFJLEdBQUosQ0FBUSxJQUFSO0lBQ0osSUFBWSxJQUFJLENBQUMsTUFBTCxLQUFlLENBQTNCO0FBQUEsYUFBTyxFQUFQO0tBUkY7O0lBVUUsVUFBQSxHQUFnQjtJQUNoQixhQUFBLEdBQWdCO0lBQ2hCLEtBQUEsOENBQUE7O01BQ0UsS0FBNkYsUUFBQSxDQUFTLENBQVQsQ0FBN0Y7UUFBQSxNQUFNLElBQUksS0FBSixDQUFVLENBQUEsc0JBQUEsQ0FBQSxDQUF5QixDQUF6QixDQUFBLDZCQUFBLENBQUEsQ0FBMEQsT0FBQSxDQUFRLENBQVIsQ0FBMUQsQ0FBQSxDQUFWLEVBQU47T0FBSjs7TUFFSSxJQUFHLFVBQUg7UUFDRSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUosQ0FBUztVQUFFLENBQUEsRUFBRyxLQUFMO1VBQVksQ0FBQSxFQUFHLENBQWY7VUFBa0I7UUFBbEIsQ0FBVDtBQUNBLGlCQUZGO09BRko7O01BTUksSUFBQSxHQUFVO01BQ1YsQ0FBQSxHQUFVO01BQ1YsQ0FBQSxHQUFVO01BQ1YsQ0FBQSxHQUFVLEtBVGQ7O01BV0ksSUFBRyxRQUFRLENBQUMsTUFBTSxDQUFDLElBQWhCLENBQXFCLENBQXJCLENBQUg7UUFDRSxDQUFBLEdBQUksTUFETjtPQUFBLE1BQUE7O0FBR0ssZ0JBQU8sRUFBQSxnQ0FBYyxJQUFyQjs7QUFBQSxlQUVFLElBQUssMENBRlA7WUFHRCxDQUFBLEdBQUk7QUFERDs7QUFGRixlQUtFLEdBTEY7QUFBQSxlQUtPLEdBTFA7O1lBT0QsSUFBRyxDQUFBLEtBQUssSUFBUjtjQUNFLFVBQUEsR0FBZ0I7QUFDaEIsdUJBRkY7YUFEUjs7WUFLUSxJQUFHLENBQUEsS0FBSyxPQUFSO2NBQ0UsSUFBRyxhQUFIO2dCQUNFLENBQUEsR0FBUTtnQkFDUixJQUFBLEdBQVE7QUFDUixzQkFIRjtlQUFBLE1BQUE7Z0JBS0UsQ0FBQyxDQUFDLENBQUYsR0FBZ0I7Z0JBQ2hCLGFBQUEsR0FBZ0I7QUFDaEIseUJBUEY7ZUFERjthQUxSOztZQWVRLENBQUEsR0FBSTtZQUNKLElBQUcsMENBQUg7Y0FDRSxJQUFBLCtDQUE0QjtjQUM1QixDQUFBLEdBQVcsRUFBQSxLQUFNLEdBQVQsR0FBa0IsSUFBbEIsR0FBNEI7Y0FDcEMsQ0FBQSxHQUFRLEtBQUssQ0FBQyxNQUFNLENBQUM7QUFDckIsb0JBSkY7YUFoQlI7O1lBc0JRLElBQUEsR0FBTztBQXZCQzs7QUFMUCxlQThCRSxHQTlCRjtZQStCRCxDQUFBLEdBQVE7WUFDUixJQUFHLDBDQUFIO2NBQ0UsSUFBQSwrQ0FBNEI7Y0FDNUIsQ0FBQSxHQUFRLEtBQUssQ0FBQyxNQUFNLENBQUM7Y0FDckIsQ0FBQSxHQUFRLEtBQUssQ0FBQyxNQUFNLENBQUM7QUFDckIsb0JBSkY7YUFEUjs7WUFPUSxJQUFBLEdBQU87QUFSSjs7QUE5QkYsZUF3Q0UsR0F4Q0Y7WUF5Q0QsQ0FBQSxHQUFRO1lBQ1IsQ0FBQSxHQUFRLENBQUM7QUFGTjs7QUF4Q0YsZUE0Q0UsR0E1Q0Y7WUE0Q1csQ0FBQSxHQUFJO0FBQWI7QUE1Q0YsZUE2Q0UsR0E3Q0Y7WUE2Q1csQ0FBQSxHQUFJO0FBQWI7QUE3Q0Y7WUE4Q1csQ0FBQSxHQUFJO0FBOUNmLFNBSEw7T0FYSjs7TUE4REksQ0FBQyxDQUFFLElBQUYsQ0FBUSxDQUFDLElBQVYsQ0FBZSxJQUFJLElBQUosQ0FBUyxDQUFULEVBQVksQ0FBWixjQUFpQixJQUFJLENBQXJCLEVBQTBCLENBQTFCLENBQWY7SUEvREYsQ0FaRjs7QUE2RUUsV0FBTztFQTlFbUIsRUFyRmI7OztFQXNLZixHQUFBLEdBQU0sUUFBQSxDQUFBLENBQUE7QUFDTixRQUFBLEdBQUE7O0lBQ0UsR0FBQSxHQUFNLFVBQUEsQ0FBQTtJQUNOLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBZixDQUFxQixJQUFJLENBQUMsU0FBTCxDQUFlLEdBQWYsQ0FBckI7V0FDQztFQUpHLEVBdEtTOzs7RUE4S2YsTUFBTSxDQUFDLE9BQVAsR0FBb0IsQ0FBQSxDQUFBLENBQUEsR0FBQTtBQUNwQixRQUFBO0lBQUUsU0FBQSxHQUFZLENBQUUsUUFBRjtBQUNaLFdBQU8sQ0FBRSxVQUFGLEVBQWMsWUFBZCxFQUE0QixTQUE1QjtFQUZXLENBQUEsSUE5S0w7OztFQW1MZixJQUFHLE1BQUEsS0FBVSxPQUFPLENBQUMsSUFBckI7SUFBa0MsQ0FBQSxDQUFBLENBQUEsR0FBQTtNQUNoQyxHQUFBLENBQUE7YUFDQztJQUYrQixDQUFBLElBQWxDOztBQW5MZSIsInNvdXJjZXNDb250ZW50IjpbIiMhL2Jpbi9lbnYgbm9kZVxuXG4ndXNlIHN0cmljdCdcblxuIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5HVVkgICAgICAgICAgICAgICAgICAgICAgID0gcmVxdWlyZSAnZ3V5J1xueyBhbGVydFxuICBkZWJ1Z1xuICBoZWxwXG4gIGluZm9cbiAgcGxhaW5cbiAgcHJhaXNlXG4gIHVyZ2VcbiAgd2FyblxuICB3aGlzcGVyIH0gICAgICAgICAgICAgICA9IEdVWS50cm0uZ2V0X2xvZ2dlcnMgJ25vcm1hbGl6ZS1jbGktYXJndW1lbnRzJ1xueyBycHJcbiAgaW5zcGVjdFxuICBlY2hvXG4gIGxvZyAgICAgfSAgICAgICAgICAgICAgID0gR1VZLnRybVxuIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG57IGdldF90eXBlX29mX3N0ZGluXG4gIGdldF90eXBlX29mX3N0ZG91dCAgICB9ID0gcmVxdWlyZSAnLi4vLi4vYnJpY2FicmFjLXNmbW9kdWxlcy9saWIvY2xpLWdldC10eXBlLW9mLXN0ZGluLXN0ZG91dCdcbnsgdHlwZV9vZiwgICAgICAgICAgICAgIH0gPSAoIHJlcXVpcmUgJy4uLy4uL2JyaWNhYnJhYy1zZm1vZHVsZXMvbGliL3Vuc3RhYmxlLXJwci10eXBlX29mLWJyaWNzJyApLnJlcXVpcmVfdHlwZV9vZigpXG57IG5mYSwgICAgICAgICAgICAgICAgICB9ID0gcmVxdWlyZSAnbm9ybWFsaXplLWZ1bmN0aW9uLWFyZ3VtZW50cydcbmlzYV90ZXh0ICAgICAgICAgICAgICAgICAgPSAoIHggKSAtPiAoIHR5cGVvZiB4ICkgaXMgJ3N0cmluZydcblxuXG4jLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbnBhdHRlcm5zID0gZG8gPT5cbiAgIyMjIGBubWVfcmVgIG1hdGNoZXMgYWxsIHN0cmluZ3MgdGhhdCBhcmUgbGVnYWwgaWRlbnRpZmllcnMgaW4gSmF2YVNjcmlwdDsgYWRkaXRpb25hbGx5LCBpdCBhbGxvd3MgdGhlXG4gIHVzYWdlIG9mIGh5cGhlbi1taW51cyAoYC1gLCBVKzAwMmQpIGluc2lkZSBvZiBuYW1lcyBzbyBib3RoIGBteV9uYW1lYCBhbmQgYG15LW5hbWVgIGFyZSBib3RoIGxlZ2FsIG5hbWVzXG4gIChidXQgYC14eHhgIGlzIG5vdCB3aGVyZWFzIGBfeHh4YCBpcyBPSykuIFRoeCB0b1xuICBodHRwczovL2dpdGh1Yi5jb20vbWF0aGlhc2J5bmVucy9tb3RoZXJlZmYuaW4vYmxvYi9tYXN0ZXIvanMtdmFyaWFibGVzL2VmZi5qcyBhbmRcbiAgaHR0cHM6Ly9tYXRoaWFzYnluZW5zLmJlL25vdGVzL2phdmFzY3JpcHQtaWRlbnRpZmllcnMtZXM2ICMjI1xuICBubWVfcmUgPSAvLy9cbiAgICAoPyEgLiogLSAkICkgIyBkaXNhbGxvdyBzdHJpbmdzIGVuZGluZyBpbiBoeXBoZW4tbWludXNcbiAgICAoPzogWyAkXyBdICAgICAgICAgICAgICAgICAgICAgICAgfCBcXHB7SURfU3RhcnR9ICAgIClcbiAgICAoPzogWyAkIF8gXFwtIFxcdXsyMDBjfSBcXHV7MjAwZH0gXSAgfCBcXHB7SURfQ29udGludWV9ICkqXG4gICAgLy8vdlxuICBSID1cbiAgICBubWVfcmU6IG5tZV9yZVxuICAgIG51bV9yZTogLy8vXiAoPzx2PiBbK1xcLV0/IFsuXT8gWzAtOV0uKiApICQvLy92XG4gICAgYm9sX3JlOiAvLy9eIFsrXFwtXSAoICg/PHNsb3Q+IGQgKSBcXC4gKT8gKD88bj4gI3tubWVfcmUuc291cmNlfSkgICAgICAgICAgICAgICQvLy92XG4gICAgZmFjX3JlOiAvLy9eIDogICAgICggKD88c2xvdD4gZCApIFxcLiApPyAoPzxuPiAje25tZV9yZS5zb3VyY2V9KSA9ICg/PHY+IC4qICkgJC8vL3ZcbiAgcmV0dXJuIFJcblxuIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5jbGFzcyBUbnZ4XG5cbiAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBfY29uc3RydWN0b3JfbmZhOiBuZmEgKCB0LCBuLCB2LCB4LCBjZmcgKSAtPiBjZmdcblxuICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIGNvbnN0cnVjdG9yOiAoIFAuLi4gKSAtPlxuICAgIGNmZyA9IEBfY29uc3RydWN0b3JfbmZhIFAuLi5cbiAgICBAdCAgPSBjZmcudFxuICAgIEBuICA9IGNmZy5uIGlmIGNmZy5uP1xuICAgIEB2ICA9IGNmZy52IGlmIGNmZy52P1xuICAgIEB4ICA9IGNmZy54XG4gICAgO3VuZGVmaW5lZFxuXG5cbiM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuY2xhc3MgQ2RlXG5cbiAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBfY29uc3RydWN0b3JfbmZhOiBuZmEgKCBhLCBjLCBkLCBlLCBpLCBvLCBzLCBjZmcgKSAtPiBjZmdcblxuICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIGNvbnN0cnVjdG9yOiAoIFAuLi4gKSAtPlxuICAgIGNmZyA9IEBfY29uc3RydWN0b3JfbmZhIFAuLi5cbiAgICBAYSAgPSBjZmcuYSA/IFtdXG4gICAgQGMgID0gY2ZnLmMgPyBbXVxuICAgIEBkICA9IGNmZy5kID8gW11cbiAgICBAZSAgPSBjZmcuZSA/IFtdXG4gICAgQGkgID0gY2ZnLmkgPyBnZXRfdHlwZV9vZl9zdGRpbigpXG4gICAgQG8gID0gY2ZnLm8gPyBnZXRfdHlwZV9vZl9zdGRvdXQoKVxuICAgIEBzICA9IGNmZy5zID8gbnVsbFxuICAgIDt1bmRlZmluZWRcblxuICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIGlzX2FmdGVyX3NjaXNzb3JzOiAoIGlkeF9vcl90bnZ4ICkgLT5cblxuXG4jPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbnBhcnNlX2FyZ3YgPSBwYXJzZV9hcmd2XzEgPSAoIGFyZ3YgPSBudWxsICkgLT5cbiAgaWYgYXJndj9cbiAgICB1bmxlc3MgKCB0eXBlX29mX2FyZ3YgPSB0eXBlX29mIGFyZ3YgKSBpcyAnbGlzdCdcbiAgICAgIHRocm93IG5ldyBFcnJvciBcIs6panNvbmlja19fXzIgZXhwZWN0ZWQgYSBsaXN0IGZvciBhcmd2LCBnb3QgYSAje3R5cGVfb2ZfYXJndn1cIlxuICAgIGFyZ3YgID0gWyBhcmd2Li4uLCBdXG4gIGVsc2VcbiAgICBhcmd2ID0gcHJvY2Vzcy5hcmd2WyAyIC4uIF1cbiAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICBSID0gbmV3IENkZSBhcmd2XG4gIHJldHVybiBSIGlmIGFyZ3YubGVuZ3RoIGlzIDBcbiAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICBwYXN0X2ZlbmNlICAgID0gZmFsc2VcbiAgcGFzdF9zY2lzc29ycyA9IGZhbHNlXG4gIGZvciBzLCB4IGluIGFyZ3ZcbiAgICB0aHJvdyBuZXcgRXJyb3IgXCLOqWpzb25pY2tfX18yIGF0IGFyZ3ZbICN7eH0gXTogZXhwZWN0ZWQgYSBzdHJpbmcsIGdvdCBhICN7dHlwZV9vZiBzfVwiIHVubGVzcyBpc2FfdGV4dCBzXG4gICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgaWYgcGFzdF9mZW5jZVxuICAgICAgUi5kLnB1c2ggeyB0OiAncGZuJywgdjogcywgeCwgfVxuICAgICAgY29udGludWVcbiAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICBzbG90ICAgID0gJ2QnXG4gICAgdCAgICAgICA9IG51bGxcbiAgICB2ICAgICAgID0gbnVsbFxuICAgIG4gICAgICAgPSBudWxsXG4gICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICBpZiBwYXR0ZXJucy5udW1fcmUudGVzdCBzXG4gICAgICB0ID0gJ251bSdcbiAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgIGVsc2Ugc3dpdGNoIHMwID0gc1sgMCBdID8gbnVsbFxuICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICB3aGVuIG51bGwgIyMjIGluIHRoZSBjYXNlIG9mIGVtcHR5IHN0cmluZyBhcyBpbnB1dCAjIyNcbiAgICAgICAgdCA9ICdiYXInXG4gICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgIHdoZW4gJy0nLCAnKydcbiAgICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgICBpZiBzIGlzICctLSdcbiAgICAgICAgICBwYXN0X2ZlbmNlICAgID0gdHJ1ZVxuICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgICAgaWYgcyBpcyAnLS14LS0nXG4gICAgICAgICAgaWYgcGFzdF9zY2lzc29yc1xuICAgICAgICAgICAgdCAgICAgPSAnc2NzJ1xuICAgICAgICAgICAgc2xvdCAgPSAnZSdcbiAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgUi5zICAgICAgICAgICA9IHhcbiAgICAgICAgICAgIHBhc3Rfc2Npc3NvcnMgPSB0cnVlXG4gICAgICAgICAgICBjb250aW51ZVxuICAgICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICAgIHQgPSAnYm9sJ1xuICAgICAgICBpZiAoIG1hdGNoID0gcy5tYXRjaCBwYXR0ZXJucy5ib2xfcmUgKT9cbiAgICAgICAgICBzbG90ICA9IG1hdGNoLmdyb3Vwcy5zbG90ID8gJ2MnXG4gICAgICAgICAgdiAgICAgPSBpZiBzMCBpcyAnKycgdGhlbiB0cnVlIGVsc2UgZmFsc2VcbiAgICAgICAgICBuICAgICA9IG1hdGNoLmdyb3Vwcy5uXG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgICBzbG90ID0gJ2UnXG4gICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgIHdoZW4gJzonXG4gICAgICAgIHQgICAgID0gJ2ZhYydcbiAgICAgICAgaWYgKCBtYXRjaCA9IHMubWF0Y2ggcGF0dGVybnMuZmFjX3JlICk/XG4gICAgICAgICAgc2xvdCAgPSBtYXRjaC5ncm91cHMuc2xvdCA/ICdjJ1xuICAgICAgICAgIHYgICAgID0gbWF0Y2guZ3JvdXBzLnZcbiAgICAgICAgICBuICAgICA9IG1hdGNoLmdyb3Vwcy5uXG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgICBzbG90ID0gJ2UnXG4gICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgIHdoZW4gJyUnXG4gICAgICAgIHQgICAgID0gJ2VzYydcbiAgICAgICAgdiAgICAgPSBzWyAxIC4uIF1cbiAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgd2hlbiAneycgdGhlbiB0ID0gJ29iaidcbiAgICAgIHdoZW4gJ1snIHRoZW4gdCA9ICdsc3QnXG4gICAgICBlbHNlICAgICAgICAgIHQgPSAnYmFyJ1xuICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgUlsgc2xvdCBdLnB1c2ggbmV3IFRudnggdCwgbiwgKCB2ID8gcyApLCB4XG4gICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgcmV0dXJuIFJcblxuIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5jbGkgPSAtPlxuICAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIGNkZSA9IHBhcnNlX2FyZ3YoKVxuICBwcm9jZXNzLnN0ZG91dC53cml0ZSBKU09OLnN0cmluZ2lmeSBjZGVcbiAgO251bGxcblxuXG4jPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbm1vZHVsZS5leHBvcnRzID0gZG8gPT5cbiAgaW50ZXJuYWxzID0geyBwYXR0ZXJucywgfVxuICByZXR1cm4geyBwYXJzZV9hcmd2LCBwYXJzZV9hcmd2XzEsIGludGVybmFscywgfVxuXG4jPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmlmIG1vZHVsZSBpcyByZXF1aXJlLm1haW4gdGhlbiBkbyA9PlxuICBjbGkoKVxuICA7bnVsbFxuIl19
