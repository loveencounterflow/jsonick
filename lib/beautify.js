#!/bin/env node
(function() {
  //!/bin/env node
  'use strict';
  var GUY, alert, blue, bold, debug, demo, echo, fetch_input, get_type_of_stdin, get_type_of_stdout, gold, green, grey, help, info, inspect, log, plain, praise, read_stdin, red, reverse, rpr, urge, util, warn, whisper, white;

  //===========================================================================================================
  GUY = require('guy');

  ({alert, debug, help, info, plain, praise, urge, warn, whisper} = GUY.trm.get_loggers('normalize-cli-arguments'));

  ({rpr, inspect, echo, white, green, blue, gold, grey, red, bold, reverse, log} = GUY.trm);

  //-----------------------------------------------------------------------------------------------------------
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
  // FS                        = require 'fs'
  ({get_type_of_stdin, get_type_of_stdout} = require('../../bricabrac-sfmodules/lib/cli-get-type-of-stdin-stdout'));

  // { Pipeline,           \
  //   Async_pipeline,     \
  //   transforms: TF }    = require 'moonriver'
  // { Async_pipeline,   } = require 'moonriver'
  util = require('node:util');

  //===========================================================================================================
  read_stdin = async function() {
    var R, chunk;
    R = [];
    for await (chunk of process.stdin) {
      R.push(chunk);
    }
    return (Buffer.concat(R)).toString('utf8');
  };

  //-----------------------------------------------------------------------------------------------------------
  fetch_input = async function() {
    var R, element, i, len, ref, type_of_stdin;
    R = '';
    ref = process.argv.slice(2);
    //.........................................................................................................
    /* TAINT this is stopgap re-implementation of phase 1 argument parsing; in the future to be replaced
     with functionality of `analyze-cli-arguments-phase-1` */
    for (i = 0, len = ref.length; i < len; i++) {
      element = ref[i];
      if (/^[+\-:]/v.test(element)) {
        continue;
      }
      R += element;
    }
    if (R.length > 0) {
      //.........................................................................................................
      return R;
    }
    //.........................................................................................................
    type_of_stdin = get_type_of_stdin();
    switch (type_of_stdin) {
      case 'tty':
        R = process.argv.slice(2).join(' ');
        break;
      case 'pipe':
      case 'file':
      case 'socket':
        R = (await read_stdin());
        break;
      default:
        warn(`Ωjsonick___3 unknown type of input: ${rpr(type_of_stdin)}`);
    }
    //.........................................................................................................
    return R;
  };

  //===========================================================================================================
  demo = async function() {
    var error, input, use_colors, value;
    // console.log cdef
    input = (await fetch_input());
    use_colors = process.stdout.isTTY;
    try {
      value = JSON.parse(input);
      // process.stdout.write JSON.stringify value, null, ' '
      process.stdout.write(util.inspect(value, {
        colors: use_colors
      }));
      process.stdout.write('\n');
    } catch (error1) {
      error = error1;
      process.stdout.write(input);
    }
    return null;
  };

  //===========================================================================================================
  // module.exports = { nfa, get_signature, Normalize_function_arguments, Template, internals, }

  //===========================================================================================================
  if (module === require.main) {
    (async() => {
      await demo();
      return null;
    })();
  }

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2JlYXV0aWZ5LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBZTtFQUFBO0VBRWY7QUFGZSxNQUFBLEdBQUEsRUFBQSxLQUFBLEVBQUEsSUFBQSxFQUFBLElBQUEsRUFBQSxLQUFBLEVBQUEsSUFBQSxFQUFBLElBQUEsRUFBQSxXQUFBLEVBQUEsaUJBQUEsRUFBQSxrQkFBQSxFQUFBLElBQUEsRUFBQSxLQUFBLEVBQUEsSUFBQSxFQUFBLElBQUEsRUFBQSxJQUFBLEVBQUEsT0FBQSxFQUFBLEdBQUEsRUFBQSxLQUFBLEVBQUEsTUFBQSxFQUFBLFVBQUEsRUFBQSxHQUFBLEVBQUEsT0FBQSxFQUFBLEdBQUEsRUFBQSxJQUFBLEVBQUEsSUFBQSxFQUFBLElBQUEsRUFBQSxPQUFBLEVBQUEsS0FBQTs7O0VBS2YsR0FBQSxHQUE0QixPQUFBLENBQVEsS0FBUjs7RUFDNUIsQ0FBQSxDQUFFLEtBQUYsRUFDRSxLQURGLEVBRUUsSUFGRixFQUdFLElBSEYsRUFJRSxLQUpGLEVBS0UsTUFMRixFQU1FLElBTkYsRUFPRSxJQVBGLEVBUUUsT0FSRixDQUFBLEdBUTRCLEdBQUcsQ0FBQyxHQUFHLENBQUMsV0FBUixDQUFvQix5QkFBcEIsQ0FSNUI7O0VBU0EsQ0FBQSxDQUFFLEdBQUYsRUFDRSxPQURGLEVBRUUsSUFGRixFQUdFLEtBSEYsRUFJRSxLQUpGLEVBS0UsSUFMRixFQU1FLElBTkYsRUFPRSxJQVBGLEVBUUUsR0FSRixFQVNFLElBVEYsRUFVRSxPQVZGLEVBV0UsR0FYRixDQUFBLEdBVzRCLEdBQUcsQ0FBQyxHQVhoQyxFQWZlOzs7Ozs7Ozs7Ozs7OztFQXVDZixDQUFBLENBQUUsaUJBQUYsRUFDRSxrQkFERixDQUFBLEdBQzRCLE9BQUEsQ0FBUSw0REFBUixDQUQ1QixFQXZDZTs7Ozs7O0VBNkNmLElBQUEsR0FBNEIsT0FBQSxDQUFRLFdBQVIsRUE3Q2I7OztFQWlEZixVQUFBLEdBQWEsTUFBQSxRQUFBLENBQUEsQ0FBQTtBQUNiLFFBQUEsQ0FBQSxFQUFBO0lBQUUsQ0FBQSxHQUFJO0lBQ0osa0NBQUE7TUFDRSxDQUFDLENBQUMsSUFBRixDQUFPLEtBQVA7SUFERjtBQUVBLFdBQU8sQ0FBRSxNQUFNLENBQUMsTUFBUCxDQUFjLENBQWQsQ0FBRixDQUFtQixDQUFDLFFBQXBCLENBQTZCLE1BQTdCO0VBSkksRUFqREU7OztFQXdEZixXQUFBLEdBQWMsTUFBQSxRQUFBLENBQUEsQ0FBQTtBQUNkLFFBQUEsQ0FBQSxFQUFBLE9BQUEsRUFBQSxDQUFBLEVBQUEsR0FBQSxFQUFBLEdBQUEsRUFBQTtJQUFFLENBQUEsR0FBSTtBQUlKOzs7O0lBQUEsS0FBQSxxQ0FBQTs7TUFDRSxJQUFZLFVBQVUsQ0FBQyxJQUFYLENBQWdCLE9BQWhCLENBQVo7QUFBQSxpQkFBQTs7TUFDQSxDQUFBLElBQUs7SUFGUDtJQUlBLElBQVksQ0FBQyxDQUFDLE1BQUYsR0FBVyxDQUF2Qjs7QUFBQSxhQUFPLEVBQVA7S0FSRjs7SUFVRSxhQUFBLEdBQWdCLGlCQUFBLENBQUE7QUFDaEIsWUFBTyxhQUFQO0FBQUEsV0FDTyxLQURQO1FBRUksQ0FBQSxHQUFJLE9BQU8sQ0FBQyxJQUFJLFNBQVEsQ0FBQyxJQUFyQixDQUEwQixHQUExQjtBQUREO0FBRFAsV0FHTyxNQUhQO0FBQUEsV0FHZSxNQUhmO0FBQUEsV0FHdUIsUUFIdkI7UUFJSSxDQUFBLEdBQUksQ0FBQSxNQUFNLFVBQUEsQ0FBQSxDQUFOO0FBRGU7QUFIdkI7UUFNSSxJQUFBLENBQUssQ0FBQSxvQ0FBQSxDQUFBLENBQXVDLEdBQUEsQ0FBSSxhQUFKLENBQXZDLENBQUEsQ0FBTDtBQU5KLEtBWEY7O0FBbUJFLFdBQU87RUFwQkssRUF4REM7OztFQStFZixJQUFBLEdBQU8sTUFBQSxRQUFBLENBQUEsQ0FBQTtBQUNQLFFBQUEsS0FBQSxFQUFBLEtBQUEsRUFBQSxVQUFBLEVBQUEsS0FBQTs7SUFDRSxLQUFBLEdBQWMsQ0FBQSxNQUFNLFdBQUEsQ0FBQSxDQUFOO0lBQ2QsVUFBQSxHQUFjLE9BQU8sQ0FBQyxNQUFNLENBQUM7QUFDN0I7TUFDRSxLQUFBLEdBQVEsSUFBSSxDQUFDLEtBQUwsQ0FBVyxLQUFYLEVBQVo7O01BRUksT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFmLENBQXFCLElBQUksQ0FBQyxPQUFMLENBQWEsS0FBYixFQUFvQjtRQUFFLE1BQUEsRUFBUTtNQUFWLENBQXBCLENBQXJCO01BQ0EsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFmLENBQXFCLElBQXJCLEVBSkY7S0FLQSxjQUFBO01BQU07TUFDSixPQUFPLENBQUMsTUFBTSxDQUFDLEtBQWYsQ0FBcUIsS0FBckIsRUFERjs7V0FFQztFQVhJLEVBL0VROzs7Ozs7RUFpR2YsSUFBRyxNQUFBLEtBQVUsT0FBTyxDQUFDLElBQXJCO0lBQWtDLENBQUEsS0FBQSxDQUFBLENBQUEsR0FBQTtNQUNoQyxNQUFNLElBQUEsQ0FBQTthQUNMO0lBRitCLENBQUEsSUFBbEM7O0FBakdlIiwic291cmNlc0NvbnRlbnQiOlsiIyEvYmluL2VudiBub2RlXG5cbid1c2Ugc3RyaWN0J1xuXG4jPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbkdVWSAgICAgICAgICAgICAgICAgICAgICAgPSByZXF1aXJlICdndXknXG57IGFsZXJ0XG4gIGRlYnVnXG4gIGhlbHBcbiAgaW5mb1xuICBwbGFpblxuICBwcmFpc2VcbiAgdXJnZVxuICB3YXJuXG4gIHdoaXNwZXIgfSAgICAgICAgICAgICAgID0gR1VZLnRybS5nZXRfbG9nZ2VycyAnbm9ybWFsaXplLWNsaS1hcmd1bWVudHMnXG57IHJwclxuICBpbnNwZWN0XG4gIGVjaG9cbiAgd2hpdGVcbiAgZ3JlZW5cbiAgYmx1ZVxuICBnb2xkXG4gIGdyZXlcbiAgcmVkXG4gIGJvbGRcbiAgcmV2ZXJzZVxuICBsb2cgICAgIH0gICAgICAgICAgICAgICA9IEdVWS50cm1cbiMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuIyBTRk1PRFVMRVMgICAgICAgICAgICAgICAgID0gcmVxdWlyZSAnYnJpY2FicmFjLXNmbW9kdWxlcydcbiMgeyB0eXBlX29mLCAgICAgICAgICAgICAgfSA9IFNGTU9EVUxFUy51bnN0YWJsZS5yZXF1aXJlX3R5cGVfb2YoKVxuIyB7IEpldHN0cmVhbSxcbiMgICBpbnRlcm5hbHMsICAgICAgICAgICAgfSA9IFNGTU9EVUxFUy5yZXF1aXJlX2pldHN0cmVhbSgpXG4jIHsgR3JhbW1hclxuIyAgIExldmVsXG4jICAgVG9rZW5cbiMgICBMZXhlbWVcbiMgICByeFxuIyAgIGludGVybmFscyAgICAgICAgICAgICB9ID0gcmVxdWlyZSAnaW50ZXJsZXgnXG4jIEZTICAgICAgICAgICAgICAgICAgICAgICAgPSByZXF1aXJlICdmcydcbnsgZ2V0X3R5cGVfb2Zfc3RkaW5cbiAgZ2V0X3R5cGVfb2Zfc3Rkb3V0ICAgIH0gPSByZXF1aXJlICcuLi8uLi9icmljYWJyYWMtc2Ztb2R1bGVzL2xpYi9jbGktZ2V0LXR5cGUtb2Ytc3RkaW4tc3Rkb3V0J1xuIyB7IFBpcGVsaW5lLCAgICAgICAgICAgXFxcbiMgICBBc3luY19waXBlbGluZSwgICAgIFxcXG4jICAgdHJhbnNmb3JtczogVEYgfSAgICA9IHJlcXVpcmUgJ21vb25yaXZlcidcbiMgeyBBc3luY19waXBlbGluZSwgICB9ID0gcmVxdWlyZSAnbW9vbnJpdmVyJ1xudXRpbCAgICAgICAgICAgICAgICAgICAgICA9IHJlcXVpcmUgJ25vZGU6dXRpbCdcblxuXG4jPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbnJlYWRfc3RkaW4gPSAtPlxuICBSID0gW11cbiAgZm9yIGF3YWl0IGNodW5rIGZyb20gcHJvY2Vzcy5zdGRpblxuICAgIFIucHVzaCBjaHVua1xuICByZXR1cm4gKCBCdWZmZXIuY29uY2F0IFIgKS50b1N0cmluZyAndXRmOCdcblxuIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5mZXRjaF9pbnB1dCA9IC0+XG4gIFIgPSAnJ1xuICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICMjIyBUQUlOVCB0aGlzIGlzIHN0b3BnYXAgcmUtaW1wbGVtZW50YXRpb24gb2YgcGhhc2UgMSBhcmd1bWVudCBwYXJzaW5nOyBpbiB0aGUgZnV0dXJlIHRvIGJlIHJlcGxhY2VkXG4gIHdpdGggZnVuY3Rpb25hbGl0eSBvZiBgYW5hbHl6ZS1jbGktYXJndW1lbnRzLXBoYXNlLTFgICMjI1xuICBmb3IgZWxlbWVudCBpbiBwcm9jZXNzLmFyZ3ZbIDIgLi4gXVxuICAgIGNvbnRpbnVlIGlmIC9eWytcXC06XS92LnRlc3QgZWxlbWVudFxuICAgIFIgKz0gZWxlbWVudFxuICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gIHJldHVybiBSIGlmIFIubGVuZ3RoID4gMFxuICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gIHR5cGVfb2Zfc3RkaW4gPSBnZXRfdHlwZV9vZl9zdGRpbigpXG4gIHN3aXRjaCB0eXBlX29mX3N0ZGluXG4gICAgd2hlbiAndHR5J1xuICAgICAgUiA9IHByb2Nlc3MuYXJndlsgMiAuLiBdLmpvaW4gJyAnXG4gICAgd2hlbiAncGlwZScsICdmaWxlJywgJ3NvY2tldCdcbiAgICAgIFIgPSBhd2FpdCByZWFkX3N0ZGluKClcbiAgICBlbHNlXG4gICAgICB3YXJuIFwizqlqc29uaWNrX19fMyB1bmtub3duIHR5cGUgb2YgaW5wdXQ6ICN7cnByIHR5cGVfb2Zfc3RkaW59XCJcbiAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICByZXR1cm4gUlxuXG4jPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmRlbW8gPSAtPlxuICAjIGNvbnNvbGUubG9nIGNkZWZcbiAgaW5wdXQgICAgICAgPSBhd2FpdCBmZXRjaF9pbnB1dCgpXG4gIHVzZV9jb2xvcnMgID0gcHJvY2Vzcy5zdGRvdXQuaXNUVFlcbiAgdHJ5XG4gICAgdmFsdWUgPSBKU09OLnBhcnNlIGlucHV0XG4gICAgIyBwcm9jZXNzLnN0ZG91dC53cml0ZSBKU09OLnN0cmluZ2lmeSB2YWx1ZSwgbnVsbCwgJyAnXG4gICAgcHJvY2Vzcy5zdGRvdXQud3JpdGUgdXRpbC5pbnNwZWN0IHZhbHVlLCB7IGNvbG9yczogdXNlX2NvbG9ycywgfVxuICAgIHByb2Nlc3Muc3Rkb3V0LndyaXRlICdcXG4nXG4gIGNhdGNoIGVycm9yXG4gICAgcHJvY2Vzcy5zdGRvdXQud3JpdGUgaW5wdXRcbiAgO251bGxcblxuXG4jPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiMgbW9kdWxlLmV4cG9ydHMgPSB7IG5mYSwgZ2V0X3NpZ25hdHVyZSwgTm9ybWFsaXplX2Z1bmN0aW9uX2FyZ3VtZW50cywgVGVtcGxhdGUsIGludGVybmFscywgfVxuXG4jPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmlmIG1vZHVsZSBpcyByZXF1aXJlLm1haW4gdGhlbiBkbyA9PlxuICBhd2FpdCBkZW1vKClcbiAgO251bGxcbiJdfQ==
