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
        currentUser.Pity.charLimitedPurplePity--;
        gotPurple = false;
        gotGold = true;
      } else if (RNG <= goldRate) {
        currentUser.Pity.charLimitedPurplePity--;
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
  
      const result = {
        title: 'Blue Star',
        obtained: randomThreeStar.name,
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
        result.title = 'Purple Star';
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

          result.obtained = randomFourStar.name;
          result.type = randomFourStar.type;
          ownChar = currentInventory.Characters.find(el => el.name === result.obtained);
          await Pity.update({
            guaranteedPurpleCharacter: true,
          }, {
            where: { UserId: currentUser.id }
          })
        } else {
          const randomFourStar = Math.ceil(Math.random() * 3);
          if (randomFourStar === 1) result.obtained = currentBanner.rateUpPurple1;
          if (randomFourStar === 2) result.obtained = currentBanner.rateUpPurple2;
          if (randomFourStar === 3) result.obtained = currentBanner.rateUpPurple3;
          result.type = 'character';
          ownChar = currentInventory.Characters.find(el => el.name === result.obtained);
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
        result.title = 'Gold Star';
        const fiftyFifty = Math.ceil(Math.random() * 100);
        if (fiftyFifty > 50 && !currentUser.Pity.guaranteedGoldCharacter) {
          const fiveStarCharacters = await FiveStarCharacter.findAll({
            where: { available: true, limited: false }
          })

          const randomIndex = Math.floor(Math.random() * fiveStarCharacters.length);
          const randomFiveStarCharacters = fiveStarCharacters[randomIndex];

          result.obtained = randomFiveStarCharacters.name;
          result.type = randomFiveStarCharacters.type;
          ownChar = currentInventory.Characters.find(el => el.name === result.obtained);
          await Pity.update({
            guaranteedGoldCharacter: true,
          }, {
            where: { UserId: currentUser.id }
          })
        } else {
          result.obtained = currentBanner.rateUpGold;
          result.type = 'character';
          ownChar = currentInventory.Characters.find(el => el.name === result.obtained);
          await Pity.update({
            guaranteedGoldCharacter: false,
          }, {
            where: { UserId: currentUser.id }
          })
        }
      }

      // Save to inventory
      if (result.type === 'character') {
        if (!ownChar) {
          await Character.create({ name: result.obtained, InventoryId: currentInventory.id, constellation: 0 });
          if (result.title === 'Purple Star') {
            await Inventory.update({
              starglitter: currentInventory.starglitter + 2,
            }, {
              where: { UserId: currentUser.id }
            })
            result.starglitter = 2;
          } else if (result.title === 'Gold Star') {
            await Inventory.update({
              starglitter: currentInventory.starglitter + 5,
            }, {
              where: { UserId: currentUser.id }
            })
            result.starglitter = 5;
          }
        } else {
          const currentChar = currentInventory.Characters.find(el => el.name === result.obtained);
          if (currentChar.constellation >= 6) {
            if (result.title === 'Purple Star') {
              await Inventory.update({
                starglitter: currentInventory.starglitter + 5,
              }, {
                where: { UserId: currentUser.id }
              })
              result.starglitter = 5;
            } else if (result.title === 'Gold Star') {
              await Inventory.update({
                starglitter: currentInventory.starglitter + 25,
              }, {
                where: { UserId: currentUser.id }
              })
              result.starglitter = 25;
            }
          } else {
            await Character.update({ constellation: currentChar.constellation + 1 }, { where: { name: currentChar.name, InventoryId: currentInventory.id } });
            if (result.title === 'Purple Star') {
              await Inventory.update({
                starglitter: currentInventory.starglitter + 2,
              }, {
                where: { UserId: currentUser.id }
              })
              result.starglitter = 2;
            } else if (result.title === 'Gold Star') {
              await Inventory.update({
                starglitter: currentInventory.starglitter + 5,
              }, {
                where: { UserId: currentUser.id }
              })
              result.starglitter = 5;
            }
          }
        }
      } else {
        await Weapon.create({ name: result.obtained, InventoryId: currentInventory.id })
        if (result.title === 'Purple Star') {
          await Inventory.update({
            starglitter: currentInventory.starglitter + 2,
          }, {
            where: { UserId: currentUser.id }
          })
          result.starglitter = 2;
        }
      }

      res.status(200).json({ result, RNG });
    } catch (error) {
      next(error);
    }
  }

  static async startGachaLimitedCharacter10x (req, res, next) {
    try {
      const { bannerId } = req.params;

      const currentBanner = await Banner.findByPk(bannerId);
      if (!currentBanner) throw { name: 'NotFound' };

      let currentUser = await User.findByPk(req.user.id, {
        include: [Pity]
      });
      if (!currentUser) throw { name: 'NotFound' };

      const currentInventory = await Inventory.findOne({
        where: { UserId: currentUser.id },
        include: [Character]
      })
      if (!currentInventory) throw { name: 'NotFound' };

      const totalResult = {
        title: [],
        obtained: [],
        starglitter: 0,
        type: [],
        goldPity: [],
        purplePity: [],
        guaraCharGold: [],
        guaraCharPurple: [],
        goldRate: [],
        purpleRate: [],
        RNG: []
      }
      
      for (let index = 0; index < 10; index++) {
        currentUser = await User.findByPk(req.user.id, {
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
          currentUser.Pity.charLimitedPurplePity--;
          gotPurple = false;
          gotGold = true;
        } else if (RNG <= goldRate) {
          currentUser.Pity.charLimitedPurplePity--;
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
    
        const result = {
          title: 'Blue Star',
          obtained: randomThreeStar.name,
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
          result.title = 'Purple Star';
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

            result.obtained = randomFourStar.name;
            result.type = randomFourStar.type;
            ownChar = currentInventory.Characters.find(el => el.name === result.obtained);
            await Pity.update({
              guaranteedPurpleCharacter: true,
            }, {
              where: { UserId: currentUser.id }
            })
          } else {
            const randomFourStar = Math.ceil(Math.random() * 3);
            if (randomFourStar === 1) result.obtained = currentBanner.rateUpPurple1;
            if (randomFourStar === 2) result.obtained = currentBanner.rateUpPurple2;
            if (randomFourStar === 3) result.obtained = currentBanner.rateUpPurple3;
            result.type = 'character';
            ownChar = currentInventory.Characters.find(el => el.name === result.obtained);
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
          result.title = 'Gold Star';
          const fiftyFifty = Math.ceil(Math.random() * 100);
          if (fiftyFifty > 50 && !currentUser.Pity.guaranteedGoldCharacter) {
            const fiveStarCharacters = await FiveStarCharacter.findAll({
              where: { available: true, limited: false }
            })

            const randomIndex = Math.floor(Math.random() * fiveStarCharacters.length);
            const randomFiveStarCharacters = fiveStarCharacters[randomIndex];

            result.obtained = randomFiveStarCharacters.name;
            result.type = randomFiveStarCharacters.type;
            ownChar = currentInventory.Characters.find(el => el.name === result.obtained);
            await Pity.update({
              guaranteedGoldCharacter: true,
            }, {
              where: { UserId: currentUser.id }
            })
          } else {
            result.obtained = currentBanner.rateUpGold;
            result.type = 'character';
            ownChar = currentInventory.Characters.find(el => el.name === result.obtained);
            await Pity.update({
              guaranteedGoldCharacter: false,
            }, {
              where: { UserId: currentUser.id }
            })
          }
        }

        // Save to inventory
        if (result.type === 'character') {
          if (!ownChar) {
            await Character.create({ name: result.obtained, InventoryId: currentInventory.id, constellation: 0 });
            if (result.title === 'Purple Star') {
              await Inventory.update({
                starglitter: currentInventory.starglitter + 2,
              }, {
                where: { UserId: currentUser.id }
              })
              result.starglitter = 2;
            } else if (result.title === 'Gold Star') {
              await Inventory.update({
                starglitter: currentInventory.starglitter + 5,
              }, {
                where: { UserId: currentUser.id }
              })
              result.starglitter = 5;
            }
          } else {
            const currentChar = currentInventory.Characters.find(el => el.name === result.obtained);
            if (currentChar.constellation >= 6) {
              if (result.title === 'Purple Star') {
                await Inventory.update({
                  starglitter: currentInventory.starglitter + 5,
                }, {
                  where: { UserId: currentUser.id }
                })
                result.starglitter = 5;
              } else if (result.title === 'Gold Star') {
                await Inventory.update({
                  starglitter: currentInventory.starglitter + 25,
                }, {
                  where: { UserId: currentUser.id }
                })
                result.starglitter = 25;
              }
            } else {
              await Character.update({ constellation: currentChar.constellation + 1 }, { where: { name: currentChar.name, InventoryId: currentInventory.id } });
              if (result.title === 'Purple Star') {
                await Inventory.update({
                  starglitter: currentInventory.starglitter + 2,
                }, {
                  where: { UserId: currentUser.id }
                })
                result.starglitter = 2;
              } else if (result.title === 'Gold Star') {
                await Inventory.update({
                  starglitter: currentInventory.starglitter + 5,
                }, {
                  where: { UserId: currentUser.id }
                })
                result.starglitter = 5;
              }
            }
          }
        } else {
          await Weapon.create({ name: result.obtained, InventoryId: currentInventory.id })
          if (result.title === 'Purple Star') {
            await Inventory.update({
              starglitter: currentInventory.starglitter + 2,
            }, {
              where: { UserId: currentUser.id }
            })
            result.starglitter = 2;
          }
        }

        totalResult.title.push(result.title);
        totalResult.obtained.push(result.obtained);
        totalResult.starglitter += result.starglitter;
        totalResult.type.push(result.type);
        totalResult.goldPity.push(result.goldPity);
        totalResult.purplePity.push(result.purplePity);
        totalResult.guaraCharGold.push(result.guaraCharGold);
        totalResult.guaraCharPurple.push(result.guaraCharPurple);
        totalResult.goldRate.push(result.goldRate);
        totalResult.purpleRate.push(result.purpleRate);
        totalResult.RNG.push(RNG);
      }

      res.status(200).json(totalResult);
    } catch (error) {
      next(error);
    }
  }

  static async showBanner(req, res, next) {
    try {
      const banners = await Banner.findAll();
      res.status(200).json(banners);
    } catch (error) {
      next(error);
    }
  }

  static async showBannerById(req, res, next) {
    try {
      const { id } = req.params;
      const banner = await Banner.findByPk(id);
      if (!banner) throw { name: 'NotFound' };
      res.status(200).json(banner);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = GachaController;