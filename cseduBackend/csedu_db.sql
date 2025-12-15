-- USERS TABLE
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL, -- 'student', 'faculty', 'admin'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- STUDENTS TABLEema
CREATE TABLE students (
    student_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    dob DATE NOT NULL,
    current_year INTEGER,
    program VARCHAR(100),
    profile_image VARCHAR(255),
    bio TEXT
);

-- FACULTY TABLE
CREATE TABLE faculty (
    faculty_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    title VARCHAR(100),
    department VARCHAR(100),
    profile_image VARCHAR(255),
    bio TEXT,
    phone VARCHAR(30),
    office_location VARCHAR(100)
);



-- COURSES TABLE
CREATE TABLE courses (
    id SERIAL PRIMARY KEY,
    code VARCHAR(20) UNIQUE NOT NULL,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    faculty_id INTEGER REFERENCES faculty(id)
);

-- ENROLLMENTS TABLE
CREATE TABLE enrollments (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES students(id),
    course_id INTEGER REFERENCES courses(id),
    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- PUBLICATIONS TABLE
CREATE TABLE publications (
    id SERIAL PRIMARY KEY,
    faculty_id INTEGER REFERENCES faculty(id),
    title VARCHAR(255) NOT NULL,
    journal VARCHAR(255),
    year INTEGER,
    link VARCHAR(255)
);

-- ANNOUNCEMENTS TABLE
CREATE TABLE announcements (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    created_by VARCHAR(50) NOT NULL, -- 'admin' or 'faculty'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- MESSAGES TABLE (optional)
CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    sender_id INTEGER REFERENCES users(id),
    receiver_id INTEGER REFERENCES users(id),
    content TEXT NOT NULL,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- ASSIGNMENTS TABLE
CREATE TABLE assignments (
    id SERIAL PRIMARY KEY,
    course_id VARCHAR(20) NOT NULL,
    course_name VARCHAR(100) NOT NULL,
    created_by VARCHAR(100) NOT NULL,
    year VARCHAR(4) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    due_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- STUDENT ASSIGNMENT SUBMISSIONS
CREATE TABLE assignment_submissions (
    id SERIAL PRIMARY KEY,
    assignment_id INTEGER REFERENCES assignments(id),
    student_id INTEGER REFERENCES students(id),
    submitted_at TIMESTAMP,
    file_url VARCHAR(255),
    grade VARCHAR(10),
    feedback TEXT
);

-- EXAM ROUTINE TABLE
CREATE TABLE exam_routines (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    course_id VARCHAR(20) NOT NULL,
    course_name VARCHAR(100) NOT NULL,
    exam_type VARCHAR(50),
    exam_date DATE,
    start_time TIME,
    end_time TIME,
    location VARCHAR(100),
    semester VARCHAR (20) NOT NULL,
    batch VARCHAR(20) NOT NULL
);


-- CLASS SCHEDULE TABLE
CREATE TABLE class_schedules(
         id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
          course_id VARCHAR(20) NOT NULL,
          course_name VARCHAR(100) NOT NULL,
          course_instructor VARCHAR(100) NOT NULL,
          semester VARCHAR(20) NOT NULL,
          batch VARCHAR(20) NOT NULL,
          name_of_day VARCHAR(20) NOT NULL,
          room VARCHAR(20) NOT NULL,
          start_time TIME NOT NULL
    );






CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    resource_type VARCHAR(50), -- 'lab', 'classroom', 'equipment'
    resource_name VARCHAR(100),
    booking_date DATE,
    start_time TIME,
    end_time TIME,
    purpose TEXT,
    participants INT,
    contact_info VARCHAR(100),
    status VARCHAR(20) DEFAULT 'pending' -- 'pending', 'approved', 'rejected'
);



-- ADMISSION APPLICATIONS TABLE
CREATE TABLE admission_applications (
    id SERIAL PRIMARY KEY,
    applicant_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(30),
    dob DATE NOT NULL,
    program_applied VARCHAR(100) NOT NULL,
    academic_background TEXT,
    statement_of_purpose TEXT,
    application_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(30) DEFAULT 'pending' -- 'pending', 'reviewed', 'accepted', 'rejected'
);

-- ADMISSION DOCUMENTS TABLE (for uploading certificates, transcripts, etc.)
CREATE TABLE admission_documents (
    id SERIAL PRIMARY KEY,
    application_id INTEGER REFERENCES admission_applications(id),
    document_type VARCHAR(50), -- 'transcript', 'certificate', etc.
    file_url VARCHAR(255),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ADMISSION REVIEWS TABLE (for faculty/admin to review applications)
CREATE TABLE admission_reviews (
    id SERIAL PRIMARY KEY,
    application_id INTEGER REFERENCES admission_applications(id),
    reviewer_id INTEGER REFERENCES users(id),
    review_comment TEXT,
    reviewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    decision VARCHAR(30) -- 'accepted', 'rejected', 'waitlisted'
);

-- some sample data
-- Make sure to hash passwords before inserting them in a real application



-- USERS
INSERT INTO users (username, email, password_hash, role) VALUES
('student1', 'student1@csedu.du.ac.bd', 'hashedpassword1', 'student'),
('student2', 'student2@csedu.du.ac.bd', 'hashedpassword2', 'student'),
('faculty1', 'faculty1@csedu.du.ac.bd', 'hashedpassword3', 'faculty'),
('admin1', 'admin@csedu.du.ac.bd', 'hashedpassword4', 'admin');

-- STUDENTS
INSERT INTO students (id, name, student_id, dob, current_year, program, profile_image, bio) VALUES
(1, 'Alice Rahman', '2023-10001', '2002-01-15', 2, 'B.Sc. in CSE', NULL, 'Enthusiastic about AI and robotics.'),
(2, 'Bob Hasan', '2023-10002', '2001-11-20', 3, 'B.Sc. in CSE', NULL, 'Loves programming contests.');

-- FACULTY
INSERT INTO faculty (id, name, faculty_id, title, department, profile_image, bio, phone, office_location) VALUES
(3, 'Dr. Jane Doe', 'F-001', 'Associate Professor', 'CSE', NULL, 'Researcher in AI and ML.', '+880123456789', 'Room 101, Science Complex');

-- COURSES
INSERT INTO courses (code, title, description, faculty_id) VALUES
('CSE101', 'Introduction to Programming', 'Learn programming basics.', 3),
('CSE202', 'Data Structures', 'Study of data structures.', 3);

-- ENROLLMENTS
INSERT INTO enrollments (student_id, course_id) VALUES
(1, 1),
(2, 1),
(1, 2);

-- PUBLICATIONS
INSERT INTO publications (faculty_id, title, journal, year, link) VALUES
(3, 'Advances in AI', 'Journal of AI Research', 2024, 'https://example.com/ai'),
(3, 'Machine Learning Trends', 'ML Journal', 2023, 'https://example.com/ml');

-- ANNOUNCEMENTS
INSERT INTO announcements (title, content, created_by) VALUES
('Welcome to CSEDU!', 'Semester starts on August 1.', 4),
('Exam Schedule', 'Midterm exams will be held in October.', 3);

-- ASSIGNMENTS
INSERT INTO assignments (course_id, title, description, due_date) VALUES
(1, 'Assignment 1', 'Solve basic programming problems.', '2024-08-15'),
(2, 'Assignment 2', 'Implement linked lists.', '2024-08-20');

-- ASSIGNMENT SUBMISSIONS
INSERT INTO assignment_submissions (assignment_id, student_id, submitted_at, file_url, grade, feedback) VALUES
(1, 1, '2024-08-14 10:00:00', 'http://example.com/sub1.pdf', 'A', 'Good job!'),
(2, 1, '2024-08-19 09:00:00', 'http://example.com/sub2.pdf', 'B+', 'Well done.');

-- EXAM ROUTINES
INSERT INTO exam_routines (course_id, exam_type, exam_date, start_time, end_time, location) VALUES
(1, 'Midterm', '2024-10-10', '10:00', '12:00', 'Room 201'),
(2, 'Final', '2024-12-15', '14:00', '17:00', 'Room 202');

-- CLASS SCHEDULES
INSERT INTO class_schedules (course_id, day_of_week, start_time, end_time, room) VALUES
(1, 'Sunday', '09:00', '10:30', 'Lab 1'),
(2, 'Tuesday', '11:00', '12:30', 'Lab 2');

-- BOOKINGS
INSERT INTO bookings (user_id, resource_type, resource_name, booking_date, start_time, end_time, purpose, status) VALUES
(1, 'lab', 'Lab 1', '2024-08-25', '10:00', '12:00', 'Project work', 'approved'),
(3, 'equipment', 'Projector', '2024-08-26', '14:00', '16:00', 'Lecture', 'pending');







----------------------sakib----------------------


CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    resource_type VARCHAR(50), -- 'lab', 'classroom', 'equipment'
    resource_name VARCHAR(100),
    booking_date DATE,
    start_time TIME,
    end_time TIME,
    purpose TEXT,
    participants INT,
    contact_info VARCHAR(100),
    status VARCHAR(20) DEFAULT 'pending' -- 'pending', 'approved', 'rejected'
);




CREATE TABLE equipment (
    id INT AUTO_INCREMENT PRIMARY KEY,
    resource_type VARCHAR(50),
    resource_name VARCHAR(100),
    start_time TIME,
    end_time TIME,
    description TEXT,
    image VARCHAR(255)
);








-------------images

-- CREATE TABLE images (
--     id INT AUTO_INCREMENT PRIMARY KEY,
--     image VARCHAR(200) NOT NULL
-- );



CREATE TABLE pimages (
    email VARCHAR(100) UNIQUE NOT NULL,
    image VARCHAR(200) NOT NULL
);



CREATE TABLE eimages (
    id INT PRIMARY KEY,
    image VARCHAR(200) NOT NULL
);
------------projects
CREATE TABLE projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_name VARCHAR(100) NOT NULL,
    supervisor_name VARCHAR(100) NOT NULL,
    project_title VARCHAR(200) NOT NULL,
    project_abstract TEXT NOT NULL,
    demo_link VARCHAR(300),
    date DATE NOT NULL,
    type_or_field VARCHAR(100) NOT NULL
);



----------farhan ---------------

CREATE TABLE degree (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE course (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(20) NOT NULL,
    title VARCHAR(255) NOT NULL,
    instructor VARCHAR(100),
    semester VARCHAR(20),
    degree_id INT,
    level ENUM('undergraduate', 'graduate') NOT NULL,
    description TEXT,
    FOREIGN KEY (degree_id) REFERENCES degree(id)
);







-- rhituraj 


-- Admin‐created fee rules
CREATE TABLE IF NOT EXISTS fee_structures (
  id        INT AUTO_INCREMENT PRIMARY KEY,a
  year      INT        NOT NULL,
  fee_type  VARCHAR(50) NOT NULL,
  deadline  DATE       NOT NULL,
  amount    DECIMAL(10,2) NOT NULL
);

-- Student payments
CREATE TABLE IF NOT EXISTS payments (
  id                INT AUTO_INCREMENT PRIMARY KEY,
  fee_structure_id  INT NOT NULL
                       REFERENCES fee_structures(id)
                       ON DELETE CASCADE,
  student_id        INT NOT NULL
                       REFERENCES students(id)
                       ON DELETE CASCADE,
  amount_paid       DECIMAL(10,2) NOT NULL,
  payment_date      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



CREATE TABLE admin (
  admin_id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  dob DATE DEFAULT NULL,
  email VARCHAR(100) UNIQUE DEFAULT NULL,
  phone VARCHAR(20) DEFAULT NULL,
  username VARCHAR(50) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  address TEXT DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (admin_id)
);





CREATE TABLE degree (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE course (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(20) NOT NULL,
    title VARCHAR(255) NOT NULL,
    instructor VARCHAR(100),
    semester VARCHAR(20),
    degree_id INT,
    level ENUM('undergraduate', 'graduate') NOT NULL,
    description TEXT,
    FOREIGN KEY (degree_id) REFERENCES degree(id)
);





------------------------


CREATE TABLE faculty_ratings (
  id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  student_id      BIGINT UNSIGNED NOT NULL,
  faculty_email   VARCHAR(100)    NOT NULL,
  rating          TINYINT         NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment         TEXT,
  created_at      TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id)
    REFERENCES students(student_id)
    ON DELETE CASCADE,
  FOREIGN KEY (faculty_email)
    REFERENCES faculty(email)
    ON DELETE CASCADE
) ENGINE=InnoDB;





CREATE TABLE events(
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    event_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    location VARCHAR(100),
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);