-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: ponte_para_o_futuro_copia
-- ------------------------------------------------------
-- Server version	8.0.42

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
-- Table structure for table `alunos_projetos`
--

DROP TABLE IF EXISTS `alunos_projetos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `alunos_projetos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `aluno_id` int NOT NULL,
  `projeto_id` int NOT NULL,
  `status` enum('solicitado','aprovado','negado') DEFAULT 'solicitado',
  `mensagem_resposta` text,
  `data_solicitacao` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `aluno_id` (`aluno_id`),
  KEY `projeto_id` (`projeto_id`),
  CONSTRAINT `alunos_projetos_ibfk_1` FOREIGN KEY (`aluno_id`) REFERENCES `usuarios` (`id`),
  CONSTRAINT `alunos_projetos_ibfk_2` FOREIGN KEY (`projeto_id`) REFERENCES `projetos` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `alunos_projetos`
--

LOCK TABLES `alunos_projetos` WRITE;
/*!40000 ALTER TABLE `alunos_projetos` DISABLE KEYS */;
INSERT INTO `alunos_projetos` VALUES (1,11,9,'aprovado','Parabéns! Sua solicitação foi aprovada.','2025-05-29 00:24:33'),(2,11,8,'aprovado','Sua solicitação foi aprovada!','2025-05-29 01:38:12'),(5,11,7,'aprovado','Sua solicitação foi aprovada, Parabéns!','2025-05-31 19:19:51'),(6,11,6,'negado','Sua solicitação foi negada, você já tem vinculo com 3 projetos','2025-05-31 19:56:51'),(7,11,10,'aprovado','Aprovado!','2025-06-03 00:26:06'),(8,11,3,'solicitado',NULL,'2025-10-17 22:23:31');
/*!40000 ALTER TABLE `alunos_projetos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `candidaturas`
--

DROP TABLE IF EXISTS `candidaturas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `candidaturas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_projeto` int DEFAULT NULL,
  `id_aluno` int DEFAULT NULL,
  `status_candidatura` enum('pendente','aprovado','reprovado') DEFAULT 'pendente',
  `data_inscricao` date NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id_projeto` (`id_projeto`),
  KEY `id_aluno` (`id_aluno`),
  CONSTRAINT `candidaturas_ibfk_1` FOREIGN KEY (`id_projeto`) REFERENCES `projetos` (`id`),
  CONSTRAINT `candidaturas_ibfk_2` FOREIGN KEY (`id_aluno`) REFERENCES `usuarios` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `candidaturas`
--

LOCK TABLES `candidaturas` WRITE;
/*!40000 ALTER TABLE `candidaturas` DISABLE KEYS */;
/*!40000 ALTER TABLE `candidaturas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `certificados`
--

DROP TABLE IF EXISTS `certificados`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `certificados` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_aluno` int DEFAULT NULL,
  `id_projeto` int DEFAULT NULL,
  `data_emissao` date NOT NULL,
  `qr_code` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_aluno` (`id_aluno`),
  KEY `id_projeto` (`id_projeto`),
  CONSTRAINT `certificados_ibfk_1` FOREIGN KEY (`id_aluno`) REFERENCES `usuarios` (`id`),
  CONSTRAINT `certificados_ibfk_2` FOREIGN KEY (`id_projeto`) REFERENCES `projetos` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `certificados`
--

LOCK TABLES `certificados` WRITE;
/*!40000 ALTER TABLE `certificados` DISABLE KEYS */;
/*!40000 ALTER TABLE `certificados` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `desempenho`
--

DROP TABLE IF EXISTS `desempenho`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `desempenho` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_aluno` int DEFAULT NULL,
  `id_projeto` int DEFAULT NULL,
  `notas` decimal(5,2) DEFAULT NULL,
  `observações` text,
  PRIMARY KEY (`id`),
  KEY `id_aluno` (`id_aluno`),
  KEY `id_projeto` (`id_projeto`),
  CONSTRAINT `desempenho_ibfk_1` FOREIGN KEY (`id_aluno`) REFERENCES `usuarios` (`id`),
  CONSTRAINT `desempenho_ibfk_2` FOREIGN KEY (`id_projeto`) REFERENCES `projetos` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `desempenho`
--

LOCK TABLES `desempenho` WRITE;
/*!40000 ALTER TABLE `desempenho` DISABLE KEYS */;
/*!40000 ALTER TABLE `desempenho` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mentorias`
--

DROP TABLE IF EXISTS `mentorias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mentorias` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_aluno` int DEFAULT NULL,
  `id_mentor` int DEFAULT NULL,
  `id_projeto` int DEFAULT NULL,
  `feedback` text,
  PRIMARY KEY (`id`),
  KEY `id_aluno` (`id_aluno`),
  KEY `id_mentor` (`id_mentor`),
  KEY `id_projeto` (`id_projeto`),
  CONSTRAINT `mentorias_ibfk_1` FOREIGN KEY (`id_aluno`) REFERENCES `usuarios` (`id`),
  CONSTRAINT `mentorias_ibfk_2` FOREIGN KEY (`id_mentor`) REFERENCES `usuarios` (`id`),
  CONSTRAINT `mentorias_ibfk_3` FOREIGN KEY (`id_projeto`) REFERENCES `projetos` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mentorias`
--

LOCK TABLES `mentorias` WRITE;
/*!40000 ALTER TABLE `mentorias` DISABLE KEYS */;
/*!40000 ALTER TABLE `mentorias` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `participacoes`
--

DROP TABLE IF EXISTS `participacoes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `participacoes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int DEFAULT NULL,
  `id_projeto` int DEFAULT NULL,
  `status_participacao` enum('inscrito','em andamento','concluido') NOT NULL,
  `data_inicio` date DEFAULT NULL,
  `data_conclusao` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_usuario` (`id_usuario`),
  KEY `id_projeto` (`id_projeto`),
  CONSTRAINT `participacoes_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id`),
  CONSTRAINT `participacoes_ibfk_2` FOREIGN KEY (`id_projeto`) REFERENCES `projetos` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `participacoes`
--

LOCK TABLES `participacoes` WRITE;
/*!40000 ALTER TABLE `participacoes` DISABLE KEYS */;
/*!40000 ALTER TABLE `participacoes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `perfis`
--

DROP TABLE IF EXISTS `perfis`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `perfis` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int DEFAULT NULL,
  `idade` int DEFAULT NULL,
  `formacao` varchar(100) DEFAULT NULL,
  `descricao` text,
  `foto_perfil` varchar(255) DEFAULT NULL,
  `instituicao` varchar(100) DEFAULT NULL,
  `empresa` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `usuario_id` (`usuario_id`),
  CONSTRAINT `perfis_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `perfis`
--

LOCK TABLES `perfis` WRITE;
/*!40000 ALTER TABLE `perfis` DISABLE KEYS */;
INSERT INTO `perfis` VALUES (1,21,41,'Administração','teste','1748861791105.jpg','UNIBRA',NULL);
/*!40000 ALTER TABLE `perfis` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `projetos`
--

DROP TABLE IF EXISTS `projetos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `projetos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `titulo` varchar(255) DEFAULT NULL,
  `descricao` text,
  `status` enum('pendente','em andamento','concluído') NOT NULL,
  `data_inicio` date NOT NULL,
  `data_termino` date NOT NULL,
  `id_universidade` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `projetos`
--

LOCK TABLES `projetos` WRITE;
/*!40000 ALTER TABLE `projetos` DISABLE KEYS */;
INSERT INTO `projetos` VALUES (3,'Projeto IA','Projeto sobre inteligência artificial','em andamento','2025-06-25','2025-09-30',13),(5,'SIGED','teste','em andamento','2025-06-25','2025-09-30',17),(6,'Teste','teste','em andamento','1111-11-11','2222-02-11',17),(7,'Teste','teste','em andamento','2212-02-12','2213-03-13',17),(8,'Teste12','tete12','em andamento','2025-05-20','2025-07-20',17),(9,'Projeto segunda','desenvolver uma tela de login de usuario','em andamento','2025-05-20','2025-06-20',17),(10,'Agenda Digital','Aplicativo web simples que permite ao usuário cadastrar, visualizar, editar e excluir compromissos do dia a dia. O sistema deve contar com uma interface intuitiva onde é possível adicionar eventos com data, hora e descrição, ajudando na organização pessoal.','em andamento','2025-07-01','2025-08-01',21),(13,'Calculadora','teste','em andamento','2025-11-20','2025-12-20',30),(14,'Calculadora','teste','em andamento','2025-11-20','2025-12-20',30),(15,'Painel banco','teste','em andamento','2025-11-20','2025-12-31',30),(16,'Painel banco','teste','em andamento','2025-11-20','2025-12-31',30);
/*!40000 ALTER TABLE `projetos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `universidades`
--

DROP TABLE IF EXISTS `universidades`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `universidades` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `senha` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `universidades`
--

LOCK TABLES `universidades` WRITE;
/*!40000 ALTER TABLE `universidades` DISABLE KEYS */;
/*!40000 ALTER TABLE `universidades` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `senha` varchar(255) DEFAULT NULL,
  `tipo` enum('aluno','mentor','instituicao') DEFAULT NULL,
  `status` enum('ativo','inativo') DEFAULT 'ativo',
  `id_universidade` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `id_universidade` (`id_universidade`),
  CONSTRAINT `usuarios_ibfk_1` FOREIGN KEY (`id_universidade`) REFERENCES `universidades` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (11,'Teste','teste@exemplo.com','$2b$10$Wrnb8/dt3f/0D9uPGiF9y.gKlHlWjuPFdJ3kvrZCVPQKbpg9GFZYe','aluno','ativo',NULL),(14,'Maria Soares de Carvalho','maria.soares2@example.com','$2b$10$cfNpDsad/mjvnDpyWZ3ldOM.5jXuVFq2qJ2m1BG8gBKFEUDr5kozS','aluno','ativo',NULL),(15,'Bruno Souza','brunosouza2@exemplo.com','$2b$10$9CgipyWlSLpcBTUAX7DuQePGaM6xVG.iTMFb741lzXo4C8zkjSDFK','mentor','ativo',NULL),(16,'Teste2','teste2@exemplo.com','$2b$10$tHl6Q2qHDQOfspIhrxYiqu21FpB19KwYYmOOK5dE8RLkYlKsCWziK','aluno','ativo',NULL),(17,'Uninassau','joana.costa@sempreuninassau.com.br','$2b$10$AKIno1MRTMxNWJpJdvoiPu6qMfjeN.konCwBO1.MrGGewST9BZ7Wi','instituicao','ativo',NULL),(18,'UNIBRA','eduardoguilherme@unibra.com','$2b$10$4AUSrarAILYYXr7Id8RM6.XZbCQERLivE2olJ3PWcledgF.j5O/6y','instituicao','ativo',NULL),(19,'Teste3','teste3@exemplo.com','$2b$10$Yj3tRCREgzog/EiOMtTw/ODJWcm5s.nbJEylSZCAViRlp/0TEeVeC','aluno','ativo',NULL),(20,'Andre','andre@exemplo.com','$2b$10$F4SIvpEBixuK9AkSnBSqnOJJNTKJPKsHPxPPeol.Ou1JsA/veuT6m','aluno','ativo',NULL),(21,'Fernanda','fernanda.ramos@unibra.com','$2b$10$zHktgOP3fT.rtIg7ae4u3uGdz7AgqfHsdjMQX3B9vUaAEoNIYWYb.','instituicao','ativo',NULL),(22,'maria christina','mariachristina@gmail.com','$2b$10$fpPXeGWWpv.CqN4sMYZaqeBevhZiiu17oTM0HgOIbbOD7LVFkev5y','aluno','ativo',NULL),(27,'Amanda','amanda@teste.com',NULL,'aluno','ativo',NULL),(29,'Amanda','amanda2@teste.com',NULL,'aluno','ativo',NULL),(30,'Amanda Teste','amandateste@teste.com',NULL,'instituicao','ativo',NULL);
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-20 22:25:48
