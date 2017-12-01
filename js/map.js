'use strict';

var map = document.querySelector('.map');
map.classList.remove('map--faded');
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
  var avatarPath = '';
  avatarPath = userNumber < 10 ? 'img/avatars/user0' + userNumber + '.png' : 'img/avatars/user' + userNumber + '.png';
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

// получение массива случайных координат
var getLocations = function (count) {
  var locations = [];
  var location;
  for (var i = 0; locations.length < count; i++) {
    location = getRandomLocation();
    locations[i] = location;
  }
  return locations;
};

// вызов массива случайных координат
var tempLocations = getLocations(adsCount);

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
var getOffer = function (number) {
  var roomsCount = 5;
  var guestsCount = 10;
  var offer = {};
  offer.title = getTitle(number);
  offer.address = String(tempLocations[number].x) + ', ' + String(tempLocations[number].y);
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
  ad.author = getAuthor(number);
  ad.offer = getOffer(number);
  ad.location = tempLocations[number];
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

var renderMapPin = function (ad) {
  var mapPinElement = similarMapPinTemplate.cloneNode(true);
  mapPinElement.style.top = ad.location.y + 'px';
  mapPinElement.style.left = ad.location.x + 'px';
  mapPinElement.querySelector('img').src = ad.author.avatar;
  return mapPinElement;
};

var fragment = document.createDocumentFragment();
for (var i = 0; i < ads.length; i++) {
  fragment.appendChild(renderMapPin(ads[i]));
}

similarMapPinElement.appendChild(fragment);

var popup = similarArticleTemplate.querySelector('.popup__features');
while (popup.firstChild) {
  popup.removeChild(popup.firstChild);
}

var renderArticle = function (adNumber) {
  var article = similarArticleTemplate.cloneNode(true);
  article.querySelector('h3').textContent = adNumber.offer.title;
  article.querySelector('small').textContent = adNumber.offer.address;
  article.querySelector('.popup__price').textContent = adNumber.offer.price + String.fromCharCode(8381) + '/ночь';
  if (adNumber.offer.type === 'flat') {
    article.querySelector('h4').textContent = 'Квартира';
  } else if (adNumber.offer.type === 'house') {
    article.querySelector('h4').textContent = 'Дом';
  } else {
    article.querySelector('h4').textContent = 'Бунгало';
  }
  article.querySelector('h4 + p').textContent = adNumber.offer.rooms + ' для ' + adNumber.offer.guests + ' гостей';
  article.querySelector('h4 + p + p').textContent = 'Заезд после ' + adNumber.offer.checkin + ', выезд до ' + adNumber.offer.checkout;
  for (var j = 0; j < adNumber.offer.features.length; j++) {
    var item = document.createElement('li');
    item.className = 'feature';
    item.classList.add('feature--' + adNumber.offer.features[j]);
    fragment.appendChild(item);
    article.querySelector('.popup__features').appendChild(fragment);
  }
  article.querySelector('.popup__features + p').textContent = adNumber.offer.description;
  article.querySelector('.popup__avatar').src = adNumber.author.avatar;
  return article;
};

fragment.appendChild(renderArticle(ads[0]));
map.appendChild(fragment);
