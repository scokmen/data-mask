const {describe, it} = require('mocha');
const {expect} = require('chai');
const DataMasker = require('../src/data-mask.js');

describe('data mask specs', function () {

  describe('parameter validator method tests', function () {

    it('isValidChar tests', function () {

      const dataMask = new DataMasker();

      expect(dataMask.isValidChar(false)).to.equal(false);
      expect(dataMask.isValidChar(12)).to.equal(false);
      expect(dataMask.isValidChar(null)).to.equal(false);
      expect(dataMask.isValidChar(undefined)).to.equal(false);
      expect(dataMask.isValidChar({})).to.equal(false);
      expect(dataMask.isValidChar([])).to.equal(false);
      expect(dataMask.isValidChar(Infinity)).to.equal(false);
      expect(dataMask.isValidChar('')).to.equal(false);
      expect(dataMask.isValidChar('xy')).to.equal(false);
      expect(dataMask.isValidChar('*')).to.equal(true);
    });

    it('isValidDeliminator tests', function () {

      const dataMask = new DataMasker();

      expect(dataMask.isValidDeliminator(0)).to.equal(false);
      expect(dataMask.isValidDeliminator(null)).to.equal(false);
      expect(dataMask.isValidDeliminator(undefined)).to.equal(false);
      expect(dataMask.isValidDeliminator({})).to.equal(false);
      expect(dataMask.isValidDeliminator('')).to.equal(false);
      expect(dataMask.isValidDeliminator(Infinity)).to.equal(false);
      expect(dataMask.isValidDeliminator([])).to.equal(false);
      expect(dataMask.isValidDeliminator('*')).to.equal(true);
      expect(dataMask.isValidDeliminator('xy')).to.equal(true);
      expect(dataMask.isValidDeliminator(12)).to.equal(true);
    });

    it('isValidCount tests', function () {

      const dataMask = new DataMasker();

      expect(dataMask.isValidCount(null)).to.equal(false);
      expect(dataMask.isValidCount(undefined)).to.equal(false);
      expect(dataMask.isValidCount({})).to.equal(false);
      expect(dataMask.isValidCount('')).to.equal(false);
      expect(dataMask.isValidCount('*')).to.equal(false);
      expect(dataMask.isValidCount(Infinity)).to.equal(false);
      expect(dataMask.isValidCount(-0.02)).to.equal(false);
      expect(dataMask.isValidCount(0)).to.equal(true);
      expect(dataMask.isValidCount(22)).to.equal(true);
      expect(dataMask.isValidCount(0.02)).to.equal(true);
    });

    it('isValidDirection tests', function () {

      const dataMask = new DataMasker();

      expect(dataMask.isValidDirection(null)).to.equal(false);
      expect(dataMask.isValidDirection(undefined)).to.equal(false);
      expect(dataMask.isValidDirection({})).to.equal(false);
      expect(dataMask.isValidDirection('')).to.equal(false);
      expect(dataMask.isValidDirection('*')).to.equal(false);
      expect(dataMask.isValidDirection(Infinity)).to.equal(false);
      expect(dataMask.isValidDirection([])).to.equal(false);
      expect(dataMask.isValidDirection(-2)).to.equal(false);
      expect(dataMask.isValidDirection(0.5)).to.equal(false);
      expect(dataMask.isValidDirection(-1)).to.equal(true);
      expect(dataMask.isValidDirection(0)).to.equal(true);
      expect(dataMask.isValidDirection(1)).to.equal(true);
    });
  });

  describe('mask function tests', function () {

    const beforeMask = function (token) {
      if (token === 'Lorem') {
        return 'LOREM';
      }
      else if (token === 'ipsum') {
        return false;
      }
      return token;
    };

    const afterMask = function (token) {
      if (token === 'fermentu##') {
        return false;
      }
      else if (token && token.length > 0) {
        return token[0];
      }
      return token;
    };

    it('Constructor option tests', function () {

      const options = {
        count: 2,
        deliminator: ' ',
        char: '$',
        direction: 1,
        beforeMask: null,
        afterMask: null
      };

      const specInput = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed fermentum elit sit amet rutrum fermentum.';
      const dataMask = new DataMasker(specInput, options);

      expect(dataMask.mask()).to.equal('$$rem $$sum $$lor $$t $$et, $$nsectetur $$ipiscing $$it. $$d $$rmentum $$it $$t $$et $$trum $$rmentum.');
    });

    it('maskLeft test', function () {

      const specInput = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed fermentum elit sit amet rutrum fermentum.';
      const dataMask = new DataMasker(specInput);

      expect(dataMask.maskLeft(2)).to.equal('**rem **sum **lor **t **et, **nsectetur **ipiscing **it. **d **rmentum **it **t **et **trum **rmentum.');
      expect(dataMask.maskLeft(3)).to.equal('***em ***um ***or *** ***t, ***sectetur ***piscing ***t. *** ***mentum ***t *** ***t ***rum ***mentum.');
      expect(dataMask.maskLeft(4, ' ', '#')).to.equal('####m ####m ####r ### ####, ####ectetur ####iscing ####. ### ####entum #### ### #### ####um ####entum.');
      expect(dataMask.maskLeft(1, 5, '#')).to.equal('#orem#ipsu# dol#r si# ame#, co#sect#tur #dipi#cing#elit# Sed#ferm#ntum#elit#sit #met #utru# fer#entu#.');
      expect(dataMask.maskLeft(2)).to.equal(dataMask.mask(2, ' ', '*', 1));
      expect(dataMask.maskLeft(3)).to.equal(dataMask.mask(3, ' ', '*', 1));
      expect(dataMask.maskLeft(4, ' ', '#')).to.equal(dataMask.mask(4, ' ', '#', 1));
      expect(dataMask.maskLeft(1, 5, '#')).to.equal(dataMask.mask(1, 5, '#', 1));

      expect(DataMasker.maskLeft(specInput, 2)).to.equal('**rem **sum **lor **t **et, **nsectetur **ipiscing **it. **d **rmentum **it **t **et **trum **rmentum.');
      expect(DataMasker.maskLeft(specInput, 3)).to.equal('***em ***um ***or *** ***t, ***sectetur ***piscing ***t. *** ***mentum ***t *** ***t ***rum ***mentum.');
      expect(DataMasker.maskLeft(specInput, 4, ' ', '#')).to.equal('####m ####m ####r ### ####, ####ectetur ####iscing ####. ### ####entum #### ### #### ####um ####entum.');
      expect(DataMasker.maskLeft(specInput, 1, 5, '#')).to.equal('#orem#ipsu# dol#r si# ame#, co#sect#tur #dipi#cing#elit# Sed#ferm#ntum#elit#sit #met #utru# fer#entu#.');
      expect(DataMasker.maskLeft(specInput, 2)).to.equal(DataMasker.mask(specInput, 2, ' ', '*', 1));
      expect(DataMasker.maskLeft(specInput, 3)).to.equal(DataMasker.mask(specInput, 3, ' ', '*', 1));
      expect(DataMasker.maskLeft(specInput, 4, ' ', '#')).to.equal(DataMasker.mask(specInput, 4, ' ', '#', 1));
      expect(DataMasker.maskLeft(specInput, 1, 5, '#')).to.equal(DataMasker.mask(specInput, 1, 5, '#', 1));

      expect(dataMask.maskLeft(2, ' ', '*', beforeMask)).to.equal('**REM ipsum **lor **t **et, **nsectetur **ipiscing **it. **d **rmentum **it **t **et **trum **rmentum.');
      expect(dataMask.maskLeft(2, ' ', '*', null, afterMask)).to.equal('* * * * * * * * * * * * * * *');
      expect(DataMasker.maskLeft(specInput, 2, ' ', '*', beforeMask)).to.equal('**REM ipsum **lor **t **et, **nsectetur **ipiscing **it. **d **rmentum **it **t **et **trum **rmentum.');
      expect(DataMasker.maskLeft(specInput, 2, ' ', '*', null, afterMask)).to.equal('* * * * * * * * * * * * * * *');
      expect(dataMask.maskLeft(2, ' ', '*', beforeMask)).to.equal(dataMask.mask(2, ' ', '*', 1, beforeMask));
      expect(dataMask.maskLeft(2, ' ', '*', null, afterMask)).to.equal(dataMask.mask(2, ' ', '*', 1, null, afterMask));
      expect(DataMasker.maskLeft(specInput, 2, ' ', '*', beforeMask)).to.equal(DataMasker.mask(specInput, 2, ' ', '*', 1, beforeMask));
      expect(DataMasker.maskLeft(specInput, 2, ' ', '*', null, afterMask)).to.equal(DataMasker.mask(specInput, 2, ' ', '*', 1, null, afterMask));
    });

    it('maskRight tests', function () {

      const specInput = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed fermentum elit sit amet rutrum fermentum.';
      const dataMask = new DataMasker(specInput);

      expect(dataMask.maskRight(1)).to.equal('Lore* ipsu* dolo* si* amet* consectetu* adipiscin* elit* Se* fermentu* eli* si* ame* rutru* fermentum*');
      expect(dataMask.maskRight(2, ' ', '#')).to.equal('Lor## ips## dol## s## ame## consectet## adipisci## eli## S## ferment## el## s## am## rutr## fermentu##');
      expect(dataMask.maskRight(2, 8, '#')).to.equal('Lorem ##sum do##r sit ##et, co##ectetu##adipis##ng eli## Sed f##mentum##lit si##amet r##rum fe##entu##');
      expect(dataMask.maskRight(1)).to.equal(dataMask.mask(1, ' ', '*', -1));
      expect(dataMask.maskRight(2, ' ', '#')).to.equal(dataMask.mask(2, ' ', '#', -1));
      expect(dataMask.maskRight(2, 8, '#')).to.equal(dataMask.mask(2, 8, '#', -1));

      expect(DataMasker.maskRight(specInput, 1)).to.equal('Lore* ipsu* dolo* si* amet* consectetu* adipiscin* elit* Se* fermentu* eli* si* ame* rutru* fermentum*');
      expect(DataMasker.maskRight(specInput, 2, ' ', '#')).to.equal('Lor## ips## dol## s## ame## consectet## adipisci## eli## S## ferment## el## s## am## rutr## fermentu##');
      expect(DataMasker.maskRight(specInput, 2, 8, '#')).to.equal('Lorem ##sum do##r sit ##et, co##ectetu##adipis##ng eli## Sed f##mentum##lit si##amet r##rum fe##entu##');
      expect(DataMasker.maskRight(specInput, 1)).to.equal(DataMasker.mask(specInput, 1, ' ', '*', -1));
      expect(DataMasker.maskRight(specInput, 2, ' ', '#')).to.equal(DataMasker.mask(specInput, 2, ' ', '#', -1));
      expect(DataMasker.maskRight(specInput, 2, 8, '#')).to.equal(DataMasker.mask(specInput, 2, 8, '#', -1));

      expect(dataMask.maskRight(1, ' ', '*', beforeMask)).to.equal('LORE* ipsum dolo* si* amet* consectetu* adipiscin* elit* Se* fermentu* eli* si* ame* rutru* fermentum*');
      expect(dataMask.maskRight(2, ' ', '#', null, afterMask)).to.equal('L i d s a c a e S f e s a r ');
      expect(DataMasker.maskRight(specInput, 1, ' ', '*', beforeMask)).to.equal('LORE* ipsum dolo* si* amet* consectetu* adipiscin* elit* Se* fermentu* eli* si* ame* rutru* fermentum*');
      expect(DataMasker.maskRight(specInput, 2, ' ', '#', null, afterMask)).to.equal('L i d s a c a e S f e s a r ');
      expect(dataMask.maskRight(1, ' ', '*', beforeMask)).to.equal(dataMask.mask(1, ' ', '*', -1, beforeMask));
      expect(dataMask.maskRight(2, ' ', '#', null, afterMask)).to.equal(dataMask.mask(2, ' ', '#', -1, null, afterMask));
      expect(DataMasker.maskRight(specInput, 1, ' ', '*', beforeMask)).to.equal(DataMasker.mask(specInput, 1, ' ', '*', -1, beforeMask));
      expect(DataMasker.maskRight(specInput, 2, ' ', '#', null, afterMask)).to.equal(DataMasker.mask(specInput, 2, ' ', '#', -1, null, afterMask));
    });

    it('maskRandom tests', function () {

      const specInput = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed fermentum elit sit amet rutrum fermentum.';
      const dataMask = new DataMasker(specInput);
      const tokenCount = specInput.split(' ').length;

      for (let i = 1; i < 4; i++) {

        const output1 = dataMask.maskRandom(i);
        const output2 = DataMasker.maskRandom(specInput, i);
        const charCount1 = (output1.match(new RegExp('\\*', 'g')) || []).length;
        const charCount2 = (output2.match(new RegExp('\\*', 'g')) || []).length;

        expect(charCount1).to.equal(tokenCount * i);
        expect(charCount2).to.equal(tokenCount * i);
      }
    });
  });
});
