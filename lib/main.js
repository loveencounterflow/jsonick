(function() {
  'use strict';
  var GUY, Grammar, Level, Lexeme, Token, alert, blue, bold, debug, demo, echo, gold, green, grey, help, info, inspect, internals, log, plain, praise, red, reverse, rpr, rx, urge, warn, whisper, white;

  //===========================================================================================================
  GUY = require('guy');

  ({alert, debug, help, info, plain, praise, urge, warn, whisper} = GUY.trm.get_loggers('normalize-cli-arguments'));

  ({rpr, inspect, echo, white, green, blue, gold, grey, red, bold, reverse, log} = GUY.trm);

  //-----------------------------------------------------------------------------------------------------------
  // SFMODULES                 = require 'bricabrac-sfmodules'
  // { type_of,              } = SFMODULES.unstable.require_type_of()
  // { Jetstream,
  //   internals,            } = SFMODULES.require_jetstream()
  ({Grammar, Level, Token, Lexeme, rx, internals} = require('interlex'));

  //===========================================================================================================
  demo = function() {
    var abbrlxm, condense_lexemes, g, new_grammar, parse_argv, tabulate_lexeme, tabulate_lexemes;
    ({condense_lexemes, abbrlxm, tabulate_lexemes, tabulate_lexeme} = require('../../hengist-NG/dev/interlex/lib/helpers'));
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
      gnd.new_token('btrue', rx`\+(?<name>.+)`, {
        data: {
          realm: 'c',
          type: 'boolean',
          string: 'true',
          value: true
        }
      });
      gnd.new_token('bfalse', rx`-(?<name>.+)`, {
        data: {
          realm: 'c',
          type: 'boolean',
          string: 'true',
          value: false
        }
      });
      gnd.new_token('dol', rx`(?<string>\{.*\})`, {
        data: {
          realm: 'd',
          type: 'dol'
        }
      });
      /* NOTE: DOL = Data Object Literal */      gnd.new_token('facet', rx`(?<name>[^\-+\{][^\s:]*):(?<string>.*)`, {
        data: {
          realm: 'c',
          type: 'facet'
        }
      });
      gnd.new_token('other', rx`(?<string>.+)`, {
        data: {
          realm: 'c',
          type: 'other',
          name: null
        }
      });
      return R;
    };
    //---------------------------------------------------------------------------------------------------------
    parse_argv = function(argv = null) {
      var R, argument, error, i, len, lexeme, name, realm/* !!!!!!!!!!!!!!! */, ref, string, type, value;
      R = {
        c: {},
        d: {}
      };
      if (argv == null) {
        argv = process.argv.slice(2);
      }
      debug('Ωjsonick___1', argv);
      for (i = 0, len = argv.length; i < len; i++) {
        argument = argv[i];
        for (lexeme of g.scan(argument)) {
          tabulate_lexeme(lexeme);
          ({realm, type, name, value, string} = lexeme.data);
          switch (type) {
            case 'boolean':
              R[realm][name] = value;
              break;
            case 'facet':
              R[realm][name] = string;
              break;
            case 'dol':
              try {
                R[realm] = Object.assign((ref = R[realm]) != null ? ref : {}, JSON.parse(string));
              } catch (error1) {
                error = error1;
                warn("Ωjsonick___2", error.message);
              }
              break;
            case 'other':
              warn("Ωjsonick___3", `illegal argument: ${rpr(string)}`);
              break;
            default:
              throw new Error(`Ωjsonick___4 should never happen: unknown lexeme type ${rpr(type)}`);
          }
        }
      }
      return R;
    };
    //---------------------------------------------------------------------------------------------------------
    // PQ  = process.argv[ 2 .. ]
    g = new_grammar();
    info('Ωjsonick___5', parse_argv());
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL21haW4uY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBO0VBQUE7QUFBQSxNQUFBLEdBQUEsRUFBQSxPQUFBLEVBQUEsS0FBQSxFQUFBLE1BQUEsRUFBQSxLQUFBLEVBQUEsS0FBQSxFQUFBLElBQUEsRUFBQSxJQUFBLEVBQUEsS0FBQSxFQUFBLElBQUEsRUFBQSxJQUFBLEVBQUEsSUFBQSxFQUFBLEtBQUEsRUFBQSxJQUFBLEVBQUEsSUFBQSxFQUFBLElBQUEsRUFBQSxPQUFBLEVBQUEsU0FBQSxFQUFBLEdBQUEsRUFBQSxLQUFBLEVBQUEsTUFBQSxFQUFBLEdBQUEsRUFBQSxPQUFBLEVBQUEsR0FBQSxFQUFBLEVBQUEsRUFBQSxJQUFBLEVBQUEsSUFBQSxFQUFBLE9BQUEsRUFBQSxLQUFBOzs7RUFHQSxHQUFBLEdBQTRCLE9BQUEsQ0FBUSxLQUFSOztFQUM1QixDQUFBLENBQUUsS0FBRixFQUNFLEtBREYsRUFFRSxJQUZGLEVBR0UsSUFIRixFQUlFLEtBSkYsRUFLRSxNQUxGLEVBTUUsSUFORixFQU9FLElBUEYsRUFRRSxPQVJGLENBQUEsR0FRNEIsR0FBRyxDQUFDLEdBQUcsQ0FBQyxXQUFSLENBQW9CLHlCQUFwQixDQVI1Qjs7RUFTQSxDQUFBLENBQUUsR0FBRixFQUNFLE9BREYsRUFFRSxJQUZGLEVBR0UsS0FIRixFQUlFLEtBSkYsRUFLRSxJQUxGLEVBTUUsSUFORixFQU9FLElBUEYsRUFRRSxHQVJGLEVBU0UsSUFURixFQVVFLE9BVkYsRUFXRSxHQVhGLENBQUEsR0FXNEIsR0FBRyxDQUFDLEdBWGhDLEVBYkE7Ozs7Ozs7RUE4QkEsQ0FBQSxDQUFFLE9BQUYsRUFDRSxLQURGLEVBRUUsS0FGRixFQUdFLE1BSEYsRUFJRSxFQUpGLEVBS0UsU0FMRixDQUFBLEdBSzRCLE9BQUEsQ0FBUSxVQUFSLENBTDVCLEVBOUJBOzs7RUF1Q0EsSUFBQSxHQUFPLFFBQUEsQ0FBQSxDQUFB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YSxNQUFNLENBQUMsTUFBUCxrQ0FBNkIsQ0FBQSxDQUE3QixFQUFtQyxJQUFJLENBQUMsS0FBTCxDQUFXLE1BQVgsQ0FBbkMsRUFEZjtlQUVBLGNBQUE7Z0JBQU07Z0JBQ0osSUFBQSxDQUFLLGNBQUwsRUFBcUIsS0FBSyxDQUFDLE9BQTNCLEVBREY7O0FBSEc7QUFMUCxpQkFVTyxPQVZQO2NBV0ksSUFBQSxDQUFLLGNBQUwsRUFBcUIsQ0FBQSxrQkFBQSxDQUFBLENBQXFCLEdBQUEsQ0FBSSxNQUFKLENBQXJCLENBQUEsQ0FBckI7QUFERztBQVZQO2NBYUksTUFBTSxJQUFJLEtBQUosQ0FBVSxDQUFBLHNEQUFBLENBQUEsQ0FBeUQsR0FBQSxDQUFJLElBQUosQ0FBekQsQ0FBQSxDQUFWO0FBYlY7UUFQRjtNQURGO0FBc0JBLGFBQU87SUExQkksRUFmZjs7O0lBNENFLENBQUEsR0FBTSxXQUFBLENBQUE7SUFDTixJQUFBLENBQUssY0FBTCxFQUFxQixVQUFBLENBQUEsQ0FBckIsRUE3Q0Y7Ozs7V0FpREc7RUFsREksRUF2Q1A7Ozs7OztFQWdHQSxJQUFHLE1BQUEsS0FBVSxPQUFPLENBQUMsSUFBckI7SUFBa0MsQ0FBQSxDQUFBLENBQUEsR0FBQTtNQUNoQyxJQUFBLENBQUE7YUFDQztJQUYrQixDQUFBLElBQWxDOztBQWhHQSIsInNvdXJjZXNDb250ZW50IjpbIlxuJ3VzZSBzdHJpY3QnXG5cbiM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuR1VZICAgICAgICAgICAgICAgICAgICAgICA9IHJlcXVpcmUgJ2d1eSdcbnsgYWxlcnRcbiAgZGVidWdcbiAgaGVscFxuICBpbmZvXG4gIHBsYWluXG4gIHByYWlzZVxuICB1cmdlXG4gIHdhcm5cbiAgd2hpc3BlciB9ICAgICAgICAgICAgICAgPSBHVVkudHJtLmdldF9sb2dnZXJzICdub3JtYWxpemUtY2xpLWFyZ3VtZW50cydcbnsgcnByXG4gIGluc3BlY3RcbiAgZWNob1xuICB3aGl0ZVxuICBncmVlblxuICBibHVlXG4gIGdvbGRcbiAgZ3JleVxuICByZWRcbiAgYm9sZFxuICByZXZlcnNlXG4gIGxvZyAgICAgfSAgICAgICAgICAgICAgID0gR1VZLnRybVxuIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4jIFNGTU9EVUxFUyAgICAgICAgICAgICAgICAgPSByZXF1aXJlICdicmljYWJyYWMtc2Ztb2R1bGVzJ1xuIyB7IHR5cGVfb2YsICAgICAgICAgICAgICB9ID0gU0ZNT0RVTEVTLnVuc3RhYmxlLnJlcXVpcmVfdHlwZV9vZigpXG4jIHsgSmV0c3RyZWFtLFxuIyAgIGludGVybmFscywgICAgICAgICAgICB9ID0gU0ZNT0RVTEVTLnJlcXVpcmVfamV0c3RyZWFtKClcbnsgR3JhbW1hclxuICBMZXZlbFxuICBUb2tlblxuICBMZXhlbWVcbiAgcnhcbiAgaW50ZXJuYWxzICAgICAgICAgICAgIH0gPSByZXF1aXJlICdpbnRlcmxleCdcblxuXG4jPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmRlbW8gPSAtPlxuICB7IGNvbmRlbnNlX2xleGVtZXNcbiAgICBhYmJybHhtXG4gICAgdGFidWxhdGVfbGV4ZW1lc1xuICAgIHRhYnVsYXRlX2xleGVtZSAgICAgICB9ID0gcmVxdWlyZSAnLi4vLi4vaGVuZ2lzdC1ORy9kZXYvaW50ZXJsZXgvbGliL2hlbHBlcnMnXG4gICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgbmV3X2dyYW1tYXIgPSAtPlxuICAgIFIgICA9IG5ldyBHcmFtbWFyIHsgbmFtZTogJ2cnLCBsaW5raW5nOiBmYWxzZSwgZW1pdF9zaWduYWxzOiBmYWxzZSwgfVxuICAgIGduZCA9IFIubmV3X2xldmVsIHsgbmFtZTogJ2duZCcsIH1cbiAgICBnbmQubmV3X3Rva2VuICdidHJ1ZScsICByeCdcXCsoPzxuYW1lPi4rKScsICAgICAgICAgICAgICAgICAgICAgICAgICB7IGRhdGE6IHsgcmVhbG06ICdjJywgdHlwZTogJ2Jvb2xlYW4nLCBzdHJpbmc6ICd0cnVlJywgdmFsdWU6IHRydWUsICB9LCB9XG4gICAgZ25kLm5ld190b2tlbiAnYmZhbHNlJywgcngnLSg/PG5hbWU+LispJywgICAgICAgICAgICAgICAgICAgICAgICAgICB7IGRhdGE6IHsgcmVhbG06ICdjJywgdHlwZTogJ2Jvb2xlYW4nLCBzdHJpbmc6ICd0cnVlJywgdmFsdWU6IGZhbHNlLCB9LCB9XG4gICAgZ25kLm5ld190b2tlbiAnZG9sJywgICAgcngnKD88c3RyaW5nPlxcey4qXFx9KScsICAgICAgICAgICAgICAgICAgICAgIHsgZGF0YTogeyByZWFsbTogJ2QnLCB0eXBlOiAnZG9sJywgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIH0gIyMjIE5PVEU6IERPTCA9IERhdGEgT2JqZWN0IExpdGVyYWwgIyMjXG4gICAgZ25kLm5ld190b2tlbiAnZmFjZXQnLCAgcngnKD88bmFtZT5bXlxcLStcXHtdW15cXHM6XSopOig/PHN0cmluZz4uKiknLCB7IGRhdGE6IHsgcmVhbG06ICdjJywgdHlwZTogJ2ZhY2V0JywgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCB9XG4gICAgZ25kLm5ld190b2tlbiAnb3RoZXInLCAgcngnKD88c3RyaW5nPi4rKScsICAgICAgICAgICAgICAgICAgICAgICAgICB7IGRhdGE6IHsgcmVhbG06ICdjJywgdHlwZTogJ290aGVyJywgbmFtZTogbnVsbCwgICAgICAgICAgICAgICAgICAgICB9LCB9XG4gICAgcmV0dXJuIFJcbiAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBwYXJzZV9hcmd2ID0gKCBhcmd2ID0gbnVsbCApIC0+XG4gICAgUiAgICAgPSB7IGM6IHt9LCBkOiB7fSwgfVxuICAgIGFyZ3YgPz0gcHJvY2Vzcy5hcmd2WyAyIC4uIF1cbiAgICBkZWJ1ZyAnzqlqc29uaWNrX19fMScsIGFyZ3ZcbiAgICBmb3IgYXJndW1lbnQgaW4gYXJndlxuICAgICAgZm9yIGxleGVtZSBmcm9tIGcuc2NhbiBhcmd1bWVudFxuICAgICAgICB0YWJ1bGF0ZV9sZXhlbWUgbGV4ZW1lICMjIyAhISEhISEhISEhISEhISEgIyMjXG4gICAgICAgIHsgcmVhbG1cbiAgICAgICAgICB0eXBlXG4gICAgICAgICAgbmFtZVxuICAgICAgICAgIHZhbHVlXG4gICAgICAgICAgc3RyaW5nIH0gPSBsZXhlbWUuZGF0YVxuICAgICAgICBzd2l0Y2ggdHlwZVxuICAgICAgICAgIHdoZW4gJ2Jvb2xlYW4nXG4gICAgICAgICAgICBSWyByZWFsbSBdWyBuYW1lIF0gPSB2YWx1ZVxuICAgICAgICAgIHdoZW4gJ2ZhY2V0J1xuICAgICAgICAgICAgUlsgcmVhbG0gXVsgbmFtZSBdID0gc3RyaW5nXG4gICAgICAgICAgd2hlbiAnZG9sJ1xuICAgICAgICAgICAgdHJ5XG4gICAgICAgICAgICAgIFJbIHJlYWxtIF0gPSBPYmplY3QuYXNzaWduICggUlsgcmVhbG0gXSA/IHt9ICksIEpTT04ucGFyc2Ugc3RyaW5nXG4gICAgICAgICAgICBjYXRjaCBlcnJvclxuICAgICAgICAgICAgICB3YXJuIFwizqlqc29uaWNrX19fMlwiLCBlcnJvci5tZXNzYWdlXG4gICAgICAgICAgd2hlbiAnb3RoZXInXG4gICAgICAgICAgICB3YXJuIFwizqlqc29uaWNrX19fM1wiLCBcImlsbGVnYWwgYXJndW1lbnQ6ICN7cnByIHN0cmluZ31cIlxuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvciBcIs6panNvbmlja19fXzQgc2hvdWxkIG5ldmVyIGhhcHBlbjogdW5rbm93biBsZXhlbWUgdHlwZSAje3JwciB0eXBlfVwiXG4gICAgcmV0dXJuIFJcbiAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAjIFBRICA9IHByb2Nlc3MuYXJndlsgMiAuLiBdXG4gIGcgICA9IG5ld19ncmFtbWFyKClcbiAgaW5mbyAnzqlqc29uaWNrX19fNScsIHBhcnNlX2FyZ3YoKVxuICAjIyNcbiAgWyAncmVwbGFjZTo0JywgJyt1cHBlci1jYXNlJywgJysnLCAnLXZlcmJvc2UnLCAne2Q6OH0nLCAne3M6dHJ1ZSwrYm9vbCx9JywgJ3dvcmRzOmEgYicsICd7JywgJ3tcIm5hbWVcIjp0cnVlLFwid2lkdGhcIjo0NDV9JyBdXG4gICMjI1xuICA7bnVsbFxuXG5cbiM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuIyBtb2R1bGUuZXhwb3J0cyA9IHsgbmZhLCBnZXRfc2lnbmF0dXJlLCBOb3JtYWxpemVfZnVuY3Rpb25fYXJndW1lbnRzLCBUZW1wbGF0ZSwgaW50ZXJuYWxzLCB9XG5cbiM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuaWYgbW9kdWxlIGlzIHJlcXVpcmUubWFpbiB0aGVuIGRvID0+XG4gIGRlbW8oKVxuICA7bnVsbFxuIl19
