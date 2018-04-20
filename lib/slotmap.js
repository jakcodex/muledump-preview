/*
//  MD IDS //  Slot types
//  0      //  0 - empty
//  1      //  1 - swords
//  2      //  2 - dagger
//  3      //  3 - bows
//  4      //  4 - tomes
//  5      //  5 - shields
//  6      //  6 - light armor
//  7      //  7 - heavy armor
//  8      //  8 - wands
//  9      //  9 - rings
//  42010  //  10 - potions
//  42011  //  10 - potions soulbound
//  42012  //  10 - candies
//  42013  //  10 - keys
//  42014  //  10 - portal keys (incs, vials)
//  42015  //  10 - textiles
//  42016  //  10 - skins
//  42017  //  10 - fine spirits
//  42018  //  10 - elixers
//  42019  //  10 - other consumables
//  42020  //  10 - helpful consumables
//  42021  //  10 - assistant consumables
//  42022  //  10 - event items
//  42023  //  10 - tarot cards
//  42024  //  10 - treasures
//  42025  //  10 - effusions
//  42026  //  10 - pet food
//  42027  //  10 - pet stones
//  42028  //  10 - misc items
//  42029  //  10 - other items
//  50000  //  10 - uncategorized
//  ^^^^^really rotmg???^^^^^
//  11     //  11 - spells
//  12     //  12 - seals
//  13     //  13 - cloaks
//  14     //  14 - robes
//  15     //  15 - quivers
//  16     //  16 - helms
//  17     //  17 - staves
//  18     //  18 - poisons
//  19     //  19 - skulls
//  20     //  20 - traps
//  21     //  21 - orbs
//  22     //  22 - prisms
//  23     //  23 - scepters
//  24     //  24 - katanas
//  25     //  25 - stars
//  26     //  26 - eggs
*/

//  map of item groups and their identifier keys
var itemsSlotTypeMap = {
    empty: {slotType: 0, displayName: 'Empty Slot'},
    swords: {slotType: 1},
    daggers: {slotType: 2},
    bows: {slotType: 3},
    tomes: {slotType: 4},
    shields: {slotType: 5},
    lightarmor: {
        slotType: 6,
        displayName: 'Light Armor'
    },
    heavyarmor: {
        slotType: 7,
        displayName: 'Heavy Armor'
    },
    wands: {slotType: 8},
    rings: {slotType: 9},
    potions: {
        name: new RegExp(/^(?:Greater )?Potion of .*$/i),
        slotType: 10,
        virtualSlotType: 42010,
        tier: [2, 4, -1],
        bagType: 5,
        soulbound: false
    },
    potionssb: {
        displayName: 'Potions (SB)',
        name: new RegExp(/^(Potion of .*|Mystery Stat .*)$/i),
        slotType: 10,
        virtualSlotType: 42011,
        tier: -1,
        bagType: 5,
        soulbound: true
    },
    candies: {
        name: new RegExp(/^Candy of Extreme .*$/i),
        slotType: 10,
        virtualSlotType: 42012,
        tier: -1,
        bagType: 8,
        soulbound: true
    },
    keys: {
        name: new RegExp(/^.* Key(?: \(.*\))?$/i),
        slotType: 10,
        virtualSlotType: 42013,
        tier: -1,
        bagType: 8,
        soulbound: true,
        utst: 0
    },
    portkeys: {
        displayName: 'Portal Keys',
        name: new RegExp(/^(Wine Cellar Incantation|Vial of Pure Darkness)$/i),
        slotType: 10,
        virtualSlotType: 42014,
        tier: -1,
        bagType: [8,4]
    },
    textiles: {
        name: new RegExp(/^(?:(Mystery|Accessory|Clothing) (Dye|Cloth).*|.* (Dye|Cloth))$/i),
        slotType: 10,
        virtualSlotType: 42015,
        tier: -1,
        bagType: 8,
        feedPower: 0,
        soulbound: true,
        utst: 0
    },
    skins: {
        name: new RegExp(/^((?! pet |Red Nosed Skin|.* Bagston Skin|Christmas Tree Skin).)*skin(?: \(.*\))?$/i),
        slotType: 10,
        virtualSlotType: 42016,
        tier: -1,
        bagType: 8
    },
    petstones: {
        name: new RegExp(/^(?:.* pet skin|(?:Halloween )?Mystery Pet Stone|Red Nosed Skin|.* Bagston Skin|Christmas Tree Skin)(?: \(.*\))?$/i),
        slotType: 10,
        virtualSlotType: 42027,
        tier: -1,
        bagType: 8
    },
    //  skipping greater/minor hpmp
    finespirits: {
        displayName: 'Fine Spirits',
        slotType: 10,
        virtualSlotType: 42017,
        tier: 3,
        bagType: 2
    },
    elixirs: {
        name: new RegExp(/^Elixir of .*$/i),
        slotType: 10,
        virtualSlotType: 42018,
        tier: -1,
        bagType: 2,
        soulbound: true
    },
    otherconsumables: {
        displayName: 'Other',
        slotType: 10,
        virtualSlotType: 42019,
        tier: -1,
        bagType: [2, 6],
        soulbound: true
    },
    helpfulconsumables: {
        displayName: 'Helpful',
        slotType: 10,
        virtualSlotType: 42020,
        tier: -1,
        bagType: 2,
        soulbound: false
    },
    eventitems: {
        displayName: 'Event Items',
        slotType: 10,
        virtualSlotType: 42022,
        tier: -1,
        bagType: 7,
        soulbound: true
    },
    misc: {
        displayName: 'Misc Items',
        slotType: 10,
        virtualSlotType: 42028,
        tier: -1,
        bagType: 8,
        soulbound: true,
        utst: 1
    },
    tarot: {
        displayName: 'Tarot Cards',
        name: new RegExp(/^.* Tarot Card$/i),
        slotType: 10,
        virtualSlotType: 42023,
        tier: -1,
        bagType: 7,
        soulbound: false,
        utst: 0
    },
    treasures: {
        displayName: 'Treasure',
        name: new RegExp(/^((?!Heart).)*$/i),
        slotType: 10,
        virtualSlotType: 42024,
        tier: -1,
        bagType: 7,
        soulbound: false,
        utst: 0
    },
    effusions: {
        name: new RegExp(/^Effusion of .*$/i),
        virtualSlotType: 42025,
        slotType: 10,
        tier: -1,
        bagType: 5,
        soulbound: true
    },
    assistants: {
        displayName: 'Loot/Exp',
        virtualSlotType: 42021,
        name: new RegExp(/^(XP Booster.*?|Loot.*Potion|.* Chest|Lucky Clover)$/i),
        slotType: 10,
        tier: -1,
        bagType: 8
    },
    petfood: {
        displayName: 'Pet Food',
        virtualSlotType: 42026,
        name: new RegExp(/^((?!Apple of Semi Maxening|Level Chicken|Snowball|Valentine Launcher|Treasure Map).)*$/i),
        slotType: 10,
        tier: -1,
        bagType: 8,
        feedPower: {
            gte: 150,
            lte: 20000
        },
        soulbound: true
    },
    other: {
        displayName: 'Uncategorized',
        virtualSlotType: 42029,
        slotType: 10
    },
    spells: {slotType: 11},
    seals: {slotType: 12},
    cloaks: {slotType: 13},
    robes: {slotType: 14},
    quivers: {slotType: 15},
    helms: {slotType: 16},
    staves: {slotType: 17},
    poisons: {slotType: 18},
    skulls: {slotType: 19},
    traps: {slotType: 20},
    orbs: {slotType: 21},
    prisms: {slotType: 22},
    scepters: {slotType: 23},
    katanas: {slotType: 24},
    stars: {slotType: 25},
    eggs: {slotType: 26}
};
window.itemsSlotTypeMap = itemsSlotTypeMap;
