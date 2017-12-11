'use strict';

var map = document.querySelector('.map');
var mapPinMain = map.querySelector('.map__pin--main');
var noticeForm = document.querySelector('.notice__form');
var similarMapPinElement = map.querySelector('.map__pins');
var similarMapPinTemplate = document.querySelector('template').content.querySelector('.map__pin');
var similarArticleTemplate = document.querySelector('template').content.querySelector('.map__card');
var ads = [];
var adsCount = 8;
var MIN_PRICE = 1000;
var MAX_PRICE = 1000000;
var PIN_HALF_WIDTH = 20;
var PIN_HEIGHT = 62;
var MIN_X = 300 + PIN_HALF_WIDTH;
var MAX_X = 900 - PIN_HALF_WIDTH;
var MIN_Y = 100 + PIN_HEIGHT;
var MAX_Y = 500 - PIN_HEIGHT;
var ESC_KEYCODE = 27;
var ENTER_KEYCODE = 13;

var titles = [
  'Большая уютная квартира',
  'Маленькая неуютная квартира',
  'Огромный прекрасный дворец',
  'Маленький ужасный дворец',
  'Красивый гостевой домик',
  'Некрасивый негостеприимный домик',
  'Уютное бунгало далеко от моря',
  'Неуютное бунгало по колено в воде'
];

var types = [
  'flat',
  'house',
  'bungalo'
];

var dictTypes = {
  flat: 'Квартира',
  house: 'Дом',
  bungalo: 'Бунгало'
};

var checkinTimes = [
  '12:00',
  '13:00',
  '14:00'
];

var checkoutTimes = [
  '12:00',
  '13:00',
  '14:00'
];

var featuresList = [
  'wifi',
  'dishwasher',
  'parking',
  'washer',
  'elevator',
  'conditioner'
];

// получение пути к файлу с аватаркой
var getAvatarPath = function (userNumber) {
  var avatarPath = 'img/avatars/user';
  avatarPath += (userNumber < 10 ? '0' : '') + userNumber + '.png';
  return avatarPath;
};

// получение author.avatar
var getAvatar = function (number) {
  var avatars = [];
  avatars[number] = getAvatarPath(number + 1);
  return avatars[number];
};

// получение ad.author
var getAuthor = function (number) {
  return {
    avatar: getAvatar(number)
  };
};

// получение случайного элемента массива
var getRandomElement = function (array) {
  var randomElement = array[Math.floor(Math.random() * array.length)];
  return randomElement;
};

// получение случайной длины массива характеристик
var getRandomFeaturesLength = function () {
  var randomFeaturesLength = Math.ceil(Math.random() * featuresList.length);
  return randomFeaturesLength;
};

// получение случайного числа
var getRandomNumber = function (count) {
  var number = Math.ceil(Math.random() * count);
  return number;
};

// получение случайного числа из диапазона
var getRandomNumberFromRange = function (min, max) {
  var number = Math.floor(Math.random() * (max - min) + min);
  return number;
};

// получение случайной координаты
var getRandomLocation = function () {
  var randomLocation = {};
  randomLocation.x = getRandomNumberFromRange(MIN_X, MAX_X);
  randomLocation.y = getRandomNumberFromRange(MIN_Y, MAX_Y);
  return randomLocation;
};

// получение offer.title
var getTitle = function (number) {
  var tempTitles = titles.slice();
  function compareRandom() {
    return Math.random() - 0.5;
  }
  tempTitles.sort(compareRandom);
  return tempTitles[number];
};

// получение offer.type
var getType = function () {
  var type = getRandomElement(types);
  return type;
};

// получение offer.features
var getFeatures = function () {
  var features = featuresList.slice();
  function compareRandom() {
    return Math.random() - 0.5;
  }
  features.sort(compareRandom);
  features.length = getRandomFeaturesLength();
  return features;
};

// получение offer
var getOffer = function (number, location) {
  var roomsCount = 5;
  var guestsCount = 10;
  var offer = {};
  offer.title = getTitle(number);
  offer.address = location.x + ', ' + location.y;
  offer.price = getRandomNumberFromRange(MIN_PRICE, MAX_PRICE);
  offer.type = getType();
  offer.rooms = getRandomNumber(roomsCount);
  offer.guests = getRandomNumber(guestsCount);
  offer.checkin = getRandomElement(checkinTimes);
  offer.checkout = getRandomElement(checkoutTimes);
  offer.features = getFeatures();
  offer.description = '';
  offer.photos = [];
  return offer;
};

// создание объявления
var getAd = function (number) {
  var ad = {};
  var tempLocation = getRandomLocation();
  ad.author = getAuthor(number);
  ad.offer = getOffer(number, tempLocation);
  ad.location = tempLocation;
  return ad;
};

// получение массива объявлений
var getAds = function (count) {
  for (var i = 0; i < count; i++) {
    ads[i] = getAd(i, count);
  }
  return ads;
};
getAds(adsCount);

// генерация метки
var renderMapPin = function (ad, number) {
  var mapPinElement = similarMapPinTemplate.cloneNode(true);
  mapPinElement.style.top = ad.location.y + 'px';
  mapPinElement.style.left = ad.location.x + 'px';
  mapPinElement.id = 'pin-' + number;
  mapPinElement.querySelector('img').src = ad.author.avatar;
  return mapPinElement;
};

var fragment = document.createDocumentFragment();

var pins = [];

// генерация меток объявлений
var createPins = function (array) {
  for (var i = 0; i < ads.length; i++) {
    array[i] = fragment.appendChild(renderMapPin(ads[i], i));
    array[i].addEventListener('keydown', function (event) {
      if (event.keyCode === ENTER_KEYCODE) {
        openPopup();
      }
    });
  }
  similarMapPinElement.appendChild(fragment);
};

// очистка features в шаблоне
var features = similarArticleTemplate.querySelector('.popup__features');
while (features.firstChild) {
  features.removeChild(features.firstChild);
}

var renderPopup = function (adNumber) {
  var article = similarArticleTemplate.cloneNode(true);
  article.querySelector('h3').textContent = adNumber.offer.title;
  article.querySelector('small').textContent = adNumber.offer.address;
  article.querySelector('.popup__price').textContent = adNumber.offer.price + String.fromCharCode(8381) + '/ночь';
  article.querySelector('.popup__type').textContent = dictTypes[adNumber.offer.type];
  var typeInfo = adNumber.offer.rooms + ' для ' + adNumber.offer.guests;
  article.querySelector('.popup__type-info').textContent = (adNumber.offer.guests === 1) ? typeInfo + ' гостя' : typeInfo + ' гостей';
  article.querySelector('.popup__check').textContent = 'Заезд после ' + adNumber.offer.checkin + ', выезд до ' + adNumber.offer.checkout;
  for (var j = 0; j < adNumber.offer.features.length; j++) {
    var item = document.createElement('li');
    item.className = 'feature';
    item.classList.add('feature--' + adNumber.offer.features[j]);
    fragment.appendChild(item);
    article.querySelector('.popup__features').appendChild(fragment);
  }
  article.querySelector('.popup__description').textContent = adNumber.offer.description;
  article.querySelector('.popup__avatar').src = adNumber.author.avatar;
  return article;
};

var createPopup = function (number, event) {
  fragment.appendChild(renderPopup(ads[number]));
  map.appendChild(fragment);
  var closePopupButton = map.querySelector('.popup__close');
  closePopupButton.addEventListener('click', closeCurrentAd);
  event.stopPropagation();
  closePopupButton.addEventListener('keydown', function (evt) {
    if (evt.keyCode === ENTER_KEYCODE) {
      closeCurrentAd();
    }
  });
};

var activateEdit = function () {
  map.classList.remove('map--faded');
  noticeForm.classList.remove('notice__form--disabled');
  createPins(pins);
};

mapPinMain.addEventListener('mouseup', activateEdit);

mapPinMain.addEventListener('keydown', function (event) {
  if (event.keyCode === ENTER_KEYCODE) {
    activateEdit();
  }
});

var deactivatePin = function () {
  if (document.querySelector('.map__pin--active')) {
    var pinActive = document.querySelector('.map__pin--active');
    pinActive.classList.remove('map__pin--active');
  }
};

var closePopup = function () {
  if (document.querySelector('.map__card')) {
    var mapCard = document.querySelector('.map__card');
    map.removeChild(mapCard);
  }
};

var checkKey = function (event) {
  if (event.keyCode === ESC_KEYCODE) {
    closeCurrentAd();
  }
};

var closeCurrentAd = function () {
  closePopup();
  deactivatePin();
  document.removeEventListener('keydown', checkKey);
};

var openPopup = function (event) {
  var target = event.target;
  var pinId;
  map.addEventListener('keydown', checkKey);
  while (target !== map) {
    if (target.className === 'map__pin') {
      closeCurrentAd();
      target.classList.add('map__pin--active');
      pinId = target.id.replace('pin-', '');
      createPopup(pinId, event);
      return;
    }
    target = target.parentNode;
  }
};

map.addEventListener('click', openPopup);
