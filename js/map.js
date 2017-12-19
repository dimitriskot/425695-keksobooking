'use strict';

var map = document.querySelector('.map');
var mapPinMain = map.querySelector('.map__pin--main');
var noticeForm = document.querySelector('.notice__form');
var mapPinSet = map.querySelector('.map__pins');
var mapPinTemplate = document.querySelector('template').content.querySelector('.map__pin');
var articleTemplate = document.querySelector('template').content.querySelector('.map__card');
var fragment = document.createDocumentFragment();
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
  var adsArray = [];
  for (var i = 0; i < count; i++) {
    adsArray[i] = getAd(i, count);
  }
  return adsArray;
};

// создание массива объявлений
var ads = getAds(adsCount);

// генерация метки
var renderMapPin = function (ad, number) {
  var mapPinElement = mapPinTemplate.cloneNode(true);
  mapPinElement.style.top = ad.location.y + 'px';
  mapPinElement.style.left = ad.location.x + 'px';
  mapPinElement.id = 'pin-' + number;
  mapPinElement.querySelector('img').src = ad.author.avatar;
  return mapPinElement;
};

// очистка features в шаблоне
var clearFeatures = function () {
  var features = articleTemplate.querySelector('.popup__features');
  while (features.firstChild) {
    features.removeChild(features.firstChild);
  }
};

// генерация информации об объявлении
var renderPopup = function (adNumber) {
  var article = articleTemplate.cloneNode(true);
  article.querySelector('h3').textContent = adNumber.offer.title;
  article.querySelector('small').textContent = adNumber.offer.address;
  article.querySelector('.popup__price').textContent = adNumber.offer.price + String.fromCharCode(8381) + '/ночь';
  article.querySelector('.popup__type').textContent = dictTypes[adNumber.offer.type];
  var typeInfo = adNumber.offer.rooms + ' для ' + adNumber.offer.guests;
  article.querySelector('.popup__type-info').textContent = (adNumber.offer.guests === 1) ? typeInfo + ' гостя' : typeInfo + ' гостей';
  article.querySelector('.popup__check').textContent = 'Заезд после ' + adNumber.offer.checkin + ', выезд до ' + adNumber.offer.checkout;
  clearFeatures();
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

// создание информации об объявлении
var createPopup = function (number) {
  fragment.appendChild(renderPopup(ads[number]));
  map.appendChild(fragment);
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
    pins[i] = fragment.appendChild(renderMapPin(ads[i], i));
  }
  mapPinSet.appendChild(fragment);
};

// функция активации редактора объявления
var activateEdit = function () {
  map.classList.remove('map--faded');
  noticeForm.classList.remove('notice__form--disabled');
  createPins(ads);
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

var timeIn = noticeForm.querySelector('#timein');
var timeOut = noticeForm.querySelector('#timeout');

// синхронизация времён заезда/выезда
var timeInSync = function () {
  var firstTimes = timeIn.children;
  var secondTimes = timeOut.children;
  for (var i = 0; i < firstTimes.length; i++) {
    if (firstTimes[i].selected) {
      timeOut.value = secondTimes[i].value;
    }
  }
};

// синхронизация времён заезда/выезда
var timeOutSync = function () {
  var firstTimes = timeIn.children;
  var secondTimes = timeOut.children;
  for (var i = 0; i < secondTimes.length; i++) {
    if (secondTimes[i].selected) {
      timeIn.value = firstTimes[i].value;
    }
  }
};

timeIn.addEventListener('change', timeInSync);
timeOut.addEventListener('change', timeOutSync);

var type = noticeForm.querySelector('#type');
var price = noticeForm.querySelector('#price');

var minPricesForType = [
  '1000',
  '0',
  '5000',
  '10000'
];

// синхронизация типа жилья с минимальной ценой
var typeSync = function () {
  var formTypes = type.children;
  for (var i = 0; i < formTypes.length; i++) {
    if (formTypes[i].selected) {
      price.min = minPricesForType[i];
      price.placeholder = price.min;
    }
  }
};

type.addEventListener('change', typeSync);

var roomNumber = noticeForm.querySelector('#room_number');
var capacity = noticeForm.querySelector('#capacity');

var roomCapacity = {
  '1': ['для 1 гостя'],
  '2': ['для 1 гостя', 'для 2 гостей'],
  '3': ['для 1 гостя', 'для 2 гостей', 'для 3 гостей'],
  '100': ['не для гостей']
};

// очистка capacity
var clearCapacity = function () {
  while (capacity.firstChild) {
    capacity.removeChild(capacity.firstChild);
  }
};

// генерация значения для capacity
var renderCapacity = function (value) {
  for (var i = 0; i < roomCapacity[value].length; i++) {
    var capacityItem = document.createElement('option');
    capacityItem.textContent = roomCapacity[value][i];
    capacity.appendChild(capacityItem);
  }
};

// синхронизация количества комнат с количеством гостей
var getCapcities = function () {
  var roomNumbers = roomNumber.children;
  clearCapacity();
  for (var i = 0; i < roomNumbers.length; i++) {
    if (roomNumbers[i].selected) {
      renderCapacity(roomNumber.value);
    }
  }
};

roomNumber.addEventListener('change', getCapcities);
