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
    var R, type_of_stdin;
    type_of_stdin = get_type_of_stdin();
    switch (type_of_stdin) {
      case 'tty':
        R = process.argv.slice(2).join(' ');
        break;
      case 'pipe':
      case 'file':
        R = (await read_stdin());
        break;
      case 'socket':
        warn(`Ωjsonick___2 type of input not implemented: ${rpr(type_of_stdin)}`);
        break;
      default:
        warn(`Ωjsonick___3 unknown type of input: ${rpr(type_of_stdin)}`);
    }
    return R;
  };

  //===========================================================================================================
  demo = async function() {
    var error, input, use_colors, value;
    // argv        = if argv? then [ argv..., ] else process.argv[ 2 .. ]
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2JlYXV0aWZ5LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBZTtFQUFBO0VBRWY7QUFGZSxNQUFBLEdBQUEsRUFBQSxLQUFBLEVBQUEsSUFBQSxFQUFBLElBQUEsRUFBQSxLQUFBLEVBQUEsSUFBQSxFQUFBLElBQUEsRUFBQSxXQUFBLEVBQUEsaUJBQUEsRUFBQSxrQkFBQSxFQUFBLElBQUEsRUFBQSxLQUFBLEVBQUEsSUFBQSxFQUFBLElBQUEsRUFBQSxJQUFBLEVBQUEsT0FBQSxFQUFBLEdBQUEsRUFBQSxLQUFBLEVBQUEsTUFBQSxFQUFBLFVBQUEsRUFBQSxHQUFBLEVBQUEsT0FBQSxFQUFBLEdBQUEsRUFBQSxJQUFBLEVBQUEsSUFBQSxFQUFBLElBQUEsRUFBQSxPQUFBLEVBQUEsS0FBQTs7O0VBS2YsR0FBQSxHQUE0QixPQUFBLENBQVEsS0FBUjs7RUFDNUIsQ0FBQSxDQUFFLEtBQUYsRUFDRSxLQURGLEVBRUUsSUFGRixFQUdFLElBSEYsRUFJRSxLQUpGLEVBS0UsTUFMRixFQU1FLElBTkYsRUFPRSxJQVBGLEVBUUUsT0FSRixDQUFBLEdBUTRCLEdBQUcsQ0FBQyxHQUFHLENBQUMsV0FBUixDQUFvQix5QkFBcEIsQ0FSNUI7O0VBU0EsQ0FBQSxDQUFFLEdBQUYsRUFDRSxPQURGLEVBRUUsSUFGRixFQUdFLEtBSEYsRUFJRSxLQUpGLEVBS0UsSUFMRixFQU1FLElBTkYsRUFPRSxJQVBGLEVBUUUsR0FSRixFQVNFLElBVEYsRUFVRSxPQVZGLEVBV0UsR0FYRixDQUFBLEdBVzRCLEdBQUcsQ0FBQyxHQVhoQyxFQWZlOzs7Ozs7Ozs7Ozs7OztFQXVDZixDQUFBLENBQUUsaUJBQUYsRUFDRSxrQkFERixDQUFBLEdBQzRCLE9BQUEsQ0FBUSw0REFBUixDQUQ1QixFQXZDZTs7Ozs7O0VBNkNmLElBQUEsR0FBNEIsT0FBQSxDQUFRLFdBQVIsRUE3Q2I7OztFQWlEZixVQUFBLEdBQWEsTUFBQSxRQUFBLENBQUEsQ0FBQTtBQUNiLFFBQUEsQ0FBQSxFQUFBO0lBQUUsQ0FBQSxHQUFJO0lBQ0osa0NBQUE7TUFDRSxDQUFDLENBQUMsSUFBRixDQUFPLEtBQVA7SUFERjtBQUVBLFdBQU8sQ0FBRSxNQUFNLENBQUMsTUFBUCxDQUFjLENBQWQsQ0FBRixDQUFtQixDQUFDLFFBQXBCLENBQTZCLE1BQTdCO0VBSkksRUFqREU7OztFQXdEZixXQUFBLEdBQWMsTUFBQSxRQUFBLENBQUEsQ0FBQTtBQUNkLFFBQUEsQ0FBQSxFQUFBO0lBQUUsYUFBQSxHQUFnQixpQkFBQSxDQUFBO0FBQ2hCLFlBQU8sYUFBUDtBQUFBLFdBQ08sS0FEUDtRQUVJLENBQUEsR0FBSSxPQUFPLENBQUMsSUFBSSxTQUFRLENBQUMsSUFBckIsQ0FBMEIsR0FBMUI7QUFERDtBQURQLFdBR08sTUFIUDtBQUFBLFdBR2UsTUFIZjtRQUlJLENBQUEsR0FBSSxDQUFBLE1BQU0sVUFBQSxDQUFBLENBQU47QUFETztBQUhmLFdBS08sUUFMUDtRQU1JLElBQUEsQ0FBSyxDQUFBLDRDQUFBLENBQUEsQ0FBK0MsR0FBQSxDQUFJLGFBQUosQ0FBL0MsQ0FBQSxDQUFMO0FBREc7QUFMUDtRQVFJLElBQUEsQ0FBSyxDQUFBLG9DQUFBLENBQUEsQ0FBdUMsR0FBQSxDQUFJLGFBQUosQ0FBdkMsQ0FBQSxDQUFMO0FBUko7QUFTQSxXQUFPO0VBWEssRUF4REM7OztFQXNFZixJQUFBLEdBQU8sTUFBQSxRQUFBLENBQUEsQ0FBQTtBQUNQLFFBQUEsS0FBQSxFQUFBLEtBQUEsRUFBQSxVQUFBLEVBQUEsS0FBQTs7O0lBRUUsS0FBQSxHQUFjLENBQUEsTUFBTSxXQUFBLENBQUEsQ0FBTjtJQUNkLFVBQUEsR0FBYyxPQUFPLENBQUMsTUFBTSxDQUFDO0FBQzdCO01BQ0UsS0FBQSxHQUFRLElBQUksQ0FBQyxLQUFMLENBQVcsS0FBWCxFQUFaOztNQUVJLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBZixDQUFxQixJQUFJLENBQUMsT0FBTCxDQUFhLEtBQWIsRUFBb0I7UUFBRSxNQUFBLEVBQVE7TUFBVixDQUFwQixDQUFyQjtNQUNBLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBZixDQUFxQixJQUFyQixFQUpGO0tBS0EsY0FBQTtNQUFNO01BQ0osT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFmLENBQXFCLEtBQXJCLEVBREY7O1dBRUM7RUFaSSxFQXRFUTs7Ozs7O0VBeUZmLElBQUcsTUFBQSxLQUFVLE9BQU8sQ0FBQyxJQUFyQjtJQUFrQyxDQUFBLEtBQUEsQ0FBQSxDQUFBLEdBQUE7TUFDaEMsTUFBTSxJQUFBLENBQUE7YUFDTDtJQUYrQixDQUFBLElBQWxDOztBQXpGZSIsInNvdXJjZXNDb250ZW50IjpbIiMhL2Jpbi9lbnYgbm9kZVxuXG4ndXNlIHN0cmljdCdcblxuIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5HVVkgICAgICAgICAgICAgICAgICAgICAgID0gcmVxdWlyZSAnZ3V5J1xueyBhbGVydFxuICBkZWJ1Z1xuICBoZWxwXG4gIGluZm9cbiAgcGxhaW5cbiAgcHJhaXNlXG4gIHVyZ2VcbiAgd2FyblxuICB3aGlzcGVyIH0gICAgICAgICAgICAgICA9IEdVWS50cm0uZ2V0X2xvZ2dlcnMgJ25vcm1hbGl6ZS1jbGktYXJndW1lbnRzJ1xueyBycHJcbiAgaW5zcGVjdFxuICBlY2hvXG4gIHdoaXRlXG4gIGdyZWVuXG4gIGJsdWVcbiAgZ29sZFxuICBncmV5XG4gIHJlZFxuICBib2xkXG4gIHJldmVyc2VcbiAgbG9nICAgICB9ICAgICAgICAgICAgICAgPSBHVVkudHJtXG4jLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiMgU0ZNT0RVTEVTICAgICAgICAgICAgICAgICA9IHJlcXVpcmUgJ2JyaWNhYnJhYy1zZm1vZHVsZXMnXG4jIHsgdHlwZV9vZiwgICAgICAgICAgICAgIH0gPSBTRk1PRFVMRVMudW5zdGFibGUucmVxdWlyZV90eXBlX29mKClcbiMgeyBKZXRzdHJlYW0sXG4jICAgaW50ZXJuYWxzLCAgICAgICAgICAgIH0gPSBTRk1PRFVMRVMucmVxdWlyZV9qZXRzdHJlYW0oKVxuIyB7IEdyYW1tYXJcbiMgICBMZXZlbFxuIyAgIFRva2VuXG4jICAgTGV4ZW1lXG4jICAgcnhcbiMgICBpbnRlcm5hbHMgICAgICAgICAgICAgfSA9IHJlcXVpcmUgJ2ludGVybGV4J1xuIyBGUyAgICAgICAgICAgICAgICAgICAgICAgID0gcmVxdWlyZSAnZnMnXG57IGdldF90eXBlX29mX3N0ZGluXG4gIGdldF90eXBlX29mX3N0ZG91dCAgICB9ID0gcmVxdWlyZSAnLi4vLi4vYnJpY2FicmFjLXNmbW9kdWxlcy9saWIvY2xpLWdldC10eXBlLW9mLXN0ZGluLXN0ZG91dCdcbiMgeyBQaXBlbGluZSwgICAgICAgICAgIFxcXG4jICAgQXN5bmNfcGlwZWxpbmUsICAgICBcXFxuIyAgIHRyYW5zZm9ybXM6IFRGIH0gICAgPSByZXF1aXJlICdtb29ucml2ZXInXG4jIHsgQXN5bmNfcGlwZWxpbmUsICAgfSA9IHJlcXVpcmUgJ21vb25yaXZlcidcbnV0aWwgICAgICAgICAgICAgICAgICAgICAgPSByZXF1aXJlICdub2RlOnV0aWwnXG5cblxuIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5yZWFkX3N0ZGluID0gLT5cbiAgUiA9IFtdXG4gIGZvciBhd2FpdCBjaHVuayBmcm9tIHByb2Nlc3Muc3RkaW5cbiAgICBSLnB1c2ggY2h1bmtcbiAgcmV0dXJuICggQnVmZmVyLmNvbmNhdCBSICkudG9TdHJpbmcgJ3V0ZjgnXG5cbiMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuZmV0Y2hfaW5wdXQgPSAtPlxuICB0eXBlX29mX3N0ZGluID0gZ2V0X3R5cGVfb2Zfc3RkaW4oKVxuICBzd2l0Y2ggdHlwZV9vZl9zdGRpblxuICAgIHdoZW4gJ3R0eSdcbiAgICAgIFIgPSBwcm9jZXNzLmFyZ3ZbIDIgLi4gXS5qb2luICcgJ1xuICAgIHdoZW4gJ3BpcGUnLCAnZmlsZSdcbiAgICAgIFIgPSBhd2FpdCByZWFkX3N0ZGluKClcbiAgICB3aGVuICdzb2NrZXQnXG4gICAgICB3YXJuIFwizqlqc29uaWNrX19fMiB0eXBlIG9mIGlucHV0IG5vdCBpbXBsZW1lbnRlZDogI3tycHIgdHlwZV9vZl9zdGRpbn1cIlxuICAgIGVsc2VcbiAgICAgIHdhcm4gXCLOqWpzb25pY2tfX18zIHVua25vd24gdHlwZSBvZiBpbnB1dDogI3tycHIgdHlwZV9vZl9zdGRpbn1cIlxuICByZXR1cm4gUlxuXG4jPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmRlbW8gPSAtPlxuICAjIGFyZ3YgICAgICAgID0gaWYgYXJndj8gdGhlbiBbIGFyZ3YuLi4sIF0gZWxzZSBwcm9jZXNzLmFyZ3ZbIDIgLi4gXVxuICAjIGNvbnNvbGUubG9nIGNkZWZcbiAgaW5wdXQgICAgICAgPSBhd2FpdCBmZXRjaF9pbnB1dCgpXG4gIHVzZV9jb2xvcnMgID0gcHJvY2Vzcy5zdGRvdXQuaXNUVFlcbiAgdHJ5XG4gICAgdmFsdWUgPSBKU09OLnBhcnNlIGlucHV0XG4gICAgIyBwcm9jZXNzLnN0ZG91dC53cml0ZSBKU09OLnN0cmluZ2lmeSB2YWx1ZSwgbnVsbCwgJyAnXG4gICAgcHJvY2Vzcy5zdGRvdXQud3JpdGUgdXRpbC5pbnNwZWN0IHZhbHVlLCB7IGNvbG9yczogdXNlX2NvbG9ycywgfVxuICAgIHByb2Nlc3Muc3Rkb3V0LndyaXRlICdcXG4nXG4gIGNhdGNoIGVycm9yXG4gICAgcHJvY2Vzcy5zdGRvdXQud3JpdGUgaW5wdXRcbiAgO251bGxcblxuXG4jPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiMgbW9kdWxlLmV4cG9ydHMgPSB7IG5mYSwgZ2V0X3NpZ25hdHVyZSwgTm9ybWFsaXplX2Z1bmN0aW9uX2FyZ3VtZW50cywgVGVtcGxhdGUsIGludGVybmFscywgfVxuXG4jPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmlmIG1vZHVsZSBpcyByZXF1aXJlLm1haW4gdGhlbiBkbyA9PlxuICBhd2FpdCBkZW1vKClcbiAgO251bGxcbiJdfQ==
