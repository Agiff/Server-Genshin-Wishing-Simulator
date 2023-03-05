const axios = require('axios');
const { User, Inventory, Pity, Character, Weapon, Banner } = require('../models');

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

      const result = Math.ceil(Math.random() * rate);

      let gotGold = false;
      let gotPurple = false;

      if (currentUser.Pity.charLimitedPurplePity >= 10) { //Guara at 10 pull
        gotPurple = true;
      } else if (result <= purpleRate) { 
        gotPurple = true;
      }

      if (currentUser.Pity.charLimitedGoldPity >= 76) { //Add chance to 20%
        goldRate = 20000;
      }

      if (currentUser.Pity.charLimitedGoldPity >= 90) { //Guara 5 star at 90
        gotPurple = false;
        gotGold = true;
      } else if (result <= goldRate) {
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

      const message = {
        title: 'You won a 3 star',
        character: '',
        weapon: '',
        goldPity: currentUser.Pity.charLimitedGoldPity,
        purplePity: currentUser.Pity.charLimitedPurplePity,
        guaraCharGold: currentUser.Pity.guaranteedGoldCharacter,
        guaraCharPurple: currentUser.Pity.guaranteedPurpleCharacter,
        rate: goldRate
      };

      if (gotPurple) {
        message.title = 'You won a 4 star';
        const fiftyFifty = Math.ceil(Math.random() * 100);
        if (fiftyFifty > 50 && !currentUser.Pity.guaranteedPurpleCharacter) {
          message.character = 'You lost fifty-fifty on 4 star character';
          await Pity.update({
            guaranteedPurpleCharacter: true,
          }, {
            where: { UserId: req.user.id }
          })
        } else {
          const randomFourStar = Math.ceil(Math.random() * 3);
          if (randomFourStar === 1) message.character = currentBanner.rateUpPurple1;
          if (randomFourStar === 2) message.character = currentBanner.rateUpPurple2;
          if (randomFourStar === 3) message.character = currentBanner.rateUpPurple3;
          await Pity.update({
            guaranteedPurpleCharacter: false,
          }, {
            where: { UserId: req.user.id }
          })
        }
      }

      if (gotGold) {
        message.title = 'You won a 5 star';
        const fiftyFifty = Math.ceil(Math.random() * 100);
        if (fiftyFifty > 50 && !currentUser.Pity.guaranteedGoldCharacter) {
          message.character = 'duaaarrr qiqi';
          await Pity.update({
            guaranteedGoldCharacter: true,
          }, {
            where: { UserId: req.user.id }
          })
        } else {
          message.character = currentBanner.rateUpGold;
          await Pity.update({
            guaranteedGoldCharacter: false,
          }, {
            where: { UserId: req.user.id }
          })
        }
      }

      res.status(200).json({ message, result });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = GachaController;