/**
 * @class Implements Tool window with amenity list.
 */
Application.AmenityManager.ToolWindow = Class.create(Application.ToolWindow, {

    /**
     * @constructor
     * @param {Function} $super Inherited initialize function.
     * @param {Application.AmenityManager} manager
     */
    initialize: function($super, manager) {
        $super($('windowContainer'), {
            title: 'Достопримечательности',
            'class': 'amenityManager'
        });

        /** @private @type Application.AmenityManager */
        this.manager = manager;

        /** @private @type Element */
        this.scrollBox = new Element('div', {
            'class': 'scrollBox'
        });

        /** @private @type Application.AmenityManager.GroupList */
        this.amenityGroupList = new Application.AmenityManager.GroupList(manager);
        this.scrollBox.update(this.amenityGroupList.toElement());

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
        this.amenityGroupList.update(hash);
    }
});