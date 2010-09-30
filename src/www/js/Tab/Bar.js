/**
 * @class Tab bar
 * @implements EventSupport
 */
Tab.Bar = Class.create({

    /**
     * @constructor
     * @param {Element} element
     */
    initialize: function(element) {
        /**
         * @private
         * @type Element
         */
        this.element = element;
        element.addClassName('tabBar');
        Tab.getTabs().each(function(tab) {this.add(tab);}, this);
        var ev = {
           onAdd: this.onAdd.bind(this),
           onSelect: this.onSelect.bind(this),
           onUnselect: this.onUnselect.bind(this)
        }
        Tab.observe(ev);
    },

    /**
     * Add tab to this bar
     *
     * @param {Tab.Tab} tab
     * @type void
     */
    add: function(tab) {
        var li = new Element('li');
        var a = new Element('a', {href: '#'}).update(tab.getText());
        a.observe('click', this.onClick.bind(this, tab));
        li.appendChild(a);
        this.element.appendChild(li);
    },

    /**
     * Get element assigned to tab.
     *
     * @public
     * @param {Tab.Tab} tab
     * @type Element
     */
    getElementByTab: function(tab) {
        var f = this.element.select("li a").find( function(n) {
            return (n.firstChild.nodeValue == tab.getText());
        });
        return f && f.parentNode ? f.parentNode : undefined;
    },

    /**
     * @event @private
     * @param {Tab} manager
     * @param {Tab.Tab} tab
     */
    onAdd: function(manager, tab) {
        this.add(tab);
    },

    /**
     * @event @private
     * @param {Tab} manager
     * @param {Tab.Tab} tab
     */
    onSelect: function(manager, tab) {
        var li = this.getElementByTab(tab);
        if (li) {
            li.addClassName('active');
        } else {
            console.warn('Tab not found', tab);
        }
    },

    /**
     * @event @private
     * @param {Tab} manager
     * @param {Tab.Tab} tab
     */
    onUnselect: function(manager, tab) {
        var li = this.getElementByTab(tab);
        if (li) {
            li.removeClassName('active');
        } else {
            console.warn('Tab not found', tab);
        }
    },

    /**
     * @event @private
     * @param {Tab.Tab} tab
     * @param {Event} event
     * @type Boolean
     */
    onClick: function(tab, event) {
        Tab.fireClick(tab);
        return false;
    }

});
