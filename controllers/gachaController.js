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

      const rate = 100000;
      let goldRate = 600;
      const purpleRate = 5100;

      const result = Math.ceil(Math.random() * rate);
      
      const message = {
        title: 'You won a 3 star',
        goldPity: currentUser.Pity.charLimitedGoldPity,
        purplePity: currentUser.Pity.charLimitedPurplePity,
        rate: goldRate
      };

      let gotGold = false;
      let gotPurple = false;

      if (currentUser.Pity.charLimitedPurplePity >= 10) { //Guara at 10 pull
        message.title = 'You won a 4 star';
        currentUser.Pity.charLimitedPurplePity = 0;
        gotPurple = true;
      } else if (result <= purpleRate) { 
        message.title = 'You won a 4 star';
        currentUser.Pity.charLimitedPurplePity = 0;
        gotPurple = true;
      }

      if (currentUser.Pity.charLimitedGoldPity >= 76) { //Add chance to 20%
        goldRate = 20000;
        message.rate = goldRate;
      }

      if (currentUser.Pity.charLimitedGoldPity >= 90) { //Guara 5 star at 90
        message.title = 'You won a 5 star';
        currentUser.Pity.charLimitedGoldPity = 0;
        gotPurple = false;
        gotGold = true;
      } else if (result <= goldRate) {
        message.title = 'You won a 5 star';
        currentUser.Pity.charLimitedGoldPity = 0;
        gotPurple = false;
        gotGold = true;
      } 

      if (currentBanner.type === 'limitedChar') {
        await Pity.update({
          charLimitedGoldPity: gotGold ? 0 : currentUser.Pity.charLimitedGoldPity + 1,
          charLimitedPurplePity: gotPurple ? 0 : currentUser.Pity.charLimitedPurplePity + 1
        }, {
          where: { UserId: req.user.id }
        })
      } else if (currentBanner.type === 'limitedWeapon') {
        await Pity.update({
          weaponLimitedGoldPity: gotGold ? 0 : currentUser.Pity.weaponLimitedGoldPity + 1,
          weaponLimitedPurplePity: gotPurple ? 0 : currentUser.Pity.weaponLimitedPurplePity + 1
        }, {
          where: { UserId: req.user.id }
        })
      } else {
        await Pity.update({
          standardGoldPity: gotGold ? 0 : currentUser.Pity.standardGoldPity + 1,
          standardPurplePity: gotPurple ? 0 : currentUser.Pity.standardPurplePity + 1
        }, {
          where: { UserId: req.user.id }
        })
      }

      res.status(200).json({ message, result })
    } catch (error) {
      next(error);
    }
  }
}

module.exports = GachaController;