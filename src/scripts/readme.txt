Inleverans görs genom att fälja instruktioner i respektive script: koket.js, mittkok.js, ica.js, tasteline.js
Efter en inleverans är det bra att köra dessa script för att tvätta datat:
1. changeName.js = Byter namn på vissa ingredienser och tags
2. fixFaultyIngredients.js = Rättar till felaktiga ingredienser
3. recountFoods.js och recountTags.js = Räknar om Uses för foods och tags i firebase

Om en konstig ingrediens/tag upptäcks i appen så finns flera alternativ för hantering:
1. Om det är felstavat eller bör kopplas ihop med annat befintligt namn så lägg till ett objekt i någon av listorna i changeName.js och kör.
2. Om ingrediensen är felaktigt byggd. T.ex unit, amount och name inte är satta rätt så får man se över inläsningsscripten eller lägg till en rättning i fixFaultyIngredient.js
3. Om receptet är helt utom räddning så radera det. Enskilda lösningar för att rädda ett recept ska inte implementeras i något script.
Men kan det hända andra recept så kan det vara nödvändigt.