import Ember from 'ember';
import CatalogResource from 'ui/mixins/catalog-resource';


export default Ember.Route.extend(CatalogResource, {

  queryParams: {
    category: {
      refreshModel: true
    },
    catalogId: {
      refreshModel: true
    }
  },

  actions: {
    refresh: function() {
      // Clear the cache so it has to ask the server again
      this.set('cache', null);
      this.refresh();
    },
  },


  deactivate() {
    // Clear the cache when leaving the route so that it will be reloaded when you come back.
    this.set('cache', null);
  },

  beforeModel: function() {
    this._super(...arguments);
    var auth = this.modelFor('authenticated');
    return this.get('projects').checkForWaiting(auth.get('hosts'),auth.get('machines')).then(() => {
      return this.get('store').request({url: `${this.get('app.catalogEndpoint')}/catalogs`}).then((response) => {
        this.set('catalogs', response);
        let ids = this.uniqKeys(response, 'id');
        this.set('uniqueCatalogIds', ids);
      });
    });
  },

  model(params) {
    return this.getCatalogs(params);
  },

  resetController: function (controller, isExiting/*, transition*/) {
    if (isExiting)
    {
      controller.set('category', 'all');
      controller.set('catalogId', 'all');
    }
  }
});
