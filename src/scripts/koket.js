var Nightmare = require('nightmare');
var nightmare = Nightmare({
  openDevTools: false, show: false, webPreferences: {
    images: false,
  }
})

var fs = require('fs');


//ta fram urls genom att:
//1. Gå till en sida på koket.se
//2. kör: var interv=setInterval(function(){if(document.querySelector('li.next').offsetParent!=null){document.querySelector('a[rel="next"]').click();}else{hrefs=Array.from(document.querySelectorAll('article.recipe header h2.title a')).map(a => a.href); console.log("done");clearInterval(interv);}},1000);
//2b. Nytt script var interv=setInterval(function(){if(document.querySelector('.recipe-list .pagination button').offsetParent!=null){document.querySelector('.recipe-list .pagination button').click();}else{hrefs=Array.from(document.querySelectorAll('article.recipe header h2.title a')).map(a => a.href); console.log("done");clearInterval(interv);}},1000);
//3. Vänta på att "done" har loggats i consolen.
//4. kopiera alla hrefs genom copy(Array.from(document.querySelectorAll('article.list-item.recipe .info .top h2 a')).map(a => a.href));
//5. paste in i urls
//6. kör set DEBUG=nightmare && node koket.js
//7. resultatet sparas i react/[filename].json
//8. kör node createRecipes.js med den genererade filen som input
let urls = [
  "https://www.koket.se/jenny_jager/soppor_och_grytor/gronsaker__potatis_och_andra_rotfrukter/spenatsoppa_med_agghalvor_och_dinkelkorn/",
  "https://www.koket.se/pelle-johansson/smaratter-tillbehor/artor-bonor-linser/falafel-med-harissa-eller-sambal-oelek/",
  "https://www.koket.se/forkvall/ulrika-davidsson/kottfars--och-rotfruktssoppa/",
  "https://www.koket.se/cathrine_schuck/soppor_och_grytor/gronsaker__potatis_och_andra_rotfrukter/snabba_grytan/",
  "https://www.koket.se/malin_soderstrom/frukost_och_brunch/agg_och_mejeri/omelettrulle_med_ramsloksgetost/",
  "https://www.koket.se/gi-viktkoll/varmratter/gronsaker--potatis-och-andra-rotfrukter/jespers-pepparkryddade-quornbiff/",
  "https://www.koket.se/ulrika-jisland/varmratter/pasta-och-nudlar/snabb-citronpasta/",
  "https://www.koket.se/forkvall/johan-jureskog/wraps-med-varm-lovbiffssallad/",
  "https://www.koket.se/anette_rosvall_och_emma_hamberg/varmratter/pasta_och_nudlar/ravioligratang/",
  "https://www.koket.se/cecilia_m_sporre/varmratter/gronsaker/grillade_gronsaker_och_halloumi_med_rostat_ortknacke/",
  "https://www.koket.se/lisa-lemke/kottfarsrora-med-paprika-och-koriander/",
  "https://www.koket.se/ola_lauritzson/varmratter/kott/stekt_kotlett_med_grillade_gronsaker/",
  "https://www.koket.se/ola_lauritzson/frukost_och_brunch/agg_och_mejeri/agg_och_tonfiskrora_med_avokado/",
  "https://www.koket.se/ola_lauritzson/varmratter/kott/kassler_med_keso_och_sallad/",
  "https://www.koket.se/gi-gourmet/ola-lauritzson/omelettwraps-med-kyckling-och-curry/",
  "https://www.koket.se/sommar-med-ernst/ernst-kirchsteiger/omelett-a-la-ernst-kirchsteiger/",
  "https://www.koket.se/mikael_lindstrom/smaratter_och_tillbehor/risoch_184_couscous_och_andra_gryn/couscoussallad_med_applen_och_getost/",
  "https://www.koket.se/snabb-fransk-kottgryta-med-pasta",
  "https://www.koket.se/gi_viktkoll/frukost_och_brunch/agg_och_mejeri/omelett_med_tomat__ost_och_basilika/",
  "https://www.koket.se/leila-bakar/leila-lindholm/snabba-franska-paronflarn/",
  "https://www.koket.se/erik_froderberg/soppor_och_grytor/fisk_och_skaldjur/erix_snabba_fiskgryta/",
  "https://www.koket.se/leila_lindholm/huvudratter/gronsaker__potatis_och_andra_rotfrukter/turbosallad_med_grillat_paron_och_annat/",
  "https://www.koket.se/krake_lithander/varmratter/gronsaker__potatis_och_andra_rotfrukter/vegetarisk_curry/",
  "https://www.koket.se/pelle_johansson/mackor_och_wraps/kott/tunnbrodrulle/",
  "https://www.koket.se/gi_viktkoll/huvudratter/gronsakeroch_184_potatis_och_andra_rotfrukter/quornfarsspett_med_syrlig_appelsallad/",
  "https://www.koket.se/ulrika_jisland/varmratter/fisk_och_skaldjur/ulrikas_snabba_krabb__och_persiljepasta/",
  "https://www.koket.se/_/varmratter/fisk_och_skaldjur/snabb_lax_med_gronsakswok/",
  "https://www.koket.se/vegetarisk-pasta",
  "https://www.koket.se/jacob-wismar/frukost-och-brunch/agg-och-mejeri/jacob-wismars-italienska-omelett/",
  "https://www.koket.se/johan-hedberg/soppor-grytor/kott/gulaschsoppa/",
  "https://www.koket.se/koket/fredrik-eriksson/lammfarsspett/",
  "https://www.koket.se/fiskgryta-med-graslok",
  "https://www.koket.se/tommy_myllymaki/varmratter/kyckling/paella/",
  "https://www.koket.se/fusilli-med-lax-och-bladspenat",
  "https://www.koket.se/snabba-kottsoppan",
  "https://www.koket.se/johan_sorberg/mackor_och_wraps/kyckling_och_fagel/club_sandwich/",
  "https://www.koket.se/gi-viktkoll/varmratter/gronsaker--potatis-och-andra-rotfrukter/vegokorv-med-gronsaksris/",
  "https://www.koket.se/ulrika_davidsson/soppor_och_grytor/kott/lovbiffsgryta/",
  "https://www.koket.se/nyhetsmorgon/malin-soderstrom/matladesallad-med-kyckling/",
  "https://www.koket.se/markus-aujalay/varmratter/fisk-och-skaldjur/laxkottbullar-med-pepparrotsyoghurt/",
  "https://www.koket.se/danyel_couet/varmratter/agg_och_mejeri/oppen_omelett_med_orter/",
  "https://www.koket.se/kristina_eriksson/varmratter/fisk_och_skaldjur/lax_under_pinjenots__och_koriandertacke/",
  "https://www.koket.se/brigit_l__binns/sallader/kyckling_och_fagel/kalkonsallad/",
  "https://www.koket.se/brigit_l__binns/sallader/kott/rucola__och_potatissallad_med_flankstek/",
  "https://www.koket.se/leif_mannerstrom/varmratter/agg_och_mejeri/omelett_med_rakstuvning/",
  "https://www.koket.se/mitt-kok/tommy-myllymaki/tommys-snabba-kalops/",
  "https://www.koket.se/snabb-biff-stroganoff",
  "https://www.koket.se/asiatisk-wok",
  "https://www.koket.se/kyckling-och-skinkgratang-med-selleri",
  "https://www.koket.se/forkvall/monika-ahlberg/snabbaste-thaigrytan/",
  "https://www.koket.se/lotta_lundgren/smaratter_och_tillbehor/kyckling_och_fagel/kycklingspett_pa_citrongras/",
  "https://www.koket.se/stefan_superti/frukost_och_brunch/kyckling_och_fagel/club_sandwich/",
  "https://www.koket.se/markus-aujalay/varmratter/kott/markus-aujalays-lammfarsbiffar/",
  "https://www.koket.se/paula-ahlsen-soder/soppor-och-grytor/fisk-och-skaldjur/laxgryta-med-curry/",
  "https://www.koket.se/paula_ahlsen_soder/soppor_och_grytor/fisk_och_skaldjur/laxgryta_med_vin/",
  "https://www.koket.se/mitt-kok/jessica-frej/renklamma-med-orter-och-pepparrot/",
  "https://www.koket.se/filip-fasten/varmratter/agg-och-mejeri/flaskpannkaka-med-kummin/",
  "https://www.koket.se/louise_johansson/frukost_och_brunch/agg_och_mejeri/varig_omelett/",
  "https://www.koket.se/lisa-lemke/lisa-lemke/ajvarmarinerade-kycklingspett-med-saffransaioli/",
  "https://www.koket.se/filip_fasten/varmratter/kott/kottbullar_med_pressgurka_och_farskpotatis/",
  "https://www.koket.se/nigella_lawson/varmratter/pasta_och_nudlar/pasta_med_valnotssas/",
  "https://www.koket.se/mikael_lindstrom/varmratter/kott/lammbullar_med_fetaost_och_couscous/",
  "https://www.koket.se/du-ar-vad-du-ater/anna-skipper/anna-skippers-nyttiga-hamburgare/",
  "https://www.koket.se/anette_rosvall_och_emma_hamberg/varmratter/agg_och_mejeri/snabbpizza_med_ugnsbakade_tomater/",
  "https://www.koket.se/husmorsorna/anette-rosvall-och-emma-hamberg/anettes-snabba-kycklingpasta/",
  "https://www.koket.se/filip_fasten/varmratter/_/mitt_koks_hamburgare/",
  "https://www.koket.se/jamie_oliver/soppor_och_grytor/artor/jamie_olivers_vegetariska_currygryta/",
  "https://www.koket.se/lisa-lemke/indisk-kottfarsgryta/",
  "https://www.koket.se/jamie-oliver/gratanger/gronsaker--potatis-och-andra-rotfrukter/jamie-olivers-zucchinigratang/",
  "https://www.koket.se/james___aland/forratter/fisk_och_skaldjur/fish_and_chips/",
  "https://www.koket.se/le-parfait/sallader/gronsaker--potatis-och-andra-rotfrukter/varm-sallad-med-brynt-brysselkal/",
  "https://www.koket.se/filip_fasten/varmratter/kott/pannbiff_med_svampsas/",
  "https://www.koket.se/monica-eisenmans-asiatiska-nudlar-och-smaratter/monica-eisenman/snabb-kyckling--och-gronsakswok/",
  "https://www.koket.se/efter-tio/bjorn-ferry/snabb-omelett-med-tacofyllning/",
  "https://www.koket.se/tommy_myllymaki/omelett/agg_och_mejeri/omelett_pa_2_vis/",
  "https://www.koket.se/sanna-toringe/soppor-och-grytor/fisk-och-skaldjur/snabblagad-gryta-med-fisk/",
  "https://www.koket.se/mitt-kok/karin-andersson/svartpepparbakad-kassler/",
  "https://www.koket.se/nyhetsmorgon/ase-falkman-fredriksson/lax-och-rakor-i-kokos-med-ajvarsas/",
  "https://www.koket.se/mitt-kok/paolo-roberto/pasta-med-snabb-paprikasas/",
  "https://www.koket.se/godare-an-glass/tea-stjarne/teas-snabba-mackor-med-tacofars/",
  "https://www.koket.se/lisa_lemke/gratanger/pasta_och_nudlar/snabb_lasagne_med_ricotta__tomat__basilika/",
  "https://www.koket.se/nyhetsmorgon/fredrik-eriksson/snabb-laxpudding/",
  "https://www.koket.se/lchf-kokboken/sten-sture-skaldeman/omelett-med-svampstuvning/",
  "https://www.koket.se/fredrik_eriksson/frukost_och_brunch/agg_och_mejeri/omelett_med_karljohansvamp/",
  "https://www.koket.se/lchf-kokboken/sten-sture-skaldeman/ingerlises-tacogratang/",
  "https://www.koket.se/lchf-kokboken/sten-sture-skaldeman/superenkel-viltgryta/",
  "https://www.koket.se/malin_soderstrom/soppor_och_grytor/gronsaker/vegetarisk_curry_pa_potatis_och_blomkal/",
  "https://www.koket.se/sten-sture-skaldeman/soppor-och-grytor/fisk-och-skaldjur/snabb-fisksoppa/",
  "https://www.koket.se/mitt-kok/evelina-borneling/lammfarsbiffar-med-schalottenloksas/",
  "https://www.koket.se/vad-blir-det-for-mat/per-morberg/per-morbergs-goda-pannkakor/",
  "https://www.koket.se/mitt-kok/filip-fasten/flaskfile-med-hasselbackspotatis/",
  "https://www.koket.se/mitt-kok/karin-andersson/vitkalspasta/",
  "https://www.koket.se/anna-hallen/soppor-och-grytor/korv-och-chark/snabb-korvgryta-a-la-lchf/",
  "https://www.koket.se/pannkaka1",
  "https://www.koket.se/mitt-kok/karin-andersson/stekt-ris-med-skinka--rakor--agg-och-koriander/",
  "https://www.koket.se/nyhetsmorgon---mitt-kok/karin-andersson/snabb-pizza-pa-tortillabrod/",
  "https://www.koket.se/mitt-kok/karin-andersson/snabb-potatissallad-med-makrill--dill-och-tomat/",
  "https://www.koket.se/mitt-kok/tommy-myllymaki/snabb-kottfarslimpa-pa-pizzavis/",
  "https://www.koket.se/nyhetsmorgon/victoria-hansson/fetaostbiffar-och-kramig-potatissallad/",
  "https://www.koket.se/mitt-kok/jennie-wallden/grillad-kyckling-med-rostad-pommes/",
  "https://www.koket.se/nyhetsmorgon/emelie-holm/snabb-cheesecake-i-burk/",
  "https://www.koket.se/mitt-kok/mira-sirelius/flaskfile-med-vitloks--och-basilikadressing/",
  "https://www.koket.se/mitt-kok---sverigeresan/karin-andersson/renskav-i-pitabrod/",
  "https://www.koket.se/tina-i-fjallen/tina-nordstrom/friterad-tortellini-med-snabb-tomatsas/",
  "https://www.koket.se/karin-andersson/soppor-och-grytor/kott/snabb-asiatisk-kottgryta/",
  "https://www.koket.se/mitt-kok/tommy-myllymaki/ugnsbakad-lax-med-krispiga-gronsaker/",
  "https://www.koket.se/mitt-kok/tommy-myllymaki/ciderkyckling-med-ris/",
  "https://www.koket.se/monika-ahlberg/snabblagat/kott/snabblagad-kottfarssoppa-med-tacosmak/",
  "https://www.koket.se/mitt-kok/lisa-lemke/sallad-pa-flankstek-med-dijondressing/",
  "https://www.koket.se/mitt-kok/tommy-myllymaki/torsk-med-smorsvangda-tomater/",
  "https://www.koket.se/mitt-kok/lisa-lemke/kyckling-med-rotfrukter-i-langpanna/",
  "https://www.koket.se/mitt-kok/lisa-lemke/flaskfile-i-asiatisk-wok/",
  "https://www.koket.se/lisa-lemke/frukost-och-brunch/agg-och-mejeri/omelett-pa-tva-olika-satt/",
  "https://www.koket.se/mitt-kok/lisa-lemke/snabb-fisksoppa-med-saffran-och-fryst-lax/",
  "https://www.koket.se/lisa-lemke/gratang/korv-och-chark/snabb-falukorv-i-ugn-med-ratatouille/",
  "https://www.koket.se/mitt-kok/tommy-myllymaki/tommys-traditionella-dillkott/",
  "https://www.koket.se/nyhetsmorgon/sigrid-barany/snabbsill-i-tva-varianter",
  "https://www.koket.se/matjessallad-med-brynt-smor-lisa-lemkes-recept",
  "https://www.koket.se/snabblagad-kycklingsallad-med-avokado-och-jordnotter",
  "https://www.koket.se/kall-risgrynsgrot-med-bar",
  "https://www.koket.se/dutch-baby-med-bar-och-gradde",
  "https://www.koket.se/sebastien-boudets-gourmetmackor",
  "https://www.koket.se/marockansk-morotssallad-med-varmrokt-lax",
  "https://www.koket.se/pasta-med-kronartskocka-mandel-och-citron",
  "https://www.koket.se/grillad-korv-i-brod-med-senapsmajonnas-och-gronkalschips",
  "https://www.koket.se/italiensk-tonfisksallad-med-oliver-och-mozzarella",
  "https://www.koket.se/spaghetti-med-tonfisksas",
  "https://www.koket.se/somrig-silltaco-med-avokado-agg-och-potatis",
  "https://www.koket.se/fars-och-bongryta-med-hoisinsmak",
  "https://www.koket.se/pasta-med-kottfars-och-rotfruktssas",
  "https://www.koket.se/pasta-med-tapenade-och-stekta-gronsaker",
  "https://www.koket.se/falukorv-med-ajvar-och-spenatcouscous",
  "https://www.koket.se/grillad-fylld-paprika-med-matvete-och-salsa-verde",
  "https://www.koket.se/pasta-med-lax-och-citronmascarpone",
  "https://www.koket.se/potatis-och-purjolokssoppa-med-krasse-siri-barjes-recept",
  "https://www.koket.se/korv-stroganoff-med-linser",
  "https://www.koket.se/ljummen-linssallad-med-varmrokt-lax",
  "https://www.koket.se/linssallad-med-rodbetshummus",
  "https://www.koket.se/poke-bowl-med-rakor",
  "https://www.koket.se/pastasallad-med-lufttorkad-skinka",
  "https://www.koket.se/viktvaktarnas-pastasallad-med-kyckling",
  "https://www.koket.se/couscoussallad-med-morotsbollar-avokado-picklad-rodlok",
  "https://www.koket.se/crepes-med-ost-sweet-potatofyllning",
  "https://www.koket.se/sweet-potato-lentil-bowl-med-avokado",
  "https://www.koket.se/pytt-i-panna-wrap-med-gronkalspesto-och-picklad-lok",
  "https://www.koket.se/kycklingfile-med-granatapplepesto-och-ricotta",
  "https://www.koket.se/supermix-med-laxfile-limevinagrett-och-rostad-sparris",
  "https://www.koket.se/supermix-med-sesamhalloumi-ingefarsdressing-och-melon",
  "https://www.koket.se/toms-rotfruktssallad-med-fryst-getost",
  "https://www.koket.se/glasnudelsallad-med-shiitakesvamp",
  "https://www.koket.se/betsallad-med-clementiner-och-getost",
  "https://www.koket.se/majswrap-med-grillad-marinerad-paprika-hummus-och-chevre",
  "https://www.koket.se/vegetarisk-kebabrulle-med-nuggets-och-tva-saser",
  "https://www.koket.se/snabb-sandwich-med-vegostrimlor-tomat-och-basilikapesto",
  "https://www.koket.se/tacos-med-vegostrimlor-och-snabb-mangosalsa",
  "https://www.koket.se/kramig-laxragu",
  "https://www.koket.se/ljummen-maskrossallad-med-rodbetor-och-fetaost",
  "https://www.koket.se/nasselsoppa-sandra-mastios-recept",
  "https://www.koket.se/frotoppad-tomatsallad",
  "https://www.koket.se/krispig-zucchini-med-supersnabb-sas",
  "https://www.koket.se/vegobolognese-med-kikartor-orter",
  "https://www.koket.se/korvbrodsrulle-med-avokadoskagen",
  "https://www.koket.se/banh-mi-med-kryddiga-vegostrimlor-picklad-rodlok",
  "https://www.koket.se/supersnabb-kramig-vegocarbonara",
  "https://www.koket.se/pita-med-vegostrimlor-vitloksdressing",
  "https://www.koket.se/burgare-med-vegostrimlor-mosad-avokado",
  "https://www.koket.se/sotpotatissoppa-med-vitloksstekt-vegokorv-och-gronkalschips",
  "https://www.koket.se/graddig-vego-stroganoff-med-vitlok-och-timjan",
  "https://www.koket.se/blixtsnabb-tortillapizza-med-portabello-och-korv",
  "https://www.koket.se/vegokorv-i-brod-med-gronkalslaw",
  "https://www.koket.se/vegetarisk-wrap-med-nuggets-och-gronkal",
  "https://www.koket.se/vegopytt-med-nuggets-sparris-broccoli-och-ris",
  "https://www.koket.se/vego-caesarsallad-med-nuggets-och-rokiga-notter",
  "https://www.koket.se/10-minuters-nudelbowl-med-nuggets-och-avokado",
  "https://www.koket.se/vegonuggets-med-gronsaksstavar-och-dipp",
  "https://www.koket.se/burrito-med-stekt-ostronskivling-krispig-kal-och-jalape-oaioli",
  "https://www.koket.se/bakad-sotpotatis-med-fetaost-avokado-och-bacon",
  "https://www.koket.se/shakshuka-med-lammkorv",
  "https://www.koket.se/bonchili-med-ol-och-kakao",
  "https://www.koket.se/wrap-med-pulled-kronartskocka-och-srirachamajonnas",
  "https://www.koket.se/quinoasallad-med-pumpa-getost-och-honey-mustard",
  "https://www.koket.se/vegobiffar-med-klyftpotatis-och-vitloksmajonnas",
  "https://www.koket.se/bibimbap-med-lax-i-ugn-kimchi-agg-och-sesammajonnas",
  "https://www.koket.se/oppen-lasagne-med-tomatsas-parmesan-och-majonnas",
  "https://www.koket.se/panerad-fisk-med-kramig-avokado-och-artmajonnas",
  "https://www.koket.se/pasta-med-bacon-spetskal-citron-majonnas-och-parmesan",
  "https://www.koket.se/vegobowl-med-gronkalsmajonnas",
  "https://www.koket.se/baguette-med-rodbeta-getost-och-saltrostade-pumpakarnor",
  "https://www.koket.se/anklarsbaguette-med-dragonmajonnas",
  "https://www.koket.se/aggrora-med-cheddarost-och-ansjovissallad",
  "https://www.koket.se/festlig-club-sandwich-med-avokado-och-rostade-tomater",
  "https://www.koket.se/caesarwrap-med-grillad-kyckling-och-kramig-dressing",
  "https://www.koket.se/lyxig-korv-med-brod-med-tryffelmajonnas-och-rostad-purjolok",
  "https://www.koket.se/pizza-med-dillmajonnas-rom-och-rodlok",
  "https://www.koket.se/vegetarisk-smorgastarta-med-cheddar-lok-och-chili",
  "https://www.koket.se/portabello-i-ugn-fylld-med-ortig-majonnas",
  "https://www.koket.se/halloumiburgare-med-kramig-myntadressing",
  "https://www.koket.se/matjessill-lerpotta-med-brynt-smor-och-rivet-agg",
  "https://www.koket.se/fiskknyte-med-pestoslungad-farskpotatis",
  "https://www.koket.se/agg-benedict-med-kallrokt-lax-hollandaise-pa-brynt-smor-och-lojrom",
  "https://www.koket.se/grillad-halloumi-med-vattenmelonsallad",
  "https://www.koket.se/grillad-quinoasallad-med-nektarin-och-granatapple",
  "https://www.koket.se/nudelsallad-med-rakor",
  "https://www.koket.se/sotpotatissoppa-med-chorizo",
  "https://www.koket.se/halloumigryta-med-oliver-och-plommontomater",
  "https://www.koket.se/pizza-bianco-med-pesto-kronartskocka",
  "https://www.koket.se/torsk-med-frasigt-tacke-serveras-med-smorslungad-broccoli",
  "https://www.koket.se/lax-i-ugn-med-pesto-rodbetor-och-serranostrossel",
  "https://www.koket.se/pasta-pa-3-ingredienser-peperonipasta-med-chorizo",
  "https://www.koket.se/spaghetti-med-chorizokottfarsas",
  "https://www.koket.se/het-korvstroganoff-med-salsiccia-och-rod-peperoni",
  "https://www.koket.se/korv-och-vaffla",
  "https://www.koket.se/vaffla-benedict",
  "https://www.koket.se/bovetevafflor-med-jast",
  "https://www.koket.se/glutenfria-havrevafflor-jessica-frejs-recept",
  "https://www.koket.se/bananpannkakor-med-blabarsmascarpone",
  "https://www.koket.se/pannkaksmuffins-med-hallon-och-blabar",
  "https://www.koket.se/glutenfria-pannkakor-med-havremjol",
  "https://www.koket.se/laxbowl-med-gron-pesto",
  "https://www.koket.se/glutenfria-vafflor-med-mandelmjol",
  "https://www.koket.se/aggrora-med-inkokt-lax-pa-froknacke",
  "https://www.koket.se/bulgur-med-tomat-och-kikarter",
  "https://www.koket.se/nasi-goreng-med-kyckling",
  "https://www.koket.se/kokoslax-med-ingefara-och-sockerarter",
  "https://www.koket.se/koreansk-street-toast",
  "https://www.koket.se/teriyakilaxwrap-med-spenat-och-bongroddar",
  "https://www.koket.se/kimchi-fried-rice-med-edamame",
  "https://www.koket.se/citrussallad-med-ugnsbakad-fetaost",
  "https://www.koket.se/halloumiwraps-tills-matladan",
  "https://www.koket.se/shakshuka-mandelmanns-recept",
  "https://www.koket.se/pasta-med-artor-och-broccoli",
  "https://www.koket.se/julresttacos-med-ingefarskryddad-rodbetssallad-och-halloumi",
  "https://www.koket.se/okonomiyaki-japanska-kalplattar",
  "https://www.koket.se/lax-i-ugn-med-lime-och-cashewtacke",
  "https://www.koket.se/lax-med-broccolipesto",
  "https://www.koket.se/lax-i-ugn-med-vasterbottentacke",
  "https://www.koket.se/caesarsallad-med-kyckling-och-senapscrostini",
  "https://www.koket.se/farslasagne-med-cottage-cheese",
  "https://www.koket.se/pasta-carbonara-med-kalkonbacon",
  "https://www.koket.se/pasta-med-rakor-och-avokado",
  "https://www.koket.se/libapizza-med-karamelliserad-rodlok-och-fikon",
  "https://www.koket.se/viktvaktarnas-vegetariska-lasagne",
  "https://www.koket.se/rodbetsbiffar-med-linser-och-kikartor",
  "https://www.koket.se/brysselkalssallad-med-tranbar-och-fetaost",
  "https://www.koket.se/mana-ish-arabiska-pizzor",
  "https://www.koket.se/blackberry-waffles-med-vaniljkram",
  "https://www.koket.se/svarta-vafflor-med-rom-och-smetana",
  "https://www.koket.se/omelett-sebastien-boudets-recept",
  "https://www.koket.se/pumpa-och-morotssoppa-med-saltade-pumpakarnor-och-krutonger-2",
  "https://www.koket.se/mitt-kok/tommy-myllymaki/vegetarisk-currygryta-med-paprika/",
  "https://www.koket.se/matig-gron-superskal-med-sunny-citrus-och-tahinidressing",
  "https://www.koket.se/frasiga-glutenfria-pannkakor",
  "https://www.koket.se/kramig-majssoppa-med-ostkrutonger",
  "https://www.koket.se/kryddstekt-halloumi-med-avokadorora-och-quinoa",
  "https://www.koket.se/pannkakor-med-citronvatten",
  "https://www.koket.se/vegowrap-med-avokado-fetaost-och-jordnotter",
  "https://www.koket.se/vegoquesadillas-med-mangosas",
  "https://www.koket.se/ljummen-potatissallad-med-agg-brynt-smor-dill-pepparrot-och-rakor",
  "https://www.koket.se/mitt-kok/tommy-myllymaki/pasta-med-spenat-och-fetaost/",
  "https://www.koket.se/ugnsbakad-sej-i-dillsas-med-pepparrotsmos",
  "https://www.koket.se/grillad-paprikasallad-med-fetaost",
  "https://www.koket.se/pitabrod-med-kryddig-fars-och-kalsallad",
  "https://www.koket.se/frisk-artsoppa-med-mynta-och-basilika",
  "https://www.koket.se/caprese-pa-mastios-vis",
  "https://www.koket.se/wrapsrullar-med-kycklingrora-i-vitkalsblad",
  "https://www.koket.se/klassisk-svampmacka-med-portabellosvamp-och-ostronskivling",
  "https://www.koket.se/bowl-med-chiliris-gronsaker-och-tofudressing",
  "https://www.koket.se/smorgas-med-gotlandskt-lamm-kantareller-och-kramig-kalsallad",
  "https://www.koket.se/vegetarisk-blt-med-portabellosvamp-och-avokado",
  "https://www.koket.se/halloumigryta-med-tomat-linser-och-chili",
  "https://www.koket.se/filodegspaj-med-fetaost-farsk-spenat-och-solrosfron",
  "https://www.koket.se/morotsbollar-med-ortyoghurt-och-rodkalssallad",
  "https://www.koket.se/wrap-med-vegetariska-morotsbullar",
  "https://www.koket.se/ostpaj-i-filodeg-med-smetana-rom-och-lok",
  "https://www.koket.se/klar-tomatbuljong-med-marinerade-tomater",
  "https://www.koket.se/jordgubbssallad-med-halloumi-tomater-notter-och-honung",
  "https://www.koket.se/halloumirarakor-med-avokadosalsa",
  "https://www.koket.se/sallad-med-getost-bacon-och-valnotter",
  "https://www.koket.se/tunnbrodrulle-med-korv-och-raksallad",
  "https://www.koket.se/five-spice-auberginebowl-med-krispigt-agg",
  "https://www.koket.se/johan-hedbergs-grillade-sommarsallad",
  "https://www.koket.se/gron-artsoppa-med-mynta-och-lime",
  "https://www.koket.se/baguette-fylld-med-ortmarinerad-kyckling-och-grillade-gronsaker",
  "https://www.koket.se/italiensk-frittata-med-citronkokt-lok",
  "https://www.koket.se/fransk-pastasallad-med-vita-bonor-agg-och-grasloksdressing",
  "https://www.koket.se/grillad-majstortilla-med-chorizo-och-kalsallad",
  "https://www.koket.se/grovt-brod-med-bockling-betor-och-picklad-lok",
  "https://www.koket.se/vegansk-caesarsallad-med-avokado-och-fron",
  "https://www.koket.se/graddig-pasta-med-lax-spenat-och-endive",
  "https://www.koket.se/farrosallad-med-tomatpesto-och-mozzarella",
  "https://www.koket.se/jessica-frejs-melonsallad-med-fetaost",
  "https://www.koket.se/halloumi-med-gremolata",
  "https://www.koket.se/dilltsatsiki-med-kyckling",
  "https://www.koket.se/frittata-med-chorizo",
  "https://www.koket.se/varmrokt-lax-med-basilikasallad",
  "https://www.koket.se/snabb-tonfiskpizza-med-sparris-och-vasterbottensost",
  "https://www.koket.se/sillbowl-med-pressad-potatis-och-wasabikram",
  "https://www.koket.se/tomatpaj-2",
  "https://www.koket.se/viktvaktarnas-smorgastarta",
  "https://www.koket.se/matjessill-med-dillslungad-potatis-och-pepparrotskram",
  "https://www.koket.se/somrig-matjeswrap-med-krispig-pak-choi-lingonchutney",
  "https://www.koket.se/matjesklamma-med-het-rakrora",
  "https://www.koket.se/somriga-tonfiskburgare",
  "https://www.koket.se/krispig-tonfisktaco-med-mango-chilisas",
  "https://www.koket.se/tonfiskwrap-med-mangodressing-picklad-rodkal",
  "https://www.koket.se/smorrebrod-med-sparris-lax-och-pocherat-agg",
  "https://www.koket.se/smorrebrod-stjerneskud",
  "https://www.koket.se/smorrebrod-dyrlaegens-nattmad",
  "https://www.koket.se/filodegspaj-med-greve-och-vasterbottensost",
  "https://www.koket.se/pasta-med-morotsbullar-och-tomatsas",
  "https://www.koket.se/pastasallad-med-notchorizo",
  "https://www.koket.se/the-chicago-dog",
  "https://www.koket.se/paolos-burrata-med-prosciutto-och-sota-tomater",
  "https://www.koket.se/mazamen",
  "https://www.koket.se/wraps-med-stekt-agg-aubergine-och-chermoula",
  "https://www.koket.se/gron-papayasallad-i-rodkalsblad",
  "https://www.koket.se/lyxig-macka-med-cashewnotsdipp-och-gron-topping",
  "https://www.koket.se/nygraddat-tunnbrod-med-creme-fraiche-och-musseltopping",
  "https://www.koket.se/renee-voltaires-vegobiffar",
  "https://www.koket.se/avokadobakade-agg-med-chorizo",
  "https://www.koket.se/grillad-toast-med-lagrad-ost-kallskuret-och-sallad",
  "https://www.koket.se/aggrora-med-kal-hasselnotter-och-sesamfron",
  "https://www.koket.se/friterad-avokado-med-citrondipp",
  "https://www.koket.se/kyckling-ramen-med-pekingagg-sobanudlar-och-svampbuljong",
  "https://www.koket.se/sillmacka-med-basilika-och-kokt-agg",
  "https://www.koket.se/kall-kokosgazpacho-med-rakor-och-mynta",
  "https://www.koket.se/gallo-pinto-sydamerikansk-klassiker",
  "https://www.koket.se/flaskkotletter-med-mandelpotatispure-och-karamelliserad-rodlok",
  "https://www.koket.se/flaskkotletter-med-stekt-potatis-och-waldorfsallad",
  "https://www.koket.se/tom-sjostedt/tilltugg-och-tapas/fisk-och-skaldjur/lax-pa-crostini/",
  "https://www.koket.se/ansjovispaj-med-ost-och-primorer",
  "https://www.koket.se/tonfiskrora-i-salladsblad-eller-pa-grovt-brod",
  "https://www.koket.se/hummus-bowl-med-tomat-och-aubergine",
  "https://www.koket.se/belgiska-grahamsvafflor-med-chevrekram-parmaskinka-ruccola-pinjenotter",
  "https://www.koket.se/belgiska-grahamsvafflor-med-lojrom-syrad-gradde-och-rodlok",
  "https://www.koket.se/vegetarisk-varpytt-med-limekram",
  "https://www.koket.se/pytt-i-panna-med-lax-och-sparris",
  "https://www.koket.se/pytt-i-panna-klassisk",
  "https://www.koket.se/asiatisk-poke-bowl-med-tonfisk",
  "https://www.koket.se/poke-bowl-med-marinerad-lax",
  "https://www.koket.se/blomkalstaboulle-med-stekt-lax-och-romsas",
  "https://www.koket.se/matig-sallad-med-agg-potatis-och-surdegskrutonger",
  "https://www.koket.se/poke-bowl-american-samurai",
  "https://www.koket.se/poke-bowl-japanese-surfer",
  "https://www.koket.se/poke-bowl-hawaiian-tuna",
  "https://www.koket.se/spaghetti-alla-puttanesca",
  "https://www.koket.se/linguine-med-kapris-och-tomat",
  "https://www.koket.se/pasta-med-spenat-mascarpone-och-rokt-lax",
  "https://www.koket.se/kramig-laxpasta-med-vitvinssas-och-parmesan",
  "https://www.koket.se/spicy-chicken-salad-med-mynta-och-jordnotter",
  "https://www.koket.se/sotpotatisvaffla-med-syrlig-kalsallad",
  "https://www.koket.se/kall-spenatsoppa-med-pepparrot-och-krasse",
  "https://www.koket.se/flatbread-pizza-med-potatis-och-parmesan",
  "https://www.koket.se/snabb-falukorvspasta-med-salvia",
  "https://www.koket.se/wrap-fylld-med-omelett-avokado-sriracha-och-majonnas",
  "https://www.koket.se/omelettwrap-med-skagenrora",
  "https://www.koket.se/club-sandwich-med-kyckling-och-currymajonnas",
  "https://www.koket.se/bovetegalette-fran-bretagne",
  "https://www.koket.se/sjograsnudelsallad-med-gronsaker",
  "https://www.koket.se/omelett-med-spenat-och-champinjoner",
  "https://www.koket.se/plocksallad-med-serrano-mozzarella-och-valnotter",
  "https://www.koket.se/tonfiskro-ra-i-salladsblad",
  "https://www.koket.se/stekt-falukorv-med-linssallad-och-graddfilsdressing",
  "https://www.koket.se/snabb-omelett-med-gronsaker-sesam-och-ingefara",
  "https://www.koket.se/snabb-vardagspizza-med-tonfisk-mozzarella-och-oliver",
  "https://www.koket.se/ramensoppa-med-kyckling-och-sobanudlar",
  "https://www.koket.se/snabba-kroppkakor-med-flask-och-lingon",
  "https://www.koket.se/snabb-mandagspasta-med-tofusas-och-champinjoner",
  "https://www.koket.se/lisa-lemke/snabblagat/kyckling-och-fagel/snabblagad-kyckling-med-broccoli/",
  "https://www.koket.se/kyckling-nuggets-med-parmesansmul",
  "https://www.koket.se/omelettrulle-med-ost-och-salami",
  "https://www.koket.se/pastasallad-med-tonfisk-fetaost-och-frasiga-kajennsmulor",
  "https://www.koket.se/svart-ris-med-ingefarsmarinerad-lax-och-avokado",
  "https://www.koket.se/kalpytt-med-stekt-agg",
  "https://www.koket.se/kycklingfile-fetaost-och-paprikacreme-med-ris",
  "https://www.koket.se/krispig-sallad-med-lax-lime-ingefara-och-koriander",
  "https://www.koket.se/tunnbrodsquesadilla-med-julskinka-gronkal-och-ost",
  "https://www.koket.se/aggrora-med-tryffel-och-tranbar",
  "https://www.koket.se/microbakad-avokado-med-agg-och-chorizo",
  "https://www.koket.se/filopiroger-med-skinka-och-spenat",
  "https://www.koket.se/svamppasta-med-svartkal",
  "https://www.koket.se/rod-linssoppa-med-basilika-och-vitlok",
  "https://www.koket.se/potatis-och-purjolokssoppa-med-kalkonbacon",
  "https://www.koket.se/ugnspannkaka-med-kalkonbacon",
  "https://www.koket.se/kycklingpasta-med-pesto",
  "https://www.koket.se/pasta-med-kyckling-och-soltorkade-tomater",
  "https://www.koket.se/krispig-laxpasta-med-apple-och-curry",
  "https://www.koket.se/laxwok-teriyaki",
  "https://www.koket.se/italiensk-gazpacho",
  "https://www.koket.se/gazpacho-med-blandade-tomater-krutonger-och-orter",
  "https://www.koket.se/saffransgrot-med-apelsin-och-russin",
  "https://www.koket.se/risgrynsgrot-med-julgranola",
  "https://www.koket.se/raggmunk-med-butternutpumpa-och-mandelmjol",
  "https://www.koket.se/stressfri-och-kramig-notpasta",
  "https://www.koket.se/rice-bowl-med-sriracha-tofu-och-ananas",
  "https://www.koket.se/asiatisk-caesarsallad-med-portabello",
  "https://www.koket.se/vegetarisk-gryta-med-savoykal-svamp-linser-och-vitt-vin",
  "https://www.koket.se/siris-snabba-rotfruktssoppa",
  "https://www.koket.se/enkel-tortillapizza",
  "https://www.koket.se/wraps-med-hummus-och-gront",
  "https://www.koket.se/pasta-med-vegetarisk-tofu-stroganoff",
  "https://www.koket.se/alfonssoppa",
  "https://www.koket.se/cuban-sandwich-key-largo-style",
  "https://www.koket.se/hummusquesadillas",
  "https://www.koket.se/tofu-reuben-sandwich",
  "https://www.koket.se/varmande-gronsakssoppa-se-gor",
  "https://www.koket.se/kyckling-och-cheddarpaj-med-ortkram",
  "https://www.koket.se/supersnabb-pasta-bolognese-med-spenat-och-parmesanpasta",
  "https://www.koket.se/kramig-rotfruktssoppa-med-graslok",
  "https://www.koket.se/sparrissoppa-toppad-med-rodbetschips",
  "https://www.koket.se/leilas-seglarsallad-se-gor",
  "https://www.koket.se/thaigryta-med-torsk-och-citrongras",
  "https://www.koket.se/supersnabb-frittata-med-kikartor-se-gor",
  "https://www.koket.se/italiensk-frittata-med-svamp-och-potatis",
  "https://www.koket.se/snabbfixade-crepes-med-rakstuvning",
  "https://www.koket.se/marinerad-tofu-med-stekta-nudlar-och-gronsaker",
  "https://www.koket.se/surdegstoast-med-kikartsrora-smorstekt-svamp-och-lok",
  "https://www.koket.se/hostig-frittata-med-svamp-och-lok",
  "https://www.koket.se/supersnabb-japansk-kycklingbowl-se-gor",
  "https://www.koket.se/poke-bowl-med-lax-avokado-och-mango",
  "https://www.koket.se/krispig-bonsallad-med-varmrokt-lax",
  "https://www.koket.se/hummuswrap-med-grillad-halloumi",
  "https://www.koket.se/fattoush-krispig-sallad-med-orter-och-stekt-pitabrod",
  "https://www.koket.se/toast-pa-grillad-avokado-med-krispig-bonsallad-och-pocherat-agg",
  "https://www.koket.se/superenkel-gron-artsoppa",
  "https://www.koket.se/grillad-sotpotatis-med-graddfil-och-chili",
  "https://www.koket.se/art-och-quinoasallad-med-ortaioli",
  "https://www.koket.se/rokt-lapplandsharr-i-hembakad-stomp",
  "https://www.koket.se/svampomelett",
  "https://www.koket.se/pankopanerade-fiskbullar",
  "https://www.koket.se/matvetesallad-med-fetaost",
  "https://www.koket.se/morotssoppa-med-ra-ingefara-och-avokado",
  "https://www.koket.se/skordesallad-med-ra-kalrabbi-grona-blad-ringblomma-krasse-och-ortkrutonger",
  "https://www.koket.se/pasta-med-vegansk-sas",
  "https://www.koket.se/fettuccine-alla-contadina",
  "https://www.koket.se/vafflor-med-rarord-sylt-och-gradde",
  "https://www.koket.se/gron-artsoppa-med-mynta-och-pumpafron",
  "https://www.koket.se/ostpaj-med-dill-och-smorgaskrasse",
  "https://www.koket.se/glutenfri-kantarellpaj",
  "https://www.koket.se/braserade-kycklinglar-med-zucchini-och-vitlok",
  "https://www.koket.se/skordesallad-med-ra-kalrabbi-grona-blad-ringblomma-krasse-och-ortkrutonger",
  "https://www.koket.se/pasta-med-vegansk-sas",
  "https://www.koket.se/fettuccine-alla-contadina",
  "https://www.koket.se/vafflor-med-rarord-sylt-och-gradde",
  "https://www.koket.se/gron-artsoppa-med-mynta-och-pumpafron",
  "https://www.koket.se/ostpaj-med-dill-och-smorgaskrasse",
  "https://www.koket.se/glutenfri-kantarellpaj",
  "https://www.koket.se/braserade-kycklinglar-med-zucchini-och-vitlok",
  "https://www.koket.se/tortilla-med-potatis-lok-chili-och-spenat",
  "https://www.koket.se/gron-tortillapizza-med-kronartskocka-och-pecorino",
  "https://www.koket.se/lax-med-wasabipasta",
  "https://www.koket.se/ost-och-sillgratang",
  "https://www.koket.se/wraps-med-fuskpanerad-torsk-och-avokadomajonnas",
  "https://www.koket.se/smordegsvafflor-med-spenat-och-vasterbottenfyllning",
  "https://www.koket.se/pasta-med-mangold-parmesan-och-valnotter",
  "https://www.koket.se/smorrebrod-med-matjessill-tomat-agg-och-pepparrot",
  "https://www.koket.se/tortilla-med-potatis-lok-chili-och-spenat",
  "https://www.koket.se/gron-tortillapizza-med-kronartskocka-och-pecorino",
  "https://www.koket.se/lax-med-wasabipasta",
  "https://www.koket.se/ost-och-sillgratang",
  "https://www.koket.se/wraps-med-fuskpanerad-torsk-och-avokadomajonnas",
  "https://www.koket.se/smordegsvafflor-med-spenat-och-vasterbottenfyllning",
  "https://www.koket.se/pasta-med-mangold-parmesan-och-valnotter",
  "https://www.koket.se/smorrebrod-med-matjessill-tomat-agg-och-pepparrot",
  "https://www.koket.se/perfekt-omelett-se-gor",
  "https://www.koket.se/gron-rulltarteomelett-med-varmrokt-lax",
  "https://www.koket.se/japansk-gronsakspannkaka-okonomiyaki",
  "https://www.koket.se/picknicksmorgas-med-kottbullar-dressing-rostad-lok",
  "https://www.koket.se/vegetariska-pitabrod-med-coconut-bean-curry",
  "https://www.koket.se/ernst-angamatsoppa",
  "https://www.koket.se/koreanska-tacos-med-entrecote-och-chiliaioli",
  "https://www.koket.se/fish-taco-med-panerad-tosk-och-syrlig-kalsallad",
  "https://www.koket.se/perfekt-omelett-se-gor",
  "https://www.koket.se/gron-rulltarteomelett-med-varmrokt-lax",
  "https://www.koket.se/japansk-gronsakspannkaka-okonomiyaki",
  "https://www.koket.se/picknicksmorgas-med-kottbullar-dressing-rostad-lok",
  "https://www.koket.se/vegetariska-pitabrod-med-coconut-bean-curry",
  "https://www.koket.se/ernst-angamatsoppa",
  "https://www.koket.se/koreanska-tacos-med-entrecote-och-chiliaioli",
  "https://www.koket.se/fish-taco-med-panerad-tosk-och-syrlig-kalsallad",
  "https://www.koket.se/tomat-ramslokspaj-med-tre-sorters-ost",
  "https://www.koket.se/grillad-tonfiskciabatta",
  "https://www.koket.se/rodbetsplattar-med-lonnsirapsmarinerade-linser-getost-vit-persika-och-pumpafron",
  "https://www.koket.se/vegetarisk-halloumi-hotpot-paj",
  "https://www.koket.se/grillad-korv-med-senapscreme-och-rattikssallad",
  "https://www.koket.se/grillad-gronsallad-med-brynt-smor",
  "https://www.koket.se/sommarlunch-i-ett-glas",
  "https://www.koket.se/grillad-korv-med-brod",
  "https://www.koket.se/lisa-lemkes-basta-tonfisksallad",
  "https://www.koket.se/rakostsallad-med-kramig-cashewdressing",
  "https://www.koket.se/spaghetti-e-fagioli",
  "https://www.koket.se/smorrebrod-med-panerad-torsk-och-remoulad",
  "https://www.koket.se/tonfisksallad-med-avokado-och-srirachamajonnas",
  "https://www.koket.se/omelett-med-tonfiskrora-och-avokado",
  "https://www.koket.se/skargardssoppa-med-lax-vitt-vin-och-hummerfond",
  "https://www.koket.se/varmrokt-laxsallad-med-farsk-lok-avokado-och-graddfil",
  "https://www.koket.se/superenkel-sillwrap-for-lata-dagar",
  "https://www.koket.se/sill-ceviche-med-mango-lime-koriander",
  "https://www.koket.se/bjornbarssill-med-blabar",
  "https://www.koket.se/snabba-middagsmackan",
  "https://www.koket.se/potatissallad-med-pestodressing-och-rakor",
  "https://www.koket.se/bulgursallad-med-halloumi-och-sesam",
  "https://www.koket.se/sommarsallad-med-persika-jordgubbar-och-orter",
  "https://www.koket.se/libanesisk-kycklingmacka-med-extra-allt",
  "https://www.koket.se/timjan-och-houngsbakad-fetaost",
  "https://www.koket.se/midsommargott-pa-typ-30-sekunder",
  "https://www.koket.se/mustig-svampsoppa-med-ostflarn",
  "https://www.koket.se/rokt-fisk-och-ljummen-betsallad-med-valnotter-pepparrot-och-kapris",
  "https://www.koket.se/kramig-carbonara-med-sidflask-och-arter",
  "https://www.koket.se/getostpaj-med-honungsglaserade-morotter",
  "https://www.koket.se/quiche-med-chorizo-tomat-och-bonor",
  "https://www.koket.se/kramig-het-wasabisill",
  "https://www.koket.se/kall-inkokt-lax-med-jordgubbssallad",
  "https://www.koket.se/midsommarsill-med-senap-citron-och-orter",
  "https://www.koket.se/croque-monsieur-med-bechamelsas",
  "https://www.koket.se/potatis-och-ostpaj-med-dill",
  "https://www.koket.se/silltartan-alla-vill-ha-receptet-pa",
  "https://www.koket.se/sos-sommarfest-pa-5-minuter",
  "https://www.koket.se/lackert-kramig-kokos-chilisill",
  "https://www.koket.se/somrig-enkel-matjestarta",
  "https://www.koket.se/polka-pepparrottssill",
  "https://www.koket.se/ljuvlig-solskenssill",
  "https://www.koket.se/somrig-apelsinsill",
  "https://www.koket.se/matjesill-med-brynt-smorvinagrett-och-mandelslungad-potatis",
  "https://www.koket.se/saftig-burgare-med-godaste-tillbehoren",
  "https://www.koket.se/orecchiette-di-tricolore",
  "https://www.koket.se/sos-macka",
  "https://www.koket.se/veggie-caesarsallad",
  "https://www.koket.se/farsk-ravioli-med-citronsas-och-rucola",
  "https://www.koket.se/sommarens-godaste-laxsallad",
  "https://www.koket.se/graddig-tagliatelle-med-lax",
  "https://www.koket.se/smorgastarta-a-la-catarina",
  "https://www.koket.se/pontus-tomatgazpcho-med-getost-och-svarta-oliver",
  "https://www.koket.se/chipotle-chili",
  "https://www.koket.se/italiensk-tomatsoppa-med-mozzarella",
  "https://www.koket.se/linguine-med-rod-pesto",
  "https://www.koket.se/svarslagen-caesarsallad",
  "https://www.koket.se/spicy-tuna-sandwich",
  "https://www.koket.se/lacker-gronkalssoppa",
  "https://www.koket.se/gron-paj-med-sparris-och-spenat",
  "https://www.koket.se/sotpotatis-med-getost-rodlok-och-spenat",
  "https://www.koket.se/bakad-potatis-med-artor-mynta-och-fetaost",
  "https://www.koket.se/bakad-potatis-med-cheddar-lok-och-bacon",
  "https://www.koket.se/bakad-potatis-med-chorizo-majs-och-koriander",
  "https://www.koket.se/laxsoppa-med-kokosmjolk-chili",
  "https://www.koket.se/couscous-med-chorizo-och-citronyoghurt",
  "https://www.koket.se/pasta-med-artor-och-mynta",
  "https://www.koket.se/lyxomelett-med-lojrom-rakor-och-sparris",
  "https://www.koket.se/kramig-aggrora-med-lojrom-och-chips",
  "https://www.koket.se/laxsallad-med-rostat-bovete-och-ortsas",
  "https://www.koket.se/inkokta-svartrotter-med-varmrokt-lax",
  "https://www.koket.se/quesadillas-med-tacosmak",
  "https://www.koket.se/sakhachapure",
  "https://www.koket.se/club-sandwich-med-avokado",
  "https://www.koket.se/pumpa-och-getostpaj",
  "https://www.koket.se/bakad-jordartskocka",
  "https://www.koket.se/zalls-club-sandwich",
  "https://www.koket.se/chicken-blt-wrap",
  "https://www.koket.se/mitt-kok/jennie-wallden/klassisk-kottfarssas-med-spaghetti/",
  "https://www.koket.se/tofu-och-currypickleswrap-med-rostad-blomkal-och-apple",
  "https://www.koket.se/currytofu-i-baguette",
  "https://www.koket.se/avokadomacka-med-lagrad-ost-och-salladslok",
  "https://www.koket.se/avokadomacka-med-fetaost-och-graslok",
  "https://www.koket.se/avokadomacka-med-loskokt-agg-och-chiliflakes",
  "https://www.koket.se/quinoabowl-med-tofu-och-sweetchilidressing",
  "https://www.koket.se/vegopasta-pa-linser",
  "https://www.koket.se/helgrillad-kyckling",
  "https://www.koket.se/linssoppa",
  "https://www.koket.se/sandras-huevos-rancheros",
  "https://www.koket.se/krispiga-thaifiskkakor-med-sallad-och-limedressing",
  "https://www.koket.se/jennies-pizzabullar-med-broccolisoppa",
  "https://www.koket.se/fransk-omelett",
  "https://www.koket.se/mitt-kok/jennie-wallden/flaskfile-i-kramig-dragon--och-senapssas/",
  "https://www.koket.se/flaskfilegryta-med-zucchini",
  "https://www.koket.se/nyhetsmorgon/annika-sjoo/glutenfria-valnotsfrallor/",
  "https://www.koket.se/pulled-chicken-med-majssallad-och-chipotlemajonnas",
  "https://www.koket.se/satayspett-med-sallad-och-jordnotsdressing",
  "https://www.koket.se/snabb-pasta-med-gravad-lax-och-pesto",
  "https://www.koket.se/tove-nilsson/smaratter-och-tillbehor/gronsaker--potatis-och-andra-rotfrukter/snabb-kimchisallad/",
  "https://www.koket.se/pasta-med-tomat-och-mascarpone",
  "https://www.koket.se/mitt-kok/lisa-lemke/stekt-gnocchi-med-flaskfars",
  "https://www.koket.se/mitt-kok/tommy-myllymaki/snabbrimmad-torsk-med-tomat-och-brynt-smor",
  "https://www.koket.se/mitt-kok/jennie-wallden/snabb-sjomansbiff",
  "https://www.koket.se/mitt-kok/lisa-lemke/snabblasagne-med-ricotta-och-tomat",
  "https://www.koket.se/nyhetsmorgon/johnny-johansson/varldens-snabbaste-kottfarssas/",
  "https://www.koket.se/tommy-myllymaki/snabblagat/pasta-och-nudlar/kraftpasta-med-getost-och-curry/",
  "https://www.koket.se/nyhetsmorgon/ulrika-davidsson/aggwrap-med-skagenrora/",
  "https://www.koket.se/mitt-kok/lisa-lemke/pasta-med-tonfisk-och-citron/",
  "https://www.koket.se/lisa_forare_winbladh/_/_/snabb_kikartsgryta_med_majs_och_sesam/",
  "https://www.koket.se/nyhetsmorgon/fredrik-eriksson/snabb-kalvgryta-med-salvia-och-vitlok/",
  "https://www.koket.se/tommy-myllymaki/soppor-och-grytor/korv-och-chark/snabb-korvgryta-med-bonor--svamp-och-bacon/",
  "https://www.koket.se/nyhetsmorgon/monika-ahlberg/laxsoppa-med-svarta-bonor-och-curry/",
  "https://www.koket.se/magnus_lindstrom_och_henrik_hakansson/forratter/fisk_och_skaldjur/lax/",
  "https://www.koket.se/fredrik_eriksson/huvudratter/kott/snabb_kalpudding/",
  "https://www.koket.se/mitt-kok/paolo-roberto/italiensk-kycklinggryta/",
  "https://www.koket.se/nassim-al-fakir/paj-och-pizza/korv-och-chark/snabbpizza-pa-tortillabrod/",
  "https://www.koket.se/stefan_karlsson/huvudratter/fisk_och_skaldjur/snabbrimmad_regnbagsfile_med_citroncreme_fraiche/",
  "https://www.koket.se/pelle_johansson/_/_/snabbomelett_med_laxkram/",
  "https://www.koket.se/pelle_johansson/_/_/snabba_laxpuddingen/",
  "https://www.koket.se/fredrik_eriksson/paj_och_pizza/gronsaker/tian_de_legym/",
  "https://www.koket.se/utemat/par-nilsson-och-christel-schroder/pitabrod-med-rostbiff-och-gronsaker/",
  "https://www.koket.se/gi_viktkoll/smaratter_och_tillbehor/agg_och_mejeri/omelett_piperade/",
  "https://www.koket.se/monika-ahlberg/varmratter/gronsaker--potatis-och-andra-rotfrukter/omelett-med-mozzarella--korsbarstomater-och-basilika/",
  "https://www.koket.se/klara_desser/soppor/gronsaker/morotssoppa_med_ingefara_och_apelsin/",
  "https://www.koket.se/tommy-myllymaki/soppor-och-grytor/fisk-och-skaldjur/varldens-basta-snabbmat---japansk-laxsoppa/",
  "https://www.koket.se/krake_lithander/mackor_och_wraps/kyckling_och_fagel/club_sandwich-med-curry-och-appelmajonnas",
  "https://www.koket.se/antligen-tradgard/renee-voltaire/lammspett-pa-rosmarinsticka/",
  "https://www.koket.se/jul-med-ernst/ernst-kirchsteiger/ernst-snabbkottbullar/",
  "https://www.koket.se/ulrika_davidsson/sallader/ris__couscous_och_andra_gryn/quinoasallad/",
  "https://www.koket.se/gi_viktkoll/varmratter/fisk_och_skaldjur/tonfiskrora_med_gronsaker/",
  "https://www.koket.se/michael_bjorklund/soppor_och_grytor/korv_och_chark/korv_stroganoff/",
  "https://www.koket.se/gi_viktkoll/varmratter/agg_och_mejeri/omelettpannkaka_med_farskost_och_rucolapesto/",
  "https://www.koket.se/jonas_langegard/efterratter_och_godis/_/snabblagad_tiramisu/",
  "https://www.koket.se/gi_viktkoll/omelett/agg_och_mejeri/ugnsomelett/",
  "https://www.koket.se/mitt-kok/paolo-roberto/spaghetti-med-stora-kottbullar-i-tomatsas/",
  "https://www.koket.se/anders_leven/huvudratter/kyckling_och_fagel/kycklingburgare/",
  "https://www.koket.se/elisabeth_johansson/kalla_drycker_och_smoothies/alkohol/snabb__snabb_snaps_/",
  "https://www.koket.se/michael_bjorklund/soppor_och_grytor/gronsaker__potatis_och_andra_rotfrukter/gronsakssoppa_med_lackra_tillbehor/",
  "https://www.koket.se/anders_leven/huvudratter/pasta_och_nudlar/snabbpasta_/",
  "https://www.koket.se/pasta-alfredo",
  "https://www.koket.se/linguine-pesto",
  "https://www.koket.se/grillad-sandwich-med-lax",
  "https://www.koket.se/laxwok-med-snabbnudlar-och-gronsaker",
  "https://www.koket.se/snabbgravad-lax-i-ugn",
  "https://www.koket.se/ravioli-i-het-tomatsoppa-med-oregano",
  "https://www.koket.se/club-sandwich-med-grillad-kyckling-och-bacon",
  "https://www.koket.se/omelett-med-parmaskinka",
  "https://www.koket.se/grillad-snabbgravad-lax-med-senapssas",
  "https://www.koket.se/mitt-kok/tommy-myllymaki/biff-stroganoff/",
  "https://www.koket.se/strimlad-lovbiff-i-senapssas-med-parmesan",
  "https://www.koket.se/snabblagat-isterband-med-skansk-potatis",
  "https://www.koket.se/snabblagad-kalpudding-i-panna",
  "https://www.koket.se/omelett-naturelle",
  "https://www.koket.se/snabba-enkla-gazpachon",
  "https://www.koket.se/mitt-kok/jennie-wallden/paella-med-kyckling-och-rakor/",
  "https://www.koket.se/snabb-honssoppa-med-gronsaker",
  "https://www.koket.se/snabb-makaronipudding",
  "https://www.koket.se/mitt-kok/jennie-wallden/flaskfile-africana/",
  "https://www.koket.se/lax-i-beurre-blanc",
  "https://www.koket.se/flaskpannkaka-med-purjo",
  "https://www.koket.se/halstrad-snabbgravad-lax-med-gronsakspytt-2",
  "https://www.koket.se/gronsakslasagne-med-keso",
  "https://www.koket.se/clubsandwich",
  "https://www.koket.se/snabb-gratang-med-fisk-och-broccoli",
  "https://www.koket.se/joel-wastgard/gratang/gronsaker--potatis-och-andra-rotfrukter/nyttig-broccoligratang/",
  "https://www.koket.se/omelett-med-kronartskocka",
  "https://www.koket.se/omelett-med-svamp",
  "https://www.koket.se/enkel-tomatsoppa",
  "https://www.koket.se/gi_viktkoll/huvudratter/gronsaker__potatis_och_andra_rotfrukter/ugnsbakad_aubergine_med_quornfarsrora_och_gronsallad/",
  "https://www.koket.se/margit_eliasson_och_gunilla_lindeberg/omelett/agg_och_mejeri/spansk_omelett___tortilla/",
  "https://www.koket.se/christian_hellberg/varmratter/pasta_och_nudlar/pasta_carbonara/",
  "https://www.koket.se/tunna-flaskpannkakor",
  "https://www.koket.se/vegetarisk-lasagne-med-kesella",
  "https://www.koket.se/snabb-korvpanna",
  "https://www.koket.se/makaronipudding-4",
  "https://www.koket.se/snabbpotatis-med-grillad-korv",
  "https://www.koket.se/koka-frukostkorv",
  "https://www.koket.se/fisk-med-persiljesas",
  "https://www.koket.se/utemat/par-nilsson-och-christel-schroder/tortillasnittar/",
  "https://www.koket.se/stefano_catenacci/sallader/kyckling_och_fagel/kycklingsallad_med_rodbetor_och_chevre/",
  "https://www.koket.se/melker_andersson/sallader/kyckling_och_fagel/snabb_varm_kycklingsallad_med_fetaost/",
  "https://www.koket.se/kycklingfile-med-currysas",
  "https://www.koket.se/vegetarisk-paella",
  "https://www.koket.se/gulasch-med-pastafjarilar",
  "https://www.koket.se/koka-frukostkorv",
  "https://www.koket.se/fisk-med-persiljesas",
  "https://www.koket.se/utemat/par-nilsson-och-christel-schroder/tortillasnittar/",
  "https://www.koket.se/stefano_catenacci/sallader/kyckling_och_fagel/kycklingsallad_med_rodbetor_och_chevre/",
  "https://www.koket.se/melker_andersson/sallader/kyckling_och_fagel/snabb_varm_kycklingsallad_med_fetaost/",
  "https://www.koket.se/kycklingfile-med-currysas",
  "https://www.koket.se/vegetarisk-paella",
  "https://www.koket.se/gulasch-med-pastafjarilar",
  "https://www.koket.se/stekt-panerad-rodspatta-med-rotsakspytt",
  "https://www.koket.se/bonsallad-med-chorizo",
  "https://www.koket.se/omelett",
  "https://www.koket.se/raraka-grundrecept",
  "https://www.koket.se/anette_rosvall_och_emma_hamberg/sallader/pasta_och_nudlar/snabba_grona_pastasalladen/",
  "https://www.koket.se/quorngulasch",
  "https://www.koket.se/glaserade-quornfileer-med-ugnsrostade-gronsaker",
  "https://www.koket.se/grekisk-sallad-2",
  "https://www.koket.se/stekt-panerad-rodspatta-med-rotsakspytt",
  "https://www.koket.se/bonsallad-med-chorizo",
  "https://www.koket.se/omelett",
  "https://www.koket.se/raraka-grundrecept",
  "https://www.koket.se/anette_rosvall_och_emma_hamberg/sallader/pasta_och_nudlar/snabba_grona_pastasalladen/",
  "https://www.koket.se/quorngulasch",
  "https://www.koket.se/glaserade-quornfileer-med-ugnsrostade-gronsaker",
  "https://www.koket.se/grekisk-sallad-2",
  "https://www.koket.se/quornstroganoff",
  "https://www.koket.se/vegochili-texas-style",
  "https://www.koket.se/quornstroganoff",
  "https://www.koket.se/vegochili-texas-style",
  "https://www.koket.se/matjessallad-med-brynt-smor-lisa-lemkes-recept",
  "https://www.koket.se/snabblagad-kycklingsallad-med-avokado-och-jordnotter",
  "https://www.koket.se/kall-risgrynsgrot-med-bar",
  "https://www.koket.se/dutch-baby-med-bar-och-gradde",
  "https://www.koket.se/grillad-korv-i-brod-med-senapsmajonnas-och-gronkalschips",
  "https://www.koket.se/pasta-med-kronartskocka-mandel-och-citron",
  "https://www.koket.se/sebastien-boudets-gourmetmackor",
  "https://www.koket.se/pasta-med-tapenade-och-stekta-gronsaker",
  "https://www.koket.se/italiensk-tonfisksallad-med-oliver-och-mozzarella",
  "https://www.koket.se/spaghetti-med-tonfisksas",
  "https://www.koket.se/somrig-silltaco-med-avokado-agg-och-potatis",
  "https://www.koket.se/marockansk-morotssallad-med-varmrokt-lax"
];

let filename = "koket/lunch-2018-06-06.json";
nightmare
  .goto('https://www.koket.se/mat/specialkost/raw-food')
  .evaluate(function () {

  })
  .then(function (hrefs) {


    console.log("start");
    //här kan jag bygga vilken lista jag vill med hrefs...
    console.log("nr of urls: " + urls.length);
    uniqurls = [...new Set(urls)];
    console.log("uniq : " + uniqurls.length);
    //here, we're going to use the vanilla JS way of executing a series of promises in a sequence.
    //for every href in hrefs,
    return uniqurls.reduce(function (accumulator, href) {
      //return the accumulated promise results, followed by...
      return accumulator.then(function (results) {
        return nightmare.goto(href)
          //get the html
          .evaluate(function () {
            if (document.querySelector('.recipe-column-wrapper .endorsed-banner') || !document.querySelector('.recipe-content-wrapper')) {
              return;
            }
            console.log(window.location.href);
            //l sep är ett problem. replace &#8232; funkar inte
            //ta bort plural "er,ar,or"?
            //IMPLEMENTERA DETTA-------------I CREATERECIPES.JS
            //möjlig regel: Om ingrediensen slutar på er, ar, or. så kolla om det finns en exakt likadan i foods utan de två sista bokstäverna.
            //Om det finns så spara ner ingrediensen som subString(-2 sista) och addera uses på befintlig.
            //detta bör kanske vara ett separat jobb som körs när som för att rätta upp datat? annar är risken att det kommer in några plural innan första singular
            //och vi aldrig får rätta till pluran som kom tidigare.

            //ha koll på om denna fix gör så att namnet blir lika med existerande food, isåfall plusa på uses
            //om jag fixar detta i efterhand så måste jag köra igenom alla foods/ och alla recipes/ingredients/
            let recipe = {};
            //title
            if (document.querySelector('.recipe-content-wrapper h1')) {
              recipe.title = document.querySelector('.recipe-content-wrapper h1').innerHTML;
            }
            //tags
            let tags = {};
            $('.category-touch-scroll .btn.green-btn.category').each(function () {
              let t = $(this).text().split('/');
              for (let i = 0; i < t.length; i++) {
                tags[t[i].charAt(0).toUpperCase() + t[i].slice(1).replace(/\s*\([^()]*\)$/, '').split(",")[0].replace(/([/.#$])/g, '').trim()] = true;
              }
            })
            recipe.tags = tags;
            //source
            recipe.source = window.location.href;
            //rating
            recipe.rating = document.querySelector('.recipe-content-wrapper .rating-container.rating').getAttribute("data-setrating");
            //votes
            if (document.querySelector('.recipe-content-wrapper .rating-container.rating span.text')) {
              recipe.votes = document.querySelector('.recipe-content-wrapper .rating-container.rating span.text').innerHTML.split(" ")[0];
            }
            //author
            if (document.querySelector('.recipe-content-wrapper .author-chef a')) {
              recipe.author = document.querySelector('.recipe-content-wrapper .author-chef a').innerHTML;
            }
            //createdFor
            if (document.querySelector('.recipe-content-wrapper .author-source a')) {
              recipe.createdFor = document.querySelector('.recipe-content-wrapper .author-source a').innerHTML;
            }
            //portions  "4småpotioner" trattkantarellsoppan. replace alla bokstäver med ""?
            if (document.querySelector('.recipe-content-wrapper .recipe-info.portions span.amount')) {
              recipe.portions = document.querySelector('.recipe-content-wrapper .recipe-info.portions span.amount').innerHTML.replace(/(\r\n|\n|\r| )/gm, "").trim();
            }
            //created
            if (document.querySelector('.recipe-content-wrapper .description meta[itemprop="datePublished"]')) {
              recipe.created = document.querySelector('.recipe-content-wrapper .description meta[itemprop="datePublished"]').getAttribute("content");
            }
            //description
            //lägg till first-child i ifsatsen?
            if (document.querySelector('.recipe-content-wrapper .recipe-article .description p:first-child')) {
              recipe.description = document.querySelector('.recipe-content-wrapper .recipe-article .description p:first-child').innerHTML.replace(/(\r\n|\n|\r|<[^>]*>)/gm, "").replace(/  +/g, ' ');
            }
            //time
            if (document.querySelector('.recipe-content-wrapper .cooking-time')) {
              //koket.se använder flera olika format på tid så det är inte lätt att ta ut ett generellt värde
              let timenr = 0;
              let timeString = document.querySelector('.recipe-content-wrapper .cooking-time .time').innerHTML.replace(/(\r\n|\n|\r|)/gm, "").trim();
              parts = timeString.replace("ca", '').replace(",", ".").trim().split(" ");
              for (let j = 0; j < parts.length; j++) {
                if (Number.isInteger(parts[j] - 0) || parts[j].indexOf(".") > -1) {
                  if (!parts[j + 1] || parts[j + 1].indexOf("min") > -1 || parts[j + 1].indexOf("m") > -1) {
                    timenr += parts[j] - 0;
                  } else if (parts[j + 1].indexOf("dagar") > -1 || parts[j + 1].indexOf("dygn") > -1) {
                    timenr += parts[j] * 60 * 24;
                  } else if (parts[j + 1].indexOf("h") > -1) {
                    timenr += parts[j] * 60;
                  } else {
                    return;
                  }
                  j++;
                } else {
                  if (parts[j].indexOf("-") > -1) {
                    let nrparts = parts[j].split("-");
                    if (!parts[j + 1] || parts[j + 1].indexOf("m") > -1 || parts[j + 1].indexOf("min") > -1) {
                      timenr += ((nrparts[0] - 0) + (nrparts[1] - 0)) / 2;
                    } else if (parts[j + 1].indexOf("h") > -1) {
                      timenr += (((nrparts[0] - 0) + (nrparts[1] - 0)) / 2) * 60;
                    } else if (parts[j + 1].indexOf("d") > -1) {
                      timenr += ((((nrparts[0] - 0) + (nrparts[1] - 0)) / 2) * 60) * 24;
                    }
                  } else if (parts[j].indexOf("h") > -1) {
                    timenr += (parts[j].substring(0, parts[j].indexOf("h")) - 0) * 60;
                  } else if (parts[j].indexOf("m") > -1) {
                    timenr += parts[j].substring(0, parts[j].indexOf("m")) - 0;
                  } else if (parts[j].indexOf("min") > -1) {
                    timenr += parts[j].substring(0, parts[j].indexOf("min")) - 0;
                  } else {
                    return;
                  }
                }
              }
              if (timenr === 0) {
                return;
              }
              recipe.time = timenr;
              if (recipe.time < 25) {
                if (!tags.hasOwnProperty('Snabbt')) {
                  tags["Snabbt"] = true;
                }
              }
            }
            //ingredients
            if (document.querySelector('.recipe-column-wrapper #ingredients-component')) {
              let ingredientsDom = document.querySelector('.recipe-column-wrapper #ingredients-component #ingredients').getElementsByTagName("li");
              let ingredients = [];
              let ingredientNames = [];
              for (var i = 0; i < ingredientsDom.length; ++i) {
                let ingredient = {};
                let parts = ingredientsDom[i].getElementsByTagName("span");
                let namepart = parts[2].innerHTML.trim();
                ingredient.name = namepart.charAt(0).toUpperCase() + namepart.slice(1).replace(/\s*\([^()]*\)$/, '').split(",")[0].replace(/([/.#$])/g, '');
                if (ingredientNames.indexOf(ingredient.name) > -1) {
                  continue;
                }
                let amount = parts[1].innerHTML;
                if (amount.length > 0) {
                  let amountParts = amount.split(" ");
                  ingredient.amount = amountParts[0];
                  if (amountParts.length > 1) {
                    ingredient.unit = amountParts[1];
                    if (!/\d/.test(ingredient.amount)) {
                      ingredient.amount = amountParts[1];
                      ingredient.unit = amountParts[0];
                    }
                  }
                }
                if(ingredient.amount.trim()==""){
                  delete ingredient.amount;
                }
                if(ingredient.unit.trim()==""){
                    delete ingredient.unit;
                }
                if(ingredient.amount && isNaN(ingredient.amount)){
                  ingredient.amount = ingredient.amount.replace(",",".");
                  if(ingredient.amount.indexOf("-")>-1){
                    let splited = ingredient.amount.split("-");
                    let first = +splited[0];
                    let second = +splited[1];
                    ingredient.amount = (first+second)/2;
                    ingredient.amount = ingredient.amount + "";
                  }
                  if(ingredient.amount.indexOf("/")> -1){
                    ingredient.amount = eval(ingredient.amount).toFixed(2) + "";
                  }
                }
                ingredientNames.push(ingredient.name);
                ingredients.push(ingredient);
              }
              recipe.ingredients = ingredients;
            }
            //difficulty
            let instructionsList = document.querySelector('.recipe-column-wrapper #step-by-step').getElementsByTagName("li");
            let nrOfIngredients = recipe.ingredients.length;
            let instructionLength = 0;
            for (let i = 0; i < instructionsList.length; i++) {
              instructionLength = instructionLength + instructionsList[i].getElementsByTagName("span")[0].innerHTML.replace(/(\r\n|\n|\r|)/gm, "").trim().length;
            }
            instructionLength = instructionLength - instructionsList.length * 10;

            let levelIndex = (nrOfIngredients * 8) + (instructionLength / 14);
            if (recipe.tags.hasOwnProperty('Enkelt') || recipe.tags.hasOwnProperty('Lättlagat')) {
              levelIndex = levelIndex - 100;
            }
            if (recipe.tags.hasOwnProperty('Snabbt')) {
              levelIndex = levelIndex - 20;
            }

            if (levelIndex < 100) {
              recipe.level = 1;
            } else if (levelIndex < 200) {
              recipe.level = 2;
            } else {
              recipe.level = 3;
            }

            //lägg logik för validering i inläsningen och inte här.. om vissa saker saknas så hoppa över. om urlen redan finns hoppa över..
            //automatisera denna inläsning. 
            //Alla recept som skrivs till filen ska se likadana ut oberoende av källa.
            if (recipe.ingredients.length === 0 || (recipe.time && recipe.time < 1)) {
              return;
            }
            return recipe;
          })
          //add the result to the results
          .then(function (html) {
            results.push(html);
            return results;
          })
        // .then(function(results){
        //   //click on the search result link to go back to the search result page
        //   return nightmare
        //     .click('a[id="propertyHeading_searchResults"]')
        //     .then(function() {
        //       //make sure the results are returned
        //       return results;
        //     });
        // })
      });
    }, Promise.resolve([])) //kick off the reduce with a promise that resolves an empty array
  })
  .then(function (resultArr) {
    //if I haven't made a mistake above with the `Array.reduce`, `resultArr` should now contain all of your links' results
    console.log(resultArr.length);


    fs.writeFile("C:/react/" + filename, JSON.stringify(resultArr), function (err) {

      if (err) {
        return console.log(err);
      }

      console.log("The file was saved!");
    });
  });