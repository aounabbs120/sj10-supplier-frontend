
/* ===================================================================================
//
//          --- PRODUCT ATTRIBUTES DEFINITION FILE (attributes.js) ---
//                      (FIXED SCOPE VERSION)
//
// =================================================================================== */

// 1. GLOBAL HELPER CONSTANTS (Attached to window to prevent ReferenceErrors)
export const clothingFabricOptions = "Silk, Chiffon, Jersey, Knitted, Fleece, Cotton, Lawn, Linen, Khaddar, Karandi, Organza, Velvet, Jacquard, Cambric, Raw Silk, Dhanak, Marina, Satin, Wash & Wear, Georgette, Viscose, Polyester, Terry, Denim, Wool, Net, Jamawar";
window.clothingPatternOptions = "Printed, Plain, Embroidered, Digital Print, Block Print, Screen Print, Embellished, Striped, Floral, Geometric, Abstract, Tie-Dye, Animal Print, Self-Design, Check, Polka Dots";
window.clothingNeckTypeOptions = "Round Neck, V-Neck, Polo Neck, Scoop Neck, Boat Neck, High Neck, Collar Neck, Plain, Ban Collar, Shawl Collar, Mandarin Collar, Angrakha, Keyhole Neck";
window.clothingOccasionOptions = "Casual, Formal, Party Wear, Festive, Wedding, Daily Wear, Office Wear, Semi-Formal, Evening Wear";
window.colorAttribute = { name: "Color", type: "Text", options: "e.g., Red, Blue, Multicolor, Off-white, Black, Maroon" };
window.genderOptions = "Men, Women, Unisex, Boys, Girls";
window.dimensionAttributes = [
    { name: "Product Length", type: "Measurement", units: ["Inches", "cm", "mm"] },
    { name: 'Product Width', type: 'Measurement', units: ['Inches', 'cm', 'mm'] },
    { name: 'Product Height', type: 'Measurement', units: ['Inches', 'cm', 'mm'] }
];
window.materialJewelryOptions = "Alloy, Gold, Aluminum, Silver, Casting, Plastic, Stainless Steel, Gold Plated, Silver Plated, Platinum, Diamond, Artificial, Brass, Copper, Kundan, Meenakari, Pearl, Zirconia, Crystal, Stone";
window.platingJewelryOptions = "Gold, Silver, Rhodium, Rose Gold, Platinum, Oxidized, Matte Gold, Antique Gold";

window.menStitchedMeasurementAttributes = [
    { name: "Shirt Length", type: "Measurement", units: ["Inches"] },
    { name: "Shirt Chest", type: "Measurement", units: ["Inches"] },
    { name: "Shirt Shoulder", type: "Measurement", units: ["Inches"] },
    { name: "Arm Length", type: "Measurement", units: ["Inches"] }
];

window.menTrouserMeasurementAttributes = [
    { name: "Trouser Length", type: "Measurement", units: ["Inches"] },
    { name: "Trouser Waist", type: "Measurement", units: ["Inches"] },
    { name: "Trouser Hip", type: "Measurement", units: ["Inches"] }
];

window.beddingSetMeasurementAttributes = [
    { name: "Bed Sheet Length", type: "Measurement", units: ["Inches", "cm"] },
    { name: "Bed Sheet Width", type: "Measurement", units: ["Inches", "cm"] },
    { name: "Pillow Cover Length", type: "Measurement", units: ["Inches", "cm"] },
    { name: "Pillow Cover Width", type: "Measurement", units: ["Inches", "cm"] },
    { name: "Cushion Cover Length", type: "Measurement", units: ["Inches", "cm"] },
    { name: "Cushion Cover Width", type: "Measurement", units: ["Inches", "cm"] },
    { name: "Comforter/Duvet Length", type: "Measurement", units: ["Inches", "cm"] },
    { name: "Comforter/Duvet Width", type: "Measurement", units: ["Inches", "cm"] },
];

window.detailedElectronicsAttributes = [
    { name: "Model", type: "Text", options: "e.g., TWS-Pro, SoundBlaster X" },
    { name: "Connectivity Technology", type: "Enum", options: "Bluetooth, Wired, Wi-Fi, USB, AUX, RF" },
    { name: "Bluetooth Version", type: "Enum", options: "4.2, 5.0, 5.1, 5.2, 5.3" },
    window.colorAttribute,
    { name: "Product Feature", type: "Textarea", options: "e.g., Waterproof, Noise Cancelling, Fast Charging, RGB Lights, Touch Control, Gaming Mode" },
    { name: "Battery Capacity (mAh)", type: "Number", options: "e.g., 500" },
    { name: "Standby Time (Hours)", type: "Number", options: "e.g., 120" },
    { name: "Play Time (Hours)", type: "Number", options: "e.g., 8" },
    { name: "Charging Time (Hours)", type: "Number", options: "e.g., 2" },
    { name: "Voltage", type: "Text", options: "e.g., 5V" },
    { name: "Watts", type: "Text", options: "e.g., 10W" },
    { name: "Weight", type: "Measurement", units: ["g", "kg"] },
    ...window.dimensionAttributes,
    { name: "Pack Of", type: "Enum", options: "1, 2, 3" }
];

window.watchAttributes = [
    { name: "Brand", type: "Text", options: "e.g., Rolex, Casio, Naviforce, Generic" },
    { name: "Movement", type: "Enum", options: "Quartz, Automatic, Digital, Mechanical" },
    { name: "Display Type", type: "Enum", options: "Analog, Digital, Analog-Digital" },
    { name: "Strap Material", type: "Enum", options: "Stainless Steel, Leather, Silicone, Rubber, Nylon, Faux Leather" },
    { name: "Case Material", type: "Enum", options: "Stainless Steel, Alloy, Plastic, Brass" },
    { name: "Water Resistance", type: "Text", options: "e.g., 30M, 5ATM, Not Resistant" },
    { name: "Features", type: "Textarea", options: "e.g., Chronograph, Date Display, Luminous Hands, Alarm" },
    window.colorAttribute
];

window.kidsClothingAttributes = [
    { name: "Gender", type: "Enum", options: "Boys, Girls, Unisex" },
    { name: "Age Range", type: "Enum", options: "0-3 Months, 3-6 Months, 6-12 Months, 1-2 Years, 2-3 Years, 3-5 Years, 5-7 Years, 7-10 Years, 10-14 Years" },
    { name: "Fabric", type: "Enum", options: window.clothingFabricOptions },
    { name: "Season", type: "Enum", options: "Summer, Winter, All Seasons, Mid-Season" },
    { name: "Occasion", type: "Enum", options: "Daily Wear, Party Wear, Formal, Festive" },
    window.colorAttribute,
];

// 2. Color Families
export const colorFamilies = [
    { name: "Aqua Mist Shade 1", hex: "#E0FFFF" },
{ name: "Aqua Mist Shade 2", hex: "#D0FFFF" },
{ name: "Aqua Mist Shade 3", hex: "#C0FFFF" },
{ name: "Aqua Mist Shade 4", hex: "#B0FFFF" },
{ name: "Aqua Mist Shade 5", hex: "#A0FFFF" },

{ name: "Azure Light 1", hex: "#E6F6FF" },
{ name: "Azure Light 2", hex: "#D4EEFF" },
{ name: "Azure Light 3", hex: "#C2E6FF" },
{ name: "Azure Light 4", hex: "#B0DEFF" },
{ name: "Azure Light 5", hex: "#9ED6FF" },

{ name: "Berry Purple 1", hex: "#F8D0FF" },
{ name: "Berry Purple 2", hex: "#F0A0FF" },
{ name: "Berry Purple 3", hex: "#E870FF" },
{ name: "Berry Purple 4", hex: "#E040FF" },
{ name: "Berry Purple 5", hex: "#D000FF" },

{ name: "Blue Frost 1", hex: "#D7ECFF" },
{ name: "Blue Frost 2", hex: "#C0E0FF" },
{ name: "Blue Frost 3", hex: "#A8D4FF" },
{ name: "Blue Frost 4", hex: "#90C8FF" },
{ name: "Blue Frost 5", hex: "#78BCFF" },

{ name: "Blue Ice 1", hex: "#E4F2FF" },
{ name: "Blue Ice 2", hex: "#CCE5FF" },
{ name: "Blue Ice 3", hex: "#B3D8FF" },
{ name: "Blue Ice 4", hex: "#9ACBFF" },
{ name: "Blue Ice 5", hex: "#82BEFF" },

{ name: "Blue Ocean 1", hex: "#D0E8FF" },
{ name: "Blue Ocean 2", hex: "#B0D8FF" },
{ name: "Blue Ocean 3", hex: "#90C8FF" },
{ name: "Blue Ocean 4", hex: "#70B8FF" },
{ name: "Blue Ocean 5", hex: "#50A8FF" },

{ name: "Blue Shadow 1", hex: "#CCDFFF" },
{ name: "Blue Shadow 2", hex: "#AACCFF" },
{ name: "Blue Shadow 3", hex: "#88B9FF" },
{ name: "Blue Shadow 4", hex: "#66A6FF" },
{ name: "Blue Shadow 5", hex: "#4493FF" },

{ name: "Blush Tint 1", hex: "#FFE6EF" },
{ name: "Blush Tint 2", hex: "#FFD0E1" },
{ name: "Blush Tint 3", hex: "#FFBAD3" },
{ name: "Blush Tint 4", hex: "#FFA4C5" },
{ name: "Blush Tint 5", hex: "#FF8EB7" },

{ name: "Bright Lime 1", hex: "#E0FFB3" },
{ name: "Bright Lime 2", hex: "#CCFF80" },
{ name: "Bright Lime 3", hex: "#B8FF4D" },
{ name: "Bright Lime 4", hex: "#A3FF1A" },
{ name: "Bright Lime 5", hex: "#8FFF00" },

{ name: "Canary Tone 1", hex: "#FFFFCC" },
{ name: "Canary Tone 2", hex: "#FFFFB3" },
{ name: "Canary Tone 3", hex: "#FFFF99" },
{ name: "Canary Tone 4", hex: "#FFFF80" },
{ name: "Canary Tone 5", hex: "#FFFF66" },

{ name: "Carmine Shade 1", hex: "#FFD3D9" },
{ name: "Carmine Shade 2", hex: "#FFB0BC" },
{ name: "Carmine Shade 3", hex: "#FF8DA0" },
{ name: "Carmine Shade 4", hex: "#FF6A84" },
{ name: "Carmine Shade 5", hex: "#FF4768" },

{ name: "Cobalt Tint 1", hex: "#CCE0FF" },
{ name: "Cobalt Tint 2", hex: "#B3CCFF" },
{ name: "Cobalt Tint 3", hex: "#99B8FF" },
{ name: "Cobalt Tint 4", hex: "#80A4FF" },
{ name: "Cobalt Tint 5", hex: "#6690FF" },

{ name: "Cool Mint 1", hex: "#E6FFFA" },
{ name: "Cool Mint 2", hex: "#CCFFF5" },
{ name: "Cool Mint 3", hex: "#B3FFF0" },
{ name: "Cool Mint 4", hex: "#99FFEB" },
{ name: "Cool Mint 5", hex: "#80FFE6" },

{ name: "Coral Tone 1", hex: "#FFE6DF" },
{ name: "Coral Tone 2", hex: "#FFD0C1" },
{ name: "Coral Tone 3", hex: "#FFBAA3" },
{ name: "Coral Tone 4", hex: "#FFA485" },
{ name: "Coral Tone 5", hex: "#FF8E67" },

{ name: "Crimson Glow 1", hex: "#FFD9DF" },
{ name: "Crimson Glow 2", hex: "#FFB3BF" },
{ name: "Crimson Glow 3", hex: "#FF8DA0" },
{ name: "Crimson Glow 4", hex: "#FF6780" },
{ name: "Crimson Glow 5", hex: "#FF4160" },

{ name: "Cyber Blue 1", hex: "#D0E4FF" },
{ name: "Cyber Blue 2", hex: "#A8C8FF" },
{ name: "Cyber Blue 3", hex: "#80ACFF" },
{ name: "Cyber Blue 4", hex: "#5890FF" },
{ name: "Cyber Blue 5", hex: "#3074FF" },

{ name: "Deep Teal Shade 1", hex: "#D0F2F2" },
{ name: "Deep Teal Shade 2", hex: "#A6E5E5" },
{ name: "Deep Teal Shade 3", hex: "#7BD8D8" },
{ name: "Deep Teal Shade 4", hex: "#51CCCC" },
{ name: "Deep Teal Shade 5", hex: "#26BFBF" },

{ name: "Diamond Tint 1", hex: "#E6F7FF" },
{ name: "Diamond Tint 2", hex: "#CCF0FF" },
{ name: "Diamond Tint 3", hex: "#B3E8FF" },
{ name: "Diamond Tint 4", hex: "#99E0FF" },
{ name: "Diamond Tint 5", hex: "#80D8FF" },

{ name: "Emerald Shade 1", hex: "#D8FFEA" },
{ name: "Emerald Shade 2", hex: "#B0FFD6" },
{ name: "Emerald Shade 3", hex: "#88FFC2" },
{ name: "Emerald Shade 4", hex: "#60FFAE" },
{ name: "Emerald Shade 5", hex: "#38FF9A" },

{ name: "Flame Red 1", hex: "#FFE6E0" },
{ name: "Flame Red 2", hex: "#FFC8B8" },
{ name: "Flame Red 3", hex: "#FFAA90" },
{ name: "Flame Red 4", hex: "#FF8C68" },
{ name: "Flame Red 5", hex: "#FF6E40" },

{ name: "Frost Gray 1", hex: "#F2F2F2" },
{ name: "Frost Gray 2", hex: "#E5E5E5" },
{ name: "Frost Gray 3", hex: "#D9D9D9" },
{ name: "Frost Gray 4", hex: "#CCCCCC" },
{ name: "Frost Gray 5", hex: "#BFBFBF" },

{ name: "Glacier Blue 1", hex: "#E1F5FF" },
{ name: "Glacier Blue 2", hex: "#C2EBFF" },
{ name: "Glacier Blue 3", hex: "#A3E1FF" },
{ name: "Glacier Blue 4", hex: "#84D7FF" },
{ name: "Glacier Blue 5", hex: "#65CDFF" },

{ name: "Honey Tint 1", hex: "#FFF5D6" },
{ name: "Honey Tint 2", hex: "#FFEAB3" },
{ name: "Honey Tint 3", hex: "#FFDF8F" },
{ name: "Honey Tint 4", hex: "#FFD46C" },
{ name: "Honey Tint 5", hex: "#FFC949" },

{ name: "Ice Green 1", hex: "#E6FFF3" },
{ name: "Ice Green 2", hex: "#CCFFE7" },
{ name: "Ice Green 3", hex: "#B3FFDB" },
{ name: "Ice Green 4", hex: "#99FFCF" },
{ name: "Ice Green 5", hex: "#80FFC3" },

{ name: "Indigo Deep 1", hex: "#E0D6FF" },
{ name: "Indigo Deep 2", hex: "#C2B0FF" },
{ name: "Indigo Deep 3", hex: "#A48AFF" },
{ name: "Indigo Deep 4", hex: "#8664FF" },
{ name: "Indigo Deep 5", hex: "#683EFF" },

{ name: "Jade Tint 1", hex: "#D6FFF2" },
{ name: "Jade Tint 2", hex: "#B3FFE5" },
{ name: "Jade Tint 3", hex: "#8FFF D8" },
{ name: "Jade Tint 4", hex: "#6CFFCB" },
{ name: "Jade Tint 5", hex: "#49FFBE" },

{ name: "Lavender Soft 1", hex: "#F5E6FF" },
{ name: "Lavender Soft 2", hex: "#EBCCFF" },
{ name: "Lavender Soft 3", hex: "#E1B3FF" },
{ name: "Lavender Soft 4", hex: "#D799FF" },
{ name: "Lavender Soft 5", hex: "#CD80FF" },

{ name: "Lemon Glow 1", hex: "#FFFFE0" },
{ name: "Lemon Glow 2", hex: "#FFFFC2" },
{ name: "Lemon Glow 3", hex: "#FFFFA3" },
{ name: "Lemon Glow 4", hex: "#FFFF85" },
{ name: "Lemon Glow 5", hex: "#FFFF66" },

{ name: "Lilac Tint 1", hex: "#F7E6FF" },
{ name: "Lilac Tint 2", hex: "#EED1FF" },
{ name: "Lilac Tint 3", hex: "#E5BCFF" },
{ name: "Lilac Tint 4", hex: "#DCA7FF" },
{ name: "Lilac Tint 5", hex: "#D392FF" },

{ name: "Magenta Shade 1", hex: "#FFE0FF" },
{ name: "Magenta Shade 2", hex: "#FFB8FF" },
{ name: "Magenta Shade 3", hex: "#FF90FF" },
{ name: "Magenta Shade 4", hex: "#FF68FF" },
{ name: "Magenta Shade 5", hex: "#FF40FF" },

{ name: "Minty Blue 1", hex: "#E0FFFA" },
{ name: "Minty Blue 2", hex: "#C2FFF5" },
{ name: "Minty Blue 3", hex: "#A3FFF0" },
{ name: "Minty Blue 4", hex: "#85FFEB" },
{ name: "Minty Blue 5", hex: "#66FFE6" },

{ name: "Neon Aqua 1", hex: "#CCFFF9" },
{ name: "Neon Aqua 2", hex: "#99FFF3" },
{ name: "Neon Aqua 3", hex: "#66FFEC" },
{ name: "Neon Aqua 4", hex: "#33FFE6" },
{ name: "Neon Aqua 5", hex: "#00FFDF" },

{ name: "Ocean Tint 1", hex: "#D9F2FF" },
{ name: "Ocean Tint 2", hex: "#B3E5FF" },
{ name: "Ocean Tint 3", hex: "#8DD8FF" },
{ name: "Ocean Tint 4", hex: "#67CBFF" },
{ name: "Ocean Tint 5", hex: "#41BEFF" },

{ name: "Olive Shade 1", hex: "#F0F2D0" },
{ name: "Olive Shade 2", hex: "#E1E5A6" },
{ name: "Olive Shade 3", hex: "#D2D87B" },
{ name: "Olive Shade 4", hex: "#C3CC51" },
{ name: "Olive Shade 5", hex: "#B4BF26" },

{ name: "Peach Soft 1", hex: "#FFECD9" },
{ name: "Peach Soft 2", hex: "#FFD9B3" },
{ name: "Peach Soft 3", hex: "#FFC68D" },
{ name: "Peach Soft 4", hex: "#FFB367" },
{ name: "Peach Soft 5", hex: "#FFA041" },

{ name: "Pink Glow 1", hex: "#FFE6F2" },
{ name: "Pink Glow 2", hex: "#FFCCE5" },
{ name: "Pink Glow 3", hex: "#FFB3D8" },
{ name: "Pink Glow 4", hex: "#FF99CC" },
{ name: "Pink Glow 5", hex: "#FF80BF" },

{ name: "Purple Mist 1", hex: "#EEDCFF" },
{ name: "Purple Mist 2", hex: "#DCB8FF" },
{ name: "Purple Mist 3", hex: "#C994FF" },
{ name: "Purple Mist 4", hex: "#B670FF" },
{ name: "Purple Mist 5", hex: "#A34CFF" },

{ name: "Red Glow 1", hex: "#FFE0E0" },
{ name: "Red Glow 2", hex: "#FFB8B8" },
{ name: "Red Glow 3", hex: "#FF9090" },
{ name: "Red Glow 4", hex: "#FF6868" },
{ name: "Red Glow 5", hex: "#FF4040" },

{ name: "Royal Tint 1", hex: "#E0E6FF" },
{ name: "Royal Tint 2", hex: "#C2CCFF" },
{ name: "Royal Tint 3", hex: "#A3B3FF" },
{ name: "Royal Tint 4", hex: "#8599FF" },
{ name: "Royal Tint 5", hex: "#6680FF" },

{ name: "Saffron Light 1", hex: "#FFF3CC" },
{ name: "Saffron Light 2", hex: "#FFE699" },
{ name: "Saffron Light 3", hex: "#FFD966" },
{ name: "Saffron Light 4", hex: "#FFCC33" },
{ name: "Saffron Light 5", hex: "#FFBF00" },

{ name: "Seafoam Shade 1", hex: "#D9FFF2" },
{ name: "Seafoam Shade 2", hex: "#B3FFE5" },
{ name: "Seafoam Shade 3", hex: "#8DFFD8" },
{ name: "Seafoam Shade 4", hex: "#67FFCB" },
{ name: "Seafoam Shade 5", hex: "#41FFBE" },

{ name: "Sky Tint 1", hex: "#E6F7FF" },
{ name: "Sky Tint 2", hex: "#CCF0FF" },
{ name: "Sky Tint 3", hex: "#B3E8FF" },
{ name: "Sky Tint 4", hex: "#99E0FF" },
{ name: "Sky Tint 5", hex: "#80D8FF" },

{ name: "Sun Glow 1", hex: "#FFF2CC" },
{ name: "Sun Glow 2", hex: "#FFE699" },
{ name: "Sun Glow 3", hex: "#FFD966" },
{ name: "Sun Glow 4", hex: "#FFCC33" },
{ name: "Sun Glow 5", hex: "#FFBF00" },

{ name: "Tangerine Shade 1", hex: "#FFE8D6" },
{ name: "Tangerine Shade 2", hex: "#FFD1AD" },
{ name: "Tangerine Shade 3", hex: "#FFBA85" },
{ name: "Tangerine Shade 4", hex: "#FFA35C" },
{ name: "Tangerine Shade 5", hex: "#FF8C33" },

{ name: "Teal Glow 1", hex: "#D9FFFF" },
{ name: "Teal Glow 2", hex: "#B3FFFF" },
{ name: "Teal Glow 3", hex: "#8DFFFF" },
{ name: "Teal Glow 4", hex: "#67FFFF" },
{ name: "Teal Glow 5", hex: "#41FFFF" },

{ name: "Turquoise Light 1", hex: "#DFFFF7" },
{ name: "Turquoise Light 2", hex: "#BFFFEF" },
{ name: "Turquoise Light 3", hex: "#9FFFF7" },
{ name: "Turquoise Light 4", hex: "#7FFFFF" },
{ name: "Turquoise Light 5", hex: "#5FFFFF" },

{ name: "Violet Soft 1", hex: "#F0E0FF" },
{ name: "Violet Soft 2", hex: "#E0C2FF" },
{ name: "Violet Soft 3", hex: "#D0A3FF" },
{ name: "Violet Soft 4", hex: "#C085FF" },
{ name: "Violet Soft 5", hex: "#B066FF" },

{ name: "Warm Pink 1", hex: "#FFE6E6" },
{ name: "Warm Pink 2", hex: "#FFCCCC" },
{ name: "Warm Pink 3", hex: "#FFB3B3" },
{ name: "Warm Pink 4", hex: "#FF9999" },
{ name: "Warm Pink 5", hex: "#FF8080" },

{ name: "Yellow Soft 1", hex: "#FFFFE6" },
{ name: "Yellow Soft 2", hex: "#FFFFCC" },
{ name: "Yellow Soft 3", hex: "#FFFFB3" },
{ name: "Yellow Soft 4", hex: "#FFFF99" },
{ name: "Yellow Soft 5", hex: "#FFFF80" },

{ name: "Aero Blue", hex: "#C9FFE5" },
{ name: "Almond", hex: "#EFDECD" },
{ name: "Amber", hex: "#FFBF00" },
{ name: "Amethyst", hex: "#9966CC" },
{ name: "Apricot", hex: "#FBCEB1" },
{ name: "Aqua", hex: "#00FFFF" },
{ name: "Aquamarine", hex: "#7FFFD4" },
{ name: "Asphalt Gray", hex: "#353839" },
{ name: "Azure", hex: "#007FFF" },

{ name: "Banana Yellow", hex: "#FFE135" },
{ name: "Beige", hex: "#F5F5DC" },
{ name: "Bisque", hex: "#FFE4C4" },
{ name: "Black", hex: "#000000" },
{ name: "Blue", hex: "#0000FF" },
{ name: "Blue Gray", hex: "#6699CC" },
{ name: "Blue Sapphire", hex: "#126180" },
{ name: "Blush Pink", hex: "#F9D5D3" },
{ name: "Brick Red", hex: "#CB4154" },
{ name: "Bronze", hex: "#CD7F32" },
{ name: "Brown", hex: "#A52A2A" },
{ name: "Burgundy", hex: "#800020" },
{ name: "Burnt Orange", hex: "#CC5500" },
{ name: "Byzantine", hex: "#BD33A4" },

{ name: "Cadet Blue", hex: "#5F9EA0" },
{ name: "Canary Yellow", hex: "#FFEF00" },
{ name: "Caramel", hex: "#FFD59A" },
{ name: "Carnation Pink", hex: "#FFA6C9" },
{ name: "Celadon", hex: "#ACE1AF" },
{ name: "Cerise", hex: "#DE3163" },
{ name: "Cerulean", hex: "#007BA7" },
{ name: "Champagne", hex: "#F7E7CE" },
{ name: "Charcoal", hex: "#36454F" },
{ name: "Chartreuse", hex: "#7FFF00" },
{ name: "Cherry Red", hex: "#D2042D" },
{ name: "Chestnut", hex: "#954535" },
{ name: "Chocolate", hex: "#7B3F00" },
{ name: "Cinnabar", hex: "#E44D2E" },
{ name: "Cobalt Blue", hex: "#0047AB" },
{ name: "Coral", hex: "#FF7F50" },
{ name: "Cornflower Blue", hex: "#6495ED" },
{ name: "Cream", hex: "#FFFDD0" },
{ name: "Crimson", hex: "#DC143C" },
{ name: "Cyan", hex: "#00FFFF" },

{ name: "Daffodil", hex: "#FFFF31" },
{ name: "Dandelion", hex: "#F0E130" },
{ name: "Dark Blue", hex: "#00008B" },
{ name: "Dark Brown", hex: "#654321" },
{ name: "Dark Cyan", hex: "#008B8B" },
{ name: "Dark Gold", hex: "#B8860B" },
{ name: "Dark Gray", hex: "#A9A9A9" },
{ name: "Dark Green", hex: "#006400" },
{ name: "Dark Magenta", hex: "#8B008B" },
{ name: "Dark Olive", hex: "#556B2F" },
{ name: "Dark Orange", hex: "#FF8C00" },
{ name: "Dark Pink", hex: "#FF1493" },
{ name: "Dark Purple", hex: "#301934" },
{ name: "Dark Red", hex: "#8B0000" },
{ name: "Dark Teal", hex: "#014D4E" },
{ name: "Dark Turquoise", hex: "#00CED1" },
{ name: "Dark Violet", hex: "#9400D3" },
{ name: "Deep Blue", hex: "#0000A0" },
{ name: "Deep Green", hex: "#06470C" },
{ name: "Deep Pink", hex: "#FF1493" },
{ name: "Deep Purple", hex: "#673AB7" },

{ name: "Denim Blue", hex: "#1560BD" },
{ name: "Desert Sand", hex: "#EDC9AF" },
{ name: "Diamond Blue", hex: "#C8EBFA" },
{ name: "Dodger Blue", hex: "#1E90FF" },

{ name: "Emerald", hex: "#50C878" },
{ name: "Erin Green", hex: "#00FF3F" },

{ name: "Fern Green", hex: "#4F7942" },
{ name: "Fire Red", hex: "#FF2800" },
{ name: "Flame Orange", hex: "#E25822" },
{ name: "Flamingo Pink", hex: "#FC8EAC" },
{ name: "Forest Green", hex: "#228B22" },
{ name: "Fuchsia", hex: "#FF00FF" },

{ name: "Gold", hex: "#FFD700" },
{ name: "Golden Brown", hex: "#996515" },
{ name: "Golden Yellow", hex: "#FFDF00" },
{ name: "Grape Purple", hex: "#6F2DA8" },
{ name: "Gray", hex: "#808080" },
{ name: "Green", hex: "#008000" },
{ name: "Green Apple", hex: "#8DB600" },
{ name: "Gunmetal", hex: "#2C3539" },

{ name: "Harbor Blue", hex: "#046380" },
{ name: "Honey Yellow", hex: "#FFB300" },
{ name: "Hot Pink", hex: "#FF69B4" },

{ name: "Ice Blue", hex: "#D7F9FF" },
{ name: "Indigo", hex: "#4B0082" },
{ name: "Ivory", hex: "#FFFFF0" },

{ name: "Jade", hex: "#00A86B" },
{ name: "Jet Black", hex: "#343434" },

{ name: "Khaki", hex: "#F0E68C" },
{ name: "Kiwi Green", hex: "#8EE53F" },

{ name: "Lavender", hex: "#E6E6FA" },
{ name: "Lemon Yellow", hex: "#FFF44F" },
{ name: "Light Blue", hex: "#ADD8E6" },
{ name: "Light Gray", hex: "#D3D3D3" },
{ name: "Light Green", hex: "#90EE90" },
{ name: "Light Pink", hex: "#FFB6C1" },
{ name: "Lilac", hex: "#C8A2C8" },
{ name: "Lime", hex: "#00FF00" },
{ name: "Lime Green", hex: "#32CD32" },

{ name: "Magenta", hex: "#FF00FF" },
{ name: "Mahogany", hex: "#C04000" },
{ name: "Maroon", hex: "#800000" },
{ name: "Melon", hex: "#FEBAAD" },
{ name: "Midnight Blue", hex: "#191970" },
{ name: "Mint", hex: "#98FF98" },
{ name: "Mustard", hex: "#FFDB58" },

{ name: "Navy", hex: "#000080" },
{ name: "Neon Blue", hex: "#1B03A3" },
{ name: "Neon Green", hex: "#39FF14" },
{ name: "Neon Orange", hex: "#FF5F1F" },
{ name: "Neon Pink", hex: "#FF6EC7" },
{ name: "Neon Yellow", hex: "#FFFF33" },

{ name: "Ocean Blue", hex: "#4F42B5" },
{ name: "Olive", hex: "#808000" },
{ name: "Olive Green", hex: "#556B2F" },
{ name: "Onyx", hex: "#353839" },
{ name: "Orange", hex: "#FFA500" },
{ name: "Orchid", hex: "#DA70D6" },

{ name: "Pastel Blue", hex: "#AEC6CF" },
{ name: "Pastel Green", hex: "#77DD77" },
{ name: "Pastel Orange", hex: "#FFB347" },
{ name: "Pastel Pink", hex: "#FFD1DC" },
{ name: "Pastel Purple", hex: "#B39EB5" },
{ name: "Peach", hex: "#FFE5B4" },
{ name: "Pearl", hex: "#EAE0C8" },
{ name: "Periwinkle", hex: "#CCCCFF" },
{ name: "Persian Blue", hex: "#1C39BB" },
{ name: "Persian Green", hex: "#00A693" },
{ name: "Persian Pink", hex: "#F77FBE" },
{ name: "Pine Green", hex: "#01796F" },
{ name: "Pink", hex: "#FFC0CB" },
{ name: "Platinum", hex: "#E5E4E2" },
{ name: "Plum", hex: "#8E4585" },
{ name: "Powder Blue", hex: "#B0E0E6" },
{ name: "Pumpkin Orange", hex: "#FF7518" },
{ name: "Purple", hex: "#800080" },

{ name: "Raspberry", hex: "#E30B5C" },
{ name: "Red", hex: "#FF0000" },
{ name: "Rose", hex: "#FF007F" },
{ name: "Royal Blue", hex: "#4169E1" },
{ name: "Ruby Red", hex: "#9B111E" },
{ name: "Rust", hex: "#B7410E" },

{ name: "Saffron", hex: "#F4C430" },
{ name: "Sage", hex: "#BCB88A" },
{ name: "Salmon", hex: "#FA8072" },
{ name: "Sand", hex: "#C2B280" },
{ name: "Sapphire", hex: "#0F52BA" },
{ name: "Scarlet", hex: "#FF2400" },
{ name: "Sea Blue", hex: "#006994" },
{ name: "Sea Green", hex: "#2E8B57" },
{ name: "Shamrock Green", hex: "#009E60" },
{ name: "Silver", hex: "#C0C0C0" },
{ name: "Sky Blue", hex: "#87CEEB" },
{ name: "Slate Gray", hex: "#708090" },
{ name: "Snow", hex: "#FFFAFA" },
{ name: "Soft Pink", hex: "#F4C2C2" },
{ name: "Spring Green", hex: "#00FF7F" },
{ name: "Steel Blue", hex: "#4682B4" },
{ name: "Sunflower", hex: "#FFC512" },
{ name: "Sunset Orange", hex: "#FD5E53" },

{ name: "Tan", hex: "#D2B48C" },
{ name: "Tangerine", hex: "#F28500" },
{ name: "Teal", hex: "#008080" },
{ name: "Thistle", hex: "#D8BFD8" },
{ name: "Tomato Red", hex: "#FF6347" },
{ name: "Turquoise", hex: "#40E0D0" },

{ name: "Ultramarine", hex: "#3F00FF" },

{ name: "Vanilla", hex: "#F3E5AB" },
{ name: "Veridian", hex: "#43B3AE" },
{ name: "Vermillion", hex: "#E34234" },
{ name: "Violet", hex: "#EE82EE" },

{ name: "Wheat", hex: "#F5DEB3" },
{ name: "White", hex: "#FFFFFF" },
{ name: "Wine Red", hex: "#722F37" },

{ name: "Yellow", hex: "#FFFF00" },
{ name: "Yellow Green", hex: "#9ACD32" },
{ name: 'Multi-color', hex: 'linear-gradient(to right, red, orange, yellow, green, blue, indigo, violet)' }
].sort((a, b) => a.name.localeCompare(b.name));


// 3. Category Attributes
export const categoryAttributes = {
    // Note: All keys are Category IDs (as strings)
    // PARENT ID 7: womens unstiched
    '5': [ // 2 Pc Replica
        { name: "Replica Of (Brand)", type: "Text", options: "e.g., Sapphire, Khaadi, Maria B. Replica" },
        { name: "Fabric", type: "Enum", options: window.clothingFabricOptions },
        { name: "Work Type", type: "Enum", options: "Printed, Embroidered, Plain, Digital Print" },
        { name: "Occasion", type: "Enum", options: window.clothingOccasionOptions },
        { name: "Season", type: "Enum", options: "Summer, Winter, All-Season" },
        { name: "Embroidery Details", type: "Textarea", options: "e.g., Embroidered Neckline, Printed Back and Sleeves" },
        { name: "Shirt Cutting", type: "Measurement", units: ["Meters", "Yard"] },
        { name: "Trouser Cutting", type: "Measurement", units: ["Meters", "Yard"] },
        window.colorAttribute
    ],
    '6': [ // Kurti (This is likely Stitched)
        { name: "Brand", type: "Text", options: "e.g., Khaadi, Gul Ahmed, Limelight" },
        { name: "Fabric", type: "Enum", options: window.clothingFabricOptions },
        { name: "Pattern", type: "Enum", options: "Printed, Solid, Embroidered, Digital Print" },
        { name: "Occasion", type: "Enum", options: "Casual, Semi-Formal, Formal, Daily Wear" },
        { name: "Length Style", type: "Enum", options: "Short, Medium, Long, High-Low, A-Line" },
        { name: "Sleeve Type", type: "Enum", options: "Full Sleeves, Half Sleeves, Sleeveless, 3/4 Sleeves, Bell Sleeves" },
        { name: "Size", type: "Enum", options: "XS, S, M, L, XL, XXL" },
        ...window.menStitchedMeasurementAttributes,
        window.colorAttribute
    ],
    '8': [ // Saree
        { name: "Brand", type: "Text", options: "e.g., Generic, Designer" },
        { name: "Fabric", type: "Enum", options: "Silk, Chiffon, Georgette, Cotton, Net, Banarsi, Jacquard, Organza" },
        { name: "Work Type", type: "Enum", options: "Printed, Plain, Embroidered, Embellished, Woven, Zari Work" },
        { name: "Blouse Piece", type: "Enum", options: "Stitched, Unstitched, Not Included" },
        { name: "Occasion", type: "Enum", options: "Wedding, Party, Formal, Casual, Festive" },
        { name: "Length", type: "Measurement", units: ["Meters", "Yard"] },
        window.colorAttribute
    ],
    '19': [ // Shirt (Unstiched)
        { name: "Brand", type: "Text", options: "e.g., Khaadi, Gul Ahmed, Nishat Linen" },
        { name: "Fabric", type: "Enum", options: window.clothingFabricOptions },
        { name: "Pattern", type: "Enum", options: window.clothingPatternOptions },
        { name: "Occasion", type: "Enum", options: window.clothingOccasionOptions },
        { name: "Shirt Cutting", type: "Measurement", units: ["Meters", "Yard"] },
        window.colorAttribute
    ],
    '20': [ // Trousers (Unstiched)
        { name: "Brand", type: "Text", options: "e.g., Khaadi, Gul Ahmed, Alkaram Studio" },
        { name: "Fabric", type: "Enum", options: window.clothingFabricOptions },
        { name: "Pattern", type: "Enum", options: window.clothingPatternOptions },
        { name: "Trouser Cutting", type: "Measurement", units: ["Meters", "Yard"] },
        window.colorAttribute
    ],
    '43': [ // Women's 3 pC unstiched
        { name: "Brand", type: "Text", options: "e.g., Maria B, Sana Safinaz, Asim Jofa (Original or Replica)" },
        { name: "Collection Name", type: "Text", options: "e.g., Luxury Lawn '25, Eid Collection" },
        { name: "Fabric", type: "Enum", options: window.clothingFabricOptions },
        { name: "Pattern", type: "Enum", options: window.clothingPatternOptions },
        { name: "Work Type", type: "Enum", options: "Printed, Embroidered, Embellished, Digital Print" },
        { name: "Occasion", type: "Enum", options: window.clothingOccasionOptions },
        { name: "Season", type: "Enum", options: "Summer, Winter, Mid-Season, All-Season" },
        { name: "Shirt Cutting", type: "Measurement", units: ["Meters", "Yard"] },
        { name: "Trouser Cutting", type: "Measurement", units: ["Meters", "Yard"] },
        { name: "Dupatta Fabric", type: "Enum", options: "Chiffon, Silk, Organza, Net, Lawn, Cotton, Jacquard, Velvet" },
        { name: "Dupatta Cutting", type: "Measurement", units: ["Meters", "Yard"] },
        window.colorAttribute
    ],

    // PARENT ID 23: Womens Stiched
    '9': [ // Women's Hoodies
        { name: "Brand", type: "Text", options: "e.g., Outfitters, Breakout, ONE" },
        { name: "Fabric", type: "Enum", options: "Fleece, Cotton, Jersey, Terry, Velour" },
        { name: "Pattern", type: "Enum", options: "Plain, Printed, Embroidered, Tie-Dye, Graphic" },
        { name: "Style", type: "Enum", options: "Pullover, Zip-Up, Oversized, Cropped" },
        { name: "Season", type: "Enum", options: "Winter, Autumn, All Seasons" },
        { name: "Size", type: "Enum", options: "S, M, L, XL, XXL" },
        window.colorAttribute
    ],
    '10': [ // women's coat
        { name: "Brand", type: "Text", options: "e.g., Mango, Zara, Outfitters" },
        { name: "Fabric", type: "Enum", options: "Wool, Trench, Faux Fur, Tweed, Polyester, Cashmere" },
        { name: "Style", type: "Enum", options: "Overcoat, Pea Coat, Trench Coat, Blazer, Long Coat, Cape" },
        { name: "Length", type: "Enum", options: "Short, Mid-length, Long" },
        { name: "Occasion", type: "Enum", options: "Formal, Casual, Business, Party" },
        { name: "Size", type: "Enum", options: "S, M, L, XL" },
        window.colorAttribute
    ],
    '11': [ // Women's Sweaters
        { name: "Brand", type: "Text", options: "e.g., Outfitters, Cougar, Mango" },
        { name: "Material", type: "Enum", options: "Wool, Cotton, Cashmere, Acrylic, Merino, Blended" },
        { name: "Season", type: "Enum", options: "Winter, Autumn" },
        { name: "Type", type: "Enum", options: "Pullover, Cardigan, V-Neck, Crew-Neck, Turtleneck, High Neck" },
        { name: "Style", type: "Enum", options: "Cable Knit, Ribbed, Solid, Printed, Oversized" },
        { name: "Occasion", type: "Enum", options: "Casual, Formal, Daily Wear" },
        { name: "Size", type: "Enum", options: "S, M, L, XL" },
        window.colorAttribute
    ],
    '12': [ // 3Pc Replica (Stiched)
        { name: "Replica Of (Brand)", type: "Text", options: "e.g., Asim Jofa, Baroque, Sana Safinaz Replica" },
        { name: "Fabric", type: "Enum", options: window.clothingFabricOptions },
        { name: "Pattern", type: "Enum", options: window.clothingPatternOptions },
        { name: "Work Type", type: "Enum", options: "Printed, Embroidered, Embellished" },
        { name: "Size", type: "Enum", options: "S, M, L, XL" },
        ...window.menStitchedMeasurementAttributes,
        ...window.menTrouserMeasurementAttributes,
        { name: "Dupatta Fabric", type: "Enum", options: "Chiffon, Silk, Organza, Net, Lawn, Cotton" },
        window.colorAttribute
    ],
    '13': [ // Maxi
        { name: "Brand", type: "Text", options: "e.g., Generic, Boutique" },
        { name: "Fabric", type: "Enum", options: "Chiffon, Georgette, Silk, Net, Lawn, Organza, Velvet" },
        { name: "Style", type: "Enum", options: "Flared, A-Line, Gown, Anarkali, Pleated, Peplum" },
        { name: "Occasion", type: "Enum", options: "Wedding, Party, Formal, Festive, Bridal" },
        { name: "Length", type: "Measurement", units: ["Inches"] },
        { name: "Flair", type: "Measurement", units: ["Inches"] },
        { name: "Size", type: "Enum", options: "S, M, L, XL" },
        window.colorAttribute
    ],
    '14': [ // Dupatta
        { name: "Brand", type: "Text", options: "e.g., Generic, Khaadi" },
        { name: "Fabric", type: "Enum", options: "Chiffon, Silk, Organza, Net, Lawn, Cotton, Georgette, Crinkle, Velvet, Khaddar" },
        { name: "Pattern", type: "Enum", options: "Printed, Plain, Embroidered, Embellished, Crushed, Tie-Dye, Block Print" },
        { name: "Length", type: "Measurement", units: ["Meters", "Yard"] },
        { name: "Width", type: "Measurement", units: ["Meters", "Yard"] },
        window.colorAttribute
    ],
    '15': [ // Women's Kurta
        { name: "Brand", type: "Text", options: "e.g., Limelight, Ethnic, Khaadi" },
        { name: "Fabric", type: "Enum", options: window.clothingFabricOptions },
        { name: "Pattern", type: "Enum", options: window.clothingPatternOptions },
        { name: "Occasion", type: "Enum", options: "Casual, Semi-Formal, Formal, Daily Wear" },
        { name: "Size", type: "Enum", options: "S, M, L, XL, XXL" },
        ...window.menStitchedMeasurementAttributes,
        window.colorAttribute
    ],
    '16': [ // Lehnga
        { name: "Brand", type: "Text", options: "e.g., Generic, Designer" },
        { name: "Fabric", type: "Enum", options: "Banarsi, Silk, Net, Velvet, Jamawar, Organza, Raw Silk" },
        { name: "Components", type: "Enum", options: "Lehenga Choli, Lehenga with Kurti, 3-Piece Set" },
        { name: "Work Type", type: "Enum", options: "Embroidered, Hand Embellished, Zari, Dabka, Sequin" },
        { name: "Occasion", type: "Enum", options: "Wedding, Bridal, Party, Festive, Mehndi" },
        { name: "Lehenga Length", type: "Measurement", units: ["Inches"] },
        { name: "Choli Length", type: "Measurement", units: ["Inches"] },
        { name: "Size", type: "Enum", options: "S, M, L, XL, Unstitched" },
        window.colorAttribute
    ],
    '17': [ // Swimwear
        { name: "Brand", type: "Text", options: "e.g., Speedo, Adidas, Local" },
        { name: "Material", type: "Enum", options: "Nylon, Spandex, Polyester, Lycra" },
        { name: "Type", type: "Enum", options: "One-Piece, Bikini, Tankini, Burkini, Swim Shorts" },
        { name: "Features", type: "Text", options: "e.g., UV Protection, Quick-Dry, Padded, Chlorine Resistant" },
        { name: "Size", type: "Enum", options: "S, M, L, XL" },
        window.colorAttribute
    ],
    '24': [ // shirts (Stiched)
        { name: "Brand", type: "Text", options: "e.g., Generation, Alkaram, Limelight" },
        { name: "Fabric", type: "Enum", options: window.clothingFabricOptions },
        { name: "Pattern", type: "Enum", options: window.clothingPatternOptions },
        { name: "Style", type: "Enum", options: "Tunic, Peplum, Straight, A-Line, Frock, Angrakha, Kaftan" },
        { name: "Size", type: "Enum", options: "S, M, L, XL, XXL" },
        ...window.menStitchedMeasurementAttributes,
        window.colorAttribute
    ],
    '26': [ // Sleep Wears
        { name: "Brand", type: "Text", options: "e.g., Zivame, Victoria's Secret, Local" },
        { name: "Fabric", type: "Enum", options: "Cotton, Silk, Satin, Fleece, Jersey, Viscose, Flannel" },
        { name: "Type", type: "Enum", options: "Pajama Set, Night Gown, Robe, Shorts Set, Night Suit" },
        { name: "Season", type: "Enum", options: "Summer, Winter, All Seasons" },
        { name: "Size", type: "Enum", options: "S, M, L, XL" },
        window.colorAttribute
    ],
    '27': [ // 2PC Replica (Stiched)
        { name: "Replica Of (Brand)", type: "Text", options: "e.g., Sana Safinaz, Maria B. Replica" },
        { name: "Fabric", type: "Enum", options: window.clothingFabricOptions },
        { name: "Pattern", type: "Enum", options: window.clothingPatternOptions },
        { name: "Work Type", type: "Enum", options: "Printed, Embroidered, Embellished" },
        { name: "Size", type: "Enum", options: "S, M, L, XL" },
        ...window.menStitchedMeasurementAttributes,
        ...window.menTrouserMeasurementAttributes,
        window.colorAttribute
    ],
    '91': [ // West (Western Wear)
        { name: "Brand", type: "Text", options: "e.g., Outfitters, Mango, Breakout, ONE" },
        { name: "Item Type", type: "Enum", options: "Tops, Jeans, Dresses, Skirts, Jumpsuits, Blouses, Co-ord Set" },
        { name: "Fabric", type: "Enum", options: "Denim, Cotton, Viscose, Polyester, Rib, Georgette, Crepe, Linen" },
        { name: "Style", type: "Enum", options: "Casual, Chic, Formal, Party, Streetwear, Bohemian" },
        { name: "Size", type: "Enum", options: "XS, S, M, L, XL, UK 8, UK 10, UK 12" },
        window.colorAttribute
    ],
    '281': [ // Trousers (Stiched)
        { name: "Brand", type: "Text", options: "e.g., Limelight, Khaadi, Generation" },
        { name: "Fabric", type: "Enum", options: "Cotton, Linen, Silk, Cambric, Raw Silk, Karandi, Denim" },
        { name: "Style", type: "Enum", options: "Straight, Bootcut, Flared, Culottes, Tulip, Gharara Pants, Shalwar" },
        { name: "Fit", type: "Enum", options: "Regular, Slim Fit, Loose" },
        { name: "Size", type: "Enum", options: "S, M, L, XL" },
        ...window.menTrouserMeasurementAttributes,
        window.colorAttribute
    ],
    '282': [ // Women's Tracksuits
        { name: "Brand", type: "Text", options: "e.g., Nike, Adidas, Local Brand" },
        { name: "Fabric", type: "Enum", options: "Fleece, Terry, Velour, Polyester, Cotton Blend" },
        { name: "Style", type: "Enum", options: "Hoodie Set, Sweatshirt Set, Zip-Up Set" },
        { name: "Number of Pieces", type: "Enum", options: "2, 3" },
        { name: "Size", type: "Enum", options: "S, M, L, XL" },
        window.colorAttribute
    ],
    '283': [ // Sweater and shirts
        { name: "Brand", type: "Text", options: "e.g., Mango, Outfitters, Cougar" },
        { name: "Type", type: "Enum", options: "Sweater, Sweatshirt, T-Shirt, High Neck, Cardigan" },
        { name: "Fabric", type: "Enum", options: "Wool, Cotton, Fleece, Knitted, Acrylic" },
        { name: "Neck Type", type: "Enum", options: window.clothingNeckTypeOptions },
        { name: "Size", type: "Enum", options: "S, M, L, XL" },
        window.colorAttribute
    ],

    // PARENT ID 25: Men's Unstiched
    '28': [ // Cotton
        { name: "Brand", type: "Text", options: "e.g., Gul Ahmed, J., Alkaram Studio" },
        { name: "Fabric", type: "Enum", options: "Cotton, Egyptian Cotton, Pima Cotton, Latha" },
        { name: "Pattern", type: "Enum", options: "Solid, Self-Design, Check, Stripe" },
        { name: "Thread Count", type: "Text", options: "e.g., 200 TC" },
        { name: "Suit Cutting", type: "Measurement", units: ["Meters", "Yard"], options: "e.g., 4.5 Meters" },
        window.colorAttribute
    ],
    '112': [ // khaddar
        { name: "Brand", type: "Text", options: "e.g., Khaadi, Nishat Linen, J." },
        { name: "Fabric", type: "Enum", options: "Khaddar, Slub Khaddar" },
        { name: "Pattern", type: "Enum", options: "Solid, Self-Design, Striped" },
        { name: "Season", type: "Enum", options: "Winter" },
        { name: "Suit Cutting", type: "Measurement", units: ["Meters", "Yard"], options: "e.g., 4.5 Meters" },
        window.colorAttribute
    ],
    '113': [ // Boski
        { name: "Brand", type: "Text", options: "e.g., Grace, Nawab, Generic" },
        { name: "Fabric", type: "Enum", options: "Boski, Spun Silk, Blended" },
        { name: "Thread Count / Weight", type: "Text", options: "e.g., 8 lb, 10 lb, 6 lb" },
        { name: "Suit Cutting", type: "Measurement", units: ["Meters", "Yard"], options: "e.g., 7 Meters" },
        window.colorAttribute
    ],
    '114': [ // Wool
        { name: "Brand", type: "Text", options: "e.g., Lawrencepur, Uniworth, Grace" },
        { name: "Fabric", type: "Enum", options: "Wool, Cashmere, Merino, Tweed, Tropical Wool" },
        { name: "Pattern", type: "Enum", options: "Solid, Check, Pinstripe, Herringbone" },
        { name: "Suit Cutting", type: "Measurement", units: ["Meters", "Yard"], options: "e.g., 4.5 Meters" },
        window.colorAttribute
    ],
    '115': [ // wash & wear
        { name: "Brand", type: "Text", options: "e.g., Gul Ahmed, Alkaram, J." },
        { name: "Fabric", type: "Enum", options: "Wash & Wear, Polyester Blend, Viscose Blend" },
        { name: "Pattern", type: "Enum", options: "Solid, Self-Design, Textured" },
        { name: "Finish", type: "Enum", options: "Soft, Crisp, Medium, Wrinkle-Free" },
        { name: "Season", type: "Enum", options: "All Seasons, Summer" },
        { name: "Suit Cutting", type: "Measurement", units: ["Meters", "Yard"], options: "e.g., 4.5 Meters" },
        window.colorAttribute
    ],
    '116': [ // Men's Orignal
        { name: "Brand", type: "Text", options: "e.g., J., Gul Ahmed, Khaadi, Nishat" },
        { name: "Fabric", type: "Enum", options: window.clothingFabricOptions },
        { name: "Collection", type: "Text", options: "e.g., Summer '25, Eid Collection" },
        { name: "Pattern", type: "Enum", options: "Solid, Self-Design, Embroidered" },
        { name: "Suit Cutting", type: "Measurement", units: ["Meters", "Yard"], options: "e.g., 4.5 Meters" },
        window.colorAttribute
    ],
    '117': [ // Silk
        { name: "Brand", type: "Text", options: "e.g., Grace, Generic" },
        { name: "Fabric", type: "Enum", options: "Silk, Raw Silk, Blended Silk" },
        { name: "Pattern", type: "Enum", options: "Solid, Jacquard" },
        { name: "Occasion", type: "Enum", options: "Wedding, Formal, Festive" },
        { name: "Suit Cutting", type: "Measurement", units: ["Meters", "Yard"], options: "e.g., 4.5 Meters" },
        window.colorAttribute
    ],
    '118': [ // Karandi
        { name: "Brand", type: "Text", options: "e.g., Nishat, Khaadi, J." },
        { name: "Fabric", type: "Enum", options: "Karandi, Cotton Karandi, Blended Karandi" },
        { name: "Pattern", type: "Enum", options: "Solid, Self-Design, Striped" },
        { name: "Season", type: "Enum", options: "Winter, Mid-Season" },
        { name: "Suit Cutting", type: "Measurement", units: ["Meters", "Yard"], options: "e.g., 4.5 Meters" },
        window.colorAttribute
    ],

    // PARENT ID 34: electronic and Accessories
    '18': [ // Mobile Accessories
        { name: "Brand", type: "Text", options: "e.g., Anker, Baseus, Generic, Spigen" },
        { name: "Accessory Type", type: "Enum", options: "Case, Screen Protector, Charger, Cable, Holder, Power Bank, Lens Protector, Earphone" },
        { name: "Material", type: "Enum", options: "Plastic, Silicone, Metal, Glass, Leather, TPU, Nylon" },
        window.colorAttribute,
        { name: "Compatibility", type: "Text", options: "e.g., iPhone 15 Pro, Samsung S24, Universal" },
        { name: "Features", type: "Text", options: "e.g., Fast Charging, Magsafe Compatible, Shockproof, 9H Hardness, Braided Cable" }
    ],
    '29': [ // Smart Watches
        { name: "Brand", type: "Text", options: "e.g., Xiaomi, Haylou, Generic, Apple, Samsung" },
        { name: "Model", type: "Text", options: "e.g., Watch 9, T800 Ultra" },
        { name: "Display Type", type: "Enum", options: "AMOLED, LCD, OLED, E-Ink, TFT" },
        { name: "Screen Size", type: "Text", options: "e.g., 1.99 inch, 44mm" },
        { name: "Strap Material", type: "Enum", options: "Silicone, Leather, Stainless Steel, Nylon" },
        { name: "Compatibility", type: "Enum", options: "iOS, Android, Both" },
        { name: "Water Resistance", type: "Enum", options: "IP67, IP68, 5 ATM, Not Resistant" },
        { name: "GPS", type: "Enum", options: "Yes (Built-in), Yes (Connected), No" },
        { name: "Features", type: "Textarea", options: "e.g., Heart Rate Monitor, Blood Oxygen, Bluetooth Calling, NFC, Multiple Sports Modes" },
        { name: "Battery Life", type: "Text", options: "e.g., Up to 7 days" },
        window.colorAttribute
    ],
    '32': [ // speaker
        { name: "Brand", type: "Text", options: "e.g., Anker, JBL, Generic, Audionic" },
        ...window.detailedElectronicsAttributes,
        { name: "Speaker Type", type: "Enum", options: "Portable Speaker, Soundbar, Home Theater, Subwoofer" },
        { name: "Power Source", type: "Enum", options: "Battery, AC Power, USB" },
        { name: "Features", type: "Text", options: "e.g., Portable, Waterproof, RGB Lights, TWS Function, FM Radio, Mic Input" }
    ],
    '35': [ // Chargers and Cables
        { name: "Brand", type: "Text", options: "e.g., Anker, UGreen, Baseus, Apple, Samsung" },
        { name: "Item Type", type: "Enum", options: "Wall Charger, Car Charger, Charging Cable, Charging Dock, Wireless Charger" },
        { name: "Material", type: "Enum", options: "Braided Nylon, PVC, Silicone, TPE" },
        { name: "Connector Type", type: "Enum", options: "USB-A to C, C to C, C to Lightning, Micro-USB" },
        { name: "Product Feature", type: "Text", options: "e.g., Fast Charging, Data Transfer, GaN Technology, MFi Certified" },
        window.colorAttribute,
        { name: "Watts", type: "Number", options: "e.g., 25, 65, 100" },
        { name: "Length", type: "Measurement", units: ["m", "ft", "cm"] }
    ],
    '36': [ // Power Banks
        { name: "Brand", type: "Text", options: "e.g., Anker, Xiaomi, Romoss, Baseus" },
        { name: "Battery Capacity (mAh)", type: "Enum", options: "5000, 10000, 20000, 30000, 50000" },
        { name: "Number of Ports", type: "Enum", options: "1, 2, 3, 4" },
        { name: "Output Power", type: "Text", options: "e.g., 22.5W, 65W, 100W" },
        { name: "Features", type: "Text", options: "e.g., Fast Charging (PD), Digital Display, Wireless Charging, Built-in Cable, Magsafe" },
        window.colorAttribute
    ],
    '37': [ // Ring light
        { name: "Brand", type: "Text", options: "e.g., Generic" },
        { name: "Material", type: "Enum", options: "ABS Plastic, Aluminum Alloy" },
        { name: "Ring Diameter", type: "Measurement", units: ["Inches", "cm"] },
        { name: "Tripod Height", type: "Text", options: "e.g., 7 ft" },
        { name: "Features", type: "Text", options: "e.g., 3 Light Modes, Adjustable brightness, Bluetooth Remote, Phone Holder" },
        { name: "Light Colors", type: "Enum", options: "Warm White, Cool White, Daylight, RGB" },
        { name: "Power Source", type: "Enum", options: "USB Powered" }
    ],
    '38': [ // Tripods and stands
        { name: "Brand", type: "Text", options: "e.g., Generic, Ulanzi, Digipod" },
        { name: "Material", type: "Enum", options: "Aluminum Alloy, Carbon Fiber, Plastic" },
        { name: "Compatible With", type: "Textarea", options: "e.g., DSLR, Mobile Phones, Ring Lights, Projectors" },
        { name: "Max Height", type: "Text", options: "e.g., 7 ft, 210 cm" },
        { name: "Features", type: "Text", options: "e.g., Adjustable Height, 360 Rotation, Bluetooth Remote, Lightweight, Carry Bag Included" }
    ],
    '39': [ // Computers and Accessories
        { name: "Brand", type: "Text", options: "e.g., Logitech, HP, Dell, Razer, Apple" },
        { name: "Accessory Type", type: "Enum", options: "Keyboard, Mouse, Webcam, USB Hub, Laptop Stand, Mousepad, Graphics Card, RAM" },
        { name: "Features", type: "Textarea", options: "e.g., RGB Lighting, Silent Keys, DPI Adjustment, Wireless, Mechanical Keyboard" },
        { name: "Connectivity", type: "Enum", options: "Wired, Wireless, Bluetooth" },
        { name: "RAM", type: "Text", options: "e.g., 16GB DDR4 3200MHz" },
        { name: "Storage", type: "Text", options: "e.g., 1TB NVMe SSD" },
        { name: "GPU", type: "Text", options: "e.g., NVIDIA RTX 3060 8GB" },
        { name: "Screen Size", type: "Text", options: "e.g., 27 inch" }
    ],
    '40': [ // Headphones and... (Headsets)
        { name: "Brand", type: "Text", options: "e.g., Audionic, Sony, Generic, Apple, Anker" },
        { name: "Model", type: "Text", options: "e.g., M10 TWS, WH-1000XM5, AirPods Pro" },
        { name: "Wearing Type", type: "Enum", options: "In-Ear, On-Ear, Over-Ear, TWS, Neckband" },
        { name: "Features", type: "Textarea", options: "e.g., Active Noise Cancellation (ANC), Touch Controls, Gaming Mode, Environmental Noise Cancellation (ENC), Water Resistant" },
        { name: "Microphone", type: "Enum", options: "Yes, No, Built-in" },
        { name: "Bluetooth Version", type: "Enum", options: "5.0, 5.1, 5.2, 5.3" },
        { name: "Play Time (Hours)", type: "Number", options: "e.g., 5" },
        { name: "Battery Capacity (mAh)", type: "Number", options: "e.g., 50 (earbud), 2000 (case)" },
        window.colorAttribute
    ],
    '92': [ // mobile and laptop Bags
        { name: "Brand", type: "Text", options: "e.g., HP, Dell, Generic, Anker" },
        { name: "Bag Type", type: "Enum", options: "Backpack, Sleeve, Briefcase, Messenger Bag" },
        { name: "Material", type: "Enum", options: "Nylon, Polyester, Canvas, Leather, Faux Leather, PU" },
        { name: "Compatible Size", type: "Text", options: "e.g., Fits up to 15.6-inch laptop" },
        { name: "Features", type: "Text", options: "e.g., Waterproof, Padded Compartment, USB Charging Port, Anti-theft" },
        window.colorAttribute
    ],
    '95': [ // Handfree
        { name: "Brand", type: "Text", options: "e.g., Apple, Samsung, Audionic, Baseus, Ronin" },
        { name: "Type", type: "Enum", options: "Wired Earphones, Neckband, True Wireless (TWS)" },
        { name: "Microphone", type: "Enum", options: "Yes, No, In-line" },
        { name: "Connector", type: "Enum", options: "3.5mm Jack, Type-C, Lightning, Bluetooth" },
        { name: "Features", type: "Text", options: "e.g., Noise Isolation, Tangle-Free Cable, Extra Bass, Environmental Noise Cancellation (ENC)" },
        window.colorAttribute
    ],
    '266': [ // Mobile Covers
        { name: "Brand", type: "Text", options: "e.g., Spigen, Generic, Local" },
        { name: "Material Type", type: "Enum", options: "Silicone, Hard Plastic (PC), TPU, Leather, Fabric, Glass Back, Rubber" },
        { name: "Compatible Model", type: "Text", options: "e.g., iPhone 14 Pro, Samsung S23 Ultra, Tecno Spark 20" },
        { name: "Design", type: "Enum", options: "Transparent, Printed, Rugged, Wallet Case, Matte Finish, Bumper Case" },
        { name: "Features", type: "Text", options: "e.g., Shockproof, Camera Protection, Card Holder, Magsafe Compatible, With Stand" },
        window.colorAttribute
    ],

    // PARENT ID 21: Cosmetics
    '22': [ // Skin Care
        { name: "Brand", type: "Text", options: "e.g., The Ordinary, CeraVe, Rivaj UK, Saeed Ghani, Ponds" },
        { name: "Product Type", type: "Enum", options: "Moisturizer, Serum, Cleanser, Sunscreen, Face Mask, Toner, Face Wash, Scrub" },
        { name: "Skin Type", type: "Enum", options: "All Skin Types, Oily, Dry, Combination, Sensitive, Normal, Acne-prone" },
        { name: "Concern", type: "Enum", options: "Acne, Dryness, Pigmentation, Aging, Pores, Redness, Brightening" },
        { name: "Volume (ml)", type: "Number", options: "e.g., 50" },
        { name: "SPF", type: "Number", options: "e.g., 30, 50, 60, 90" },
        { name: "Key Ingredients", type: "Text", options: "e.g., Hyaluronic Acid, Vitamin C, Niacinamide, Salicylic Acid" }
    ],
    '93': [ // Hair dryers
        { name: "Brand", type: "Text", options: "e.g., Philips, Remington, Panasonic, Dyson, Kemei" },
        { name: "Power (Watts)", type: "Number", options: "e.g., 1800, 2200, 3000" },
        { name: "Features", type: "Text", options: "e.g., Cool Shot Button, Ionic Technology, Diffuser attachment, Foldable" },
        { name: "Heat Settings", type: "Enum", options: "2, 3, 4" },
        { name: "Speed Settings", type: "Enum", options: "1, 2, 3" },
        { name: "Attachments", type: "Text", options: "e.g., Concentrator Nozzle, Diffuser" }
    ],
    '96': [ // Shavers and trimmers
        { name: "Brand", type: "Text", options: "e.g., Philips, Kemei, Braun, Panasonic, VGR" },
        { name: "Type", type: "Enum", options: "Shaver, Trimmer, Grooming Kit, Body Groomer, Nose Trimmer" },
        { name: "Power Source", type: "Enum", options: "Rechargeable, Corded, Cordless, Battery Operated" },
        { name: "Blade Material", type: "Enum", options: "Stainless Steel, Titanium, Ceramic" },
        { name: "Features", type: "Text", options: "e.g., Waterproof, Multiple Length Settings, Self-sharpening blades, Digital Display" },
        { name: "Usage Time", type: "Text", options: "e.g., 90 mins" }
    ],
    '97': [ // Hair Care
        { name: "Brand", type: "Text", options: "e.g., L'Oreal, Sunsilk, Head & Shoulders, Olaplex, Garnier" },
        { name: "Product Type", type: "Enum", options: "Shampoo, Conditioner, Hair Oil, Serum, Mask, Hairspray, Hair Color" },
        { name: "Hair Concern", type: "Enum", options: "Hair Fall, Dandruff, Dryness, Damage Repair, Frizz Control, Color Protection" },
        { name: "Hair Type", type: "Enum", options: "All Hair Types, Oily, Dry, Colored, Fine, Thick" },
        { name: "Volume (ml)", type: "Number", options: "e.g., 250, 500" },
    ],
    '98': [ // Curler and straightners
        { name: "Brand", type: "Text", options: "e.g., Remington, Philips, Kemei, Dyson, VGR" },
        { name: "Tool Type", type: "Enum", options: "Straightener, Curler, 2-in-1, Hair Crimper, Hair Dryer Brush" },
        { name: "Plate Material", type: "Enum", options: "Ceramic, Titanium, Tourmaline, Keratin Coated" },
        { name: "Max Temperature (°C)", type: "Number", options: "e.g., 230" },
        { name: "Features", type: "Text", options: "e.g., Digital Display, Auto Shut-off, Adjustable Temperature, Swivel Cord" },
    ],
    '99': [ // K- Beauty
        { name: "Brand", type: "Text", options: "e.g., Cosrx, Innisfree, Laneige, Some By Mi" },
        { name: "Product Type", type: "Enum", options: "Essence, Ampoule, Sheet Mask, BB Cream, Cushion Foundation, Lip Tint, Pimple Patch" },
        { name: "Skin Type", type: "Enum", options: "All Skin Types, Oily, Dry, Combination, Sensitive" },
        { name: "Concern", type: "Enum", options: "Acne, Hydration, Brightening, Anti-Aging" },
        { name: "Volume (ml)", type: "Number", options: "e.g., 100" }
    ],
    '100': [ // Face (Makeup)
        { name: "Brand", type: "Text", options: "e.g., Maybelline, Huda Beauty, Fenty Beauty, Miss Rose, Rivaj UK" },
        { name: "Product Type", type: "Enum", options: "Foundation, Concealer, Primer, Blush, Highlighter, Contour, Setting Spray, Powder, BB Cream" },
        { name: "Shade/Color", type: "Text", options: "e.g., Ivory, Rose Pink, Beige" },
        { name: "Formulation", type: "Enum", options: "Cream, Powder, Liquid, Stick, Mousse" },
        { name: "Skin Type", type: "Enum", options: "All Skin Types, Oily, Dry, Combination" }
    ],
    '101': [ // Serum and oil
        { name: "Brand", type: "Text", options: "e.g., The Ordinary, L'Oreal, Garnier, Rivaj UK" },
        { name: "Product Type", type: "Enum", options: "Face Serum, Hair Serum, Face Oil, Hair Oil" },
        { name: "Concern", type: "Text", options: "e.g., Brightening, Anti-Aging, Hydration, Frizz Control, Hair Growth" },
        { name: "Key Ingredient", type: "Text", options: "e.g., Vitamin C, Hyaluronic Acid, Retinol, Argan Oil" },
        { name: "Volume (ml)", type: "Number", options: "e.g., 30" },
    ],
    '102': [ // Lips
        { name: "Brand", type: "Text", options: "e.g., Maybelline, MAC, Huda Beauty, Rare Beauty, Miss Rose" },
        { name: "Product Type", type: "Enum", options: "Lipstick, Lip Gloss, Lip Liner, Liquid Lipstick, Lip Tint, Lip Balm" },
        { name: "Finish", type: "Enum", options: "Matte, Satin, Glossy, Creamy, Velvet, Metallic" },
        { name: "Shade/Color", type: "Text", options: "e.g., Ruby Woo, Nude Pink, Plum Red" },
    ],
    '103': [ // Hair Remover
        { name: "Brand", type: "Text", options: "e.g., Philips, Veet, Braun, Kemei" },
        { name: "Product Type", type: "Enum", options: "Wax Strips, Hair Removal Cream, Epilator, Trimmer, Razor, Hot Wax" },
        { name: "Body Area", type: "Enum", options: "Face, Body, Legs, Arms, Bikini Line, Underarms" },
    ],
    '104': [ // Grooming Accessories
        { name: "Accessory Type", type: "Enum", options: "Tweezers, Nail Clippers, Blackhead Remover, Shaving Brush, Manicure Kit, Pedicure Kit" },
        { name: "Material", type: "Enum", options: "Stainless Steel, Plastic" },
    ],
    '105': [ // Makeup Accessories
        { name: "Accessory Type", type: "Enum", options: "Makeup Brush Set, Beauty Blender, Eyelash Curler, Powder Puff, Makeup Bag, Brush Cleaner" },
        { name: "Material", type: "Enum", options: "Synthetic Bristles, Natural Hair, Sponge, Silicone" },
    ],
    '106': [ // Eyes (Makeup)
        { name: "Brand", type: "Text", options: "e.g., Huda Beauty, Maybelline, Tarte, Miss Rose" },
        { name: "Product Type", type: "Enum", options: "Eyeshadow Palette, Mascara, Eyeliner, Kajal, Eyebrow Pencil, False Eyelashes, Concealer" },
        { name: "Shade/Color", type: "Text", options: "e.g., Jet Black, Nude Tones, Smokey, Brown" },
        { name: "Features", type: "Text", options: "e.g., Waterproof, Volumizing, Smudge-proof, Long-lasting" },
    ],
    '107': [ // Bundles
        { name: "Brand", type: "Text", options: "e.g., Rivaj UK, Huda Beauty, Local" },
        { name: "Bundle Type", type: "Enum", options: "Makeup Kit, Skincare Set, Haircare Combo, Fragrance Set" },
        { name: "Contains", type: "Textarea", options: "e.g., 1x Foundation, 1x Lipstick, 1x Mascara" },
    ],
    '108': [ // Personal Care
        { name: "Brand", type: "Text", options: "e.g., Dove, Nivea, Vaseline, Lifebuoy" },
        { name: "Product Type", type: "Enum", options: "Body Wash, Lotion, Deodorant, Hand Sanitizer, Soap, Body Scrub, Talcum Powder" },
        { name: "Scent", type: "Text", options: "e.g., Shea Butter, Lavender, Unscented, Rose" },
        { name: "Volume (ml/g)", type: "Text", options: "e.g., 250ml, 100g" },
    ],
    '109': [ // Nails
        { name: "Brand", type: "Text", options: "e.g., Essie, OPI, Generic, Miss Rose" },
        { name: "Product Type", type: "Enum", options: "Nail Polish, Top Coat, Base Coat, Nail Art Kit, Fake Nails, Cuticle Oil, Nail Polish Remover" },
        { name: "Shade/Color", type: "Text", options: "e.g., Cherry Red, French Manicure, Nude" },
        { name: "Finish", type: "Enum", options: "Glossy, Matte, Glitter, Chrome, Gel" },
    ],
    '110': [ // Mehndi
        { name: "Type", type: "Enum", options: "Henna Cone, Instant Mehndi, Organic Henna Powder" },
        { name: "Color", type: "Enum", options: "Reddish Brown, Dark Brown, Black, White Henna" },
        { name: "Weight (g)", type: "Number", options: "e.g., 25" },
    ],

    // PARENT ID 41: Festive Collections
    '42': [ // Fancey Dresses
        { name: "Brand", type: "Text", options: "e.g., Asim Jofa, Maria B., Khaadi, Baroque" },
        { name: "Fabric", type: "Enum", options: "Chiffon, Net, Silk, Jamawar, Organza, Raw Silk, Velvet" },
        { name: "Work Type", type: "Enum", options: "Embroidery, Hand Embellishment, Zari, Tilla, Sequin, Mirror Work, Dabka" },
        { name: "Number of Pieces", type: "Enum", options: "1, 2, 3, 4" },
        { name: "Stitching", type: "Enum", options: "Stitched, Unstitched" },
        { name: "Occasion", type: "Enum", options: "Wedding, Party, Eid, Formal, Bridal" },
        { name: "Size (if stitched)", type: "Enum", options: "S, M, L, XL" },
        window.colorAttribute
    ],
    '206': [ // Nikkah Dupatta
        { name: "Brand", type: "Text", options: "e.g., Generic, Designer" },
        { name: "Fabric", type: "Enum", options: "Net, Organza, Silk, Chiffon" },
        { name: "Work Type", type: "Enum", options: "Embroidered, Sequin Work, Lace Border, Stone Work, 'Qabool Hai' Embroidery" },
        { name: "Color", type: "Text", options: "e.g., Red, Off-white, Gold, Pink" },
        { name: "Length", type: "Measurement", units: ["Meters", "Yard"] },
    ],
    '207': [ // Fancy Stiched
        { name: "Brand", type: "Text", options: "e.g., Limelight, Sapphire, Ethnic" },
        { name: "Fabric", type: "Enum", options: "Chiffon, Net, Silk, Jamawar, Organza, Raw Silk" },
        { name: "Work Type", type: "Enum", options: "Embroidery, Hand Embellishment, Zari, Tilla, Sequin" },
        { name: "Number of Pieces", type: "Enum", options: "1 (Kurta), 2 (Kurta & Trouser), 3 (with Dupatta)" },
        { name: "Size", type: "Enum", options: "S, M, L, XL" },
        window.colorAttribute
    ],
    '208': [ // 2 pc Stiched (Fancy)
        { name: "Brand", type: "Text", options: "e.g., Ethnic, Generation, Limelight" },
        { name: "Fabric", type: "Enum", options: "Chiffon, Net, Silk, Jamawar, Organza, Raw Silk" },
        { name: "Work Type", type: "Enum", options: "Embroidery, Hand Embellishment, Zari, Tilla, Sequin, Block Print" },
        { name: "Size", type: "Enum", options: "S, M, L, XL" },
        window.colorAttribute
    ],
    '209': [ // 3PC fancy Stiched
        { name: "Brand", type: "Text", options: "e.g., Baroque, Maryum N Maria, Asim Jofa" },
        { name: "Fabric", type: "Enum", options: "Chiffon, Net, Silk, Jamawar, Organza, Raw Silk" },
        { name: "Work Type", type: "Enum", options: "Embroidery, Hand Embellishment, Zari, Tilla, Sequin, Dabka" },
        { name: "Size", type: "Enum", options: "S, M, L, XL" },
        window.colorAttribute
    ],
    '210': [ // Fancy Saree
        { name: "Brand", type: "Text", options: "e.g., Designer, Generic" },
        { name: "Fabric", type: "Enum", options: "Net, Chiffon, Georgette, Silk, Organza, Velvet" },
        { name: "Work Type", type: "Enum", options: "Embroidered, Sequin Work, Stone Work, Hand Embellished, Zari" },
        { name: "Blouse Piece", type: "Enum", options: "Stitched, Unstitched" },
        window.colorAttribute
    ],

    // PARENT ID 44: Shoes 👞
    '45': [ // Women's heels
        { name: "Brand", type: "Text", options: "e.g., Stylo, Insignia, Charles & Keith, Borjan" },
        { name: "Upper Material", type: "Enum", options: "Faux Leather, Suede, Synthetic, Embellished Fabric, Patent Leather, PU" },
        { name: "Heel Type", type: "Enum", options: "Block Heel, Stiletto, Kitten Heel, Wedge, Platform, Cone Heel" },
        { name: "Heel Height", type: "Measurement", units: ["Inches", "cm"] },
        { name: "Occasion", type: "Enum", options: "Party, Formal, Wedding, Casual" },
        { name: "Available Sizes (PK)", type: "Text", options: "e.g., 6, 7, 8, 9, 10, 11" },
        window.colorAttribute
    ],
    '194': [ // Women's Khussa
        { name: "Brand", type: "Text", options: "e.g., Khussa Mehal, Dazzle by Sarah, Stylo" },
        { name: "Upper Material", type: "Enum", options: "Leather, Velvet, Jamawar, Faux Leather" },
        { name: "Work Type", type: "Enum", options: "Embroidered, Tilla Work, Dabka Work, Plain, Sequin, Mirror Work" },
        { name: "Occasion", type: "Enum", options: "Casual, Festive, Wedding, Daily Wear" },
        { name: "Available Sizes (PK)", type: "Text", options: "e.g., 6, 7, 8, 9, 10, 11" },
        window.colorAttribute
    ],
    '195': [ // Women's Flat
        { name: "Brand", type: "Text", options: "e.g., Bata, Stylo, Borjan" },
        { name: "Flat Type", type: "Enum", options: "Ballet Flats, Loafers, Mules, Sandals, Slides, Kolhapuri" },
        { name: "Upper Material", type: "Enum", options: "Faux Leather, Canvas, Synthetic, Leather, PU" },
        { name: "Occasion", type: "Enum", options: "Casual, Daily Wear, Formal" },
        { name: "Available Sizes (PK)", type: "Text", options: "e.g., 6, 7, 8, 9, 10, 11" },
        window.colorAttribute
    ],
    '196': [ // Women's Sandles
        { name: "Brand", type: "Text", options: "e.g., Stylo, Borjan, Bata" },
        { name: "Sandal Type", type: "Enum", options: "Flats, Wedges, Heels, Gladiators, T-Strap" },
        { name: "Upper Material", type: "Enum", options: "Faux Leather, Synthetic, Embellished, PU" },
        { name: "Occasion", type: "Enum", options: "Casual, Beach, Party" },
        { name: "Available Sizes (PK)", type: "Text", options: "e.g., 6, 7, 8, 9, 10, 11" },
        window.colorAttribute
    ],
    '197': [ // Women's Pumps
        { name: "Brand", type: "Text", options: "e.g., Insignia, Charles & Keith, Stylo" },
        { name: "Upper Material", type: "Enum", options: "Faux Leather, Patent, Suede, Synthetic" },
        { name: "Heel Type", type: "Enum", options: "High Heel, Medium Heel, Kitten Heel, Block Heel" },
        { name: "Occasion", type: "Enum", options: "Formal, Office, Party" },
        { name: "Available Sizes (PK)", type: "Text", options: "e.g., 6, 7, 8, 9, 10, 11" },
        window.colorAttribute
    ],
    '198': [ // Men's Shoes
        { name: "Brand", type: "Text", options: "e.g., Hush Puppies, Bata, Service, Ndure" },
        { name: "Shoe Type", type: "Enum", options: "Formal, Loafers, Moccasins, Sneakers, Boots, Dress Shoes, Oxford, Derby" },
        { name: "Upper Material", type: "Enum", options: "Leather, Faux Leather, Suede, Canvas, Synthetic" },
        { name: "Occasion", type: "Enum", options: "Formal, Business, Casual, Wedding" },
        { name: "Available Sizes (PK)", type: "Text", options: "e.g., 7, 8, 9, 10, 11, 12" },
        window.colorAttribute
    ],
    '199': [ // Men's Slippers
        { name: "Brand", type: "Text", options: "e.g., Bata, Service, Ndure" },
        { name: "Material", type: "Enum", options: "Leather, Faux Leather, Rubber, Fabric" },
        { name: "Type", type: "Enum", options: "Indoor, Outdoor, Flip-Flops" },
        { name: "Available Sizes (PK)", type: "Text", options: "e.g., 7, 8, 9, 10, 11, 12" },
        window.colorAttribute
    ],
    '200': [ // Men's Sandles
        { name: "Brand", type: "Text", options: "e.g., Bata, Service, Ndure" },
        { name: "Material", type: "Enum", options: "Leather, Faux Leather, Rubber" },
        { name: "Style", type: "Enum", options: "Fisherman, Strappy, Slides, Back-strap" },
        { name: "Available Sizes (PK)", type: "Text", options: "e.g., 7, 8, 9, 10, 11, 12" },
        window.colorAttribute
    ],
    '201': [ // Mens joggers
        { name: "Brand", type: "Text", options: "e.g., Nike, Adidas, Puma, Ndure" },
        { name: "Upper Material", type: "Enum", options: "Mesh, Knit, Synthetic, Faux Leather" },
        { name: "Usage", type: "Enum", options: "Running, Walking, Gym, Casual" },
        { name: "Available Sizes (UK/PK)", type: "Text", options: "e.g., 8, 9, 10, 11" },
        window.colorAttribute
    ],
    '202': [ // Women's Joggers
        { name: "Brand", type: "Text", options: "e.g., Nike, Adidas, Skechers, Ndure" },
        { name: "Upper Material", type: "Enum", options: "Mesh, Knit, Synthetic" },
        { name: "Usage", type: "Enum", options: "Running, Walking, Gym, Casual" },
        { name: "Available Sizes (UK/PK)", type: "Text", options: "e.g., 6, 7, 8, 9" },
        window.colorAttribute
    ],
    '203': [ // Shoes Accessories
        { name: "Accessory Type", type: "Enum", options: "Shoe Polish, Laces, In-soles, Shoe Horn, Shoe Tree, Cleaning Kit, Shoe Protector Spray" },
        { name: "Brand", type: "Text", options: "e.g., Kiwi, Generic" },
        { name: "For Shoe Type", type: "Enum", options: "Leather, Suede, Canvas, All Types" },
    ],
    '204': [ // Men's Chappals
        { name: "Brand", type: "Text", options: "e.g., Bata, Ndure, Local" },
        { name: "Material", type: "Enum", options: "Leather, Faux Leather, Rubber" },
        { name: "Style", type: "Enum", options: "Peshawari, Kaptaan, Quetta, Charsadda" },
        { name: "Available Sizes (PK)", type: "Text", options: "e.g., 7, 8, 9, 10, 11, 12" },
        window.colorAttribute
    ],
    '205': [ // Men's Boots
        { name: "Brand", type: "Text", options: "e.g., Dr. Martens, Timberland, Ndure" },
        { name: "Boot Type", type: "Enum", options: "Chelsea, Chukka, Combat, Hiking, Dress Boot" },
        { name: "Upper Material", type: "Enum", options: "Leather, Suede, Synthetic" },
        { name: "Available Sizes (UK/PK)", type: "Text", options: "e.g., 8, 9, 10, 11" },
        window.colorAttribute
    ],

    // PARENT ID 46: Perfumes
    '47': [ // Women's Perfumes
        { name: "Brand", type: "Text", options: "e.g., Chanel, Dior, J., Bonanza Satrangi, Rasasi" },
        { name: "Fragrance Type", type: "Enum", options: "Eau de Parfum (EDP), Eau de Toilette (EDT), Eau de Cologne (EDC), Body Mist" },
        { name: "Scent Family", type: "Enum", options: "Floral, Oriental, Woody, Fresh, Citrus, Fruity, Spicy, Aquatic, Gourmand" },
        { name: "Product Feature", type: "Text", options: "e.g., Long-lasting, Travel size, Gift Set, Imported" },
        { name: "Volume (ml)", type: "Number", options: "e.g., 100, 50, 30" }
    ],
    '241': [ // Men's perfumes
        { name: "Brand", type: "Text", options: "e.g., Dior, Creed, Armaf, J., Rasasi" },
        { name: "Fragrance Type", type: "Enum", options: "Eau de Parfum (EDP), Eau de Toilette (EDT), Eau de Cologne (EDC), Aftershave" },
        { name: "Scent Family", type: "Enum", options: "Woody, Aromatic, Fresh, Citrus, Spicy, Leather, Oriental, Aquatic" },
        { name: "Product Feature", type: "Text", options: "e.g., Intense, All-day wear, Imported" },
        { name: "Volume (ml)", type: "Number", options: "e.g., 100, 75, 125" }
    ],
    '242': [ // perfume oil
        { name: "Brand", type: "Text", options: "e.g., Ajmal, Rasasi, Swiss Arabian, Al Haramain, J." },
        { name: "Fragrance Type", type: "Enum", options: "Attar, Concentrated Perfume Oil (CPO)" },
        { name: "Scent Family", type: "Enum", options: "Oud, Musk, Amber, Floral, Sandalwood, Spicy" },
        { name: "Product Feature", type: "Text", options: "e.g., Alcohol-free, Roll-on applicator, Long-lasting" },
        { name: "Volume (ml)", type: "Number", options: "e.g., 3, 6, 12" }
    ],
    '243': [ // Unisex perfumes
        { name: "Brand", type: "Text", options: "e.g., Tom Ford, Calvin Klein, Jo Malone, Armaf" },
        { name: "Fragrance Type", type: "Enum", options: "Eau de Parfum (EDP), Eau de Toilette (EDT)" },
        { name: "Scent Family", type: "Enum", options: "Woody, Fresh, Citrus, Green, Aromatic, Oriental, Spicy" },
        { name: "Product Feature", type: "Text", options: "e.g., Bold and Unique Scent, Suitable for all genders" },
        { name: "Volume (ml)", type: "Number", options: "e.g., 50, 100" }
    ],

    // PARENT ID 48: Home Decore
    '49': [ // Decore Lights
        { name: "Brand", type: "Text", options: "e.g., Generic" },
        { name: "Light Type", type: "Enum", options: "Fairy Lights, String Lights, Neon Signs, Marquee Lights, Curtain Lights, LED Strip" },
        { name: "Power Source", type: "Enum", options: "Battery Operated, USB Powered, Plug-in" },
        { name: "Light Color", type: "Enum", options: "Warm White, Cool White, Multicolor, RGB" },
        { name: "Length", type: "Text", options: "e.g., 10 Meters, 30 ft" },
        { name: "Features", type: "Text", options: "e.g., Waterproof, Remote Control, Different Modes, App Controlled" },
    ],
    '211': [ // Decorations
        { name: "Brand", type: "Text", options: "e.g., Generic" },
        { name: "Material", type: "Enum", options: "Wood, Metal, Ceramic, Resin, Glass, Fabric, MDF, Brass" },
        { name: "Type", type: "Enum", options: "Vase, Figurine, Showpiece, Wall Art, Candle Holder, Photo Frame, Artificial Plant" },
        { name: "Style", type: "Enum", options: "Modern, Vintage, Abstract, Minimalist, Rustic, Islamic, Traditional" },
        ...window.dimensionAttributes,
        window.colorAttribute
    ],
    '212': [ // Wall Decore
        { name: "Brand", type: "Text", options: "e.g., Generic" },
        { name: "Material", type: "Enum", options: "Wood, Metal, Acrylic, Plastic, Vinyl Sticker, MDF" },
        { name: "Type", type: "Enum", options: "Wall Clock, Wall Art, Shelves, Mirror, Wall Hanging, Sticker, Islamic Calligraphy" },
        { name: "Clock Type", type: "Enum", options: "Analog, Digital, 12-hour Display, Roman Numerals, None" },
        { name: "Feature", type: "Text", options: "e.g., Silent Movement, 3D Design, DIY, Luminous" },
        ...window.dimensionAttributes,
    ],
    '213': [ // Rugs & Carpets
        { name: "Brand", type: "Text", options: "e.g., Generic" },
        { name: "Material", type: "Enum", options: "Wool, Jute, Cotton, Synthetic, Silk, Polypropylene, Chenille" },
        { name: "Product Design", type: "Enum", options: "Modern, Traditional, Geometric, Shag, Persian, Abstract" },
        { name: "Dimensions (Feet)", type: "Text", options: "e.g., 5 ft x 8 ft" },
        { name: "Dimensions (Inches)", type: "Text", options: "e.g., 60 in x 96 in" },
        { name: "Features", type: "Text", options: "e.g., Non-slip, Washable, High Pile, Hand-woven" },
        window.colorAttribute
    ],
    '214': [ // Artificial Plants & Flowers
        { name: "Brand", type: "Text", options: "e.g., Generic" },
        { name: "Material", type: "Enum", options: "Plastic, Silk, Fabric, Real Touch" },
        { name: "Plant/Flower Type", type: "Text", options: "e.g., Monstera, Rose, Orchid, Ivy Vine, Money Plant" },
        { name: "Comes With", type: "Enum", options: "Pot, Vase, Hanging Basket, Stem Only" },
        { name: "Size", type: "Text", options: "e.g., Small (Desk), Medium, Large (Floor)" },
        ...window.dimensionAttributes
    ],
    
    // PARENT ID 50: Handbags (Sub-categories of 33)
    '50': [ // Handbags
        { name: "Brand", type: "Text", options: "e.g., Stylo, Borjan, Gul Ahmed, Local" },
        { name: "Bag Type", type: "Enum", options: "Tote Bag, Shoulder Bag, Satchel, Hobo Bag" },
        { name: "Material", type: "Enum", options: "Faux Leather, PU, Genuine Leather, Canvas, Fabric" },
        { name: "Occasion", type: "Enum", options: "Casual, Formal, Party, Daily Use" },
        { name: "Features", type: "Text", options: "e.g., Multiple Compartments, Adjustable Strap, Top Handle" },
        ...window.dimensionAttributes,
        window.colorAttribute
    ],
    '130': [ // Clutches
        { name: "Brand", type: "Text", options: "e.g., Stylo, Insignia, Generic" },
        { name: "Material", type: "Enum", options: "Embellished Fabric, Faux Leather, PU, Velvet, Metal" },
        { name: "Occasion", type: "Enum", options: "Wedding, Party, Formal, Festive" },
        { name: "Features", type: "Text", options: "e.g., Detachable Chain Strap, Clasp Closure" },
        ...window.dimensionAttributes,
        window.colorAttribute
    ],
    '131': [ // Shoulder Bags
        { name: "Brand", type: "Text", options: "e.g., Stylo, Borjan, Local" },
        { name: "Material", type: "Enum", options: "Faux Leather, PU, Genuine Leather, Canvas" },
        { name: "Occasion", type: "Enum", options: "Casual, Daily Use, Office Wear" },
        { name: "Features", type: "Text", options: "e.g., Multiple Pockets, Zip Closure, Adjustable Strap" },
        ...window.dimensionAttributes,
        window.colorAttribute
    ],
    '132': [ // Purses
        { name: "Brand", type: "Text", options: "e.g., Stylo, Local" },
        { name: "Material", type: "Enum", options: "Faux Leather, PU, Fabric" },
        { name: "Style", type: "Enum", options: "Coin Purse, Small Pouch, Wristlet" },
        { name: "Features", type: "Text", options: "e.g., Zip Closure, Card Slots" },
        ...window.dimensionAttributes,
        window.colorAttribute
    ],

    // PARENT ID 51: Mens Stiched Clothes
    '52': [ // Shalwar Kameez
        { name: "Brand", type: "Text", options: "e.g., J., Gul Ahmed, Alkaram Studio" },
        { name: "Fabric", type: "Enum", options: "Cotton, Wash & Wear, Karandi, Khaddar, Boski, Lawn" },
        { name: "Pattern", type: "Enum", options: "Plain, Embroidered, Self-Design" },
        { name: "Neck Type", type: "Enum", options: window.clothingNeckTypeOptions },
        { name: "Size", type: "Enum", options: "S, M, L, XL" },
        { name: "Number of Pieces", type: "Enum", options: "2 (Kameez & Shalwar/Trouser)" },
        window.colorAttribute
    ],
    '133': [ // T-shirt
        { name: "Brand", type: "Text", options: "e.g., Outfitters, Breakout, ONE, Levis" },
        { name: "Fabric", type: "Enum", options: "Cotton, Jersey, Polyester, Blended, Pique" },
        { name: "Pattern", type: "Enum", options: "Graphic, Plain, Striped, Printed" },
        { name: "Neck Type", type: "Enum", options: "Crew Neck, V-Neck, Polo" },
        { name: "Fit", type: "Enum", options: "Regular Fit, Slim Fit, Oversized" },
        { name: "Sizes", type: "Enum", options: "S, M, L, XL, XXL" },
        window.colorAttribute
    ],
    '134': [ // Hoodies
        { name: "Brand", type: "Text", options: "e.g., Outfitters, Breakout, ONE" },
        { name: "Fabric", type: "Enum", options: "Fleece, Cotton, Jersey, Terry" },
        { name: "Pattern", type: "Enum", options: "Plain, Printed, Embroidered, Graphic" },
        { name: "Style", type: "Enum", options: "Pullover, Zip-Up" },
        { name: "Season", type: "Enum", options: "Winter, Autumn" },
        { name: "Sizes", type: "Enum", options: "S, M, L, XL, XXL" },
        window.colorAttribute
    ],
    '135': [ // TrackSuits
        { name: "Brand", type: "Text", options: "e.g., Nike, Adidas, Local" },
        { name: "Fabric", type: "Enum", options: "Fleece, Jersey, Polyester, Terry" },
        { name: "Pattern", type: "Enum", options: "Solid, Color Block, Striped" },
        { name: "Style", type: "Enum", options: "Hooded, High Neck, Round Neck" },
        { name: "Sizes", type: "Enum", options: "S, M, L, XL, XXL" },
        { name: "Number of Pieces", type: "Enum", options: "2 (Jacket & Trouser), 3 (with T-shirt)" },
        window.colorAttribute
    ],
    '136': [ // Men's Jackets
        { name: "Brand", type: "Text", options: "e.g., Outfitters, Levis, Breakout" },
        { name: "Material", type: "Enum", options: "Leather, Faux Leather, Denim, Parachute, Fleece, Suede, Polyester" },
        { name: "Style", type: "Enum", options: "Solid, Quilted, Bomber, Biker, Puffer, Windbreaker" },
        { name: "Neck Type", type: "Enum", options: "Collared, Hooded, High Neck, Ribbed Collar" },
        { name: "Sizes", type: "Enum", options: "S, M, L, XL, XXL" },
        window.colorAttribute
    ],
    '137': [ // Men's Shirts
        { name: "Brand", type: "Text", options: "e.g., Cambridge, Diners, Levis, ONE" },
        { name: "Fabric", type: "Enum", options: "Cotton, Linen, Poplin, Oxford, Denim, Flannel" },
        { name: "Pattern", type: "Enum", options: "Solid, Check, Stripe, Printed" },
        { name: "Fit", type: "Enum", options: "Slim Fit, Regular Fit, Modern Fit" },
        { name: "Sleeve Type", type: "Enum", options: "Full Sleeves, Half Sleeves" },
        { name: "Sizes", type: "Enum", options: "S, M, L, XL, XXL" },
        window.colorAttribute
    ],
    '138': [ // Men's Sweater
        { name: "Brand", type: "Text", options: "e.g., Cambridge, ONE, Outfitters" },
        { name: "Material", type: "Enum", options: "Wool, Cotton, Cashmere, Acrylic, Merino" },
        { name: "Season", type: "Enum", options: "Winter, Autumn" },
        { name: "Type", type: "Enum", options: "Pullover, Cardigan, V-Neck, Crew-Neck, Turtleneck, High Neck" },
        { name: "Style", type: "Enum", options: "Cable Knit, Fair Isle, Solid, Argyle" },
        { name: "Occasion", type: "Enum", options: "Casual, Formal, Business" },
        { name: "Sizes", type: "Enum", options: "S, M, L, XL" },
        window.colorAttribute
    ],
    '139': [ // Men's Sleep Wears
        { name: "Brand", type: "Text", options: "e.g., Jockey, Local Brand" },
        { name: "Season", type: "Enum", options: "All Seasons, Summer, Winter" },
        { name: "Type", type: "Enum", options: "Pajama Set, Lounge Pants, Robe, Shorts Set" },
        { name: "Fabric", type: "Enum", options: "Cotton, Jersey, Flannel" },
        { name: "Design", type: "Enum", options: "Solid, Plaid, Printed, Striped" },
        { name: "Feature", type: "Text", options: "e.g., Breathable, Extra Soft, Elastic Waistband" },
        { name: "Sizes", type: "Enum", options: "S, M, L, XL" },
        window.colorAttribute
    ],

    // PARENT ID 53: Kitchenware
    '54': [ // Kitchen Accessories
        { name: "Accessory Type", type: "Enum", options: "Spatula Set, Cutting Board, Knife Set, Measuring Cups & Spoons, Colander, Whisk, Peeler" },
        { name: "Material", type: "Enum", options: "Silicone, Wood, Stainless Steel, Plastic, Bamboo" },
        { name: "Features", type: "Text", options: "e.g., Dishwasher Safe, Heat Resistant, Non-stick" },
    ],
    '153': [ // Kitchen organizers
        { name: "Organizer Type", type: "Enum", options: "Spice Rack, Dish Drainer, Cutlery Tray, Pot Lid Holder, Paper Towel Holder" },
        { name: "Material", type: "Enum", options: "Plastic, Stainless Steel, Wood, Bamboo" },
        { name: "Mounting Type", type: "Enum", options: "Countertop, Wall-mounted, In-drawer" },
    ],
    '154': [ // Kitchen Appliances
        { name: "Brand", type: "Text", options: "e.g., Philips, Westpoint, Anex, Dawlance, Kenwood" },
        { name: "Appliance Type", type: "Enum", options: "Blender, Juicer, Coffee Maker, Air Fryer, Toaster, Electric Kettle, Hand Mixer, Food Processor" },
        { name: "Power (Watts)", type: "Number", options: "e.g., 500, 1000, 1500" },
        { name: "Capacity", type: "Text", options: "e.g., 1.5L, 2 Slices, 1.7L" },
        { name: "Material", type: "Enum", options: "Stainless Steel, Plastic, Glass" },
        { name: "Features", type: "Textarea", options: "e.g., Multiple Speed Settings, Pulse Function, Dishwasher Safe Parts, Auto Shut-off" },
        window.colorAttribute
    ],
    '155': [ // Utensils
        { name: "Utensil Type", type: "Enum", options: "Spoon, Fork, Knife, Ladle, Turner, Tongs" },
        { name: "Material", type: "Enum", options: "Stainless Steel, Wood, Silicone, Nylon, Plastic" },
        { name: "Set", type: "Enum", options: "Single Piece, Set of 6, Set of 12" },
    ],
    '156': [ // Cookware
        { name: "Cookware Type", type: "Enum", options: "Frying Pan, Saucepan, Cooking Pot, Tawa, Wok/Karahi, Pressure Cooker" },
        { name: "Material", type: "Enum", options: "Non-stick, Stainless Steel, Aluminum, Cast Iron, Ceramic" },
        { name: "Size", type: "Text", options: "e.g., 24cm, 5 Liters" },
        { name: "Features", type: "Text", options: "e.g., Induction Compatible, Oven Safe, Lid Included" },
    ],
    '157': [ // Bakeware
        { name: "Bakeware Type", type: "Enum", options: "Baking Tray, Cake Mold, Muffin Pan, Loaf Pan, Pizza Pan" },
        { name: "Material", type: "Enum", options: "Non-stick, Silicone, Aluminum, Glass" },
        { name: "Shape", type: "Enum", options: "Round, Square, Rectangular, Novelty" },
    ],
    '158': [ // Cleaning Accessories
        { name: "Accessory Type", type: "Enum", options: "Sponge, Scrubber, Cleaning Brush, Dishwashing Gloves, Microfiber Cloth" },
        { name: "Material", type: "Enum", options: "Sponge, Plastic, Nylon, Rubber" },
    ],
    '159': [ // Bottle
        { name: "Material", type: "Enum", options: "Plastic, Stainless Steel, Glass, Copper" },
        { name: "Capacity (ml)", type: "Number", options: "e.g., 500, 750, 1000" },
        { name: "Features", type: "Text", options: "e.g., BPA-Free, Leak-proof, Insulated, With Straw" },
        window.colorAttribute
    ],
    '160': [ // Cutlery
        { name: "Material", type: "Enum", options: "Stainless Steel, Plastic, Silver Plated" },
        { name: "Set Includes", type: "Text", options: "e.g., 6 Spoons, 6 Forks, 6 Knives" },
        { name: "Number of Pieces", type: "Enum", options: "16, 24, 32" },
    ],
    '161': [ // Trays & Dishes
        { name: "Type", type: "Enum", options: "Serving Tray, Serving Dish, Casserole Dish" },
        { name: "Material", type: "Enum", options: "Melamine, Wood, Plastic, Ceramic, Glass" },
        { name: "Shape", type: "Enum", options: "Rectangular, Round, Oval" },
    ],
    '162': [ // Glasses & cups
        { name: "Type", type: "Enum", options: "Water Glass, Tea Cup, Coffee Mug, Juice Glass" },
        { name: "Material", type: "Enum", options: "Glass, Ceramic, Plastic, Stainless Steel" },
        { name: "Set", type: "Enum", options: "Single, Set of 6, Set of 12" },
        { name: "Capacity (ml)", type: "Number", options: "e.g., 250, 300" },
    ],
    '163': [ // Plates & Bowls
        { name: "Type", type: "Enum", options: "Dinner Plate, Side Plate, Soup Bowl, Cereal Bowl" },
        { name: "Material", type: "Enum", options: "Ceramic, Melamine, Glass, Corelle" },
        { name: "Set", type: "Enum", options: "Single, Set of 6" },
        { name: "Dinnerware Set", type: "Text", options: "e.g., 32-piece set" },
    ],

    // PARENT ID 55: Islamic Accessories
    '56': [ // Abaya
        { name: "Brand", type: "Text", options: "e.g., Generic, Designer" },
        { name: "Fabric", type: "Enum", options: "Nida, Chiffon, Georgette, Jersey, Crepe" },
        { name: "Style", type: "Enum", options: "Classic, Butterfly, Open Front, Kimono Style, Embroidered" },
        { name: "Size", type: "Enum", options: "S, M, L, XL (or by Length in Inches)" },
        { name: "Includes", type: "Enum", options: "Abaya Only, With Scarf/Hijab" },
        window.colorAttribute
    ],
    '215': [ // Prayer Matts
        { name: "Material", type: "Enum", options: "Velvet, Foam, Cotton, Woven Fabric" },
        { name: "Features", type: "Text", options: "e.g., Padded, Foldable, Travel Size, Compass for Qibla" },
        { name: "Made in", type: "Text", options: "e.g., Turkey, Pakistan" },
        ...window.dimensionAttributes,
    ],
    '216': [ // Tasbeeh
        { name: "Material", type: "Enum", options: "Wood, Crystal, Stone, Plastic, Silver" },
        { name: "Bead Count", type: "Enum", options: "33, 99, 100, 1000" },
        { name: "Type", type: "Enum", options: "Manual, Digital/Counter" },
    ],
    '217': [ // Islamic Caps
        { name: "Type", type: "Enum", options: "Topi, Kufi, Sindhi Cap" },
        { name: "Material", type: "Enum", options: "Cotton, Knitted, Velvet" },
        { name: "Design", type: "Enum", options: "Plain, Embroidered, Hand Woven" },
    ],
    '218': [ // Scarf
        { name: "Fabric", type: "Enum", options: "Georgette, Chiffon, Cotton, Jersey, Lawn" },
        { name: "Type", type: "Enum", options: "Hijab, Stole, Square Scarf" },
        { name: "Size", type: "Text", options: "e.g., 72 x 30 Inches" },
        window.colorAttribute
    ],
    '219': [ // Umrah Accessories
        { name: "Accessory Type", type: "Enum", options: "Ehram, Tawaf Tasbeeh, Waist Belt, Travel Bag" },
        { name: "Ehram Fabric", type: "Enum", options: "Cotton, Terry Towel" },
        { name: "Gender", type: "Enum", options: "Men, Women, Unisex" },
    ],
    '220': [ // Quran Rehal
        { name: "Material", type: "Enum", options: "Wood, Plastic, Acrylic" },
        { name: "Size", type: "Enum", options: "Small, Medium, Large" },
        { name: "Design", type: "Text", options: "e.g., Carved, Plain" },
    ],
    '221': [ // Romal
        { name: "Material", type: "Enum", options: "Cotton, Silk" },
        { name: "Use", type: "Enum", options: "Quran Cover, Head Covering" },
        { name: "Design", type: "Text", options: "e.g., Embroidered, Printed" },
    ],

    // PARENT ID 57: Auto and accessories
    '58': [ // Bike Accessories
        { name: "Accessory Type", type: "Enum", options: "Helmet, Gloves, Bike Cover, Mobile Holder, Security Lock, Goggles" },
        { name: "Material", type: "Enum", options: "Plastic, Metal, Leather, Fabric" },
        { name: "Compatibility", type: "Text", options: "e.g., Universal, Honda CD70, Yamaha YBR" },
        window.colorAttribute
    ],
    '263': [ // Car Accessories
        { name: "Accessory Type", type: "Enum", options: "Car Cover, Floor Mats, Mobile Holder, Charger, Air Freshener, Polishes & Waxes, Cleaning Tools" },
        { name: "Material", type: "Enum", options: "Plastic, Rubber, Fabric, Leatherette" },
        { name: "Compatibility", type: "Text", options: "e.g., Universal, Honda Civic, Toyota Corolla" },
    ],
    '264': [ // Bicycle Accessories
        { name: "Accessory Type", type: "Enum", options: "Lock, Light, Bell, Bottle Holder, Pump, Helmet" },
        { name: "Material", type: "Enum", options: "Plastic, Alloy, Steel" },
        { name: "Compatibility", type: "Enum", options: "Universal" },
    ],

    // PARENT ID 59: Fitness
    '60': [ // GYM
        { name: "Accessory Type", type: "Enum", options: "Dumbbells, Resistance Bands, Yoga Mat, Skipping Rope, Gloves, Shaker Bottle" },
        { name: "Material", type: "Enum", options: "Rubber, Neoprene, Latex, Plastic, Metal" },
        { name: "Weight (if applicable)", type: "Text", options: "e.g., 5kg, 10 lbs" },
    ],
    '265': [ // Sports
        { name: "Sport Type", type: "Enum", options: "Cricket, Football, Badminton, Tennis" },
        { name: "Equipment", type: "Enum", options: "Ball, Bat, Racket, Shuttlecock, Net" },
        { name: "Brand", type: "Text", options: "e.g., CA, HS, Ihsan, Generic" },
    ],
    
    // PARENT ID 61: Electronics (More specific sub-categories)
    '62': [ // Lights
        { name: "Light Type", type: "Enum", options: "LED Bulb, Tube Light, Flood Light, Emergency Light, Motion Sensor Light" },
        { name: "Power (Watts)", type: "Number", options: "e.g., 12, 20, 50" },
        { name: "Light Color", type: "Enum", options: "Cool White, Warm White, Daylight" },
        { name: "Power Source", type: "Enum", options: "AC Powered, Rechargeable, Solar" },
    ],
    '222': [ // Electric Power Accessories
        { name: "Accessory Type", type: "Enum", options: "Extension Cord, Surge Protector, Adapter, Socket, Switch" },
        { name: "Number of Sockets", type: "Enum", options: "1, 2, 3, 4, 5, 6" },
        { name: "Cable Length", type: "Measurement", units: ["Meters", "Yard"] },
    ],
    '223': [ // Cameras & Accessories
        { name: "Item Type", type: "Enum", options: "Security Camera, Action Camera, Drone, Tripod, Camera Bag, Lens" },
        { name: "Brand", type: "Text", options: "e.g., Xiaomi, GoPro, DJI, Generic" },
        { name: "Resolution", type: "Text", options: "e.g., 1080p, 4K" },
        { name: "Features", type: "Textarea", options: "e.g., Wi-Fi Connectivity, Night Vision, Motion Detection, Waterproof" },
    ],
    '224': [ // Massager
        { name: "Type", type: "Enum", options: "Massage Gun, Neck Massager, Foot Massager, Handheld Massager" },
        { name: "Power Source", type: "Enum", options: "Rechargeable, Corded" },
        { name: "Features", type: "Text", options: "e.g., Multiple Heads, Heat Function, Adjustable Speed" },
    ],
    '225': [ // Mobile phones
        { name: "Brand", type: "Text", options: "e.g., Samsung, Apple, Xiaomi, Tecno, Infinix, Oppo" },
        { name: "Model", type: "Text", options: "e.g., Galaxy S24, iPhone 15, Note 40 Pro" },
        { name: "RAM", type: "Text", options: "e.g., 8GB" },
        { name: "Storage", type: "Text", options: "e.g., 128GB" },
        { name: "Camera (MP)", type: "Text", options: "e.g., 108MP" },
        { name: "Screen Size", type: "Text", options: "e.g., 6.7 Inches" },
        { name: "Battery (mAh)", type: "Number", options: "e.g., 5000" },
        { name: "PTA Approved", type: "Enum", options: "Yes, No" },
        window.colorAttribute
    ],

    // PARENT ID 63: Home Linen
    '64': [ // Sofa Covers
        { name: "Material", type: "Enum", options: "Jersey, Jacquard, Cotton, Polyester" },
        { name: "Sofa Type", type: "Enum", options: "1-Seater, 2-Seater, 3-Seater, L-Shape" },
        { name: "Design", type: "Enum", options: "Plain, Printed, Textured" },
        window.colorAttribute
    ],
    '258': [ // Towels
        { name: "Material", type: "Enum", options: "Cotton, Microfiber, Bamboo" },
        { name: "Type", type: "Enum", options: "Bath Towel, Hand Towel, Face Towel, Beach Towel, Towel Set" },
        { name: "GSM (Grams per Square Meter)", type: "Number", options: "e.g., 500, 600" },
        window.colorAttribute
    ],
    '259': [ // Covers
        { name: "Cover Type", type: "Enum", options: "Washing Machine Cover, AC Cover, Iron Stand Cover, Water Dispenser Cover" },
        { name: "Material", type: "Enum", options: "Parachute, Plastic, Fabric" },
        { name: "Features", type: "Text", options: "e.g., Waterproof, Dust-proof" },
    ],
    '260': [ // Curtain
        { name: "Material", type: "Enum", options: "Velvet, Cotton, Polyester, Net, Jacquard" },
        { name: "Type", type: "Enum", options: "Blackout, Sheer, Room Darkening" },
        { name: "Size (Width x Length)", type: "Text", options: "e.g., 4.5 ft x 7 ft" },
        window.colorAttribute
    ],
    '261': [ // Cushion Covers
        { name: "Material", type: "Enum", options: "Velvet, Cotton, Silk, Jute, Jacquard" },
        { name: "Size", type: "Enum", options: "16x16 Inches, 18x18 Inches, 20x20 Inches" },
        { name: "Design", type: "Enum", options: "Plain, Printed, Embroidered, Embellished" },
        window.colorAttribute
    ],
    '262': [ // Roti covers
        { name: "Material", type: "Enum", options: "Cotton, Fabric" },
        { name: "Type", type: "Enum", options: "Roti Box (Dabba), Roti Cover (Rumal)" },
        { name: "Design", type: "Text", options: "e.g., Printed, Embroidered" },
    ],

    // PARENT ID 65: Women's Shawls
    '66': [ // Pashmina Shawls
        { name: "Material", type: "Enum", options: "Pashmina Wool, Blended Pashmina" },
        { name: "Work Type", type: "Enum", options: "Plain, Embroidered, Printed, Kani" },
        { name: "Season", type: "Enum", options: "Winter" },
        window.colorAttribute
    ],
    '245': [ // Kashmiri Shawls
        { name: "Material", type: "Enum", options: "Wool, Pashmina" },
        { name: "Work Type", type: "Enum", options: "Sozni Embroidery, Tilla Embroidery, Kalamkari" },
        { name: "Season", type: "Enum", options: "Winter" },
        window.colorAttribute
    ],
    '246': [ // Cape Shawls
        { name: "Fabric", type: "Enum", options: "Wool, Velvet, Khaddar, Marina" },
        { name: "Style", type: "Enum", options: "Open Front, Buttoned" },
        { name: "Work Type", type: "Enum", options: "Plain, Embroidered" },
        window.colorAttribute
    ],
    '247': [ // Lawn Shawls
        { name: "Fabric", type: "Enum", options: "Lawn, Voile" },
        { name: "Pattern", type: "Enum", options: "Printed, Digital Print, Embroidered" },
        { name: "Season", type: "Enum", options: "Summer" },
        window.colorAttribute
    ],
    '248': [ // Woolen Shawls
        { name: "Material", type: "Enum", options: "Wool, Merino Wool, Lambswool" },
        { name: "Work Type", type: "Enum", options: "Plain, Check, Embroidered" },
        { name: "Season", type: "Enum", options: "Winter" },
        window.colorAttribute
    ],
    '249': [ // Linen shawls
        { name: "Fabric", type: "Enum", options: "Linen, Linen Blend" },
        { name: "Pattern", type: "Enum", options: "Printed, Plain, Embroidered" },
        { name: "Season", type: "Enum", options: "Mid-Season, Winter" },
        window.colorAttribute
    ],
    '250': [ // Swiss shawls
        { name: "Fabric", type: "Enum", options: "Swiss Voile, Swiss Lawn" },
        { name: "Work Type", type: "Enum", options: "Embroidered, Plain" },
        { name: "Season", type: "Enum", options: "Summer, Mid-Season" },
        window.colorAttribute
    ],
    '251': [ // Velvet shawls
        { name: "Fabric", type: "Enum", options: "Velvet, Micro Velvet" },
        { name: "Work Type", type: "Enum", options: "Embroidered, Embellished, Plain" },
        { name: "Occasion", type: "Enum", options: "Wedding, Formal, Party" },
        window.colorAttribute
    ],
    '252': [ // Orignal shawls
        { name: "Brand", type: "Text", options: "e.g., Khaadi, Nishat, Bareeze" },
        { name: "Fabric", type: "Enum", options: "Wool, Khaddar, Karandi, Velvet" },
        { name: "Collection", type: "Text", options: "e.g., Winter Collection '25" },
        window.colorAttribute
    ],

    // PARENT ID 67: Kid's Clothing
    '68': [ // Full dresses
        ...window.kidsClothingAttributes,
        { name: "Type", type: "Enum", options: "Frock, Gown, Kurta Shalwar, Pant Shirt" },
        { name: "Number of Pieces", type: "Enum", options: "1, 2, 3" }
    ],
    '119': [ // Kid's Formal Wear
        ...window.kidsClothingAttributes,
        { name: "Type", type: "Enum", options: "Lehenga Choli, Sherwani, Waistcoat Set, Fancy Frock" },
        { name: "Work Type", type: "Enum", options: "Embroidery, Embellished, Jamawar" },
    ],
    '120': [ // Girl's Kurta
        ...window.kidsClothingAttributes,
        { name: "Type", type: "Enum", options: "Kurta Only, Kurta with Trouser" },
        { name: "Pattern", type: "Enum", options: "Printed, Embroidered, Plain" },
    ],
    '121': [ // Kid's Bathrobes
        ...window.kidsClothingAttributes,
        { name: "Material", type: "Enum", options: "Terry Cotton, Fleece" },
        { name: "Features", type: "Text", options: "e.g., Hooded, with Belt" },
    ],
    '122': [ // Kid's Hoodies
        ...window.kidsClothingAttributes,
        { name: "Fabric", type: "Enum", options: "Fleece, Terry, Cotton" },
        { name: "Style", type: "Enum", options: "Pullover, Zip-up" },
    ],
    '123': [ // Kid's Trousers
        ...window.kidsClothingAttributes,
        { name: "Fabric", type: "Enum", options: "Denim, Cotton, Fleece, Jersey" },
        { name: "Type", type: "Enum", options: "Jeans, Jogger Pants, Leggings, Tights" },
    ],
    '124': [ // Kid's Tracksuit
        ...window.kidsClothingAttributes,
        { name: "Fabric", type: "Enum", options: "Fleece, Terry, Polyester" },
        { name: "Number of Pieces", type: "Enum", options: "2, 3" },
    ],
    '125': [ // kid's jacket
        ...window.kidsClothingAttributes,
        { name: "Material", type: "Enum", options: "Denim, Parachute, Fleece, Faux Leather" },
        { name: "Style", type: "Enum", options: "Puffer, Bomber, Sleeveless" },
    ],
    '126': [ // Kid's Sleep Wears
        ...window.kidsClothingAttributes,
        { name: "Fabric", type: "Enum", options: "Cotton, Jersey, Flannel" },
        { name: "Type", type: "Enum", options: "Pajama Set, Night Suit" },
    ],
    '127': [ // Costumes
        ...window.kidsClothingAttributes,
        { name: "Theme", type: "Text", options: "e.g., Superhero, Princess, Animal" },
    ],
    '128': [ // West (Kids Western)
        ...window.kidsClothingAttributes,
        { name: "Type", type: "Enum", options: "T-shirt, Jeans, Shorts, Skirt, Dress" },
    ],
    '129': [ // Bottoms
        ...window.kidsClothingAttributes,
        { name: "Type", type: "Enum", options: "Trousers, Jeans, Leggings, Shorts, Skirts" },
    ],
    
    // PARENT ID 69: Kid's Accessories
    '70': [ // Kids shoes
        { name: "Gender", type: "Enum", options: "Boys, Girls, Unisex" },
        { name: "Type", type: "Enum", options: "Sneakers, Sandals, Formal Shoes, Slippers" },
        { name: "Upper Material", type: "Enum", options: "Synthetic, Canvas, Faux Leather" },
        { name: "Size (PK)", type: "Text", options: "e.g., 5, 6, 7" },
        window.colorAttribute
    ],
    '140': [ // Bags
        { name: "Gender", type: "Enum", options: "Boys, Girls, Unisex" },
        { name: "Type", type: "Enum", options: "School Bag, Pouch, Small Backpack" },
        { name: "Material", type: "Enum", options: "Polyester, Canvas" },
    ],
    '141': [ // Styling Accessories
        { name: "Gender", type: "Enum", options: "Boys, Girls" },
        { name: "Type", type: "Enum", options: "Hair Clips, Hair Bands, Bow Ties, Caps" },
    ],
    '142': [ // Educational Toys
        { name: "Toy Type", type: "Enum", options: "Building Blocks, Puzzles, Learning Laptop, Science Kit" },
        { name: "Age Range", type: "Enum", options: "1-3 Years, 3-5 Years, 5-8 Years, 8+ Years" },
        { name: "Material", type: "Enum", options: "Plastic, Wood" },
    ],
    '143': [ // Classic Toys
        { name: "Toy Type", type: "Enum", options: "Doll, Car, Action Figure, Stuffed Animal" },
        { name: "Age Range", type: "Enum", options: "1-3 Years, 3-5 Years, 5-8 Years" },
        { name: "Material", type: "Enum", options: "Plastic, Plush" },
    ],
    '144': [ // sports and outdoor Toys
        { name: "Toy Type", type: "Enum", options: "Ball, Skates, Scooter, Tent House, Inflatable Pool" },
        { name: "Age Range", type: "Enum", options: "3-5 Years, 5-8 Years, 8+ Years" },
    ],

    // PARENT ID 71: Jewellery
    '72': [ // Necklace
        { name: "Necklace Type", type: "Enum", options: "Choker, Pendant, Long Necklace, Mala Set, Collar Necklace" },
        { name: "Material", type: "Enum", options: window.materialJewelryOptions },
        { name: "Plating", type: "Enum", options: window.platingJewelryOptions },
        { name: "Stone Type", type: "Enum", options: "Zirconia, Pearl, Crystal, Ruby, Emerald, None" },
        { name: "Occasion", type: "Enum", options: "Wedding, Party, Casual, Festive" },
    ],
    '145': [ // Artificial set
        { name: "Set Type", type: "Enum", options: "Bridal Set, Necklace Set, Mala Set" },
        { name: "Material", type: "Enum", options: window.materialJewelryOptions },
        { name: "Plating", type: "Enum", options: window.platingJewelryOptions },
        { name: "Includes", type: "Text", options: "e.g., Necklace, Earrings, Tikka, Jhoomar" },
        { name: "Occasion", type: "Enum", options: "Wedding, Party, Festive" },
    ],
    '146': [ // Earrings
        { name: "Earring Type", type: "Enum", options: "Stud, Jhumka, Hoop, Dangler, Bali, Tops" },
        { name: "Material", type: "Enum", options: window.materialJewelryOptions },
        { name: "Plating", type: "Enum", options: window.platingJewelryOptions },
        { name: "Occasion", type: "Enum", options: "Wedding, Party, Casual, Daily Wear" },
    ],
    '147': [ // Rings
        { name: "Material", type: "Enum", options: window.materialJewelryOptions },
        { name: "Plating", type: "Enum", options: window.platingJewelryOptions },
        { name: "Style", type: "Enum", options: "Solitaire, Engagement, Cocktail, Band" },
        { name: "Size", type: "Enum", options: "Adjustable, 6, 7, 8, 9" },
    ],
    '148': [ // Bangle and Bracelets
        { name: "Type", type: "Enum", options: "Bangles, Bracelet, Karra" },
        { name: "Material", type: "Enum", options: window.materialJewelryOptions },
        { name: "Plating", type: "Enum", options: window.platingJewelryOptions },
        { name: "Size (Bangles)", type: "Enum", options: "2.4, 2.6, 2.8, 2.10" },
    ],
    '149': [ // Tikka
        { name: "Material", type: "Enum", options: window.materialJewelryOptions },
        { name: "Plating", type: "Enum", options: window.platingJewelryOptions },
        { name: "Stone Type", type: "Enum", options: "Kundan, Pearl, Zirconia, Crystal" },
        { name: "Occasion", type: "Enum", options: "Wedding, Festive" },
    ],
    '150': [ // Jewellery Accessories
        { name: "Accessory Type", type: "Enum", options: "Nose Pin, Jhoomar/Passa, Matha Patti, Brooch" },
        { name: "Material", type: "Enum", options: window.materialJewelryOptions },
        { name: "Plating", type: "Enum", options: window.platingJewelryOptions },
    ],
    '151': [ // Anklets
        { name: "Material", type: "Enum", options: window.materialJewelryOptions },
        { name: "Plating", type: "Enum", options: window.platingJewelryOptions },
        { name: "Style", type: "Enum", options: "Payal, Simple Chain, Beaded" },
    ],
    '152': [ // Jewellery Organizers
        { name: "Type", type: "Enum", options: "Jewellery Box, Stand, Pouch, Tray" },
        { name: "Material", type: "Enum", options: "Velvet, Wood, Leatherette, Acrylic" },
    ],

    // PARENT ID 73: Fashion Accessories
    '74': [ // Men's Watches
        ...window.watchAttributes
    ],
    '164': [ // Women's Watches
        ...window.watchAttributes,
        { name: "Style", type: "Enum", options: "Formal, Casual, Fashion, Bracelet" },
    ],
    '176': [ // Couple watches
        ...window.watchAttributes,
        { name: "Set", type: "Enum", options: "Set of 2" },
    ],
    '165': [ // Mens Wallet
        { name: "Brand", type: "Text", options: "e.g., J., Hub, Local" },
        { name: "Material", type: "Enum", options: "Genuine Leather, Faux Leather, PU" },
        { name: "Type", type: "Enum", options: "Bi-fold, Tri-fold, Card Holder" },
        { name: "Features", type: "Text", options: "e.g., Coin Pocket, Multiple Card Slots" },
        window.colorAttribute
    ],
    '168': [ // Women's wallets
        { name: "Brand", type: "Text", options: "e.g., Stylo, Local" },
        { name: "Material", type: "Enum", options: "Faux Leather, PU, Fabric" },
        { name: "Type", type: "Enum", options: "Long Wallet, Clutch Wallet, Small Wallet" },
        { name: "Features", type: "Text", options: "e.g., Zip Closure, Mobile Pocket, Card Slots" },
        window.colorAttribute
    ],
    '166': [ // Socks & hosiery
        { name: "Gender", type: "Enum", options: window.genderOptions },
        { name: "Type", type: "Enum", options: "Socks, Tights, Stockings, Leg Warmers" },
        { name: "Length (Socks)", type: "Enum", options: "Ankle, Crew, Knee-high" },
        { name: "Material", type: "Enum", options: "Cotton, Wool, Nylon" },
    ],
    '167': [ // Caps and hats
        { name: "Gender", type: "Enum", options: window.genderOptions },
        { name: "Type", type: "Enum", options: "Baseball Cap, Beanie, Sun Hat" },
        { name: "Material", type: "Enum", options: "Cotton, Wool, Polyester" },
    ],
    '169': [ // Gloves and Mufflers
        { name: "Gender", type: "Enum", options: window.genderOptions },
        { name: "Type", type: "Enum", options: "Gloves, Muffler" },
        { name: "Material", type: "Enum", options: "Wool, Fleece, Leather" },
        { name: "Season", type: "Enum", options: "Winter" },
    ],
    '170': [ // Women's Belts
        { name: "Material", type: "Enum", options: "Faux Leather, PU, Elastic, Fabric" },
        { name: "Buckle Type", type: "Enum", options: "Pin Buckle, Interlocking Buckle" },
        { name: "Width", type: "Enum", options: "Skinny, Medium, Wide" },
    ],
    '172': [ // Mens Belts
        { name: "Material", type: "Enum", options: "Genuine Leather, Faux Leather, PU, Canvas" },
        { name: "Buckle Type", type: "Enum", options: "Pin Buckle, Auto-lock" },
        { name: "Occasion", type: "Enum", options: "Formal, Casual" },
    ],
    '171': [ // Men's Cufflinks
        { name: "Material", type: "Enum", options: "Stainless Steel, Alloy, Brass" },
        { name: "Design", type: "Text", options: "e.g., Classic, Novelty" },
    ],
    '173': [ // Scarves and Stoles
        { name: "Fabric", type: "Enum", options: "Georgette, Chiffon, Cotton, Silk, Viscose" },
        { name: "Pattern", type: "Enum", options: "Printed, Plain, Crushed" },
        { name: "Season", type: "Enum", options: "Summer, All Seasons" },
    ],
    '174': [ // Laces
        { name: "Type", type: "Enum", options: "Shuttle Lace, Crochet Lace, Border Lace" },
        { name: "Use", type: "Enum", options: "Dresses, Dupattas, Sleeves" },
        { name: "Length", type: "Measurement", units: ["Yard", "Meters"] },
    ],
    '175': [ // Sun glasses
        { name: "Gender", type: "Enum", options: window.genderOptions },
        { name: "Frame Shape", type: "Enum", options: "Aviator, Wayfarer, Round, Cat Eye, Square" },
        { name: "Frame Material", type: "Enum", options: "Metal, Plastic" },
        { name: "Lens Feature", type: "Enum", options: "UV Protection, Polarized, Gradient" },
    ],
    '177': [ // Hair Accessories
        { name: "Type", type: "Enum", options: "Hair Band, Scrunchie, Hair Clip, Pins, Juda Pin, Ponytail Holder" },
        { name: "Material", type: "Enum", options: "Fabric, Plastic, Metal, Velvet" },
    ],

    // PARENT ID 75: Bedding
    '76': [ // Single Bedding
        { name: "Brand", type: "Text", options: "e.g., Gul Ahmed, Nishat, Bareeze" },
        { name: "Fabric", type: "Enum", options: "Cotton, Polycotton, Jersey, Flannel" },
        { name: "Thread Count", type: "Number", options: "e.g., 150, 200, 300" },
        { name: "Number of Pieces", type: "Enum", options: "2 (Sheet & Pillow), 3 (with Comforter)" },
        { name: "Includes", type: "Text", options: "e.g., 1 Single Bed Sheet, 1 Pillow Cover" },
        ...window.beddingSetMeasurementAttributes,
        window.colorAttribute
    ],
    '184': [ // Double Bed sheets
        { name: "Brand", type: "Text", options: "e.g., Gul Ahmed, Nishat, ChenOne" },
        { name: "Fabric", type: "Enum", options: "Cotton, Polycotton, Sateen, Jacquard" },
        { name: "Thread Count", type: "Number", options: "e.g., 150, 250, 400" },
        { name: "Size", type: "Enum", options: "Queen, King" },
        { name: "Number of Pieces", type: "Enum", options: "3 (Sheet & 2 Pillows), 4 (with Cushion)" },
        { name: "Includes", type: "Text", options: "e.g., 1 Flat Sheet, 2 Pillow Covers" },
        ...window.beddingSetMeasurementAttributes,
        window.colorAttribute
    ],
    '185': [ // Comfort Set
        { name: "Brand", type: "Text", options: "e.g., Ideas, ChenOne, Local" },
        { name: "Fabric", type: "Enum", options: "Cotton, Microfiber, Polycotton" },
        { name: "Size", type: "Enum", options: "Single, Double, Queen, King" },
        { name: "Number of Pieces", type: "Enum", options: "4, 6, 8" },
        { name: "Includes", type: "Textarea", options: "e.g., 1 Comforter, 1 Flat Sheet, 2 Pillow Covers, 2 Cushion Covers" },
        ...window.beddingSetMeasurementAttributes,
    ],
    '186': [ // Razai Set
        { name: "Brand", type: "Text", options: "e.g., Ideas, Nishat, Local" },
        { name: "Outer Fabric", type: "Enum", options: "Cotton, Velvet, Jacquard" },
        { name: "Filling Material", type: "Enum", options: "Polyester Fiber, Cotton" },
        { name: "Size", type: "Enum", options: "Single, Double" },
        { name: "Number of Pieces", type: "Enum", options: "2, 3, 4" },
        { name: "Includes", type: "Textarea", options: "e.g., 1 Razai, 1 Flat Sheet, 2 Pillow Covers" },
        ...window.beddingSetMeasurementAttributes,
    ],
    '187': [ // Bridal Set
        { name: "Brand", type: "Text", options: "e.g., Bareeze Home, Ideas, Nishat" },
        { name: "Fabric", type: "Enum", options: "Silk, Jamawar, Velvet, Jacquard, Sateen" },
        { name: "Work Type", type: "Enum", options: "Embroidered, Embellished, Applique" },
        { name: "Number of Pieces", type: "Enum", options: "8, 10, 12, 16" },
        { name: "Includes", type: "Textarea", options: "e.g., 1 Comforter, 1 Sheet, 2 Pillows, 2 Cushions, etc." },
        ...window.beddingSetMeasurementAttributes,
    ],
    '188': [ // Blankets
        { name: "Material", type: "Enum", options: "Fleece, Mink, Wool, Flannel" },
        { name: "Size", type: "Enum", options: "Single, Double" },
        { name: "Ply", type: "Enum", options: "1-Ply, 2-Ply" },
    ],
    '189': [ // Mattresses and Cover
        { name: "Type", type: "Enum", options: "Mattress, Mattress Protector/Cover" },
        { name: "Mattress Type", type: "Enum", options: "Spring, Foam, Memory Foam" },
        { name: "Protector Type", type: "Enum", options: "Waterproof, Quilted, Terry" },
        { name: "Size", type: "Text", options: "e.g., 78x72 Inches (King)" },
    ],
    '190': [ // Bed Pillows
        { name: "Filling Material", type: "Enum", options: "Ball Fiber, Polyester, Memory Foam" },
        { name: "Firmness", type: "Enum", options: "Soft, Medium, Firm" },
        { name: "Size", type: "Text", options: "e.g., 19x29 Inches" },
    ],
    '191': [ // Pillows Covers
        { name: "Fabric", type: "Enum", options: "Cotton, Sateen, Silk, Polycotton" },
        { name: "Type", type: "Enum", options: "Standard, Oxford" },
        { name: "Size", type: "Text", options: "e.g., 19x29 Inches" },
    ],
    '192': [ // Bed Spread
        { name: "Fabric", type: "Enum", options: "Cotton, Jacquard, Quilted, Velvet" },
        { name: "Size", type: "Enum", options: "Single, Double, King" },
        { name: "Number of Pieces", type: "Enum", options: "1, 3" },
    ],
    '193': [ // Fitted Sheets
        { name: "Fabric", type: "Enum", options: "Cotton, Jersey, Microfiber" },
        { name: "Size", type: "Text", options: "e.g., 78x72 Inches (King)" },
        { name: "Mattress Depth", type: "Text", options: "e.g., Fits up to 8 Inches" },
    ],
    
    // PARENT ID 77: Mother & Babies
    '78': [ // Babies Bags
        { name: "Type", type: "Enum", options: "Diaper Bag, Backpack, Tote" },
        { name: "Material", type: "Enum", options: "Polyester, Canvas" },
        { name: "Features", type: "Textarea", options: "e.g., Insulated Bottle Pockets, Changing Mat Included, Multiple Compartments, Waterproof" },
    ],
    '226': [ // Feeders and Pacifiers
        { name: "Type", type: "Enum", options: "Feeding Bottle, Pacifier/Soother, Sippy Cup" },
        { name: "Material", type: "Enum", options: "BPA-Free Plastic, Silicone" },
        { name: "Age Range", type: "Enum", options: "0-6 Months, 6-12 Months, 12+ Months" },
    ],
    '227': [ // Baby Accessories
        { name: "Accessory Type", type: "Enum", options: "Bib, Mittens, Cap, Swaddle Wrap" },
        { name: "Material", type: "Enum", options: "Cotton, Muslin, Fleece" },
    ],
    '228': [ // Baby Toys
        { name: "Toy Type", type: "Enum", options: "Rattle, Teether, Soft Toy, Play Mat" },
        { name: "Age Range", type: "Enum", options: "0-6 Months, 6-12 Months, 1+ Year" },
    ],
    '229': [ // Baby Shoes
        { name: "Type", type: "Enum", options: "Booties, Sandals, Pre-walkers" },
        { name: "Material", type: "Enum", options: "Soft Sole, Fabric, Faux Leather" },
        { name: "Age Range", type: "Enum", options: "0-6 Months, 6-12 Months" },
    ],
    '230': [ // Baby Health
        { name: "Type", type: "Enum", options: "Nail Clipper Set, Nasal Aspirator, Thermometer, Grooming Kit" },
    ],
    '231': [ // Baby Diapers
        { name: "Brand", type: "Text", options: "e.g., Pampers, Molfix, Canbebe" },
        { name: "Size", type: "Enum", options: "1, 2, 3, 4, 5, 6" },
        { name: "Pack Size", type: "Number", options: "e.g., 50, 100" },
    ],
    '232': [ // Baby Clothes
        { name: "Type", type: "Enum", options: "Romper, Bodysuit, Dress, Sleepsuit, Set" },
        { name: "Age Range", type: "Enum", options: "0-3 Months, 3-6 Months, 6-12 Months" },
        { name: "Fabric", type: "Enum", options: "Cotton, Jersey" },
    ],
    '233': [ // Baby Care
        { name: "Type", type: "Enum", options: "Lotion, Oil, Shampoo, Wipes, Powder" },
        { name: "Brand", type: "Text", options: "e.g., Johnson's, Sebamed, Mustela" },
    ],

    // PARENT ID 79: Women's Undergarments
    '80': [ // Camisoles
        { name: "Fabric", type: "Enum", options: "Cotton, Spandex, Viscose, Silk" },
        { name: "Features", type: "Text", options: "e.g., Padded, Adjustable Straps, Seamless" },
        { name: "Size", type: "Enum", options: "S, M, L, XL" },
    ],
    '234': [ // Bras
        { name: "Type", type: "Enum", options: "Padded, Non-Padded, Underwired, Wire-free, T-shirt, Sports, Strapless" },
        { name: "Fabric", type: "Enum", options: "Cotton, Lace, Spandex, Microfiber" },
        { name: "Size", type: "Text", options: "e.g., 32B, 34C, 36D" },
        window.colorAttribute
    ],
    '235': [ // Bras Set
        { name: "Set Includes", type: "Enum", options: "Bra & Panty" },
        { name: "Fabric", type: "Enum", options: "Lace, Cotton, Satin" },
        { name: "Size", type: "Text", options: "e.g., 34B" },
    ],
    '236': [ // Lingeries
        { name: "Type", type: "Enum", options: "Babydoll, Nighty, Robe Set" },
        { name: "Fabric", type: "Enum", options: "Satin, Lace, Net" },
        { name: "Size", type: "Enum", options: "Free Size, S, M, L" },
    ],
    '237': [ // Panties
        { name: "Type", type: "Enum", options: "Bikini, Hipster, Thong, High-waist" },
        { name: "Fabric", type: "Enum", options: "Cotton, Spandex, Lace" },
        { name: "Pack Size", type: "Enum", options: "Single, Pack of 3, Pack of 5" },
        { name: "Size", type: "Enum", options: "S, M, L, XL" },
    ],
    '238': [ // Women's Thermal
        { name: "Fabric", type: "Enum", options: "Cotton Blend, Wool Blend, Fleece Lined" },
        { name: "Type", type: "Enum", options: "Top, Bottom, Set" },
        { name: "Size", type: "Enum", options: "S, M, L, XL" },
    ],
    
    // PARENT ID 81: Men's Undergarments
    '82': [ // Men's underwear
        { name: "Brand", type: "Text", options: "e.g., Jockey, Calvin Klein, Local" },
        { name: "Type", type: "Enum", options: "Boxer, Brief, Trunk" },
        { name: "Fabric", type: "Enum", options: "Cotton, Modal, Spandex Blend, Jersey" },
        { name: "Size", type: "Enum", options: "S, M, L, XL" },
        { name: "Pack Of", type: "Enum", options: "1, 2, 3, 5" },
    ],
    '239': [ // Men's Undershirt
        { name: "Brand", type: "Text", options: "e.g., Jockey, Local" },
        { name: "Type", type: "Enum", options: "Vest, T-shirt style" },
        { name: "Fabric", type: "Enum", options: "Cotton, Rib" },
        { name: "Size", type: "Enum", options: "S, M, L, XL" },
    ],
    '240': [ // Men's Thermals
        { name: "Fabric", type: "Enum", options: "Cotton Blend, Wool Blend, Fleece Lined" },
        { name: "Type", type: "Enum", options: "Top, Bottom, Set" },
        { name: "Size", type: "Enum", options: "S, M, L, XL" },
    ],

    // PARENT ID 83: Men's Shawls
    '84': [ // Wool Shawls
        { name: "Material", type: "Enum", options: "Wool, Lambswool, Merino" },
        { name: "Pattern", type: "Enum", options: "Plain, Striped, Check" },
        { name: "Size", type: "Text", options: "e.g., 2.5 Meters" },
        window.colorAttribute
    ],
    '244': [ // Velvet Shawls
        { name: "Material", type: "Enum", options: "Velvet" },
        { name: "Work Type", type: "Enum", options: "Plain, Embroidered" },
        { name: "Occasion", type: "Enum", options: "Wedding, Formal" },
        window.colorAttribute
    ],

    // PARENT ID 85: Home Essentials
    '86': [ // Home Accessories
        { name: "Accessory Type", type: "Enum", options: "Door Mat, Laundry Basket, Tissue Box, Storage Box, Hangers" },
        { name: "Material", type: "Enum", options: "Plastic, Fabric, Wood, Rubber" },
    ],
    '94': [ // Home organizers
        { name: "Organizer Type", type: "Enum", options: "Wardrobe Organizer, Shoe Rack, Drawer Organizer, Makeup Organizer, Multipurpose Rack" },
        { name: "Material", type: "Enum", options: "Plastic, Fabric, Metal, Wood" },
    ],
    '178': [ // Home appliances
        { name: "Appliance Type", type: "Enum", options: "Iron, Vacuum Cleaner, Electric Insect Killer, Fan, Air Cooler" },
        { name: "Brand", type: "Text", options: "e.g., Philips, Panasonic, Dawlance, Westpoint" },
        { name: "Features", type: "Text", options: "e.g., Steam Iron, Bagless, Remote Control" },
    ],
    '179': [ // Bathroom Essentials
        { name: "Essential Type", type: "Enum", options: "Soap Dispenser, Toothbrush Holder, Towel Rack, Bathroom Scale, Shower Curtain" },
        { name: "Material", type: "Enum", options: "Plastic, Stainless Steel, Ceramic" },
    ],
    '180': [ // Health Accessories
        { name: "Accessory Type", type: "Enum", options: "Blood Pressure Monitor, Glucometer, Nebulizer, Hot Water Bottle, First Aid Kit" },
        { name: "Brand", type: "Text", options: "e.g., Omron, Accu-Chek" },
    ],
    '181': [ // Travel Accessories
        { name: "Accessory Type", type: "Enum", options: "Travel Pillow, Luggage Scale, Passport Holder, Packing Cubes, Universal Adapter" },
    ],
    '182': [ // Hardware & Tools
        { name: "Tool Type", type: "Enum", options: "Screwdriver Set, Pliers, Wrench, Tape Measure, Glue Gun, Drill Machine" },
    ],
    '183': [ // Gardening Tools
        { name: "Tool Type", type: "Enum", options: "Gloves, Trowel, Pruning Shears, Watering Can, Hose Pipe" },
    ],

    // PARENT ID 253: Bags
    '254': [ // Travel Bags
        { name: "Type", type: "Enum", options: "Suitcase/Trolley, Weekender Bag, Travel Backpack" },
        { name: "Material", type: "Enum", options: "Hard Shell (ABS/PC), Soft Shell (Polyester/Nylon)" },
        { name: "Size", type: "Enum", options: "Cabin, Medium, Large" },
        { name: "Features", type: "Text", options: "e.g., TSA Lock, 4 Spinner Wheels, Expandable" },
    ],
    '255': [ // Duffel bags
        { name: "Use", type: "Enum", options: "Gym, Travel, Sports" },
        { name: "Material", type: "Enum", options: "Polyester, Canvas, Faux Leather" },
        { name: "Features", type: "Text", options: "e.g., Shoe Compartment, Shoulder Strap" },
    ],
    '256': [ // Crossbody bags
        { name: "Gender", type: "Enum", options: window.genderOptions },
        { name: "Material", type: "Enum", options: "Faux Leather, PU, Canvas" },
        { name: "Features", type: "Text", options: "e.g., Adjustable Strap, Multiple Pockets" },
    ],
    '257': [ // Laptop Bags
        { name: "Bag Type", type: "Enum", options: "Backpack, Sleeve, Briefcase, Messenger Bag" },
        { name: "Material", type: "Enum", options: "Nylon, Polyester, Canvas, Faux Leather" },
        { name: "Compatible Size", type: "Text", options: "e.g., Fits up to 15.6-inch laptop" },
    ],

    // PARENT ID 267: Books & Stationary
    '268': [ // Autobiography
        { name: "Author", type: "Text" }, { name: "Language", type: "Enum", options: "English, Urdu" }, { name: "Binding", type: "Enum", options: "Hardcover, Paperback" },
    ],
    '269': [ // Biography
        { name: "Author", type: "Text" }, { name: "Language", type: "Enum", options: "English, Urdu" }, { name: "Binding", type: "Enum", options: "Hardcover, Paperback" },
    ],
    '270': [ // Kid's Books
        { name: "Book Type", type: "Enum", options: "Story Book, Coloring Book, Activity Book, Picture Book" },
        { name: "Age Range", type: "Enum", options: "2-5 Years, 5-8 Years, 8-12 Years" },
        { name: "Language", type: "Enum", options: "English, Urdu" },
    ],
    '271': [ // Learning Books
        { name: "Subject", type: "Text", options: "e.g., English, Maths, Science" },
        { name: "Age Group", type: "Text", options: "e.g., Pre-school, Primary" },
    ],
    '272': [ // Non -Fiction Books
        { name: "Genre", type: "Text" }, { name: "Author", type: "Text" }, { name: "Language", type: "Enum", options: "English, Urdu" }, { name: "Binding", type: "Enum", options: "Hardcover, Paperback" },
    ],
    '273': [ // Novels
        { name: "Genre", type: "Enum", options: "Fiction, Thriller, Romance, Fantasy" },
        { name: "Author", type: "Text" }, { name: "Language", type: "Enum", options: "English, Urdu" }, { name: "Binding", type: "Enum", options: "Hardcover, Paperback" },
    ],
    '274': [ // Poetry Books
        { name: "Author", type: "Text" }, { name: "Language", type: "Enum", options: "English, Urdu" }, { name: "Binding", type: "Enum", options: "Hardcover, Paperback" },
    ],
    '275': [ // Political & history Books
        { name: "Author", type: "Text" }, { name: "Language", type: "Enum", options: "English, Urdu" }, { name: "Binding", type: "Enum", options: "Hardcover, Paperback" },
    ],
    '276': [ // Self-help Learning Books
        { name: "Author", type: "Text" }, { name: "Language", type: "Enum", options: "English, Urdu" }, { name: "Binding", type: "Enum", options: "Hardcover, Paperback" },
    ],
    '277': [ // Stationery
        { name: "Item Type", type: "Enum", options: "Pen, Pencil, Notebook, Diary, Sticky Notes, Stapler, Paper" },
        { name: "Brand", type: "Text", options: "e.g., Dux, Pelikan, Dollar" },
    ],
    '278': [ // Office Supplies
        { name: "Item Type", type: "Enum", options: "File, Folder, Paper Shredder, Printer Ink, Calculator" },
    ],
    '279': [ // Party supplies
        { name: "Item Type", type: "Enum", options: "Balloons, Banners, Party Poppers, Disposable Plates & Cups" },
        { name: "Occasion", type: "Enum", options: "Birthday, Anniversary, Baby Shower" },
    ],
    '280': [ // School Bags
        { name: "Age Group", type: "Enum", options: "Pre-school, Primary, Secondary" },
        { name: "Material", type: "Enum", options: "Polyester, Nylon" },
        { name: "Features", type: "Text", options: "e.g., Multiple Compartments, Water Bottle Pocket" },
    ],
    
    // Fallback for categories without specific definitions yet (e.g., 'Others', 'Gifts')
    '87': [ { name: "Product Details", type: "Textarea", options: "Please provide a detailed description of your product." } ],
    '88': [ { name: "Product Details", type: "Textarea", options: "Please provide a detailed description of your product." } ],
    '89': [ { name: "Gift Type", type: "Enum", options: "Gift Box, Mug, Novelty Item" }, { name: "Occasion", type: "Enum", options: "Birthday, Anniversary, Valentine's Day" } ],
    '90': [ { name: "Gift Type", type: "Enum", options: "Gift Box, Mug, Novelty Item" }, { name: "Occasion", type: "Enum", options: "Birthday, Anniversary, Valentine's Day" } ],
};

// Programmatically add "Package Includes" and "Custom" options to all categories
(function enhanceAttributes() {
    const packageIncludesAttr = { name: "Package Includes", type: "Text", options: "e.g., 1 x Shirt, 1 x Trousers" };
    for (const key in window.categoryAttributes) {
        if (Object.hasOwnProperty.call(window.categoryAttributes, key)) {
            const attributes = window.categoryAttributes[key];
            
            if (!attributes.some(attr => attr.name === "Package Includes")) {
                attributes.push(packageIncludesAttr); 
            }

            attributes.forEach(attr => {
                if (attr.type === "Enum" && attr.options && typeof attr.options === 'string' && !attr.options.toLowerCase().includes("custom")) {
                    attr.options = "Custom, " + attr.options;
                }
            });
        }
    }
})();