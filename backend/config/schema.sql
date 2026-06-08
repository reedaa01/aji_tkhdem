-- ============================================================
-- Aji Tkhdem - Database Schema
-- ============================================================

CREATE DATABASE IF NOT EXISTS aji_tkhdem CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE aji_tkhdem;

-- ============================================================
-- USERS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  uuid       VARCHAR(36) NOT NULL UNIQUE,
  email      VARCHAR(255) NOT NULL UNIQUE,
  password   VARCHAR(255) NOT NULL,
  full_name  VARCHAR(150) NOT NULL,
  role       ENUM('user', 'admin') DEFAULT 'user',
  is_active  TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_uuid  (uuid)
) ENGINE=InnoDB;

-- ============================================================
-- PORTFOLIO PROFILES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS portfolios (
  id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id      INT UNSIGNED NOT NULL UNIQUE,
  headline     VARCHAR(255),
  bio          TEXT,
  phone        VARCHAR(30),
  location     VARCHAR(150),
  website      VARCHAR(255),
  github       VARCHAR(255),
  linkedin     VARCHAR(255),
  avatar_url   VARCHAR(500),
  cv_url       VARCHAR(500),
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================================
-- SKILLS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS skills (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id    INT UNSIGNED NOT NULL,
  name       VARCHAR(100) NOT NULL,
  level      ENUM('beginner', 'intermediate', 'advanced', 'expert') DEFAULT 'intermediate',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_skills (user_id)
) ENGINE=InnoDB;

-- ============================================================
-- EXPERIENCE TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS experience (
  id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id      INT UNSIGNED NOT NULL,
  company      VARCHAR(200) NOT NULL,
  position     VARCHAR(200) NOT NULL,
  description  TEXT,
  start_date   DATE NOT NULL,
  end_date     DATE,
  is_current   TINYINT(1) DEFAULT 0,
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_experience (user_id)
) ENGINE=InnoDB;

-- ============================================================
-- PROJECTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS projects (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id       INT UNSIGNED NOT NULL,
  title         VARCHAR(200) NOT NULL,
  description   TEXT,
  tech_stack    VARCHAR(500),
  project_url   VARCHAR(500),
  github_url    VARCHAR(500),
  image_url     VARCHAR(500),
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_projects (user_id)
) ENGINE=InnoDB;

-- ============================================================
-- JOB APPLICATIONS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS job_applications (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id         INT UNSIGNED NOT NULL,
  job_id          VARCHAR(100) NOT NULL,
  job_title       VARCHAR(255) NOT NULL,
  company_name    VARCHAR(255) NOT NULL,
  job_url         VARCHAR(500),
  location        VARCHAR(150),
  job_type        VARCHAR(50),
  status          ENUM('applied', 'interview', 'offer', 'rejected', 'withdrawn') DEFAULT 'applied',
  notes           TEXT,
  applied_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_application (user_id, job_id),
  INDEX idx_user_applications (user_id),
  INDEX idx_status (status)
) ENGINE=InnoDB;
