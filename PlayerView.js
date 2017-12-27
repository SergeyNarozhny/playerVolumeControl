define(function(require) {

    var $ = require('jquery'),
        Marionette = require('marionette'),
        App = require('core/App'),
        PlayerVolumeControl = require('./PlayerVolumeControl');

    return Marionette.ItemView.extend({

        className: 'player__wrapper',

        events: {
            'click .volume_up': 'toggleVolume'
        },

        ui: {
            volumeContainer: '.volume__container',
            volumeOval: '.volume__oval',
            volumeBg: '.volume__bg',
            volumeShadow: '.volume__shadow'
        },

        behaviors: {
            PlayerVolumeControl: {
                behaviorClass: PlayerVolumeControl
            }
        },

        onDestroy: function() {
            $(document).off('mousemove', this._onVolumeMove);
            $(document).off('mouseup', this._onVolumeUp);

            this.ui.volumeOval.off('mousedown', this._onVolumeDown);
            this.ui.volumeShadow.off('click', this._onVolumeClick);
            this.ui.volumeBg.off('click', this._onVolumeClick);
        },

        onRender: function() {
            this._onVolumeDown = this.triggerMethod.bind(this, 'ChangeVolume');
            this._onVolumeMove = this.triggerMethod.bind(this, 'VolumeMove');
            this._onVolumeUp = this.triggerMethod.bind(this, 'VolumeUp');
            this._onVolumeClick = this.triggerMethod.bind(this, 'VolumeFixedChange');

            var delegatedSelector = this.ui.volumeContainer.selector || this.ui.volumeContainer;
            $(document).on('mousemove', delegatedSelector, this._onVolumeMove);
            $(document).on('mouseup', delegatedSelector, this._onVolumeUp);

            this.ui.volumeOval.on('mousedown', this._onVolumeDown);
            this.ui.volumeShadow.on('click', this._onVolumeClick);
            this.ui.volumeBg.on('click', this._onVolumeClick);

            this.triggerMethod('MoveOvalAndBg', 1 - this.model.get('volume'));
        },

        toggleVolume: function() {
            this.ui.volumeContainer.toggle();
        }
    });
});
