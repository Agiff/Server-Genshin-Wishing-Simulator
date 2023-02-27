const { User, Inventory, Pity, Character, Weapon, Banner } = require('../models');

class GachaController {
  static async startGacha (req, res, next) {
    try {
      const { bannerId } = req.params;

      const currentBanner = await Banner.findByPk(bannerId);
      if (!currentBanner) throw { name: 'NotFound' };

      const currentUser = await User.findByPk(req.user.id, {
        include: [Pity]
      });

      //Increase Pity Count
      if (currentBanner.type === 'limitedChar') {
        currentUser.Pity.charLimitedGoldPity++,
        currentUser.Pity.charLimitedPurplePity++
      } else if (currentBanner.type === 'limitedWeapon') {
        currentUser.Pity.weaponLimitedGoldPity++,
        currentUser.Pity.weaponLimitedPurplePity++
      } else {
        currentUser.Pity.standardGoldPity++,
        currentUser.Pity.standardPurplePity++
      }

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
      if (currentBanner.type === 'limitedChar') {
        await Pity.update({
          charLimitedGoldPity: gotGold ? 0 : currentUser.Pity.charLimitedGoldPity,
          charLimitedPurplePity: gotPurple ? 0 : currentUser.Pity.charLimitedPurplePity
        }, {
          where: { UserId: req.user.id }
        })
      } else if (currentBanner.type === 'limitedWeapon') {
        await Pity.update({
          weaponLimitedGoldPity: gotGold ? 0 : currentUser.Pity.weaponLimitedGoldPity,
          weaponLimitedPurplePity: gotPurple ? 0 : currentUser.Pity.weaponLimitedPurplePity
        }, {
          where: { UserId: req.user.id }
        })
      } else {
        await Pity.update({
          standardGoldPity: gotGold ? 0 : currentUser.Pity.standardGoldPity,
          standardPurplePity: gotPurple ? 0 : currentUser.Pity.standardPurplePity
        }, {
          where: { UserId: req.user.id }
        })
      }
      
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
          if (currentBanner.type === 'limitedChar') {
            message.character = 'You lost fifty-fifty on 4 star character';
            await Pity.update({
              guaranteedPurpleCharacter: true,
            }, {
              where: { UserId: req.user.id }
            })
          }
          if (currentBanner.type === 'limitedWeapon') {
            message.weapon = 'You lost fifty-fifty on 4 star weapon';
            await Pity.update({
              guaranteedPurpleWeapon: true,
            }, {
              where: { UserId: req.user.id }
            })
          }
        } else {
          // TODO: handle weapon banner
          // TODO: handle standard banner
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
          if (currentBanner.type === 'limitedChar') {
            message.character = 'duaaarrr qiqi';
            await Pity.update({
              guaranteedGoldCharacter: true,
            }, {
              where: { UserId: req.user.id }
            })
          }
          if (currentBanner.type === 'limitedWeapon') {
            message.character = 'wgs';
            await Pity.update({
              guaranteedGoldWeapon: true,
            }, {
              where: { UserId: req.user.id }
            })
          }
        } else {
          // TODO: handle weapon banner
          // TODO: handle standard banner
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