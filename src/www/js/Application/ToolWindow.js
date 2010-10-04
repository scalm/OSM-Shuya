/**
 * @class Tool window
 * @inherits EventSupport
 */
Application.ToolWindow = Class.create({

    /**
    * @constructor
    * @param {Element, String} container Container
    */
    initialize: function(container, options) {
        options = options || {};
        /**
        * @type Element
        */
        this.container = container;
        /**
        * @type Element
        */
        this.element = new Element('div');
        this.element.addClassName('toolWindow');
        options['class'] && this.element.addClassName(options['class']);
        this.element.hide();
        var titleElement = new Element('div', {
            'class': 'title'
        });
        var a = new Element('a', {
            href: '#'
        });
        a.observe('click', this.onCloseClick.bind(this));
        a.setStyle({
            'float': 'right'
        });
        var imgClose = new Element('img', {
            src: 'img/close.gif',
            alt: 'Закрыть',
            title: 'Закрыть'
        })
        imgClose.setStyle({
            border: 'none'
        });
        a.appendChild(imgClose);
        titleElement.appendChild(a);

        var titleText = new Element('div').update(options.title);
        titleElement.appendChild(titleText);

        this.element.appendChild(titleElement);

        /**
         * @type Element
         */
        this.clientArea = new Element('div', {
            'class': 'clientArea'
        });
        this.element.appendChild(this.clientArea);

        this.container.appendChild(this.element);

        this.events = {
            onClose: $A(),
            onOpen: $A()
        };

        if (options.events) this.observe(options.events);
    },

    /**
    * @public
    * @type Element
    */
    getElement: function() {
        return this.element;
    },

    /**
    * @public
    * @type Element
    */
    getClientArea: function() {
        return this.clientArea;
    },

    /**
    * @private @event
    * @type Boolean
    */
    onCloseClick: function(event) {
        this.hide();
        event.stop();
    },

    /**
    * @public
    * @type void
    */
    show: function() {
        this.visible(true);
    },

    /**
    * @public
    * @type void
    */
    hide: function() {
        this.visible(false);
    },

    /**
    * @public
    * @param {Boolean} [show]
    * @type Boolean
    */
    visible: function(show) {
        if (show === undefined) {
            return this.element.visible();
        }
        if (this.element.visible() !=show) {
            show ? this.element.show() : this.element.hide();
            this.fire(show ? 'onOpen' : 'onClose');
        }
        return show;
    },

    /**
    * @public
    * @type void
    */
    toggle: function() {
        this.visible(!this.element.visible());
    }
}, EventSupport);