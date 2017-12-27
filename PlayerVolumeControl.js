define(function(require) {

	var $ = require('jquery'),
		i18n = require('i18n'),
		templates = require('templates'),
		App = require('core/App'),
		Marionette = require('marionette');

	return Marionette.Behavior.extend({
		defaults: {
			isVolumeChanging: false,
			totalHeight: 165, // see less file
			defOvalTop: 10
		},
		onChangeVolume: function(ev) {
			this.defaults.isVolumeChanging = true;
		},
		onVolumeMove: function(ev) {
			if (this.defaults.isVolumeChanging && this.view.ui.volumeOval.get) {
				var percent = this._getNewP(ev);
				this.onMoveOvalAndBg(percent);

				var againstPercent = 1 - percent;
				App.player.volume(againstPercent);
				this.view.model.set('volume', againstPercent);
			}
		},
		onVolumeFixedChange: function(ev) {
			this.onChangeVolume(ev);
			this.onVolumeMove(ev);
			this.onVolumeUp(ev);
		},
		_getNewP: function(ev) {
			var offsetTopFromShadow = this.view.ui.volumeShadow.offset().top,
				diffTop = ev.pageY - offsetTopFromShadow,
				newPercent = Math.max(0, Math.min(1.0, diffTop / this.defaults.totalHeight));

			return newPercent;
		},
		onMoveOvalAndBg: function(newPercent) {
			var newTop = newPercent * this.defaults.totalHeight,
				ovalTop = newTop + this.defaults.defOvalTop;
			this.view.ui.volumeOval.css({ 'top' : ovalTop + 'px' });
			this.view.ui.volumeShadow.height(newTop);
		},
		onVolumeUp: function(ev) {
			this.defaults.isVolumeChanging = false;
		}
	});
});
