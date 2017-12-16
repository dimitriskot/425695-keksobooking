'use strict';

var map = document.querySelector('.map');
var noticeForm = document.querySelector('.notice__form');
var mapPinMain = map.querySelector('.map__pin--main');
var mapPinSet = map.querySelector('.map__pins');
var ESC_KEYCODE = 27;
var ENTER_KEYCODE = 13;

// создание информации об объявлении
var createPopup = function (number) {
  window.util.fragment.appendChild(window.card.renderPopup(window.data.ads[number]));
  map.appendChild(window.util.fragment);
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
    pins[i] = window.util.fragment.appendChild(window.pin.renderMapPin(window.data.ads[i], i));
  }
  mapPinSet.appendChild(window.util.fragment);
};

// функция активации редактора объявления
var activateEdit = function () {
  map.classList.remove('map--faded');
  noticeForm.classList.remove('notice__form--disabled');
  createPins(window.data.ads);
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
