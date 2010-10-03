/** @class
 * @extends EventSupport
 * Singleton
 */
Tab = {

    /**
     * Tab list
     * @private
     * @type Tab.Tab[]
     */
    tabs: $A(),

    /**
     * @private
     * @type Object
     */
    events: {
        /**
         * @type Function[]
         */
        onAdd: $A(),

        /**
         * @type Function[]
         */
        onUnselect: $A(),

        /**
         * @type Function[]
         */
        onSelect: $A()
    },

    /**
     * Add tab
     * @public
     * @param {Tab.Tab} tab
     */
    add: function(tab) {
        this.tabs.push(tab);
        this.fire('onAdd', tab);
    },

    /**
     * @public
     * @type Tab.Tab[]
     */
    getTabs: function() {
        return this.tabs;
    },

    /**
     * @private
     * @type Tab.Tab
     */
    selectedTab: null,

    /**
     * @public
     * @type Tab.Tab tab
     */
    fireClick: function(tab) {
        if (this.selectedTab && this.selectedTab != tab) {
            this.fire('onUnselect', this.selectedTab);
            var handler = this.selectedTab.getHandler();
            if (handler) handler(this.selectedTab, false);
            this.selectedTab = null;
        }
        if (tab) {
            this.fire('onSelect', tab);
            var handler2 = tab.getHandler();
            if (handler2) handler2(tab, true);
            this.selectedTab = tab;
        }
    }
};

Object.extend(Tab, EventSupport);