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
//Improved: var result = []; var interv=setInterval(function(){if(document.querySelector('.recipe-list .pagination button')){result = result.concat(Array.from(document.querySelectorAll('article.recipe h2 a')).map(a => a.href));$('article.recipe').remove();document.querySelector('.recipe-list .pagination button').click();}else{;console.log("done");clearInterval(interv);}},1500);
//3. Vänta på att "done" har loggats i consolen.
//4. kopiera alla hrefs genom copy([...new Set(Array.from(document.querySelectorAll('article.list-item.recipe .info .top h2 a')).map(a => a.href)))];
//5. paste in i urls
//6. kör set DEBUG=nightmare && node koket.js
//7. resultatet sparas i react/[filename].json
//8. kör node createRecipes.js med den genererade filen som input
let urls = [
  "https://www.koket.se/malin_soderstrom/soppor_och_grytor/kott/boeuf_skeppsholmen/",
  "https://www.koket.se/leila_lindholm/huvudratter/fisk_och_skaldjur/vietnamesiska_varrullar/",
  "https://www.koket.se/johan_jureskog/huvudratter/kott/biff_rydberg/",
  "https://www.koket.se/sanna_toringe/varmratter/kott/bendts_lamm/",
  "https://www.koket.se/malin_soderstrom/frukost_och_brunch/kott/lagtempstekt_flask/",
  "https://www.koket.se/nyhetsmorgon/markus-aujalay/ris-i-ugn-med-flaskkarre--chorizo--paprika-och-lok/",
  "https://www.koket.se/per-morberg/varmratter/kott/slottsstek/",
  "https://www.koket.se/nyhetsmorgon/yohan-adell/boeuf-a-la-bourguignonne/",
  "https://www.koket.se/jens_linder/varmratter/fisk_och_skaldjur/gos_med_gron_sparris_och_rabarbersas/",
  "https://www.koket.se/per_morberg/varmratter/kraftor/per_morbergs_kokta_kraftor/",
  "https://www.koket.se/jens_linder/soppor_och_grytor/kott/vindaloo___het_indisk_lammgryta/",
  "https://www.koket.se/jens_linder/soppor_och_grytor/kott/boeuf_bourguignon_med_skogssvamp/",
  "https://www.koket.se/per-morberg/varmratter/kott/per-morbergs-flasklagg-med-rotmos/",
  "https://www.koket.se/henrik_norstrom/grytor/kott/gryta_med_trattkantareller/",
  "https://www.koket.se/fredrik_hedlund/varmratter/kott/kalops_med_betor_och_potatis/",
  "https://www.koket.se/nyhetsmorgon/johan-hedberg/kottfarssas-i-slow-cooker/",
  "https://www.koket.se/stefano-catenacci/soppor-och-grytor/artor--bonor-och-linser/kikartssoppa-med-vitlok--timjan-och-pancetta/",
  "https://www.koket.se/halv-atta-hos-mig/lars---stockholm/langkokt-stockholmsgris/",
  "https://www.koket.se/jens_linder/soppor_och_grytor/kott/skansk_kalops/",
  "https://www.koket.se/jens_linder/soppor_och_grytor/kott/pilsnerkalops/",
  "https://www.koket.se/jacob_wismar/varmratter/kott/jacob_wismars_kalops/",
  "https://www.koket.se/rikard___stockholm/soppor_och_grytor/kott/mustig_kottgryta_som_heter_duga/",
  "https://www.koket.se/per-morberg/soppor-och-grytor/kott/boeuf-bourguignon-a-la-per-morberg/",
  "https://www.koket.se/per_morberg/varmratter/kott/per_morbergs_oxrullader_med_graddsas/",
  "https://www.koket.se/isabel_berggren/varmratter/kott/flaskkarre_i_lergryta/",
  "https://www.koket.se/halv-atta-hos-mig/tatte---orsa/knaperstekt-hargryta-med-rotfrukter-och-svartvinbarsgele/",
  "https://www.koket.se/rose_marie___malmo/soppor_och_grytor/kott/rose_maries_variant_pa_osso_buco/",
  "https://www.koket.se/jamie_oliver/soppor_och_grytor/kott/engelskt_langkok_med_vargront_och_skinka/",
  "https://www.koket.se/torsten_jansson/soppor_och_grytor/fisk_och_skaldjur/torstens_skaldjurssoppa/",
  "https://www.koket.se/halv-atta-hos-mig/agnetha---orsa/soparon--traditionell-gryta-fran-orsa/",
  "https://www.koket.se/per_morberg/varmratter/kott/pertans_hemlagade_kottsoppa/",
  "https://www.koket.se/peter_harryson/varmratter/kott/langkokt_hogrev/",
  "https://www.koket.se/mitt-kok/paolo-roberto/langkokt-hogrev-i-tomatsas/",
  "https://www.koket.se/mange_schmidt/varmratter/kott/boeuf_bourguignon/",
  "https://www.koket.se/anders_leven/varmratter/kott/kokt_rimmad_oxbringa_med_pepparrot/",
  "https://www.koket.se/nyhetsmorgon/johan-jureskog/kalops-pa-oxkind/",
  "https://www.koket.se/filip-fasten/varmratter/kott/rodvinsbrasserad-oxkind-med-blomkalspure/",
  "https://www.koket.se/per_morberg/varmratter/kott/morbergs_skanska_kalops/",
  "https://www.koket.se/sandra___lulea/varmratter/kott/helstekt_oxfile/",
  "https://www.koket.se/jamie_oliver/soppor_och_grytor/kott/jamie_olivers_grekiska_kottgryta/",
  "https://www.koket.se/per_morberg/varmratter/vilt/per_morbergs_algstek_med_kantarellsas/",
  "https://www.koket.se/gert_klotzke/_/_/grundinlaggningslag_till_sill/",
  "https://www.koket.se/halv-atta-hos-mig/sara---stockholm/boeuf-bourgiugnon-med-mandelpotatispure/",
  "https://www.koket.se/per-morberg/varmratter/kott/klassiskt-dillkott/",
  "https://www.koket.se/nyhetsmorgon/johan-jureskog/rodvinsbrasserad-hel-oxsvans-med-kalvbacon--kantareller-och-rostade-rotfrukter/",
  "https://www.koket.se/torbjorn___stockholm/varmratter/fisk_och_skaldjur/halstrad_roding_med_citronett/",
  "https://www.koket.se/jens_linder/varmratter/kott/vildsvinsstek_med_honung_och_citron/",
  "https://www.koket.se/liselotte-forslin/varmratter/kott/pulled-pork/",
  "https://www.koket.se/jens-linder/varmratter/kott/texas-chili-con-carne/",
  "https://www.koket.se/chili",
  "https://www.koket.se/jens_linder/forratter/gronsaker/kokta_rodbetor_med_fetaost_och_sardeller/",
  "https://www.koket.se/langkok/jens-linder/solig-rodvinsstek-med-sidflask-och-kyndel/",
  "https://www.koket.se/vad-blir-det-for-mat/per-morberg/akta-sjomansbiff/",
  "https://www.koket.se/matgladje-hela-livet/leif-mannerstrom/leif-mannerstroms-kroppkakor/",
  "https://www.koket.se/matgladje-hela-livet/leif-mannerstrom/leif-mannerstroms-kalops/",
  "https://www.koket.se/halv-atta-hos-mig/roland---stockholm/oxsvansgryta-med-kokt-potatis/",
  "https://www.koket.se/du-ar-vad-du-ater/anna-skipper/tjalknol/",
  "https://www.koket.se/klockan-nio-hos-stjarnorna/josefin-crafoord/josefins-gottiga-cowboychili-pa-hogrev/",
  "https://www.koket.se/sophie-berlin/soppor-och-grytor/fisk-och-skaldjur/fisksoppa-med-saffran/",
  "https://www.koket.se/halv-atta-hos-mig/karl---stockholm/ryggbiff-och-potatismos-med-vasterbottenost/",
  "https://www.koket.se/andre-wessman/klassisk-boeuf-bourguignon/",
  "https://www.koket.se/rebecca---skelleftea/forratt/fisk-och-skaldjur/fjallets-roda/",
  "https://www.koket.se/morberg-lagar-husmanskost/per-morberg/plommonspackad-flaskkarre-med-graddsas/",
  "https://www.koket.se/le-parfait/liselotte-forslin/alggryta-med-rotfrukter-och-svamp/",
  "https://www.koket.se/boeuf-bourguignon-viktvaktarnas-recept",
  "https://www.koket.se/flaskrilette",
  "https://www.koket.se/halv-atta-hos-mig/erik---stockholm/fish-and-crisp/",
  "https://www.koket.se/langkok-pa-far",
  "https://www.koket.se/black-bean-chili",
  "https://www.koket.se/hogrevschili-jessica-frejs-goda-recept",
  "https://www.koket.se/svarta-linser-med-kyckling-och-spansk-paprika",
  "https://www.koket.se/klassisk-chili-con-carne",
  "https://www.koket.se/kalvlagg-med-shopska-sallad",
  "https://www.koket.se/andre-wessman/efterratter-och-godis/frukt-och-bar/halloncreme-med-smetana/",
  "https://www.koket.se/ortkryddad-fransyska-serveras-med-rostade-rotfrukter",
  "https://www.koket.se/mitt-kok/tommy-myllymaki/boeuf-bourguignon/",
  "https://www.koket.se/paolos-pasta-med-hostragu-pa-oxkott-och-svamp",
  "https://www.koket.se/chili-pa-hogrev-med-jalapeno-creme-fraiche-picklad-rodlok-och-stark-ost",
  "https://www.koket.se/mexikansk-pulled-pork-med-kramig-coleslaw",
  "https://www.koket.se/pulled-beef-med-asiatisk-touch",
  "https://www.koket.se/mitt-kok/tommy-myllymaki/texas-chili/",
  "https://www.koket.se/tina-nordstrom/soppor-och-grytor/kott/pulled-pork-pa-tinas-vis/",
  "https://www.koket.se/pulled-pork-med-lime",
  "https://www.koket.se/boeuf-bourguignon-burgundisk-kottgryta",
  "https://www.koket.se/lammlagg-med-rodvin-vitlok-och-kramigt-potatismos",
  "https://www.koket.se/pulled-pork-pa-rostat-surdegsbrod-med-mango-och-tomatsallad-smashed-avokado-och-ingefarspicklad-rodlok",
  "https://www.koket.se/gudomligt-god-porterstek-med-kramig-gratang-och-sommarsallad",
  "https://www.koket.se/chili-med-gron-salsa-och-nachos",
  "https://www.koket.se/fiery-beef-n-bean-stew",
  "https://www.koket.se/pulled-chicken-sandwich",
  "https://www.koket.se/anna-sahlene/efterratter-och-godis/frukt-och-bar/halsingeostkaka-med-appelkompott/",
  "https://www.koket.se/mustig-hogrevsgryta-med-smak-av-hosten-serveras-med-betor-och-sotpotatis",
  "https://www.koket.se/klockan-atta-hos-stjarnorna/doreen-mansson/kyckling-tagine/",
  "https://www.koket.se/mitt-kok/donal-skehan/donal-skehans-boeuf-bourguignon/",
  "https://www.koket.se/helbakad-rotselleri-med-skirat-smor-rarorda-lingon-och-stott-kryddpeppar",
  "https://www.koket.se/ernsts-fyllda-julkalkon",
  "https://www.koket.se/boeuf-bourguignon-med-rostade-potatisar-och-rotsaker",
  "https://www.koket.se/lammlagg-med-ratatouille",
  "https://www.koket.se/langkokt-grissida",
  "https://www.koket.se/svampsoppa-med-smalok-graslok-och-vin",
  "https://www.koket.se/jureskogs-kottfarssas",
  "https://www.koket.se/lammrullad-med-bjorkblad",
  "https://www.koket.se/hogrevsgryta-med-rotselleri-och-inlagd-lok",
  "https://www.koket.se/braserade-grislagg",
  "https://www.koket.se/idas-far-i-kal",
  "https://www.koket.se/prastgardens-fricassee-de-poulet-a-l-ancienne",
  "https://www.koket.se/kryddgrillad-lammbringa-med-chermoula",
  "https://www.koket.se/vissi-d-arte-tosca-flarn",
  "https://www.koket.se/langkokt-lammlagg-med-chili",
  "https://www.koket.se/ugnsbraserat-lammlagg-med-tomatsas",
  "https://www.koket.se/herdens-langkok-med-dalaprimorer",
  "https://www.koket.se/halv-atta-hos-mig/eddie-almhult/langkok-pa-nyskjuten-hallbergskonung-med-skotskt-inslag",
  "https://www.koket.se/nyhetsmorgon/lisa-lemke/langbakat-lamm-i-macka-med-hummus-och-granatapple",
  "https://www.koket.se/mitt-kok/donal-skehan/donals-kottgryta-med-stout",
  "https://www.koket.se/okand/smaratter_och_tillbehor/gronsaker/grillad_lok_med_ansjovis__och_tomatsmorsas/",
  "https://www.koket.se/anders_leven/huvudratter/kott/brackt_oxbringa_med_rotmos_i_paket/",
  "https://www.koket.se/christer_lingstrom/huvudratter/kott/benfri_pigghamskotlett_med_purjolok/",
  "https://www.koket.se/anders_leven/_/_/kanderade_mandelsplit_i_choklad/",
  "https://www.koket.se/karin_fransson/_/_/smutsiga_potatisar/",
  "https://www.koket.se/edward-blom/soppor-och-grytor/kott/edward-bloms-chiligryta/",
  "https://www.koket.se/kocklandslaget/_/_/ragu_pa_kalrot_med_hummer_och_rosmarin/",
  "https://www.koket.se/lisa_forare_winbladh/_/_/martins_kraftsoppa/",
  "https://www.koket.se/lisa_forare_winbladh/_/_/fransk_vindoftande_kottgryta/",
  "https://www.koket.se/nyhetsmorgon/fredrik-eriksson/boeuf-bourguignon/",
  "https://www.koket.se/fredrik-eriksson/soppor-och-grytor/kott/rimmat-flasklagg/",
  "https://www.koket.se/fredrik_eriksson/_/_/halstrad_gos_med_dijongraddkokta_hostgronsaker_och_snabb_rodvinssas/",
  "https://www.koket.se/karin_fransson/_/_/rodbetsravioli_fylld_med_rodbetsketchup/",
  "https://www.koket.se/leif_mannerstrom_crister_svantesson/_/_/kalvfrikasse_med_karljohansvamp/",
  "https://www.koket.se/anders_leven/huvudratter/kott/kroppkakor_med_lingon/",
  "https://www.koket.se/pelle_johansson/_/_/sjomansbiff_pa_utskuren_biff/",
  "https://www.koket.se/mitt-kok/tommy-myllymaki/rimmad-oxbringa-i-tryckkokare/",
  "https://www.koket.se/karin_fransson/_/_/gron_sparris_med_apple__och_citrusglaserad_lax_samt_angssyresabayone/",
  "https://www.koket.se/madeleine-rapp/varma-drycker/alkohol/mulled-cider/",
  "https://www.koket.se/stefan_karlsson/soppor_och_grytor/kott/kalops/",
  "https://www.koket.se/danyel_couet/varmratter/flask/b_uf_bourguignon/",
  "https://www.koket.se/jens_linder/varmratter/agg_och_mejeri/yorkshirepudding/",
  "https://www.koket.se/jens_linder/varmratter/potatis/roast_potatoes/",
  "https://www.koket.se/jens_linder/smaratter_och_tillbehor/gronsakeroch_184_potatis_och_andra_rotfrukter/vitloksconfit/",
  "https://www.koket.se/gi_viktkoll/varmratter/mjol/parmapizza_med_dinkelmjol/",
  "https://www.koket.se/jens_linder/soppor_och_grytor/kott/boeuf_nicoise/",
  "https://www.koket.se/jens_linder/varmratter/kott/svensk_oxstek_med__morotter_och_lok/",
  "https://www.koket.se/jens_linder/varmratter/kyckling_och_fagel/tjader__eller_annan_skogsfagel__och_savoykal_i_gryta/",
  "https://www.koket.se/jens_linder/varmratter/kott/entrecote_med_smak_av_korianderfro_och_vitlok/",
  "https://www.koket.se/jens_linder/varmratter/kott/farsk_flasklagg_med_surkal/",
  "https://www.koket.se/jens_linder/varmratter/kott/confit_pa_flaskkott/",
  "https://www.koket.se/jens_linder/varmratter/kott/agnello_in_umido___siciliansk_lammstek/",
  "https://www.koket.se/jens_linder/varmratter/kott/hjortstek_med_bacon_och_kapris/",
  "https://www.koket.se/jens_linder/varmratter/kott/kokt_rimmad_oxbringa_med_senaps__eller_pepparrotssas/",
  "https://www.koket.se/jens_linder/varmratter/kott/langsjuden_oxbringa_med_chili__vitlok_och_ingefara/",
  "https://www.koket.se/jens_linder/soppor_och_grytor/kott/klassisk_oxsvanssoppa/",
  "https://www.koket.se/jens_linder/soppor_och_grytor/gronsakeroch_184_potatis_och_andra_rotfrukter/savlig_rotsakssoppa_med_kryddost/",
  "https://www.koket.se/gert_klotzke/varmratter/kyckling_och_fagel/rimmat_ripbrost_med_potatissallad/",
  "https://www.koket.se/gert_klotzke/forratter/vilt/harfile_med_kaprisvinagrett_och_sallad/",
  "https://www.koket.se/carina_och_ulrika_brydling/huvudratter/gronsaker__potatis_och_andra_rotfrukter/kardemumma_kokt_kalrot_med_tradgards_bar_och_farskostkram/",
  "https://www.koket.se/mikael-hakansson/varmratter/kott/langkok-med-mandelpotatis--skogssvamp-och-rodvinssas/",
  "https://www.koket.se/jens_linder/soppor_och_grytor/artor__bonor_och_linser/artsoppa_extra_allt/",
  "https://www.koket.se/maximillian_lundin/soppor_och_grytor/kott/loksoppa_med_kycklinglar__sparrispotatis_och_sidflask_med_champinjoner/",
  "https://www.koket.se/paolo_roberto/varmratter/pasta_och_nudlar/pasta_con_salsa_di_pomodori_del_ragu/",
  "https://www.koket.se/mitt-kok/tommy-myllymaki/rodvinskokt-hogrev-med-timjan-och-bonor/",
  "https://www.koket.se/mitt-kok/donal-skehan/tacos-med-pulled-pork/",
  "https://www.koket.se/mitt-kok/paolo-roberto/risotto-alla-marinara/",
  "https://www.koket.se/b-uf-a-la-bourguignonne",
  "https://www.koket.se/vinkokt-skinka",
  "https://www.koket.se/nyhetsmorgon/green-kitchen-stories/rodbetsbourguignon/",
  "https://www.koket.se/mamma-rosas-stek",
  "https://www.koket.se/mitt-kok/donal-skehan/lammlagg-med-minty-mushy-peas/",
  "https://www.koket.se/langkok-pa-kyckling-och-tomat",
  "https://www.koket.se/tjalknol-pa-alg-med-rotsakspytt",
  "https://www.koket.se/gryta-med-oxkott-och-vita-bonor",
  "https://www.koket.se/mitt-kok/paolo-roberto/stracotto-di-vitello-con-salsa-di-pomodoro-e-gnocchi/",
  "https://www.koket.se/kyckling-i-lergryta",
  "https://www.koket.se/finsk-kalrotslada-med-stekt-rimmat-flask",
  "https://www.koket.se/b-uf-bourguignon",
  "https://www.koket.se/halstrad-roding-med-ortpotatis",
  "https://www.koket.se/polenta-med-stekt-sparris-och-pesto",
  "https://www.koket.se/kalsoppa-fran-les-landes",
  "https://www.koket.se/klockan-nio-hos-stjarnorna/tommy-nilsson/hostgryta-med-potatismos-och-karlek/",
  "https://www.koket.se/flask-med-linser",
  "https://www.koket.se/gammaldags-pressylta",
  "https://www.koket.se/far-i-kal-pa-savojkal",
  "https://www.koket.se/per---kalmar/efterratter-godis/frukt-bar/flamberad-ananas-med-korsbarskompott/",
  "https://www.koket.se/halv-atta-hos-mig/per---soderhamn/lagtempererat-hogrev-med-potatis--och-morotsterrin/",
  "https://www.koket.se/oxsvanssoppa",
  "https://www.koket.se/nyhetsmorgon/jim-erixen/rodvinsbrasserad-oxkind-med-absinthelokar-och-picklade-gronsaker/",
  "https://www.koket.se/oxsvansgryta-med-rotfrukter",
  "https://www.koket.se/ostgratinerad-oxbringa",
  "https://www.koket.se/klassisk-kalops",
  "https://www.koket.se/halv-atta-hos-mig/mikael---oslo/farikal/",
  "https://www.koket.se/stekt-salt-sill-med-lok-och-gradde",
  "https://www.koket.se/kokt-hons-med-currysas",
  "https://www.koket.se/fiskgryta-med-bacon",
  "https://www.koket.se/per-morberg/varmratter/vilt/per-morbergs-algstek/",
  "https://www.koket.se/niclas_wahlstrom/huvudratter/korv_och_chark/langkokt_kalvtunga/",
  "https://www.koket.se/per_morberg/paj_och_pizza/_/kungens_utflyktspaj/",
  "https://www.koket.se/jens_linder/varmratter/kott/helstekt_kotlett_som_i_florens/",
  "https://www.koket.se/pelle_johansson/huvudratter/kott/kokt_farsk_oxbringa_med_pepparrotsas/",
  "https://www.koket.se/tjalknol",
  "https://www.koket.se/mitt-kok/paolo-roberto/tomat--och-musselrisotto/",
  "https://www.koket.se/paolo_roberto/varmratter/ris__couscous_och_andra_gryn/risotto_alla_marinara___en_italiensk_paella/",
  "https://www.koket.se/nyhetsmorgon/johan-hedberg/rodvinsmarinerad-oxkind-med-rotfrukter/",
  "https://www.koket.se/kokt-farsk-oxbringa-med-pepparrotssas",
  "https://www.koket.se/lax-med-dillsas-och-pommes-duchesse",
  "https://www.koket.se/jens_linder/varmratter/fisk_och_skaldjur/lattrimmad_roding_med_dillstuvade_mandelriskor/",
  "https://www.koket.se/glaserade-rotter-med-stekt-svamp",
  "https://www.koket.se/kocklandslaget/huvudratter/fisk_och_skaldjur/langa_med_fankal__oliver_och_hjartmusslor/",
  "https://www.koket.se/anette_rosvall_och_emma_hamberg/safta_och_sylta/frukt_och_bar/inlagda_paron_med_lingon/",
  "https://www.koket.se/desiree_hornberg/huvudratter/kott/first_date_porter_love/",
  "https://www.koket.se/karin_lennmor/huvudratter/kott/lamm_med_spenat_och_balsamico__potatistarta_och_hallonsallad/",
  "https://www.koket.se/johan_jureskog/huvudratter/vilt/alg_boeuf_bourgignon_med_mandelpotatis___och_roquefortost/",
  "https://www.koket.se/sayan_isaksson/varmratter/kyckling_och_fagel/langkokt_kycklingskinn/",
  "https://www.koket.se/johan_jureskog/huvudratter/kott/rodvinsbrasserade_oxkinder_med_tryffelpotatispure/",
  "https://www.koket.se/monika-ahlberg/soppor-och-grytor/kott/monika-ahlbergs-boeuf-bourguignon/",
  "https://www.koket.se/johan_jureskog/varmratter/kott/dillkott_pa_lamm/",
  "https://www.koket.se/boeuf-bourguignon-viktvaktarnas-recept",
  "https://www.koket.se/flaskrilette",
  "https://www.koket.se/langkok-pa-far",
  "https://www.koket.se/black-bean-chili",
  "https://www.koket.se/hogrevschili-jessica-frejs-goda-recept",
  "https://www.koket.se/svarta-linser-med-kyckling-och-spansk-paprika",
  "https://www.koket.se/klassisk-chili-con-carne",
  "https://www.koket.se/kalvlagg-med-shopska-sallad",
  "https://www.koket.se/ortkryddad-fransyska-serveras-med-rostade-rotfrukter",
  "https://www.koket.se/paolos-pasta-med-hostragu-pa-oxkott-och-svamp",
  "https://www.koket.se/chili-pa-hogrev-med-jalapeno-creme-fraiche-picklad-rodlok-och-stark-ost",
  "https://www.koket.se/mexikansk-pulled-pork-med-kramig-coleslaw"
];

let filename = "koket/langkok-2018-06-07.json";
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