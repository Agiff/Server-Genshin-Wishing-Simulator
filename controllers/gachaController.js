const axios = require('axios');
const {
  User, 
  Inventory,
  Pity,
  Character,
  Weapon,
  Banner,
  ThreeStar,
  FourStarCharacter,
  FourStarWeapon,
  FiveStarCharacter,
  FiveStarWeapon
} = require('../models');

class GachaController {
  static async startGachaLimitedCharacter (req, res, next) {
    try {
      const { bannerId } = req.params;

      const currentBanner = await Banner.findByPk(bannerId);
      if (!currentBanner) throw { name: 'NotFound' };

      const currentUser = await User.findByPk(req.user.id, {
        include: [Pity]
      });

      //Increase Pity Count
      currentUser.Pity.charLimitedGoldPity++;
      currentUser.Pity.charLimitedPurplePity++;

      const rate = 100000;
      let goldRate = 600;
      const purpleRate = 5100;

      const RNG = Math.ceil(Math.random() * rate);

      let gotGold = false;
      let gotPurple = false;

      if (currentUser.Pity.charLimitedPurplePity >= 10) { //Guara at 10 pull
        gotPurple = true;
      } else if (RNG <= purpleRate) { 
        gotPurple = true;
      }

      if (currentUser.Pity.charLimitedGoldPity >= 76) { //Add chance to 20%
        goldRate = 20000;
      }

      if (currentUser.Pity.charLimitedGoldPity >= 90) { //Guara 5 star at 90
        gotPurple = false;
        gotGold = true;
      } else if (RNG <= goldRate) {
        gotPurple = false;
        gotGold = true;
      }

      //Update Pity
      await Pity.update({
        charLimitedGoldPity: gotGold ? 0 : currentUser.Pity.charLimitedGoldPity,
        charLimitedPurplePity: gotPurple ? 0 : currentUser.Pity.charLimitedPurplePity
      }, {
        where: { UserId: req.user.id }
      })

      const threeStars = await ThreeStar.findAll();
      const randomIndex = Math.floor(Math.random() * threeStars.length);
      const randomThreeStar = threeStars[randomIndex];
  
      const message = {
        title: 'You won a 3 star',
        result: randomThreeStar.name,
        type: randomThreeStar.type,
        goldPity: currentUser.Pity.charLimitedGoldPity,
        purplePity: currentUser.Pity.charLimitedPurplePity,
        guaraCharGold: currentUser.Pity.guaranteedGoldCharacter,
        guaraCharPurple: currentUser.Pity.guaranteedPurpleCharacter,
        goldRate: goldRate,
        purpleRate: purpleRate
      };

      if (gotPurple) {
        message.title = 'You won a 4 star';
        const fiftyFifty = Math.ceil(Math.random() * 100);
        if (fiftyFifty > 50 && !currentUser.Pity.guaranteedPurpleCharacter) {
          const fourStarCharacters = await FourStarCharacter.findAll({
            where: { available: true }
          })

          const fourStarWeapons = await FourStarWeapon.findAll({
            where: { available: true, limited: false }
          })
  
          const fourStars = [ ...fourStarCharacters, ...fourStarWeapons ];

          let randomFourStar;
          let findFourStar = true;

          while (findFourStar) {
            const randomIndex = Math.floor(Math.random() * fourStars.length);
            randomFourStar = fourStars[randomIndex];
            if (randomFourStar !== currentBanner.rateUpPurple1 && 
              randomFourStar !== currentBanner.rateUpPurple2 &&
              randomFourStar !== currentBanner.rateUpPurple3) {
              findFourStar = false;
            }
          }

          message.result = randomFourStar.name;
          message.type = randomFourStar.type;
          await Pity.update({
            guaranteedPurpleCharacter: true,
          }, {
            where: { UserId: req.user.id }
          })
        } else {
          const randomFourStar = Math.ceil(Math.random() * 3);
          if (randomFourStar === 1) message.result = currentBanner.rateUpPurple1;
          if (randomFourStar === 2) message.result = currentBanner.rateUpPurple2;
          if (randomFourStar === 3) message.result = currentBanner.rateUpPurple3;
          message.type = randomFourStar.type;
          await Pity.update({
            guaranteedPurpleCharacter: false,
          }, {
            where: { UserId: req.user.id }
          })
        }
      }

      // const fiveStarWeapons = await FiveStarWeapon.findAll({
      //   where: { available: true }
      // })

      if (gotGold) {
        message.title = 'You won a 5 star';
        const fiftyFifty = Math.ceil(Math.random() * 100);
        if (fiftyFifty > 50 && !currentUser.Pity.guaranteedGoldCharacter) {
          const fiveStarCharacters = await FiveStarCharacter.findAll({
            where: { available: true, limited: false }
          })

          const randomIndex = Math.floor(Math.random() * fiveStarCharacters.length);
          const randomFiveStarCharacters = fiveStarCharacters[randomIndex];

          message.result = randomFiveStarCharacters.name;
          message.type = randomFiveStarCharacters.type;
          await Pity.update({
            guaranteedGoldCharacter: true,
          }, {
            where: { UserId: req.user.id }
          })
        } else {
          message.result = currentBanner.rateUpGold;
          message.type = 'character';
          await Pity.update({
            guaranteedGoldCharacter: false,
          }, {
            where: { UserId: req.user.id }
          })
        }
      }

      res.status(200).json({ message, RNG });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = GachaController;