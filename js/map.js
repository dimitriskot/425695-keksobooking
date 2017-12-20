'use strict';

(function () {
  var map = document.querySelector('.map');
  var mapPinMain = map.querySelector('.map__pin--main');
  var mapPinSet = map.querySelector('.map__pins');
  var ESC_KEYCODE = 27;
  var ENTER_KEYCODE = 13;

  // создание информации об объявлении
  var createPopup = function (number) {
    window.constantNode.fragment.appendChild(window.card.renderPopup(window.data.ads[number]));
    map.appendChild(window.constantNode.fragment);
    // создание события закрытия окна информации по клику и по нажатию на Enter
    var closePopupButton = map.querySelector('.popup__close');
    closePopupButton.addEventListener('click', closeCurrentAd);
    closePopupButton.addEventListener('keydown', function (evt) {
      if (evt.keyCode === ENTER_KEYCODE) {
        closeCurrentAd(event);
      }
    });
  };

  // создание меток объявлений
  var createPins = function (array) {
    var pins = [];
    for (var i = 0; i < array.length; i++) {
      pins[i] = window.constantNode.fragment.appendChild(window.pin.renderMapPin(window.data.ads[i], i));
    }
    mapPinSet.appendChild(window.constantNode.fragment);
  };

  // функция активации редактора объявления
  var activateEdit = function () {
    map.classList.remove('map--faded');
    window.constantNode.noticeForm.classList.remove('notice__form--disabled');
    createPins(window.data.ads);
    mapPinMain.removeEventListener('mouseup', activateEdit);
    mapPinMain.addEventListener('mousedown', dragPinMain);
  };

  // событие активации редактора объявления по клику
  mapPinMain.addEventListener('mouseup', activateEdit);

  // событие активации редактора объявления по нажатию Enter
  mapPinMain.addEventListener('keydown', function (event) {
    if (event.keyCode === ENTER_KEYCODE) {
      activateEdit();
    }
  });

  // проверка нажатия клавиши Esc
  var checkKey = function (event) {
    if (event.keyCode === ESC_KEYCODE) {
      closeCurrentAd(event);
    }
  };

  // удаление класса ..--active у метки
  var deactivatePin = function () {
    if (document.querySelector('.map__pin--active')) {
      var pinActive = document.querySelector('.map__pin--active');
      pinActive.classList.remove('map__pin--active');
    }
  };

  // удаление информации об объявлении
  var closePopup = function () {
    if (document.querySelector('.map__card')) {
      var mapCard = document.querySelector('.map__card');
      map.removeChild(mapCard);
    }
  };

  // закрытие текущей информации об объявлении
  var closeCurrentAd = function (event) {
    closePopup();
    deactivatePin();
    document.removeEventListener('keydown', checkKey);
    event.stopPropagation();
  };

  // открытие информации об объявлении
  var openPopup = function (event) {
    var target = event.target;
    var pinId;
    document.addEventListener('keydown', checkKey);
    while (target !== map) {
      if (target.className === 'map__pin') {
        closePopup();
        deactivatePin();
        target.classList.add('map__pin--active');
        pinId = target.id.replace('pin-', '');
        createPopup(pinId, event);
        return;
      }
      target = target.parentNode;
    }
  };

  // событие открытия информации об объявлении по клику
  map.addEventListener('click', openPopup);

  // событие открытия информации об объявлении по нажатию Enter
  map.addEventListener('keydown', function (event) {
    if (event.keyCode === ENTER_KEYCODE) {
      openPopup(event);
    }
  });

  var dragPinMain = function (event) {
    event.preventDefault();
    var pinCoords;
    var startCoords = {
      x: event.clientX,
      y: event.clientY
    };
    var onMouseMove = function (moveEvent) {
      moveEvent.preventDefault();
      var shift = {
        x: startCoords.x - moveEvent.clientX,
        y: startCoords.y - moveEvent.clientY
      };
      startCoords = {
        x: moveEvent.clientX,
        y: moveEvent.clientY
      };
      if (mapPinMain.offsetTop - shift.y < 100) {
        mapPinMain.style.top = 100 + 'px';
      } else if (mapPinMain.offsetTop - shift.y > 500) {
        mapPinMain.style.top = 500 + 'px';
      }
      mapPinMain.style.top = (mapPinMain.offsetTop - shift.y) + 'px';
      mapPinMain.style.left = (mapPinMain.offsetLeft - shift.x) + 'px';
      pinCoords = {
        x: mapPinMain.offsetLeft - shift.x,
        y: mapPinMain.offsetTop - shift.y
      };
    };
    var onMouseUp = function (upEvent) {
      upEvent.preventDefault();
      map.removeEventListener('mousemove', onMouseMove);
      map.removeEventListener('mouseup', onMouseUp);
      window.form.getFormAddress(pinCoords);
    };
    map.addEventListener('mousemove', onMouseMove);
    map.addEventListener('mouseup', onMouseUp);
  };
})();
