define(['jquery', 'underscore', 'backbone', 'models/user', 'text!templates/com.html'],

	function( $ , _ , Backbone , User, Tpl ){

		var ComView = Backbone.View.extend({

			tagname: 'div',
			className: 'row-fluid profile',
			template: _.template( Tpl ),

			events: {
				'click #com-btn-delete': 'clickCom'
			},

			initialize: function() {
				console.log('initialize');

				this.user = new User();
				//this.user.fetch();

				//this.listenTo(this.model, 'all', this.render);
				this.listenTo(this.model, 'sync', this.findUser);
				this.listenTo(this.user, 'sync', this.render);

				if(!this.model.isNew()) this.findUser();
			},

			findUser: function() {
				console.log('finding user associated with ' + this.model.get('_userId'));
				this.user.set({_id: this.model.get('_userId')});
				this.user.fetch({success: _.bind(function() { this.userFetched = true; }, this)});
			},

			render: function(){
				console.log('rendering');

				if(this.userFetched) {
					console.log('rendering with user' + this.user.get('name'));
					this.$el.html( this.template( _.extend(this.model.toJSON(), {name: this.user.get('name')} ) ));
				}
				else {
					this.$el.html( 'loading comment' );
				}

				return this;
			},

			clickCom: function() {
				Backbone.trigger('com:click', this.model);
			}

		});


		return ComView;
});