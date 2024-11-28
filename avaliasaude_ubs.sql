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
-- Table structure for table `ubs`
--

DROP TABLE IF EXISTS `ubs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ubs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(50) NOT NULL,
  `latitude` double NOT NULL,
  `longitude` double NOT NULL,
  `logradouro` varchar(150) NOT NULL,
  `numero` varchar(20) NOT NULL DEFAULT 'S/N',
  `bairro` varchar(30) NOT NULL,
  `cidade` varchar(30) NOT NULL,
  `estado` char(2) NOT NULL,
  `cep` varchar(10) NOT NULL,
  `ativo` tinyint NOT NULL DEFAULT '1',
  `imagem` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_lat_lng` (`latitude`,`longitude`),
  UNIQUE KEY `unique_address` (`cep`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ubs`
--

LOCK TABLES `ubs` WRITE;
/*!40000 ALTER TABLE `ubs` DISABLE KEYS */;
INSERT INTO `ubs` VALUES (1,'UBS Vila Rio de Janeiro',-23.4405568,-46.5365799,'Rua Lions','S/N','Vila Rio de Janeiro','Guarulhos','SP','07124090',1,NULL),(2,'UBS Parque Alvorada',-23.44013,-46.42251,'Avenida Santana do Mundau','800','Cidade Parque Alvorada','Guarulhos','SP','07242190',1,NULL),(3,'UBS Jardim Cumbica I',-23.45285,-46.43647,'Avenida Venturosa','240','Jardim Cumbica','Guarulhos','SP','07240000',1,NULL),(4,'UBS Uirapuru',-23.45367,-46.45273,'Estrada Velha Guarulhos Sao Miguel','992','Jardim Santa Helena','Guarulhos','SP','07230000',1,NULL),(5,'UBS Jurema',-23.44322,-46.41461,'Rua Primeira Cruz','104','Parque das Nacoes','Guarulhos','SP','07243200',1,NULL),(6,'UBS Nova Cidade',-23.44457,-46.4074,'Rua Angelo Roberto Orsomarso','146','Jardim Nova Cidade','Guarulhos','SP','07252330',1,NULL),(7,'UBS Parque Rodrigo Barreto',-23.38542,-46.3321,'Rua Pedro Saverino Martins','231','Parque Rodrigo Barreto','Aruja','SP','07400770',1,NULL),(8,'UBS Jardim Paulistano',-23.46137,-46.70911,'Rua Encruzilhada do Sul','946','Jardim Paulistano','Sao Paulo','SP','02816010',1,NULL),(9,'UBS Se',-23.55083,-46.6282,'Rua Frederico Alvarenga','259','Se','Sao Paulo','SP','01020030',1,NULL),(10,'UBS Vila Prudente',-23.58133,-46.5825,'Praca do Centenario de Vila Prudente','108','Vila Prudente','Sao Paulo','SP','03132050',1,NULL);
/*!40000 ALTER TABLE `ubs` ENABLE KEYS */;
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
