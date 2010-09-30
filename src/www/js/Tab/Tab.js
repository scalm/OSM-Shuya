/**
 * @class Tab
 *
 */
Tab.Tab = Class.create({

   /**
    * @constructor
    * @param {String} text
    * @param {Function} handler
    */
   initialize: function(text, handler) {
       /**
        * @private
        * @type String
        */
       this.text = text;
       /**
        * @private
        * @type Function
        */
       this.handler = handler;
   },

   /**
    * @type String
    */
   getText: function() {
       return this.text;
   },

   /**
    * @type Function
    */
   getHandler: function() {
       return this.handler;
   }

});