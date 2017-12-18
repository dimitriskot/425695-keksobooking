'use strict';

(function () {
  var mapPinMain = window.util.map.querySelector('.map__pin--main');
  var ESC_KEYCODE = 27;
  var ENTER_KEYCODE = 13;

  // создание информации об объявлении
  var createPopup = function (number) {
    window.util.fragment.appendChild(window.card.renderPopup(window.data.ads[number]));
    window.util.map.appendChild(window.util.fragment);
    // создание события закрытия окна информации по клику и по нажатию на Enter
    var closePopupButton = window.util.map.querySelector('.popup__close');
    closePopupButton.addEventListener('click', closeCurrentAd);
    closePopupButton.addEventListener('keydown', function (evt) {
      if (evt.keyCode === ENTER_KEYCODE) {
        closeCurrentAd(event);
      }
    });
  };

  // функция активации редактора объявления
  var activateEdit = function () {
    window.util.map.classList.remove('map--faded');
    window.util.noticeForm.classList.remove('notice__form--disabled');
    window.pin.createPins(window.data.ads);
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
      window.util.map.removeChild(mapCard);
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
    while (target !== window.util.map) {
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
  window.util.map.addEventListener('click', openPopup);

  // событие открытия информации об объявлении по нажатию Enter
  window.util.map.addEventListener('keydown', function (event) {
    if (event.keyCode === ENTER_KEYCODE) {
      openPopup(event);
    }
  });

  var dragPinMain = function (event) {
    event.preventDefault();
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
      mapPinMain.style.top = (mapPinMain.offsetTop - shift.y) + 'px';
      mapPinMain.style.left = (mapPinMain.offsetLeft - shift.x) + 'px';
    };
    var onMouseUp = function (upEvent) {
      upEvent.preventDefault();
      window.util.map.removeEventListener('mousemove', onMouseMove);
      window.util.map.removeEventListener('mouseup', onMouseUp);
      window.form.getFormAddress(startCoords);
    };
    window.util.map.addEventListener('mousemove', onMouseMove);
    window.util.map.addEventListener('mouseup', onMouseUp);
  };
})();
