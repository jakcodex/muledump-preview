(function($, window) {

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
        displayName: 'Extreme Candies',
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
        name: new RegExp(/^((?!pet ).)*skin(?: \(.*\))?$/i),
        slotType: 10,
        virtualSlotType: 42016,
        tier: -1,
        bagType: 8
	},
	petstones: {
        name: new RegExp(/^(?:.*pet skin|Mystery Pet Stone)(?: \(.*\))?$/i),
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
		displayName: 'Loot/Exp Boosters',
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
        displayName: 'Other Items',
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
	eggs: {slotType: 26},
    //weapons: {virtualSlotType: [1, 2, 3, 8, 17, 24]},
    //abilities: {virtualSlotType: [4, 5, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 25]},
	//armor: {virtualSlotType: [6, 7, 14]}
};

var totals = {}, counters = {}, ids = [];

window.ids = ids;
window.itemsSlotTypeMap = itemsSlotTypeMap;

var options = window.options;
var option_updated = window.option_updated;
var items = window.items;

function init_totals() {
	setuptools.app.uaTiming('totals', 'init', 'start');

	//  populate virtualSlotType data
	for (var id in items)
		if ( items.hasOwnProperty(id) )
            items[id].push(setuptools.app.muledump.itemsSlotTypeMapper(id));
	// sort
	ids = Object.keys(items);
	ids.sort(function(a, b) {
		a = items[a];
		b = items[b];
		function slotidx(it) {
			if ( setuptools.app.muledump.totals.config.exists('active') === false ) return setuptools.config.defaultSlotOrder.indexOf(it[10]);
			return setuptools.app.muledump.totals.config.getKey('slotOrder').indexOf(it[10])
		}
		function tier(it) { return (it[2] < 0) ? 42 : it[2] }
		return (slotidx(a) - slotidx(b)) || (tier(a) - tier(b)) || (a[5]-b[5]) || (a[6]-b[6]);
	});
	window.ids = ids;
    setuptools.app.uaTiming('totals', 'init', 'stop');
}

function update_totals() {

	$('#totals').hide();
	var old = totals;
	totals = window.totals = {};
	var mules = window.mules;
    if ( options.totals === false ) return;
    $('.noTotals').hide();

    //  old format counting item-by-item (full scan)
	function upd(arr) {
		if (!arr) return;
		for (var i = 0; i < arr.length; i++) {
			var id = +arr[i];
			if (isbad(id)) continue;
			if (id in totals) totals[id]++; else totals[id] = 1;
		}
	}

	//  new format counting cached aggregate sums
	function upd2(item, qty) {

		item = Number(item);
		if ( typeof item !== 'number' || typeof qty !== 'number' || isbad(item) ) return;
		if ( typeof totals[item] === 'number' ) {
            totals[item] = totals[item]+qty;
		} else totals[item] = qty;

	}

	//  determine if an item is eligible for display
	function isbad(id) {

		if ( setuptools.tmp.totalsSecondaryFilter.indexOf(id) > -1 ) return true;
        if ( setuptools.app.muledump.totals.config.getKey('itemFilter').indexOf(id) > -1 ) return true;
	    if (!options.famefilter && !options.feedfilter && !options.utfilter && !options.sbfilter && !options.stfilter) return false;
		var i = items[id] || items[-1];

        if (options.famefilter && i[5] <= +options.fameamount) return true;
        if (options.feedfilter && i[6] <= +options.feedpower) return true;
        if (options.utfilter && [0,2].indexOf(i[9]) > -1 ) return true;
        if (options.stfilter && [0,1].indexOf(i[9]) > -1 ) return true;
        if (options.sbfilter && i[8] === false ) return true;
		return false;

	}

	/*
	//  count items
	*/
	setuptools.app.uaTiming('totals', 'calculate', 'start', 'aggregate');
	var types = ['inv', 'backpack', 'equipment', 'vaults', 'gifts'];

    //  scan over each mule's precalculated items to determine totals display
	if ( setuptools.data.options.totalsGlobal === false ) {

		setuptools.app.techlog('Muledump/TotalsCount running in mode 0');
        for (var i in mules)
            if (mules.hasOwnProperty(i))

            //  check if mule is disabled or if the account filter is active
                if (!(mules[i].disabled || (
						Array.isArray(setuptools.app.muledump.totals.config.getKey('accountFilter')) === true &&
						setuptools.app.muledump.totals.config.getKey('accountFilter').length > 0 &&
						setuptools.app.muledump.totals.config.getKey('accountFilter').indexOf(i) === -1
					)
                ))

                //  if the above test passes then we'll loop thru the types totals cache
				for (var x = 0; x < types.length; x++)

					//  if totalsGlobal is false then we only display items enabled in options
					if (mules[i].opt(types[x]) === true)

						//  test these items for display eligibility
						for (var item in mules[i].totals.data.types[types[x]])
							if (mules[i].totals.data.types[types[x]].hasOwnProperty(item))

							//  this will test item eligibility and then display or discard
								upd2(item, mules[i].totals.data.types[types[x]][item]);

	//  scan over the global totals items
    } else {

        setuptools.app.techlog('Muledump/TotalsCount running in mode 1');
		var gt = setuptools.tmp.globalTotalsCounter.data.types;
        for (var x2 = 0; x2 < types.length; x2++)
			for (var itemid in gt[types[x2]])
				if (gt[types[x2]].hasOwnProperty(itemid))
					//  this will test item eligibility and then display or discard
					upd2(itemid, gt[types[x2]][itemid]);

	}

	setuptools.app.uaTiming('totals', 'calculate', 'stop', 'aggregate');

	//  remove no longer present totals
	for (i in old) {
        if (old.hasOwnProperty(i)) {
			if (!items[i]) continue;
			if (!(i in totals)) {
				counters[i].hide();
				continue;
			}
			if (totals[i] !== old[i]) {
				var a = totals[i];
				counters[i].find('div').toggle(a > 1).text(a);
			}
		}
	}

	//  build and display totals
    setuptools.app.uaTiming('totals', 'render', 'start', 'aggregate');
	for (i in totals) {
		if (i in old) continue;
		if (!items[i]) continue;
		if (!counters[i]) {
			var $i = window.item(i);
			var idx = ids.indexOf(i), minid = 0, minidx = 1e6, idxj = -1;
			for (var j in counters) {
				idxj = ids.indexOf(j);
				if (idxj > idx && idxj < minidx) {
					minidx = idxj;
					minid = j;
				}
			}
			if (minid) {
				$i.insertBefore(counters[minid]);
			} else $i.appendTo($('#totals'));
			counters[i] = $i;

		}
		var f = totals[i];
		counters[i].find('div').toggle(f > 1).text(f);
		counters[i].css('display', 'inline-block');
	}

	//  display a message if totals is empty
    if (
    	setuptools.state.firsttime === false &&
		Object.keys(totals).length === 0
	) $('.noTotals').show();

	//  adjust totals width
    setuptools.app.muledump.totalsWidth(totals);
    setuptools.app.uaTiming('totals', 'render', 'stop', 'aggregate');

	option_updated('totals');
}

// click-and-find

var filter = {};
window.filter = filter;

function toggle_filter(self) {
	var $self = $(self);
	var id = $self.data('id');
	if (id in filter) delete filter[id]; else filter[id] = 1;
	window.relayout();
}

function update_filter() {

    $('.item.selected').filter(function() {
		return !($(this).data('id') in filter);
	}).removeClass('selected');
	$('.item').filter(function() {
		return $(this).data('id') in filter;
	}).addClass('selected');
	if ($.isEmptyObject(filter) || $('.item.selected:visible').length === 0) {
		var mules = window.mules;
		for (var i in mules) if (mules[i].loaded) mules[i].dom.css('display', 'inline-block');
		return;
	}

	// if filtering
    var selected = $('.item.selected');
	var itemList = [];
    for ( var s = 0; s < selected.length; s++ ) {

        //  get our itemid and only check for it once
        var itemid = $(selected[s]).attr('data-itemid');
        if ( itemList.indexOf(itemid) > -1 ) continue;
        itemList.push(itemid);

    }

	$('.mule').each(function() {

        var guid = $(this).attr('data-guid');
        for ( var s = 0; s < itemList.length; s++ ) {

            var itemid = itemList[s];

			//  build our list to check against
            var types = ( setuptools.data.options.totalsGlobal === false ) ?
                window.mules[guid].totals.data.types :
                {aggregate: window.mules[guid].totals.data.totals};

            //  loop thru the list
            for ( var type in types ) {

                if ( types.hasOwnProperty(type) ) {

                	//  if the item isn't found or this is mode 0 and the type is disabled, skip it
                    if (
                        typeof types[type][itemid] !== 'number' ||
                        (
                            setuptools.data.options.totalsGlobal === false &&
                            window.mules[guid].opt(type) === false
                        )
                    ) continue;

                    //  display the mule
                    $(this).css('display', 'inline-block');
                    return;

                }

            }

        }

        //  filter did not find account; hide it
        $(this).hide();

	});
}

function consumable_tier(id, itemname) {
	/*
	0: Vanity HP/MP
	1: HP/MP
	2: Stat Pots
	3: Wines
	4: Greater Stat Pots
	5: Incantation
	6: Dungeon Consumables
	7: Drake Eggs
	8: Tinctures and Effusions
	9: Holiday Candy and Alcohol
	10: Elixirs
	11: Shop Stuff
	12: Pet Food
	13: Keys
	14: Treasures
	15: Cards
	16: Skins
	17: Dyes
	18: Cloths
	*/
	switch (itemname) {
		case 'Minor Health Potion':
		case 'Minor Magic Potion':
		case 'Greater Health Potion':
		case 'Greater Magic Potion':
		case 'Potion of Health1':
		case 'Potion of Health2':
		case 'Potion of Health3':
		case 'Potion of Health4':
		case 'Potion of Health5':
		case 'Potion of Health6':
			return 0;
		case 'Health Potion':
		case 'Magic Potion':
			return 1;
		case 'Potion of Attack':
		case 'Potion of Defense':
		case 'Potion of Speed':
		case 'Potion of Vitality':
		case 'Potion of Wisdom':
		case 'Potion of Dexterity':
		case 'Potion of Life':
		case 'Potion of Mana':
			return 2;
		case 'Fire Water':
		case 'Cream Spirit':
		case 'Chardonnay':
		case 'Melon Liquer':
		case 'Cabernet':
		case 'Vintage Port':
		case 'Sauvignon Blanc':
		case 'Muscat':
		case 'Rice Wine':
		case 'Shiraz':
			return 3;
		case 'Greater Potion of Attack':
		case 'Greater Potion of Defense':
		case 'Greater Potion of Speed':
		case 'Greater Potion of Vitality':
		case 'Greater Potion of Wisdom':
		case 'Greater Potion of Dexterity':
		case 'Greater Potion of Life':
		case 'Greater Potion of Mana':
			return 4;
		case 'Wine Cellar Incantation':
			return 5;
		case 'Snake Oil':
		case 'Healing Ichor':
		case 'Pirate Rum':
		case 'Magic Mushroom':
		case 'Coral Juice':
		case 'Pollen Powder':
		case 'Holy Water':
		case 'Ghost Pirate Rum':
		case 'Speed Sprout':
			return 6;
		case 'Tincture of Fear':
		case 'Tincture of Courage':
		case 'Tincture of Dexterity':
		case 'Tincture of Life':
		case 'Tincture of Mana':
		case 'Tincture of Defense':
		case 'Effusion of Dexterity':
		case 'Effusion of Life':
		case 'Effusion of Mana':
		case 'Effusion of Defense':
			return 8;
		case 'Bahama Sunrise':
		case 'Blue Paradise':
		case 'Pink Passion Breeze':
		case 'Lime Jungle Bay':
		case 'Mad God Ale':
		case 'Oryx Stout':
		case 'Realm-wheat Hefeweizen':
		case 'Rock Candy':
		case 'Red Gumball':
		case 'Purple Gumball':
		case 'Blue Gumball':
		case 'Green Gumball':
		case 'Yellow Gumball':
		case 'Candy Corn':
			return 9;
		case 'Elixir of Health 7':
		case 'Elixir of Health 6':
		case 'Elixir of Health 5':
		case 'Elixir of Health 4':
		case 'Elixir of Health 3':
		case 'Elixir of Health 2':
		case 'Elixir of Health 1':
		case 'Elixir of Magic 7':
		case 'Elixir of Magic 6':
		case 'Elixir of Magic 5':
		case 'Elixir of Magic 4':
		case 'Elixir of Magic 3':
		case 'Elixir of Magic 2':
		case 'Elixir of Magic 1':
			return 10;
		case 'Small Firecracker':
		case 'Large Firecracker':
		case 'Sand Pail 5':
		case 'Sand Pail 4':
		case 'Sand Pail 3':
		case 'Sand Pail 2':
		case 'Sand Pail 1':
		case 'Transformation Potion':
		case 'XP Booster':
		case 'XP Booster Test':
		case 'Loot Tier Potion':
		case 'Loot Drop Potion':
		case 'XP Booster 1 hr':
		case 'XP Booster 20 min':
		case 'Backpack':
		case 'Old Firecracker':
		case 'Draconis Potion':
		case 'Lucky Clover':
		case 'Saint Patty\'s Brew':
			return 11;
		case 'Soft Drink':
		case 'Fries':
		case 'Great Taco':
		case 'Power Pizza':
		case 'Chocolate Cream Sandwich Cookie':
		case 'Grapes of Wrath':
		case 'Superburger':
		case 'Double Cheeseburger Deluxe':
		case 'Ambrosia':
			return 12;
		case 'Treasure Map':
			return 13;
		case 'Golden Ankh':
		case 'Eye of Osiris':
		case 'Pharaoh\'s Mask':
		case 'Golden Cockle':
		case 'Golden Conch':
		case 'Golden Horn Conch':
		case 'Golden Nut':
		case 'Golden Bolt':
		case 'Golden Femur':
		case 'Golden Ribcage':
		case 'Golden Skull':
		case 'Golden Candelabra':
		case 'Holy Cross':
		case 'Pearl Necklace':
		case 'Golden Chalice':
		case 'Ruby Gemstone':
			return 14;
		default:
			var lastword = itemname.split(" ");
			var itemtype = lastword[lastword.length - 1];
			if (itemtype == "Egg") {
				return 7;
			} else if(itemtype == "Key") {
				return 13;
			} else if(itemtype == "Card") {
				return 15;
			} else if(itemtype == "Skin") {
				return 16;
			} else if(itemtype == "Dye") {
				return 17;
			} else if(itemtype == "Cloth") {
				return 18;
			} else { // unknown item, abandon ship! (leave its tier at -1)
				window.techlog("Unknown item: " + id + " " + items[id][0], 'hide');
				return -1;
			}
		// end switch
	}
}


window.init_totals = init_totals;
window.update_totals = update_totals;
window.update_filter = update_filter;
window.toggle_filter = toggle_filter;

})($, window);
