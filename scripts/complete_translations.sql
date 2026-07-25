-- =============================================
-- 1. ADD TRANSLATIONS COLUMNS (safe to re-run)
-- =============================================
ALTER TABLE products ADD COLUMN IF NOT EXISTS translations jsonb DEFAULT '{}';
ALTER TABLE categories ADD COLUMN IF NOT EXISTS translations jsonb DEFAULT '{}';
ALTER TABLE collections ADD COLUMN IF NOT EXISTS translations jsonb DEFAULT '{}';
ALTER TABLE blogs ADD COLUMN IF NOT EXISTS translations jsonb DEFAULT '{}';
ALTER TABLE blog_categories ADD COLUMN IF NOT EXISTS translations jsonb DEFAULT '{}';
ALTER TABLE origins ADD COLUMN IF NOT EXISTS translations jsonb DEFAULT '{}';
ALTER TABLE materials ADD COLUMN IF NOT EXISTS translations jsonb DEFAULT '{}';
ALTER TABLE colors ADD COLUMN IF NOT EXISTS translations jsonb DEFAULT '{}';
ALTER TABLE sizes ADD COLUMN IF NOT EXISTS translations jsonb DEFAULT '{}';
ALTER TABLE shapes ADD COLUMN IF NOT EXISTS translations jsonb DEFAULT '{}';

-- =============================================
-- 2. ORIGINS
-- =============================================
UPDATE origins SET translations = '{"it": {"name": "Afghanistan"}}' WHERE id = '16e1e628-da8a-4d1a-ab1c-c2427120b9e0';
UPDATE origins SET translations = '{"it": {"name": "Iran"}}' WHERE id = 'd9555e3b-cb8a-4a75-99f7-5c4ba307319d';
UPDATE origins SET translations = '{"it": {"name": "Turchia"}}' WHERE id = '3eaa1727-6a9f-403a-9319-48c8df447467';
UPDATE origins SET translations = '{"it": {"name": "Pakistan"}}' WHERE id = '0bd750f3-e673-48ba-8812-f903cceaf78d';
UPDATE origins SET translations = '{"it": {"name": "India"}}' WHERE id = 'ef9d12e2-4e78-4c23-be88-b69058c669ed';
UPDATE origins SET translations = '{"it": {"name": "Cina"}}' WHERE id = '8f91b600-32dc-4679-8689-97c99420018a';

-- =============================================
-- 3. MATERIALS
-- =============================================
UPDATE materials SET translations = '{"it": {"name": "Lana"}}' WHERE id = 'f054b667-62d3-42a5-9177-6870e63dfc79';
UPDATE materials SET translations = '{"it": {"name": "Seta"}}' WHERE id = 'f83ba6ee-47a6-4c5e-bc60-9515b5e155c1';
UPDATE materials SET translations = '{"it": {"name": "Cotone"}}' WHERE id = '926f0047-b1ad-4c3a-b9b5-3b101fc99d23';
UPDATE materials SET translations = '{"it": {"name": "Lana e Seta"}}' WHERE id = '5b6f1159-cf2b-40cb-b824-25067aeea041';
UPDATE materials SET translations = '{"it": {"name": "Viscosa"}}' WHERE id = 'a8a41a1e-1083-4939-aa7a-8240907c28d7';

-- =============================================
-- 4. COLORS
-- =============================================
UPDATE colors SET translations = '{"it": {"name": "Rosso"}}' WHERE id = '4fd5f79f-86c1-4261-9bda-adf400385aa8';
UPDATE colors SET translations = '{"it": {"name": "Blu"}}' WHERE id = 'b70b4496-2f13-4090-901e-01a5b560f471';
UPDATE colors SET translations = '{"it": {"name": "Blu Scuro"}}' WHERE id = 'bda183d9-5a92-462f-a977-50f5d9709aed';
UPDATE colors SET translations = '{"it": {"name": "Avorio"}}' WHERE id = '557edf97-e9cd-4b69-bf77-ea7c77b4c25e';
UPDATE colors SET translations = '{"it": {"name": "Crema"}}' WHERE id = '281cbd26-225c-4613-8270-0df4b02ef5c8';
UPDATE colors SET translations = '{"it": {"name": "Beige"}}' WHERE id = '05bd9107-ca2c-45dc-87f7-1ba2cf0cfe3a';
UPDATE colors SET translations = '{"it": {"name": "Marrone"}}' WHERE id = 'a2b83299-0bd3-4ebd-a4d6-13240bbdff25';
UPDATE colors SET translations = '{"it": {"name": "Ruggine"}}' WHERE id = 'f2faf16a-03aa-4658-8e79-c92a79feb9a5';
UPDATE colors SET translations = '{"it": {"name": "Terracotta"}}' WHERE id = '4e2cc0cb-dc80-466c-a016-d464c3dea2ca';
UPDATE colors SET translations = '{"it": {"name": "Oro"}}' WHERE id = '5790737f-756f-43d6-9346-84ddda2c7c92';
UPDATE colors SET translations = '{"it": {"name": "Verde"}}' WHERE id = '6e1b053e-a656-4f1a-a0a2-dddf1f850425';
UPDATE colors SET translations = '{"it": {"name": "Smeraldo"}}' WHERE id = '61e8776c-41f1-42d8-b625-be079103ce08';
UPDATE colors SET translations = '{"it": {"name": "Turchese"}}' WHERE id = 'a2799387-2125-4136-ac10-239fc4f43dd7';
UPDATE colors SET translations = '{"it": {"name": "Azzurro"}}' WHERE id = 'bd1db396-98d3-4de7-b388-6f26b74378f1';
UPDATE colors SET translations = '{"it": {"name": "Arancione"}}' WHERE id = '1d8a4bda-934b-48d7-8b77-56fb07d32d6d';
UPDATE colors SET translations = '{"it": {"name": "Borgogna"}}' WHERE id = '29b758c0-ad7d-4cf9-9b13-b5adf3559175';
UPDATE colors SET translations = '{"it": {"name": "Multicolore"}}' WHERE id = '9f1ed1ed-4b5a-4120-808d-73755235cee1';

-- =============================================
-- 5. CATEGORIES
-- =============================================
UPDATE categories SET translations = '{"it": {"name": "Tappeti Afgani", "description": "Autentici tappeti afgani fatti a mano, annodati con maestria da artigiani afgani utilizzando tecniche tradizionali tramandate da generazioni."}}' WHERE id = '3060d39f-80ef-46ee-b9b7-8535cc8f4a04';
UPDATE categories SET translations = '{"it": {"name": "Tappeti Persiani", "description": "Eleganti tappeti persiani realizzati a mano, celebri per i loro motivi intricati e i colori ricchi e raffinati."}}' WHERE id = '17238db4-ee5b-4afd-a816-766edc6b762d';
UPDATE categories SET translations = '{"it": {"name": "Tappeti Passaggio", "description": "Tappeti da passaggio e corridoio, perfetti per aggiungere calore e stile ai vostri spazi stretti e corridoi."}}' WHERE id = 'b2b03064-e6d1-4649-ad8e-db1132920057';
UPDATE categories SET translations = '{"it": {"name": "Kilim", "description": "Kilim tessuti a mano, leggeri e versatili, con motivi geometrici tradizionali e colori vivaci."}}' WHERE id = 'aa7f4576-d5be-47d5-9cc0-3a2d4766aaba';
UPDATE categories SET translations = '{"it": {"name": "Tappeti Vintage", "description": "Tappeti vintage dal fascino senza tempo, con motivi classici che raccontano storie di artigianato tradizionale."}}' WHERE id = 'f4b468a2-1df8-44bb-b18b-cbc9886c26ee';
UPDATE categories SET translations = '{"it": {"name": "Tappeti Moderni", "description": "Tappeti dal design contemporaneo, perfetti per arredamenti moderni e minimalisti."}}' WHERE id = '6b1bec5b-d097-4e33-a315-9b576b0f2ebf';
UPDATE categories SET translations = '{"it": {"name": "Tappeti Orientali", "description": "Tappeti orientali tradizionali, ricchi di storia e artigianato, con motivi iconici tramandati da secoli."}}' WHERE id = 'bd65885f-c2dd-4a85-a13d-c1a64be36433';
UPDATE categories SET translations = '{"it": {"name": "Tappeti Rotondi", "description": "Tappeti rotondi fatti a mano, ideali per creare un punto focale unico in ogni stanza."}}' WHERE id = '932798fc-356c-4d4e-b54d-48324300ad91';
UPDATE categories SET translations = '{"it": {"name": "Tappeti di Lusso", "description": "Tappeti di lusso realizzati con i migliori materiali e la più alta artigianalità, per chi cerca l''eccellenza."}}' WHERE id = 'e39ae70b-a5fa-42e0-8b85-270275f02c84';

-- =============================================
-- 6. COLLECTIONS
-- =============================================
UPDATE collections SET translations = '{"it": {"name": "Collezione Heritage", "description": "Tappeti della collezione Heritage, che celebrano l''eredità artigianale afgana con motivi tradizionali."}}' WHERE id = '65ba64e4-afdc-4539-8cf9-0ca772fd09e4';
UPDATE collections SET translations = '{"it": {"name": "Collezione Reale", "description": "La collezione Reale presenta tappeti maestosi e sontuosi per ambienti prestigiosi."}}' WHERE id = 'af17c80e-d553-4c6e-9300-b7a466d57df0';
UPDATE collections SET translations = '{"it": {"name": "Collezione Nomade", "description": "Tappeti ispirati allo spirito nomade, con motivi geometrici audaci e colori naturali."}}' WHERE id = '17249f1b-e0ab-482d-a561-7d166843fc89';
UPDATE collections SET translations = '{"it": {"name": "Collezione Lusso", "description": "La collezione di lusso offre tappeti premium realizzati con i materiali più pregiati."}}' WHERE id = 'c3b45b1d-28b1-4f93-b5c8-c8687712079d';
UPDATE collections SET translations = '{"it": {"name": "Collezione Artigianale", "description": "Tappeti artigianali unici, realizzati a mano da abili artigiani con tecniche tradizionali."}}' WHERE id = 'cf185f03-6a53-4df5-8ae7-1348f62b25cc';
UPDATE collections SET translations = '{"it": {"name": "Collezione Via della Seta", "description": "Ispirati all''antica Via della Seta, questi tappeti raccontano storie di scambi culturali e artigianato."}}' WHERE id = '2901320a-a0a8-4031-b878-a81d8d0cddd4';
UPDATE collections SET translations = '{"it": {"name": "Nuovi Arrivi", "description": "Gli ultimi arrivi nella nostra collezione, pezzi freschi e appena selezionati."}}' WHERE id = 'a248db7a-f4ce-4a07-9e4e-b015062aa8cd';
UPDATE collections SET translations = '{"it": {"name": "Pi\u00f9 Venduti", "description": "I tappeti pi\u00f9 amati dai nostri clienti, selezioni popolari che uniscono qualit\u00e0 e stile."}}' WHERE id = '7dd5d416-67c9-407f-95fc-47c3a558aef5';
UPDATE collections SET translations = '{"it": {"name": "Collezione Classica", "description": "Tappeti classici senza tempo, con motivi eleganti che si adattano a qualsiasi arredamento."}}' WHERE id = '58393f4f-80e0-4bc4-926e-621ebf0aab0a';

-- =============================================
-- 7. PRODUCTS
-- =============================================
UPDATE products SET translations = '{"it": {"name": "Royal Afghan Mosaic Passaggio", "short_description": "Tappeto da passaggio afgano annodato a mano."}}' WHERE id = '877f19ac-539c-4cdd-9f17-97bd8bfe0fab';
UPDATE products SET translations = '{"it": {"name": "Heritage Corridor Passaggio", "short_description": "Tappeto da corridoio classico."}}' WHERE id = '55878ad9-641b-4cc8-bb54-2732da504ab4';
UPDATE products SET translations = '{"it": {"name": "Afghan Mosaic Tappeto Accento", "short_description": "Tappeto accento compatto."}}' WHERE id = 'a4f8d554-3828-4ff7-869a-b2577e6b2da3';
UPDATE products SET translations = '{"it": {"name": "Tribal Mosaic Tappeto", "short_description": "Tappeto tribale tradizionale."}}' WHERE id = '1a9370fb-2a01-43f1-8aed-3cf28a502b8a';
UPDATE products SET translations = '{"it": {"name": "Heritage Panel Tappeto", "short_description": "Tappeto a pannelli tradizionale."}}' WHERE id = 'c4d79bf9-9d46-4248-bc11-3eab5574db6b';
UPDATE products SET translations = '{"it": {"name": "Royal Patchwork Kilim", "short_description": "Kilim patchwork di lusso."}}' WHERE id = '3252b865-29e7-4d56-a3ce-1b3a81adc163';
UPDATE products SET translations = '{"it": {"name": "Silk Road Heritage Tappeto", "short_description": "Ispirato alla Via della Seta."}}' WHERE id = '6dec068c-4bb9-46be-a2ce-be8250af21e4';
UPDATE products SET translations = '{"it": {"name": "Ivory Heritage Tappeto", "short_description": "Elegante tappeto avorio."}}' WHERE id = '50858ba9-d791-4da0-a3f0-fd19c626e11e';
UPDATE products SET translations = '{"it": {"name": "Royal Heritage Medaglione", "short_description": "Tappeto tradizionale afgano."}}' WHERE id = '456991f8-a2c4-4949-b970-aa8246eac366';
UPDATE products SET translations = '{"it": {"name": "Nomadic Heritage Tappeto", "short_description": "Tappeto classico afgano."}}' WHERE id = '0fbf2808-3e90-4876-b3ae-8abc71ec66a8';
UPDATE products SET translations = '{"it": {"name": "Afghan Garden Mosaico", "short_description": "Tappeto floreale afgano tradizionale."}}' WHERE id = 'e7c67d7b-2643-48a2-b26a-899d51b480ee';
UPDATE products SET translations = '{"it": {"name": "Classic Tribal Eleganza", "short_description": "Tappeto tribale fatto a mano."}}' WHERE id = '469622c9-e651-4137-98cd-3b63361a4dc8';
UPDATE products SET translations = '{"it": {"name": "Royal Palace Tappeto", "short_description": "Tappeto di lusso afgano fatto a mano."}}' WHERE id = 'bbb76ca7-220e-4db0-810f-8bcb2a7ebbde';
UPDATE products SET translations = '{"it": {"name": "Silk Road Classico", "short_description": "Capolavoro tradizionale afgano."}}' WHERE id = 'ed37c21e-78aa-4e89-bc71-5f5043f5d8ee';
UPDATE products SET translations = '{"it": {"name": "Heritage Afghan Tessuto", "short_description": "Autentico tappeto afgano."}}' WHERE id = 'd42e126d-85f2-42e4-8e52-e94e06a31cb2';
UPDATE products SET translations = '{"it": {"name": "Vintage Afghan Heritage", "short_description": "Tappeto vintage tradizionale."}}' WHERE id = '0c32102c-ac7a-4d4b-88f6-7c7a874c4588';
UPDATE products SET translations = '{"it": {"name": "Luxury Afghan Palace", "short_description": "Tappeto premium di lusso."}}' WHERE id = 'c1fa36d6-80c1-4d46-83fd-7021a0c62f00';
UPDATE products SET translations = '{"it": {"name": "Nomadic Desert Eleganza", "short_description": "Tappeto tradizionale afgano."}}' WHERE id = '3ebf02fc-9728-42b9-86d2-60bd0e7a5f5f';
UPDATE products SET translations = '{"it": {"name": "Royal Afghan Horizon", "short_description": "Tappeto di lusso fatto a mano."}}' WHERE id = '40336265-dfdc-4dd0-8701-ccbfd2ca572b';
UPDATE products SET translations = '{"it": {"name": "Heritage Medaglione Capolavoro", "short_description": "Tappeto classico afgano."}}' WHERE id = 'd4f217cb-1f33-485e-9eca-ec31ade4082c';
UPDATE products SET translations = '{"it": {"name": "Imperial Afghan Palace", "short_description": "Tappeto da palazzo di lusso."}}' WHERE id = '2f31386e-7df6-4109-9ef6-570d6aab9884';
UPDATE products SET translations = '{"it": {"name": "Vintage Silk Road Tesoro", "short_description": "Tappeto afgano vintage."}}' WHERE id = '61253d4a-9b3e-4ad3-ac80-cff31e1f683c';
UPDATE products SET translations = '{"it": {"name": "Afghan Artisan Classico", "short_description": "Tappeto artigianale fatto a mano."}}' WHERE id = '469e56f2-7486-4c4e-b5de-4e92bb9e2074';
UPDATE products SET translations = '{"it": {"name": "Royal Heritage Collezione", "short_description": "Tappeto heritage premium."}}' WHERE id = '3e190461-1221-492f-9e97-f5aa93957f63';
UPDATE products SET translations = '{"it": {"name": "Afghan Timeless Bellezza", "short_description": "Tappeto tradizionale fatto a mano."}}' WHERE id = '249d9ca3-1ff7-4b6c-9561-c56c3855454f';
UPDATE products SET translations = '{"it": {"name": "Royal Afghan Legacy", "short_description": "Capolavoro di lusso afgano."}}' WHERE id = '7723f73d-58b6-424e-b6a0-a5cfcd4643b4';
UPDATE products SET translations = '{"it": {"name": "Isfahan Sky Fiorito", "short_description": "Tappeto floreale persiano di lusso."}}' WHERE id = 'ccd13a94-638f-4fb0-89d0-d706ef2f69c9';
UPDATE products SET translations = '{"it": {"name": "Turquoise Garden Passaggio", "short_description": "Tappeto da passaggio persiano fatto a mano."}}' WHERE id = '576c72db-ee9d-46c7-b3be-cb65960867d3';
UPDATE products SET translations = '{"it": {"name": "Persian Floral Dettaglio", "short_description": "Tappeto persiano tradizionale."}}' WHERE id = '84cf88bd-3864-4f8e-b11b-12a1b699a8f8';
UPDATE products SET translations = '{"it": {"name": "Emerald Persian Giardino", "short_description": "Tappeto persiano di lusso."}}' WHERE id = 'df58adcf-7e5c-4ccf-9f87-b1fcb0f4ea17';
UPDATE products SET translations = '{"it": {"name": "Emerald Garden Dettaglio", "short_description": "Tappeto persiano fatto a mano."}}' WHERE id = 'a9b3eda8-a1c7-4228-96c1-b332db68d08d';
UPDATE products SET translations = '{"it": {"name": "Persian Sky Garden Passaggio", "short_description": "Tappeto da passaggio persiano di lusso."}}' WHERE id = 'dd4691a9-ff06-4662-9c08-22134177d830';
UPDATE products SET translations = '{"it": {"name": "Balkh Mosaic Passaggio", "short_description": "Tappeto da passaggio afgano fatto a mano."}}' WHERE id = '519a1336-6176-4bf0-917c-1379a5d8551c';
UPDATE products SET translations = '{"it": {"name": "Maimana Heritage Passaggio", "short_description": "Tappeto da passaggio afgano tradizionale."}}' WHERE id = '405d76f2-a5fc-40fe-9556-76a88cbfc731';
UPDATE products SET translations = '{"it": {"name": "Sunset Tribal Passaggio", "short_description": "Tappeto da passaggio afgano annodato a mano."}}' WHERE id = '8c4fed33-f7d7-4dc4-9b25-5a2bc026fda9';
UPDATE products SET translations = '{"it": {"name": "Autumn Heritage Passaggio", "short_description": "Tappeto da passaggio tradizionale afgano."}}' WHERE id = '4f16c194-794a-43bd-8f23-77553dcb618b';
UPDATE products SET translations = '{"it": {"name": "Nomad Heritage Passaggio", "short_description": "Tappeto da passaggio tribale tradizionale."}}' WHERE id = 'fd98bf4e-4576-4a10-8339-0dcb192fa699';
UPDATE products SET translations = '{"it": {"name": "Artisan Heritage Tappeto", "short_description": "Tappeto heritage di lusso."}}' WHERE id = 'b960ff3c-6b4c-4630-afd6-d7fb1377eee7';
UPDATE products SET translations = '{"it": {"name": "Royal Nomad Collezione", "short_description": "Tappeto tribale premium."}}' WHERE id = '33a9ed58-73c8-4922-a7a3-8651376364ca';
UPDATE products SET translations = '{"it": {"name": "Ivory Palace Giardino", "short_description": "Tappeto persiano di lusso."}}' WHERE id = 'c859f315-bdb5-447c-a1cd-6ea44b2ed5b7';
UPDATE products SET translations = '{"it": {"name": "Silk Road Corridor Passaggio", "short_description": "Tappeto da passaggio afgano tradizionale."}}' WHERE id = 'bf3831a1-0f70-4470-b043-ad5c8a810f7b';
UPDATE products SET translations = '{"it": {"name": "Sultani Bakhtiari Heritage", "short_description": "Tappeto Bakhtiari annodato a mano della tradizione Sultani."}}' WHERE id = '089e7848-3460-477d-8c22-98d15a146781';
UPDATE products SET translations = '{"it": {"name": "Sultani Gabbah", "short_description": "Tappeto Gabbah annodato a mano con audaci motivi tribali."}}' WHERE id = '4318aa72-3ff2-4b42-a1f8-97d5877a018b';
UPDATE products SET translations = '{"it": {"name": "Sultani Farhan Ziegler", "short_description": "Tappeto Farhan Ziegler annodato a mano con eleganti motivi floreali."}}' WHERE id = '676f3a2c-5e58-4b21-8472-70d75b88ae75';

-- =============================================
-- 8. SIZES (names stay the same in Italian)
-- =============================================

-- =============================================
-- 9. SHAPES (if any exist)
-- =============================================
