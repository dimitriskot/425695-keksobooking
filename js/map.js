'use strict';

(function () {
  var mapPinMain = window.constants.map.querySelector('.map__pin--main');


  // функция активации редактора объявления
  var activateEdit = function () {
    window.constants.map.classList.remove('map--faded');
    window.constants.noticeForm.classList.remove('notice__form--disabled');
    window.pin.createPins(window.data.ads);
    var defaultCoords = {
      x: mapPinMain.offsetTop,
      y: mapPinMain.offsetLeft
    };
    window.form.getFormAddress(defaultCoords);
    mapPinMain.removeEventListener('mouseup', activateEdit);
    mapPinMain.addEventListener('mousedown', dragPinMain);
  };

  // событие активации редактора объявления по клику
  mapPinMain.addEventListener('mouseup', activateEdit);

  // событие активации редактора объявления по нажатию Enter
  mapPinMain.addEventListener('keydown', function (event) {
    if (event.keyCode === window.constants.ENTER_KEYCODE) {
      activateEdit();
    }
  });

  // событие открытия информации об объявлении по клику
  window.constants.map.addEventListener('click', window.openPopup);

  // событие открытия информации об объявлении по нажатию Enter
  window.constants.map.addEventListener('keydown', function (event) {
    if (event.keyCode === window.constants.ENTER_KEYCODE) {
      window.openPopup(event);
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
      if (mapPinMain.offsetTop - shift.y < 125) {
        mapPinMain.style.top = 125 + 'px';
      } else if (mapPinMain.offsetTop - shift.y > 650) {
        mapPinMain.style.top = 650 + 'px';
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
      window.constants.map.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      window.form.getFormAddress(pinCoords);
    };
    window.constants.map.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };
})();
