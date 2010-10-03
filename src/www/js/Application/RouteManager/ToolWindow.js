/**
 * @class Implements Tool window with routes list.
 */
Application.RouteManager.ToolWindow = Class.create(Application.ToolWindow, {

    /**
     * @constructor
     * @param {Function} $super Inherited initialize function.
     * @param {Application.RouteManager} manager
     */
    initialize: function($super, manager) {
        $super($('windowContainer'), {
            title: 'Маршруты',
            'class': 'routeManager'
        });

        /** @private @type Application.AmenityManager */
        this.manager = manager;

        /** @private @type Element */
        this.scrollBox = new Element('div', {
            'class': 'scrollBox'
        });

        /** @private @type Application.AmenityManager.GroupList */
        this.listView = new Application.RouteManager.ListView(manager);
        this.scrollBox.update(this.listView.toElement());

        /** @private @type Element */
        this.form = new Element('form', {
            action:"",
            method: "GET"
        });
        this.form.onsubmit = this.onSubmitForm.bind(this);
        new Form.Observer(this.form, 0.3, this.onFormChanges.bind(this));

        this.form.appendChild(new Element('input', {
            type: 'text',
            name: 'query'
        }));
        this.form.appendChild(new Element('input', {
            type: 'submit',
            value: 'Найти'
        }));

        this.getClientArea().appendChild(this.form);
        this.getClientArea().appendChild(this.scrollBox);
    },

    /** @private @event @type Boolean */
    onSubmitForm: function() {
        this.updateFilter();
        return false;
    },

    /** @private @event @type void */
    onFormChanges: function() {
        this.updateFilter();
    },

    /** @private  @type void */
    updateFilter: function() {
        try {
            var query = $F(this.form['query']);
            this.manager.setFilter(query ? new Application.Amenity.Filter({
                name: query
            }): null);
        } catch (e) {
            console.error(e);
        }
    },

    /** @public
     * @param {Hash} hash
     * @type void
     */
    updateList: function(hash) {
        this.listView.update(hash);
    }
});