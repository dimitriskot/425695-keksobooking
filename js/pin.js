'use strict';

(function () {
  var mapPinTemplate = document.querySelector('template').content.querySelector('.map__pin');

  // генерация метки
  var renderMapPin = function (ad, number) {
    var mapPinElement = mapPinTemplate.cloneNode(true);
    mapPinElement.style.top = ad.location.y + 'px';
    mapPinElement.style.left = ad.location.x + 'px';
    mapPinElement.id = 'pin-' + number;
    mapPinElement.querySelector('img').src = ad.author.avatar;
    return mapPinElement;
  };

  window.pin = {
    renderMapPin: renderMapPin
  };
})();
