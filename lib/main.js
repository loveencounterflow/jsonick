(function() {
  'use strict';
  ({});

  //===========================================================================================================
  // #===========================================================================================================
  // GUY                       = require 'guy'
  // { alert
  //   debug
  //   help
  //   info
  //   plain
  //   praise
  //   urge
  //   warn
  //   whisper }               = GUY.trm.get_loggers 'normalize-cli-arguments'
  // { rpr
  //   inspect
  //   echo
  //   white
  //   green
  //   blue
  //   gold
  //   grey
  //   red
  //   bold
  //   reverse
  //   log     }               = GUY.trm
  // #-----------------------------------------------------------------------------------------------------------
  // # SFMODULES                 = require 'bricabrac-sfmodules'
  // # { type_of,              } = SFMODULES.unstable.require_type_of()
  // # { Jetstream,
  // #   internals,            } = SFMODULES.require_jetstream()
  // { Grammar
  //   Level
  //   Token
  //   Lexeme
  //   rx
  //   internals             } = require 'interlex'
  // FS                        = require 'fs'
  module.exports = {nfa, get_signature, Normalize_function_arguments, Template, internals};

  //===========================================================================================================
// if module is require.main then do =>
//   # demo()
//   ;null

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL21haW4uY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBO0VBQUE7RUFzQ0EsQ0FBQSxDQUFBLENBQUEsRUF0Q0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0VBMENBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLENBQUUsR0FBRixFQUFPLGFBQVAsRUFBc0IsNEJBQXRCLEVBQW9ELFFBQXBELEVBQThELFNBQTlEOztFQTFDakI7Ozs7QUFBQSIsInNvdXJjZXNDb250ZW50IjpbIlxuJ3VzZSBzdHJpY3QnXG5cbiMgIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4jIEdVWSAgICAgICAgICAgICAgICAgICAgICAgPSByZXF1aXJlICdndXknXG4jIHsgYWxlcnRcbiMgICBkZWJ1Z1xuIyAgIGhlbHBcbiMgICBpbmZvXG4jICAgcGxhaW5cbiMgICBwcmFpc2VcbiMgICB1cmdlXG4jICAgd2FyblxuIyAgIHdoaXNwZXIgfSAgICAgICAgICAgICAgID0gR1VZLnRybS5nZXRfbG9nZ2VycyAnbm9ybWFsaXplLWNsaS1hcmd1bWVudHMnXG4jIHsgcnByXG4jICAgaW5zcGVjdFxuIyAgIGVjaG9cbiMgICB3aGl0ZVxuIyAgIGdyZWVuXG4jICAgYmx1ZVxuIyAgIGdvbGRcbiMgICBncmV5XG4jICAgcmVkXG4jICAgYm9sZFxuIyAgIHJldmVyc2VcbiMgICBsb2cgICAgIH0gICAgICAgICAgICAgICA9IEdVWS50cm1cbiMgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4jICMgU0ZNT0RVTEVTICAgICAgICAgICAgICAgICA9IHJlcXVpcmUgJ2JyaWNhYnJhYy1zZm1vZHVsZXMnXG4jICMgeyB0eXBlX29mLCAgICAgICAgICAgICAgfSA9IFNGTU9EVUxFUy51bnN0YWJsZS5yZXF1aXJlX3R5cGVfb2YoKVxuIyAjIHsgSmV0c3RyZWFtLFxuIyAjICAgaW50ZXJuYWxzLCAgICAgICAgICAgIH0gPSBTRk1PRFVMRVMucmVxdWlyZV9qZXRzdHJlYW0oKVxuIyB7IEdyYW1tYXJcbiMgICBMZXZlbFxuIyAgIFRva2VuXG4jICAgTGV4ZW1lXG4jICAgcnhcbiMgICBpbnRlcm5hbHMgICAgICAgICAgICAgfSA9IHJlcXVpcmUgJ2ludGVybGV4J1xuIyBGUyAgICAgICAgICAgICAgICAgICAgICAgID0gcmVxdWlyZSAnZnMnXG5cbnt9XG5cblxuIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5tb2R1bGUuZXhwb3J0cyA9IHsgbmZhLCBnZXRfc2lnbmF0dXJlLCBOb3JtYWxpemVfZnVuY3Rpb25fYXJndW1lbnRzLCBUZW1wbGF0ZSwgaW50ZXJuYWxzLCB9XG5cbiM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuIyBpZiBtb2R1bGUgaXMgcmVxdWlyZS5tYWluIHRoZW4gZG8gPT5cbiMgICAjIGRlbW8oKVxuIyAgIDtudWxsXG4iXX0=
