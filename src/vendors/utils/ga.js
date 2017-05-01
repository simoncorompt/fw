/**
 * GA
 */

var GA = {
    event: function(category, action, label, value) {
        ga('send', 'event', category, action, label, value);
    },

    pageView: function(url) {
        ga('send', 'pageview', {
            page: '/'+url

        });
    },

    timeTrack: function(category, timingVar, value) {
        ga('send', 'timing', category, timingVar, value);
    }
};

export default GA;