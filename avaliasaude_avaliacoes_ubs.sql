-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: localhost    Database: avaliasaude
-- ------------------------------------------------------
-- Server version	8.0.40

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `avaliacoes_ubs`
--

DROP TABLE IF EXISTS `avaliacoes_ubs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `avaliacoes_ubs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `ubs_id` int DEFAULT NULL,
  `ubs_nome` varchar(60) DEFAULT NULL,
  `usuario_id` int DEFAULT NULL,
  `usuario_nome` varchar(60) DEFAULT NULL,
  `nota` int DEFAULT NULL,
  `comentario` varchar(300) DEFAULT NULL,
  `data_avaliacao` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `ativo` tinyint DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `ubs_id` (`ubs_id`),
  KEY `usuario_id` (`usuario_id`),
  CONSTRAINT `avaliacoes_ubs_ibfk_1` FOREIGN KEY (`ubs_id`) REFERENCES `ubs` (`id`),
  CONSTRAINT `avaliacoes_ubs_ibfk_2` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `avaliacoes_ubs`
--

LOCK TABLES `avaliacoes_ubs` WRITE;
/*!40000 ALTER TABLE `avaliacoes_ubs` DISABLE KEYS */;
INSERT INTO `avaliacoes_ubs` VALUES (1,1,'UBS Vila Rio de Janeiro',4,'Edivaldo Silvestre de Oliveira',4,'Atendimento de qualidade, embora as filas sejam grandes na maioria das vezes...','2024-11-24 19:08:37',1),(2,1,'UBS Vila Rio de Janeiro',1,'Erik Eduardo Santos de Oliveira',5,'Quando precisei de agendar uma consulta consegui rapidamente indo a UBS!','2024-11-24 19:10:08',1),(3,4,'UBS Uirapuru',1,'Erik Eduardo Santos de Oliveira',2,'Atendimento ruim, muito demorado...','2024-11-24 19:51:43',1),(4,3,'UBS Jardim Cumbica I',1,'Erik Eduardo Santos de Oliveira',1,'Ambiente desorganizado e sem acessibilidade.','2024-11-24 19:52:14',1);
/*!40000 ALTER TABLE `avaliacoes_ubs` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-11-24 16:58:22
