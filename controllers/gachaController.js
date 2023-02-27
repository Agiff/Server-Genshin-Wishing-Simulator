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
        goldPity: currentUser.Pity.charLimitedGoldPity,
        purplePity: currentUser.Pity.charLimitedPurplePity,
        rate: goldRate
      };

      if (gotPurple) {
        message.title = 'You won a 4 star';
      }

      if (gotGold) {
        message.title = 'You won a 5 star';
      }

      res.status(200).json({ message, result });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = GachaController;