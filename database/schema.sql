-- ====================================================================
-- PHASE 1: INDEPENDENT DATA DICTIONARY & AUTHENTICATION TABLES
-- ====================================================================

-- 1. Base Multi-Role User Authentication Table
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    user_role VARCHAR(20) CHECK (user_role IN ('APPLICANT', 'CORPORATE', 'ADMIN')) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ====================================================================
-- PHASE 2: STUDENT PROFILE, VERIFICATION, & ELIGIBILITY METRICS
-- ====================================================================

-- 2. Core Applicant Records (Matches requirements for PM Scheme eligibility filtering)
CREATE TABLE applicants (
    applicant_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    date_of_birth DATE NOT NULL, -- Critically required for enforcing the official 21-24 age criteria
    gender VARCHAR(15) CHECK (gender IN ('MALE', 'FEMALE', 'OTHER')),
    highest_qualification VARCHAR(50) CHECK (
        highest_qualification IN ('SSC', 'HSC', 'ITI', 'DIPLOMA', 'UNDERGRADUATE', 'POSTGRADUATE')
    ) NOT NULL,
    course_specialization VARCHAR(100), -- E.g., 'B.Tech Computer Science', 'ITI Fitter'
    instituion_name VARCHAR(150),
    graduation_year INT,
    academic_cgpa_or_pct NUMERIC(5,2) NOT NULL,
    skills_inventory TEXT[] NOT NULL, -- Array configuration for fast NLP vector checks
    preferred_locations TEXT[] NOT NULL, -- User priority location preferences
    annual_family_income NUMERIC(12,2) NOT NULL, -- Evaluates priority assignment criteria (= 0),
    stipend_amount NUMERIC(10,2) DEFAULT 5000.00, -- Default base monthly financial support allocation
    post_status VARCHAR(20) CHECK (post_status IN ('OPEN', 'SUSPENDED', 'CLOSED')) DEFAULT 'OPEN',
    published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ====================================================================
-- PHASE 3: CORPORATE PROFILES & INTERNSHIP SLOTS (ADDED FOR REFERENCE)
-- ====================================================================

-- 3. Corporate Partner Profiles
CREATE TABLE companies (
    company_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    company_name VARCHAR(150) NOT NULL,
    industry_sector VARCHAR(100),
    location_address TEXT,
    latitude NUMERIC(9,6),
    longitude NUMERIC(9,6),
    contact_person VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Corporate Internship Slots
CREATE TABLE internships (
    internship_id SERIAL PRIMARY KEY,
    company_id INT REFERENCES companies(company_id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    mandatory_skills TEXT[] NOT NULL,
    total_vacancies INT NOT NULL,
    sc_quota INT DEFAULT 0,
    st_quota INT DEFAULT 0,
    obc_quota INT DEFAULT 0,
    ews_quota INT DEFAULT 0,
    gen_quota INT DEFAULT 0,
    stipend_amount NUMERIC(10,2) DEFAULT 5000.00,
    internship_duration VARCHAR(50),
    location_address TEXT,
    latitude NUMERIC(9,6),
    longitude NUMERIC(9,6),
    post_status VARCHAR(20) CHECK (post_status IN ('OPEN', 'SUSPENDED', 'CLOSED')) DEFAULT 'OPEN',
    published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ====================================================================
-- PHASE 4: THE SIH INNER CORE: ALLOCATION MATCH ENGINE LOGS
-- ====================================================================

-- 6. Central AI Engine Distribution Logs (Enforces transparent selection tracking)
CREATE TABLE allocations (
    allocation_id SERIAL PRIMARY KEY,
    applicant_id INT REFERENCES applicants(applicant_id) ON DELETE CASCADE,
    internship_id INT REFERENCES internships(internship_id) ON DELETE CASCADE,
    
    -- Sub-matrix fields tracking "Explainable AI Match Metrics" for your dashboard analytics
    skill_matching_ratio NUMERIC(5,2) NOT NULL,
    location_proximity_ratio NUMERIC(5,2) NOT NULL,
    academic_weightage_ratio NUMERIC(5,2) NOT NULL,
    consolidated_match_score NUMERIC(5,2) NOT NULL, -- Final aggregated composite rank evaluation
    
    distribution_round INT DEFAULT 1,
    allocation_state VARCHAR(25) CHECK (
        allocation_state IN ('PROPOSED_BY_ENGINE', 'OFFERED', 'ACCEPTED_BY_CANDIDATE', 'REJECTED_BY_CANDIDATE', 'EXPIRED_TIMEOUT')
    ) DEFAULT 'PROPOSED_BY_ENGINE',
    processed_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Safety validation lock: Stops system from accidentally giving a student duplicate active openings in the same round
    CONSTRAINT unique_active_assignment_per_round UNIQUE (applicant_id, distribution_round)
);

-- ====================================================================
-- PHASE 5: ENTERPRISE PERFORMANCE BOOST INDEXES
-- ====================================================================

-- Drastically limits background processing lookup times when computing heavy algorithmic matching matrix tasks
CREATE INDEX idx_applicant_skills_gin ON applicants USING gin(skills_inventory);
CREATE INDEX idx_internship_skills_gin ON internships USING gin(mandatory_skills);
CREATE INDEX idx_allocation_ranking_score ON allocations(consolidated_match_score DESC);
