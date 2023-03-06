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
      if (!currentUser) throw { name: 'NotFound' };

      const currentInventory = await Inventory.findOne({
        where: { UserId: currentUser.id },
        include: [Character]
      })
      if (!currentInventory) throw { name: 'NotFound' };

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
        where: { UserId: currentUser.id }
      })

      const threeStars = await ThreeStar.findAll();
      const randomIndex = Math.floor(Math.random() * threeStars.length);
      const randomThreeStar = threeStars[randomIndex];
  
      const message = {
        title: 'Blue Star',
        result: randomThreeStar.name,
        starglitter: 0,
        type: randomThreeStar.type,
        goldPity: currentUser.Pity.charLimitedGoldPity,
        purplePity: currentUser.Pity.charLimitedPurplePity,
        guaraCharGold: currentUser.Pity.guaranteedGoldCharacter,
        guaraCharPurple: currentUser.Pity.guaranteedPurpleCharacter,
        goldRate: goldRate,
        purpleRate: purpleRate
      };

      let ownChar = false;

      if (gotPurple) {
        message.title = 'Purple Star';
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
          ownChar = currentInventory.Characters.find(el => el.name === message.result);
          await Pity.update({
            guaranteedPurpleCharacter: true,
          }, {
            where: { UserId: currentUser.id }
          })
        } else {
          const randomFourStar = Math.ceil(Math.random() * 3);
          if (randomFourStar === 1) message.result = currentBanner.rateUpPurple1;
          if (randomFourStar === 2) message.result = currentBanner.rateUpPurple2;
          if (randomFourStar === 3) message.result = currentBanner.rateUpPurple3;
          message.type = 'character';
          ownChar = currentInventory.Characters.find(el => el.name === message.result);
          await Pity.update({
            guaranteedPurpleCharacter: false,
          }, {
            where: { UserId: currentUser.id }
          })
        }
      }

      // const fiveStarWeapons = await FiveStarWeapon.findAll({
      //   where: { available: true }
      // })

      if (gotGold) {
        message.title = 'Gold Star';
        const fiftyFifty = Math.ceil(Math.random() * 100);
        if (fiftyFifty > 50 && !currentUser.Pity.guaranteedGoldCharacter) {
          const fiveStarCharacters = await FiveStarCharacter.findAll({
            where: { available: true, limited: false }
          })

          const randomIndex = Math.floor(Math.random() * fiveStarCharacters.length);
          const randomFiveStarCharacters = fiveStarCharacters[randomIndex];

          message.result = randomFiveStarCharacters.name;
          message.type = randomFiveStarCharacters.type;
          ownChar = currentInventory.Characters.find(el => el.name === message.result);
          await Pity.update({
            guaranteedGoldCharacter: true,
          }, {
            where: { UserId: currentUser.id }
          })
        } else {
          message.result = currentBanner.rateUpGold;
          message.type = 'character';
          ownChar = currentInventory.Characters.find(el => el.name === message.result);
          await Pity.update({
            guaranteedGoldCharacter: false,
          }, {
            where: { UserId: currentUser.id }
          })
        }
      }

      // Save to inventory
      if (message.type === 'character') {
        if (!ownChar) {
          await Character.create({ name: message.result, InventoryId: currentInventory.id, constellation: 0 });
          if (message.title === 'Purple Star') {
            await Inventory.update({
              starglitter: currentInventory.starglitter + 2,
            }, {
              where: { UserId: currentUser.id }
            })
            message.starglitter = 2;
          } else if (message.title === 'Gold Star') {
            await Inventory.update({
              starglitter: currentInventory.starglitter + 5,
            }, {
              where: { UserId: currentUser.id }
            })
            message.starglitter = 5;
          }
        } else {
          const currentChar = currentInventory.Characters.find(el => el.name === message.result);
          if (currentChar.constellation >= 6) {
            if (message.title === 'Purple Star') {
              await Inventory.update({
                starglitter: currentInventory.starglitter + 5,
              }, {
                where: { UserId: currentUser.id }
              })
              message.starglitter = 5;
            } else if (message.title === 'Gold Star') {
              await Inventory.update({
                starglitter: currentInventory.starglitter + 25,
              }, {
                where: { UserId: currentUser.id }
              })
              message.starglitter = 25;
            }
          } else {
            await Character.update({ constellation: currentChar.constellation + 1 }, { where: { name: currentChar.name, InventoryId: currentInventory.id } });
            if (message.title === 'Purple Star') {
              await Inventory.update({
                starglitter: currentInventory.starglitter + 2,
              }, {
                where: { UserId: currentUser.id }
              })
              message.starglitter = 2;
            } else if (message.title === 'Gold Star') {
              await Inventory.update({
                starglitter: currentInventory.starglitter + 5,
              }, {
                where: { UserId: currentUser.id }
              })
              message.starglitter = 5;
            }
          }
        }
      } else {
        await Weapon.create({ name: message.result, InventoryId: currentInventory.id })
        if (message.title === 'Purple Star') {
          await Inventory.update({
            starglitter: currentInventory.starglitter + 2,
          }, {
            where: { UserId: currentUser.id }
          })
          message.starglitter = 2;
        }
      }

      res.status(200).json({ message, RNG });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = GachaController;