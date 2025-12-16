-- MySQL dump 10.13  Distrib 8.0.44, for Linux (x86_64)
--
-- Host: localhost    Database: laravel
-- ------------------------------------------------------
-- Server version	8.0.44

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `activities`
--

DROP TABLE IF EXISTS `activities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `activities` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `professor_id` bigint unsigned NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` enum('discover','story_order','error_hunter','story_creator') COLLATE utf8mb4_unicode_ci NOT NULL,
  `difficulty` enum('easy','medium','hard') COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `config` json NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT '1',
  `due_date` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `activities_professor_id_foreign` (`professor_id`),
  CONSTRAINT `activities_professor_id_foreign` FOREIGN KEY (`professor_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `activities`
--

LOCK TABLES `activities` WRITE;
/*!40000 ALTER TABLE `activities` DISABLE KEYS */;
INSERT INTO `activities` VALUES (4,16,'Peter Pan','discover','hard','Leer y familiarizarse con un amplio repertorio de literatura para aumentar su conocimiento del mundo y desarrollar su imaginación; por ejemplo: poemas (Unidad 2 y 3), cuentos folclóricos y de autor (Unidad 1, 3 y 4), fábulas (Unidad 2), leyendas (Unidad 1), mitos, novelas (Unidad 4), historietas (Unidad 1), otros.','{\"words\": [{\"word\": \"amplio\", \"definition\": \"amplio\"}, {\"word\": \"literatura\", \"definition\": \"literatura\"}, {\"word\": \"conocimiento\", \"definition\": \"conocimiento\"}, {\"word\": \"desarrollar\", \"definition\": \"desarrollar\"}, {\"word\": \"ejemplo\", \"definition\": \"ejemplo\"}]}',1,'2025-11-28 00:00:00','2025-11-18 23:14:32','2025-11-18 23:14:32'),(5,18,'Los tres cerditos','discover','medium','Leer y familiarizarse con un amplio repertorio de literatura para aumentar su conocimiento del mundo y desarrollar su imaginación; por ejemplo: poemas (Unidad 2 y 3), cuentos folclóricos y de autor (Unidad 1, 3 y 4), fábulas (Unidad 2), leyendas (Unidad 1), mitos, novelas (Unidad 4), historietas (Unidad 1), otros.','{\"words\": [{\"word\": \"familiarizarse\", \"definition\": \"familiarizarse\"}, {\"word\": \"amplio\", \"definition\": \"amplio\"}, {\"word\": \"aumentar\", \"definition\": \"aumentar\"}]}',1,'2025-11-22 00:00:00','2025-11-18 23:49:15','2025-11-18 23:49:15'),(7,1,'La estrella que no brillaba','discover','easy','Había una vez, en un cielo lleno de luces, una pequeña estrella llamada Luma. Aunque todas las demás brillaban con fuerza, ella apenas emitía un destello tímido.\n\nCada noche, Luma intentaba brillar más, pero se sentía triste porque pensaba que nunca sería tan luminosa como las demás. Un día, una niña en la Tierra miró al cielo y, al ver su luz suave, sonrió.\n\n—Gracias, pequeña estrella —susurró—. Tu luz me acompaña cuando no puedo dormir.\n\nLuma comprendió entonces que no hacía falta ser la más brillante para ser especial. Desde esa noche, brilló feliz, sabiendo que su luz, por pequeña que fuera, tenía un gran propósito.','{\"words\": [{\"word\": \"luces\", \"definition\": \"Fuentes de luz que iluminan un lugar\"}, {\"word\": \"triste\", \"definition\": \"Emoción de pena\"}, {\"word\": \"fuerza\", \"definition\": \"Capacidad para actuar o resistir\"}, {\"word\": \"propósito\", \"definition\": \"Intención o meta clara\"}, {\"word\": \"destello\", \"definition\": \"Brillo breve e intenso\"}]}',1,NULL,'2025-12-01 22:32:34','2025-12-01 22:32:34'),(8,1,'La gallina de los huevos de oro','discover','easy','“Érase una vez una pareja de granjeros que, un día, descubrieron en uno de los nidos en los que criaban gallinas un huevo de oro macizo. La pareja fue observando que el ave producía tal prodigio día tras día, obteniendo cada día un huevo de oro.\n\nReflexionando sobre qué era lo que hacía que la gallina en cuestión tuviese esa habilidad, sospecharon que que ésta poseía oro en su interior. Para comprobarlo y obtener todo el oro de una vez, mataron a la gallina y la abrieron, descubriendo para su sorpresa que por dentro la prodigiosa ave era igual a las demás. Y también se dieron cuenta que, en su ambición, habían acabado con aquello que les había estado enriqueciendo.”\n\nEsta fábula, asociada a Esopo aunque también versionada por autores como Samariaga o La Fontaine y que en ocasiones nos habla de una gallina y en otras de un ganso, nos enseña la importancia de dejar de lado la codicia, ya que nos puede conducir a perder lo que tenemos.','{\"words\": [{\"word\": \"fábula\", \"definition\": \"Historia breve, generalmente con animales como protagonistas\"}, {\"word\": \"codicia\", \"definition\": \"Deseo excesivo e insaciable de poseer riquezas o bienes materiales.\"}, {\"word\": \"gallina\", \"definition\": \"Ave doméstica\"}, {\"word\": \"granjeros\", \"definition\": \"Personas que se dedican a la agricultura\"}, {\"word\": \"nidos\", \"definition\": \"Estructuras construidas por las aves\"}]}',1,NULL,'2025-12-02 05:06:01','2025-12-02 05:06:01'),(9,1,'El zorro y las uvas','discover','easy','“Había una vez un zorro que caminaba, sediento, por el bosque. Mientras lo hacía vio en lo alto de la rama de un árbol un racimo de uvas, las cuales deseó al instante al servirle para refrescarse y apagar su sed. El zorro se acercó al árbol e intentó alcanzar las uvas, pero estaban demasiado altas. Tras intentarlo una y otra vez sin conseguirlo, el zorro finalmente se rindió y se alejó. Viendo que un pájaro había visto todo el proceso se dijo en voz alta que en realidad no quería las uvas, dado aún no estaban maduras, y que en realidad había cesado el intento de alcanzarlas al comprobarlo.”\n\nOtra interesante historia corta en forma de fábula que nos enseña que a menudo nos intentamos convencer a nosotros mismos de no querer algo e incluso llegamos a despreciar dicho algo por el hecho de que encontramos difícil llegar a alcanzarlo.','{\"words\": [{\"word\": \"zorro\", \"definition\": \"Animal mamífero de pelaje rojizo, cola larga y orejas puntiagudas\"}, {\"word\": \"sediento\", \"definition\": \"Que tiene sed\"}, {\"word\": \"racimo\", \"definition\": \"Conjunto de frutos que cuelgan juntos de un tallo\"}, {\"word\": \"historia\", \"definition\": \"Relato de hechos pasados\"}, {\"word\": \"refrescarse\", \"definition\": \"Recuperar la frescura o la energía\"}]}',1,NULL,'2025-12-02 05:15:36','2025-12-04 23:36:38'),(14,1,'El Zorro y las Uvas','story_order','easy','El Zorro y las Uvas:\n“Había una vez un zorro que caminaba, sediento, por el bosque. Mientras lo hacía vio en lo alto de la rama de un árbol un racimo de uvas, las cuales deseó al instante al servirle para refrescarse y apagar su sed. El zorro se acercó al árbol e intentó alcanzar las uvas, pero estaban demasiado altas. Tras intentarlo una y otra vez sin conseguirlo, el zorro finalmente se rindió y se alejó. Viendo que un pájaro había visto todo el proceso se dijo en voz alta que en realidad no quería las uvas, dado aún no estaban maduras, y que en realidad había cesado el intento de alcanzarlas al comprobarlo.”\n\nPistas:\n\"¿Qué pasó primero?\"\n\"¿Qué vio el zorro?\"\n\"¿Qué intentó hacer?\"\n\"¿Qué hizo al final?\"\n\"¿Qué excusa dio?\"','{\"sentences\": [{\"id\": 1, \"text\": \"Un zorro sediento caminaba por el bosque.\", \"order\": 1}, {\"id\": 2, \"text\": \"El zorro vio un racimo de uvas en lo alto de un árbol.\", \"order\": 2}, {\"id\": 3, \"text\": \"El zorro intentó alcanzar las uvas pero estaban demasiado altas.\", \"order\": 3}, {\"id\": 4, \"text\": \"Tras intentarlo muchas veces, el zorro se rindió y se alejó.\", \"order\": 4}, {\"id\": 5, \"text\": \"El zorro dijo que en realidad no quería las uvas porque no estaban maduras.\", \"order\": 5}]}',1,NULL,'2025-12-04 22:03:28','2025-12-09 11:26:45'),(15,1,'La gallina de los huevos de oro','story_order','easy','Pistas:\n\"¿Qué encontraron primero?\"\n\"¿Qué hacía la gallina todos los días?\"\n\"¿Qué pensaron los granjeros?\"\n\"¿Qué decisión tomaron?\"\n\"¿Qué descubrieron al final?\"','{\"sentences\": [{\"id\": 1, \"text\": \"Una pareja de granjeros descubrió un huevo de oro en el nido de una gallina.\", \"order\": 1}, {\"id\": 2, \"text\": \"La gallina ponía un huevo de oro cada día.\", \"order\": 2}, {\"id\": 3, \"text\": \"Los granjeros pensaron que la gallina tenía oro en su interior.\", \"order\": 3}, {\"id\": 4, \"text\": \"Decidieron matar a la gallina para sacar todo el oro de una vez.\", \"order\": 4}, {\"id\": 5, \"text\": \"Descubrieron que la gallina era normal por dentro y habían perdido todo.\", \"order\": 5}]}',1,NULL,'2025-12-04 22:16:32','2025-12-04 23:36:16'),(16,1,'La estrella que no brillaba','story_order','easy','Pistas:\n\"¿Cómo era Luma al principio?\"\n\"¿Cómo se sentía Luma?\"\n\"¿Quién vio a Luma desde la Tierra?\"\n\"¿Qué le dijo la niña a Luma?\"\n\"¿Qué aprendió Luma?\"','{\"sentences\": [{\"id\": 1, \"text\": \"Luma era una pequeña estrella que apenas brillaba en el cielo.\", \"order\": 1}, {\"id\": 2, \"text\": \"Luma se sentía triste porque pensaba que nunca sería tan luminosa como las demás.\", \"order\": 2}, {\"id\": 3, \"text\": \"Una niña en la Tierra vio la luz suave de Luma y sonrió.\", \"order\": 3}, {\"id\": 4, \"text\": \"La niña le agradeció a Luma porque su luz la acompañaba cuando no podía dormir.\", \"order\": 4}, {\"id\": 5, \"text\": \"Luma comprendió que no hacía falta ser la más brillante para ser especial.\", \"order\": 5}]}',1,NULL,'2025-12-04 22:18:23','2025-12-04 23:35:58');
/*!40000 ALTER TABLE `activities` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `activity_attempts`
--

DROP TABLE IF EXISTS `activity_attempts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `activity_attempts` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `activity_id` bigint unsigned NOT NULL,
  `student_id` bigint unsigned NOT NULL,
  `score` int NOT NULL DEFAULT '0',
  `max_score` int NOT NULL,
  `time_spent` int DEFAULT NULL,
  `answers` json NOT NULL,
  `completed` tinyint(1) NOT NULL DEFAULT '0',
  `completed_at` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `activity_attempts_student_id_foreign` (`student_id`),
  KEY `activity_attempts_activity_id_student_id_index` (`activity_id`,`student_id`),
  CONSTRAINT `activity_attempts_activity_id_foreign` FOREIGN KEY (`activity_id`) REFERENCES `activities` (`id`) ON DELETE CASCADE,
  CONSTRAINT `activity_attempts_student_id_foreign` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `activity_attempts`
--

LOCK TABLES `activity_attempts` WRITE;
/*!40000 ALTER TABLE `activity_attempts` DISABLE KEYS */;
INSERT INTO `activity_attempts` VALUES (1,7,26,40,100,15,'{\"matches\": {\"luces\": \"Capacidad para actuar o resistir\", \"fuerza\": \"Fuentes de luz que iluminan un lugar\", \"triste\": \"Intención o meta clara\", \"destello\": \"Capacidad para actuar o resistir\", \"propósito\": \"Brillo breve e intenso\"}, \"found_words\": [\"destello\", \"luces\", \"triste\", \"fuerza\", \"propósito\"], \"correct_matches\": 0}',1,'2025-12-03 14:58:38','2025-12-03 14:58:38','2025-12-03 14:58:38'),(2,7,26,40,100,20,'{\"matches\": {\"luces\": \"Capacidad para actuar o resistir\", \"fuerza\": \"Fuentes de luz que iluminan un lugar\", \"triste\": \"Fuentes de luz que iluminan un lugar\", \"destello\": \"Intención o meta clara\", \"propósito\": \"Fuentes de luz que iluminan un lugar\"}, \"found_words\": [\"luces\", \"fuerza\", \"triste\", \"propósito\", \"destello\"], \"correct_matches\": 0}',1,'2025-12-03 14:59:01','2025-12-03 14:59:01','2025-12-03 14:59:01'),(4,7,26,80,100,13,'{\"matches\": {\"luces\": \"Fuentes de luz que iluminan un lugar\", \"fuerza\": \"Capacidad para actuar o resistir\", \"triste\": \"Intención o meta clara\", \"destello\": \"Intención o meta clara\", \"propósito\": \"Capacidad para actuar o resistir\"}, \"found_words\": [\"triste\", \"luces\", \"destello\", \"propósito\", \"fuerza\"], \"correct_matches\": 2}',1,'2025-12-03 15:43:35','2025-12-03 15:43:35','2025-12-03 15:43:35'),(5,7,26,40,100,23,'{\"matches\": {\"luces\": \"Brillo breve e intenso\", \"fuerza\": \"Brillo breve e intenso\", \"triste\": \"Intención o meta clara\", \"destello\": \"Emoción de pena\", \"propósito\": \"Brillo breve e intenso\"}, \"found_words\": [\"propósito\", \"triste\", \"luces\", \"destello\", \"fuerza\"], \"correct_matches\": 0}',1,'2025-12-03 15:44:32','2025-12-03 15:44:32','2025-12-03 15:44:32'),(8,8,26,60,100,16,'{\"matches\": {\"nidos\": \"Historia breve, generalmente con animales como protagonistas\", \"codicia\": \"Historia breve, generalmente con animales como protagonistas\", \"fábula\": \"Ave doméstica\", \"gallina\": \"Personas que se dedican a la agricultura\", \"granjeros\": \"Personas que se dedican a la agricultura\"}, \"found_words\": [\"codicia\", \"gallina\", \"nidos\", \"fábula\", \"granjeros\"], \"correct_matches\": 1}',1,'2025-12-03 17:03:16','2025-12-03 17:03:16','2025-12-03 17:03:16'),(9,7,26,80,100,11,'{\"matches\": {\"luces\": \"Intención o meta clara\", \"fuerza\": \"Capacidad para actuar o resistir\", \"triste\": \"Capacidad para actuar o resistir\", \"destello\": \"Brillo breve e intenso\", \"propósito\": \"Capacidad para actuar o resistir\"}, \"found_words\": [\"propósito\", \"triste\", \"luces\", \"destello\", \"fuerza\"], \"correct_matches\": 2}',1,'2025-12-03 19:28:07','2025-12-03 19:28:07','2025-12-03 19:28:07'),(10,7,35,80,100,14,'{\"matches\": {\"luces\": \"Fuentes de luz que iluminan un lugar\", \"fuerza\": \"Fuentes de luz que iluminan un lugar\", \"triste\": \"Intención o meta clara\", \"destello\": \"Fuentes de luz que iluminan un lugar\", \"propósito\": \"Intención o meta clara\"}, \"found_words\": [\"triste\", \"luces\", \"destello\", \"propósito\", \"fuerza\"], \"correct_matches\": 2}',1,'2025-12-03 21:04:27','2025-12-03 21:04:27','2025-12-03 21:04:27'),(11,15,26,20,140,6,'{\"total\": 5, \"correct_count\": 1, \"student_order\": [{\"position\": 1, \"sentence\": \"Los granjeros pensaron que la gallina tenía oro en su interior.\"}, {\"position\": 2, \"sentence\": \"Descubrieron que la gallina era normal por dentro y habían perdido todo.\"}, {\"position\": 3, \"sentence\": \"Una pareja de granjeros descubrió un huevo de oro en el nido de una gallina.\"}, {\"position\": 4, \"sentence\": \"Decidieron matar a la gallina para sacar todo el oro de una vez.\"}, {\"position\": 5, \"sentence\": \"La gallina ponía un huevo de oro cada día.\"}]}',1,'2025-12-04 22:55:37','2025-12-04 22:55:37','2025-12-04 22:55:37'),(12,9,26,80,140,21,'{\"matches\": {\"zorro\": \"Relato de hechos pasados\", \"racimo\": \"Conjunto de frutos que cuelgan juntos de un tallo\", \"historia\": \"Recuperar la frescura o la energía\", \"sediento\": \"Que tiene sed\", \"refrescarse\": \"Que tiene sed\"}, \"found_words\": [\"historia\", \"zorro\", \"racimo\", \"sediento\", \"refrescarse\"], \"correct_matches\": 2}',1,'2025-12-04 22:58:47','2025-12-04 22:58:47','2025-12-04 22:58:47'),(13,9,26,40,140,12,'{\"matches\": {\"zorro\": \"Recuperar la frescura o la energía\", \"racimo\": \"Animal mamífero de pelaje rojizo, cola larga y orejas puntiagudas\", \"historia\": \"Animal mamífero de pelaje rojizo, cola larga y orejas puntiagudas\", \"sediento\": \"Conjunto de frutos que cuelgan juntos de un tallo\", \"refrescarse\": \"Conjunto de frutos que cuelgan juntos de un tallo\"}, \"found_words\": [\"historia\", \"zorro\", \"racimo\", \"sediento\", \"refrescarse\"], \"correct_matches\": 0}',1,'2025-12-04 22:59:08','2025-12-04 22:59:08','2025-12-04 22:59:08'),(14,9,26,60,140,18,'{\"matches\": {\"zorro\": \"Que tiene sed\", \"racimo\": \"Relato de hechos pasados\", \"historia\": \"Animal mamífero de pelaje rojizo, cola larga y orejas puntiagudas\", \"sediento\": \"Animal mamífero de pelaje rojizo, cola larga y orejas puntiagudas\", \"refrescarse\": \"Recuperar la frescura o la energía\"}, \"found_words\": [\"historia\", \"zorro\", \"sediento\", \"refrescarse\", \"racimo\"], \"correct_matches\": 1}',1,'2025-12-04 22:59:42','2025-12-04 22:59:42','2025-12-04 22:59:42'),(15,14,26,40,140,10,'{\"total\": 5, \"correct_count\": 2, \"student_order\": [{\"position\": 1, \"sentence\": \"Un zorro sediento caminaba por el bosque.\"}, {\"position\": 2, \"sentence\": \"El zorro vio un racimo de uvas en lo alto de un árbol.\"}, {\"position\": 3, \"sentence\": \"Tras intentarlo muchas veces, el zorro se rindió y se alejó.\"}, {\"position\": 4, \"sentence\": \"El zorro dijo que en realidad no quería las uvas porque no estaban maduras.\"}, {\"position\": 5, \"sentence\": \"El zorro intentó alcanzar las uvas pero estaban demasiado altas.\"}]}',1,'2025-12-04 23:00:24','2025-12-04 23:00:24','2025-12-04 23:00:24'),(16,14,26,0,140,6,'{\"total\": 5, \"correct_count\": 0, \"student_order\": [{\"position\": 1, \"sentence\": \"El zorro vio un racimo de uvas en lo alto de un árbol.\"}, {\"position\": 2, \"sentence\": \"El zorro intentó alcanzar las uvas pero estaban demasiado altas.\"}, {\"position\": 3, \"sentence\": \"Un zorro sediento caminaba por el bosque.\"}, {\"position\": 4, \"sentence\": \"El zorro dijo que en realidad no quería las uvas porque no estaban maduras.\"}, {\"position\": 5, \"sentence\": \"Tras intentarlo muchas veces, el zorro se rindió y se alejó.\"}]}',1,'2025-12-04 23:00:39','2025-12-04 23:00:39','2025-12-04 23:00:39'),(17,9,35,100,140,61,'{\"matches\": {\"zorro\": \"Animal mamífero de pelaje rojizo, cola larga y orejas puntiagudas\", \"racimo\": \"Conjunto de frutos que cuelgan juntos de un tallo\", \"historia\": \"Animal mamífero de pelaje rojizo, cola larga y orejas puntiagudas\", \"sediento\": \"Que tiene sed\", \"refrescarse\": \"Relato de hechos pasados\"}, \"found_words\": [\"zorro\", \"sediento\", \"refrescarse\", \"racimo\", \"historia\"], \"correct_matches\": 3}',1,'2025-12-05 14:58:10','2025-12-05 14:58:10','2025-12-05 14:58:10'),(18,8,35,140,140,85,'{\"matches\": {\"nidos\": \"Estructuras construidas por las aves\", \"codicia\": \"Deseo excesivo e insaciable de poseer riquezas o bienes materiales.\", \"fábula\": \"Historia breve, generalmente con animales como protagonistas\", \"gallina\": \"Ave doméstica\", \"granjeros\": \"Personas que se dedican a la agricultura\"}, \"found_words\": [\"gallina\", \"granjeros\", \"nidos\", \"fábula\", \"codicia\"], \"correct_matches\": 5}',1,'2025-12-05 17:29:11','2025-12-05 17:29:11','2025-12-05 17:29:11'),(19,14,35,60,140,36,'{\"total\": 5, \"correct_count\": 3, \"student_order\": [{\"position\": 1, \"sentence\": \"Un zorro sediento caminaba por el bosque.\"}, {\"position\": 2, \"sentence\": \"El zorro vio un racimo de uvas en lo alto de un árbol.\"}, {\"position\": 3, \"sentence\": \"Tras intentarlo muchas veces, el zorro se rindió y se alejó.\"}, {\"position\": 4, \"sentence\": \"El zorro intentó alcanzar las uvas pero estaban demasiado altas.\"}, {\"position\": 5, \"sentence\": \"El zorro dijo que en realidad no quería las uvas porque no estaban maduras.\"}]}',1,'2025-12-05 17:30:33','2025-12-05 17:30:33','2025-12-05 17:30:33'),(20,7,27,120,140,148,'{\"matches\": {\"luces\": \"Fuentes de luz que iluminan un lugar\", \"fuerza\": \"Capacidad para actuar o resistir\", \"triste\": \"Emoción de pena\", \"destello\": \"Brillo breve e intenso\", \"propósito\": \"Intención o meta clara\"}, \"found_words\": [\"fuerza\", \"luces\", \"destello\", \"triste\", \"propósito\"], \"correct_matches\": 5}',1,'2025-12-05 21:17:00','2025-12-05 21:17:00','2025-12-05 21:17:00'),(21,15,27,120,140,71,'{\"total\": 5, \"correct_count\": 5, \"student_order\": [{\"position\": 1, \"sentence\": \"Una pareja de granjeros descubrió un huevo de oro en el nido de una gallina.\"}, {\"position\": 2, \"sentence\": \"La gallina ponía un huevo de oro cada día.\"}, {\"position\": 3, \"sentence\": \"Los granjeros pensaron que la gallina tenía oro en su interior.\"}, {\"position\": 4, \"sentence\": \"Decidieron matar a la gallina para sacar todo el oro de una vez.\"}, {\"position\": 5, \"sentence\": \"Descubrieron que la gallina era normal por dentro y habían perdido todo.\"}]}',1,'2025-12-05 21:19:40','2025-12-05 21:19:40','2025-12-05 21:19:40'),(22,14,27,60,140,28,'{\"total\": 5, \"correct_count\": 3, \"student_order\": [{\"position\": 1, \"sentence\": \"Un zorro sediento caminaba por el bosque.\"}, {\"position\": 2, \"sentence\": \"El zorro vio un racimo de uvas en lo alto de un árbol.\"}, {\"position\": 3, \"sentence\": \"Tras intentarlo muchas veces, el zorro se rindió y se alejó.\"}, {\"position\": 4, \"sentence\": \"El zorro intentó alcanzar las uvas pero estaban demasiado altas.\"}, {\"position\": 5, \"sentence\": \"El zorro dijo que en realidad no quería las uvas porque no estaban maduras.\"}]}',1,'2025-12-05 21:25:57','2025-12-05 21:25:57','2025-12-05 21:25:57'),(23,14,27,140,140,10,'{\"total\": 5, \"correct_count\": 5, \"student_order\": [{\"position\": 1, \"sentence\": \"Un zorro sediento caminaba por el bosque.\"}, {\"position\": 2, \"sentence\": \"El zorro vio un racimo de uvas en lo alto de un árbol.\"}, {\"position\": 3, \"sentence\": \"El zorro intentó alcanzar las uvas pero estaban demasiado altas.\"}, {\"position\": 4, \"sentence\": \"Tras intentarlo muchas veces, el zorro se rindió y se alejó.\"}, {\"position\": 5, \"sentence\": \"El zorro dijo que en realidad no quería las uvas porque no estaban maduras.\"}]}',1,'2025-12-05 21:26:32','2025-12-05 21:26:32','2025-12-05 21:26:32'),(24,7,28,140,140,58,'{\"matches\": {\"luces\": \"Fuentes de luz que iluminan un lugar\", \"fuerza\": \"Capacidad para actuar o resistir\", \"triste\": \"Emoción de pena\", \"destello\": \"Brillo breve e intenso\", \"propósito\": \"Intención o meta clara\"}, \"found_words\": [\"luces\", \"triste\", \"fuerza\", \"destello\", \"propósito\"], \"correct_matches\": 5}',1,'2025-12-05 21:41:01','2025-12-05 21:41:01','2025-12-05 21:41:01'),(25,7,29,140,140,32,'{\"matches\": {\"luces\": \"Fuentes de luz que iluminan un lugar\", \"fuerza\": \"Capacidad para actuar o resistir\", \"triste\": \"Emoción de pena\", \"destello\": \"Brillo breve e intenso\", \"propósito\": \"Intención o meta clara\"}, \"found_words\": [\"luces\", \"fuerza\", \"triste\", \"propósito\", \"destello\"], \"correct_matches\": 5}',1,'2025-12-05 21:44:16','2025-12-05 21:44:16','2025-12-05 21:44:16'),(26,7,30,140,140,34,'{\"matches\": {\"luces\": \"Fuentes de luz que iluminan un lugar\", \"fuerza\": \"Capacidad para actuar o resistir\", \"triste\": \"Emoción de pena\", \"destello\": \"Brillo breve e intenso\", \"propósito\": \"Intención o meta clara\"}, \"found_words\": [\"luces\", \"destello\", \"triste\", \"propósito\", \"fuerza\"], \"correct_matches\": 5}',1,'2025-12-05 21:45:53','2025-12-05 21:45:53','2025-12-05 21:45:53'),(29,7,26,140,140,58,'{\"matches\": {\"luces\": \"Fuentes de luz que iluminan un lugar\", \"fuerza\": \"Capacidad para actuar o resistir\", \"triste\": \"Emoción de pena\", \"destello\": \"Brillo breve e intenso\", \"propósito\": \"Intención o meta clara\"}, \"found_words\": [\"fuerza\", \"triste\", \"luces\", \"destello\", \"propósito\"], \"correct_matches\": 5}',1,'2025-12-09 21:45:29','2025-12-09 21:45:29','2025-12-09 21:45:29'),(30,14,26,0,140,3,'{\"total\": 5, \"correct_count\": 0, \"student_order\": [{\"position\": 1, \"sentence\": \"El zorro dijo que en realidad no quería las uvas porque no estaban maduras.\"}, {\"position\": 2, \"sentence\": \"Tras intentarlo muchas veces, el zorro se rindió y se alejó.\"}, {\"position\": 3, \"sentence\": \"El zorro vio un racimo de uvas en lo alto de un árbol.\"}, {\"position\": 4, \"sentence\": \"El zorro intentó alcanzar las uvas pero estaban demasiado altas.\"}, {\"position\": 5, \"sentence\": \"Un zorro sediento caminaba por el bosque.\"}]}',1,'2025-12-10 15:30:59','2025-12-10 15:30:59','2025-12-10 15:30:59'),(31,8,26,60,140,17,'{\"matches\": {\"nidos\": \"Personas que se dedican a la agricultura\", \"codicia\": \"Deseo excesivo e insaciable de poseer riquezas o bienes materiales.\", \"fábula\": \"Deseo excesivo e insaciable de poseer riquezas o bienes materiales.\", \"gallina\": \"Personas que se dedican a la agricultura\", \"granjeros\": \"Estructuras construidas por las aves\"}, \"found_words\": [\"granjeros\", \"gallina\", \"codicia\", \"fábula\", \"nidos\"], \"correct_matches\": 1}',1,'2025-12-10 15:31:28','2025-12-10 15:31:28','2025-12-10 15:31:28');
/*!40000 ALTER TABLE `activity_attempts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `activity_course`
--

DROP TABLE IF EXISTS `activity_course`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `activity_course` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `activity_id` bigint unsigned NOT NULL,
  `course_id` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `activity_course_activity_id_course_id_unique` (`activity_id`,`course_id`),
  KEY `activity_course_course_id_foreign` (`course_id`),
  CONSTRAINT `activity_course_activity_id_foreign` FOREIGN KEY (`activity_id`) REFERENCES `activities` (`id`) ON DELETE CASCADE,
  CONSTRAINT `activity_course_course_id_foreign` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `activity_course`
--

LOCK TABLES `activity_course` WRITE;
/*!40000 ALTER TABLE `activity_course` DISABLE KEYS */;
INSERT INTO `activity_course` VALUES (4,4,10,NULL,NULL),(5,5,11,NULL,NULL),(7,7,8,NULL,NULL),(8,8,8,NULL,NULL),(9,9,8,NULL,NULL),(10,9,2,NULL,NULL),(11,8,2,NULL,NULL),(12,7,2,NULL,NULL),(21,14,8,NULL,NULL),(22,14,2,NULL,NULL),(23,15,8,NULL,NULL),(24,15,2,NULL,NULL),(25,16,8,NULL,NULL),(26,16,2,NULL,NULL);
/*!40000 ALTER TABLE `activity_course` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cache`
--

DROP TABLE IF EXISTS `cache`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cache` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache`
--

LOCK TABLES `cache` WRITE;
/*!40000 ALTER TABLE `cache` DISABLE KEYS */;
INSERT INTO `cache` VALUES ('laravel-cache-e572c4c25a7b869d78266173f7adeebd','i:3;',1765580620),('laravel-cache-e572c4c25a7b869d78266173f7adeebd:timer','i:1765580620;',1765580620),('laravel-cache-smoarga@colegio.cl|192.168.1.4','i:2;',1765580620),('laravel-cache-smoarga@colegio.cl|192.168.1.4:timer','i:1765580620;',1765580620);
/*!40000 ALTER TABLE `cache` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cache_locks`
--

DROP TABLE IF EXISTS `cache_locks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cache_locks` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `owner` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache_locks`
--

LOCK TABLES `cache_locks` WRITE;
/*!40000 ALTER TABLE `cache_locks` DISABLE KEYS */;
/*!40000 ALTER TABLE `cache_locks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `course_professor`
--

DROP TABLE IF EXISTS `course_professor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `course_professor` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `course_id` bigint unsigned NOT NULL,
  `user_id` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `course_professor_course_id_foreign` (`course_id`),
  KEY `course_professor_user_id_foreign` (`user_id`),
  CONSTRAINT `course_professor_course_id_foreign` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE,
  CONSTRAINT `course_professor_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `course_professor`
--

LOCK TABLES `course_professor` WRITE;
/*!40000 ALTER TABLE `course_professor` DISABLE KEYS */;
INSERT INTO `course_professor` VALUES (10,8,1,NULL,NULL),(11,10,16,NULL,NULL),(12,11,18,NULL,NULL),(23,12,8,NULL,NULL),(24,2,1,NULL,NULL),(25,14,7,NULL,NULL);
/*!40000 ALTER TABLE `course_professor` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `courses`
--

DROP TABLE IF EXISTS `courses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `courses` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `level` enum('3° Básico','4° Básico') COLLATE utf8mb4_unicode_ci NOT NULL,
  `section` enum('A','B','C','D','E') COLLATE utf8mb4_unicode_ci NOT NULL,
  `year` int NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `courses_level_section_year_unique` (`level`,`section`,`year`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `courses`
--

LOCK TABLES `courses` WRITE;
/*!40000 ALTER TABLE `courses` DISABLE KEYS */;
INSERT INTO `courses` VALUES (2,'3° Básico B','3° Básico','B',2025,1,'2025-11-02 03:00:40','2025-11-02 03:00:40'),(8,'3° Básico A','3° Básico','A',2025,1,'2025-11-15 00:31:41','2025-11-15 00:31:41'),(10,'4° Básico A','4° Básico','A',2025,1,'2025-11-18 22:42:41','2025-11-18 22:42:41'),(11,'4° Básico B','4° Básico','B',2025,1,'2025-11-18 23:38:19','2025-11-18 23:38:19'),(12,'3° Básico C','3° Básico','C',2025,1,'2025-11-19 01:46:11','2025-11-19 01:46:11'),(13,'4° Básico C','4° Básico','C',2025,1,'2025-12-01 22:59:46','2025-12-01 22:59:46'),(14,'3° Básico D','3° Básico','D',2025,1,'2025-12-12 23:00:20','2025-12-12 23:00:20');
/*!40000 ALTER TABLE `courses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `failed_jobs`
--

DROP TABLE IF EXISTS `failed_jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `failed_jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `failed_jobs`
--

LOCK TABLES `failed_jobs` WRITE;
/*!40000 ALTER TABLE `failed_jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `failed_jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `job_batches`
--

DROP TABLE IF EXISTS `job_batches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `job_batches` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_jobs` int NOT NULL,
  `pending_jobs` int NOT NULL,
  `failed_jobs` int NOT NULL,
  `failed_job_ids` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `options` mediumtext COLLATE utf8mb4_unicode_ci,
  `cancelled_at` int DEFAULT NULL,
  `created_at` int NOT NULL,
  `finished_at` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `job_batches`
--

LOCK TABLES `job_batches` WRITE;
/*!40000 ALTER TABLE `job_batches` DISABLE KEYS */;
/*!40000 ALTER TABLE `job_batches` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jobs`
--

DROP TABLE IF EXISTS `jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `queue` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `attempts` tinyint unsigned NOT NULL,
  `reserved_at` int unsigned DEFAULT NULL,
  `available_at` int unsigned NOT NULL,
  `created_at` int unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jobs_queue_index` (`queue`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jobs`
--

LOCK TABLES `jobs` WRITE;
/*!40000 ALTER TABLE `jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `migrations` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `migrations`
--

LOCK TABLES `migrations` WRITE;
/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
INSERT INTO `migrations` VALUES (1,'0001_01_01_000000_create_users_table',1),(2,'0001_01_01_000001_create_cache_table',1),(3,'0001_01_01_000002_create_jobs_table',1),(4,'2025_10_31_045005_add_role_to_users_table',2),(5,'2025_11_01_023956_create_courses_table',3),(6,'2025_11_01_024158_create_course_professor_table',3),(7,'2025_11_01_024622_add_course_id_to_users_table',3),(8,'2025_11_01_172659_update_role_enum_in_users_table',4),(9,'2025_11_14_015453_add_unique_constraint_to_courses_table',5),(10,'2025_11_16_223906_create_activities_table',6),(12,'2025_11_16_223907_create_activity_attempts_table',7),(13,'2025_12_02_045449_update_activity_type_enum_to_discover',7),(14,'2025_12_03_143819_create_student_activity_views_table',8);
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_reset_tokens`
--

DROP TABLE IF EXISTS `password_reset_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_reset_tokens`
--

LOCK TABLES `password_reset_tokens` WRITE;
/*!40000 ALTER TABLE `password_reset_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `password_reset_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sessions` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint unsigned DEFAULT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_activity` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sessions_user_id_index` (`user_id`),
  KEY `sessions_last_activity_index` (`last_activity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `student_activity_views`
--

DROP TABLE IF EXISTS `student_activity_views`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `student_activity_views` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `student_id` bigint unsigned NOT NULL,
  `activity_id` bigint unsigned NOT NULL,
  `activity_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `viewed_at` timestamp NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `student_activity_views_activity_id_foreign` (`activity_id`),
  KEY `student_activity_views_student_id_activity_type_index` (`student_id`,`activity_type`),
  KEY `student_activity_views_student_id_activity_id_index` (`student_id`,`activity_id`),
  CONSTRAINT `student_activity_views_activity_id_foreign` FOREIGN KEY (`activity_id`) REFERENCES `activities` (`id`) ON DELETE CASCADE,
  CONSTRAINT `student_activity_views_student_id_foreign` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=100 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `student_activity_views`
--

LOCK TABLES `student_activity_views` WRITE;
/*!40000 ALTER TABLE `student_activity_views` DISABLE KEYS */;
INSERT INTO `student_activity_views` VALUES (46,35,7,'discover','2025-12-05 14:58:58','2025-12-05 14:58:58','2025-12-05 14:58:58'),(48,35,8,'discover','2025-12-05 17:27:39','2025-12-05 17:27:39','2025-12-05 17:27:39'),(50,35,9,'discover','2025-12-05 17:29:48','2025-12-05 17:29:48','2025-12-05 17:29:48'),(51,35,14,'story_order','2025-12-05 17:29:48','2025-12-05 17:29:48','2025-12-05 17:29:48'),(58,27,7,'discover','2025-12-05 21:20:11','2025-12-05 21:20:11','2025-12-05 21:20:11'),(59,27,14,'story_order','2025-12-05 21:20:11','2025-12-05 21:20:11','2025-12-05 21:20:11'),(60,28,7,'discover','2025-12-05 21:39:24','2025-12-05 21:39:24','2025-12-05 21:39:24'),(61,28,14,'story_order','2025-12-05 21:39:24','2025-12-05 21:39:24','2025-12-05 21:39:24'),(62,27,8,'discover','2025-12-05 21:42:24','2025-12-05 21:42:24','2025-12-05 21:42:24'),(63,27,15,'story_order','2025-12-05 21:42:24','2025-12-05 21:42:24','2025-12-05 21:42:24'),(64,29,7,'discover','2025-12-05 21:43:33','2025-12-05 21:43:33','2025-12-05 21:43:33'),(65,29,14,'story_order','2025-12-05 21:43:33','2025-12-05 21:43:33','2025-12-05 21:43:33'),(66,29,8,'discover','2025-12-05 21:44:28','2025-12-05 21:44:28','2025-12-05 21:44:28'),(67,29,15,'story_order','2025-12-05 21:44:29','2025-12-05 21:44:29','2025-12-05 21:44:29'),(68,30,7,'discover','2025-12-05 21:45:07','2025-12-05 21:45:07','2025-12-05 21:45:07'),(69,30,14,'story_order','2025-12-05 21:45:07','2025-12-05 21:45:07','2025-12-05 21:45:07'),(70,30,8,'discover','2025-12-05 21:47:51','2025-12-05 21:47:51','2025-12-05 21:47:51'),(71,30,15,'story_order','2025-12-05 21:47:51','2025-12-05 21:47:51','2025-12-05 21:47:51'),(98,26,7,'discover','2025-12-12 22:11:07','2025-12-12 22:11:07','2025-12-12 22:11:07'),(99,26,14,'story_order','2025-12-12 22:11:07','2025-12-12 22:11:07','2025-12-12 22:11:07');
/*!40000 ALTER TABLE `student_activity_views` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('profesor','estudiante','admin') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'estudiante',
  `course_id` bigint unsigned DEFAULT NULL,
  `student_code` varchar(6) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`),
  UNIQUE KEY `users_student_code_unique` (`student_code`),
  KEY `users_course_id_foreign` (`course_id`),
  CONSTRAINT `users_course_id_foreign` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Silvia Moraga','smoraga@colegio.cl','profesor',NULL,NULL,NULL,'$2y$12$gxGm0ledLw2/5FEaVHXLmO51PrX2vnmHJysXA/.aSzSWUdwXr3yKC',NULL,'2025-10-31 04:58:30','2025-11-19 01:30:28'),(3,'Administrador','administrador@colegio.cl','admin',NULL,NULL,NULL,'$2y$12$Fnrm8S71yA6eoXTPA6XCmO5cnsrUVIh.iAa0S9u7ltazPRdN3lgNS',NULL,'2025-11-01 20:39:19','2025-11-01 20:39:19'),(7,'Marcelo Soto','msoto@colegio.cl','profesor',NULL,NULL,NULL,'$2y$12$87Df8Gygjut9QHWHh/jV6Oj086I71qUFLAZIsPC.h223cJcWLn.1C',NULL,'2025-11-11 01:26:23','2025-11-11 01:26:23'),(8,'Sandra Parra','sparra@colegio.cl','profesor',NULL,NULL,NULL,'$2y$12$rbuIQcrV3dnZOxG8W0ATK.iKmyxXg6htjFV5KoHCgZfgkoR9JuSGS',NULL,'2025-11-11 04:06:00','2025-11-11 04:06:00'),(9,'Mario Avila','mavila@colegio.cl','profesor',NULL,NULL,NULL,'$2y$12$VOIALZ5s3SpAcwX2n0D/d.DKD2xJl8SJSH2EmZyceJQHrDglG3LCe',NULL,'2025-11-11 05:03:52','2025-11-11 05:03:52'),(16,'Jenny Pantoja','jpantoja@colegio.cl','profesor',NULL,NULL,NULL,'$2y$12$fDFkNiIcomDhUm8/E7KbwuDgPkCbXPyXmO24xS3XpuiDizNj.6cxS',NULL,'2025-11-18 22:56:26','2025-11-18 22:56:26'),(18,'Raul Garrido','rgarrido@colegio.cl','profesor',11,NULL,NULL,'$2y$12$b4gbNWKpe9eUqRQDdDcgFOznYhKyObvNNmgGw4uVqx3dH/DfSv1uG',NULL,'2025-11-18 23:41:51','2025-11-18 23:41:51'),(20,'Gabriel Méndez','gmendez@colegio.cl','profesor',NULL,NULL,NULL,'$2y$12$dhjihbtYF1toRMlavoZ.M.hNceUZmUwpzHRT9BwAX1vaF.JqobEY6',NULL,'2025-12-01 23:22:49','2025-12-01 23:22:49'),(26,'Juan Rivas','juan.rivas@colegio.cl','estudiante',8,'B50F78',NULL,'$2y$12$tBHHz1Hd/uSNOGd1WJfH9uHb4PRI34idXIaujkY4aULydqYMFThxa',NULL,'2025-12-02 04:19:17','2025-12-02 04:19:17'),(27,'Lissette Galarce','lissette.galarce@colegio.cl','estudiante',8,'A85E5B',NULL,'$2y$12$K3hibXfV7k/0YI78ry7Pz.V/7W3uSwlMAFW5aEFz6fNHUBfCt3LuW',NULL,'2025-12-02 04:19:17','2025-12-02 04:19:17'),(28,'Carlos Troncoso','carlos.troncoso@colegio.cl','estudiante',8,'B6EA02',NULL,'$2y$12$SMJ1DuxUk3r.2JzvIuZyROsKjlVhYanB7oqao.pA6mgCozezIzj2i',NULL,'2025-12-02 04:19:18','2025-12-02 04:19:18'),(29,'Miriam Godoy','miriam.godoy@colegio.cl','estudiante',8,'4F8A3A',NULL,'$2y$12$P7nMW8jVAVEjEc3EQ4DfIeB2YDTUO8yAMQptcE6Qjk6sSP020APFG',NULL,'2025-12-02 04:19:19','2025-12-02 04:19:19'),(30,'Juan Pérez','juan.perez@colegio.cl','estudiante',8,'1C54E2',NULL,'$2y$12$4j2qOytNHRZxBkk7KLxej.fc0IzigRwAY.zp5yue8lbJJRgmdH2xG',NULL,'2025-12-02 04:34:55','2025-12-02 04:34:55'),(35,'Mario Peña','mario.pena@colegio.cl','estudiante',2,'D5C68A',NULL,'$2y$12$Mg3VZnIeU9uJdMI9EJzB1.X6Kb5rawxXD6EOmNMIRkCpPLFt37LGu',NULL,'2025-12-03 20:44:02','2025-12-03 20:44:02'),(36,'Danny Suarez','danny.suarez@colegio.cl','estudiante',8,'4A8B93',NULL,'$2y$12$8fRwsCjosvYdRXSpb.6tOuFqC52u21fAaj/.gXZSE7GyDedNlI0Xa',NULL,'2025-12-12 23:01:29','2025-12-12 23:01:29'),(37,'Javier Bastias','javier.bastias@colegio.cl','estudiante',8,'7FF031',NULL,'$2y$12$SRt0039U1pn493E2kcDLp.ICsBAGfIePI5aa7GBHGyx/N3jfoZZVS',NULL,'2025-12-12 23:01:30','2025-12-12 23:01:30'),(38,'Pablo Garrido','pablo.garrido@colegio.cl','estudiante',8,'377C82',NULL,'$2y$12$ZrzQYaW4CYLHdua0Bb0bLuJwcXUHGHOs9kMXgwqA7O4sU1DJbhyRy',NULL,'2025-12-12 23:01:31','2025-12-12 23:01:31');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-12-16 20:54:02
