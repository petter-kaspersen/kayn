(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define('kindred-api', ['module', 'request', 'chalk'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, require('request'), require('chalk'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, global.request, global.chalk);
    global.kindredApi = mod.exports;
  }
})(this, function (module, request, chalk) {
  'use strict';

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var platformIds = {
    BRAZIL: 'BR1',
    EUROPE: 'EUN1',
    EUROPE_WEST: 'EUW1',
    KOREA: 'KR',
    LATIN_AMERICA_NORTH: 'LA1',
    LATIN_AMERICA_SOUTH: 'LA2',
    NORTH_AMERICA: 'NA1',
    OCEANIA: 'OC1',
    RUSSIA: 'RU',
    TURKEY: 'TR1',
    JAPAN: 'JP1'
  };

  var regions = {
    BRAZIL: 'br',
    EUROPE: 'eune',
    EUROPE_WEST: 'euw',
    KOREA: 'kr',
    LATIN_AMERICA_NORTH: 'lan',
    LATIN_AMERICA_SOUTH: 'las',
    NORTH_AMERICA: 'na',
    OCEANIA: 'oce',
    RUSSIA: 'ru',
    TURKEY: 'tr',
    JAPAN: 'jp'
  };

  var regions$1 = {
    br: 'BRAZIL',
    eune: 'EUROPE',
    euw: 'EUROPE_WEST',
    kr: 'KOREA',
    lan: 'LATIN_AMERICA_NORTH',
    las: 'LATIN_AMERICA_SOUTH',
    na: 'NORTH_AMERICA',
    oce: 'OCEANIA',
    ru: 'RUSSIA',
    tr: 'TURKEY',
    jp: 'JAPAN'
  };

  var versions = {
    'CHAMPION': 1.2,
    'CURRENT_GAME': 1.0,
    'FEATURED_GAMES': 1.0,
    'GAME': 1.3,
    'LEAGUE': 2.5,
    'STATIC_DATA': 1.2,
    'STATUS': 1.0,
    'MATCH': 2.2,
    'MATCH_LIST': 2.2,
    'RUNES_MASTERIES': 1.4,
    'STATS': 1.3,
    'SUMMONER': 1.4
  };

  var checkAllHelpers = {
    int: function int(arr) {
      return arr.every(function (i) {
        return Number.isInteger(i);
      });
    },
    string: function string(arr) {
      return arr.every(function (i) {
        return typeof i === 'string';
      });
    }
  };

  var checkAll = {
    int: function int(arr) {
      return arr && Array.isArray(arr) && checkAllHelpers.int(arr) && arr.length > 0;
    },
    string: function string(arr) {
      return arr && Array.isArray(arr) && checkAllHelpers.string(arr) && arr.length > 0;
    }
  };

  var Kindred$1 = function () {
    function Kindred$1(key) {
      var defaultRegion = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : regions.NORTH_AMERICA;

      _classCallCheck(this, Kindred$1);

      this.key = key;
      this.defaultRegion = defaultRegion;
    }

    _createClass(Kindred$1, [{
      key: '_sanitizeName',
      value: function _sanitizeName(name) {
        return name.replace(/\s/g, '').toLowerCase();
      }
    }, {
      key: '_makeUrl',
      value: function _makeUrl(url, region, staticReq, observerMode) {
        var mid = staticReq ? '' : region + '/';
        var spectate = observerMode ? '' : 'api/lol/' + mid;
        return 'https://' + region + '.api.riotgames.com/' + spectate + url + '?api_key=' + this.key;
      }
    }, {
      key: '_urlHandler',
      value: function _urlHandler(_ref) {
        var region = _ref.region,
            names = _ref.names,
            name = _ref.name,
            ids = _ref.ids,
            id = _ref.id,
            _ref$options = _ref.options,
            options = _ref$options === undefined ? {} : _ref$options,
            endpoints = _ref.endpoints;

        if (checkAll.string(names)) {
          return this._leagueRequest({});
        } else if (typeof names === 'string') {} else if (checkAll.int(ids)) {} else if (Number.isInteger(ids)) {} else {}
      }
    }, {
      key: '_baseRequest',
      value: function _baseRequest(_ref2, cb) {
        var url = _ref2.url,
            _ref2$region = _ref2.region,
            region = _ref2$region === undefined ? this.defaultRegion : _ref2$region,
            _ref2$observerMode = _ref2.observerMode,
            observerMode = _ref2$observerMode === undefined ? false : _ref2$observerMode,
            _ref2$staticReq = _ref2.staticReq,
            staticReq = _ref2$staticReq === undefined ? false : _ref2$staticReq,
            _ref2$options = _ref2.options,
            options = _ref2$options === undefined ? {} : _ref2$options;

        var proxy = staticReq ? 'global' : region;
        var reqUrl = this._makeUrl(url, proxy, staticReq, observerMode);
        console.log(reqUrl);
        if (!cb) console.log(chalk.red('error: No callback passed in for the method call regarding `' + chalk.yellow(reqUrl) + '`'));

        request({ url: reqUrl, qs: options }, function (error, response, body) {
          var statusMessage = void 0;
          var statusCode = response.statusCode;


          if (statusCode >= 200 && statusCode < 300) {
            statusMessage = chalk.green(statusCode);
          } else if (statusCode >= 400 && statusCode < 500) {
            statusMessage = chalk.red(statusCode);
          } else if (statusCode >= 500) {
            statusMessage = chalk.bold.red(statusCode);
          }

          console.log('status code:', response && statusMessage);

          if (error) return cb(error);else return cb(error, JSON.parse(body));
        });
      }
    }, {
      key: '_observerRequest',
      value: function _observerRequest(_ref3, cb) {
        var endUrl = _ref3.endUrl,
            region = _ref3.region;

        return this._baseRequest({
          url: 'observer-mode/rest/' + endUrl,
          observerMode: true,
          region: region
        }, cb);
      }
    }, {
      key: '_currentGameRequest',
      value: function _currentGameRequest(_ref4, cb) {
        var endUrl = _ref4.endUrl,
            region = _ref4.region,
            platformId = _ref4.platformId;

        return this._observerRequest({
          endUrl: 'consumer/getSpectatorGameInfo/' + platformId + '/' + endUrl,
          region: region
        }, cb);
      }
    }, {
      key: '_staticRequest',
      value: function _staticRequest(_ref5, cb) {
        var endUrl = _ref5.endUrl,
            _ref5$region = _ref5.region,
            region = _ref5$region === undefined ? this.defaultRegion : _ref5$region,
            options = _ref5.options;

        return this._baseRequest({
          url: 'static-data/' + region + '/v' + versions.STATIC_DATA + '/' + endUrl,
          staticReq: true,
          region: region,
          options: options
        }, cb);
      }
    }, {
      key: '_leagueRequest',
      value: function _leagueRequest(_ref6, cb) {
        var endUrl = _ref6.endUrl,
            region = _ref6.region,
            options = _ref6.options;

        return this._baseRequest({
          url: 'v' + versions.LEAGUE + '/league/' + endUrl, region: region, options: options
        }, cb);
      }
    }, {
      key: '_summonerRequest',
      value: function _summonerRequest(_ref7, cb) {
        var endUrl = _ref7.endUrl,
            region = _ref7.region;

        return this._baseRequest({
          url: 'v' + versions.SUMMONER + '/summoner/' + endUrl, region: region
        }, cb);
      }
    }, {
      key: '_matchListRequest',
      value: function _matchListRequest(_ref8, cb) {
        var endUrl = _ref8.endUrl,
            region = _ref8.region,
            options = _ref8.options;

        return this._baseRequest({
          url: 'v' + versions.MATCH_LIST + '/matchlist/by-summoner/' + endUrl, region: region, options: options
        }, cb);
      }
    }, {
      key: '_statsRequest',
      value: function _statsRequest(_ref9, cb) {
        var endUrl = _ref9.endUrl,
            region = _ref9.region;

        return this._baseRequest({
          url: 'v' + versions.STATS + '/stats/by-summoner/' + endUrl, region: region
        }, cb);
      }
    }, {
      key: '_logError',
      value: function _logError(message, expected) {
        console.log(chalk.bold.yellow(message), chalk.red('request'), chalk.bold.red('FAILED') + chalk.red('; ' + expected));
      }
    }, {
      key: 'getCurrentGame',
      value: function getCurrentGame() {
        var _ref10 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            _ref10$region = _ref10.region,
            region = _ref10$region === undefined ? this.defaultRegion : _ref10$region,
            id = _ref10.id;

        var cb = arguments[1];

        if (!id || !Number.isInteger(id)) return this._logError(this.getCurrentGame.name, 'required params ' + chalk.yellow('`id` (int)') + ' not passed in');
        var platformId = platformIds[regions$1[region]];
        return this._currentGameRequest({ endUrl: '' + id, platformId: platformId, region: region }, cb);
      }
    }, {
      key: 'getFeaturedGames',
      value: function getFeaturedGames() {
        var _ref11 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref11.region;

        var cb = arguments[1];

        return this._observerRequest({
          endUrl: 'featured',
          region: region
        }, cb = region ? cb : arguments[0]);
      }
    }, {
      key: 'getLeagues',
      value: function getLeagues() {
        var _ref12 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref12.region,
            ids = _ref12.ids;

        var cb = arguments[1];

        if (checkAll.int(ids)) {
          return this._leagueRequest({ endUrl: 'by-summoner/' + ids.join(','), region: region }, cb);
        } else if (Number.isInteger(ids)) {
          return this._leagueRequest({ endUrl: 'by-summoner/' + ids, region: region }, cb);
        } else {
          this._logError(this.getLeagues.name, 'ids can be either an array of integers or a single integer');
        }
      }
    }, {
      key: 'getLeagueEntries',
      value: function getLeagueEntries() {
        var _ref13 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref13.region,
            ids = _ref13.ids;

        var cb = arguments[1];

        if (checkAll.int(ids)) {
          return this._leagueRequest({ endUrl: 'by-summoner/' + ids.join(',') + '/entry', region: region }, cb);
        } else if (Number.isInteger(ids)) {
          return this._leagueRequest({ endUrl: 'by-summoner/' + ids + '/entry', region: region }, cb);
        } else {
          this._logError(this.getLeagues.name, 'ids can be either an array of integers or a single integer');
        }
      }
    }, {
      key: 'getChallengers',
      value: function getChallengers() {
        var _ref14 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref14.region,
            _ref14$options = _ref14.options,
            options = _ref14$options === undefined ? { type: 'RANKED_SOLO_5x5' } : _ref14$options;

        var cb = arguments[1];

        return this._leagueRequest({
          endUrl: 'challenger', region: region, options: options
        }, cb = region ? cb : arguments[0]);
      }
    }, {
      key: 'getMasters',
      value: function getMasters() {
        var _ref15 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref15.region,
            _ref15$options = _ref15.options,
            options = _ref15$options === undefined ? { type: 'RANKED_SOLO_5x5' } : _ref15$options;

        var cb = arguments[1];

        return this._leagueRequest({
          endUrl: 'master', region: region, options: options
        }, cb);
      }
    }, {
      key: 'getSummoners',
      value: function getSummoners() {
        var _this = this;

        var _ref16 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref16.region,
            names = _ref16.names,
            ids = _ref16.ids;

        var cb = arguments[1];

        if (checkAll.string(names)) {
          return this._summonerRequest({
            endUrl: 'by-name/' + names.map(function (name) {
              return _this._sanitizeName(name);
            }).join(','),
            region: region
          }, cb);
        } else if (typeof names === 'string') {
          return this._summonerRequest({
            endUrl: 'by-name/' + names,
            region: region
          }, cb);
        } else if (checkAll.int(ids)) {
          return this._summonerRequest({
            endUrl: '' + ids.join(','),
            region: region
          }, cb);
        } else if (Number.isInteger(ids)) {
          return this._summonerRequest({
            endUrl: '' + ids,
            region: region
          }, cb);
        } else {
          this._logError(this.getSummoners.name, !names && !ids ? 'required parameters not passed' : ids ? 'ids can be either an array of integers or a single integer' : 'names can be either an array of strings or a single string');
        }
      }
    }, {
      key: 'getSummoner',
      value: function getSummoner() {
        var _ref17 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref17.region,
            name = _ref17.name,
            id = _ref17.id;

        var cb = arguments[1];

        if (typeof name === 'string') return this.getSummoners({ region: region, names: [name] }, cb);
        if (Number.isInteger(id)) return this.getSummoners({ region: region, ids: [id] }, cb);
        return this._logError(this.getSummoner.name, 'required parameters ' + chalk.yellow('`name` (string)') + ' or ' + chalk.yellow('`id` (int)') + ' not passed in');
      }
    }, {
      key: 'getNames',
      value: function getNames() {
        var _ref18 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref18.region,
            ids = _ref18.ids;

        var cb = arguments[1];

        if (Array.isArray(ids) && ids.length > 0) {
          return this._summonerRequest({
            endUrl: ids.join(',') + '/name',
            region: region
          }, cb);
        } else if (Number.isInteger(ids)) {
          return this._summonerRequest({
            endUrl: ids + '/name',
            region: region
          }, cb);
        } else {
          this._logError(this.getNames.name, 'ids can be either an array or a single integer');
        }
      }
    }, {
      key: 'getRankedStats',
      value: function getRankedStats() {
        var _ref19 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref19.region,
            id = _ref19.id,
            options = _ref19.options;

        var cb = arguments[1];

        if (!id || !Number.isInteger(id)) return this._logError(this.getRankedStats.name, 'required params ' + chalk.yellow('`id` (int)') + ' not passed in');
        return this._statsRequest({ endUrl: id + '/ranked', region: region, options: options }, cb);
      }
    }, {
      key: 'getMatchList',
      value: function getMatchList() {
        var _ref20 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref20.region,
            id = _ref20.id,
            _ref20$options = _ref20.options,
            options = _ref20$options === undefined ? { type: 'RANKED_SOLO_5x5' } : _ref20$options;

        var cb = arguments[1];

        if (!id || !Number.isInteger(id)) return this._logError(this.getMatchList.name, 'required params ' + chalk.yellow('`id` (int)') + ' not passed in');
        return this._matchListRequest({ endUrl: '' + id, region: region, options: options }, cb);
      }
    }, {
      key: 'getChampionList',
      value: function getChampionList() {
        var _ref21 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref21.region,
            options = _ref21.options;

        var cb = arguments[1];

        return this._staticRequest({ endUrl: 'champion', region: region, options: options }, cb = region || options ? cb : arguments[0]);
      }
    }, {
      key: 'getChampion',
      value: function getChampion() {
        var _ref22 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref22.region,
            id = _ref22.id,
            options = _ref22.options;

        var cb = arguments[1];

        if (!id || !Number.isInteger(id)) return this._logError(this.getChampion.name, 'required params ' + chalk.yellow('`id` (int)') + ' not passed in');
        return this._staticRequest({ endUrl: 'champion/' + id, region: region, options: options }, cb);
      }
    }, {
      key: 'getItems',
      value: function getItems() {
        var _ref23 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref23.region,
            options = _ref23.options;

        var cb = arguments[1];

        return this._staticRequest({ endUrl: 'item', region: region, options: options }, cb = region || options ? cb : arguments[0]);
      }
    }, {
      key: 'getItem',
      value: function getItem() {
        var _ref24 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref24.region,
            id = _ref24.id,
            options = _ref24.options;

        var cb = arguments[1];

        if (!id || !Number.isInteger(id)) return this._logError(this.getItem.name, 'required params ' + chalk.yellow('`id` (int)') + ' not passed in');
        return this._staticRequest({ endUrl: 'item/' + id, region: region, options: options }, cb);
      }
    }, {
      key: 'getLanguageStrings',
      value: function getLanguageStrings() {
        var _ref25 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref25.region,
            options = _ref25.options;

        var cb = arguments[1];

        return this._staticRequest({ endUrl: 'language-strings', region: region, options: options }, cb = region ? cb : arguments[0]);
      }
    }, {
      key: 'getLanguages',
      value: function getLanguages() {
        var _ref26 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref26.region;

        var cb = arguments[1];

        return this._staticRequest({ endUrl: 'languages', region: region }, cb = region ? cb : arguments[0]);
      }
    }, {
      key: 'getMap',
      value: function getMap() {
        var _ref27 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref27.region,
            options = _ref27.options;

        var cb = arguments[1];

        return this._staticRequest({ endUrl: 'map', region: region, options: options }, cb = region || options ? cb : arguments[0]);
      }
    }, {
      key: 'getMasteryList',
      value: function getMasteryList() {
        var _ref28 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref28.region,
            options = _ref28.options;

        var cb = arguments[1];

        return this._staticRequest({ endUrl: 'mastery', region: region, options: options }, cb = region || options ? cb : arguments[0]);
      }
    }, {
      key: 'getMastery',
      value: function getMastery() {
        var _ref29 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref29.region,
            id = _ref29.id,
            options = _ref29.options;

        var cb = arguments[1];

        if (!id || !Number.isInteger(id)) return this._logError(this.getMastery.name, 'required params ' + chalk.yellow('`id` (int)') + ' not passed in');
        return this._staticRequest({ endUrl: 'mastery/' + id, region: region, options: options }, cb);
      }
    }, {
      key: 'getRealm',
      value: function getRealm() {
        var _ref30 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref30.region;

        var cb = arguments[1];

        return this._staticRequest({ endUrl: 'realm', region: region }, cb = region ? cb : arguments[0]);
      }
    }, {
      key: 'getRuneList',
      value: function getRuneList() {
        var _ref31 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref31.region,
            options = _ref31.options;

        var cb = arguments[1];

        return this._staticRequest({ endUrl: 'rune', region: region, options: options }, cb = region || options ? cb : arguments[0]);
      }
    }, {
      key: 'getRune',
      value: function getRune() {
        var _ref32 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref32.region,
            id = _ref32.id,
            options = _ref32.options;

        var cb = arguments[1];

        if (!id || !Number.isInteger(id)) return this._logError(this.getRune.name, 'required params ' + chalk.yellow('`id` (int)') + ' not passed in');
        return this._staticRequest({ endUrl: 'rune/' + id, region: region, options: options }, cb);
      }
    }, {
      key: 'getSummonerSpellsList',
      value: function getSummonerSpellsList() {
        var _ref33 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref33.region,
            options = _ref33.options;

        var cb = arguments[1];

        return this._staticRequest({ endUrl: 'summoner-spell', region: region, options: options }, cb = region || options ? cb : arguments[0]);
      }
    }, {
      key: 'getSummonerSpell',
      value: function getSummonerSpell() {
        var _ref34 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref34.region,
            id = _ref34.id,
            options = _ref34.options;

        var cb = arguments[1];

        if (!id || !Number.isInteger(id)) return this._logError(this.getSummonerSpell.name, 'required params ' + chalk.yellow('`id` (int)') + ' not passed in');
        return this._staticRequest({ endUrl: 'summoner-spell/${id}', region: region, options: options }, cb);
      }
    }, {
      key: 'getVersions',
      value: function getVersions() {
        var _ref35 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            region = _ref35.region,
            options = _ref35.options;

        var cb = arguments[1];

        return this._staticRequest({ endUrl: 'versions', region: region, options: options }, cb = region || options ? cb : arguments[0]);
      }
    }]);

    return Kindred$1;
  }();

  module.exports = Kindred$1;
});