/* Visitor statistics (GoatCounter). Counts the production domain only, so local previews stay out of the data.
   CODE: the site code chosen at goatcounter.com signup, i.e. https://CODE.goatcounter.com */
(function () {
  'use strict';
  var CODE = 'nexenbridge';
  var HOSTS = ['nexenbridge.com', 'www.nexenbridge.com'];
  if (!CODE || HOSTS.indexOf(location.hostname) === -1) return;
  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://gc.zgo.at/count.js';
  s.setAttribute('data-goatcounter', 'https://' + CODE + '.goatcounter.com/count');
  document.head.appendChild(s);
})();
